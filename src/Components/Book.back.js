import React from "react";

import {Col, Card, Button } from "react-bootstrap";
import './book.css';

export default ({book, state, setState})=> {

  const getBookId = ()=> {
    let link = book.link[2]["@attributes"].href;
    let arr = link.split('/');
    return  arr[3];
  };

  const getAuthorId = ()=> {
    let link =book.link[0]["@attributes"].href;
    let arr = link.split('/');
    return  arr[3];
  };

  const showModal = ()=> {

    let authorId  =getAuthorId();
    let authorLink = "/opds/author/"+authorId+"/time";

    let currentBook = {
      id: getBookId(),
      author: {name: book.author.name, link: authorLink, id: authorId},
      sequence: {title: book.link.length==13? book.link[1]["@attributes"].title : null, link: book.link.length==13? book.link[1]["@attributes"].href : null} ,
      download: {fb2: book.link.length==13? book.link[6]["@attributes"].href : book.link[5]["@attributes"].href},
      title: book.title,
      image: "http://flibusta.is/"+book.link[2]["@attributes"].href,
      content: book.content,

    };

    setState({...state, showModal:true, currentBook});
  };



  let href = book.link[2]&& book.link[2]["@attributes"].type === "image/jpeg" && book.link[2]["@attributes"].href;
  let src = href? "http://flibusta.is/"+href : "holder.js/160px250";
  let comments = [];

  return <Col md={2} className="book">
    <Card className="mb-2 shadow-sm" onClick={showModal}>
      <div className="image-holder">
        <Card.Img src={src} variant="top" className="image-class-name"/>
      </div>
      <Card.Body>
        <Card.Title>{book.author && book.author.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{book.title}</Card.Subtitle>
        <Card.Text><small>{book.link.length==13? book.link[1]["@attributes"].title : null}</small></Card.Text>
      </Card.Body>
    </Card>
  </Col>
}