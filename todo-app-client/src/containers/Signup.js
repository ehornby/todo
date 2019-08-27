import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { Form, FormControl, FormGroup, HelpBlock, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';

export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            newUser: null
        };
    }

    validateForm() {
        return (
            this.state.email.length > 0 && 
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    ValidateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleConfirmationSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            await Auth.signIn(this.state.email, this.state.password);

            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        }
        catch (e) {
            alert(e.message);
            this.setState({ isLoading: false });
        }
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        this.setState({ newUser: "test" });
        this.setState({ isLoading: false });

        try {
            const newUser = await Auth.signUp({
            username: this.state.email, 
            password: this.state.password
            });
            this.setState({
                newUser
            });
        }
        catch (e) {
            alert(e.message);
        }
        this.setState({ isLoading: false });
    }

    renderConfirmationForm() {
        return (
            <Form onSubmit={this.handleConfirmationSubmit}>
                <FormGroup controlid="confirmationCode">
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        type="tel"
                        placeholder="Confirmation code"
                        value={this.state.confirmationCode}
                        onChange={this.handleChange}
                    />
                    <HelpBlock>Please check your email for the code.</HelpBlock>
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    size="lg"
                    disabled={!this.ValidateConfirmationForm()}
                    text="Verify"
                    loadingText="Verifying..."
                />
            </Form>
        );
    }

    renderForm() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormGroup controlId="email">
                    <ControlLabel>Email Address</ControlLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        placeholder="Email Address"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="password">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        type="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="confirmPassword">
                    <ControlLabel>Confirm Password</ControlLabel>
                    <FormControl
                        type="password"
                        placeholder="Confirm Password"
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    size="lg"
                    disabled={!this.validateForm()}
                    text="Sign up"
                    loadingText="Signing up..."
                />
            </Form>
        );
    }
    render() {
        return (
            <div className="Signup">
                {this.state.newUser === null
                ? this.renderForm()
                : this.renderConfirmationForm()}
            </div>
        );
    }
}