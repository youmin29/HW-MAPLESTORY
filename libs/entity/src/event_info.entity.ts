/**
File Name : event_info.entity
Description : 이벤트 정보 Entity 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventInfoDocument = EventInfo & Document;

@Schema({ timestamps: true, collection: 'event_info' })
export class EventInfo {
  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({ required: true, default: 1 })
  status: boolean;
}

export const EventInfoSchema = SchemaFactory.createForClass(EventInfo);
