import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('billing_plans')
export class BillingPlan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  tier!: 'starter' | 'growth' | 'business';

  @Column({ type: 'integer' })
  monthlyCalls!: number;

  @Column({ type: 'integer' })
  monthlyPrice!: number;

  @Column({ type: 'simple-array' })
  features!: string[];

  @CreateDateColumn()
  createdAt!: Date;
}
