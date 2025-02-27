import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Snackbar } from "react-native-paper";

// Define the props type
interface SnackBarProps {
  snackbarVisible: boolean;
  setSnackbarVisible: (visible: boolean) => void;
  snackbarMessage: string;
}

const SnackBar = ({
  snackbarVisible,
  setSnackbarVisible,
  snackbarMessage,
}: SnackBarProps) => {
  return (
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
  );
};

export default SnackBar;

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    alignSelf: "center",
    width: "90%",
  },
});
