/* eslint-disable jest/no-mocks-import */
import { IConfig, IUtil } from 'config';
import { IS3Config } from '../../../../src/downloads/interfaces';
import { DownloadsManager } from '../../../../src/downloads/models/downloadsManager';
import { s3Mocks } from '../../../__mocks__/aws-sdk';

let downloadsManager: DownloadsManager;
const s3Config: IS3Config ={
  accessKeyId: 'testId',
  secretAccessKey: 'testSecret',
  endpoint: 'testEndpoint',
  bucket: 'testBucket'
} 
const configMock: IConfig = {
  get: jest.fn().mockReturnValue(s3Config),
  has: jest.fn(),
  util: {} as unknown as IUtil
}

describe('DownloadsManager', () => {
  beforeEach(function () {
    downloadsManager = new DownloadsManager({ log: jest.fn() }, configMock );
    s3Mocks.s3.mockClear();
    s3Mocks.getObject.mockClear();
    s3Mocks.createReadStream.mockClear();
    jest.mock('aws-sdk', () => {
      return {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          S3: s3Mocks.s3
      };
    });
  });

  describe('download', () => {
    it('return the requested file', function () {
      const fileName = 'testFile';
      const directory = 'testDir';
      const fileContent = 'content';

      s3Mocks.createReadStream.mockReturnValueOnce(fileContent)

      // action
      const file = downloadsManager.download({
        directory: directory,
        fileName: fileName
      });

      // expectation
      expect(s3Mocks.getObject).toHaveBeenCalledTimes(1);
      expect(s3Mocks.getObject).toHaveBeenCalledWith({ 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Bucket: s3Config.bucket,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Key: `${s3Config.bucket}/${directory}/${fileName}`
      });
      expect(s3Mocks.createReadStream).toHaveBeenCalledTimes(1);
      expect(file.name).toEqual(fileName);
      expect(file.contentStream).toEqual(fileContent);
      
    });
  });
});
