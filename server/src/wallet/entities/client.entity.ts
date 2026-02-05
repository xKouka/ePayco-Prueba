
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    document: string;

    @Column()
    names: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    balance: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
