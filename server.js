const axios = require("axios");
const { json } = require("express");
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "node_modules")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3000;
app.listen(port, function () {
  console.log(`Running server on port ${port}`);
});

app.get("/getRecipe/:ingredient", function (req, res) {
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
      res.send(recipesArr);
    });
});
