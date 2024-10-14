import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/schemas/users.schema';
import { Doctor } from 'src/schemas/doctors.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto, RegisterDto } from 'src/DTO/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectModel(Doctor.name) private doctorModel: Model<Doctor>, private jwtStrategy: JwtService) { }

    async registerUser(registerDto: RegisterDto) {
        try {
            const existingUser = await this.userModel.findOne({ email: registerDto.email });
            if (existingUser) {
                throw new ConflictException(`User already exists`);
            }
            const { password } = registerDto;
            const hashPassword = await bcrypt.hash(password, 12);
            const user = new this.userModel({ ...registerDto, password: hashPassword });
            await user.save();
            // console.log(user);
            return user;

        } catch (error) {
            throw new BadRequestException(error.message || 'internal server error');
        }
    }


    async login(loginDto: LoginDto) {
        try {
            const { email, password } = loginDto;
            let user = await this.userModel.findOne({ email: email });
            if (user) {
                return await this.verifyPasswordAndGenerateToken(user, password, 'user');
            }
            let doctor = await this.doctorModel.findOne({ email });
            if (doctor) {
                return await this.verifyPasswordAndGenerateToken(doctor, password, 'doctor');
            }
            if (!user && !doctor) { throw new BadRequestException('Signup and login again.'); }

        } catch (error) {
            console.log(error.message);
            throw new BadRequestException(error.message || 'Internal Server Error');
        }
    }

    private async verifyPasswordAndGenerateToken(entity: any, password: string, role: string) {
        const isPassMatch = await bcrypt.compare(password, entity.password);
        if (!isPassMatch) {
            throw new UnauthorizedException('Invalid data provided, kindly verify the provided credentials.');
        }

        const payload = { id: entity._id, role };
        return {
            userName: entity.username || entity.name,
            token: await this.jwtStrategy.signAsync(payload)
        };
    }
}
