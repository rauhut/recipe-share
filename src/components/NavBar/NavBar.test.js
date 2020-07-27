import React from "react";
import { shallow } from "enzyme";
import NavBar from "./NavBar";

describe("NavBar", () => {
  let wrapper;

  const mockPropsSignedIn = {
    isSignedIn: true,
    user: {
      id: "123456789",
      username: "testuser",
      recipes: "",
    },
  };

  const mockPropsSignedOut = {
    isSignedIn: false,
    user: {},
  };

  it("renders for signedin user", () => {
    wrapper = shallow(<NavBar {...mockPropsSignedIn} />);
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("renders for signed out user", () => {
    wrapper = shallow(<NavBar {...mockPropsSignedOut} />);
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("toggles the nav bar on click", () => {
    wrapper.find('[id="nav-toggle"]').simulate("click");
    expect(wrapper.state("isOpen")).toEqual(true);
  });

  it("should update search input state on text change", () => {
    wrapper.find('[id="searchInput"]').simulate("change", {
      target: { value: "test input" },
    });
    expect(wrapper.state("searchEntry")).toEqual("test input");
  });
});
