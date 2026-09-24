import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Res,} from '@nestjs/common';
import type { Response } from 'express'; 
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceResponseDto } from './dto/response-place.dto';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto';

import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery,} from '@nestjs/swagger';

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
  async create(
    @Body() createPlaceDto: CreatePlaceDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const place = await this.placesService.create(createPlaceDto);

    response.setHeader('Location', `/v1/places/${place.id}`);

    return place;
  }
  

  @Get()
  @ApiOperation({
    summary: 'Lister tous les endroits',
    description: 'Liste tous les endroits de la collection courante.',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Catégorie utilisée pour filtrer les endroits',
    example: 'LIBRARY',
    })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numéro de la page',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: "Nombre d'endroits par page",
    example: 10,
  })
  @ApiOkResponse({
    description: 'Liste des endroits.',
  })
  findAll(
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.placesService.findAll(
      category,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consulter un endroit',
    description: 'Retourne un endroit à partir de son identifiant.',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant de l'endroit",
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