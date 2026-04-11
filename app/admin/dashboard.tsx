import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../firebaseConfig';

// Color Palette for Admin (More formal/serious)
const AdminColors = {
  header: '#2c3e50',
  background: '#f4f7f6',
  card: '#ffffff',
  approve: '#27ae60',
  reject: '#c0392b',
  text: '#34495e',
  muted: '#7f8c8d',
};

export default function AdminDashboard() {
  const [pendingBooks, setPendingBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPendingBooks = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "books"), where("status", "==", "pending"));
      const querySnapshot = await getDocs(q);
      const booksArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingBooks(booksArray);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not fetch pending books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBooks();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "books", id), { status: "approved" });
      Alert.alert("Approved", "Book is now visible to all students.");
      fetchPendingBooks(); // Refresh list
    } catch (e) {
      Alert.alert("Error", "Failed to approve.");
    }
  };

  const handleReject = async (id: string) => {
    Alert.alert("Delete Request", "Are you sure you want to reject and delete this listing?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          await deleteDoc(doc(db, "books", id));
          fetchPendingBooks();
      }}
    ]);
  };

  if (loading) return <ActivityIndicator size="large" style={{flex:1}} color={AdminColors.header} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moderation Queue</Text>
        <Text style={styles.countBadge}>{pendingBooks.length}</Text>
      </View>

      {pendingBooks.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>All caught up! No pending books. 🎉</Text>
        </View>
      ) : (
        <FlatList
          data={pendingBooks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Image source={{ uri: item.image || "https://th.bing.com/th/id/R.29b132aefa114eaa5d24ef8862d2f97d?rik=TISW01nJElDcsQ&riu=http%3a%2f%2fclipart-library.com%2fimages%2f8cEb8geni.jpg&ehk=rWHIunB4f3%2bXVNQLkWDex2EeFZJugkVcRyGKV4mzeBY%3d&risl=&pid=ImgRaw&r=0" }} style={styles.thumbnail} />
                <View style={styles.details}>
                  <Text style={styles.bookTitle}>{item.Title}</Text>
                  <Text style={styles.bookMeta}>By: {item.Student_Name || 'Unknown'}</Text>
                  <Text style={styles.bookPrice}>Price: ₹{item.price}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.btn, { backgroundColor: AdminColors.approve }]} 
                  onPress={() => handleApprove(item.id)}
                >
                  <Text style={styles.btnText}>Approve ✅</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.btn, { backgroundColor: AdminColors.reject }]} 
                  onPress={() => handleReject(item.id)}
                >
                  <Text style={styles.btnText}>Reject ❌</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AdminColors.background },
  headerBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: AdminColors.header,
    justifyContent: 'space-between'
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  backBtn: { color: '#fff', fontSize: 16 },
  countBadge: { backgroundColor: '#fff', paddingHorizontal: 10, borderRadius: 12, fontWeight: 'bold' },
  listPadding: { padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: AdminColors.muted, fontSize: 16 },
  card: { 
    backgroundColor: AdminColors.card, 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  infoRow: { flexDirection: 'row', marginBottom: 15 },
  thumbnail: { width: 60, height: 80, borderRadius: 6, backgroundColor: '#eee' },
  details: { marginLeft: 15, flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: AdminColors.text },
  bookMeta: { fontSize: 14, color: AdminColors.muted, marginTop: 4 },
  bookPrice: { fontSize: 14, color: AdminColors.approve, fontWeight: 'bold', marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 },
  btn: { flex: 0.48, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});