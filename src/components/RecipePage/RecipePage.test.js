import React from "react";
import { shallow } from "enzyme";
import RecipePage from "./RecipePage";

describe("RecipePage", () => {
  let wrapper;

  const mockRecipe = {
    name: "meatballs",
    ingredients: ["ground beef", "eggs", "bread crumbs", "garlic", "onion"],
    steps: ["step 1", "step 2", "step 3"],
    cookTime: "30 mins",
    description: "just basic meatballs",
    createdBy: "1234567890",
    _id: "5678",
  };
  const mockUser = {
    id: "1234567890",
    username: "testUser",
  };
  const mockMatch = {
    params: {
      id: "5678",
    },
  };
  const mockProps = {
    user: mockUser,
    match: mockMatch,
  };

  it("renders loading state without crashing", () => {
    expect(shallow(<RecipePage {...mockProps} />).debug()).toMatchSnapshot();
  });

  it("renders component after load without crashing", () => {
    wrapper = shallow(<RecipePage {...mockProps} />);
    wrapper.setState({ isLoading: false, recipe: mockRecipe });
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("renders component with delete recipe modal open", () => {
    wrapper = shallow(<RecipePage {...mockProps} />);
    wrapper.setState({ modal: true, isLoading: false, recipe: mockRecipe });
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("opens delete modal when delete button is clicked", () => {
    wrapper = shallow(<RecipePage {...mockProps} />);
    wrapper.setState({ isLoading: false, recipe: mockRecipe });
    wrapper.find('[id="delete-btn"]').simulate("click");
    expect(wrapper.state("modal")).toEqual(true);
  });

  it("closes delete modal when cancel button is clicked", () => {
    wrapper = shallow(<RecipePage {...mockProps} />);
    wrapper.setState({ isLoading: false, recipe: mockRecipe, modal: true });
    wrapper.find('[id="cancel-btn"]').simulate("click");
    expect(wrapper.state("modal")).toEqual(false);
  });
});
