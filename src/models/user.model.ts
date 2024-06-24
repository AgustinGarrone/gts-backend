import { ApiProperty } from "@nestjs/swagger";
import { Table, Column, Model, HasMany, Default } from "sequelize-typescript";
import { Pokemon } from "./pokemon.model";
import { Notification } from "./notification.model";

@Table({ tableName: "users" })
export class User extends Model<User> {
  @Column({ primaryKey: true, autoIncrement: true })
  @ApiProperty()
  id: number;

  @Column({ allowNull: false })
  @ApiProperty()
  username: string;

  @Column({ allowNull: false, unique: true })
  @ApiProperty()
  email: string;

  @Column({ allowNull: false })
  @ApiProperty()
  password: string;

  @Default(false)
  @Column({ allowNull: true })
  @ApiProperty()
  initialPokemons: boolean;

  @HasMany(() => Pokemon, "ownerId")
  pokemons: Pokemon[];

  @HasMany(() => Notification, "userId")
  notifications: Notification[];
}

export const userProvider = [
  {
    provide: "USER_REPOSITORY",
    useValue: User,
  },
];
