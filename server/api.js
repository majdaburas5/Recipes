const express = require("express");
const axios = require("axios");
const consts = require("./consts");
const router = express.Router();
const INGREDIENT_URL =
  "https://recipes-goodness-elevation.herokuapp.com/recipes/ingredient";

const sensitiveRecipes = function (query, recipesArr) {
  let dairyFree = query?.dairy;
  let glutenFree = query?.gluten;
  let index = query?.index;
  let allRecipes = [];
  let unwantedIngredient = query?.unwantedIngredient;

  if (dairyFree === "true") {
    allRecipes = getSensitvieRecipes(
      recipesArr,
      consts.dairyIngredients,
      unwantedIngredient
    );
  }

  if (glutenFree == "true") {
    if (allRecipes.length == 0) {
      allRecipes = getSensitvieRecipes(
        recipesArr,
        consts.glutenIngredients,
        unwantedIngredient
      );
    } else {
      allRecipes = getSensitvieRecipes(
        allRecipes,
        consts.glutenIngredients,
        unwantedIngredient
      );
    }
  }
  if (glutenFree == undefined && dairyFree == undefined) {
    return getSensitvieRecipes(recipesArr, [], unwantedIngredient).splice(
      index,
      consts.magicNumber
    );
  }
  return allRecipes.splice(index, consts.magicNumber);
};

const getSensitvieRecipes = function (
  recipes,
  sensitiveIngredients,
  unwantedIngredient
) {
  let Recipes = [];
  for (let recipe of recipes) {
    let isSensitive = isRecipeIncludesSensitiveIngredient(
      recipe.ingredients,
      sensitiveIngredients
    );
    if (!isSensitive && !recipe.ingredients.includes(unwantedIngredient)) {
      Recipes.push(recipe);
    }
  }
  return Recipes;
};

const isRecipeIncludesSensitiveIngredient = function (
  recipeIngredients,
  sensitiveIngredients
) {
  for (let ingredient of recipeIngredients) {
    for (let sensitveIngredint of sensitiveIngredients) {
      if (ingredient == sensitveIngredint) {
        return true;
      }
    }
  }
  return false;
};

router.get("/getRecipe/:ingredient", function (req, res) {
  let ingredients = req.params?.ingredient;
  if (ingredients.length == 0) {
    res.status(400).send({ error: "you must enter ingredient" });
    return;
  }
  axios.get(`${INGREDIENT_URL}/${ingredients}`).then((result) => {
    let recipesArr = result.data.results.map((recipe) => {
      return {
        idMeal: recipe.idMeal,
        title: recipe.title,
        thumbnail: recipe.thumbnail,
        href: recipe.href,
        ingredients: recipe.ingredients,
      };
    });
    let recipesToSend = sensitiveRecipes(req.query, recipesArr);
    if (recipesToSend.length == 0) {
      res
        .status(400)
        .send({ error: "there is no recipes for this ingriedient " });
      return;
    }
    res.send(recipesToSend);
  });
});

module.exports = router;
