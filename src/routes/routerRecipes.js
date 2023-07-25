const { Router } = require("express");
const { Recipe, Diet } = require("../db");
const axios = require("axios");
const routerRecipes = Router();
const api = 'https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5'

const getApiInfo = async () => { // función para llamar la información de la api externa 
  const apiInfo = await axios.get(
    api
  );
  return apiInfo.data.results;
};

const getDbInfo = async () => { // función que trae la info de la db
  return await Recipe.findAll({ 
    include: {
      model: Diet,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
};

const getAllRecipes = async () => { // funcón que concatena los datos de la api y los de la db
  const apiInfo = await getApiInfo(); // trae la info de la api
  const dbInfo = await getDbInfo(); // trae la info de la bd
  const totalInfo = dbInfo.concat(apiInfo); // concatena la info de api y la info de la bd
  return totalInfo;
};

// Rutas de las recetas

routerRecipes.get("/", async (req, res) => {
  const { name } = req.query; // se pide por query
  const recipesTotal = await getAllRecipes(); // trae todas las recetas
  if (name) { //primera condición para saber si hay un name por query
    let recipeTitle = await recipesTotal.filter((r) => 
      r.title.toLowerCase().includes(name.toLowerCase()) //métodod toLowerCase para que no haya problema entre mayusculas y minúsculas
    );
    recipeTitle.length //si encuentra el nombre?
      ? res.status(200).json(recipeTitle) //si lo encontró muestrame recipesTitle
      : res.status(400).send("This recipe doesn't exist"); // si no lo encontró muestrame un mensaje
  } else {
    res.status(200).json(recipesTotal);
  }
});

routerRecipes.post("/", async (req, res) => { //lo que requiere el body
  let {
    title,
    summary,
    aggregateLikes,
    analyzedInstructions,
    image,
    diets,
  } = req.body;
  if (!title || !summary) {
    return res.json("You must enter a title and a summary to create a recipe"); //si no hay un titulo o sumuary muestrame un mensaje
  }
  let recipeCreated = await Recipe.create({
    title,
    summary,
    aggregateLikes,
    analyzedInstructions,
    image : image || 'https://picsum.photos/200/300/?blur'
  });
  let dietDb = await Diet.findAll({ where: { name: diets } });
  recipeCreated.addDiet(dietDb);
  res.send("Recipe created successfully"); 
});

routerRecipes.delete('/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        const recipe = await Recipe.findByPk(id);
        if(!recipe){
            res.status(404).send("No esta disponible");
        } else {
            await recipe.destroy();
            res.status(200).send("Receta eliminada con exito");
        }
    } catch (error) {
        next(error);
    }
})

routerRecipes.get("/:id", async (req, res) => {
  const { id } = req.params;
  const recipesTotal = await getAllRecipes();
  if (id) {
    let recipeId = await recipesTotal.filter((r) => r.id == id);
    recipeId.length
      ? res.status(200).json(recipeId)
      : res.status(404).send("Recipe not found");
  }
});

module.exports = routerRecipes