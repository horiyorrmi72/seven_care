import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from 'src/DTO/user.dto';


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async getUsers(): Promise<User[]> {
        const users = await this.userModel.find().select({ 'medical_history': false });
        return users;

    }

    async updateUserDetails(id: string, updateProfileDto: UpdateUserDto): Promise<User | any> {
        const userData = await this.userModel.findByIdAndUpdate(
            id,
            { ...updateProfileDto, updatedAt: new Date() },
            { new: true }
        );
        return "userData updated successfully!";

        if (!userData) {
            throw new BadRequestException('No user data found!')
        }
        if (!updateProfileDto) { throw new BadRequestException('profile not updated!.') }
    }
    async deleteUser(id: string): Promise<void> {
        const user = await this.userModel.findByIdAndDelete(id);
        if (!user) { throw new BadRequestException('No user with the provided data found!'); }

    }


}
