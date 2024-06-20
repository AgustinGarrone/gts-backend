import { Inject, Injectable } from "@nestjs/common";
import { Type } from "src/models/type.model";
import axios from "axios";
import { Pokemon } from "src/models/pokemon.model";
import { Ability } from "src/models/ability.model";
import { PokemonAbility } from "src/models/pokemonAbility.model";
import { PokemonType } from "src/models/pokemonTypes.model";
import { getRandomLevel } from "src/helpers/pokemon.helper";
import { POKEAPI_URL } from "src/constants/api";

@Injectable()
export class SeedService {
  constructor(
    @Inject("TYPE_REPOSITORY")
    private readonly typeRepository: typeof Type,
    @Inject("POKEMON_REPOSITORY")
    private readonly pokemonRepository: typeof Pokemon,
    @Inject("ABILITY_REPOSITORY")
    private readonly abilityRepository: typeof Ability,
    @Inject("POKEMON_ABILITY_REPOSITORY")
    private readonly pokemonAbilityRepository: typeof PokemonAbility,
    @Inject("POKEMON_TYPES_REPOSITORY")
    private readonly pokemonTypeRepository: typeof PokemonType,
  ) {}

  async countAll() {
    return await this.pokemonRepository.count();
  }

  async seedPokemons() {
    try {
      const response = await axios.get(POKEAPI_URL);
      const pokemonCount = response.data.count;
      const newResponse = await axios.get(
        `${POKEAPI_URL}?limit=${pokemonCount}`,
      );

      for (const result of newResponse.data.results) {
        const pokemonData = await axios.get(result.url);
        const pokemon = pokemonData.data;

        const createdPokemon = await this.pokemonRepository.create({
          name: pokemon.name,
          image:
            pokemon.sprites.front_default ||
            pokemon.sprites.other.home.front_default ||
            pokemon.sprites.other["official-artwork"].front_default,
          level: getRandomLevel(),
        });

        // Save types
        const typePromises = pokemon.types.map(async (typeInfo) => {
          const [type] = await this.typeRepository.findOrCreate({
            where: { name: typeInfo.type.name },
          });
          await PokemonType.create({
            pokemonId: createdPokemon.id,
            typeId: type.id,
          });
        });
        await Promise.all(typePromises);

        // Save abilities
        const abilityNames = new Set(
          pokemon.abilities.map((a) => a.ability.name),
        );

        const abilityPromises = Array.from(abilityNames).map(
          async (abilityName) => {
            const [ability] = await this.abilityRepository.findOrCreate({
              where: { name: abilityName },
            });
            await PokemonAbility.create({
              pokemonId: createdPokemon.id,
              abilityId: ability.id,
            });
          },
        );
        await Promise.all(abilityPromises);
      }

      console.log("Pokemons seeded successfully.");
    } catch (error) {
      console.error("Error seeding pokemons:", error);
    }
  }
}
