import React from 'react';
import { Provider } from 'react-redux';
import {store} from './src/redux/store.js';
import FavoritesScreen from './src/screens/FavoritesScreen/index';

export default function App() {
  return (
    <Provider store={store}>
      <FavoritesScreen />
    </Provider>
  );
}
