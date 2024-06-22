import { ApiProperty } from "@nestjs/swagger";
import { Column, Model, Table } from "sequelize-typescript";

@Table({ tableName: "pokemons" })
export class Trade extends Model<Trade> {
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

  ownerId: number;
}

export const tradeProvider = [
  {
    provide: "TRADE_REPOSITORY",
    useValue: Trade,
  },
];
