import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { MongooseModule } from '@nestjs/mongoose';
import {Appointments, AppointmentSchema } from 'src/schemas/appointments.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Appointments.name, schema:AppointmentSchema}])],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
