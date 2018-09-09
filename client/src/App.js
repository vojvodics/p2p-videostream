import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Main from './Main';
import Stream from './Stream';
import Peer from 'peerjs';
import SocketIO from 'socket.io-client';

class App extends Component {
  state = {
    username: '',
    peer: '',
    users: [],
    remoteStream: '',
    callId: '',
    startCall: false,
    socket: null,
  };

  componentDidMount() {
    const socket = SocketIO('');
    this.setState({ socket });
    socket.on('updateUsers', users => {
      this.setState({ users });
      console.log(users);
    });
  }

  componentWillUnmount() {
    const { socket, peer } = this.state;
    console.log(peer);
    socket.emit('disconnect', { id: peer.id });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { socket, username } = this.state;
    const peer = new Peer();
    setTimeout(() => {
      console.log(peer.id);
      socket.emit('registration', { username, id: peer.id, status: 'online' });
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
