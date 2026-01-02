
import React, { useState, useEffect } from 'react';
import { fetchFinancialNews, fetchRegulatoryUpdates } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props { context: string; }

const Dashboard: React.FC<Props> = ({ context }) => {
  const [loadingFin, setLoadingFin] = useState(true);
  const [loadingReg, setLoadingReg] = useState(true);
  const [finData, setFinData] = useState<{ text: string, chunks: any[] } | null>(null);
  const [regData, setRegData] = useState<{ text: string, chunks: any[] } | null>(null);

  useEffect(() => {
    loadAll();
  }, [context]);

  const loadAll = () => {
    loadFin();
    loadReg();
  };

  const loadFin = async () => {
    setLoadingFin(true);
    const res = await fetchFinancialNews("四川", context);
    setFinData(res);
    setLoadingFin(false);
  };

  const loadReg = async () => {
    setLoadingReg(true);
    const res = await fetchRegulatoryUpdates(context);
    setRegData(res);
    setLoadingReg(false);
  };

  // 辅助函数：将监管报告分割成不同颜色的块
  const renderRegulatoryContent = (text: string) => {
    const sections = text.split(/###\s*(【[^】]+】)/);
    if (sections.length < 2) return <ReactMarkdown>{text}</ReactMarkdown>;

    const result = [];
    for (let i = 1; i < sections.length; i += 2) {
      const title = sections[i];
      const content = sections[i + 1];
      let bgColor = "bg-white";
      let borderColor = "border-slate-100";
      let titleColor = "text-slate-800";

      if (title.includes("原文")) {
        bgColor = "bg-rose-50/50";
        borderColor = "border-rose-100";
        titleColor = "text-rose-700";
      } else if (title.includes("深度影响")) {
        bgColor = "bg-amber-50/50";
        borderColor = "border-amber-100";
        titleColor = "text-amber-700";
      } else if (title.includes("渠道行动")) {
        bgColor = "bg-emerald-50/50";
        borderColor = "border-emerald-100";
        titleColor = "text-emerald-700";
      }

      result.push(
        <div key={i} className={`${bgColor} ${borderColor} border-l-4 p-6 rounded-2xl mb-6 shadow-sm`}>
          <h4 className={`font-black text-sm mb-3 flex items-center ${titleColor}`}>
            <i className={`fas ${title.includes("原文") ? "fa-file-signature" : title.includes("影响") ? "fa-magnifying-glass-chart" : "fa-person-walking-arrow-right"} mr-2`}></i>
            {title.replace(/【|】/g, '')}
          </h4>
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      );
    }
    return result;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* 顶部标题栏 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">每日视点 & 监管同步</h2>
          <p className="text-sm text-slate-500">实时追踪 20+ 金融门户与 NFRA 最新政策</p>
        </div>
        <button 
          onClick={loadAll}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-black transition-all shadow-xl self-start"
        >
          <i className="fas fa-sync-alt"></i>
          <span>全局刷新资讯</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 版块 1: 金融资讯收集 (侧重销售转化) */}
        <div className="flex flex-col space-y-4">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex-grow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              <i className="fas fa-chart-line text-9xl"></i>
            </div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <i className="fas fa-bullhorn"></i>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">金融资讯 & 销售催化</h3>
                  <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Market Sales Triggers</p>
                </div>
              </div>
              <button onClick={loadFin} className="text-slate-400 hover:text-indigo-600 transition-colors">
                <i className={`fas fa-rotate ${loadingFin ? 'fa-spin' : ''}`}></i>
              </button>
            </div>

            {loadingFin ? (
              <div className="space-y-6 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                    <div className="h-20 bg-slate-50 rounded-2xl w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative z-10 space-y-6">
                 <div className="bg-indigo-50/50 p-4 rounded-2xl mb-6 border border-indigo-100/50">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center">
                      <i className="fas fa-shield-halved mr-2"></i> 销售导向说明
                    </p>
                    <p className="text-xs text-indigo-700/80 leading-relaxed font-medium">
                      以下资讯已过滤，仅展示有利于【分红险】销售与【复星生态】背书的核心动态。
                    </p>
                 </div>
                 <div className="prose prose-slate prose-sm max-w-none custom-fin-news">
                    <ReactMarkdown>{finData?.text || ""}</ReactMarkdown>
                 </div>
                
                {finData?.chunks?.length ? (
                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">权威依据链接</p>
                    <div className="flex flex-wrap gap-2">
                      {finData.chunks.slice(0, 5).map((c, i) => (
                        <a key={i} href={c.web?.uri} target="_blank" className="text-[10px] bg-slate-50 px-3 py-1.5 rounded-xl text-slate-500 hover:text-indigo-600 border border-slate-100 truncate max-w-[140px] transition-all">
                          <i className="fas fa-link mr-1 opacity-50"></i> {c.web?.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* 版块 2: 监管视点 (颜色区分区域) */}
        <div className="flex flex-col space-y-4">
          <div className="bg-slate-50 p-8 rounded-[3rem] shadow-sm flex-grow relative overflow-hidden border border-slate-200/60">
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-slate-200/20 rounded-full blur-3xl"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center space-x-3 text-slate-800">
                <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                  <i className="fas fa-gavel"></i>
                </div>
                <div>
                  <h3 className="text-lg font-black">每日监管哨点</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Regulatory Policy Blocks</p>
                </div>
              </div>
              <button onClick={loadReg} className="text-slate-400 hover:text-slate-800 transition-colors">
                <i className={`fas fa-rotate ${loadingReg ? 'fa-spin' : ''}`}></i>
              </button>
            </div>

            {loadingReg ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-32 bg-white rounded-3xl w-full"></div>
                <div className="h-32 bg-white rounded-3xl w-full"></div>
                <div className="h-32 bg-white rounded-3xl w-full"></div>
              </div>
            ) : (
              <div className="relative z-10">
                {renderRegulatoryContent(regData?.text || "")}
                
                {regData?.chunks?.length ? (
                   <div className="mt-8 pt-6 border-t border-slate-200/60">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">权威政策官网</p>
                     <div className="flex flex-wrap gap-2">
                       {regData.chunks.slice(0, 3).map((c, i) => (
                         <a key={i} href={c.web?.uri} target="_blank" className="text-[10px] bg-white px-3 py-1.5 rounded-xl text-slate-500 hover:text-blue-600 border border-slate-200 truncate max-w-[180px] transition-all">
                           <i className="fas fa-building-columns mr-1 opacity-50"></i> {c.web?.title}
                         </a>
                       ))}
                     </div>
                   </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 底部备注 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/50 py-4 rounded-3xl border border-slate-100">
        <span className="flex items-center"><i className="fas fa-circle text-emerald-500 text-[6px] mr-2"></i> 实时检索：NFRA 官网 & 20+ 金融门户</span>
        <span className="hidden md:inline text-slate-200">|</span>
        <span className="flex items-center"><i className="fas fa-robot mr-2 text-indigo-500"></i> 深度销售逻辑：Gemini 3 Pro</span>
        <span className="hidden md:inline text-slate-200">|</span>
        <span className="flex items-center"><i className="fas fa-location-dot mr-2 text-rose-500"></i> 定位：四川 · 复星保德信</span>
      </div>

      <style>{`
        .custom-fin-news h3 { 
          font-size: 1rem; 
          font-weight: 800; 
          color: #1e293b; 
          border-left: 3px solid #4f46e5; 
          padding-left: 0.75rem; 
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .custom-fin-news p { margin-bottom: 0.75rem; }
        .custom-fin-news strong { color: #4f46e5; font-weight: 700; }
        .custom-fin-news h3:first-child { margin-top: 0; }
      `}</style>
    </div>
  );
};

export default Dashboard;
