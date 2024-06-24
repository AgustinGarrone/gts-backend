import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
} from "@nestjs/common";
import {
  CreateUserDTO,
  LoginResponse,
  LoginUserDTO,
} from "./dto/create-auth.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Op } from "sequelize";
import { User } from "src/models/user.model";
import { NotificationService } from "src/notification/notification.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject("USER_REPOSITORY")
    private readonly userRepository: typeof User,
    private readonly jwtAuthService: JwtService,
    private readonly notificationService: NotificationService,
  ) {}

  async register(userObject: CreateUserDTO): Promise<LoginResponse> {
    const { password, username, email } = userObject;

    const userDataExists = await this.userRepository.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });

    if (userDataExists) {
      throw new ConflictException("Username or email already registered");
    }

    const saltRounds = 10;
    const plainToHash = await bcrypt.hash(password, saltRounds);
    userObject = { ...userObject, password: plainToHash };

    const user = await this.userRepository.create(userObject);

    const payload = { id: user.id, username: user.username };
    const token = this.jwtAuthService.sign(payload);

    const responseData: LoginResponse = {
      username: user.username,
      email: user.email,
      token,
    };

    await this.notificationService.createNotification(
      user.id,
      "Bienvenido a GTS Pokémon. Aquí podrás intercambiar tus pokémons con otros entrenadores. Buena suerte!",
    );

    return responseData;
  }

  async findByPk(pk: number) {
    try {
      return await this.userRepository.findByPk(pk);
    } catch (error) {
      console.log(error);
    }
  }

  async login(userData: LoginUserDTO): Promise<LoginResponse> {
    const { email, password } = userData;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new HttpException("USER_NOT_FOUND", 404);

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) throw new HttpException("PASSWORD_INCORRECT", 403);

    const payload = {
      id: user.id,
      name: user.username,
      initialPokemons: user.initialPokemons,
    };
    const token = this.jwtAuthService.sign(payload);

    const data: LoginResponse = {
      email: user.email,
      username: user.username,
      token,
    };

    return data;
  }

  async setInitialPokemons(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new HttpException("USER_NOT_FOUND", 404);

    await this.userRepository.update(
      {
        initialPokemons: true,
      },
      {
        where: {
          id: userId,
        },
      },
    );

    return true;
  }
}
