/**
File Name : auth.controller
Description : auth 서버 라우팅 Controller
Author : 이유민

History
Date        Author      Status      Description
2025.05.17  이유민      Created     
2025.05.17  이유민      Modified    Gateway 라우팅 추가
2025.05.19  이유민      Modified    Swagger 문서 수정
*/
import { Body, Controller, Post } from '@nestjs/common';
import { RolesGuard } from '@gateway/guards/roles.guard';
import { JwtAuthGuard } from '@gateway/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '@gateway/decorators/roles.decorator';
import { UserRole } from '@app/entity';
import { ApiBody, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAuthDto, UpdateUserRoleDto } from '@app/dto';
import { AuthService } from '@gateway/services/auth.service';

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
    return this.authService.createAuth({
      ...authData,
    });
  }

  @Post('signin')
  @ApiOperation({
    summary: '로그인 API',
  })
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return this.authService.validateServiceUser(email, password);
  }

  @Post('role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '역할 관리 API' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserRoleDto })
  async changeUserRole(@Body() updateDto: UpdateUserRoleDto) {
    return this.authService.changeUserRole(updateDto);
  }
}
