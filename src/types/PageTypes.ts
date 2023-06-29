/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType, Int, ObjectType } from 'type-graphql';
import ResponseCode from '../constants/enums/ResponseCodeEnum';
import PageEntity from '../entities/PageEntity';
import IResponse from '../interfaces/ResponseInterface';

@InputType({ description: 'New page data on a behalf of portfolio' })
export class AddPageInput implements Partial<PageEntity> {
  @Field()
  name: string;

  @Field(type => Int)
  portfolioId: number;
}

@ObjectType('PageType', { description: 'Page Schema', implements: IResponse })
export class PageType implements IResponse {
  message: string;

  statusCode: number;

  responseCode: ResponseCode;

  @Field((type) => [PageEntity])
  result: PageEntity[];
}
