import React from 'react';
import VideoPlayer from '../src/index.js';

class App extends React.Component {
  render() {
    const markers = [{
      id: 'm1',
      time: 5,
      color: '#ffc837',
      title: 'Marker 1'
    }, {
      id: 'm2',
      time: 10,
      color: '#ffc837',
      title: 'Marker 2'
    }];

    return (
      <VideoPlayer
        url="https://download.blender.org/durian/trailer/sintel_trailer-720p.mp4"
        markers={markers}
      />
    );
  }
}

export default App;