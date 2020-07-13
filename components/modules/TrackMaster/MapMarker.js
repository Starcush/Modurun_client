/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';


export default function MapMarker({ position, tag, onDragEnd, onPress, draggable, callOut }) {
  const markerProps = (latlng) => ({
    draggable,
    onDragEnd,
    onPress,
    tracksViewChanges: false,
    tracksInfoWindowChanges: false,
    key: tag,
    coordinate: latlng,
    style: {
      zIndex: 100,
    },
  });


  const renderTag = () => {
    const tagLength = String(tag).length;
    if (tagLength > 2) return <></>;
    return <Text style={styles.markerTag}>{tag}</Text>;
  };

  const renderCallOut = () => {
    if (!callOut) return <></>;
    return callOut;
  };

  return (
    <Marker {...markerProps(position)}>
      <View style={{ paddingHorizontal: 10 }}>
        {renderTag()}
        <Icon name="map-marker" style={{ position: 'absolute', bottom: 0, left: 11 }} size={30} color="#rgba(0,0,0,0.6)" />
        <Icon name="map-marker" size={30} color="#cf0029" />
        <View style={styles.markerShadow} />
      </View>
      {renderCallOut()}
    </Marker>
  );
}
