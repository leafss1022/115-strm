#!/bin/bash

#############################################################################
# 115-STRM 一键部署脚本
# 自动完成：克隆、配置、构建、启动
#############################################################################

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查必要工具
check_requirements() {
    print_header "检查必要工具"

    if ! command_exists git; then
        print_error "未找到 git，请先安装 git"
        exit 1
    fi
    print_success "git 已安装"

    if ! command_exists docker; then
        print_error "未找到 docker，请先安装 docker"
        exit 1
    fi
    print_success "docker 已安装"

    if ! command_exists docker compose; then
        print_error "未找到 docker compose，请先安装 docker compose"
        exit 1
    fi
    print_success "docker compose 已安装"
}

# 克隆或更新项目
setup_project() {
    print_header "设置项目"

    if [ -d "115-strm" ]; then
        print_info "项目已存在，更新代码..."
        cd 115-strm
        git pull
        cd ..
    else
        print_info "克隆项目..."
        git clone https://github.com/leafss1022/115-strm.git
    fi

    cd 115-strm
    print_success "项目准备完成"
}

# 配置环境变量
configure_env() {
    print_header "配置环境变量"

    if [ ! -f ".env" ]; then
        print_info "创建 .env 文件..."
        cp .env.sample .env

        # 询问配置
        echo ""
        read -p "请输入 Alist 服务器 IP [默认: 127.0.0.1]: " alist_host
        alist_host=${alist_host:-127.0.0.1}

        read -p "请输入 Alist 端口 [默认: 5244]: " alist_port
        alist_port=${alist_port:-5244}

        read -p "请输入 115 挂载路径 [默认: /115]: " alist_mount
        alist_mount=${alist_mount:-/115}

        read -p "请输入目录树文件名 [默认: /目录树.txt]: " tree_file
        tree_file=${tree_file:-/目录树.txt}

        # 写入配置
        sed -i "s|ALIST_HOST=.*|ALIST_HOST=$alist_host|" .env
        sed -i "s|ALIST_PORT=.*|ALIST_PORT=$alist_port|" .env
        sed -i "s|ALIST_115_MOUNT_PATH=.*|ALIST_115_MOUNT_PATH=$alist_mount|" .env
        sed -i "s|ALIST_115_TREE_FILE=.*|ALIST_115_TREE_FILE=$tree_file|" .env

        print_success "配置文件已创建"
    else
        print_info ".env 文件已存在，跳过配置"
        read -p "是否重新配置？(y/N): " reconfig
        if [[ $reconfig =~ ^[Yy]$ ]]; then
            nano .env
        fi
    fi
}

# 配置 docker-compose
configure_compose() {
    print_header "配置 docker-compose.yml"

    # 获取当前目录
    current_dir=$(pwd)

    # 修改数据卷路径
    if grep -q "'/path/to/115-strm/data" docker-compose.yml; then
        print_info "修改数据卷路径..."
        sed -i "s|'/path/to/115-strm/data:|'$current_dir/data':|g" docker-compose.yml
        print_success "数据卷路径已更新"
    else
        print_info "数据卷路径已配置，跳过"
    fi
}

# 创建数据目录
create_data_dir() {
    print_header "创建数据目录"

    mkdir -p ./data
    print_success "数据目录已创建: $(pwd)/data"
}

# 构建镜像
build_image() {
    print_header "构建 Docker 镜像"
    print_info "这可能需要 2-3 分钟，请耐心等待..."

    if docker build -t leafss1022/115-strm:latest . 2>&1 | tee build.log; then
        print_success "镜像构建成功！"
    else
        print_error "镜像构建失败，请查看 build.log"
        exit 1
    fi

    rm -f build.log
}

# 启动服务
start_service() {
    print_header "启动服务"

    # 停止旧容器
    print_info "停止旧容器..."
    docker compose down 2>/dev/null || true

    # 启动新容器
    print_info "启动服务..."
    docker compose up -d

    sleep 2

    # 显示状态
    print_info "服务状态："
    docker compose ps
}

# 显示使用说明
show_usage() {
    print_header "部署完成！"

    echo ""
    print_success "115-strm 已成功部署！"
    echo ""
    echo "📝 常用命令："
    echo -e "   ${BLUE}查看日志:${NC}     docker compose logs -f"
    echo -e "   ${BLUE}重启服务:${NC}     docker compose restart"
    echo -e "   ${BLUE}停止服务:${NC}     docker compose down"
    echo -e "   ${BLUE}手动执行:${NC}     docker compose exec alist-strm python /app/main.py"
    echo -e "   ${BLUE}查看文件:${NC}     ls -la ./data"
    echo ""
    echo "🔧 配置文件："
    echo -e "   ${BLUE}.env${NC}          - 环境变量配置"
    echo -e "   ${BLUE}docker-compose.yml${NC} - Docker Compose 配置"
    echo ""
    echo "📚 文档："
    echo -e "   ${BLUE}README.md${NC}           - 项目说明"
    echo -e "   ${BLUE}GITHUB_ACTIONS_GUIDE.md${NC} - GitHub Actions 配置指南"
    echo -e "   ${BLUE}OPTIMIZATION_GUIDE.md${NC}  - 优化指南"
    echo ""
    echo "⚠️  重要提醒："
    echo "   1. 确保 Alist 已关闭签名（2个地方都要关闭）"
    echo "   2. 确保 115 网盘中有目录树文件"
    echo "   3. 首次运行可能需要几分钟来生成 STRM 文件"
    echo ""
}

# 主函数
main() {
    clear
    print_header "115-STRM 自动部署脚本"

    # 检查工具
    check_requirements

    # 设置项目
    setup_project

    # 配置环境变量
    configure_env

    # 配置 docker-compose
    configure_compose

    # 创建数据目录
    create_data_dir

    # 构建镜像
    build_image

    # 启动服务
    start_service

    # 显示使用说明
    show_usage
}

# 执行主函数
main
