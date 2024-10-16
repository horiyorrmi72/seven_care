import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/schemas/users.schema';
import { Doctor,DoctorSchema } from 'src/schemas/doctors.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{name:Doctor.name, schema:DoctorSchema}]), 
  ],
  controllers: [AuthController],
  providers: [AuthService,]
})
export class AuthModule { }
