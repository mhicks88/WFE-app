"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { BarrelRule } from "@/lib/types";

interface RulesBrowserProps {
  rules: BarrelRule[];
}

export default function RulesBrowser({ rules }: RulesBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRules = useMemo(() => {
    if (!searchQuery.trim()) {
      return rules;
    }

    const query = searchQuery.toLowerCase();
    return rules.filter((rule) => {
      return (
        rule.description.toLowerCase().includes(query) ||
        rule.patternLabel.toLowerCase().includes(query)
      );
    });
  }, [rules, searchQuery]);

  // Group rules by description (mashbill type) for better organization
  const groupedRules = useMemo(() => {
    const groups: Record<string, BarrelRule[]> = {};
    filteredRules.forEach((rule) => {
      if (!groups[rule.description]) {
        groups[rule.description] = [];
      }
      groups[rule.description].push(rule);
    });
    return groups;
  }, [filteredRules]);

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
            Barrel Classification Rules
          </h1>
          <p className="text-gray-400">
            Browse all {rules.length} Willett barrel code ranges and their classifications (canonical WFE data)
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by classification type or barrel range..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <p className="mt-2 text-sm text-gray-500">
            {filteredRules.length} {filteredRules.length === 1 ? "rule" : "rules"} found
          </p>
        </div>

        {/* Grouped Rules */}
        {Object.keys(groupedRules).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No rules found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedRules)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([description, rulesInGroup]) => (
                <div key={description} className="bg-gray-800 rounded-lg border border-gray-700">
                  {/* Group Header */}
                  <div className="bg-amber-900 bg-opacity-20 px-6 py-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-amber-400">{description}</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {rulesInGroup.length} {rulesInGroup.length === 1 ? "range" : "ranges"}
                    </p>
                  </div>

                  {/* Rules Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Pattern
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Range
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {rulesInGroup
                          .sort((a, b) => a.minCode - b.minCode)
                          .map((rule) => (
                            <tr key={rule.id} className="hover:bg-gray-750 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-mono text-amber-400 font-semibold">
                                  {rule.patternLabel}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-gray-300 font-mono text-sm">
                                  {rule.minCode} - {rule.maxCode}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
