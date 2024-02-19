"use client";

import { useState } from "react";

interface MenuListProps {
  menuIcon: React.ReactNode;
  menuName: string;
  menuLink: string;
}

export function MenuList({ menuLink, menuIcon, menuName }: MenuListProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="flex">
      <a
        href={menuLink}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ textDecoration: "none" }}
        className="flex flex-1"
      >
        <div className="flex items-center my-2 gap-2">
          <div
            className={`p-2 rounded-xl ${
              isHovered
                ? "bg-yellow-700 text-gray-50"
                : "bg-gray-100 text-gray-500"
            } transition duration-200`}
          >
            {menuIcon}
          </div>
          <p
            className={`text-base ${
              isHovered ? "text-yellow-700" : "text-gray-500"
            } hidden lg:block transition duration-200`}
          >
            {menuName}
          </p>
        </div>
      </a>
    </div>
  );
}
