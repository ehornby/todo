import React, { Component } from 'react';
import { Form, FormControl, FormGroup } from 'react-bootstrap';
import './Login.css';
import { Auth } from 'aws-amplify';
import LoaderButton from '../components/LoaderButton';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: "",
            password: ""
        };
    }

    // update this with correct parameters
    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0
    }

    handleChange = event => {
        this.setState({
        [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });

        try {
            await Auth.signIn(this.state.email, this.state.password);
            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        }
        catch (e) {
            alert(e.message);
        }
        this.setState({ isLoading: false });
    }

    render() {
        return (
            <div className="Login">
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="email">
                        <FormControl
                            autoFocus
                            type="email"
                            placeholder="Email Address"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password">
                        <FormControl
                            type="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        type="submit"
                        size="lg"
                        disabled={!this.validateForm()}
                        text="Login"
                        loadingText="Logging in..."
                    />
                </Form>
            </div>
        );
    }
}