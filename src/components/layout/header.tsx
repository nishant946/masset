"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Package } from "lucide-react";
import { signOut, useSession } from "../../lib/auth-client";
import { Button } from "../ui/button";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin: boolean = pathname === "/login";
  if (isLogin) {
    return null; // Don't render the header on the login page
  }

  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isAdminuser = user?.role === "admin";

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const getLinkClass = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return `text-sm font-medium transition-colors px-2 py-1 rounded-md ${
      isActive
        ? "text-teal-600 font-semibold bg-teal-50"
        : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
    }`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white shadow-sm">
      <div className="container flex flex-1 h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-teal-500">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-teal-600">mAsset</span>
          </Link>

          <nav className="flex items-center gap-4 ml-6">
            {!isPending && user && isAdminuser ? null : (
              <Link href="/gallery" className={getLinkClass("/gallery")}>
                Gallery
              </Link>
            )}

            {!isPending && user && !isAdminuser && (
              <>
                <Link
                  href="/dashboard/assets"
                  className={getLinkClass("/dashboard/assets")}
                >
                  Assets
                </Link>
                <Link
                  href="/dashboard/purchases"
                  className={getLinkClass("/dashboard/purchases")}
                >
                  My Purchases
                </Link>
              </>
            )}

            {!isPending && user && isAdminuser && (
              <>
                <Link
                  href="/admin/asset-approval"
                  className={getLinkClass("/admin/asset-approval")}
                >
                  Asset Approval
                </Link>
                <Link
                  href="/admin/settings"
                  className={getLinkClass("/admin/settings")}
                >
                  Settings
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center">
          {isPending ? null : user ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8 border border-slate-300">
                      <AvatarFallback className="bg-teal-500 text-white">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
                <DropdownMenuSeparator />
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
