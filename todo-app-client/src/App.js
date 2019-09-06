import React, { Component, Fragment } from 'react';
import './App.css';
import Routes from './Routes';
import { Link, withRouter } from 'react-router-dom';
import { NavbarBrand, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from 'aws-amplify';
import NavbarCollapse from 'react-bootstrap/NavbarCollapse';
import NavLink from 'react-bootstrap/NavLink';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");

  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    }

    return (
      !this.state.isAuthenticating &&
      <div className="App container">      
        <Navbar bg="light" collapseOnSelect>
          <NavbarBrand>
            <Link to="/">Vault</Link> 
          </NavbarBrand>
          <NavbarCollapse className="justify-content-end">
            <Nav>
              {this.state.isAuthenticated
              ?
              <NavLink onClick={this.handleLogout}>Logout</NavLink>
              : 
              <Nav>
                <LinkContainer to="/signup">
                  <NavLink>Sign Up</NavLink>
                </LinkContainer>
                <LinkContainer to="/login">
                  <NavLink>Login</NavLink>
                </LinkContainer>
              </Nav>
              }
            </Nav>
          </NavbarCollapse>
        </Navbar>
        <Routes childProps={childProps}/>
      </div>
    );
  }
}

export default withRouter(App);
