import React from "react";
import { shallow } from "enzyme";
import EditRecipeModal from "./EditRecipeModal";

describe("EditRecipeModal", () => {
  let wrapper;

  const mockProps = {
    toggle: true,
    recipe: {
      name: "meatballs",
      ingredients: ["ground beef", "eggs", "bread crumbs", "garlic", "onion"],
      steps: ["step 1", "step 2", "step 3"],
      cookTime: "30 mins",
      description: "just basic meatballs",
    },
  };

  beforeEach(() => {
    wrapper = shallow(<EditRecipeModal {...mockProps} />);
  });

  it("renders without crashing", () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });
});
