export const mockData = {
  "categories": [
    {
      "id": "ssh-connection",
      "name": "SSH 连接管理",
      "icon": "🔗",
      "order": 0,
      "sites": [
        {
          "id": "ssh-keygen",
          "name": "生成 SSH 密钥",
          "url": "ssh-keygen -t rsa -b 4096 -C \"your_email@example.com\"",
          "description": "生成 RSA 4096 位密钥对"
        },
        {
          "id": "ssh-copy-id",
          "name": "复制公钥到服务器",
          "url": "ssh-copy-id user@hostname",
          "description": "将公钥复制到远程服务器"
        },
        {
          "id": "ssh-login",
          "name": "SSH 登录服务器",
          "url": "ssh -p 22 user@hostname",
          "description": "使用指定端口登录服务器"
        },
        {
          "id": "ssh-with-key",
          "name": "使用指定密钥登录",
          "url": "ssh -i /path/to/key.pem user@hostname",
          "description": "使用指定私钥文件登录"
        },
        {
          "id": "ssh-port-forward",
          "name": "SSH 端口转发",
          "url": "ssh -L 8080:localhost:80 user@hostname",
          "description": "本地端口转发到远程服务器"
        },
        {
          "id": "ssh-tunnel",
          "name": "SSH 反向隧道",
          "url": "ssh -R 8080:localhost:3000 user@gateway.com",
          "description": "将本地服务暴露到公网"
        },
        {
          "id": "scp-copy",
          "name": "SCP 复制文件",
          "url": "scp local/file.txt user@hostname:/remote/path/",
          "description": "安全复制文件到远程服务器"
        },
        {
          "id": "scp-download",
          "name": "SCP 下载文件",
          "url": "scp user@hostname:/remote/file.txt ./local/",
          "description": "从远程服务器下载文件"
        },
        {
          "id": "scp-dir",
          "name": "SCP 复制目录",
          "url": "scp -r local/dir user@hostname:/remote/path/",
          "description": "递归复制整个目录"
        }
      ]
    },
    {
      "id": "docker-basic",
      "name": "Docker 基础操作",
      "icon": "🐳",
      "order": 1,
      "sites": [
        {
          "id": "docker-pull",
          "name": "拉取镜像",
          "url": "docker pull nginx:latest",
          "description": "从仓库拉取最新镜像"
        },
        {
          "id": "docker-run",
          "name": "启动容器",
          "url": "docker run -d -p 80:80 --name webserver nginx",
          "description": "后台运行容器并映射端口"
        },
        {
          "id": "docker-build",
          "name": "构建镜像",
          "url": "docker build -t myapp:1.0 .",
          "description": "从 Dockerfile 构建镜像"
        },
        {
          "id": "docker-ps",
          "name": "查看运行容器",
          "url": "docker ps -a",
          "description": "查看所有容器（包括停止的）"
        },
        {
          "id": "docker-stop",
          "name": "停止容器",
          "url": "docker stop container_name",
          "description": "停止正在运行的容器"
        },
        {
          "id": "docker-rm",
          "name": "删除容器",
          "url": "docker rm container_name",
          "description": "删除已停止的容器"
        },
        {
          "id": "docker-images",
          "name": "查看镜像列表",
          "url": "docker images",
          "description": "列出所有本地镜像"
        },
        {
          "id": "docker-rmi",
          "name": "删除镜像",
          "url": "docker rmi image_name:tag",
          "description": "删除指定镜像"
        },
        {
          "id": "docker-logs",
          "name": "查看容器日志",
          "url": "docker logs -f container_name",
          "description": "实时跟踪容器日志输出"
        },
        {
          "id": "docker-exec",
          "name": "进入容器",
          "url": "docker exec -it container_name bash",
          "description": "交互式进入容器终端"
        }
      ]
    },
    {
      "id": "docker-compose",
      "name": "Docker Compose",
      "icon": "🐙",
      "order": 2,
      "sites": [
        {
          "id": "compose-up",
          "name": "启动服务",
          "url": "docker-compose up -d",
          "description": "后台启动所有服务"
        },
        {
          "id": "compose-down",
          "name": "停止并删除",
          "url": "docker-compose down",
          "description": "停止并删除容器和网络"
        },
        {
          "id": "compose-build",
          "name": "构建服务",
          "url": "docker-compose build",
          "description": "构建或重新构建服务"
        },
        {
          "id": "compose-ps",
          "name": "查看服务状态",
          "url": "docker-compose ps",
          "description": "列出所有服务状态"
        },
        {
          "id": "compose-logs",
          "name": "查看服务日志",
          "url": "docker-compose logs -f",
          "description": "跟踪所有服务日志"
        },
        {
          "id": "compose-restart",
          "name": "重启服务",
          "url": "docker-compose restart",
          "description": "重启所有服务"
        }
      ]
    },
    {
      "id": "nginx-config",
      "name": "Nginx 配置管理",
      "icon": "🌐",
      "order": 3,
      "sites": [
        {
          "id": "nginx-test",
          "name": "测试配置",
          "url": "nginx -t",
          "description": "测试 Nginx 配置文件语法"
        },
        {
          "id": "nginx-reload",
          "name": "重载配置",
          "url": "nginx -s reload",
          "description": "平滑重载配置文件"
        },
        {
          "id": "nginx-stop",
          "name": "停止 Nginx",
          "url": "nginx -s stop",
          "description": "快速停止 Nginx 服务"
        },
        {
          "id": "systemctl-start-nginx",
          "name": "启动服务",
          "url": "systemctl start nginx",
          "description": "使用 systemd 启动 Nginx"
        },
        {
          "id": "systemctl-enable-nginx",
          "name": "开机自启",
          "url": "systemctl enable nginx",
          "description": "设置 Nginx 开机自动启动"
        },
        {
          "id": "nginx-status",
          "name": "查看状态",
          "url": "systemctl status nginx",
          "description": "查看 Nginx 服务运行状态"
        },
        {
          "id": "nginx-log",
          "name": "查看错误日志",
          "url": "tail -f /var/log/nginx/error.log",
          "description": "实时跟踪 Nginx 错误日志"
        },
        {
          "id": "nginx-access-log",
          "name": "查看访问日志",
          "url": "tail -f /var/log/nginx/access.log",
          "description": "实时跟踪访问日志"
        }
      ]
    },
    {
      "id": "file-management",
      "name": "文件管理操作",
      "icon": "📁",
      "order": 4,
      "sites": [
        {
          "id": "ls-l",
          "name": "列出文件详情",
          "url": "ls -lah",
          "description": "显示所有文件的详细信息"
        },
        {
          "id": "cp-r",
          "name": "复制目录",
          "url": "cp -r source_dir destination_dir",
          "description": "递归复制整个目录"
        },
        {
          "id": "rm-rf",
          "name": "强制删除",
          "url": "rm -rf directory_or_file",
          "description": "强制删除文件或目录（慎用）"
        },
        {
          "id": "mkdir-p",
          "name": "创建多级目录",
          "url": "mkdir -p path/to/directory",
          "description": "创建目录及父目录"
        },
        {
          "id": "find-name",
          "name": "查找文件",
          "url": "find /path -name \"filename\"",
          "description": "按名称查找文件"
        },
        {
          "id": "grep-r",
          "name": "递归搜索内容",
          "url": "grep -r \"pattern\" /path",
          "description": "在目录下递归搜索文本"
        },
        {
          "id": "chmod",
          "name": "修改权限",
          "url": "chmod 755 file_or_directory",
          "description": "修改文件或目录权限"
        },
        {
          "id": "chown",
          "name": "修改所有者",
          "url": "chown user:group file_or_directory",
          "description": "修改文件或目录所有者"
        },
        {
          "id": "tar-czf",
          "name": "打包压缩",
          "url": "tar -czf archive.tar.gz directory/",
          "description": "创建 gzip 压缩的归档文件"
        },
        {
          "id": "tar-xzf",
          "name": "解压缩",
          "url": "tar -xzf archive.tar.gz",
          "description": "解压 gzip 压缩的归档文件"
        },
        {
          "id": "du-h",
          "name": "查看磁盘占用",
          "url": "du -sh /path",
          "description": "显示目录总大小"
        },
        {
          "id": "df-h",
          "name": "查看磁盘空间",
          "url": "df -h",
          "description": "显示文件系统磁盘空间使用情况"
        }
      ]
    },
    {
      "id": "system-monitor",
      "name": "系统监控命令",
      "icon": "📊",
      "order": 5,
      "sites": [
        {
          "id": "top",
          "name": "实时进程监控",
          "url": "top",
          "description": "实时显示系统进程和资源使用情况"
        },
        {
          "id": "htop",
          "name": "增强进程监控",
          "url": "htop",
          "description": "交互式的进程查看器（需安装）"
        },
        {
          "id": "ps-ef",
          "name": "查看进程列表",
          "url": "ps -ef | grep process_name",
          "description": "查找指定进程"
        },
        {
          "id": "kill",
          "name": "终止进程",
          "url": "kill -9 PID",
          "description": "强制终止指定进程"
        },
        {
          "id": "free-h",
          "name": "查看内存使用",
          "url": "free -h",
          "description": "以人类可读格式显示内存使用情况"
        },
        {
          "id": "netstat",
          "name": "查看网络连接",
          "url": "netstat -tulpn",
          "description": "查看所有监听端口和对应进程"
        },
        {
          "id": "ss",
          "name": "查看Socket统计",
          "url": "ss -tulpn",
          "description": "替代 netstat 的现代工具"
        },
        {
          "id": "uptime",
          "name": "查看系统运行时间",
          "url": "uptime",
          "description": "显示系统已运行时间和负载"
        },
        {
          "id": "uname",
          "name": "查看系统信息",
          "url": "uname -a",
          "description": "显示所有系统信息"
        }
      ]
    },
    {
      "id": "security",
      "name": "安全加固命令",
      "icon": "🔒",
      "order": 6,
      "sites": [
        {
          "id": "ufw-enable",
          "name": "启用防火墙",
          "url": "ufw enable",
          "description": "启用 UFW 防火墙"
        },
        {
          "id": "ufw-allow-ssh",
          "name": "允许 SSH 连接",
          "url": "ufw allow 22/tcp",
          "description": "允许 SSH 端口通过防火墙"
        },
        {
          "id": "ufw-status",
          "name": "查看防火墙状态",
          "url": "ufw status verbose",
          "description": "显示详细的防火墙规则"
        },
        {
          "id": "fail2ban-status",
          "name": "查看 Fail2ban 状态",
          "url": "fail2ban-client status",
          "description": "显示 Fail2ban 运行状态"
        },
        {
          "id": "passwd",
          "name": "修改密码",
          "url": "passwd username",
          "description": "修改指定用户的密码"
        },
        {
          "id": "useradd",
          "name": "创建用户",
          "url": "useradd -m -s /bin/bash username",
          "description": "创建新用户并设置家目录"
        },
        {
          "id": "sudo-visudo",
          "name": "编辑 sudo 权限",
          "url": "visudo",
          "description": "安全编辑 sudoers 文件"
        },
        {
          "id": "sshd-config",
          "name": "配置 SSH 服务",
          "url": "nano /etc/ssh/sshd_config",
          "description": "编辑 SSH 服务器配置文件"
        }
      ]
    },
    {
      "id": "backup",
      "name": "备份恢复命令",
      "icon": "💾",
      "order": 7,
      "sites": [
        {
          "id": "rsync-backup",
          "name": "Rsync 增量备份",
          "url": "rsync -avz source/ user@backup:/destination/",
          "description": "使用 rsync 进行增量备份"
        },
        {
          "id": "mysqldump",
          "name": "MySQL 备份",
          "url": "mysqldump -u user -p database > backup.sql",
          "description": "备份 MySQL 数据库"
        },
        {
          "id": "mysql-restore",
          "name": "MySQL 恢复",
          "url": "mysql -u user -p database < backup.sql",
          "description": "从备份恢复 MySQL 数据库"
        },
        {
          "id": "crontab-e",
          "name": "编辑定时任务",
          "url": "crontab -e",
          "description": "编辑当前用户的定时任务"
        },
        {
          "id": "crontab-l",
          "name": "查看定时任务",
          "url": "crontab -l",
          "description": "列出当前用户的定时任务"
        }
      ]
    },
    {
      "id": "deployment",
      "name": "部署发布命令",
      "icon": "🚀",
      "order": 8,
      "sites": [
        {
          "id": "git-clone",
          "name": "克隆仓库",
          "url": "git clone https://github.com/user/repo.git",
          "description": "克隆 Git 仓库到本地"
        },
        {
          "id": "git-pull",
          "name": "拉取更新",
          "url": "git pull origin main",
          "description": "拉取并合并远程仓库更新"
        },
        {
          "id": "npm-install",
          "name": "安装依赖",
          "url": "npm install",
          "description": "安装项目依赖"
        },
        {
          "id": "npm-build",
          "name": "构建项目",
          "url": "npm run build",
          "description": "构建生产版本"
        },
        {
          "id": "pm2-start",
          "name": "启动 Node 应用",
          "url": "pm2 start app.js",
          "description": "使用 PM2 启动应用"
        },
        {
          "id": "pm2-log",
          "name": "查看 PM2 日志",
          "url": "pm2 logs",
          "description": "查看 PM2 管理的日志"
        },
        {
          "id": "pm2-status",
          "name": "查看 PM2 状态",
          "url": "pm2 status",
          "description": "显示所有 PM2 进程状态"
        }
      ]
    },
    {
      "id": "network-diag",
      "name": "网络诊断工具",
      "icon": "🌐",
      "order": 9,
      "sites": [
        {
          "id": "ping",
          "name": "Ping 测试",
          "url": "ping -c 4 google.com",
          "description": "测试网络连通性"
        },
        {
          "id": "curl",
          "name": "HTTP 请求测试",
          "url": "curl -I https://example.com",
          "description": "查看 HTTP 响应头"
        },
        {
          "id": "wget",
          "name": "下载文件",
          "url": "wget https://example.com/file.zip",
          "description": "从 URL 下载文件"
        },
        {
          "id": "traceroute",
          "name": "路由追踪",
          "url": "traceroute google.com",
          "description": "追踪数据包路由路径"
        },
        {
          "id": "nslookup",
          "name": "DNS 查询",
          "url": "nslookup example.com",
          "description": "查询 DNS 记录"
        },
        {
          "id": "dig",
          "name": "详细 DNS 查询",
          "url": "dig example.com",
          "description": "显示详细的 DNS 信息"
        }
      ]
    }
  ],
  "title": "VPS 助手",
  "search": "bing"
}
