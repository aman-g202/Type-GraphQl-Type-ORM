import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import API_MESSAGES from '../constants/api-messages';
import ResponseCode from '../constants/enums/ResponseCodeEnum';
import HttpStatus from '../constants/http-status';
import PageEntity from '../entities/PageEntity';
import PortfolioEntity from '../entities/PortfolioEntity';
import { AddPortfolioInput, GetDraftPortfolioArgs, PortfolioType } from '../types/PortfolioTypes';
import { successResponse } from '../utilities';

@Resolver()
@Service()
export default class PortfoliosResolver {
  @Query(() => PortfolioType, { description: 'List all portfolios' })
  async listPortfolios(): Promise<PortfolioType> {
    const portfolioRepository = getRepository(PortfolioEntity);

    const data = await portfolioRepository.createQueryBuilder('portfolio_entity').getMany();

    return successResponse<PortfolioEntity>({
      result: data,
      statusCode: HttpStatus.ok,
      responseCode: ResponseCode.OK,
      message: API_MESSAGES.PORTFOLIO_FETCHED_SUCCESSFULLY,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => PortfolioType, { description: 'Add Portfolio' })
  async addPortfolio(@Arg('data') newPortfolioData: AddPortfolioInput): Promise<PortfolioType> {
    const portfolioRepository = getRepository(PortfolioEntity);
    await portfolioRepository.insert(newPortfolioData);
    return successResponse({
      statusCode: HttpStatus.created,
      responseCode: ResponseCode.OK,
      message: API_MESSAGES.PORTFOLIO_ADDED_SUCCESSFULLY,
      result: [],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => PortfolioType, { description: 'Create a snapshot Portfolio' })
  async createSnapshotPortfolio(@Args() { userId, name, versionType }: GetDraftPortfolioArgs): Promise<PortfolioType> {
    /* Select repositories */
    const portfolioRepository = getRepository(PortfolioEntity);
    const pagesRepository = getRepository(PageEntity);

    /* Find existing Draft portfolio for the user */
    const draftPortfolio = await portfolioRepository.findOne({ where: { userId, name, versionType } });

    if (!draftPortfolio) {
      throw new Error(API_MESSAGES.DRAFT_PORTFOLIO_DOES_NOT_EXISTS);
    }

    /* Find all the pages of corresponding Draft portfolio */
    const draftPages = await pagesRepository.find({
      where: { portfolio: draftPortfolio?.id },
      select: ['name', 'url'],
    });

    /* Create a Snapshot portfolio */
    const newPortfolio = await portfolioRepository.insert({
      userId,
      name: 'SNAPSHOT',
      versionType,
      url: draftPortfolio?.url.replace('draft', 'snapshot'), // Replace draft url with snapshot
    });

    /* Replicate the pages from draft to snapshot and then insert pages in relation to snapshot */
    let snapshotPages: { name: string; url: string; portfolio: { id: number } }[] = [];
    if (draftPages.length) {
      snapshotPages = draftPages.map((page) => ({
        name: page.name,
        url: page.url.replace('draft', 'snapshot'),
        portfolio: {
          id: newPortfolio.generatedMaps[0].id
        },
      }));

      await pagesRepository.createQueryBuilder().insert().into(PageEntity).values(snapshotPages).execute();
    }

    return successResponse({
      statusCode: HttpStatus.created,
      responseCode: ResponseCode.OK,
      message: API_MESSAGES.PORTFOLIO_ADDED_SUCCESSFULLY,
      result: [],
    });
  }
}
