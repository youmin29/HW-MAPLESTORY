/**
File Name : auth.controller
Description : auth 서버 라우팅 Controller
Author : 이유민

History
Date        Author      Status      Description
2025.05.17  이유민      Created     
2025.05.17  이유민      Modified    Gateway 라우팅 추가
2025.05.19  이유민      Modified    Swagger 문서 수정
2025.05.20  이유민      Modified    Throttler 수정
2025.05.20  이유민      Modified    유저 API 추가
2025.05.20  이유민      Modified    코드 리팩토링
*/
import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { RolesGuard } from '@gateway/guards/roles.guard';
import { JwtAuthGuard } from '@gateway/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '@gateway/decorators/roles.decorator';
import { UserRole } from '@app/entity';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateAuthDto, CreateInventoryDto, UpdateUserRoleDto } from '@app/dto';
import { AuthService } from '@gateway/services/auth.service';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/signup')
  @Throttle({ default: { limit: 5, ttl: 30 * 60 * 1000 } })
  @ApiTags('회원 API')
  @ApiOperation({
    summary: '회원가입 API',
  })
  @ApiBody({ type: CreateAuthDto })
  async create(
    @Body()
    authData: CreateAuthDto,
  ) {
    return this.authService.createAuth({
      ...authData,
    });
  }

  @Post('auth/signin')
  @Throttle({ default: { limit: 5, ttl: 60 * 1000 } })
  @ApiTags('회원 API')
  @ApiOperation({
    summary: '로그인 API',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return this.authService.validateServiceUser(email, password);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
    return this.authService.findUsersByFilters(name);
  }

  @Post('user/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiTags('유저 API')
  @ApiOperation({ summary: '역할 관리 API' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserRoleDto })
  async changeUserRole(@Body() updateDto: UpdateUserRoleDto) {
    return this.authService.changeUserRole(updateDto);
  }

  @Post('user/inventory')
  @UseGuards(JwtAuthGuard)
  @ApiTags('유저 API')
  @ApiOperation({ summary: '인벤토리 아이템 추가 API' })
  @ApiBody({ type: CreateInventoryDto })
  @ApiBearerAuth()
  async createInventory(@Body() createDto: CreateInventoryDto, @Req() req) {
    return this.authService.createInventory(req.user.user_id, createDto);
  }
}
