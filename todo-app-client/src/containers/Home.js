import React, { Component } from 'react';
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Home.css'
import NewItem from './NewItem';
import { API } from 'aws-amplify';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            items: []
        };
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
                i !== 0
                    ? <LinkContainer
                        key={item.noteId}
                        to={`/todo/$item.noteId}`}
                    >
                        <ListGroupItem header={item.content}>
                            {"Created: " + new Date(item.createdAt).toLocaleTimeString()}
                        </ListGroupItem>
                    </LinkContainer>
                    : <LinkContainer
                        key="new"
                        to="/todo/new"
                    >
                        <ListGroupItem>
                            <h4>
                                <b>{"\uFF0B"}</b> Add an item
                            </h4>
                        </ListGroupItem>
                    </LinkContainer>
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