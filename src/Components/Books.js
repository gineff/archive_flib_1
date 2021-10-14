import React, {useEffect, useState, useRef} from 'react';
import {Container, Row} from "react-bootstrap";
import { useRealmApp } from "../RealmApp";
import Book from "./Book";
import Paggination from "./Paggination";
import Modal from "./Modal";

import Preloader from "./Preloader";
import genres from '../data/genres'
import libraries from "../data/libraries";
import flibustaParser from "../service/xmlParserFlibusta";

const queryString = require('query-string');

export default ({ match, location, state, setState, realm})=> {
  const app = useRealmApp();
  const [books, setBooks] = useState([]);
  const [pages, setPages] = useState({page:1,total:1});
  const [partyIndex, setPartyIndex] = useState({});
 // const [app, setApp] = useState(opds.setApp(realm));
//  const initialQuery = {lib: libraries.filter(el=>el.name === match.params.libName)[0], filterBy: match.params[0], id: match.params.id, page: 1});
  const getLibraryByName = (name) =>  libraries.filter(el=>el.name === name)[0];
  const [query, setQuery] = useState({lib: getLibraryByName( match.params.libName), filterBy: match.params[0], id: match.params.id, page: 1});
  const refLocation = useRef(null);
  const proxyCorsUrl ="https://api.allorigins.win/raw?url=";

  const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
  const collection = mongodb?.db("flibusta")?.collection("Books");

  const getGenres = ()=> {
    const genre = genres.filter(el=>el.title === query.id)[0];
    return genre.entries.map((el)=>el.title);
  };

  const getPage  = async ()=>{
    if(query.filterBy === 'genre'){
      const pipeline = [
     //   {"$unwind":"$genre"},
        {"$match": {"lid": query.lib.id, "genre" : {"$in": getGenres()}}},
        //{"$group":{_id:"$id"}},
        {"$sort":{"_id":-1}},
        {"$skip": (pages.page-1)*20},
        {"$limit": 20}
      ];
      const result = await collection.aggregate(pipeline);


      return  result;
    }else{
      let _query = {lid: query.lib.id};
      if(pages.page >1) _query.bid = {$lt: partyIndex[(pages.page-1)]};
      const result = await collection.find(_query,{sort:{"_id":-1}, limit:20});
      if(result.length) setPartyIndex({...partyIndex, [pages.page]:result[result.length-1].bid});
      return  result;
    }

  };

  const getPageFromUrl  = async ()=>{
    let url;
    if(query.filterBy === "author"){
      url = "/opds/author/" + query.id + "/time"+"/"+(pages.page-1);
    }else if(query.filterBy === "sequence"){
      url =  "/opds/sequencebooks/"+query.id+"/"+(pages.page-1);
    }else if(query.filterBy === "genre") {
      const genre = genres.filter(genre=>genre.title === query.id)[0];
      url =  "/opds/new/" + (pages.page - 1) + "/newgenres/" + query.id;
    }else if(query.filterBy === "search") {
      url = '/opds/opensearch?searchType=books&searchTerm=' + query.id;
    }else{
      url =  "/opds/new/" + (pages.page - 1) + "/new/" ;
    }

    const  result = await fetch(proxyCorsUrl+encodeURIComponent(query.lib.url+url))
      .then(res=>res.text()).then(res=>flibustaParser(res));
    return  result;
  };

  const getListPage = async ()=> {
    const searchUrl = 'http://flibusta.is/opds/opensearch?searchType=books&searchTerm=';


    const text = await fetch(proxyCorsUrl+encodeURIComponent('http://flibusta.is/stat/'+query.id)).then(res=>res.text())
    const links = Array.from(text.matchAll(/<a href="\/b\/(\d+)">(.*?)<\/a>/gus))?.slice(0,5)?.map(el=>({id:el[1],title:el[2]}));
    const _books = [];
    for(let link of links) {
      const str = link.title.replaceAll(/\[.*?\]/g,"").trim();
      const searchBooks =  await fetch(proxyCorsUrl+encodeURIComponent(searchUrl+str))
        .then(res=>res.text()).then(res=>flibustaParser(res))
      const book = searchBooks?.filter(el=>el.bid == link.id)[0];
      console.log(book);
      if(book) books.push(book)

    }
    return  books;
  };
  const searchTypes = ["books", "authors"];

  const search = async (str)=> {
    const results = [], books = [];
    for (let searchType of searchTypes) {
      const searchUrl = `/opds/search?searchType=${searchType}&searchTerm=${str}`;
      const result = await fetch(proxyCorsUrl+encodeURIComponent(query.lib.url+searchUrl))
        .then(res=>res.text()).then(res=>flibustaParser(res));
      results.push(result);
    }
    return  await  Promise.all(results).then(res=>res.reduce((ar,el)=>ar.concat(el),[]));
  };

  useEffect(()=> {
    if(refLocation.current){
      setQuery({...query, page: pages.page});
    }
  },[pages]);

  let promise;
  useEffect(()=> {

    //if auth
    //else
    setState({...state, fetching: true, loading: false});
    switch (query.filterBy) {
      case "author":
        promise = getPageFromUrl(); break;
      case 'sequence':
        promise = getPageFromUrl(); break;
      case 'search':
        promise = search(query.id); break;
      case 'list':
        promise = getListPage(); break;
      default:
        promise = app.currentUser? getPage() : getPageFromUrl();
    }
    console.log(promise);

   //     const promise = (query.filterBy === "author"|| query.filterBy === "sequence") ? getPageFromUrl() : getPage();
    promise.then(books=> {
      books.forEach(el=>el.lib = query.lib);
      setBooks(books);
      setState({...state, fetching: false, loading: false});
    });
  },[query]);


  useEffect(()=>{
    if(!refLocation.current){
      refLocation.current = location;
    }else{
      if(refLocation.current !== location){
        setState({...state, fetching: true, showModal: false});
        setPages({page:1, total:1});
        setQuery({...query, lib: getLibraryByName( match.params.libName), filterBy: match.params[0], id: match.params.id})
      }
    }
  },[location])

  if(state.loading) {
    return  <div>is loading...</div>;
  }
  return (
    <div className="books">
    <Container>
      <Row>
        <Paggination pages={pages} setPages={setPages}> </Paggination>
        {
          books.map((book, index)=>{
            return <Book key={index} book={book} state={state} setState={setState}></Book>})
        }
      </Row>

      <Paggination pages={pages} setPages={setPages}> </Paggination>
    </Container>
      <Modal state={state} setState={setState}> </Modal>
      <Preloader state={state} setState={setState}/>
  </div>
)
}