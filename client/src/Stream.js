import React, { Component } from 'react';

import './Stream.css';

class Stream extends Component {
  state = { error: '' };

  componentDidMount() {
    window.navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(myStream => {
        window.document.querySelector('#myStream').srcObject = myStream;
        const otherVideoObj = window.document.querySelector('#otherStream');
        if (this.props.startCall) {
          const { peer, callId } = this.props;
          const call = peer.call(callId, myStream);
          console.log(peer);
          call.on('stream', remoteStream => {
            otherVideoObj.srcObject = remoteStream;
          });
        } else {
          otherVideoObj.srcObject = this.props.remoteStream;
        }
      })
      .catch(() =>
        this.setState({
          error: 'Please enable camera and audio to use this feature',
        }),
      );
  }

  render() {
    const { error } = this.state;
    return (
      <div className="Stream">
        {error && <div className="Stream-error">{error}</div>}
        <div className="Stream-videos">
          <div className="Stream-other">
            <video autoPlay id="otherStream" />
          </div>
          <div className="Stream-my">
            <video autoPlay id="myStream" />
          </div>
        </div>
      </div>
    );
  }
}

export default Stream;
