"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "@/lib/auth-client";

function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const getLinkClass = (path: string) => {
    return `text-sm font-medium transition-colors hover:text-teal-600 ${
      pathname === path ? "text-teal-600" : "text-gray-600"
    }`;
  };

  const isAdminuser = session?.user?.role === "admin";

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to home page after successful logout
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback redirect
      router.push("/");
    }
  };

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

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
            {/* Show Gallery for everyone except admins on admin pages */}
            {!isPending && session?.user && isAdminuser ? null : (
              <Link href="/gallery" className={getLinkClass("/gallery")}>
                Gallery
              </Link>
            )}

            {/* Regular user navigation */}
            {!isPending && session?.user && !isAdminuser && (
              <>
                <Link
                  href="/dashboard/assets"
                  className={getLinkClass("/dashboard/assets")}
                >
                  My Assets
                </Link>
                <Link
                  href="/dashboard/purchases"
                  className={getLinkClass("/dashboard/purchases")}
                >
                  My Purchases
                </Link>
                <Link
                  href="/dashboard/profile"
                  className={getLinkClass("/dashboard/profile")}
                >
                  Profile
                </Link>
              </>
            )}

            {/* Admin navigation */}
            {!isPending && session?.user && isAdminuser && (
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

        <div className="flex items-center gap-4">
          {!isPending && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user.name && (
                      <p className="font-medium">{session.user.name}</p>
                    )}
                    {session.user.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {session.user.email}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground capitalize">
                      {session.user.role || "user"}
                    </p>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link href={isAdminuser ? "/admin/settings" : "/dashboard/profile"} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>{isAdminuser ? "Admin Panel" : "Profile"}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
