# Address Book Application

A modern, cloud-based address book application built with Next.js 14, TypeScript, Prisma, and SQLite. Features include user authentication, full CRUD operations, search/filtering, and CSV/vCard import/export.

## Features

- **User Authentication**: Secure registration and login with NextAuth.js
- **Contact Management**: Create, read, update, and delete contacts
- **Search & Filter**: Search contacts by name, email, or phone number
- **Import/Export**: Import and export contacts in CSV and vCard formats
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Docker Ready**: Containerized for easy deployment

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v5 with credentials provider
- **Deployment**: Docker, DigitalOcean compatible

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Local Development

1. **Clone the repository** (if applicable)

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="development"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

4. **Initialize the database**:
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Run the development server**:
```bash
npm run dev
```

6. **Open your browser**: Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Docker Deployment

### Build and Run with Docker Compose

1. **Set up environment variables**:
Create a `.env` file:
```env
NEXTAUTH_SECRET=your-production-secret-here
NEXTAUTH_URL=http://localhost:3000
```

2. **Build and start the container**:
```bash
docker-compose up -d
```

3. **View logs**:
```bash
docker-compose logs -f
```

4. **Stop the container**:
```bash
docker-compose down
```

### Build Docker Image Manually

```bash
docker build -t address-book:latest .
```

### Run the Docker Container

```bash
docker run -d \
  -p 3000:3000 \
  -v address-book-data:/app/data \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e DATABASE_URL="file:/app/data/sqlite.db" \
  --name address-book \
  address-book:latest
```

## Deployment to DigitalOcean

### Option 1: DigitalOcean App Platform

1. **Create a new app** in DigitalOcean App Platform
2. **Connect your repository**
3. **Configure the app**:
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - HTTP Port: 3000

4. **Add environment variables**:
   - `NEXTAUTH_SECRET` (use a secure random string)
   - `NEXTAUTH_URL` (your app's URL)
   - `DATABASE_URL=file:/app/data/sqlite.db`
   - `NODE_ENV=production`

5. **Add a persistent volume**:
   - Mount path: `/app/data`
   - Name: `address-book-data`

### Option 2: DigitalOcean Droplet with Docker

1. **Create a Droplet** with Docker pre-installed

2. **SSH into your droplet**:
```bash
ssh root@your-droplet-ip
```

3. **Clone your repository** (or upload files via SCP)

4. **Create environment file**:
```bash
nano .env
```
Add your production environment variables

5. **Build and run**:
```bash
docker-compose up -d
```

6. **Set up nginx reverse proxy** (optional but recommended):
```bash
apt update
apt install nginx certbot python3-certbot-nginx
```

Configure nginx to proxy requests to port 3000 and set up SSL with Let's Encrypt.

## Database

The application uses SQLite for simplicity and portability. The database file is stored in:
- Development: `./prisma/dev.db`
- Docker: `/app/data/sqlite.db` (persisted via volume)

### Database Schema

- **User**: id, email, name, passwordHash, createdAt, updatedAt
- **Contact**: id, userId, firstName, lastName, email, phone, address, city, state, zipCode, country, notes, createdAt, updatedAt

### Migrations

To create a new migration:
```bash
npx prisma migrate dev --name your_migration_name
```

To apply migrations in production:
```bash
npx prisma migrate deploy
```

## Import/Export Formats

### CSV Format

The CSV importer expects the following columns (case-insensitive):
- First Name (required)
- Last Name
- Email
- Phone
- Address
- City
- State
- Zip Code
- Country
- Notes

Example:
```csv
First Name,Last Name,Email,Phone,City,State
John,Doe,john@example.com,555-1234,New York,NY
Jane,Smith,jane@example.com,555-5678,Los Angeles,CA
```

### vCard Format

Supports vCard 3.0 format with the following fields:
- FN (Full Name)
- N (Structured Name)
- EMAIL
- TEL (Phone)
- ADR (Address)
- NOTE

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **Session Management**: JWT tokens with httpOnly cookies
- **CSRF Protection**: Built-in NextAuth.js protection
- **Input Validation**: Server-side validation with Zod schemas
- **SQL Injection Prevention**: Prisma parameterized queries
- **File Upload Security**: 5MB limit, MIME type validation
- **XSS Prevention**: React automatic escaping

## Project Structure

```
/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   └── api/
│   ├── actions/
│   ├── components/
│   ├── lib/
│   └── types/
├── public/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Troubleshooting

### Database Issues

**Problem**: Database locked errors
**Solution**: Ensure only one process is accessing the database. In production, use Docker volumes for persistence.

### Build Issues

**Problem**: bcrypt compilation errors
**Solution**: The project is configured to externalize bcrypt in Next.js. Ensure you're using Node 20+.

### Docker Issues

**Problem**: Permission denied on /app/data
**Solution**: The Dockerfile creates the data directory with correct permissions. Ensure you're using the provided Dockerfile.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run build`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.

## Roadmap

Future enhancements:
- Contact profile pictures
- Groups and tags
- Bulk operations
- Full-text search
- Activity logging
- Email integration
- OAuth providers (Google, GitHub)
- Mobile app (React Native)
