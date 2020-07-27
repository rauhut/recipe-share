import React from "react";
import { shallow } from "enzyme";
import Register from "./Register";

describe("Register", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Register />);
  });

  it("renders for user", () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it("updates username on text entry and sets state to invalid if empty", () => {
    wrapper.find('[id="username"]').simulate("change", {
      target: { value: "" },
    });
    expect(wrapper.state("registerUsername")).toEqual("");
    expect(wrapper.state("isUsernameInvalid")).toEqual(true);
    wrapper.find('[id="username"]').simulate("change", {
      target: { value: "valid-username" },
    });
    expect(wrapper.state("registerUsername")).toEqual("valid-username");
    expect(wrapper.state("isUsernameInvalid")).toEqual(false);
  });

  it("updates password on text entry and sets state to invalid if empty", () => {
    wrapper.find('[id="password"]').simulate("change", {
      target: { value: "" },
    });
    expect(wrapper.state("registerPassword")).toEqual("");
    expect(wrapper.state("isPasswordInvalid")).toEqual(true);
    wrapper.find('[id="password"]').simulate("change", {
      target: { value: "valid-password" },
    });
    expect(wrapper.state("registerPassword")).toEqual("valid-password");
    expect(wrapper.state("isPasswordInvalid")).toEqual(false);
  });
});
