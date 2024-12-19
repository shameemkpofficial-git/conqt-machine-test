import React, { useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, removeFavorite, loadFavorites, saveFavorites } from '../../redux/favoritesSlice';

const mockSong = { id: '123', title: 'Shape of You', artist: 'Ed Sheeran' };

const FavoritesScreen = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  useEffect(() => {
    dispatch(saveFavorites(favorites));
  }, [favorites, dispatch]);

  const isFavorite = favorites.some((song) => song.id === mockSong.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(mockSong));
    } else {
      dispatch(addFavorite(mockSong));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Songs</Text>
      <Button
        title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        onPress={toggleFavorite}
      />
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.songItem}>
            <Text style={styles.songTitle}>{item.title}</Text>
            <Text style={styles.songArtist}>{item.artist}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No favorite songs yet!</Text>}
      />
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  songItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  songTitle: {
    fontSize: 18,
  },
  songArtist: {
    fontSize: 14,
    color: '#555',
  },
});
