import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

export type CalendarEvent = {
  id: string;
  firstName: string;
  reading: string;
  notes?: string;
  date: string; // 'YYYY-MM-DD'
};

type MonthViewProps = {
  events?: CalendarEvent[];
  month: number;
  day: number;
  year: number;
};

const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

// Helper to get all days in a month
function getMonthDays(year: number, month: number) {
  const numDays = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 1; i <= numDays; i++) {
    days.push(new Date(year, month, i));
  }
  return days;
}

// Helper to chunk array into weeks
function chunkIntoWeeks(cells: (Date | null)[]) {
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default function MonthView({ events = [], month, day, year, }: MonthViewProps) {
  const days = getMonthDays(year, month);
  const firstDayOfWeek = days[0].getDay();
  const blanks = Array(firstDayOfWeek).fill(null);
  const calendarCells = [...blanks, ...days];

  // Fill up the last week with blanks if needed
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  const weeks = chunkIntoWeeks(calendarCells);

  // Calculate cell height based on screen height and number of weeks
  const screenHeight = Dimensions.get('window').height;
  const headerHeight = 40; // Adjust as needed for weekday header
  const numWeeks = weeks.length;
  const cellHeight = (screenHeight - headerHeight - 60) / numWeeks; // 60 for padding/status bar

  // Get today's date
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  return (
    <View style={styles.container}>
      {/* Weekday headers */}
      <View style={styles.row}>
        {daysOfWeek.map((day, idx) => (
          <Text key={idx} style={styles.headerCell}>{day[0]}</Text>
        ))}
      </View>
      {/* Calendar grid */}
      <View style={styles.grid}>
        {weeks.map((week, wIdx) => (
          <View key={wIdx} style={styles.weekRow}>
            {week.map((date, dIdx) => {
              const dayEvents = date
                ? events.filter(
                    e => e.date === date.toISOString().slice(0, 10)
                  )
                : [];
              // Show up to 3 names, then "+N more"
              const maxEventsToShow = 3;
              const extraCount = dayEvents.length - maxEventsToShow;
              return (
                <View
                  key={dIdx}
                  style={[styles.dayCell, { height: cellHeight }]}
                >
                  {date && (
                    <View style={styles.dateNumberWrapper}>
                      {date.getFullYear() === todayYear &&
                       date.getMonth() === todayMonth &&
                       date.getDate() === todayDate ? (
                        <View style={styles.todayCircle}>
                          <Text style={styles.todayText}>{date.getDate()}</Text>
                        </View>
                      ) : (
                        <Text style={styles.dateText}>{date.getDate()}</Text>
                      )}
                    </View>
                  )}
                  {dayEvents.slice(0, maxEventsToShow).map(event => (
                    <View key={event.id} style={styles.eventBlock}>
                      <Text style={styles.eventText}>{event.firstName}</Text>
                    </View>
                  ))}
                  {extraCount > 0 && (
                    <Text style={styles.moreText}>+{extraCount} more</Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, backgroundColor: '#fff' },
  row: {
    flexDirection: 'row',
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 40,
    color: '#666',
  },
  grid: { flex: 1 },
  weekRow: { flexDirection: 'row', flex: 1 },
  dayCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: 2,
  },
  dateNumberWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
    width: '100%',
  },
  todayCircle: {
    backgroundColor: '#1976d2', // Google Calendar blue
    borderRadius: 16,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  todayText: {
    color: '#fff',
    fontSize: 12,
  },
  dateText: {
    fontWeight: 'light',
    fontSize: 12,
    textAlign: 'center',
    width: 22,
    height: 22,
    textAlignVertical: 'center', 
    includeFontPadding: false,   
    lineHeight: 22,
},
  eventBlock: {
    backgroundColor: '#ADD8E6',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingTop: 1,
    marginTop: 2,
    marginBottom: 1,
    minHeight: 16,
    width: '95%',
    alignSelf: 'stretch',
  },
  eventText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  moreText: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});
