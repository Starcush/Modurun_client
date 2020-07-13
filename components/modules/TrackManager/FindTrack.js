import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Dimensions, Modal } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Picker } from '@react-native-community/picker';
import TrackList from '../TrackList';
import styles from './styles';

const FindTrack = ({ tracks, onFilterSet, setTabIndex }) => {
  const [orderFilter, setOrderFilter] = useState('recent');
  const [input, setInput] = useState({
    maxLength: 0.4,
    distance: 1,
    rate: true,
    order: false,
  });

  useEffect(() => {
    const { maxLength, distance, rate, order } = input;
    if (
      maxLength !== undefined &&
      distance !== undefined &&
      rate !== undefined &&
      order !== undefined
    ) {
      onFilterSet(input);
    }
  }, [input, orderFilter]);

  const convertFilterInput = (filterName, filterInput) => {
    if (filterName === 'minLength') return Number(filterInput) * 1000;
    if (filterName === 'maxLength') return Number(filterInput) * 1000;
    if (filterName === 'distance') return Number(filterInput) * 1000;
  };

  const makeInputUpdater = (filterName) => {
    return (e) => {
      const textInput = e.nativeEvent.text;
      const convertedValue = convertFilterInput(filterName, textInput);
      // eslint-disable-next-line valid-typeof
      setInput({ ...input, [filterName]: convertedValue });
    };
  };

  const alertNoTrack = () => (
    <View
      style={{
        height: 200,
        width: Dimensions.get('screen').width - 20,
        backgroundColor: 'white',
        padding: 20,
        paddingBottom: 40,
        margin: 10,
        justifyContent: 'center',
        borderRadius: 20,
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
        아쿠!
      </Text>
      {/* <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'lightgrey'}}>이거 어쩌죠</Text> */}
      <Text style={{ textAlign: 'center', marginTop: 5, color: 'grey' }}>
        찾으시는 조건으로는 트랙이 없네요
      </Text>
      <TouchableOpacity onPress={() => setTabIndex(2)}>
        <Text style={{ textAlign: 'center', color: 'dodgerblue' }}>
          직접 코스를 제작해보시는 건 어떨까요?
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTrackList = () => {
    if (!tracks) return alertNoTrack();
    if (!tracks.length) return alertNoTrack();
    return <TrackList showAdd tracks={tracks} />;
  };

  return (
    <View style={{ marginVertical: 5 }}>
      <View style={{ borderBottomWidth: 0, padding: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <View
            style={[
              styles.filterInputContainer,
              { marginRight: 10, justifyContent: 'center', flex: 1.5 },
            ]}
          >
            <Text
              style={{
                fontSize: 12,
                color: 'white',
                marginRight: 5,
                textAlignVertical: 'center',
              }}
            >
              여기서
            </Text>
            <TextInput
              keyboardType="numeric"
              placeholder="1"
              value={String(input.distance)}
              onChange={makeInputUpdater('distance')}
              style={styles.filterInput}
            />
            <Text
              style={{
                fontSize: 12,
                color: 'white',
                textAlignVertical: 'center',
                marginLeft: 5,
              }}
            >
              km 이내
            </Text>
          </View>
          <View style={[styles.filterInputContainer, { marginRight: 10 }]}>
            <TextInput
              keyboardType="numeric"
              placeholder="0"
              onChange={makeInputUpdater('minLength')}
              style={styles.filterInput}
            />
            <Text
              style={{
                fontSize: 12,
                color: 'white',
                textAlignVertical: 'center',
                marginLeft: 5,
              }}
            >
              km 이상
            </Text>
          </View>
          <View style={[styles.filterInputContainer]}>
            <TextInput
              keyboardType="numeric"
              placeholder="3"
              onChange={makeInputUpdater('maxLength')}
              style={styles.filterInput}
            />
            <Text
              style={{
                fontSize: 12,
                color: 'white',
                textAlignVertical: 'center',
                marginLeft: 5,
              }}
            >
              km 미만
            </Text>
          </View>
        </View>
        <View
          style={{ backgroundColor: 'white', elevation: 2, borderRadius: 5 }}
        >
          <Picker
            style={{ height: 40 }}
            selectedValue={orderFilter}
            onValueChange={(itemValue) => {
              setOrderFilter(itemValue);
              if (itemValue === 'recent')
                setInput({ ...input, recent: true, rate: false });
              if (itemValue === 'rate')
                setInput({ ...input, recent: false, rate: true });
            }}
          >
            <Picker.Item label="별점순" value="rate" />
            <Picker.Item label="최신순" value="recent" />
          </Picker>
        </View>
      </View>
      {renderTrackList()}
    </View>
  );
};

export default FindTrack;
