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
2025.05.20  이유민      Modified    이벤트 보상 요청 파일 분리
2025.05.20  이유민      Modified    admin 외 기간 내 이벤트만 조회 가능 추가
*/
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateEventDto, UpdateEventDto } from '@app/dto';
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

  async findEventAll(role: string) {
    return await sendExternalGetRequest(
      this.httpService,
      `${this.eventServer}?role=${role}`,
    );
  }

  async findEventById(id: string, role: string) {
    return await sendExternalGetRequest(
      this.httpService,
      `${this.eventServer}/${id}?role=${role}`,
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

  async createAttendance(user_id: string) {
    return await sendExternalPostRequest(
      this.httpService,
      `${this.eventServer}/attend`,
      { user_id },
    );
  }
}
