import React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import fp from 'lodash/fp';
import { playlistsAsObject } from '../../../server/data/playlists';
import musicsFormater from '../../selectors/utils/musicsFormater';
import SongItem from './SongItem';
import { Divider, Button } from '../../components/core';
import usePlayer from '../../hooks/usePlayer';

const TopSongsWrapper = styled.div``;

const musics = musicsFormater(playlistsAsObject['playlist-001'].musics);

const TopSongs = ({ className }) => {
  const { playMusic } = usePlayer();
  return (
    <TopSongsWrapper className={cn('ui-top-songs flex flex-col', className)}>
      <div className="flex w-full">
        <Button className="w-1/3 text-white" color="indigo-400">Tuần</Button>
        <Button className="w-1/3 text-indigo-500" color="gray-200">Tháng</Button>
        <Button className="w-1/3 text-indigo-500" color="gray-200">Quý</Button>
      </div>
      {fp.take(20, musics).map((music, idx) => (
        <div key={music.id} className="p-1/2 w-full">
          <SongItem {...music} rank={idx + 1} onClick={() => playMusic(music)} />
          <Divider />
        </div>
      ))}
    </TopSongsWrapper>
  );
};

export default TopSongs;
