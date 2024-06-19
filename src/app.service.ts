import { Injectable } from "@nestjs/common";
import { OnApplicationBootstrap } from "@nestjs/common/interfaces";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  //constructor(private productService: ProductService) {}

  async onApplicationBootstrap(): Promise<any> {
    /*  const productsCount = await this.productService.countAll();

    if (productsCount === 0) {
      await this.productService.addFromExcel();
    } */
    console.log("bootstrap");
  }
}
