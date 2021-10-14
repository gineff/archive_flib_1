import React from 'react'
import {Container, Nav, Navbar, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useRealmApp} from "../RealmApp";

export default ()=> {
  const app = useRealmApp();

  return   <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand>   <Nav.Link href="/">Lib-tracker</Nav.Link>               </Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="/login"><Link to={'/Login'}>Login</Link></Nav.Link>
        <Nav.Link href="/signup"><Link to={'/SignUp'}>Sign up</Link></Nav.Link>
        <Nav.Link href="/video"><Link to={'/video'}>Video</Link></Nav.Link>
        <Nav.Link href=""><Button type="link" onClick={app.logOut}>Log out</Button></Nav.Link>
      </Nav>
    </Container>
  </Navbar>
}