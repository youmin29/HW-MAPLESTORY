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
2025.05.20  이유민      Modified    유저 API 추가
*/
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import {
  CreateAuthDto,
  CreateInventoryDto,
  UpdateUserRoleDto,
} from '@app/dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/signup')
  @ApiTags('회원 API')
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

  @Post('auth/signin')
  @ApiTags('회원 API')
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

  @Get('user')
  @ApiTags('유저 API')
  @ApiOperation({ summary: '유저 조회 API' })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: '유저 이름',
  })
  @ApiBearerAuth()
  async findUserAll(@Query('name') name?: string) {
    const filters = name ? { name } : {};
    return this.authService.findUsersByFilters(filters);
  }

  @Post('user/role')
  @ApiTags('유저 API')
  @ApiOperation({ summary: '역할 관리 API' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserRoleDto })
  async changeUserRole(@Body() updateDto: UpdateUserRoleDto) {
    return this.authService.changeUserRole(updateDto);
  }

  @Post('user/inventory')
  @ApiTags('유저 API')
  @ApiOperation({ summary: '인벤토리 아이템 추가 API' })
  @ApiBody({ type: CreateInventoryDto })
  @ApiBearerAuth()
  async createInventory(@Body() createDto: CreateInventoryDto) {
    return this.authService.createInventory(createDto);
  }
}
