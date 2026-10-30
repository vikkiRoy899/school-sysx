import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import api from '../services/api';

interface TimetableItem {
  id: string;
  subject: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  teacher?: { user: { email: string } };
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimetableScreen({ route }: any) {
  const classId = route?.params?.classId || 'default-class-id';
  const [timetable, setTimetable] = useState<TimetableItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/timetable/class/${classId}`)
      .then(res => setTimetable(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading timetable...</Text>
      </View>
    );
  }

  const groupedByDay = days.map((day, dayIndex) => ({
    day,
    dayNumber: dayIndex + 1,
    items: timetable.filter(t => t.dayOfWeek === dayIndex + 1),
  })).filter(g => g.items.length > 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Weekly Timetable</Text>
      
      {groupedByDay.map((group) => (
        <View key={group.dayNumber} style={styles.dayCard}>
          <Text style={styles.dayName}>{group.day}</Text>
          {group.items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.time}>{item.startTime} - {item.endTime}</Text>
              <Text style={styles.subject}>{item.subject}</Text>
              {item.teacher?.user && (
                <Text style={styles.teacher}>{item.teacher.user.email.split('@')[0]}</Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dayCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 8,
  },
  item: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  subject: {
    fontSize: 16,
    fontWeight: '500',
  },
  teacher: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
