'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/api/useAuth.store'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

import Google from '@/public/social_icons/google-icon.png'
import Github from '@/public/social_icons/github-icon.png'
import Facebook from '@/public/social_icons/facebook-icon.png'

const Login = () => {
    const router = useRouter()
    const login = useAuth((state) => state.login)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string>("")

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(""); 
        try {
            await login(email, password)
            router.push('/')
            console.log("Login successful")
        } catch (error: any) {
            const errorData = error?.response?.data;

            if (errorData) {
                if (errorData.error) {
                    setError(errorData.error);
                } else if (errorData.email && Array.isArray(errorData.email)) {
                    setError(errorData.email[0] || "Invalid email");
                } else if (errorData.password && Array.isArray(errorData.password)) {
                    setError(errorData.password[0] || "Invalid password");
                } else if (errorData.detail) {
                    setError(errorData.detail);
                } else if (errorData.message) {
                    setError(errorData.message);
                } else if (typeof errorData === 'string') {
                    setError(errorData);
                } else {
                    const firstErrorKey = Object.keys(errorData)[0];
                    if (firstErrorKey && Array.isArray(errorData[firstErrorKey])) {
                        setError(errorData[firstErrorKey][0]);
                    } else {
                        setError("Invalid email or password");
                    }
                }
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Invalid email or password");
            }
        }
    };
    
    return (
        <form onSubmit={handleLogin} className="min-w-[400px] h-[600px] my-40 flex flex-col justify-center items-start text-white px-10 py-20 bg-[#1A1D21] rounded-md shadow-[0_0_30px_rgba(255,255,255,0.1)] ">
            <h1 className="text-3xl font-semibold mb-4">Welcome Back</h1>

            <input
                type="email"
                placeholder="Email"
                className="w-full mb-4 px-4 py-2 rounded-md bg-[#131313] border border-[#414141] focus:outline-none focus:ring-1 focus:ring-white/50 font-light"
                value={email}
                onChange={(event) => {
                    setEmail(event.target.value);
                    setError(""); 
                }}
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full mb-4 px-4 py-2 rounded-md bg-[#131313] border border-[#414141] focus:outline-none focus:ring-1 focus:ring-white/50 font-light"
                value={password}
                onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                }}
            />
            {error && (
                <div className="w-full mb-4 px-4 py-2 rounded-md bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                    {error}
                </div>
            )}
            <p className="w-full text-sm text-gray-400 text-center mb-4">
                Forgot your password?{' '}
                <Link href="/resetpassword" className="text-pink-400 hover:text-pink-300">
                    Reset password
                </Link>
            </p>

            <button className="bg-[linear-gradient(to_bottom_right,theme(colors.yellow.300),theme(colors.orange.400),theme(colors.pink.500),theme(colors.fuchsia.700))] hover:brightness-110 hover:scale-[1.03] transition-all text-white px-6 py-3 rounded-md font-semibold shadow-[0_0_25px_rgba(255,100,80,0.4)] cursor-pointer w-full duration-400">
                Login
            </button>

            <div className="flex items-center justify-center w-full my-4">
                <span className="flex-grow h-px bg-white/20"></span>
                <span className="mx-3 text-gray-400 text-sm font-medium">LUB</span>
                <span className="flex-grow h-px bg-white/20"></span>
            </div>

            <button className="w-full mb-4 px-4 py-2 rounded-md bg-[#181818] border border-[#414141] focus:outline-none focus:ring-1 focus:ring-white/50 font-normal text-white flex items-center justify-center gap-3 hover:bg-[#1F1F1F] transition-all duration-300 cursor-pointer">
                <Image src={Facebook} alt="Facebook logo" width={20} height={20} className="rounded-sm" />
                Continue with Facebook
            </button>

            <button className="w-full mb-4 px-4 py-2 rounded-md bg-[#181818] border border-[#414141] focus:outline-none focus:ring-1 focus:ring-white/50 font-normal text-white flex items-center justify-center gap-3 hover:bg-[#1F1F1F] transition-all duration-300 cursor-pointer">
                <Image src={Google} alt="Google logo" width={20} height={20} className="rounded-sm" />
                Continue with Google
            </button>

            <button className="w-full mb-4 px-4 py-2 rounded-md bg-[#181818] border border-[#414141] focus:outline-none focus:ring-1 focus:ring-white/50 font-normal text-white flex items-center justify-center gap-3 hover:bg-[#1F1F1F] transition-all duration-300 cursor-pointer">
                <Image src={Github} alt="Github logo" width={20} height={20} className="rounded-sm" />
                Continue with Github
            </button>

            <p className="w-full text-sm text-gray-400 text-center mb-4">
                Don't have an account yet?{' '}
                <Link href="/register" className="text-pink-400 hover:text-pink-300">
                    Sign up
                </Link>
            </p>
        </form >
    )
}

export default Login
