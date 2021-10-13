import React from "react";

import {Col, Card, Button } from "react-bootstrap";
import './book.css';

export default ({book, state, setState})=> {

  console.log(book);
  const proxyImageUrl ="//images.weserv.nl/?url=";
  const showModal = ()=> {
    setState({...state, showModal:true, book});
  };

  const imageStyle = book.image? {
    backgroundImage: `url(${proxyImageUrl+book.image+"&h=500"})`
  } : {};

  return <Col xs={12} sm={12} md={3} lg={2} className="book">
    <Card className="mb-2 shadow-sm" onClick={showModal}>
      <div className="image-holder" style={imageStyle}> </div>
      <Card.Body>
        <Card.Title>{book.author.map((el,i)=>(<div key={i}>{el.name}</div>))}</Card.Title>
        <Card.Text className="mb-2 text-muted">{book.title.slice(0,22)}</Card.Text>
        <Card.Subtitle><small>{book.sequencesTitle.map((el,i)=>(<div key={i}>{el}</div>))}</small></Card.Subtitle>
      </Card.Body>
    </Card>
  </Col>
}

//<Card.Img src={book.image} variant="top" className="image-class-name"/>