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
import Checkbox from "@material-ui/core/Checkbox";
import * as firebase from "firebase/app";
import Popover from "react-bootstrap/Popover";
import PopoverContent from "react-bootstrap/PopoverContent";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { convert, simplify } from "./main";
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      friends: [],
      show: null,
      show2: false,
      expenses: [],
      default: null,
      by: null,
      to: [],
      tag: null,
      amount: null,
      transactions: [],
    };
  }

  async componentDidMount() {
    console.log(firebase.auth());
    const user = firebase.auth().currentUser;
    const { location, history } = this.props;
    debugger;
    firebase
      .firestore()
      .collection("emails")
      .onSnapshot((querySnapshot) => {
        var items = [];
        querySnapshot.forEach(function (doc) {
          debugger;
          if (
            firebase.auth().currentUser &&
            firebase.auth().currentUser.email &&
            doc.data().email !== firebase.auth().currentUser.email
          ) {
            items.push(doc);
          }
        });

        this.setState({ items: items });
      });
    var docRef = firebase
      .firestore()
      .collection("groups")
      .doc(this.props.location.state.group_id);
    debugger;
    let doc = await docRef.get();
    if (doc.exists) {
      //debugger;
      //console.log("Document data:", doc.data());
      this.setState({ friends: doc.data().friends });
      debugger;
      this.setState({
        by: doc.data().friends[0],
      });

      //this.state.friends = doc.data().friends;
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    await firebase
      .firestore()
      .collection("groups")
      .doc(this.props.location.state.group_id)
      .collection("expense")
      .onSnapshot((querySnapshot) => {
        debugger;
        var items = [];
        querySnapshot.forEach(function (doc) {
          items.push(doc.data());
        });

        this.setState({ expenses: items });

        if (this.state.expenses.length > 0) {
          debugger;
          var x = convert(this.state.expenses);
          var item = simplify(x);
          this.setState({
            transactions: item,
          });
        }
      });

    history.listen((newLocation, action) => {
      if (action !== "PUSH") {
        history.push("/App");
      }
    });
  }

  render() {
    const user = firebase.auth().currentUser;
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    return (
      <div flexGrow="1" align="center">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center" bold="yes">
              Users
            </Typography>
            <OverlayTrigger
              style={{ width: 310 }}
              trigger="click"
              placement="right"
              rootClose={true}
              overlay={
                <Popover id="popover-basic">
                  <Popover.Title as="h3">User emails</Popover.Title>
                  <Popover.Content>
                    <Autocomplete
                      id="combo-box-demo"
                      options={this.state.items}
                      getOptionLabel={(option) => option.data().email}
                      style={{ width: 200 }}
                      onChange={(event, value, reason) => {
                        if (!this.state.friends.includes(value.data().email)) {
                          debugger;
                          var items = [
                            ...this.state.friends,
                            value.data().email,
                          ];
                          firebase
                            .firestore()
                            .collection("groups")
                            .doc(this.props.location.state.group_id)
                            .update({
                              friends: items,
                            });
                          this.setState({
                            friends: items,
                          });
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Users"
                          variant="outlined"
                        />
                      )}
                    />
                  </Popover.Content>
                </Popover>
              }
              //show={this.state.show}
            >
              <Button
                //onClick={() => this.setState({ show: true })}
                variant="success"
              >
                Add friends
              </Button>
            </OverlayTrigger>
            <ListGroup>
              {this.state.friends.length == 0 && <div></div>}
              {this.state.friends.length > 0 &&
                this.state.friends.map((data, index) => {
                  //var item = data.data();
                  return <ListGroup.Item>{data}</ListGroup.Item>;
                })}
            </ListGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" align="center" bold="yes">
              Groups
            </Typography>
            <Button
              variant="primary"
              onClick={() => {
                this.setState({ show: true });
              }}
            >
              Add Expense
            </Button>

            <Modal
              show={this.state.show}
              onHide={() => {
                this.setState({ show: false });
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Expense</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Who paid</Form.Label>
                    <Form.Control
                      defaultValue={this.state.default}
                      onChange={(event) => {
                        debugger;
                        this.setState({
                          by: event.target.value,
                        });
                      }}
                      as="select"
                    >
                      {this.state.friends.length == 0 && <div></div>}
                      {this.state.friends.length > 0 &&
                        this.state.friends.map((data, index) => {
                          //var item = data.data();
                          return <option>{data}</option>;
                        })}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      defaultValue="0"
                      placeholder="enter amount"
                      type="number"
                      onChange={(event) => {
                        this.setState({
                          amount: event.target.value,
                        });
                      }}
                    />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label>Tag</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={(event) => {
                        this.setState({
                          tag: event.target.value,
                        });
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Custom select</Form.Label>
                    <Form.Control
                      onChange={(event) => {
                        debugger;
                        if (event.target.value == "all") {
                          this.setState({
                            to: this.state.friends,
                          });
                        }
                        debugger;
                        this.setState({
                          show2: event.target.value == "all",
                        });
                      }}
                      as="select"
                      custom
                    >
                      <option value={"subgrup"}>Subgroup</option>
                      <option value={"all"}>Among all</option>
                    </Form.Control>
                    <p></p>
                    <Autocomplete
                      onChange={(event, value, reason) => {
                        this.setState({
                          to: value,
                        });
                      }}
                      disabled={this.state.show2}
                      multiple
                      id="checkboxes-tags-demo"
                      options={this.state.friends}
                      disableCloseOnSelect
                      renderOption={(option, { selected }) => (
                        <React.Fragment>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option}
                        </React.Fragment>
                      )}
                      style={{ width: 350 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="select subgroup"
                          placeholder="friends"
                        />
                      )}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    this.setState({ show: false });
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    debugger;
                    var items = {
                      by: this.state.by,
                      tag: this.state.tag,
                      amount: this.state.amount,
                      to: this.state.to,
                    };

                    firebase
                      .firestore()
                      .collection("groups")
                      .doc(this.props.location.state.group_id)
                      .collection("expense")
                      .add(items);
                    this.setState({ show: false });
                  }}
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
            <ListGroup>
              {this.state.expenses.length == 0 && <div></div>}
              {this.state.expenses.length > 0 &&
                this.state.expenses.map((data, index) => {
                  //var item = data.data();
                  return (
                    <ListGroup.Item>
                      {" "}
                      {data.by} paid amount {data.amount} for {data.tag} to{" "}
                      {data.to}{" "}
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
          </Grid>
        </Grid>
        <br></br>
        <Grid container xs={12} align="center">
          <Grid container item md={4}></Grid>
          <Grid container item md={4}>
            <ListGroup>
              {this.state.transactions.length == 0 && <div></div>}
              {this.state.transactions.length > 0 &&
                this.state.transactions.map((data, index) => {
                  //var item = data.data();
                  return <ListGroup.Item>{data}</ListGroup.Item>;
                })}
            </ListGroup>
          </Grid>
          <Grid container item md={4}></Grid>
        </Grid>
      </div>
    );
  }
}
