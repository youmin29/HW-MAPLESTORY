/**
File Name : event.service.utils
Description : event 유틸리티 함수
Author : 이유민

History
Date        Author      Status      Description
2025.05.16  이유민      Created     
2025.05.16  이유민      Modified    이벤트 유틸리티 함수 추가
2025.05.16  이유민      Modified    보상 요청 기능 추가
*/
import { BadRequestException } from '@nestjs/common';
import { ItemRepository } from './repository/item.repository';
import { AttendanceRepository } from './repository/attendance_log.repository';
import { ConditionType } from '@app/entity/event_condition.entity';
import { Types } from 'mongoose';
import { isSameDay, subDays } from 'date-fns';

interface ValidateConditionTargetOptions {
  type: string;
  target_id: Types.ObjectId | null;
  itemRepository: ItemRepository;
}

export async function getRepositoryByConditionType({
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
      if (!validItem)
        throw new BadRequestException('존재하지 않는 리소스입니다.');
      break;
    case ConditionType.BOSS:
      break;
    case ConditionType.INVITE:
      break;
    default:
      throw new BadRequestException(`알 수 없는 type: ${type}`);
  }

  return validItem;
}

// 출석 이벤트 체크
export async function checkAttendEvent(
  quantity: number,
  user_id: Types.ObjectId,
  attendRepository: AttendanceRepository,
) {
  const today = new Date();
  const startDate = subDays(today, quantity - 1);

  const attend = await attendRepository.checkAttendEvent(user_id, startDate);

  for (let i = 0; i < quantity; i++) {
    const targetDate = subDays(today, quantity - 1 - i);

    const found = attend.some((a) => isSameDay(new Date(a.date), targetDate));

    if (!found) return false;
  }
  return true;
}
