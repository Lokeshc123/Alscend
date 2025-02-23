import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Snackbar } from "react-native-paper"; // Import Snackbar
import { login } from "../../services/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ username: "", password: "" });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleLogin = async () => {
    let hasError = false;

    // Reset errors
    setError({ username: "", password: "" });

    // Field validation
    if (!username.trim()) {
      setError((prev) => ({ ...prev, username: "Username is required" }));
      hasError = true;
    }
    if (!password.trim()) {
      setError((prev) => ({ ...prev, password: "Password is required" }));
      hasError = true;
    }

    if (hasError) return; // Stop if there are field errors

    try {
      const response = await login(username, password);
      console.log(response);
    } catch (err: any) {
      setSnackbarMessage(err.message || "Invalid credentials");
      setSnackbarVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.innerContainer}>
        {/* Header */}
        <Text style={styles.header}>Welcome Back</Text>
        <Text style={styles.subHeader}>Sign in to continue</Text>

        {/* Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, error.username ? styles.inputError : null]}
            placeholder="Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {error.username ? (
            <Text style={styles.errorText}>{error.username}</Text>
          ) : null}

          <TextInput
            style={[styles.input, error.password ? styles.inputError : null]}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          {error.password ? (
            <Text style={styles.errorText}>{error.password}</Text>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Snackbar */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: "OK",
            onPress: () => setSnackbarVisible(false),
          }}
          style={styles.snackbar}
          theme={{ colors: { surface: "#333" } }} // Dark background
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  formContainer: {
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
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginBottom: 5,
  },
  button: {
    width: "90%",
    paddingVertical: 15,
    backgroundColor: "#007bff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPassword: {
    marginTop: 20,
    color: "#007bff",
    fontSize: 14,
    fontWeight: "500",
  },
  snackbar: {
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    alignSelf: "center",
    width: "90%",
  },
});
