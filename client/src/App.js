import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Main from './Main';
import Stream from './Stream';
import Peer from 'peerjs';

class App extends Component {
  state = {
    username: '',
    peer: '',
    users: [],
    remoteStream: '',
    callId: '',
    startCall: false,
  };

  componentDidMount() {
    const users = window.localStorage.getItem('users') || '[]';
    this.setState({
      users: JSON.parse(users),
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const peer = new Peer();
    setTimeout(() => {
      console.log(peer.id);
      let users = window.localStorage.getItem('users') || '[]';
      users = [...JSON.parse(users), { id: peer.id }];
      window.localStorage.setItem('users', JSON.stringify(users));
      this.setState({ peer });
      peer.on('call', call => {
        const res = window.confirm('Accept call?');
        if (res) {
          console.log(call);
          this.setState({ startCall: false });
          window.navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then(stream => {
              call.answer(stream);
              call.on('stream', remoteStream => {
                this.setState({ remoteStream });
              });
            });
        }
      });
    }, 1000);
  };

  updateUsername = username => {
    this.setState({ username });
  };

  handleStartStream = userId => {
    console.log(userId);
    this.setState({ callId: userId, remoteStream: userId, startCall: true });
  };

  isLoggedIn = () => this.state.username && this.state.peer.id;

  render() {
    const { username, peer, users, remoteStream, startCall } = this.state;
    const loggedIn = this.isLoggedIn();

    return (
      <div className="App">
        {!loggedIn && (
          <Login
            updateUsername={this.updateUsername}
            onSubmit={this.handleSubmit}
          />
        )}
        {loggedIn &&
          !remoteStream && (
            <Main {...this.state} startStream={this.handleStartStream} />
          )}
        {loggedIn && remoteStream && <Stream {...this.state} />}
      </div>
    );
  }
}

export default App;
