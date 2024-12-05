/** @type {import('next-sitemap').IConfig} */
const languages = ['en', 'zh', 'es'];
const baseUrl = 'https://www.playshap10r.org/';

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
    ['privacy', 'terms'].forEach(page => {
      // 为每个语言生成页面
      languages.forEach(lang => {
        paths.push({
          loc: `/${lang}/${page}`,
          priority: 0.7,
          changefreq: 'weekly',
          lastmod: new Date().toISOString()
        });
      });
    });
    
    // 3. 生成游戏页面
    languages.forEach(lang => {
      // 添加游戏主页
      paths.push({
        loc: `/${lang}/game`,
        priority: 0.9,
        changefreq: 'daily',
        lastmod: new Date().toISOString()
      });

      // 添加游戏模式页面
      ['easy', 'normal', 'hard'].forEach(mode => {
        paths.push({
          loc: `/${lang}/game/${mode}`,
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