import React from "react";
import { shallow } from "enzyme";
import ResultsPage from "./ResultsPage";

describe("ResultsPage", () => {
  let wrapper;

  const mockProps = {
    searchEntry: "test",
  };

  const mockRecipes = [
    {
      name: "cookies",
      ingredients: ["flour", "sugar", "butter", "salt", "chocolate"],
      steps: ["step 1", "step 2", "step 3"],
      cookTime: "30 mins",
      description: "just basic cookies",
    },
    {
      name: "meatballs",
      ingredients: ["ground beef", "eggs", "bread crumbs", "garlic", "onion"],
      steps: ["step 1", "step 2", "step 3"],
      cookTime: "30 mins",
      description: "just basic meatballs",
    },
  ];

  it("renders page with resultswithout crashing", () => {
    wrapper = shallow(<ResultsPage {...mockProps} />);
    wrapper.setState({ recipes: mockRecipes });
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("displays the recipes and hide loading spinner on api call success", (done) => {
    global.fetch = jest.fn();

    wrapper = shallow(<ResultsPage {...mockProps} />, {
      disableLifecycleMethods: true,
    });

    const spyDidMount = jest.spyOn(ResultsPage.prototype, "componentDidMount");

    fetch.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => {
          return Promise.resolve({
            data: mockRecipes,
          });
        },
      });
    });

    const didMount = wrapper.instance().componentDidMount();

    expect(spyDidMount).toHaveBeenCalled();

    didMount.then(() => {
      wrapper.update();
      expect(wrapper.state("recipes")).toEqual(mockRecipes);
      expect(wrapper.state("isLoading")).toEqual(false);
      spyDidMount.mockRestore();
      fetch.mockClear();
      done();
    });
  });

  it("filtered recipes correctly- one result", () => {
    const mockPropsOneResult = {
      searchEntry: "cookies",
    };
    wrapper = shallow(<ResultsPage {...mockPropsOneResult} />);
    wrapper.setState({ recipes: mockRecipes });
    expect(wrapper.instance().filterRecipes()).toEqual([
      {
        name: "cookies",
        ingredients: ["flour", "sugar", "butter", "salt", "chocolate"],
        steps: ["step 1", "step 2", "step 3"],
        cookTime: "30 mins",
        description: "just basic cookies",
      },
    ]);
  });

  it("filtered recipes correctly- no result", () => {
    const mockPropsOneResult = {
      searchEntry: "z",
    };
    wrapper = shallow(<ResultsPage {...mockPropsOneResult} />);
    wrapper.setState({ recipes: mockRecipes });
    expect(wrapper.instance().filterRecipes()).toEqual([]);
  });
});
