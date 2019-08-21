import React from 'react';

function Marker(props) {
  const onMarkerClick = () => {
    const {marker, onMarkerClick} = props;
    onMarkerClick(marker);
  };

  const {marker, duration} = props;
  const {id, time, color, title} = marker;

  return (
    <i
      id={id}
      className="react-video-marker"
      title={title}
      style={{
        background: color,
        left: duration ? `calc(${time / duration * 100}% - 2px)` : '-9999px'
      }}
      onClick={onMarkerClick}
    />
  );
}

export default Marker;
