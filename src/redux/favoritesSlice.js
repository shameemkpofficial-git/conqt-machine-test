import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (song) => song.id !== action.payload.id
      );
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites } = favoritesSlice.actions;

// Thunk to load favorites from AsyncStorage
export const loadFavorites = () => async (dispatch) => {
  try {
    const favorites = await AsyncStorage.getItem('favorites');
    if (favorites) {
      dispatch(setFavorites(JSON.parse(favorites)));
    }
  } catch (error) {
    console.error('Failed to load favorites:', error);
  }
};

// Thunk to save favorites to AsyncStorage
export const saveFavorites = (favorites) => async () => {
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

export default favoritesSlice.reducer;
