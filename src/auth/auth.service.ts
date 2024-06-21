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

@Injectable()
export class AuthService {
  constructor(
    @Inject("USER_REPOSITORY")
    private userRepository: typeof User,
    private jwtAuthService: JwtService,
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

    return responseData;
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

    const payload = { id: user.id, name: user.username };
    const token = this.jwtAuthService.sign(payload);

    const data: LoginResponse = {
      email: user.email,
      username: user.username,
      token,
    };

    return data;
  }
}
