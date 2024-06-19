import { Inject, Injectable } from "@nestjs/common";
import { Type } from "src/models/type.model";
import axios from "axios";
import { Pokemon } from "src/models/pokemon.model";
import { Ability } from "src/models/ability.model";

@Injectable()
export class SeedService {
  constructor(
    @Inject("TYPE_REPOSITORY")
    private readonly typeRepository: typeof Type,
    @Inject("POKEMON_REPOSITORY")
    private readonly pokemonRepository: typeof Pokemon,
    @Inject("ABILITY_REPOSITORY")
    private readonly abilityRepository: typeof Ability,
  ) {}

  async countAll() {
    return await this.pokemonRepository.count();
  }

  async seedTypes() {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/type");
      const typesCount = response.data.count;
      const newResponse = await axios.get(
        `https://pokeapi.co/api/v2/type?limit=${typesCount}`,
      );
      const names = newResponse.data.results.map((result) => {
        return { name: result.name };
      });
      await this.typeRepository.bulkCreate(names);
      console.log("Types seeded successfully.");
    } catch (error) {
      console.error("Error seeding types:", error);
    }
  }

  async seedAbilities() {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/ability");
      const abilityCount = response.data.count;
      const newResponse = await axios.get(
        `https://pokeapi.co/api/v2/ability?limit=${abilityCount}`,
      );
      const names = newResponse.data.results.map((result) => {
        return { name: result.name };
      });
      await this.abilityRepository.bulkCreate(names);
      console.log("Types seeded successfully.");
    } catch (error) {
      console.error("Error seeding types:", error);
    }
  }
}
