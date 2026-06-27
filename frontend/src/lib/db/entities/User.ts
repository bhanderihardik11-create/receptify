import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Business } from './Business';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  ownerName!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'varchar', default: 'owner' })
  role!: 'owner' | 'admin' | 'member';

  @Column({ default: false })
  emailVerified!: boolean;

  @Column({ type: 'uuid', nullable: true })
  businessId?: string | null;

  @ManyToOne(() => Business, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'businessId' })
  business?: Business;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
