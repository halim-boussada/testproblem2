import logo from "./logo.svg";
import { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      msg: "",
      list: [],
      numberOfMessages: 25,
    };
  }
  componentWillMount() {
    if (!localStorage.getItem("listOfMessages")) {
      localStorage.setItem("listOfMessages", JSON.stringify([]));
    }
    // we will get the value of user name
    const name = prompt("please entre your name");
    this.setState({ name: name });
    // get the 25 first messages
    this.setState({
      list: JSON.parse(localStorage.getItem("listOfMessages"))
        .reverse()
        .slice(0, 25),
    });
  }
  // save input value
  handleChange(e) {
    this.setState({ msg: e.target.value });
  }
  // add the message to the local storage
  sendMsg() {
    if (!localStorage.getItem("listOfMessages")) {
      localStorage.setItem("listOfMessages", JSON.stringify([]));
    }
    var list = JSON.parse(localStorage.getItem("listOfMessages"));
    list.push({ name: this.state.name, message: this.state.msg });
    localStorage.setItem("listOfMessages", JSON.stringify(list));
    this.setState({ list: list });
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
    }, 1000);
    return (
      <div className="container">
        <div className="header">
          <h1>Halim Chat</h1>
        </div>
        <div className="body" id="container2">
          {JSON.parse(localStorage.getItem("listOfMessages")).length >
          this.state.numberOfMessages ? (
            <button
              className="more"
              onClick={() => {
                this.renderMore();
              }}
            >
              more
            </button>
          ) : null}
          {this.state.list.reverse().map((msg) => {
            return (
              <div>
                {this.state.name === msg.name ? (
                  <div className="message darker">
                    <p>
                      {msg.message} <span class="time-right">from me</span>
                    </p>
                  </div>
                ) : (
                  <div className="message">
                    <p>
                      {msg.message}{" "}
                      <span class="time-right">from {msg.name}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="footer">
          <input
            onChange={(e) => {
              this.handleChange(e);
            }}
          />
          <button
            className="send"
            onClick={() => {
              this.sendMsg();
            }}
          >
            send
          </button>
        </div>
      </div>
    );
  }
}

export default App;
