import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import PageEntity from './PageEntity';

@ObjectType('Portfolio')
@Entity()
export default class PortfolioEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('int', { nullable: false })
  userId: number; // To create portfolio's on behalf of user

  @Field()
  @Column('varchar', { nullable: false })
  name: string;

  @Field()
  @Column('varchar', { nullable: false })
  versionType: string; // To determine different version type of Snapshot Portfolio say V1, V2, V3

  @Field()
  @Column('varchar', { nullable: false, unique: true })
  url: string;

  @OneToMany(() => PageEntity, (page) => page.portfolio)
  pages: PageEntity[];
}
