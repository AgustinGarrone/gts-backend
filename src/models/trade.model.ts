import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Pokemon } from "./pokemon.model";
import { User } from "./user.model";
import { TradeState } from "src/constants/types";

@Table({ tableName: "trades" })
export class Trade extends Model<Trade> {
  @Column({ primaryKey: true, autoIncrement: true })
  @ApiProperty()
  id: number;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  @ApiProperty()
  user1Id: number;

  @ForeignKey(() => User)
  @Column({ allowNull: true })
  @ApiProperty()
  user2Id: number;

  @ForeignKey(() => Pokemon)
  @Column({ allowNull: false })
  @ApiProperty()
  pokemon1Id: number;

  @ForeignKey(() => Pokemon)
  @Column({ allowNull: true })
  @ApiProperty()
  pokemon2Id: number;

  @Default(TradeState.PENDING)
  @Column({
    type: DataType.ENUM(TradeState.PENDING, TradeState.COMPLETED),
    allowNull: false,
    defaultValue: TradeState.PENDING,
  })
  @ApiProperty()
  state: TradeState;

  @BelongsTo(() => User, "user1Id")
  user1: User;

  @BelongsTo(() => User, "user2Id")
  user2: User;

  @BelongsTo(() => Pokemon, "pokemon1Id")
  pokemon1: Pokemon;

  @BelongsTo(() => Pokemon, "pokemon2Id")
  pokemon2: Pokemon;
}

export const tradeProvider = [
  {
    provide: "TRADE_REPOSITORY",
    useValue: Trade,
  },
];
