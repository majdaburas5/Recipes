let favoritesData = { favoriteArr: [] };

const fetchRecipeData = function () {
  let input = $("#recipe-input").val();

  $.get(`getRecipe/${input}`).then((recipesData) => {
    let recipes = [];

    for (let recipe of recipesData.results) {
      let recipeData = {};

      let idMeal = recipe.idMeal;
      let recipeTitle = recipe.title;
      let recipePicture = recipe.thumbnail;
      let recipeHref = recipe.href;

      recipeData["idMeal"] = idMeal;
      recipeData["title"] = recipeTitle;
      recipeData["thumbnail"] = recipePicture;
      recipeData["href"] = recipeHref;

      let ingredients = [];
      for (let ingredient of recipe.ingredients) {
        ingredients.push(ingredient);
      }
      recipeData["ingredients"] = ingredients;

      recipes.push(recipeData);
    }
    console.log("recipes", recipes);

    $(".recipe-container").on("click", ".picture", function () {
      alert($(this).data().id);
    });

    $(".recipe-container").on("click", ".favorite", function () {
      let id = $(this).data().id;
      for (let recipe of recipesData.results) {
        if (id == recipe.idMeal) {
          let favorite = {};
          let idMeal = recipe.idMeal;
          let recipeTitle = recipe.title;
          let recipePicture = recipe.thumbnail;
          let recipeHref = recipe.href;
          let ingredients = recipe.ingredients;

          favorite["idMeal"] = idMeal;
          favorite["title"] = recipeTitle;
          favorite["thumbnail"] = recipePicture;
          favorite["href"] = recipeHref;
          favorite["ingredients"] = ingredients;
          // if (favoritesData.favoriteArr.includes(favorite))
          //   alert("The recipe already exist in favorite");
          // else
          favoritesData.favoriteArr.push(favorite);
        }
      }
      console.log(favoritesData.favoriteArr);
    });
    checkBox(recipesData);
  });
};

const deleteFavorite = function () {
  let id = $(this).data().id;
  for (let recipe in favoritesData.favoriteArr) {
    if (id == favoritesData.favoriteArr[recipe].idMeal) {
      favoritesData.favoriteArr.splice(recipe, 1);
    }
    console.log(recipe);
  }
  renderFavorites();
};

const renderFavorites = function () {
  $(".recipe-container").empty();
  const sourceFavorite = $("#favorite-data").html();
  const favoriteTemplate = Handlebars.compile(sourceFavorite);
  const newHTML = favoriteTemplate({ results: favoritesData.favoriteArr });
  $(".recipe-container").append(newHTML);
};

const checkBox = function (recipesData) {
  $(".recipe-container").empty();
  const sourceRecipe = $("#recipe-data").html();
  const recipeTemplate = Handlebars.compile(sourceRecipe);

  let dairyIngredients = [
    "Cream",
    "Cheese",
    "Milk",
    "Butter",
    "Creme",
    "Ricotta",
    "Mozzarella",
    "Custard",
    "Cream Cheese",
  ];

  let glutenIngredients = ["Flour", "Bread", "spaghetti", "Biscuits", "Beer"];

  const cbd = document.getElementById("dairy");
  const cbg = document.getElementById("gluten");

  if (cbd.checked == true && cbg.checked == true) {
    let dairyGluten = [];
    for (let recipe of recipesData.results) {
      let flag = 0;
      for (let ingredient of recipe.ingredients) {
        for (let gluten of glutenIngredients) {
          if (ingredient == gluten) flag++;
        }
        for (let dairy of dairyIngredients) {
          if (ingredient == dairy) flag++;
        }
      }
      if (flag == 0) {
        dairyGluten.push(recipe);
      }
    }
    const newHTML = recipeTemplate({ results: dairyGluten });
    $(".recipe-container").append(newHTML);
  } else if (cbd.checked) {
    let dairyFree = [];
    for (let recipe of recipesData.results) {
      let flag = 0;
      for (let ingredient of recipe.ingredients) {
        for (let dairy of dairyIngredients) {
          if (ingredient == dairy) {
            flag++;
          }
        }
      }
      if (flag == 0) {
        dairyFree.push(recipe);
      }
    }
    const newHTML = recipeTemplate({ results: dairyFree });
    $(".recipe-container").append(newHTML);
  } else if (cbg.checked) {
    let glutenFree = [];
    for (let recipe of recipesData.results) {
      let flag = 0;
      for (let ingredient of recipe.ingredients) {
        for (let gluten of glutenIngredients) {
          if (ingredient == gluten) {
            flag++;
          }
        }
      }
      if (flag == 0) {
        glutenFree.push(recipe);
      }
    }
    const newHTML = recipeTemplate({ results: glutenFree });
    $(".recipe-container").append(newHTML);
  } else {
    const newHTML = recipeTemplate(recipesData);
    $(".recipe-container").append(newHTML);
  }
};
