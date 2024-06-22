import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { Ability } from "src/models/ability.model";
import { Pokemon } from "src/models/pokemon.model";
import { Type } from "src/models/type.model";
import { User } from "src/models/user.model";
import { Op } from "sequelize";

@Injectable()
export class PokemonService {
  constructor(
    @Inject("POKEMON_REPOSITORY")
    private readonly pokemonRepository: typeof Pokemon,
    @Inject("USER_REPOSITORY")
    private readonly userRepository: typeof User,
  ) {}

  countAll() {
    return this.pokemonRepository.count();
  }

  async findAll(userId: number) {
    try {
      const pokemons = await this.pokemonRepository.findAll({
        where: {
          ownerId: userId,
        },
        include: [Type, Ability],
      });
      return pokemons;
    } catch (error) {
      console.error("Error in PokemonService findAll:", error.message);
      throw new Error("No se pudo obtener la lista de pokemones");
    }
  }

  async addPokemon(userId: number, pokemonsId: number[]) {
    const existingUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!existingUser) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const existingPokemons = await Promise.all(
      pokemonsId.map(async (id) => {
        return await this.pokemonRepository.findOne({
          where: {
            id,
          },
        });
      }),
    );

    if (!existingPokemons) {
      throw new NotFoundException("Pokemon no encontrado");
    }

    const anyPokemonOwned = existingPokemons.some(
      (pokemon) => pokemon.ownerId !== null,
    );

    if (anyPokemonOwned) {
      throw new ForbiddenException("Uno o más Pokémon ya tienen dueño");
    }

    await this.pokemonRepository.update(
      { ownerId: userId },
      {
        where: {
          id: {
            [Op.in]: pokemonsId,
          },
        },
      },
    );

    return await this.pokemonRepository.findAll({
      where: {
        id: {
          [Op.in]: pokemonsId,
        },
      },
    });
  }

  async getRandomPokemon(userId: number) {
    const existingUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const randomPokemon = await this.pokemonRepository.findOne({
      where: {
        ownerId: null,
      },
      order: [Sequelize.fn("RANDOM")],
      include: [Ability, Type],
    });

    return randomPokemon;
  }

  async deletePokemon(userId: number, pokemonId: number): Promise<void> {
    const existingPokemon = await this.pokemonRepository.findOne({
      where: { id: pokemonId },
    });

    if (!existingPokemon) {
      throw new NotFoundException("Pokémon no encontrado");
    }

    if (existingPokemon.ownerId !== userId) {
      throw new ForbiddenException(
        "No tienes permiso para eliminar este Pokémon",
      );
    }

    await this.pokemonRepository.update(
      { ownerId: userId },
      { where: { id: pokemonId } },
    );
  }
}
