import { ApiProperty } from "@nestjs/swagger";
import { Table, Column, Model } from "sequelize-typescript";

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
  level: string;

  @Column({ allowNull: false })
  @ApiProperty()
  type: string;
}

export const pokemonProvider = [
  {
    provide: "POKEMON_REPOSITORY",
    useValue: Pokemon,
  },
];
