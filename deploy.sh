#!/bin/bash
# 一键部署脚本 - 本地构建版本

echo "🚀 开始部署 115-strm..."

# 1. 检查是否已克隆项目
if [ ! -d "115-strm" ]; then
    echo "📥 克隆项目..."
    git clone https://github.com/leafss1022/115-strm.git
    cd 115-strm
else
    echo "📂 进入项目目录..."
    cd 115-strm
    git pull
fi

# 2. 创建 .env 文件
if [ ! -f ".env" ]; then
    echo "⚙️  创建配置文件 .env"
    cp .env.sample .env
    echo "⚠️  请先编辑 .env 文件，配置 Alist 地址等信息"
    echo "   编辑命令: nano .env"
    read -p "配置完成后按 Enter 继续..."
fi

# 3. 创建数据目录
echo "📁 创建数据目录..."
mkdir -p ./data

# 4. 修改 docker-compose.yml 中的路径
echo "🔧 配置 docker-compose.yml..."
sed -i "s|'/path/to/115-strm/data:|'$(pwd)/data:|g" docker-compose.yml

# 5. 构建镜像
echo "🏗️  构建 Docker 镜像（需要 1-2 分钟）..."
docker build -t leafss1022/115-strm:latest .

if [ $? -eq 0 ]; then
    echo "✅ 镜像构建成功！"
else
    echo "❌ 镜像构建失败！"
    exit 1
fi

# 6. 启动服务
echo "🚀 启动服务..."
docker compose up -d

# 7. 查看日志
echo "📊 查看服务状态..."
docker compose ps

echo ""
echo "✅ 部署完成！"
echo ""
echo "📝 常用命令："
echo "   查看日志: docker compose logs -f"
echo "   重启服务: docker compose restart"
echo "   停止服务: docker compose down"
echo "   手动执行: docker compose exec alist-strm python /app/main.py"
echo ""
