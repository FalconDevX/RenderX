"use client"
import React from "react"
import Header from "./Header"
import Product from "./Product"
import { ChevronDownIcon } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { API_URL } from "@/api/auth.api"
import { InlineSpinner } from "@/components/Spinner"

interface ProductData {
    id: number;
    name: string;
    price: number;
    rating: number;
    image?: string;
    brand?: string;
    category?: string;
    description?: string;
    stock?: number;
    is_available?: boolean;
}

const Products = () => {
    const [selectedSortOption, setSelectedSortOption] = useState('most_relevant')
    const [isSortPanelOpen, setIsSortPanelOpen] = useState(false)
    const [products, setProducts] = useState<ProductData[]>([])
    const [loading, setLoading] = useState(false)
    
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])
    const [availability, setAvailability] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("")

    const MIN = 10;
    const MAX = 10000;
    const [priceRange, setPriceRange] = useState([180, 1000]);
    const [committedPriceRange, setCommittedPriceRange] = useState([180, 1000]);
    const [minInput, setMinInput] = useState("180");
    const [maxInput, setMaxInput] = useState("1000");

    function validateMin() {
        let num = Number(minInput);

        if (isNaN(num)) num = priceRange[0];
        num = Math.max(MIN, Math.min(num, priceRange[1]));

        setMinInput(num.toString());
        setPriceRange([num, priceRange[1]]);
    }

    function validateMax() {
        let num = Number(maxInput);

        if (isNaN(num)) num = priceRange[1];
        num = Math.min(MAX, Math.max(num, priceRange[0]));

        setMaxInput(num.toString());
        setPriceRange([priceRange[0], num]);
    }

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            
            if (selectedCategory) {
                params.append('category', selectedCategory);
            }
            if (committedPriceRange[0] > MIN) {
                params.append('min_price', committedPriceRange[0].toString());
            }
            if (committedPriceRange[1] < MAX) {
                params.append('max_price', committedPriceRange[1].toString());
            }

            const url = `${API_URL}/productsearch/${params.toString() ? '?' + params.toString() : ''}`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Failed to fetch products');
            
            let data: ProductData[] = await response.json();
            
            if (selectedBrands.length > 0) {
                data = data.filter(product => 
                    product.brand && selectedBrands.includes(product.brand)
                );
            }
            
            if (availability.length > 0) {
                data = data.filter(product => {
                    if (availability.includes('in_stock') && product.stock && product.stock > 0) return true;
                    if (availability.includes('out_of_stock') && (!product.stock || product.stock === 0)) return true;
                    if (availability.includes('pre_order') && product.is_available === false) return true;
                    return false;
                });
            }
            
            if (selectedSortOption === 'ascending') {
                data.sort((a, b) => a.price - b.price);
            } else if (selectedSortOption === 'descending') {
                data.sort((a, b) => b.price - a.price);
            } else if (selectedSortOption === 'best_opinions') {
                data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            }
            
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, committedPriceRange, selectedBrands, availability, selectedSortOption]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleBrandChange = (brand: string, checked: boolean) => {
        if (checked) {
            setSelectedBrands(prev => [...prev, brand]);
        } else {
            setSelectedBrands(prev => prev.filter(b => b !== brand));
        }
    };

    const sortPanelOptions = [
        {
            name: 'most_relevant',
            value: 'Od najtrafniejszych'
        },
        {
            name: 'ascending',
            value: 'Rosnąco'
        },
        {
            name: 'descending',
            value: 'Malejąco'
        },
        {
            name: 'best_opinions',
            value: 'Najlepsze opinie'
        }
    ]

    return (
        <div>
            <Header />
            <div className="flex flex-row items-start justify-center w-full max-w-6xl mx-auto mt-5 gap-5 z-10">
                <div className="w-1/4 h-150 items-start justify-center border border-gray-700 rounded-md hidden md:block">
                    <h1 className="text-white text-2xl p-3">Filters</h1>
                    <h2 className="text-white text-lg pl-3 pb-2">Manufacturer</h2>
                    <div className="flex flex-col gap-2 pl-1">
                        <div className="flex flex-row gap-2 pl-2 items-center">
                            <Checkbox 
                                id="manufacturer1" 
                                name="manufacturer1" 
                                className="size-5 cursor-pointer border-gray-500 data-[state=checked]:bg-orange-500 rounded-sm"
                                checked={selectedBrands.includes('AMD')}
                                onCheckedChange={(checked) => handleBrandChange('AMD', checked as boolean)}
                            />
                            <label htmlFor="manufacturer1" className="cursor-pointer text-sm">AMD</label>
                        </div>
                        <div className="flex flex-row gap-2 pl-2 items-center">
                            <Checkbox 
                                id="manufacturer2" 
                                name="manufacturer2" 
                                className="size-5 cursor-pointer border-gray-500 data-[state=checked]:bg-orange-500 rounded-sm"
                                checked={selectedBrands.includes('Intel')}
                                onCheckedChange={(checked) => handleBrandChange('Intel', checked as boolean)}
                            />
                            <label htmlFor="manufacturer2" className="cursor-pointer text-sm">Intel</label>
                        </div>
                        <div className="flex flex-row gap-2 pl-2 items-center">
                            <Checkbox 
                                id="manufacturer3" 
                                name="manufacturer3" 
                                className="size-5 cursor-pointer border-gray-500 data-[state=checked]:bg-orange-500 rounded-sm"
                                checked={selectedBrands.includes('NVIDIA')}
                                onCheckedChange={(checked) => handleBrandChange('NVIDIA', checked as boolean)}
                            />
                            <label htmlFor="manufacturer3" className="cursor-pointer text-sm">NVIDIA</label>
                        </div>
                    </div>
                    <h2 className="text-white text-lg pl-3 pt-2">Price</h2>
                    <div className="px-3 pb-3">
                        <div className="mb-2 ">
                            <p className="text-gray-400 text-sm pb-2">Set your budget range</p>
                            <div className="flex flex-row gap-3">
                                <Input 
                                    type="text" 
                                    value={minInput} 
                                    onChange={(e) => setMinInput(e.target.value)} 
                                    onBlur={() => {
                                        validateMin();
                                        setCommittedPriceRange(priceRange);
                                    }} 
                                    className="w-1/2 mb-1" 
                                />

                                <Input 
                                    type="text" 
                                    value={maxInput} 
                                    onChange={(e) => setMaxInput(e.target.value)} 
                                    onBlur={() => {
                                        validateMax();
                                        setCommittedPriceRange(priceRange);
                                    }} 
                                    className="w-1/2" 
                                />
                            </div>
                        </div>

                        <Slider
                            value={priceRange}
                            onValueChange={(values) => {
                                setPriceRange(values);
                                setMinInput(values[0].toString());
                                setMaxInput(values[1].toString());
                            }}
                            onValueCommit={(values) => {
                                setCommittedPriceRange(values);
                                setPriceRange(values);
                                setMinInput(values[0].toString());
                                setMaxInput(values[1].toString());
                            }}
                            min={MIN}
                            max={MAX}
                            step={10}
                            className="w-full"
                        />
                    </div>
                    <h2 className="text-white text-lg pl-3 pt-2 pb-3">Availability</h2>
                    <div className="px-3 pb-3">
                        <ToggleGroup 
                            type="multiple" 
                            variant="outline" 
                            spacing={2} 
                            size="sm" 
                            className="flex flex-row gap-2 flex-wrap"
                            value={availability}
                            onValueChange={(values) => {
                                setAvailability(values);
                            }}
                        >
                            <ToggleGroupItem value="in_stock">In Stock</ToggleGroupItem>
                            <ToggleGroupItem value="out_of_stock">Out of Stock</ToggleGroupItem>
                            <ToggleGroupItem value="pre_order">Pre Order</ToggleGroupItem>
                            <ToggleGroupItem value="back_order">Back Order</ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>

                <div className="w-full md:w-3/5 flex flex-col justify-center border-t border-gray-700">
                    <fieldset onClick={() => setIsSortPanelOpen(!isSortPanelOpen)} className=" self-start w-4/13 border border-gray-500 rounded-md pl-3 pr-2 pt-1 pb-2 text-white mt-1 mb-3 relative cursor-pointer">
                        <legend className="px-2 text-sm text-gray-400">Sortowanie</legend>

                        <div className="flex justify-between items-center text-xs">
                            <span>{sortPanelOptions.find(option => option.name === selectedSortOption)?.value}</span>
                            <ChevronDownIcon className="w-4 h-4" />

                            {isSortPanelOpen && (
                                <motion.div transition={{ duration: 0.2 }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 w-full bg-gray-800 rounded-md shadow-md mt-2 z-10">
                                    {sortPanelOptions.map((option, idx) => (
                                        <div 
                                            key={option.name} 
                                            onClick={() => {
                                                setSelectedSortOption(option.name);
                                                setIsSortPanelOpen(false);
                                            }}
                                            className={`p-2 hover:bg-gray-700 cursor-pointer ${idx === sortPanelOptions.length - 1 ? 'rounded-b-md' : ''}
                                        `}>
                                            {option.value}
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                        </div>
                    </fieldset>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <InlineSpinner size={80} />
                        </div>
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <Product
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                rating={product.rating || 0}
                                image={product.image}
                                brand={product.brand}
                                category={product.category}
                            />
                        ))
                    ) : (
                        <div className="text-white text-center py-10">No products found</div>
                    )}
                </div>
            </div>
        </div>

    )
}

export default Products