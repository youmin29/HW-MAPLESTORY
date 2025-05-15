/**
File Name : event_reward.entity
Description : 유저 보상 Entity 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가 
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventRewardDocument = EventReward & Document;

@Schema({ timestamps: true, collection: 'event_reward' })
export class EventReward {
  @Prop({ required: true })
  event_id: string;

  @Prop({ required: true })
  item_id: string;

  @Prop({ required: true })
  amount: number;
}

export const EventRewardSchema = SchemaFactory.createForClass(EventReward);
