import React from "react";
import {Container, Pagination, Row} from "react-bootstrap";

export default ({pages, setPages})=> {


  let items = [];

  for (let number = 1; number <= pages.total; number++) {
    items.push(
      <Pagination.Item key={number} active={number === pages.page} onClick={()=>setPages({...pages, page: number})}>
        {number}
      </Pagination.Item>,
    );
  }

  return  <Container className="text-center">
    <Row>
      <Pagination className="mx-auto">
        {items}
        <Pagination.Next onClick={()=> setPages({...pages,page:(pages.total+1), total:(pages.total+1)})}/>
      </Pagination>
    </Row>
  </Container>
};