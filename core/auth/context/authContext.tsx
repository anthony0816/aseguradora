"use client";

import { useEffect, useState } from "react";
import { authContext } from "../consts/consts";
import { tk } from "../consts/consts";
import { useRouter } from "next/navigation";
import { UserProps } from "../types/authTypes";

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<UserProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // navegation
  const router = useRouter();

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    const storedToken = localStorage.getItem(tk.access_token);
    const storedUser = localStorage.getItem(tk.user);

    if (storedToken) {
      setAccessToken(storedToken);
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem(tk.user);
      }
    }

    setIsLoading(false);
  }, []);

  const login = (accessToken: string, user: UserProps): void => {
    // Guardar en localStorage
    localStorage.setItem(tk.access_token, accessToken);
    localStorage.setItem(tk.user, JSON.stringify(user));
    
    // Actualizar estado
    setAccessToken(accessToken);
    setUser(user);
  };

  const logout = (): void => {
    // Limpiar estado
    setUser(null);
    setAccessToken("");
    
    // Limpiar localStorage
    localStorage.removeItem(tk.access_token);
    localStorage.removeItem(tk.user);
    
    // Redirigir al login
    router.push("/login");
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return null;
  }

  return (
    <authContext.Provider value={{ accessToken, login, logout, user }}>
      {children}
    </authContext.Provider>
  );
}
