
<details>
<summary>English</summary>

# PirateSocial

**PirateSocial** is a modern social media platform for individuals with the pirate spirit, enabling real-time chats, posts, and secure connections with friends. Built with cutting-edge technologies, PirateSocial offers a seamless and scalable user experience.

![PirateSocial UI](https://github.com/user-attachments/assets/4d857587-3ed3-4b2e-b5e8-d484d273a0b9)

---

## Features

### Core Features

-   **Real-time Messaging**: Instantly chat with other pirates using Socket.IO.
-   **Group Chats**: Create and manage topic-based groups.
-   **One-to-One and One-to-Many Chat**: Support for direct messages and group communications.
-   **Media Sharing**: Share images, files, and other media.
-   **Feed Post**: Post and view pirate-like updates on your personal feed.
-   **Follow System**: Follow friends to see their activities on the feed.
-   **Private Messaging**: Secure and encrypted direct messages.
-   **Notifications**:
    -   **Real-time notifications**: Delivered via Socket.IO for online users.
    -   **Push notifications**: Powered by FCM for offline users.
-   **Cross-platform Support**: Accessible on desktop, mobile, and tablets.
-   **Caching**: Optimized speed using Redis caching.
-   **Object Storage**: Store media securely using AWS S3, delivered via CloudFront CDN.

---

## Tech Stack

### Frontend

-   **Next.js**: A React framework for fast and SEO-friendly web apps.
-   **Tailwind CSS**: For utility-first and modern styling.
-   **Socket.IO**: Real-time communication for chat and notifications.
-   **TypeScript**: Ensures type safety and better development flow.

### Backend

-   **NestJS**: A scalable and modular Node.js framework.
-   **Socket.IO**: Manages real-time communication for chat and notifications.
-   **Prisma**: Simplified database ORM for PostgreSQL.
-   **PostgreSQL**: Relational database for storing user data, posts, and relationships.
-   **Cache - Redis**: For caching frequently accessed data and user sessions.
-   **JWT**: Authentication and session management.

### Additional Tools

-   **Docker**: Containerization for deployment.
-   **NGINX**: Reverse proxy for handling requests efficiently.
-   **AWS S3**: Media object storage for uploaded images and files.
-   **CloudFront**: CDN for delivering media content globally.
-   **Firebase Cloud Messaging (FCM)**: Push notifications for offline users.

---

## System Design Overview

### High-Level Architecture

1.  **Client-Side**:
    -   Users interact via a Next.js frontend.
    -   Real-time chat and notifications through Socket.IO.

2.  **Backend**:
    -   **NestJS API**: Handles business logic for posts, user management, and authentication.
    -   **Socket.IO**: Manages real-time communication for messages and notifications.
    -   **Redis**:
        -   Caches user sessions and frequently accessed feed data specific to each user for faster retrieval.
        -   Handles Pub/Sub mechanisms for Socket.IO events like chat updates and notifications.
    -   **PostgreSQL**: Stores structured data, such as user profiles, posts, likes, follows, and comments.

3.  **Cache**:
    -   **Feed Caching**: User-specific feeds are cached in Redis to minimize database load and ensure fast response times.
    -   **Session Management**: Active user sessions and frequently accessed data are stored in Redis.

4.  **Object Storage**:
    -   **AWS S3**: Stores media uploads securely.
    -   **CloudFront**: Serves images and files via a global CDN for faster delivery.

5.  **Notifications**:
    -   **Socket.IO Notifications**: Real-time alerts for active users.
    -   **FCM Push Notifications**: Offline notifications for mobile devices.

6.  **Real-time Chat**:
    -   **Socket.IO**: Enables real-time messaging for:
        -   **One-to-One Chat**: Direct messaging between users.
        -   **Group Chat**: Communication within groups with one-to-many capabilities.

### Flow Diagram

```
User --> [Client Application] --> [Load Balancer] --> [App Service]
       |                               |
       |--[Request Data]--------------------> [App Service]
       |                                  |
       |                                  |-- [Cache Module] ✔
       |                                  |-- [Feed Module] (Read/Write Feed) ✔
       |                                  |-- [Notification Module] ✔
       |                                  |-- [Task Queue Module]
       |                                  |
       |----(Read/Write Data)------------------> [Database]
       |                                  |------> [Redis Cache] (Feed Data, User Data) ✔
       |
       |--(Static Assets)-------------------> [AWS S3 + CloudFront] ----> [Global CDN]
       |--(Background Task)--------> [Task Queue]
                                            |
                                            |----- [Background Worker] (Process Task)
```
![image](https://github.com/user-attachments/assets/04f4f4d8-e8b1-4184-a33e-1cd3fb5ea822)

---

## Getting Started

### Prerequisites

-   **Node.js** (>= 14.x)
-   **PostgreSQL** (>= 14.x)
-   **Redis**
-   **Docker** (optional but recommended)

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/TDevUIT/PirateSocial.git
    cd PirateSocial
    ```

2.  **Install Dependencies**:

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

3.  **Environment Variables**:
    -   Set up `.env` files for frontend and backend using provided `.env.example` files.

4.  **Run the Development Server**:

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

5.  **Run with Docker**:

    ```bash
    docker-compose up --build
    ```

    This command starts:

    -   Frontend and Backend
    -   PostgreSQL and Redis containers

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

1.  Fork the repository.
2.  Create a feature branch for your changes:

    ```bash
    git checkout -b feature/your-feature-name
    ```
3.  Commit your changes and push:

    ```bash
    git commit -m "Add your feature description"
    git push origin feature/your-feature-name
    ```
4.  Open a pull request with a detailed description of your changes.

---

## License

PirateSocial is licensed under the [MIT License](LICENSE).

---

## Screenshots

![Chat Screen](https://github.com/user-attachments/assets/74edf9e1-5116-4085-958b-613d30ac1b16)
![Feed Post](https://github.com/user-attachments/assets/fe964a5e-aca7-47cf-a2b4-6a0d79f22f84)
![Notifications](https://github.com/user-attachments/assets/8256a480-354a-4a40-8221-794dc37ef4de)

---

## Future Improvements

-   **User Analytics**: Add insights into user engagement and interactions.
-   **Video Uploads**: Extend media support for short video posts.
-   **Advanced Search**: Search for posts, users, and hashtags.
-   **Dark Mode**: Improve user experience with dark theme support.

---

Enjoy your journey on **PirateSocial**! Arr matey! 🚀
</details>

<details>
    <summary>日本語</summary>

# PirateSocial

**PirateSocial** は、海賊の精神を持つ個人向けの現代的なソーシャルメディアプラットフォームで、リアルタイムチャット、投稿、友人との安全な接続を可能にします。最先端の技術で構築されたPirateSocialは、シームレスでスケーラブルなユーザーエクスペリエンスを提供します。

![PirateSocial UI](https://github.com/user-attachments/assets/4d857587-3ed3-4b2e-b5e8-d484d273a0b9)

---

## 機能

### 主要機能

-   **リアルタイムメッセージング**: Socket.IOを使用して他の海賊と即座にチャット。
-   **グループチャット**: トピックベースのグループを作成および管理。
-   **1対1および1対多チャット**: ダイレクトメッセージとグループコミュニケーションをサポート。
-   **メディア共有**: 画像、ファイル、その他のメディアを共有。
-   **フィード投稿**: 個人フィードに海賊のようなアップデートを投稿および表示。
-   **フォローシステム**: 友達をフォローしてフィードでの活動を確認。
-   **プライベートメッセージング**: 安全で暗号化されたダイレクトメッセージ。
-   **通知**:
    -   **リアルタイム通知**: オンラインユーザー向けにSocket.IO経由で配信。
    -   **プッシュ通知**: オフラインユーザー向けにFCMを搭載。
-   **クロスプラットフォームサポート**: デスクトップ、モバイル、タブレットでアクセス可能。
-   **キャッシング**: Redisキャッシュを使用した最適化された速度。
-   **オブジェクトストレージ**: AWS S3を使用してメディアを安全に保存し、CloudFront CDN経由で配信。

---

## 技術スタック

### フロントエンド

-   **Next.js**: 高速でSEOフレンドリーなWebアプリのためのReactフレームワーク。
-   **Tailwind CSS**: ユーティリティファーストでモダンなスタイリング用。
-   **Socket.IO**: チャットと通知のためのリアルタイム通信。
-   **TypeScript**: 型の安全性とより良い開発フローを保証。

### バックエンド

-   **NestJS**: スケーラブルでモジュール式のNode.jsフレームワーク。
-   **Socket.IO**: チャットと通知のためのリアルタイム通信を管理。
-   **Prisma**: PostgreSQL用の簡略化されたデータベースORM。
-   **PostgreSQL**: ユーザーデータ、投稿、関係を保存するためのリレーショナルデータベース。
-   **Redis**: 頻繁にアクセスされるデータとユーザーセッションのキャッシュ用。
-   **JWT**: 認証とセッション管理。

### 追加ツール

-   **Docker**: デプロイメント用のコンテナ化。
-   **NGINX**: リクエストを効率的に処理するためのリバースプロキシ。
-   **AWS S3**: アップロードされた画像とファイル用のメディアオブジェクトストレージ。
-   **CloudFront**: メディアコンテンツをグローバルに配信するためのCDN。
-   **Firebase Cloud Messaging (FCM)**: オフラインユーザー向けのプッシュ通知。

---

## システム設計の概要

### 高レベルアーキテクチャ

1.  **クライアント側**:
    -   ユーザーはNext.jsフロントエンドを介してインタラクト。
    -   Socket.IOを介したリアルタイムチャットと通知。

2.  **バックエンド**:
    -   **NestJS API**: 投稿、ユーザー管理、認証のビジネスロジックを処理。
    -   **Socket.IO**: メッセージと通知のリアルタイム通信を管理。
    -   **Redis**:
        -   ユーザーセッションと、各ユーザーに固有の頻繁にアクセスされるフィードデータをキャッシュして、より高速な取得を実現。
        -   チャットの更新や通知などのSocket.IOイベントのPub/Subメカニズムを処理。
    -   **PostgreSQL**: ユーザープロファイル、投稿、いいね、フォロー、コメントなどの構造化データを保存。

3.  **キャッシュ**:
    -   **フィードキャッシュ**: ユーザー固有のフィードはRedisにキャッシュされ、データベースの負荷を最小限に抑え、高速な応答時間を確保。
    -   **セッション管理**: アクティブなユーザーセッションと頻繁にアクセスされるデータはRedisに保存。

4.  **オブジェクトストレージ**:
    -   **AWS S3**: メディアアップロードを安全に保存。
    -   **CloudFront**: より高速な配信のためにグローバルCDN経由で画像とファイルを配信。

5.  **通知**:
    -   **Socket.IO通知**: アクティブユーザー向けのリアルタイムアラート。
    -   **FCMプッシュ通知**: モバイルデバイス向けのオフライン通知。

6.  **リアルタイムチャット**:
    -   **Socket.IO**: 以下に対応するリアルタイムメッセージングを有効化。
        -   **1対1チャット**: ユーザー間のダイレクトメッセージング。
        -   **グループチャット**: 1対多の機能を備えたグループ内でのコミュニケーション。

### フロー図

```
ユーザー --> [クライアントアプリケーション] --> [ロードバランサー] --> [アプリサービス]
       |                               |
       |--[データリクエスト]--------------------> [アプリサービス]
       |                                  |
       |                                  |-- [キャッシュモジュール] ✔
       |                                  |-- [フィードモジュール] (フィードの読み書き) ✔
       |                                  |-- [通知モジュール] ✔
       |                                  |-- [タスクキューモジュール]
       |                                  |
       |----(データの読み書き)------------------> [データベース]
       |                                  |------> [Redisキャッシュ] (フィードデータ、ユーザーデータ) ✔
       |
       |--(静的アセット)-------------------> [AWS S3 + CloudFront] ----> [グローバルCDN]
       |--(バックグラウンドタスク)--------> [タスクキュー]
                                            |
                                            |----- [バックグラウンドワーカー] (タスクの処理)
```
![image](https://github.com/user-attachments/assets/d944c39e-7fc3-4a17-9785-98b97e86d81f)

---

## はじめに

### 前提条件

-   **Node.js** (>= 14.x)
-   **PostgreSQL** (>= 14.x)
-   **Redis**
-   **Docker** (オプションですが推奨)

### インストール

1.  **リポジトリのクローン**:

    ```bash
    git clone https://github.com/TDevUIT/PirateSocial.git
    cd PirateSocial
    ```

2.  **依存関係のインストール**:

    ```bash
    # フロントエンド
    cd apps/web
    npm install

    # バックエンド
    cd apps/server
    npm install
     # Turbo
    npm install
    ```

3.  **環境変数**:
    -   提供された`.env.example`ファイルを使用して、フロントエンドとバックエンド用に`.env`ファイルをセットアップします。

4.  **開発サーバーの実行**:

    ```bash
    # フロントエンド (Next.js)
    cd apps/web
    npm run dev

    # バックエンド (NestJS)
    cd apps/server
    npm run dev
    ```
     #turbo
    npm run dev

5.  **Dockerで実行**:

    ```bash
    docker-compose up --build
    ```

    このコマンドは以下を起動します。

    -   フロントエンドとバックエンド
    -   PostgreSQLとRedisコンテナ

---

## フォルダ構造

```
PirateSocial/
├── apps ──web/        # Next.js フロントエンドコード
│          ├── apps/       # ルートとページ
│          ├── components/  # 再利用可能なコンポーネント
│          └── public/      # 静的アセット
│        ──server/         # NestJS バックエンドコード
│          ├── src/         # ソースコード
│          ├── prisma/      # Prisma スキーマと移行
│          └── test/        # ユニットテストと統合テスト
│
├── docker-compose.yml
├── .env.example     # 環境設定の例
└── README.md        # ドキュメント
```

---

## 貢献

コミュニティの貢献を歓迎します！次の手順に従ってください。

1.  リポジトリをフォーク。
2.  変更のための機能ブランチを作成します。

    ```bash
    git checkout -b feature/your-feature-name
    ```
3.  変更をコミットしてプッシュします。

    ```bash
    git commit -m "機能の説明を追加"
    git push origin feature/your-feature-name
    ```
4.  変更の詳細な説明とともにプルリクエストを開きます。

---

## ライセンス

PirateSocialは[MITライセンス](LICENSE)の下でライセンスされています。

---

## スクリーンショット

![チャット画面](https://github.com/user-attachments/assets/74edf9e1-5116-4085-958b-613d30ac1b16)
![フィード投稿](https://github.com/user-attachments/assets/fe964a5e-aca7-47cf-a2b4-6a0d79f22f84)
![通知](https://github.com/user-attachments/assets/8256a480-354a-4a40-8221-794dc37ef4de)

---

## 今後の改善

-   **ユーザー分析**: ユーザーエンゲージメントとインタラクションに関するインサイトを追加。
-   **動画アップロード**: 短い動画投稿のためのメディアサポートを拡張。
-   **高度な検索**: 投稿、ユーザー、ハッシュタグを検索。
-   **ダークモード**: ダークテーマサポートによるユーザーエクスペリエンスの向上。

---

**PirateSocial**での旅をお楽しみください！アール・メイティー！🚀

</details>

<details>
<summary>Tiếng Việt</summary>

# PirateSocial

**PirateSocial** là một nền tảng mạng xã hội hiện đại dành cho những người có tinh thần cướp biển, cho phép trò chuyện, đăng bài theo thời gian thực và kết nối an toàn với bạn bè. Được xây dựng bằng các công nghệ tiên tiến, PirateSocial mang đến trải nghiệm người dùng liền mạch và có khả năng mở rộng.

![Giao diện PirateSocial](https://github.com/user-attachments/assets/4d857587-3ed3-4b2e-b5e8-d484d273a0b9)

---

## Tính năng

### Tính năng chính

-   **Nhắn tin theo thời gian thực**: Trò chuyện ngay lập tức với những người cướp biển khác bằng Socket.IO.
-   **Trò chuyện nhóm**: Tạo và quản lý các nhóm dựa trên chủ đề.
-   **Trò chuyện một-một và một-nhiều**: Hỗ trợ tin nhắn trực tiếp và giao tiếp nhóm.
-   **Chia sẻ phương tiện**: Chia sẻ hình ảnh, tệp tin và các phương tiện khác.
-   **Đăng bài trên Feed**: Đăng và xem các cập nhật kiểu cướp biển trên feed cá nhân của bạn.
-   **Hệ thống theo dõi**: Theo dõi bạn bè để xem các hoạt động của họ trên feed.
-   **Tin nhắn riêng tư**: Tin nhắn trực tiếp an toàn và được mã hóa.
-   **Thông báo**:
    -   **Thông báo theo thời gian thực**: Được gửi qua Socket.IO cho người dùng trực tuyến.
    -   **Thông báo đẩy**: Được hỗ trợ bởi FCM cho người dùng ngoại tuyến.
-   **Hỗ trợ đa nền tảng**: Có thể truy cập trên máy tính để bàn, điện thoại di động và máy tính bảng.
-   **Bộ nhớ đệm**: Tối ưu hóa tốc độ bằng bộ nhớ đệm Redis.
-   **Lưu trữ đối tượng**: Lưu trữ phương tiện một cách an toàn bằng AWS S3, được phân phối qua CloudFront CDN.

---

## Công nghệ

### Frontend

-   **Next.js**: Một framework React cho các ứng dụng web nhanh và thân thiện với SEO.
-   **Tailwind CSS**: Để tạo kiểu theo hướng tiện ích và hiện đại.
-   **Socket.IO**: Giao tiếp theo thời gian thực cho trò chuyện và thông báo.
-   **TypeScript**: Đảm bảo an toàn kiểu và quy trình phát triển tốt hơn.

### Backend

-   **NestJS**: Một framework Node.js có khả năng mở rộng và theo mô-đun.
-   **Socket.IO**: Quản lý giao tiếp theo thời gian thực cho trò chuyện và thông báo.
-   **Prisma**: ORM cơ sở dữ liệu đơn giản hóa cho PostgreSQL.
-   **PostgreSQL**: Cơ sở dữ liệu quan hệ để lưu trữ dữ liệu người dùng, bài đăng và các mối quan hệ.
-   **Redis**: Để lưu vào bộ nhớ đệm dữ liệu và phiên người dùng được truy cập thường xuyên.
-   **JWT**: Xác thực và quản lý phiên.

### Công cụ bổ sung

-   **Docker**: Container hóa để triển khai.
-   **NGINX**: Reverse proxy để xử lý các yêu cầu một cách hiệu quả.
-   **AWS S3**: Lưu trữ đối tượng phương tiện cho hình ảnh và tệp tin được tải lên.
-   **CloudFront**: CDN để phân phối nội dung phương tiện trên toàn cầu.
-   **Firebase Cloud Messaging (FCM)**: Thông báo đẩy cho người dùng ngoại tuyến.

---

## Tổng quan về thiết kế hệ thống

### Kiến trúc cấp cao

1.  **Phía Client**:
    -   Người dùng tương tác thông qua frontend Next.js.
    -   Trò chuyện và thông báo theo thời gian thực thông qua Socket.IO.

2.  **Backend**:
    -   **NestJS API**: Xử lý logic nghiệp vụ cho các bài đăng, quản lý người dùng và xác thực.
    -   **Socket.IO**: Quản lý giao tiếp theo thời gian thực cho tin nhắn và thông báo.
    -   **Redis**:
        -   Lưu vào bộ nhớ đệm phiên người dùng và dữ liệu feed được truy cập thường xuyên, cụ thể cho từng người dùng để truy xuất nhanh hơn.
        -   Xử lý các cơ chế Pub/Sub cho các sự kiện Socket.IO như cập nhật trò chuyện và thông báo.
    -   **PostgreSQL**: Lưu trữ dữ liệu có cấu trúc, chẳng hạn như hồ sơ người dùng, bài đăng, lượt thích, theo dõi và bình luận.

3.  **Bộ nhớ đệm**:
    -   **Bộ nhớ đệm Feed**: Các feed dành riêng cho người dùng được lưu trong bộ nhớ đệm Redis để giảm thiểu tải cơ sở dữ liệu và đảm bảo thời gian phản hồi nhanh.
    -   **Quản lý phiên**: Các phiên người dùng đang hoạt động và dữ liệu được truy cập thường xuyên được lưu trữ trong Redis.

4.  **Lưu trữ đối tượng**:
    -   **AWS S3**: Lưu trữ các tải lên phương tiện một cách an toàn.
    -   **CloudFront**: Phục vụ hình ảnh và tệp tin thông qua CDN toàn cầu để phân phối nhanh hơn.

5.  **Thông báo**:
    -   **Thông báo Socket.IO**: Cảnh báo theo thời gian thực cho người dùng đang hoạt động.
    -   **Thông báo đẩy FCM**: Thông báo ngoại tuyến cho các thiết bị di động.

6.  **Trò chuyện theo thời gian thực**:
    -   **Socket.IO**: Cho phép nhắn tin theo thời gian thực cho:
        -   **Trò chuyện một-một**: Nhắn tin trực tiếp giữa người dùng.
        -   **Trò chuyện nhóm**: Giao tiếp trong nhóm với khả năng một-nhiều.

### Sơ đồ luồng

```
Người dùng --> [Ứng dụng Client] --> [Bộ cân bằng tải] --> [Dịch vụ ứng dụng]
       |                               |
       |--[Yêu cầu dữ liệu]--------------------> [Dịch vụ ứng dụng]
       |                                  |
       |                                  |-- [Mô-đun bộ nhớ đệm] ✔
       |                                  |-- [Mô-đun Feed] (Đọc/Ghi Feed) ✔
       |                                  |-- [Mô-đun thông báo] ✔
       |                                  |-- [Mô-đun hàng đợi tác vụ]
       |                                  |
       |----(Đọc/Ghi dữ liệu)------------------> [Cơ sở dữ liệu]
       |                                  |------> [Bộ nhớ đệm Redis] (Dữ liệu Feed, Dữ liệu người dùng) ✔
       |
       |--(Tài sản tĩnh)-------------------> [AWS S3 + CloudFront] ----> [CDN toàn cầu]
       |--(Tác vụ nền)--------> [Hàng đợi tác vụ]
                                            |
                                            |----- [Worker nền] (Xử lý tác vụ)
```
![image](https://github.com/user-attachments/assets/fedecd51-e8fe-4557-90d2-0926b33a4623)

---

## Bắt đầu

### Điều kiện tiên quyết

-   **Node.js** (>= 14.x)
-   **PostgreSQL** (>= 14.x)
-   **Redis**
-   **Docker** (tùy chọn nhưng được khuyến nghị)

### Cài đặt

1.  **Sao chép repository**:

    ```bash
    git clone https://github.com/TDevUIT/PirateSocial.git
    cd PirateSocial
    ```

2.  **Cài đặt dependencies**:

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

3.  **Biến môi trường**:
    -   Thiết lập các tệp `.env` cho frontend và backend bằng cách sử dụng các tệp `.env.example` được cung cấp.

4.  **Chạy máy chủ phát triển**:

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

5.  **Chạy bằng Docker**:

    ```bash
    docker-compose up --build
    ```

    Lệnh này khởi động:

    -   Frontend và Backend
    -   PostgreSQL và Redis containers

---

## Cấu trúc thư mục

```
PirateSocial/
├── apps ──web/        # Mã frontend Next.js
│          ├── apps/       # Các routes và trang
│          ├── components/  # Các components có thể tái sử dụng
│          └── public/      # Các tài sản tĩnh
│        ──server/         # Mã backend NestJS
│          ├── src/         # Mã nguồn
│          ├── prisma/      # Schema và migrations Prisma
│          └── test/        # Các bài kiểm thử đơn vị và tích hợp
│
├── docker-compose.yml
├── .env.example     # Các ví dụ về cấu hình môi trường
└── README.md        # Tài liệu
```

---

## Đóng góp

Chúng tôi hoan nghênh những đóng góp từ cộng đồng! Hãy làm theo các bước sau:

1.  Fork repository.
2.  Tạo một branch tính năng cho các thay đổi của bạn:

    ```bash
    git checkout -b feature/your-feature-name
    ```
3.  Commit các thay đổi của bạn và push:

    ```bash
    git commit -m "Thêm mô tả tính năng của bạn"
    git push origin feature/your-feature-name
    ```
4.  Mở một pull request với mô tả chi tiết về các thay đổi của bạn.

---

## Giấy phép

PirateSocial được cấp phép theo [Giấy phép MIT](LICENSE).

---

## Ảnh chụp màn hình

![Màn hình chat](https://github.com/user-attachments/assets/74edf9e1-5116-4085-958b-613d30ac1b16)
![Đăng bài feed](https://github.com/user-attachments/assets/fe964a5e-aca7-47cf-a2b4-6a0d79f22f84)
![Thông báo](https://github.com/user-attachments/assets/8256a480-354a-4a40-8221-794dc37ef4de)

---

## Cải tiến trong tương lai

-   **Phân tích người dùng**: Thêm thông tin chi tiết về tương tác và mức độ tương tác của người dùng.
-   **Tải video lên**: Mở rộng hỗ trợ phương tiện cho các bài đăng video ngắn.
-   **Tìm kiếm nâng cao**: Tìm kiếm bài đăng, người dùng và hashtag.
-   **Chế độ tối**: Cải thiện trải nghiệm người dùng với hỗ trợ chủ đề tối.

---

Chúc bạn có một hành trình thú vị trên **PirateSocial**! Arr matey! 🚀

</details>

