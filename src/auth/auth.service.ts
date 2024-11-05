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
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
        private jwtService: JwtService
    ) { }

    async registerUser(registerDto: RegisterDto) {
        try {
            const existingUser = await this.userModel.findOne({ email: registerDto.email });
            if (existingUser) {
                throw new ConflictException(`User already exists`);
            }
            const { password } = registerDto;
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new this.userModel({ ...registerDto, password: hashedPassword });
            await user.save();

            return { message: 'Account Created Successfully!' };
        } catch (error) {
            throw new BadRequestException(error.message || 'Internal server error');
        }
    }

    async login(loginDto: LoginDto) {
        try {
            const { email, password } = loginDto;
            let user = await this.userModel.findOne({ email }).select({ password: true, role:true });
            if (user) {
                return await this.verifyPasswordAndGenerateToken(password, user);
            }

            let doctor = await this.doctorModel.findOne({ email }).select({password:true});
            if (doctor) {
                return await this.verifyPasswordAndGenerateToken(password, doctor);
            }

            throw new BadRequestException('Please sign up and log in again.');
        } catch (error) {
            throw new BadRequestException(error.message || 'Internal Server Error');
        }
    }

    private async verifyPasswordAndGenerateToken(password: string, entity: any) {
        const isPassMatch = await bcrypt.compare(password, entity.password);
        if (!isPassMatch) {
            throw new UnauthorizedException('Invalid credentials, please verify and try again.');
        }

        const payload = { id: entity._id, role: entity.role };
        return {
            userName: entity.username || entity.name,
            token: await this.jwtService.signAsync(payload),
        };
    }
}
