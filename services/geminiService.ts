
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const formatContext = (knowledge: string) => {
  if (!knowledge) return "";
  return `\n--- 背景知识 ---\n${knowledge}\n--- 背景知识结束 ---\n`;
};

export const fetchInsuranceNews = async (location: string, companyContext: string) => {
  const ai = getAI();
  const contextText = formatContext(companyContext);
  const prompt = `你是一位保险私人助理。基于以下背景：${contextText} 
  请获取当前中国金融市场最新利好资讯。重点关注${location}及复星保德信。
  请总结5条最能体现我们产品优势的新闻，并给出每条新闻的“推荐理由”。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text || "", chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (error) {
    return { text: "资讯更新失败。", chunks: [] };
  }
};

export const generateSalesScript = async (topic: string, specificNeed: string, companyContext: string) => {
  const ai = getAI();
  const contextText = formatContext(companyContext);
  const prompt = `你是一位顶尖保险专家。基于背景：${contextText}
  请为“${topic}”生成深度销售逻辑。
  需求：${specificNeed}
  要求结合资产配置与复星生态，提供吸引点、核心优势、促成话术。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "生成失败。";
  }
};

export const solveObjection = async (objection: string, companyContext: string) => {
  const ai = getAI();
  const contextText = formatContext(companyContext);
  const prompt = `客户异议：“${objection}”
  请基于：${contextText} 制定反击方案。利用经济理论避开硬伤，转移注意力。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "分析失败。";
  }
};

export const generateMemeCopy = async (trend: string, highlight: string, style: string, companyContext: string) => {
  const ai = getAI();
  const contextText = formatContext(companyContext);
  const prompt = `你是一位精通网络热梗的保险营销创意总监。
  
  当前热门话题/梗：${trend}
  需要植入的产品亮点：${highlight}
  风格偏好：${style}
  结合背景：${contextText}
  
  任务：创作一段极具传播力的保险营销话术或朋友圈文案，将“热梗”与“产品亮点”进行神结合。
  要求：
  1. 必须自然、巧妙地将热梗过渡到复星保德信的产品亮点上。
  2. 话术要有趣、懂梗，如果是2025-2026的语境，请表现出前瞻性和幽默感。
  3. 给出：[文案内容]、[配图建议]、[适用场景]。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "创意生成失败，请稍后再试。";
  }
};

export const generateComedyScript = async (highlight: string, comedian: string, companyContext: string) => {
  const ai = getAI();
  const contextText = formatContext(companyContext);
  const prompt = `你是一位天才脱口秀编剧。请以“${comedian}”的标志性语体、节奏、口癖和逻辑，深度讲解复星保德信的保险产品卖点或亮点：\n\n“${highlight}”\n\n
  
  角色参考：
  - 李雪琴：丧萌、北大才女的降维打击、铁岭口音、大白话里透着深刻哲理。喜欢讲“哎呀，我就想说...”、“我妈说...”。
  - 王建国：谐音梗之王、被迫营业的愤怒感、内心OS极多、带有深刻的孤独和吐槽感。
  - 周奇墨：脱口秀天花板、观察入微、细节控、模仿能力极强、生活化的冷幽默。
  - 李诞：佛系、人间不值得、 cynicism、丧中带透，爱说“众生皆苦，但保险能让你苦得稍微体面一点”。
  - 池子：狂、节奏极快、带有攻击性的调侃、无厘头、少年感强。

  任务：
  1. 结合背景知识：${contextText}（特别是复星保德信的分红险、康养生态、美资背景等）。
  2. 创作一段1-2分钟的脱口秀表演脚本。
  3. 核心目标：让保险卖点变得搞笑、通俗且具有极强的社交传播属性。
  4. 输出格式：直接输出脱口秀脚本。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "段子手正在闭关，请稍后再试。";
  }
};
