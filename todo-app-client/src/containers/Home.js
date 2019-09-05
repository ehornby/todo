import React, { Component, Fragment } from 'react';
import { Button, ButtonGroup, PageHeader, ListGroup, ListGroupItem, Form, FormGroup, FormControl, Row, Col } from 'react-bootstrap';
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
            content:"",
            filter: false
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
        this.setState({ content: "" });
        this.setState({ isLoading: false });
    }

    addItem(item) {
        const items = this.state.items;
        items.push(item);
        this.setState({ items });

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

    renderNewItem() {
        return (
            <Fragment>
                <PageHeader align="center">To Do</PageHeader>
                <Form onSubmit={this.handleSubmit} className="submit">
                    <FormGroup controlId="content">
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.content}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                </Form>
                {this.renderFilter()}
            </Fragment>
        );
    }
    renderItemList(items) {
        return [{}].concat(items).map(
            (item, i) =>
                i !== 0
                ?
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
                : null            
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
                <ListGroup>
                    {!this.state.isLoading && this.renderItemList(this.state.items)}
                </ListGroup>
            </div>
        );
    }

    renderFilter() {
        return (
            <div className="filter">
            <ButtonGroup className="filter-buttons">
                <Button
                    toggle="true"
                >
                    Filter Completed
                </Button>
                <Button
                    toggle="true"

                >
                    No Filters
                </Button>
                </ButtonGroup>
            </div>
        )
    }
    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? 
                    <div>{this.renderNewItem()}
                     {this.renderItems()}
                     </div>
                     : this.renderLander()}
            </div>
        )
    }
}