import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Adjust the path if needed
import { useRouter } from 'expo-router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    // 1. Basic validation for empty fields
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    
    // 2. Validate password length before calling Firebase
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);
      // Redirect to the home screen after successful sign-up
      router.replace('/(tabs)/home');
    } catch (error) {
      let errorCode = "unknown";
      let errorMessage = "An unknown error occurred. Please try again.";

      // Type checking to safely access error properties
      if (typeof error === "object" && error !== null && "code" in error && "message" in error) {
        errorCode = (error as { code: string }).code;
        errorMessage = (error as { message: string }).message;
      }
      console.error("Firebase Auth Error:", errorCode, errorMessage);
      
      // Provide user-friendly alerts based on the error code
      if (errorCode === "auth/email-already-in-use") {
        Alert.alert("Signup Failed", "This email is already in use. Please sign in or use a different email.");
      } else if (errorCode === "auth/invalid-email") {
        Alert.alert("Signup Failed", "Please enter a valid email address.");
      } else if (errorCode === "auth/weak-password") {
         Alert.alert("Signup Failed", "The password is too weak. Please use at least 6 characters.");
      } else {
        Alert.alert("Signup Failed", "An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});