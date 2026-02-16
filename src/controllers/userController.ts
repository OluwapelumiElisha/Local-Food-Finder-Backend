import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authSchema } from '../utils/validators';
import { recordFailedLogin, resetFailedLogin } from '../middlewares/loginLimiter';

export const handleAuth = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        authSchema.parse({ email, password });
    } catch {
        return res.status(400).json({ message: "Invalid input data" });
    }

    try {
        let user = await User.findOne({ email });
        let message = ""
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                recordFailedLogin(email);
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Successful login → reset failed attempts
            resetFailedLogin(email);
            message = "Login successful";
        } else {
            user = await User.create({ email, password });
            message = "Sign up successful"
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '5d' });
        res.json({ message, token, user: { id: user._id, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const { username, lng, lat } = req.body;
    const userId = (req as any).user.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                username,
                location: { type: 'Point', coordinates: [lng, lat] }
            },
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
};