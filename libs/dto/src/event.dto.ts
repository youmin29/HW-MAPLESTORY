/**
File Name : event.dto
Description : 이벤트 Dto 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
2025.05.16  이유민      Modified    Mongoose ref 설정 추가
2025.05.18  이유민      Modified    코드 리팩토링
*/
import {
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsEnum,
  IsDateString,
  IsOptional,
  IsArray,
  IsMongoId,
  IsIn,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ConditionType } from '@app/entity/event_condition.entity';

export class CreateEventInfoDto {
  @ApiProperty({ description: '이벤트 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '이벤트 시작 날짜' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: '이벤트 종료 날짜' })
  @IsDateString()
  end_date: string;

  @ApiProperty({ description: '이벤트 상태(활성/비활성)' })
  @IsBoolean()
  status: boolean;
}

export class CreateRewardDto {
  @ApiProperty({ description: '보상 아이템 ID' })
  @IsMongoId()
  item_id: string;

  @ApiProperty({ description: '보상 아이템 수량' })
  @IsNumber()
  amount: number;
}

export class CreateConditionDto {
  @ApiProperty({ description: '이벤트 조건 타입' })
  @IsEnum(ConditionType)
  type: ConditionType;

  @ApiProperty({ description: '이벤트 달성에 필요한 아이템' })
  @IsMongoId()
  @IsOptional()
  target_id?: string;

  @ApiProperty({ description: '아이템 수량' })
  @IsNumber()
  @IsOptional()
  quantity?: number;
}

export class UpdateConditionDto {
  @ApiProperty({ description: '조건 ID' })
  @IsMongoId()
  @IsOptional()
  condition_id?: string;

  @ApiProperty({ description: '이벤트 조건 타입' })
  @IsEnum(ConditionType)
  type: ConditionType;

  @ApiProperty({ description: '이벤트 달성에 필요한 아이템' })
  @IsMongoId()
  @IsOptional()
  target_id?: string;

  @ApiProperty({ description: '아이템 수량' })
  @IsNumber()
  @IsOptional()
  quantity?: number;
}

export class UpdateRewardDto {
  @ApiProperty({ description: '보상 ID' })
  @IsMongoId()
  @IsOptional()
  reward_id?: string;

  @ApiProperty({ description: '보상 아이템 ID' })
  @IsMongoId()
  item_id: string;

  @ApiProperty({ description: '보상 아이템 수량' })
  @IsNumber()
  amount: number;
}

export class CreateEventDto {
  @ApiProperty({
    type: CreateEventInfoDto,
    description: '생성할 이벤트 정보',
  })
  @ValidateNested()
  @Type(() => CreateEventInfoDto)
  event: CreateEventInfoDto;

  @ApiProperty({
    type: [CreateConditionDto],
    description: '이벤트 조건 정보',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateConditionDto)
  @IsArray()
  condition: CreateConditionDto[];

  @ApiProperty({
    type: [CreateRewardDto],
    description: '이벤트 보상 정보',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateRewardDto)
  @IsArray()
  reward: CreateRewardDto[];
}

export class UpdateEventDto {
  @ApiProperty({
    type: CreateEventInfoDto,
    description: '수정할 이벤트 정보',
  })
  @ValidateNested()
  @Type(() => CreateEventInfoDto)
  event: CreateEventInfoDto;

  @ApiProperty({
    type: [UpdateConditionDto],
    description: '이벤트 조건 정보',
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateConditionDto)
  @IsArray()
  condition: UpdateConditionDto[];

  @ApiProperty({
    type: [UpdateRewardDto],
    description: '수정할 이벤트 보상 정보',
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateRewardDto)
  @IsArray()
  reward: UpdateRewardDto[];
}

export class GetRequestQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  eventId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsIn(['createdAt', 'eventId'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: string = 'desc';
}
