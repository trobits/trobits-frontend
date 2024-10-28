import { ReactNode } from "react";
import Navbar from "../shared/navbar/Navbar";
import CryptoNavbar from "../shared/navbar/CryptoNavbar";
const WithCommonLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      <CryptoNavbar />
      {children}
    </div>
  );
};

export default WithCommonLayout;
