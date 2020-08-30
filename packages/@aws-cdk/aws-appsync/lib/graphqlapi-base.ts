import { ITable } from '@aws-cdk/aws-dynamodb';
import { IFunction } from '@aws-cdk/aws-lambda';
import { CfnResource, IResource, Resource } from '@aws-cdk/core';
import { DynamoDbDataSource, HttpDataSource, LambdaDataSource, NoneDataSource, AwsIamConfig } from './data-source';

/**
 * Optional configuration for data sources
 */
export interface DataSourceOptions {
  /**
   * The name of the data source, overrides the id given by cdk
   *
   * @default - generated by cdk given the id
   */
  readonly name?: string;

  /**
   * The description of the data source
   *
   * @default - No description
   */
  readonly description?: string;
}

/**
 * Optional configuration for Http data sources
 */
export interface HttpDataSourceOptions extends DataSourceOptions {
  /**
   * The authorization config in case the HTTP endpoint requires authorization
   */
  readonly authorizationConfig?: AwsIamConfig;
}

/**
 * Interface for GraphQL
 */
export interface IGraphqlApi extends IResource {

  /**
   * an unique AWS AppSync GraphQL API identifier
   * i.e. 'lxz775lwdrgcndgz3nurvac7oa'
   *
   * @attribute
   */
  readonly apiId: string;

  /**
   * the ARN of the API
   *
   * @attribute
   */
  readonly arn: string;

  /**
   * add a new dummy data source to this API. Useful for pipeline resolvers
   * and for backend changes that don't require a data source.
   *
   * @param id The data source's id
   * @param options The optional configuration for this data source
   */
  addNoneDataSource(id: string, options?: DataSourceOptions): NoneDataSource;

  /**
   * add a new DynamoDB data source to this API
   *
   * @param id The data source's id
   * @param table The DynamoDB table backing this data source
   * @param options The optional configuration for this data source
   */
  addDynamoDbDataSource(id: string, table: ITable, options?: DataSourceOptions): DynamoDbDataSource;

  /**
   * add a new http data source to this API
   *
   * @param id The data source's id
   * @param endpoint The http endpoint
   * @param options The optional configuration for this data source
   */
  addHttpDataSource(id: string, endpoint: string, options?: HttpDataSourceOptions): HttpDataSource;

  /**
   * add a new Lambda data source to this API
   *
   * @param id The data source's id
   * @param lambdaFunction The Lambda function to call to interact with this data source
   * @param options The optional configuration for this data source
   */
  addLambdaDataSource(id: string, lambdaFunction: IFunction, options?: DataSourceOptions): LambdaDataSource;

  /**
   * Add schema dependency if not imported
   *
   * @param construct the dependee
   */
  addSchemaDependency(construct: CfnResource): boolean;
}

/**
 * Base Class for GraphQL API
 */
export abstract class GraphqlApiBase extends Resource implements IGraphqlApi {

  /**
   * an unique AWS AppSync GraphQL API identifier
   * i.e. 'lxz775lwdrgcndgz3nurvac7oa'
   */
  public abstract readonly apiId: string;

  /**
   * the ARN of the API
   */
  public abstract readonly arn: string;

  /**
   * add a new dummy data source to this API. Useful for pipeline resolvers
   * and for backend changes that don't require a data source.
   *
   * @param id The data source's id
   * @param options The optional configuration for this data source
   */
  public addNoneDataSource(id: string, options?: DataSourceOptions): NoneDataSource {
    return new NoneDataSource(this, id, {
      api: this,
      name: options?.name,
      description: options?.description,
    });
  }

  /**
   * add a new DynamoDB data source to this API
   *
   * @param id The data source's id
   * @param table The DynamoDB table backing this data source
   * @param options The optional configuration for this data source
   */
  public addDynamoDbDataSource(id: string, table: ITable, options?: DataSourceOptions): DynamoDbDataSource {
    return new DynamoDbDataSource(this, id, {
      api: this,
      table,
      name: options?.name,
      description: options?.description,
    });
  }

  /**
   * add a new http data source to this API
   *
   * @param id The data source's id
   * @param endpoint The http endpoint
   * @param options The optional configuration for this data source
   */
  public addHttpDataSource(id: string, endpoint: string, options?: HttpDataSourceOptions): HttpDataSource {
    return new HttpDataSource(this, id, {
      api: this,
      endpoint,
      name: options?.name,
      description: options?.description,
      authorizationConfig: options?.authorizationConfig,
    });
  }

  /**
   * add a new Lambda data source to this API
   *
   * @param id The data source's id
   * @param lambdaFunction The Lambda function to call to interact with this data source
   * @param options The optional configuration for this data source
   */
  public addLambdaDataSource(id: string, lambdaFunction: IFunction, options?: DataSourceOptions): LambdaDataSource {
    return new LambdaDataSource(this, id, {
      api: this,
      lambdaFunction,
      name: options?.name,
      description: options?.description,
    });
  }

  /**
   * Add schema dependency if not imported
   *
   * @param construct the dependee
   */
  public addSchemaDependency(construct: CfnResource): boolean {
    construct;
    return false;
  }
}