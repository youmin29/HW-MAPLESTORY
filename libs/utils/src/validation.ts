/**
File Name : validation
Description : 공통 유효성 검사 함수
Author : 이유민

History
Date        Author      Status      Description
2025.05.16  이유민      Created     
2025.05.16  이유민      Modified    공통 유효성 검사 함수 추가
2025.05.17  이유민      Modified    오타 수정
2025.05.18  이유민      Modified    에러 status code 및 메세지 수정
*/
import { isValidObjectId } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export function validateObjectIdOrThrow(objectId: string) {
  if (!isValidObjectId(objectId)) {
    throw new BadRequestException('잘못된 형식의 id가 있습니다.');
  }
}

export function validateObjectPropertyIdsOrThrow<T>(arr: T[], key: keyof T) {
  const hasInvalidId = arr.some(
    (e) => e[key] !== null && !isValidObjectId(e[key] as unknown as string),
  );

  if (hasInvalidId) {
    throw new BadRequestException('잘못된 형식의 id가 있습니다.');
  }
}
