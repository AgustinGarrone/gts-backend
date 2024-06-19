import { Inject, Injectable } from "@nestjs/common";
import { CreatePokemonDto } from "./dto/create-pokemon.dto";
import { UpdatePokemonDto } from "./dto/update-pokemon.dto";
import { Pokemon } from "src/models/pokemon.model";
import axios from "axios";
import { getPokemons, getTypes } from "src/pokemon/helpers/pokeapi";

@Injectable()
export class PokemonService {
  constructor(
    @Inject("POKEMON_REPOSITORY")
    private readonly pokemonRepository: typeof Pokemon,
  ) {}

  async seedDatabase() {
    //getPokemons();
    getTypes();
    /*  const pokemonData = response.data.results.map((result: any) => ({
      name: result.name,
      level: "1", // Puedes ajustar esto según tu lógica de negocio
      type: "Normal", // Puedes ajustar esto según tu lógica de negocio
    }));
    await this.pokemonRepository.bulkCreate(pokemonData); */
  }

  countAll() {
    return this.pokemonRepository.count();
  }

  create(createPokemonDto: CreatePokemonDto) {
    return "This action adds a new pokemon";
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
