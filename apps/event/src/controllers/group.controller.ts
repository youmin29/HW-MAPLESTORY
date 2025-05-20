/**
File Name : group.controller
Description : Event Server - Controller(group)
Author : 이유민

History
Date        Author      Status      Description
2025.05.19  이유민      Created     
2025.05.19  이유민      Modified    이벤트 그룹 추가
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
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { GroupService } from '@event/services/group.service';
import { GroupDto } from '@app/dto';

@Controller('event/group')
@ApiTags('이벤트 그룹 API')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiOperation({
    summary: '이벤트 그룹 생성 API',
  })
  @ApiBody({ type: GroupDto })
  async create(@Body() groupDto: GroupDto) {
    return this.groupService.create(groupDto);
  }

  @Get()
  @ApiOperation({
    summary: '이벤트 그룹 목록 조회 API',
  })
  async findEventAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '이벤트 그룹 상세 조회 API',
  })
  async findOneById(@Param('id') id: string) {
    return this.groupService.findOneById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: '이벤트 그룹 수정 API',
  })
  async updateById(@Param('id') id: string, @Body() groupDto: GroupDto) {
    return this.groupService.updateById(id, groupDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '이벤트 삭제 API',
  })
  async deleteById(
    @Param('id') id: string,
    @Query('cascade') cascade?: string,
  ) {
    return this.groupService.deleteById(id, cascade);
  }
}
