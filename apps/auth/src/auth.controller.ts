/**
File Name : auth.controller
Description : Auth Server - Controller
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
2025.05.17  이유민      Modified    코드 리팩토링
2025.05.19  이유민      Modified    Swagger 문서 수정
*/
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto, UpdateUserRoleDto } from '@app/dto/auth.dto';

@Controller('auth')
@ApiTags('회원 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: '회원가입 API',
  })
  @ApiBody({ type: CreateAuthDto })
  async create(
    @Body()
    authData: CreateAuthDto,
  ) {
    const { email, password, name, role, phone } = authData;

    return this.authService.create({
      email,
      password: bcrypt.hashSync(password, 10),
      name,
      phone,
      role: role ? role : 'user',
    });
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: '로그인 API',
  })
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    if (!email || !password)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return this.authService.validateServiceUser(email, password);
  }

  @Post('role')
  @ApiOperation({ summary: '역할 관리 API' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserRoleDto })
  async changeUserRole(@Body() updateDto: UpdateUserRoleDto) {
    return this.authService.changeUserRole(updateDto);
  }
}
