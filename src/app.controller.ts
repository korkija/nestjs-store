/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Query, Render, Req } from '@nestjs/common';
import { Request, Response } from 'express';
// import { AppService } from './app.service';
import { ProductService } from './products/service/product/product.service';

@Controller('mystore')
export class AppController {
  constructor(private readonly productService: ProductService) {}

  @Get('home')
  @Render('home')
  async renderPage() {
    const products = await this.productService.getAll();
    return { products, isLoggedIn: global.isLoggedIn };
  }

  @Get('add-product')
  @Render('add-product')
  renderAddProductPage() {
    return { isLoggedIn: global.isLoggedIn };
  }

  @Get('sign-up')
  @Render('sign-up')
  renderSignUpPage(@Req() req: Request, @Query('message') message: string) {
    return { isLoggedIn: global.isLoggedIn, message };
  }
  // @Get('edit-product/:id')
  // @Render('edit-product')
  // async renderEditProductPage(@Param('id') id: string) {
  //   // const product = products.find((p) => p.id === parseInt(id));
  //   const product = await this.productService.getOne(parseInt(id));
  //   if (product) {
  //     return { product };
  //   } else {
  //     throw new NotFoundException(`Product not found`);
  //   }
  // }
}
