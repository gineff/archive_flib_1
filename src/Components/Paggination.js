import React, {useEffect, useState} from "react";
import {Container, Pagination, Row} from "react-bootstrap";

export default ({state, setState})=> {

  const [pages, setPages] = useState({page:1,total:1});

  const generateUrl = (page)=> {
    let genre = state.genre;
    let url = genre.id === 0? "/opds/new/"+(page.page-1)+"/new" : "/opds/new/"+(page.page-1)+"/newgenres/"+genre.id;
    setState({...state, url})
  };

  let items = [];

  useEffect(()=>{
   generateUrl(pages)
  },[pages]);

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