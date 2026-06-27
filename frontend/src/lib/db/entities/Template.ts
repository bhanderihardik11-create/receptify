import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  industry!: string;

  @Column()
  purpose!: string;

  @Column({ default: 'en' })
  language!: 'en' | 'hi' | 'gu';

  @Column({ type: 'text' })
  preview!: string;

  @Column({ type: 'text' })
  body!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
