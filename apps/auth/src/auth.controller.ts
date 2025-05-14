/**
File Name : auth.controller
Description : Auth Server - Controller
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
*/
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from '@app/dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('회원 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({
    summary: '회원가입 API',
  })
  @ApiBody({ type: CreateAuthDto })
  async create(
    @Body()
    authData: {
      email: string;
      password: string;
      name: string;
      role?: string;
      phone: string;
    },
  ) {
    const { email, password, name, role, phone } = authData;

    if (!email || !password || !name || !phone)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return this.authService.create({
      email,
      password: bcrypt.hashSync(authData.password, 10),
      name,
      phone,
      role: role ? role : 'user',
    });
  }

  @Post('login')
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '역할 관리 API' })
  async changeUserRole(
    @Body() { user_id, role }: { user_id: string; role: string },
  ) {
    if (!user_id || !role) throw new BadRequestException();

    return this.authService.changeUserRole(user_id, role);
  }
}
