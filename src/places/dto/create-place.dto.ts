import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty,IsString, } from 'class-validator';

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
  services?: string[];

  @ApiProperty({
    description: "État de l'endroit",
    example: 'ACTIVE',
    required: false,
  })
  status?: string;
}