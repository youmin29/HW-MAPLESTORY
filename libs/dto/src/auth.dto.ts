/**
File Name : auth.dto
Description : Auth Dto 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
2025.05.15  이유민      Modified    Enum 코드 추가
2025.05.19  이유민      Modified    Mongoose ref 설정 추가
*/
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsMongoId,
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
  role: UserRole;
}

export class UpdateUserRoleDto {
  @ApiProperty({ description: '회원ID' })
  @IsMongoId()
  user_id: string;

  @ApiProperty({ description: '변경할 역할' })
  @IsEnum(UserRole)
  role: UserRole;
}
