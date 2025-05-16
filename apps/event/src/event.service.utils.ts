/**
File Name : event.service.utils
Description : event 유틸리티 함수
Author : 이유민

History
Date        Author      Status      Description
2025.05.16  이유민      Created     
2025.05.16  이유민      Modified    이벤트 유틸리티 함수 추가
*/
import { BadRequestException } from '@nestjs/common';
import { ItemRepository } from './repository/item.repository';
import { ConditionType } from '@app/entity/event_condition.entity';

interface ValidateConditionTargetOptions {
  type: string;
  target_id: string | null;
  itemRepository: ItemRepository;
}

export async function getRepositoryByConditionType({
  type,
  target_id,
  itemRepository,
}: ValidateConditionTargetOptions) {
  switch (type) {
    case ConditionType.QUEST:
      break;
    case ConditionType.KILL:
      break;
    case ConditionType.ATTEND:
      break;
    case ConditionType.ITEM:
      const validItem = await itemRepository.findOneById(target_id);
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
}
