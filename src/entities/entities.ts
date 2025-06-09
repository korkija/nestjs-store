import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false, length: 100 })
  productname: string;

  @Column('decimal', { nullable: false, precision: 10 })
  price: number;

  @Column('varchar', { nullable: false, length: 255 })
  image: string;

  @CreateDateColumn()
  createdAt: Date;
}
