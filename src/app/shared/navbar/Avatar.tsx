import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { Button } from "@/components/ui/button";

const Avatar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside of the dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // Add event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="text-base font-medium text-black"
      >
        Joe Biden
        <IoIosArrowDown className="ml-2 text-primary text-base" />
      </Button>
      <div
        style={{
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
        }}
        className="absolute top-10 flex justify-center items-center duration-150 w-[120px] right-0 bg-white shadow-md rounded-b-md"
      >
        <div className="p-3">
          <Button
            variant="ghost"
            className="text-base font-medium text-black flex items-center gap-2"
          >
            <TbLogout />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
