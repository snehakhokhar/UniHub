// import { useRouter } from "expo-router";
// import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"; // Import sendPasswordResetEmail
// import React, { useState } from "react";
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { auth } from "../../firebaseConfig";


// export default function Signin()  {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleSignin = async () => {
//     // Basic validation to prevent empty fields
//     if (!email || !password) {
//       Alert.alert("Error", "Please enter both email and password.");
//       return;
//     }

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       Alert.alert("Welcome 🎉", `Logged in as ${user.email}`);
//       router.replace("/(tabs)/home"); 
//     } catch (err: any) {
//       // The error handling is already excellent! 
//       console.error("Firebase Auth Error:", err.code, err.message);
//       let errorMessage = "An unknown error occurred.";

//       // This correctly handles missing user or wrong password
//       if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
//         errorMessage = "Invalid email or password.";
//       } else if (err.code === 'auth/invalid-email') {
//         errorMessage = "The email address is not valid.";
//       }

//       Alert.alert("Sign In Failed", errorMessage);
//     }
//   };

//   // --- NEW FEATURE: Handle Password Reset ---
//   const handleForgotPassword = async () => {
//     if (!email) {
//       Alert.alert("Forgot Password", "Please enter your email address first.");
//       return;
//     }

//     try {
//       await sendPasswordResetEmail(auth, email);
//       Alert.alert(
//         "Password Reset Sent ✅",
//         `A password reset link has been sent to ${email}. Please check your inbox.`
//       );
//     } catch (err: any) {
//       console.error("Password Reset Error:", err.code, err.message);
//       let errorMessage = "Could not send reset link.";

//       // Specific error handling for email problems
//       if (err.code === 'auth/user-not-found') {
//         errorMessage = "No user found with that email address.";
//       } else if (err.code === 'auth/invalid-email') {
//         errorMessage = "Please enter a valid email address.";
//       }

//       Alert.alert("Password Reset Failed", errorMessage);
//     }
//   };
//   // ------------------------------------------

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Signin to UniHub</Text>
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
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       
//       <TouchableOpacity style={styles.button} onPress={handleSignin}>
//         <Text style={styles.buttonText}>Sign In</Text>
//       </TouchableOpacity>
//       
//       {/* NEW: Forgot Password Link */}
//       <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
//         <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//       </TouchableOpacity>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: "#007BFF",
//     padding: 15,
//     borderRadius: 8,
//     width: "100%",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   // NEW STYLES
//   forgotPasswordButton: {
//     marginTop: 15,
//     padding: 10,
//   },
//   forgotPasswordText: {
//     color: "#007BFF",
//     fontSize: 14,
//     textDecorationLine: 'underline',
//   },
// });
import { useRouter } from "expo-router";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebaseConfig"; // Ensure this path is correct

export default function Signin() { // Exported correctly as a function component
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignin = async () => {
    // Basic validation to prevent empty fields
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      Alert.alert("Welcome 🎉", `Logged in as ${user.email}`);
      router.replace("/(tabs)/home"); 
    } catch (err: any) {
      console.error("Firebase Auth Error:", err.code, err.message);
      let errorMessage = "An unknown error occurred.";

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMessage = "Invalid email or password.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "The email address is not valid.";
      }

      Alert.alert("Sign In Failed", errorMessage);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Forgot Password", "Please enter your email address first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Password Reset Sent ✅",
        `A password reset link has been sent to ${email}. Please check your inbox.`
      );
    } catch (err: any) {
      console.error("Password Reset Error:", err.code, err.message);
      let errorMessage = "Could not send reset link.";

      if (err.code === 'auth/user-not-found') {
        errorMessage = "No user found with that email address.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      }

      Alert.alert("Password Reset Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signin to UniHub</Text>
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
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSignin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordButton: {
    marginTop: 15,
    padding: 10,
  },
  forgotPasswordText: {
    color: "#007BFF",
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});