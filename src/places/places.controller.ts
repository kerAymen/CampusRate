import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, } from '@nestjs/common';

import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceResponseDto } from './dto/response-place.dto';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto';

import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, } from '@nestjs/swagger';

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
  @ApiBadRequestResponse({
    description: 'Données invalides.',
    type: ProblemDetailsDto,
  })
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les endroits',
    description: 'Liste tous les endroits de la collection courante.',
  })
  @ApiOkResponse({
    description: 'Liste des endroits.',
    type: PlaceResponseDto,
    isArray: true,
  })
  findAll() {
    return this.placesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consulter un endroit',
    description: 'Retourne un endroit à partir de son identifiant.',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant UUID de l'endroit",
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Endroit trouvé.',
    type: PlaceResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Endroit inexistant.',
    type: ProblemDetailsDto,
  })
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un endroit',
    description: "Modifie un ou plusieurs attributs d'un endroit.",
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant UUID de l'endroit",
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Endroit modifié.',
    type: PlaceResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Données invalides.',
    type: ProblemDetailsDto,
  })
  @ApiNotFoundResponse({
    description: 'Endroit inexistant.',
    type: ProblemDetailsDto,
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
    description: 'Retire un endroit de la collection courante.',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant de l'endroit",
  })
  @ApiNoContentResponse({
    description: 'Endroit supprimé.',
  })
  @ApiNotFoundResponse({
    description: 'Endroit inexistant.',
    type: ProblemDetailsDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.placesService.remove(id);
  }
}