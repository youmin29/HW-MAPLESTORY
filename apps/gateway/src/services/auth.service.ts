/**
File Name : auth.service
Description : auth 서버 라우팅 Service
Author : 이유민

History
Date        Author      Status      Description
2025.05.17  이유민      Created     
2025.05.17  이유민      Modified    Gateway 라우팅 추가
2025.05.19  이유민      Modified    코드 리팩토링
*/
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { sendExternalPostRequest } from '@app/utils/http';
import { UpdateUserRoleDto } from '@app/dto';

@Injectable()
export class AuthService {
  private readonly authServer: string;
  constructor(private httpService: HttpService) {
    this.authServer = process.env.AUTH_SERVER;
  }

  async createAuth(authData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: string;
  }) {
    return await sendExternalPostRequest(
      this.httpService,
      `${this.authServer}/signup`,
      authData,
    );
  }

  async validateServiceUser(email: string, password: string) {
    return await sendExternalPostRequest(
      this.httpService,
      `${this.authServer}/signin`,
      {
        email,
        password,
      },
    );
  }

  async changeUserRole(updateDto: UpdateUserRoleDto) {
    return await sendExternalPostRequest(
      this.httpService,
      `${this.authServer}/role`,
      updateDto,
    );
  }
}
