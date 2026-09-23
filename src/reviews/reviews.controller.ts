import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, } from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/response-review.dto';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto';

import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, } from '@nestjs/swagger';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('places/:placeId/reviews')
  @ApiOperation({
    summary: 'Créer une appréciation',
    description: 'Ajoute une appréciation à un endroit.',
  })
  @ApiParam({
    name: 'placeId',
    description: "Identifiant de l'endroit",
  })
  @ApiCreatedResponse({
    description: 'Appréciation créée.',
    type: ReviewResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Données invalides.',
    type: ProblemDetailsDto,
  })
  @ApiNotFoundResponse({
    description: 'Endroit inexistant.',
    type: ProblemDetailsDto,
  })
  create(
    @Param('placeId') placeId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(placeId, createReviewDto);
  }

  @Get('places/:placeId/reviews')
  @ApiOperation({
    summary: "Lister les appréciations d'un endroit",
    description: "Liste les appréciations associées à un endroit.",
  })
  @ApiParam({
    name: 'placeId',
    description: "Identifiant de l'endroit",
  })
  @ApiOkResponse({
    description: "Liste des appréciations de l'endroit.",
    type: ReviewResponseDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Endroit inexistant.',
    type: ProblemDetailsDto,
  })
  findAllByPlace(@Param('placeId') placeId: string) {
    return this.reviewsService.findAllByPlace(placeId);
  }

  @Get('reviews/:id')
  @ApiOperation({
    summary: 'Consulter une appréciation',
    description: 'Retourne une appréciation à partir de son identifiant.',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant de l'appréciation",
  })
  @ApiOkResponse({
    description: 'Appréciation trouvée.',
    type: ReviewResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Appréciation inexistante.',
    type: ProblemDetailsDto,
  })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch('reviews/:id')
  @ApiOperation({
    summary: 'Modifier une appréciation',
    description: "Modifie un ou des attributs d'une appréciation.",
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant de l'appréciation",
  })
  @ApiOkResponse({
    description: 'Appréciation modifiée.',
    type: ReviewResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Données invalides.',
    type: ProblemDetailsDto,
  })
  @ApiNotFoundResponse({
    description: 'Appréciation inexistante.',
    type: ProblemDetailsDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete('reviews/:id')
  @ApiOperation({
    summary: 'Supprimer une appréciation',
    description: 'Retire une appréciation de la collection courante.',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant de l'appréciation",
  })
  @ApiNoContentResponse({
    description: 'Appréciation supprimée.',
  })
  @ApiNotFoundResponse({
    description: 'Appréciation inexistante.',
    type: ProblemDetailsDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}