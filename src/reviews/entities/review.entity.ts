import { randomUUID } from 'crypto';

export class Review {
  id: string;
  placeId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    placeId: string,
    authorName: string,
    rating: number,
    comment: string,
  ) {
    this.id = randomUUID();
    this.placeId = placeId;
    this.authorName = authorName;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}