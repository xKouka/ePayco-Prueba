
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
    @Prop({ required: true, unique: true })
    sessionId: string;

    @Prop({ required: true })
    token: string;

    @Prop({ required: true })
    clientId: string; // Storing document as reference

    @Prop({ required: true })
    amount: number;

    @Prop({ default: 'PENDING' })
    status: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
