import {signIn} from "@/lib/auth-client";

import {Button} from "@/components/ui/button";

function LoginButton() {

    const handleLogin = async () => {
        console.log("DATABASE_URL:", process.env.DATABASE_URL);
        await signIn.social({
            provider: 'google',
            callbackURL:"/",
        })
    };

    return (
        <Button onClick={handleLogin} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded">
            Sign in with Google
        </Button>
    );
}

export default LoginButton;