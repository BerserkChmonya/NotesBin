# NoteBin

NoteBin is a web application designed for creating, editing, deleting, sharing notes and ability to get friends and follow them. It uses JWT for authorization and is built with a microservices architecture using Java. The front-end is built with React.

## Features

- User Authorization through JWT
- Create, Edit, Delete Notes
- Generating unique url names and withholding them in cache for very quick issuing
- Share Notes
- Storing Notes text in cloud
- Friends System
- (Coming Soon) Notifications Feature

## Tech Stack

### Back-end

- Java 21
- Maven
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- Redis
- Azure Blob Storage
- Kafka

### Front-end

- React

## Microservices

- User Service: Handles user-related operations
- URLGenerator Service: Generates URLs for sharing notes
- Notes Service: Manages note-related operations
- Friends Service: Manages friend-related operations
- (Coming Soon) Notifications Service: Handles notifications

## Future Plans

After completing Notifications service and debugging, the plan is to make this application ready for real-world usage.

## Setup

Follow these steps to set up and run the project:
1. **Redis Setup**
    Redis runs on port 6379. A Docker Compose file is provided to start the Redis server. Run the following command:

    ```bash
    docker-compose up

2. **Database Setup**
    The application uses PostgreSQL for the database. Make sure you have PostgreSQL installed and running. Update the application properties in each service with your database connection details.

3. **Backend Services Setup**

   Each microservice runs on a different port:

   - User Service: Port 8000
   - URLGenerator Service: Port 8040
   - Notes Service: Port 8020
   - Friends Service: Port 8060

   To start each service, navigate to the respective service's directory and run the following command:

   ```bash
   mvn spring-boot:run

4. **Frontend Setup**
    The frontend runs on port 3000. Navigate to the frontend directory and run the following commands:

    ```bash
    npm install
    npm start

5. **Azure Blob Storage Setup**
    The application uses Azure Blob Storage to store the notes text. In the database, only links as names to blobs are stored. Make sure to set up an Azure Blob Storage account and update the application properties with your Azure Blob Storage connection string and container name.

## License

