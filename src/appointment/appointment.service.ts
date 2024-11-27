import { BadRequestException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointments, AppointmentSchema } from 'src/schemas/appointments.schema';
import { createAppointmentDTO, updateAppointmentDTO } from 'src/DTO/appointment.dto';


@Injectable()
export class AppointmentService {
    constructor(@InjectModel(Appointments.name) private AppointmentModel: Model<Appointments>) { }

    async getAllAppointments(): Promise<{ total: number; appointment: Appointments[] }> {
        const appointments = await this.AppointmentModel.find().exec();
        const totalAppointments = appointments.length;
        if (totalAppointments === 0) {
            throw new NotFoundException('No Appointments for now!, Check back later');
        }
        return {
            total: totalAppointments,
            appointment: appointments
        };

    }

    async createAppointment(createAppointment: createAppointmentDTO): Promise<Appointments> {
        //checking date availability of appointment
        const { patientId, appointmentDate } = createAppointment;
        const isNotAvailable = await this.AppointmentModel.findOne({ patientId, appointmentDate });
        if (isNotAvailable) {
            throw new BadRequestException('you already have an appointment for the specified appointment date! please try another appointment date and time.');
        }

        const appointment = await new this.AppointmentModel({
            status: { active: true },
            ...createAppointment
        }).save();
        return appointment;

    }

    async updateAppointment(id: string, updateAppointment: updateAppointmentDTO): Promise<Appointments | string> {
        const appointment = await this.AppointmentModel.findByIdAndUpdate(id, { ...updateAppointment }, { new: true });

        if (!appointment) {
            throw new NotFoundException('Appointment with the provided details does not exist');
        }
        return `Appointment with the provided details updated successfully, '\n' ${appointment}`;

    }


    async cancelAppointment(id: string, updateAppointment: updateAppointmentDTO, reason: string): Promise<{ status: { active: boolean; reason?: string }; appointment: Appointments }> {
        const canceledAppointment = await this.AppointmentModel.findByIdAndUpdate(id, { status: { active: false, reason } }, { new: true }).exec();

        if (!canceledAppointment) {
            throw new NotFoundException(`Appointment with ID ${id} not found`);
        }
        return {
            status: { active: false, reason },
            appointment: canceledAppointment,
        };

    }

    async removeAppointment(id: string): Promise<void | string> {
        const appointmentTodelete = await this.AppointmentModel.findByIdAndDelete(id);
        if (!appointmentTodelete) {
            throw new NotFoundException(`No Appoint with the id ${id} was not found`);
        }
    }

    async getUpcomingAppointments(userOrDocotorId: string): Promise<Appointments[] | string> {
        // since it's upcomming appointments, 
        // we need to get the user that we want to fetch the appointment for.
        // check for appointment that is yet to take place using the user id or the doctor id as the unique identifier
        //check if the user data provided is valid or not
        // and use it in each service needng it such as user service and doctor service
        if (!userOrDocotorId) {
            throw new NotAcceptableException('Please provide a user or doctor identifier', {
                cause: new Error(),
                description: 'Please provide a user or doctor identifier'
            })
        }
        // console.log('from appointment service:',userOrDocotorId)
        return await this.AppointmentModel.find({ userOrDocotorId, appointmentDate: { $gte: new Date() } }).sort('asc')

    }

}
