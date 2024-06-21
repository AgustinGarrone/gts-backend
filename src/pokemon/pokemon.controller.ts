import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { ApiResponse } from "src/constants/types";
import { Pokemon } from "src/models/pokemon.model";
import { GetUserFromJwt } from "src/helpers/getUser.helper";

@ApiTags("Pokemon")
@ApiBearerAuth()
@Controller("pokemon")
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":userId")
  async findAll(
    @Param("userId") userId: number,
    @GetUserFromJwt() user: any,
  ): Promise<ApiResponse<Pokemon[]>> {
    // Verifica si el usuario autenticado tiene permisos para acceder a userId
    if (user.userId !== userId) {
      throw new HttpException(
        "No tienes permisos para acceder a este recurso",
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const pokemons = await this.pokemonService.findAll(userId);
      return {
        statusCode: HttpStatus.OK,
        message: "Data obtenida correctamente",
        data: pokemons,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.pokemonService.remove(+id);
  }
}
