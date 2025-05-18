/**
File Name : event_reward_requests.entity
Description : 유저 보상 요청 Entity 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가 
2025.05.16  이유민      Modified    Mongoose ref 설정 추가
2025.05.16  이유민      Modified    속성 추가
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventInfo } from './event_info.entity';
import { Document, Types } from 'mongoose';
import { User } from './user.entity';

export type EventRewardRequestDocument = EventRewardRequest & Document;

@Schema({ timestamps: true, collection: 'event_reward_request' })
export class EventRewardRequest {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: EventInfo.name })
  event_id: Types.ObjectId;

  @Prop({ required: true })
  status: boolean;

  @Prop({ required: false })
  reason: string;
}

export const EventRewardRequestSchema =
  SchemaFactory.createForClass(EventRewardRequest);
