import React, {useState, useEffect} from 'react';
import {Form, Button, Container, Col, Row} from 'react-bootstrap';
import * as Realm from "realm-web";
import { useRealmApp } from "../RealmApp";

export default ({realm})=> {

  const app = useRealmApp();

  const [state, setState] = useState({});
  const [error, setError] = useState({});
  //const [credentials, setCredentials] = useState({});

  function validateEmail(email) {
    const re =  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  }


  const handleAuthenticationError =  (err, setErr) => {
    console.log(err)
  };

  const handleLogin = async ({email, password}) => {
    //setIsLoggingIn(true);
    setError((e) => ({ ...e, password: null }));
    try {
      await app.logIn(Realm.Credentials.emailPassword(email, password));
    } catch (err) {
      handleAuthenticationError(err, setError);
    }
  };

  const handleRegistrationAndLogin = async () => {
    let {email, password} = state;
    const isValidEmailAddress = validateEmail(email);
    setError((e) => ({ ...e, password: null }));
    if (isValidEmailAddress) {
      try {
        // Register the user and, if successful, log them in
        let res = await app.emailPasswordAuth.registerUser(email, password);
        //return await handleLogin(state);
        console.log(res);
      } catch (err) {
        handleAuthenticationError(err, setError);
      }
    } else {
      setError((err) => ({ ...err, email: "Email is invalid." }));
    }
  };

  useEffect(()=>{

  },[])

  const signUp = (e)=> {
    e.preventDefault();
    console.log(app.emailPasswordAuth);
    app.emailPasswordAuth.resendConfirmationEmail('canone@inbox.ru');
    /*handleRegistrationAndLogin(state.email,state.password).then(user => {

    })*/


  };

    return (    <Container id="sign-up-form" fluid="md">
      <Row className="justify-content-center">
        <Col md={6}>
          <Form noValidate onSubmit={signUp}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={(e)=>setState({...state, name:e.target.value})}
                type="name" placeholder="Enter your name" />

            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                onChange={(e)=>setState({...state, email:e.target.value})}
                placeholder="Enter email" />
              <Form.Control.Feedback type="invalid">
                email is incorrect
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e)=>setState({...state, password:e.target.value})}
                placeholder="Password" />
            </Form.Group>
          </Form>
        </Col>
      </Row>
        <Button as="input"value="Sign Up" type="submit" onClick={signUp}/>{' '}
        <p className="forgot-password text-right">
          Already registered <a href="#">sign in?</a>
        </p>
        <p>{JSON.stringify(error)}</p>
      </Container>


    )
  }