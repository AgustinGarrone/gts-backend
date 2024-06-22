import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateTradeDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  pokemonId: number;
}
