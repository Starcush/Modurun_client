/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import * as actions from '../../../redux/action/SingleTrackViewer/creator';

const styles = StyleSheet.create({
  entryContainer: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  titleContainer: {
    padding: 10,
    paddingBottom: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  detailContainer: {

  },
  title: {
    paddingLeft: 7,
    paddingRight: 30,
    fontSize: 18,
    color: 'black',
    flex: 75,
    fontWeight: 'bold',
  },
  titleButtonContainer: {
    flex: 38,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  propRowContainer: {
    flexDirection: 'row',
  },
  propRowKey: {
    padding: 5,
    borderRadius: 10,
    color: 'white',
    margin: 5,
  },
  propRowValue: {
    padding: 5,
    borderRadius: 10,
    margin: 5,
  },
  descContainer: {
    backgroundColor: 'rgba(250,250,250,1)',
    padding: 5,
  },
  chevron: {
    padding: 5,
    color: 'white',
    borderRadius: 100,
    margin: 5,
    backgroundColor: 'lightgrey',
    alignContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  chevronDetail: {
    padding: 5,
    color: 'white',
    borderRadius: 5,
    backgroundColor: '#1E90FF',
    alignContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  delete: {
    padding: 10,
    backgroundColor: 'firebrick',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  showDetail: {
    padding: 10,
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    width: 25,
    height: 25,
    marginTop: 2,
  },
});

const MyTrackListEntry = ({
  data, setSingleTrack, setAction,
}) => {
  const {
    trackTitle, origin, destination,
  } = data;
  if (!origin || !destination) return <></>;

  const navigation = useNavigation();

  const selectTrack = () => {
    setAction(data);
    navigation.goBack();
  };

  const viewTrackOnMap = () => {
    setSingleTrack(data);
    navigation.navigate('SingleTrackViewerScreen');
  };

  return (
    <View style={styles.entryContainer}>
      <Text style={styles.title}>{trackTitle}</Text>
      <View style={styles.titleButtonContainer}>
        <TouchableHighlight underlayColor="#03D6A7" onPress={selectTrack} style={styles.chevron}>
          <Icon name="check" color="white" style={{ padding: 3 }} size={15} />
        </TouchableHighlight>
        <TouchableHighlight underlayColor="lightgrey" onPress={viewTrackOnMap} style={{ margin: 10 }}>
          <Text style={{ fontSize: 12, color: '#1E90FF', fontWeight: 'bold' }}>자세히 보기</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default connect(null, { ...actions })(MyTrackListEntry);
