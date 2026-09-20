import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { PlacesService } from '../places/places.service';

@Injectable()
export class ReviewsService {
  private readonly reviews: Review[] = [];

  constructor(private readonly placesService: PlacesService) {}

  findAllByPlace(placeId: string): Review[] {
    this.placesService.findOne(placeId);

    return this.reviews.filter(
      (review: Review) => review.placeId === placeId
    );
  }

  findOne(id: string): Review {
    const index: number = this.findReviewIndex(id);

    return this.reviews.at(index)!;
  }

  create(placeId: string, createReviewDto: CreateReviewDto): Review {
    this.placesService.findOne(placeId);

    const {
      authorName,
      rating,
      comment
    } = createReviewDto;

    const newReview: Review = new Review(
      placeId,
      authorName,
      rating,
      comment
    );

    this.reviews.push(newReview);

    const ratings: number[] = [];

    for (const review of this.reviews) {
      if (review.placeId === placeId) {
        ratings.push(review.rating);
      }
    }

    this.placesService.updateRating(placeId, ratings);

    return newReview;
  }

  update(id: string, updateReviewDto: UpdateReviewDto): Review {
    const review: Review = this.findOne(id);

    Object.assign(review, updateReviewDto);
    review.updatedAt = new Date();

    const ratings: number[] = [];

    for (const currentReview of this.reviews) {
      if (currentReview.placeId === review.placeId) {
        ratings.push(currentReview.rating);
      }
    }

    this.placesService.updateRating(review.placeId, ratings);

    return review;
  }

  remove(id: string): void {
    const review: Review = this.findOne(id);
    const placeId: string = review.placeId;

    const index: number = this.findReviewIndex(id);

    this.reviews.splice(index, 1);

    const ratings: number[] = [];

    for (const currentReview of this.reviews) {
      if (currentReview.placeId === placeId) {
        ratings.push(currentReview.rating);
      }
    }

    this.placesService.updateRating(placeId, ratings);
  }

  private findReviewIndex(id: string): number {
    const index: number = this.reviews.findIndex(
      (review: Review) => review.id === id
    );

    if (index === -1) {
      throw new NotFoundException(
        `L'appréciation avec l'ID "${id}" n'existe pas.`
      );
    }

    return index;
  }
}