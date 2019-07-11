import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Controls from './Controls';
import './styles.css';

export const DEFAULT_VOLUME = 70;

/**
 * @namespace this.refs.player
 **/
class VideoPlayer extends PureComponent {
  state = {
    currentTime: 0,
    duration: null,
    muted: false,
    isFullScreen: false
  };

  componentDidMount() {
    const {player} = this.refs;
    player.addEventListener('timeupdate', this.onProgress);
    player.addEventListener('durationchange', this.onDurationLoaded);
    if (this.props.isPlaying) {
      player.play();
    }
  }

  componentWillUnmount() {
    const {player} = this.refs;
    player.removeEventListener('timeupdate', this.onProgress);
    player.removeEventListener('durationchange', this.onDurationLoaded);
  }

  componentDidUpdate(prevProps) {
    const {timeCodeStart} = this.props;
    if (prevProps.timeCodeStart !== timeCodeStart) {
      this.seekToPlayer();
    }
    return true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPlaying !== this.state.isPlaying) {
      nextProps.isPlaying ? this.refs.player.play() : this.refs.player.pause();
    }
    if (nextProps.volume !== this.state.volume) {
      this.setVolume(nextProps.volume);
    }
  }

  seekToPlayer = () => {
    const {player} = this.refs;
    const {timeCodeStart} = this.props;
    if (timeCodeStart && player) {
      player.currentTime = timeCodeStart;
    }
  };

  onPlayerClick = () => {
    const {isPlaying, onPlay, onPause} = this.props;
    if (isPlaying) {
      onPause()
    } else {
      onPlay()
    }
  };

  onDurationLoaded = (e) => {
    const {duration} = e.currentTarget;
    this.setState({duration});
    this.props.onDuration(duration);
  };

  onProgress = (e) => {
    const {onPause, onProgress} = this.props;
    const {currentTime, duration} = e.currentTarget;
    if (duration) {
      this.setState({currentTime});
      const {progress} = this.refs.controls.refs;
      const percentage = (100 / duration) * currentTime;
      progress.value = percentage;
      progress.innerHTML = percentage + '% played';
      if (currentTime === duration) {
        onPause();
      }
    }
    onProgress(e);
  };

  onProgressClick = e => {
    const {player} = this.refs;
    const {progress} = this.refs.controls.refs;
    const x = e.clientX - progress.getBoundingClientRect().left + document.body.scrollLeft;
    const percentage = x * progress.max / progress.offsetWidth;
    player.currentTime = percentage / 100 * player.duration;
  };

  onVolumeClick = e => {
    const {player, controls} = this.refs;
    const {volume} = controls.refs;
    const y = volume.offsetWidth - (e.clientY - volume.getBoundingClientRect().top + document.body.scrollTop);
    const percentage = y * volume.max / volume.offsetWidth;
    player.muted = false;
    this.props.onVolume(percentage / 100);
  };

  setVolume = value => {
    const {player} = this.refs;
    player.volume = value;
    this.setState({
      muted: !value
    });
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
    const {url, controls, isPlaying, volume, loop, markers, height, width, onPlay, onPause} = this.props;
    const {currentTime, duration, muted, isFullScreen} = this.state;
    return (
      <div className="react-video-wrap" style={{height, width}}>
        <video
          ref="player"
          className="react-video-player"
          loop={loop}
          onProgress={this.onProgress}
          onClick={this.onPlayerClick}>
          <source src={url} type="video/mp4"/>
        </video>
        {isFullScreen ?
          <button
            className="react-video-close"
            onClick={this.onFullScreenClick}>
            Close video
          </button> : null
        }
        <Controls
          ref="controls"
          controls={controls}
          isPlaying={isPlaying}
          volume={volume}
          currentTime={currentTime}
          duration={duration}
          muted={muted}
          markers={markers}
          onPlayClick={onPlay}
          onPauseClick={onPause}
          onProgressClick={this.onProgressClick}
          onVolumeClick={this.onVolumeClick}
          onMuteClick={this.onMuteClick}
          onFullScreenClick={this.onFullScreenClick}
          onMarkerClick={this.onMarkerClick}
        />
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  controls: PropTypes.array,
  height: PropTypes.string,
  isPlaying: PropTypes.bool.isRequired,
  volume: PropTypes.number.isRequired,
  loop: PropTypes.bool,
  markers: PropTypes.array,
  timeCodeStart: PropTypes.string,
  url: PropTypes.string.isRequired,
  width: PropTypes.string,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onVolume: PropTypes.func,
  onProgress: PropTypes.func,
  onDuration: PropTypes.func,
  onMarkerClick: PropTypes.func
};

VideoPlayer.defaultProps = {
  controls: ['play', 'time', 'progress', 'volume', 'full-screen'],
  height: '360px',
  width: '640px',
  volume: 0.7,
  onPlay: () => {},
  onPause: () => {},
  onVolume: () => {},
  onProgress: () => {},
  onDuration: () => {},
  onMarkerClick: () => {}
};

export default VideoPlayer;
