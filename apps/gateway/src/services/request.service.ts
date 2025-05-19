/**
File Name : request.service
Description : event 서버 라우팅 Service - group
Author : 이유민

History
Date        Author      Status      Description
2025.05.20  이유민      Created     
2025.05.20  이유민      Modified    이벤트 그룹 추가
*/
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GetRequestQueryDto } from '@app/dto';
import {
  sendExternalGetRequest,
  sendExternalPostRequest,
} from '@app/utils/http';

@Injectable()
export class RequestService {
  private readonly eventRequestServer: string;
  constructor(private httpService: HttpService) {
    this.eventRequestServer = `${process.env.EVENT_SERVER}/request`;
  }

  async requestEventReward(id: string, userId: string) {
    return await sendExternalPostRequest(
      this.httpService,
      `${this.eventRequestServer}/${id}`,
      { user_id: userId },
    );
  }

  async findRewardRequestAll(query: GetRequestQueryDto) {
    let queryStr = '';

    for (const key of Object.keys(query)) {
      queryStr += `${key}=${query[key]}&`;
    }

    return await sendExternalGetRequest(
      this.httpService,
      `${this.eventRequestServer}/all?${queryStr.substring(0, queryStr.length - 1)}`,
    );
  }

  async findUserRewardRequest(target_id: string, query: GetRequestQueryDto) {
    let queryStr = '';

    for (const key of Object.keys(query)) {
      queryStr += `${key}=${query[key]}&`;
    }

    return await sendExternalGetRequest(
      this.httpService,
      `${this.eventRequestServer}/${target_id}?${queryStr.substring(0, queryStr.length - 1)}`,
    );
  }
}
