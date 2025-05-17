/**
File Name : attendance_log.entity
Description : 사용자 게임 출석 Entity 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.16  이유민      Created     
2025.05.16  이유민      Modified    사용자 출석 기능 추가
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.entity';

export type AttendanceDocument = Attendance & Document;
@Schema({ collection: 'attendance_log' })
export class Attendance {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  date: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
