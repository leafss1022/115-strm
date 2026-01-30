'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileVideo, Download, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface StrmFile {
  name: string;
  url: string;
}

export default function Home() {
  const [linkInput, setLinkInput] = useState('');
  const [customPrefix, setCustomPrefix] = useState('');
  const [files, setFiles] = useState<StrmFile[]>([]);
  const [loading, setLoading] = useState(false);

  const parse115Links = () => {
    if (!linkInput.trim()) {
      toast.error('请输入 115 分享链接');
      return;
    }

    setLoading(true);

    // 解析链接
    const lines = linkInput.split('\n').filter(line => line.trim());
    const parsedFiles: StrmFile[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      const urlMatch = trimmedLine.match(/(https?:\/\/[^\s]+)/);
      
      if (urlMatch) {
        const url = urlMatch[1];
        // 尝试从 URL 或周围文本提取文件名
        const nameMatch = trimmedLine.match(/([^\s/]+\.(mp4|mkv|avi|mov|flv|wmv|ts|m4v))/i);
        const fileName = nameMatch ? nameMatch[1] : `视频_${index + 1}.strm`;
        
        parsedFiles.push({
          name: fileName.replace(/\.(mp4|mkv|avi|mov|flv|wmv|ts|m4v)$/i, '.strm'),
          url: customPrefix ? `${customPrefix.trim()}/${url}` : url,
        });
      }
    });

    setFiles(parsedFiles);
    setLoading(false);

    if (parsedFiles.length > 0) {
      toast.success(`已解析 ${parsedFiles.length} 个文件`);
    } else {
      toast.error('未找到有效的视频链接');
    }
  };

  const downloadSingle = (file: StrmFile) => {
    const blob = new Blob([file.url], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`已下载 ${file.name}`);
  };

  const downloadAll = () => {
    files.forEach(file => {
      setTimeout(() => {
        downloadSingle(file);
      }, files.indexOf(file) * 200);
    });
  };

  const clearAll = () => {
    setFiles([]);
    setLinkInput('');
    setCustomPrefix('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* 头部 */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-600 p-3">
            <FileVideo className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              115 STRM 生成器
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              将 115 网盘视频链接转换为 STRM 格式，方便在媒体服务器中使用
            </p>
          </div>
        </div>

        <Tabs defaultValue="converter" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="converter">转换器</TabsTrigger>
            <TabsTrigger value="help">使用帮助</TabsTrigger>
          </TabsList>

          <TabsContent value="converter" className="space-y-6">
            {/* 输入区域 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  输入链接
                </CardTitle>
                <CardDescription>
                  粘贴 115 分享链接或视频直链，每行一个
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={`示例：\nhttps://115.com/s/xxxxx 电影1.mp4\nhttps://115.com/s/xxxxx 电影2.mkv`}
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">自定义前缀（可选）</label>
                  <Input
                    placeholder="例如：/webdav 或 https://proxy.example.com"
                    value={customPrefix}
                    onChange={(e) => setCustomPrefix(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={parse115Links}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? '解析中...' : '解析链接'}
                  </Button>
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    disabled={loading || files.length === 0}
                  >
                    清空
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 结果区域 */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        解析结果
                      </CardTitle>
                      <CardDescription>
                        共解析 {files.length} 个 STRM 文件
                      </CardDescription>
                    </div>
                    <Button onClick={downloadAll} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      批量下载
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="font-medium truncate text-sm">
                            {file.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate mt-1">
                            {file.url}
                          </div>
                        </div>
                        <Button
                          onClick={() => downloadSingle(file)}
                          variant="ghost"
                          size="sm"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="help">
            <Card>
              <CardHeader>
                <CardTitle>使用帮助</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">什么是 STRM 文件？</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    STRM 文件是媒体播放器（如 Plex、Emby、Jellyfin）使用的索引文件，它不包含视频数据本身，而是指向视频文件的播放地址。通过 STRM 文件，你可以将网盘中的视频文件添加到媒体服务器中，无需下载到本地。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">如何使用？</h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400">
                    <li>复制 115 网盘中的视频分享链接或直链</li>
                    <li>将链接粘贴到输入框中，每行一个</li>
                    <li>点击"解析链接"按钮</li>
                    <li>下载生成的 STRM 文件</li>
                    <li>将 STRM 文件放入你的媒体服务器视频库中</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">自定义前缀说明</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    如果视频链接需要通过代理或特殊路径访问，可以在"自定义前缀"中设置。例如，如果你使用 WebDAV 或代理服务，可以输入相应的 URL 前缀。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">注意事项</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>确保视频链接是公开可访问的</li>
                    <li>STRM 文件中的链接需要持续有效</li>
                    <li>建议批量下载时注意浏览器弹窗拦截</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
