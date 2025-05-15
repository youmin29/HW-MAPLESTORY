/**
File Name : event.controller
Description : 이벤트 Controller
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
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
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from '@app/dto/event.dto';

@Controller('event')
@ApiTags('이벤트 API')
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
    summary: '이벤트 샹세 조회 API',
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
}
