import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { validate } from 'openapi-validator-middleware';
import { DownloadsController } from '../controllers/downloadsController';
import { parse } from './parseRoute';

const downloadsRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(DownloadsController);

  router.get('/:key*', parse, validate, controller.getResource);

  return router;
};

export { downloadsRouterFactory };
