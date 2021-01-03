import { IConfig } from 'config';
import { IS3Config } from '../../../../src/downloads/interfaces';
import { DownloadsManager } from '../../../../src/downloads/models/downloadsManager';

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
  util: undefined
}

describe('DownloadsManager', () => {
  beforeEach(function () {
    downloadsManager = new DownloadsManager({ log: jest.fn() }, configMock );
  });

  describe('download', () => {
    //TODO: mock s3
    it('return the resource of id 1', function () {
      const fileName = 'testFile'
      // action
      const resource = downloadsManager.download({
        directory:'testDir',
        fileName: fileName
      });

      // expectation
      expect(resource.name).toEqual(fileName);
      
    });
  });
});
