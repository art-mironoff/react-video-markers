import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Marker from './Marker';
import './styles.css';

const DEFAULT_VOLUME = 70;

/**
 * @namespace this.refs.player
**/
class VideoPlayer extends PureComponent {
  state = {
    isPlaying: false,
    duration: null,
    muted: false,
    isFullScreen: false
  };

  componentDidMount() {
    const {player} = this.refs;
    player.addEventListener('timeupdate', this.onProgress);
    player.addEventListener('durationchange', this.onDurationLoaded);
  }

  componentWillUnmount() {
    const {player} = this.refs;
    player.removeEventListener('timeupdate', this.onProgress);
    player.removeEventListener('timeupdate', this.onDurationLoaded);
  }

  componentDidUpdate(prevProps) {
    const {timeCodeStart} = this.props;
    if (prevProps.timeCodeStart !== timeCodeStart) {
      this.seekToPlayer();
    }
    return true;
  }

  seekToPlayer = () => {
    const {player} = this.refs;
    const {timeCodeStart} = this.props;
    if (timeCodeStart && player) {
      player.currentTime = timeCodeStart;
    }
  };

  onPlayerClick = () => {
    const {isPlaying} = this.state;
    if (isPlaying) {
      this.onPauseClick()
    } else {
      this.onPlayClick()
    }
  };

  onDurationLoaded = (e) => {
    const {duration} = e.currentTarget;
    this.setState({duration});
  };

  onProgress = (e) => {
    const {currentTime, duration} = e.currentTarget;
    if (duration) {
      const {progress} = this.refs;
      const percentage = (100 / duration) * currentTime;
      progress.value = percentage;
      progress.innerHTML = percentage + '% played';
      if (currentTime === duration) {
        this.onPauseClick();
      }
    }
  };

  onPlayClick = () => {
    this.setState({isPlaying: true});
    this.refs.player.play();
  };

  onPauseClick = () => {
    this.setState({isPlaying: false});
    this.refs.player.pause();
  };

  onProgressClick = e => {
    const {player, progress} = this.refs;
    const x = e.clientX - progress.getBoundingClientRect().left + document.body.scrollLeft;
    const percentage = x * progress.max / progress.offsetWidth;
    player.currentTime = percentage / 100 * player.duration;
  };

  onVolumeClick = e => {
    const {volume, player} = this.refs;
    const y = volume.offsetWidth - (e.clientY - volume.getBoundingClientRect().top + document.body.scrollTop);
    const percentage = y * volume.max / volume.offsetWidth;
    this.setVolume(percentage);
    player.muted = false;
  };

  setVolume = percentage => {
    const {player, volume} = this.refs;
    player.volume = percentage / 100;
    volume.value = percentage;
    volume.innerHTML = percentage + '% volume'
  };

  onMuteClick = () => {
    const {muted} = this.state;
    const {player} = this.refs;
    if (muted) {
      player.muted = false;
      this.setVolume(DEFAULT_VOLUME);
      this.setState({muted: false});
    } else {
      player.muted = true;
      this.setVolume(0);
      this.setState({muted: true});
    }
  };

  onFullScreenClick = () => {
    const {isFullScreen} = this.state;
    const videoWrap = document.getElementsByClassName('react-video-wrap')[0];
    if (isFullScreen) {
      document.body.classList.remove('react-video-full-screen');
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      document.body.classList.add('react-video-full-screen');
      if(videoWrap.requestFullscreen) {
        videoWrap.requestFullscreen();
      } else if(videoWrap.mozRequestFullScreen) {
        videoWrap.mozRequestFullScreen();
      } else if(videoWrap.webkitRequestFullscreen) {
        videoWrap.webkitRequestFullscreen();
      } else if(videoWrap.msRequestFullscreen) {
        videoWrap.msRequestFullscreen();
      }
    }
    this.setState({isFullScreen: !isFullScreen});
  };

  onMarkerClick = marker => {
    const {onMarkerClick} = this.props;
    const {player} = this.refs;
    player.currentTime = marker['time'];
    onMarkerClick(marker);
  };

  render() {
    const {url, markers} = this.props;
    const {isPlaying, duration, muted, isFullScreen} = this.state;
    return (
      <div className="react-video-wrap">
        <video className="react-video-player" ref="player" onProgress={this.onProgress} onClick={this.onPlayerClick}>
          <source src={url} type="video/mp4"/>
        </video>
        {isFullScreen ?
          <button
            className="react-video-close"
            onClick={this.onFullScreenClick}>
            Close video
          </button> : null
        }
        <div className="react-video-controls">
          <button
            className={isPlaying ? 'pause' : 'play'}
            onClick={isPlaying ? this.onPauseClick : this.onPlayClick}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <div className="progress-wrap" ref="progressWrap">
            <progress ref="progress" min="0" max="100" onClick={this.onProgressClick}>
              0% played
            </progress>
            {markers && markers.map((marker, index) => {
              const {id} = marker;
              return (
                <Marker
                  key={index}
                  marker={marker}
                  duration={duration}
                  onMarkerClick={this.onMarkerClick}
                />
              )
            })}
          </div>
          <div className="volume-wrap">
            <progress ref="volume" min="0" max="100" value={DEFAULT_VOLUME} onClick={this.onVolumeClick}>
              {DEFAULT_VOLUME}% volume
            </progress>
            <button
              className={muted ? 'no-volume' : 'volume'}
              onClick={this.onMuteClick}>
              Volume
            </button>
          </div>
          <button
            className="full-screen"
            onClick={this.onFullScreenClick}>
            FullScreen
          </button>
        </div>
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  timeCodeStart: PropTypes.string,
  markers: PropTypes.array,
  onMarkerClick: PropTypes.func
};

export default VideoPlayer;