import React, {useEffect, useState} from 'react';
import {Container, Row} from "react-bootstrap";
import Book from "./Book";
import Preloader from "./Preloader";

import Paggination from "./Paggination";
import opds from '../service/opds'
const parseString = require('xml2js').parseString;
const proxyCorsUrl ="https://api.allorigins.win/get?url=";



export default ({ state, setState, realm})=> {

  const [books, setBooks] = useState([]);

  const node = "$"; //@attribute
  const server = "/"; //http://f0565502.xsph.ru //remove proxy from package.json


  useEffect(()=>{
    getBooksGroup();
  },[state.url]);


  const getBookId = (book)=> {
    let link = book.link[2][node].href;
    let arr = link.split('/');
    return  arr[3];
  };

  const getSequences = (book) => {
    let res =  Array.from( book.content[0]["_"].matchAll(/Серия: (.*?)<br\/>/g));
    return res.map(el=>el[1])
  };

  const parseBook = (book) => {


    let _book = {sequencesId: [], downloads:[], content: book.content[0]["_"], title: book.title[0]};
    //parse author
    if (!Array.isArray(book.author)) book.author = [book.author];
    _book.author = book.author && book.author.map((el) => {
      if (!el) return  false;
      return {id: el.uri? el.uri[0].split('/')[2] : null, name: el.name[0]}
    });
    //get sequence from title
    //parse links for image, id, sequence id, download links
    book.link.forEach((el, i) => {
      let e = el[node];
      if(e.type === "image/jpeg" && !book.image) {_book.image = "http://flibusta.is"+e.href; _book.id = e.href.split("/")[3]}
      else if (e.href.slice(0, 19) === "/opds/sequencebooks")
        _book.sequencesId.push( e.href.split("/")[3]);
      else if(e.rel === "http://opds-spec.org/acquisition/open-access") _book.downloads.push({href:e.href,type: e.type})

    });

    //_book.image = _book.image? _book.image : "holder.js/160px250";
    _book.sequencesTitle = getSequences(book);

    return _book;
  };

/*
  const getBooks = (url)=>{
    //return fetch('/flibusta',{ mode: 'no-cors', method:"post", body:JSON.stringify({path:url})})
    setState({...state, fetching: true});
    return fetch(proxyCorsUrl+encodeURIComponent('http://flibusta.is'+state.url))
      .then(res=>res.json()).then(response => new Promise((resolve, reject)=> {
        parseString(response.contents, (err, res)=> {resolve(res.feed.entry)})
      }))

  };

  const getBooksGroup = ()=> {
    getBooks(state.url).then((books,err)=>{
      if(books) {
        console.log('x',books);
        setBooks(books);
        setState({...state, fetching: false, loading: false})
      }
    })
  };
*/
  const libraries = {};


 /* opds.lib('flibusta').getPage(0)
  opds.lib('flibusta').genre(2).getPage(0)
  opds.lib('flibusta').author(3555).getPage(0)
  opds.lib('flibusta').sequence(48556).getPage(0)
*/

  const mongodb = realm.currentUser.mongoClient("mongodb-atlas");
  const Books = mongodb.db("flibusta").collection("Books");

  const getBooks = async (url)=>{
    return await Books.find({},{sort:{"_id":-1},limit:20,skip:20});
  };

  const getBooksGroup = ()=> {
    getBooks().then((books)=>{
      if(books) {
        console.log('x',books);
        setBooks(books);
        setState({...state, fetching: false, loading: false})
      }
    })
  };


  if(state.loading) {
    return  <div>is loading...</div>;
  }

  return (
    <div className="books">
    <Container>
      <Row>
        <Paggination state={state} setState={setState}> </Paggination>
        {
          books.map((book, index)=>{
            //let _book = parseBook(book);

            return <Book key={index} book={book} state={state} setState={setState}></Book>})
        }
      </Row>
      <Preloader state={state} setState={setState}/>
    </Container>
      <Paggination state={state} setState={setState}> </Paggination>
  </div>
)
}