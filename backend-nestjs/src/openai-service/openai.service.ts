import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { OpenAiGenerateDto, OptionalDto } from './openai';

@Injectable()
export class OpenAiService {
  private openai;
  private configuration;
  private readonly logger = new Logger(OpenAiService.name);

  constructor() {
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
  }

  async generateArticle(data: OpenAiGenerateDto, res: Response): Promise<any> {
    const { title, instruction, codeSnippet, optional } = data;
    if (!title || !codeSnippet) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: 'Bad Request' });
    }
    console.log("**************")
    let optionalPrompt;
    if (optional) {
      optionalPrompt = this.getOptionalPrompt(optional);
    }
    console.log("**********2**************")
    const prompt = `
      Follow these set of instructions to generate a seo optimized article.
      - Generate a seo friendly and informative title using this '${title}'.
      - Use the code snippet as a reference delimited by triple pipes and add improvised code to the final response explaining each of them in a detailed way.
      - Understand the context and make the article more relatable to the instructions given,which is delimited by triple quotes,if present.  
      - Add table of contents to the description ,refering different section of the article.

      ${instruction ? `Description : """${instruction}"""` : ''}
      Code Snippet : |||${codeSnippet}|||
      ${optionalPrompt ? optionalPrompt : ''}
      Make sure to return description in markdown format compatible with showdown.js.
      Return the response in json format with keys as title and description with respective values.
    `;
    const result = await this.getCompletion(prompt);
    console.log("*********************3**")
    return res.status(HttpStatus.ACCEPTED).send(result);
  }

  private async getCompletion(prompt, temperature = 0): Promise<string> {
    try {
      return new Promise(async (resolve, reject) => {
        let finalResponse = '';
        console.log("first")
        const response = await this.openai.createChatCompletion(
          {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature,
            stream: true,
          },
          { responseType: 'stream' },
        );
          console.log("##############", response)
        response.data.on('data', (data) => {
          const lines = data
            .toString()
            .split('\n')
            .filter((line) => line.trim() !== '');
          for (const line of lines) {
            const message = line.replace(/^data: /, '');
            if (message === '[DONE]') {
              continue; // Stream finished
            }
            try {
              const parsed = JSON.parse(message);
              if (parsed?.choices[0]?.delta?.content !== undefined) {
                finalResponse += parsed?.choices[0]?.delta?.content;
              }
            } catch (error) {
              console.error(
                'Could not JSON parse stream message',
                error,
              );

              // reject(error);
            }
          }
        });
        console.log("##########2#############")

        response.data.on('end', (data) => {
          this.logger.log('response completed');
          resolve(finalResponse);
        });
        console.log("###########3#########")
      });
    } catch (error) {
      console.log("############4######",error)
      if (error.response?.status) {
        console.error(error.response.status, error.message);
        error.response.data.on('data', (data) => {
          const message = data.toString();
          try {
            const parsed = JSON.parse(message);
            console.error('An error occurred during OpenAI request: ', parsed);
          } catch (error) {
            console.error('An error occurred during OpenAI request: ', message);
          }
        });
      } else {
        console.error('An error occurred during OpenAI request', error);
      }
    }
  }

  private getOptionalPrompt(optional: OptionalDto): string {
    let prompt = `Write an article between ${
      optional.articleSize === 'long'
        ? '3000-3500'
        : optional.articleSize === 'short'
        ? '120-240'
        : '400-600'
    } words by using the information provided above in more ${
      optional.tone ? optional.tone : 'friendly'
    } way.
    Focus on important details provided in the description and code snippets and make it relevant for the ${
      optional.domain ? optional.domain : 'software'
    } team.
    ${
      optional.hideCredentials
        ? 'Hide secret keys and credentials with astericks if present in the provided description or code snippets.'
        : ''
    } 
    `;
    return prompt;
  }
}
