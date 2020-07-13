/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import MapMarker from './MapMarker';
import Route from './Route';

const Track = ({ data, track, visible, onMarkerPress, callOut }) => {
  const { trackTitle, route, origin } = track;

  const renderRoute = () => {
    if (!visible) return <></>;
    return <Route coordinates={route} />;
  };

  const onPress = () => {
    onMarkerPress(data);
  };

  return (
    <>
      <MapMarker title={trackTitle} callOut={callOut} description={"여기에 트랙 정보 넣어야 됨"} onPress={onPress} position={origin} />
      {renderRoute()}
    </>
  );
};

export default Track;
