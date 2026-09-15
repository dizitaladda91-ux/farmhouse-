# 🏛 Haveli & Estates: Luxury Farmhouse & Bungalow Real-Estate Marketplace

A production-ready digital marketplace specifically built for buying, selling, and exploring farmhouses, luxury bungalows, hilltop estates, and large residential properties for sale across India.

---

## 🌟 Key Features

1. **3D Interactive Hero Experience**: Three.js & React Three Fiber hero scene featuring a modern farmhouse architectural model with ambient lighting and cursor parallax.
2. **Smart Natural Language Search**: Natural query parser capable of interpreting queries like `"Farmhouse near Delhi under 3 crore with swimming pool"`.
3. **Multi-Unit Land Area Normalization Engine**: Seamlessly filter and compare properties in Sq.Ft., Sq.Yd., Acre, and regional Indian Bigha.
4. **Relevance Ranking Engine**: Backend sorting algorithm combining search match, location match, verification status bonus, featured listing flags, and freshness.
5. **Cinematic Details & 360° Virtual Tours**: Tabbed photo gallery, video walkthroughs, and 360° panoramic virtual tour viewers.
6. **Multi-Step Seller Listing Wizard**: 10-step wizard with draft support and preview cards.
7. **Admin Governance & Moderation Queue**: Approve/Reject listings, assign "Verified Property" badges, manage users, and inspect analytics.
8. **Buyer & Seller Portals**: Enquiries, Lead tracking, and Site Visit booking scheduler with lifecycle statuses.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Three.js, React Three Fiber, Framer Motion, Lucide Icons, Leaflet.
- **Backend**: Python 3.14, FastAPI, Pydantic v2, Async SQLAlchemy 2.0, AsyncPG / Aiosqlite, PyJWT, Bcrypt.
- **Database**: PostgreSQL (with SQLite async fallback for lightweight local dev).
- **Deployment**: Docker & Docker Compose.

---

## 🚀 Quick Start Guide

### 1. Run Backend Server
```bash
cd backend
python -m pip install -r requirements.txt
python -m database.seed.seed_data
python -m uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/api/health`

### 2. Run Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:3000`

### 3. Production Docker Deployment
```bash
docker-compose up --build
```

---

## 🔐 Preset Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@farmhousemarketplace.in` | `AdminPass123!` |
| **Seller** | `vikram.singh@royalestates.in` | `SellerPass123!` |
| **Seller** | `priya.sharma@luxuryfarmhouses.com` | `SellerPass123!` |
| **Buyer** | `buyer@gmail.com` | `BuyerPass123!` |
