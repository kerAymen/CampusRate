import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'crypto';

@Schema({ timestamps: true })
export class Place extends Document {
  @Prop({ required: true, unique: true, default: () => randomUUID() })
  id: string;
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop({ type: Number, default: null })
  averageRating: number | null;

  @Prop({ default: 0 })
  reviewCount: number;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
