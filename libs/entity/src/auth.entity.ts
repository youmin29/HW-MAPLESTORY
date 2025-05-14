/**
File Name : auth.entity
Description : Auth Entity 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema({ timestamps: true, collection: 'auth' })
export class Auth {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refresh_token: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
