import { ApiProperty } from '@nestjs/swagger';
import {ArrayUnique, IsIn, IsArray, IsNotEmpty, IsOptional, IsString, } from 'class-validator';

export class CreatePlaceDto {
  @ApiProperty({
    description: "Nom de l'endroit",
    example: 'Bibliothèque principale',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: "Description de l'endroit",
    example: 'Espace calme avec prises',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    description: "Catégorie de l'endroit",
    example: 'STUDY_SPACE',
  })
  @IsIn([
    'STUDY_SPACE',
    'LIBRARY',
    'FOOD_SERVICE',
    'SPORTS',
    'STUDENT_SERVICE',
    'COMPUTER_LAB',
    'OTHER',
  ])
  category!: string;

  @ApiProperty({
    description: "Adresse de l'endroit",
    example: 'Pavillon A, local A-210',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    description: "Services à cet endroit",
    example: ['WIFI', 'POWER_OUTLETS'],
    type: [String],
    required: false,
    default: [],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  services?: string[];

  @ApiProperty({
    description: "État de l'endroit",
    example: 'ACTIVE',
    required: false,
  })
  @IsOptional()
  @IsIn([
    'ACTIVE',
    'TEMPORARILY_CLOSED',
    'INACTIVE',
  ])
  status?: string;
}