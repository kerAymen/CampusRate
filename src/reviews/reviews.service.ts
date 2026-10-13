import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PlacesService } from '../places/places.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review as ReviewSchema } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly placesService: PlacesService,
    @InjectModel(ReviewSchema.name)
    private readonly reviewModel: Model<ReviewSchema>,
  ) {}

  async findAllByPlace(placeId: string) {
    await this.placesService.findOne(placeId);
    return this.reviewModel.find({ placeId }).exec();
  }

  async findOne(id: string) {
    const review = await this.reviewModel.findOne({ id }).exec();

    if (!review) {
      throw new NotFoundException(
        `L'appréciation avec l'ID "${id}" n'existe pas.`,
      );
    }

    return review;
  }

  async create(
    placeId: string,
    createReviewDto: CreateReviewDto,
  ) {
    await this.placesService.findOne(placeId);

    const { authorName, rating, comment } = createReviewDto;

    const newReview = await this.reviewModel.create({
      placeId,
      authorName,
      rating,
      comment,
    });

    const reviews = await this.reviewModel.find({ placeId }).exec();

    const ratings: number[] = [];

    for (const review of reviews) {
      ratings.push(review.rating);
    }

    await this.placesService.updateRating(placeId, ratings);
    return newReview;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ) {
    const { authorName, rating, comment } = updateReviewDto;
    const review = await this.reviewModel.findOneAndUpdate(
      { id },
      { $set: { authorName, rating, comment } },
      { new: true, runValidators: true },
    ).exec();

    if (!review) {
      throw new NotFoundException(
        `L'appréciation avec l'ID "${id}" n'existe pas.`,
      );
    }

    const reviews = await this.reviewModel
      .find({ placeId: review.placeId })
      .exec();

    const ratings: number[] = [];

    for (const currentReview of reviews) {
      ratings.push(currentReview.rating);
    }

    await this.placesService.updateRating(review.placeId, ratings);
    return review;
  }

  async remove(id: string): Promise<void> {
    const review = await this.reviewModel.findOne({ id }).exec();

    if (!review) {
      throw new NotFoundException(
        `L'appréciation avec l'ID "${id}" n'existe pas.`,
      );
    }

    const placeId = review.placeId;

    await this.reviewModel.deleteOne({ id }).exec();

    const reviews = await this.reviewModel.find({ placeId }).exec();

    const ratings: number[] = [];

    for (const currentReview of reviews) {
      ratings.push(currentReview.rating);
    }

    await this.placesService.updateRating(placeId, ratings);
  }

}