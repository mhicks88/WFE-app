"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { BarrelRule, Mashbill } from "@/lib/types";

interface RulesBrowserProps {
  rules: BarrelRule[];
  mashbills: Mashbill[];
}

export default function RulesBrowser({ rules, mashbills }: RulesBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Create a lookup map for mashbills by ID
  const mashbillMap = useMemo(() => {
    const map = new Map<string, Mashbill>();
    mashbills.forEach((mashbill) => {
      map.set(mashbill.id, mashbill);
    });
    return map;
  }, [mashbills]);

  const filteredRules = useMemo(() => {
    if (!searchQuery.trim()) {
      return rules;
    }

    const query = searchQuery.toLowerCase();
    return rules.filter((rule) => {
      const mashbill = rule.mashbillId ? mashbillMap.get(rule.mashbillId) : null;
      return (
        rule.patternLabel.toLowerCase().includes(query) ||
        rule.notes?.toLowerCase().includes(query) ||
        mashbill?.displayName.toLowerCase().includes(query) ||
        mashbill?.whiskeyType.toLowerCase().includes(query)
      );
    });
  }, [rules, searchQuery, mashbillMap]);

  // Group rules by mashbill for better organization
  const groupedRules = useMemo(() => {
    const groups: Record<string, { mashbill: Mashbill | null; rules: BarrelRule[] }> = {};

    filteredRules.forEach((rule) => {
      const mashbill = rule.mashbillId ? (mashbillMap.get(rule.mashbillId) || null) : null;
      const key = mashbill?.id || "unknown";

      if (!groups[key]) {
        groups[key] = { mashbill, rules: [] };
      }
      groups[key].rules.push(rule);
    });

    return groups;
  }, [filteredRules, mashbillMap]);

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
            Browse all {rules.length} Willett barrel code ranges and their mashbill classifications
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by mashbill name, barrel range, or whiskey type..."
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
              .sort(([aKey, aGroup], [bKey, bGroup]) => {
                // Sort: knowns first (alphabetically), then unknowns
                if (aKey === "unknown") return 1;
                if (bKey === "unknown") return -1;
                const aName = aGroup.mashbill?.displayName || "";
                const bName = bGroup.mashbill?.displayName || "";
                return aName.localeCompare(bName);
              })
              .map(([key, group]) => (
                <div key={key} className="bg-gray-800 rounded-lg border border-gray-700">
                  {/* Group Header */}
                  <div className="bg-amber-900 bg-opacity-20 px-6 py-4 border-b border-gray-700">
                    {group.mashbill ? (
                      <>
                        <h2 className="text-2xl font-bold text-amber-400 mb-1">
                          {group.mashbill.displayName}
                        </h2>
                        <p className="text-gray-400 capitalize mb-2">
                          {group.mashbill.whiskeyType}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-gray-300">
                            <span className="text-gray-500">Grain Bill:</span> {group.mashbill.grainBill.corn}% corn, {group.mashbill.grainBill.rye}% rye, {group.mashbill.grainBill.wheat}% wheat, {group.mashbill.grainBill.maltedBarley}% malted barley
                          </span>
                          <span className="text-gray-300">
                            <span className="text-gray-500">Entry Proof:</span> {group.mashbill.entryProof ? `${group.mashbill.entryProof} proof` : "Not specified"}
                          </span>
                          <span className="text-gray-300 uppercase">
                            <span className="text-gray-500">Status:</span> <span className="text-amber-400">{group.mashbill.status}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-3">
                          {group.rules.length} barrel {group.rules.length === 1 ? "range" : "ranges"}
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-gray-400 mb-1">Unknown Mashbill</h2>
                        <p className="text-sm text-gray-500">
                          {group.rules.length} barrel {group.rules.length === 1 ? "range" : "ranges"} with unidentified mashbills
                        </p>
                      </>
                    )}
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {group.rules
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
                              <td className="px-6 py-4">
                                <span className="text-gray-400 text-sm">
                                  {rule.notes || "-"}
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
