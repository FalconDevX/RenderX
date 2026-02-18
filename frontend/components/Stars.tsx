"use client";

import React from "react";
import { Star } from "lucide-react";

interface StarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
}

const Stars: React.FC<StarsProps> = ({ rating, maxRating = 5, size = 20 }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i + 1 <= Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            size={size}
            className={
              filled
                ? "text-orange-500 fill-orange-500"
                : half
                ? "text-orange-500 fill-orange-500/30"
                : "text-gray-600"
            }
          />
        );
      })}
      <span className="text-gray-400 text-sm ml-1">
        {(rating ?? 0).toFixed(1)}
      </span>
    </div>
  );
};

export default Stars;
