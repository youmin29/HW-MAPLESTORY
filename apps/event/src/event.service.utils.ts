/**
File Name : event.service.utils
Description : event 유틸리티 함수
Author : 이유민

History
Date        Author      Status      Description
2025.05.16  이유민      Created     
2025.05.16  이유민      Modified    이벤트 유틸리티 함수 추가
2025.05.16  이유민      Modified    보상 요청 기능 추가
2025.05.18  이유민      Modified    이벤트 정보 수정 변경
2025.05.18  이유민      Modified    에러 status code 및 메세지 수정
*/
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ItemRepository } from './repository/item.repository';
import { AttendanceRepository } from './repository/attendance_log.repository';
import { InventoryRepository } from './repository/inventory.repository';
import { ConditionType, Condition } from '@app/entity/event_condition.entity';
import { Types } from 'mongoose';
import { isSameDay, startOfToday, subDays } from 'date-fns';

interface ValidateConditionTargetOptions {
  type: string;
  target_id: Types.ObjectId | null;
  itemRepository: ItemRepository;
}

interface ValidateEventConditionOptions {
  user_id: Types.ObjectId | null;
  conditionList: Condition[];
  attendRepository?: AttendanceRepository;
  inventoryRepository?: InventoryRepository;
}

export async function existsByConditionTargetId({
  type,
  target_id,
  itemRepository,
}: ValidateConditionTargetOptions) {
  let validItem = {};

  switch (type) {
    case ConditionType.QUEST:
      break;
    case ConditionType.KILL:
      break;
    case ConditionType.ATTEND:
      break;
    case ConditionType.ITEM:
      validItem = await itemRepository.findOneById(target_id);
      if (!validItem) throw new NotFoundException('리소스를 찾을 수 없습니다.');
      break;
    case ConditionType.BOSS:
      break;
    case ConditionType.INVITE:
      break;
    default:
      throw new BadRequestException(`${type}는 알 수 없는 타입입니다.`);
  }

  return validItem;
}

export async function validateEventCondition(
  validateOptions: ValidateEventConditionOptions,
) {
  const { user_id, conditionList } = validateOptions;

  for (const condition of conditionList) {
    switch (condition.type) {
      case ConditionType.QUEST:
        break;
      case ConditionType.KILL:
        break;
      case ConditionType.ATTEND:
        const attend = await checkAttendEvent(
          condition.quantity,
          user_id,
          validateOptions.attendRepository,
        );
        if (!attend) return false;
        break;
      case ConditionType.ITEM:
        const userInven =
          await validateOptions.inventoryRepository.findOneByFilters({
            user_id,
            item_id: condition.target_id,
          });
        if (!userInven || userInven.amount < condition.quantity) return false;
        break;
      case ConditionType.BOSS:
        break;
      case ConditionType.INVITE:
        break;
      default:
        throw new BadRequestException(
          `${condition.type}는 알 수 없는 타입입니다.`,
        );
    }
  }
  return true;
}

// 출석 이벤트 체크
export async function checkAttendEvent(
  quantity: number,
  user_id: Types.ObjectId,
  attendRepository: AttendanceRepository,
) {
  const today = startOfToday();
  const startDate = subDays(today, quantity - 1);

  const attend = await attendRepository.checkAttendEvent(user_id, startDate);

  for (let i = 0; i < quantity; i++) {
    const targetDate = subDays(today, quantity - 1 - i);

    const found = attend.some((a) => isSameDay(new Date(a.date), targetDate));

    if (!found) return false;
  }
  return true;
}

export function isModified(
  originalList: object[],
  updatedList: object[],
  compareKey: string,
) {
  const dataToInsert = []; // 추가되는 데이터
  const dataToUpdate = []; // 수정되는 데이터
  const dataToDelete = []; // 삭제되는 데이터

  const newDataIds = updatedList
    .filter((e) => e[compareKey] !== null && e[compareKey] !== undefined)
    .map((e) => e[compareKey]);

  // 삭제 데이터 리스트 연산
  for (const orgin of originalList) {
    if (!newDataIds.includes(orgin['_id'].toString()))
      dataToDelete.push(orgin['_id'].toString());
  }

  for (const updatedObj of updatedList) {
    if (
      updatedObj[compareKey] === null ||
      updatedObj[compareKey] === undefined
    ) {
      dataToInsert.push({ ...updatedObj });
    } else {
      const target = originalList.find(
        (e) => e['_id'].toString() === updatedObj[compareKey],
      );

      if (!target) continue;

      const updatedKeys = Object.keys(updatedObj);

      const isChanged = updatedKeys.some((key) => {
        if (key === compareKey)
          return target['_id'].toString() !== updatedObj[key];

        if (typeof target[key] === 'object')
          return target[key].toString() !== updatedObj[key];

        return target[key] !== updatedObj[key];
      });
      if (isChanged) dataToUpdate.push({ ...updatedObj });
    }
  }

  return { dataToInsert, dataToUpdate, dataToDelete };
}

export async function processBatch<T>(
  data: T[],
  handler: (item: T) => Promise<void>,
) {
  for (const item of data) {
    await handler(item);
  }
}
