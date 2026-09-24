import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { PlacesService } from '../places/places.service';
import { JsonStorageService } from '../persistence/json-storage.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly placesService: PlacesService,
    private readonly storageService: JsonStorageService,
  ) {}

  async findAllByPlace(placeId: string): Promise<Review[]> {
    await this.placesService.findOne(placeId);

    const data = await this.storageService.read();

    return data.reviews.filter(
      (review: Review) => review.placeId === placeId,
    );
  }

  async findOne(id: string): Promise<Review> {
    const data = await this.storageService.read();

    const review = data.reviews.find(
      (review: Review) => review.id === id,
    );

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
  ): Promise<Review> {
    await this.placesService.findOne(placeId);

    const {
      authorName,
      rating,
      comment,
    } = createReviewDto;

    const newReview: Review = new Review(
      placeId,
      authorName,
      rating,
      comment,
    );

    const data = await this.storageService.read();

    data.reviews.push(newReview);

    await this.storageService.write(data);

    const ratings: number[] = [];

    for (const review of data.reviews) {
      if (review.placeId === placeId) {
        ratings.push(review.rating);
      }
    }

    await this.placesService.updateRating(placeId, ratings);

    return newReview;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const data = await this.storageService.read();

    const review = data.reviews.find(
      (review: Review) => review.id === id,
    );

    if (!review) {
      throw new NotFoundException(
        `L'appréciation avec l'ID "${id}" n'existe pas.`,
      );
    }

    Object.assign(review, updateReviewDto);
    review.updatedAt = new Date();

    await this.storageService.write(data);

    const ratings: number[] = [];

    for (const currentReview of data.reviews) {
      if (currentReview.placeId === review.placeId) {
        ratings.push(currentReview.rating);
      }
    }

    await this.placesService.updateRating(review.placeId, ratings);

    return review;
  }

  async remove(id: string): Promise<void> {
    const data = await this.storageService.read();

    const index = data.reviews.findIndex(
      (review: Review) => review.id === id,
    );

    if (index === -1) {
      throw new NotFoundException(
        `L'appréciation avec l'ID "${id}" n'existe pas.`,
      );
    }

    const placeId: string = data.reviews[index].placeId;

    data.reviews.splice(index, 1);

    await this.storageService.write(data);

    const ratings: number[] = [];

    for (const currentReview of data.reviews) {
      if (currentReview.placeId === placeId) {
        ratings.push(currentReview.rating);
      }
    }

    await this.placesService.updateRating(placeId, ratings);
  }
}