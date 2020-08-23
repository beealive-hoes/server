import { Router, Request, Response, NextFunction } from "express";
import * as mime from 'mime-types';
import * as fs from 'fs';

export const router = Router();

//

export abstract class ApiEndpoint {

  constructor (
    public method: 'get' | 'post' | 'put' | 'delete' | 'all',
    public path: string,
    public description: string,
    public authMode: 'public' | 'authorized' | 'localhost',
    public middleware?: any
  ) { }

  abstract handle(req: Request, res: Response, next: NextFunction): void;

}

const endpoints: ApiEndpoint[] = [];

export function registerApiEndpoint(endpoint: ApiEndpoint) {
  endpoints.push(endpoint);
  let middleware = [ ] as any[];
  if (endpoint.middleware) {
    if (typeof endpoint.middleware[Symbol.iterator] == 'function') middleware = [ ...endpoint.middleware ];
    else middleware = [ endpoint.middleware ];
  }
  router[endpoint.method](`/${endpoint.path}`, ...middleware, (req: Request, res: Response, next: NextFunction) => {
    if (endpoint.authMode == 'localhost') {
      if (!req.hostname.includes('localhost') && !req.host.includes('127.0.0.1')) {
        res.status(403).send({ error: 403, message: 'Forbidden', description: 'You are not allowed to access this endpoint.' });
        return;
      }
    } else if (endpoint.authMode == 'authorized') {
      if (false /* CHECK AUTH */) {
        res.status(401).send({ error: 401, message: 'Unauthorized', description: 'Please follow the basic authentication protocol to gain access.' });
        return;
      }
    }

    endpoint.handle(req, res, next);
  });
}

//

const handlerDocs = (req: Request, res: Response, next: NextFunction) => {
  const out = {
    description: 'Api docs. Endpoints are listed below. For a more readable version, head over to /api/docs.html',
    endpoints: endpoints.map(e => { return {
      method: e.method,
      path: e.path,
      description: e.description,
      authMode: e.authMode
    }})
  };
  res.status(200).send(JSON.stringify(out, null, 2));
}

const handlerDocsHtml = (req: Request, res: Response, next: NextFunction) => {
  const out = `<!DOCTYPE html><html lang="en"><body>
    <h1>Api endpoints</h1>
    <h5>JSON-Version can be found here: /api/docs</h5>
    <hr>
    <table style="width:100%">
      <tr>
        <th> Method </th>
        <th> Path </th>
        <th> Auth-Mode </th>
        <th> Description </th>
      <tr>
      ${ endpoints.map(e => `
        <tr>
          <th> ${e.method} </th>
          <th> ${e.path} </th>
          <th> ${e.authMode} </th>
          <th> ${e.description} </th>
        </tr>
      ` ).join('') }
    </table></body><style>table, th, td { border: 1px solid black; border-collapse: collapse; padding: 10px }</style></html>`;
    res.status(200).send(out);
}

const handler404 = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 404, message: 'Not Found', description: 'Invalid api endpoint. Goto /api/docs for a overview over all the endpoints.' });
}

export function sealApiEndpoints() {
  router.all( "/docs", handlerDocs );
  router.all( "/docs.html", handlerDocsHtml );
  router.all( "*", handler404 );
}