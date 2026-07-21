import React, { createContext, useContext, useState, useEffect } from "react";
import { Role } from "../types";

interface AuthContextType {
  role: Role | null;
  userName: string;
  userEmail: string;
  isLoggedIn: boolean;
  loginSiswa: (name: string) => void;
  loginGuru: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Load auth state from localStorage on init
  useEffect(() => {
    const savedRole = localStorage.getItem("dedigma_role") as Role | null;
    const savedName = localStorage.getItem("dedigma_username") || "";
    const savedEmail = localStorage.getItem("dedigma_email") || "";

    if (savedRole) {
      setRole(savedRole);
      setUserName(savedName);
      setUserEmail(savedEmail);
    }
  }, []);

  const loginSiswa = (name: string) => {
    setRole("siswa");
    setUserName(name);
    setUserEmail("");
    localStorage.setItem("dedigma_role", "siswa");
    localStorage.setItem("dedigma_username", name);
    localStorage.removeItem("dedigma_email");
  };

  const loginGuru = (name: string, email: string) => {
    setRole("guru");
    setUserName(name);
    setUserEmail(email);
    localStorage.setItem("dedigma_role", "guru");
    localStorage.setItem("dedigma_username", name);
    localStorage.setItem("dedigma_email", email);
  };

  const logout = () => {
    setRole(null);
    setUserName("");
    setUserEmail("");
    localStorage.removeItem("dedigma_role");
    localStorage.removeItem("dedigma_username");
    localStorage.removeItem("dedigma_email");
    // Clear student progress upon logout as well
    localStorage.removeItem("dedigma_completed_missions");
    localStorage.removeItem("dedigma_mission_scores");
  };

  const isLoggedIn = role !== null;

  return (
    <AuthContext.Provider
      value={{
        role,
        userName,
        userEmail,
        isLoggedIn,
        loginSiswa,
        loginGuru,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
