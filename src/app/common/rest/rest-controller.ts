import { Request, Response } from 'express';

export class RestController {
  constructor() { }

  respond(res: Response, item: any | Array<any>, statusCode: number = 200): Response {
    return res.status(statusCode).json(item);
  }

  respondPlain(res: Response, item: any | Array<any>, statusCode: number = 200): Response {
    res.set('Content-Type', 'application/json');
    return res.status(statusCode).send(item);
  }

  respondNoContent(res: Response, statusCode: number = 204): Response {
    return res.status(statusCode).json();
  }
}
