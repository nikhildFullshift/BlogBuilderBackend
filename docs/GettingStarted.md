# Getting Started with Blog Builder

## Blog Builder - Prerequisites

Before you begin with the setup of the Blog Builder project, ensure that your development environment meets the following prerequisites:

## Development Tools

1. **Git:**

   - Ensure that Git is installed on your machine. If not, download and install Git from [https://git-scm.com/](https://git-scm.com/).

2. **Node.js and npm:**

   - Install the latest LTS version of Node.js and npm from [https://nodejs.org/](https://nodejs.org/).

3. **Docker:**
   - Make sure Docker is installed on your system. Follow the installation instructions for your operating system from [https://www.docker.com/get-started](https://www.docker.com/get-started).

## Project Dependencies

4. **Prisma CLI:**
   - Install Prisma CLI globally using the following command:
     ```bash
     npm install -g @prisma/cli
     ```

## Setting Up Docker Containers

5. **Elk and Postgres:**
   - Navigate to the `elk` and `postgress` folders in the project root.
   - Run the following command in each folder to start Docker containers:
     ```bash
     docker-compose up --build -d
     ```

## Running the Backend Server

6. **Backend-NestJS:**
   - Change directory to `backend-nestjs`:
     ```bash
     cd backend-nestjs
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the backend server:
     ```bash
     npm run start:dev
     ```

Now, your development environment is set up to run the Blog Builder project. Follow the "Getting Started" guide to start exploring and contributing to the platform.

To get started with the Blog Builder project, follow these steps:

1. **Clone the Repository:**

   - Clone the Blog Builder repository to your local machine:
     ```bash
     git clone https://gitlab.mindfire.co.in/gps-blog-builder/blog-builder.git
     ```

2. **Set Up Docker Containers:**

   - Navigate to the `elk` and `postgress` folders, and run the following command to set up the required Docker containers:
     ```bash
     cd elk
     docker-compose up --build -d
     ```
     ```bash
     cd ../postgress
     docker-compose up --build -d
     ```

3. **Run Backend Server:**

   - Change directory to `backend-nestjs`:
     ```bash
     cd ../backend-nestjs
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the backend server:
     ```bash
     npm run start:dev
     ```

4. **Access the Platform:**
   - `http://localhost:3000` to access the Blog Builder backend.

Now, you have successfully set up the Blog Builder project locally on your machine. Feel free to explore and contribute to the development of this dynamic blogging platform!
