import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProductsService } from "../prisma/products.service";
import { QueryOptions } from "../prisma/query-options.decorator";
import { GetOptionalUser } from "../auth/user.decorator";
import { User } from "@prisma/client";

@Controller("products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts(
    @GetOptionalUser() user: User | undefined,
    @Query("name") name: string | undefined,
    @Query("filterIrritants") filterIrritants: boolean,
    @QueryOptions() queryOptions: QueryOptions,
  ) {
    return this.productsService.getProducts(
      name,
      user,
      filterIrritants,
      queryOptions,
    );
  }

  @Get(":id")
  getProduct(@Param("id") id: string) {
    return this.productsService.getProduct(id);
  }
}
