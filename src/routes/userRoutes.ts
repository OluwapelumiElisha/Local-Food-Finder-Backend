import { Router } from 'express';
import { handleAuth, updateProfile } from '../controllers/userController';
import { protect } from '../middlewares/auth';
import { loginLimiter } from '../middlewares/loginLimiter';

const router = Router();

router.post('/auth', loginLimiter, handleAuth);
router.put('/update', protect, updateProfile);

export default router;