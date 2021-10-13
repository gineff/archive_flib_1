import React from 'react';
import './preloader.css';
export default ({state, setState})=> {

  console.log(state.fetching);

  return (
  <div className="container" style={{display:state.fetching? "block" : "none"}}>
    <div className="loader">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div id="page-preloader"> </div>
  </div>)
}