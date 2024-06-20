import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import { Pokemon } from "./pokemon.model";
import { Ability } from "./ability.model";
import { ApiProperty } from "@nestjs/swagger";

@Table({ tableName: "pokemon_abilities", timestamps: false })
export class PokemonAbility extends Model<PokemonAbility> {
  @Column({ primaryKey: true, autoIncrement: true })
  @ApiProperty()
  id: number;

  @ForeignKey(() => Pokemon)
  @Column
  pokemonId: number;

  @ForeignKey(() => Ability)
  @Column
  abilityId: number;
}

export const pokemonAbilityProvider = [
  {
    provide: "POKEMON_ABILITY_REPOSITORY",
    useValue: PokemonAbility,
  },
];
