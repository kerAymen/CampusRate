import { Injectable, NotFoundException, ConflictException,} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Place } from './entities/place.entity';
import { Review } from '../reviews/entities/review.entity';
import { JsonStorageService } from '../persistence/json-storage.service';

@Injectable()
export class PlacesService {
  constructor(private readonly storageService: JsonStorageService) {}

  async findAll(
    category?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const data = await this.storageService.read();

    let places = data.places;

    if (category) {
      places = places.filter(
        (place: Place) => place.category === category,
      );
    }

    const totalItems = places.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedPlaces = places.slice(startIndex, endIndex);

    return {
      data: paginatedPlaces,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async findOne(id: string): Promise<Place> {
    const data = await this.storageService.read();

    const place = data.places.find(
      (place: Place) => place.id === id,
    );

    if (!place) {
      throw new NotFoundException(
        `L'endroit avec l'ID "${id}" n'existe pas.`
      );
    }

    return place;
  }

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const {
      name,
      description,
      category,
      address,
      services,
      status
    } = createPlaceDto;

    const newPlace: Place = new Place(
      name,
      description,
      category,
      address,
      services,
      status
    );

    const data = await this.storageService.read();
    data.places.push(newPlace);
    await this.storageService.write(data);

    return newPlace;
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const data = await this.storageService.read();
    const place = data.places.find(
      (place: Place) => place.id === id,
    );

    if (!place) {
      throw new NotFoundException(
        `L'endroit avec l'ID "${id}" n'existe pas.`,
      );
    }

    Object.assign(place, updatePlaceDto);
    place.updatedAt = new Date();

    await this.storageService.write(data);

    return place;
  }

  async remove(id: string): Promise<void> {
    const data = await this.storageService.read();

    const index = data.places.findIndex(
      (place: Place) => place.id === id,
    );

    if (index === -1) {
      throw new NotFoundException(
        `L'endroit avec l'ID "${id}" n'existe pas.`,
      );
    }

    const hasReviews = data.reviews.some(
      (review: Review) => review.placeId === id,
    );

    if (hasReviews) {
      throw new ConflictException(
        `L'endroit avec l'ID "${id}" ne peut pas être supprimé car il possède des appréciations.`,
      );
    }

    data.places.splice(index, 1);

    await this.storageService.write(data);
  }

  async updateRating(id: string, ratings: number[]): Promise<void> {
    const data = await this.storageService.read();

    const place = data.places.find(
      (place: Place) => place.id === id,
    );

    if (!place) {
      throw new NotFoundException(
        `L'endroit avec l'ID "${id}" n'existe pas.`,
      );
    }

    place.reviewCount = ratings.length;

    if (ratings.length === 0) {
      place.averageRating = null;
    } else {
      let total: number = 0;

      for (const rating of ratings) {
        total += rating;
      }

      place.averageRating = total / ratings.length;
    }

    await this.storageService.write(data);
  }
  
}
