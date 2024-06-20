import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Pokemon } from "./pokemon.model";
import { Type } from "./type.model";
import { ApiProperty } from "@nestjs/swagger";

@Table({ tableName: "pokemon_types", timestamps: false })
export class PokemonType extends Model<PokemonType> {
  @Column({ primaryKey: true, autoIncrement: true })
  @ApiProperty()
  id: number;

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
