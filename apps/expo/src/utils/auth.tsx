import * as Linking from "expo-linking";
import * as Browser from "expo-web-browser";

import { api } from "./api";
import { getBaseUrl } from "./base-url";
import { deleteToken, setToken } from "./session-store";

export const signIn = async () => {
  const signInUrl = `${getBaseUrl()}/api/auth/signin`;
  console.log("sign in url", signInUrl);
  const redirectTo = Linking.createURL("/login");
  console.log("redirect to", redirectTo);
  const result = await Browser.openAuthSessionAsync(
    `${signInUrl}?expo-redirect=${encodeURIComponent(redirectTo)}`,
  );

  if (result.type !== "success") return;
  const url = Linking.parse(result.url);
  console.log("linking url", url);
  const sessionToken = String(url.queryParams?.session_token);
  if (!sessionToken) return;

  await setToken(sessionToken);
};

export const useUser = () => {
  const { data: session } = api.auth.getSession.useQuery();
  return session?.user ?? null;
};

export const useSignIn = () => {
  const utils = api.useUtils();

  return async () => {
    await signIn();
    await utils.invalidate();
  };
};

export const useSignOut = () => {
  const utils = api.useUtils();
  const signOut = api.auth.signOut.useMutation();

  return async () => {
    const res = await signOut.mutateAsync();
    if (!res.success) return;
    await deleteToken();
    await utils.invalidate();
  };
};
