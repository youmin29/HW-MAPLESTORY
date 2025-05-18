/**
File Name : inventory.entity
Description : 인벤토리 Entity 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.18  이유민      Created     
2025.05.18  이유민      Modified    인벤토리 추가
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Item } from './item.entity';
import { User } from './user.entity';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true, collection: 'inventory' })
export class Inventory {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: Item.name })
  item_id: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  amount: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
