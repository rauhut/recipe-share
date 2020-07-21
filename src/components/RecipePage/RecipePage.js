import React, { Component } from "react";
import "./RecipePage.css";
import {
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

class RecipePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe: {
        name: "",
        cookTime: "",
        description: "",
        ingredients: [],
        steps: [],
        _id: "",
      },
      isLoading: true,
      modal: false,
    };
  }

  componentDidMount() {
    fetch(
      `https://recipe-share-backend.herokuapp.com/recipe/${this.props.match.params.id}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong when trying to get recipe");
        }
      })
      .then((recipe) => {
        this.setState({ recipe: recipe.data });
        this.setState({ isLoading: false });
      })
      .catch((error) => console.log(error));
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  deleteRecipe(id) {
    const token = window.sessionStorage.getItem("token");
    fetch(`https://recipe-share-backend.herokuapp.com/recipe/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => {
        if (response.ok) {
          this.props.history.push("/");
        } else {
          throw new Error("Something went wront with trying to delete recipe");
        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    const {
      name,
      cookTime,
      description,
      ingredients,
      steps,
      picture,
      createdBy,
      _id,
    } = this.state.recipe;
    const { modal } = this.state;
    return (
      <div>
        {this.state.isLoading ? (
          <Spinner className="spinner" color="danger" />
        ) : (
          <div className="recipe">
            <div className="top">
              <button
                className="button-secondary"
                onClick={() => this.props.history.push("/")}
              >
                &laquo; Back
              </button>
              {createdBy === this.props.user.id && (
                <div className="delete-btn">
                  <button className="button-secondary" onClick={this.toggle}>
                    Delete
                  </button>
                  <Modal isOpen={modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>
                      Delete "{name}"?
                    </ModalHeader>
                    <ModalBody>
                      Are you sure that you want to delete this recipe?
                    </ModalBody>
                    <ModalFooter>
                      <button
                        className="button-secondary"
                        onClick={() => this.deleteRecipe(_id)}
                      >
                        Delete
                      </button>{" "}
                      <button className="button-primary" onClick={this.toggle}>
                        Cancel
                      </button>
                    </ModalFooter>
                  </Modal>
                </div>
              )}
            </div>
            <div className="recipe-title">
              <h1>{name}</h1>
            </div>
            <div className="recipe-cooktime">Total Cook Time: {cookTime}</div>
            <div className="recipe-description">{description}</div>
            <hr></hr>
            <div className="recipe-image">
              <img src={picture} alt={name} />
            </div>
            <div className="recipe-ingredients">
              <h3>Ingredients</h3>
              <ul>
                {ingredients.map((ingredent, i) => {
                  return (
                    <li key={i} className="ingredient-item">
                      <label className="container">
                        <input type="checkbox" />
                        {ingredent}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
            <hr></hr>
            <div className="recipe-directions">
              <h3>Directions</h3>
              <ol>
                {steps.map((step, i) => {
                  return (
                    <li key={i} className="directions-item">
                      <label className="direction-container">{step} </label>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default RecipePage;
