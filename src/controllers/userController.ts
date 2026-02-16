import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authSchema } from '../utils/validators';
import { recordFailedLogin, resetFailedLogin } from '../middlewares/loginLimiter';

export const handleAuth = async (req: Request, res: Response) => {
    const { email, password, location } = req.body;

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

            if (location) {
                user.location = location;
                await user.save();
            }
        } else {
            user = await User.create({ email, password, location });
            message = "Sign up successful"
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '5d' });
        res.json({ message, token, user: { id: user._id, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const { username } = req.body;
    const userId = (req as any).user.id;

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);
    } catch {
        res.status(500).json({ message: "Update failed" });
    }
};


export const currentUser = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select("-password");

    res.json(user);
};


