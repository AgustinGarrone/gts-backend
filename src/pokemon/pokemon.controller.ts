import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
  Post,
  Body,
} from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { ApiResponse } from "src/constants/types";
import { Pokemon } from "src/models/pokemon.model";
import { GetUserFromJwt } from "src/helpers/getUser.helper";
import { AddPokemonDto } from "./dto/add-pokemon.dto";

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

  @UseGuards(JwtAuthGuard)
  @Post()
  async addPokemon(
    @GetUserFromJwt() user,
    @Body() data: AddPokemonDto,
  ): Promise<ApiResponse<Pokemon[]>> {
    try {
      const updatePokemon = await this.pokemonService.addPokemon(
        user.userId,
        data.pokemonIds,
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Pokemon agregado con exito",
        data: updatePokemon,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("/random")
  async getRandomPokemon(
    @GetUserFromJwt() user,
  ): Promise<ApiResponse<Pokemon>> {
    try {
      const randomPokemon = await this.pokemonService.getRandomPokemon(
        user.userId,
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Pokemon obtenido con exito",
        data: randomPokemon,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deletePokemon(
    @GetUserFromJwt() user,
    @Param("id") pokemonId: number,
  ): Promise<ApiResponse<boolean>> {
    try {
      await this.pokemonService.deletePokemon(user.userId, pokemonId);
      return {
        statusCode: HttpStatus.OK,
        message: "Pokémon eliminado con éxito",
        data: true,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
