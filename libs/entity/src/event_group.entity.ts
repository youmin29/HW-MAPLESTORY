/**
File Name : event_group.entity
Description : 이벤트 그룹 Entity 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.19  이유민      Created     
2025.05.19  이유민      Modified    이벤트 그룹 추가
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventGroupDocument = EventGroup & Document;

@Schema({ timestamps: true, collection: 'event_group' })
export class EventGroup {
  @Prop({ required: true })
  name: string;
}

export const EventGroupSchema = SchemaFactory.createForClass(EventGroup);
