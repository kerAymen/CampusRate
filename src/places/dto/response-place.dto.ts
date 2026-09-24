import { ApiProperty } from '@nestjs/swagger';

export class PlaceResponseDto {
    @ApiProperty({
        description: "Identifiant de l'endroit",
        example: 'plc_01JABC123',
        required: true,
    })
    id!: string;

    @ApiProperty({
        description: "Nom de l'endroit",
        example: 'Bibliothèque principale',
    })
    name!: string;

    @ApiProperty({
        description: "Description de l'endroit",
        example: 'Espace calme avec prises.',
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
    })
    services!: string[];

    @ApiProperty({
        description: "État de l'endroit",
        example: 'ACTIVE',
    })
    status!: string;

    @ApiProperty({
        description: "Note moyenne de l'endroit",
        example: 4.25,
        nullable: true,
    })
    averageRating!: number | null;

    @ApiProperty({
        description: "Nombre d'appréciations de l'endroit",
        example: 12,
    })
    reviewCount!: number;

    @ApiProperty({
        description: "Date de création de l'endroit",
        example: new Date().toISOString(),
    })
    createdAt!: Date;

    @ApiProperty({
        description: "Date de modification de l'endroit",
        example: new Date().toISOString(),
    })
    updatedAt!: Date;
}