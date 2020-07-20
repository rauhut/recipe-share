import React from "react";
import RecipeDisplay from "../RecipeDisplay/RecipeDisplay";

class ResultsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      recipes: [],
    };
  }

  componentDidMount = () => {
    fetch("https://recipe-share-backend.herokuapp.com/recipes", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong when trying to get recipes");
        }
      })
      .then((recipes) => {
        this.setState({ recipes: recipes.data });
        this.setState({ isLoading: false });
      })
      .catch((error) => console.log(error));
  };

  filterRecipes = () => {
    return this.state.recipes.filter((recipe) => {
      return recipe.name
        .toLowerCase()
        .includes(this.props.searchEntry.toLowerCase());
    });
  };

  render() {
    return (
      <div>
        <h1>Search Results for "{this.props.searchEntry}"</h1>
        <RecipeDisplay recipes={this.filterRecipes()} />
      </div>
    );
  }
}

export default ResultsPage;
