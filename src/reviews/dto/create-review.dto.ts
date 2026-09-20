import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min, Length } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: "Nom ou psudonyme de l'auteur",
    example: 'Samira',
  })
  @IsString()
  @IsNotEmpty()
  authorName!: string;

  @ApiProperty({
    description: "Note de l'endroit",
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({
    description: "Commentaire sur l'endroit",
    example: 'Calme et Wi-Fi stable.',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  comment!: string;
}