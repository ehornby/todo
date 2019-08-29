import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Row, Form, Col } from 'react-bootstrap';
import API from 'aws-amplify';
import './NewItem.css';

export default class NewItem extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            content: ""
        }
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
            await this.addItem({
                content: this.state.content
            });
        }
        catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    addItem(item) {
        return API.post("todo", "/todo", {
            body: item
        });
    }

    validateForm() {
        return this.state.content.length > 0;
    }

    render() {
        return (
            <Form className="content">
                <FormGroup as={Row} controlId="content">
                    <Button
                        column
                        sm="2"
                        type="submit"
                        disabled={!this.validateForm()}
                        text="Submit"
                    >
                        Submit
                    </Button>
                    <Col sm="10">
                    <FormControl
                        column
                        autoFocus
                        type="text"
                        value={this.state.content}
                        onChange={this.handleChange}
                        placeholder="Add a new item"
                    />
                    </Col>
                </FormGroup>
            </Form>
        );
    }
}