import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
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

  const handleSubmit = async () => {
    // Basic validation to ensure fields are not empty
    if (!title || !author || !branch || !semester || !price || !contact || !studentName) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      // Use addDoc to add a new document to the "books" collection
      const docRef = await addDoc(collection(db, "books"), {
        Title: title, // Make sure the field names match your Firestore document exactly
        author: author,
        branch: branch,
        semester: semester,
        image: image,
        contact: contact,
        price: price,
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
      setStudentName("");

    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "Failed to add book. Please try again.");
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
      <TextInput
        style={styles.input}
        placeholder="Price (e.g. ₹250)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

