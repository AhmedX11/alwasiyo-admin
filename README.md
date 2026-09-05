# Al Wasiyo Student Care

Staff portal for [Al Wasiyo Welfare Foundation](https://alwasiyo.org) — student records, teachers, classes, and attendance for the Child Care Home.

## Local run

```bash
cd D:\projects\alwasiyo-sms
copy .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo login:

- Email: `admin@alwasiyo.org`
- Password: `Partnership1990!`

## Deploy on Netlify (free)

1. Push this folder to a GitHub repository.
2. In [Netlify](https://app.netlify.com), **Add new site → Import an existing project**.
3. Choose the repo. Netlify detects Next.js from `netlify.toml`.
4. Add environment variables:
   - `AUTH_SECRET` — a long random string
   - `NEXT_PUBLIC_APP_URL` — your Netlify URL, e.g. `https://alwasiyo-sms.netlify.app`
5. Deploy. The Next.js runtime plus Netlify Blobs stores students, teachers, and accounts.

Without Blobs available, data still works in memory for that server instance.

## Auth

Sign up, sign in, sign out, forgot password, and reset password are built in. Password reset returns a link on screen (no email provider on the free plan).

## API

All data is served from Next.js route handlers under `/api`:

- `/api/auth/signup|signin|signout|me|forgot-password|reset-password`
- `/api/students` and `/api/students/:id`
- `/api/teachers` and `/api/teachers/:id`
- `/api/classes` and `/api/classes/:id`
- `/api/attendance`
- `/api/stats`
