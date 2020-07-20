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
    name: "",
    email: "",
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

  componentDidMount() {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            fetch("http://localhost:3000/profile", {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            })
              .then((response) => response.json())
              .then((user) => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange("mainPage");
                  this.setState({ isSignedIn: true });
                }
              });
          }
        })
        .catch(console.log);
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data._id,
        name: data.name,
        email: data.email,
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
      this.setState({ initialState });
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
          <NavBar
            isSignedIn={isSignedIn}
            onRouteChange={this.onRouteChange}
            toggleModal={this.toggleModal}
            user={user}
            onRecipeSearch={this.onRecipeSearch}
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
            <Route path="/recipe/:id" component={RecipePage} />
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
