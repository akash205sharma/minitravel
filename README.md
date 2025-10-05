# Mini Travel - Itinerary App

A full-stack travel itinerary application built with Django REST API backend and Next.js TypeScript frontend.

## Features

### Core Features ✅
- **Trip Creation**: Create trips with name, destination city, start/end dates, and activities
- **Itinerary View**: Display trips in a day-by-day format with activities and times
- **Persistence**: SQLite database with Trip and Activity models
- **Frontend**: Modern React/Next.js UI with responsive design

### Bonus Features ✅
- **City Images**: Beautiful destination images from Unsplash API
- **Weather Forecast**: Current weather information for destinations
- **Shareable Links**: Generate unique shareable URLs for each itinerary
- **Print Support**: Print-friendly itinerary layouts
- **Responsive Design**: Mobile-first, modern UI with Tailwind CSS

## Tech Stack

### Backend
- **Django 5.2.7** - Python web framework
- **Django REST Framework** - API development
- **SQLite** - Database
- **django-cors-headers** - CORS handling

### Frontend
- **Next.js 15.5.4** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Day.js** - Date manipulation

## Project Structure

```
minitravel/
├── backend/                 # Django API
│   ├── api/                # Django project settings
│   ├── trips/              # Trips app
│   │   ├── models.py       # Trip and Activity models
│   │   ├── serializers.py  # DRF serializers
│   │   ├── views.py        # API views
│   │   └── urls.py         # URL routing
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # Next.js app
│   ├── app/               # App Router pages
│   │   ├── page.tsx       # Home page (trip list)
│   │   ├── create/        # Create trip page
│   │   └── trip/[id]/     # Trip detail page
│   ├── package.json
│   └── .env.local         # Environment variables
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server:**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   echo "NEXT_PUBLIC_API_BASE=http://localhost:8000" > .env.local
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

## API Endpoints

### Trips
- `GET /api/trips/` - List all trips
- `POST /api/trips/` - Create new trip
- `GET /api/trips/{id}/` - Get trip details
- `PUT /api/trips/{id}/` - Update trip
- `DELETE /api/trips/{id}/` - Delete trip
- `GET /api/trips/share/{token}/` - Get trip by share token

### Trip Data Structure
```json
{
  "id": 1,
  "name": "Summer Europe Adventure",
  "destination_city": "Paris, France",
  "start_date": "2024-06-15",
  "end_date": "2024-06-22",
  "share_token": "abc123...",
  "activities": [
    {
      "id": 1,
      "title": "Visit Eiffel Tower",
      "time": "10:00:00",
      "day_number": 1,
      "order_index": 0
    }
  ]
}
```

## Bonus Features Setup

### Unsplash Images (Optional)
1. Get API key from [Unsplash Developers](https://unsplash.com/developers)
2. Add to frontend `.env.local`:
   ```
   UNSPLASH_ACCESS_KEY=your_key_here
   ```

### Weather API (Optional)
1. Get API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Add to frontend `.env.local`:
   ```
   OPENWEATHER_API_KEY=your_key_here
   ```

## Usage

1. **Create a Trip:**
   - Click "Create Trip" button
   - Fill in trip details (name, destination, dates)
   - Add activities with times and day numbers
   - Submit to create

2. **View Itinerary:**
   - Click on any trip card
   - See day-by-day breakdown
   - View destination image and weather (if APIs configured)
   - Share or print the itinerary

3. **Share Trip:**
   - Each trip gets a unique shareable link
   - Use the "Copy Link" button to share
   - Others can view the itinerary without creating an account

## Deployment

### Backend (Render/Heroku)
1. Create `requirements.txt`:
   ```
   django==5.2.7
   djangorestframework==3.16.1
   django-cors-headers==4.9.0
   gunicorn
   ```

2. Create `Procfile`:
   ```
   web: gunicorn api.wsgi:application
   ```

3. Set environment variables:
   - `DEBUG=False`
   - `ALLOWED_HOSTS=your-domain.com`
   - `SECRET_KEY=your-secret-key`

### Frontend (Vercel/Netlify)
1. Build the project:
   ```bash
   npm run build
   ```

2. Set environment variables:
   - `NEXT_PUBLIC_API_BASE=https://your-api-domain.com`

## Development

### Running Tests
```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

### Code Quality
```bash
# Backend
python manage.py check

# Frontend
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Demo

A live demo is available at: [Your deployed URL](https://drive.google.com/file/d/1SjZTP4BESV7jd7LbgzMUDUduJeiFreSv/view?usp=sharing)
## Screenshots

- **Home Page**: Clean trip listing with cards
- **Create Trip**: Intuitive form with activity management
- **Itinerary View**: Beautiful day-by-day layout with images and weather
- **Mobile Responsive**: Works perfectly on all devices

---

Built with ❤️ for the Mini Travel assignment
