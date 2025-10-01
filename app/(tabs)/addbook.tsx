import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../firebaseConfig"; // Adjust the path if needed

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [image, setImage] = useState("");
  const [contact, setContact] = useState("");
  const [price, setPrice] = useState("");
  const [studentName, setStudentName] = useState(""); // State for Student_Name
   const [isFree, setIsFree] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleSubmit = async () => {
    // Basic validation to ensure fields are not empty
    const finalPrice = isFree ? "Free" : price.replace(/[^0-9]/g, '');
    if(!title || !author || !branch || !semester || !contact || !studentName) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    if (!isFree && finalPrice.length === 0) {
      Alert.alert('Error', 'Please enter a price or mark as Free.');
      return;
    }
setIsSubmitting(true);

    try {
       const cleanedPrice = price.replace(/[^0-9]/g, '');
      // Use addDoc to add a new document to the "books" collection
      const docRef = await addDoc(collection(db, "books"), {
        Title: title, // Make sure the field names match your Firestore document exactly
        author: author,
        branch: branch,
        semester: semester,
        image: image,
        contact: contact,
        price: finalPrice, 
        Student_Name: studentName, // Correct field name
      });
      
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Success", "Book added successfully!");

      // Clear the form after submission
      setTitle("");
      setAuthor("");
      setBranch("");
      setSemester("");
      setImage("");
      setContact("");
      setPrice("");
      setIsFree(false);
      setStudentName("");

    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "Failed to add book. Please try again.");
    }
    finally {
      // 💡 Stop loading
      setIsSubmitting(false); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add New Book</Text>

      <TextInput
        style={styles.input}
        placeholder="Book Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author Name"
        value={author}
        onChangeText={setAuthor}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contact}
        onChangeText={setContact}
        keyboardType="phone-pad"
      />
      <View style={styles.priceToggleContainer}>
        <Text style={styles.priceToggleLabel}>Price Status:</Text>
        <TouchableOpacity
          style={[styles.priceOption, isFree ? styles.priceOptionActive : styles.priceOptionInactive]}
          onPress={() => { setIsFree(true); setPrice(''); }} // Clear price when setting to Free
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
 {!isFree && (
        <TextInput
          style={styles.input}
          placeholder="Price (e.g. 250)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Student Name"
        value={studentName}
        onChangeText={setStudentName}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
      />

      <TouchableOpacity style={[styles.button , isSubmitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.buttonText}>Add Book</Text>
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
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#a0cfff", // Lighter shade for disabled state
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
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
    backgroundColor: '#28a745', // Green for active
  },
  priceOptionInactive: {
    backgroundColor: '#f0f0f0', // Light gray for inactive
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

