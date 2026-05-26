"use client";

import { createContext, useContext, ReactNode } from "react";
import type { User } from "firebase/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const stub = async () => {};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    signIn: stub,
    signUp: stub,
    signOut: stub,
    resetPassword: stub,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    return (
        <AuthContext.Provider value={{ user: null, loading: false, signIn: stub, signUp: stub, signOut: stub, resetPassword: stub }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
