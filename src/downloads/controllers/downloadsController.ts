import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';

import { DownloadsManager, IS3Key } from '../models/downloadsManager';

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
      file.contentStream.pipe(res);
    }
    catch(err){
      next (err);
    }
  };
 
}
