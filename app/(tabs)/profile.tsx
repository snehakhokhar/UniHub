// // --- PROFILE SCREEN (Stylish UI) ---
// // import { useRouter } from 'expo-router';
// // import { getAuth, signOut } from 'firebase/auth';
// // import { collection, deleteDoc, doc, getDocs, getDoc,query, where } from 'firebase/firestore';
// // import React, { useEffect, useState } from 'react';
// // import {
// //   ActivityIndicator,
// //   Alert,
// //   FlatList,
// //   Image,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from 'react-native';
// // import { db } from '../../firebaseConfig';

// // // --- COLOR PALETTE ---
// // const Colors = {

// //   primary: '#3c7bbeff',
// //   background: '#f8f9fa',
// //   card: '#ffffff',
// //   success: '#42b883',
// //   warning: '#f5b942',
// //   danger: '#e74c3c',
// //   textDark: '#2c3e50',
// //   textMuted: '#7f8c8d',
// //   border: '#e0e0e0',

// // };

// // // --- TYPE ---
// // type Book = {
// //   id: string;
// //   Title: string;
// //   price: string;
// //   image?: string;
// //   imageUrl?: string;
// // };

// // const auth = getAuth();

// // // --- ALERT COMPONENT ---
// // const CustomAlertBanner = ({ visible, message, type, onClose }: any) => {
// //   if (!visible) return null;
// //   let backgroundColor;
// //   let icon;
// //   if (type === 'Error') {
// //     backgroundColor = Colors.danger;
// //     icon = '❌';
// //   } else if (type === 'Success') {
// //     backgroundColor = Colors.success;
// //     icon = '✅';
// //   } else {
// //     backgroundColor = Colors.primary;
// //     icon = '👋';
// //   }
// //   return (
// //     <View style={[alertStyles.banner, { backgroundColor }]}>
// //       <Text style={alertStyles.text}>
// //         {icon} {message}
// //       </Text>
// //       <TouchableOpacity onPress={onClose}>
// //         <Text style={alertStyles.closeText}>✕</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // // --- MAIN COMPONENT ---
// // export default function ProfileScreen() {
// //   const router = useRouter();
// //   const [userBooks, setUserBooks] = useState<Book[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [isAdmin, setIsAdmin] = useState(false);
// //   const [alert, setAlert] = useState({
// //     visible: false,
// //     message: '',
// //     type: 'Success',
// //   });

// //   const user = auth.currentUser;

// //   const showAlert = (type: any, message: string) => {
// //     setAlert({ visible: true, message, type });
// //     setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 2500);
// //   };

// //   const fetchUserBooks = async () => {
// //     if (!user) return;
// //     try {
// //       const q = query(collection(db, 'books'), where('sellerUid', '==', user.uid));
// //       const querySnapshot = await getDocs(q);
// //       const booksArray = querySnapshot.docs.map(
// //         (d) => ({ id: d.id, ...d.data() } as Book)
// //       );
// //       setUserBooks(booksArray);
// //     } catch (e) {
// //       showAlert('Error', 'Failed to load your listings.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUserBooks();
// //     const checkAdminStatus = async () => {
// //       if (user) {
// //         try {
// //           // We look into the 'users' collection for the document named with your UID
// //           const userDocRef = doc(db, 'users', user.uid);
// //           const userDocSnap = await getDoc(userDocRef);

// //           if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
// //             setIsAdmin(true);
// //           }
// //         } catch (error) {
// //           console.error("Error fetching user role:", error);
// //         }
// //       }
// //     };
// //     checkAdminStatus();
// //   }, [user?.uid]);

// //   const deleteBook = async (bookId: string) => {
// //     try {
// //       await deleteDoc(doc(db, 'books', bookId));
// //       setUserBooks((prev) => prev.filter((b) => b.id !== bookId));
// //       showAlert('Success', 'Book deleted successfully!');
// //     } catch {
// //       showAlert('Error', 'Failed to delete book.');
// //     }
// //   };

// //   const handleSignOut = async () => {
// //     try {
// //       await signOut(auth);
// //       showAlert('Signed Out', 'You have been signed out.');
// //       setTimeout(() => router.replace('/'), 600);
// //     } catch {
// //       showAlert('Error', 'Sign-out failed.');
// //     }
// //   };

// //   if (loading)
// //     return (
// //       <View style={[styles.container, styles.center]}>
// //         <ActivityIndicator size="large" color={Colors.primary} />
// //       </View>
// //     );

// //   const renderBookItem = ({ item }: { item: Book }) => (
// //     <View style={styles.card}>
// //       <TouchableOpacity
// //         style={styles.bookRow}
// //         onPress={() => router.push(`/book/${item.id}`)}
// //       >
// //         <Image
// //           source={{
// //             uri:
// //               item.imageUrl ||
// //               item.image||
// //               "https://th.bing.com/th/id/R.29b132aefa114eaa5d24ef8862d2f97d?rik=TISW01nJElDcsQ&riu=http%3a%2f%2fclipart-library.com%2fimages%2f8cEb8geni.jpg&ehk=rWHIunB4f3%2bXVNQLkWDex2EeFZJugkVcRyGKV4mzeBY%3d&risl=&pid=ImgRaw&r=0",
// //           }}
// //           style={styles.bookImage}
// //         />
// //         <View style={styles.bookDetails}>
// //           <Text style={styles.bookTitle}>{item.Title}</Text>
// //           <Text style={styles.bookPrice}>
// //             {item.price === 'Free' ? (
// //               <Text style={styles.freeText}>FREE</Text>
// //             ) : (
// //               `₹${item.price}`
// //             )}
// //           </Text>
// //         </View>
// //       </TouchableOpacity>

// //       <View style={styles.actionContainer}>
// //         <TouchableOpacity
// //           style={[styles.actionButton, { backgroundColor: Colors.warning }]}
// //           onPress={() => router.push(`/edit-book/${item.id}`)}
// //         >
// //           <Text style={styles.actionText}>Edit</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity
// //           style={[styles.actionButton, { backgroundColor: Colors.danger }]}
// //           onPress={() => deleteBook(item.id)}
// //         >
// //           <Text style={[styles.actionText, { color: '#fff' }]}>Delete</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );

// //   return (
// //     <>
// //       <CustomAlertBanner
// //         visible={alert.visible}
// //         message={alert.message}
// //         type={alert.type}
// //         onClose={() => setAlert((p) => ({ ...p, visible: false }))}
// //       />

// //       <View style={styles.container}>
// //         <View style={styles.profileHeader}>
// //           <View style={styles.avatar}>
// //             <Text style={styles.avatarText}>
// //               {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
// //             </Text>
// //           </View>
// //           <Text style={styles.username}>{user?.displayName || 'User'}</Text>
// //           <Text style={styles.email}>{user?.email}</Text>
// //         </View>

// //         <Text style={styles.sectionTitle}>
// //           Your Listings ({userBooks.length})
// //         </Text>

// //         {userBooks.length === 0 ? (
// //           <View style={styles.emptyState}>
// //             <Text style={styles.emptyText}>No books listed yet 📚</Text>
// //           </View>
// //         ) : (
// //           <FlatList
// //             data={userBooks}
// //             keyExtractor={(item) => item.id}
// //             renderItem={renderBookItem}
// //             contentContainerStyle={styles.list}
// //           />
// //         )}
// // {isAdmin && (
// //   <TouchableOpacity 
// //     style={styles.adminButton} 
// //     onPress={() => router.push('/admin/dashboard')}
// //   >
// //     <Text style={styles.adminButtonText}>🛡️ Open Admin Panel</Text>
// //   </TouchableOpacity>
// // )}
// //         <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
// //           <Text style={styles.signOutText}>Sign Out</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </>
// //   );
// // }



// --- PROFILE SCREEN (Corrected UI) ---
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../firebaseConfig';

// --- COLOR PALETTE ---
const Colors = {
  primary: '#3c7bbeff',
  background: '#f8f9fa',
  card: '#ffffff',
  success: '#42b883',
  warning: '#f5b942',
  danger: '#e74c3c',
  textDark: '#2c3e50',
  textMuted: '#7f8c8d',
  border: '#e0e0e0',
  pending: '#f39c12',
};

// --- TYPE ---
type Book = {
  id: string;
  Title: string;
  price: string;
  image?: string;
  imageUrl?: string;
  status?: string;
};

const auth = getAuth();

// --- ALERT COMPONENT ---
const CustomAlertBanner = ({ visible, message, type, onClose }: any) => {
  if (!visible) return null;
  let backgroundColor = type === 'Error' ? Colors.danger : type === 'Success' ? Colors.success : Colors.primary;
  let icon = type === 'Error' ? '❌' : type === 'Success' ? '✅' : '👋';

  return (
    <View style={[alertStyles.banner, { backgroundColor }]}>
      <Text style={alertStyles.text}>{icon} {message}</Text>
      <TouchableOpacity onPress={onClose}>
        <Text style={alertStyles.closeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- MAIN COMPONENT ---
export default function ProfileScreen() {
  const router = useRouter();
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: '', type: 'Success' });

  const user = auth.currentUser;

  const showAlert = (type: any, message: string) => {
    setAlert({ visible: true, message, type });
    setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 2500);
  };

  const fetchUserBooks = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'books'), where('sellerUid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const booksArray = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Book));
      setUserBooks(booksArray);
    } catch (e) {
      showAlert('Error', 'Failed to load your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBooks();
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };
    checkAdminStatus();
  }, [user?.uid]);

  const deleteBook = async (bookId: string) => {
    try {
      await deleteDoc(doc(db, 'books', bookId));
      setUserBooks((prev) => prev.filter((b) => b.id !== bookId));
      showAlert('Success', 'Book deleted successfully!');
    } catch {
      showAlert('Error', 'Failed to delete book.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch {
      showAlert('Error', 'Sign-out failed.');
    }
  };
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return { color: Colors.success, bg: '#e8f6f0' };
      case 'rejected': return { color: Colors.danger, bg: '#fdecea' };
      default: return { color: Colors.pending, bg: '#fef5e7' };
    }
  };

  if (loading) return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomAlertBanner 
        visible={alert.visible} 
        message={alert.message} 
        type={alert.type} 
        onClose={() => setAlert(p => ({ ...p, visible: false }))} 
      />
      
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.displayName?.charAt(0)?.toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.username}>{user?.displayName || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <Text style={styles.sectionTitle}>Your Listings ({userBooks.length})</Text>

      <FlatList
        data={userBooks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No books listed yet 📚</Text>
          </View>
        }
        renderItem={({ item }) => {
  const statusConfig = getStatusStyle(item.status || 'pending');
  return (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.bookRow} 
        onPress={() => router.push(`/book/${item.id}`)}
      >
        <Image 
          source={{ uri: item.imageUrl || item.image || "https://th.bing.com/th/id/R.29b132aefa114eaa5d24ef8862d2f97d?rik=TISW01nJElDcsQ&riu=http%3a%2f%2fclipart-library.com%2fimages%2f8cEb8geni.jpg&ehk=rWHIunB4f3%2bXVNQLkWDex2EeFZJugkVcRyGKV4mzeBY%3d&risl=&pid=ImgRaw&r=0" }} 
          style={styles.bookImage} 
        />
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.Title}</Text>
          
          <Text style={styles.bookPrice}>
            {item.price === 'Free' ? (
              <Text style={styles.freeText}>FREE</Text>
            ) : (
              `₹${item.price}`
            )}
          </Text>

          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {item.status ? item.status.toUpperCase() : 'PENDING'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: Colors.warning }]} 
          onPress={() => router.push(`/edit-book/${item.id}`)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: Colors.danger }]} 
          onPress={() => deleteBook(item.id)}
        >
          <Text style={[styles.actionText, { color: '#fff' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}}
      />

      {isAdmin && (
        <TouchableOpacity style={styles.adminButton} onPress={() => router.push('/admin/dashboard')}>
          <Text style={styles.adminButtonText}>🛡️ Open Admin Panel</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- STYLES ---
const alertStyles = StyleSheet.create({
  banner: { 
    position: 'absolute', top: 0, left: 0, right: 0, 
    padding: 12, margin: 10, borderRadius: 10, 
    flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'space-between', zIndex: 100 
  },
  text: { color: '#fff', fontWeight: '600', fontSize: 14 },
  closeText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileHeader: { 
    alignItems: 'center', marginBottom: 20, 
    backgroundColor: Colors.card, paddingVertical: 25, 
    borderRadius: 15, elevation: 3 
  },
  avatar: { 
    width: 80, height: 80, borderRadius: 40, 
    backgroundColor: Colors.primary, justifyContent: 'center', 
    alignItems: 'center', marginBottom: 10 
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  username: { fontSize: 22, fontWeight: '700', color: Colors.textDark },
  email: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginVertical: 10, color: Colors.textDark },
  card: { backgroundColor: Colors.card, borderRadius: 15, padding: 12, marginBottom: 12, elevation: 2 },
  bookRow: { flexDirection: 'row', alignItems: 'center' },
  bookImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  bookDetails: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: '600', color: Colors.textDark },
  bookPrice: { fontSize: 15, fontWeight: '700', color: Colors.success, marginTop: 4 },
  freeText: { color: Colors.primary },
  actionContainer: { flexDirection: 'row', marginTop: 12, justifyContent: 'flex-end' },
  actionButton: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8, marginLeft: 8 },
  actionText: { fontWeight: '600', color: Colors.textDark },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: Colors.textMuted, fontSize: 16 },
  list: { paddingBottom: 20 },
  signOutButton: { backgroundColor: Colors.danger, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  signOutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  adminButton: { 
    backgroundColor: Colors.textDark, padding: 16, 
    borderRadius: 12, marginBottom: 10, 
    alignItems: 'center', justifyContent: 'center' 
  },
  adminButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800' },
});