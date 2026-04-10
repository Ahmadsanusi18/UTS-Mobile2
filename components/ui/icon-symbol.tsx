/**
 * =============================================================================
 * icon-symbol.tsx — Komponen Ikon Satu Nama untuk Semua Platform
 * =============================================================================
 *
 * File ini bikin satu komponen ikon (IconSymbol) yang bisa dipakai di mana aja
 * dengan nama yang sama. Di belakang layar: di iOS pakai SF Symbols (milik Apple),
 * di Android & web pakai Material Icons. Supaya kita enggak nulis dua kode beda
 * (satu buat iOS, satu buat Android), kita pakai Material Icons di semua platform
 * dan "peta" nama ikon iOS (SF Symbols) ke nama ikon Material.
 *
 * Jadi: kamu tulis name="house.fill" → di HP Android/web yang keluar ikon "home"
 * dari Material Icons. Satu komponen, tampil konsisten di mana aja.
 *
 * ----- Isi file (urutan) -----
 * 1. Import: library yang dipakai (MaterialIcons, type dari expo-symbols, dll).
 * 2. Type: definisi bentuk data (mapping nama ikon, nama yang boleh dipakai).
 * 3. MAPPING: tabel "nama SF Symbol → nama Material Icon".
 * 4. IconSymbol: komponen yang kamu pakai di layar (props: name, size, color, style).
 * =============================================================================
 */

/* ----- Import: bahan-bahan yang dipakai di file ini -----
   MaterialIcons = kumpulan ikon yang dipakai di Android & web (dari Expo).
   SymbolWeight, SymbolViewProps = type dari expo-symbols (untuk iOS; di sini
   kita pakai Material jadi type-nya tetap dipakai buat nama).
   ComponentProps = ambil type props dari suatu komponen (MaterialIcons).
   OpaqueColorValue, StyleProp, TextStyle = type React Native buat color & style. */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

/* =============================================================================
   TYPE: "BENTUK" DATA AGAR TIDAK SAL KETIK
   =============================================================================
   IconMapping = object yang key-nya nama SF Symbol, value-nya nama Material Icon.
   Record<A, B> = "object dengan key tipe A, value tipe B". Dipakai biar waktu
   kita nambah ikon di MAPPING, TypeScript ngingetin kalau nama Material Icon-nya
   enggak ada (typo).
   IconSymbolName = nama yang boleh dipakai di prop "name" (key dari MAPPING).
   keyof typeof MAPPING = "semua key yang ada di object MAPPING". Jadi kalau
   kamu nambah 'star.fill' di MAPPING, otomatis name="star.fill" boleh dipakai.
   ============================================================================= */
type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * MAPPING — Tabel Nama Ikon: SF Symbol → Material Icon
 * =============================================================================
 * Di sini kita daftarin: nama yang dipakai di app (biasanya dari SF Symbols)
 * dipetakan ke nama ikon Material Icons. Waktu kamu panggil <IconSymbol name="house.fill" />,
 * komponen bawahnya baca MAPPING['house.fill'] → dapat 'home' → tampil ikon home.
 *
 * Mau nambah ikon baru?
 * 1. Cek nama Material Icons: https://icons.expo.fyi (cari yang mirip).
 * 2. Cek nama SF Symbols (kalau mau konsisten): https://developer.apple.com/sf-symbols/
 * 3. Tambah satu baris: 'nama.sf.symbol': 'nama-material-icon',
 * 4. Simpan — sekarang name="nama.sf.symbol" bisa dipakai di mana aja.
 * =============================================================================
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'book.fill': 'menu-book',
  'graduationcap.fill': 'school',
  'folder.fill': 'folder',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'rectangle.portrait.and.arrow.right': 'logout',
  'cloud.fill': 'cloud',
} as IconMapping;

/**
 * IconSymbol — Komponen Ikon Satu Nama untuk Semua Platform
 * =============================================================================
 * Dipakai di tab bar, tombol, atau teks. Contoh:
 *   <IconSymbol name="house.fill" size={28} color="#0a7ea4" />
 *
 * Props:
 *   name   = nama ikon (harus salah satu key di MAPPING). Wajib.
 *   size   = ukuran ikon (px). Default 24.
 *   color  = warna (string atau OpaqueColorValue). Wajib.
 *   style  = style tambahan (opsional). Bisa dipakai buat margin, dll.
 *   weight = (dari SF Symbols; di sini pakai Material jadi tidak dipakai, tetap
 *            ada di type biar kompatibel kalau nanti ada versi iOS native).
 *
 * Return: satu komponen MaterialIcons dengan name yang sudah dipetakan dari
 * MAPPING[name], jadi di layar yang keluar ikon Material yang sesuai.
 * =============================================================================
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  /* MAPPING[name] = ambil nama Material Icon dari tabel. name dari props
     (misal 'house.fill') → dapat 'home' → MaterialIcons tampilkan ikon home. */
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
