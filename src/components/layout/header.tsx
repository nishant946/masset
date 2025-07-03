'use client';

import { usePathname } from "next/navigation";


function Header() {
    const isLogin : boolean = usePathname() === "/login";
    if(isLogin) {
        return null; // Don't render the header on the login page
    }
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <img className="h-8 w-8" src="/logo.png" alt="Logo" />
                        </div>
                        <nav className="ml-10 flex items-baseline space-x-4">
                            {/* Navigation links can go here */}
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
export default Header;