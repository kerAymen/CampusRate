import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaceDto } from './create-place.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {
    @ApiProperty({
        description: "Nom de l'endroit",
        example: 'Bibliothèque principale',
        required: false,
    })
    name?: string;

    @ApiProperty({
        description: "Description de l'endroit",
        example: 'Espace calme avec prises',
        required: false,
    })
    description?: string;

    @ApiProperty({
        description: "Catégorie de l'endroit",
        example: 'STUDY_SPACE',
        required: false,
    })
    category?: string;

    @ApiProperty({
        description: "Adresse de l'endroit",
        example: 'Pavillon A, local A-210',
        required: false,
    })
    address?: string;

    @ApiProperty({
        description: "Services à cet endroit",
        example: ['WIFI', 'POWER_OUTLETS'],
        type: [String],
        required: false,
    })
    services?: string[];

    @ApiProperty({
        description: "État de l'endroit",
        example: 'ACTIVE',
        required: false,
    })
    status?: string;
}