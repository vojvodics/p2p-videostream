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
    loading: true,
  };

  componentDidMount() {
    const socket = SocketIO('http://127.0.0.1:3001');
    const username = window.localStorage.getItem('username');
    this.setState({ socket, loading: false, username });

    socket.on('updateUsers', users => {
      this.setState({ users });
      console.log(users);
    });
    if (username) {
      this.addPeer();
    }
  }

  componentWillUnmount() {
    const { socket, peer } = this.state;
    console.log(peer);
    socket.emit('disconnect', { id: peer.id });
  }

  addPeer = () => {
    const { socket, username } = this.state;
    console.log(socket);
    const peer = new Peer();
    peer.on('open', id => {
      console.log(peer.id);
      window.localStorage.setItem('username', username);
      socket.emit('registration', { username, id, status: 'online' });
      this.setState({ peer, loading: false });
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
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.addPeer();
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
    const {
      username,
      peer,
      users,
      remoteStream,
      startCall,
      loading,
    } = this.state;
    const loggedIn = this.isLoggedIn();

    if (loading) {
      return <div>Loading...</div>;
    }

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
