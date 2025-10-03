import Link from "next/link";
import TripClient from "../../trip/[id]/TripClient";

async function getTripByToken(token: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
  const url = `${base}/api/trips/share/${token}/`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function getCityImage(city: string) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        city
      )}&per_page=1&client_id=${
        process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
      }`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0]?.urls?.regular || null;
  } catch {
    return null;
  }
}

async function getWeather(city: string) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${
        process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
      }&units=metric`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function PublicSharePage({params}: {params: Promise<{ token: string }>}) {
  // Await params before using
  const {token} = await params;
  const trip = await getTripByToken(token);

  if (!trip) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Trip Not Found</h2>
          <p className="text-gray-600 mb-8">The shared trip link is invalid or has expired.</p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <span>←</span>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const [cityImage, weather] = await Promise.all([
    getCityImage(trip.destination_city),
    getWeather(trip.destination_city),
  ]);

  return (
    <TripClient
      trip={trip}
      tripId={String(trip.id)}
      cityImage={cityImage}
      weather={weather}
      readOnly={true}
    />
  );
}

