// Import necessary components and styles
"use client"
import { ModeToggle } from "@/components/parts/ModToggle";
import {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

// Navbar component
export default function Navbar(): JSX.Element {
  return (
    <div className="flex justify-between ">
      <NavigationMenu>
        <NavigationMenuList className="w-screen flex items-center justify-between p-4 ">
          {/* Logo on the left */}
          <NavigationMenuItem>
            <Link href="#" passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Logo
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {/* Other content on the right */}
          <div className="flex items-center ml-auto">
            {/* ModeToggle */}
            <NavigationMenuItem className="p-2">
              <ModeToggle />
            </NavigationMenuItem>
            
            {/* Login/SignUp */}
            <NavigationMenuItem>
              <Link href="#" passHref>
                <NavigationMenuLink className={` pr-2 ${navigationMenuTriggerStyle()}`}>
                  Login/SignUp
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
