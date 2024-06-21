import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Pokemon } from "src/models/pokemon.model";
import { User } from "src/models/user.model";

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
      });
      return pokemons;
    } catch (error) {
      console.error("Error in PokemonService findAll:", error.message);
      throw new Error("No se pudo obtener la lista de pokemones");
    }
  }

  async addPokemon(userId: number, pokemonId: number) {
    const existingPokemon = await this.pokemonRepository.findOne({
      where: {
        id: pokemonId,
      },
    });
    const existingUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!existingUser) {
      throw new NotFoundException("Usuario no encontrado");
    }
    if (!existingPokemon) {
      throw new NotFoundException("Pokemon no encontrado");
    }
    if (existingPokemon.ownerId && existingPokemon.ownerId !== userId) {
      throw new ForbiddenException("Este pokemon ya tiene dueño");
    }

    await this.pokemonRepository.update(
      { ownerId: userId },
      { where: { id: pokemonId } },
    );

    return await this.pokemonRepository.findOne({ where: { id: pokemonId } });
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
