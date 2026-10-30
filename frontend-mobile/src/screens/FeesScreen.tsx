import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import api from '../services/api';

export default function FeesScreen() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/fees/invoices')
      .then(res => setInvoices(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <View style={styles.container}><Text>Loading invoices...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fee Invoices</Text>
      {invoices.map((inv) => (
        <View key={inv.id} style={styles.card}>
          <Text style={styles.amount}>${inv.amount}</Text>
          <Text style={[styles.status, { color: inv.status === 'PAID' ? 'green' : 'orange' }]}>
            {inv.status}
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
  amount: { fontSize: 16, fontWeight: 'bold' },
  status: { fontSize: 16, fontWeight: 'bold' }
});
