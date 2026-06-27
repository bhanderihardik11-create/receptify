import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Business } from './Business';

export type CampaignPurpose =
  | 'payment_reminder'
  | 'appointment_reminder'
  | 'lead_followup'
  | 'feedback'
  | 'event_reminder'
  | 'service_renewal'
  | 'cod_confirmation'
  | 'renewal_reminder'
  | 'reactivation'
  | 'custom';

export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'failed';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  businessId!: string;

  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'businessId' })
  business!: Business;

  @Column()
  name!: string;

  @Column({ type: 'varchar', default: 'custom' })
  purpose!: CampaignPurpose;

  @Column({ type: 'varchar', default: 'draft' })
  status!: CampaignStatus;

  @Column({ type: 'varchar', default: 'en' })
  language!: 'en' | 'hi' | 'gu';

  @Column({ default: 'female_professional' })
  voiceType!: string;

  @Column({ type: 'timestamptz', nullable: true })
  scheduledAt?: Date;

  @Column({ default: '09:00' })
  callingWindowStart!: string;

  @Column({ default: '19:00' })
  callingWindowEnd!: string;

  @Column({ type: 'integer', default: 2 })
  retryAttempts!: number;

  @Column({ type: 'integer', default: 5 })
  delayBetweenCalls!: number;

  @Column({ type: 'text', nullable: true })
  scriptText?: string;

  @Column({ default: false })
  complianceConfirmed!: boolean;

  @Column({ type: 'integer', default: 0 })
  totalContacts!: number;

  @Column({ type: 'integer', default: 0 })
  callsCompleted!: number;

  @Column({ type: 'integer', default: 0 })
  callsAnswered!: number;

  @Column({ type: 'integer', default: 0 })
  callsFailed!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
