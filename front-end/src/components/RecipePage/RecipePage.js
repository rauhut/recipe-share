import React, { Component } from "react";
import "./RecipePage.css";

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
          <h3>Ingredients:</h3>
          <ul>
            {ingredients.map((ingredent) => {
              return (
                <li className="ingredient-item">
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
          <h3>Directions:</h3>
          <ol>
            {steps.map((step) => {
              return <li className="directions-item">{step}</li>;
            })}
          </ol>
        </div>
      </div>
    );
  }
}

export default RecipePage;
