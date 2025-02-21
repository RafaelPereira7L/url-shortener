import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'The date the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'The date the user was last updated',
  })
  updatedAt: Date;
}
