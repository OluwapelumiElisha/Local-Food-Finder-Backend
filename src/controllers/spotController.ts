import { Request, Response } from 'express';
import Restaurant from '../models/NearbySpot';
import logger from '../config/logger';

export const getNearbySpots = async (req: Request, res: Response) => {
  // We get coordinates from the query string: /api/spots/nearby?lng=...&lat=...
  const { lng, lat } = req.query;
  console.log(req.query);
  

  if (!lng || !lat) {
    return res.status(400).json({ message: "GPS coordinates are required" });
  }

  try {
    const spots = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: 5000 // Distance in meters (5km)
        }
      }
    });

    logger.info(`Found ${spots.length} spots near [${lng}, ${lat}]`);
    res.status(200).json(spots);
  } catch (error) {
    logger.error(`Search error: ${(error as Error).message}`);
    res.status(500).json({ message: "Error calculating nearby spots" });
  }
};