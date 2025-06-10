/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({ require: true })
  productname: string;

  @Prop({ require: true })
  price: number;

  @Prop({ require: true })
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
