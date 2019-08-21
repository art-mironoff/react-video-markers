import React, {useState, useEffect, useRef} from 'react';
import Controls from './Controls';
import './styles.css';

const DEFAULT_VOLUME = 0.7;

function VideoPlayer(props) {
  const playerEl = useRef(null);
  const progressEl = useRef(null);
  const volumeEl = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(null);
  const [muted, setMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] =  useState(false);

  const {
    url,
    controls = ['play', 'time', 'progress', 'volume', 'full-screen'],
    height = '360px',
    width = '640px',
    isPlaying = false,
    volume = 0.7,
    loop = false,
    markers = [],
    timeStart = 0,
    onPlay = () => {},
    onPause = () => {},
    onVolume = () => {},
    onProgress = () => {},
    onDuration = () => {},
    onMarkerClick = () => {}
  } = props;

  useEffect(() => {
    playerEl.current.addEventListener('timeupdate', handleProgress);
    playerEl.current.addEventListener('durationchange', handleDurationLoaded);
    if (timeStart) {
      seekToPlayer();
    }
    if (isPlaying) {
      playerEl.play();
    }

    return () => {
      playerEl.current.removeEventListener('timeupdate', handleProgress);
      playerEl.current.removeEventListener('durationchange', handleDurationLoaded);
    }
  }, []);

  useEffect(() => {
    seekToPlayer();
  }, [timeStart]);

  useEffect(() => {
    isPlaying ? playerEl.current.play() : playerEl.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    setVolume(volume);
  }, [volume]);

  const seekToPlayer = () => {
    if (timeStart && playerEl) {
      playerEl.current.currentTime = timeStart;
    }
  };

  const setVolume = value => {
    playerEl.current.volume = value;
    setMuted(!value);
  };

  const handlePlayerClick = () => {
    if (isPlaying) {
      onPause()
    } else {
      onPlay()
    }
  };

  const handleDurationLoaded = (e) => {
    const {duration} = e.currentTarget;
    setVideoDuration(duration);
    onDuration(duration);
  };

  const handleProgress = (e) => {
    const {currentTime, duration} = e.currentTarget;
    if (duration) {
      setCurrentTime(currentTime);
      const percentage = (100 / duration) * currentTime;
      progressEl.current.value = percentage;
      progressEl.current.innerHTML = percentage + '% played';
      if (currentTime === duration) {
        onPause();
      }
    }
    onProgress(e);
  };

  const handleProgressClick = e => {
    const x = e.clientX - progressEl.current.getBoundingClientRect().left + document.body.scrollLeft;
    const percentage = x * progressEl.current.max / progressEl.current.offsetWidth;
    playerEl.current.currentTime = percentage / 100 * playerEl.current.duration;
  };

  const handleVolumeClick = e => {
    const y = volumeEl.current.offsetWidth - (e.clientY - volumeEl.current.getBoundingClientRect().top + document.body.scrollTop);
    const percentage = y * volumeEl.current.max / volumeEl.current.offsetWidth;
    playerEl.current.muted = false;
    onVolume(percentage / 100);
  };

  const handleMuteClick = () => {
    if (muted) {
      playerEl.current.muted = false;
      setVolume(DEFAULT_VOLUME);
      setMuted(false);
    } else {
      playerEl.current.muted = true;
      setVolume(0);
      setMuted(true);
    }
  };

  const handleFullScreenClick = () => {
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
      if (videoWrap.requestFullscreen) {
        videoWrap.requestFullscreen();
      } else if(videoWrap.mozRequestFullScreen) {
        videoWrap.mozRequestFullScreen();
      } else if(videoWrap.webkitRequestFullscreen) {
        videoWrap.webkitRequestFullscreen();
      } else if(videoWrap.msRequestFullscreen) {
        videoWrap.msRequestFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  const handleMarkerClick = marker => {
    playerEl.current.currentTime = marker['time'];
    onMarkerClick(marker);
  };

  return (
    <div className="react-video-wrap" style={{height, width}}>
      <video
        ref={playerEl}
        className="react-video-player"
        loop={loop}
        onProgress={onProgress}
        onClick={handlePlayerClick}>
        <source src={url} type="video/mp4"/>
      </video>
      {isFullScreen ?
        <button
          className="react-video-close"
          onClick={handleFullScreenClick}>
          Close video
        </button> : null
      }
      <Controls
        progressEl={progressEl}
        volumeEl={volumeEl}
        controls={controls}
        isPlaying={isPlaying}
        volume={volume}
        currentTime={currentTime}
        duration={videoDuration}
        muted={muted}
        markers={markers}
        onPlayClick={onPlay}
        onPauseClick={onPause}
        onProgressClick={handleProgressClick}
        onVolumeClick={handleVolumeClick}
        onMuteClick={handleMuteClick}
        onFullScreenClick={handleFullScreenClick}
        onMarkerClick={handleMarkerClick}
      />
    </div>
  );
}

export default VideoPlayer;
