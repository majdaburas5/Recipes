const magicNumber = 3;

$(".recipe-container").on("click", ".picture", function () {
  alert($(this).data().id);
});

const fetchRecipeData = () => {
  let input = $("#recipe-input").val();
  let ingredientInput = $("#ingredient-input").val();

  if (input.length == 0) {
    alert("Please fill the input");
  }

  const checkBoxDairy = document.getElementById("dairy");
  const checkBoxGluten = document.getElementById("gluten");

  let queryStringDairy = "";
  let queryStringGluten = "";

  if (checkBoxDairy.checked) {
    queryStringDairy += "dairy=true";
  }
  if (checkBoxGluten.checked) {
    queryStringGluten += "gluten=true";
  }

  $.get(
    `/getRecipe/${input}?${queryStringDairy}&${queryStringGluten}&index=${this.index}`
  ).then((recipesData) => {
    let flag = 0;
    let ingredientNotInclude = [];
    for (let recipe of recipesData) {
      for (let ingredient of recipe.ingredients) {
        if (ingredientInput == ingredient) flag++;
      }
      if (flag == 0) ingredientNotInclude.push(recipe);
    }
    let render = new Renderer(ingredientNotInclude);
    render.render();
  });
};

this.index = 0;

$(".back").on("click", () => {
  if (this.index > 0) this.index -= magicNumber;
  fetchRecipeData();
});

$(".next").on("click", () => {
  this.index += magicNumber;
  fetchRecipeData();
});
