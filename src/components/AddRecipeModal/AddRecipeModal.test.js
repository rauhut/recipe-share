import React from "react";
import { shallow } from "enzyme";
import AddRecipeModal from "./AddRecipeModal";

describe("AddRecipeModal", () => {
  let wrapper;

  const mockProps = {
    toggle: true,
  };

  beforeEach(() => {
    wrapper = shallow(<AddRecipeModal {...mockProps} />);
  });

  it("renders without crashing", () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });
});
