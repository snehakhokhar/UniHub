// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { addDoc, collection } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { db } from "../../firebaseConfig"; // Adjust the path if needed
// import { useRouter } from 'expo-router'; 
// import * as ImagePicker from 'expo-image-picker';

// interface CustomAlertProps {
//   visible: boolean;
//   message: string;
//   type: 'Error' | 'Success' | string;
//   onClose: () => void;
// }

// // 1B. Custom Alert Component Definition
// const CustomAlertBanner: React.FC<CustomAlertProps> = ({ visible, message, type, onClose }) => {
//   if (!visible) return null;

//   const backgroundColor = type === 'Error' ? '#dc3545' : '#28a745';
//   const icon = type === 'Error' ? '❌' : '✅';

//   return (
//     <View style={[customAlertStyles.banner, { backgroundColor }]}>
//       <Text style={customAlertStyles.text}>{icon} {message}</Text>
//       <TouchableOpacity onPress={onClose} style={customAlertStyles.closeButton}>
//         <Text style={customAlertStyles.closeText}>✕</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default function AddBook() {
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [branch, setBranch] = useState("");
//   const [semester, setSemester] = useState("");
//   const [image, setImage] = useState("");
//   const [contact, setContact] = useState("");
//   const [price, setPrice] = useState("");
//   const [studentName, setStudentName] = useState(""); // State for Student_Name
//   const [isFree, setIsFree] = useState(false);
//  const [isSubmitting, setIsSubmitting] = useState(false); 
//  const [description, setDescription] = useState('');
//   const auth = getAuth();
//   const router = useRouter();
//   const [alert, setAlert] = useState({ visible: false, message: '', type: '' });
//   const hideAlert = () => {
//     setAlert({ visible: false, message: '', type: '' });
//   };

//   const showAlert = (type:'Error' | 'Success', message:string) => {
//     setAlert({ visible: true, message: message, type: type });
//     // Auto-hide the alert after 4 seconds
//     setTimeout(hideAlert, 2000);
//   };
//  useEffect(() => { const unsubscribe = onAuthStateChanged(auth, (user) => {
//  if (user) {
//  // Use the user's display name or email if the name isn't set
// setStudentName(user.displayName || user.email || "Unknown Seller");
//  } else {
//  // Handle case where user is somehow on this page without being logged in
//  setStudentName(""); 
// }
// });
//  return () => unsubscribe();
//  }, []);
//   const handleSubmit = async () => {
//     // Basic validation to ensure fields are not empty
//     const finalPrice = isFree ? "Free" : price.replace(/[^0-9]/g, '');
//     if(!title || !author || !branch || !semester || !contact || !description) {
//  Alert.alert('Error', 'Please fill in all required fields.');
//  showAlert('Error', 'Please fill in all required fields.');
//       return;
//     }
// if (!isFree && finalPrice.length === 0) {
//  Alert.alert('Error', 'Please enter a price or mark as Free.');
//  showAlert('Error', 'Please enter a price or mark as Free.'); 
//  return;
//  }
// setIsSubmitting(true);
// const user = auth.currentUser;
// const sellerUid = user ? user.uid : "anonymous";
//     try {
//        const cleanedPrice = price.replace(/[^0-9]/g, '');
//       // Use addDoc to add a new document to the "books" collection
//       const docRef = await addDoc(collection(db, "books"), {
//         Title: title, // Make sure the field names match your Firestore document exactly
//         author: author,
//         branch: branch,
//         semester: semester,
//         image: image,
//         contact: contact,
//         price: finalPrice, 
//         description: description, 
//         Student_Name: studentName,
//         sellerUid: sellerUid,
//       });
      
//       console.log("Document written with ID: ", docRef.id);
//       showAlert("Success", "Book added successfully!");


//       // Clear the form after submission
//       setTitle("");
//       setAuthor("");
//       setBranch("");
//       setSemester("");
//       setImage("");
//       setContact("");
//       setPrice("");
//       setIsFree(false);
//       router.replace('./home');
//     } catch (e) {
//       console.error("Error adding document: ", e);
//       Alert.alert("Error", "Failed to add book. Please try again.");
//       showAlert('Error', 'Failed to add book. Please try again.');
//     }
//     finally {
//  setIsSubmitting(false); 
//  }

//   };

//   return (
//     <>
//     <CustomAlertBanner
//         visible={alert.visible}
//         message={alert.message}
//         type={alert.type}
//         onClose={hideAlert}
//       />
      
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Add New Book</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Book Title"
//         value={title}
//         onChangeText={setTitle}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Author Name"
//         value={author}
//         onChangeText={setAuthor}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Branch (e.g. CS, IT, EC)"
//         value={branch}
//         onChangeText={setBranch}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Semester (e.g. 1, 2, 3)"
//         value={semester}
//         onChangeText={setSemester}
//         keyboardType="numeric"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Contact Number"
//         value={contact}
//         onChangeText={setContact}
//         keyboardType="phone-pad"
//   />
// <View style={styles.priceToggleContainer}>
// <Text style={styles.priceToggleLabel}>Price Status:</Text>
// <TouchableOpacity
// style={[styles.priceOption, isFree ? styles.priceOptionActive : styles.priceOptionInactive]}
//  onPress={() => { setIsFree(true); setPrice(''); }} // Clear price when setting to Free
// >
// <Text style={isFree ? styles.priceTextActive : styles.priceTextInactive}>FREE</Text>
// </TouchableOpacity>

//  <TouchableOpacity
// style={[styles.priceOption, !isFree ? styles.priceOptionActive : styles.priceOptionInactive]}
//  onPress={() => setIsFree(false)}
//  >
// <Text style={!isFree ? styles.priceTextActive : styles.priceTextInactive}>PRICED</Text>
// </TouchableOpacity>
// </View>
//  {!isFree && (
//  <TextInput
// style={styles.input}
//  placeholder="Price (e.g. 250)"
//  value={price}
//  onChangeText={setPrice}
// keyboardType="numeric"
//  />
// )}
// <Text style={styles.label}>Description</Text>
// <TextInput
//     style={[styles.input, styles.textArea]} // You'll need to define a styles.textArea
//     placeholder="e.g., Condition is fair, has highlight marks on first 5 pages."
//     value={description}
//     onChangeText={setDescription}
//     multiline={true} // Allows multiple lines
//     numberOfLines={4} // Suggests a minimum height
// />
// <View style={styles.infoBox}>
//     <Text style={styles.infoLabel}>Seller Name (Auto-filled)</Text>
//     <Text style={styles.infoValue}>{studentName || 'Loading...'}</Text>
// </View>

//   <TextInput
//    style={styles.input}
//   placeholder="Image URL"
//   value={image}
//   onChangeText={setImage}
// />

//       <TouchableOpacity style={[styles.button , isSubmitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={isSubmitting}>
//         <Text style={styles.buttonText}>Add Book</Text>
//       </TouchableOpacity>
//     </ScrollView>
//     </>
//   );
// }
// const customAlertStyles = StyleSheet.create({
//   banner: {
//     padding: 15,
//     borderRadius: 8,
//     marginHorizontal: 10,
//     marginTop: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     // Position absolute is key for overlaying ScrollView
//     position: 'absolute',
//     top: 0, 
//     left: 0,
//     right: 0,
//     zIndex: 10,
//   },
//   text: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//     flexShrink: 1,
//   },
//   closeButton: {
//     padding: 5,
//   },
//   closeText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#f9f9f9",
//     flexGrow: 1,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#333",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 15,
//     backgroundColor: "#fff",
//   },
//   button: {
//     backgroundColor: "#007BFF",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonDisabled: {
//     backgroundColor: "#a0cfff", // Lighter shade for disabled state
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   priceToggleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     backgroundColor: '#fff',
//   },
//   priceToggleLabel: {
//     fontSize: 15,
//     fontWeight: '300',
//     marginRight: 15,
//     color: '#000000ff',
//   },
//   priceOption: {
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     marginHorizontal: 5,
//     flex: 1,
//     alignItems: 'center',
//   },
//   priceOptionActive: {
//     backgroundColor: '#28a745', // Green for active
//   },
//   priceOptionInactive: {
//     backgroundColor: '#f0f0f0', // Light gray for inactive
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   priceTextActive: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   priceTextInactive: {
//     color: '#666',
//     fontWeight: '500',
//   },
// label: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//         marginTop: 15,
//         marginBottom: 5,
//     },   
//    textArea: {
//         minHeight: 120, // Ensures enough vertical space for multiple lines
//         height: 'auto', // Allows the height to grow if needed
//         textAlignVertical: 'top', // Important: aligns text to the top for multiline
//     },
// infoBox: {
//     width: '100%',
//     padding: 12,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#007BFF',
//     borderRadius: 10,
//     backgroundColor: '#e6f7ff',
// },

// infoLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#0056b3',
//     marginBottom: 4,
// },

// infoValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
// },

// });

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator } from "react-native";
import { db } from "../../firebaseConfig";
import { useRouter } from 'expo-router'; 
import * as ImagePicker from 'expo-image-picker';

interface CustomAlertProps {
  visible: boolean;
  message: string;
  type: 'Error' | 'Success' | string;
  onClose: () => void;
}

// Custom Alert Banner
const CustomAlertBanner: React.FC<CustomAlertProps> = ({ visible, message, type, onClose }) => {
  if (!visible) return null;
  const backgroundColor = type === 'Error' ? '#dc3545' : '#28a745';
  const icon = type === 'Error' ? '❌' : '✅';
  return (
    <View style={[customAlertStyles.banner, { backgroundColor }]}>
      <Text style={customAlertStyles.text}>{icon} {message}</Text>
      <TouchableOpacity onPress={onClose} style={customAlertStyles.closeButton}>
        <Text style={customAlertStyles.closeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [image, setImage] = useState("");
  const [contact, setContact] = useState("");
  const [price, setPrice] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const auth = getAuth();
  const router = useRouter();
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });

  const hideAlert = () => setAlert({ visible: false, message: '', type: '' });
  const showAlert = (type:'Error' | 'Success', message:string) => {
    setAlert({ visible: true, message, type });
    setTimeout(hideAlert, 2000);
  };

  // Auto-fill seller name
  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setStudentName(user.displayName || user.email || "Unknown Seller");
      else setStudentName("");
    });
    return () => unsubscribe();
  }, []);

  // --- IMAGE PICKER + CLOUDINARY UPLOAD ---
  const pickImage = async (fromCamera: boolean) => {
    const permission = fromCamera 
      ? await ImagePicker.requestCameraPermissionsAsync() 
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== 'granted') {
      Alert.alert("Permission Denied", "We need permission to access your photos/camera.");
      return;
    }

    const result = fromCamera 
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });

    if (!result.canceled && result.assets[0]?.uri) uploadToCloudinary(result.assets[0].uri);
  };

  const uploadToCloudinary = async (uri: string) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", { uri, type: "image/jpeg", name: "book.jpg" } as any);
      formData.append("upload_preset", "unihub_unsigned"); // <-- your unsigned preset
      formData.append("folder", "UniHub"); // optional folder

      const res = await fetch("https://api.cloudinary.com/v1_1/ds9jjwqnq/image/upload", { method: "POST", body: formData }); // <-- replace <your_cloud_name>
      const data = await res.json();
      setImage(data.secure_url);
      showAlert("Success", "Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      showAlert("Error", "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // --- SUBMIT FORM ---
  const handleSubmit = async () => {
    const finalPrice = isFree ? "Free" : price.replace(/[^0-9]/g, '');
    if(!title || !author || !branch || !semester || !contact || !description) {
      showAlert('Error', 'Please fill in all required fields.');
      return;
    }
    if (!isFree && finalPrice.length === 0) {
      showAlert('Error', 'Please enter a price or mark as Free.'); 
      return;
    }
    if (!image) {
      showAlert('Error', 'Please upload an image of the book.');
      return;
    }

    setIsSubmitting(true);
    const user = auth.currentUser;
    const sellerUid = user ? user.uid : "anonymous";

    try {
      await addDoc(collection(db, "books"), {
        Title: title,
        author,
        branch,
        semester,
        image,
        contact,
        price: finalPrice,
        description,
        Student_Name: studentName,
        sellerUid,
      });

      showAlert("Success", "Book added successfully!");
      // Reset form
      setTitle(""); setAuthor(""); setBranch(""); setSemester(""); setContact(""); setPrice(""); setIsFree(false); setDescription(""); setImage("");
      router.replace('./home');
    } catch (e) {
      console.error("Error adding document: ", e);
      showAlert('Error', 'Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CustomAlertBanner visible={alert.visible} message={alert.message} type={alert.type} onClose={hideAlert} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Add New Book</Text>

        <TextInput style={styles.input} placeholder="Book Title" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Author Name" value={author} onChangeText={setAuthor} />
        <TextInput style={styles.input} placeholder="Branch (e.g. CS, IT, EC)" value={branch} onChangeText={setBranch} />
        <TextInput style={styles.input} placeholder="Semester (e.g. 1, 2, 3)" value={semester} onChangeText={setSemester} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Contact Number" value={contact} onChangeText={setContact} keyboardType="phone-pad" />

        <View style={styles.priceToggleContainer}>
          <Text style={styles.priceToggleLabel}>Price Status:</Text>
          <TouchableOpacity style={[styles.priceOption, isFree ? styles.priceOptionActive : styles.priceOptionInactive]} onPress={() => { setIsFree(true); setPrice(''); }}>
            <Text style={isFree ? styles.priceTextActive : styles.priceTextInactive}>FREE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.priceOption, !isFree ? styles.priceOptionActive : styles.priceOptionInactive]} onPress={() => setIsFree(false)}>
            <Text style={!isFree ? styles.priceTextActive : styles.priceTextInactive}>PRICED</Text>
          </TouchableOpacity>
        </View>
        {!isFree && <TextInput style={styles.input} placeholder="Price (e.g. 250)" value={price} onChangeText={setPrice} keyboardType="numeric" />}

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Condition, highlights, etc." value={description} onChangeText={setDescription} multiline numberOfLines={4} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(false)}>
            <Text style={styles.imagePickerText}>Pick image from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(true)}>
            <Text style={styles.imagePickerText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
        {uploading && <ActivityIndicator size="small" color="#3c7bbe" />}
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}

        <TouchableOpacity style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.buttonText}>Add Book</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const customAlertStyles = StyleSheet.create({
  banner: { padding: 15, borderRadius: 8, marginHorizontal: 10, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  text: { color: '#fff', fontSize: 14, fontWeight: '600', flexShrink: 1 },
  closeButton: { padding: 5 },
  closeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f9f9f9", flexGrow: 1 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: "#fff" },
  textArea: { minHeight: 120, height: 'auto', textAlignVertical: 'top' },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonDisabled: { backgroundColor: "#a0cfff" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  priceToggleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, backgroundColor: '#fff' },
  priceToggleLabel: { fontSize: 15, fontWeight: '300', marginRight: 15, color: '#000000ff' },
  priceOption: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, marginHorizontal: 5, flex: 1, alignItems: 'center' },
  priceOptionActive: { backgroundColor: '#28a745' },
  priceOptionInactive: { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
  priceTextActive: { color: '#fff', fontWeight: 'bold' },
  priceTextInactive: { color: '#666', fontWeight: '500' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 5 },
  imagePicker: { backgroundColor: '#3c7bbe', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 8, flex: 1, marginHorizontal: 5 },
  imagePickerText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  previewImage: { width: 120, height: 120, borderRadius: 10, marginVertical: 10, alignSelf: 'center' },
});

