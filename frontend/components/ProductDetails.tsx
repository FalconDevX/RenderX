"use client";

import React, { useEffect } from "react";
import Header from "./Header";
import Image from "next/image";
import {useProductStore} from "@/api/useProductStore"
import {useState} from "react";
import {API_URL} from "@/api/auth.api"
import Stars from "./Stars";

const ProductDetails = () => {
  const productId = useProductStore((state) => state.selectedProductId)
  const [product, setProduct] = useState<any>(null)

  useEffect(()=> {
    if(!productId) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${productId}`);
        const data = await res.json()
        setProduct(data)
      }
      catch (err){
        console.error(err);
      }
    }
    fetchProduct()

  }, [productId])

  return (
    <div className="flex flex-col min-h-screen bg-[#111318] text-white">
      <Header />
      <div className="flex flex-col md:flex-row justify-center items-center flex-grow gap-10 px-10 py-10">
        {/* Left: Product Image*/}
        <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
          <div className="bg-[#1A1C22] rounded-lg p-4">
            <Image
              src={product?.image || "/placeholder_graphiccard.png"}
              alt={product?.name || "Product image"}
              width={400}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
        </div>

        {/* Right product info */}
        <div className="flex flex-col w-full md:w-1/3 gap-4">
          <h1 className="text-3xl font-semibold">{product?.name}</h1>
          <div className="flex items-center gap-2">
            <Stars rating={product?.rating} />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {product?.description}
          </p>

          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-bold">{product?.price} zł</span>
            {/* <span className="text-gray-500 line-through">$599.99</span> */}
          </div>

          <div className="flex flex-col gap-2 mt-4 text-sm">
            <p><span className="text-gray-400">Brand:</span> Generic</p>
            <p><span className="text-gray-400">Color:</span> Multi</p>
            <p><span className="text-gray-400">Category:</span> Accessories</p>
          </div>

          <div className="flex gap-4 mt-6">
            <button className="w-1/2 py-3 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer">
              Add to Cart
            </button>
            <button className="w-1/2 py-3 rounded-md bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:opacity-90 transition-opacity cursor-pointer">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
