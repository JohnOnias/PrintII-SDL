import React, { createContext, useContext, useState, useCallback } from "react";
import { getUser as getUserFromStorage } from "../services/userService";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => getUserFromStorage());

  const refreshUser = useCallback(() => {
    const userData = getUserFromStorage();
    setUser(userData);
  }, []);

  const setUserData = useCallback((data) => {
    setUser(data);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUserData, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
}
