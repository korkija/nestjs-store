import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDTO } from 'src/DTO/product.dto';
import { Product } from 'src/entities/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async addProduct(newProduct: ProductDTO) {
    const product = this.productRepository.create(newProduct);
    return await this.productRepository.save(product);
  }

  async getAll() {
    return await this.productRepository.find();
  }

  async getOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async updateProduct(id: number, updateData: ProductDTO) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    // const updatedProduct = Object.assign(product, updateData);
    this.productRepository.merge(product, updateData);
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return await this.productRepository.remove(product);
  }
}
