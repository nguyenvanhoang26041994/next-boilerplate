import '../../assets/css/tailwind.scss';
import '../../assets/css/user.scss';
import './App.scss';
import App, { Container } from 'next/app';
import { Provider } from 'react-redux';

import Layout from '../layouts/Layout';
import BottomPlayer from '../containers/BottomPlayer';
import withPlayingMusic from '../HOC/withPlayingMusic';
import store from '../store';

const BottomPlayerFilter = ({ playingMusic, ...otherProps }) => {
  if (playingMusic.isShowPlayer) {
    return <BottomPlayer {...otherProps} />;
  }

  return null;
}

const BottomPlayerFilterEnhancer = withPlayingMusic(BottomPlayerFilter);

class RootApp extends App {
  static getInitialProps = async ({ Component, ctx }) =>
    Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : { pageProps: {} };

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <BottomPlayerFilterEnhancer className="fixed bottom-0 w-screen" />
        </Provider>
      </Container>
    );
  }
}

export default RootApp;
