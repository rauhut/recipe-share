import React from "react";
import { shallow } from "enzyme";
import ProfileDropdown from "./ProfileDropdown";

describe("ProfileDropdown", () => {
  let wrapper;

  const mockProps = {
    user: {
      id: "123456789",
      username: "testuser",
      recipes: "",
    },
  };

  it("renders for user", () => {
    wrapper = shallow(<ProfileDropdown {...mockProps} />);
    expect(wrapper.debug()).toMatchSnapshot();
  });
});
