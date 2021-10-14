import React, {useState} from 'react';
import {Form, Button, Container, Col, Row} from 'react-bootstrap';
import * as Realm from "realm-web";
import { useRealmApp } from "../RealmApp";

export default ({state, setState, realm})=> {
  const {logIn} = useRealmApp();
  const [credentials, setCredentials] = useState({});
  const [error, setError] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    //setIsLoggingIn(true);
    //setError((e) => ({ ...e, password: null }));
    let {email, password} = credentials;
    try {
      let user = await logIn(Realm.Credentials.emailPassword(email, password));
      console.log(user);
    } catch (err) {
      console.log(err);
     // handleAuthenticationError(err, setError);
    }
  };



  return      (<Container id="sign-in-form" fluid="md">
      <Row className="justify-content-center">
      <Col md={6}>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email"
                          onChange={(e)=>setCredentials({...credentials, email:e.target.value})}
                          placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password"
                          onChange={(e)=>setCredentials({...credentials, password:e.target.value})}
                          placeholder="Password" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleLogin}>
            Submit
          </Button>
          <p className="forgot-password text-right">
            Forgot <a href="#">password?</a>
          </p>
        </Form>
      </Col>
      </Row>
    </Container>)
}