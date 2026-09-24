import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty({
    description: "Identifiant de l'appréciation",
    example: 'rev_01JXYZ789',
  })
  id!: string;

  @ApiProperty({
    description: "Identifiant de l'endroit associé",
    example: 'plc_01JABC123',
  })
  placeId!: string;

  @ApiProperty({
    description: "Nom ou pseudonyme de l'auteur",
    example: 'Samira',
  })
  authorName!: string;

  @ApiProperty({
    description: "Note de l'endroit",
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  rating!: number;

  @ApiProperty({
    description: "Commentaire sur l'endroit",
    example: 'Calme et Wi-Fi stable.',
  })
  comment!: string;

  @ApiProperty({
    description: "Date de création de l'appréciation",
    example: new Date().toISOString(),
  })
  createdAt!: Date;

  @ApiProperty({
    description: "Date de modification de l'appréciation",
    example: new Date().toISOString(),
  })
  updatedAt!: Date;
}