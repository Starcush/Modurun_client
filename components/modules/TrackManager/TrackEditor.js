import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as createdTrackInfoActions from '../../../redux/action/CreatedTrackInfo/creator';
import TrackMaster from '../TrackMaster/TrackMaster';
import googlePlaceApi from '../googleapis/place';
import QueryCandidate from './QueryCandidate';
import modurunAPI from '../API';
import { color } from 'react-native-reanimated';

const TrackEditor = ({ updateCreatedTrack, setSwipeEnabled, getMyTracks }) => {
  const navigation = useNavigation();
  const [typing, setTypingStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [queryCandidates, setQueryCandidates] = useState([]);
  const [mapLocation, setMapLocation] = useState(null);
  const [title, setTitle] = useState('');
  const [submittedTitle, setSubmittedTitle] = useState(false);

  const setTypingFalse = () => {
    setTypingStatus(false);
  };
  const setTypingTrue = () => {
    setTypingStatus(true);
  };

  const updateSearchQuery = (e) => {
    const newText = e.nativeEvent.text;
    setSearchQuery(newText);
    googlePlaceApi
      .autoComplete({
        input: newText,
        language: 'ko',
        offset: 3,
        components: 'country:kr',
      })
      .then((res) => res.json())
      .then((json) => {
        if (json.status !== 'OK') return setQueryCandidates([]);
        setQueryCandidates(json.predictions);
      });
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', setTypingFalse);
    return () => {
      Keyboard.removeListener('keyboardDidHide', setTypingFalse);
    };
  }, []);

  const renderEditor = () => {
    if (typing) return <></>;
    return (
      <TrackMaster
        mode="trackEditor"
        initialCamera={mapLocation || undefined}
        initialTitle={title}
        onCompleteEdit={(track) => {
          modurunAPI.tracks.createTrack(track).then((res) => {
            updateCreatedTrack(track);
            if (res.ok) {
              navigation.navigate('CreatedTrackInfoScreen');
              getMyTracks();
            }
            setSubmittedTitle(false);
            setTitle('');
            setSwipeEnabled(true);
          });
        }}
      />
    );
  };
  const renderRecommendation = () => {
    if (!typing) return <></>;
    return (
      <ScrollView style={{ backgroundColor: 'white' }}>
        {queryCandidates.map((candidate, idx) => (
          <QueryCandidate
            key={String(idx)}
            data={candidate}
            onPress={(location) => setMapLocation(location)}
          />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  const renderEditorScreen = () => (
    <>
      <View
        style={{
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
          elevation: 1,
          borderWidth: 0,
          backgroundColor: 'white',
        }}
      >
        <TextInput
          onTouchStart={setTypingTrue}
          value={searchQuery}
          onChange={updateSearchQuery}
          placeholder="위치를 검색해주세요"
          style={{ flex: 90, height: 60, paddingLeft: 10 }}
        />
        <TouchableOpacity
          style={{
            flex: 20,
            height: '100%',
            backgroundColor: 'dodgerblue',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {renderRecommendation()}
      {renderEditor()}
    </>
  );

  const titleInputDesStyle = {
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  };

  const submitTitle = () => {
    if (!title) return;
    setSubmittedTitle(true);
    setSwipeEnabled(false);
  };

  const renderTitleInputScreen = () => (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ justifyContent: 'center', flex: 80 }}>
        <Text
          style={[
            titleInputDesStyle,
            { fontSize: 18, marginBottom: 6, color: 'rgb(200,200,200)' },
          ]}
        >
          코스를 제작해보고 싶으신가요?
        </Text>
        <Text style={[titleInputDesStyle, { fontSize: 20, marginBottom: 10 }]}>
          코스 이름을 정해주세요
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            padding: 10,
            margin: 10,
            marginHorizontal: 30,
            borderColor: 'rgb(200,200,200)',
            borderRadius: 10,
            textAlign: 'center',
          }}
          placeholder="헥헥 거려도 뛰고 싶은 코스 이름"
          value={title}
          onChange={(e) => setTitle(e.nativeEvent.text)}
        />
      </View>
      <View style={{ flex: 20 }}>
        <TouchableOpacity
          onPress={submitTitle}
          style={{
            padding: 10,
            backgroundColor: 'dodgerblue',
            borderRadius: 10,
            marginHorizontal: 30,
            paddingVertical: 20,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>
            제작하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAfterSettingTitle = () => {
    if (!submittedTitle) return renderTitleInputScreen();
    return renderEditorScreen();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>{renderAfterSettingTitle()}</SafeAreaView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCreatedTrack: (track) =>
      dispatch(createdTrackInfoActions.setCreatedTrack(track)),
  };
};

export default connect(null, mapDispatchToProps)(TrackEditor);
