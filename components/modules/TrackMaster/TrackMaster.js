/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';
import { View } from 'react-native';
import styles from './style';
import TrackEditor from './TrackEditor';
import TrackViewer from './TrackViewer';
import * as actions from '../../../redux/action/TrackMaster/creators';
import ScheduledTrackViewer from './ScheduledTrackViewer';

const TrackMaster = ({
  setUserLocation,
  mode,
  onRegionChange,
  schedules,
  tracks,
  onTrackSelected,
  onCompleteEdit,
  initialCamera,
  moveOnMarkerPress,
  initialTitle,
  onRefReady,
  camera,
}) => {

  const requestGeoLocationPermission = async () => {
    const curPosition = await Location.getCurrentPositionAsync({});
    const { coords } = curPosition;
    const curPosCamera = undefined || {
      center: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      altitude: coords.altitude,
      pitch: 0,
      heading: 0,
      zoom: 15,
    };
    setUserLocation({ curPosition, curPosCamera });
  };

  const renderMapView = () => {
    if (mode === 'trackEditor') {
      return (
        <TrackEditor
          onCompleteEdit={onCompleteEdit}
          initialLocation={initialCamera}
          initialTitle={initialTitle}
        />
      );
    }

    if (mode === 'scheduleViewer') {
      return (
        <ScheduledTrackViewer
          onRegionChange={onRegionChange}
          onTrackSelected={onTrackSelected}
          schedules={schedules}
          initialCamera={initialCamera}
          moveOnMarkerPress={moveOnMarkerPress}
          camera={camera}
          onRefReady={onRefReady}
        />
      );
    }

    if (mode === 'trackViewer') {
      return (
        <TrackViewer
          onRegionChange={onRegionChange}
          onTrackSelected={onTrackSelected}
          tracks={tracks}
          initialCamera={initialCamera}
        />
      );
    }

    return <ScheduledTrackViewer />;
  };

  return (
    <View onLayout={requestGeoLocationPermission} style={styles.container}>
      <View style={{ flex: 1 }}>
        {renderMapView()}
      </View>
    </View>
  );
};

TrackMaster.defaultProps = {
  mode: 'scheduleViewer',
  onCompleteEdit: (track) => track,
  onTrackSelected: (track) => track,
  onRegionChange: (region) => region,
};


TrackMaster.propTypes = {
  setUserLocation: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['trackViewer', 'scheduleViewer', 'trackEditor']),
  onCompleteEdit: PropTypes.func,
  onTrackSelected: PropTypes.func,
  onRegionChange: PropTypes.func,
};

export default connect(null, { ...actions })(TrackMaster);
