import React, { Component, Fragment } from 'react';
import { ToggleButton, ToggleButtonGroup, ListGroup, ListGroupItem, Form, FormGroup, FormControl, InputGroup, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Home.css'
import { API } from 'aws-amplify';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            items: [],
            content:"",
            filter: false,
            isDeleting: false
        };
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    // On submission, calls create API to add new item to database, then
    // clears content in state and triggers re-render of item list
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
        const items = await this.items();
        items.sort();
        this.setState ({ items });
        this.setState({ content: "" });
        this.setState({ isLoading: false });
    }

    // Calls create API and pushes new item to list so that another DB
    // call to update list is not immediately necessary
    async addItem(item) {
        return API.post("todo", "/todo", {
            body: item
        });
    }

    // Calls DB for item list when page first renders
    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const items = await this.items();
            items.sort();
            this.setState({ items });           
        }
        catch (e) {
            alert(e);
        }
        this.setState({ isLoading: false });
    }
    
    // Calls return API to get item list
    items() {
        return API.get("todo", "/todo");
    }

    // Toggles the filter state 
    handleFilter = () => {
        this.setState({ filter: !(this.state.filter) })
    }

    // Calls the update API to change item status (implement later)
    updateStatus = id => {

    }

    // Calls the update API to change note content (implement later)
    updateItem = async event => {

    }

    // Takes the note ID and makes a backend call to delete the DB item
    handleDelete = async id => {
        this.setState({ isDeleting: true });

        try {
            await this.deleteItem(id);
        }
        catch (e) {
            alert(e);
        }
        this.setState({ isDeleting: false });
        const items = await this.items();
        this.setState({ items });
    }

    // Calls the API to delete an item
    deleteItem = id => {
        return API.del("todo", `/todo/${id}`);
    }

    // Renders the new item line and the filter/clear complete buttons
    renderNewItem() {
        return (
            <div className="home-items">
                <h1 align="center" margin="20px">To Do</h1>
                <Form onSubmit={this.handleSubmit} className="submit">
                    <FormGroup controlId="content">
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.content}
                            onChange={this.handleChange}
                            placeholder="What do you have to do?"
                        />
                    </FormGroup>
                </Form>
                {/* {this.renderFilter()} */}
            </div>
        );
    }

    // Renders the item list by looping through the DB return
    // *Parts commented out are for linking to update notes
    renderItemList(items) {
        return items.map(
            (item, i) =>
            <div className="item-line">
                <InputGroup>
                    <InputGroup.Prepend className="item-complete">
                        <Button
                            variant="outline-danger"
                            className="complete-x"
                            onClick={() => this.handleDelete(item.noteId)}
                        >
                            X
                        </Button>
                        {/* <InputGroup.Checkbox 
                            onChange={() => this.updateStatus(item.noteId)}
                        />                            */}
                    </InputGroup.Prepend>
                    {/* <LinkContainer
                        controlId={`item${i}`}
                        key={item.noteId}
                        to={`/todo/$item.noteId}`}
                    > */}
                        <ListGroupItem>
                            {item.content}
                        </ListGroupItem>
                    {/* </LinkContainer> */}
                </InputGroup>
            </div>                         
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

    // Renders the filter and clear completed items buttons (implement later)
    renderFilter() {
        return (
            <div className="filter">
            <ToggleButtonGroup
                type="checkbox"
                onChange={this.handleFilter}
            >
                <ToggleButton 
                    type="checkbox" 
                    name="filter-radio" 
                    value="filter"
                    >
                    Filter Completed
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                >
                    Clear Completed Items
                </Button>
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