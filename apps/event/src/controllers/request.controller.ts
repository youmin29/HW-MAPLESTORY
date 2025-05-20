/**
File Name : request.controller
Description : Event Server - Controller(request)
Author : 이유민

History
Date        Author      Status      Description
2025.05.19  이유민      Created     
2025.05.19  이유민      Modified    이벤트 보상 요청 파일 분리
*/
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RequestService } from '@event/services/request.service';
import { GetRequestQueryDto } from '@app/dto/event.dto';

@Controller('event/request')
@ApiTags('이벤트 보상 요청 API')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post(':id')
  @ApiOperation({
    summary: '보상 요청 API',
  })
  async createRequestReward(
    @Param('id') id: string,
    @Body('user_id') user_id: string,
  ) {
    return this.requestService.requestEventReward(id, user_id);
  }

  @Get('all')
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
    return this.requestService.findRewardRequestAll(query);
  }

  @Get(':user_id')
  @ApiOperation({
    summary: '본인 또는 특정 사용자 보상 요청 조회 API',
  })
  async findUserRewardRequest(
    @Param('user_id') target_id: string,
    @Query() query: GetRequestQueryDto,
  ) {
    return this.requestService.findUserRewardRequest(target_id, query);
  }
}
