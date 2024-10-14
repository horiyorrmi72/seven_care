import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { Doctor } from 'src/schemas/doctors.schema';
import { DoctorDTO, updateDoctorsDataDto } from 'src/DTO/doctor.dto';
import { DoctorService } from './doctor.service';

@Controller('doctor')
export class DoctorController {
    constructor(private doctorService: DoctorService) { }


    @Get('doctors')
    getAllDoctors(): Promise<Doctor[]>{
        return this.doctorService.getAllDoctors();
    }

    @Post('addDoctor')
    addDoctor(@Body() createDoctor: DoctorDTO): Promise<Doctor> {
        if (!createDoctor) { throw new BadRequestException('All fields are required!') }
        return this.doctorService.createDoctor(createDoctor)


    }

    @Put('updateDoctor/:id')
    updateDoctorDetails(@Param('id') id: string, @Body() updateDoctor: updateDoctorsDataDto): Promise<Doctor> {
        if (!updateDoctor) throw new BadRequestException('you need to provide data to update for the doctor.')

        return this.doctorService.updateDoctorsDetails(id, updateDoctor);
    }

    @Patch('suspendDoctor/:id')
    disableDoctor(@Param('id') id: string, @Body() updateDoctorStatus: updateDoctorsDataDto): Promise<Doctor> {
        if (!id) { throw new NotFoundException('Doctor not specified.') }
        return this.doctorService.suspendDoctor(id, updateDoctorStatus);
    }

    @Delete('deleteDoctor/:id')
    deleteDoctor(@Param('id') id: string) {
        return this.doctorService.deleteDoctor(id);
    }

}
