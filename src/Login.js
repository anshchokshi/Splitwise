import React, { useState, useContext } from "react";
import { AuthContext } from "./index";
import * as firebase from "firebase";
import { useLocation, useHistory, useEffect } from "react-router-dom";
import Header from "./Header";
import "./custom.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setErrors] = useState("");
  const history = useHistory();

  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       history.push()
  //     }
  //   });
  // }, []);

  const handleForm = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        history.push("/Groups");
      })
      .catch((e) => {
        setErrors(e.message);
      });
  };

  return (
    <div>
      <Header />

      <h1 className={"c_h1"}>Login</h1>
      <form className="c_form" onSubmit={(e) => handleForm(e)}>
        <input
          className="c_input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          type="email"
          placeholder="email"
        />
        <input
          className="c_input"
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          value={password}
          type="password"
          placeholder="password"
        />
        <hr />
        <button className="c_googleBtn" type="button">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="logo"
          />
          Login With Google
        </button>
        <button className="c_button" type="submit">
          Login
        </button>
        <span>{error}</span>
      </form>
    </div>
  );
};

export default Login;
