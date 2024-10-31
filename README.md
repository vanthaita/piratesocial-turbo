# PirateSocial

PirateSocial is a web-based chat application that connects individuals who have a pirate spirit to do pirate-like things. Our platform is built with modern web technologies to provide fast, secure, and scalable real-time communication.

## Features

- **Real-time messaging**: Chat with others instantly.
- **Group chats**: Create and manage groups for different topics.
- **Media sharing**: Share images, files, and other media.
- **Private messaging**: Secure and private communication.
- **Cross-platform support**: Access PirateSocial on desktop, mobile, and tablets.
- **Notification system**: Stay updated with in-app and push notifications.

## Tech Stack

### Frontend

- **Next.js**: A React framework for building fast, scalable, and SEO-friendly web apps.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Socket.io**: For real-time, bidirectional communication between the client and server.
- **TypeScript**: Ensures type safety and improves the development process.

### Backend

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Socket.io**: To handle real-time communication on the backend.
- **Prisma**: An ORM tool to interact with databases efficiently.
- **PostgreSQL**: A powerful, open-source relational database.
- **JWT (JSON Web Tokens)**: For authentication and session management.

### Other Tools and Technologies

- **Redis**: For session management and caching.
- **Docker**: Containerization for easy deployment and scaling.
- **NGINX**: As a reverse proxy for handling requests.
- **Prisma**: For simplified database queries and management.

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- PostgreSQL (>= 14.x)
- Docker (optional, but recommended)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/TDevUIT/PirateSocial.git
    cd PirateSocial
    ```

2. Install dependencies for both the frontend and backend:

    ```bash
    # Navigate to the frontend
    cd frontend
    npm install
    
    # Navigate to the backend
    cd ../backend
    npm install
    ```

3. Set up your `.env` files for both the frontend and backend (example provided in `.env.example` files).

4. Run the development server:

    ```bash
    # Frontend (Next.js)
    cd frontend
    npm run dev
    
    # Backend (NestJS)
    cd ../backend
    npm run start:dev
    ```

### Running with Docker

To run the entire application with Docker, use the following commands:

```bash
docker-compose up --build
```
this will start both the frontend and backend services, along with PostgreSQL and Redis containers.

### Contributing
We welcome contributions from the community! To get started:
1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Submit a pull request with a detailed description.
### License
PirateSocial is licensed under the MIT License.
