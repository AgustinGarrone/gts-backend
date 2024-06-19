import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  CreateUserDTO,
  LoginResponse,
  LoginUserDTO,
} from "./dto/create-auth.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() userObject: CreateUserDTO): Promise<LoginResponse> {
    return this.authService.register(userObject);
  }

  @Post("login")
  loginUser(@Body() userData: LoginUserDTO): Promise<LoginResponse> {
    return this.authService.login(userData);
  }
}
