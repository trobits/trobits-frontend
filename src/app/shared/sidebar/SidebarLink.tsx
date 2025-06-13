"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SidebarLink = ({
  label,
  icon,
  href,
}: {
  label: string;
  icon: StaticImageData;
  href: string;
}) => {
  const pathName = usePathname();
  return (
    <Link href={href} className="flex">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start  py-5 text-left text-sm font-medium text-black hover:bg-gray-100 ",
          pathName === href && "bg-gray-100 "
        )}
      >
        <Image
          width={20}
          height={20}
          className="mr-3"
          src={icon}
          alt={`icon of ${label}`}
        />
        {label}
      </Button>
    </Link>
  );
};

export default SidebarLink;
