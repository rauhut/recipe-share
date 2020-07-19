import ProfileDropdown from "../Profile/ProfileDropdown";
import React from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarBrand,
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

  render() {
    const { user } = this.props;
    const { isOpen } = this.state;

    return (
      <div>
        <Navbar light expand="md">
          <Collapse className="home-nav" isOpen={isOpen} navbar>
            <NavbarBrand href="/">Recipe Share</NavbarBrand>
          </Collapse>
          <div className="search">
            <Input
              className="search-bar"
              type="search"
              name="search"
              id="searchInput"
              placeholder="Search for a Recipe"
              onChange={this.onSearchChange}
            />
            <Link className="search-btn" to={`/search`}>
              <button
                className="button-primary"
                onClick={() =>
                  this.props.onRecipeSearch(this.state.searchEntry)
                }
              >
                Search
              </button>
            </Link>
          </div>
          <NavbarToggler onClick={this.toggle} />
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
