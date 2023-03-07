class Renderer {
  constructor(data) {
    this.data = data;
  }
  render() {
    const source = $("#recipe-data").html();
    let template = Handlebars.compile(source);
    const newHTML = template({ results: this.data });
    $(".recipe-container").empty().append(newHTML);
  }
}
