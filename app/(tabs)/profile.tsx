import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig'; // Ensure this path is correct

// Define the Book type (must match Firestore fields)
type Book = {
    id: string;
    Title: string;
    price: string;
    image?: string;
    imageUrl?: string;
};

const auth = getAuth(); // Get the Firebase Auth instance

// --- COLOR PALETTE DEFINITION ---
const Colors = {
    primary: '#3c7bbeff',      // Modern Blue for primary text/headers
    background: '#f8f9fa',   // Light gray/off-white background
    card: '#ffffff',         // Pure white for cards
    success: '#428452ff',      // Green for price/success
    warning: '#e1b01fe4',      // Orange/Yellow for Edit
    danger: '#e51e32e1',       // Red for Delete/Sign Out
    textDark: '#333333',     // Main text
    textMuted: '#6c757d',    // Secondary text
    border: '#e9ecef',       // Light border
};

export default function ProfileScreen() {
    const router = useRouter();
    const [userBooks, setUserBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;

    // --- 1. FETCH USER'S LISTINGS ---
    const fetchUserBooks = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const booksRef = collection(db, "books");
            const q = query(booksRef, where("sellerUid", "==", user.uid));
            
            const querySnapshot = await getDocs(q);
            const booksArray = querySnapshot.docs.map(d => ({
                id: d.id,
                ...d.data(),
            } as Book));
            
            setUserBooks(booksArray);
        } catch (e) {
            console.error("Error fetching user documents: ", e);
            Alert.alert("Error", "Failed to load your listings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserBooks();
    }, [user?.uid]);

    // --- 2. DELETE LOGIC (DIRECT DELETION) ---
    const deleteBook = async (bookId: string) => { 
        console.log(`Attempting to delete book with ID: ${bookId}`);
        try {
            await deleteDoc(doc(db, "books", bookId));
            setUserBooks(prev => prev.filter(book => book.id !== bookId));
            Alert.alert("Success", "Book deleted successfully!");
        } catch (e) {
            console.error("Error deleting book: ", e);
            Alert.alert("Error", "Failed to delete book. Try again.");
        }
    };

    // --- SIGN OUT LOGIC ---
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            Alert.alert('Signed Out', 'You have been successfully signed out.');
            router.replace('/'); 
        } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
    };

    // --- LOADING AND EMPTY STATES ---
    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }
    
    const renderBookItem = ({ item }: { item: Book }) => (
        // The entire card container is not a TouchableOpacity to prevent accidental navigation
        <View style={styles.bookItemContainer}>
   
            <TouchableOpacity 
                style={styles.bookInfo} 
                onPress={() => router.push(`/book/${item.id}`)} 
                activeOpacity={0.7}
            >
                <Image
                    source={{ uri: item.imageUrl || item.image || "https://via.placeholder.com/80x80.png" }}
                    style={styles.bookImage}
                />
                <View style={styles.textDetails}>
                    <Text style={styles.bookTitle} numberOfLines={1}>{item.Title}</Text>
                    <Text style={styles.bookPrice}>
                        {item.price === 'Free' ? <Text style={styles.freePriceText}>FREE</Text> : `₹${item.price}`}
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={styles.actionRow}>
                <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]} 
                    onPress={(e) => { 
                        // e.stopPropagation(); // Uncomment if Edit has propagation issues
                        router.push(`/edit-book/${item.id}`);
                    }} 
                >
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]} 
                    onPress={(e) => { 
                        e.stopPropagation(); 
                        deleteBook(item.id); // Direct deletion
                    }} 
                >
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const emptyState = (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't listed any books yet.</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.header}>{user?.displayName || 'User'}</Text>
                <Text style={styles.userInfoText}>
                    Signed in as: { user?.email || 'User'}
                </Text>
            </View>

            <Text style={styles.listingsHeader}>Your Active Listings ({userBooks.length})</Text>

            {userBooks.length === 0 ? (
                emptyState
            ) : (
                <FlatList
                    data={userBooks}
                    keyExtractor={(item) => item.id}
                    renderItem={renderBookItem}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {/* Sign Out Button */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    // --- Header Styles ---
    headerBox: {
        marginBottom: 25,
        alignItems: 'center',
        paddingBottom: 10,
    },
    header: {
        fontSize: 30,
        fontWeight: '700',
        color: Colors.textDark,
        marginBottom: 4,
    },
    userInfoText: {
        fontSize: 14,
        color: Colors.textMuted,
        fontStyle: 'italic',
    },
    listingsHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.textDark, 
        marginBottom: 12,
        paddingLeft: 5,
    },
    listContent: {
        paddingBottom: 20,
    },
    // --- Listing Item Styles (Card Look) ---
    bookItemContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    bookInfo: {
        flexDirection: 'row',
        flex: 1,
        padding: 12,
        alignItems: 'center',
    },
    bookImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 15,
        resizeMode: 'cover',
    },
    textDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    bookTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.textDark,
    },
    bookPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.success,
        marginTop: 4,
    },
    freePriceText: {
        color: Colors.primary,
    },
    // --- Action Button Styles ---
    actionRow: {
        
        flexDirection: 'row',
        alignItems: 'stretch',
        borderLeftWidth: 1,
        borderLeftColor: Colors.border,
        paddingVertical: 8,
    },
    actionButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin:25,
    },
    editButton: {
        backgroundColor: Colors.warning,
        borderRadius: 12,
        
    },
    deleteButton: {
        
        borderRadius: 12,
        backgroundColor: Colors.danger,
    },
    actionText: {
        
        textAlign: 'center',
        color: Colors.textDark, // Should be dark on yellow
        fontWeight: '600',
        fontSize: 14,
        margin:10,
    },
    deleteText: {
        
        textAlign: 'center',
        color: Colors.card, // White text on red
        fontWeight: '600',
        fontSize: 14,
    },
    // --- Empty State ---
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.textMuted,
        marginTop: 10,
        fontSize: 16,
    },
    // --- Sign Out Button ---
    signOutButton: {
        backgroundColor: Colors.danger,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    signOutButtonText: {
        color: Colors.card,
        fontSize: 16,
        fontWeight: '700',
    },
});

// import { useRouter } from 'expo-router';
// import { getAuth, signOut } from 'firebase/auth';
// import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// // @ts-ignore - Assuming you might use Expo's vector icons like Feather or MaterialCommunityIcons
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 
// import { db } from '../../firebaseConfig'; 

// // Define the Book type (must match Firestore fields)
// type Book = {
//     id: string;
//     Title: string;
//     price: string;
//     image?: string;
//     imageUrl?: string;
//     views?: number; // New: To display views (assuming you add this to Firestore)
// };

// const auth = getAuth();

// export default function ProfileScreen() {
//     const router = useRouter();
//     const [userBooks, setUserBooks] = useState<Book[]>([]);
//     const [loading, setLoading] = useState(true);
//     const user = auth.currentUser;

//     const fetchUserBooks = async () => {
//         if (!user) {
//             setLoading(false);
//             return;
//         }
//         try {
//             const booksRef = collection(db, "books");
//             const q = query(booksRef, where("sellerUid", "==", user.uid));
            
//             const querySnapshot = await getDocs(q);
//             const booksArray = querySnapshot.docs.map(d => ({
//                 id: d.id,
//                 // Add default views for mock-up if not in DB
//                 views: Math.floor(Math.random() * 50) + 1, 
//                 ...d.data(),
//             } as Book));
            
//             setUserBooks(booksArray);
//         } catch (e) {
//             console.error("Error fetching user documents: ", e);
//             Alert.alert("Error", "Failed to load your listings.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUserBooks();
//     }, [user?.uid]);

//     // --- DELETE LOGIC --- (Kept the same, but using the new render function)
//     const deleteBook = async (bookId: string) => { /* ... (delete logic) ... */ };
//     const confirmDelete = (bookId: string, title: string) => {
//         Alert.alert(
//             "Confirm Deletion",
//             `Are you sure you want to delete the listing for "${title}"?`,
//             [
//                 { text: "Cancel", style: "cancel" },
//                 { text: "Delete", style: "destructive", onPress: () => deleteBook(bookId) },
//             ]
//         );
//     };

//     // --- SIGN OUT LOGIC ---
//     const handleSignOut = async () => {
//         try {
//             await signOut(auth);
//             Alert.alert('Signed Out', 'You have been successfully signed out.');
//             router.replace('/'); 
//         } catch (error) {
//             console.error('Sign out error:', error);
//             Alert.alert('Error', 'Failed to sign out. Please try again.');
//         }
//     };
    
//     // --- New: Navigate to a dedicated "Post" screen ---
//     const handlePostNew = () => {
//         router.push('/post-new-listing'); // Assuming you have a route for creating new listings
//     };

//     // --- RENDER ITEM: Now a beautiful and efficient Card ---
//     const renderBookItem = ({ item }: { item: Book }) => (
//         <TouchableOpacity 
//             style={styles.bookItemCard}
//             onPress={() => router.push(`/book/${item.id}`)} // Navigate to view details
//         >
//             {/* 1. Image and Info Block */}
//             <View style={styles.bookInfoBlock}>
//                 <Image
//                     source={{ uri: item.imageUrl || item.image || "https://via.placeholder.com/80x80.png" }}
//                     style={styles.bookImage}
//                 />
//                 <View style={styles.textDetails}>
//                     <Text style={styles.bookTitle} numberOfLines={1}>{item.Title}</Text>
//                     <Text style={styles.bookPrice}>
//                         {item.price === 'Free' ? <Text style={styles.freePrice}>FREE</Text> : `₹${item.price}`}
//                     </Text>
//                 </View>
//             </View>

//             {/* 2. Stats/Efficiency Block (New) */}
//             <View style={styles.statsBlock}>
//                 {/* Views are a new efficiency metric */}
//                 <View style={styles.statItem}>
//                     <Feather name="eye" size={14} color="#007BFF" />
//                     <Text style={styles.statText}>{item.views || 0}</Text>
//                 </View>
//                 <View style={styles.statItem}>
//                     <Feather name="clock" size={14} color="#6c757d" />
//                     <Text style={styles.statText}>Active</Text> {/* Hardcoded for simplicity */}
//                 </View>
//             </View>

//             {/* 3. Action Block with Icons for a cleaner look */}
//             <View style={styles.actionIcons}>
//                 <TouchableOpacity 
//                     style={styles.actionIconBtn} 
//                     onPress={(e) => {
//                         e.stopPropagation(); // Prevent card onPress from firing
//                         router.push(`/edit-book/${item.id}`)
//                     }}
//                 >
//                     <Feather name="edit-3" size={20} color="#333" />
//                 </TouchableOpacity>
//                 <TouchableOpacity 
//                     style={styles.actionIconBtn} 
//                     onPress={(e) => {
//                         e.stopPropagation(); // Prevent card onPress from firing
//                         confirmDelete(item.id, item.Title)
//                     }} 
//                 >
//                     <Feather name="trash-2" size={20} color="#dc3545" />
//                 </TouchableOpacity>
//             </View>
//         </TouchableOpacity>
//     );

//     // --- LOADING AND EMPTY STATES ---
//     if (loading) {
//         return (
//             <View style={[styles.container, styles.center]}>
//                 <ActivityIndicator size="large" color="#007BFF" />
//             </View>
//         );
//     }
    
//     const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

//     return (
//         <View style={styles.container}>
//             {/* 1. Profile Summary Card (More Beautiful) */}
//             <View style={styles.profileSummaryCard}>
//                 <View style={styles.profileAvatar}>
//                     <Text style={styles.avatarText}>{userName[0].toUpperCase()}</Text>
//                 </View>
//                 <View style={styles.profileTextContainer}>
//                     <Text style={styles.profileName}>
// </Text>
//                     <Text style={styles.profileEmail}>Signed in as: {user?.email || 'N/A'}</Text>
//                 </View>
//                 <TouchableOpacity 
//                     style={styles.editProfileBtn} 
//                     onPress={() => Alert.alert("Feature", "Implement Edit Profile Screen")}
//                 >
//                     <Feather name="settings" size={20} color="#007BFF" />
//                 </TouchableOpacity>
//             </View>

//             {/* 2. Main Content and Listings */}
//             <View style={styles.listingsSection}>
//                 <View style={styles.listingsHeaderRow}>
//                     <Text style={styles.listingsHeader}>Your Active Listings ({userBooks.length})</Text>
//                     <TouchableOpacity style={styles.postNewButton} onPress={handlePostNew}>
//                         <Feather name="plus-circle" size={20} color="#fff" />
//                         <Text style={styles.postNewButtonText}>Post New</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {userBooks.length === 0 ? (
//                     <View style={styles.emptyContainer}>
//                         <MaterialCommunityIcons name="book-open-outline" size={50} color="#ccc" />
//                         <Text style={styles.emptyText}>You haven't listed any books yet. Start selling!</Text>
//                         <TouchableOpacity style={styles.postNewButtonLarge} onPress={handlePostNew}>
//                             <Text style={styles.signOutButtonText}>Post Your First Book</Text>
//                         </TouchableOpacity>
//                     </View>
//                 ) : (
//                     <FlatList
//                         data={userBooks}
//                         keyExtractor={(item) => item.id}
//                         renderItem={renderBookItem}
//                         contentContainerStyle={styles.listContent}
//                     />
//                 )}
//             </View>

//             {/* 3. Sign Out Button (Moved out of sticky footer) */}
//             <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
//                 <Feather name="log-out" size={20} color="#fff" style={{ marginRight: 8 }} />
//                 <Text style={styles.signOutButtonText}>Sign Out</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f9f9f9', // Lighter background
//         padding: 20,
//     },
//     center: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
    
//     // --- 1. Profile Summary Card Styles ---
//     profileSummaryCard: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         padding: 15,
//         borderRadius: 12,
//         marginBottom: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     profileAvatar: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: '#007BFF', // Primary blue
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 15,
//     },
//     avatarText: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#fff',
//     },
//     profileTextContainer: {
//         flex: 1,
//     },
//     profileName: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     profileEmail: {
//         fontSize: 12,
//         color: '#6c757d',
//         marginTop: 2,
//     },
//     editProfileBtn: {
//         padding: 8,
//     },

//     // --- 2. Listings Section Styles ---
//     listingsSection: {
//         flex: 1,
//     },
//     listingsHeaderRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     listingsHeader: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     postNewButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#007BFF',
//         paddingVertical: 8,
//         paddingHorizontal: 12,
//         borderRadius: 20,
//     },
//     postNewButtonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//         marginLeft: 5,
//     },

//     // --- Listing Item Card Styles (Refined) ---
//     listContent: {
//         paddingBottom: 20, // Add padding for the last item
//     },
//     bookItemCard: {
//         flexDirection: 'row',
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         marginBottom: 10,
//         padding: 10,
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#eee',
//         justifyContent: 'space-between',
//     },
//     bookInfoBlock: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         flex: 2.5,
//     },
//     bookImage: {
//         width: 60,
//         height: 60,
//         borderRadius: 8,
//         marginRight: 10,
//         resizeMode: 'cover',
//     },
//     textDetails: {
//         justifyContent: 'center',
//         flex: 1,
//     },
//     bookTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//     },
//     bookPrice: {
//         fontSize: 14,
//         fontWeight: '700',
//         color: '#28a745', // Stronger green
//         marginTop: 4,
//     },
//     freePrice: {
//         color: '#17a2b8', // Teal for FREE
//     },
    
//     // --- Stats Block (Efficiency) ---
//     statsBlock: {
//         flexDirection: 'column',
//         alignItems: 'flex-start',
//         paddingHorizontal: 10,
//         borderLeftWidth: 1,
//         borderLeftColor: '#f0f0f0',
//         flex: 1,
//     },
//     statItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 5,
//     },
//     statText: {
//         fontSize: 12,
//         color: '#6c757d',
//         marginLeft: 4,
//         fontWeight: '500',
//     },

//     // --- Action Block (Clean Icons) ---
//     actionIcons: {
//         flexDirection: 'row',
//         marginLeft: 10,
//         alignItems: 'center',
//     },
//     actionIconBtn: {
//         padding: 8,
//         marginLeft: 5,
//     },
    
//     // --- Empty State ---
//     emptyContainer: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 40,
//         marginTop: 50,
//     },
//     emptyText: {
//         textAlign: 'center',
//         color: '#6c757d',
//         marginTop: 15,
//         fontSize: 16,
//     },
//     postNewButtonLarge: {
//         backgroundColor: '#28a745', // Different color for main CTA
//         padding: 15,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginTop: 20,
//     },

//     // --- Sign Out Button ---
//     signOutButton: {
//         backgroundColor: '#dc3545', // Red for Sign Out (High-impact action)
//         flexDirection: 'row',
//         padding: 15,
//         borderRadius: 10,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 20,
//     },
//     signOutButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//     },
// });