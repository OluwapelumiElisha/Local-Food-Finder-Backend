import { Router } from 'express';
import { getNearbySpots } from '../controllers/spotController';

const router = Router();

// Endpoint: GET /api/spots/nearby
router.get('/nearby', getNearbySpots);

export default router;