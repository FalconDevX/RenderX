import React, { useEffect, useState } from "react";
import { API_URL } from "../api/auth.api";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/api/useProductStore";

const Search = () => {
  const setSelectedProductId = useProductStore(
    (state) => state.setSelectedProductId
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const delay = setTimeout(async () => {
      try {
        const response = await fetch(
          `${API_URL}/productsearch/?name=${query}`,
          {
            signal: controller.signal,
          }
        );
        if (!response.ok) throw new Error("Błąd zapytania");
        const data = await response.json();
        console.log(data);
        setResults(data);
      } catch (error: any) {
        if (error.name !== "AbortError") console.error(error);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="flex flex-row items-start justify-center w-full py-4 gap-4 bg-[#1e2227]">
      <div className="relative w-[50%]">
        <input
          onChange={handleSearch}
          value={query}
          type="search"
          placeholder="Search..."
          className="w-full px-4 py-2 text-white rounded-lg ring-1 ring-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-300 cursor-pointer text-xl"
          >
            ×
          </button>
        )}
        {results.length > 0 && (
          <div className="absolute left-0 w-full mt-2 z-50 rounded-lg overflow-hidden">
            <ul className="bg-neutral-900 border border-gray-700 max-h-60 overflow-y-auto">
              {results.map((item: any) => (
                <li
                  key={item.id}
                  onClick={() => {
                    setSelectedProductId(item.id);
                    router.push(`/productdetails`);
                  }}
                  className="p-2 hover:bg-[#282C30] cursor-pointer"
                >
                  <span>{item.name}</span>{" "}
                  <span className="text-sm text-gray-400 ml-1">{item.price} zł</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white font-medium px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 cursor-pointer">
        Search
      </button>
    </div>
  );
};

export default Search;
