// import { useRouter } from 'expo-router';
// import { signOut } from 'firebase/auth';
// import React from 'react';
// import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { auth } from '../../firebaseConfig'; // Ensure this path is correct

// export default function ProfileScreen() {
//   const router = useRouter();

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       Alert.alert('Signed Out', 'You have been successfully signed out.');
//       router.replace('/'); // Redirect to the main welcome/auth page
//     } catch (error) {
//       console.error('Sign out error:', error);
//       Alert.alert('Error', 'Failed to sign out. Please try again.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>User Profile</Text>
//       <Text style={styles.infoText}>Welcome! You are currently signed in.</Text>
      
//       <TouchableOpacity style={styles.button} onPress={handleSignOut}>
//         <Text style={styles.buttonText}>Sign Out</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   infoText: {
//     fontSize: 16,
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   button: {
//     backgroundColor: '#dc3545', // A red color for a sign-out button
//     padding: 15,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth'; // Import getAuth for current user
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'; // Firestore functions
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig'; // Ensure this path is correct

// Define the Book type (must match Firestore fields)
type Book = {
    id: string;
    Title: string;
    price: string;
    image?: string;
    imageUrl?: string; // Use imageUrl if you implemented Firebase Storage
    // Add other fields you want to display in the list (e.g., branch, semester)
};

const auth = getAuth(); // Get the Firebase Auth instance

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
 console.log("My User ID is:", user.uid);
        try {
            const booksRef = collection(db, "books");
            // Query: Get books where the 'sellerUid' field matches the current user's UID
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

    // --- 2. DELETE LOGIC ---
    const deleteBook = async (bookId: string) => {
        try {
            // Delete the document from Firestore
            await deleteDoc(doc(db, "books", bookId));
            
            // Remove the book from the local state to update the UI immediately
            setUserBooks(prev => prev.filter(book => book.id !== bookId));
            Alert.alert("Success", "Book deleted successfully!");
        } catch (e) {
            console.error("Error deleting book: ", e);
            Alert.alert("Error", "Failed to delete book. Try again.");
        }
    };

    const confirmDelete = (bookId: string, title: string) => {
        Alert.alert(
            "Confirm Deletion",
            `Are you sure you want to delete the listing for "${title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteBook(bookId) },
            ]
        );
    };

    // --- SIGN OUT LOGIC (kept from original) ---
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            Alert.alert('Signed Out', 'You have been successfully signed out.');
            router.replace('/'); // Redirect to the authentication stack
        } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
    };

    // --- LOADING AND EMPTY STATES ---
    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    // --- RENDER ITEM ---
    const renderBookItem = ({ item }: { item: Book }) => (
        <View style={styles.bookItemContainer}>
            <TouchableOpacity 
                style={styles.bookInfo} 
                onPress={() => router.push(`/book/${item.id}`)} 
            >
                <Image
                    source={{ uri: item.imageUrl || item.image || "https://via.placeholder.com/100x100.png" }}
                    style={styles.bookImage}
                />
                <View style={styles.textDetails}>
                    <Text style={styles.bookTitle} numberOfLines={1}>{item.Title}</Text>
                    <Text style={styles.bookPrice}>
                        {item.price === 'Free' ? 'FREE' : `₹${item.price}`}
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={styles.actionRow}>
                <TouchableOpacity 
                    style={styles.editButton} 
                    onPress={() => router.push(`/edit-book/${item.id}`)} // Navigate to an edit screen
                >
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.deleteButton} 
                    onPress={() => confirmDelete(item.id, item.Title)} 
                >
                    <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.header}>My Profile</Text>
                <Text style={styles.userInfoText}>
                    Signed in as: {user?.displayName || user?.email || 'User'}
                </Text>
            </View>

            <Text style={styles.listingsHeader}>Your Active Listings ({userBooks.length})</Text>

            {userBooks.length === 0 ? (
                <Text style={styles.emptyText}>You haven't listed any books yet.</Text>
            ) : (
                <FlatList
                    data={userBooks}
                    keyExtractor={(item) => item.id}
                    renderItem={renderBookItem}
                    style={styles.list}
                />
            )}

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBox: {
        marginBottom: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 15,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    userInfoText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    listingsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 10,
    },
    list: {
        flex: 1,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
    // --- Listing Item Styles ---
    bookItemContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
    },
    bookInfo: {
        flexDirection: 'row',
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    bookImage: {
        width: 50,
        height: 50,
        borderRadius: 6,
        marginRight: 10,
    },
    textDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    bookPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: 'green',
    },
    // --- Action Button Styles ---
    actionRow: {
        flexDirection: 'row',
        alignItems: 'stretch', // Make buttons fill vertical space
    },
    editButton: {
        backgroundColor: '#ffc107', // Yellow for Edit
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: '#dc3545', // Red for Delete
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    actionText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 14,
    },
    deleteText: {
        color: '#fff',
    },
    // --- Sign Out Button ---
    signOutButton: {
        backgroundColor: '#6c757d', // Gray color for Sign Out
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    signOutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});