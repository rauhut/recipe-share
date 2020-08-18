import React, { Fragment } from "react";
import { ModalHeader } from "reactstrap";
import RecipeForm from "./RecipeForm";
import "./AddRecipeModal.css";

const EditRecipeModal = ({ toggle, recipe }) => {
  const onSumbitRecipe = (
    recipeName,
    recipeCookTimeHour,
    recipeCookTimeMinute,
    recipeIngredients,
    recipeSteps,
    recipeDescription,
    recipePicture
  ) => {
    const token = window.sessionStorage.getItem("token");

    fetch(`https://recipe-share-backend.herokuapp.com/recipe/${recipe._id}`, {
      method: "put",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        name: recipeName,
        cookTime:
          recipeCookTimeHour === "00"
            ? `${recipeCookTimeMinute} mins`
            : `${parseInt(
                recipeCookTimeHour,
                10
              )} hr ${recipeCookTimeMinute} mins`,
        ingredients: recipeIngredients,
        steps: recipeSteps,
        description: recipeDescription,
        picture: recipePicture,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toggle();
          window.location.reload(false);
        } else {
          throw new Error("Something went wrong when trying to add recipe");
        }
      })
      .catch(console.log);
  };

  return (
    <Fragment>
      <ModalHeader toggle={() => toggle()}>Edit Recipe</ModalHeader>
      <RecipeForm
        submit={onSumbitRecipe}
        defaultRecipe={recipe}
        title={"Edit Recipe"}
        toggle={toggle}
      />
    </Fragment>
  );
};

export default EditRecipeModal;
