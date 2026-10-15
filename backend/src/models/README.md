# Models Directory

This directory contains Mongoose schemas and models for the Fleet Tracking and Logistics platform.
Business modules to be implemented in subsequent phases:
- `Vehicle.js`: Fleet vehicles (VIN, license plate, model, status, telemetry, driverId)
- `Driver.js`: Drivers profile, contact, license, assigned vehicle
- `Shipment.js`: Shipments/orders (tracking number, origin, destination, status, route, eta)
- `Alert.js`: Fleet alerts (geofence breaches, speeding, engine faults, delays)
- `Geofence.js`: Geofenced zones and boundaries
- `Telemetry.js`: High-frequency vehicle location/sensor telemetry points
