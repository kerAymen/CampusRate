import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceDto {
  @ApiProperty({
    description: "Nom de l'endroit",
    example: 'Bibliothèque principale',
  })
  name!: string;

  @ApiProperty({
    description: "Description de l'endroit",
    example: 'Espace calme avec prises',
  })
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