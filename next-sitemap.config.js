/** @type {import('next-sitemap').IConfig} */
const baseUrl = 'https://www.playshap10r.org/';
const languages = ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'it', 'es', 'zh-tw', 'ru'];

module.exports = {
 siteUrl: baseUrl,
 generateRobotsTxt: true,
 sitemapSize: 7000,
 changefreq: 'daily', 
 priority: 0.7,
 exclude: ['/404'],
 additionalPaths: async (config) => {
   const paths = [];
   
   // 生成语言首页
   languages.forEach(lang => {
     paths.push({
       loc: `/${lang}`,
       priority: 1.0,
       changefreq: 'daily',
       lastmod: new Date().toISOString()
     });
   });

   // 生成游戏页面
   paths.push({
     loc: '/shap10r',
     priority: 0.9,
     changefreq: 'daily', 
     lastmod: new Date().toISOString()
   });

   languages.forEach(lang => {
     paths.push({
       loc: `/${lang}/shap10r`,
       priority: 0.9,
       changefreq: 'daily',
       lastmod: new Date().toISOString() 
     });
   });

   // 生成静态页面
   ['privacy', 'terms'].forEach(page => {
     paths.push({
       loc: `/${page}`,
       priority: 0.7,
       changefreq: 'monthly',
       lastmod: new Date().toISOString()
     });
   });

   return paths;
 },
 transform: async (config, path) => {
   console.log('Generated path:', path);
   return {
     loc: path,
     changefreq: config.changefreq,
     priority: config.priority,
     lastmod: config.lastmod ? new Date().toISOString() : undefined,
   };
 }
};