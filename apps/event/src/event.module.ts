/**
File Name : event.module
Description : 이벤트 Module
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
2025.05.16  이유민      Modified    보상 요청 기능 추가
2025.05.18  이유민      Modified    인벤토리 추가
2025.05.19  이유민      Modified    코드 리팩토링
*/
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventMongooseSchemas } from '@app/entity';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { EventRepository } from './repositories/event.repository';
import { EventRewardRepository } from './repositories/event_reward.repository';
import { ConditionRepository } from './repositories/event_condition.repository';
import { ItemRepository } from './repositories/item.repository';
import { AttendanceRepository } from './repositories/attendance_log.repository';
import { RequestRepository } from './repositories/event_reward_requests.repository';
import { InventoryRepository } from './repositories/inventory.repository';
import { GroupRepository } from './repositories/event_group.repository';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { RequestController } from './controllers/request.controller';
import { RequestService } from './services/request.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature(EventMongooseSchemas),
  ],
  controllers: [GroupController, EventController, RequestController],
  providers: [
    EventService,
    EventRepository,
    EventRewardRepository,
    ItemRepository,
    ConditionRepository,
    AttendanceRepository,
    RequestRepository,
    InventoryRepository,
    GroupRepository,
    GroupService,
    RequestService,
  ],
})
export class EventModule {}
