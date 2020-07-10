import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import MainDrawer from './navigation/MainDrawer';
import SignInManager from './modules/SignInManager';
import SignUpManager from './modules/SignUpManager';
import Scheduler from './modules/Scheduler/Scheduler';
import CreatedTrackInfo from './modules/CreatedTrackInfo';
import ChatRoom from './modules/ChatRoom';
import SingleTrackViewerInDetail from './modules/SingleTrackViewerInDetail';
import CreatedScheduleInfo from './modules/Scheduler/CreatedScheduleInfo';
import MyTrackList from './modules/Scheduler/MyTrackList';
import MyInfoManager from './modules/MyPage/MyInfoManger';

const Stack = createStackNavigator();

const ProductionApp = ({chatRoomTitle}) => {
  return (
    <Stack.Navigator initialRouteName="SignInScreen">
      <Stack.Screen options={{ headerShown: false }} name="SignInScreen" component={SignInManager} />
      <Stack.Screen options={{ headerShown: false }} name="SignUpScreen" component={SignUpManager} />
      <Stack.Screen options={{ headerShown: false }} name="MainDrawer" component={MainDrawer} />
      <Stack.Screen options={{ title: '일정 추가' }} name="SchedulerScreen" component={Scheduler} />
      <Stack.Screen options={{ title: '제작한 트랙 정보' }} name="CreatedTrackInfoScreen" component={CreatedTrackInfo} />
      <Stack.Screen options={{ title: chatRoomTitle }} name="ChatRoomScreen" component={ChatRoom} />
      <Stack.Screen options={{ title: '트랙 정보' }} name="SingleTrackViewerScreen" component={SingleTrackViewerInDetail} />
      <Stack.Screen options={{ title: '등록한 일정 정보' }} name="CreatedScheduleInfoScreen" component={CreatedScheduleInfo} />
      <Stack.Screen options={{ title: '내 코스' }} name="MyTrackListScreen" component={MyTrackList} />
      <Stack.Screen options={{ title: '내 정보 수정' }} name="MyInfoManager" component={MyInfoManager} />
    </Stack.Navigator>
  );
};

const mapStateToProps = (state) => ({
  chatRoomTitle: state.productionNav.chatRoomTitle,
});

export default connect(mapStateToProps, null)(ProductionApp);
