import { useUserStore } from "@/store/user-store";
import { scopes } from "@/lib/utils";
import { useGoogleLogin as useOauthGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function useGoogleLogin() {
  const { setError, setLoading, setUser, user, isLoading, error } =
    useUserStore();
  const _login = useOauthGoogleLogin({
    onSuccess: async (tokenResponse) => {
      //fetch user info
      const result = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: "Bearer " + tokenResponse.access_token,
          },
        }
      );
      const { email, name, picture: photoUrl } = result.data;
      setUser({
        email,
        name,
        photoUrl,
        accessToken: tokenResponse.access_token,
      });
      setLoading(false);
    },
    onError: (error) => {
      console.log(error);
      setLoading(false);
      setError(error.error_description);
    },
    scope: scopes.join(" "),
  });
  return {
    user,
    error,
    isLoading,
    login: () => {
      setLoading(true);
      _login();
    },
  };
}
