import React from "react";
import fileIcon from "@/assets/icons/file.png";
import uploadIcon from "@/assets/icons/upload-cloud.png";
import preference from "@/assets/icons/tasks-svgrepo-com.png";
import starred from "@/assets/icons/tasks-svgrepo-com.png";
import user from "@/assets/icons/user.png";
import SidebarLink from "./SidebarLink";
import { StaticImageData } from "next/image";

interface NavItem {
  icon: StaticImageData;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: user, label: "Profile", href: "/" },
  { icon: fileIcon, label: "Position Description", href: "/position" },
  { icon: uploadIcon, label: "Upload Candidates", href: "/upload" },
  { icon: preference, label: "Preference Factors", href: "/preferences" },
  { icon: starred, label: "Starred Candidate", href: "/starred" },
];

const Sidebar = () => {
  return (
    <nav className="h-full bg-white shadow-md  hidden w-[208px] xl:block ">
      <ul className="space-y-2 py-4 px-2">
        {navItems.map((item, index) => (
          <li key={index}>
            <SidebarLink {...item} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
