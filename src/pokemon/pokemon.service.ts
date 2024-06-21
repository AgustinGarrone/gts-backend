import { Inject, Injectable } from "@nestjs/common";
import { Pokemon } from "src/models/pokemon.model";

@Injectable()
export class PokemonService {
  constructor(
    @Inject("POKEMON_REPOSITORY")
    private readonly pokemonRepository: typeof Pokemon,
  ) {}

  countAll() {
    return this.pokemonRepository.count();
  }

  async findAll(userId: number) {
    try {
      const pokemons = await this.pokemonRepository.findAll({
        where: {
          ownerId: userId, // Filtra por el ownerId del Pokemon
        },
      });
      return pokemons;
    } catch (error) {
      console.error("Error in PokemonService findAll:", error.message);
      throw new Error("No se pudo obtener la lista de pokemones");
    }
  }
  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
