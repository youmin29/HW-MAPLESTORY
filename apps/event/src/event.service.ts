/**
File Name : event.service
Description : Event Server - Service
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
*/
import { BadRequestException, Injectable } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { EventRepository } from './repository/event.repository';
import { EventRewardRepository } from './repository/event_reward.repository';
import { ItemRepository } from './repository/item.repository';
import { ConditionRepository } from './repository/event_condition.repository';
import { CreateEventDto, UpdateEventDto } from '@app/dto';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventRewardRepository: EventRewardRepository,
    private readonly itemRepository: ItemRepository,
    private readonly conditionRepository: ConditionRepository,
  ) {}

  async create(eventAndRewardData: CreateEventDto) {
    const { event, condition, reward } = eventAndRewardData;

    // 유효성 검사
    if (
      condition.some(
        (e) => e.target_id !== null && !isValidObjectId(e.target_id),
      )
    ) {
      throw new BadRequestException('유효하지 않은 id가 포함되어 있습니다.');
    }

    // target_id 확인
    const CheckConditionItems = condition.map(async (e) => {
      // TODO: 함수화
      // const checkItems = switch (e.type) {
      //   case 'quest':
      //     return;
      //   case 'kill':
      //     return;
      //   case 'boss':
      //     return;
      //   case 'item':
      //     return await this.itemRepository.findOneById(e.target_id);
      // }
      if (e.type === 'item') {
        // 임시
        const checkItems = await this.itemRepository.findOneById(e.target_id);
        if (!checkItems)
          throw new BadRequestException('리소스가 존재하지 않습니다.');
      }
    });
    await Promise.all(CheckConditionItems);

    // TODO: 보상 아이템 유효성 검사 추가

    // event 데이터 생성
    const newEvent = await this.eventRepository.create({
      ...event,
      start_date: new Date(event.start_date),
      end_date: new Date(event.end_date),
    });

    const event_id = newEvent._id.toString();

    // reward 데이터 생성
    await Promise.all(
      reward.map((e) => {
        this.eventRewardRepository.createReward({
          ...e,
          event_id,
        });
      }),
    );

    await Promise.all(
      condition.map((e) => {
        this.conditionRepository.createCondition({
          ...e,
          event_id,
        });
      }),
    );

    return newEvent;
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
    await this.eventRepository.updateEventById(id, {
      ...event,
      start_date: new Date(event.start_date),
      end_date: new Date(event.end_date),
    });

    // 추가
    if (rewardToInsert.length > 0) {
      await Promise.all(
        rewardToInsert.map((e) => {
          this.eventRewardRepository.createReward({
            ...e,
          });
        }),
      );
    }

    // 수정
    if (rewardToUpdate.length > 0) {
      await Promise.all(
        rewardToUpdate.map((e) => {
          this.eventRewardRepository.updateRewardById(e.reward_id, {
            item_id: e.item_id,
            amount: e.amount,
          });
        }),
      );
    }

    // 삭제
    if (rewardToDelete.length > 0) {
      await Promise.all(
        rewardToDelete.map((e) => {
          this.eventRewardRepository.deleteRewardById(e);
        }),
      );
    }

    return { message: '성공적으로 수정되었습니다.' };
  }

  async deleteEventById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('유효하지 않은 id입니다.');
    }

    return this.eventRepository.deleteEventById(id);
  }
}
