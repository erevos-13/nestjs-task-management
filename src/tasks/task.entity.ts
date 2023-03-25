import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task.model';
import { AuthEntity } from '../auth/auth.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => AuthEntity, (user) => user.tasks, { eager: false })
  @Exclude({
    toPlainOnly: true,
  })
  user: AuthEntity;
}
