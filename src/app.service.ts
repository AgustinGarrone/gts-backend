import { Injectable } from "@nestjs/common";
import { OnApplicationBootstrap } from "@nestjs/common/interfaces";
import { SeedService } from "./seed/seed.service";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private seedService: SeedService) {}

  async onApplicationBootstrap(): Promise<any> {
    const pokemonCount = await this.seedService.countAll();

    console.log("POKEMON COUNT ES ");
    console.log(pokemonCount);

    if (pokemonCount === 0) {
      await this.seedService.seedPokemons();
      await this.seedService.seedUsers();
      await this.seedService.seedTrades();
    }
  }
}
