const axios = require('axios');

const VOLC_API_KEY = process.env.VOLC_API_KEY;
const VOLC_MODEL_ID = process.env.VOLC_MODEL_ID;
const VOLC_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if(req.method === "OPTIONS") return res.status(200).end();
  if(req.method !== "POST") return res.status(405).json({msg:"仅支持POST"});
  if(!VOLC_API_KEY || !VOLC_MODEL_ID) return res.status(500).json({msg:"环境变量缺失"});

  const {text} = req.body;
  if(!text) return res.status(400).json({msg:"缺少输入文本"});

  const sysPrompt = `你是闪卡生成助手。输入单词/短语/句子，严格只输出JSON，不要多余文字、markdown、解释。字段：front词条本身，phonetic国际音标，back中文释义，example_en一句简单英文例句，example_cn例句中文翻译。`;

  try{
    const resp = await axios.post(VOLC_URL,{
      model: VOLC_MODEL_ID,
      messages:[
        {role:"system", content:sysPrompt},
        {role:"user", content:text}
      ],
      temperature:0.2
    },{
      headers:{
        "Authorization":`Bearer ${VOLC_API_KEY}`,
        "Content-Type":"application/json"
      }
    })
    return res.status(200).json(resp.data);
  }catch(err){
    console.error(err);
    return res.status(500).json({msg:"AI调用失败"});
  }
}
