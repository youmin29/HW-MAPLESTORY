/**
File Name : attendance_log.repository
Description : 사용자 게임 출석 Repository 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.16  이유민      Created     
2025.05.16  이유민      Modified    사용자 출석 기능 추가
2025.05.18  이유민      Modified    출석체크 기능 추가
2025.05.19  이유민      Modified    폴더명 수정
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance } from '@app/entity/attendance_log.entity';

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
  ) {}

  async createAttend(attendData: Partial<Attendance>) {
    return (await this.attendanceModel.create(attendData)).save();
  }

  async checkAttendEvent(
    user_id: Types.ObjectId,
    startDate: Date,
  ): Promise<Attendance[] | null> {
    return this.attendanceModel
      .find({ user_id, date: { $gte: startDate } })
      .sort({ date: 1 })
      .lean()
      .exec();
  }

  async findByToday(
    startDate: Date,
    endDate: Date,
  ): Promise<Attendance | null> {
    return this.attendanceModel
      .findOne({ date: { $gte: startDate, $lte: endDate } })
      .lean()
      .exec();
  }
}
