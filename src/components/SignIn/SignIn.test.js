import React from "react";
import { shallow } from "enzyme";
import SignIn from "./SignIn";

describe("SignIn", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SignIn />);
  });

  it("renders for user", () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("updates username on text entry", () => {
    wrapper.find('[id="username"]').simulate("change", {
      target: { value: "valid-username" },
    });
    expect(wrapper.state("signInUsername")).toEqual("valid-username");
  });

  it("updates password on text entry", () => {
    wrapper.find('[id="password"]').simulate("change", {
      target: { value: "valid-password" },
    });
    expect(wrapper.state("signInPassword")).toEqual("valid-password");
  });
});
