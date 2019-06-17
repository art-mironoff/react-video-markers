import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Marker extends Component {
  onMarkerClick = () => {
    const {marker, onMarkerClick} = this.props;
    onMarkerClick(marker);
  };

  render() {
    const {marker, duration} = this.props;
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
        onClick={this.onMarkerClick}
      />
    );
  }
}

Marker.propTypes = {
  marker: PropTypes.object.isRequired,
  duration: PropTypes.number,
  onMarkerClick: PropTypes.func.isRequired
};

export default Marker;