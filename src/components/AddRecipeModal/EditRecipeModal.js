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
    };
  }

  async componentDidMount() {
    const recipe = this.props.recipe;
    const cookTimeArray = recipe.cookTime.split(" ");
    let cookTimeHour;
    let cookTimeMinute;

    if (cookTimeArray.length === 4) {
      cookTimeHour = ("0" + cookTimeArray[0]).slice(-2);
      cookTimeMinute = cookTimeArray[2];
    } else {
      cookTimeHour = "00";
      cookTimeMinute = cookTimeArray[0];
    }

    this.setState({
      recipeName: recipe.name,
      recipeCookTimeHour: cookTimeHour,
      recipeCookTimeMinute: cookTimeMinute,
      recipeIngredients: recipe.ingredients,
      recipeSteps: recipe.steps,
      recipeDescription: recipe.description,
      recipePicture: recipe.picture,
    });
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

      fetch(
        `https://recipe-share-backend.herokuapp.com/recipe/${this.props.recipe._id}`,
        {
          method: "put",
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
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            console.log("does this happen?");
            this.props.toggle();
            window.location.reload(false);
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

  generateOptions(min, max, select) {
    let list = [];
    for (let i = min; i <= max; i++) {
      list.push(("0" + i).slice(-2));
    }
    return list.map((number, i) => {
      if (select === number) {
        return <option selected="selected">{number}</option>;
      } else {
        return <option>{number}</option>;
      }
    });
  }

  render() {
    const { toggle } = this.props;
    const {
      recipeName,
      isNameInvalid,
      recipeDescription,
      recipePicture,
      recipeCookTimeHour,
      recipeCookTimeMinute,
    } = this.state;
    return (
      <Fragment>
        <ModalHeader toggle={toggle}>Edit Recipe</ModalHeader>
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
                invalid={isNameInvalid}
                defaultValue={recipeName}
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
                defaultValue={recipeDescription}
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
                  {this.generateOptions(0, 24, recipeCookTimeHour)}
                </Input>
                Minutes:
                <Input
                  type="select"
                  name="cookTimeMinutes"
                  id="cookTimeMinutes"
                  onChange={this.onCookTimeMinuteChange}
                >
                  {this.generateOptions(0, 59, recipeCookTimeMinute)}
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
              {this.createStepsList(this.state)}
              <input
                className="button-secondary"
                id="add-step-row"
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
                invalid={this.state.isPictureInvalid}
                defaultValue={recipePicture}
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
            Edit Recipe
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
