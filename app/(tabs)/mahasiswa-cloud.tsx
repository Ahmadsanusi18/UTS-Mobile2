/**
 * mahasiswa-cloud.tsx — Tampilkan tabel public.mahasiswa dari Supabase (read-only).
 * Route: /(tabs)/mahasiswa-cloud
 */

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type MahasiswaRow = {
  id: string;
  nim: string;
  nama: string;
  prodi: string;
  kelas: string | null;
  created_at: string;
  updated_at: string;
};

export default function MahasiswaCloudScreen() {
  const [rows, setRows] = useState<MahasiswaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isNarrow = width < 420;
  const padH = Math.max(16, Math.min(24, width * 0.045));

  const loadData = useCallback(async () => {
    if (!supabase) {
      setRows([]);
      setError(null);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    setError(null);
    const { data, error: qErr } = await supabase
      .from('mahasiswa')
      .select('id,nim,nama,prodi,kelas,created_at,updated_at')
      .order('nim', { ascending: true });

    if (qErr) {
      setError(qErr.message);
      setRows([]);
    } else {
      setRows((data as MahasiswaRow[]) ?? []);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const configured = isSupabaseConfigured();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: padH, paddingBottom: 32 + insets.bottom },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={configured} />
        }
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Data Mahasiswa (Cloud)</Text>
        <Text style={styles.subtitle}>
          Data dari tabel <Text style={styles.mono}>public.mahasiswa</Text> di Supabase
        </Text>

        {!configured ? (
          <Text style={styles.errText}>
            Tambahkan URL dan anon key ke <Text style={styles.mono}>.env</Text>, lalu restart Expo.
          </Text>
        ) : null}

        {loading && !refreshing ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#0a7ea4" />
            <Text style={styles.muted}>Memuat data…</Text>
          </View>
        ) : null}

        {error && configured ? <Text style={styles.errText}>{error}</Text> : null}

        {!loading && configured && !error ? (
          <Text style={styles.count}>Total {rows.length} mahasiswa</Text>
        ) : null}

        {!loading && configured && !error && rows.length === 0 ? (
          <Text style={styles.muted}>Belum ada data. Jalankan SQL di Supabase atau tambah baris lewat Table Editor.</Text>
        ) : null}

        {!loading && configured && !error && rows.length > 0 && isNarrow ? (
          <View style={styles.cardList}>
            {rows.map((m, index) => (
              <View key={m.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>No</Text>
                  <Text style={styles.cardValue}>{index + 1}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>NIM</Text>
                  <Text style={styles.cardValue}>{m.nim}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Nama</Text>
                  <Text style={[styles.cardValue, styles.cardValueBold]}>{m.nama}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Prodi</Text>
                  <Text style={styles.cardValue}>{m.prodi}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Kelas</Text>
                  <Text style={styles.cardValue}>{m.kelas ?? '—'}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {!loading && configured && !error && rows.length > 0 && !isNarrow ? (
          <>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.cellNo, styles.headerText]}>No</Text>
              <Text style={[styles.cell, styles.cellNim, styles.headerText]}>NIM</Text>
              <Text style={[styles.cell, styles.cellNama, styles.headerText]}>Nama</Text>
              <Text style={[styles.cell, styles.cellProdi, styles.headerText]}>Prodi</Text>
              <Text style={[styles.cell, styles.cellKelas, styles.headerText]}>Kelas</Text>
            </View>
            {rows.map((m, index) => (
              <View key={m.id} style={styles.row}>
                <Text style={[styles.cell, styles.cellNo]}>{index + 1}</Text>
                <Text style={[styles.cell, styles.cellNim]}>{m.nim}</Text>
                <Text style={[styles.cell, styles.cellNama]}>{m.nama}</Text>
                <Text style={[styles.cell, styles.cellProdi]}>{m.prodi}</Text>
                <Text style={[styles.cell, styles.cellKelas]}>{m.kelas ?? '—'}</Text>
              </View>
            ))}
          </>
        ) : null}

        {configured && !loading ? (
          <Pressable
            style={({ pressed }) => [styles.btnRefresh, pressed && styles.btnPressed]}
            onPress={onRefresh}>
            <Text style={styles.btnRefreshText}>Muat ulang</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scroll: { flex: 1 },
  content: { paddingTop: 20, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#5c5c5c', marginBottom: 16 },
  mono: { fontFamily: 'monospace', fontSize: 14, color: '#333' },
  count: { fontSize: 14, color: '#333', marginBottom: 14, fontWeight: '500' },
  muted: { fontSize: 15, color: '#666', marginTop: 8 },
  errText: { fontSize: 15, color: '#b71c1c', marginBottom: 12, lineHeight: 22 },
  centerBox: { paddingVertical: 32, alignItems: 'center', gap: 12 },
  cardList: { gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardLabel: { fontSize: 13, color: '#6c6c6c', flex: 0.4 },
  cardValue: { fontSize: 14, color: '#1a1a1a', flex: 0.6, textAlign: 'right' },
  cardValueBold: { fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  headerRow: {
    backgroundColor: '#0a7ea4',
    borderBottomColor: '#086890',
    paddingVertical: 12,
  },
  headerText: { color: '#fff', fontWeight: 'bold' },
  cell: { fontSize: 13, color: '#333' },
  cellNo: { width: 32, textAlign: 'center' },
  cellNim: { width: 68 },
  cellNama: { flex: 1, minWidth: 72 },
  cellProdi: { width: 108 },
  cellKelas: { width: 48, textAlign: 'center' },
  btnRefresh: {
    alignSelf: 'flex-start',
    marginTop: 20,
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  btnRefreshText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  btnPressed: { opacity: 0.85 },
});
