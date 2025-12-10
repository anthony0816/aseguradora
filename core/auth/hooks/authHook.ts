import { type AuthContextType, authContext } from "../consts/consts";
import { useContext } from "react";

export function useAuth(): AuthContextType {
  const context = useContext(authContext);
  if (!context)
    console.error(" useAuth hook most be called inside of the provider");
  return context;
}
