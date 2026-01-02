
import React, { useState, useEffect } from 'react';
import { AppTab, KnowledgeEntry } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StrategyLab from './components/StrategyLab';
import ObjectionMaster from './components/ObjectionMaster';
import KnowledgeBase from './components/KnowledgeBase';
import KnowledgeManager from './components/KnowledgeManager';
import MemeMarketing from './components/MemeMarketing';
import ComedyLab from './components/ComedyLab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('company_knowledge');
    if (saved) {
      setKnowledge(JSON.parse(saved));
    }
  }, []);

  const activeContext = knowledge
    .filter(k => k.isActive)
    .map(k => `[${k.title}]: ${k.content}`)
    .join('\n\n');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      <main className={`flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300`}>
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-slate-800">
                  {activeTab === AppTab.DASHBOARD && "早间资讯 & 复星视点"}
                  {activeTab === AppTab.STRATEGY && "分红险销售逻辑实验室"}
                  {activeTab === AppTab.COMEDY && "脱口秀产品剧场"}
                  {activeTab === AppTab.MEME && "社交金句 & 热梗实验站"}
                  {activeTab === AppTab.OBJECTION && "异议处理与反超方案"}
                  {activeTab === AppTab.THEORY && "经济理论与名人堂"}
                  {activeTab === AppTab.CONTEXT && "知识大脑中心"}
                </h1>
                {knowledge.some(k => k.isActive) && (
                  <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full flex items-center animate-pulse">
                    <i className="fas fa-brain mr-1"></i> 已关联私有知识库
                  </span>
                )}
              </div>
              <p className="text-slate-500 mt-1">复星保德信四川分公司 · 专属AI助理</p>
            </div>
            <div className="hidden md:flex items-center space-x-3 text-sm">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">四川 · 成都</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600 font-semibold">{new Date().toLocaleDateString('zh-CN')}</span>
            </div>
          </header>

          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {activeTab === AppTab.DASHBOARD && <Dashboard context={activeContext} />}
            {activeTab === AppTab.STRATEGY && <StrategyLab context={activeContext} />}
            {activeTab === AppTab.COMEDY && <ComedyLab context={activeContext} />}
            {activeTab === AppTab.MEME && <MemeMarketing context={activeContext} />}
            {activeTab === AppTab.OBJECTION && <ObjectionMaster context={activeContext} />}
            {activeTab === AppTab.THEORY && <KnowledgeBase />}
            {activeTab === AppTab.CONTEXT && <KnowledgeManager knowledge={knowledge} setKnowledge={setKnowledge} />}
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
