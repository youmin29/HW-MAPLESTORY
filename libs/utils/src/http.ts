/**
File Name : http
Description : http 요청 유틸 함수
Author : 이유민

History
Date        Author      Status      Description
2025.05.17  이유민      Created     
2025.05.17  이유민      Modified    http 요청 유틸 함수 추가
*/
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

const logger = new Logger('HttpUtil');

export async function sendExternalGetRequest<T>(
  httpService: HttpService,
  url: string,
): Promise<T> {
  try {
    const response = await firstValueFrom(httpService.get<T>(url));
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.response.data.statusCode;
      const message = err.response.data.message;

      logger.warn(`GET ${url} 실패 - ${status}: ${message}`);
      throw new HttpException(message, status);
    }

    logger.error(`GET ${url} 예기치 않은 오류: ${err.message}`, err.stack);
    throw new HttpException('서버 내부 오류', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function sendExternalPostRequest<T>(
  httpService: HttpService,
  url: string,
  body: object,
): Promise<T> {
  try {
    const response = await firstValueFrom(httpService.post<T>(url, body));
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.response.data.statusCode;
      const message = err.response.data.message;

      logger.warn(`GET ${url} 실패 - ${status}: ${message}`);
      throw new HttpException(message, status);
    }

    logger.error(`GET ${url} 예기치 않은 오류: ${err.message}`, err.stack);
    throw new HttpException('서버 내부 오류', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function sendExternalPutRequest<T>(
  httpService: HttpService,
  url: string,
  body: object,
): Promise<T> {
  try {
    const response = await firstValueFrom(httpService.put<T>(url, body));
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.response.data.statusCode;
      const message = err.response.data.message;

      logger.warn(`GET ${url} 실패 - ${status}: ${message}`);
      throw new HttpException(message, status);
    }

    logger.error(`GET ${url} 예기치 않은 오류: ${err.message}`, err.stack);
    throw new HttpException('서버 내부 오류', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function sendExternalDeleteRequest<T>(
  httpService: HttpService,
  url: string,
): Promise<T> {
  try {
    const response = await firstValueFrom(httpService.delete<T>(url));
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.response.data.statusCode;
      const message = err.response.data.message;

      logger.warn(`GET ${url} 실패 - ${status}: ${message}`);
      throw new HttpException(message, status);
    }

    logger.error(`GET ${url} 예기치 않은 오류: ${err.message}`, err.stack);
    throw new HttpException('서버 내부 오류', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
