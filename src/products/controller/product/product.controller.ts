import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Redirect,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductDTO } from 'src/DTO/product.dto';
import { Product } from 'src/entities/entities';
import { ProductService } from 'src/products/service/product/product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Post('create')
  @Redirect('/mystore/home')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          cb(null, new Date().toISOString() + file.originalname);
        },
      }),
    }),
  )
  async addProduct(
    @Body() productData: ProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    if (file) {
      productData.image = file.filename; // Store the filename in the DTO
    }
    return await this.productService.addProduct(productData);
  }
  @Get('getOne/:id')
  @Render('edit-product')
  async getOne(@Param('id') id: string) {
    const product = await this.productService.getOne(id);
    return { product };
  }

  @Put('update/:id')
  @Redirect('/mystore/home')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          cb(null, new Date().toISOString() + file.originalname);
        },
      }),
    }),
  )
  async updateProduct(
    @Param('id') id: string,
    @Body() updateData: ProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateData.image = file.filename; // Store the filename in the DTO
    }
    return this.productService.updateProduct(id, updateData);
  }

  @Delete('delete/:id')
  @Redirect('/mystore/home')
  async deleteProduct(@Param('id') id: string) {
    await this.productService.deleteProduct(id);
    return 'Product deleted successfully';
  }
}
