# Koikoi Web App

This app is the interface provided to both users and admin.

## Starting

After install dependencies with `yarn dev`, you can then run `yarn dev` to start a server.
The main entrypoints are as follows:

- `/`: The entry of whole app for users
- `/api`: The api entry for the app
  - `/api/gokou`: The api entry for admin panel
- `/gokou`: The entry of admin panel for admins. For security concerns, it is named `gokou` instead of `admin`.

To access admin panel, use the credential as follows:

- Username: `松に鶴`
- Password: `4T]!W]Ylos#v+QfT7Yk4Y~nj_3WPEM.7`

## Development

This app uses:

- [Next.js App Router](https://nextjs.org/docs/app)
- [TailwindCSS](https://tailwindcss.com/docs/)
- [Iron Session](https://github.com/vvo/iron-session)
- [Prisma](https://www.prisma.io/docs/orm/prisma-client)
- [Next Admin](https://next-admin-docs.vercel.app/docs/getting-started)

You can refer to these documents for developement instructions, therefore we skip reviewing them here.

### Development Purpose Pages

In development environment, following entrypoints are also provided for development.

- `/swagger`: The swagger document for testing public apis
- `/demo`: The demo pages for checking server actions

Be aware that these pages are hidden in production environment (i.e. after `yarn build`).

### API Documenting

When creating/modifying apis, please ensure you also write proper comments. Refer to [Next-Swagger-Doc](https://github.com/jellydn/next-swagger-doc?tab=readme-ov-file#4-add-swagger-comment-to-api-route) and [Swagger Docs](https://swagger.io/docs/specification/basic-structure/) for writing instructions.

### Admin Page

Admin panel is automatically updated according to scheme when running `prisma generate` (also when running `prisma migrate dev`).
If you're creating admin page, please refer to [Next Admin Document](https://next-admin-docs.vercel.app/docs/code-snippets).

## Deploy

You can overide environment variables, check `.env` to see what variables are used.
`.env` is committed as a fallback config, please provide it via shell instead of modifying it.
