# NotesBin

NoteBin is a web application designed for creating, editing, deleting, and sharing notes, with features for user interaction such as friend connections and notifications. It utilizes JWT for authorization and is built with a microservices architecture using Java for the backend and React for the frontend.

## Features

- User Authorization through JWT
- Create, Edit, Delete Notes
- Generating unique url names and withholding them in cache for very quick issuing
- Sharing Notes
- Storing Notes text in Azure Blob Storage
- Friends System for connecting with other users
- Real-time Notifications using Kafka and WebSocket (STOMP protocol)
- Offline Notification Storage in the database for users who are not online

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
- Kafka (for asynchronous communication between microservices)
- WebSocket with STOMP (for real-time notifications)

### Front-end

- React
- Axios (for making HTTP requests)
- WebSocket with STOMP (for real-time communication)
- Bootstrap (for responsive design)
- React-Bootstrap (for integrating Bootstrap components with React)
- React Router DOM (for handling routing and navigation)

## Microservices

- User Service: Handles user-related operations
- URLGenerator Service: Generates URLs for sharing notes
- Notes Service: Manages note-related operations
- Friends Service: Manages friend-related operations
- Notifications Service: Handles push notifications 

## Future Plans

Little UI improvement, tests, debugging, the plan is to make this application ready for real-world usage (Clusters, Load balancers, additional Caching, etc...).

## Setup

Follow these steps to set up and run the project:
1. **Redis, Kafka Setup**
    Redis runs on port 6379, Kafka on port 9092. A Docker Compose file is provided to start the Redis, Kafka servers. Run the following command:

    ```bash
    docker-compose upc

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

This project is licensed under the terms of the [LICENSE](./LICENSE) file located in the root directory.
