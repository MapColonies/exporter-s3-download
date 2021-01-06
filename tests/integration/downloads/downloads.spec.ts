/* eslint-disable jest/no-mocks-import */
import { Readable } from 'stream';
import { container } from 'tsyringe';
import httpStatusCodes from 'http-status-codes';
import { registerTestValues } from '../testContainerConfig';
import { s3Mocks } from '../../__mocks__/aws-sdk';
import * as requestSender from './helpers/requestSender';

describe('downloads', function () {
  beforeAll(async function () {
    registerTestValues();
    await requestSender.init();
    s3Mocks.s3.mockClear();
    s3Mocks.getObject.mockClear();
    s3Mocks.createReadStream.mockClear();
    s3Mocks.pipe.mockClear();
    s3Mocks.on.mockClear();
  });
  afterEach(function () {
    container.clearInstances();
  });

  describe('Happy Path', function () {
    it('downloaded file succeed', async () => {
      const fileName = 'testFile.txt';
      const fileContent = 'content';

      s3Mocks.createReadStream.mockReturnValueOnce(Readable.from([fileContent]));

      const response = await requestSender.download(`${fileName}`, true);

      expect(response.status).toEqual(httpStatusCodes.OK);
      expect(response.get('Content-Disposition')).toEqual(`attachment; filename="${fileName}"`);
      expect(response.body).toEqual(fileContent);
    });
  });
  describe('Sad Path', function () {
    // All requests with status code 4XX-5XX
    it('downloaded file fail with 404 on invalid key', async () => {
      let errHandler: (err: unknown) => void = (err) => {
        err as Error;
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handlerSet = new Promise<void>((resolve, reject) => {
        s3Mocks.on.mockImplementation((event: string, cb: (err: unknown) => void) => {
          if (event == 'error') {
            errHandler = cb;
            resolve();
          }
        });
      });

      const responsePromise = requestSender.download('invalidKey');
      await handlerSet;
      errHandler({
        message: 'InvalidKey',
        statusCode: httpStatusCodes.NOT_FOUND,
      });
      const response = await responsePromise;
      expect(response.status).toEqual(httpStatusCodes.NOT_FOUND);
    });
  });
});
