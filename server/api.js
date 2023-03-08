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

  if (dairyFree === "true") {
    allRecipes = getSensitvieRecipes(recipesArr, consts.dairyIngredients);
  }

  if (glutenFree == "true") {
    if (allRecipes.length == 0) {
      allRecipes = getSensitvieRecipes(recipesArr, consts.glutenIngredients);
    } else {
      allRecipes = getSensitvieRecipes(allRecipes, consts.glutenIngredients);
    }
  }
  if (glutenFree == undefined && dairyFree == undefined) {
    return recipesArr.splice(index, consts.magicNumber);
  }
  return allRecipes.splice(index, consts.magicNumber);
};

const getSensitvieRecipes = function (recipes, sensitiveIngredients) {
  let Recipes = [];
  for (let recipe of recipes) {
    let isSensitive = isRecipeIncludesSensitiveIngredient(
      recipe.ingredients,
      sensitiveIngredients
    );
    if (!isSensitive) {
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
  let ingredients = req.params.ingredient;
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
    res.send(sensitiveRecipes(req.query, recipesArr));
  });
});

module.exports = router;
