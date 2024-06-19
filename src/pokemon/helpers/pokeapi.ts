import axios from "axios";
import { Type } from "src/models/type.model";

export const getTypes = async () => {
  const response = await axios.get("https://pokeapi.co/api/v2/type");
  const typesCount = response.data.count;
  const newResponse = await axios.get(
    `https://pokeapi.co/api/v2/type?limit=${typesCount}`,
  );
  const names = newResponse.data.results.map((result) => {
    return { name: result.name }; // Mapea los nombres en un formato compatible con Sequelize
  });
  await Type.bulkCreate(names);
};

export const getPokemons = async () => {
  const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
  const pokemonCount = response.data.count;
  console.log("LA COUT ES");
  console.log(pokemonCount);
  const newResponse = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=${pokemonCount}`,
  );
  const urls = newResponse.data.results.map((result) => {
    return result.url;
  });
  for (let url of urls) {
    const pokemonData = await axios.get(url);
    console.log(pokemonData.data.forms[0].name);
  }
};
