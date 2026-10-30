import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import api from '../services/api';

export default function AttendanceScreen() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance/student')
      .then(res => setAttendance(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <View style={styles.container}><Text>Loading attendance...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Attendance</Text>
      {attendance.map((item, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
          <Text style={[styles.status, { color: item.status === 'PRESENT' ? 'green' : 'red' }]}>
            {item.status}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  date: { fontSize: 16 },
  status: { fontSize: 16, fontWeight: 'bold' }
});
