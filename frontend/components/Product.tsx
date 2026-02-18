import React from 'react'
import Stars from './Stars'
import { useProductStore } from '@/api/useProductStore'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/api/useCartStore'
import { ShoppingCart } from 'lucide-react'

interface ProductProps {
    id: number;
    name: string;
    price: number;
    rating: number;
    image?: string;
    brand?: string;
    category?: string;
    description?: string;
}

const Product = ({ id, name, price, rating, image, brand, category }: ProductProps) => {
    const router = useRouter()
    const setSelectedProductId = useProductStore((state) => state.setSelectedProductId)
    const addItem = useCartStore((state) => state.addItem)

    const handleClick = () => {
        setSelectedProductId(id)
        router.push('/productdetails')
    }

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation(); 
        await addItem({
            id,
            productId: id,
            name,
            price,
            image
        });
    }

    return (
        <div 
            onClick={handleClick}
            className="flex flex-row w-full h-[170px] px-4 gap-5 items-center border-t border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors"
        >
            <img
                className="w-[150px] h-[150px] object-contain bg-gray-800 rounded-md"
                src={image || "/placeholder_graphiccard.png"}
                alt={name}
            />

            <div className="flex flex-row justify-between flex-1 w-full self-start">
                <div>
                    <h1 className="text-white text-lg self-start mt-1">{name}</h1>
                    <Stars rating={rating || 0} size={16} />
                    <div className="flex flex-col gap-2 mt-4 text-sm">
                        {brand && <p><span className="text-gray-400">Brand:</span> {brand}</p>}
                        {category && <p><span className="text-gray-400">Category:</span> {category}</p>}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="text-white text-lg self-start mt-1">
                        <h1>{price} zł</h1>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-md hover:opacity-90 transition-opacity text-sm cursor-pointer"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Product