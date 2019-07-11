import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Marker from './Marker';

class Controls extends Component {
  getTimeCode = secs => {
    let secondsNumber = secs ? parseInt(secs, 10) : 0;
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - (hours * 3600)) / 60);
    let seconds = secondsNumber - (hours * 3600) - (minutes * 60);

    if (hours < 10) {hours = '0' + hours;}
    if (minutes < 10) {minutes = '0' + minutes;}
    if (seconds < 10) {seconds = '0' + seconds;}

    return `${hours !== '00' ? hours + ':' : ''}${minutes}:${seconds}`;
  };

  render() {
    const {
      controls, isPlaying, volume, muted, currentTime, duration, markers,
      onPlayClick, onPauseClick, onProgressClick, onVolumeClick, onMuteClick, onFullScreenClick, onMarkerClick
    } = this.props;
    const durationTimeCode = this.getTimeCode(Math.ceil(duration));
    const currentTimeCode = currentTime !== duration ? this.getTimeCode(currentTime) : durationTimeCode;

    return (
      <div className="react-video-controls">
        {controls.includes('play') ?
          <button
            className={isPlaying ? 'pause' : 'play'}
            onClick={isPlaying ? onPauseClick : onPlayClick}>
            {isPlaying ? 'Pause' : 'Play'}
          </button> : null}
        {controls.includes('time') ?
          <div className="time">
            {currentTimeCode}/{durationTimeCode}
          </div> : null}
        {controls.includes('progress') ?
          <div className="progress-wrap" ref="progressWrap">
            <progress ref="progress" min="0" max="100" onClick={onProgressClick}>
              0% played
            </progress>
            {markers && markers.map((marker, index) => {
              return (
                <Marker
                  key={index}
                  marker={marker}
                  duration={duration}
                  onMarkerClick={onMarkerClick}
                />
              )
            })}
          </div> : null}
        {controls.includes('volume') ?
          <div className="volume-wrap">
            <progress ref="volume" min="0" max="100" value={volume * 100} onClick={onVolumeClick}>
              {volume * 100}% volume
            </progress>
            <button
              className={muted ? 'no-volume' : 'volume'}
              onClick={onMuteClick}>
              Volume
            </button>
          </div> : null}
        {controls.includes('full-screen') ?
          <button
            className="full-screen"
            onClick={onFullScreenClick}>
            FullScreen
          </button> : null}
      </div>
    );
  }
}

Controls.propTypes = {
  controls: PropTypes.array,
  isPlaying: PropTypes.bool,
  volume: PropTypes.number.isRequired,
  currentTime: PropTypes.number,
  duration: PropTypes.number,
  muted: PropTypes.bool,
  markers: PropTypes.array.isRequired,
  onPlayClick: PropTypes.func,
  onPauseClick: PropTypes.func,
  onProgressClick: PropTypes.func,
  onVolumeClick: PropTypes.func,
  onMuteClick: PropTypes.func,
  onFullScreenClick: PropTypes.func,
  onMarkerClick: PropTypes.func
};

export default Controls;
