/**
File Name : event.service
Description : Event Server - Service
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
2025.05.16  이유민      Modified    트랜잭션 추가
2025.05.16  이유민      Modified    보상 요청 기능 추가
*/
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { EventRepository } from './repository/event.repository';
import { EventRewardRepository } from './repository/event_reward.repository';
import { ItemRepository } from './repository/item.repository';
import { ConditionRepository } from './repository/event_condition.repository';
import { CreateEventDto, GetRequestQueryDto, UpdateEventDto } from '@app/dto';
import {
  validateObjectIdOrThrow,
  validateObjectPropertyIdsOrThrow,
} from '@app/utils/validation';
import {
  checkAttendEvent,
  getRepositoryByConditionType,
} from './event.service.utils';
import { ConditionType } from '@app/entity/event_condition.entity';
import { AttendanceRepository } from './repository/attendance_log.repository';
import { RequestRepository } from './repository/event_reward_requests.repository';

@Injectable()
export class EventService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly eventRepository: EventRepository,
    private readonly eventRewardRepository: EventRewardRepository,
    private readonly itemRepository: ItemRepository,
    private readonly conditionRepository: ConditionRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly requestRepository: RequestRepository,
  ) {}

  async create(eventAndRewardData: CreateEventDto) {
    const { event, condition, reward } = eventAndRewardData;

    // 유효성 검사
    validateObjectPropertyIdsOrThrow(condition, 'target_id');
    validateObjectPropertyIdsOrThrow(reward, 'item_id');

    // target_id 확인
    await Promise.all(
      condition.map(async (e) => {
        await getRepositoryByConditionType({
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
      return { message: '이벤트가 생성되었습니다.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findEventAll() {
    const eventList = await this.eventRepository.findEventAll();
    return { eventList };
  }

  async findEventById(id: string) {
    // 유효성 검사
    validateObjectIdOrThrow(id);

    const eventData = await this.eventRepository.findEventById(id);
    if (!eventData) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    const event_id = new Types.ObjectId(id);

    const rewardList = await this.eventRewardRepository.findByFilters({
      event_id,
    });

    // conditionList 관련
    const conditionList =
      await this.conditionRepository.findConditionsByFilters({ event_id });

    const targetList = [];
    await Promise.all(
      conditionList.map(async (e) => {
        const targetInfo = await getRepositoryByConditionType({
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

    return { eventData, rewardList, conditionList };
  }

  async updateEventById(id: string, updateData: UpdateEventDto) {
    const { event, condition, reward } = updateData;

    // 유효성 검사
    if (!(await this.eventRepository.findEventById(id))) {
      throw new NotFoundException('리소스를 찾을 수 없습니다.');
    }
    validateObjectIdOrThrow(id);
    validateObjectPropertyIdsOrThrow(condition, 'target_id');
    validateObjectPropertyIdsOrThrow(reward, 'item_id');

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        const event_id = new Types.ObjectId(id);

        const beforeReward = await this.eventRewardRepository.findByFilters({
          event_id,
        }); // 현재 보상 데이터 가져오기

        const rewardToInsert = []; // 추가되는 보상 데이터
        const rewardToUpdate = []; // 수정되는 보상 데이터
        const rewardToDelete = []; // 삭제되는 보상 데이터

        // TODO: 코드 정리 및 condition 추가

        const newRewardIds = reward
          .filter((e) => e.reward_id !== null)
          .map((e) => e.reward_id);

        for (const rw of beforeReward) {
          if (!newRewardIds.includes(rw._id.toString()))
            rewardToDelete.push(rw._id.toString());
        }

        for (const rw of reward) {
          if (rw.reward_id === null) {
            rewardToInsert.push({
              item_id: rw.item_id,
              amount: rw.amount,
              event_id,
            });
          } else {
            rewardToUpdate.push({ ...rw });
          }
        }

        // 데이터 반영
        // 이벤트 데이터 수정
        await this.eventRepository.updateEventById(
          id,
          {
            ...event,
            start_date: new Date(event.start_date),
            end_date: new Date(event.end_date),
          },
          session,
        );

        // 추가
        if (rewardToInsert.length > 0) {
          await Promise.all(
            rewardToInsert.map(async (e) => {
              await this.eventRewardRepository.createReward(
                {
                  ...e,
                },
                session,
              );
            }),
          );
        }

        // 수정
        if (rewardToUpdate.length > 0) {
          await Promise.all(
            rewardToUpdate.map(async (e) => {
              await this.eventRewardRepository.updateRewardById(
                e.reward_id,
                {
                  item_id: e.item_id,
                  amount: e.amount,
                },
                session,
              );
            }),
          );
        }

        // 삭제
        if (rewardToDelete.length > 0) {
          await Promise.all(
            rewardToDelete.map(async (e) => {
              await this.eventRewardRepository.deleteRewardById(e, session);
            }),
          );
        }
      });

      await session.commitTransaction();
      return { message: '성공적으로 수정되었습니다.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async deleteEventById(id: string) {
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
      return { message: '성공적으로 삭제되었습니다.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async createRequestReward(id: string, userId: string) {
    validateObjectIdOrThrow(id);

    if (!(await this.eventRepository.findEventById(id)))
      throw new BadRequestException('리소스를 찾을 수 없습니다.');

    const event_id = new Types.ObjectId(id);
    const user_id = new Types.ObjectId(userId);

    const isRequest = await this.requestRepository.findOneByFilter({
      user_id,
      event_id,
      status: true,
    });

    if (isRequest) throw new ForbiddenException('이미 보상을 수령했습니다.');

    const conditionList =
      await this.conditionRepository.findConditionsByFilters({ event_id });

    await Promise.all(
      conditionList.map(async (condition) => {
        if (condition.type === ConditionType.ATTEND) {
          const validEvent = await checkAttendEvent(
            condition.quantity,
            user_id,
            this.attendanceRepository,
          );

          if (!validEvent) {
            await this.requestRepository.create({
              event_id,
              user_id,
              status: false,
            });
            throw new ForbiddenException('이벤트 조건이 충족되지 않았습니다.');
          }
        }
      }),
    );

    await this.requestRepository.create({ event_id, user_id, status: true });
    return { message: '보상이 지급되었습니다.' };
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

    return requestList;
  }

  async findUserRewardRequest(target_id: string, query: GetRequestQueryDto) {
    validateObjectIdOrThrow(target_id);

    const requestList = await this.findRewardRequestAll({
      ...query,
      userId: target_id,
    });

    return { requestList };
  }
}
