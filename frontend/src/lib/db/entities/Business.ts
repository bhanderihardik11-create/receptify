import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  businessType?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ default: 'en' })
  preferredLanguage!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ type: 'integer', default: 100 })
  callCredits!: number;

  @Column({ type: 'varchar', default: 'starter' })
  planTier!: 'starter' | 'growth' | 'business';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
