"use client"
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrips() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + "/api/trips/", { cache: "no-store", headers: { ...(token ? { Authorization: `Token ${token}` } : {}) } });
        if (res.ok) {
          const data = await res.json();
          setTrips(data);
        }
      } catch (error) {
        console.error("Error loading trips:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <span>🌟</span>
          <span>Plan Your Perfect Adventure</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Your Travel
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Adventures</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Create detailed itineraries, organize activities, and share your travel experiences 
          with friends and family. Make every trip unforgettable.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-green-500">✓</span>
            <span>Free to use</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-green-500">✓</span>
            <span>Shareable links</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-green-500">✓</span>
            <span>Weather & images</span>
          </div>
        </div>
      </div>

      <TripsList trips={trips} loading={loading} />
    </div>
  );
}

function TripsList({ trips, loading }: { trips: any[]; loading: boolean }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your trips...</p>
      </div>
    );
  }
  
  if (!token || token === null) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">🗺️</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready for Your First Adventure?</h3>
          <p className="text-gray-600 mb-8 text-lg">Start planning your perfect trip with detailed itineraries and activities.</p>
          <Link href="/auth/login" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
            <span>✨</span>
            Login to Create Your First Trip
          </Link>
        </div>
      </div>
    );
  }

  if (!trips.length) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">🗺️</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready for Your First Adventure?</h3>
          <p className="text-gray-600 mb-8 text-lg">Start planning your perfect trip with detailed itineraries and activities.</p>
          <Link href="/create" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
            <span>✨</span>
            Create Your First Trip
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Trips</h2>
        <div className="text-sm text-gray-500">
          {trips.length} {trips.length === 1 ? 'trip' : 'trips'} planned
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {trips.map((t: any) => (
          <div key={t.id} className="card p-8 group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-2 mb-3">
                    <span className="text-lg">📍</span>
                    {t.destination_city}
                  </p>
                </div>
                <div className="badge badge-primary">
                  {t.activities?.length || 0} activities
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>📅</span>
                    <span>{new Date(t.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-gray-400">to</div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>📅</span>
                    <span>{new Date(t.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-gray-500">
                  {Math.ceil((new Date(t.end_date).getTime() - new Date(t.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
                <Link 
                  href={`/trip/${t.id}`} 
                  className="btn-secondary text-sm px-4 py-2 flex items-center gap-2"
                >
                  View Details
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
