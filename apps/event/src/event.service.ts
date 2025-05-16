/**
File Name : event.service
Description : Event Server - Service
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
2025.05.16  이유민      Modified    트랜잭션 추가
*/
import { BadRequestException, Injectable } from '@nestjs/common';
import { isValidObjectId, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { EventRepository } from './repository/event.repository';
import { EventRewardRepository } from './repository/event_reward.repository';
import { ItemRepository } from './repository/item.repository';
import { ConditionRepository } from './repository/event_condition.repository';
import { CreateEventDto, UpdateEventDto } from '@app/dto';
import {
  validateObjectIdOrThrow,
  validateObjectPropertyIdsOrThrow,
} from '@app/utils/validation';
import { getRepositoryByConditionType } from './event.service.utils';

@Injectable()
export class EventService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly eventRepository: EventRepository,
    private readonly eventRewardRepository: EventRewardRepository,
    private readonly itemRepository: ItemRepository,
    private readonly conditionRepository: ConditionRepository,
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
          target_id: e.target_id,
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

        const event_id = newEvent._id.toString();

        // reward 데이터 생성
        await Promise.all(
          reward.map(async (e) => {
            await this.eventRewardRepository.createReward(
              {
                ...e,
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
    if (!isValidObjectId(id)) {
      throw new BadRequestException('유효하지 않은 id입니다.');
    }

    const eventData = await this.eventRepository.findEventById(id);

    const rewardList = await this.eventRewardRepository.findByFilters({
      event_id: eventData._id.toString(),
    });
    return { eventData, rewardList };
  }

  async updateEventById(id: string, updateData: UpdateEventDto) {
    const { event, reward } = updateData;

    if (!isValidObjectId(id)) {
      throw new BadRequestException('유효하지 않은 id입니다.');
    }

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        const beforeReward = await this.eventRewardRepository.findByFilters({
          event_id: id,
        }); // 현재 보상 데이터 가져오기

        const rewardToInsert = []; // 추가되는 보상 데이터
        const rewardToUpdate = []; // 수정되는 보상 데이터
        const rewardToDelete = []; // 삭제되는 보상 데이터

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
              event_id: id,
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
      session.endSession();
      return { message: '성공적으로 수정되었습니다.' };
    } catch (error) {
      session.endSession();
      throw error;
    }
  }

  async deleteEventById(id: string) {
    validateObjectIdOrThrow(id);

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        await this.eventRepository.deleteEventById(id, session);
        await this.eventRewardRepository.deleteRewardsByTarget(
          { event_id: id },
          session,
        );
        await this.conditionRepository.deleteConditionsByTarget(
          { event_id: id },
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
}
