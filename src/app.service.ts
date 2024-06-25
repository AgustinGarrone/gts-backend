import { Injectable } from "@nestjs/common";
import { OnApplicationBootstrap } from "@nestjs/common/interfaces";
import { SeedService } from "./seed/seed.service";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private seedService: SeedService) {}

  async onApplicationBootstrap(): Promise<any> {
    const pokemonCount = await this.seedService.countAll();

    if (pokemonCount === 0) {
      console.log("CARGANDO DATOS EN LA BASE.... ESPERE.");

      const interval = setInterval(() => {
        console.log("Cargando datos...");
      }, 2000);

      // Ejecutar los seeds
      await this.seedService.seedPokemons();
      await this.seedService.seedUsers();
      await this.seedService.seedTrades();

      clearInterval(interval);
      console.log("Base de datos cargada correctamente");
    }
  }
}
