import {Breadcrumb, Dropdown} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import libraries from './data/libraries.json';
import genres from './data/genres.json';
import './breadcrumb.css';
export default ({ state, setState})=> {



  const [genre, setGenre] = useState(genres[0]);
  const [library, setLibrary] = useState(libraries[0]);
  const history = useHistory();

  /*useEffect(()=>{
    setState({...state, genre, url: "/opds/new/0/newgenres/"+genre.id})
  },[genre]);*/

  const handleSelect = (eventKey)=> {
    const lib = history.location.pathname.match(/\/lib\/(\w+)/)[1];
    history.push(`/lib/${lib}/genre/${eventKey}`);
  };

  return       <Breadcrumb>
    <Breadcrumb.Item>
      <Dropdown>
        <Dropdown.Toggle variant="Primary" id="dropdown-library">
          {library.name}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {libraries.map(lib=>
            <Dropdown.Item eventKey={lib.name} key={lib.name} onClick={()=>{
              setLibrary(lib)
              //history.push(`/lib/${lib}/genre/`);
            }}>{lib.name}</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </Breadcrumb.Item>

    <Breadcrumb.Item>
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle variant="Primary" id="dropdown-basic">
          {genre.title}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {genres.map(genre=>
            <Dropdown.Item eventKey={genre.title} key={genre.title} onClick={()=>
              setGenre(genre)}>{genre.title}</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </Breadcrumb.Item>
  </Breadcrumb>
}