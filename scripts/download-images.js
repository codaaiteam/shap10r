const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { promisify } = require('util');

const GAMES = [
  {
    id: 'sprunki-mustard',
    image: '/assets/img/games/sprunki-mustard/logo-square.png'
  },
  {
    id: 'sprunki-sprinkle',
    image: '/assets/img/games/sprunki-sprinkle/logo-square.jpg'
  },
  {
    id: 'sprunki-retake',
    image: '/assets/img/games/sprunki-retake/logo-square.jpg'
  },
  {
    id: 'sprunki-phase-6',
    image: '/assets/img/games/sprunki-phase-6/logo-square.jpg'
  },
  {
    id: 'sprunki-remastered',
    image: '/assets/img/games/sprunki-remastered/logo-square.png'
  },
  {
    id: 'incredibox-sprunki-dandys-world-mod',
    image: '/assets/img/games/incredibox-sprunki-dandys-world-mod/logo.png'
  },
  {
    id: 'sprunki-but-i-ruined-it',
    image: '/assets/img/games/sprunki-but-i-ruined-it/logo.png'
  },
  {
    id: 'sprunki-with-fan-character',
    image: '/assets/img/games/sprunki-with-fan-character/logo.png'
  },
  {
    id: 'sprunked',
    image: '/assets/img/games/sprunked/logo.png'
  },
  {
    id: 'sprunki-infected',
    image: '/assets/img/games/sprunki-infected/logo.png'
  },
  {
    id: 'incredibox-sprunki-x-rejecz',
    image: '/assets/img/games/incredibox-sprunki-x-rejecz/logo.png'
  },
  {
    id: 'sprunki-but-alpha',
    image: '/assets/img/games/sprunki-but-alpha/logo.png'
  },
  {
    id: 'sprunki-tadc',
    image: '/assets/img/games/sprunki-tadc/logo.png'
  },
  {
    id: 'sprunki-but-something-is-wrong',
    image: '/assets/img/games/sprunki-but-something-is-wrong/logo.png'
  },
  {
    id: 'sprunki-remix',
    image: '/assets/img/games/sprunki-remix/logo.png'
  },
  {
    id: 'sprunki-rainbow-friends',
    image: '/assets/img/games/sprunki-rainbow-friends/logo.png'
  },
  {
    id: 'super-sprunki-brasil',
    image: '/assets/img/games/super-sprunki-brasil/logo.png'
  },
  {
    id: 'sprunki-but-characters-are-cube-from-gd',
    image: '/assets/img/games/sprunki-but-characters-are-cube-from-gd/logo.png'
  },
  {
    id: 'baldunki',
    image: '/assets/img/games/baldunki/logo.png'
  },
  {
    id: 'interactive-simon',
    image: '/assets/img/games/interactive-simon/logo.png'
  },
  {
    id: 'quiz-trivia-guess-the-animal-music-flags',
    image: '/assets/img/games/quiz-trivia-guess-the-animal-music-flags/logo.png'
  },
  {
    id: 'sprunki-but-its-random-things',
    image: '/assets/img/games/sprunki-but-its-random-things/logo.png'
  },
  {
    id: 'sprunki-funny',
    image: '/assets/img/games/sprunki-funny/logo.png'
  },
  {
    id: 'incredibox-sprunkle',
    image: '/assets/img/games/incredibox-sprunkle/logo.png'
  },
  {
    id: 'halloween-helix',
    image: '/assets/img/games/halloween-helix/logo.png'
  },
  {
    id: 'wizards-arcadia',
    image: '/assets/img/games/wizards-arcadia/logo.png'
  },
  {
    id: 'incredibox-fruity',
    image: '/assets/img/games/incredibox-fruity/logo.png'
  },
  {
    id: 'sweet-halloween',
    image: '/assets/img/games/sweet-halloween/logo.png'
  },
  {
    id: 'death-jumper',
    image: '/assets/img/games/death-jumper/logo.png'
  },
  {
    id: 'incredibox-stranger-things',
    image: '/assets/img/games/incredibox-stranger-things/logo.png'
  },
  {
    id: 'boxes-fright-night',
    image: '/assets/img/games/boxes-fright-night/logo.png'
  },
  {
    id: 'incredibox-express-simulator',
    image: '/assets/img/games/incredibox-express-simulator/logo.png'
  },
  {
    id: 'sprunki-phase-5',
    image: '/assets/img/games/sprunki-phase-5/logo-square.jpg'
  },
  {
    id: 'sprunki-phase-4',
    image: '/assets/img/games/sprunki-phase-4/logo.jpg'
  },
  {
    id: 'sprunki-phase-3',
    image: '/assets/img/games/sprunki-phase-3/logo.png'
  },
  {
    id: 'jack-blast',
    image: '/assets/img/games/jack-blast/logo.png'
  }
];
const BASE_URL = 'https://sprunki-incredibox.org';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'assets', 'games');

// 添加缺失的 ensureDirectoryExists 函数
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// 添加进度显示
function showProgress(current, total) {
  const percentage = Math.round((current / total) * 100);
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(
    `Progress: ${current}/${total} (${percentage}%) ${
      '█'.repeat(percentage / 2) + '░'.repeat(50 - percentage / 2)
    }`
  );
}

async function downloadImage(url, outputPath, retries = 3) {
  while (retries > 0) {
    try {
      const response = await new Promise((resolve, reject) => {
        https.get(url, resolve).on('error', reject);
      });

      if (response.statusCode !== 200) {
        throw new Error(`HTTP ${response.statusCode}`);
      }

      const data = [];
      for await (const chunk of response) {
        data.push(chunk);
      }

      const buffer = Buffer.concat(data);
      await fs.writeFile(outputPath, buffer);
      return true;
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

async function verifyImage(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size > 0;
  } catch {
    return false;
  }
}

async function downloadAll() {
  await ensureDirectoryExists(OUTPUT_DIR);
  
  console.log('Starting downloads...\n');
  
  const total = GAMES.length;
  const results = {
    success: 0,
    failed: 0,
    skipped: 0
  };
  
  for (let i = 0; i < GAMES.length; i++) {
    const game = GAMES[i];
    const imageUrl = `${BASE_URL}${game.image}`;
    const outputPath = path.join(OUTPUT_DIR, game.id, path.basename(game.image));
    
    showProgress(i + 1, total);
    
    try {
      // 检查文件是否已存在且有效
      if (await verifyImage(outputPath)) {
        results.skipped++;
        continue;
      }
      
      await ensureDirectoryExists(path.dirname(outputPath));
      await downloadImage(imageUrl, outputPath);
      results.success++;
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      results.failed++;
      console.error(`\n❌ Failed: ${game.id} - ${error.message}`);
    }
  }
  
  console.log('\n\nDownload Summary:');
  console.log('✅ Successfully downloaded:', results.success);
  console.log('⏭️  Skipped (already exists):', results.skipped);
  console.log('❌ Failed:', results.failed);
}

// 添加错误处理和清理功能
process.on('SIGINT', async () => {
  console.log('\n\nDownload interrupted. Cleaning up...');
  process.exit(1);
});

downloadAll().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});