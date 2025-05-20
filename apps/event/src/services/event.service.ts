/**
File Name : event.service
Description : Event Server - Service(event)
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
2025.05.16  이유민      Modified    트랜잭션 추가
2025.05.16  이유민      Modified    보상 요청 기능 추가
2025.05.18  이유민      Modified    이벤트 정보 수정 변경
2025.05.18  이유민      Modified    에러 status code 및 메세지 수정
2025.05.19  이유민      Modified    이벤트 기간 검증 추가
2025.05.19  이유민      Modified    이벤트 보상 요청 파일 분리
2025.05.20  이유민      Modified    admin 외 기간 내 이벤트만 조회 가능 추가
2025.05.20  이유민      Modified    코드 리팩토링
2025.05.20  이유민      Modified    출석체크 오류 수정
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
import { EventRepository } from '@event/repositories/event.repository';
import { EventRewardRepository } from '@event/repositories/event_reward.repository';
import { ConditionRepository } from '@event/repositories/event_condition.repository';
import { ItemRepository } from '@event/repositories/item.repository';
import { AttendanceRepository } from '@event/repositories/attendance_log.repository';
import { GroupRepository } from '@event/repositories/event_group.repository';
import { CreateEventDto, UpdateEventDto } from '@app/dto';
import {
  validateObjectIdOrThrow,
  validateObjectPropertyIdsOrThrow,
} from '@app/utils/validation';
import {
  existsByConditionTargetId,
  isModified,
  isNowInRange,
  processBatch,
} from '../event.service.utils';
import { endOfDay, startOfDay } from 'date-fns';
import { UserRole } from '@app/entity';

@Injectable()
export class EventService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly eventRepository: EventRepository,
    private readonly groupRepository: GroupRepository,
    private readonly conditionRepository: ConditionRepository,
    private readonly eventRewardRepository: EventRewardRepository,
    private readonly itemRepository: ItemRepository,
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  async create(eventAndRewardData: CreateEventDto): Promise<object> {
    const { event, condition, reward } = eventAndRewardData;

    // 유효성 검사
    validateObjectPropertyIdsOrThrow(condition, 'target_id');
    validateObjectPropertyIdsOrThrow(reward, 'item_id');

    let group_id;
    if (event.group_id) {
      group_id = new Types.ObjectId(event.group_id);
      validateObjectIdOrThrow(group_id);

      const isGroup = await this.groupRepository.findOneById(group_id);
      if (!isGroup) throw new NotFoundException('리소스를 찾을 수 없습니다.');
    }

    // target_id 확인
    await Promise.all(
      condition.map(async (e) => {
        await existsByConditionTargetId({
          type: e.type,
          target_id: e.target_id ? new Types.ObjectId(e.target_id) : null,
          itemRepository: this.itemRepository,
        });
      }),
    );

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        // event 데이터 생성
        const newEvent = await this.eventRepository.create(
          {
            ...event,
            group_id,
            start_date: new Date(event.start_date),
            end_date: new Date(event.end_date),
          },
          session,
        );

        const event_id = newEvent._id as Types.ObjectId;

        // reward 데이터 생성
        await Promise.all(
          reward.map(async (e) => {
            await this.eventRewardRepository.createReward(
              {
                ...e,
                item_id: new Types.ObjectId(e.item_id),
                event_id,
              },
              session,
            );
          }),
        );

        await Promise.all(
          condition.map(async (e) => {
            await this.conditionRepository.createCondition(
              {
                ...e,
                event_id,
                target_id: e.target_id ? new Types.ObjectId(e.target_id) : null,
              },
              session,
            );
          }),
        );
      });
      await session.commitTransaction();
      return { message: '데이터가 정상적으로 등록되었습니다.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findEventAll(role?: string) {
    let query;
    if (role !== UserRole.ADMIN) {
      const today = new Date();
      query = {
        start_date: { $lte: today },
        end_date: { $gte: today },
        status: true,
      };
    }

    const eventList = await this.eventRepository.findEventbyFilters(query);
    return { eventList };
  }

  async findEventById(id: string, role?: string) {
    // 유효성 검사
    validateObjectIdOrThrow(id);

    const eventData = await this.eventRepository.findEventById(id);
    if (!eventData) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    if (
      role !== UserRole.ADMIN &&
      (!isNowInRange(eventData.start_date, eventData.end_date) ||
        !eventData.status)
    )
      throw new NotFoundException('리소스를 찾을 수 없습니다.');

    const event_id = new Types.ObjectId(id);

    const groupData = await this.groupRepository.findOneById(
      eventData.group_id,
    );

    const rewardList = await this.eventRewardRepository.findByFilters({
      event_id,
    });

    // conditionList 관련
    const conditionList =
      await this.conditionRepository.findConditionsByFilters({ event_id });

    const targetList = [];
    await Promise.all(
      conditionList.map(async (e) => {
        const targetInfo = await existsByConditionTargetId({
          type: e.type,
          target_id: e.target_id ? new Types.ObjectId(e.target_id) : null,
          itemRepository: this.itemRepository,
        });
        if (Object.keys(targetInfo).length !== 0) targetList.push(targetInfo);
      }),
    );

    for (const condition of conditionList) {
      if (condition.target_id !== null) {
        const matchedTarget = targetList.find(
          (target) => target._id.toString() === condition.target_id.toString(),
        );
        condition.target_id = matchedTarget;
      }
    }

    return { eventData, groupData, rewardList, conditionList };
  }

  async updateEventById(
    id: string,
    updateData: UpdateEventDto,
  ): Promise<object> {
    const { event, condition, reward } = updateData;

    // 유효성 검사
    if (!(await this.eventRepository.findEventById(id))) {
      throw new NotFoundException('리소스를 찾을 수 없습니다.');
    }
    validateObjectIdOrThrow(id);
    validateObjectPropertyIdsOrThrow(condition, 'target_id');
    validateObjectPropertyIdsOrThrow(reward, 'item_id');

    let group_id;
    if (event.group_id) {
      validateObjectIdOrThrow(event.group_id);
      group_id = new Types.ObjectId(event.group_id);
    } else if (event.group_id == undefined || event.group_id == null) {
      group_id = null;
    }

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        const event_id = new Types.ObjectId(id);

        // 현재 데이터 가져오기
        const beforeReward = await this.eventRewardRepository.findByFilters(
          {
            event_id,
          },
          false,
        );
        const beforeCondition =
          await this.conditionRepository.findConditionsByFilters({
            event_id,
          });

        const rewardModified = isModified(beforeReward, reward, 'reward_id');
        const conditionModified = isModified(
          beforeCondition,
          condition,
          'condition_id',
        );

        // 데이터 반영
        // 이벤트 데이터 수정
        await this.eventRepository.updateEventById(
          id,
          {
            ...event,
            group_id,
            start_date: new Date(event.start_date),
            end_date: new Date(event.end_date),
          },
          session,
        );

        // 보상 데이터
        await processBatch(rewardModified.dataToInsert, async (e) => {
          await this.eventRewardRepository.createReward(
            { ...e, item_id: new Types.ObjectId(e.item_id), event_id },
            session,
          );
        });

        await processBatch(rewardModified.dataToUpdate, async (e) => {
          await this.eventRewardRepository.updateRewardById(
            e.reward_id,
            { item_id: new Types.ObjectId(e.item_id), amount: e.amount },
            session,
          );
        });

        await processBatch(rewardModified.dataToDelete, async (e) => {
          await this.eventRewardRepository.deleteRewardById(e, session);
        });

        // 조건 데이터
        await processBatch(conditionModified.dataToInsert, async (e) => {
          await this.conditionRepository.createCondition(
            { ...e, event_id },
            session,
          );
        });

        await processBatch(conditionModified.dataToUpdate, async (e) => {
          await this.conditionRepository.updateConditionsById(
            e.condition_id,
            { ...e, target_id: new Types.ObjectId(e.target_id) },
            session,
          );
        });

        await processBatch(conditionModified.dataToDelete, async (e) => {
          await this.conditionRepository.deleteConditionsByTarget(
            { _id: new Types.ObjectId(e) },
            session,
          );
        });
      });

      await session.commitTransaction();
      return { message: '데이터가 정상적으로 수정되었습니다.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async deleteEventById(id: string): Promise<object> {
    validateObjectIdOrThrow(id);
    if (!(await this.eventRepository.findEventById(id)))
      throw new BadRequestException('리소스를 찾을 수 없습니다.');

    const event_id = new Types.ObjectId(id);

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        await this.eventRepository.deleteEventById(id, session);
        await this.eventRewardRepository.deleteRewardsByTarget(
          { event_id },
          session,
        );
        await this.conditionRepository.deleteConditionsByTarget(
          { event_id },
          session,
        );
      });

      await session.commitTransaction();
      return { message: '데이터가 정상적으로 삭제되었습니다.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async createAttendance(user_id: string): Promise<object> {
    if (!user_id) throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    const objectUserId = new Types.ObjectId(user_id);
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    const isAttend = await this.attendanceRepository.findByToday(
      objectUserId,
      start,
      end,
    );
    if (isAttend) throw new ConflictException('오늘은 이미 출석하셨습니다.');

    await this.attendanceRepository.createAttend({
      user_id: objectUserId,
      date: new Date(),
    });

    return { message: '출석 체크가 완료되었습니다.' };
  }
}
