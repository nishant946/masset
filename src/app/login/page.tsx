// app/login/page.tsx
import { LoginForm } from "./loginForm";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
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
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Card className="bg-white p-8 rounded shadow-md w-96">
                <CardHeader className="w-full max-w-md">
                    <div className="mx-auto p-2 rounded-full bg-teal-500 w-fit">
                        <Package className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-center text-2xl font-bold mt-4">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 mt-2">
                        Sign in to your account
                    </CardDescription>
                </CardHeader>
                <LoginForm /> {/* Replaced CardContent with LoginForm */}
                <CardFooter className="text-center flex justify-center mt-4">
                    <p className="text-sm flex justify-center text-gray-500">
                        <Link href="/" className="text-teal-500 hover:underline">Back to home</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
export default LoginPage;