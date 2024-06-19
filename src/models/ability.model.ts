import { ApiProperty } from "@nestjs/swagger";
import { Table, Column, Model, BelongsToMany } from "sequelize-typescript";
import { Pokemon } from "./pokemon.model";
import { PokemonAbility } from "./pokemonAbility.model";

@Table({ tableName: "abilities" })
export class Ability extends Model<Ability> {
  @Column({ primaryKey: true, autoIncrement: true })
  @ApiProperty()
  id: number;

  @Column({ allowNull: false, unique: true })
  @ApiProperty()
  name: string;

  @Column({ allowNull: false })
  @ApiProperty()
  description: string;

  @BelongsToMany(() => Pokemon, () => PokemonAbility)
  @ApiProperty({ type: () => [Pokemon] })
  pokemons: Pokemon[];
}

export const abilityProvider = [
  {
    provide: "ABILITY_REPOSITORY",
    useValue: Ability,
  },
];
