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
*/
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './repository/event.repository';
import { EventRewardRepository } from './repository/event_reward.repository';
import { ConditionRepository } from './repository/event_condition.repository';
import { ItemRepository } from './repository/item.repository';
import { EventInfo, EventInfoSchema } from '@app/entity/event_info.entity';
import {
  EventRewardRequest,
  EventRewardRequestSchema,
} from '@app/entity/event_reward_requests.entity';
import { Item, ItemSchema } from '@app/entity/item.entity';
import { Condition, ConditionSchema } from '@app/entity/event_condition.entity';
import {
  EventReward,
  EventRewardSchema,
} from '@app/entity/event_reward.entity';
import {
  Attendance,
  AttendanceSchema,
} from '@app/entity/attendance_log.entity';
import { AttendanceRepository } from './repository/attendance_log.repository';
import { RequestRepository } from './repository/event_reward_requests.repository';
import { Inventory, InventorySchema } from '@app/entity/inventory.entity';
import { InventoryRepository } from './repository/inventory.repository';
import { User, UserSchema } from '@app/entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: EventInfo.name, schema: EventInfoSchema },
      { name: EventRewardRequest.name, schema: EventRewardRequestSchema },
      { name: EventReward.name, schema: EventRewardSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Condition.name, schema: ConditionSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    EventRepository,
    EventRewardRepository,
    ItemRepository,
    ConditionRepository,
    AttendanceRepository,
    RequestRepository,
    InventoryRepository,
  ],
})
export class EventModule {}
