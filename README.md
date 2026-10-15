# FleetPulse | Real-Time Logistics and Fleet Tracking Portal

A mission-critical real-time logistics and fleet tracking application featuring live vehicle telemetry, dynamic map tracking, geofence monitoring, dispatch workflows, and operational analytics.

---

## Architecture Overview

```
                               +-----------------------------+
                               |     Client Browser (SPA)    |
                               |  React 18 + Vite + Recharts |
                               +--------------+--------------+
                                              |
                       HTTP / REST (/api)     |     WebSockets (/socket.io)
                                              |
                                              v
                               +-----------------------------+
                               |   Express + Socket.IO API   |
                               |          Port 5000          |
                               +--------------+--------------+
                                              |
                                              v
                               +-----------------------------+
                               |      MongoDB + Mongoose     |
                               |      Port 27017 (Standby)   |
                               +-----------------------------+
```

---

## Directory Structure

```
feet/
├── backend/                        # Node.js + Express API & WebSocket Server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Mongoose connection manager with offline fallback
│   │   ├── controllers/
│   │   │   └── healthController.js # GET /api/health implementation
│   │   ├── middleware/
│   │   │   └── errorHandler.js     # Centralized 404 & error handlers
│   │   ├── models/                 # Mongoose schemas (Vehicle, Shipment, Alert, etc.)
│   │   │   └── README.md
│   │   ├── routes/
│   │   │   ├── healthRoutes.js     # Health check route
│   │   │   └── index.js            # Unified API router
│   │   ├── services/               # Business logic & telemetry processors
│   │   │   └── README.md
│   │   ├── sockets/
│   │   │   └── socketManager.js    # Socket.IO lifecycle & telemetry gateway
│   │   ├── utils/
│   │   │   └── logger.js           # Structured console logger
│   │   ├── app.js                  # Express middleware setup (CORS, Helmet, Morgan)
│   │   └── server.js               # HTTP + WebSocket server bootstrap
│   ├── .env.example                # Backend environment template
│   ├── .gitignore                  # Backend ignore rules
│   └── package.json                # Express & Socket.IO dependencies
│
├── frontend/                       # React 18 + Vite SPA Client
│   ├── src/
│   │   ├── assets/                 # Static branding and vector assets
│   │   ├── components/
│   │   │   ├── common/             # Badges, cards, loaders
│   │   │   └── layout/
│   │   │       ├── Header.jsx      # Top header with health sync action
│   │   │       ├── Sidebar.jsx     # Nav links and live socket status indicators
│   │   │       └── Shell.jsx       # Root layout wrapper with Outlet & context
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Architecture verification & telemetry visualizer
│   │   │   ├── Vehicles.jsx        # Vehicle registry placeholder (Phase 2)
│   │   │   ├── Shipments.jsx       # Consignments & dispatches placeholder (Phase 2)
│   │   │   ├── LiveMap.jsx         # Geospatial telemetry map placeholder (Phase 2)
│   │   │   ├── Alerts.jsx          # Safety alerts & geofence violations placeholder (Phase 2)
│   │   │   ├── Analytics.jsx       # Fleet efficiency analytics placeholder (Phase 2)
│   │   │   ├── Settings.jsx        # Portal & gateway configuration placeholder (Phase 2)
│   │   │   └── NotFound.jsx        # 404 handler
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance with interceptors
│   │   │   └── socket.js           # Socket.IO client singleton
│   │   ├── App.jsx                 # React Router v7 routes
│   │   ├── index.css               # Cyber Logistics design tokens & styles
│   │   └── main.jsx                # SPA entry point
│   ├── index.html                  # HTML5 template with Inter & Outfit typography
│   ├── vite.config.js              # Vite server & reverse proxy (/api & /socket.io)
│   ├── .env.example                # Frontend environment template
│   ├── .gitignore                  # Frontend ignore rules
│   └── package.json                # React, Recharts, Lucide, Axios dependencies
│
├── .env.example                    # Monorepo combined environment template
├── .gitignore                      # Monorepo root ignore rules
├── package.json                    # Monorepo runner scripts (concurrently)
└── README.md                       # Comprehensive project guide
```

---

## Technology Stack

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite 6 | Fast HMR, optimized production build |
| **Routing** | React Router v7 | Declarative nested routing & Shell layout |
| **Styling** | Vanilla CSS Design System | Sleek dark theme, glassmorphic cards, responsive grid |
| **Visualization** | Recharts 2.x | Real-time telemetry curves and event streams |
| **Icons** | Lucide React | High-contrast logistics and telemetry iconography |
| **HTTP Client** | Axios | Configured with timeout and response interceptors |
| **WebSockets** | Socket.IO Client 4.x | Auto-reconnect, bi-directional telemetry events |
| **Backend Framework** | Node.js + Express 4 | Modular controllers, routes, and middleware |
| **Security & Utilities**| Helmet + CORS + Morgan | Security headers, cross-origin control, request logging |
| **Database ODM** | Mongoose 8.x | Graceful offline connection handling, schema ready |
| **Realtime Gateway** | Socket.IO Server 4.x | Room subscriptions (`vehicle:{id}`), live ping/pong |

---

## Environment Setup

### 1. Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/fleet_tracking
CLIENT_ORIGIN=http://localhost:5173
SOCKET_PING_INTERVAL_MS=5000
```

### 2. Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Installation & Run Commands

### One-Command Setup (Monorepo Root)

Install all dependencies across root, backend, and frontend:
```bash
npm run install:all
```

Start both backend API and frontend dev server simultaneously:
```bash
npm run dev
```

### Individual Service Management

#### Running Backend Only:
```bash
cd backend
npm install
npm run dev       # Starts nodemon on http://localhost:5000
```

#### Running Frontend Only:
```bash
cd frontend
npm install
npm run dev       # Starts Vite dev server on http://localhost:5173
```

#### Production Build Verification:
```bash
npm run build:frontend
```

---

## API & WebSocket Endpoints

### HTTP Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api` | API index and endpoint catalog |
| `GET` | `/api/health` | Comprehensive system health, uptime, memory, and database status |
| `*` | Any undefined path | Returns 404 JSON with structured error response |

#### Sample `GET /api/health` Response:
```json
{
  "status": "ok",
  "service": "Fleet Tracking & Real-Time Logistics API",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-10-15T04:57:06.469Z",
  "uptime": {
    "seconds": 71,
    "formatted": "0h 1m 11s"
  },
  "database": {
    "state": "disconnected",
    "readyState": 0,
    "isConnected": false,
    "host": null,
    "name": null
  },
  "system": {
    "platform": "win32",
    "nodeVersion": "v24.14.1",
    "memoryUsage": {
      "rssMB": "80.95",
      "heapUsedMB": "19.48",
      "heapTotalMB": "36.98"
    },
    "cpus": 8
  }
}
```

### WebSocket Events Contract

| Event | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `connection:ack` | Server &rarr; Client | `{ connected: true, socketId, timestamp }` | Sent on client connect |
| `client:ping` | Client &rarr; Server | `{ timestamp: Date.now() }` | Latency probe |
| `server:pong` | Server &rarr; Client | `{ clientTimestamp, serverTimestamp }` | Round-trip latency pong response |
| `subscribe:vehicle` | Client &rarr; Server | `vehicleId` | Subscribes socket to vehicle telemetry room |
| `unsubscribe:vehicle` | Client &rarr; Server | `vehicleId` | Leaves vehicle telemetry room |

---

## Phase 1 Deliverables Verification

- [x] Workspace inspected and verified
- [x] Clean monorepo structure with `frontend/` and `backend/`
- [x] React 18 + Vite 6 frontend setup in JavaScript
- [x] Node.js + Express backend setup with Helmet, Morgan, and CORS
- [x] MongoDB Mongoose connection manager with offline fallback
- [x] Controllers, models, services, routes, middleware, and utils folders
- [x] React Router v7, Axios, Recharts, Lucide React, and Socket.IO client configured
- [x] Environment files, Vite proxy (`/api` and `/socket.io`), and npm scripts configured
- [x] GET `/api/health` responding with full system and DB telemetry
- [x] Professional application shell with dark theme, responsive navigation, and live ping test
- [x] `.gitignore` and `.env.example` files configured
- [x] End-to-end browser and API verification verified
