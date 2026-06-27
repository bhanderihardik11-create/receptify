import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Business } from './Business';

@Entity('scripts')
export class Script {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  businessId!: string;

  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'businessId' })
  business!: Business;

  @Column()
  name!: string;

  @Column({ default: 'custom' })
  purpose!: string;

  @Column({ default: 'en' })
  language!: 'en' | 'hi' | 'gu';

  @Column({ type: 'text' })
  body!: string;

  @Column({ type: 'text', nullable: true })
  shortVersion?: string;

  @Column({ type: 'text', nullable: true })
  politeVersion?: string;

  @Column({ default: 'professional' })
  tone!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
