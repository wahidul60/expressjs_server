import { NextFunction, Request, Response } from "express";

const logger = (req : Request, res : Response, next : NextFunction)=> {
  console.log(`Date : ${new Date().toISOString()}`);
  next()
};

export default logger;