import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Doctor } from 'src/schemas/doctors.schema';
import { DoctorDTO, updateDoctorsDataDto } from 'src/DTO/doctor.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';


@Injectable()
export class DoctorService {
    constructor(@InjectModel(Doctor.name) private doctorModel: Model<Doctor>) { }


    async getAllDoctors(): Promise<{
        total: number; doctors: Doctor[]
    }> {
        const totalDoctors = await this.doctorModel.countDocuments();
        const result = await this.doctorModel.find().select({ 'role': false, 'password': false }).exec();
        if (result.length === 0) { throw new NotFoundException('No Doctor found') }
        return {
            total: totalDoctors,
            doctors: result
        }


    }

    async getDoctorById(id: string): Promise<Doctor> {
        const doctor = await this.doctorModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: 'appointments',
                    localField: '_id',
                    foreignField: 'doctorId',
                    as: 'appointments',

                }
            },
            {
                $lookup: {
                    from: 'appointments',
                    localField: '_id',
                    foreignField: 'patientId',
                    as: 'patients',
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    designation: 1,
                    department: 1,
                    appointments: {
                        $map: {
                            input: '$appointments',
                            as: 'appointment',
                            in: {
                                _id: '$$appointment._id',
                                status: '$$appointment.status',
                                appointmentDate: '$$appointment.appointmentDate',
                                patientDetails: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$patients',
                                                as: 'patient',
                                                cond: {
                                                    $eq: ['$$patient._id',
                                                        '$$appointment.patientId'
                                                    ]
                                                }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    }


                }
            }

        ])

        if (!doctor) { throw new BadRequestException('No doctor with the provided data found.') }
        return doctor[0];
    }

    async createDoctor(doctorDto: DoctorDTO): Promise<Doctor> {
        const existingDoctor = await this.doctorModel.findOne({ email: doctorDto.email }).exec();
        if (existingDoctor) {
            throw new ConflictException('Doctor with similar details already exists');
        }
        const { password } = doctorDto;
        if (!password) {
            throw new BadRequestException('Password is required');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const doctor = new this.doctorModel({ ...doctorDto, password: hashedPassword });
        return doctor.save();
    }

    async updateDoctorsDetails(id: string, updateDoctorData: updateDoctorsDataDto): Promise<Doctor> {
        if (updateDoctorData.password) {
            updateDoctorData.password = await bcrypt.hash(updateDoctorData.password, 12);
        }
        const updatedData = await this.doctorModel.findByIdAndUpdate(id, { ...updateDoctorData }, { new: true });
        if (!updatedData) {
            throw new NotFoundException(`Doctor with ID ${id} not found`);
        }
        return updatedData;
    }

    async suspendDoctor(id: string, updateDoctorData: updateDoctorsDataDto): Promise<Doctor> {
        const updatedData = await this.doctorModel.findByIdAndUpdate(id, { active: false, ...updateDoctorData }, { new: true });
        if (!updatedData) {
            throw new NotFoundException(`Doctor with ID ${id} not found`);
        }
        return updatedData;
    }

    async deleteDoctor(id: string): Promise<void> {
        const result = await this.doctorModel.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundException('could not find the doctor with the provided details')
        }

    }

}
