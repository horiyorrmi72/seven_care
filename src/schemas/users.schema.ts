import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Appointments } from "./appointments.schema";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { timestamp } from "rxjs";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true, unique: true })
    email: string;

    @Prop({ required: true, trim: true })
    username: string;

    @Prop({ required: true, minlength: 6, select: false })
    password: string;

    @Prop({ trim: true })
    address: string;

    @Prop({ type: String })
    profilePicture: string;

    @Prop({ type: Date })
    DOB: Date;

    @Prop({ trim: true })
    phoneNumber: string;

    @Prop({ trim: true, enum: ['user', 'admin'], default: 'user' })
    role: string;


    @Prop(raw({
        allergies: { type: [String] },
        current_medications: { type: [String] },
        life_style: { type: String },
        emergency_contact: { type: String },
    }))
    medical_history: {
        allergies: string[],
        current_medications: string[],
        life_style: string,
        emergency_contact: string

    }

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointments' }])
    appointments: Types.ObjectId[];

    // @Prop([raw({
    //     appointmentDate: { type: Date, required: true },
    //     appointmentDetails: { type: mongoose.Types.ObjectId, ref: 'Appointments' },
    //     doctor: { type: mongoose.Types.ObjectId, ref: 'Doctor' }
    // })])
    // // appointments:mongoose.Schema.Types.ObjectId[]
    // appointments: {
    //     appointmentDate: Date;
    //     appointmentDetails: mongoose.Types.ObjectId;
    //     doctorId: mongoose.Types.ObjectId;
    // }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
