import * as Location from 'expo-location';
import moment from 'moment';

const customizingDateAndTime = (date, time) => {
  let arr;
  let result;
  if (date && !time) {
    const d = moment(date).format('M-D');
    arr = d.split('-');
    result = `${arr[0]}월 ${arr[1]}일`;
  } else {
    const d = moment(time).format('HH:mm:ss');
    arr = d.split(':');
    result = `${arr[0]}시 ${arr[1]}분`;
  }
  return result;
};

const meterToKilo = (meter) => (meter / 1000).toFixed(2);

const getUserLocation = async () => {
  const { status } = await Location.requestPermissionsAsync();
  if (status !== 'granted') {
    return 'Permission to access location was denied';
  }
  const { coords } = await Location.getCurrentPositionAsync();
  return coords;
};

const getScheduleData = (createdScheduleInfo) => {
  const {
    title, date, startTime, estimateTime, estimateMin, selectedTrack,
  } = createdScheduleInfo;
  const time = moment(startTime);
  const from = moment(date).set({ hour: time.get('hour'), minute: time.get('minute') });
  const to = moment(from).add(estimateTime, 'hours').add(estimateMin, 'minutes');
  const res = {
    trackId: selectedTrack.trackId,
    scheduleTitle: title,
    from,
    to,
  };
  return res;
};

const createdScheduleInfo = (data) => {
  const track = {
    trackTitle: data[0].trackTitle,
    origin: data[0].origin,
    destination: data[0].destination,
    trackLength: data[0].trackLength,
    route: data[0].route,
  };
  const schedule = {
    title: data[0].title,
    scheduleFrom: data[0].scheduleFrom,
    scheduleTo: data[0].scheduleTo,
  };
  const result = {
    track,
    schedule,
  };
  return result;
};

const getFilterCondition = () => ({
  maxLength: 3000,
  distance: 2000,
  rate: false,
  recent: true,
  date: {
    from: moment().format('YYYY-MM-DD HH:mm:ss'),
    to: moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
    timeFrom: moment().format('YYYY-MM-DD HH:mm:ss'),
    timeTo: moment().set({ 'hour': 23, 'minute': 59 }).format('YYYY-MM-DD HH:mm:ss'),
  },
});

export default {
  customizingDateAndTime,
  meterToKilo,
  getUserLocation,
  getScheduleData,
  createdScheduleInfo,
  getFilterCondition,
};
