import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Doctor } from 'src/schemas/doctors.schema';
import { DoctorDTO, updateDoctorsDataDto } from 'src/DTO/doctor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';


@Injectable()
export class DoctorService {
    constructor(@InjectModel(Doctor.name) private doctorModel: Model<Doctor>) { }


    async getAllDoctors(): Promise<Doctor[]>{
        const result = await this.doctorModel.find().exec();
        if (result.length === 0) { throw new NotFoundException('No Doctor found') }
        
        return result;

    }

    async createDoctor(doctorDto: DoctorDTO): Promise<Doctor> {
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
