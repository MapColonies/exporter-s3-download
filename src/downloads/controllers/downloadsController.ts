import { RequestHandler, NextFunction, Response } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';

import { DownloadsManager, IS3Key } from '../models/downloadsManager';
import { NotFoundError } from '../../common/exceptions/notFoundError';
import { BadRequestError } from '../../common/exceptions/badRequestError';

@injectable()
export class DownloadsController {
  public constructor(
    @inject(Services.LOGGER) private readonly logger: ILogger,
    @inject(DownloadsManager) private readonly manager: DownloadsManager
  ) {}

  public getResource: RequestHandler = (req, res, next) => {
    try{
      const file =this.manager.download(req.params as unknown as IS3Key)
      res = res.status(httpStatus.OK).attachment(file.name);
      file.contentStream.on('error',err =>{
        this.cleanResOnError(res);
        this.handleS3Error(err, next);
      })
      file.contentStream.pipe(res);
    }
    catch(err){
      this.cleanResOnError(res);
      this.handleS3Error(err, next);
    }
  };
 
  private handleS3Error(err: Error, next: NextFunction): void {
    const error = err as Error & { statusCode?: number; };
    if (error.statusCode === httpStatus.NOT_FOUND) {
      const notFound = new NotFoundError(error);
      next(notFound);
    } else if (error.statusCode === httpStatus.BAD_REQUEST) {
      const badRequest = new BadRequestError(error);
      next(badRequest);
    } else {
      next(error);
    }
  }

  private cleanResOnError(res:Response): void{ 
    res.removeHeader('content-disposition');
    res.contentType('application/json');
  }

}
