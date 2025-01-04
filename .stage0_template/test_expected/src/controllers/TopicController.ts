import TopicService from '../services/TopicService';
import { Request, Response } from 'express';
import { decodeToken, createBreadcrumb } from '@agile-learning-institute/mentorhub-ts-api-utils';

export default class TopicController {

  constructor() {
  }

  public getTopic = async (req: Request, res: Response) => {
    try {
      const token = decodeToken(req);
      const breadcrumb = createBreadcrumb(token, req);
      const results = await TopicService.FindTopic(req.query, token);
      res.json(results);
      res.status(200);
      console.info("GetTopic Completed", JSON.stringify(breadcrumb));
    } catch (error) {
      res.status(500);
      console.error("GetTopic Failed", error);
    }
  }
}