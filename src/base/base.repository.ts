import { EventEmitter } from 'events';

import {
  Document,
  ModelOptions,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  AggregatePaginateModel,
  UpdateWriteOpResult,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
  AnyKeys,
  AnyObject,
  Types,
} from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PARSE_MONGOID_ERROR } from 'src/messages';
import { StatusEnum } from 'src/enums/base.enum';

import { BaseSchema, IObjectId } from './base.schema';

export class BaseRepository<Schema extends BaseSchema, T extends Document> extends EventEmitter {
  protected primaryKey = '_id';

  constructor(protected readonly model: PaginateModel<T>, protected readonly aggModel?: AggregatePaginateModel<any>) {
    super();
    this.model = model;
    this.aggModel = aggModel;
  }

  async create(entity: AnyKeys<Schema> & AnyObject): Promise<T> {
    return new this.model(entity).save();
  }

  async createOrUpdate(entity: UpdateQuery<Schema>): Promise<T> {
    let model = await this.model.findOneAndUpdate(
      {
        _id: entity._id,
      },
      { ...entity },
    );
    if (model === null) {
      model = await new this.model(entity).save();
    }

    return model;
  }

  async findOneOrCreate(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions | null): Promise<T> {
    const item = await this.findOne(filter, options);
    return this.createOrUpdate({ ...item, ...update });
  }

  async findById(id: IObjectId, options: QueryOptions = {}, populates: string[] = []): Promise<T> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(PARSE_MONGOID_ERROR);
    }
    const model = await this.findOne({ [this.primaryKey]: id } as any, options, populates);

    if (model && populates.length) {
      for (const path of populates) {
        await model.populate(path);
      }
    }

    if (!model) {
      throw new NotFoundException(`Not found id: ${id}`);
    }
    return model;
  }

  async findOne(params: FilterQuery<Schema> = {}, options: QueryOptions = {}, populates: string[] = []): Promise<T> {
    const softDeletedParams = { ...params };
    const model = await this.model.findOne(softDeletedParams, {}, { ...options, lean: true });

    if (model && populates.length) {
      for (const path of populates) {
        await model.populate(path);
      }
    }

    return model;
  }

  async find(
    // eslint-disable-next-line @typescript-eslint/ban-types
    params: FilterQuery<Schema> = {},
    // eslint-disable-next-line @typescript-eslint/ban-types
    options: QueryOptions = {},
    populates: string[] = [],
    sort: { [key: string]: any } = {},
  ): Promise<T[]> {
    const softDeletedParams = { ...params };
    const models = await this.model
      .find(softDeletedParams, null, { ...options, lean: true })
      .sort(sort)
      .exec();

    if (populates.length) {
      for (const path of populates) {
        for (const model of models) {
          await model.populate(path);
        }
      }
    }

    return models;
  }

  async findOneOrFail(params: FilterQuery<Schema>): Promise<T> {
    const model: T = await this.findOne(params);

    if (model === null) {
      throw new NotFoundException(
        `Model [${this.getModel().collection.name}] not found for query ${JSON.stringify(params)}`,
      );
    }

    return model;
  }

  async findOrFail(id: IObjectId): Promise<T> {
    try {
      return await this.findById(id);
    } catch (e) {
      if (e.name !== undefined && e.name === 'CastError') {
        throw new BadRequestException(e.message);
      }

      throw e;
    }
  }

  async paginate(params: any, options: PaginateOptions): Promise<PaginateResult<T>> {
    const softDeletedParams = { ...params };
    return this.model.paginate(softDeletedParams, options);
  }

  async findAll(
    // eslint-disable-next-line @typescript-eslint/ban-types
    params: FilterQuery<Schema> = {},
    // eslint-disable-next-line @typescript-eslint/ban-types
    options: QueryOptions = {},
    limit = 0,
    sort: { [key: string]: any } = {},
  ): Promise<Array<T>> {
    const softDeletedParams = { ...params };
    const query = this.model
      .find(softDeletedParams, null, { ...options, lean: true })
      .limit(limit)
      .sort(sort);
    return query.exec();
  }

  async removeAll(params: FilterQuery<Schema> = {}) {
    return this.model.deleteMany(params as any).exec();
  }

  async updateById(id: IObjectId, doc: UpdateQuery<Schema>, options?: ModelOptions): Promise<T> {
    return this.updateOne({ _id: id }, doc, options);
  }

  async updateOne(params: FilterQuery<Schema>, doc: UpdateQuery<Schema>, options?: ModelOptions): Promise<T> {
    const softDeletedParams = { ...params };
    return this.model.findOneAndUpdate(softDeletedParams, doc, { new: true, ...options }).exec();
  }

  async insertMany(data): Promise<T[]> {
    return this.model.insertMany(data);
  }

  async updateMany(
    params: FilterQuery<Schema>,
    doc: Partial<Schema> & UpdateQuery<Schema>,
    options?: ModelOptions,
  ): Promise<UpdateWriteOpResult> {
    const softDeletedParams = { ...params };
    return this.model.updateMany(softDeletedParams, doc, { new: true, ...options }).exec();
  }

  async delete(id: IObjectId) {
    return this.updateOne({ _id: id }, { deletedAt: new Date() } as any);
  }

  async transactionProduce(handler: any, transactionOptions?: any) {
    const session = await this.model.startSession();
    try {
      await session.withTransaction(handler, transactionOptions);
    } catch (error) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }

  async countDocuments(params: FilterQuery<T>) {
    const activeParams: FilterQuery<T> = {
      status: StatusEnum.Active,
      ...params,
    };
    return this.model.countDocuments(activeParams);
  }

  getModel(): PaginateModel<T> {
    return this.model;
  }

  getAggModel(): AggregatePaginateModel<T> {
    return this.aggModel;
  }
}
