import React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import Playlist from '../../containers/Playlist';
import RankingBoard from '../../containers/RankingBoard';
import { cache } from '../../actions/redux-cache';

import * as actionCreators from './actions';
import playlistFormater from '../../selectors/utils/playlistFormater';

const PlaylistPageWrapper = styled.div`
  &.playlist-page {
    .playlist-page__ranking {
      background-color: #414345;
    }
  }
`;

const PlaylistPage = ({ className }) => {
  return (
    <PlaylistPageWrapper className={cn('playlist-page container-custom container mx-auto flex flex-col relative flex-1 animated fadeIn', className)}>
      <Playlist className="bg-gradient shadow-lg mx-auto w-full flex-1" />
    </PlaylistPageWrapper>
  );
};

const mapStateToProps = state => ({
  playlist: playlistFormater(state.playlistPageReducer.playlist),
});

const PlaylistPageEnhancer = compose(
  connect(mapStateToProps),
)(PlaylistPage);

PlaylistPageEnhancer.displayName= 'PlaylistPageEnhancer';

PlaylistPageEnhancer.getInitialProps = async ({ query, reduxStore: store, isSever }) => {
  // cache data to redux
  const cachePlaylist = profile => store.dispatch(cache(`cachePlaylist(${query.id})`, profile));

  // in client-side await will be stop render
  if (isSever) {
    await store.dispatch(actionCreators.getPlaylist(query.id, cachePlaylist));
  } else {
    const reduxCache = store.getState().reduxCache;

    if (reduxCache[`cachePlaylist(${query.id})`]) {
      store.dispatch(actionCreators.getPlaylistSuccess(reduxCache[`cachePlaylist(${query.id})`]));
    } else {
      store.dispatch(actionCreators.getPlaylist(query.id, cachePlaylist));
    }
  }

  return {};
}

export default PlaylistPageEnhancer;
