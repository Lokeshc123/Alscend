import * as SecureStore from "expo-secure-store";

const TokenKey = "authToken";

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TokenKey, token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TokenKey);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TokenKey);
};
