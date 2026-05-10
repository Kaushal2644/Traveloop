# 🌍 Traveloop

### *Your All-in-One Smart Travel Planning Platform*

> **Competition:** Odoo X Kahe Hackathon
> **Category:** Full Stack Web Application

---

## 📌 Table of Contents

1. [Problem Statement]
2. [Our Solution]
3. [Team]
4. [Features]
5. [Tech Stack]
6. [System Architecture]
7. [Database Schema]
8. [API Reference]
9. [Project Structure]
10. [Getting Started]
11. [Environment Variables]
12. [App Walkthrough]
13. [Design System]
14. [Challenges & Solutions]
15. [Future Scope]

---

## 🧩 Problem Statement

Travel planning in India is broken.

When someone plans a trip — whether it's a weekend getaway to Manali or a month-long Europe tour — they end up using 5+ different tools:

- **Google Docs** to write the itinerary
- **Excel** to track the budget
- **WhatsApp** to share plans with friends
- **Notes app** for packing lists
- **Instagram/blogs** for destination inspiration

There is **no single platform** built for Indian travelers that combines all of this in one place — with INR support, multi-city itinerary building, real-time budget tracking, packing management, and community-driven trip sharing.

The result? Missed bookings, budget overruns, forgotten packing essentials, and hours wasted copy-pasting across apps.

---

## 💡 Our Solution

**Traveloop** is a full-stack MERN web application that brings every aspect of travel planning under one roof.

With Traveloop, a traveler can:

1. Create a trip with a name, dates, and budget in seconds
2. Build a multi-city itinerary with an interactive map
3. Add activities to each stop with time, cost, and category
4. Track spending in real-time with visual budget breakdowns
5. Manage a smart packing list grouped by category
6. Write journal notes for the trip
7. Make the trip public and share it with friends or the community
8. Explore destinations and get inspired by other travelers' itineraries

Everything in one place. Everything in ₹.

---

## 👥 Team

| Name | Role | Responsibility |
|------|------|----------------|
| **Kaushal Patel** | Full Stack Developer & Team Lead | Architecture, Backend APIs, Frontend integration, Project management |
| **Shreya Lad** | Frontend Developer & UI/UX Designer | UI design, Component development, User experience, Responsive layout |
| **Drashti Savaliya** | Backend Developer & Database Architect | MongoDB schema design, REST API development, Authentication system |
| **Manav Surti** | Frontend Developer & API Integration | Page development, Axios integration, Map & chart implementation |

---

## 🚀 Features

### ✅ Authentication System
- Secure user registration and login with JWT tokens
- Password hashing using bcryptjs
- Persistent sessions with localStorage
- Protected routes — unauthenticated users are redirected to login
- Global 401 interceptor — auto logout on token expiry

### ✅ Dashboard
- Personalized welcome banner with user's first name
- Quick access to 3 most recent trips
- Recommended destinations grid (Tokyo, Paris, Bali, New York)
- One-click navigation to create a new trip

### ✅ My Trips
- Grid view of all user trips with status badges (planning / upcoming / ongoing / completed)
- Live search/filter by trip name
- Three-dot context menu per card — Edit or Delete
- Confirmation dialog before deletion

### ✅ Create New Trip
- Trip name, description, start/end dates, budget (₹), and optional cover photo URL
- Cover photo preview before saving
- Client-side validation with helpful error messages
- Currency locked to INR

### ✅ Trip Detail — Itinerary Tab
- Interactive **Leaflet.js** map showing all stops as markers connected by a polyline route
- Add stops with city, country, dates, lat/lng coordinates, and estimated cost
- Auto-expand newly added stops
- Add activities to each stop: name, category, time, duration (hours), cost
- Activity categories: Sightseeing, Food, Culture, Adventure, Shopping, Transport, Stay, Other
- Delete stops (cascades to activities) and individual activities
- Public/Private toggle with share button for public trips

### ✅ Trip Detail — Budget Tab
- 4 summary cards: Total Estimated, Budget, Per Day average, Remaining
- **Donut chart** — Spending breakdown by activity category (Recharts)
- **Stacked bar chart** — Cost by city showing stop cost vs activity cost
- Over-budget warning (red highlight when spending exceeds budget)
- Per-stop breakdown table with individual costs

### ✅ Trip Detail — Packing Tab
- Add items with name and category (Documents, Clothing, Electronics, Toiletries, Medicine, Other)
- Items grouped by category with packed/total counter per group
- Checkbox toggle — marks item as packed with strikethrough styling
- Delete individual items
- Real-time progress tracking

### ✅ Trip Detail — Notes Tab
- Add titled notes with content and optional date
- Notes displayed as journal cards sorted by newest first
- Delete notes
- Whitespace-preserving content display

### ✅ Explore Destinations
- Search cities, countries, or interests
- Filter by region: All, Europe, Asia, Americas, Africa, Oceania, Middle East
- Destination cards with city name, country, description, cost rating ($ to $$$$), and top activities
- Star ratings per destination

### ✅ Shared Itineraries
- Browse all public trips shared by the community
- Search by trip name or description
- Each card shows trip name, dates, description, and "View Itinerary" link
- Clicking a shared trip opens the full trip detail in read mode

### ✅ Profile & Settings
- Edit full name and language preference
- Email shown as read-only
- Trip stats: Total trips, Completed trips, Shared trips
- Save button with success confirmation animation
- Sign out option

### ✅ Admin Dashboard
- Summary stats: Total Users, Trips, Stops, Activities
- **Bar chart** — Top cities by number of stops
- **Pie/Donut chart** — Activity category distribution
- Recent users table with name, email, and role badge
- Admin-only access (role-based guard)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18+ | UI framework |
| Vite | 5+ | Build tool & dev server |
| Tailwind CSS | v4 | Utility-first CSS styling |
| React Router | v6 | Client-side routing |
| Axios | latest | HTTP client with interceptors |
| Leaflet.js | 1.9.4 | Interactive maps |
| React-Leaflet | 4+ | React wrapper for Leaflet |
| Recharts | latest | Charts and data visualization |
| Lucide React | latest | Icon library |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4+ | Web framework |
| MongoDB | 6+ | NoSQL database |
| Mongoose | 7+ | MongoDB ODM |
| JWT | latest | Authentication tokens |
| bcryptjs | latest | Password hashing |
| dotenv | latest | Environment variables |
| CORS | latest | Cross-origin requests |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React + Vite)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │Dashboard │  │TripDetail│  │ Explore  │  │ Admin  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘  │
│       └─────────────┴─────────────┴─────────────┘       │
│                    Axios (with JWT interceptor)          │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP REST API
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVER (Express.js)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  /auth   │  │  /trips  │  │  /stops  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │/activities│ │ /packing │  │  /notes  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                  Auth Middleware (JWT verify)            │
└──────────────────────────┬──────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  MongoDB Database                        │
│  Users │ Trips │ Stops │ Activities │ PackingItems │ Notes│
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### User
```
name, email, password (hashed), role (user/admin), language, avatar, timestamps
```

### Trip
```
user (ref), name, description, startDate, endDate, budget, currency (INR),
coverPhoto, status (planning/upcoming/ongoing/completed), isPublic, timestamps
```

### Stop
```
trip (ref), user (ref), city, country, startDate, endDate,
latitude, longitude, order, totalCost, timestamps
```

### Activity
```
stop (ref), trip (ref), user (ref), name, category, time,
duration, cost, currency (INR), notes, timestamps
```

### PackingItem
```
trip (ref), user (ref), name, category, isPacked (boolean), timestamps
```

### Note
```
trip (ref), user (ref), stop (ref), title, content, timestamps
```

---

## 🌐 API Reference

### Auth Routes — `/api/auth`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user, returns JWT | ❌ |
| GET | `/profile` | Get logged-in user profile | ✅ |
| PUT | `/profile` | Update name & language | ✅ |

### Trip Routes — `/api/trips`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all my trips | ✅ |
| POST | `/` | Create new trip | ✅ |
| GET | `/public` | Get all public trips | ✅ |
| GET | `/:id` | Get single trip | ✅ |
| PUT | `/:id` | Update trip | ✅ |
| DELETE | `/:id` | Delete trip | ✅ |
| PUT | `/:id/toggle-public` | Toggle public/private | ✅ |

### Stop Routes — `/api/stops`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Add stop to trip | ✅ |
| GET | `/trip/:tripId` | Get all stops for trip | ✅ |
| PUT | `/:id` | Update stop | ✅ |
| DELETE | `/:id` | Delete stop + activities | ✅ |

### Activity Routes — `/api/activities`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Add activity to stop | ✅ |
| GET | `/stop/:stopId` | Get activities by stop | ✅ |
| GET | `/trip/:tripId` | Get activities by trip | ✅ |
| PUT | `/:id` | Update activity | ✅ |
| DELETE | `/:id` | Delete activity | ✅ |

### Packing Routes — `/api/packing`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Add packing item | ✅ |
| GET | `/trip/:tripId` | Get all items for trip | ✅ |
| PATCH | `/:id/toggle` | Toggle packed status | ✅ |
| PUT | `/:id` | Update item | ✅ |
| DELETE | `/:id` | Delete item | ✅ |
| PUT | `/reset/:tripId` | Reset all to unpacked | ✅ |

### Notes Routes — `/api/notes`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Add note | ✅ |
| GET | `/trip/:tripId` | Get notes for trip | ✅ |
| PUT | `/:id` | Update note | ✅ |
| DELETE | `/:id` | Delete note | ✅ |

### Admin Routes — `/api/admin`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stats` | Dashboard stats + charts | ✅ Admin |
| GET | `/users` | All users list | ✅ Admin |
| DELETE | `/users/:id` | Delete user | ✅ Admin |
| PUT | `/users/:id/role` | Toggle admin role | ✅ Admin |

---

## 📁 Project Structure

```
traveloop/
│
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Axios instance + interceptors
│   │   ├── components/
│   │   │   └── Sidebar.jsx          # Collapsible navigation sidebar
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state (login/logout/user)
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── Dashboard.jsx        # Home dashboard
│   │   │   ├── MyTrips.jsx          # All trips grid
│   │   │   ├── NewTrip.jsx          # Create trip form
│   │   │   ├── TripDetail.jsx       # Trip detail (Itinerary/Budget/Packing/Notes)
│   │   │   ├── Explore.jsx          # Destination explorer
│   │   │   ├── SharedTrips.jsx      # Community shared trips
│   │   │   ├── Profile.jsx          # User profile & settings
│   │   │   └── Admin.jsx            # Admin dashboard
│   │   ├── App.jsx                  # Routes + layout
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Tailwind import
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Express Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   ├── stopController.js
│   │   ├── activityController.js
│   │   ├── packingController.js
│   │   ├── noteController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Trip.js
│   │   ├── Stop.js
│   │   ├── Activity.js
│   │   ├── PackingItem.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── stopRoutes.js
│   │   ├── activityRoutes.js
│   │   ├── packingRoutes.js
│   │   ├── noteRoutes.js
│   │   └── adminRoutes.js
│   ├── server.js                    # Express app entry point
│   ├── .env                         # Environment variables (not committed)
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have the following installed:
- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v9 or higher
- **MongoDB** — Local installation or [MongoDB Atlas](https://cloud.mongodb.com) (free tier)
- **Git**

---

### Step 1 — Clone the Repository
```bash
git clone https://github.com/your-username/traveloop.git
cd traveloop
```

### Step 2 — Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
MONGO_URI=mongodb://localhost:27017/traveloop
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

Start the backend server:
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### Step 3 — Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### Step 4 — Open the App
Visit `http://localhost:5173` in your browser.
Register a new account and start planning your trip!

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/traveloop` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `mysecretkey123` |
| `PORT` | Port for Express server | `5000` |

---

## 🖥️ App Walkthrough

### 1. Register / Login
Create an account with your name, email, and password. On login, a JWT token is stored in localStorage and attached to all subsequent API requests.

### 2. Dashboard
Your home screen shows recent trips and recommended destinations. Click **Plan a New Trip** to get started.

### 3. Create a Trip
Fill in trip name, dates, budget (₹), and an optional cover photo URL. The trip is created with status `planning` by default.

### 4. Build Your Itinerary
Inside the trip, add stops (cities) with start/end dates and coordinates. Under each stop, add activities with time, cost, and category. The Leaflet map updates live with markers and route lines.

### 5. Track Your Budget
The Budget tab shows how much you've spent vs. your total budget, with a donut chart by category and a stacked bar chart by city.

### 6. Manage Packing
Add items to your packing list by category. Check them off as you pack. Track progress with the packed/total counter.

### 7. Write Notes
Keep a personal journal for your trip. Add titled entries with content and dates.

### 8. Share Your Trip
Toggle the trip to **Public** and use the Share button to copy a shareable link. Anyone with the link can view your full itinerary.

### 9. Explore
Browse the Explore page to discover cities around the world filtered by region, with top activities and cost ratings.

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#2A9D8F` | Buttons, active states, accents |
| Background | `#F5F5F0` | Page background |
| Surface | `#FFFFFF` | Cards, modals |
| Text Primary | `#1a1a1a` | Headings |
| Text Secondary | `#6b7280` | Body text, labels |
| Danger | `#ef4444` | Delete actions, over-budget |
| Success | `#16a34a` | Saved states, completed |
| Border | `#f3f4f6` | Card borders, dividers |
| Border Radius | `16px` (2xl) | Cards, buttons |
| Font | System UI / Inter | All text |

---

## 🧗 Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Leaflet.js marker icons broken in Vite | Manually overrode default icon URLs using `L.Icon.Default.mergeOptions` |
| JWT token expiry causing silent failures | Added global 401 interceptor in Axios to auto-logout and redirect |
| Stop totalCost not updating when activities are added | Backend auto-recalculates stop `totalCost` on every activity create/update/delete |
| React Router matching `/trips/new` as `/:id` | Ensured `/trips/new` route is declared before `/trips/:id` in App.jsx |
| Currency inconsistency across UI | Locked all currency to INR (₹) at both backend model level and frontend display |
| Packing checkbox not toggling | Fixed field name mismatch — model uses `isPacked`, frontend was reading `packed` |

---

## 🔭 Future Scope

- 📱 **Mobile App** — React Native version for iOS and Android
- 🤖 **AI Trip Planner** — Auto-generate itineraries using Claude/GPT based on destination and duration
- 🗓️ **Google Calendar Sync** — Export trip dates and activities to Google Calendar
- 💳 **Payment Integration** — Book hotels and flights directly within the app
- 👥 **Collaborative Planning** — Invite friends to co-edit a trip in real time
- 🌤️ **Weather Integration** — Show weather forecasts for each stop on travel dates
- 📊 **Spending Analytics** — Monthly/yearly travel spending reports
- 🗺️ **Offline Mode** — PWA support for accessing itineraries without internet
- 📸 **Photo Albums** — Attach travel photos to stops and activities
- 🔔 **Trip Reminders** — Push notifications before departure dates

---

<div align="center">

**Built with ❤️ by**

**Kaushal Patel • Shreya Lad • Drashti Savaliya • Manav Surti**

*Odoo X Kahe Hackathon 2026*

</div>
