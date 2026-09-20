import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Place } from './entities/place.entity';

@Injectable()
export class PlacesService {
  private readonly places: Place[] = [];

  findAll(): Place[] {
    return this.places;
  }

  findOne(id: string): Place {
    const index: number = this.findPlaceIndex(id);

    return this.places.at(index)!;
  }

  create(createPlaceDto: CreatePlaceDto) {
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


    this.places.push(newPlace);

    return newPlace;
  }

  update(id: string, updatePlaceDto: UpdatePlaceDto): Place {
    const place: Place = this.findOne(id);

    Object.assign(place, updatePlaceDto);
    place.updatedAt = new Date();

    return place;
  }

  remove(id: string) {
    const index: number = this.findPlaceIndex(id);
    this.places.splice(index, 1);
  }

  private findPlaceIndex(id: string): number {
    const index: number = this.places.findIndex(
      (place: Place) => place.id === id
    );

    if (index === -1) {
      throw new NotFoundException(
        `L'endroit avec l'ID "${id}" n'existe pas.`
      );
    }

    return index;
  }
}
