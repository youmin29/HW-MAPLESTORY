/**
File Name : group.service
Description : Event Server - Service(group)
Author : 이유민

History
Date        Author      Status      Description
2025.05.19  이유민      Created     
2025.05.19  이유민      Modified    이벤트 그룹 추가
*/
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { GroupRepository } from '@event/repositories/event_group.repository';
import { EventRepository } from '@event/repositories/event.repository';
import { GroupDto } from '@app/dto';
import { validateObjectIdOrThrow } from '@app/utils/validation';

@Injectable()
export class GroupService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly groupRepository: GroupRepository,
    private readonly eventRepository: EventRepository,
    private readonly eventService: EventService,
  ) {}

  async create(newData: GroupDto) {
    return await this.groupRepository.create(newData);
  }

  async findAll() {
    return await this.groupRepository.findByFilters();
  }

  async findOneById(id: string) {
    validateObjectIdOrThrow(id);

    const groupId = new Types.ObjectId(id);
    const groupData = await this.groupRepository.findOneById(groupId);

    if (!groupData) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    const eventList = await this.eventRepository.findEventAll({
      group_id: groupId,
    });

    return { groupData, eventList };
  }

  async updateById(id: string, updateData: GroupDto) {
    validateObjectIdOrThrow(id);

    const groupId = new Types.ObjectId(id);
    const updated = await this.groupRepository.updateById(groupId, updateData);

    if (!updated) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    return { message: '수정되었습니다.' };
  }

  async deleteById(id: string, cascade: string) {
    validateObjectIdOrThrow(id);
    const groupId = new Types.ObjectId(id);

    const isData = await this.groupRepository.findOneById(groupId);
    if (!isData) throw new BadRequestException('리소스를 찾을 수 없습니다.');

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        await this.groupRepository.deleteById(groupId, session);

        if (cascade == 'true') {
          const eventList = await this.eventRepository.findEventAll({
            group_id: groupId,
          });

          for (const event of eventList) {
            await this.eventService.deleteEventById(event['_id'].toString());
          }
        }
      });
      await session.commitTransaction();
      return { message: '삭제되었습니다.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
