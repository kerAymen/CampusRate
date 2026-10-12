import { Injectable, NotFoundException, ConflictException,} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place as PlaceSchema } from './schemas/place.schema';
import { Review as ReviewSchema } from '../reviews/schemas/review.schema';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(PlaceSchema.name)
    private readonly placeModel: Model<PlaceSchema>,
    @InjectModel(ReviewSchema.name)
    private readonly reviewModel: Model<ReviewSchema>,
  ) {}

  async findAll(
    category?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const filter = category ? { category } : {};

    const totalItems = await this.placeModel.countDocuments(filter);

    const places = await this.placeModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: places,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  
  async findOne(id: string) {
    const place = await this.placeModel
      .findOne({ id })
      .exec();

    if (!place) {
      throw new NotFoundException(
        `L'endroit avec l'ID "${id}" n'existe pas.`,
      );
    }

    return place;
  }

  async create(createPlaceDto: CreatePlaceDto) {
    const {
      name,
      description,
      category,
      address,
      services,
      status,
    } = createPlaceDto;

    const newPlace = await this.placeModel.create({
      name,
      description,
      category,
      address,
      services,
      status,
    });

    return newPlace;
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    const { name, description, category, address, services, status } = updatePlaceDto;
    const place = await this.placeModel
      .findOneAndUpdate(
        { id },
        { $set: { name, description, category, address, services, status } },
        { new: true, runValidators: true },
      )
      .exec();

    if (!place) {
      throw new NotFoundException(
        `L'endroit avec l'ID "${id}" n'existe pas.`,
      );
    }

    return place;
  }


  async remove(id: string): Promise<void> {
    const place = await this.placeModel.findOne({ id });

    if (!place) {
      throw new NotFoundException(
        `L'endroit avec l'ID "${id}" n'existe pas.`,
      );
    }

    const hasReviews = await this.reviewModel.exists({ placeId: id });

    if (hasReviews) {
      throw new ConflictException(
        `L'endroit avec l'ID "${id}" ne peut pas être supprimé car il possède des appréciations.`,
      );
    }

    await this.placeModel.deleteOne({ id });
  }

    
  async updateRating(id: string, ratings: number[]): Promise<void> {
    let averageRating: number | null = null;

    if (ratings.length > 0) {
      let total = 0;

      for (const rating of ratings) {
        total += rating;
      }

      averageRating = total / ratings.length;
    }

    const place = await this.placeModel.findOneAndUpdate(
      { id },
      {
        $set: {
          reviewCount: ratings.length,
          averageRating,
        },
      },
      { new: true },
    );

    if (!place) {
      throw new NotFoundException(
        `L'endroit avec l'ID "${id}" n'existe pas.`,
      );
    }
  }
    
  }
