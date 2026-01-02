
import React, { useState } from 'react';
import { generateMemeCopy } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props { context: string; }

const MemeMarketing: React.FC<Props> = ({ context }) => {
  const [trend, setTrend] = useState('');
  const [highlight, setHighlight] = useState('');
  const [style, setStyle] = useState('humor');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const styles = [
    { id: 'humor', label: '幽默玩梗', icon: 'fa-face-laugh-squint' },
    { id: 'emotional', label: '走心深情', icon: 'fa-heart' },
    { id: 'professional', label: '毒舌专业', icon: 'fa-user-ninja' },
    { id: 'social', label: '小红书/朋友圈', icon: 'fa-camera-retro' }
  ];

  const quickTrends = [
    "2025硬核养老计划",
    "精神离职进阶版：精神退休",
    "防御性财务自由",
    "赛博存钱罐",
    "反脆弱养老金"
  ];

  const quickHighlights = [
    "星福家分红稳定性",
    "复星星堡康养社区",
    "合资背景全球资产配置",
    "保证利率+红利惊喜",
    "高现金价值与灵活性"
  ];

  const handleGenerate = async () => {
    if (!trend || !highlight) return alert('请填入热梗和产品亮点');
    setLoading(true);
    const res = await generateMemeCopy(trend, highlight, style, context);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <i className="fas fa-fire text-9xl rotate-12"></i>
        </div>
        <h3 className="text-3xl font-black mb-2 flex items-center">
          <i className="fas fa-bolt mr-3"></i> 社交金句 & 热梗实验站
        </h3>
        <p className="text-purple-100 max-w-xl">
          拒绝枯燥！将热梗与产品卖点双向奔赴，做朋友圈最有灵魂的渠道经理。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          {/* 1. 热梗输入 */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">1. 当前热门话题/梗</label>
            <div className="space-y-4">
              <input 
                type="text"
                value={trend}
                onChange={(e) => setTrend(e.target.value)}
                placeholder="输入最近流行的梗，如：2025退休潮..."
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

          {/* 2. 产品亮点输入 */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">2. 要植入的产品亮点</label>
            <div className="space-y-4">
              <textarea 
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="请输入你想强调的产品优势，如：分红收益高、康养配套全..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-pink-400 transition-all font-medium text-slate-700 resize-none"
              />
              <div className="flex flex-wrap gap-2">
                {quickHighlights.map(h => (
                  <button 
                    key={h}
                    onClick={() => setHighlight(h)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${highlight === h ? 'bg-pink-600 text-white border-pink-600' : 'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100'}`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. 语体风格 */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">3. 选择文案调性</label>
            <div className="grid grid-cols-2 gap-3">
              {styles.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${style === s.id ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-purple-200'}`}
                >
                  <i className={`fas ${s.icon} mb-1 text-lg`}></i>
                  <span className="text-[10px] font-bold">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !trend || !highlight}
            className={`w-full py-5 rounded-[2.5rem] font-black text-white text-lg shadow-xl transition-all ${loading ? 'bg-slate-400' : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02] active:scale-95 shadow-purple-200'}`}
          >
            {loading ? "正在调频 2026 创意号..." : "生成爆款社交方案"}
          </button>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white h-full min-h-[600px] rounded-[3.5rem] border border-slate-100 shadow-inner p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
            
            {result ? (
              <div className="relative z-10 prose prose-purple max-w-none">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div>
                  <span className="text-xs font-black text-slate-400 tracking-widest uppercase">Creative Output</span>
                </div>
                <ReactMarkdown>{result}</ReactMarkdown>
                <div className="mt-10 pt-6 border-t border-slate-50 flex justify-between items-center">
                   <p className="text-[10px] text-slate-400 font-bold">Trend: {trend} | Product: {highlight.substring(0, 10)}...</p>
                   <button onClick={() => {
                     navigator.clipboard.writeText(result);
                     alert('文案已保存至剪贴板');
                   }} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition-all">
                     <i className="fas fa-copy mr-2"></i> 复制文案
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-inner rotate-3">
                    <i className="fas fa-wand-magic-sparkles text-4xl opacity-10"></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg animate-bounce">
                    <i className="fas fa-star"></i>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-black text-lg text-slate-400">填入热梗与产品灵魂</p>
                  <p className="text-xs mt-1 text-slate-300">让 AI 为你定制一份不被“划走”的高质感朋友圈文案</p>
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
