import React from "react";
import { Modal, Spinner } from "reactstrap";
import AddRecipeModal from "../AddRecipeModal/AddRecipeModal";
import RecipeDisplay from "../RecipeDisplay/RecipeDisplay";
import "./MainPage.css";

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      isCreateRecipeOpen: false,
      isLoading: true,
    };
  }

  async componentDidMount() {
    try {
      const res = await fetch(
        "https://recipe-share-backend.herokuapp.com/recipes",
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Something went wrong when trying to get recipes");
      }
      const recipes = await res.json();
      this.setState({ recipes: recipes.data });
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  }

  toggle = () => {
    this.setState({ isCreateRecipeOpen: !this.state.isCreateRecipeOpen });
  };

  navToRecipe = (id) => {
    this.props.history.push(`/recipe/${id}`);
  };

  render() {
    const { recipes, isCreateRecipeOpen } = this.state;
    return (
      <div>
        <h1>Recipe Share</h1>
        {this.state.isLoading ? (
          <Spinner className="spinner" color="danger" />
        ) : this.props.isSignedIn ? (
          <button
            id="add-recipe"
            className="button-secondary"
            onClick={this.toggle}
          >
            Add new recipe
          </button>
        ) : (
          <h6>Create an account to add a new recipe</h6>
        )}
        <Modal isOpen={isCreateRecipeOpen} toggle={this.toggle}>
          <AddRecipeModal
            toggle={this.toggle}
            navToRecipe={this.navToRecipe}
          ></AddRecipeModal>
        </Modal>
        <RecipeDisplay recipes={recipes} />
      </div>
    );
  }
}

export default MainPage;
