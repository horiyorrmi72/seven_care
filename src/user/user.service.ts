import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/users.schema';
import { Appointments } from 'src/schemas/appointments.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UpdateUserDto } from 'src/DTO/user.dto';


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectModel(Appointments.name) private appointmentModel: Model<Appointments>) { }

    async getUsers(): Promise<User[]> {
        const users = await this.userModel.find().select({ 'medical_history': false, 'appointments': false });
        return users;

    }

    async updateUserDetails(id: string, updateProfileDto: UpdateUserDto): Promise<User | any> {
        const userData = await this.userModel.findByIdAndUpdate(
            id,
            { ...updateProfileDto, updatedAt: new Date() },
            { new: true }
        );

        if (!userData) {
            throw new BadRequestException('No user data found!')
        }
        if (!updateProfileDto) { throw new BadRequestException('profile not updated!.') }
        return "userData updated successfully!";
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.userModel.findByIdAndDelete(id);
        if (!user) { throw new BadRequestException('No user with the provided data found!'); }

    }

    async getUserProfile(id: string): Promise<User> {
        const user = await this.userModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: 'appointments',
                    localField: "_id",
                    foreignField: "patientId",
                    as: 'appointments',
                }
            },
            {
                $lookup: {
                    from: 'doctors',
                    localField: 'appointments.doctorId',
                    foreignField: '_id',
                    as: 'doctorDetails',
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    username: 1,
                    address: 1,
                    DOB: 1,
                    role: 1,
                    medical_history: 1,
                    appointments: {
                        $map: {
                            input: '$appointments',
                            as: 'appointment',
                            in: {
                                _id: '$$appointment._id',
                                status: '$$appointment.status',
                                appointmentDate: '$$appointment.appointmentDate',
                                doctorDetails: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$doctorDetails',
                                                as: 'doctor',
                                                cond: { $eq: ['$$doctor._id', '$$appointment.doctorId'] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    username: 1,
                    address: 1,
                    DOB: 1,
                    role: 1,
                    medical_history: 1,
                    appointments: {
                        $map: {
                            input: '$appointments',
                            as: 'appointment',
                            in: {
                                _id: '$$appointment._id',
                                status: '$$appointment.status',
                                appointmentDate: '$$appointment.appointmentDate',
                                doctorDetails: {
                                    // _id: '$$appointment.doctorDetails._id',
                                    name: '$$appointment.doctorDetails.name',
                                    email: '$$appointment.doctorDetails.email',
                                    department: '$$appointment.doctorDetails.department',
                                    designation: '$$appointment.doctorDetails.designation',
                                }
                            }
                        }
                    }
                }
            }
        ]);

        if (!user || user.length === 0) {
            throw new BadRequestException('No user with the provided details found!.')
        }

        return user[0];
    }


}
