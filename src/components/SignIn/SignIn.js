import React from "react";
import { Form, FormGroup, Label, Input, Alert } from "reactstrap";
import "./SignIn.css";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInUsername: "",
      signInPassword: "",
      isLoading: false,
      errorMsg: "",
      invalidLogin: false,
    };
  }

  onUsernameChange = (event) => {
    this.setState({ signInUsername: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem("token", token);
  };

  onSubmitSignIn = async () => {
    this.setState({ isLoading: true });

    if (this.state.signInUsername.length === 0) {
      this.setState({ errorMsg: "Please enter your username" });
      this.setState({ invalidLogin: true });
      this.setState({ isLoading: false });
    } else if (this.state.signInPassword.length === 0) {
      this.setState({ errorMsg: "Please enter your password" });
      this.setState({ invalidLogin: true });
      this.setState({ isLoading: false });
    } else {
      this.setState({ isLoading: true });

      try {
        const res = await fetch(
          "https://recipe-share-backend.herokuapp.com/signin",
          {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: this.state.signInUsername,
              password: this.state.signInPassword,
            }),
          }
        );
        if (!res.ok) {
          this.setState({ invalidLogin: true });
          this.setState({
            errorMsg: "Incorrect user credentials, please try again",
          });
          throw new Error("Something went wrong when trying to signin");
        } else {
          const data = await res.json();
          if (data.user) {
            this.saveAuthTokenInSession(data.token);
            try {
              const response = await fetch(
                "https://recipe-share-backend.herokuapp.com/profile",
                {
                  method: "get",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: data.token,
                  },
                }
              );
              const user = await response.json();
              this.props.loadUser(user);
              this.props.onRouteChange("signingIn");
              this.props.history.push("/");
            } catch (err) {
              this.setState({ isLoading: false });
              console.log(err);
            }
          } else {
            if (data.error) {
              this.setState({ errorMsg: data.error });
            }
            this.setState({ invalidLogin: true });
            this.setState({ isLoading: false });
          }
        }
      } catch (err) {
        this.setState({ invalidLogin: true });
        this.setState({ isLoading: false });
      }
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
            <Label>Username</Label>
            <Input
              type="username"
              name="username"
              id="username"
              onChange={this.onUsernameChange}
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
