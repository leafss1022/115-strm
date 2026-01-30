# 🚀 一键部署指南

## 超级简单！只需一条命令

### 方法 1：直接执行（最简单）

```bash
curl -fsSL https://raw.githubusercontent.com/leafss1022/115-strm/main/auto-deploy.sh | bash
```

### 方法 2：下载后执行

```bash
# 1. 下载脚本
wget https://raw.githubusercontent.com/leafss1022/115-strm/main/auto-deploy.sh

# 2. 添加执行权限
chmod +x auto-deploy.sh

# 3. 执行脚本
./auto-deploy.sh
```

## ✨ 脚本会自动完成以下操作

1. ✅ 检查必要工具（git, docker, docker compose）
2. ✅ 克隆或更新项目
3. ✅ 交互式配置环境变量
4. ✅ 自动配置 docker-compose.yml
5. ✅ 创建数据目录
6. ✅ 构建 Docker 镜像
7. ✅ 启动服务

## 📋 配置提示

执行脚本时，会询问以下信息：

```
请输入 Alist 服务器 IP [默认: 127.0.0.1]: 
请输入 Alist 端口 [默认: 5244]: 
请输入 115 挂载路径 [默认: /115]: 
请输入目录树文件名 [默认: /目录树.txt]: 
```

直接回车使用默认值，或输入你的配置。

## 🎯 完整流程

```bash
# 1. 执行脚本
curl -fsSL https://raw.githubusercontent.com/leafss1022/115-strm/main/auto-deploy.sh | bash

# 2. 按照提示输入配置信息

# 3. 等待构建完成（2-3分钟）

# 4. 查看日志
cd 115-strm
docker compose logs -f
```

## 🔧 部署后的配置

如果需要修改配置：

```bash
cd 115-strm

# 编辑环境变量
nano .env

# 重启服务
docker compose restart
```

## 📊 常用命令

```bash
cd 115-strm

# 查看日志
docker compose logs -f

# 重启服务
docker compose restart

# 停止服务
docker compose down

# 手动执行一次
docker compose exec alist-strm python /app/main.py

# 查看生成的文件
ls -la ./data
```

## ⚠️ 重要提醒

1. **Alist 签名**：确保在 2 个地方都关闭签名
   - 管理设置 → 全局 → 关闭签名
   - 储存 → 挂载的储存 → 启用签名选择关闭

2. **目录树文件**：在 115 网盘根目录生成目录树并重命名为"目录树.txt"

3. **首次运行**：可能需要几分钟来生成 STRM 文件

## 🆘 遇到问题？

### 问题 1：构建失败

```bash
# 查看详细错误
cd 115-strm
docker build -t leafss1022/115-strm:latest . 2>&1 | tee build.log
cat build.log
```

### 问题 2：Alist 连接失败

```bash
# 测试 Alist 连接
curl http://你的AlistIP:5244

# 查看容器日志
docker compose logs alist-strm
```

### 问题 3：配置错误

```bash
# 重新配置
nano .env
docker compose restart
```

## 📚 更多文档

- README.md - 项目说明
- GITHUB_ACTIONS_GUIDE.md - GitHub Actions 配置
- OPTIMIZATION_GUIDE.md - 优化指南

---

**就这么简单！一条命令搞定所有配置！** 🎉
