import axios from 'axios';
import logger from '../config/logger';

export const fetchOSMSpots = async (lat: number, lng: number, radius: number = 2000) => {
  // Overpass QL query: Find restaurants and cafes within 'radius' meters of the user
  const query = `
    [out:json];
    (
      node["amenity"~"restaurant|cafe|fast_food"](around:${radius},${lat},${lng});
      way["amenity"~"restaurant|cafe|fast_food"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    return response.data.elements;
  } catch (error) {
    logger.error('OSM Fetch Error:', error);
    throw new Error('Failed to fetch from OpenStreetMap');
  }
};