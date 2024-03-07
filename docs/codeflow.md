# Blog Builder Code Flow

The codebase for the Blog Builder project is organized into the following structure:

## Prisma Migrations

The database migration files for Prisma are stored under the `prisma/migrations` directory:

```
prisma
└── migrations
├── 20230720080439_dev
├── 20230728113908_dev
├── 20230803061801_dev
├── 20230831154555_dev
├── 20230911083333_
├── 20230914062507_
├── 20230914063400_
├── 20230915053949_
└── 20230918085251_
```

## Source Code

The main source code is organized into various directories under the `src` folder:

```
src
├── annotation-service
├── blog-service
├── middlewares
├── openai-service
├── optional-service
├── search-service
├── utils
└── version
```

- `annotation-service`: Code related to handling annotations.
- `blog-service`: Code for managing blog-related functionalities.
- `middlewares`: Middleware functions used in the application.
- `openai-service`: Code interacting with the OpenAI service for content generation.
- `optional-service`: Additional services that can be enabled or disabled.
- `search-service`: Code responsible for handling search functionality.
- `utils`: Utility functions and helper modules.
- `version`: Code related to managing version information.

## Testing

The test files are stored under the `test` directory, ensuring comprehensive test coverage for the various components of the application.

This code flow structure helps maintain a clear separation of concerns and facilitates ease of navigation and collaboration among developers working on different aspects of the Blog Builder project.
