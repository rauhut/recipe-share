import React, { Component } from "react";
import "./RecipePage.css";
import { Spinner } from "reactstrap";

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
      },
      isLoading: true,
    };
  }

  componentDidMount() {
    fetch(`http://localhost:3000/recipe/${this.props.match.params.id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
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

  render() {
    const {
      name,
      cookTime,
      description,
      ingredients,
      steps,
      picture,
    } = this.state.recipe;
    return (
      <div>
        {this.state.isLoading ? (
          <Spinner className="spinner" color="danger" />
        ) : (
          <div className="recipe">
            <button
              className="button-secondary"
              onClick={() => this.props.history.push("/")}
            >
              &laquo; Back
            </button>
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
