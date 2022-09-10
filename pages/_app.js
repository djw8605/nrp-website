// pages/_app.js
import '../styles/globals.css'
import 'mapbox-gl/dist/mapbox-gl.css';

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { store } from '../src/store';
import { Provider } from 'react-redux'

export default function MyApp({ Component, pageProps }) {


  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}