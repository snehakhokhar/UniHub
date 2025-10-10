import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig'; // Adjust the path to your firebaseConfig

// Define the Book type (must match Firestore fields)
type Book = {
    Title: string; 
    author: string;
    branch: string;
    semester: string;
    price: string;
    image: string;
    contact: string;
    description: string;
    // sellerUid and Student_Name are generally not editable here
};

export default function EditBook() {
    const { id } = useLocalSearchParams(); // Get the book ID from the URL
    const router = useRouter();
    
    // States for form data
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [branch, setBranch] = useState("");
    const [semester, setSemester] = useState("");
    const [image, setImage] = useState("");
    const [contact, setContact] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState('');
    const [isFree, setIsFree] = useState(false);

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // =========================================================
    // ⭐️ STEP 1: Fetch Existing Book Data ⭐️
    // =========================================================
    useEffect(() => {
        if (typeof id !== 'string' || !id) {
            setLoading(false);
            return;
        }

        const fetchBook = async () => {
            try {
                const docRef = doc(db, 'books', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Book;
                    
                    // Populate states with existing data
                    setTitle(data.Title || '');
                    setAuthor(data.author || '');
                    setBranch(data.branch || '');
                    setSemester(data.semester || '');
                    setImage(data.image || '');
                    setContact(data.contact || '');
                    setDescription(data.description || '');

                    // Handle price and isFree state
                    if (data.price === 'Free') {
                        setIsFree(true);
                        setPrice('');
                    } else {
                        setIsFree(false);
                        // Store only the numeric part of the price
                        setPrice(data.price.replace(/[^0-9]/g, '') || '');
                    }
                } else {
                    Alert.alert("Error", "Book not found.");
                }
            } catch (e) {
                console.error("Error fetching book:", e);
                Alert.alert("Error", "Could not load book details for editing.");
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);
    
    // =========================================================
    // ⭐️ STEP 2: Handle Update Submission ⭐️
    // =========================================================
    const handleUpdate = async () => {
        if (typeof id !== 'string' || !id) return;
        
        const finalPrice = isFree ? "Free" : price.replace(/[^0-9]/g, '');

        if(!title || !author || !contact) {
            Alert.alert('Error', 'Please fill in all required fields (Title, Author, Contact).');
            return;
        }
        if (!isFree && finalPrice.length === 0) {
            Alert.alert('Error', 'Please enter a price or mark as Free.');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const docRef = doc(db, "books", id);
            
            // The data to update
            const updateData = {
                Title: title,
                author: author,
                branch: branch,
                semester: semester,
                image: image,
                contact: contact,
                price: finalPrice, 
                description: description,
                updatedAt: new Date().toISOString(), // Optional: add an updated timestamp
            };
            
            await updateDoc(docRef, updateData);
            
            Alert.alert("Success", "Book updated successfully!");
            router.back(); // Go back to the profile screen
            
        } catch (e) {
            console.error("Error updating document: ", e);
            Alert.alert("Error", "Failed to update book. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Loading book data...</Text>
            </View>
        );
    }
    
    // =========================================================
    // ⭐️ STEP 3: Render Edit Form ⭐️
    // =========================================================
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Edit Book: {title}</Text>

            {/* Title Input */}
            <TextInput
                style={styles.input}
                placeholder="Book Title"
                value={title}
                onChangeText={setTitle}
            />
            
            {/* Author Input */}
            <TextInput
                style={styles.input}
                placeholder="Author Name"
                value={author}
                onChangeText={setAuthor}
            />
            
            {/* Branch and Semester (Keep optional or remove based on your AddBook logic) */}
            <TextInput
                style={styles.input}
                placeholder="Branch (e.g. CS, IT, EC)"
                value={branch}
                onChangeText={setBranch}
            />
            <TextInput
                style={styles.input}
                placeholder="Semester (e.g. 1, 2, 3)"
                value={semester}
                onChangeText={setSemester}
                keyboardType="numeric"
            />
            
            {/* Contact Input */}
            <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={contact}
                onChangeText={setContact}
                keyboardType="phone-pad"
            />

            {/* Price Toggle */}
            <View style={styles.priceToggleContainer}>
                <Text style={styles.priceToggleLabel}>Price Status:</Text>
                <TouchableOpacity
                    style={[styles.priceOption, isFree ? styles.priceOptionActive : styles.priceOptionInactive]}
                    onPress={() => { setIsFree(true); setPrice(''); }}
                >
                    <Text style={isFree ? styles.priceTextActive : styles.priceTextInactive}>FREE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.priceOption, !isFree ? styles.priceOptionActive : styles.priceOptionInactive]}
                    onPress={() => setIsFree(false)}
                >
                    <Text style={!isFree ? styles.priceTextActive : styles.priceTextInactive}>PRICED</Text>
                </TouchableOpacity>
            </View>

            {/* Price Input (Visible only if not Free) */}
            {!isFree && (
                <TextInput
                    style={styles.input}
                    placeholder="Price (e.g. 250)"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
            )}
            
            {/* Description Input */}
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Condition is fair, has highlight marks on first 5 pages."
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={4}
            />

            {/* Image URL Input */}
            <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={image}
                onChangeText={setImage}
            />

            {/* Save Button */}
            <TouchableOpacity 
                style={[styles.button, isSubmitting && styles.buttonDisabled]} 
                onPress={handleUpdate} 
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</Text>
            </TouchableOpacity>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f9f9f9",
        flexGrow: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    textArea: {
        minHeight: 100, 
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: "#a0cfff",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    // Price Toggle Styles (copied from your AddBook file for consistency)
    priceToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    priceToggleLabel: {
        fontSize: 15,
        fontWeight: '300',
        marginRight: 15,
        color: '#000000ff',
    },
    priceOption: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5,
        flex: 1,
        alignItems: 'center',
    },
    priceOptionActive: {
        backgroundColor: '#28a745',
    },
    priceOptionInactive: {
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    priceTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    priceTextInactive: {
        color: '#666',
        fontWeight: '500',
    },
});