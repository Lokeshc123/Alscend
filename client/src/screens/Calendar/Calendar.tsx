import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import ProgressCalendarDay from '../../components/ProgressCalendarDat';

const markedDates = {
  '2025-05-10': { progress: 0.75 },
  '2025-05-11': { progress: 0.3 },
  '2025-05-12': { progress: 1.0 },
};

const CalendarScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Calendar
      style= {styles.calendar}
        dayComponent={({ date, marking }: { date: { dateString: string; day: number; month: number; year: number }, marking: { progress: number } }) => (
          <ProgressCalendarDay date={date} marking={marking} />
        )}
        markedDates={markedDates}
      />
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
calendar : {
  height: '100%',
  width: '100%',
}
});
