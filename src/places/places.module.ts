import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { Place, PlaceSchema } from './schemas/place.schema';
import { Review, ReviewSchema } from '../reviews/schemas/review.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Place.name, schema: PlaceSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService],
})
export class PlacesModule {}

