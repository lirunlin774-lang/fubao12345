
import React, { useState, useEffect } from 'react';
import { fetchInsuranceNews } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props { context: string; }

const Dashboard: React.FC<Props> = ({ context }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ text: string, chunks: any[] } | null>(null);

  useEffect(() => {
    loadNews();
  }, [context]);

  const loadNews = async () => {
    setLoading(true);
    const res = await fetchInsuranceNews("四川", context);
    setData(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <i className="fas fa-rss text-orange-500 mr-2"></i>
                今日核心金融资讯
              </h3>
              <button 
                onClick={loadNews}
                className="text-sm text-blue-600 hover:underline"
              >
                刷新资讯
              </button>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none prose-sm">
                <ReactMarkdown>{data?.text || ""}</ReactMarkdown>
              </div>
            )}
          </div>
          
          {data?.chunks?.length ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <i className="fas fa-link text-blue-500 mr-2"></i>
                深度资讯信源
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.chunks.map((chunk, idx) => (
                  <a key={idx} href={chunk.web?.uri} target="_blank" className="p-3 bg-slate-50 border rounded-xl hover:bg-blue-50 transition-colors">
                    <span className="text-sm font-medium text-slate-700 truncate block">{chunk.web?.title}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="text-lg font-bold mb-3">知识大脑赋能</h3>
            <p className="text-xs opacity-80 mb-4">AI 正在基于你上传的 {context ? "私有文档" : "默认配置"} 实时解读新闻逻辑。</p>
            <div className="space-y-3">
              <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                <p className="text-[10px] uppercase opacity-60">销售契合点</p>
                <p className="text-xs font-medium mt-1">借此新闻话术：复星保德信虽然是合资，但资产配置更稳健。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
