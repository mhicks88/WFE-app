"use client";

import { useState } from "react";
import Link from "next/link";
import type { BarrelDecodeResult } from "@/lib/types";

export default function BarrelDecoder() {
  const [barrelCode, setBarrelCode] = useState("");
  const [result, setResult] = useState<BarrelDecodeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barrelCode.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barrelCode: barrelCode.trim() }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error decoding barrel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setBarrelCode("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-amber-400">
            Willett Barrel Decoder
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Decode Willett Family Estate barrel codes
          </p>
          <p className="text-gray-500">
            Enter any barrel code to identify its classification using canonical WFE data
          </p>
        </div>

        {/* Decoder Form */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-8">
          <form onSubmit={handleDecode} className="space-y-6">
            <div>
              <label htmlFor="barrelCode" className="block text-sm font-medium text-gray-300 mb-2">
                Barrel Code
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="barrelCode"
                  value={barrelCode}
                  onChange={(e) => setBarrelCode(e.target.value)}
                  placeholder="e.g. 9081, 17123, 32145..."
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isLoading || !barrelCode.trim()}
                  className="px-8 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  {isLoading ? "Decoding..." : "Decode"}
                </button>
              </div>
            </div>
          </form>

          {result && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-amber-400">
                  Result for #{result.barrelCode}
                </h3>
                <button
                  onClick={handleClear}
                  className="text-sm text-gray-500 hover:text-gray-300"
                >
                  Clear
                </button>
              </div>

              {result.matched ? (
                <div className="space-y-4">
                  {/* Classification */}
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Classification</span>
                    <span className="inline-block bg-amber-900 bg-opacity-30 text-amber-300 px-4 py-2 rounded-full text-lg font-semibold">
                      {result.description}
                    </span>
                  </div>

                  {/* Pattern Label */}
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Barrel Range</span>
                    <span className="text-gray-100 text-lg font-medium font-mono">
                      {result.patternLabel}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-lg mb-2">No classification found</p>
                  <p className="text-gray-500 text-sm">This barrel code doesn't match any known WFE classification range</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/rules"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 font-semibold rounded-lg transition-colors duration-200 text-center"
          >
            Browse All Rules
          </Link>
          <Link
            href="/releases"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 font-semibold rounded-lg transition-colors duration-200 text-center"
          >
            Known Releases
          </Link>
        </div>

        {/* Quick Examples */}
        <div className="mt-12 bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-amber-400 mb-4">Try These Examples:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["9081", "17123", "20361", "32145", "8612", "4728"].map((code) => (
              <button
                key={code}
                onClick={() => {
                  setBarrelCode(code);
                  handleDecode({ preventDefault: () => {} } as React.FormEvent);
                }}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-700 border border-gray-600 rounded text-amber-400 font-mono transition-colors duration-200"
              >
                #{code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
