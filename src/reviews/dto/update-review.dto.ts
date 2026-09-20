import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, Length } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @ApiProperty({
    description: "Nom ou pseudonyme de l'auteur",
    example: 'Samira',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  authorName?: string;

  @ApiProperty({
    description: "Note de l'endroit",
    example: 4,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({
    description: "Commentaire sur l'endroit",
    example: 'Calme et Wi-Fi stable.',
    required: false,
    minLength: 1,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  comment?: string;
}