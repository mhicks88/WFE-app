import { notFound } from "next/navigation";
import Link from "next/link";
import { getBottleById, getAllBottles } from "@/lib/bottles";

export async function generateStaticParams() {
  const bottles = getAllBottles();
  return bottles.map((bottle) => ({
    id: bottle.id,
  }));
}

interface BottleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BottleDetailPage({ params }: BottleDetailPageProps) {
  const { id } = await params;
  const bottle = getBottleById(id);

  if (!bottle) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-6"
        >
          <span>←</span>
          <span>Back to search</span>
        </Link>

        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 sm:p-8 border border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-amber-400 mb-2">
                #{bottle.barrelCode}
              </h1>
              <h2 className="text-xl sm:text-2xl text-gray-300">{bottle.labelName}</h2>
            </div>
            {bottle.rating && (
              <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg">
                <span className="text-amber-400 text-2xl">★</span>
                <span className="text-3xl font-bold">{bottle.rating}</span>
                <span className="text-gray-400 text-sm">/10</span>
              </div>
            )}
          </div>

          {/* Mashbill Badge */}
          <div className="inline-block bg-amber-900 bg-opacity-30 text-amber-300 px-4 py-2 rounded-full text-base font-medium">
            {bottle.mashbillType}
          </div>
        </div>

        {/* Classification Section */}
        <div className="bg-gray-800 rounded-lg p-6 sm:p-8 border border-gray-700 mb-6">
          <h3 className="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2">
            <span>🔬</span>
            <span>Barrel Classification</span>
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-gray-500 font-medium w-48">Mashbill Type:</span>
              <span className="text-gray-100 font-semibold">{bottle.mashbillType}</span>
            </div>
            {bottle.entryProofCategory && (
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-gray-500 font-medium w-48">Entry Proof Category:</span>
                <span className="text-gray-100 font-semibold">{bottle.entryProofCategory}</span>
              </div>
            )}
            {bottle.classificationNotes && (
              <div className="flex flex-col sm:flex-row sm:items-start">
                <span className="text-gray-500 font-medium w-48">Classification Notes:</span>
                <span className="text-gray-100 italic">{bottle.classificationNotes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottle Details */}
        <div className="bg-gray-800 rounded-lg p-6 sm:p-8 border border-gray-700 mb-6">
          <h3 className="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2">
            <span>📋</span>
            <span>Bottle Details</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bottle.ageStatement && (
              <div>
                <span className="text-gray-500 text-sm block mb-1">Age Statement</span>
                <span className="text-gray-100 font-semibold text-lg">{bottle.ageStatement}</span>
              </div>
            )}
            {bottle.proof && (
              <div>
                <span className="text-gray-500 text-sm block mb-1">Proof</span>
                <span className="text-gray-100 font-semibold text-lg">{bottle.proof}°</span>
              </div>
            )}
            {bottle.selectedFor && (
              <div>
                <span className="text-gray-500 text-sm block mb-1">Selected For</span>
                <span className="text-gray-100 font-semibold text-lg">{bottle.selectedFor}</span>
              </div>
            )}
            {(bottle.city || bottle.state) && (
              <div>
                <span className="text-gray-500 text-sm block mb-1">Location</span>
                <span className="text-gray-100 font-semibold text-lg">
                  {[bottle.city, bottle.state].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            {bottle.acquiredDate && (
              <div>
                <span className="text-gray-500 text-sm block mb-1">Acquired Date</span>
                <span className="text-gray-100 font-semibold text-lg">
                  {new Date(bottle.acquiredDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {bottle.pricePaid && (
              <div>
                <span className="text-gray-500 text-sm block mb-1">Price Paid</span>
                <span className="text-gray-100 font-semibold text-lg">
                  ${bottle.pricePaid.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tasting Notes */}
        {bottle.tastingNotes && (
          <div className="bg-gray-800 rounded-lg p-6 sm:p-8 border border-gray-700 mb-6">
            <h3 className="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2">
              <span>👃</span>
              <span>Tasting Notes</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">{bottle.tastingNotes}</p>
          </div>
        )}

        {/* Comments */}
        {bottle.comments && (
          <div className="bg-gray-800 rounded-lg p-6 sm:p-8 border border-gray-700 mb-6">
            <h3 className="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2">
              <span>💭</span>
              <span>Comments</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">{bottle.comments}</p>
          </div>
        )}

        {/* Back to Search Footer */}
        <div className="flex justify-center pt-8">
          <Link
            href="/"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            ← Back to all bottles
          </Link>
        </div>
      </div>
    </div>
  );
}
