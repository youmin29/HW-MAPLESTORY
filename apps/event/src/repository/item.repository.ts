/**
File Name : item.repository
Description : Event Server - Repository(Item)
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
2025.05.16  이유민      Modified    코드 리팩토링
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item } from '@app/entity/item.entity';

@Injectable()
export class ItemRepository {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  async create(itemData: Partial<Item>): Promise<Item> {
    return new this.itemModel(itemData).save();
  }

  async findItemAll(): Promise<Item[]> {
    return this.itemModel.find().lean();
  }

  async findOneById(id: Types.ObjectId): Promise<Item | null> {
    return this.itemModel.findOne({ _id: id }).lean().exec();
  }
}
