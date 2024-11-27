import { BadRequestException, Body, ConsoleLogger, Controller, Get, Param, Patch, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointments } from 'src/schemas/appointments.schema';
import { createAppointmentDTO, updateAppointmentDTO } from 'src/DTO/appointment.dto';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('appointment')
export class AppointmentController {
    constructor(private appointmentService: AppointmentService) { }
    @Get('appointments')
    getAppointments(): Promise<{ total: number; appointment: Appointments[] }> {
        return this.appointmentService.getAllAppointments();
    }
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    @Post('addAppointment')
    addAppointment(@Body() createAppointment: createAppointmentDTO, @Req() req: any): Promise<Appointments> {
        console.log('Request User:', req.user); // Check if `req.user` is defined
        if (!createAppointment) {
            throw new BadRequestException('All fields are required!');
        }
        const userId = req.user?.userId;
        if (!userId) {
            throw new BadRequestException('User ID is missing in the token payload.');
        }
        return this.appointmentService.createAppointment({ patientId: userId, ...createAppointment });
    }


    @Put('updateAppointment/:id')
    updateAppointment(@Param('id') id: string, @Body() updateAppointment: updateAppointmentDTO): Promise<Appointments | string> {
        if (!updateAppointment) {
            throw new BadRequestException('All data to upload the appointment are needed!.');
        }
        return this.appointmentService.updateAppointment(id, updateAppointment);
    }


    @Patch('cancelAppointment/:id')
    cancelAppointment(@Param('id') id: string, @Body() updateAppointment: updateAppointmentDTO, @Body('reason') reason: string): Promise<{ status: { active: boolean, reason?: string }; appointment: Appointments }> {
        return this.appointmentService.cancelAppointment(id, updateAppointment, reason);
    }



}
