import {
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsNumber,
  IsNotEmpty,
  IsInt,
} from "class-validator";

export class AddPokemonDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsInt({ each: true })
  @IsNotEmpty({ each: true })
  pokemonIds: number[];
}
