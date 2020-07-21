import React from "react";
import { Modal, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
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

  componentDidMount() {
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
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
      });
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
          <button className="button-secondary" onClick={this.toggle}>
            Add new recipe
          </button>
        ) : (
          <h6>
            <Link to={"/register"}>Create an account to add a new recipe</Link>
          </h6>
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
