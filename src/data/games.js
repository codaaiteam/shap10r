// src/utils/games.js
import gamesData from '@/data/games.json';
import SingleShap10r from '@/app/Components/SingleShap10r';
import DoubleShapr10r from '@/app/Components/DoubleShapr10r';
import QuadShap10r from '@/app/Components/QuadShap10r';
import OctoShap10r from '@/app/Components/OctoShap10r';

// 组件映射表
const GAME_COMPONENTS = {
  'SingleShap10r': SingleShap10r,
  'DoubleShapr10r': DoubleShapr10r,
  'QuadShap10r': QuadShap10r,
  'OctoShap10r': OctoShap10r,
  // 在这里添加更多组件映射
};

export function getGameComponent(componentName) {
  switch (componentName) {
    case 'SingleShap10r':
      return SingleShap10r;
    case 'DoubleShapr10r':
      return DoubleShapr10r;
    case 'QuadShap10r':
      return QuadShap10r;
    case 'OctoShap10r':
      return OctoShap10r;
    default:
      return GAME_COMPONENTS[componentName] || null;
  }
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