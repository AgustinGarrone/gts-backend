import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table({ tableName: "notifications" })
export class Notification extends Model<Notification> {
  @Column({ primaryKey: true, autoIncrement: true })
  @ApiProperty()
  id: number;

  @Column({ allowNull: false })
  @ApiProperty()
  message: string;

  @BelongsTo(() => User, "userId")
  user: User;

  @ApiProperty()
  userId: number;
}

export const notificationProvider = [
  {
    provide: "NOTIFICATION_REPOSITORY",
    useValue: Notification,
  },
];
