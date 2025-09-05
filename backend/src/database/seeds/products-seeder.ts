import { Product } from '@app/modules/products/entities/product.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

// https://blog.mazedul.dev/how-to-seed-database-using-typeorm-in-a-nestjs-project

export default class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    await dataSource.query('TRUNCATE "products" RESTART IDENTITY;');

    const productFactory = factoryManager.get(Product);

    await productFactory.saveMany(5);
  }
}
