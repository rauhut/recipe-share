import ProfileDropdown from "../Profile/ProfileDropdown";
import React from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  Nav,
  Input,
  NavbarText,
  NavbarToggler,
} from "reactstrap";
import "./NavBar.css";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      searchEntry: "",
      recipes: [],
    };
  }

  onSearchChange = (event) => {
    this.setState({ searchEntry: event.target.value });
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  onSubmitSearch = () => {
    this.props.onRecipeSearch(this.state.searchEntry);
    this.props.history.push("/search");
  };

  onEnter = (e) => {
    if (e.which === 13) {
      this.onSubmitSearch();
    }
  };

  render() {
    const { user } = this.props;
    const { isOpen } = this.state;

    return (
      <div>
        <Navbar light expand="md">
          <Collapse className="home-nav" isOpen={isOpen} navbar>
            <Link to={"/"}>Recipe Share</Link>
          </Collapse>
          <div className="search" onKeyPress={this.onEnter}>
            <Input
              className="search-bar"
              type="search"
              name="search"
              id="searchInput"
              placeholder="Search for a Recipe"
              onChange={this.onSearchChange}
            />
            <button
              className="button-primary"
              onClick={() => this.onSubmitSearch()}
            >
              Search
            </button>
          </div>
          <NavbarToggler id="nav-toggle" onClick={this.toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar></Nav>
            <NavbarText>
              {this.props.isSignedIn ? (
                <div>
                  <ProfileDropdown
                    onRouteChange={this.props.onRouteChange}
                    toggleModal={this.props.toggleModal}
                    user={user}
                  ></ProfileDropdown>
                </div>
              ) : (
                <div>
                  <Link to="/signin">
                    <button className="button-secondary">Sign In</button>
                  </Link>
                  <Link to="/register">
                    <button className="button-primary" color="secondary">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </NavbarText>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default NavBar;
