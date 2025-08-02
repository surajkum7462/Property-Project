import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { searchProperties, getPropertyById, getPropertyStats } from "./routes/properties";
import { getNearbyAmenities, getAmenityDetails, calculateRoute, getCacheStats } from "./routes/amenities";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Property search and management routes
  app.get("/api/properties/search", searchProperties);
  app.get("/api/properties/stats", getPropertyStats);
  app.get("/api/properties/:id", getPropertyById);

  // Amenity and location-based routes
  app.get("/api/properties/:id/nearby-amenities", getNearbyAmenities);
  app.get("/api/amenities/:placeId", getAmenityDetails);
  app.get("/api/routes/:propertyId/:destinationId", calculateRoute);
  app.get("/api/cache/stats", getCacheStats);

  return app;
}
