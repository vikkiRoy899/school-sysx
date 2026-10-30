import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import api from '../services/api';

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/communication/announcements')
      .then(res => setAnnouncements(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <View style={styles.container}><Text>Loading announcements...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Announcements</Text>
      {announcements.map((ann) => (
        <View key={ann.id} style={styles.card}>
          <Text style={styles.annTitle}>{ann.title}</Text>
          <Text style={styles.annContent}>{ann.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 12 },
  annTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  annContent: { fontSize: 14, color: '#666' }
});
