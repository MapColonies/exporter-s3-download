import { Readable as ReadableStream} from 'stream'
import { inject, injectable } from 'tsyringe';
import { S3 } from 'aws-sdk'
import { IConfig } from 'config';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';
import { IS3Config } from '../interfaces';

export interface IS3Key {
  directory: string;
  fileName: string;
}

export interface IFile {
  name: string;
  contentStream: ReadableStream;
}

@injectable()
export class DownloadsManager {
  private readonly s3Config: IS3Config;
  private readonly s3:  S3;
  public constructor(@inject(Services.LOGGER) private readonly logger: ILogger,
    @inject(Services.CONFIG) config: IConfig) {
      this.s3Config = config.get<IS3Config>('S3'); 
      this.s3 = new S3({
        credentials:{
          accessKeyId:  this.s3Config.accessKeyId,
          secretAccessKey: this.s3Config.secretAccessKey
        },
        endpoint: this.s3Config.endpoint
      });
    }


  public download(file: IS3Key): IFile {
    //bucket property is ignored and full path must be used if key contains /
    const options: S3.GetObjectRequest = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Bucket: '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Key: `${this.s3Config.bucket}/${file.directory}/${file.fileName}`,
    };
    const fileStream = this.s3.getObject(options).createReadStream();
    return {
      name: file.fileName,
      contentStream: fileStream
    };
  }
}
