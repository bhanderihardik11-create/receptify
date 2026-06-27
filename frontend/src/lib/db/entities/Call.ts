import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Campaign } from './Campaign';
import { Customer } from './Customer';

export type CallStatus = 'queued' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'no_answer';
export type CallOutcome =
  | 'interested' | 'not_interested' | 'callback_requested' | 'payment_promised'
  | 'appointment_confirmed' | 'wrong_number' | 'no_answer' | 'failed' | 'pending';

@Entity('calls')
export class Call {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  campaignId!: string;

  @ManyToOne(() => Campaign, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaignId' })
  campaign!: Campaign;

  @Column({ type: 'uuid' })
  customerId!: string;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  @Column({ type: 'varchar', default: 'queued' })
  status!: CallStatus;

  @Column({ type: 'varchar', default: 'pending' })
  outcome!: CallOutcome;

  @Column({ type: 'integer', default: 0 })
  durationSec!: number;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endedAt?: Date;

  @Column({ type: 'integer', default: 0 })
  attemptNumber!: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
