export const convertDuration = (timeDuration) => {
  if (timeDuration < 0) return '시간이 잘못 설정되었습니다.';
  const minute = timeDuration / 1000 / 60;
  const hour = Math.floor(minute / 60);
  if (!hour) return `${minute}분`;
  const remainingMinute = minute - hour * 60;
  if (!remainingMinute) return `${hour}시간`;
  return `${hour}시간 ${minute - hour * 60}분`;
};

const dayToKor = (dayNum, isShort) => {
  const toKor = {
    0: '일',
    1: '월',
    2: '화',
    3: '수',
    4: '목',
    5: '금',
    6: '토',
  };
  if (isShort) return toKor[dayNum];
  return `${toKor[dayNum]}요일`;
};

const prettyHour = (hour) => {
  let front;
  let adjust;
  if (hour >= 2 && hour < 6) front = '새벽';
  if (hour >= 6 && hour < 12) front = '오전';
  if (hour >= 12 && hour < 18) front = '오후';
  if (hour >= 18 && hour < 22) front = '저녁';
  if (hour >= 22 && hour <= 24) front = '밤';
  if (hour >= 0 && hour < 2) front = '밤';
  if (hour < 12) adjust = 0;
  if (hour > 12) adjust = -12;
  const adjustedHour = Number(hour) + adjust;
  return `${front + adjustedHour}시`;
};

const monthToKor = (month) => `${month + 1}월`;

export const convertDate = (parsedDate, type = 'short') => {
  const dateObj = new Date(parsedDate);
  const year = `${dateObj.getFullYear()}년`;
  const month = monthToKor(dateObj.getMonth());
  const date = `${dateObj.getDate()}일`;
  const day = dayToKor(dateObj.getDay());
  const hour = prettyHour(dateObj.getHours());
  const minute = dateObj.getMinutes();
  const compactMinute = minute < 10 ? `0${minute}` : minute;
  const longMin = `${dateObj.getMinutes()}분`;
  if (type === 'compact') return `${dateObj.getFullYear() === new Date(Date.now()).getFullYear() ? '' : `${dateObj.getFullYear()}.`}${dateObj.getMonth()}.${dateObj.getDate()}(${day[0]}) ${dateObj.getHours()}:${compactMinute}`;
  if (type === 'short') return `${month} ${date}(${day[0]}) ${dateObj.getHours()}:${compactMinute}`;
  return `${month} ${date} ${day} ${hour} ${longMin}`;
};
