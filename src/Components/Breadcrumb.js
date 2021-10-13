import {Breadcrumb, Dropdown} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import libraries from './data/libraries.json';
import genres from './data/genres.json';
export default ({ state, setState})=> {



  const [genre, setGenre] = useState(genres[0]);
  const [library, setLibrary] = useState(libraries[0]);


  useEffect(()=>{
    setState({...state, genre, url: "/opds/new/0/newgenres/"+genre.id})
  },[genre]);

  return       <Breadcrumb>
    <Breadcrumb.Item>
      <Dropdown>
        <Dropdown.Toggle variant="Primary" id="dropdown-library">
          {library.name}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {libraries.map(lib=>
            <Dropdown.Item eventKey={lib.name} key={lib.name} onClick={()=>
              setLibrary(lib)}>{lib.name}</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </Breadcrumb.Item>

    <Breadcrumb.Item>
      <Dropdown>
        <Dropdown.Toggle variant="Primary" id="dropdown-basic">
          {genre.name}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {genres.map(genre=>
            <Dropdown.Item eventKey={genre.id} key={genre.id} onClick={()=>
              setGenre(genre)}>{genre.name}</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </Breadcrumb.Item>
  </Breadcrumb>
}