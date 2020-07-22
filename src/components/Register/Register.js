import React from "react";
import { Form, FormGroup, Label, Input, FormFeedback, Alert } from "reactstrap";
import "./Register.css";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registerUsername: "",
      isUsernameInvalid: false,
      errorMsg: "Unable to register",
      registerPassword: "",
      isPasswordInvalid: false,
      // registerName: "",
      // isNameInvalid: false,
      isLoading: false,
      invalidLogin: false,
    };
  }

  onUsernameChange = (event) => {
    this.setState({ registerUsername: event.target.value });
    let registerUsername = false;
    if (event.target.value.length === 0) {
      registerUsername = true;
    }
    this.setState({ registerUsername });
  };

  onPasswordChange = (event) => {
    this.setState({ registerPassword: event.target.value });
    let isPasswordInvalid = false;
    if (event.target.value.length === 0) {
      isPasswordInvalid = true;
    }
    this.setState({ isPasswordInvalid });
  };

  saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem("token", token);
  };

  onSubmitRegister = () => {
    this.setState({ isLoading: true });

    if (this.state.registerUsername === "") {
      this.setState({ isNameInvalid: true });
    }
    if (this.state.registerPassword === "") {
      this.setState({ isPasswordInvalid: true });
    }

    fetch("https://recipe-share-backend.herokuapp.com/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.registerUsername,
        password: this.state.registerPassword,
      }),
    })
      .then((response) => {
        if (response) {
          return response.json();
        } else {
          this.setState({ invalidLogin: true });
          throw new Error("Something went wrong when trying to register");
        }
      })
      .then((data) => {
        if (data.success) {
          if (data.token) {
            this.saveAuthTokenInSession(data.token);
            fetch("https://recipe-share-backend.herokuapp.com/profile", {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                Authorization: data.token,
              },
            })
              .then((response) => response.json())
              .then((user) => {
                if (user && user.username) {
                  this.props.loadUser(user);
                  this.props.onRouteChange("signingIn");
                  this.props.history.push("/");
                }
              })
              .catch(console.log);
          }
        } else {
          if (data.error) {
            this.setState({ errorMsg: data.error });
          }
          this.setState({ invalidLogin: true });
          this.setState({ isLoading: false });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
      });
  };

  onEnter = (e) => {
    if (e.which === 13) {
      this.onSubmitRegister();
    }
  };

  render() {
    return (
      <div className="register-form" onKeyPress={this.onEnter}>
        <h1>Register</h1>
        <Form>
          <FormGroup>
            <Label>Username</Label>
            <Input
              type="username"
              name="username"
              id="username"
              onChange={this.onUsernameChange}
              invalid={this.state.isUsernameInvalid}
            ></Input>
            <FormFeedback>Username must not be empty</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              onChange={this.onPasswordChange}
              invalid={this.state.isPasswordInvalid}
            ></Input>
            <FormFeedback>Password must not be empty</FormFeedback>
          </FormGroup>
        </Form>
        <div>
          {this.state.invalidLogin && (
            <Alert color="danger">{this.state.errorMsg}</Alert>
          )}
        </div>
        <div className="btn-container">
          <button className="button-secondary" onClick={this.onSubmitRegister}>
            {!this.state.isLoading && <span>Register</span>}
            {this.state.isLoading && <span>Loading...</span>}
          </button>
          <button
            className="button-secondary"
            onClick={() => {
              this.props.history.push("/");
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }
}

export default Register;
