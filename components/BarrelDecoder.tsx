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
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-amber-400">
            Willett Barrel Decoder
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Searchable database of Willett Family Estate barrel classifications
          </p>
          <p className="text-gray-500">
            Enter any Willett distillate barrel code to see mashbill details, grain percentages, and tasting notes
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
                  placeholder="e.g. 9081, 4728, 32145..."
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-amber-400">
                  Barrel #{result.barrelCode}
                </h3>
                <button
                  onClick={handleClear}
                  className="text-sm text-gray-500 hover:text-gray-300"
                >
                  Clear
                </button>
              </div>

              {result.matched && result.mashbill ? (
                <div className="space-y-6">
                  {/* Mashbill Name & Whiskey Type */}
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-amber-300 mb-2">
                          {result.mashbill.displayName}
                        </h4>
                        <p className="text-gray-400 text-lg capitalize">
                          {result.mashbill.whiskeyType}
                        </p>
                      </div>
                      <span className="inline-block bg-amber-900 bg-opacity-30 text-amber-400 px-4 py-2 rounded-full text-sm font-semibold uppercase">
                        {result.mashbill.status}
                      </span>
                    </div>

                    {/* Grain Bill */}
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-400 uppercase mb-3">Grain Bill</h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-gray-800 rounded p-3 text-center">
                          <div className="text-2xl font-bold text-amber-400">{result.mashbill.grainBill.corn}%</div>
                          <div className="text-xs text-gray-500 uppercase">Corn</div>
                        </div>
                        <div className="bg-gray-800 rounded p-3 text-center">
                          <div className="text-2xl font-bold text-amber-400">{result.mashbill.grainBill.rye}%</div>
                          <div className="text-xs text-gray-500 uppercase">Rye</div>
                        </div>
                        <div className="bg-gray-800 rounded p-3 text-center">
                          <div className="text-2xl font-bold text-amber-400">{result.mashbill.grainBill.wheat}%</div>
                          <div className="text-xs text-gray-500 uppercase">Wheat</div>
                        </div>
                        <div className="bg-gray-800 rounded p-3 text-center">
                          <div className="text-2xl font-bold text-amber-400">{result.mashbill.grainBill.maltedBarley}%</div>
                          <div className="text-xs text-gray-500 uppercase">Malted Barley</div>
                        </div>
                      </div>
                    </div>

                    {/* Entry Proof & Source */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500 block mb-1">Entry Proof</span>
                        <span className="text-xl font-semibold text-gray-100">
                          {result.mashbill.entryProof ? `${result.mashbill.entryProof} proof` : "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block mb-1">Source Distillery</span>
                        <span className="text-xl font-semibold text-gray-100">
                          {result.mashbill.sourceDistillery}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barrel Range & Pattern */}
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h5 className="text-sm font-semibold text-gray-400 uppercase mb-3">Barrel Information</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500 block mb-1">Barrel Range</span>
                        <span className="text-xl font-mono font-semibold text-amber-400">
                          {result.patternLabel}
                        </span>
                      </div>
                      {result.barrelNotes && (
                        <div>
                          <span className="text-sm text-gray-500 block mb-1">Special Notes</span>
                          <span className="text-lg text-gray-100">
                            {result.barrelNotes}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tasting Notes */}
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h5 className="text-sm font-semibold text-gray-400 uppercase mb-3">Typical Tasting Profile</h5>
                    <p className="text-gray-300 leading-relaxed">
                      {result.mashbill.tastingNotes}
                    </p>
                  </div>

                  {/* Additional Notes */}
                  {result.mashbill.notes && (
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <h5 className="text-sm font-semibold text-gray-400 uppercase mb-3">Additional Information</h5>
                      <p className="text-gray-300 leading-relaxed">
                        {result.mashbill.notes}
                      </p>
                    </div>
                  )}
                </div>
              ) : result.matched && !result.mashbill ? (
                // Matched a barrel range but mashbill is unknown
                <div className="bg-gray-900 rounded-lg p-6 border border-amber-700">
                  <div className="text-center py-4">
                    <p className="text-amber-400 text-xl font-semibold mb-2">Unknown Mashbill</p>
                    <p className="text-gray-400 mb-4">
                      This barrel code matches range <span className="font-mono text-amber-400">{result.patternLabel}</span>, but the specific mashbill is not documented.
                    </p>
                    {result.barrelNotes && (
                      <p className="text-gray-500 text-sm italic">
                        {result.barrelNotes}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // No match found
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <div className="text-center py-6">
                    <p className="text-gray-400 text-xl font-semibold mb-3">No Classification Found</p>
                    <p className="text-gray-500 mb-4">
                      This barrel code does not match any known WFE distillate barrel range.
                    </p>
                    <div className="bg-gray-800 rounded-lg p-4 text-left">
                      <p className="text-sm text-gray-400 mb-2">
                        <strong className="text-amber-400">Note:</strong> This database covers only Willett's own distillate (post-2012).
                      </p>
                      <p className="text-sm text-gray-500">
                        This barrel may be:
                      </p>
                      <ul className="text-sm text-gray-500 list-disc list-inside ml-2 mt-1 space-y-1">
                        <li>A sourced barrel from another distillery (pre-2012 era)</li>
                        <li>Outside the documented ranges</li>
                        <li>Not a Willett Family Estate barrel</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-amber-400 mb-4">Try These Examples:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["9081", "4728", "32145", "8612", "7713", "20361"].map((code) => (
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
