"use client";
import { createContext, useContext, useState } from "react";

type NavbarVisibilityContextType = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

const NavbarVisibilityContext = createContext<NavbarVisibilityContextType>({
  isVisible: true,
  setIsVisible: () => {},
});

export const NavbarVisibilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <NavbarVisibilityContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </NavbarVisibilityContext.Provider>
  );
};

export const useNavbarVisibility = () => useContext(NavbarVisibilityContext);
