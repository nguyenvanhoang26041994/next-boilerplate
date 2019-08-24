import React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import fp from 'lodash/fp';

import { Image, Icon, Divider } from '../../components/core';
import withPlayingList from '../../HOC/withPlayingList';
import withPlayingMusic from '../../HOC/withPlayingMusic';
import withPlayerActions from '../../HOC/withPlayerActions';
import { getNode } from '../GlobalAudio';

const GlobalMusicPlayerWrapper = styled.div``;

const GlobalMusicPlayer = ({ className, playingMusic, playerActions }) => {
  const playMusic = () => getNode().play();

  return (
    <GlobalMusicPlayerWrapper
      id="global-music-player-mobile"
      className={cn('ui-global-music-player-mobile fixed bottom-0 left-0 w-full', { 'hidden': !playingMusic.src }, className)}
    >
      <div className="w-full h-10 bg-white flex justify-between items-center">
        <div className="h-full flex items-center">
          <Image src={playingMusic.img} className="w-10 h-full" />
          <div className="flex flex-col ml-1">
            <div className="text-teal-500 text-xs w-48 overflow-hidden">{playingMusic.name}</div>
            <div className="text-gray-800 text-2xs w-48 overflow-hidden">{playingMusic.singersName}</div>
          </div>
        </div>
        <div className="h-full flex items-center px-5">
          {playingMusic.isPlaying ? (
            <Icon name="pause" color="teal-400" size="sm" />
          ) : (
            <Icon name="play" color="teal-400" size="sm" onClick={playMusic} />
          )}
          <Icon name="step-forward" color="teal-400" size="sm" className="ml-5" />
        </div>
      </div>
    </GlobalMusicPlayerWrapper>
  );
};

export default fp.compose(
  withPlayerActions,
  withPlayingList,
  withPlayingMusic,
)(GlobalMusicPlayer);;
