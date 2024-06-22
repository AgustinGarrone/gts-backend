import { Inject, Injectable } from "@nestjs/common";
import { Type } from "src/models/type.model";
import axios from "axios";
import { Pokemon } from "src/models/pokemon.model";
import { Ability } from "src/models/ability.model";
import { PokemonAbility } from "src/models/pokemonAbility.model";
import { PokemonType } from "src/models/pokemonTypes.model";
import { getRandomLevel } from "src/helpers/pokemon.helper";
import { POKEAPI_URL } from "src/constants/api";
import { User } from "src/models/user.model";
import { Sequelize } from "sequelize-typescript";
import { Trade } from "src/models/trade.model";
import { TradeState } from "src/constants/types";
import * as bcrypt from "bcrypt";

@Injectable()
export class SeedService {
  constructor(
    @Inject("USER_REPOSITORY")
    private readonly userRepository: typeof User,
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
    @Inject("TRADE_REPOSITORY")
    private readonly tradeRepository: typeof Trade,
    @Inject("SEQUELIZE")
    private readonly sequelize: Sequelize,
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

        //Guarda los tipos asociados al pokémon
        const typePromises = pokemon.types.map(async (typeInfo) => {
          const [type] = await this.typeRepository.findOrCreate({
            where: { name: typeInfo.type.name },
          });
          await this.pokemonTypeRepository.create({
            pokemonId: createdPokemon.id,
            typeId: type.id,
          });
        });
        await Promise.all(typePromises);

        //Guarda las habilidades asociadas al pokémon
        const abilityNames = new Set(
          pokemon.abilities.map((a) => a.ability.name),
        );

        const abilityPromises = Array.from(abilityNames).map(
          async (abilityName) => {
            const [ability] = await this.abilityRepository.findOrCreate({
              where: { name: abilityName },
            });
            await this.pokemonAbilityRepository.create({
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

  async seedUsers() {
    try {
      const transaction = await this.sequelize.transaction();

      const hashedPassword = await bcrypt.hash("password1", 10);

      const createdUsers = await this.userRepository.bulkCreate(
        [
          {
            username: "Ash Ketchum",
            email: "Ashketchum@gmail.com",
            password: hashedPassword,
            initialPokemons: true,
          },
          {
            username: "Misty Waterflower",
            email: "Mistywaterflower@gmail.com",
            password: hashedPassword,
            initialPokemons: true,
          },
        ],
        { transaction },
      );

      await Promise.all([
        this.pokemonRepository.update(
          { ownerId: createdUsers[0].id },
          { where: { id: 1 }, transaction },
        ),
        this.pokemonRepository.update(
          { ownerId: createdUsers[0].id },
          { where: { id: 2 }, transaction },
        ),
        this.pokemonRepository.update(
          { ownerId: createdUsers[1].id },
          { where: { id: 3 }, transaction },
        ),
        this.pokemonRepository.update(
          { ownerId: createdUsers[1].id },
          { where: { id: 4 }, transaction },
        ),
      ]);

      await transaction.commit();

      console.log("Users seeded successfully.");
    } catch (error) {
      console.error("Error seeding users:", error);
    }
  }

  async seedTrades() {
    try {
      const user1 = await this.userRepository.findOne({
        where: { username: "Ash Ketchum" },
      });
      const user2 = await this.userRepository.findOne({
        where: { username: "Misty Waterflower" },
      });

      const pokemonUser1 = await this.pokemonRepository.findAll({
        where: { ownerId: user1.id },
      });
      const pokemonUser2 = await this.pokemonRepository.findAll({
        where: { ownerId: user2.id },
      });

      const tradesToCreate = [
        {
          user1Id: user1.id,
          pokemon1Id: pokemonUser1[0].id,
          state: TradeState.PENDING,
        },
        {
          user1Id: user1.id,
          pokemon1Id: pokemonUser1[1].id,
          state: TradeState.PENDING,
        },
        {
          user1Id: user2.id,
          pokemon1Id: pokemonUser2[0].id,
          state: TradeState.PENDING,
        },
        {
          user1Id: user2.id,
          pokemon1Id: pokemonUser2[1].id,
          state: TradeState.PENDING,
        },
      ];

      const createdTrades =
        await this.tradeRepository.bulkCreate(tradesToCreate);

      console.log("Trades seeded successfully.", createdTrades.length);
    } catch (error) {
      console.error("Error seeding trades:", error);
    }
  }
}
