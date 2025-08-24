import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
type DateObject = {
  year: number;
  month: number;
  day: number;
};

type ProgressCircleProps = {
  progress: number;
};

const ProgressCircle: React.FC<ProgressCircleProps> = ({ progress }) => {
  const radius = 18;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Svg height="40" width="40">
      <Circle
        cx="20"
        cy="20"
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx="20"
        cy="20"
        r={radius}
        stroke="#3b82f6"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference}, ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </Svg>
  );
};

type CustomDayProps = {
  date: DateObject;
  marking?: {
    progress?: number;
  };
};

const ProgressCalendarDay: React.FC<CustomDayProps> = ({ date, marking }) => {
  const progress = marking?.progress ?? 0;

  return (
    <View style={styles.dayContainer}>
      <ProgressCircle progress={progress} />
      <Text style={styles.dateText}>{date.day}</Text>
    </View>
  );
};

export default ProgressCalendarDay;

const styles = StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
 
  },
  dateText: {
    position: 'absolute',
    top: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
