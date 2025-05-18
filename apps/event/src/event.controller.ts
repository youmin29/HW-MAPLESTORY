/**
File Name : event.controller
Description : 이벤트 Controller
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
2025.05.16  이유민      Modified    보상 요청 기능 추가
2025.05.18  이유민      Modified    출석체크 기능 추가
*/
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';
import { EventService } from './event.service';
import {
  CreateEventDto,
  GetRequestQueryDto,
  UpdateEventDto,
} from '@app/dto/event.dto';

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

  @Post('reward/:id')
  @ApiOperation({
    summary: '보상 요청 API',
  })
  @ApiBody({ type: CreateEventDto })
  async createRequestReward(
    @Param('id') id: string,
    @Body('user_id') user_id: string,
  ) {
    return this.eventService.requestEventReward(id, user_id);
  }

  @Get('reward/all')
  @ApiOperation({
    summary: '전체 유저의 보상 요청 기록 조회 API',
  })
  @ApiQuery({
    name: 'status',
    type: String,
    required: false,
    description: '상태별 필터링',
    enum: ['true', 'false'],
  })
  @ApiQuery({
    name: 'eventId',
    type: String,
    required: false,
    description: '이벤트별 필터링',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    description: '정렬 기준',
    enum: ['createdAt', 'eventId'],
  })
  @ApiQuery({
    name: 'order',
    type: String,
    required: false,
    description: '정렬 순서',
    enum: ['asc', 'desc'],
  })
  async findRewardRequestAll(@Query() query: GetRequestQueryDto) {
    return this.eventService.findRewardRequestAll(query);
  }

  @Get('reward/:user_id')
  @ApiOperation({
    summary: '본인 또는 특정 사용자 보상 요청 조회 API',
  })
  async findUserRewardRequest(
    @Param('user_id') target_id: string,
    @Query() query: GetRequestQueryDto,
  ) {
    return this.eventService.findUserRewardRequest(target_id, query);
  }

  @Post('attend')
  @ApiOperation({
    summary: '출석체크 API',
  })
  async createAttendance(@Body('user_id') user_id: string) {
    return this.eventService.createAttendance(user_id);
  }
}
