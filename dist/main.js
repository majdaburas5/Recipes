const fetchRecipeData = function () {
  let input = $("#recipe-input").val();

  $.get(`getRecipe/${input}`).then((recipesData) => {
    $(".recipe-container").on("click", ".favorite", function () {
      let id = $(this).data().id;
      addFavorite(recipesData, id);
    });

    checkBox(recipesData);
    pagination(recipesData);
  });
};

$(".recipe-container").on("click", ".picture", function () {
  alert($(this).data().id);
});

let favoritesData = { favoriteArr: [] };

const addFavorite = function (recipesData, id) {
  let favorite = {};
  for (let recipe of recipesData) {
    if (id == recipe.idMeal) {
      favorite["idMeal"] = recipe.idMeal;
      favorite["title"] = recipe.title;
      favorite["thumbnail"] = recipe.thumbnail;
      favorite["href"] = recipe.href;
      favorite["ingredients"] = recipe.ingredients;

      if (favoritesData.favoriteArr.some((a) => a.idMeal == recipe.idMeal))
        alert("This recipe is existing in favorites");
      else favoritesData.favoriteArr.push(favorite);
    }
  }
  console.log(favoritesData.favoriteArr);
};

$(".recipe-container").on("click", ".delete", function () {
  let id = $(this).data().id;
  deleteFavorite(id);
});

const deleteFavorite = function (id) {
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
  const sourceRecipe = $("#pagination-data").html();
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

  const checkBoxDairy = document.getElementById("dairy");
  const checkBoxGluten = document.getElementById("gluten");

  if (checkBoxDairy.checked == true && checkBoxGluten.checked == true) {
    let dairyGluten = [];
    for (let recipe of recipesData) {
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
  } else if (checkBoxDairy.checked) {
    let dairyFree = [];
    for (let recipe of recipesData) {
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
  } else if (checkBoxGluten.checked) {
    let glutenFree = [];
    for (let recipe of recipesData) {
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
    const newHTML = recipeTemplate({ results: recipesData });
    $(".recipe-container").append(newHTML);
  }
};

const pagination = function (recipesData) {
  let pages = recipesData.length; //cheese length = 6

  if (pages % 2 == 0) {
    return pages / 2; //evenPage=3
  } else {
    return Math.floor(pages / 2) + 1; //oddPage=0
  }
};

let pages1 = { page1: [] };

const renderPagination1 = function (recipesData) {
  $(".recipe-container").empty();
  const sourcePage = $("#pagination-data").html();
  const pageTemplate = Handlebars.compile(sourcePage);
  let pageNum = pagination();
  for (let i = 0; i < pageNum; i++) {
    page1.push(recipesData[i]);
  }
  const newHTML = pageTemplate({ results: pages1 });
  $(".recipe-container").append(newHTML);
};

let pages2 = { page2: [] };

const renderPagination2 = function (recipesData) {
  $(".recipe-container").empty();
  const sourcePage = $("#pagination-data").html();
  const pageTemplate = Handlebars.compile(sourcePage);
  let pages = recipesData.length;
  let pageNum = pagination();
  for (let i = pageNum; i < pages; i++) {
    page2.push(recipesData[i]);
  }
  const newHTML = pageTemplate({ results: pages2 });
  $(".recipe-container").append(newHTML);
};
