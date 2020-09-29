import React, { useState, useContext } from "react";
import * as firebase from "firebase";
import Header from "./Header";
import "./custom.css";
import { useLocation, useHistory } from "react-router-dom";

const Join = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setErrors] = useState("");
  const user = firebase.auth().currentUser;
  const handleForm = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        console.log(res);
        firebase.firestore().collection("emails").add({
          email: email,
          user_id: user.uid,
        });
      })
      .catch((e) => {
        setErrors(e.message);
      });
  };

  return (
    <div>
      <Header />
      <h1 className="c_h1">Join</h1>
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
          Join With Google
        </button>

        <button
          className="c_button"
          type="submit"
          //onClick={() => history.push("/")}
          //onSubmit={() => history.push("/")}
        >
          submit
        </button>

        <span>{error}</span>
      </form>
    </div>
  );
};

export default Join;
