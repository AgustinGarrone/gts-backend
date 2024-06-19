import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import { Pokemon } from "./pokemon.model";
import { Ability } from "./ability.model";

@Table({ tableName: "pokemon_abilities" })
export class PokemonAbility extends Model<PokemonAbility> {
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
