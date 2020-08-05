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
  FormFeedback,
  Alert,
  Tooltip,
} from "reactstrap";
import "./AddRecipeModal.css";

class AddRecipeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeName: "",
      isNameInvalid: false,
      recipeCookTimeHour: "00",
      recipeCookTimeMinute: "00",
      recipeIngredients: [""],
      recipeSteps: [""],
      recipeDescription: "",
      isDescriptionInvalid: false,
      recipePicture: "",
      isPictureInvalid: false,
      errMsg: "Unable to create recipe",
      invalidRecipe: false,
      tooltipOpen: false,
    };
  }

  onSumbitRecipe = () => {
    const recipeIngredients = this.state.recipeIngredients.filter(
      (ingredient) => ingredient.trim() !== ""
    );
    const recipeSteps = this.state.recipeSteps.filter(
      (step) => step.trim() !== ""
    );

    // Verify that ingredient and direction list are not empty
    if (recipeIngredients.length === 0) {
      this.setState({ errorMsg: "Please enter at least one ingredient" });
      this.setState({ invalidRecipe: true });
    } else if (recipeSteps.length === 0) {
      this.setState({ errorMsg: "Please enter at least one direction" });
      this.setState({ invalidRecipe: true });
    } else {
      this.setState({ invalidRecipe: false });

      const token = window.sessionStorage.getItem("token");

      // verify valid form input
      if (this.state.recipeName === "") {
        this.setState({ isNameInvalid: true });
      }
      if (this.state.recipeDescription === "") {
        this.setState({ isDescriptionInvalid: true });
      }
      if (!/\.(jpeg|jpg|gif|png)$/.test(this.state.recipePicture)) {
        this.setState({ isPictureInvalid: true });
      }

      fetch("https://recipe-share-backend.herokuapp.com/recipe", {
        method: "post",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({
          name: this.state.recipeName,
          cookTime:
            this.state.recipeCookTimeHour === "00"
              ? `${this.state.recipeCookTimeMinute} mins`
              : `${parseInt(this.state.recipeCookTimeHour, 10)} hr ${
                  this.state.recipeCookTimeMinute
                } mins`,
          ingredients: recipeIngredients,
          steps: recipeSteps,
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
    }
  };

  onNameChange = (event) => {
    this.setState({ recipeName: event.target.value });
    let isNameInvalid = false;
    if (event.target.value.length === 0) {
      isNameInvalid = true;
    }
    this.setState({ isNameInvalid });
  };

  onCookTimeHourChange = (event) => {
    this.setState({ recipeCookTimeHour: event.target.value });
  };

  onCookTimeMinuteChange = (event) => {
    this.setState({ recipeCookTimeMinute: event.target.value });
  };

  onDescriptionChange = (event) => {
    this.setState({ recipeDescription: event.target.value });
    let isDescriptionInvalid = false;
    if (event.target.value.length === 0) {
      isDescriptionInvalid = true;
    }
    this.setState({ isDescriptionInvalid });
  };

  onPictureChange = (event) => {
    this.setState({ recipePicture: event.target.value });
    let isPictureInvalid = false;
    if (!/\.(jpeg|jpg|gif|png)$/.test(event.target.value)) {
      isPictureInvalid = true;
    }
    this.setState({ isPictureInvalid });
  };

  createIngredientsList() {
    return this.state.recipeIngredients.map((ingredient, i) => (
      <div key={i}>
        <InputGroup>
          <Input
            id={`ingredient-input-${i}`}
            type="text"
            value={ingredient || ""}
            placeholder="Add an ingredient for this recipe"
            onChange={this.handleChangeIngredients.bind(this, i)}
          />
          {i !== 0 ? (
            <InputGroupAddon addonType="append">
              <Button
                id={`remove-ingredient-row-${i}`}
                color="danger"
                onClick={this.removeIngredientsClick.bind(this, i)}
              >
                Remove
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
            id={`step-input-${i}`}
            type="textarea"
            value={step || ""}
            placeholder="Add an instruction for completing this recipe"
            onChange={this.handleChangeSteps.bind(this, i)}
          />
          {i !== 0 ? (
            <InputGroupAddon addonType="append">
              <Button
                id={`remove-step-row-${i}`}
                color="danger"
                onClick={this.removeStepsClick.bind(this, i)}
              >
                Remove
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

  generateOptions(min, max) {
    let list = [];
    for (let i = min; i <= max; i++) {
      list.push(("0" + i).slice(-2));
    }
    return list.map((number, i) => <option>{number}</option>);
  }

  toggleTooltip = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  };

  render() {
    const { tooltipOpen } = this.state;
    const { toggle } = this.props;
    return (
      <Fragment>
        <ModalHeader toggle={toggle}>Add a New Recipe</ModalHeader>
        <ModalBody>
          <Form className="add-recipe-form">
            <FormGroup>
              <Label>Recipe Name</Label>
              <Input
                type="text"
                name="recipeName"
                id="recipeName"
                placeholder="Add Recipe Name"
                onChange={this.onNameChange}
                invalid={this.state.isNameInvalid}
              />
              <FormFeedback>Recipe name must not be empty</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                placeholder="Add a brief description of the recipe"
                onChange={this.onDescriptionChange}
                invalid={this.state.isDescriptionInvalid}
              />
              <FormFeedback>Recipe description must not be empty</FormFeedback>
            </FormGroup>
            <Label>Total Cook Time</Label>
            <Form inline className="timeInput">
              <FormGroup>
                Hours:
                <Input
                  type="select"
                  name="cookTimeHours"
                  id="cookTimeHours"
                  onChange={this.onCookTimeHourChange}
                >
                  {this.generateOptions(0, 24)}
                </Input>
                Minutes:
                <Input
                  type="select"
                  name="cookTimeMinutes"
                  id="cookTimeMinutes"
                  onChange={this.onCookTimeMinuteChange}
                >
                  {this.generateOptions(0, 59)}
                </Input>
              </FormGroup>
            </Form>
            <FormGroup invalid>
              <Label>Ingredients</Label>
              {this.createIngredientsList()}
              <input
                className="button-secondary"
                id="add-ingredient-row"
                type="button"
                value="Add row"
                onClick={this.addIngredientsClick.bind(this)}
              />
              <FormFeedback>Recipe cook time must not be empty</FormFeedback>
            </FormGroup>

            <FormGroup invalid>
              <Label>Directions</Label>
              {this.createStepsList()}
              <input
                className="button-secondary"
                id="add-step-row"
                type="button"
                value="Add row"
                onClick={this.addStepsClick.bind(this)}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                Photo{" "}
                <Button id="tooltip" color="secondary">
                  ?
                </Button>
                <Tooltip
                  placement="right"
                  isOpen={tooltipOpen}
                  target="tooltip"
                  toggle={this.toggleTooltip}
                >
                  Please add an existing URL to use as an image for this recipe.
                  Use an image address that ends in jpeg, jpg, gif, or png
                </Tooltip>
              </Label>
              <Input
                type="text"
                name="photo"
                id="photo"
                placeholder="Add a URL of an image to use for this recipe"
                onChange={this.onPictureChange}
                invalid={this.state.isPictureInvalid}
              />
              <FormFeedback>Photo must be a valid image URL</FormFeedback>
            </FormGroup>
          </Form>
          <div>
            {this.state.invalidRecipe && (
              <Alert color="danger">{this.state.errorMsg}</Alert>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            id="create-btn"
            className="button-secondary"
            onClick={this.onSumbitRecipe}
          >
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
