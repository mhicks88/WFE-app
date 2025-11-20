"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Bottle } from "@/lib/types";

interface BottleSearchProps {
  bottles: Bottle[];
}

export default function BottleSearch({ bottles }: BottleSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Client-side filtering
  const filteredBottles = useMemo(() => {
    if (!searchQuery.trim()) {
      return bottles;
    }

    const query = searchQuery.toLowerCase();
    return bottles.filter((bottle) => {
      return (
        bottle.barrelCode.toLowerCase().includes(query) ||
        bottle.selectedFor?.toLowerCase().includes(query) ||
        bottle.city?.toLowerCase().includes(query) ||
        bottle.state?.toLowerCase().includes(query) ||
        bottle.mashbillType.toLowerCase().includes(query) ||
        bottle.labelName.toLowerCase().includes(query)
      );
    });
  }, [bottles, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-amber-400">
            Willett Single Barrel Lookup
          </h1>
          <p className="text-gray-400">
            Search and explore Willett Family Estate single barrel bottlings
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by barrel code, store name, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {filteredBottles.length} {filteredBottles.length === 1 ? "bottle" : "bottles"} found
          </p>
        </div>

        {/* Results Grid */}
        {filteredBottles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bottles found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-amber-500 hover:text-amber-400"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredBottles.map((bottle) => (
              <Link
                key={bottle.id}
                href={`/bottle/${bottle.id}`}
                className="block bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-amber-500 transition-colors duration-200"
              >
                {/* Barrel Code Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-amber-400">
                    #{bottle.barrelCode}
                  </h3>
                  {bottle.rating && (
                    <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded">
                      <span className="text-amber-400">★</span>
                      <span className="text-sm font-semibold">{bottle.rating}</span>
                    </div>
                  )}
                </div>

                {/* Mashbill Type */}
                <div className="mb-3">
                  <span className="inline-block bg-amber-900 bg-opacity-30 text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
                    {bottle.mashbillType}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  {bottle.proof && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Proof:</span>
                      <span className="text-gray-300 font-semibold">{bottle.proof}°</span>
                    </div>
                  )}

                  {bottle.selectedFor && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Selected for:</span>
                      <span className="text-gray-300 font-medium truncate ml-2">
                        {bottle.selectedFor}
                      </span>
                    </div>
                  )}

                  {bottle.city && bottle.state && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="text-gray-300">
                        {bottle.city}, {bottle.state}
                      </span>
                    </div>
                  )}

                  {bottle.ageStatement && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age:</span>
                      <span className="text-gray-300">{bottle.ageStatement}</span>
                    </div>
                  )}
                </div>

                {/* View Details Link */}
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <span className="text-amber-500 text-sm font-medium hover:text-amber-400">
                    View details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
