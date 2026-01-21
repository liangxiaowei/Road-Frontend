// Popup Script

const statusEl = document.getElementById('status');
const extractBtn = document.getElementById('extractBtn');

// 更新状态显示
function updateStatus(message, type = 'info') {
  statusEl.className = `status ${type}`;
  statusEl.textContent = message;
}

// 检查当前页面是否是关注列表页
function isFollowingPage() {
  const url = new URL(window.location.href);
  return url.hostname === 'x.com' || url.hostname === 'twitter.com';
}

// 获取当前标签页
function getCurrentTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

// 下载 JSON 文件
function downloadJson(data, filename) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: true
  });
}

// 提取按钮点击事件
extractBtn.addEventListener('click', async () => {
  const tab = await getCurrentTab();

  // 检查是否在 x.com 或 twitter.com
  if (!tab.url?.includes('x.com/') && !tab.url?.includes('twitter.com/')) {
    updateStatus('请在 x.com 的关注列表页使用', 'error');
    return;
  }

  // 检查是否是关注列表页
  if (!tab.url?.includes('/following')) {
    updateStatus('请在关注列表页面使用 (例如: x.com/xxx/following)', 'error');
    return;
  }

  extractBtn.disabled = true;
  updateStatus('正在提取数据，请稍候...', 'info');

  try {
    // 向 content script 发送消息
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractFollowing' });

    if (response?.success) {
      const users = response.users;

      if (users.length === 0) {
        updateStatus('未找到关注列表数据，请尝试滚动页面后再试', 'error');
        extractBtn.disabled = false;
        return;
      }

      // 生成文件名
      const urlMatch = tab.url.match(/\/([^\/]+)\/following/);
      const username = urlMatch ? urlMatch[1] : 'following';
      const date = new Date().toISOString().slice(0, 10);
      const filename = `${username}_following_${date}.json`;

      // 下载文件
      downloadJson(users, filename);

      updateStatus(`成功提取 ${users.length} 个关注用户，文件已下载`, 'success');
    } else {
      updateStatus('提取失败: ' + (response?.error || '未知错误'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    updateStatus('提取失败，请刷新页面后重试', 'error');
  } finally {
    setTimeout(() => {
      extractBtn.disabled = false;
    }, 2000);
  }
});

// 初始化时检查页面
(async () => {
  const tab = await getCurrentTab();
  if (tab.url?.includes('/following')) {
    updateStatus('点击按钮提取关注列表', 'info');
  } else {
    updateStatus('请在关注列表页面使用', 'info');
  }
})();
