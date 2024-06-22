import { ApiProperty } from "@nestjs/swagger";
import {
  Table,
  Column,
  Model,
  BelongsToMany,
  BelongsTo,
} from "sequelize-typescript";
import { Ability } from "./ability.model";
import { PokemonAbility } from "./pokemonAbility.model";
import { Type } from "./type.model";
import { PokemonType } from "./pokemonTypes.model";
import { User } from "./user.model";

@Table({ tableName: "pokemons" })
export class Pokemon extends Model<Pokemon> {
  @Column({ primaryKey: true, autoIncrement: true })
  @ApiProperty()
  id: number;

  @Column({ allowNull: false, unique: true })
  @ApiProperty()
  name: string;

  @Column({ allowNull: true })
  @ApiProperty()
  image: string;

  @Column({ allowNull: false })
  @ApiProperty()
  level: number;

  @BelongsToMany(() => Ability, () => PokemonAbility)
  @ApiProperty({ type: () => [Ability] })
  abilities: Ability[];

  @BelongsToMany(() => Type, () => PokemonType)
  @ApiProperty({ type: () => [Type] })
  types: Type[];

  @BelongsTo(() => User, "ownerId")
  owner: User;

  ownerId: number;
}

export const pokemonProvider = [
  {
    provide: "POKEMON_REPOSITORY",
    useValue: Pokemon,
  },
];
