/**
File Name : event_reward_requests.entity
Description : 유저 보상 요청 Entity 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가 
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventRewardRequestDocument = EventRewardRequest & Document;

@Schema({ timestamps: true, collection: 'event_reward_request' })
export class EventRewardRequest {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  event_id: string;

  @Prop({ required: true })
  status: boolean;
}

export const EventRewardRequestSchema =
  SchemaFactory.createForClass(EventRewardRequest);
