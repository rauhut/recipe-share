import React from "react";
import { shallow } from "enzyme";
import RecipeForm from "./RecipeForm";

describe("RecipeForm", () => {
  let wrapper;

  const mockProps = {
    defaultRecipe: {
      name: "",
      ingredients: [""],
      steps: [""],
      cookTime: "",
      description: "",
    },
    title: "Add Recipe",
  };

  beforeEach(() => {
    wrapper = shallow(<RecipeForm {...mockProps} />);
  });

  it("renders without crashing", () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("renders with error states for empty fields", () => {
    wrapper.setState({
      isNameInvalid: true,
      isDescriptionInvalid: true,
      isPictureInvalid: true,
    });
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("renders error when ingredients list is empty", () => {
    wrapper.setState({ recipeSteps: ["one step"] });
    wrapper.find('[id="submit-btn"]').simulate("click");
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("renders error when steps list is empty", () => {
    wrapper.setState({ recipeIngredients: ["one ingredient"] });
    wrapper.find('[id="submit-btn"]').simulate("click");
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("renders ingredient list rows on add and delete", () => {
    wrapper.find('[id="ingredient-input-0"]').simulate("change", {
      target: { value: "ingredient one" },
    });
    wrapper.find('[id="add-ingredient-row"]').simulate("click");
    expect(wrapper.debug()).toMatchSnapshot();
    wrapper.find('[id="remove-ingredient-row-1"]').simulate("click");
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("renders steps list rows on add and delete", () => {
    wrapper.find('[id="step-input-0"]').simulate("change", {
      target: { value: "step one" },
    });
    wrapper.find('[id="add-step-row"]').simulate("click");
    expect(wrapper.debug()).toMatchSnapshot();
    wrapper.find('[id="remove-step-row-1"]').simulate("click");
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("should update recipePicture and isPictureInvalid states on picture update", () => {
    wrapper.find('[id="photo"]').simulate("change", {
      target: { value: "invalid-url" },
    });
    expect(wrapper.state("recipePicture")).toEqual("invalid-url");
    expect(wrapper.state("isPictureInvalid")).toEqual(true);
    wrapper.find('[id="photo"]').simulate("change", {
      target: { value: "valid.jpg" },
    });
    expect(wrapper.state("recipePicture")).toEqual("valid.jpg");
    expect(wrapper.state("isPictureInvalid")).toEqual(false);
  });

  it("should update recipeDescription and isDescriptionInvalid states on descritpion update", () => {
    wrapper.find('[id="description"]').simulate("change", {
      target: { value: "" },
    });
    expect(wrapper.state("recipeDescription")).toEqual("");
    expect(wrapper.state("isDescriptionInvalid")).toEqual(true);
    wrapper.find('[id="description"]').simulate("change", {
      target: { value: "valid description" },
    });
    expect(wrapper.state("recipeDescription")).toEqual("valid description");
    expect(wrapper.state("isDescriptionInvalid")).toEqual(false);
  });

  it("should update recipeName and isNameInvalid states on name update", () => {
    wrapper.find('[id="recipeName"]').simulate("change", {
      target: { value: "" },
    });
    expect(wrapper.state("recipeName")).toEqual("");
    expect(wrapper.state("isNameInvalid")).toEqual(true);
    wrapper.find('[id="recipeName"]').simulate("change", {
      target: { value: "valid name" },
    });
    expect(wrapper.state("recipeName")).toEqual("valid name");
    expect(wrapper.state("isNameInvalid")).toEqual(false);
  });

  it("should update recipeCookTimeMinute state on recipe minutes update", () => {
    wrapper.find('[id="cookTimeMinutes"]').simulate("change", {
      target: { value: "30" },
    });
    expect(wrapper.state("recipeCookTimeMinute")).toEqual("30");
  });

  it("should update recipeCookTimeHour state on recipe hours update", () => {
    wrapper.find('[id="cookTimeHours"]').simulate("change", {
      target: { value: "02" },
    });
    expect(wrapper.state("recipeCookTimeHour")).toEqual("02");
  });
});
