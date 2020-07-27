import React from "react";
import { shallow } from "enzyme";
import App from "./App";

describe("App", () => {
  let wrapper;

  const initialState = {
    isSignedIn: false,
    user: {
      id: "",
      username: "",
      recipes: "",
    },
    searchEntry: "",
    filteredRecipes: [],
  };

  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it("renders page without crashing", () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("updates state on onRouteChange", () => {
    wrapper.instance().onRouteChange("signout");
    expect(wrapper.state("isSignedIn")).toEqual(false);
    expect(wrapper.state("initialState")).toEqual(initialState);
    wrapper.instance().onRouteChange("signingIn");
    expect(wrapper.state("isSignedIn")).toEqual(true);
  });

  it("updates search field on text input", () => {
    wrapper.instance().onRecipeSearch("test search");
    expect(wrapper.state("searchEntry")).toEqual("test search");
  });

  it("updates user on loadUser call", () => {
    const mockUserData = {
      _id: "123456789",
      username: "testuser",
      recipes: "",
    };
    wrapper.instance().loadUser(mockUserData);
    expect(wrapper.state("user")).toEqual({
      id: "123456789",
      username: "testuser",
      recipes: "",
    });
  });
});
