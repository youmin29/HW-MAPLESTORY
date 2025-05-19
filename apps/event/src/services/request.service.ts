/**
File Name : request.service
Description : Event Server - Repository(request)
Author : 이유민

History
Date        Author      Status      Description
2025.05.19  이유민      Created     
2025.05.19  이유민      Modified    이벤트 보상 요청 파일 분리
2025.05.20  이유민      Modified    인벤토리에 보상 지급 추가
2025.05.20  이유민      Modified    코드 리팩토링
*/
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { GetRequestQueryDto } from '@app/dto';
import { validateObjectIdOrThrow } from '@app/utils/validation';
import {
  addRewardToInventory,
  isNowInRange,
  validateEventCondition,
} from '@event/event.service.utils';
import { EventRepository } from '@event/repositories/event.repository';
import { EventRewardRepository } from '@event/repositories/event_reward.repository';
import { RequestRepository } from '@event/repositories/event_reward_requests.repository';
import { ConditionRepository } from '@event/repositories/event_condition.repository';
import { AttendanceRepository } from '@event/repositories/attendance_log.repository';
import { InventoryRepository } from '@event/repositories/inventory.repository';

@Injectable()
export class RequestService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly eventRepository: EventRepository,
    private readonly rewardRepository: EventRewardRepository,
    private readonly requestRepository: RequestRepository,
    private readonly conditionRepository: ConditionRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  async requestEventReward(id: string, userId: string): Promise<object> {
    if (!userId) throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    validateObjectIdOrThrow(id);
    validateObjectIdOrThrow(userId);

    const event_id = new Types.ObjectId(id);
    const user_id = new Types.ObjectId(userId);
    try {
      const isEvent = await this.eventRepository.findEventById(id);
      if (!isEvent || !isEvent.status)
        throw new NotFoundException('리소스를 찾을 수 없습니다.');

      if (!isNowInRange(isEvent.start_date, isEvent.end_date))
        throw new BadRequestException('이벤트 기간이 아닙니다.');

      const isRequest = await this.requestRepository.findOneByFilter({
        user_id,
        event_id,
        status: true,
      });

      if (isRequest) {
        throw new ConflictException('이미 보상을 수령했습니다.');
      }

      const conditionList =
        await this.conditionRepository.findConditionsByFilters({ event_id });

      const validEvent = await validateEventCondition({
        user_id,
        conditionList,
        attendRepository: this.attendanceRepository,
        inventoryRepository: this.inventoryRepository,
      });

      if (!validEvent) {
        throw new BadRequestException('이벤트 조건이 충족되지 않았습니다.');
      }

      //보상 지급
      const rewardList = await this.rewardRepository.findByFilters({
        event_id,
      });
      await addRewardToInventory(
        user_id,
        rewardList,
        conditionList,
        this.inventoryRepository,
      );

      await this.requestRepository.create({ event_id, user_id, status: true });
      return { message: '보상이 지급되었습니다.' };
    } catch (err) {
      await this.requestRepository.create({
        event_id,
        user_id,
        status: false,
        reason: err.message || '알 수 없는 에러',
      });

      throw err;
    }
  }

  async findRewardRequestAll(query: GetRequestQueryDto) {
    const filter: any = {};

    if (query.status) filter.status = query.status;
    if (query.eventId) {
      validateObjectIdOrThrow(query.eventId);
      filter.event_id = new Types.ObjectId(query.eventId);
    }
    if (query.userId) {
      validateObjectIdOrThrow(query.userId);
      filter.user_id = new Types.ObjectId(query.userId);
    }

    const sortBy = query.sortBy === 'createdAt' ? query.sortBy : 'event_id';
    const sortOrder = query.order === 'asc' ? 1 : -1;

    const requestList = await this.requestRepository.findByFilter(filter, {
      [sortBy]: sortOrder,
    });

    return { requestList };
  }

  async findUserRewardRequest(target_id: string, query: GetRequestQueryDto) {
    validateObjectIdOrThrow(target_id);

    const { requestList } = await this.findRewardRequestAll({
      ...query,
      userId: target_id,
    });

    return { requestList };
  }
}
