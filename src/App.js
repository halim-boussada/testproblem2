import { Component } from "react";
import moment from "moment";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      name: "",
      msg: "",
      list: [],
      numberOfMessages: 25,
      connected: [],
      loged: true,
      nameError: false,
      userImage: "",
    };
  }
  componentWillMount() {
    if (!localStorage.getItem("images")) {
      localStorage.setItem(
        "images",
        JSON.stringify([
          "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Cat-512.png",
          "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Rabbit-512.png",
          "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Panda-512.png",
          "https://img.myloview.com/posters/cute-panda-bear-with-magnifying-glass-round-avatar-blue-background-vector-illustration-400-166855111.jpg",
        ])
      );
    }

    if (!localStorage.getItem("listOfMessages")) {
      localStorage.setItem("listOfMessages", JSON.stringify([]));
    }

    // we will get the value of user name

    // get the 25 first messages
    this.setState({
      list: JSON.parse(localStorage.getItem("listOfMessages"))
        .reverse()
        .slice(0, 25),
    });
  }

  login() {
    var images = JSON.parse(localStorage.getItem("images"));
    if (this.state.user) {
      if (!localStorage.getItem("connected")) {
        localStorage.setItem("connected", JSON.stringify([]));
        window.addEventListener("beforeunload", this.keepOnPage);
      }
      const name = this.state.user;
      this.setState({ name: name });
      var connected = JSON.parse(localStorage.getItem("connected"));
      var alreadyconnected = false;
      for (var i = 0; i < connected.length; i++) {
        if (connected[i].name === name) {
          alreadyconnected = true;
          this.setState({ userImage: connected[i].image });
        }
      }
      if (!alreadyconnected) {
        var rondomImage = Math.floor(Math.random() * images.length);
        this.setState({ userImage: images[rondomImage] });
        connected.push({
          name: name,
          image: images[rondomImage],
          connected: true,
        });
        images.splice(rondomImage, 1);
        localStorage.setItem("images", JSON.stringify(images));
        localStorage.setItem("connected", JSON.stringify(connected));
      }
      this.setState({ loged: true });
      this.setState({ connected: connected });
      this.setState({ nameError: false });
      document.getElementById("body").scrollTop = document.getElementById(
        "body"
      ).scrollHeight;
    } else {
      this.setState({ nameError: true });
    }
  }
  componentDidMount() {
    document.getElementById("body").scrollTop = document.getElementById(
      "body"
    ).scrollHeight;
    this.setState({ loged: false });
  }
  // // save input value
  handleChange(e) {
    this.setState({ msg: e.target.value });
  }
  handleLogin(e) {
    this.setState({ user: e.target.value });
  }

  disconnect() {
    var connected = JSON.parse(localStorage.getItem("connected"));
    for (var i = 0; i < connected.length; i++) {
      if (connected[i].name === this.state.name) {
        connected[i].connected = false;
      }
    }
    localStorage.setItem("connected", JSON.stringify(connected));
    this.setState({ loged: false });
  }
  // add the message to the local storage
  sendMsg() {
    if (this.state.msg.length) {
      if (!localStorage.getItem("listOfMessages")) {
        localStorage.setItem("listOfMessages", JSON.stringify([]));
      }
      var list = JSON.parse(localStorage.getItem("listOfMessages"));
      list.push({
        name: this.state.name,
        message: this.state.msg,
        date: moment(new Date()).format("h:mm a"),
        userImage: this.state.userImage,
      });
      localStorage.setItem("listOfMessages", JSON.stringify(list));
      this.setState({ list: list });
      this.setState({ msg: "" });
      document.getElementById("body").scrollTop = document.getElementById(
        "body"
      ).scrollHeight;
    }
  }
  // render more messages
  renderMore() {
    const newNumber = this.state.numberOfMessages + 25;
    this.setState({ numberOfMessages: newNumber });
  }
  render() {
    // check the change on the localstorage
    setTimeout(() => {
      this.setState({
        list: JSON.parse(localStorage.getItem("listOfMessages"))
          .reverse()
          .slice(0, this.state.numberOfMessages),
      });
      this.setState({
        connected: JSON.parse(localStorage.getItem("connected")),
      });
    }, 1000);
    return (
      <div>
        {this.state.loged ? (
          <main className="content">
            <div className="container p-2">
              <h1 className="h3 mb-3">
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    this.disconnect();
                  }}
                >
                  disconnect
                </button>
              </h1>

              <div className="card" id="darker">
                <div className="row g-0">
                  <div className="col-12 col-lg-5 col-xl-3 border-right">
                    <div className="px-4 d-none d-md-block">
                      <div className="d-flex align-items-center"></div>
                    </div>

                    <div className="list-group-item list-group-item-action border-0">
                      {this.state.connected.map((user) => {
                        return (
                          <div className="d-flex align-items-start">
                            <img
                              src={user.image}
                              className="rounded-circle mr-1"
                              alt="William Harris"
                              width="40"
                              height="40"
                            />

                            <div className="flex">
                              <strong>{user.name}</strong>
                              <div className="small">
                                {user.connected ? (
                                  <div id="online"></div>
                                ) : (
                                  <div id="offline"></div>
                                )}
                                Online
                              </div>
                              <hr id="hr"></hr>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <hr className="d-block d-lg-none mt-1 mb-0" />
                  </div>
                  <div className="col-12 col-lg-7 col-xl-9">
                    <div className="py-2 px-4 border-bottom d-none d-lg-block">
                      <div className="d-flex align-items-center py-1">
                        <div className="position-relative"></div>
                        <div className="flex-grow-1 pl-3">
                          <strong>Group conversation</strong>
                          <div className="text-muted small"></div>
                        </div>
                        <div></div>
                      </div>
                    </div>

                    <div className="position-relative">
                      <div className="chat-messages p-4" id="body">
                        {JSON.parse(localStorage.getItem("listOfMessages"))
                          .length > this.state.numberOfMessages ? (
                          <button
                            className="button-17"
                            onClick={() => {
                              this.renderMore();
                            }}
                          >
                            Show more ...
                          </button>
                        ) : null}
                        {this.state.list.reverse().map((msg) => {
                          return (
                            <div>
                              {this.state.name === msg.name ? (
                                <div className="chat-message-right mb-4">
                                  <div>
                                    <img
                                      src={msg.userImage}
                                      className="rounded-circle mr-1"
                                      alt="Chris Wood"
                                      width="40"
                                      height="40"
                                    />
                                    <div className="text-muted small text-nowrap mt-2">
                                      {msg.date}
                                    </div>
                                  </div>
                                  <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                    <div className="font-weight-bold mb-1">
                                      <strong>You</strong>
                                    </div>
                                    {msg.message}
                                  </div>
                                </div>
                              ) : (
                                <div className="chat-message-left pb-4">
                                  <div>
                                    <img
                                      src={msg.userImage}
                                      className="rounded-circle mr-1"
                                      alt="Sharon Lessman"
                                      width="40"
                                      height="40"
                                    />
                                    <div className="text-muted small text-nowrap mt-2">
                                      {msg.date}
                                    </div>
                                  </div>
                                  <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                                    <div className="font-weight-bold mb-1">
                                      <strong>{msg.name}</strong>
                                    </div>
                                    {msg.message}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex-grow-0 py-3 px-4 border-top">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Type your message"
                          value={this.state.msg}
                          onChange={(e) => {
                            this.handleChange(e);
                          }}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            this.sendMsg();
                          }}
                        >
                          send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        ) : (
          <div id="signin">
            <div className="form-outline mb-4">
              <label className="form-label" for="form2Example1">
                Username
              </label>
              <input
                type="email"
                id="form2Example1"
                className="form-control"
                onChange={(e) => {
                  this.handleLogin(e);
                }}
              />
              {this.state.nameError ? (
                <div id="error">please add Username</div>
              ) : null}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block mb-4"
              placeholder="Username"
              onClick={() => {
                this.login();
              }}
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
