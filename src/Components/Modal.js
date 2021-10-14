import React, {useState} from "react";
import {Modal, Button, Card} from "react-bootstrap";
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useRouteMatch} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap'
const proxyCorsUrl ="https://api.allorigins.win/get?url=";
const proxyCorsDownloadUrl ="https://api.allorigins.win/raw?url=";

export default ({state, setState})=> {

  let [comments, setComments] = useState("");
  let book = state.book || {};
  const match = useRouteMatch();

  const handleClose = () => {
    setComments([]);
    setState({...state, showModal:false});
  };



  const getComments = (id)=> {
    fetch(proxyCorsUrl+encodeURIComponent('http://flibusta.is/b/'+book.bid))
      .then(response=>response.json())
      .then(response => new Promise((resolve, reject)=> {
        let commentsReg = Array.from(response.contents.matchAll(/<span class="container_.*?>(.*?)<\/span>/gus));
        console.log(commentsReg);
        resolve(commentsReg.map(el=>el[1]))
      })).then(comments=>   setComments(comments))


  };

  const markAsFavorite = async (id)=> {
   /* const mongodb = realm.currentUser.mongoClient("mongodb-atlas");
    const users = mongodb.db("flibusta").collection("User");
    await collection.updateOne(
      { owmerId: realm.currentUser.id }, // Query for the user object of the logged in user
      { $set: { favoriteColor: "purple" }}, // Set the logged in user's favorite color to purple
      {upsert: true}
    );
// Refresh the user's local customData property
    await realm.currentUser.refreshCustomData();
    console.log(realm.currentUser.customData);*/

  };

  const downloadBook = (e, el)=>{
    e.preventDefault();

    let fileType = el.href.split('/')[3];
    let fileContentType = el.type.split('/')[1];
    let filename = (fileType === 'download') ?  'book.'+fileContentType : "book."+fileType;


    fetch(proxyCorsDownloadUrl+encodeURIComponent('http://flibusta.is'+el.href))
      .then(res=>res.blob()).then(response=> {

        if(fileContentType.search('zip') !== -1 && fileType !== 'epub'){
          let  zip = new JSZip();
          zip.loadAsync(response)
            .then(z=>{
              let name = '';
              Object.keys(z.files).map((key,i)=>{if(i==0) {name = key+".zip"} return false;});
              saveAs(response, name? name : filename);
            });
        }else{
          saveAs(response, filename);
        }

        //let blob = new Blob([new TextEncoder().encode(response.contents)], {  type: "application/zip"   });
        //console.log(response)

    })




  };

  console.log( book);

  const url = `/lib/${match.params.libName}`;

  return (
    <Modal show={state.showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {book.author && book.author.map((author,i)=>
            <LinkContainer  key={i} to={`${url}/author/${author.id}`}>
              <Button  variant="link" >{author.name}</Button>
            </LinkContainer>
              )}
          <h5 className="book-name">{book.title}</h5>
          {book.sequencesId && book.sequencesId.map((id,i)=>
            <LinkContainer  key={i} to={`${url}/sequence/${id}`}>
              <Button variant="link" >{book.sequencesTitle[i]}</Button>
            </LinkContainer>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div dangerouslySetInnerHTML={{__html: book.content}}></div>
        {book.downloads && book.downloads.map((el, i)=>
          <Button  target="_blank" onClick={(e)=>downloadBook(e,el)} variant="link"  key={i} href = {"http://flibusta.is"+el.href}>{el.href.split("/")[3]}</Button>)}
        <div dangerouslySetInnerHTML={{__html: comments}}></div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={getComments.bind(this,book.id)}>Получить комментарии</Button>
        <Button variant="secondary" onClick={markAsFavorite.bind(this,book.id)}>Получить комментарии</Button>
      </Modal.Footer>
    </Modal>
  );


}