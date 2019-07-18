import React from 'react';
import VideoPlayer from '../src/index.js';
import './styles.css';

class App extends React.Component {
  state = {
    url: 'https://download.blender.org/durian/trailer/sintel_trailer-720p.mp4',
    controls: ['play', 'time', 'progress', 'volume', 'full-screen'],
    isPlaying: false,
    volume: 0.7,
    timeStart: 5
  }

  controls = [{
    id: 'play',
    title: 'Play button'
  }, {
    id: 'time',
    title: 'Time'
  }, {
    id: 'progress',
    title: 'Progress'
  }, {
    id: 'volume',
    title: 'Volume'
  }, {
    id: 'full-screen',
    title: 'Full Screen'
  }];

  handlePlay = () => {
    this.setState({isPlaying: true});
  };

  handlePause = () => {
    this.setState({isPlaying: false});
  };

  handleControlToggle = event => {
    let controls = [...this.state.controls];
    const name = event.target.id;
    if (controls.includes(name)) {
      controls = controls.filter(item => item !== name);
    } else {
      controls.push(name);
    }
    this.setState({controls});
  };

  handleVolume = value => {
    this.setState({volume: value});
  };

  handleProgress(e) {
    console.log('Current time: ', e.target.currentTime);
  }

  handleDuration(duration) {
    console.log('Duration: ', duration);
  }

  handleMarkerClick(marker) {
    alert(`Marker ${marker.id} clicked!`);
  }

  render() {
    const {url, controls, isPlaying, volume, timeStart} = this.state;

    const markers = [{
      id: 1,
      time: 5,
      color: '#ffc837',
      title: 'Marker 1'
    }, {
      id: 2,
      time: 10,
      color: '#ffc837',
      title: 'Marker 2'
    }];

    return (
      <div className="container">
        <VideoPlayer
          url={url}
          controls={controls}
          isPlaying={isPlaying}
          volume={volume}
          loop={true}
          markers={markers}
          height={'360px'}
          width={'640px'}
          timeStart={timeStart}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onVolume={this.handleVolume}
          onProgress={this.handleProgress}
          onDuration={this.handleDuration}
          onMarkerClick={this.handleMarkerClick}
        />
        <div className="controls">
          <p>
            Controls:
            <button onClick={isPlaying ? this.handlePause : this.handlePlay}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </p>
          <p>
            Show controls:
            {this.controls.map(control => {
              return (
                <label key={control.id} htmlFor={control.id}>
                  <input
                    id={control.id}
                    type="checkbox"
                    checked={controls.includes(control.id)}
                    onChange={this.handleControlToggle}
                  /> {control.title}
                </label>
              );
            })}
          </p>
        </div>
        <div>
          <h3>State:</h3>
          <p>url: {url}</p>
          <p>conrols: {controls.length ? '["' : ''}{controls.join('", "')}{controls.length ? '"]' : ''}</p>
          <p>isPlaying: {isPlaying.toString()}</p>
          <p>volume: {volume}</p>
          <p>timeStart: {timeStart}</p>
        </div>
      </div>
    );
  }
}

export default App;
