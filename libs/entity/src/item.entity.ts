/**
File Name : item.entity
Description : 게임 아이템 Entity 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가 
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true, collection: 'item' })
export class Item {
  @Prop({ required: true })
  name: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
