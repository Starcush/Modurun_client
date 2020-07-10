/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackMaster from '../TrackMaster/TrackMaster';
import utils from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    backgroundColor: 'white',
    height: 180,
  },
  title: {
    padding: 7,
    elevation: 2,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#2196f3',
  },
  scheduleTitle: {
    lineHeight: 30,
    paddingLeft: 10,
    paddingTop: 3,
    fontSize: 24,
    color: 'white',
  },
  trackTitle: {
    paddingLeft: 15,
    paddingTop: 15,
    backgroundColor: '#2196f3',
  },
  scheduleInfo: {
    borderRadius: 1,
  },
  infoTitle: {
    fontSize: 16,
    color: '#2196f3',
  },
  infoData: {
    fontSize: 15,
    marginLeft: 15,
  },
  infoDetail: {
    flex: 2.5,
    alignItems: 'center',
    padding: 15,
    margin: 5,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
  },
  mapView: {
    flex: 5.5,
    backgroundColor: 'green',
  },
  footer: {
    marginTop: 10,
    flex: 0.5,
    alignItems: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#03d6a7',
  },
});

const CreatedScheduleInfo = ({ route }) => {
  const { schedule, track } = utils.createdScheduleInfo(route.params.completeData);

  const timeFromArr = schedule.scheduleFrom.toString().split('T');
  const from = timeFromArr[1].split(':');
  const timeToArr = schedule.scheduleTo.toString().split('T');
  const to = timeToArr[1].split(':');

  const date = utils.customizingDateAndTime(schedule.scheduleFrom, 0);
  const timeFrom = `${from[0]}시 ${from[1]}분`;
  const timeTo = `${to[0]}시 ${to[1]}분`;
  const distance = utils.meterToKilo(track.trackLength);
  const navigation = useNavigation();

  const goToMainPage = () => {
    navigation.navigate('MainDrawer');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Text style={styles.scheduleTitle}>{schedule.title}</Text>
        </View>
        <View style={styles.scheduleInfo}>
          <View style={styles.infoDetail}>
            <Text style={styles.infoTitle}>날짜</Text>
            <Text style={styles.infoData}>{`${date}`}</Text>
          </View>
          <View style={styles.infoDetail}>
            <Text style={styles.infoTitle}>시간</Text>
            <Text style={styles.infoData}>{`${timeFrom} ~ ${timeTo}`}</Text>
          </View>
          <View style={styles.infoDetail}>
            <Text style={styles.infoTitle}>거리</Text>
            <Text style={styles.infoData}>
              {distance}
              km
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.mapView}>
        <TrackMaster
          mode="trackViewer"
          tracks={[track]}
          initialCamera={track.origin}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={goToMainPage}>
          <Text style={{ color: 'white' }}>확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatedScheduleInfo;
