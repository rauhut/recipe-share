import React from "react";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import "./ProfileDropdown.css";

class ProfileDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle = () => {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  };

  render() {
    return (
      <div>
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle
            tag="span"
            data-toggle="dropdown"
            aria-expanded={this.dropdownOpen}
          >
            <h3>{this.props.user.username}</h3>
          </DropdownToggle>
          <DropdownMenu
            right
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <button
              className="button-secondary"
              onClick={() => {
                const token = window.sessionStorage.getItem("token");
                fetch("https://recipe-share-backend.herokuapp.com/signout", {
                  method: "post",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                  },
                })
                  .then((response) => {
                    if (response.ok) {
                      return response;
                    } else {
                      throw new Error(
                        "Something went wrong when trying to logout"
                      );
                    }
                  })
                  .catch(console.log);
                window.sessionStorage.removeItem("token");
                this.props.onRouteChange("signout");
              }}
            >
              Sign Out
            </button>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default ProfileDropdown;
