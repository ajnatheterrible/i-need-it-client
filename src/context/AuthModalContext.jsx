import { createContext, useContext } from "react";

export const AuthModalContext = createContext();

export const useAuthModal = () => {
  return useContext(AuthModalContext);
};
