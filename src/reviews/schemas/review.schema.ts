import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'crypto';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ required: true, unique: true, default: () => randomUUID() })
  id: string;
  @Prop({ required: true })
  placeId: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
