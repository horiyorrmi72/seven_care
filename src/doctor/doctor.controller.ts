import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { Doctor } from 'src/schemas/doctors.schema';
import { DoctorDTO, updateDoctorsDataDto } from 'src/DTO/doctor.dto';
import { DoctorService } from './doctor.service';
import { Roles } from 'src/utils/guards/roles.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';


@UseGuards(RolesGuard)
@Controller('doctor')
export class DoctorController {
    constructor(private doctorService: DoctorService) { }

    @Roles('admin')
    @Get('doctors')
    getAllDoctors(): Promise<{ total: number; doctors: Doctor[] }> {
        return this.doctorService.getAllDoctors();
    }
    @Roles('admin')
    @Get('/:id')
    getDoctorById(@Param('id') id: string): Promise<Doctor> {
        return this.doctorService.getDoctorById(id);
    }

    @Roles('admin')
    @Post('addDoctor')
    addDoctor(@Body() createDoctor: DoctorDTO): Promise<Doctor> {
        if (!createDoctor) { throw new BadRequestException('All fields are required!') }
        return this.doctorService.createDoctor(createDoctor)


    }
    @Roles('admin')
    @Put('updateDoctor/:id')
    updateDoctorDetails(@Param('id') id: string, @Body() updateDoctor: updateDoctorsDataDto): Promise<Doctor> {
        if (!updateDoctor) throw new BadRequestException('you need to provide data to update for the doctor.')

        return this.doctorService.updateDoctorsDetails(id, updateDoctor);
    }
    @Roles('admin')
    @Patch('suspendDoctor/:id')
    disableDoctor(@Param('id') id: string, @Body() updateDoctorStatus: updateDoctorsDataDto): Promise<Doctor> {
        if (!id) { throw new NotFoundException('Doctor not specified.') }
        return this.doctorService.suspendDoctor(id, updateDoctorStatus);
    }
    @Roles('admin')
    @Delete('deleteDoctor/:id')
    deleteDoctor(@Param('id') id: string) {
        return this.doctorService.deleteDoctor(id);
    }

}
