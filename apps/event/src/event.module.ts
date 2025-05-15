/**
File Name : event.module
Description : 이벤트 Module
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
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
    ]),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    EventRepository,
    EventRewardRepository,
    ItemRepository,
    ConditionRepository,
  ],
})
export class EventModule {}
