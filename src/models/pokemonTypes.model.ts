import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Pokemon } from "./pokemon.model";
import { Type } from "./type.model";

@Table({ tableName: "pokemon_types" })
export class PokemonType extends Model<PokemonType> {
  @ForeignKey(() => Pokemon)
  @Column
  pokemonId: number;

  @ForeignKey(() => Type)
  @Column
  typeId: number;
}

export const pokemonTypesProvider = [
  {
    provide: "POKEMON_TYPES_REPOSITORY",
    useValue: PokemonType,
  },
];
