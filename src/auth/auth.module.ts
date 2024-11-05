import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/schemas/users.schema';
import { Doctor,DoctorSchema } from 'src/schemas/doctors.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { jwtStrategy } from 'src/utils/passport/passport.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ConfigModule.forRoot(),MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Doctor.name, schema: DoctorSchema }]), PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions:{expiresIn:'15m'}
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService,jwtStrategy]
})
export class AuthModule { }
