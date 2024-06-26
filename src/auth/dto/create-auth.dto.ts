import { IsString, IsEmail, Length, IsNotEmpty } from "class-validator";

export class CreateUserDTO {
  @IsString({
    message: 'El campo "username" debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'El campo "username" es obligatorio.' })
  username: string;

  @IsEmail(
    {},
    {
      message:
        'El campo "email" debe ser una dirección de correo electrónico válida.',
    },
  )
  @IsNotEmpty({ message: 'El campo "email" es obligatorio.' })
  email: string;

  @IsString({
    message: 'El campo "password" debe ser una cadena de caracteres.',
  })
  @Length(6, 15, {
    message: "La contraseña debe tener entre 6 y 15 caracteres.",
  })
  @IsNotEmpty({ message: 'El campo "password" es obligatorio.' })
  password: string;
}

export class LoginUserDTO {
  @IsEmail(
    {},
    {
      message:
        'El campo "email" debe ser una dirección de correo electrónico válida.',
    },
  )
  @IsNotEmpty({ message: 'El campo "email" es obligatorio.' })
  email: string;

  @IsString({
    message: 'El campo "password" debe ser una cadena de caracteres.',
  })
  @Length(6, 15, {
    message: "La contraseña debe tener entre 6 y 15 caracteres.",
  })
  @IsNotEmpty({ message: 'El campo "password" es obligatorio.' })
  password: string;
}

export type LoginResponse = {
  id: number;
  username: string;
  email: string;
  token: string;
  initialPokemons: boolean;
};
