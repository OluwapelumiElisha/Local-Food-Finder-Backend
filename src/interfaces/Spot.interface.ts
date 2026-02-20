import { Document } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  mealType: string;
  specialty: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  averagePrice: number;
}