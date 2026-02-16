import { Document, Types } from 'mongoose';

// This interface defines the shape of the User in your TypeScript code
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  username?: string; // Optional because they add it later
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: Date;
  updatedAt: Date;
}