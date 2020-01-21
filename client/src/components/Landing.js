// eslint-disable-next-line
import React, { Component } from "react";
import { Link } from "react-router-dom";
// import isLoggedIn from "../utils/isLoggedIn";

class Landing extends Component {
  // componentDidMount() {
  //   if (isLoggedIn()) window.location.href = "/dashboard";
  // }

  render() {
    return (
      <div className="landing">
        <h1 className="landing_title">youa.dev</h1>
        <p className="landing_motto">
          A networking hub for developers. From developers.
        </p>
        <div className="landing_get-started">
          <Link to="/register" className="landing_get-started--redirect">
            Click here to get started.
          </Link>
        </div>
      </div>
    );
  }
}

export default Landing;
