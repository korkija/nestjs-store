import { IsNotEmpty, IsString, Min } from 'class-validator';

export class ProductDTO {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  productname: string;

  @Min(0.01, { message: 'Price must be greater than 0' })
  price: number;

  image: string;
}
