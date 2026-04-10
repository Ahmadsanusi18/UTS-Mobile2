/**
 * =============================================================================
 * modul.tsx — Halaman Tab "Modul" (CRUD Data Mahasiswa)
 * =============================================================================
 *
 * Ini halaman buat mengelola data mahasiswa: tampil, tambah, ubah, hapus.
 * Istilah kerennya: CRUD (Create, Read, Update, Delete). Tapi kamu cukup ingat:
 *
 *   • Read    = TAMPIL → tabel yang kamu lihat + pagination (10 data per halaman).
 *   • Create  = TAMBAH → tombol "+ Tambah Mahasiswa" → isi form → Simpan.
 *   • Update  = UBAH   → tombol "Ubah" di tiap baris → edit di form → Simpan.
 *   • Delete  = HAPUS  → tombol "Hapus" di tiap baris → konfirmasi → data hilang.
 *
 * Data kita simpan di "state" (useState) jadi bisa diubah-ubah. Kalau nanti
 * kamu sudah belajar API atau database, data ini bisa diganti ambil dari server.
 *
 * ----- Struktur file ini (biar enggak nyasar) -----
 * 1. Import: library yang dipakai (useState, Alert, Modal, dll).
 * 2. Konstanta & type: ITEM_PER_PAGE, bentuk data Mahasiswa, data awal (dummy).
 * 3. Function ModulScreen: isi halaman — state, fungsi (handler), lalu tampilan (return).
 * 4. Styles: semua style untuk tampilan (tabel, tombol, modal, dll).
 *
 * Route: /(tabs)/modul
 */

import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

/* =============================================================================
   KONSTANTA: BERAPA BANYAK DATA PER HALAMAN?
   =============================================================================
   Kita pakai konstanta (bukan angka langsung di kode) biar kalau mau ganti
   jadi 5 atau 20 per halaman, cukup ubah di sini satu tempat aja.
   ============================================================================= */
const ITEM_PER_PAGE = 10;

/* =============================================================================
   TYPE: BENTUK SATU DATA MAHASISWA
   =============================================================================
   Type di TypeScript = "cetakan". Kita bilang: satu mahasiswa itu punya
   id (string), nim (string), nama (string), prodi (string). Nanti waktu
   kita bikin data baru atau ubah data, TypeScript akan ngingetin kalau
   kita lupa isi salah satu atau salah tulis nama field. Bantu banget buat
   hindari typo dan bug.
   ============================================================================= */
type Mahasiswa = {
  id: string;
  nim: string;
  nama: string;
  prodi: string;
};

/* =============================================================================
   DATA AWAL (DUMMY): DAFTAR 20 MAHASISWA UNTUK MULAI
   =============================================================================
   Ini cuma data contoh. Pas app jalan pertama kali, kita isi state dengan
   DATA_AWAL ini. Terus user bisa tambah/ubah/hapus — datanya berubah di
   state. Id tiap orang unik (1, 2, 3, ...) biar kita bisa bedain waktu
   ubah atau hapus.
   ============================================================================= */
const DATA_AWAL: Mahasiswa[] = [
  { id: "1", nim: "210001", nama: "Ahmad Rizki", prodi: "Teknik Informatika" },
  { id: "2", nim: "210002", nama: "Budi Santoso", prodi: "Sistem Informasi" },
  { id: "3", nim: "210003", nama: "Citra Dewi", prodi: "Teknik Informatika" },
  { id: "4", nim: "210004", nama: "Dewi Lestari", prodi: "Manajemen" },
  { id: "5", nim: "210005", nama: "Eko Prasetyo", prodi: "Sistem Informasi" },
  {
    id: "6",
    nim: "210006",
    nama: "Fitri Handayani",
    prodi: "Teknik Informatika",
  },
  { id: "7", nim: "210007", nama: "Gilang Ramadhan", prodi: "Manajemen" },
  { id: "8", nim: "210008", nama: "Hesti Wijaya", prodi: "Sistem Informasi" },
  { id: "9", nim: "210009", nama: "Indra Kusuma", prodi: "Teknik Informatika" },
  { id: "10", nim: "210010", nama: "Joko Widodo", prodi: "Sistem Informasi" },
  { id: "11", nim: "210011", nama: "Kartika Sari", prodi: "Manajemen" },
  {
    id: "12",
    nim: "210012",
    nama: "Lukman Hakim",
    prodi: "Teknik Informatika",
  },
  { id: "13", nim: "210013", nama: "Maya Puspita", prodi: "Sistem Informasi" },
  {
    id: "14",
    nim: "210014",
    nama: "Nanda Pratama",
    prodi: "Teknik Informatika",
  },
  { id: "15", nim: "210015", nama: "Oki Setiawan", prodi: "Manajemen" },
  { id: "16", nim: "210016", nama: "Putri Melati", prodi: "Sistem Informasi" },
  {
    id: "17",
    nim: "210017",
    nama: "Rizki Firdaus",
    prodi: "Teknik Informatika",
  },
  { id: "18", nim: "210018", nama: "Siti Aminah", prodi: "Manajemen" },
  {
    id: "19",
    nim: "210019",
    nama: "Taufik Hidayat",
    prodi: "Sistem Informasi",
  },
  {
    id: "20",
    nim: "210020",
    nama: "Umar Abdullah",
    prodi: "Teknik Informatika",
  },
];

export default function ModulScreen() {
  /* =========================================================================
     BAGIAN 1: STATE (DATA YANG BISA BERUBAH — "INGATAN" HALAMAN INI)
     =========================================================================
     useState = cara React nyimpen data yang bisa berubah. Setiap kita panggil
     "set..." (misal setDataMahasiswa), nilai berubah dan React otomatis
     "gambar ulang" tampilan. Jadi tabel selalu nunjukkin data terbaru.
     ========================================================================= */

  /* ----- State utama: daftar mahasiswa (sumber data untuk tabel) -----
     Inilah "daftar" yang kita baca waktu nampilin tabel. Create = nambah
     item ke sini. Update = ganti salah satu item. Delete = buang salah satu
     item. Semua lewat setDataMahasiswa(...). */
  const [dataMahasiswa, setDataMahasiswa] = useState<Mahasiswa[]>(DATA_AWAL);

  /* ----- State pagination: halaman ke berapa yang lagi aktif -----
     currentPage = 1 artinya kita lagi di halaman 1. User klik "Selanjutnya"
     → setCurrentPage(2) → tabel nampilin data 11–20. */
  const [currentPage, setCurrentPage] = useState(1);

  /* ----- State modal form (popup untuk Tambah / Ubah) -----
     modalVisible = true/false → modal tampil atau enggak.
     modeForm = 'tambah' atau 'ubah' → judul form & logic Simpan beda.
     mahasiswaEdit = kalau lagi mode ubah, ini mahasiswa yang lagi diedit;
     kalau tambah, ini null. */
  const [modalVisible, setModalVisible] = useState(false);
  const [modeForm, setModeForm] = useState<"tambah" | "ubah">("tambah");
  const [mahasiswaEdit, setMahasiswaEdit] = useState<Mahasiswa | null>(null);

  /* ----- State isian form (NIM, Nama, Prodi yang lagi diketik) -----
     Waktu buka form Tambah → kita kosongin (''). Waktu buka form Ubah →
     kita isi dengan data mahasiswa yang dipilih. TextInput di bawah
     nanti pakai value={formNim} dan onChangeText={setFormNim} — jadi
     apa yang kamu ketik langsung nyimpan ke state ini. */
  const [formNim, setFormNim] = useState("");
  const [formNama, setFormNama] = useState("");
  const [formProdi, setFormProdi] = useState("");

  /* =========================================================================
     BAGIAN 2: NILAI YANG DIHITUNG DARI STATE (untuk pagination & tabel)
     =========================================================================
     Ini bukan state baru — kita cuma "turunkan" dari dataMahasiswa dan
     currentPage. Setiap state berubah, nilai ini otomatis kehitung ulang.
     ========================================================================= */

  /* Total halaman: 20 data ÷ 10 per halaman = 2. Math.ceil = pembulatan
     ke atas (25 data → 3 halaman). || 1 artinya minimal 1 halaman biar
     enggak 0 waktu data kosong. */
  const totalPages = Math.ceil(dataMahasiswa.length / ITEM_PER_PAGE) || 1;

  /* Halaman yang bener-bener dipakai. Kenapa? Misal kita di halaman 2,
     terus kita hapus sampai cuma sisa 5 data → totalPages jadi 1. Kalau
     kita tetep pakai currentPage 2, slice(10,20) jadi kosong. Makanya
     kita pakai halamanAman = yang lebih kecil antara currentPage dan
     totalPages. */
  const halamanAman = Math.min(currentPage, totalPages);

  /* Dari index berapa sampai mana kita "potong" data? Halaman 1: 0–10,
     halaman 2: 10–20. Di JavaScript array mulai dari 0. */
  const startIndex = (halamanAman - 1) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;

  /* dataPerHalaman = cuma 10 orang (atau kurang di halaman terakhir) yang
     kita tampilin di tabel. slice(awal, akhir) = ambil dari index "awal"
     sampai sebelum "akhir". */
  const dataPerHalaman = dataMahasiswa.slice(startIndex, endIndex);

  /* Nomor urut di kolom "No": di layar kita mau 1, 2, 3... bukan 0, 1, 2.
     Halaman 1: noUrutPertama = 1. Halaman 2: noUrutPertama = 11. Nanti
     tiap baris: noUrutPertama + index. */
  const noUrutPertama = startIndex + 1;

  /* =========================================================================
     BAGIAN 3: FUNGSI (HANDLER) — APA YANG TERJADI WAKTU USER NGAPAIN
     ========================================================================= */

  /* ----- Buka modal untuk TAMBAH -----
     Kita set mode "tambah", clear mahasiswa yang lagi diedit, kosongin
     form (NIM, Nama, Prodi), terus tampilin modal. */
  const handleBukaTambah = () => {
    setModeForm("tambah");
    setMahasiswaEdit(null);
    setFormNim("");
    setFormNama("");
    setFormProdi("");
    setModalVisible(true);
  };

  /* ----- Buka modal untuk UBAH -----
     Kita terima data mahasiswa "m" yang barisnya diklik. Mode kita set
     "ubah", simpan m ke mahasiswaEdit (biar waktu Simpan kita tahu
     yang mana yang diganti), isi form dengan nim/nama/prodi-nya m,
     terus tampilin modal. */
  const handleBukaUbah = (m: Mahasiswa) => {
    setModeForm("ubah");
    setMahasiswaEdit(m);
    setFormNim(m.nim);
    setFormNama(m.nama);
    setFormProdi(m.prodi);
    setModalVisible(true);
  };

  /* ----- Tutup modal -----
     Sembunyikan modal, clear mahasiswaEdit, kosongin form. Biar waktu
     buka lagi (tambah atau ubah) enggak keisi data lama. */
  const handleTutupModal = () => {
    setModalVisible(false);
    setMahasiswaEdit(null);
    setFormNim("");
    setFormNama("");
    setFormProdi("");
  };

  /* ----- CREATE: Simpan mahasiswa baru -----
     1. Ambil isian form (trim = buang spasi di ujung).
     2. Validasi: kalau ada yang kosong, tampil Alert "wajib diisi", berhenti.
     3. Bikin object baru dengan id unik (Date.now() = timestamp, jarang
        bentrok). nim, nama, prodi = singkatan dari nim: nim, nama: nama, ...
     4. setDataMahasiswa(prev => [...prev, baru]) = salin semua yang lama
        (...prev) lalu tambah "baru" di belakang. Array baru → React re-render.
     5. Tutup modal. */
  const handleSimpanTambah = () => {
    const nim = formNim.trim();
    const nama = formNama.trim();
    const prodi = formProdi.trim();
    if (!nim || !nama || !prodi) {
      Alert.alert("Perhatian", "NIM, Nama, dan Prodi wajib diisi.");
      return;
    }
    const baru: Mahasiswa = {
      id: String(Date.now()),
      nim,
      nama,
      prodi,
    };
    setDataMahasiswa((prev) => [...prev, baru]);
    handleTutupModal();
  };

  /* ----- UPDATE: Simpan perubahan mahasiswa yang diedit -----
     1. Kalau mahasiswaEdit null (enggak mungkin sih), keluar.
     2. Ambil isian form, validasi sama kayak tambah.
     3. setDataMahasiswa dengan .map: jalanin tiap item. Kalau id-nya
        sama dengan yang kita edit, ganti jadi { ...m, nim, nama, prodi }
        (salin m, timpa nim/nama/prodi). Yang lain tetap (return m).
     4. Tutup modal. */
  const handleSimpanUbah = () => {
    if (!mahasiswaEdit) return;
    const nim = formNim.trim();
    const nama = formNama.trim();
    const prodi = formProdi.trim();
    if (!nim || !nama || !prodi) {
      Alert.alert("Perhatian", "NIM, Nama, dan Prodi wajib diisi.");
      return;
    }
    setDataMahasiswa((prev) =>
      prev.map((m) =>
        m.id === mahasiswaEdit.id ? { ...m, nim, nama, prodi } : m,
      ),
    );
    handleTutupModal();
  };

  /* ----- DELETE: Hapus mahasiswa -----
     1. Tampil Alert konfirmasi: "Yakin hapus [nama] ([nim])?" dengan
        tombol Batal dan Hapus.
     2. Kalau user pilih Hapus, onPress jalan: filter = bikin array baru
        yang cuma isi orang yang id-nya BUKAN m.id. Jadi m "hilang" dari
        daftar. setDataMahasiswa(nextList) → tabel update.
     3. Kalau setelah hapus total halaman berkurang dan kita sekarang
        di halaman yang enggak ada (misal halaman 2 padahal cuma ada 1
        halaman), kita turunin currentPage ke totalPages yang baru. */
  const handleHapus = (m: Mahasiswa) => {
    Alert.alert("Konfirmasi Hapus", `Yakin hapus ${m.nama} (${m.nim})?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          const nextList = dataMahasiswa.filter((x) => x.id !== m.id);
          setDataMahasiswa(nextList);
          const newTotal = Math.ceil(nextList.length / ITEM_PER_PAGE) || 1;
          if (currentPage > newTotal) setCurrentPage(newTotal);
        },
      },
    ]);
  };

  /* Simpan form: kalau mode tambah panggil handleSimpanTambah, kalau
     mode ubah panggil handleSimpanUbah. Satu tombol "Simpan" buat dua
     jalan ini. */
  const handleSubmitForm = () => {
    if (modeForm === "tambah") handleSimpanTambah();
    else handleSimpanUbah();
  };

  /* ----- Responsif: ukuran layar & safe area (notch, home indicator) -----
     useWindowDimensions = lebar/tinggi layar (berubah kalau rotasi).
     useSafeAreaInsets = jarak aman dari notch/bawah. isNarrow = layar
     sempit (mobile) → tampil kartu per baris; lebar → tampil tabel. */
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isNarrow = width < 420;
  const padH = Math.max(16, Math.min(24, width * 0.045));

  /* =========================================================================
     BAGIAN 4: TAMPILAN (RETURN) — APA YANG KELIATAN DI LAYAR
     =========================================================================
     Yang di bawah ini = JSX. Mirip HTML tapi komponen React Native
     (View, Text, Pressable, TextInput, Modal). Kurung kurawal { } buat
     naruh variabel atau ekspresi (misal {dataMahasiswa.length}).
     ========================================================================= */

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: padH, paddingBottom: 32 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Judul + info — typography jelas, jarak nyaman */}
        <Text style={styles.title}>Data Mahasiswa</Text>
        <Text style={styles.subtitle}>
          {ITEM_PER_PAGE} per halaman • Total {dataMahasiswa.length} mahasiswa
        </Text>

        {/* Tombol Tambah — ukuran sentuh cukup (minHeight 48), warna hijau */}
        <Pressable
          style={({ pressed }) => [
            styles.btnTambah,
            pressed && styles.btnPressed,
          ]}
          onPress={handleBukaTambah}
        >
          <Text style={styles.btnTambahText}>+ Tambah Mahasiswa</Text>
        </Pressable>

        {/* Di layar sempit (mobile): tiap mahasiswa = satu kartu. Di layar lebar: tabel. */}
        {isNarrow ? (
          /* Layout kartu: satu kartu per mahasiswa, isi vertikal (No, NIM, Nama, Prodi, tombol).
             Lebih enak dibaca di HP daripada tabel sempit. */
          <View style={styles.cardList}>
            {dataPerHalaman.map((m, index) => (
              <View key={m.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>No</Text>
                  <Text style={styles.cardValue}>{noUrutPertama + index}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>NIM</Text>
                  <Text style={styles.cardValue}>{m.nim}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Nama</Text>
                  <Text style={[styles.cardValue, styles.cardValueBold]}>
                    {m.nama}
                  </Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Prodi</Text>
                  <Text style={styles.cardValue}>{m.prodi}</Text>
                </View>
                <View style={styles.cardActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.btnAksi,
                      pressed && styles.btnPressed,
                    ]}
                    onPress={() => handleBukaUbah(m)}
                  >
                    <Text style={styles.btnAksiText}>Ubah</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.btnAksi,
                      styles.btnHapus,
                      pressed && styles.btnPressed,
                    ]}
                    onPress={() => handleHapus(m)}
                  >
                    <Text style={styles.btnAksiText}>Hapus</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.cellNo, styles.headerText]}>
                No
              </Text>
              <Text style={[styles.cell, styles.cellNim, styles.headerText]}>
                NIM
              </Text>
              <Text style={[styles.cell, styles.cellNama, styles.headerText]}>
                Nama
              </Text>
              <Text style={[styles.cell, styles.cellProdi, styles.headerText]}>
                Prodi
              </Text>
              <Text style={[styles.cell, styles.cellAksi, styles.headerText]}>
                Aksi
              </Text>
            </View>
            {dataPerHalaman.map((m, index) => (
              <View key={m.id} style={styles.row}>
                <Text style={[styles.cell, styles.cellNo]}>
                  {noUrutPertama + index}
                </Text>
                <Text style={[styles.cell, styles.cellNim]}>{m.nim}</Text>
                <Text style={[styles.cell, styles.cellNama]}>{m.nama}</Text>
                <Text style={[styles.cell, styles.cellProdi]}>{m.prodi}</Text>
                <View style={styles.cellAksi}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.btnAksi,
                      pressed && styles.btnPressed,
                    ]}
                    onPress={() => handleBukaUbah(m)}
                  >
                    <Text style={styles.btnAksiText}>Ubah</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.btnAksi,
                      styles.btnHapus,
                      pressed && styles.btnPressed,
                    ]}
                    onPress={() => handleHapus(m)}
                  >
                    <Text style={styles.btnAksiText}>Hapus</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Pagination: Sebelumnya | Halaman X dari Y | Selanjutnya.
          disabled = tombol enggak bisa diklik (style abu-abu). Di
          halaman 1 "Sebelumnya" disabled, di halaman terakhir
          "Selanjutnya" disabled. */}
        <View style={styles.paginationWrapper}>
          <Pressable
            style={[
              styles.btnPagination,
              halamanAman <= 1 && styles.btnDisabled,
            ]}
            onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={halamanAman <= 1}
          >
            <Text
              style={[
                styles.btnText,
                halamanAman <= 1 && styles.btnTextDisabled,
              ]}
            >
              Sebelumnya
            </Text>
          </Pressable>
          <Text style={styles.paginationInfo}>
            Halaman {halamanAman} dari {totalPages}
          </Text>
          <Pressable
            style={[
              styles.btnPagination,
              halamanAman >= totalPages && styles.btnDisabled,
            ]}
            onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={halamanAman >= totalPages}
          >
            <Text
              style={[
                styles.btnText,
                halamanAman >= totalPages && styles.btnTextDisabled,
              ]}
            >
              Selanjutnya
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal: lebar responsif (92% layar, max 400), padding aman untuk notch */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleTutupModal}
      >
        <Pressable
          style={[
            styles.modalOverlay,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
          ]}
          onPress={handleTutupModal}
        >
          <Pressable
            style={[styles.modalBox, { width: width * 0.92, maxWidth: 400 }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
              {modeForm === "tambah" ? "Tambah Mahasiswa" : "Ubah Mahasiswa"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="NIM"
              value={formNim}
              onChangeText={setFormNim}
              editable={modeForm === "tambah"}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Nama"
              value={formNama}
              onChangeText={setFormNama}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Prodi"
              value={formProdi}
              onChangeText={setFormProdi}
              placeholderTextColor="#999"
            />
            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.btnModal,
                  styles.btnBatal,
                  pressed && styles.btnPressed,
                ]}
                onPress={handleTutupModal}
              >
                <Text style={styles.btnBatalText}>Batal</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.btnModal,
                  styles.btnSimpan,
                  pressed && styles.btnPressed,
                ]}
                onPress={handleSubmitForm}
              >
                <Text style={styles.btnSimpanText}>Simpan</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* =============================================================================
   BAGIAN 5: STYLE (TAMPILAN VISUAL)
   =============================================================================
   StyleSheet dan properti style (flex, padding, backgroundColor, dll.) dari
   React Native (Expo pakai React Native di bawahnya). Dokumentasi resmi:
   • StyleSheet: https://reactnative.dev/docs/stylesheet
   • Daftar properti style (layout, warna, dll.): https://reactnative.dev/docs/style
   Di sana ada penjelasan create(), flatten(), dan semua properti (flex, margin,
   padding, border, backgroundColor, opacity, dll.).
   Singkatan yang dipakai di sini:
   - flex: 1 = ambil sisa ruang. flexDirection: 'row' = anak-anak sejajar
     horizontal. alignItems / justifyContent = atur posisi.
   - padding = jarak dalam, margin = jarak luar. borderRadius = sudut
     membulat. opacity = transparansi.
   ============================================================================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scroll: { flex: 1 },
  content: { paddingTop: 20, paddingBottom: 32 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  subtitle: { fontSize: 15, color: "#5c5c5c", marginBottom: 20 },
  btnTambah: {
    alignSelf: "flex-start",
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    minHeight: 48,
    justifyContent: "center",
  },
  btnTambahText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  btnPressed: { opacity: 0.85 },
  /* Kartu per mahasiswa (layout mobile) */
  cardList: { gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardLabel: { fontSize: 13, color: "#6c6c6c", flex: 0.4 },
  cardValue: { fontSize: 14, color: "#1a1a1a", flex: 0.6, textAlign: "right" },
  cardValueBold: { fontWeight: "600" },
  cardActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  headerRow: {
    backgroundColor: "#0a7ea4",
    borderBottomColor: "#086890",
    paddingVertical: 12,
  },
  headerText: { color: "#fff", fontWeight: "bold" },
  cell: { fontSize: 13, color: "#333" },
  cellNo: { width: 32, textAlign: "center" },
  cellNim: { width: 68 },
  cellNama: { flex: 1, minWidth: 80 },
  cellProdi: { width: 120 },
  cellAksi: { width: 120, flexDirection: "row", gap: 6 },
  btnAksi: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  btnHapus: { backgroundColor: "#c62828" },
  btnAksiText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  paginationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  btnPagination: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#0a7ea4",
    borderRadius: 10,
    minWidth: 100,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: { backgroundColor: "#ccc", opacity: 0.8 },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  btnTextDisabled: { color: "#666" },
  paginationInfo: { fontSize: 14, color: "#555", fontWeight: "500" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.52)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 12 },
  btnModal: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  btnBatal: { backgroundColor: "#e0e0e0" },
  btnBatalText: { color: "#333", fontWeight: "600" },
  btnSimpan: { backgroundColor: "#0a7ea4" },
  btnSimpanText: { color: "#fff", fontWeight: "600" },
});
