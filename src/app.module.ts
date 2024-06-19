import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [AuthModule, DatabaseModule, PokemonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
