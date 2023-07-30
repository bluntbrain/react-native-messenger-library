import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import Mapbox, {Camera, MarkerView} from '@rnmapbox/maps';
import {User} from '../utils/types';
import AppBar from './AppbarComponent';

interface MapScreenProps {
  users: User[];
  currentUserCoordinates: any;
  onMarkerPress: (user: User) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  users,
  currentUserCoordinates,
  onMarkerPress,
}) => {
  useEffect(() => {
    Mapbox.setWellKnownTileServer('Mapbox');
    Mapbox.setConnected(true);
    Mapbox.setAccessToken(
      'pk.eyJ1IjoiaXNoYW4tbGFraHdhbmkiLCJhIjoiY2xrbzN3MTRlMHBldjNyazRnMXQxeHl3OCJ9.8zv5_nbzvm4pwgPyh2niog',
    );
  }, []);

  console.log('users in mapscreen', users);
  return (
    <View style={styles.page}>
    
      <View style={styles.container}>
      <AppBar title={'Welcome to Hey There!'} showBackIcon={false} subtitle={'Click on any red dot to continue chatting.'}/>

        {currentUserCoordinates.longitude && currentUserCoordinates.latitude ? (
          <Mapbox.MapView style={styles.map}>
            <Camera
              centerCoordinate={[
                currentUserCoordinates.longitude,
                currentUserCoordinates.latitude,
              ]}
              zoomLevel={15}
            />
            <MarkerView
              coordinate={[
                currentUserCoordinates.longitude,
                currentUserCoordinates.latitude,
              ]}>
              <View style={[styles.marker, {backgroundColor: 'green'}]} />
              <Text style={styles.youAreHere}>You are here</Text>
            </MarkerView>
            {users.map(user => (
              <MarkerView
                key={user.id}
                coordinate={[user.location.longitude, user.location.latitude]}>
                <TouchableOpacity onPress={() => onMarkerPress(user)}>
                  <View style={styles.marker} />
                </TouchableOpacity>
              </MarkerView>
            ))}
          </Mapbox.MapView>
        ) : null}
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  youAreHere:{
    fontSize:8, color:'#000'
  }
});
