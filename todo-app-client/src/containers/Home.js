import React, { Component, Fragment } from 'react';
import { ToggleButton, ToggleButtonGroup, ListGroup, ListGroupItem, Form, FormGroup, FormControl, InputGroup } from 'react-bootstrap';
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

    handleFilter = () => {
        this.setState({ filter: !(this.state.filter) })
    }

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
                {this.renderFilter()}
            </div>
        );
    }
    renderItemList(items) {
        return items.map(
            (item, i) =>
            <div className="item-line">
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                        <InputGroup.Checkbox aria-label="check-complete" />
                    </InputGroup.Prepend>
                    <LinkContainer
                        controlId={`item${i}`}
                        key={item.noteId}
                        to={`/todo/$item.noteId}`}
                    >
                        <ListGroupItem>
                            {item.content}
                        </ListGroupItem>
                    </LinkContainer>
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