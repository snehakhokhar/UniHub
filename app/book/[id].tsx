// // import { useLocalSearchParams } from "expo-router";
// // import { View, Text, StyleSheet } from "react-native";

// // export default function BookDetails() {
// //   const { id } = useLocalSearchParams();

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Book Details</Text>
// //       <Text>Book ID: {id}</Text>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, justifyContent: "center", alignItems: "center" },
// //   title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
// // });
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Linking } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../firebaseConfig'; // Adjust the path to firebaseConfig as needed

// // Define the Book type (must match Firestore fields)
// type Book = {
//   id: string;
//   Title: string; 
//   author: string;
//   branch: string;
//   semester: string | number;
//   price: string;
//   image?: string;
//   contact: string;
//   Student_Name?: string;
// };

// export default function BookDetailScreen() {
//   const { id } = useLocalSearchParams(); // Get the book ID from the URL
//   const [book, setBook] = useState<Book | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id || typeof id !== 'string') return;

//     const fetchBook = async () => {
//       try {
//         const docRef = doc(db, 'books', id); // Reference the document by ID
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setBook({
//             id: docSnap.id,
//             Title: data.Title ?? '',
//             author: data.author ?? '',
//             branch: data.branch ?? '',
//             semester: data.semester ?? '',
//             price: data.price ?? '',
//             image: data.image ?? '',
//             contact: data.contact ?? '',
//             Student_Name: data.Student_Name ?? '',
//           } as Book);
//         } else {
//           Alert.alert("Not Found", "This book does not exist.");
//         }
//       } catch (e) {
//         console.error("Error fetching book:", e);
//         Alert.alert("Error", "Could not load book details.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBook();
//   }, [id]);

//   const handleCall = () => {
//     if (book?.contact) {
//       Linking.openURL(`tel:${book.contact}`);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading details...</Text>
//       </View>
//     );
//   }

//   if (!book) {
//     return (
//       <View style={styles.container}>
//         <Text>Book not found.</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <Image
//         source={{ uri: book.image && book.image.trim() !== "" ? book.image : "https://via.placeholder.com/400x300.png" }}
//         style={styles.image}
//       />
      
//       <View style={styles.detailsBox}>
//         <Text style={styles.title}>{book.Title}</Text>
//        <Text style={[styles.price, book.price === 'Free' && styles.priceFreeDetail]}>
//           {book.price === 'Free' ? 'FREE' : `₹${book.price}`}
//         </Text>


//         <View style={styles.separator} />
        
//         <Text style={styles.label}>Author</Text>
//         <Text style={styles.value}>{book.author}</Text>
        
        
//         <Text style={styles.label}>Branch / Semester</Text>
//         <Text style={styles.value}>{book.branch} / Semester {book.semester}</Text>

//         <Text style={styles.label}>Seller</Text>
//         <Text style={styles.value}>{book.Student_Name}</Text>

//         <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
//           <Text style={styles.contactButtonText}>📞 Call Seller</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: {
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   container: { 
//     flex: 1, 
//     justifyContent: "center", 
//     alignItems: "center", 
//     backgroundColor: '#fff' 
//   },
//   image: {
//     width: '100%',
//     height: 300,
//     borderRadius: 12,
//     marginBottom: 20,
//     backgroundColor: '#eee',
//   },
//   detailsBox: {
//     padding: 15,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 12,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   price: {
//     fontSize: 22,
//     color: 'green',
//     fontWeight: '700',
//     marginBottom: 15,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: '#ddd',
//     marginVertical: 15,
//   },
//   label: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 10,
//   },
//   value: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   contactButton: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 25,
//   },
//   priceFreeDetail: {
//     color: '#007AFF', // Blue color for "FREE"
//     fontWeight: '900', // Extra bold for emphasis
//     fontSize: 24, // Slightly larger on the detail screen
//   },
//   contactButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig'; // Adjust path as needed

// Define a safe Book type (using field names confirmed in your home.tsx)
type Book = {
    Title: string; 
    author: string;
    branch: string;
    semester: string | number;
    price: string;
    image?: string;
    contact: string;
    Student_Name?: string; 
    description: string;
};

export default function BookDetailScreen() {
const { id } = useLocalSearchParams();
const [book, setBook] = useState<Book | null>(null);
const [loading, setLoading] = useState(true);
    
useEffect(() => {
if (id) {
const fetchBook = async () => {
 try {
const docRef = doc(db, "books", id as string);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
 setBook(docSnap.data() as Book);
 } else {
    Alert.alert("Error", "Book not found.");
  }
 } catch (e) {
    console.error("Error fetching document: ", e);
    Alert.alert("Error", "Failed to load book details.");
  } finally {
    setLoading(false);
  }};
   fetchBook(); }
    }, [id]);

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

if (loading) {
   return (
     <View style={[styles.container, styles.loadingContainer]}>
     <ActivityIndicator size="large" color="#007BFF" />
    </View>
);
}

    if (!book) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Book details are unavailable.</Text>
            </View>
        );
    }

return (
<ScrollView style={styles.container}>
 <View style={styles.imageContainer}>
 <Image
source={{ uri: book.image && book.image.trim() !== "" ? book.image : "https://via.placeholder.com/400x300.png" }}
style={styles.bookImage}
/>
</View>

<View style={styles.detailsBox}>
<View style={styles.row}>
<Text style={styles.title}>{book.Title}</Text>
<Text style={[styles.price, 
book.price === 'Free' && styles.priceFreeDetail
]}
>
 {book.price === 'Free' ? 'FREE' : `₹${book.price}`}
</Text>
</View>

<View style={styles.separator} />
<View style={styles.infoGroup}>
<Text style={styles.label}>Author</Text>
<Text style={styles.value}>{book.author}</Text>
</View>
                
        
<View style={styles.infoGroup}>
    <Text style={styles.label}>Branch / Semester</Text>
    <Text style={styles.value}>
        {book.branch} / Semester {book.semester}
    </Text>
</View>

<View style={styles.descriptionContainer}>
    <Text style={styles.descriptionLabel}>Book Condition / Notes</Text>
    <Text style={styles.descriptionText}>{book.description}</Text>
</View>
<View style={styles.infoGroup}>
    <Text style={styles.label}>Seller</Text>
    <Text style={styles.value}>{book.Student_Name || 'Not specified'}</Text>
</View>

</View>

            <TouchableOpacity 
                style={styles.contactButton} 
                onPress={() => handleCall(book.contact)}
            >
                <Text style={styles.contactButtonText}>📞 Contact Seller ({book.contact})</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#ff4444',
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    bookImage: {
        width: '95%',
        height: 300,
        borderRadius: 10,
        resizeMode: 'contain',
        backgroundColor: '#fff',
    },
    detailsBox: {
        padding: 20,
    },
    // Styles for the grouped structure
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoGroup: {
        marginBottom: 10,
    },
    // End Styles for the grouped structure
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flexShrink: 1, // Allows text to wrap if title is long
        marginRight: 10,
        color: '#333',
    },
    price: {
        fontSize: 22,
        fontWeight: '700',
        color: 'green',
    },
    priceFreeDetail: {
        color: '#007AFF',
        fontSize: 24,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    label: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    contactButton: {
        backgroundColor: '#28a745',
        padding: 18,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    descriptionContainer: {
        // Adds space above and below the description block
        paddingHorizontal: 20, 
        paddingVertical: 15,
        backgroundColor: '#f9f9f9', // Light gray background to separate it
        borderRadius: 8,
        marginTop: 15,
        borderLeftWidth: 3,
        borderColor: '#007bff', // A subtle blue line on the left
    },
    
    descriptionLabel: {
        // Style for the heading/label (Book Condition / Notes)
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666', // Darker gray color
        marginBottom: 5,
        textTransform: 'uppercase',
    },

    descriptionText: {
        // Style for the actual description content
        fontSize: 16,
        lineHeight: 22,
        color: '#333', // Standard text color
        textAlign: 'justify', // Makes the text fill the width nicely
    },
});