
import React, { useState } from 'react';
import { generateMemeCopy } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props { context: string; }

const MemeMarketing: React.FC<Props> = ({ context }) => {
  const [trend, setTrend] = useState('');
  const [highlight, setHighlight] = useState('');
  const [style, setStyle] = useState('social');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const styles = [
    { id: 'humor', label: '幽默玩梗', icon: 'fa-face-laugh-squint' },
    { id: 'emotional', label: '走心深情', icon: 'fa-heart' },
    { id: 'professional', label: '毒舌专业', icon: 'fa-user-ninja' },
    { id: 'social', label: '爆款网感', icon: 'fa-camera-retro' }
  ];

  const quickTrends = [
    "2025硬核养老计划",
    "精神离职进阶版：精神退休",
    "防御性财务自由",
    "赛博存钱罐",
    "反脆弱养老金",
    "脆皮打工人的保险觉醒"
  ];

  const quickHighlights = [
    "星福家分红稳定性",
    "复星星堡康养社区",
    "美资背景全球资产配置",
    "复利奇迹与长期确定性",
    "高现价与资产流动性"
  ];

  const handleGenerate = async () => {
    if (!trend || !highlight) return alert('请填入或选择热梗和产品亮点');
    setLoading(true);
    const res = await generateMemeCopy(trend, highlight, style, context);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <i className="fas fa-bolt text-9xl rotate-12"></i>
        </div>
        <h3 className="text-3xl font-black mb-2 flex items-center">
          <i className="fas fa-fire mr-3"></i> 社交金句 & 热梗实验站
        </h3>
        <p className="text-purple-100 max-w-xl">
          拒绝刻板说教！让 2025 的流量热梗精准“撞击”保险产品卖点。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          {/* 1. 热梗选择/输入 */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">1. 当前热梗 (选一个或自定义)</label>
            <div className="space-y-4">
              <input 
                type="text"
                value={trend}
                onChange={(e) => setTrend(e.target.value)}
                placeholder="例如：2025养老开盲盒..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400 transition-all font-bold text-slate-700"
              />
              <div className="flex flex-wrap gap-2">
                {quickTrends.map(t => (
                  <button 
                    key={t}
                    onClick={() => setTrend(t)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${trend === t ? 'bg-purple-600 text-white border-purple-600' : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100'}`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. 产品内容输入 */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">2. 产品亮点内容</label>
            <div className="space-y-4">
              <textarea 
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="在这里输入你想推广的产品亮点..."
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400 transition-all font-medium text-slate-700 resize-none"
              />
              <div className="flex flex-wrap gap-2">
                {quickHighlights.map(h => (
                  <button 
                    key={h}
                    onClick={() => setHighlight(h)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${highlight === h ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'}`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">3. 风格倾向</label>
            <div className="grid grid-cols-4 gap-2">
              {styles.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${style === s.id ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-purple-200'}`}
                >
                  <i className={`fas ${s.icon} mb-1 text-md`}></i>
                  <span className="text-[9px] font-bold text-center">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !trend || !highlight}
            className={`w-full py-5 rounded-[2.5rem] font-black text-white text-lg shadow-xl transition-all ${loading ? 'bg-slate-400 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-95 shadow-purple-200'}`}
          >
            {loading ? "正在从 2026 信号站下载创意..." : "生成爆款文案"}
          </button>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white h-full min-h-[600px] rounded-[3.5rem] border border-slate-100 shadow-inner p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-40 -mr-40 -mt-40"></div>
            
            {result ? (
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
                  <span className="text-xs font-black text-slate-400 tracking-widest uppercase">Content Concept</span>
                </div>
                <div className="prose prose-indigo max-w-none prose-sm">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
                <div className="mt-10 pt-6 border-t border-slate-50 flex justify-between items-center">
                   <p className="text-[10px] text-slate-400 font-bold truncate max-w-[200px]">Meme: {trend}</p>
                   <button onClick={() => {
                     navigator.clipboard.writeText(result);
                     alert('内容已复制到剪贴板！');
                   }} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg">
                     <i className="fas fa-copy mr-2"></i> 复制全文
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-inner">
                  <i className="fas fa-rocket text-4xl opacity-10"></i>
                </div>
                <div className="text-center">
                  <p className="font-black text-lg text-slate-400">万物皆可梗，产品即亮点</p>
                  <p className="text-xs mt-1 text-slate-300">请在左侧输入热点与卖点，AI 将为您输出拒绝“折叠”的高质量文案</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeMarketing;
