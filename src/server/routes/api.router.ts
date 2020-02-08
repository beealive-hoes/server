import { Router, Request, Response, NextFunction } from "express";
import * as mime from 'mime-types';
import * as fs from 'fs';

export const router = Router();

//

export abstract class ApiEndpoint {

  constructor (
    public method: 'get' | 'post' | 'put' | 'delete',
    public path: string,
    public description: string,
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
  router[endpoint.method](`/api/${endpoint.path}`, ...middleware, endpoint.handle);
}

//

let handlerDocs = (req: Request, res: Response, next: NextFunction) => {
  let out = {
    description: 'Api docs. Endpoints are listed below. For a more readable version, head over to /api/docs.html',
    endpoints: endpoints.map(e => { return {
      method: e.method,
      path: e.path,
      description: e.description
    }})
  };
  res.writeHead(200, { 'Content-Type': 'text' });
  res.end(JSON.stringify(out, null, 4), 'utf8');
}

let handlerDocsHtml = (req: Request, res: Response, next: NextFunction) => {
  // Note that this is a terrible way to code. Don't do that.
  let out = `<!DOCTYPE html><html lang="en"><body>
    <h1>Api endpoints</h1>
    <h5>JSON-Version can be found here: /api/docs</h5>
    <hr>
    <table style="width:100%">
      <tr>
        <th> Method </th>
        <th> Path </th>
        <th> Description </th>
      <tr>
      ${ endpoints.map(e => `
        <tr>
          <th> ${e.method} </th>
          <th> ${e.path} </th>
          <th> ${e.description} </th>
        </tr>
      ` ) }
    </table></body><style>table, th, td { border: 1px solid black; border-collapse: collapse; padding: 10px }</style></html>`;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(out, 'utf8');
}

let handler404 = (req: Request, res: Response, next: NextFunction) => {
  let out = {
    error: 404,
    message: 'not found',
    description: 'Invalid api endpoint. Goto /api/docs for a overview over all the endpoints.'
  };
  res.writeHead(404, { 'Content-Type': 'text' });
  res.end(JSON.stringify(out, null, 4), 'utf8');
}

export function sealApiEndpoints() {
  router.get   ( "/api/docs", handlerDocs );
  router.post  ( "/api/docs", handlerDocs );
  router.put   ( "/api/docs", handlerDocs );
  router.delete( "/api/docs", handlerDocs );
  
  router.get   ( "/api/docs.html", handlerDocsHtml );
  router.post  ( "/api/docs.html", handlerDocsHtml );
  router.put   ( "/api/docs.html", handlerDocsHtml );
  router.delete( "/api/docs.html", handlerDocsHtml );

  router.get   ( "/api", handler404 );
  router.post  ( "/api", handler404 );
  router.put   ( "/api", handler404 );
  router.delete( "/api", handler404 );
  router.get   ( "/api/*", handler404 );
  router.post  ( "/api/*", handler404 );
  router.put   ( "/api/*", handler404 );
  router.delete( "/api/*", handler404 );
}