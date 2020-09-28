import React, { Component } from "react";
import MainPage from "./components/MainPage/MainPage";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import NavBar from "./components/NavBar/NavBar";
import RecipePage from "./components/RecipePage/RecipePage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import ResultsPage from "./components/ResultsPage/ResultsPage";

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

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  async componentDidMount() {
    const token = window.sessionStorage.getItem("token");

    if (token) {
      try {
        const res = await fetch(
          "https://recipe-share-backend.herokuapp.com/signin",
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        const data = await res.json();
        if (data.user) {
          try {
            const response = await fetch(
              "https://recipe-share-backend.herokuapp.com/profile",
              {
                method: "get",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              }
            );
            const user = await response.json();
            if (user && user.username) {
              this.loadUser(user);
              this.onRouteChange("mainPage");
              this.setState({ isSignedIn: true });
            }
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data._id,
        username: data.username,
        recipes: data.recipes,
      },
    });
  };

  onRecipeSearch = (search) => {
    this.setState({ searchEntry: search });
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
      this.setState({ user: initialState.user });
      console.log(this.state.user);
    } else if (route === "signingIn") {
      this.setState({ isSignedIn: true });
    }
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen,
    }));
  };

  render() {
    const { isSignedIn, user, searchEntry } = this.state;
    return (
      <Router>
        <div className="App">
          <Route
            path="/"
            render={(props) => (
              <NavBar
                {...props}
                isSignedIn={isSignedIn}
                onRouteChange={this.onRouteChange}
                toggleModal={this.toggleModal}
                user={user}
                onRecipeSearch={this.onRecipeSearch}
              />
            )}
          />
          <Switch>
            <Route
              path="/"
              exact
              render={(props) => (
                <MainPage {...props} isSignedIn={isSignedIn} user={user} />
              )}
            />
            <Route
              path="/signin"
              render={(props) => (
                <SignIn
                  {...props}
                  onRouteChange={this.onRouteChange}
                  loadUser={this.loadUser}
                />
              )}
            />
            <Route
              path="/register"
              render={(props) => (
                <Register
                  {...props}
                  onRouteChange={this.onRouteChange}
                  loadUser={this.loadUser}
                />
              )}
            />
            <Route
              path="/recipe/:id"
              render={(props) => <RecipePage {...props} user={user} />}
            />
            <Route
              path="/search"
              render={(props) => (
                <ResultsPage {...props} searchEntry={searchEntry} />
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
