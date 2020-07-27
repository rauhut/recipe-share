import React from "react";
import { shallow, mount } from "enzyme";
import MainPage from "./MainPage";
import { MemoryRouter } from "react-router-dom";

describe("RecipeDisplay", () => {
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

  afterEach(() => {
    wrapper.unmount();
  });

  it("renders loading state without crashing", () => {
    wrapper = shallow(<MainPage {...mockPropsSignedIn} />);
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("renders page as logged out user without crashing", () => {
    wrapper = shallow(<MainPage {...mockPropsSignedOut} />);
    wrapper.setState({ isLoading: false });
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("renders page as logged in user without crashing", () => {
    wrapper = shallow(<MainPage {...mockPropsSignedIn} />);
    wrapper.setState({ isLoading: false });
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("can toggle the add recipe modal", () => {
    wrapper = shallow(<MainPage {...mockPropsSignedIn} />);
    wrapper.setState({ isLoading: false });
    wrapper.find('[id="add-recipe"]').simulate("click");
    expect(wrapper.state("isCreateRecipeOpen")).toEqual(true);
  });

  it("displays the recipes and hide loading spinner on api call success", (done) => {
    global.fetch = jest.fn();

    wrapper = shallow(<MainPage {...mockPropsSignedIn} />, {
      disableLifecycleMethods: true,
    });

    const spyDidMount = jest.spyOn(MainPage.prototype, "componentDidMount");

    fetch.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => {
          return Promise.resolve({
            data: [
              {
                name: "cookies",
                ingredients: ["flour", "sugar", "butter", "salt", "chocolate"],
                steps: ["step 1", "step 2", "step 3"],
                cookTime: "30 mins",
                description: "just basic cookies",
              },
              {
                name: "meatballs",
                ingredients: [
                  "ground beef",
                  "eggs",
                  "bread crumbs",
                  "garlic",
                  "onion",
                ],
                steps: ["step 1", "step 2", "step 3"],
                cookTime: "30 mins",
                description: "just basic meatballs",
              },
            ],
          });
        },
      });
    });

    const didMount = wrapper.instance().componentDidMount();

    expect(spyDidMount).toHaveBeenCalled();

    didMount.then(() => {
      wrapper.update();
      expect(wrapper.state("recipes")).toEqual([
        {
          name: "cookies",
          ingredients: ["flour", "sugar", "butter", "salt", "chocolate"],
          steps: ["step 1", "step 2", "step 3"],
          cookTime: "30 mins",
          description: "just basic cookies",
        },
        {
          name: "meatballs",
          ingredients: [
            "ground beef",
            "eggs",
            "bread crumbs",
            "garlic",
            "onion",
          ],
          steps: ["step 1", "step 2", "step 3"],
          cookTime: "30 mins",
          description: "just basic meatballs",
        },
      ]);
      expect(wrapper.state("isLoading")).toEqual(false);
      spyDidMount.mockRestore();
      fetch.mockClear();
      done();
    });
  });
});
