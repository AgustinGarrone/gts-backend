import { Sequelize } from "sequelize-typescript";
import { Ability } from "src/models/ability.model";
import { Pokemon } from "src/models/pokemon.model";
import { PokemonAbility } from "src/models/pokemonAbility.model";
import { PokemonType } from "src/models/pokemonTypes.model";
import { Type } from "src/models/type.model";
import { User } from "src/models/user.model";

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "admin",
        database: "gts-pokemon",
      });
      sequelize.addModels([
        User,
        Ability,
        Pokemon,
        PokemonAbility,
        Type,
        PokemonType,
      ]);
      await sequelize.sync({ alter: true });
      return sequelize;
    },
  },
];
