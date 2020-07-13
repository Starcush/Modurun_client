/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, KeyboardAvoidingView, Keyboard, BackHandler, Alert,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './style';
import utils from './utils';
import MapMarker from './MapMarker';
import Route from './Route';
import googlePlaceApi from '../googleapis/place';

const Icon = {
  FontAwesome,
  MaterialCommunity,
};

const TrackEditor = ({ curPosCamera, onCompleteEdit, initialLocation, initialTitle }) => {
  const mapView = useRef();
  const [mapWidth, setMapWidth] = useState(99);
  const [titleInputStyle, setTitleInputStyle] = useState({});
  const [markable, setMarkable] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [markerId, setMarkerId] = useState(0);
  const [touchPos, setTouchPos] = useState({ x: -1000, y: 0 });
  const [routes, setRoutes] = useState([]);

  const [routeHistory, setRouteHistory] = useState([]);
  const [markerHistory, setMarkerHistory] = useState([]);

  const [initialCamera, setInitialCamera] = useState(undefined);

  const [layoutInfo, setLayoutInfo] = useState(null);
  const [regionInfo, setRegionInfo] = useState({ start: {} });

  const [toolBarParentWidth, setToolBarParentWidth] = useState(undefined);

  const [completeVisible, setCompleteVisibility] = useState(false);
  const [typingText, setTypingStatus] = useState(false);

  const [exit, setExit] = useState(false);

  const [trackTitle, setTrackTitle] = useState(initialTitle || '');
  const [track, setTrack] = useState(undefined);

  const setTypingFalse = () => setTypingStatus(false);
  const setTypingTrue = () => setTypingStatus(true);

  const [playedAnime, setPlayedAnime] = useState(false);

  const setCompleteInvisible = () => {
    setCompleteVisibility(false);
    return true;
  };

  const initialize = () => {
    setTrackTitle('');
    setTrack(undefined);
    setMarkers([]);
    setRoutes([]);
    setRouteHistory([]);
    setMarkerHistory([]);
  };

  const syntheticCamera = utils.makeCamera(initialLocation);

  async function goToCurrentLocation() {
    const position = await Location.getCurrentPositionAsync({});
    if (exit) throw Error('Editor has been closed');
    const { coords } = position;
    const camera = undefined || {
      center: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      altitude: coords.altitude,
      pitch: 0,
      heading: 0,
      zoom: 15,
    };
    setInitialCamera(camera);
  }

  const toggleCompleteVisible = () => setCompleteVisibility(!completeVisible);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', setTypingTrue);
    Keyboard.addListener('keyboardDidHide', setTypingFalse);
    BackHandler.addEventListener('hardwareBackPress', setCompleteInvisible);
    if (mapView.current && initialLocation) {
      if (!playedAnime) {
        mapView.current.animateCamera(syntheticCamera);
        setPlayedAnime(true);
      }
    }
    return () => {
      setExit(true);
      Keyboard.removeListener('keyboardDidShow', setTypingTrue);
      Keyboard.removeListener('keyboardDidHide', setTypingFalse);
      BackHandler.removeEventListener('hardwareBackPress', setCompleteInvisible);
      setPlayedAnime(false);
    };
  }, []);

  const updateMapStyle = () => {
    setMapWidth('100%');
  };

  const updateTitleInputStyle = () => {
    setTitleInputStyle({
      paddingLeft: 10,
    });
  };

  const updateToolBarParentWidth = (e) => {
    setToolBarParentWidth(e.nativeEvent.layout.width);
  };

  const pushRouteHistory = (newRoutes) => {
    setRouteHistory([...routeHistory, newRoutes]);
  };

  const pushMarkerHistory = (newMarkers) => {
    setMarkerHistory([...markerHistory, newMarkers]);
  };

  const mapViewInfo = {
    layout: layoutInfo,
    region: {
      ...regionInfo,
      start: {
        latitude: regionInfo.latitude - regionInfo.latitudeDelta / 2,
        longitude: regionInfo.longitude - regionInfo.longitudeDelta / 2,
      },
    },
  };

  const correctHiding = {
    x: 0,
    y: -32,
  };

  // eslint-disable-next-line no-shadow
  const processMarkers = (markers) => markers.map((marker) => {
    if (marker.chain) return markers[0];
    return marker;
  });

  const putMarker = async (markerPos) => {
    const locationDetectionMode = 'raw';

    const rawLocation = markerPos;
    const nearestPlace = await googlePlaceApi.nearestPlace(markerPos);
    const nearestPlaceLocation = {
      latitude: nearestPlace.geometry.location.lat,
      longitude: nearestPlace.geometry.location.lng,
    };

    const lastMarkerLocation = locationDetectionMode === 'raw' ? rawLocation : nearestPlaceLocation;

    if (markers.length && markers[markers.length - 1].chain) return;
    const updatedMarkers = [...markers, {
      ...lastMarkerLocation,
      id: markerId,
    }];

    pushMarkerHistory(updatedMarkers);
    setMarkers(updatedMarkers);
    setMarkerId(markerId + 1);
    if (markers.length === 0) return;
    const allMarkes = markers.concat(markerPos);
    utils.getRoutes(allMarkes)
      .then(({ routes: newRoute, whole }) => {
        pushRouteHistory(newRoute);
        setRoutes(newRoute);
        setTrack(whole);
      });
  };

  const modifyMarker = (id, update) => {
    const updatedMarkers = markers.map((marker) => {
      if (marker.id !== id) return marker;
      const newMark = {
        id: marker.id,
        latitude: update.latitude,
        longitude: update.longitude,
      };
      return newMark;
    });
    const processed = processMarkers(updatedMarkers);
    utils.getRoutes(processed)
      .then(({ routes: newRoute, whole }) => {
        setMarkers(updatedMarkers);
        pushMarkerHistory(updatedMarkers);
        pushRouteHistory(newRoute);
        setRoutes(newRoute);
        setTrack(whole);
      });
  };

  const clearMarker = () => {
    pushRouteHistory([]);
    pushMarkerHistory([]);
    setMarkers([]);
    setRoutes([]);
  };

  const deletePrevMarker = () => {
    const truncatedMarkers = markers.slice(0, markers.length - 1);
    if (truncatedMarkers.length < 2) {
      setRoutes([]);
      setMarkers(truncatedMarkers);
      return;
    }
    utils.getRoutes(truncatedMarkers)
      .then((newRoutes) => {
        setMarkers(truncatedMarkers);
        pushMarkerHistory(truncatedMarkers);
        pushRouteHistory(newRoutes);
        setRoutes(newRoutes);
      });
  };

  const completeTrack = () => {
    const updatedMarkers = [...markers, { chain: true }];
    const processed = processMarkers(updatedMarkers);
    utils.getRoutes(processed)
      .then(({ routes: newRoute, whole }) => {
        setMarkers(updatedMarkers);
        pushMarkerHistory(updatedMarkers);
        pushRouteHistory(newRoute);
        setRoutes(newRoute);
        setTrack(whole);
      });
  };

  const onMarkTouchEnd = (e) => {
    if (!markable) return;
    const { region } = mapViewInfo;
    const relativeX = (e.nativeEvent.locationX + correctHiding.x) / mapViewInfo.layout.width;
    const relativeY = (e.nativeEvent.locationY + correctHiding.y) / mapViewInfo.layout.height;
    const syntheticLatitude = region.start.latitude + (1 - relativeY) * region.latitudeDelta;
    const syntheticLongitude = region.start.longitude + relativeX * region.longitudeDelta;
    const syntheticLocation = {
      latitude: syntheticLatitude,
      longitude: syntheticLongitude,
    };
    putMarker(syntheticLocation);
    setMarkable(false);
  };

  const initTouchPos = (e) => {
    const { width, height } = e.nativeEvent;
    setTouchPos({
      x: width / 2,
      y: height / 2,
    });
  };

  const startMark = () => {
    setMarkable(true);
  };

  const trackTouch = (e) => {
    const { locationX, locationY } = e.nativeEvent;
    setTouchPos({
      x: locationX,
      y: locationY,
    });
  };

  const renderMarkers = () => {
    const indexedMarkers = markers.map((marker, i) => ({ ...marker, index: i }));
    const visibleMarkers = indexedMarkers.filter((marker) => {
      const { start, longitudeDelta, latitudeDelta } = mapViewInfo.region;
      if (marker.latitude < start.latitude) return false;
      if (marker.longitude < start.longitude) return false;
      if (marker.latitude > start.latitude + latitudeDelta) return false;
      if (marker.longitude > start.longitude + longitudeDelta) return false;
      if (marker.chain) return false;
      return true;
    });

    return visibleMarkers.map((marker) => (
      <MapMarker
        draggable
        key={marker.id}
        position={marker}
        tag={marker.index}
        onDragEnd={(e) => modifyMarker(marker.id, e.nativeEvent.coordinate)}
      />
    ));
  };

  const mapViewProps = {
    rotateEnabled: false,
    initialCamera: syntheticCamera || curPosCamera || initialCamera,
    onRegionChangeComplete: (region) => setRegionInfo(region),
    onLayout: (e) => setLayoutInfo(e.nativeEvent.layout),
    style: [styles.mapStyle, { width: mapWidth, flex: typingText ? 0 : 1 }],
    showsUserLocation: true,
    onMapReady: () => {
      updateMapStyle();
      if (initialLocation) return;
      goToCurrentLocation();
    },
  };

  const toolBarIconSize = (() => {
    if (!toolBarParentWidth) return 30;
    if (toolBarParentWidth >= 300) {
      return 30;
    }
    return toolBarParentWidth / 10;
  })();

  const toolBarIconStyle = (backgroundColor) => styles.toolBarIcon(backgroundColor, toolBarIconSize);

  const exportTrack = () => {
    // 이 부분 모달창으로 바꿔도 좋을 듯.
    if (!track || !trackTitle) {
      Alert.alert('내용 채워라', '경고한다');
      return;
    }
    const { distance } = track.routes[0];
    const postData = {
      origin: routes[0],
      destination: routes[routes.length - 1],
      route: routes,
      trackLength: distance,
      trackTitle,
    };
    setCompleteInvisible();
    onCompleteEdit(postData);
    setTrackTitle('');
    Keyboard.dismiss();
    initialize();
  };

  const renderMapView = () => {
    if (typingText) return <></>;
    return (
      <MapView ref={mapView} {...mapViewProps} provider={PROVIDER_GOOGLE}>
        {renderMarkers()}
        <Route coordinates={routes} />
      </MapView>
    );
  };

  return (
    <View onLayout={updateToolBarParentWidth} style={styles.container}>
      <View>

        <View>
          <View onTouchMove={trackTouch} onTouchEnd={onMarkTouchEnd} style={styles.toolBar}>
            <View style={{ flexDirection: 'column' }}>
              <TouchableOpacity onLayout={initTouchPos} onPressIn={startMark} style={toolBarIconStyle()}>
                <Icon.FontAwesome name="map-marker" size={toolBarIconSize} color="crimson" />
              </TouchableOpacity>
              <TouchableOpacity onPress={clearMarker} style={toolBarIconStyle()}>
                <Icon.FontAwesome name="trash" size={toolBarIconSize} color="grey" />
              </TouchableOpacity>
              <TouchableOpacity onPress={completeTrack} style={toolBarIconStyle()}>
                <Icon.FontAwesome name="magic" size={toolBarIconSize} color="dodgerblue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={deletePrevMarker} style={toolBarIconStyle()}>
                <Icon.FontAwesome name="undo" size={toolBarIconSize} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.addMarker(touchPos, correctHiding)}>
              <Icon.FontAwesome name="map-marker" style={{ display: markable ? 'flex' : 'none' }} size={30} color="#ff385f" />
            </View>
          </View>
        </View>
        <View style={styles.completeButtonContainer(!completeVisible, layoutInfo ? layoutInfo.height - 60 : 300)}>
          <TouchableOpacity onPress={toggleCompleteVisible} style={[toolBarIconStyle('#03D6A7'), { display: completeVisible ? 'none' : 'flex' }]}>
            <Icon.FontAwesome name="check" size={toolBarIconSize} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {renderMapView()}

      <KeyboardAvoidingView style={styles.titleInputContainer(completeVisible, typingText)}>
        <TextInput onChange={(e) => { setTrackTitle(e.nativeEvent.text); }} value={trackTitle} onLayout={updateTitleInputStyle} style={[styles.titleInput, titleInputStyle]} placeholder="트랙의 이름을 입력해주세요" />
        <TouchableOpacity onPress={exportTrack} style={styles.editCompleteButton}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>제작 완료</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

TrackEditor.defaultProps = {
  curPosCamera: PropTypes.object.isRequired,
  onCompleteEdit: () => {},
};

TrackEditor.propTypes = {
  curPosCamera: PropTypes.shape({
    altitude: PropTypes.number,
    center: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
    heading: PropTypes.number,
    pitch: PropTypes.number,
    zoom: PropTypes.number,
  }),
  onCompleteEdit: PropTypes.func,
};

const mapStateToProps = (state) => ({
  curPosCamera: state.trackMaster.userLocation.curPosCamera,
});

export default connect(mapStateToProps, null)(TrackEditor);
