import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import * as utils from './utils';
import styles from './styles';

const PrettyProp = ({ name, value, postComponent }) => {
  return (
    <View style={[styles.propRowContainer]}>
      <Text style={[styles.propRowKey]}>{name}</Text>
      <View style={styles.propRowValueContainer}>
        <Text style={styles.propRowValue}>{value}</Text>
        {postComponent || <></>}
      </View>
    </View>
  );
};

PrettyProp.defaultProps = {
  postComponent: <></>,
};

PrettyProp.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  // color: PropTypes.string.isRequired,
  postComponent: PropTypes.element,
};

export default PrettyProp;
