import mongoose, { Schema } from 'mongoose';
import { IRestaurant } from '../interfaces/Spot.interface';

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  mealType: { type: String, required: true },
  specialty: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } 
  },
  averagePrice: { type: Number }
}, { timestamps: true });

// CRITICAL: This index enables proximity search
RestaurantSchema.index({ location: "2dsphere" });

export default mongoose.model<IRestaurant>('Spotx', RestaurantSchema);