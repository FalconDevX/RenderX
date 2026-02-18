"use client"
import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRightIcon, Star } from "lucide-react"
import Stars from "./Stars"

const featureProducts = [
    {
        title: "Experience Next-Level Graphics – Power Meets Precision!",
        subtitle: "Limited Time Offer 40% Off",
        image: "/graphic-card.png",
        primaryButton: "Buy Now",
        secondaryButton: "Explore Deals",
    },
    {
        title: "Crystal Clear Audio – Hear Every Detail!",
        subtitle: "Exclusive Launch Discount 30% Off",
        image: "/graphic-card2.png",
        primaryButton: "Shop Now",
        secondaryButton: "Learn More",
    },
    {
        title: "Ultra-Fast GPUs – Performance You Deserve!",
        subtitle: "Special Offer for a Limited Time",
        image: "/graphic-card3.png",
        primaryButton: "Buy GPU",
        secondaryButton: "View Specs",
    },
    {
        title: "Ultra-Fast GPUs – Performance You Deserve!",
        subtitle: "Special Offer for a Limited Time",
        image: "/graphic-card4.png",
        primaryButton: "Buy GPU",
        secondaryButton: "View Specs",
    },
]

const FeatureProd = () => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [isSliding, setIsSliding] = useState(false)
    const [isPageVisible, setIsPageVisible] = useState(true)

    const products = [
        {
            title: "GeForce RTX 3060",
            description: "Next-gen graphics card delivering exceptional gaming performance.",
            price: "$299.99",
            image: "/feature_cards/GeForce-RTX-3060.jpg",
            rating: 4.5,
        },
        {
            title: "GeForce RTX 5070",
            description: "Experience unmatched speed and efficiency for modern gaming.",
            price: "$449.99",
            image: "/feature_cards/GeForce-RTX-5070.jpg",
            rating: 4.5,
        },
        {
            title: "Radeon RX 9060XT",
            description: "High-end performance with cutting-edge RDNA architecture.",
            price: "$499.99",
            image: "/feature_cards/Radeon-RX-9060XT.jpg",
            rating: 4.5,
        },
        {
            title: "RX 7800 XT",
            description: "Powerful GPU for immersive 4K gaming and rendering tasks.",
            price: "$399.99",
            image: "/feature_cards/RX-7800-XT.jpeg",
            rating: 3.8,
        },
        {
            title: "GeForce-RTX-3050",
            description: "Powerful GPU for immersive 4K gaming and rendering tasks.",
            price: "$399.99",
            image: "/feature_cards/GeForce-RTX-3050.jpg",
            rating: 4.5,
        },
        {
            title: "GeForce-RTX-3050",
            description: "Powerful GPU for immersive 4K gaming and rendering tasks.",
            price: "$399.99",
            image: "/feature_cards/GeForce-RTX-3050.jpg",
            rating: 4.5,
        }
    ]

    const nextProduct = useCallback(() => {
        if (isSliding) return
        setIsSliding(true)
        setTimeout(() => {
            setCurrentSlideIndex((prev) => (prev + 1) % featureProducts.length)
            setIsSliding(false)
        }, 500)
    }, [isSliding])

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPageVisible(!document.hidden)
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [])

    useEffect(() => {
        if (!isPageVisible) return
        const interval = setInterval(nextProduct, 5000)
        return () => clearInterval(interval)
    }, [isPageVisible, nextProduct])

    return (
        
        <div className="flex justify-center px-12 sm:px-16 md:px-24 overflow-y-auto flex-col mt-5">
            <div className="w-full bg-[#282C30] shadow-lg rounded-lg relative min-h-[420px] md:h-[440px] overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                        transform: `translateX(-${currentSlideIndex * 100}%)`,
                    }}
                >
                    {featureProducts.map((product, index) => (
                        <div
                            key={index}
                            className="min-w-full flex flex-col md:flex-row justify-between items-center px-6 sm:px-10 md:px-12 py-10"
                        >
                            <div className="flex flex-col gap-4 max-w-lg">
                                <h3 className="text-orange-500">{product.subtitle}</h3>
                                <h1 className="text-3xl md:text-4xl font-semibold leading-snug">
                                    {product.title}
                                </h1>
                                <div className="flex flex-row gap-4 items-center mt-4">
                                    <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-10 py-3 w-40 rounded-md font-medium cursor-pointer">
                                        {product.primaryButton}
                                    </button>
                                    <button className="flex items-center justify-center gap-2 text-pink-500 font-medium cursor-pointer border-2 border-pink-500 rounded-lg pl-3 py-3 w-40 whitespace-nowrap">
                                        {product.secondaryButton}
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <motion.div
                                initial={{ transform: "translateZ(-10px) translateY(20px)" }}
                                animate={{ transform: "translateZ(30px) translateY(-20px)" }}
                                transition={{
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                    duration: 2,
                                    ease: "easeInOut",
                                }}
                                className="relative w-[280px] h-[380px] min-w-[220px] min-h-[260px]"
                            >
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-contain transition-transform duration-700 ease-in-out"
                                />
                            </motion.div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
                    {featureProducts.map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlideIndex
                                ? "bg-orange-500 scale-110"
                                : "bg-gray-500/50"
                                }`}
                        ></div>
                    ))}
                </div>
            </div>
            
            <div className="w-fit mx-auto text-center pt-4 pb-4">
                <h1 className="text-white text-2xl font-semibold pb-2">
                    Our Best Products
                </h1>
                <div className="h-[3px] w-30 bg-gradient-to-r from-orange-500 to-amber-300 rounded-full mx-auto"></div>
            </div>

            <div className="w-full h-auto bg-[#1e2227] flex items-center justify-center p-6 py-5 px-5">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] auto-cols-fr gap-6 w-full">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="bg-[#2b2f34] rounded-xl shadow-md border border-black/30 overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                            <div className="relative w-full aspect-[1/1] flex items-center justify-center bg-white">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-contain p-6"
                                />
                            </div>

                            <div className="p-4 flex flex-col gap-1">
                                <h3 className="text-white text-lg font-semibold">
                                    {product.title}
                                </h3>
                                <p className="text-gray-300 text-sm line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex flex-col justify-between items-start gap-2 mt-2">
                                    <p className="text-white font-bold text-xl leading-none">
                                        {product.price}
                                    </p>
                                    <div className="flex flex-row gap-1.5 translate-y-[1px]">
                                        <Stars rating={product.rating} />
                                    </div>
                                </div>
                                <button className="mt-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 rounded-md font-medium hover:scale-105 transition-transform cursor-pointer">
                                    Buy now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default FeatureProd
