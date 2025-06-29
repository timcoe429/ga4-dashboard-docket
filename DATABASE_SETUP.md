# PostgreSQL Database Setup on Railway

## Step 1: Add PostgreSQL to Railway

1. **Login to Railway**: Go to [railway.app](https://railway.app) and login
2. **Open your project**: Navigate to your ga4-dashboard project
3. **Add PostgreSQL service**:
   - Click the "+" button to add a new service
   - Select "Database" → "PostgreSQL"
   - Railway will provision a PostgreSQL instance

## Step 2: Get Environment Variables

1. Click on the PostgreSQL service in Railway
2. Go to the "Variables" tab
3. Copy the `DATABASE_URL` (it will look like `postgresql://user:password@host:port/database`)

## Step 3: Set Environment Variables

Create a `.env.local` file in your project root with:

```env
DATABASE_URL="your-database-url-from-railway"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-string-here"
```

**Important**: Replace `your-database-url-from-railway` with the actual DATABASE_URL from Railway.

For `NEXTAUTH_SECRET`, you can generate a random string or use:
```bash
openssl rand -base64 32
```

## Step 4: Install Dependencies and Setup Database

Run these commands in order:

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push database schema to Railway
npm run db:push

# Seed database with initial users
npm run db:seed
```

## Step 5: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/login`

3. Try logging in with either:
   - **Email**: tim@servicecore.com  
     **Password**: Tong@3113
   
   - **Email**: matt@servicecore.com  
     **Password**: timismyhero

## Initial Users

The database will be seeded with two admin users:

| Email | Password | Role |
|-------|----------|------|
| tim@servicecore.com | Tong@3113 | admin |
| matt@servicecore.com | timismyhero | admin |

## Troubleshooting

- **Database connection issues**: Check that your DATABASE_URL is correct and the Railway PostgreSQL service is running
- **Auth issues**: Make sure NEXTAUTH_SECRET is set and NEXTAUTH_URL matches your domain
- **Prisma issues**: Try `npm run db:generate` to regenerate the Prisma client

## Railway Production Deployment

1. In Railway, go to your main app service
2. Add the same environment variables:
   - `DATABASE_URL` (should auto-populate from the PostgreSQL service)
   - `NEXTAUTH_URL` (set to your Railway app URL, e.g., `https://your-app.railway.app`)
   - `NEXTAUTH_SECRET` (same random string as local)

3. Railway will automatically run the build process. The database schema will be applied during deployment.

## Database Management

- **View data**: Run `npm run db:studio` to open Prisma Studio
- **Add users**: Modify and run the seed script
- **Schema changes**: Update `prisma/schema.prisma` then run `npm run db:push` 