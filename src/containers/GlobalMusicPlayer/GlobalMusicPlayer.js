import './GlobalMusicPlayer.scss';
import cn from 'classnames';
import fp from 'lodash/fp';
import { Icon, Slider, BlurBackground } from '../../components/core';
import ListMusic from './ListMusic';
import { mode } from '../../constants/playing-music';
import AudioAnalyzer from '../../components/AudioAnalyzer';
import withPlayingList from '../../HOC/withPlayingList';
import withPlayingMusic from '../../HOC/withPlayingMusic';

const Audio = ({ className, src, musicRef, ...otherProps }) => (
  <audio className={cn('hidden', className)} ref={musicRef} {...otherProps}>
    <source src={src} />
  </audio>
);

class GlobalMusicPlayer extends React.Component {
  state = {
    musicTime: 0,
    currentMusicTime: 0,
    musicVolume: 0,
    isShowBiggerPlayer: false,
    isMusicReady: false,
  };

  musicRef = React.createRef(null);
  analyserRef = React.createRef(null);

  componentDidMount() {
    this.musicRef.current && this.musicRef.current.play();
    this.setState({ rendered: true });
    this.setStateWhenAudioLoaded();

    this.canvas = this.analyserRef.current;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.canvas.classList = '';
    this.ctx = this.canvas.getContext('2d');
  }

  loopFrame = (fbcArray) => {
    const size = 1;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const rootRadius = 80;
    const R = rootRadius + fbcArray[0] / 5;
    const A = this.canvas.width / 2;
    const B = this.canvas.height / 2;

    const _length = (360 / size);
    for (let i = 0; i < _length; i++) {
      const t = ((230 - (i * size)) / 360) * 2 * Math.PI;

      let x = A + R * Math.cos(t);
      let y = B + R * Math.sin(t);

      let x1 = A + (fbcArray[i]/3 + R) * Math.cos(t);
      let y1 = B + (fbcArray[i]/3 + R) * Math.sin(t);

      this.ctx.beginPath();

      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x1, y1);
      const red = (56 - 17) * (i / _length) + 17;
      const green = (239 - 153) * (i / _length) + 153;
      const blue = (125 - 142) * (i / _length) + 142;
      this.ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
      this.ctx.lineWidth = size;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();
      this.ctx.closePath();
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.playingMusic.id !== prevProps.playingMusic.id && this.musicRef && this.musicRef.current) {
      this.musicRef.current.load();
      this.musicRef.current.play();
    }
  }

  onAnalyzer = (fbcArray) => {
    if (!this.canvas) {
      return;
    }
    this.loopFrame(fbcArray);
  };

  setStateWhenAudioLoaded = () => {
    if (this.musicRef && this.musicRef.current) {
      this.setState({
        musicTime: this.musicRef.current.duration,
        musicVolume: this.musicRef.current.volume,
        currentMusicTime: this.musicRef.current.currentTime,
      }, () => this.props.playingMusicActions.changeIsPlaying(!this.musicRef.current.paused));
    }
  };

  onLoadedData = this.setStateWhenAudioLoaded;

  playMusic = () => this.musicRef && this.musicRef.current && this.musicRef.current.play();
  pauseMusic = () => this.musicRef && this.musicRef.current && this.musicRef.current.pause();

  changeVolume = volume => {
    if (this.musicRef && this.musicRef.current) {
      this.musicRef.current.volume = volume;
      return this.musicRef.current.volume;
    }
  };

  changeCurrentTime = time => {
    if (this.musicRef && this.musicRef.current) {
      this.musicRef.current.currentTime = time;
      return this.musicRef.current.currentTime;
    }
  };

  handleChangeMusicVolume = (e, { value }) => this.setState({ musicVolume: value });
  handleChangeCurrentMusicTime = (e, { value }) => this.changeCurrentTime(value * this.state.musicTime);
  handleHiddenBiggerPlayer = () => this.setState({ isShowBiggerPlayer : false });
  handleShowBiggerPlayer = () => this.setState({ isShowBiggerPlayer : true });

  onTimeUpdate = e => this.setState({ currentMusicTime: e.target.currentTime });
  onVolumeChange = e => this.setState({ volume: e.target.volume });
  onEnded = e => this.props.playingMusicActions.changeIsPlaying(!e.target.paused);
  onPlay = e => this.props.playingMusicActions.changeIsPlaying(!e.target.paused);
  onPause = e => this.props.playingMusicActions.changeIsPlaying(!e.target.paused);
  onWaiting = e => this.props.playingMusicActions.changeIsPlaying(!e.target.paused);
  onPlaying = e => this.props.playingMusicActions.changeIsPlaying(!e.target.paused);

  render() {
    const { className, playingMusic, playingMusicActions, playingList } = this.props;
    const { currentMusicTime, musicTime, isMusicReady, isShowBiggerPlayer } = this.state;

    return (
      <div id="global-music-player" className={cn('ui-global-music-player fixed bottom-0 left-0 w-full', className)}>
        <Audio
          src={playingMusic.src}
          musicRef={this.musicRef}
          loop={playingMusic.mode === mode.LOOP}
          onTimeUpdate={this.onTimeUpdate}
          onLoadedData={this.onLoadedData}
          onPlay={this.onPlay}
          onPause={this.onPause}
          onWaiting={this.onWaiting}
          onPlaying={this.onPlaying}
          onVolumeChange={this.onVolumeChange}
        />
        <div className={cn('global-music-player__biger-player relative w-full z-10 overflow-hidden transition-fast', { 'animated fadeIn slower': isShowBiggerPlayer })} style={{ height: isShowBiggerPlayer ? 'calc(100vh - 6.5em)' : 0 }}>
          <div className="global-music-player__biger-player-container container flex mx-auto h-full relative">
            <Icon
              name="chevron-arrow-down"
              color="white"
              size="xs"
              className="absolute top-0 left-haft z-20 animated fast hidden global-music-player__biger-player__scroll"
              onClick={this.handleHiddenBiggerPlayer}
            />
            <BlurBackground />
            <div className="h-full w-3/12 z-0">
              <div className="w-full h-0"></div>
              <ListMusic
                playingList={playingList}
                playingMusic={playingMusic}
                changeMusic={this.props.playingMusicActions.changeMusic}
              />
            </div>
            <div className="h-full w-9/12 z-0 relative">
              <div className="w-full h-full absolute top-0 left-0 overflow-hidden" style={{ filter: 'blur(5px)', zIndex: '-1' }}>
                <canvas className="w-full" style={{ height: 'calc(100vh - 6.5em)' }} ref={this.analyserRef}></canvas>
              </div>
              <div className="">

              </div>
            </div>
          </div>
        </div>
        <div className="w-full relative --gradient-bg">
          <div className="container relative flex items-center h-10 mx-auto z-10">
            {!isShowBiggerPlayer && (
              <Icon
                name="chevron-arrow-up"
                color="white"
                size="xs"
                className="absolute top-0 left-haft z-20 animated fadeIn slow"
                style={{ transform: 'translate(0, -100%)'}}
                onClick={this.handleShowBiggerPlayer}
              />
            )}
            <div className="flex items-center">
              <Icon name="step-backward" size="xs" color="white" className="mr-4" />
              <div className="flex items-center justify-center rounded-full bg-white h-8 w-8">
                {playingMusic.isPlaying
                  ? <Icon name="pause" size="xs" color="blue-500" onClick={this.pauseMusic} />
                  : <Icon name="play" size="xs" color="blue-500" onClick={this.playMusic} />
                }
              </div>
              <Icon name="step-forward" size="xs" color="white" className="ml-4" />
            </div>
            <Slider
              className="ml-4 flex-1"
              percent={currentMusicTime/musicTime}
              onChange={this.handleChangeCurrentMusicTime}
            />
          </div>
        </div>
        <AudioAnalyzer audioNode={this.musicRef} analyser={this.onAnalyzer} />
      </div>
    );
  }
}

export default fp.compose(
  withPlayingList,
  withPlayingMusic
)(GlobalMusicPlayer);
