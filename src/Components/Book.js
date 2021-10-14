import React from "react";

import {Col, Card, Button } from "react-bootstrap";
import './book.css';

export default ({book, state, setState})=> {

  const proxyImageUrl ="//images.weserv.nl/?url=";
  const showModal = ()=> {
    setState({...state, showModal:true, book});
  };

  const strDate = JSON.stringify(book.date);

  const createImageUrl = ()=> {
    return ((book.lib.imageResize? proxyImageUrl : "") + ((book?.image?.slice(0,4) === "http")? book.image :
      book?.lib?.url + book.image) + (book.lib.imageResize? "&h=500" : ""))
  };

  console.log(createImageUrl());

  const imageStyle = book.image? {
    backgroundImage: `url(${createImageUrl()})`
  } : {};

  return <Col xs={4} sm={4} md={3} lg={2} className="book">
    <Card className="mb-2 shadow-sm" onClick={showModal}>
      <div className="image-holder" style={imageStyle}> </div>
      <Card.Body>
        <Card.Title>{book.author.map((el,i)=>(<div key={i}>{el.name}</div>))}</Card.Title>
        <Card.Text className="mb-2 text-muted">{book.title.slice(0,50)}</Card.Text>
        <Card.Subtitle><small>{book.sequencesTitle.map((el,i)=>(<div key={i}>{el}</div>))}</small></Card.Subtitle>
      </Card.Body>
      <div className = "bookDate">{book.date? (strDate.slice(1,11)+" "+strDate.slice(12,17) ): "" }</div>
    </Card>
  </Col>
}

//<Card.Img src={book.image} variant="top" className="image-class-name"/>