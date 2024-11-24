import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export function useAuth() {
    const authData = useContext(AuthContext);
    if (!authData) throw new Error("useAuth must be called inside AuthProvider");
    return authData;
}
