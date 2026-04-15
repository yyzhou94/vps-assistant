# 🚀 VPS 助手 - GitHub + Cloudflare Pages 部署指南

## 📋 部署流程概览

1. **GitHub 准备** - 创建仓库，配置 Token
2. **本地配置** - 设置环境变量
3. **推送到 GitHub** - 提交代码
4. **Cloudflare Pages 部署** - 连接仓库，自动部署
5. **配置环境变量** - 在 Cloudflare 设置密钥

---

## 第 1 步：GitHub 准备

### 1.1 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `vps-assistant`（或你喜欢的名字）
   - **Description**: `VPS 命令导航站 - 分类整理常用运维命令`
   - **Visibility**: Public（公开）或 Private（私有）
   - **不要**初始化 README（本地有代码）
3. 点击 **Create repository**

### 1.2 获取 GitHub Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token** → **Fine-grained tokens**
3. 配置 Token：
   - **Token name**: `vps-assistant-deploy`
   - **Expiration**: 建议 90 天或更长
   - **Resource owner**: 选择你的用户名
   - **Repository access**: 只选择 `vps-assistant` 仓库
   - **Permissions**:
     - `Contents`: **Read and write**（读写权限，用于保存数据）
     - `Metadata`: **Read**（只读权限，必需）
4. 点击 **Generate token**
5. **复制 Token**（只显示一次，立即保存！）

---

## 第 2 步：本地配置

### 2.1 创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
# 管理员密钥（你自己设定的密码）
VITE_ADMIN_PASSWORD=your_secure_password

# GitHub 配置
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # 刚才生成的 Token
VITE_GITHUB_OWNER=your_github_username  # 你的 GitHub 用户名
VITE_GITHUB_REPO=vps-assistant  # 仓库名
VITE_GITHUB_BRANCH=master  # 主分支名

# 是否启用访问密码锁定（true/false）
VITE_OPEN_LOCK=true
```

### 2.2 测试本地运行

```bash
npm install
npm run dev
```

访问 http://localhost:5173/admin 测试管理功能

---

## 第 3 步：推送到 GitHub

### 3.1 初始化 Git（如果还没初始化）

```bash
cd C:\Users\yyzhou\Desktop\scripts

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "Initial commit: VPS 助手导航站"
```

### 3.2 关联远程仓库

```bash
# 添加远程仓库（替换为你的 GitHub 仓库 URL）
git remote add origin https://github.com/your-username/vps-assistant.git

# 查看远程仓库
git remote -v
```

### 3.3 推送代码

```bash
# 推送主分支
git push -u origin master

# 如果是 main 分支
git push -u origin main
```

---

## 第 4 步：Cloudflare Pages 部署

### 4.1 登录 Cloudflare

1. 访问 https://pages.cloudflare.com/
2. 登录你的 Cloudflare 账号（没有账号先注册）

### 4.2 创建新项目

1. 点击 **Create a project** → **Connect to Git**
2. 选择 GitHub 账号授权
3. 找到并选择 `vps-assistant` 仓库
4. 点击 **Begin setup**

### 4.3 配置构建设置

**Framework preset**: `Vue`

**Build settings**:
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `（留空）`

**Environment variables**（点击 "Add variable" 添加）：

| Variable | Value |
|----------|-------|
| `VITE_ADMIN_PASSWORD` | `your_secure_password` |
| `VITE_GITHUB_TOKEN` | `ghp_xxxxxxxxxxxx` |
| `VITE_GITHUB_OWNER` | `your_github_username` |
| `VITE_GITHUB_REPO` | `vps-assistant` |
| `VITE_GITHUB_BRANCH` | `master` |
| `VITE_OPEN_LOCK` | `true` |

### 4.4 保存并部署

1. 点击 **Save and deploy**
2. Cloudflare 会自动构建并部署项目
3. 等待几分钟，看到 **Success** 状态

### 4.5 获取访问域名

部署完成后，你会获得一个自动生成的域名：
- `https://vps-assistant.pages.dev`

你可以在 **Custom domains** 中绑定自己的域名（可选）

---

## 第 5 步：后续更新

### 5.1 代码更新后自动部署

每次推送代码到 `master` 分支，Cloudflare 会自动重新部署：

```bash
git add .
git commit -m "Update: 添加新功能"
git push origin master
```

### 5.2 手动触发部署

如果自动部署失败，可以：
1. 进入 Cloudflare Pages 项目
2. 点击 **Deployments**
3. 点击 **... (更多)** → **Retry deployment**

---

## 🔧 常见问题

### Q1: 构建失败？

**检查**：
- Node 版本是否 >= 18
- `package.json` 是否有语法错误
- 构建命令是否正确

**解决**：
```bash
# 本地测试构建
npm run build
```

### Q2: 管理后台无法保存？

**检查**：
- GitHub Token 是否有效
- Token 是否有 `Contents: Read and write` 权限
- 仓库名和用户名是否正确

**解决**：
- 重新生成 Token
- 检查 `.env` 配置

### Q3: 访问密码不生效？

**原因**：环境变量没有正确设置

**解决**：
- 在 Cloudflare Pages → Settings → Environment variables 中添加
- 重新部署项目

### Q4: 如何修改环境变量？

**Cloudflare Pages**：
1. 进入项目 → Settings
2. 找到 **Environment variables**
3. 点击 **Add variable** 或编辑现有变量
4. 保存后重新部署

---

## 📝 推荐目录结构

```
vps-assistant/
├── .env                 # 本地环境变量（不要提交到 Git）
├── .env.example         # 环境变量模板（提交到 Git）
├── .gitignore           # Git 忽略文件
├── package.json         # 项目配置
├── src/                 # 源代码
│   ├── mock/
│   │   └── mock_data.js # VPS 命令数据（会被 GitHub 同步覆盖）
│   └── ...
└── README.md            # 项目说明
```

### .gitignore 配置

确保 `.gitignore` 包含：

```gitignore
# 环境变量
.env
.env.local
.env.*.local

# 依赖
node_modules/

# 构建输出
dist/
dist-ssr/

# IDE
.vscode/
.idea/

# 系统文件
.DS_Store
Thumbs.db
```

---

## 🎉 部署完成！

现在你的 VPS 助手已经上线了！

**访问地址**: `https://vps-assistant.pages.dev`

**管理后台**: `https://vps-assistant.pages.dev/admin`

---

## 📚 下一步

- [ ] 绑定自定义域名
- [ ] 添加更多 VPS 命令
- [ ] 配置访问密码
- [ ] 启用 HTTPS（Cloudflare 自动提供）
- [ ] 添加分析统计（Cloudflare Analytics）

---

**遇到问题？** 查看 [GitHub Issues](https://github.com/your-username/vps-assistant/issues) 或提交新问题！
