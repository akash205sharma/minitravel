"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

type Activity = { id?: number; title: string; time?: string; day_number: number };

async function getTrip(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
  const url = `${base}/api/trips/${id}/`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default function EditTripPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params?.id as string;

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!tripId) return;
    async function loadTrip() {
      const tripData = await getTrip(tripId);
      if (!tripData) {
        router.push("/");
        return;
      }
      setTrip(tripData);
      setName(tripData.name);
      setCity(tripData.destination_city);
      setStart(tripData.start_date);
      setEnd(tripData.end_date);
      setActivities(tripData.activities || []);
      setLoading(false);
    }
    loadTrip();
  }, [tripId, router]);

  function addActivity() {
    setActivities((a) => [...a, { title: "", day_number: 1 }]);
  }

  function updateActivity(idx: number, patch: Partial<Activity>) {
    setActivities((a) => a.map((x, i) => (i === idx ? { ...x, ...patch } : x)));
  }

  async function submit() {
    if (!tripId) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/api/trips/${tripId}/`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Token ${token}` } : {}) },
        body: JSON.stringify({ 
          name, 
          destination_city: city, 
          start_date: start, 
          end_date: end, 
          activities: activities.map(a => ({
            title: a.title,
            time: a.time,
            day_number: a.day_number
          }))
        }),
      });
      if (!res.ok) throw new Error("Failed to update trip");
      setSuccess(true);
      setTimeout(() => router.push(`/trip/${tripId}`), 1500);
    } catch (e: any) {
      setError(e.message || "Failed to update trip");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Trip Not Found</h2>
          <p className="text-gray-600 mb-8">The trip you&apos;re trying to edit doesn&apos;t exist or has been removed.</p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <span>←</span>
            Back to Trips
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center space-y-4">
          <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-5xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-green-700">Trip Updated Successfully!</h2>
          <p className="text-gray-600">Your changes have been saved. Redirecting you now...</p>
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold">
          ✏️ Edit Your Adventure
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">Edit Trip</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Update your trip details, add new activities, or modify your existing itinerary.
        </p>
      </div>

      {/* Trip Details and Activities */}
      <div className="bg-white shadow-md rounded-2xl p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trip Name</label>
            <input
              className="input w-full"
              placeholder="e.g., Summer Europe Adventure"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination City</label>
            <input
              className="input w-full"
              placeholder="e.g., Paris, France"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              className="input w-full"
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              className="input w-full"
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>

        {/* Activities Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">🎯 Activities</h3>
            <button
              className="btn-primary text-sm flex items-center gap-2"
              onClick={addActivity}
            >
              ➕ Add Activity
            </button>
          </div>

          <div className="space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Title</label>
                    <input
                      className="input w-full"
                      placeholder="e.g., Visit Eiffel Tower"
                      value={a.title}
                      onChange={(e) => updateActivity(i, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      className="input w-full"
                      type="time"
                      value={a.time || ""}
                      onChange={(e) => updateActivity(i, { time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                    <input
                      className="input w-full"
                      type="number"
                      min={1}
                      value={a.day_number}
                      onChange={(e) => updateActivity(i, { day_number: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <button
                  className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 mt-2 text-sm"
                  onClick={() => setActivities((list) => list.filter((_, idx) => idx !== i))}
                >
                  🗑️ Remove Activity
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            ⚠️ <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-gray-200">
          <Link href={`/trip/${tripId}`} className="flex-1 btn-secondary text-center">
            Cancel
          </Link>
          <button
            disabled={saving || !name || !city || !start || !end}
            onClick={submit}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <> Update Trip</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
