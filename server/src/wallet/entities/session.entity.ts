
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('wallet_sessions')
export class WalletSession {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    session_id: string;

    @Column()
    token: string;

    @Column()
    client_id: string;

    @Column('decimal', { precision: 15, scale: 2 })
    amount: number;

    @Column({ default: 'PENDING' })
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
