import React, { useState, useLayoutEffect } from 'react';
import { View, Text, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import styles from './styles';
import * as utils from '../ScheduleUtils/utils';
import PrettyProp from '../PrettyProp/PrettyProp';
import * as actions from '../../../redux/action/SingleTrackViewer/creator';
import modurunAPI from '../API';
import productionAppNavActions from '../../../redux/action/ProductionNav/creator';

const TitleContainer = styled.Text`
  font-size: 15px;
`;

const Title = styled.Text`
  font-weight: bold;
`;

const FlexHorizontal = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: white;
`;

const Header = styled(FlexHorizontal)`
  justify-content: space-between;
  padding-horizontal: 15px;
`;

const RoomSize = styled.Text`
  color: #1E90FF;
  font-size: 15px;
  padding: 15px;
  align-content: flex-end;
`;

const ScheduleEntryContainer = styled.View`
  background-color: white;
  margin-bottom: 3px;
  padding: 5px;
`;

const StyledIcon = styled(Icon)`
  font-size: 20px;
  margin-left: 10px;
  background-color: lightgrey;
  border-radius: 10px;
  padding: 10px;
`;

const ShowMoreButton = styled.TouchableOpacity`
`;

const titleShorter = (title, n) => {
  let shortTitle = '';
  if (title.length > 10) {
    shortTitle = `${title.slice(0, n)} ...`;
    return shortTitle;
  }
  return title;
};

const MyScheduleListEntry = ({
  data,
  onLayout,
  dispatch,
  userInfo,
  loadSchedules
}) => {
  const {
    destination,
    id,
    origin,
    participants,
    route,
    scheduleFrom,
    scheduleTo,
    title,
    trackId,
    trackLength,
    trackTitle,
  } = data;
  const navigation = useNavigation();
  const [showMoreVisible, setShowMoreVisible] = useState(false);
  const [animation, setAnimation] = useState(new Animated.Value(-50));
  const [deleted, setDeleted] = useState(false);

  const toggleShowMore = () => {
    setShowMoreVisible(!showMoreVisible);
  };

  const askIfExit = () => {
    const okButton = {
      text: '예',
      onPress: () => modurunAPI.schedules.exitFromSchedule(id)
        .then((res) => {
          if (res.ok) loadSchedules();
        }),
    };
    const cancelButton = {
      text: '아니오',
    };
    Alert.alert('참가 취소', '일정 참가를 취소하시겠습니까?', [okButton, cancelButton]);
  };

  const viewDetailTrack = () => {
    modurunAPI.tracks.getTrack(trackId)
      .then((res) => res.json())
      .then((json) => {
        dispatch(actions.setSingleTrack(json[0]));
        navigation.navigate('SingleTrackViewerScreen');
      });
  };

  const enterChatRoom = () => {
    dispatch(productionAppNavActions.setChatRoomTitle(title));
    navigation.navigate('ChatRoomScreen', {
      scheduleTitle: title,
      scheduleId: id,
      username: userInfo.username,
    });
  };

  const renderDetail = () => {
    if (!showMoreVisible) return <></>;
    return (
      <>
        <View style={styles.descContainer}>
          <View style={{ alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
            <PrettyProp name="시작 일시" value={utils.convertDate(scheduleFrom)} color="dodgerblue" />
            <PrettyProp name="소요 시간" value={utils.convertDuration(Date.parse(scheduleTo) - Date.parse(scheduleFrom))} color="dodgerblue" />
            <PrettyProp name="트랙 이름" value={trackTitle} color="dodgerblue" />
          </View>
        </View>
        <View style={styles.moreButtonContainer}>
          <TouchableOpacity onPress={askIfExit} style={styles.cancel}>
            <Text style={{ color: 'white', fontSize: 16 }}>참가 취소하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.showMore} onPress={viewDetailTrack}>
            <Text style={{ color: 'white', fontSize: 16 }}>자세히 보기</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  if (deleted) return <></>;
  return (
    <ScheduleEntryContainer onLayout={onLayout}>
      <Header>
        <FlexHorizontal>
          <TitleContainer>
            <Title>{titleShorter(title, 15)}</Title>
            <RoomSize>
              <Text>[</Text>
              <IconIonicons name="md-person" size={20} />
              {`${participants}`}
              <Text>]</Text>
            </RoomSize>
          </TitleContainer>
        </FlexHorizontal>
        <FlexHorizontal>
          <Icon name="comments" color="#03D6A7" size={20} onPress={enterChatRoom} />
          <ShowMoreButton onPress={toggleShowMore}>
            <StyledIcon name={showMoreVisible ? 'chevron-up' : 'chevron-down'} />
          </ShowMoreButton>
        </FlexHorizontal>
      </Header>
      {renderDetail()}
    </ScheduleEntryContainer>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.userInfo.user,
});

export default connect(mapStateToProps, null)(MyScheduleListEntry);
