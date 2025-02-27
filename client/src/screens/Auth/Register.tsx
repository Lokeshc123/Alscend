// TODO -- FIX THE PUSH UP ISSUE
//

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registerUser } from "../../services/auth";
import SnackBar from "../../components/SnackBar";
import { KeyboardAvoidingView } from "react-native";
// Define the navigation stack param list (adjust based on your navigation setup)
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

const Register = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleRegister = async () => {
    let hasError = false;

    // Reset errors
    setError({ name: "", email: "", password: "", confirmPassword: "" });

    // Field validation
    if (!name.trim()) {
      setError((prev) => ({ ...prev, name: "Full Name is required" }));
      hasError = true;
    }
    if (!email.trim()) {
      setError((prev) => ({ ...prev, email: "Email is required" }));
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError((prev) => ({ ...prev, email: "Email is invalid" }));
      hasError = true;
    }
    if (!password.trim()) {
      setError((prev) => ({ ...prev, password: "Password is required" }));
      hasError = true;
    }
    if (!confirmPassword.trim()) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Please confirm your password",
      }));
      hasError = true;
    } else if (password !== confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      hasError = true;
    }

    if (hasError) return; // Stop if there are field errors

    try {
      const response = await registerUser(name, email, password);
      console.log(response);
      navigation.replace("Login"); // Navigate to Login on success
    } catch (err: any) {
      setSnackbarMessage(err.message || "An error occurred while registering");
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error.name ? styles.inputError : null]}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        {error.name ? <Text style={styles.errorText}>{error.name}</Text> : null}

        <TextInput
          style={[styles.input, error.email ? styles.inputError : null]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {error.email ? (
          <Text style={styles.errorText}>{error.email}</Text>
        ) : null}

        <TextInput
          style={[styles.input, error.password ? styles.inputError : null]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        {error.password ? (
          <Text style={styles.errorText}>{error.password}</Text>
        ) : null}

        <TextInput
          style={[
            styles.input,
            error.confirmPassword ? styles.inputError : null,
          ]}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        {error.confirmPassword ? (
          <Text style={styles.errorText}>{error.confirmPassword}</Text>
        ) : null}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>

      <SnackBar
        snackbarVisible={snackbarVisible}
        setSnackbarVisible={setSnackbarVisible}
        snackbarMessage={snackbarMessage}
      />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    gap: 15,
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "90%",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    width: "90%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  linkText: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
