import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Call } from './Call';

@Entity('call_transcripts')
export class CallTranscript {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  callId!: string;

  @OneToOne(() => Call, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'callId' })
  call!: Call;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
