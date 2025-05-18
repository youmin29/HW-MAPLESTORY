/**
File Name : event.service
Description : event 서버 라우팅 Service
Author : 이유민

History
Date        Author      Status      Description
2025.05.17  이유민      Created     
2025.05.17  이유민      Modified    Gateway 라우팅 추가
2025.05.17  이유민      Modified    출석체크 기능 추가
2025.05.18  이유민      Modified    에러 status code 및 메세지 수정
*/
import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateEventDto, GetRequestQueryDto, UpdateEventDto } from '@app/dto';
import { UserRole } from '@app/entity';
import {
  sendExternalGetRequest,
  sendExternalPostRequest,
  sendExternalPutRequest,
  sendExternalDeleteRequest,
} from '@app/utils/http';

@Injectable()
export class EventService {
  private readonly eventServer: string;
  constructor(private httpService: HttpService) {
    this.eventServer = process.env.EVENT_SERVER;
  }

  async create(eventAndRewardData: CreateEventDto) {
    return await sendExternalPostRequest(
      this.httpService,
      this.eventServer,
      eventAndRewardData,
    );
  }

  async findEventAll() {
    return await sendExternalGetRequest(this.httpService, this.eventServer);
  }

  async findEventById(id: string) {
    return await sendExternalGetRequest(
      this.httpService,
      `${this.eventServer}/${id}`,
    );
  }

  async updateEventById(id: string, updateData: UpdateEventDto) {
    return await sendExternalPutRequest(
      this.httpService,
      `${this.eventServer}/${id}`,
      updateData,
    );
  }

  async deleteEventById(id: string) {
    return await sendExternalDeleteRequest(
      this.httpService,
      `${this.eventServer}/${id}`,
    );
  }

  async createRequestReward(id: string, userId: string) {
    return await sendExternalPostRequest(
      this.httpService,
      `${this.eventServer}/reward/${id}`,
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
      `${this.eventServer}/reward/all?${queryStr.substring(0, queryStr.length - 1)}`,
    );
  }

  async findUserRewardRequest(
    user: { user_id: string; role: string; name: string },
    target_id: string,
    query: GetRequestQueryDto,
  ) {
    if (user.role === UserRole.User) {
      if (user.user_id !== target_id)
        throw new ForbiddenException('해당 작업을 수행할 권한이 없습니다.');
    }

    let queryStr = '';

    for (const key of Object.keys(query)) {
      queryStr += `${key}=${query[key]}&`;
    }

    return await sendExternalGetRequest(
      this.httpService,
      `${this.eventServer}/reward/${target_id}?${queryStr.substring(0, queryStr.length - 1)}`,
    );
  }

  async createAttendance(user_id: string) {
    return await sendExternalPostRequest(
      this.httpService,
      `${this.eventServer}/attend`,
      { user_id },
    );
  }
}
