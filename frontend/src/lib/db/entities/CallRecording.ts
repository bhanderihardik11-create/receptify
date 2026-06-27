import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Call } from './Call';

@Entity('call_recordings')
export class CallRecording {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  callId!: string;

  @OneToOne(() => Call, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'callId' })
  call!: Call;

  @Column({ type: 'text', default: '/audio/sample-recording.wav' })
  audioUrl!: string;

  @Column({ type: 'integer', default: 0 })
  durationSec!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
