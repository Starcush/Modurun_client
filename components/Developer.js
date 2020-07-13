import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';

const Developer = ({ navigation }) => {
  const pages = [
    { root: 'ProductionApp', name: 'ProductionApp' },
    // { root: 'ProductionApp', screen: 'SignInScreen', name: '로그인' },
    // { root: 'ProductionApp', screen: 'SignUpScreen', name: '회원가입' },
    { root: 'ProductionApp', screen: 'MainDrawer', name: '메인' },
    // { root: 'ProductionApp', screen: 'SchedulerScreen', name: '스켈줄 생성' },
    // { root: 'ProductionApp', screen: 'MyInfoManager', name: '내 정보 수정' },
    {
      root: 'ProductionApp',
      screen: 'MainDrawer',
      params: { screen: 'TrackManagerTabs' },
      name: '코스관리',
    },
    // {
    //   root: 'ProductionApp',
    //   screen: 'MainDrawer',
    //   params: { screen: 'ScheduleManagerScreen' },
    //   name: '스케줄관리',
    // },
    // {
    //   root: 'ProductionApp',
    //   screen: 'MainDrawer',
    //   params: { screen: 'MyPageScreen' },
    //   name: 'MY모두런',
    // },
  ];

  return (
    <ScrollView>
      {pages.map((page, idx) => (
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            backgroundColor: page.screen === undefined ? 'dodgerblue' : 'green',
            borderWidth: 1,
            borderColor: page.screen === undefined ? 'red' : 'darkgreen',
          }}
          key={String(idx)}
          title={page}
          onPress={() => {
            navigation.navigate(page.root, {
              screen: page.screen,
              params: page.params,
            });
          }}
        >
          <Text
            style={{
              color: 'white',
              alignSelf: 'center',
            }}
          >
            {page.name || 'ProductionApp'}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Developer;

const styles = StyleSheet.create({});
