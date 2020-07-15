import React, { Fragment } from "react";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Label,
  Input,
  FormGroup,
  InputGroup,
  Button,
  InputGroupAddon,
} from "reactstrap";
import "./AddRecipeModal.css";

class AddRecipeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreateRecipeOpen: false,
      recipeName: "",
      recipeCookTime: "",
      recipeIngredients: [""],
      recipeSteps: [""],
      recipeDescription: "",
      recipePicture: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onSumbitRecipe = () => {
    const token = window.sessionStorage.getItem("token");
    console.log(this.state);
    fetch("http://localhost:3000/recipe", {
      method: "post",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        name: this.state.recipeName,
        cookTime: this.state.recipeCookTime,
        ingredients: this.state.recipeIngredients,
        steps: this.state.recipeSteps,
        description: this.state.recipeDescription,
        picture: this.state.recipePicture,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          this.props.toggle();
          this.props.navToRecipe(data.id);
        } else {
          throw new Error("Something went wrong when trying to add recipe");
        }
      })
      .catch(console.log);
  };

  onNameChange = (event) => {
    this.setState({ recipeName: event.target.value });
  };

  onCookTimeChange = (event) => {
    this.setState({ recipeCookTime: event.target.value });
  };

  onDescriptionChange = (event) => {
    this.setState({ recipeDescription: event.target.value });
  };

  onPictureChange = (event) => {
    this.setState({ recipePicture: event.target.value });
  };

  createIngredientsList() {
    return this.state.recipeIngredients.map((ingredient, i) => (
      <div key={i}>
        <InputGroup>
          <Input
            type="text"
            value={ingredient || ""}
            onChange={this.handleChangeIngredients.bind(this, i)}
          />
          {i !== 0 ? (
            <InputGroupAddon addonType="append">
              <Button
                color="danger"
                onClick={this.removeIngredientsClick.bind(this, i)}
              >
                -
              </Button>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      </div>
    ));
  }

  handleChangeIngredients(i, event) {
    let recipeIngredients = [...this.state.recipeIngredients];
    recipeIngredients[i] = event.target.value;
    this.setState({ recipeIngredients });
  }

  addIngredientsClick() {
    this.setState((prevState) => ({
      recipeIngredients: [...prevState.recipeIngredients, ""],
    }));
  }

  removeIngredientsClick(i) {
    let recipeIngredients = [...this.state.recipeIngredients];
    recipeIngredients.splice(i, 1);
    this.setState({ recipeIngredients });
  }

  createStepsList() {
    return this.state.recipeSteps.map((step, i) => (
      <div key={i}>
        <InputGroup>
          <Input
            type="textarea"
            value={step || ""}
            onChange={this.handleChangeSteps.bind(this, i)}
          />
          {i !== 0 ? (
            <InputGroupAddon addonType="append">
              <Button
                color="danger"
                onClick={this.removeStepsClick.bind(this, i)}
              >
                -
              </Button>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      </div>
    ));
  }

  handleChangeSteps(i, event) {
    let recipeSteps = [...this.state.recipeSteps];
    recipeSteps[i] = event.target.value;
    this.setState({ recipeSteps });
  }

  addStepsClick() {
    this.setState((prevState) => ({
      recipeSteps: [...prevState.recipeSteps, ""],
    }));
  }

  removeStepsClick(i) {
    let recipeSteps = [...this.state.recipeSteps];
    recipeSteps.splice(i, 1);
    this.setState({ recipeSteps });
  }

  handleSubmit(event) {
    alert("A recipe was submitted: " + this.state.recipeIngredients.join(", "));
    event.preventDefault();
  }

  render() {
    const { toggle } = this.props;
    return (
      <Fragment>
        <ModalHeader toggle={toggle}>Add a New Recipe</ModalHeader>
        <ModalBody>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label>Recipe Name</Label>
              <Input
                type="text"
                name="recipeName"
                id="recipeName"
                placeholder="Add Recipe Name"
                onChange={this.onNameChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                placeholder="Add a brief description of the recipe"
                onChange={this.onDescriptionChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Total Cook Time</Label>
              <Input
                type="number"
                name="cookTime"
                id="cookTime"
                onChange={this.onCookTimeChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Ingredients</Label>
              {this.createIngredientsList()}
              <input
                className="button-secondary"
                type="button"
                value="Add row"
                onClick={this.addIngredientsClick.bind(this)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Steps</Label>
              {this.createStepsList()}
              <input
                className="button-secondary"
                type="button"
                value="Add row"
                onClick={this.addStepsClick.bind(this)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Photo</Label>
              <Input
                type="text"
                name="photo"
                id="photo"
                placeholder="Add a URL for a photo to use for this recipe"
                onChange={this.onPictureChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <button className="button-secondary" onClick={this.onSumbitRecipe}>
            Add Recipe
          </button>{" "}
          <button className="button-secondary" onClick={toggle}>
            Cancel
          </button>
        </ModalFooter>
      </Fragment>
    );
  }
}

export default AddRecipeModal;
