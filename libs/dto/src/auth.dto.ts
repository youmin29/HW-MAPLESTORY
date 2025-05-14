import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '@app/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({ description: '사용자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '사용자 비밀번호' })
  @IsString()
  @MinLength(6, { message: '비밀번호는 6자리 이상이어야 합니다.' })
  password: string;

  @ApiProperty({ description: '사용자 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '사용자 전화번호' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '사용자 역할' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: string;
}
