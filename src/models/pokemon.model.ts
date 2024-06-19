import { ApiProperty } from "@nestjs/swagger";
import { Table, Column, Model, BelongsToMany } from "sequelize-typescript";
import { Ability } from "./ability.model";
import { PokemonAbility } from "./pokemonAbility.model";

@Table({ tableName: "pokemons" })
export class Pokemon extends Model<Pokemon> {
  @Column({ primaryKey: true, autoIncrement: true })
  @ApiProperty()
  id: number;

  @Column({ allowNull: false, unique: true })
  @ApiProperty()
  name: string;

  @Column({ allowNull: false })
  @ApiProperty()
  image: string;

  @Column({ allowNull: false })
  @ApiProperty()
  level: string;

  @Column({ allowNull: false })
  @ApiProperty()
  type: string;

  @BelongsToMany(() => Ability, () => PokemonAbility)
  @ApiProperty({ type: () => [Ability] })
  abilities: Ability[];
}

export const pokemonProvider = [
  {
    provide: "POKEMON_REPOSITORY",
    useValue: Pokemon,
  },
];
