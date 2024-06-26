
## GTS POKÉMON

Aplicación de sistema de intercambios.

## Tecnologías destacadas

- **NestJS**: Framework de Node.js para construir aplicaciones eficientes y escalables del lado del servidor.
- **Express**: Framework web minimalista para Node.js utilizado por NestJS como base.
- **Passport.js**: Middleware de autenticación para Node.js.
- **Sequelize**: ORM (Object-Relational Mapping) para Node.js, compatible con varios dialectos SQL, incluido PostgreSQL.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional de código abierto.
- **JWT (JSON Web Tokens)**: Método estándar para la transferencia segura de datos entre dos partes.

## Pre requisitos
- Tener **Docker** instalado en tu sistema

## Instalacion

Ejecutamos el comando
```bash

$ git clone https://github.com/AgustinGarrone/gts-backend.git
```

Accede al directorio del repositorio
```bash

$ cd gts-backend
```


## Ejecución

```bash
# Construimos la imagen basada en la aplicación
docker build -t gts-pokemon .

# Ejecutamos las imagenes (postgres y app)
docker compose up
```

Y listo!

## Documentación
Visitando /docs encuentra la documentación del api rest
**http://localhost:3000/docs**

Además de una colección de Postman en formato json para importar
