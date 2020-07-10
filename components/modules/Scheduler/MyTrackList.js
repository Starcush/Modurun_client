/* eslint-disable react/prop-types */
import React from 'react';
import {
  View, StatusBar,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TrackListEntry from './MyTrackListEntry';

const MyTrackList = ({ route }) => {
  const { setAction, scheduleInfo, tracks } = route.params;
  if (!tracks) return <></>;
  if (!tracks.length) return <></>;
  return (
    <ScrollView style={{ backgroundColor: '#1E90FF' }}>
      <StatusBar />
      {tracks.map((track) => (
        <TrackListEntry
          key={track.trackId}
          data={track}
          setAction={setAction}
          scheduleInfo={scheduleInfo}
        />
      ))}
      <View style={{ height: 200 }} />
    </ScrollView>
  );
};

export default MyTrackList;
