import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

// Check if device supports biometrics
export const isBiometricAvailable = async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
};

// Enable fingerprint login (store the flag)
export const enableFingerprintAuth = async () => {
  const available = await isBiometricAvailable();
  if (!available) {
    throw new Error("Biometric authentication not available on this device.");
  }

  await SecureStore.setItemAsync("isFingerprintEnabled", "true");
  return "Fingerprint authentication enabled!";
};

// Authenticate using fingerprint
export const authenticateWithFingerprint = async () => {
  const isEnabled = await SecureStore.getItemAsync("isFingerprintEnabled");

  if (isEnabled === "true") {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Fingerprint",
    });

    if (result.success) {
      return true;
    } else {
      throw new Error("Fingerprint authentication failed.");
    }
  }

  return false;
};
