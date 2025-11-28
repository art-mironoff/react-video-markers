import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import VideoPlayer from './index';

describe('VideoPlayer', () => {
  beforeAll(() => {
    window['HTMLMediaElement'].prototype.play = () => Promise.resolve();
    window['HTMLMediaElement'].prototype.pause = () => {};
  });

  const markers: object[] = [
    { id: 1, time: 5, color: '#ffc837', title: 'Marker 1' },
    { id: 2, time: 10, color: '#ff0000', title: 'Marker 2' }
  ];

  let container: HTMLDivElement | null = null;

  const renderPlayer = (props = {}) => {
    const defaultProps = {
      url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      controls: ['play', 'time', 'progress', 'volume', 'full-screen'],
      isPlaying: false,
      volume: 0.7,
      markers: markers
    };
    act(() => {
      ReactDOM.render(<VideoPlayer {...defaultProps} {...props} />, container);
    });
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  describe('rendering', () => {
    it('renders video element', () => {
      renderPlayer();
      expect(container!.querySelector('video')).not.toBeNull();
    });

    it('renders all default controls', () => {
      renderPlayer();
      expect(container!.querySelector('button.play')).not.toBeNull();
      expect(container!.querySelector('div.time')).not.toBeNull();
      expect(container!.querySelector('div.progress-wrap')).not.toBeNull();
      expect(container!.querySelector('div.volume-wrap')).not.toBeNull();
      expect(container!.querySelector('button.full-screen')).not.toBeNull();
    });

    it('renders markers', () => {
      renderPlayer();
      const markerElements = container!.querySelectorAll('i.react-video-marker');
      expect(markerElements.length).toBe(2);
    });

    it('renders no controls when empty array', () => {
      renderPlayer({ controls: [] });
      expect(container!.querySelector('.react-video-controls')).toBeNull();
    });

    it('renders only specified controls', () => {
      renderPlayer({ controls: ['play', 'time'] });
      expect(container!.querySelector('button.play')).not.toBeNull();
      expect(container!.querySelector('div.time')).not.toBeNull();
      expect(container!.querySelector('div.progress-wrap')).toBeNull();
      expect(container!.querySelector('div.volume-wrap')).toBeNull();
      expect(container!.querySelector('button.full-screen')).toBeNull();
    });
  });

  describe('play/pause', () => {
    it('shows play button when paused', () => {
      renderPlayer({ isPlaying: false });
      expect(container!.querySelector('button.play')).not.toBeNull();
      expect(container!.querySelector('button.pause')).toBeNull();
    });

    it('shows pause button when playing', () => {
      renderPlayer({ isPlaying: true });
      expect(container!.querySelector('button.pause')).not.toBeNull();
      expect(container!.querySelector('button.play')).toBeNull();
    });

    it('calls onPlay when play button clicked', () => {
      const onPlay = jest.fn();
      renderPlayer({ isPlaying: false, onPlay });
      act(() => {
        container!.querySelector('button.play')!.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
      });
      expect(onPlay).toHaveBeenCalledTimes(1);
    });

    it('calls onPause when pause button clicked', () => {
      const onPause = jest.fn();
      renderPlayer({ isPlaying: true, onPause });
      act(() => {
        container!.querySelector('button.pause')!.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
      });
      expect(onPause).toHaveBeenCalledTimes(1);
    });

    it('calls onPause when video clicked while playing', () => {
      const onPause = jest.fn();
      renderPlayer({ isPlaying: true, onPause });
      act(() => {
        container!.querySelector('video')!.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
      });
      expect(onPause).toHaveBeenCalledTimes(1);
    });

    it('calls onPlay when video clicked while paused', () => {
      const onPlay = jest.fn();
      renderPlayer({ isPlaying: false, onPlay });
      act(() => {
        container!.querySelector('video')!.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
      });
      expect(onPlay).toHaveBeenCalledTimes(1);
    });
  });

  describe('volume', () => {
    it('shows volume button when not muted', () => {
      renderPlayer({ volume: 0.7 });
      expect(container!.querySelector('button.volume')).not.toBeNull();
      expect(container!.querySelector('button.no-volume')).toBeNull();
    });

    it('shows no-volume button when muted', () => {
      renderPlayer({ volume: 0 });
      expect(container!.querySelector('button.no-volume')).not.toBeNull();
    });

    it('displays volume level in progress', () => {
      renderPlayer({ volume: 0.5 });
      const volumeProgress = container!.querySelector('.volume-wrap progress');
      expect(volumeProgress!.getAttribute('value')).toBe('50');
    });
  });

  describe('markers', () => {
    it('renders markers with correct colors', () => {
      renderPlayer();
      const markerElements = container!.querySelectorAll('i.react-video-marker');
      expect((markerElements[0] as HTMLElement).style.background).toBe('rgb(255, 200, 55)');
      expect((markerElements[1] as HTMLElement).style.background).toBe('rgb(255, 0, 0)');
    });

    it('renders markers with correct titles', () => {
      renderPlayer();
      const markerElements = container!.querySelectorAll('i.react-video-marker');
      expect(markerElements[0].getAttribute('title')).toBe('Marker 1');
      expect(markerElements[1].getAttribute('title')).toBe('Marker 2');
    });

    it('calls onMarkerClick when marker clicked', () => {
      const onMarkerClick = jest.fn();
      renderPlayer({ onMarkerClick });
      act(() => {
        container!.querySelector('i.react-video-marker')!.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
      });
      expect(onMarkerClick).toHaveBeenCalledTimes(1);
      expect(onMarkerClick).toHaveBeenCalledWith(markers[0]);
    });

    it('renders no markers when empty array', () => {
      renderPlayer({ markers: [] });
      expect(container!.querySelectorAll('i.react-video-marker').length).toBe(0);
    });
  });

  describe('dimensions', () => {
    it('applies custom width and height', () => {
      renderPlayer({ width: '800px', height: '450px' });
      const wrap = container!.querySelector('.react-video-wrap') as HTMLElement;
      expect(wrap.style.width).toBe('800px');
      expect(wrap.style.height).toBe('450px');
    });

    it('uses default dimensions', () => {
      renderPlayer();
      const wrap = container!.querySelector('.react-video-wrap') as HTMLElement;
      expect(wrap.style.width).toBe('640px');
      expect(wrap.style.height).toBe('360px');
    });
  });
});
