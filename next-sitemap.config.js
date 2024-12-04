/** @type {import('next-sitemap').IConfig} */
const languages = ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'it', 'es','zh-tw','ru'];
const baseUrl = 'https://www.playsprunkiphrase4.com';

// 直接从 games.json 获取游戏 ID
const games = require('./src/data/games.json').games;
const gameIds = Object.keys(games); // 这样会得到所有的 game id

module.exports = {
  siteUrl: baseUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/404'],
  additionalPaths: async (config) => {
    const paths = [];
    
    // 1. 为每个语言生成首页
    languages.forEach(lang => {
      paths.push({
        loc: `/${lang}`,
        priority: 1.0,
        changefreq: 'daily',
        lastmod: new Date().toISOString()
      });
    });
    
    // 2. 生成 footer 页面
    ['privacy', 'terms', 'license'].forEach(page => {
      paths.push({
        loc: `/${page}`,
        priority: 0.7,
        changefreq: 'weekly',
        lastmod: new Date().toISOString()
      });
    });
    
    // 3. 为每个语言生成所有游戏页面
    languages.forEach(lang => {
      // 使用从 games.json 提取的 gameIds
      gameIds.forEach(gameId => {
        paths.push({
          loc: `/${lang}/game/${gameId}`, // 使用实际的 gameId
          priority: 0.8,
          changefreq: 'daily',
          lastmod: new Date().toISOString()
        });
      });
    });

    return paths;
  },
  // 添加调试输出
  transform: async (config, path) => {
    // 打印生成的路径以便调试
    console.log('Generated path:', path);
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.lastmod ? new Date().toISOString() : undefined,
    };
  }
};