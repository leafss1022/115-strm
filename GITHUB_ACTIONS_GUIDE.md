# 🚀 GitHub Actions 自动构建 Docker 镜像配置指南

## 📋 目录

- [配置 GitHub Secrets](#配置-github-secrets)
- [触发构建](#触发构建)
- [查看构建状态](#查看构建状态)
- [使用镜像](#使用镜像)
- [工作流说明](#工作流说明)

---

## 🔑 配置 GitHub Secrets

### 步骤 1：访问仓库设置

1. 打开你的 GitHub 仓库：https://github.com/leafss1022/115-strm
2. 点击 **Settings** (设置)
3. 左侧菜单点击 **Secrets and variables** → **Actions**
4. 点击 **New repository secret** 按钮

### 步骤 2：添加 Docker Hub 用户名

创建第一个 Secret：

- **Name**: `DOCKER_USERNAME`
- **Secret**: `leafss1022`  (你的 Docker Hub 用户名)
- 点击 **Add secret**

### 步骤 3：添加 Docker Hub 密码或 Token

创建第二个 Secret：

**方式 1：使用密码**
- **Name**: `DOCKER_PASSWORD`
- **Secret**: 你的 Docker Hub 密码
- 点击 **Add secret**

**方式 2：使用 Access Token（推荐）**
1. 登录 Docker Hub
2. 进入 Account Settings → Security
3. 点击 **New Access Token**
4. 配置 Token：
   - Description: `GitHub Actions`
   - Access permissions: Read & Write
5. 点击 **Generate**
6. 复制 Token（只显示一次！）
7. 在 GitHub 中创建 Secret：
   - **Name**: `DOCKER_PASSWORD`
   - **Secret**: 粘贴刚才复制的 Token
   - 点击 **Add secret**

### 验证 Secrets 配置

配置完成后，你应该看到以下 Secrets：

| Name | Value |
|------|-------|
| `DOCKER_USERNAME` | `leafss1022` |
| `DOCKER_PASSWORD` | `********` (你的密码或 Token) |

---

## 🚀 触发构建

### 方式 1：推送代码到 main 分支（自动）

```bash
# 修改代码后，推送到 main 分支
git add .
git commit -m "feat: 某些更新"
git push origin main
```

推送后，GitHub Actions 会自动触发构建。

### 方式 2：创建 Release（自动）

```bash
# 创建并推送标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

创建标签后，会自动构建并打上版本标签。

### 方式 3：手动触发（可选）

如果你想添加手动触发功能，可以修改 `.github/workflows/docker-build.yml`：

```yaml
on:
  workflow_dispatch:  # 添加这一行
  push:
    branches:
      - main
```

添加后，你可以在 GitHub 网页上手动触发构建。

---

## 📊 查看构建状态

### 步骤 1：访问 Actions 页面

1. 打开仓库：https://github.com/leafss1022/115-strm
2. 点击 **Actions** 标签

### 步骤 2：查看工作流

你会看到所有的构建历史：
- ✅ 绿色对勾 = 成功
- ❌ 红色叉号 = 失败
- 🔵 蓝色圆点 = 进行中

### 步骤 3：查看详细日志

点击任意构建记录，可以查看：
- 构建步骤
- 日志输出
- 镜像 Digest
- 构建时间

---

## 🐳 使用镜像

### 方式 1：拉取最新镜像

```bash
docker pull leafss1022/115-strm:latest
```

### 方式 2：拉取特定版本镜像

```bash
# 拉取某个 commit 版本
docker pull leafss1022/115-strm:main-xxxxx

# 拉取发布版本
docker pull leafss1022/115-strm:v1.0.0
```

### 方式 3：在 docker-compose.yml 中使用

```yml
services:
    alist-strm:
        image: leafss1022/115-strm:latest
        # ... 其他配置
```

---

## ⚙️ 工作流说明

### 触发条件

| 事件 | 说明 | 触发标签 |
|------|------|----------|
| `push` | 推送到 main/master 分支 | `latest`, `main-<sha>` |
| `pull_request` | 创建 Pull Request | `pr-<number>` |
| `release` | 创建 Release | `v1.0.0`, `1.0`, `1` |

### 构建平台

- `linux/amd64` - x86_64 架构（Intel/AMD）
- `linux/arm64` - ARM 64 位架构（树莓派、Mac M1/M2）

支持双平台构建，可以在不同架构的服务器上使用。

### 构建缓存

使用 Docker Registry 缓存加速构建：
- **缓存来源**: `leafss1022/115-strm:buildcache`
- **缓存模式**: `max` (最大化缓存)

### 镜像标签

构建完成后会自动打上以下标签：

- `latest` - 最新版本（main 分支）
- `main-<commit-sha>` - 每次 push 的版本
- `v1.0.0` - 发布版本
- `1.0` - 主.次版本
- `1` - 主版本

---

## 🔧 修改工作流配置

### 修改镜像名称

如果需要修改镜像名称，编辑 `.github/workflows/docker-build.yml`：

```yaml
env:
  DOCKER_IMAGE: leafss1022/115-strm  # 修改这里
```

### 修改构建平台

如果不需要多平台构建，可以修改：

```yaml
env:
  PLATFORMS: linux/amd64  # 只构建 amd64
```

### 修改 Dockerfile

如果使用不同的 Dockerfile，可以在 build-push-action 中指定：

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    file: ./Dockerfile.optimized  # 使用优化的 Dockerfile
    # ...
```

---

## 📝 构建示例

### 示例 1：普通 push

触发：
```bash
git add .
git commit -m "fix: 修复某个 bug"
git push origin main
```

结果：
- 构建成功
- 推送标签：`latest`, `main-a1b2c3d`

### 示例 2：创建 Release

触发：
```bash
git tag -a v1.0.0 -m "第一个正式版本"
git push origin v1.0.0
```

结果：
- 构建成功
- 推送标签：`latest`, `v1.0.0`, `1.0`, `1`

### 示例 3：Pull Request

触发：
```bash
# 创建新分支
git checkout -b feature/new-feature
git add .
git commit -m "feat: 添加新功能"
git push origin feature/new-feature

# 在 GitHub 上创建 Pull Request
```

结果：
- 构建（但不推送）
- 推送标签：`pr-123`

---

## 🐛 故障排查

### 问题 1：构建失败 - Authentication Failed

**错误信息**:
```
Error: failed to solve: failed to authorize: denied: requested access to the resource is denied
```

**解决方案**:
1. 检查 GitHub Secrets 配置是否正确
2. 确认 `DOCKER_USERNAME` 和 `DOCKER_PASSWORD` 是否正确
3. 如果使用 Token，确认 Token 有 Read & Write 权限
4. 重新配置 Secrets 并重新触发构建

### 问题 2：构建超时

**错误信息**:
```
Error: build timed out
```

**解决方案**:
1. 检查网络连接
2. 清理构建缓存：在 Actions 页面点击 "Re-run all jobs"
3. 如果持续超时，检查 Dockerfile 是否有网络请求

### 问题 3：构建成功但镜像未推送

**原因**: Pull Request 不会推送镜像

**解决方案**:
- 合并 PR 后会自动推送
- 或直接推送到 main 分支

### 问题 4：查看构建日志

1. 访问 Actions 页面
2. 点击失败的构建记录
3. 展开失败的步骤
4. 查看详细日志

---

## 📊 监控和通知

### 接收构建通知

1. 访问仓库 Settings → Notifications
2. 配置邮件或 Slack 通知
3. 选择接收 Actions 通知

### 查看构建统计

在 Actions 页面，你可以看到：
- 构建次数
- 成功/失败率
- 平均构建时间

---

## 🎯 最佳实践

1. **使用 Access Token 而不是密码**（更安全）
2. **定期更新依赖**（确保安全性）
3. **使用语义化版本**（方便管理）
4. **查看构建日志**（及时发现问题）
5. **测试镜像**（确保可用性）

---

## 📚 相关链接

- GitHub Actions 文档: https://docs.github.com/en/actions
- Docker Buildx 文档: https://docs.docker.com/buildx/working-with-buildx/
- GitHub Secrets 文档: https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

## ✅ 下一步

1. ✅ 配置 GitHub Secrets（DOCKER_USERNAME, DOCKER_PASSWORD）
2. ✅ 推送代码到 main 分支
3. ✅ 在 Actions 页面查看构建状态
4. ✅ 构建成功后，拉取镜像测试

---

配置完成后，每次推送代码都会自动构建并推送 Docker 镜像！🚀
