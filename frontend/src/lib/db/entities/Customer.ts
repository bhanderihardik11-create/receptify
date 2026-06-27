import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Business } from './Business';

@Entity('customers')
@Index(['businessId', 'phone'])
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  businessId!: string;

  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'businessId' })
  business!: Business;

  @Column()
  fullName!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ type: 'varchar', default: 'en' })
  language!: 'en' | 'hi' | 'gu';

  @Column({ nullable: true })
  customerType?: string;

  @Column({ type: 'simple-array', default: '' })
  tags!: string[];

  @Column({ type: 'date', nullable: true })
  dueDate?: string;

  @Column({ type: 'date', nullable: true })
  appointmentDate?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', default: 'pending' })
  consentStatus!: 'pending' | 'granted' | 'revoked';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
