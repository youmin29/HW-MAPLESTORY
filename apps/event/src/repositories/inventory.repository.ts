/**
File Name : inventory.repository
Description : Event Server - Repository(Inventory)
Author : 이유민

History
Date        Author      Status      Description
2025.05.18  이유민      Created     
2025.05.18  이유민      Modified    인벤토리 추가
2025.05.19  이유민      Modified    폴더명 수정
2025.05.20  이유민      Modified    인벤토리에 보상 지급 추가
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inventory } from '@app/entity/inventory.entity';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
  ) {}

  async createInven(inventoryData: Partial<Inventory>) {
    return await new this.inventoryModel(inventoryData).save();
  }

  async findOneByFilters(filters: Partial<Inventory>) {
    return await this.inventoryModel.findOne(filters).lean().exec();
  }

  async updateAmountByItemId(
    user_id: Types.ObjectId,
    item_id: Types.ObjectId,
    amountDelta: number,
  ): Promise<Inventory | null> {
    return this.inventoryModel
      .findOneAndUpdate(
        { user_id, item_id },
        { $inc: { amount: amountDelta } },
        { upsert: true, new: true },
      )
      .exec();
  }

  async deleteById(id: Types.ObjectId): Promise<Inventory | null> {
    return this.inventoryModel.findOneAndDelete({ _id: id }).exec();
  }
}
