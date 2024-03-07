import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  async getSearchResults(queryParams: any, res: Response): Promise<any> {
    try {
      let { index, title, tags } = queryParams;
      
      if (!title) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      } else {
        if (!tags) {
          tags = title;
        }
      }

      if (!index) {
        index = 'blog';
      }

      const shouldFilter: any = [];

      if (tags) {
        tags = tags.split(',');
        shouldFilter.push({
          terms: {
            tags,
          },
        });
      }

      const mustFilter: any = [
        {
          match: {
            is_deleted: false,
          },
        },
      ];

      if (title && title.length > 0) {
        // Match on title or tags using a should clause
        mustFilter.push({
          bool: {
            should: [
              {
                match: {
                  title,
                },
              },
              {
                terms: {
                  tags,
                },
              },
            ],
          },
        });
      }

      // Filter based on published_at not being null
      mustFilter.push({
        exists: {
          field: 'published_at',
        },
      });
      // Queries if either matches with title or tags
      const response = await axios.post(
        `${process.env.ELASTICSEARCH_ENDPOINT}/${index}/_search`,
        {
          query: {
            bool: {
              must: mustFilter,
            },
          },
        },
      );

      return res.status(HttpStatus.ACCEPTED).send({ data: response.data });
    } catch (error: any) {
      this.logger.error('Error at Search Results service' + error.message);
    }
  }
}
