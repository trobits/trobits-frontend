// layout.tsx
"use client";

import { ReactNode } from "react";
import Navbar from "../shared/navbar/Navbar";
import { NavbarVisibilityProvider, useNavbarVisibility } from "@/provider/navbarVisibility"; // adjust path if needed

const WithCommonLayout = ({ children }: { children: ReactNode }) => {
  return (
    <NavbarVisibilityProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </NavbarVisibilityProvider>
  );
};

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const { isVisible } = useNavbarVisibility();

  return (
    <div>
      {isVisible && <Navbar />}
      {children}
    </div>
  );
};

export default WithCommonLayout;
