"use client";

import { useState } from "react";
import Link from "next/link";

type Activity = { title: string; time?: string; day_number: number };

export default function CreateTripPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function addActivity() {
    setActivities((a) => [...a, { title: "", day_number: 1 }]);
  }

  function updateActivity(idx: number, patch: Partial<Activity>) {
    setActivities((a) => a.map((x, i) => (i === idx ? { ...x, ...patch } : x)));
  }

  async function submit() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    const url = process.env.NEXT_PUBLIC_API_BASE + "/api/trips/";
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Token ${token}` } : {}) },
        body: JSON.stringify({ name, destination_city: city, start_date: start, end_date: end, activities }),
      });
      if (!res.ok) throw new Error("Failed to create trip");
      const trip = await res.json();
      setSuccess(true);
      setTimeout(() => (window.location.href = "/trip/" + trip.id), 1500);
    } catch (e: any) {
      setError(e.message || "Failed to create trip");
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center space-y-4">
          <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-5xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-green-700">Trip Created Successfully!</h2>
          <p className="text-gray-600">Your itinerary is ready. Redirecting you now...</p>
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
          ✈️ Plan Your Adventure
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">Create New Trip</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Plan your perfect adventure with detailed activities, schedules, and memorable experiences.
        </p>
      </div>

      {/* Trip Details */}
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
            <h3 className="text-xl font-bold flex items-center gap-2">
              🎯 Activities
            </h3>
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
          <Link href="/" className="flex-1 btn-secondary text-center">
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
                Creating...
              </>
            ) : (
              <>
                ✨ Create Trip
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
