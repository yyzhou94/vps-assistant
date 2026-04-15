# 🖥️ VPS 助手 (VPS Assistant)

> 一个简洁实用的 VPS 命令导航站，分类整理常用运维命令，一键复制，高效运维

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.5.17-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?logo=vite)](https://vitejs.dev/)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com/)

## 🛠️ 更新记录
- 2026-04-15 转型为 VPS 命令导航站，新增 8 类 40+ 条常用命令
- 2026-04-15 优化命令展示样式，使用等宽字体显示命令
- 2026-04-15 后台管理界面适配命令编辑功能
- 2025-08-11 增加夜间模式，增加默认搜索引擎设置功能
- 2025-07-30 修复 item 展示问题，增加环境变量 VITE_OPEN_LOCK，配置首页也需验证密码
- 2025-07-22 增加站点拖拽排序，优化 icon 获取
- 2025-07-17 增加网站名称修改，站点 logo，修改调整手机端排版
- 2025-07-16 修复 admin 管理后台编辑相关问题，优化编辑逻辑
- 2025-07-15 完善 logo 自动获取流程

## 效果预览
![](preview.png)

## ✨ 特性

- 🎨 **现代化设计** - 简洁美观的界面，支持响应式布局
- 📱 **多设备适配** - 完美支持桌面端、平板和移动端
- 🔥 **命令分类** - 8 大类 VPS 管理命令，覆盖常用运维场景
- ⚡ **一键复制** - 点击即可复制命令到剪贴板
- 🌐 **免费部署** - 支持 Cloudflare Pages 免费部署
- 🛠️ **易于定制** - 简单的配置即可个性化你的命令库
- 👨‍💻 **管理界面** - 可选配置管理员界面，支持可视化添加/编辑命令（需要 GitHub Token）
- 🌙 **暗色模式** - 完整的日间/夜间主题切换

## 📚 命令分类

| 分类 | 图标 | 说明 |
|------|------|------|
| SSH 连接管理 | 🔗 | 密钥生成、公钥复制、SSH 配置等 |
| Docker 容器操作 | 🐳 | 容器启动、日志查看、镜像管理等 |
| 文件传输管理 | 📁 | SCP 传输、Rsync 同步等 |
| Nginx 配置 | ⚙️ | 配置测试、重载、日志查看等 |
| 系统监控 | 📊 | CPU/内存/磁盘/网络监控等 |
| 安全加固 | 🔒 | 防火墙配置、SSH 加固等 |
| 备份恢复 | 💾 | 数据库备份、文件压缩等 |
| 部署发布 | 🚀 | Git 部署、PM2 管理等 |

## 🚀 快速开始

### 🚀 部署到 Cloudflare（推荐）

**1. Fork 本项目**
- 点击页面右上角的 **"Fork"** 按钮
- 将项目 Fork 到你的 GitHub 账号下

**2. 在 Cloudflare Pages 控制台部署**
1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 注册/登录 Cloudflare 账号（免费）
3. 点击左侧菜单 **"Workers & Pages"**
4. 点击 **"Create application"** → **"Pages"** → **"Connect to Git"**
5. 授权 GitHub 并选择你 Fork 的仓库
6. 配置构建设置：
   - **Framework preset**: `Vue`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
7. （可选）在 **Environment Variables** 里添加你的环境变量（如需用到管理员功能）
8. 点击 **"Save and Deploy"**

✅ **完成！** 几分钟后你就有了自己的 VPS 命令导航站，每次修改代码都会自动重新部署。

**3. 自定义你的命令库**
- 编辑 `src/mock/mock_data.js` 文件，添加你自己的命令分类和命令
- 提交更改，Cloudflare 会自动重新部署

**4. 绑定自定义域名（可选）**
- 在 Cloudflare Pages 项目设置中点击 **"Custom domains"**
- 添加你的域名并按提示配置 DNS

---

### 🚀 部署到 Vercel

**1. Fork 本项目**
- 同上，先 Fork 到你的 GitHub 账号

**2. 在 Vercel 控制台部署**
1. 访问 [Vercel 官网](https://vercel.com/)
2. 注册/登录 Vercel 账号（免费）
3. 点击右上角 **"Add New"** → **"Project"**
4. 选择你 Fork 的仓库，点击 **"Import"**
5. 保持默认设置，Vercel 会自动检测到是 Vue 项目
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. （可选）在 **Environment Variables** 里添加你的环境变量（如需用到管理员功能）
7. 点击 **"Deploy"**

✅ **完成！** 部署成功后会自动生成一个 vercel.app 域名，每次推送代码会自动重新部署。

**3. 自定义你的命令库**
- 编辑 `src/mock/mock_data.js` 文件，添加你自己的命令分类和命令
- 提交更改，Vercel 会自动重新部署

**4. 绑定自定义域名（可选）**
- 在 Vercel 项目设置中点击 **"Domains"**
- 添加你的域名并按提示配置 DNS

### 🛠️ 配置管理员界面（可选）

如果你想使用管理员界面来可视化管理命令数据，可以配置 GitHub Token：

**1. 获取 GitHub Personal Access Token**

1. 访问 [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token" → "Generate new token (fine-grained token)"
3. 设置 Token 名称，选择过期时间，并**只选择你的仓库**（这样即使 token 泄露也不会影响你其他项目）
4. 在 **Repository permissions (仓库权限)** 部分，勾选以下权限：
   - `Contents` - **Read and write** ✅  
     <span style="color:#888;font-size:13px;">用于读取和修改 <code>src/mock/mock_data.js</code> 文件，这是管理系统的核心功能</span>
   - `Metadata` - **Read** ✅  
     <span style="color:#888;font-size:13px;">用于访问仓库基本信息，GitHub API 的基础权限</span>
5. 在 **Account permissions (账户权限)** 部分：  
   <span style="color:#888;font-size:13px;">不需要勾选任何账户权限 ❌，我们只操作特定仓库，不需要账户级别的权限</span>
6. 点击 "Generate token" 并复制生成的 Token（只显示一次）

**2. 配置环境变量**

- **如果你在 _自己的服务器_ 部署：**  
  在项目根目录创建 `.env` 文件，添加以下配置：

- **如果你使用 _Vercel_ 或 _Cloudflare Pages_ 部署：**  
  请在对应平台的「环境变量」设置界面，添加下方这些变量，无需在项目中创建 `.env` 文件。

```
# 管理员密钥（自定义）
VITE_ADMIN_PASSWORD=your_admin_password_here

# GitHub Token
VITE_GITHUB_TOKEN=your_github_token_here
# Github 仓库所有者
VITE_GITHUB_OWNER=your_github_owner_here
VITE_GITHUB_REPO=your_github_repo_here
VITE_GITHUB_BRANCH=your_github_branch_here
```


### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/your-username/vps-assistant.git
cd vps-assistant
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **打开浏览器访问** `http://localhost:5173`

### 项目结构

```
vps-assistant/
├── src/
│   ├── apis/           # API 接口
│   ├── assets/         # 静态资源（图片、样式等）
│   ├── components/     # Vue 组件
│   │   └── admin/      # 管理后台组件
│   ├── mock/          # 模拟数据（命令数据）
│   ├── router/        # 路由配置
│   ├── stores/        # Pinia 状态管理
│   ├── views/         # 页面组件
│   ├── App.vue        # 根组件
│   └── main.js        # 入口文件
├── public/            # 公共静态文件（图标等）
├── index.html         # HTML 模板
├── package.json       # 项目配置
├── vite.config.js     # Vite 配置
└── wrangler.toml      # Cloudflare 部署配置
```

## 🎯 自定义配置

### 修改命令数据

有两种方式来自定义你的命令分类和命令：

**方式 1：直接编辑文件（推荐）**
编辑 `src/mock/mock_data.js` 文件来自定义你的命令分类和命令：

```javascript
export const mockData = {
  categories: [
    {
      id: "ssh-commands",
      name: "SSH 连接管理",
      icon: "🔗",
      order: 1,
      sites: [
        {
          id: "generate-ssh-key",
          name: "生成 SSH 密钥",
          url: "ssh-keygen -t rsa -b 4096 -C \"your_email@example.com\"",
          description: "生成 RSA 4096 位密钥对"
        }
      ]
    }
  ],
  title: "VPS 助手",
  search: "bing"
}
```

**方式 2：使用管理员界面（可选）**
如果你配置了管理员界面（见上方配置说明），可以通过以下步骤可视化管理：

1. 访问 `http://localhost:5173/admin` 或 `https://your-domain.com/admin`
2. 输入管理员密钥登录
3. 在界面中添加、编辑或删除命令分类和命令
4. 点击"💾 保存到 GitHub"按钮保存更改
5. 系统会自动在 2-3 分钟内重新部署

### 自定义样式

- 主要样式文件：`src/assets/main.css`
- 基础样式：`src/assets/base.css`


## 🛠️ 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查和修复
npm run lint
```

## 📋 部署清单

在部署前请检查：

- [ ] 已修改 `src/mock/mock_data.js` 为你的个人命令数据
- [ ] 已更新 `package.json` 中的项目信息
- [ ] 已配置 Cloudflare 账号（用于部署）
- [ ] 已测试构建命令 `npm run build`
- [ ] 已验证 `dist` 目录生成正常
- [ ] （可选）已配置管理员界面的环境变量

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Cloudflare Pages](https://pages.cloudflare.com/) - 现代化的 JAMstack 平台
- [Pinia](https://pinia.vuejs.org/) - Vue.js 状态管理库
- [VueDraggable](https://github.com/SortableJS/Vue.Draggable) - 拖拽排序组件

## 📞 联系方式

如果你有任何问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](https://github.com/your-username/vps-assistant/issues)
- 发起 [Discussion](https://github.com/your-username/vps-assistant/discussions)

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
