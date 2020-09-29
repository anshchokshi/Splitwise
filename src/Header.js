import React from "react";
import routes from "./routes";
import { Link } from "react-router-dom";
import "./custom.css";
const Header = () => (
  <ul className="nav">
    {routes.map((route, i) =>
      route.name != "App" ? (
        <li key={i}>
          <Link to={route.path}>{route.name}</Link>
        </li>
      ) : null
    )}
  </ul>
);

export default Header;
