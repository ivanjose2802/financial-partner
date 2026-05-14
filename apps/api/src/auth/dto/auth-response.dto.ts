import { ApiProperty } from '@nestjs/swagger';

class UserProfileDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty({ nullable: true }) name: string | null;
  @ApiProperty({ nullable: true }) lastName: string | null;
}

export class AuthResponseDto {
  @ApiProperty() accessToken: string;
  @ApiProperty() user: UserProfileDto;
}
