# Next.js Game Platform

A multilingual game platform built with Next.js 13, featuring dynamic game loading, internationalization, and SEO optimization.

## Features

- Multi-language support (EN, ZH, JA, KO, DE, FR, IT, ES, RU)
- Dynamic game content loading
- Cloudflare R2 integration for asset storage
- Responsive design
- SEO optimization
- Game page with fullscreen support
- Search functionality
- Automated language translation pipeline

## Prerequisites

- Node.js 18.x or later
- Python 3.8+ (for translation script)
- pnpm (recommended) or npm

## Environment Variables

Create `.env.local` with:

```
CF_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
NEXT_PUBLIC_CDN_URL=your_cdn_url
NEXT_PUBLIC_BASE_URL=your_base_url
```

## Installation

```bash
# Install Node dependencies
pnpm install

# Install Python dependencies for translation
pip install -r requirements.txt
```

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Translation Pipeline

The `lang.py` script in `/locales` handles automated translations:

```bash
# Translate all content
python lang.py

# Translate specific game content
python lang.py game-id
```

## Project Structure

- `/app` - Next.js application routes and components
- `/components` - Reusable UI components
- `/data` - Game data and configurations
- `/locales` - Language files and translation scripts
- `/styles` - CSS modules and global styles
- `/lib` - Utility functions and API clients
- `/hooks` - Custom React hooks

## Deployment

Deploy to any platform supporting Next.js 13:

1. Set up environment variables
2. Build the project
3. Deploy the `/.next` directory

```bash
pnpm build
pnpm start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.