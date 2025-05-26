import { ReactNode } from "react";
import Navbar from "../shared/navbar/Navbar";
// import Footer from "../shared/Footer/Footer";
// import CryptoNavbar from "../shared/navbar/CryptoNavbar";
// import Footer from "../shared/Footer/Footer";
const WithCommonLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {/* <CryptoNavbar /> */}
      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default WithCommonLayout;
