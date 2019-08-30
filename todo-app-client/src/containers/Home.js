import React, { Component, Fragment } from 'react';
import { Button, PageHeader, ListGroup, ListGroupItem, Form, FormGroup, FormControl, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Home.css'
import CompleteButton from '../components/CompleteButton';
import { API } from 'aws-amplify';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            items: [],
            content:""
        };
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
        }
        this.setState({ isLoading: false });
    }

    addItem(item) {
        return API.post("todo", "/todo", {
            body: item
        });
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const items = await this.items();
            this.setState({ items });
        }
        catch (e) {
            alert(e);
        }
        this.setState({ isLoading: false });
    }
    
    items() {
        return API.get("todo", "/todo");
    }

    renderItemList(items) {
        return [{}].concat(items).map(
            (item, i) =>
                i === 0
                    ?
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="content">
                            <FormControl
                                autoFocus
                                type="text"
                                value={this.state.content}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <Button
                            type="submit"
                        >Add item
                        </Button>
                    </Form>
                    : 
                    <Form> 
                        <FormGroup as={Row} controlId="item${i}">
                            <Col sm="2">
                                <CompleteButton />
                            </Col>
                            <Col sm="10">
                                <LinkContainer
                                    key={item.noteId}
                                    to={`/todo/$item.noteId}`}
                                >
                                    <ListGroupItem >
                                        {item.content}
                                    </ListGroupItem>
                                </LinkContainer>
                            </Col>
                        </FormGroup>
                    </Form>                  
        );               
    }

    renderLander() {
        return (
            <div className="lander">
                <h1>Vault</h1>
                <p>Keep track of your shit</p>
            </div>
        );
    }

    renderItems() {
        return (
            <div className="items">
                <PageHeader align="center">To Do</PageHeader>
                <ListGroup>
                    {!this.state.isLoading && this.renderItemList(this.state.items)}
                </ListGroup>
            </div>
        );
    }
    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderItems() : this.renderLander()}
            </div>
        )
    }
}