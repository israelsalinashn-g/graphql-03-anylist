import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>
  ) { }

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRepository.create(createItemInput);
    await this.itemsRepository.save(newItem);
    return newItem;
  }

  async findAll(): Promise<Item[]> {
    const items = await this.itemsRepository.find();
    return items;
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemsRepository.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item with ${id} not found`);


    return this.itemsRepository.save(item);
  }

  async remove(id: string): Promise<Item> {
    // TODO: SoftDelete, integridad referencial
    const item = await this.findOne(id);
    await this.itemsRepository.remove(item);

    return item;
  }
}
