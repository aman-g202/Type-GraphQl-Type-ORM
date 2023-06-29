/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgsType, Field, InputType, Int, ObjectType } from 'type-graphql';
import ResponseCode from '../constants/enums/ResponseCodeEnum';
import PortfolioEntity from '../entities/PortfolioEntity';
import IResponse from '../interfaces/ResponseInterface';

@InputType({ description: 'New portfolio data' })
export class AddPortfolioInput implements Partial<PortfolioEntity> {
  @Field()
  userId: number;

  @Field()
  name: string;

  @Field()
  versionType: string;

  @Field()
  url: string;
}

@ObjectType('PortfolioType', { description: 'Portfolio Schema', implements: IResponse })
export class PortfolioType implements IResponse {
  message: string;

  statusCode: number;

  responseCode: ResponseCode;

  @Field((type) => [PortfolioEntity])
  result: PortfolioEntity[];
}

@ArgsType()
export class GetDraftPortfolioArgs {
  @Field(type => Int, { nullable: false })
  userId: number;

  @Field({ defaultValue: 'DRAFT' })
  name: string;

  @Field({ nullable: false })
  versionType: string;
}
