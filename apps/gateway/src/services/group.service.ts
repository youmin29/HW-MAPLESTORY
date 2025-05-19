/**
File Name : group.service
Description : event 서버 라우팅 Service - group
Author : 이유민

History
Date        Author      Status      Description
2025.05.20  이유민      Created     
2025.05.20  이유민      Modified    이벤트 그룹 추가
*/
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GroupDto } from '@app/dto';
import {
  sendExternalGetRequest,
  sendExternalPostRequest,
  sendExternalPutRequest,
  sendExternalDeleteRequest,
} from '@app/utils/http';

@Injectable()
export class GroupService {
  private readonly eventGroupServer: string;
  constructor(private httpService: HttpService) {
    this.eventGroupServer = `${process.env.EVENT_SERVER}/group`;
  }

  async create(newData: GroupDto) {
    return await sendExternalPostRequest(
      this.httpService,
      `${this.eventGroupServer}`,
      newData,
    );
  }

  async findAll() {
    return await sendExternalGetRequest(
      this.httpService,
      `${this.eventGroupServer}`,
    );
  }

  async findOneById(id: string) {
    return await sendExternalGetRequest(
      this.httpService,
      `${this.eventGroupServer}/${id}`,
    );
  }

  async updateById(id: string, updateData: GroupDto) {
    return await sendExternalPutRequest(
      this.httpService,
      `${this.eventGroupServer}/${id}`,
      updateData,
    );
  }

  async deleteById(id: string, cascade: string) {
    let query = '';

    if (cascade) {
      query += `?cascade=${cascade}`;
    }

    return await sendExternalDeleteRequest(
      this.httpService,
      `${this.eventGroupServer}/${id}${query}`,
    );
  }
}
