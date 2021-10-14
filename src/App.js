import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react';
import { useRealmApp, RealmAppProvider } from "./RealmApp";

//import * as Realm from "realm-web";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import {Nav, NavDropdown, Container} from 'react-bootstrap';
import Books from "./Components/Books";
import Breadcrumb from "./Components/Breadcrumb";
import Login from "./Components/Login";
import SignUp from "./Components/Signup";
import Navbar from "./Components/Navbar";
import counter from "./Components/counter";
import Video from "./Components/Video";

function App() {

  const [state, setState] = useState({
    loading: true,
    showModal: false,
    fetching: true,
    book:{}
  });

  const appId = "application-0-rgont";
  //const app = new Realm.App({ id: appId });

  //const [realm, setRealm] = React.useState(new Realm.App(appId));
  //const [currentUser, setCurrentUser] = useState(realm.currentUser);



  return (
    <div className="App">
      <RealmAppProvider appId={appId}>
        <Router>
          <Navbar/>
          <div>
            <Breadcrumb state={state} setState={setState}> </Breadcrumb>
            <Switch>
              <Route exact path='/Login' component={Login} />
              <Route exact path='/counter' component={counter} />
              <Route exact path='/SignUp' component={SignUp} />
              <Route exact path='/video' component={Video} />
              <Route path='/lib/:libName/(author|sequence|genre|list|search)?/:id?'  render={(props)=>(<Books {...props}  state={state} setState={setState}/> )}/>
              <Route exact path='/'  render={(props)=>(<div><p>Описание сервиса. Выбор библиотеки</p>
                <Link to={"/lib/flibusta"}>Flibusta.net</Link>
              </div>)}/>
            </Switch>
          </div>
        </Router>
      </RealmAppProvider>
    </div>
  );
}

export default App;
