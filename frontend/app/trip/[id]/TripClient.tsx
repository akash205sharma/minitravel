"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export default function TripClient({
  trip,
  tripId,
  cityImage,
  weather,
  readOnly = false,
}: {
  trip: any;
  tripId: string;
  cityImage: string | null;
  weather: any;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const byDay: Record<number, any[]> = {};
  (trip.activities || []).forEach((a: any) => {
    byDay[a.day_number] = byDay[a.day_number] || [];
    byDay[a.day_number].push(a);
  });

  async function deleteTrip() {
    if (readOnly) return;
    setDeleting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
      const res = await fetch(`${base}/api/trips/${tripId}/`, { method: "DELETE", headers: { ...(token ? { Authorization: `Token ${token}` } : {}) } });
      if (!res.ok) throw new Error("Failed to delete trip");
      router.push("/");
    } catch (error) {
      console.error("Error deleting trip:", error);
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Trip Header */}
      <div className="relative overflow-hidden rounded-2xl">
        {cityImage && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
            <img src={cityImage} alt={trip.destination_city} className="absolute inset-0 w-full h-full object-cover -z-10" />
          </>
        )}
        <div className={`${cityImage ? 'relative p-12 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50 p-12 text-gray-900'} min-h-[400px] flex items-center`}>
          <div className="w-full space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold mb-4 leading-tight">{trip.name}</h1>
                <div className="flex items-center gap-3 text-xl">
                  <span className="text-2xl">📍</span>
                  <span className="font-semibold">{trip.destination_city}</span>
                </div>
                <div className="flex items-center gap-2 text-lg opacity-90">
                  <span>📅</span>
                  <span>
                    {dayjs(trip.start_date).format("MMM D, YYYY")} – {dayjs(trip.end_date).format("MMM D, YYYY")}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {!readOnly && typeof window !== 'undefined' && localStorage.getItem('token') && (
                  <div className="flex gap-3">
                    <Link href={`/trip/${tripId}/edit`} className="btn-primary bg-white/90 hover:bg-white text-gray-900 hover:text-gray-900 flex items-center gap-2">
                      ✏️ Edit Trip
                    </Link>
                    <button onClick={() => setShowDeleteConfirm(true)} className="btn-secondary bg-red-500/90 hover:bg-red-600 text-white border-red-500/90 hover:border-red-600 flex items-center gap-2">
                      🗑️ Delete
                    </button>
                  </div>
                )}
                <Link href="/" className={`${cityImage ? 'btn-secondary bg-white/90 hover:bg-white text-gray-900 hover:text-gray-900' : 'btn-secondary'} text-center`}>
                  ← Back to Trips
                </Link>
              </div>
            </div>

            {/* Weather Info */}
            {weather && (
              <div className={`${cityImage ? 'bg-white/20 border-white/20' : 'bg-white/60 border-white/40'} backdrop-blur-sm rounded-xl p-6 max-w-sm border`}>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span>🌤️</span>
                  Current Weather
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {weather.weather?.[0]?.main === 'Clear' ? '☀️' : 
                     weather.weather?.[0]?.main === 'Clouds' ? '☁️' : 
                     weather.weather?.[0]?.main === 'Rain' ? '🌧️' : '🌤️'}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{Math.round(weather.main?.temp)}°C</div>
                    <div className="text-sm opacity-90 capitalize">{weather.weather?.[0]?.description}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Itinerary</h2>
          <p className="text-gray-600">Day-by-day breakdown of your adventure</p>
          {!readOnly && typeof window !== 'undefined' && localStorage.getItem('token') && (
            <div className="mt-4">
              <Link href={`/trip/${tripId}/edit`} className="btn-primary inline-flex items-center gap-2">
                ➕ Add Activities
              </Link>
            </div>
          )}
        </div>

        {Object.keys(byDay).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activities Planned</h3>
            <p className="text-gray-600">Add some activities to make your trip memorable!</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {Object.keys(byDay)
              .map(Number)
              .sort((a, b) => a - b)
              .map((d) => (
                <section key={d} className="card p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="badge badge-primary text-lg px-4 py-2">Day {d}</div>
                    <div className="text-gray-600 font-medium">
                      {dayjs(trip.start_date).add(d - 1, 'day').format('dddd, MMM D, YYYY')}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {byDay[d].map((a, idx) => (
                      <div key={a.id} className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0 w-20 text-center">
                          {a.time && (
                            <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                              <div className="text-sm font-bold text-gray-900">{a.time.slice(0, 5)}</div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-lg">{a.title}</div>
                        </div>
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </div>

      {/* Share Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <span>🔗</span>
            Share Your Trip
          </h3>
          <p className="text-gray-600 text-lg">Share this beautiful itinerary with friends and family!</p>
          <div className="flex justify-center gap-4 pt-4">
            <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="btn-primary flex items-center gap-2">
              <span>📋</span>
              Copy Page Link
            </button>
            {trip.share_token && (
              <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/share/${trip.share_token}`)} className="btn-secondary flex items-center gap-2">
                <span>🌐</span>
                Copy Public Link
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {!readOnly && showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Trip</h3>
              <p className="text-gray-600">Are you sure you want to delete "{trip.name}"? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 btn-secondary" disabled={deleting}>Cancel</button>
              <button onClick={deleteTrip} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {deleting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Deleting...</>) : ("Delete Trip")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


