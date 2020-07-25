import React from "react";
import { shallow } from "enzyme";
import RecipeDisplay from "./RecipeDisplay";

const recipes = [
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

describe("RecipeDisplay", () => {
  it("renders without crashing", () => {
    expect(
      shallow(<RecipeDisplay recipes={recipes} />).debug()
    ).toMatchSnapshot();
  });
});
