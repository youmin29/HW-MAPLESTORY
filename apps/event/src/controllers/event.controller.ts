/**
File Name : event.controller
Description : Event Server - Controller(event)
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
2025.05.16  이유민      Modified    보상 요청 기능 추가
2025.05.18  이유민      Modified    출석체크 기능 추가
2025.05.19  이유민      Modified    이벤트 보상 요청 파일 분리
*/
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { EventService } from '../services/event.service';
import { CreateEventDto, UpdateEventDto } from '@app/dto/event.dto';

@Controller('event')
@ApiTags('이벤트 정보 API')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({
    summary: '이벤트 생성 API',
  })
  @ApiBody({ type: CreateEventDto })
  async create(
    @Body()
    eventData: CreateEventDto,
  ) {
    return this.eventService.create(eventData);
  }

  @Get()
  @ApiOperation({
    summary: '이벤트 목록 조회 API',
  })
  async findEventAll() {
    return this.eventService.findEventAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '이벤트 상세 조회 API',
  })
  async findEventById(@Param('id') id: string) {
    return this.eventService.findEventById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: '이벤트 수정 API',
  })
  async updateEventById(
    @Param('id') id: string,
    @Body() updateData: UpdateEventDto,
  ) {
    return this.eventService.updateEventById(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '이벤트 삭제 API',
  })
  async deleteEventById(@Param('id') id: string) {
    return this.eventService.deleteEventById(id);
  }

  @Post('attend')
  @ApiOperation({
    summary: '출석체크 API',
  })
  async createAttendance(@Body('user_id') user_id: string) {
    return this.eventService.createAttendance(user_id);
  }
}
