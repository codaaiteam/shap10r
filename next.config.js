/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  reactStrictMode: true,
  images: {
    domains: ['pub-de18dc3c90824394abf06cb24b33028d.r2.dev'], // 替换为你的 R2 域名
  },
  // 添加跨域资源配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' * blob: data: 'unsafe-inline' 'unsafe-eval';",
              "script-src 'self' * 'unsafe-inline' 'unsafe-eval';",
              "style-src 'self' * 'unsafe-inline';",
              "img-src 'self' * data: blob:;",
              "media-src 'self' * blob:;",
              "connect-src 'self' *;",
              "frame-src 'self' *;",
              "worker-src 'self' blob: *;",
              "child-src 'self' blob: *;",
              "font-src 'self' *;"
            ].join(' ')
          },
          {
            // 允许 iframe 嵌入
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://scratch.mit.edu'
          },
          {
            // 允许跨域
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization'
          }
        ],
      },
    ];
  },

  // 添加重写规则来代理 Scratch 资源
  async rewrites() {
    return [
      {
        source: '/scratch-assets/:path*',
        destination: 'https://scratch.mit.edu/:path*'
      }
    ];
  }
};

module.exports = nextConfig;