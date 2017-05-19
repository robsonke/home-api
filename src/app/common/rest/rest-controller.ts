import { Request, Response } from 'express';
import {Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller } from 'tsoa';

export class RestController extends Controller {
  constructor() { super(); }

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
