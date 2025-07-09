// app/login/page.tsx
import { LoginForm } from "./loginForm";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

async function LoginPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (session) redirect('/');

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back to Home Link */}
                <div className="mb-8">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                            <Package className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 mt-2">
                            Sign in to access your digital assets
                        </CardDescription>
                    </CardHeader>
                    
                    <LoginForm />
                    
                    <CardFooter className="text-center flex justify-center pt-6">
                        <p className="text-sm text-gray-500">
                            New to mAsset?{' '}
                            <Link href="/" className="text-teal-600 hover:text-teal-700 font-medium">
                                Explore our gallery
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Secure authentication powered by Google
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;