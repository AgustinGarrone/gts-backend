import { IsNotEmpty, IsNumber } from "class-validator";

export class AddPokemonDto {
  @IsNumber()
  @IsNotEmpty()
  pokemonId: number;
}
