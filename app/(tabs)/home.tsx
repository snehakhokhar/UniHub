import { useRouter } from 'expo-router';
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Image, Linking, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../firebaseConfig";

// Define the correct Book type
type Book = {
  id: string;
  Title: string; 
  author: string;
  branch: string;
  semester: string | number;
  price: string;
  image?: string;
  contact: string;
  Student_Name: string; 
};

export default function BookList() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

 useEffect(() => {
 const fetchBooks = async () => {
 try {
 const querySnapshot = await getDocs(collection(db, "books"));
 const booksArray = querySnapshot.docs.map(doc => {
 const data = doc.data();
 return {
 id: doc.id,
 Title: data.Title ?? "", 
 author: data.author ?? "",
 branch: data.branch ?? "",
 semester: data.semester ?? "",
 price: data.price ?? "",
  image: data.image ?? "",
 contact: data.contact ?? "",
 Student_Name: data.Student_Name ?? "", 
} as Book;
});
        setBooks(booksArray);
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

 const filteredBooks = books.filter(book =>
 (book.Title?.toLowerCase() || '').includes(search.toLowerCase()) || 
 (book.semester?.toString() || '').toLowerCase().includes(search.toLowerCase()) ||
 (book.branch?.toLowerCase() || '').includes(search.toLowerCase())
 );

 const handleCall = (phone: string) => {
 Linking.openURL(`tel:${phone}`);
 };

if (loading) {
 return (
 <View style={styles.safeContainer}>
 <Text>Loading books...</Text>
</View>);
} 
 if (filteredBooks.length === 0 && !loading) {
 return (
 <View style={styles.safeContainer}>
 <Text>No books found. Try a different search or add a new book to the database.</Text>
 </View>
);
}
 return (
 <SafeAreaView style={styles.safeContainer}>
<View style={styles.innerContainer}>
 <TextInput
style={styles.input}
placeholder="🔍 Search by title, semester or branch"
 onChangeText={setSearch}
 />

<FlatList
data={filteredBooks}
 keyExtractor={(item) => item.id}
 renderItem={({ item }) => (
 <TouchableOpacity 
style={styles.row}
 onPress={() => router.push(`/book/${item.id}`)} 
> 
<Image
source={{ uri: item.image && item.image.trim() !== "" ? item.image : "https://via.placeholder.com/100x100.png" }}
style={styles.image}
/>

<View style={styles.details}>
<Text style={styles.title} numberOfLines={1}>{item.Title}</Text> 
<Text style={styles.subtitle}>
 {item.author} • {item.branch} • Sem {item.semester}
</Text>
<View style={styles.bottomRow}>
<Text style={[styles.price, item.price === 'Free' && styles.priceFree]}>
 {item.price === 'Free' ? 'FREE' : `₹${item.price}`}
</Text>
<TouchableOpacity 
 onPress={(e) => {
 e.stopPropagation(); 
 handleCall(item.contact);
 }}>
<Text style={styles.callText}>📞 Call</Text>
</TouchableOpacity>
</View>
</View>
</TouchableOpacity>
)}
/>
</View>
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop:10,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
paddingTop:30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: "#eee",
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  details: {
    flex: 1,
    marginLeft: 12,
    // Ensure all children inside here are clean: title, subtitle, bottomRow
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center', // Added this for vertical alignment
    marginTop: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "green",
  },
  callText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
priceFree: {
    color: "#007AFF", // Blue color for "FREE"
    fontWeight: "900", // Extra bold for emphasis
    fontSize: 16, // Slightly larger
  },
});