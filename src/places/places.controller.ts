import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, } from '@nestjs/common';

import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceResponseDto } from './dto/response-place.dto';

import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un endroit',
    description: 'Ajoute un endroit à la collection courante.',
  })
  @ApiCreatedResponse({
    description: 'Endroit créé.',
    type: PlaceResponseDto,
    headers: {
      Location: {
        description: 'URI de la nouvelle ressource',
        schema: { type: 'string' },
      },
    },
  })
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les endroits',
    description: 'Lister tous les endroits de la collection courante.',
  })
  findAll() {
    return this.placesService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: "Identifiant de l'endroit",
  })
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Endroit modifié.',
    type: PlaceResponseDto,
  })
  @ApiOperation({
    summary: 'Modifier un endroit',
    description: "Modifier un ou plusieurs attributs d'un endroit.",
  })
  update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer un endroit',
    description: 'Retirer un endroit de la collection courante.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.placesService.remove(id);
  }
}