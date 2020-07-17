import React from "react";
import {
  Card,
  CardImg,
  CardTitle,
  CardText,
  CardSubtitle,
  CardBody,
} from "reactstrap";
import { Link } from "react-router-dom";

const RecipeDisplay = ({ recipes }) => {
  return (
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
  );
};

export default RecipeDisplay;
