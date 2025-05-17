/**
File Name : event_reward.entity
Description : 유저 보상 Entity 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가 
2025.05.16  이유민      Modified    Mongoose ref 설정 추가
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventInfo } from './event_info.entity';
import { Item } from './item.entity';
import { Document, Types } from 'mongoose';

export type EventRewardDocument = EventReward & Document;

@Schema({ timestamps: true, collection: 'event_reward' })
export class EventReward {
  @Prop({ required: true, type: Types.ObjectId, ref: EventInfo.name })
  event_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: Item.name })
  item_id: Types.ObjectId;

  @Prop({ required: true })
  amount: number;
}

export const EventRewardSchema = SchemaFactory.createForClass(EventReward);
