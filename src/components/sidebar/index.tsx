"use client";

import {
  Bookmark,
  Download,
  Home,
  Pencil,
  PlaySquare,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";
import { MenuList } from "./menulist";

export function Sidebar() {
  const menuItems = [
    { link: "/", name: "Início", icon: <Home className="size-5"/> },
    { link: "/blog", name: "Blog", icon: <Pencil className="size-5"/> },
    { link: "/cursos", name: "Cursos", icon: <PlaySquare className="size-5"/> },
    { link: "/loja", name: "Loja", icon: <ShoppingCart className="size-5"/> },
    { link: "/evangelho", name: "Evangelho", icon: <Bookmark className="size-5"/> },
    { link: "/downloads", name: "Downloads", icon: <Download className="size-5"/> },
    { link: "/users", name: "Usuários", icon: <User className="size-5"/> },
    { link: "/configuracoes", name: "Configurações", icon: <Settings className="size-5"/> },
  ];

  return (
    <div className="flex flex-1 m-8 max-w-3 gap-6	">
      <div className="">
        {/* <p className="text-sm text-zinc-600 text-center">
          MENU
        </p> */}
        {menuItems.map((menuItem, index) => (
          <MenuList
            key={index}
            menuLink={menuItem.link}
            menuName={menuItem.name}
            menuIcon={menuItem.icon}
          />
        ))}
      </div>
    </div>
  );
}
