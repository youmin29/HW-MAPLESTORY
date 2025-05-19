/**
File Name : request.controller
Description : event 서버 라우팅 Controller - request
Author : 이유민

History
Date        Author      Status      Description
2025.05.20  이유민      Created     
2025.05.20  이유민      Modified    이벤트 보상 요청 파일 분리
*/
import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@gateway/guards/auth.guard';
import { RolesGuard } from '@gateway/guards/roles.guard';
import { UserRole } from '@app/entity';
import { Roles } from '@gateway/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RequestService } from '@gateway/services/request.service';
import { GetRequestQueryDto } from '@app/dto/event.dto';

@Controller('event/request')
@ApiTags('이벤트 보상 요청 API')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '보상 요청 API',
  })
  async createRequestReward(@Param('id') id: string, @Req() req) {
    return this.requestService.requestEventReward(id, req.user.user_id);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR)
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 또는 특정 사용자 보상 요청 조회 API',
  })
  async findUserRewardRequest(
    @Param('user_id') target_id: string,
    @Query() query: GetRequestQueryDto,
    @Req() req,
  ) {
    return this.requestService.findUserRewardRequest(
      req.user,
      target_id,
      query,
    );
  }
}
