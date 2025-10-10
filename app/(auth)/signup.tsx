// import { useRouter } from 'expo-router';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { useState } from 'react';
// import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
// import { auth } from '../../firebaseConfig'; // Adjust the path if needed

// export default function Signup() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleSignup = async () => {
//     // 1. Basic validation for empty fields
//     if (!email || !password) {
//       Alert.alert("Error", "Please enter both email and password.");
//       return;
//     }
//     
//     // 2. Validate password length before calling Firebase
//     if (password.length < 6) {
//       Alert.alert("Error", "Password must be at least 6 characters long.");
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       console.log("User created:", userCredential.user);
//       // Redirect to the home screen after successful sign-up
//       router.replace('/(tabs)/home');
//     } catch (error) {
//       let errorCode = "unknown";
//       let errorMessage = "An unknown error occurred. Please try again.";

//       // Type checking to safely access error properties
//       if (typeof error === "object" && error !== null && "code" in error && "message" in error) {
//         errorCode = (error as { code: string }).code;
//         errorMessage = (error as { message: string }).message;
//       }
//       console.error("Firebase Auth Error:", errorCode, errorMessage);
//       
//       // Provide user-friendly alerts based on the error code
//       if (errorCode === "auth/email-already-in-use") {
//         Alert.alert("Signup Failed", "This email is already in use. Please sign in or use a different email.");
//       } else if (errorCode === "auth/invalid-email") {
//         Alert.alert("Signup Failed", "Please enter a valid email address.");
//       } else if (errorCode === "auth/weak-password") {
//          Alert.alert("Signup Failed", "The password is too weak. Please use at least 6 characters.");
//       } else {
//         Alert.alert("Signup Failed", "An unexpected error occurred. Please try again.");
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign Up</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="Sign Up" onPress={handleSignup} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
// });
import { useRouter } from 'expo-router';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { auth, db } from '../../firebaseConfig'; 

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    // 1. Basic validation for REQUIRED fields (Only Email, Password, Username)
    if (!email || !password || !username) {
      Alert.alert("Error", "Please fill in all required fields (Email, Password, and Username).");
      return;
    }
    
    // 2. Validate password length
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    try {
      // 1. Create the User (Email/Password)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update the Firebase User Profile (Display Name/Username)
      await updateProfile(user, {
        displayName: username, // ⭐️ Saves the username
      });
      
      // 3. Save the user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
      });

      console.log("User created and profile saved:", user.uid);
      // Redirect to the home screen after successful sign-up
      router.replace('/(tabs)/home');
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      let errorCode = "unknown";
      
      if (typeof error === "object" && error !== null && "code" in error) {
        errorCode = (error as { code: string }).code;
      }
      
      // Provide user-friendly alerts based on the error code
      if (errorCode === "auth/email-already-in-use") {
        errorMessage = "This email is already in use. Please sign in or use a different email.";
      } else if (errorCode === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (errorCode === "auth/weak-password") {
        errorMessage = "The password is too weak. Please use at least 6 characters.";
      }
      Alert.alert("Signup Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="words"
      /> 

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#007BFF',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});