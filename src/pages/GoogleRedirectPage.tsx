import { notification } from "antd";
import { useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import {
  delay,
  getAccessTokenCookies,
  setAccessTokenCookies,
  setTokenCookies,
} from "../others/utils";
import { getAccessToken } from "../api/token";
export default function GoogleRedirectPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const init = async () => {
      //get code
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (code) {
        //send code to server to get access_code
        const accessCode = await getAccessToken(code);
        //save to global and localStorage
        //redirect to editor
        if (accessCode.result) {
          setAccessTokenCookies(accessCode.result.google_access_token);
          setTokenCookies(accessCode.result.token);
          navigate("/", { replace: true });
        } else {
          //show error and redirect to login
          notification.error({
            message: accessCode.errorMessage,
            description: "try to login again",
          });
          await delay(1500)
          navigate("/login", { replace: true });
        }
      } else {
        const error = url.searchParams.get("error") || "invalid code";
        //show toast [invalid code]
        notification.error({
          message: error,
        });
        await delay(1000);
        //redirect to login
        navigate("/login", { replace: true });
      }
    };
    init();
  }, []);
  return <div>Google redirect</div>;
}
