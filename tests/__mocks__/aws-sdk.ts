export interface IS3Mock {
  s3: jest.Mock;
  getObject: jest.Mock;
  createReadStream: jest.Mock;
  on: jest.Mock;
  pipe: jest.Mock;
}

function mockS3(): IS3Mock {
  const onMock = jest.fn();
  const pipeMock = jest.fn();
  const createReadStreamMock = jest.fn(() => ({
    pipe: pipeMock,
    on: onMock,
  }));
  const s3GetObjectMock = jest.fn(() => ({
    createReadStream: createReadStreamMock,
  }));
  const s3Mock = jest.fn(() => ({
    getObject: s3GetObjectMock,
  }));

  return {
    s3: s3Mock,
    getObject: s3GetObjectMock,
    createReadStream: createReadStreamMock,
    on: onMock,
    pipe: pipeMock,
  };
}

export const s3Mocks = mockS3();

export const S3 = s3Mocks.s3;
