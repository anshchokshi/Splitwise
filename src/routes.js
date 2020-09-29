import React from "react";
import Login from "./Login";
import Join from "./Join";
import App from "./App";

const routes = [
  { name: "Join", path: "/join", exact: false, main: () => <Join /> },
  { name: "Login", path: "/login", exact: true, main: () => <Login /> },
  { name: "App", path: "/App", exact: true, main: () => <App /> },
];

export default routes;
