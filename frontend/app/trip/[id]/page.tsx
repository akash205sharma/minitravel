"use client"
import dayjs from "dayjs";
import Link from "next/link";

async function getTrip(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
  const url = `${base}/api/trips/${id}/`;
  console.log("Fetching trip from:", url); // debug
  const res = await fetch(url, { cache: "no-store" });
  console.log("res", res);
  if (!res.ok) return null;
  return res.json();
}

async function getCityImage(city: string) {
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&per_page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0]?.urls?.regular || null;
  } catch {
    return null;
  }
}

async function getWeather(city: string, date: string) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function TripPage({ params }: { params: { id: string } }) {
  const trip = await getTrip(params.id);
  if (!trip) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Trip Not Found</h2>
          <p className="text-gray-600 mb-8">The trip you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <span>←</span>
            Back to Trips
          </Link>
        </div>
      </div>
    );
  }

  const byDay: Record<number, any[]> = {};
  (trip.activities || []).forEach((a: any) => {
    byDay[a.day_number] = byDay[a.day_number] || [];
    byDay[a.day_number].push(a);
  });

  // Get bonus data (images and weather)
  const [cityImage, weather] = await Promise.all([
    getCityImage(trip.destination_city),
    getWeather(trip.destination_city, trip.start_date)
  ]);

  return (
    <div className="space-y-8">
      {/* Trip Header */}
      <div className="relative overflow-hidden rounded-2xl">
        {cityImage && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        )}
        <div className={`${cityImage ? 'relative p-12 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50 p-12 text-gray-900'} min-h-[400px] flex items-center`}>
          {cityImage && (
            <img 
              src={cityImage} 
              alt={trip.destination_city}
              className="absolute inset-0 w-full h-full object-cover -z-10"
            />
          )}
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
              <Link 
                href="/" 
                className="btn-secondary bg-white/90 hover:bg-white text-gray-900 hover:text-gray-900"
              >
                ← Back to Trips
              </Link>
            </div>
            
            {/* Weather Info */}
            {weather && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-sm border border-white/20">
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
                    <div className="badge badge-primary text-lg px-4 py-2">
                      Day {d}
                    </div>
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
                              <div className="text-sm font-bold text-gray-900">
                                {a.time.slice(0, 5)}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-lg">{a.title}</div>
                        </div>
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
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
            <button 
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="btn-primary flex items-center gap-2"
            >
              <span>📋</span>
              Copy Link
            </button>
            <button 
              onClick={() => window.print()}
              className="btn-secondary flex items-center gap-2"
            >
              <span>🖨️</span>
              Print Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


