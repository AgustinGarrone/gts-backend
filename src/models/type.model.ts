import { ApiProperty } from "@nestjs/swagger";
import { Table, Column, Model, BelongsToMany } from "sequelize-typescript";
import { Pokemon } from "./pokemon.model";
import { PokemonType } from "./pokemonTypes.model";

@Table({ tableName: "types", timestamps: false })
export class Type extends Model<Type> {
  @Column({ primaryKey: true, autoIncrement: true })
  @ApiProperty()
  id: number;

  @Column({ allowNull: false })
  @ApiProperty()
  name: string;

  @BelongsToMany(() => Pokemon, () => PokemonType)
  @ApiProperty({ type: () => [Pokemon] })
  pokemons: Pokemon[];
}

export const typeProvider = [
  {
    provide: "TYPE_REPOSITORY",
    useValue: Type,
  },
];
