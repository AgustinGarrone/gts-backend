import { Module } from "@nestjs/common";
import { databaseProviders } from "./providers";
@Module({
  providers: [...databaseProviders],
  exports: ["SEQUELIZE"],
})
export class DatabaseModule {}
