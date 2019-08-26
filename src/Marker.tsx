import React from 'react';

interface IProps {
  marker: object;
  duration: number;
  onMarkerClick: (marker: object) => void;
}

function Marker(props) {
  const { marker, duration, onMarkerClick } = props;
  const { id, time, color, title } = marker;

  return (
    <i
      id={id}
      className="react-video-marker"
      title={title}
      style={{
        background: color,
        left: duration ? `calc(${(time / duration) * 100}% - 2px)` : '-9999px'
      }}
      onClick={() => {
        onMarkerClick(marker);
      }}
    />
  );
}

export default Marker;
