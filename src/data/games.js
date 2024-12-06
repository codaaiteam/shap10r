// src/utils/games.js
import gamesData from '@/data/games.json';
import DoubleShapr10r from '@/app/Components/DoubleShapr10r';

// 组件映射表
const GAME_COMPONENTS = {
  'DoubleShapr10r': DoubleShapr10r,
  // 在这里添加更多组件映射
};

export function getGameComponent(componentName) {
  return GAME_COMPONENTS[componentName] || null;
}

export function getAllGames(translations) {
  return Object.entries(gamesData.games).map(([id, gameData]) => ({
    id,
    title: translations?.games?.[id]?.title || gameData.title,
    image: gameData.image,
    gameUrl: gameData.gameUrl,
    component: gameData.component,
    features: [
      translations?.games?.[id]?.features?.feature1?.title || gameData.features[0],
      translations?.games?.[id]?.features?.feature2?.title || gameData.features[1],
      translations?.games?.[id]?.features?.feature3?.title || gameData.features[2],
      translations?.games?.[id]?.features?.feature4?.title || gameData.features[3]
    ].filter(Boolean)
  }));
}

export function getGameById(id, translations) {
  const gameData = gamesData.games[id];
  if (!gameData) return null;

  return {
    id,
    title: translations?.games?.[id]?.title || gameData.title,
    image: gameData.image,
    gameUrl: gameData.gameUrl,
    component: gameData.component,
    features: [
      translations?.games?.[id]?.features?.feature1?.title || gameData.features[0],
      translations?.games?.[id]?.features?.feature2?.title || gameData.features[1],
      translations?.games?.[id]?.features?.feature3?.title || gameData.features[2],
      translations?.games?.[id]?.features?.feature4?.title || gameData.features[3]
    ].filter(Boolean)
  };
}

export function getRelatedGames(currentGameId, translations, limit = 4) {
  return getAllGames(translations)
    .filter(game => game.id !== currentGameId)
    .slice(0, limit);
}