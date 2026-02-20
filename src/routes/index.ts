import { Router } from "express";
import userRoutes from "./userRoutes";
import spotRoutes from "./spot";

const router = Router();

router.use("/user", userRoutes);
router.use("/spot", spotRoutes)


export default router;