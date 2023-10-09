import { Button } from "antd";
export default function LoginPage() {
  function handleLogin() {
    //open google dialog
    const {VITE_CLIENT_ID, VITE_REDIRECT_URL}=import.meta.env
    const auth_url =
      `https://accounts.google.com/o/oauth2/auth?client_id=${VITE_CLIENT_ID}&redirect_uri=${VITE_REDIRECT_URL}&response_type=code&scope=https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile  https://www.googleapis.com/auth/userinfo.email&access_type=offline`
      window.open(auth_url, "_self");
  }
  return (
    <div className="full center">
      <Button onClick={handleLogin} type="primary">
        Login with Google
      </Button>
    </div>
  );
}
