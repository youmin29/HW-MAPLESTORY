/**
File Name : auth.guard
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
2025.05.17  이유민      Modified    파일 경로 이동
*/
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
