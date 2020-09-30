import "./App.css";

import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import React, { Component, useState } from "react";
import { List } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ListGroup from "react-bootstrap/ListGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as firebase from "firebase/app";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import PopoverContent from "react-bootstrap/PopoverContent";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { withRouter } from "react-router-dom";
// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";

class Groups extends Component {
  constructor() {
    super();
    this.state = {
      groups: [],
      name: null,
      show: null,
      user1: null,
      user: firebase.auth().currentUser,
    };
  }

  componentDidMount() {
    const { location, history } = this.props;

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .collection("groups")
          .where("friends", "array-contains", user.email)
          .onSnapshot((querySnapshot) => {
            var items = [];
            querySnapshot.forEach(function (doc) {
              debugger;
              items.push(doc);
            });

            this.setState({ groups: items, user: user });
          });
      } else {
        this.setState({ user: null });
      }

      if (this.state.loading) {
        this.setState({ loading: false });
      }
    });

    history.listen((newLocation, action) => {
      if (action !== "PUSH") {
        history.push("/Groups");
      }
    });
  }

  render() {
    const user = firebase.auth().currentUser;
    const { location, history } = this.props;
    return (
      <div flexGrow="1">
        <Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center" bold="yes">
              Groups
            </Typography>
            <OverlayTrigger
              style={{ width: 310 }}
              trigger="click"
              placement="right"
              rootClose={true}
              //rootCloseEvent="click"

              overlay={
                <Popover id="popover-basic" show={this.state.show}>
                  <Popover.Title as="h3">User emails</Popover.Title>
                  <Popover.Content>
                    <InputGroup className="mb-3">
                      <FormControl
                        onChange={(event) => {
                          this.setState({ name: event.target.value });
                        }}
                        placeholder="Group name"
                        aria-label="Group name"
                        aria-describedby="basic-addon2"
                      />
                      <InputGroup.Append>
                        <Button
                          onClick={() => {
                            debugger;
                            firebase
                              .firestore()
                              .collection("groups")
                              .add({
                                name: this.state.name,
                                friends: [user.email],
                              });
                            this.setState({ show: false });
                          }}
                          variant="outline-secondary"
                        >
                          Add
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </Popover.Content>
                </Popover>
              }
              //show={this.state.show}
            >
              <Button
                onClick={() => {
                  debugger;
                  this.setState({ show: true });
                }}
                variant="success"
              >
                Add Group
              </Button>
            </OverlayTrigger>
            <ListGroup>
              {this.state.groups.length == 0 && <div></div>}
              {this.state.groups.length > 0 &&
                this.state.groups.map((data, index) => {
                  //var item = data.data();
                  return (
                    <ListGroup.Item
                      action
                      onClick={() =>
                        history.push("/App", { group_id: data.id })
                      }
                    >
                      {data.data().name}
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default withRouter(Groups);
