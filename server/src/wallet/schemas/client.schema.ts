
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema()
export class Client {
    @Prop({ required: true, unique: true })
    document: string;

    @Prop({ required: true })
    names: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ default: 0 })
    balance: number;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
