
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const formatContext = (knowledge: string) => {
  if (!knowledge) return "";
  return `\n--- 背景知识 ---\n${knowledge}\n--- 背景知识结束 ---\n`;
};

// 1. 金融资讯收集模块
export const fetchFinancialNews = async (location: string, companyContext: string) => {
  const ai = getAI();
  const contextText = formatContext(companyContext);
  const prompt = `你是一位保险专家，请总结最近能促使客户买分红险的消息。基于背景：${contextText}`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text || "", chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (error) {
    return { text: "资讯获取失败。", chunks: [] };
  }
};

// 2. 监管政策模块
export const fetchRegulatoryUpdates = async (companyContext: string) => {
  const ai = getAI();
  const prompt = `检索NFRA关于分红险、利率下调的最新通知。按原文要点、影响分析、行动指南输出。背景：${formatContext(companyContext)}`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text || "", chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (error) {
    return { text: "监管数据失败。", chunks: [] };
  }
};

// 3. 市场对标数据模块
export const fetchMarketBenchmarkData = async (bankNames: string[]) => {
  const ai = getAI();
  const names = bankNames.join('、');
  const prompt = `请检索并提供近5年（2020-2025）中国10年期国债收益率、货基均值，以及以下银行的1/3/5年定存利率月度数据：【${names}】。
  
  请为每一家银行生成对应的 rate1y_银行名, rate3y_银行名, rate5y_银行名 字段。
  
  返回格式必须为 JSON 数组：
  [{ "date": "2020-01", "bond": 3.1, "mFund": 2.5, "rate1y_工行": 1.75, ... }, ...]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};

// 4. 险企评价模块 (新增)
export const fetchCompanyEvaluation = async (companyName: string) => {
  const ai = getAI();
  const prompt = `请深度评价【${companyName}】保险公司，提供以下维度的详细数据和描述：
  1. 股东背景与实力（主要股东名称、持股比例、背景优势）。
  2. 公司评级（如穆迪、标普或中诚信等）。
  3. 投资能力与风格（资产配置偏好）。
  4. 偿付能力充足率（核心及综合偿付能力）。
  5. 分红实现率（红利实现率历史表现）。
  6. 财务投资收益率（近1、3、5、10年）。
  7. 综合投资收益率（近1、3、10年）。
  
  请务必确保数据真实或贴近最新财报，并以结构化JSON格式返回，包含字段：
  {
    "companyName": "",
    "shareholders": [{ "name": "", "ratio": "", "desc": "" }],
    "ratings": [{ "org": "", "level": "", "trend": "" }],
    "style": { "description": "", "radar": { "equity": 0, "bond": 0, "realEstate": 0, "alternative": 0, "overseas": 0 } },
    "solvency": { "core": 0, "comprehensive": 0, "date": "" },
    "dividendRealization": { "average": 0, "history": [] },
    "financialYield": { "y1": 0, "y3": 0, "y5": 0, "y10": 0 },
    "comprehensiveYield": { "y1": 0, "y3": 0, "y10": 0 }
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return null;
  }
};

export const generateSalesScript = async (topic: string, need: string, ctx: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({ model: "gemini-3-pro-preview", contents: `生成销售话术: ${topic}, 需求: ${need}. 背景: ${ctx}` });
  return response.text;
};

export const solveObjection = async (obj: string, ctx: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({ model: "gemini-3-pro-preview", contents: `处理异议: ${obj}. 背景: ${ctx}` });
  return response.text;
};

export const generateMemeCopy = async (t: string, h: string, s: string, ctx: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: `梗: ${t}, 亮点: ${h}, 风格: ${s}. 背景: ${ctx}` });
  return response.text;
};

export const generateComedyScript = async (h: string, c: string, ctx: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({ model: "gemini-3-pro-preview", contents: `脱口秀: ${c}, 亮点: ${h}. 背景: ${ctx}` });
  return response.text;
};
