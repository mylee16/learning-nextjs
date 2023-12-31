"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "react-hot-toast"; 

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",})
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [forgotPasswordStatus, setForgotPasswordStatus] = React.useState(false);

    const onLogin = async() => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login success");

            router.push("/profile");
        }

        catch (error:any) {
            console.log("Login failed", error.message);
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    const forgotPassword = async() => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/forgotPasswordEmail", user);
            console.log("Forgot password - Email sent", response.data);
            toast.success("Forgot password - Email sent");
            setForgotPasswordStatus(true);

        }

        catch (error:any) {
            console.log("Login failed", error.message);
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (user.email.length>0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    });

    return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>{loading ? "Processing" : "Login"}</h1>
        <hr />

        <label htmlFor="email">email</label>
        <input
        className="p-2 border border-gray-300 rounded-lg mb-4 
        focus:outline-None focus:border-gray-600 text-black"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="email"
            />

        <label htmlFor="password">password</label>
            <input
            className="p-2 border border-gray-300 rounded-lg mb-4 
            focus:outline-None focus:border-gray-600 text-black"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
                placeholder="password"
            />

        <h1>{forgotPasswordStatus? "Forgot Password Email Sent, check your email": ""}</h1>

        <button
            onClick={onLogin}
        className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
            Login here
        </button>

        <button
            onClick={forgotPassword}
        className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
            Forgot password
        </button>



        <Link href="/signup">
                Visit Signup page
        </Link>

    </div>
    )
}

