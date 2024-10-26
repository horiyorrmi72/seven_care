import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User, UserSchema } from 'src/schemas/users.schema';
import { Appointments, AppointmentSchema } from 'src/schemas/appointments.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Appointments.name, schema: AppointmentSchema }])],
  controllers: [UserController],
  providers: [UserService,]
})
export class UserModule { }
