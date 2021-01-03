import { Readable as ReadableStream} from 'stream'
import { inject, injectable } from 'tsyringe';
import { S3 } from 'aws-sdk'
import { IConfig } from 'config';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';
import { IS3Config } from '../interfaces';

export interface IS3Key {
  directory: string;
  file: string;
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
    const options: S3.GetObjectRequest = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Bucket: this.s3Config.bucket,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Key: `${file.directory}/${file.file}`,
    };

    const fileStream = this.s3.getObject(options).createReadStream();
    return {
      name: file.file,
      contentStream: fileStream
    };
  }
}
