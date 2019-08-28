import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Row, Form, Col } from 'react-bootstrap';
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

    handleSubmit = event => {
        event.preventDefault();
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