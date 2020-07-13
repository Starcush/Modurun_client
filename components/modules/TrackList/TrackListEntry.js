import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, Alert, Modal } from 'react-native';
import { connect } from 'react-redux';
import trackManagerActions from '../../../redux/action/TrackManager/creator';
import * as actions from '../../../redux/action/SingleTrackViewer/creator';
import PrettyProp from '../PrettyProp/PrettyProp';
import googlePlaceApi from '../googleapis/place';
import * as utils from '../TrackUtils/utils';
import modurunAPI from '../API';
import styles from './styles';
import store from '../../../redux/store';

const TrackListEntry = ({
  data,
  showBookmark,
  showAdd,
  dispatch,
  showDelete,
  getMyTracks,
}) => {
  const {
    trackLength,
    trackTitle,
    route,
    bookmark,
    id,
    trackId,
    createdAt,
    updatedAt,
    userId,
    origin,
    destination,
    rateValue,
  } = data;

  const [originInfo, setOriginInfo] = useState('');
  const [destinationInfo, setDestinationInfo] = useState('');
  useEffect(() => {
    googlePlaceApi.getNearestAddr(origin).then((addr) => setOriginInfo(addr));
    googlePlaceApi
      .getNearestAddr(destination)
      .then((addr) => setDestinationInfo(addr));
  }, [data]);

  const navigation = useNavigation();
  const [showMoreVisible, setShowMoreVisible] = useState(false);

  const [requesting, setRequestState] = useState({
    bookmark: false,
    addTrack: false,
    findTrack: false,
    deleteTrack: false,
  });

  const toggleShowMore = () => setShowMoreVisible(!showMoreVisible);

  const viewTrackOnMap = () => {
    dispatch(actions.setSingleTrack(data));
    navigation.navigate('SingleTrackViewerScreen');
  };

  const askIfDelete = () => {
    Alert.alert('코스 삭제', '코스를 삭제하시겠습니까?', [
      {
        text: '삭제',
        onPress: () => {
          if (requesting.deleteTrack) return;
          setRequestState({ ...requesting, deleteTrack: true });
          modurunAPI.tracks.deleteFromMyTrack(trackId).then((res) => {
            if (res.status === 200) {
              dispatch(trackManagerActions.deleteMyTrack(trackId));
              setRequestState({ ...requesting, deleteTrack: false });
              Alert.alert('삭제 완료', '선택한 트랙이 삭제되었습니다');
              getMyTracks();
            }
          });
        },
      },
      {
        text: '취소',
      },
    ]);
  };

  const askIfAdd = () => {
    Alert.alert('코스 추가', '내 코스에 추가하시겠습니까?', [
      {
        text: '예',
        onPress: () => {
          if (requesting.addTrack) return;
          setRequestState({ ...requesting, addTrack: true });
          modurunAPI.tracks.addToMyTrack(id).then((res) => {
            if (res.status === 409) {
              Alert.alert('중복된 코스', '이미 추가한 코스입니다.');
            }
            if (res.status === 200) {
              Alert.alert('추가 완료', '성공적으로 추가되었습니다');
              setRequestState({ ...requesting, addTrack: false });
              modurunAPI.tracks
                .getMyTracks()
                .then((myTrackRes) => myTrackRes.json())
                .then((json) => {
                  // console.log('이게 여기가 맞나', json);
                  dispatch(trackManagerActions.setMyTrack(json));
                });
            }
          });
        },
      },
      {
        text: '아니오',
      },
    ]);
  };

  const toggleBookmark = () => {
    if (requesting.bookmark) return;
    setRequestState({ ...requesting, bookmark: true });
    modurunAPI.tracks
      .toggleBookmark(trackId)
      .then((res) =>
        res.ok ? dispatch(trackManagerActions.toggleBookmark(trackId)) : ''
      )
      .then(() => {
        setRequestState({
          ...requesting,
          bookmark: false,
        });
        getMyTracks();
      });
  };

  const renderAdd = () => {
    if (!showAdd) return <></>;
    return (
      <TouchableOpacity
        onPress={askIfAdd}
        style={{ alignContent: 'center', padding: 5 }}
      >
        <Icon
          name="plus"
          color="black"
          style={{
            backgroundColor: 'rgba(255,255,255,0.5)',
            width: 30,
            height: 30,
            borderRadius: 100,
            textAlign: 'center',
            textAlignVertical: 'center',
          }}
          size={20}
        />
      </TouchableOpacity>
    );
  };

  const renderBookMark = () => {
    if (!showBookmark) return <></>;
    return (
      <TouchableOpacity
        onPress={toggleBookmark}
        style={{ alignContent: 'center', padding: 5 }}
      >
        <Icon name="star" size={20} color={bookmark ? 'orange' : 'lightgrey'} />
      </TouchableOpacity>
    );
  };

  const renderDelete = () => {
    if (!showDelete) return <></>;
    return (
      <TouchableOpacity onPress={askIfDelete} style={styles.delete}>
        <Text style={{ color: 'white', fontSize: 16 }}>삭제하기</Text>
      </TouchableOpacity>
    );
  };

  const compactPropStyle = {
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    width: 330,
  };

  const compactProp = (name, value, color, fontColor) => (
    <View style={[compactPropStyle, { backgroundColor: color }]}>
      <Text
        style={{ fontSize: 16, margin: 5, marginRight: 10, color: fontColor }}
      >
        {name}
      </Text>
      <Text style={{ fontSize: 14, flex: 1 }}>{value}</Text>
    </View>
  );

  const renderCompactDetail = () => {
    if (showMoreVisible) return <></>;
    return (
      <View style={{ margin: 10, marginTop: 5, flexWrap: 'wrap' }}>
        {compactProp('출발', originInfo, undefined, '#03D6A7')}
        {compactProp('도착', destinationInfo, undefined, 'red')}
      </View>
    );
  };

  const renderShowMore = () => {
    if (!showMoreVisible) return <></>;
    return (
      <View style={styles.descContainer}>
        <View style={{ padding: 15 }}>
          <PrettyProp name="출발지점" value={originInfo} />
          <PrettyProp name="도착지점" value={destinationInfo} />
          <PrettyProp name="길이" value={utils.prettyLength(trackLength)} />
          <PrettyProp
            name="시간(남)"
            value={utils.predictDuration(trackLength, 'm')}
          />
          <PrettyProp
            name="시간(여)"
            value={utils.predictDuration(trackLength, 'f')}
          />
        </View>
        <View
          style={{
            height: 0,
            backgroundColor: 'rgba(0,0,0,0.1)',
            marginVertical: 10,
          }}
        />
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
            }}
          >
            <TouchableOpacity
              onPress={viewTrackOnMap}
              style={styles.showDetail}
            >
              <Text
                style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}
              >
                자세히 보기
              </Text>
            </TouchableOpacity>
            {renderDelete()}
          </View>
        </View>
      </View>
    );
  };

  const renderDetail = () => {
    if (showMoreVisible) return renderShowMore();
    return renderCompactDetail();
  };

  return (
    <View style={styles.entryContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{trackTitle}</Text>
        <Text style={styles.lengtgTitle}>
          {utils.prettyLength(trackLength)}
        </Text>
        <View style={styles.titleButtonContainer}>
          {renderAdd()}
          {renderBookMark()}
          <TouchableOpacity onPress={toggleShowMore} style={styles.chevron}>
            <Icon
              name={showMoreVisible ? 'chevron-up' : 'chevron-down'}
              color="grey"
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
      {renderDetail()}
      <Modal visible={false}>
        <Text>Alert를 모달로 바꾸기</Text>
      </Modal>
    </View>
  );
};

export default connect(null, null)(TrackListEntry);
