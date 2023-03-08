const magicNumber = 3;

$(".recipe-container").on("click", ".picture", function () {
  alert($(this).data().id);
});

const fetchRecipeData = () => {
  let input = $("#recipe-input").val();
  let unwantedIngredientInput = $("#unwantedIngredient-input").val();

  // if (input.length == 0) {
  //   $("#noMatch").empty().append("you must enter an ingredient");
  // }
  $("#noMatch").empty();
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
    `/getRecipe/${input}?${queryStringDairy}&${queryStringGluten}&index=${this.index}&unwantedIngredient=${unwantedIngredientInput}`
  )
    .then((recipesData) => {
      let render = new Renderer(recipesData);
      if (recipesData.length == 0) {
        $(".recipe-container").empty();
      } else {
        render.render();
      }
    })
    .catch((err) => {
      $(".recipe-container").empty();
      $("#noMatch").empty().append("you must enter  a valid input");
      if (err.status == 400) {
        $(".recipe-container").empty().append(err.responseJSON.error);
      }
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
