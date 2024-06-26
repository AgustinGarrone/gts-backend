import { Sequelize } from "sequelize-typescript";
import { Ability } from "src/models/ability.model";
import { Notification } from "src/models/notification.model";
import { Pokemon } from "src/models/pokemon.model";
import { PokemonAbility } from "src/models/pokemonAbility.model";
import { PokemonType } from "src/models/pokemonTypes.model";
import { Trade } from "src/models/trade.model";
import { Type } from "src/models/type.model";
import { User } from "src/models/user.model";

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: "postgres",
        host: "db",
        port: 5432,
        username: "admin",
        password: "admin",
        database: "gts-pokemon-db",
        logging: false,
      });
      sequelize.addModels([
        User,
        Ability,
        Pokemon,
        PokemonAbility,
        Type,
        PokemonType,
        Trade,
        Notification,
      ]);
      await sequelize.sync({ alter: true });
      return sequelize;
    },
  },
];
