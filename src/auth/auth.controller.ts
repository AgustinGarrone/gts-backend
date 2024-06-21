import { Controller, Post, Body, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  CreateUserDTO,
  LoginResponse,
  LoginUserDTO,
} from "./dto/create-auth.dto";
import { ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "src/constants/types";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() userObject: CreateUserDTO,
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await this.authService.register(userObject);
      return {
        statusCode: HttpStatus.CREATED,
        message: "Usuario registrado correctamente",
        data: response,
      };
    } catch (error) {
      console.log(`Error register: ${error}`);
      throw error;
    }
  }

  @Post("login")
  async loginUser(
    @Body() userData: LoginUserDTO,
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      const data = await this.authService.login(userData);
      return {
        statusCode: HttpStatus.OK,
        message: "Operación realizada con éxito",
        data: data,
      };
    } catch (error) {
      console.log(`Error login: ${error}`);
      throw error;
    }
  }
}
