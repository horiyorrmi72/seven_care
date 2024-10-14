import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { Doctor, DoctorSchema } from 'src/schemas/doctors.schema';
import { MongooseModule, Schema } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }])],
  controllers: [DoctorController],
  providers: [DoctorService]
})
export class DoctorModule {}
