# PirateSocial

**PirateSocial** is a modern social media platform for individuals with the pirate spirit, enabling real-time chats, posts, and secure connections with friends. Built with cutting-edge technologies, PirateSocial offers a seamless and scalable user experience.

![PirateSocial UI](https://github.com/user-attachments/assets/4d857587-3ed3-4b2e-b5e8-d484d273a0b9)

---

## Features

### Core Features

- **Real-time Messaging**: Instantly chat with other pirates using Socket.IO.
- **Group Chats**: Create and manage topic-based groups.
- **One-to-One and One-to-Many Chat**: Support for direct messages and group communications.
- **Media Sharing**: Share images, files, and other media.
- **Feed Post**: Post and view pirate-like updates on your personal feed.
- **Follow System**: Follow friends to see their activities on the feed.
- **Private Messaging**: Secure and encrypted direct messages.
- **Notifications**:
  - **Real-time notifications**: Delivered via Socket.IO for online users.
  - **Push notifications**: Powered by FCM for offline users.
- **Cross-platform Support**: Accessible on desktop, mobile, and tablets.
- **Caching**: Optimized speed using Redis caching.
- **Object Storage**: Store media securely using AWS S3, delivered via CloudFront CDN.

---

## Tech Stack

### Frontend

- **Next.js**: A React framework for fast and SEO-friendly web apps.
- **Tailwind CSS**: For utility-first and modern styling.
- **Socket.IO**: Real-time communication for chat and notifications.
- **TypeScript**: Ensures type safety and better development flow.

### Backend

- **NestJS**: A scalable and modular Node.js framework.
- **Socket.IO**: Manages real-time communication for chat and notifications.
- **Prisma**: Simplified database ORM for PostgreSQL.
- **PostgreSQL**: Relational database for storing user data, posts, and relationships.
- **Redis**: For caching frequently accessed data and user sessions.
- **JWT**: Authentication and session management.

### Additional Tools

- **Docker**: Containerization for deployment.
- **NGINX**: Reverse proxy for handling requests efficiently.
- **AWS S3**: Media object storage for uploaded images and files.
- **CloudFront**: CDN for delivering media content globally.
- **Firebase Cloud Messaging (FCM)**: Push notifications for offline users.

---

## System Design Overview

### High-Level Architecture

1. **Client-Side**:
   - Users interact via a Next.js frontend.
   - Real-time chat and notifications through Socket.IO.

2. **Backend**:
   - **NestJS API**: Handles business logic for posts, user management, and authentication.
   - **Socket.IO**: Manages real-time communication for messages and notifications.
   - **Redis**: 
     - Caches user sessions and frequently accessed feed data specific to each user for faster retrieval.
     - Handles Pub/Sub mechanisms for Socket.IO events like chat updates and notifications.
   - **PostgreSQL**: Stores structured data, such as user profiles, posts, likes, follows, and comments.

3. **Cache**:
   - **Feed Caching**: User-specific feeds are cached in Redis to minimize database load and ensure fast response times.
   - **Session Management**: Active user sessions and frequently accessed data are stored in Redis.

4. **Object Storage**:
   - **AWS S3**: Stores media uploads securely.
   - **CloudFront**: Serves images and files via a global CDN for faster delivery.

5. **Notifications**:
   - **Socket.IO Notifications**: Real-time alerts for active users.
   - **FCM Push Notifications**: Offline notifications for mobile devices.

6. **Real-time Chat**:
   - **Socket.IO**: Enables real-time messaging for:
     - **One-to-One Chat**: Direct messaging between users.
     - **Group Chat**: Communication within groups with one-to-many capabilities.

### Flow Diagram
```
User --> [Next.js Frontend] ✔ --> [NGINX/Load Balancer] --> [API Gateway] ✔
      |                                                  |
      |--(REST API/GraphQL)---> [Monolithic Application]
      |                                  |
      |                                  |-- [Auth Module] (JWT Validation) ✔
      |                                  |-- [Feed Module] (Personalized Feeds) ✔ 
      |                                  |-- [Chat Module] (Real-time Chat) ✔ 
      |                                  |-- [Notification Module] (Push Notifications) ✔
      |                                  |-- [Search Module] (Full-text Search) 
      |                                  |
      |--(Database Queries)-----> [PostgreSQL]
      |                          --> [Redis Cache] (Session, Feeds, Follow Data) ✔
      |                          --> [Search Index] (e.g., Elasticsearch)
      |
      |--(Media Requests)-------> [AWS S3 ✔ + CloudFront] ---------> [Global CDN]
     |--(Push Notifications)---> [Firebase Cloud Messaging (FCM)]
---
 
## Getting Started

### Prerequisites

- **Node.js** (>= 14.x)
- **PostgreSQL** (>= 14.x)
- **Redis**
- **Docker** (optional but recommended)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TDevUIT/PirateSocial.git
   cd PirateSocial
   ```

2. **Install Dependencies**:
   ```bash
   # Frontend
   cd apps/web
   npm install
   
   # Backend
   cd apps/server
   npm install
   # Turbo
   npm install

   ```

3. **Environment Variables**:
   - Set up `.env` files for frontend and backend using provided `.env.example` files.

4. **Run the Development Server**:
   ```bash
   # Frontend (Next.js)
   cd apps/web
   npm run dev
   
   # Backend (NestJS)
   cd apps/server
   npm run dev
   ```
   #turbo 
   npm run dev

5. **Run with Docker**:
   ```bash
   docker-compose up --build
   ```
   This command starts:
   - Frontend and Backend
   - PostgreSQL and Redis containers

---

## Folder Structure
```
PirateSocial/
├── apps ──web/        # Next.js frontend code
│          ├── apps/       # Routes and pages
│          ├── components/  # Reusable components
│          └── public/      # Static assets
│        ──server/         # NestJS backend code
│          ├── src/         # Source code
│          ├── prisma/      # Prisma schema and migrations
│          └── test/        # Unit and integration tests
│
├── docker-compose.yml
├── .env.example     # Environment configuration examples
└── README.md        # Documentation
```

---

## Contributing

We welcome community contributions! Follow these steps:

1. Fork the repository.
2. Create a feature branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes and push:
   ```bash
   git commit -m "Add your feature description"
   git push origin feature/your-feature-name
   ```
4. Open a pull request with a detailed description of your changes.

---

## License

PirateSocial is licensed under the [MIT License](LICENSE).

---

## Screenshots

![Chat Screen](https://github.com/user-attachments/assets/74edf9e1-5116-4085-958b-613d30ac1b16)
![Feed Post](https://github.com/user-attachments/assets/fe964a5e-aca7-47cf-a2b4-6a0d79f22f84)
![Notifications](https://github.com/user-attachments/assets/8256a480-354a-4a40-8221-794dc37ef4de)
![Profile Page](https://github.com/user-attachments/assets/ac0c5b7f-6529-49a7-a9ef-120372ba5f83)

---

## Future Improvements

- **User Analytics**: Add insights into user engagement and interactions.
- **Video Uploads**: Extend media support for short video posts.
- **Advanced Search**: Search for posts, users, and hashtags.
- **Dark Mode**: Improve user experience with dark theme support.

---

Enjoy your journey on **PirateSocial**! Arr matey! 🚀
