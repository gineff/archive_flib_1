import React, {useState} from "react";
import {Modal, Button, Card} from "react-bootstrap";
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const proxyCorsUrl ="https://api.allorigins.win/get?url=";
const proxyCorsDownloadUrl ="https://api.allorigins.win/raw?url=";

export default ({state, setState})=> {

  let [comments, setComments] = useState("");
  let book = state.book || {};

  const handleClose = () => {

    setComments([]);
    setState({...state, showModal:false});
  
  }

  const getSequence = (id)=> {

      setState({...state, url: "/opds/sequencebooks/"+id, showModal:false});

  };

  const getAuthor = (id)=> {
    setState({...state, url:"/opds/author/"+id+"/time", showModal:false});
  };




  const getComments = (id)=> {
    //fetch('http://f0565502.xsph.ru/flib_get_comments.php?id='+book.id)
    fetch(proxyCorsUrl+encodeURIComponent('http://flibusta.is/b/'+book.id))
      .then(response=>response.json())
      .then(response => new Promise((resolve, reject)=> {
        let commentsReg = Array.from(response.contents.matchAll(/<span class="container_.*?>(.*?)<\/span>/gus));
        console.log(commentsReg);
        resolve(commentsReg.map(el=>el[1]))
      })).then(comments=>   setComments(comments))


  };

  function str2bytes (str) {
    var bytes = new Uint8Array(str.length);
    for (var i=0; i<str.length; i++) {
      bytes[i] = str.charCodeAt(i);
    }
    return bytes;
  }

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

  //console.log(book.downloads, book);

  return (
    <Modal show={state.showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {book.author && book.author.map((author,i)=>
            <Button onClick={getAuthor.bind(this, author.id)} variant="link" key={i} >{author.name}</Button>)}
          <h5 className="book-name">{book.title}</h5>
          {book.sequencesId && book.sequencesId.map((id,i)=>
            <Button onClick={getSequence.bind(this, id)} variant="link" key={i} >{book.sequencesTitle[i]}</Button>)}
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
      </Modal.Footer>
    </Modal>
  );


}