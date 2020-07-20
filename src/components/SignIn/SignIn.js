import React from "react";
import { Form, FormGroup, Label, Input, Alert } from "reactstrap";
import "./SignIn.css";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: "",
      isLoading: false,
      errorMsg: "",
      invalidLogin: false,
    };
  }

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem("token", token);
  };

  onSubmitSignIn = () => {
    this.setState({ isLoading2: true });

    if (this.state.signInEmail.length === 0) {
      this.setState({ errorMsg: "Please enter your email" });
      this.setState({ invalidLogin: true });
    } else if (this.state.signInPassword.length === 0) {
      this.setState({ errorMsg: "Please enter your password" });
      this.setState({ invalidLogin: true });
    } else {
      this.setState({ isLoading: true });
      fetch("https://recipe-share-backend.herokuapp.com/signin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.signInEmail,
          password: this.state.signInPassword,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            this.setState({ invalidLogin: true });
            this.setState({
              errorMsg: "Incorrect user credentials, please try again",
            });
            throw new Error("Something went wrong when trying to sign in");
          }
        })
        .then((data) => {
          if (data.user) {
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
                if (user && user.email) {
                  this.props.loadUser(user);
                  this.props.onRouteChange("signingIn");
                  this.props.history.push("/");
                }
              })
              .catch((error) => {
                this.setState({ isLoading: false });
              });
          }
        })
        .catch((error) => {
          this.setState({ invalidLogin: true });
          this.setState({ isLoading: false });
        });
    }
  };

  onEnter = (e) => {
    if (e.which === 13) {
      this.onSubmitSignIn();
    }
  };

  render() {
    return (
      <div className="signin-form" onKeyPress={this.onEnter}>
        <h1>Sign In</h1>
        <Form>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email-address"
              id="email-address"
              onChange={this.onEmailChange}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              onChange={this.onPasswordChange}
            ></Input>
          </FormGroup>
        </Form>
        <div>
          {this.state.invalidLogin && (
            <Alert color="danger">{this.state.errorMsg}</Alert>
          )}
        </div>
        <div className="btn-container">
          <button className="button-secondary" onClick={this.onSubmitSignIn}>
            {!this.state.isLoading && <span>Sign In</span>}
            {this.state.isLoading && <span>Signing In...</span>}
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

export default SignIn;
