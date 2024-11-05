import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from 'src/schemas/users.schema';
import { Doctor } from 'src/schemas/doctors.schema';
import { Model } from "mongoose";

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,

        });
    }
    async validate(payload: any) {
        // console.log('JWT Payload:', payload);
        const user = await this.userModel.findById(payload.id) || await this.doctorModel.findById(payload.id);
        if (!user) {
            throw new UnauthorizedException('Unauthorized');
        }
        // console.log({ userId: payload.id, role: payload.role })
        return { userId: payload.id, role: payload.role };
    }

}