import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
//import './index.css';
import history from "./history";
import App from "./App";
import Groups from "./Groups";
///import App from './App';
///import * as serviceWorker from './serviceWorker';

//ReactDOM.render(
// <React.StrictMode>
//   <App />
// </React.StrictMode>,
// document.getElementById('root')
//);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
///serviceWorker.unregister();

import { Switch, Route, Redirect } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import routes from "./routes.js";
import Header from "./Header";
import "./custom.css";

import * as firebase from "firebase";
import firebaseConfig from "./firebase.config";
import Login from "./Login";
import Join from "./Join";

firebase.initializeApp(firebaseConfig);

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoadingAuth(false);
    });
  }, []);

  if (loadingAuth) {
    return <div>Loading....</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )
      }
    />
  );
};

function Application() {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/join" component={Join} />
        <Route path="/App" component={App} />
        <Route path="/Groups" component={Groups} />
      </Switch>
    </Router>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Application />, rootElement);
