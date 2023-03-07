const express = require("express");
const axios = require("axios");
const consts = require("./consts");
const router = express.Router();

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

router.get("/getRecipe/:ingredient", function (req, res) {
  let ingredients = req.params.ingredient;
  axios
    .get(
      `https://recipes-goodness-elevation.herokuapp.com/recipes/ingredient/${ingredients}`
    )
    .then((result) => {
      let recipesArr = result.data.results.map((r) => {
        return {
          idMeal: r.idMeal,
          title: r.title,
          thumbnail: r.thumbnail,
          href: r.href,
          ingredients: r.ingredients,
        };
      });
      res.send(sensitiveRecipes(req.query, recipesArr));
    });
});
module.exports = router;
