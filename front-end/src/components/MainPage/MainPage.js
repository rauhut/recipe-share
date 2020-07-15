import React from "react";
import {
  Card,
  CardImg,
  CardTitle,
  CardText,
  CardSubtitle,
  CardBody,
  Modal,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./MainPage.css";
import AddRecipeModal from "../AddRecipeModal/AddRecipeModal";

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      isCreateRecipeOpen: false,
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/recipes", {
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
      })
      .catch((error) => console.log(error));
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
        <h1>Main Page</h1>
        {this.props.isSignedIn ? (
          <button className="button-secondary" onClick={this.toggle}>
            Add new recipe
          </button>
        ) : (
          <p>create an account to add a new recipe</p>
        )}
        <Modal isOpen={isCreateRecipeOpen} toggle={this.toggle}>
          <AddRecipeModal
            toggle={this.toggle}
            navToRecipe={this.navToRecipe}
          ></AddRecipeModal>
        </Modal>
        {recipes.length === 0 ? (
          <h3> There are currently no recipes :( ) </h3>
        ) : (
          <div className="recipe-card-grid">
            {recipes.map((recipe) => {
              return (
                <Card>
                  <CardImg
                    top
                    width="100%"
                    src={recipe.picture}
                    alt="Card image cap"
                  />
                  <CardBody>
                    <CardTitle>{recipe.name}</CardTitle>
                    <CardSubtitle>{recipe.cookTime}</CardSubtitle>
                    <CardText>{recipe.description}</CardText>
                    <Link to={`/recipe/${recipe._id}`}>
                      <button className="button-secondary">View Recipe</button>
                    </Link>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default MainPage;
