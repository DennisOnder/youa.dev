import React, { Fragment, Component } from "react";
import Store from "../Store";
import ProfileDrawer from "./imports/ProfileDrawer";
import Sidebar from "./imports/Sidebar";
import isLoggedIn from "../utils/isLoggedIn";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: false,
      user: false
    };
  }
  componentDidMount() {
    Store.getProfile(this.props.match.params.handle, (err, data) => {
      if (err) window.location.href = "/404";
      this.setState({ data });
    });
    if (isLoggedIn()) {
      Store.checkProfile().then(profile => this.setState({ user: profile }));
    }
  }
  render() {
    return (
      <div className="profile_page">
        {this.state.data.profile ? (
          <Fragment>
            {this.state.user ? (
              <Fragment>
                <Sidebar handle={`/profile/${this.state.user.handle}`} />
                <ProfileDrawer
                  firstName={this.state.user.firstName}
                  lastName={this.state.user.lastName}
                  profilePicture={this.state.user.profilePicture}
                />
              </Fragment>
            ) : (
              ""
            )}
            <div className="profile_page_header">
              <div className="profile_page_header--info">
                <img src={this.state.data.profile.profilePicture} alt="img" />
                <p className="profile_page_header--info_text">
                  {this.state.data.profile.firstName}{" "}
                  {this.state.data.profile.lastName}
                </p>
                {this.state.data.profile.biography ? (
                  <p className="profile_page_header--info_text">
                    {this.state.data.profile.biography}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div className="profile_page_header--social">
                {this.state.data.profile.github !== "" ? (
                  <a href={this.state.data.profile.github}>
                    <i className="fab fa-github-square fa-2x" />
                  </a>
                ) : (
                  ""
                )}
                {this.state.data.profile.linkedin !== "" ? (
                  <a href={this.state.data.profile.linkedin}>
                    <i className="fab fa-linkedin fa-2x" />
                  </a>
                ) : (
                  ""
                )}
                {this.state.data.profile.stackoverflow !== "" ? (
                  <a href={this.state.data.profile.stackoverflow}>
                    <i className="fab fa-stack-overflow fa-2x" />
                  </a>
                ) : (
                  ""
                )}
                {this.state.data.profile.dev !== "" ? (
                  <a href={this.state.data.profile.dev}>
                    <i className="fab fa-dev fa-2x" />
                  </a>
                ) : (
                  ""
                )}
                {this.state.data.profile.website !== "" ? (
                  <a href={this.state.data.profile.website}>
                    <i className="fas fa-external-link-square-alt fa-2x" />
                  </a>
                ) : (
                  ""
                )}
                {isLoggedIn() &&
                this.state.data.profile.user_id !== this.state.user.user_id ? (
                  <div className="profile_page_header_controls">
                    <button className="profile_page_header_controls_control">
                      Message
                    </button>
                    <button
                      className="profile_page_header_controls_control"
                      onClick={() =>
                        Store.followUser(this.state.data.profile.user_id)
                      }
                    >
                      Follow
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="profile_posts">
              <h1 className="profile_posts_header">Posts:</h1>
              {this.state.data.posts.length > 0 ? (
                this.state.data.posts.map(post => {
                  return (
                    <div
                      key={post.id}
                      className="profile_posts--post"
                      onClick={() =>
                        (window.location.href = `/post/${post.handle}`)
                      }
                    >
                      <p>{post.title}</p>
                      <p>{`Created at: ${post.createdAt.split("T")[0]}`}</p>
                    </div>
                  );
                })
              ) : (
                <p style={{ textAlign: "center" }}>User has no posts.</p>
              )}
            </div>
          </Fragment>
        ) : (
          <p />
        )}
      </div>
    );
  }
}
