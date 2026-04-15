<template>
  <!-- 锁定界面 -->
  <div v-if="isLocked && !isUnlocked" class="lock-container">
    <div class="lock-box">
      <h1>🔐 访问验证</h1>
      <p class="lock-description">此导航站已启用访问保护</p>
      <form @submit.prevent="handleUnlock">
        <div class="form-group">
          <label for="unlock-password">请输入访问密钥:</label>
          <input
            id="unlock-password"
            type="password"
            v-model="unlockPassword"
            placeholder="请输入访问密钥"
            required
            class="form-input"
          />
        </div>
        <button type="submit" class="unlock-btn" :disabled="unlocking">
          {{ unlocking ? '验证中...' : '进入导航' }}
        </button>
      </form>
      <div v-if="unlockError" class="error-message">
        {{ unlockError }}
      </div>
    </div>
  </div>

  <!-- 正常导航界面 -->
  <div v-else class="nav-home">
    <!-- 左侧边栏 -->
    <aside class="sidebar">
      <!-- Logo区域 -->
      <div class="logo-section">
        <img src="/icons/server-cog.svg" alt="logo" class="logo" />
        <h1 class="site-title">{{ title || 'VPS 助手' }}</h1>
      </div>

      <!-- 分类导航 -->
      <nav class="category-nav">
        <h2 class="nav-title">分类导航</h2>
                <ul class="category-list">
          <li
            v-for="category in categories"
            :key="category.id"
            class="category-item"
            @click="scrollToCategory(category.id)"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
          </li>
        </ul>
      </nav>

      <!-- 左侧边栏底部信息 -->
      <div class="sidebar-footer">
        <p id="hitokoto-text" class="hitokoto">{{ hitokotoText }}</p>
      </div>
    </aside>

    <!-- 右侧主内容区 -->
    <main class="main-content">
                  <!-- 顶部搜索栏 -->
      <header class="search-header">
        <div class="search-container">
          <div class="search-engine-selector">
            <img :src="searchEngines[selectedEngine].icon" :alt="selectedEngine" class="engine-logo" />
            <select v-model="selectedEngine" class="engine-select">
              <option value="google">Google</option>
              <option value="baidu">Baidu</option>
              <option value="bing">Bing</option>
              <option value="duckduckgo">DuckDuckGo</option>
            </select>
          </div>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="searchEngines[selectedEngine].placeholder"
            class="search-input"
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- 新增：信息按钮 -->
        <div class="info-btn-wrapper" ref="infoBtnWrapper">
          <button @click.stop="toggleInfoPopover" class="header-action-btn" title="关于本站">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
          <!-- 信息浮动卡片 -->
          <transition name="popover-fade">
            <div v-if="showInfoPopover" class="info-popover">
              <ul>
                <li><strong>作者:</strong> yyzhou</li>
                <li><strong>版本号:</strong> {{ appVersion }}</li>
                <li><strong>更新日期:</strong> {{ updateDate }}</li>
              </ul>
            </div>
          </transition>
        </div>

        <!-- 新增：添加到收藏夹按钮 -->
        <button @click="addToFavorites" class="header-action-btn" title="将本站添加到收藏夹">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>

        <!-- 新增：分享按钮 -->
        <button @click="shareSite" class="header-action-btn" title="分享网站链接">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
          </svg>
        </button>

        <!-- 主题切换按钮 -->
        <button class="header-action-btn" @click="themeStore.toggleTheme" :title="themeStore.isDarkMode ? '切换到日间模式' : '切换到夜间模式'">
          <svg v-if="!themeStore.isDarkMode" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 7C10 10.866 13.134 14 17 14C18.9584 14 20.729 13.1957 21.9995 11.8995C22 11.933 22 11.9665 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.0335 2 12.067 2 12.1005 2.00049C10.8043 3.27098 10 5.04157 10 7ZM4 12C4 16.4183 7.58172 20 12 20C15.0583 20 17.7158 18.2839 19.062 15.7621C18.3945 15.9187 17.7035 16 17 16C12.0294 16 8 11.9706 8 7C8 6.29648 8.08133 5.60547 8.2379 4.938C5.71611 6.28423 4 8.9417 4 12Z"/>
          </svg>
        </button>

        <!-- GitHub图标按钮 - 修改为SVG -->
        <button @click="openGitHub" class="header-action-btn" title="查看项目源码">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </button>

        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- 移动端分类菜单 -->
        <div class="mobile-menu" :class="{ active: showMobileMenu }">
          <div class="mobile-menu-header">
            <div class="header-left">
              <h3>分类导航</h3>
            </div>
            <button class="close-btn" @click="closeMobileMenu">×</button>
          </div>
          <ul class="mobile-category-list">
            <li
              v-for="category in categories"
              :key="category.id"
              class="mobile-category-item"
              @click="scrollToCategoryMobile(category.id)"
            >
              <span class="category-icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.name }}</span>
            </li>
          </ul>
        </div>

        <!-- 移动端菜单遮罩 -->
        <div class="mobile-menu-overlay" :class="{ active: showMobileMenu }" @click="closeMobileMenu"></div>
      </header>

      <!-- 导航内容区 -->
      <div class="content-area" ref="contentArea">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <button @click="fetchCategories" class="retry-btn">重试</button>
        </div>

                <!-- 分类内容 -->
        <div v-else class="categories-container">
          <section
            v-for="category in categories"
            :key="category.id"
            class="category-section"
            :id="`category-${category.id}`"
          >
            <h2 class="category-title">
              <span class="category-icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.name }}</span>
            </h2>

            <div class="sites-grid">
              <!-- 修改开始：将 a 标签改为 div，并移除 site-icon -->
              <div
                v-for="site in category.sites"
                :key="site.id"
                class="site-card command-card"
              >
                <!-- 移除了 <div class="site-icon">...</div> -->
                <div class="site-info">
                  <h3 class="site-name">{{ site.name }}</h3>
                  <p class="site-description">{{ site.description }}</p>
                </div>
                <!-- 新增：代码块和复制按钮 -->
                <div class="command-block">
                  <pre><code>{{ site.url }}</code></pre>
                  <!-- 修改这里的 button -->
                  <button @click.stop="copyCommand(site)" class="copy-btn" :title="copiedSiteId === site.id ? '已复制!' : '复制指令'">
                    <transition name="fade" mode="out-in">
                      <div v-if="copiedSiteId === site.id" key="feedback" class="copy-feedback">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path></svg>
                        <span>已复制</span>
                      </div>
                      <svg v-else key="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </transition>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- 页面底部信息 -->
          <footer class="page-footer" hidden="true">
            <div class="footer-content">
              <div class="footer-info">
                <h3>{{ title || 'VPS 助手' }}</h3>
                <p>常用 VPS 管理命令分类整理，一键复制，高效运维</p>
              </div>

              <div class="footer-links">
                <a
                  href="https://github.com/SEU-ProactiveSecurity-Group"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="footer-link"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  开源项目
                </a>
              </div>
            </div>

            <div class="footer-bottom">
              <p>&copy; {{ new Date().getFullYear() }} 与光同程 - 由 <a href="https://github.com/SEU-ProactiveSecurity-Group" target="_blank" rel="noopener noreferrer">yyzhou</a> 用 ❤️ 制作</p>
              <p class="footer-tech">基于 Vue.js 构建 | <a href="https://github.com/SEU-ProactiveSecurity-Group" target="_blank" rel="noopener noreferrer">查看源代码</a></p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  </div>

  <transition name="fade">
    <button v-if="showBackToTop" @click="scrollToTop" class="back-to-top-btn" title="返回顶部">
      <svg t="1757578927733" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="30760" width="200" height="200"><path d="M832.7168 433.28L539.8016 79.232a33.8944 33.8944 0 0 0-56.32 0L190.592 433.28a62.5152 62.5152 0 0 0 0 72.704h144.384a64.9728 64.9728 0 0 0-2.3552 15.104v232.448a46.7712 46.7712 0 0 0 39.7824 51.456h278.4256a46.7456 46.7456 0 0 0 39.7568-51.456v-232.448a66.3296 66.3296 0 0 0-2.3296-15.104h144.384a62.5152 62.5152 0 0 0 0.0768-72.704z m-193.5104 423.168H384a51.2 51.2 0 0 0-51.2 51.2v0.768a51.2 51.2 0 0 0 51.2 51.2h255.2064a51.2 51.2 0 0 0 51.2-51.2v-0.768a51.2 51.2 0 0 0-51.2-51.2z" fill="#ffffff" p-id="30761"></path></svg>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNavigation } from '@/apis/useNavigation.js'
import { useThemeStore } from '@/stores/counter.js'
import { version as appVersion } from '../../package.json' // 导入版本号
import { date as updateDate } from '../../package.json' // 导入更新日期

// 导入搜索引擎logo图片
import googleLogo from '@/assets/goolge.png'
import baiduLogo from '@/assets/baidu.png'
import bingLogo from '@/assets/bing.png'
import duckLogo from '@/assets/duck.png'


// 使用导航API
const { categories, title, defaultSearchEngine, loading, error, fetchCategories } = useNavigation()

// 使用主题store
const themeStore = useThemeStore()

// 响应式数据
const copiedSiteId = ref(null) // <-- 新增这一行
const searchQuery = ref('') // 搜索查询
const selectedEngine = ref('bing') // 选中的搜索引擎，初始值会在组件挂载后更新
const showMobileMenu = ref(false) // 移动端菜单显示状态
const showBackToTop = ref(false);

// 新增：一言
const hitokotoText = ref('');

// 新增：信息浮动卡片
const showInfoPopover = ref(false);
const infoBtnWrapper = ref(null);

const toggleInfoPopover = () => {
  showInfoPopover.value = !showInfoPopover.value;
};

const closeInfoPopover = (event) => {
  if (infoBtnWrapper.value && !infoBtnWrapper.value.contains(event.target)) {
    showInfoPopover.value = false;
  }
};

// --- 用下面的代码块替换现有的 copyCommand 函数 ---
const copyCommand = (site) => {
  if (!site || !site.url) return;
  const textToCopy = site.url;

  const showCopySuccess = (siteId) => {
    copiedSiteId.value = siteId;
    setTimeout(() => {
      if (copiedSiteId.value === siteId) {
        copiedSiteId.value = null;
      }
    }, 1000);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showCopySuccess(site.id);
    }).catch(err => {
      console.warn('现代复制API失败，尝试后备方法:', err);
      legacyCopy(textToCopy, site.id, showCopySuccess);
    });
  } else {
    legacyCopy(textToCopy, site.id, showCopySuccess);
  }
};

const legacyCopy = (text, siteId, successCallback) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'absolute';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    successCallback(siteId);
  } catch (err) {
    console.error('后备复制方法也失败了:', err);
    alert('复制失败，请手动复制。');
  } finally {
    document.body.removeChild(textArea);
  }
};
// --- 替换结束 ---

// 新增：添加到收藏夹功能
const addToFavorites = () => {
  try {
    // 优先尝试旧版IE的addFavorite方法
    if (window.external && ('addFavorite' in window.external)) {
      window.sidebar.addPanel(document.title, window.location.href, '');
    } else {
      // 对于所有现代浏览器，回退到提示快捷键
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const shortcut = isMac ? 'Cmd/⌘ + D' : 'Ctrl + D';
      alert(`请按 ${shortcut} 将本站添加到收藏夹`);
    }
  } catch (e) {
    // 捕获可能出现的异常，并同样回退到提示
    console.error('添加到收藏夹操作失败:', e);
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcut = isMac ? 'Cmd/⌘ + D' : 'Ctrl + D';
    alert(`您的浏览器不支持自动添加，请按 ${shortcut} 手动收藏`);
  }
};

// 新增：分享网站功能
const shareSite = () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    alert('网站链接已复制到剪贴板！');
  }).catch(err => {
    console.error('复制链接失败:', err);
    alert('复制失败，请手动复制网站链接。');
  });
};


// 锁定功能相关
const isLocked = ref(false) // 是否启用锁定功能
const isUnlocked = ref(false) // 是否已解锁
const unlockPassword = ref('') // 解锁密码输入
const unlocking = ref(false) // 解锁中状态
const unlockError = ref('') // 解锁错误信息

// 移动端菜单控制
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
  // 控制body滚动
  if (showMobileMenu.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
  // 恢复body滚动
  document.body.style.overflow = '';
};

// 移动端分类滚动
const scrollToCategoryMobile = (categoryId) => {
  closeMobileMenu(); // 先关闭菜单

  // 稍微延迟一下再滚动，确保菜单关闭动画完成
  setTimeout(() => {
    scrollToCategory(categoryId);
  }, 200);
};

// 搜索引擎配置
const searchEngines = {
  google: {
    url: 'https://www.google.com/search?q=',
    icon: googleLogo,
    placeholder: 'Google (点logo切换搜索引擎'
  },
  baidu: {
    url: 'https://www.baidu.com/s?wd=',
    icon: baiduLogo,
    placeholder: '百度一下(点logo切换搜索引擎'
  },
  bing: {
    url: 'https://www.bing.com/search?q=',
    icon: bingLogo,
    placeholder: 'Bing (点logo切换搜索引擎)'
  },
  duckduckgo: {
    url: 'https://duckduckgo.com/?q=',
    icon: duckLogo,
    placeholder: 'DuckDuckGo (点logo切换搜索引擎)'
  }
}


// 自定义固定时间滚动函数
const smoothScrollTo = (container, targetTop, duration = 600) => {
  const startTop = container.scrollTop
  const distance = targetTop - startTop
  let startTime = null

  const animateScroll = (currentTime) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)

    // 使用缓动函数 (easeInOutCubic)
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    container.scrollTop = startTop + distance * ease

    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    }
  }

  requestAnimationFrame(animateScroll)
}

// 滚动到指定分类
const scrollToCategory = (categoryId) => {
  const element = document.getElementById(`category-${categoryId}`)
  const container = document.querySelector('.content-area')

  if (element && container) {
    // 检查是否为移动端
    const isMobile = window.innerWidth <= 768

    let targetTop = 0

    if (isMobile) {
      // 移动端：在 content-area 容器内滚动
      const elementOffsetTop = element.offsetTop
      const searchHeaderHeight = 80 // 固定高度，因为搜索框是fixed定位
      targetTop = elementOffsetTop - searchHeaderHeight
    } else {
      // 桌面端：在容器内滚动
      const searchHeader = document.querySelector('.search-header')
      const elementOffsetTop = element.offsetTop
      const searchHeaderHeight = searchHeader ? searchHeader.offsetHeight + 20 : 100
      targetTop = elementOffsetTop - searchHeaderHeight
    }

    // 使用固定时间滚动（600毫秒）
    smoothScrollTo(container, Math.max(0, targetTop), 600)
  }
}

// 检查是否启用锁定功能
const checkLockStatus = () => {
  const openLock = import.meta.env.VITE_OPEN_LOCK
  if (openLock && openLock.trim() !== '') {
    isLocked.value = true
    // 检查是否已经解锁过
    const savedUnlock = localStorage.getItem('nav_unlocked')
    if (savedUnlock === 'true') {
      isUnlocked.value = true
    }
  } else {
    isLocked.value = false
    isUnlocked.value = true // 如果没有启用锁定，默认为解锁状态
  }
}

// 处理解锁
const handleUnlock = async () => {
  unlocking.value = true
  unlockError.value = ''

    try {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

    if (!adminPassword) {
      throw new Error('访问密钥未配置')
    }

    if (unlockPassword.value === adminPassword) {
      isUnlocked.value = true
      localStorage.setItem('nav_unlocked', 'true')
      unlockPassword.value = ''
      console.log('导航站解锁成功')
    } else {
      throw new Error('访问密钥错误，请重新输入')
    }
  } catch (error) {
    unlockError.value = error.message
  } finally {
    unlocking.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  if (!searchQuery.value.trim()) return

  const engine = searchEngines[selectedEngine.value]
  const url = engine.url + encodeURIComponent(searchQuery.value)
  window.open(url, '_blank')
}

// 处理图片加载错误
const handleImageError = (event) => {
  // 设置默认的 favicon.ico 作为 fallback 图片
  event.target.src = '/favicon.ico'
  event.target.onerror = null // 防止无限循环
}

// 打开GitHub项目页面
const openGitHub = () => {
  window.open('https://github.com/SEU-ProactiveSecurity-Group', '_blank')
}

// 处理滚动事件，控制返回顶部按钮显示
const handleScroll = (event) => {
  showBackToTop.value = event.target.scrollTop > 200; // 当页面向下滚动超过200px时显示按钮
};

// 返回顶部
const scrollToTop = () => {
  const container = document.querySelector('.content-area');
  if (container) {
    // 使用已有的平滑滚动函数
    smoothScrollTo(container, 0, 600);
  }
};

// 组件挂载时获取数据
onMounted(async () => {
  checkLockStatus() // 检查锁定状态
  await fetchCategories()
  // 设置默认搜索引擎
  selectedEngine.value = defaultSearchEngine.value

  const container = document.querySelector('.content-area');
  if (container) {
    container.addEventListener('scroll', handleScroll);
  }

  // 新增：点击外部关闭信息卡片
  window.addEventListener('click', closeInfoPopover);

  // 获取一言
  try {
    const response = await fetch('https://v1.hitokoto.cn');
    const data = await response.json();
    hitokotoText.value = data.hitokoto;
  } catch (error) {
    console.error('获取一言失败:', error);
    hitokotoText.value = '与光同程，一路前行。'; // 失败时的默认文本
  }
})

// 组件卸载时清理样式
onUnmounted(() => {
  // 确保卸载时恢复body滚动
  document.body.style.overflow = ''
  const container = document.querySelector('.content-area');
  if (container) {
    container.removeEventListener('scroll', handleScroll);
  }
  // 新增：移除事件监听
  window.removeEventListener('click', closeInfoPopover);
})
</script>

<style scoped>
/* 锁定界面样式 */
.lock-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c3e50;
  padding: 20px;
  z-index: 9999;
}

.lock-box {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.lock-box h1 {
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

.lock-description {
  color: #718096;
  margin-bottom: 30px;
  font-size: 16px;
}

.lock-box .form-group {
  margin-bottom: 20px;
  text-align: left;
}

.lock-box .form-group label {
  display: block;
  margin-bottom: 8px;
  color: #4a5568;
  font-weight: 500;
  font-size: 14px;
}

.lock-box .form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #fff;
}

.lock-box .form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.unlock-btn {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.unlock-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.unlock-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.lock-box .error-message {
  margin-top: 15px;
  padding: 12px;
  background: #fed7d7;
  color: #c53030;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid #feb2b2;
}

.nav-home {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 左侧边栏样式 */
.sidebar {
  width: 280px;
  background-color: #2c3e50;
  color: white;
  padding: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  height: 100vh;
  overflow: hidden;
  flex-shrink: 0;
}

.logo-section {
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-top: 13px;
  padding-bottom: 13px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  width: 55px;
  height: 55px;
  border-radius: 12px;
  margin-right: 15px;
}

.site-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: white;
}

.category-nav {
  padding: 20px 0;
  height: calc(100vh - 180px); /* 为底部留出空间 */
  overflow-y: auto;
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 20px 15px;
  color: #bdc3c7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.category-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: inset 4px 0 0 #3498db;
}

.category-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 20px;
  text-align: center;
}

.category-name {
  font-size: 15px;
  font-weight: 500;
}

/* 左侧边栏底部 */
.sidebar-footer {
  padding: 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
  text-align: center; /* 让内容居中 */
}

.hitokoto {
  margin: 0;
  font-size: 13px;
  color: #bdc3c7;
  font-weight: 500;
  line-height: 1.5;
  font-style: italic;
}

/* 移除不再需要的样式 */
/*
.github-link { ... }
.github-link:hover { ... }
.github-link svg { ... }
.github-link:hover svg { ... }
*/

/* 右侧主内容区样式 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.search-header {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
}

.search-container {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex: 1;
}

/* 新增：信息按钮包裹器 */
.info-btn-wrapper {
  position: relative;
}

/* 新增：信息浮动卡片样式 */
.info-popover {
  position: absolute;
  top: calc(100% + 10px);
  right: -70px;
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  z-index: 101;
  width: max-content;
}

.info-popover ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-popover li {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
}

.info-popover li strong {
  color: #2d3748;
  margin-right: 8px;
}

.dark .info-popover {
  background: #374151;
  border-color: #4b5563;
}

.dark .info-popover li {
  color: #cbd5e1;
}

.dark .info-popover li strong {
  color: #e2e8f0;
}

/* 新增：浮动卡片过渡动画 */
.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.search-engine-selector {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  transition: background-color 0.2s ease;
}

.search-engine-selector:hover {
  background: #e9ecef;
}

.engine-logo {
  width: 24px;
  height: 24px;
  margin: 8px;
  object-fit: contain;
  pointer-events: none;
  border-radius: 4px;
}

.engine-select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  border: none;
  outline: none;
  background: transparent;
}

.search-input {
  flex: 1;
  border: none;
  padding: 12px 16px;
  font-size: 16px;
  outline: none;
  background: white;
}

.search-input::placeholder {
  color: #95a5a6;
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: #2c3e50;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.mobile-menu-btn:hover {
  background: #f8f9fa;
}

/* 移动端菜单 */
.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 240px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  transition: right 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background: #2c3e50;
  color: white;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-menu-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-github-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  opacity: 0.8;
}

.header-github-icon:hover {
  opacity: 1;
  transform: scale(1.1);
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 160px; /* 增加底部内边距确保最后一项完全可见 */
}

.mobile-category-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f8f9fa;
}

.mobile-category-item:hover {
  background: #f8f9fa;
}

.mobile-category-item .category-icon {
  font-size: 20px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.mobile-category-item .category-name {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
}



/* 移动端菜单遮罩 */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.mobile-menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* 内容区域样式 */
.content-area {
  flex: 1;
  padding: 30px;
  padding-bottom: 400px;
  overflow-y: auto;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #7f8c8d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ecf0f1;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.categories-container {
  max-width: 1200px;
  margin: 0 auto;
}

.category-section {
  margin-bottom: 50px;
}

.category-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 25px;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

.category-title .category-icon {
  font-size: 32px;
  margin-right: 16px;
}

.category-title .category-name {
  margin-left: 10px;
  font-size: 26px;
}

.sites-grid {
  display: grid;
  /* 修改：实现单列全宽布局 */
  grid-template-columns: 1fr;
  gap: 20px;
}

.site-card {
  display: flex;
  /* 修改：允许多行内容，并移除 site-icon 相关的对齐 */
  flex-direction: column;
  align-items: flex-start;
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  position: relative;
  overflow: hidden;
}

.site-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 移除了 .site-icon 相关的样式，因为元素已被删除 */

.site-info {
  flex: 1;
  position: relative;
  z-index: 1;
  width: 100%; /* 确保信息部分占满宽度 */
}

.site-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.site-description {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.4;
  white-space: normal; /* 允许描述换行 */
  overflow: visible;
  text-overflow: clip;
}

/* 新增：代码块和复制按钮的样式 */
.command-block {
  position: relative;
  width: 100%;
  margin-top: 15px;
  background-color: #2d3748; /* 深色背景 */
  border-radius: 8px;
  overflow: hidden;
}

.dark .command-block {
  background-color: #1a202c; /* 暗色模式下更深的背景 */
}

.command-block pre {
  margin: 0;
  padding: 12px 16px;
  color: #e2e8f0; /* 亮色文字 */
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 14px;
  white-space: pre-wrap; /* 允许代码换行 */
  word-break: break-all;
}

.command-block .copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border: none;
  border-radius: 6px;
  /* 修改 padding 和尺寸以适应新内容 */
  padding: 4px 8px;
  min-width: 32px;
  min-height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.command-block:hover .copy-btn {
  opacity: 1;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 新增：复制成功后的反馈样式 */
.copy-feedback {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #4ade80; /* 鲜艳的绿色 */
}

.copy-feedback svg {
  flex-shrink: 0;
}

/* 确保暗色模式下按钮样式正确 */
.dark .command-block .copy-btn {
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
}

.dark .command-block:hover .copy-btn {
  opacity: 1;
}

.dark .copy-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 页面底部信息 */
.page-footer {
  margin-top: 60px;
  padding: 40px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border-top: 3px solid #3498db;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  gap: 30px;
}

.footer-info h3 {
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.footer-info p {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

.footer-links {
  display: flex;
  gap: 15px;
}

.footer-link {
  display: flex;
  align-items: center;
  color: #3498db;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  background: white;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.footer-link:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.footer-link svg {
  margin-right: 6px;
  transition: transform 0.3s ease;
}

.footer-link:hover svg {
  transform: scale(1.1);
}

.footer-bottom {
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
  text-align: center;
}

.footer-bottom p {
  color: #7f8c8d;
  font-size: 13px;
  margin: 5px 0;
  line-height: 1.4;
}

.footer-bottom a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.footer-bottom a:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* 主题切换按钮样式 - 将被 .header-action-btn 替代，可以删除 */
/*
.theme-toggle-btn {
  ...
}
.theme-toggle-btn:hover {
  ...
}
*/

/* 新增：通用头部操作按钮样式 */
.header-action-btn {
  background: none;
  border: none;
  color: #2c3e50;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%; /* 统一为圆形 */
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px; /* 统一使用左边距 */
}

.header-action-btn:hover {
  background: #f8f9fa;
  transform: scale(1.1);
}

/* 新增GitHub按钮暗色模式样式 - 将被 .dark .header-action-btn 替代，可以删除 */
/*
.dark .github-btn {
  ...
}
.dark .github-btn:hover {
  ...
}
*/

/* 暗色模式样式 */
.dark .nav-home {
  background-color: #1a1a1a;
}

.dark .sidebar {
  background-color: #1e293b;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
}

.dark .search-header {
  background: #1e293b;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* 暗色模式下的通用头部按钮 */
.dark .header-action-btn {
  color: #e2e8f0;
}

.dark .header-action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark .mobile-menu-btn {
  color: #e2e8f0;
}

.dark .mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark .search-container {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.dark .search-engine-selector {
  background: #374151;
  border-right: 1px solid #4b5563;
}

.dark .search-engine-selector:hover {
  background: #4b5563;
}

.dark .search-input {
  background: #374151;
  color: #e2e8f0;
  border: none;
}

.dark .search-input::placeholder {
  color: #9ca3af;
}

.dark .engine-select {
  background: #374151;
  color: #e2e8f0;
}

.dark .engine-select option {
  background: #374151;
  color: #e2e8f0;
}

.dark .content-area {
  background: #1a1a1a;
}

.dark .site-card {
  background: #374151;
  border: 1px solid #4b5563;
  color: #e2e8f0;
}

.dark .site-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.dark .site-card::before {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15));
}

.dark .site-name {
  color: #e2e8f0;
}

.dark .site-description {
  color: #9ca3af;
}

.dark .site-icon {
  background: #4b5563;
}

.dark .category-title {
  color: #e2e8f0;
}

.dark .mobile-menu {
  background: #1e293b;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
}

.dark .mobile-category-item {
  border-bottom: 1px solid #374151;
}

.dark .mobile-category-item:hover {
  background: #374151;
}

.dark .mobile-category-item .category-name {
  color: #e2e8f0;
}

.dark .page-footer {
  background: linear-gradient(135deg, #1e293b 0%, #374151 100%);
  border-top: 3px solid #3b82f6;
}

.dark .footer-info h3 {
  color: #e2e8f0;
}

.dark .footer-info p {
  color: #9ca3af;
}

.dark .footer-link {
  background: #374151;
  border: 1px solid #4b5563;
  color: #3b82f6;
}

.dark .footer-link:hover {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.dark .footer-bottom p {
  color: #9ca3af;
}

.dark .footer-bottom a {
  color: #3b82f6;
}

.dark .footer-bottom a:hover {
  color: #60a5fa;
}

.dark .loading,
.dark .error {
  color: #9ca3af;
}

.dark .retry-btn {
  background: #3b82f6;
  color: white;
}

.dark .retry-btn:hover {
  background: #2563eb;
}

/* 锁定界面暗色模式 */
.dark .lock-container {
  background: #0f172a;
}

.dark .lock-box {
  background: #1e293b;
  color: #e2e8f0;
}

.dark .lock-box h1 {
  color: #e2e8f0;
}

.dark .lock-description {
  color: #94a3b8;
}

.dark .lock-box .form-group label {
  color: #cbd5e1;
}

.dark .lock-box .form-input {
  background: #374151;
  border: 2px solid #4b5563;
  color: #e2e8f0;
}

.dark .lock-box .form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark .unlock-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
}

.dark .unlock-btn:hover:not(:disabled) {
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

/* 新增：暗色模式下的统计样式 */
.dark .site-stats p {
  color: #94a3b8;
}

/* 返回顶部按钮样式 */

.back-to-top-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 1000;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.back-to-top-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.back-to-top-btn svg {
  width: 30px;
  height: 30px;
}

/* 暗色模式下的返回顶部按钮 */
.dark .back-to-top-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .back-to-top-btn:hover {
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

/* 按钮出现/消失的过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-home {
    flex-direction: column;
    height: 100vh;
    height: 100svh; /* 使用动态视口高度 */
    overflow: hidden;
  }

  .sidebar {
    display: none; /* 在移动端隐藏左侧边栏 */
  }

  .main-content {
    flex: 1;
    height: 100vh;
    height: 100svh; /* 使用动态视口高度，更准确 */
    margin-left: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .search-header {
    padding: 15px 20px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 500;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .content-area {
    flex: 1;
    padding: 20px 15px;
    padding-top: 100px; /* 为固定的搜索框留出空间 */
    padding-bottom: 300px; /* 增加底部padding确保内容可以完全滚动 */
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* iOS平滑滚动 */
  }

  .mobile-menu-btn {
    display: block; /* 在移动端显示菜单按钮 */
    flex-shrink: 0;
  }

  .sites-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .site-card {
    padding: 12px;
    flex-direction: column;
    text-align: center;
  }

  .site-card .site-icon {
    margin-right: 0;
    margin-bottom: 8px;
  }

  .site-card .site-name {
    font-size: 15px;
  }

  .site-card .site-description {
    font-size: 12px;
  }

  .category-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .category-title .category-icon {
    font-size: 28px;
    margin-right: 12px;
  }

  .category-title .category-name {
    font-size: 22px;
  }

  /* 移动端页面底部 */
  .page-footer {
    margin-top: 40px;
    padding: 30px 20px;
  }

  .footer-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .footer-links {
    justify-content: center;
  }

  .footer-bottom {
    padding-top: 15px;
  }

  .footer-bottom p {
    font-size: 12px;
  }
}
</style>
