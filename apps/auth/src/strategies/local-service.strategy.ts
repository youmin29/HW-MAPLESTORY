/**
File Name : local-service.strategy
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
2025.05.18  이유민      Modified    에러 status code 및 메세지 수정
*/
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalServiceStrategy extends PassportStrategy(
  Strategy,
  'local-service',
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateServiceUser(email, password);

    if (!user)
      throw new UnauthorizedException(
        "'입력한 이메일 또는 비밀번호가 올바르지 않습니다.'",
      );

    return user;
  }
}
