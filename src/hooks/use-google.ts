import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useCallback, useState } from "react";

export default function useGoogle() {
    const [data, setData] = useState<TokenResponse>()
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState(false)
    const _login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setLoading(false)
            setData(tokenResponse)
        },
        onError: (error) => {
            setLoading(false)
            setError(error.error_description)
        },
    });
    return {
        data, error, loading, login: () => {
            setLoading(true)
            _login()
        }
    }

}