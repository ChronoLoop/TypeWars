import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const MyNavbar = () => {
    return (
        <Navbar
            fixed="top"
            collapseOnSelect
            expand="lg"
            bg="custom-dark"
            variant="dark"
            className="px-5"
        >
            <Navbar.Brand as={Link} to={'/'}>
                {'<TypeWars/>'}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link as={Link} to={'/game/create'}>
                        Create Game
                    </Nav.Link>
                    <Nav.Link as={Link} to={'/game/join'}>
                        Join Game
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default MyNavbar;
