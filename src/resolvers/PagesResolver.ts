import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import API_MESSAGES from '../constants/api-messages';
import ResponseCode from '../constants/enums/ResponseCodeEnum';
import HttpStatus from '../constants/http-status';
import PageEntity from '../entities/PageEntity';
import PortfolioEntity from '../entities/PortfolioEntity';
import { AddPageInput, PageType } from '../types/PageTypes';
import { successResponse } from '../utilities';

@Resolver()
@Service()
export default class PagesResolver {
  @Query(() => PageType, { description: 'List all pages by portfolio version' })
  async listPagesByPortfolio(@Arg('portFolioId', { nullable: false }) portFolioId: number): Promise<PageType> {
    const pageRepository = getRepository(PageEntity);

    const data = await pageRepository
      .createQueryBuilder('page_entity')
      .where({ portfolio: portFolioId })
      .leftJoinAndSelect('page_entity.portfolio', 'portfolio') // Populated the portfolio detail as welll
      .getMany();

    return successResponse<PageEntity>({
      result: data,
      statusCode: HttpStatus.ok,
      responseCode: ResponseCode.OK,
      message: API_MESSAGES.PAGES_FETCHED_SUCCESSFULLY,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => PageType, { description: 'Add Page For Portfolio' })
  async addPage(@Arg('data') newPageData: AddPageInput): Promise<PageType> {
    const pageRepository = getRepository(PageEntity);
    const portfolioRepository = getRepository(PortfolioEntity);

    const portfolioData = await portfolioRepository.findOne(newPageData.portfolioId);

    if (!portfolioData) {
      throw new Error(API_MESSAGES.PORTFOLIO_DOES_NOT_EXISTS);
    }

    // eslint-disable-next-line prefer-template

    await pageRepository.insert({
      ...newPageData,
      portfolio: portfolioData,
      // eslint-disable-next-line prefer-template
      url: portfolioData.url + '/' + newPageData.name, // Appended page name to portfolio's url to create page url
    });

    return successResponse({
      statusCode: HttpStatus.created,
      responseCode: ResponseCode.OK,
      message: API_MESSAGES.PAGE_ADDED_SUCCESSFULLY,
      result: [],
    });
  }
}
