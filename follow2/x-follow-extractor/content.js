// X 关注列表提取器 - Content Script

// 等待页面完全加载
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      resolve(document.querySelector(selector));
      return;
    }
    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

// 滚动加载所有内容，同时收集数据
async function scrollLoadAll() {
  let lastCount = 0;
  let stableCount = 0;
  const maxScroll = 100; // 最多滚动次数
  const collectedUsers = [];
  const processedIds = new Set();

  console.log('开始滚动加载...');

  for (let i = 0; i < maxScroll; i++) {
    // 滚动到底部
    window.scrollTo(0, document.body.scrollHeight);

    // 等待新内容加载
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 循环检查头像是否都有
    const maxAvatarWait = 60; // 最多等60秒
    for (let waitTime = 0; waitTime < maxAvatarWait; waitTime++) {
      const userCards = document.querySelectorAll('[data-testid="UserCell"]');
      const currentCount = userCards.length;

      // 检查所有头像是否都有值
      let allAvatarsLoaded = true;
      const missingAvatarHandles = [];

      userCards.forEach(card => {
        const avatar = card.querySelector('img');
        const avatarUrl = avatar?.dataset?.src || avatar?.src || '';
        if (!avatarUrl) {
          allAvatarsLoaded = false;
          const handleElement = card.querySelector('a[role="link"] span');
          const handle = handleElement?.textContent?.trim() || '';
          if (handle) missingAvatarHandles.push(handle);
        }
      });

      if (allAvatarsLoaded) {
        console.log(`滚动 ${i + 1}: 所有头像已加载，开始收集 (${currentCount} 个用户)`);
        break;
      } else {
        console.log(`滚动 ${i + 1}: 等待头像加载... (${waitTime}s) 缺失: ${missingAvatarHandles.length} 个`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // 滚动时获取当前页所有用户卡片
    const userCards = document.querySelectorAll('[data-testid="UserCell"]');
    const currentCount = userCards.length;

    // 遍历当前页的所有卡片，提取并收集
    userCards.forEach(card => {
      try {
        const avatar = card.querySelector('img');
        const avatarUrl = avatar?.dataset?.src || avatar?.src || '';

        const linkElement = card.querySelector('a[href*="/"]');
        const profileUrl = linkElement?.href || '';

        const handleElement = card.querySelector('a[role="link"] span');
        const handle = handleElement?.textContent?.trim() || '';

        const userId = handle || profileUrl;

        if (userId && !processedIds.has(userId)) {
          processedIds.add(userId);

          // 获取显示名称
          const nameElements = card.querySelectorAll('span');
          let displayName = '';
          for (let j = 0; j < nameElements.length; j++) {
            const text = nameElements[j].textContent?.trim();
            if (text && !text.startsWith('@') && text.length > 0 && text.length < 100) {
              if (!['关注', 'Following', '正在关注', 'Follow'].includes(text)) {
                displayName = text;
                break;
              }
            }
          }

          collectedUsers.push({
            avatar: avatarUrl,
            handle: handle.replace('@', ''),
            displayName: displayName,
            profileUrl: profileUrl
          });
          console.log(`  收集: ${handle} (头像: ${avatarUrl ? '有' : '无'})`);
        }
      } catch (e) {
        console.error('Error parsing user card:', e);
      }
    });

    // 检查是否加载完成
    if (currentCount === lastCount) {
      stableCount++;
      if (stableCount >= 5) {
        console.log('加载完成');
        break; // 连续5次数量不变，认为已加载完
      }
    } else {
      stableCount = 0;
    }
    lastCount = currentCount;
  }

  console.log(`滚动结束，共收集 ${collectedUsers.length} 个用户`);

  // 统计头像为空的用户
  const emptyAvatarUsers = collectedUsers.filter(u => !u.avatar);
  if (emptyAvatarUsers.length > 0) {
    console.warn(`⚠️ 有 ${emptyAvatarUsers.length} 个用户头像为空:`);
    emptyAvatarUsers.forEach(u => console.warn(`  - ${u.handle}`));
  }

  return collectedUsers;
}

// 提取用户信息
function extractFollowingList() {
  const users = [];
  const processedIds = new Set();

  // X 的用户卡片选择器
  const userCards = document.querySelectorAll('[data-testid="UserCell"]');

  userCards.forEach(card => {
    try {
      // 获取头像 - 优先 data-src，其次 src
      const avatar = card.querySelector('img');
      const avatarUrl = avatar?.dataset?.src || avatar?.src || '';

      // 获取用户名 (@username)
      const handleElement = card.querySelector('a[role="link"] span');
      const handle = handleElement?.textContent?.trim() || '';

      // 获取显示名称
      const nameElements = card.querySelectorAll('span');
      let displayName = '';
      for (let i = 0; i < nameElements.length; i++) {
        const text = nameElements[i].textContent?.trim();
        if (text && !text.startsWith('@') && text.length > 0 && text.length < 100) {
          // 排除一些常见的非用户名文本
          if (!['关注', 'Following', '正在关注', 'Follow'].includes(text)) {
            displayName = text;
            break;
          }
        }
      }

      // 获取主页链接
      const linkElement = card.querySelector('a[href*="/"]');
      const profileUrl = linkElement?.href || '';
      const userId = handle || profileUrl;

      if (userId && !processedIds.has(userId)) {
        processedIds.add(userId);
        users.push({
          avatar: avatarUrl,
          handle: handle.replace('@', ''),
          displayName: displayName,
          profileUrl: profileUrl
        });
      }
    } catch (e) {
      console.error('Error parsing user card:', e);
    }
  });

  return users;
}

// 获取当前页面对应的用户名
function getCurrentUsername() {
  const urlMatch = window.location.pathname.match(/^\/([^\/]+)\/following/);
  return urlMatch ? urlMatch[1] : 'unknown';
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractFollowing') {
    (async () => {
      try {
        // 滚动加载并收集数据
        const users = await scrollLoadAll();
        sendResponse({ success: true, users: users });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true; // 保持消息通道开启
  }
});

console.log('X 关注列表提取器已加载');
