const { Router } = require("express");
const { Diet } = require("../db");
const axios = require("axios");
const routerTypes = Router();
const api = 'https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5'

routerTypes.get("/", async (req, res) => {
  const recipesApi = await axios.get(
    api
  );
  const types = await recipesApi.data.results.map((t) => t.diets);
  const diets = types.flat();
  const typeDiets = [...new Set(diets), "vegetarian"];
  typeDiets.forEach((d) => {
    Diet.findOrCreate({
      where: { name: d },
    });
  });
  const allDiets = await Diet.findAll();
  res.json(allDiets);
});

module.exports = routerTypes;