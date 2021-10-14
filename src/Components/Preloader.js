import React, {useState} from 'react';
import './preloader.css';
export default ({state, setState})=> {



  return (
  <div className="container" style={{display:state.fetching? "block" : "none"}} onClick={()=>setState({...state, fetching: false})}>
    <div className="loader">
      <div className="lds-ellipsis" >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div id="page-preloader"> </div>
  </div>)
}