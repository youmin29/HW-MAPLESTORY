/**
File Name : event.controller
Description : event 서버 라우팅 Controller
Author : 이유민

History
Date        Author      Status      Description
2025.05.17  이유민      Created     
2025.05.17  이유민      Modified    Gateway 라우팅 추가
2025.05.17  이유민      Modified    출석체크 기능 추가
2025.05.19  이유민      Modified    Swagger 문서 수정
2025.05.20  이유민      Modified    이벤트 보상 요청 파일 분리
2025.05.20  이유민      Modified    admin 외 기간 내 이벤트만 조회 가능 추가
*/
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { RolesGuard } from '@gateway/guards/roles.guard';
import { JwtAuthGuard } from '@gateway/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '@gateway/decorators/roles.decorator';
import { UserRole } from '@app/entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEventDto, UpdateEventDto } from '@app/dto';
import { EventService } from '@gateway/services/event.service';

@Controller('event')
@ApiTags('이벤트 API')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({
    summary: '이벤트 생성 API',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateEventDto })
  async create(
    @Body()
    eventData: CreateEventDto,
  ) {
    return this.eventService.create(eventData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '이벤트 목록 조회 API',
  })
  async findEventAll(@Req() req) {
    return this.eventService.findEventAll(req.user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '이벤트 상세 조회 API',
  })
  async findEventById(@Param('id') id: string, @Req() req) {
    return this.eventService.findEventById(id, req.user.role);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({
    summary: '이벤트 수정 API',
  })
  @ApiBearerAuth()
  async updateEventById(
    @Param('id') id: string,
    @Body() updateData: UpdateEventDto,
  ) {
    return this.eventService.updateEventById(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({
    summary: '이벤트 삭제 API',
  })
  @ApiBearerAuth()
  async deleteEventById(@Param('id') id: string) {
    return this.eventService.deleteEventById(id);
  }

  @Post('attend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: '출석체크 API',
  })
  @ApiBearerAuth()
  async createAttendance(@Req() req) {
    return this.eventService.createAttendance(req.user.user_id);
  }
}
