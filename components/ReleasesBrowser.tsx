"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { WillettRelease } from "@/lib/types";
import type { BarrelDecodeResult } from "@/lib/types";

interface EnrichedRelease extends WillettRelease {
  classification: BarrelDecodeResult;
}

interface ReleasesBrowserProps {
  enrichedReleases: EnrichedRelease[];
}

export default function ReleasesBrowser({ enrichedReleases }: ReleasesBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReleases = useMemo(() => {
    if (!searchQuery.trim()) {
      return enrichedReleases;
    }

    const query = searchQuery.toLowerCase();
    return enrichedReleases.filter((release) => {
      return (
        release.barrelCode.toLowerCase().includes(query) ||
        release.labelName.toLowerCase().includes(query) ||
        release.selectedFor?.toLowerCase().includes(query) ||
        release.city?.toLowerCase().includes(query) ||
        release.state?.toLowerCase().includes(query) ||
        release.classification.description.toLowerCase().includes(query)
      );
    });
  }, [enrichedReleases, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-4"
          >
            <span>←</span>
            <span>Back to decoder</span>
          </Link>

          <h1 className="text-4xl font-bold mb-2 text-amber-400">
            Known Willett Releases
          </h1>
          <p className="text-gray-400">
            Reference database of {enrichedReleases.length} known Willett Family Estate single barrel releases
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by barrel code, label, store, location, or mashbill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <p className="mt-2 text-sm text-gray-500">
            {filteredReleases.length} {filteredReleases.length === 1 ? "release" : "releases"} found
          </p>
        </div>

        {/* Releases Grid */}
        {filteredReleases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No releases found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredReleases.map((release) => (
              <div
                key={release.id}
                className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-amber-500 transition-colors duration-200"
              >
                {/* Barrel Code Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-amber-400 font-mono">
                    #{release.barrelCode}
                  </h3>
                  {release.releaseYear && (
                    <div className="text-sm text-gray-500">
                      {release.releaseYear}
                    </div>
                  )}
                </div>

                {/* Label Name */}
                <h4 className="text-gray-300 font-semibold mb-3">
                  {release.labelName}
                </h4>

                {/* Classification */}
                <div className="mb-3">
                  <span className="inline-block bg-amber-900 bg-opacity-30 text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
                    {release.classification.description}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  {release.ageStatement && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age:</span>
                      <span className="text-gray-300 font-medium">{release.ageStatement}</span>
                    </div>
                  )}

                  {release.proof && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Proof:</span>
                      <span className="text-gray-300 font-semibold">{release.proof}°</span>
                    </div>
                  )}

                  {release.selectedFor && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Selected for:</span>
                      <span className="text-gray-300 font-medium truncate ml-2">
                        {release.selectedFor}
                      </span>
                    </div>
                  )}

                  {release.city && release.state && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="text-gray-300">
                        {release.city}, {release.state}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
