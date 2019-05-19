// eslint-disable-next-line
import React, { Component } from "react";
import adminCheck from "../utils/adminCheck";
// import Store from "../Store";
import Sidebar from "./imports/Sidebar";
import RedirectToPath from "../utils/RedirectToPath";
import ProfileDrawer from "./imports/ProfileDrawer";

class AdminDashboard extends Component {
  render() {
    if (adminCheck()) {
      return (
        <div className="admin_dashboard">
          <Sidebar />
          <ProfileDrawer />
          <div className="admin_dashboard_content">
            <h1 className="admin_dashboard_content_title">Dashboard</h1>
          </div>
        </div>
      );
    } else {
      return RedirectToPath("/login");
    }
  }
}

export default AdminDashboard;
