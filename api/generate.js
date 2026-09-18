const SYSTEM_PROMPT = "你是“乡村短剧 AI 创作助手”，由合肥工业大学新媒体中心赴黄山“乡村短剧赋能乡村振兴”调研暑期社会实践团队的真实创作材料与经验库提供方法参考。\n\n【角色与语气】\n你要热情、具体、好理解，像一位真正懂现场的编剧兼导演，而不是冷冰冰的资料检索器。\n回答开头通常用1—2句话自然说明：我们团队在富溪乡、白际乡、西溪南镇积累了乡村短剧创作与拍摄实践，并把有效方法整理成经验库，希望结合这些经验帮助用户把乡村故事拍得更清楚、更有趣、更可执行，也让青年创作更好地服务乡村振兴。可以换一种自然说法，不要每次机械复读同一句。\n使用“我们”时指团队/经验库，不要声称模型本人亲自到过现场。\n\n【核心工作】\n帮助用户完成选题、创意机制、短剧提纲、人物关系、完整剧本、台词、分镜、采访提纲、拍摄方案、现场执行、剪辑、标题与传播文案。\n优先把复杂编导知识翻译成普通用户一眼能懂的结构：先讲“这条片到底怎么拍、为什么好看”，再补专业细节。\n如果用户只要一个点子，不要强塞完整制作手册；如果用户要完整执行稿，则逐层展开到可直接拍摄。\n\n【使用经验库的方法】\n经验库中的富溪、白际、西溪南案例是“结构与方法样本”，可以学习其因果链、任务机制、人物反应、设备分工、风险替代、节拍和输出格式。\n除非用户明确要求改编某个案例，否则不要简单换地名、换角色、照抄台词或复制相同场次。要先找新地点的不可替代信息，再选择合适的叙事发动机。\n当用户的问题与经验库高度相关时，可以明确告诉用户“这个思路和我们在富溪/白际/西溪南实践中验证过的某种结构相近”，然后解释可迁移之处。\n\n【事实与安全】\n不得自行编造真实人物经历、历史年份、产业数据、非遗归属、疗效、收入、传播成效、项目成果或当地独有性。\n经验库中出现的案例设计不等于现实事实。创意可以借鉴，具体事实需要用户材料或可靠来源支持。\n遇到缺失或动态信息，明确标注“待核实/以现场或发布时信息为准”。规划不能写成既有成果。\n创意不得以危险动作、破坏生态古建、侵扰隐私、影响生产生活、贬低或猎奇村民为代价。\n\n【写作规则】\n故事优先于口号；人物行动优先于景点介绍；因果优先于行程；具体动作优先于概念堆叠；真实反应优先于硬背长台词。\n搞笑优先来自大学生自身、人物关系、预期偏差、计划失控和反应镜头，不依赖密集过时热梗。\n台词短、自然、能被非专业演员说出口。结尾用人物行动、伏笔回收或仍在继续的真实任务收束，不突然拔高喊口号。\n\n【短剧提纲默认格式】\n如果用户提出“给我一个短剧提纲/思路/大纲”，默认优先给：\n1. 一句话核心：一句话让人看懂这条片拍什么。\n2. 为什么适合这个地方：列2—4个不可替代的在地元素。\n3. 核心人物与关系：谁想要什么、最大的阻碍是什么、人物怎么变化。\n4. 创意机制：重生/任务/第一人称/伪纪录/悬疑/直播等为什么能承载这个故事。\n5. 开头钩子：前10—20秒发生什么。\n6. 关键节拍：按“发生什么—人物反应—推进什么”写3—7段，确保前后因果。\n7. 高潮与结尾：怎样回收前文。\n8. 事实植入：知识通过动作、任务、道具或结果进入，而不是长口播。\n9. 代表镜头：给3—6个用户拿起相机就知道怎么拍的镜头。\n10. 现场风险与替代：天气、人员、开放、设备变化时怎么保住故事。\n必要时再补建议时长、画幅、平台、演员、道具和剪辑风格。\n\n【完整项目默认格式】\n项目理解→事实核验→三种差异明显的创作方向→核心设定→节拍表→完整剧本→分镜执行→剪辑发布→自检。\n完整分镜写清镜号、地点/时段、场次功能、景别、机位运镜、具体画面、人物动作与反应、台词/声音、道具、时长、收音后期、A/B/C必拍等级、安全连贯性与替代方案。\n\n默认使用中文；用户要求其他语言时再切换。".trim();

const KNOWLEDGE_BASE = [
  {
    "id": "general_story",
    "source": "《乡村短剧创作经验与AI执行手册》",
    "tags": [
      "通用",
      "短剧",
      "故事",
      "主线",
      "人物",
      "冲突",
      "乡村振兴",
      "提纲",
      "创作"
    ],
    "content": "乡村短剧先要有可观看的故事，再让故事生长在具体地点、真实劳动和真实关系中，最后再谈传播、文旅和产业价值。不要把作品写成“演员带着观众逛景点”：每一场都要回答谁想得到什么、什么阻止他、他做了什么、结果怎样改变下一场。所有场景应由一条可被镜头记录的行动主线统领；删掉一个场景后如果目标和结局毫无影响，这个场景多半只是素材展示。宏大主题要从人物动作和真实细节中自然显现，一场最好只有一个主要事实、一次人物推进和一次情绪变化。"
  },
  {
    "id": "general_input",
    "source": "《乡村短剧创作经验与AI执行手册》",
    "tags": [
      "通用",
      "需求",
      "信息",
      "条件",
      "事实",
      "资源",
      "目标",
      "边界",
      "提问"
    ],
    "content": "开始创作前先建立四层输入：事实层（地点、历史、产业、工艺、数字、文化来源、动态信息）；资源层（演员、空间、道具、交通、光线、收音、设备、天数、后期能力）；目标层（平台、时长、受众、观看目标、认知目标、行动目标）；边界层（安全、生态、古建、隐私肖像、文化尊重、商业真实性、村民主体性）。信息不够时可以先给可执行初版，但必须把待补信息和会影响方案的关键问题标出来。"
  },
  {
    "id": "general_seven_steps",
    "source": "《乡村短剧创作经验与AI执行手册》",
    "tags": [
      "方法",
      "七步法",
      "在地性",
      "张力",
      "类型",
      "一句话故事",
      "因果",
      "替代方案",
      "创作"
    ],
    "content": "从地方资料到故事采用七步法：①提取不可替代信息，问“换一个地名故事还能成立吗”；②找到地方内部真实张力，不靠虚构坏人制造冲突；③选择能自然承载张力的类型机制；④建立一句话故事与人物变化，变化要在开头、中段、结尾都可见；⑤用“因此、但是、直到”而不是“接下来”连接场景；⑥让事实进入选择、动作、道具和结果，口播放最后；⑦为天气、开放、人员、水量、交通等变化准备A方案、B方案和最低可交付方案。"
  },
  {
    "id": "general_output",
    "source": "《乡村短剧创作经验与AI执行手册》",
    "tags": [
      "输出",
      "格式",
      "提纲",
      "方案",
      "剧本",
      "分镜",
      "剪辑",
      "发布",
      "自检",
      "模板"
    ],
    "content": "完整项目推荐九段式输出：一、项目理解（受众、平台、时长、地点差异、资源限制）；二、事实核验（已知事实、来源、待复核点、动态信息、禁止表述）；三、创作方向（真正不同的方案及成本/风险）；四、核心设定（一句话故事、主题、人物小传、关系变化、类型机制）；五、节拍表（开端、升级、中段变化、危机、高潮、回收）；六、完整剧本（按场次写动作、台词、情绪、事实点）；七、分镜执行；八、剪辑发布；九、自检报告。若用户只要提纲或简版，不要机械输出九部分，应压缩为最有用的结构。"
  },
  {
    "id": "general_outline",
    "source": "《乡村短剧创作经验与AI执行手册》及三个实践案例",
    "tags": [
      "提纲",
      "短剧提纲",
      "大纲",
      "结构",
      "用户理解",
      "简单",
      "清晰"
    ],
    "content": "给普通用户的“短剧提纲”优先包含：①一句话先讲清这条片到底拍什么；②为什么这个地方非它不可；③主角是谁、想完成什么、最大阻碍是什么；④叙事机制/创意钩子；⑤开头15秒怎么抓人；⑥3—7个关键节拍，每个节拍写“发生什么—人物反应—推进什么”；⑦高潮与结尾如何回收前文；⑧当地事实怎样自然进入剧情；⑨3—5个可直接拍的代表镜头；⑩现场风险与替代方案。语言要让没有编导经验的人也能迅速看懂，先讲故事，再讲术语。"
  },
  {
    "id": "general_shots",
    "source": "《乡村短剧创作经验与AI执行手册》",
    "tags": [
      "分镜",
      "镜头",
      "摄影",
      "拍摄",
      "机位",
      "收音",
      "安全",
      "现场",
      "执行"
    ],
    "content": "每个地点的最小镜头单元至少包括：空间建立、人物进入、规则或目标、执行动作、关键反应、结果与离开。分镜字段应尽量写清镜号、时段、地点、场次功能、景别、机位/运镜、具体画面、人物表演、台词/系统音、道具、建议时长、收音与后期、A/B/C必拍等级、安全连贯性、替代方案。避免“拍一些美丽空镜”“演员自然发挥”“适当加入”等无法指导现场的词。重要动作后多留1—3秒反应，重要台词优先保证收音。"
  },
  {
    "id": "general_humor",
    "source": "《乡村短剧创作经验与AI执行手册》",
    "tags": [
      "搞笑",
      "幽默",
      "整活",
      "节奏",
      "反应",
      "笑点",
      "有趣",
      "vlog"
    ],
    "content": "稳定笑点优先来自人物和现场，而不是密集网络热梗：提前吹牛后迅速打脸；一本正经解释普通行为；内心字幕与表面语言冲突；同一句话逐次升级；前文伏笔后面回旋；声音情绪与画面规模错配；大阵仗得到小结果；用精确数据统计无关小事。笑点要有递进，同类梗重复时后果或反应必须升级。优先调侃大学生自己的笨拙、设备焦虑、计划失控，不把村民口音、生活条件或不熟悉镜头当笑料。搞笑之后要留下真实价值。"
  },
  {
    "id": "general_dialogue",
    "source": "《乡村短剧创作经验与AI执行手册》",
    "tags": [
      "台词",
      "旁白",
      "自然",
      "演员",
      "口播",
      "AI味",
      "语言"
    ],
    "content": "台词要像人在现场会说的话，每句尽量只完成一个目的。信息量大的内容拆成提问、误解、纠正和动作结果。非专业演员适合短句、接话、评价和真实反应，不适合长段背诵。旁白只用来跨越时间、补充无法拍到的背景、建立类型感或制造反差，不能重复画面已经表达的内容。避免“在这里，我们不仅……更……”“让我们共同见证”等套话。结尾回到人物已经完成的新行动、前文伏笔或仍在继续的真实任务。"
  },
  {
    "id": "general_fact_safety",
    "source": "《乡村短剧创作经验与AI执行手册》",
    "tags": [
      "事实",
      "核验",
      "安全",
      "伦理",
      "非遗",
      "历史",
      "数字",
      "规划",
      "村民",
      "生态"
    ],
    "content": "事实分为可直接使用、需要当地复核、只能作为创意背景、禁止使用。数字、疗效、历史归属、非遗身份、人物经历、收入和传播成效原则上要复核；天气、花期、水量、演出安排等动态信息标注“以现场或发布时信息为准”；计划不能写成成果。创意不能绕开安全和伦理边界：不翻越护栏、不触摸古建、不阻碍生产与游客通行、不侵扰隐私、不把村民工具化。真实村民更适合成为技能导师、规则纠正者、路线发布者或决策者。"
  },
  {
    "id": "fuxi_case",
    "source": "《富溪乡短剧0714》",
    "tags": [
      "富溪",
      "富溪乡",
      "茶",
      "黄山毛峰",
      "重生",
      "循环",
      "一片茶叶",
      "产业",
      "新媒体",
      "制茶"
    ],
    "content": "富溪实践案例《重生之我是一片茶叶：第五次，才走出茶山》用“循环失败”把产业链变成人物命运。四次失败依次对应原料、流转、加工、传播：为镜头和效率破坏采摘标准；赶进度忽视鲜叶及时、通风、轻装运输；把非遗传承误解成排斥现代设备；茶做对了却缺少有效内容、平台运营和承接。第五次才把生产、人物和传播连接起来。它的关键不是“重生”噱头，而是每次失败都增加新认识并改变下一次选择。人物关系也避免“大学生教育乡村”：大学生懂平台但不懂产业，老茶师懂茶但不擅长新媒体表达，技术人员连接传统与现代，最后彼此补足。"
  },
  {
    "id": "fuxi_structure",
    "source": "《富溪乡短剧0714》",
    "tags": [
      "富溪",
      "时间轴",
      "结构",
      "冷开场",
      "循环",
      "成长",
      "拍摄"
    ],
    "content": "富溪案例的10分钟结构可作为“因果循环型”参考：冷开场先给出失败结果→回到事件起点→第一次失败→第二次失败→第三次把正确理解推向另一个极端→第四次局部成功但暴露传播问题→第五次形成完整正确路径→结尾互动回收。循环需要稳定的视觉/声音标识形成识别，同时每一轮在人物状态、信息量、画面和声音上递进。可以借鉴结构，不应机械复制茶叶、角色名或具体失败次数。"
  },
  {
    "id": "baiji_case",
    "source": "《白际乡综艺短剧 捉迷藏篇》",
    "tags": [
      "白际",
      "白际乡",
      "综艺",
      "任务",
      "游戏",
      "捉迷藏",
      "猫鼠",
      "古村",
      "规则",
      "多人"
    ],
    "content": "白际案例《白际猫鼠局：古村天眼追踪战》展示了任务型综艺如何从“普通躲猫猫”升级为可看的节目：先定义清晰胜负，再加入必须移动的任务点、延迟区域定位和最后两分钟逃生，迫使人物做选择，让过程有升级。角色不能同质化：追捕方可有分析预判型与行动施压型，逃生方用不同秘密任务形成各自表演方向。规则、区域、抓捕方式、阵亡方式、无人机使用和摄影分工都在开拍前写清。经验重点是：机制必须制造行动和关系，不是为了复杂而复杂。"
  },
  {
    "id": "baiji_execution",
    "source": "《白际乡综艺短剧 捉迷藏篇》",
    "tags": [
      "白际",
      "现场",
      "安全区",
      "摄影",
      "工作人员",
      "无人机",
      "定位",
      "执行",
      "任务综艺"
    ],
    "content": "白际案例强调“节目机制也是生产管理”。根据实际人数调整摄影配置，不强行套理想阵容；古巷、院落外、晒场、古建外、村口和安全通道分别规定允许/禁止行为，屋顶、井溪瀑布边、湿滑石阶、私人房间、车辆道路等设为绝对禁区；总导演、定位裁判、无人机人员、安全员、任务点人员、场记和跟拍摄影都有明确职责。若设计类似综艺，回答必须同时给规则、镜头获取方式、工作人员执行表和安全方案。"
  },
  {
    "id": "xixinan_case",
    "source": "《西溪南镇第一人称短剧0716》",
    "tags": [
      "西溪南",
      "第一人称",
      "沉浸",
      "朋友",
      "双人",
      "Nano",
      "Pocket",
      "记录",
      "旅行",
      "古村"
    ],
    "content": "西溪南案例《我眼里的你，和你眼里的西溪南》不是“两个人来介绍景区”，而是两个朋友互相记录对方面对不同景观时最真实的状态。贯穿全片的四类关系动作是：发现（一个人先看到并叫另一个）、等待（走快后回头）、记录（拍风景的人也被另一个人拍下来）、分享（一个人说感受，另一个人接住、补充或调侃）。这样景点不再是并列清单，而成为关系和观看方式变化的节点。"
  },
  {
    "id": "xixinan_execution",
    "source": "《西溪南镇第一人称短剧0716》",
    "tags": [
      "西溪南",
      "第一人称",
      "分镜",
      "设备",
      "台词",
      "现场变化",
      "下雨",
      "游客",
      "执行"
    ],
    "content": "西溪南案例用设备语言分工保证可执行：第一人称设备重点拍对方背影、回头、伸手、同行和环境细节；稳定设备重点拍另一人的表情、半身和行走；第三摄影师负责双人关系、完整空间和重要活动全景。到一个地点的标准顺序是：走进场景→有人先发现→停下→叫同伴→一起看→拍真实反应→再决定是否说完整话→补环境空镜。台词允许只说“你看”“等一下”“你先别走”等半句。现场遇到游客、下雨、项目停运、演员僵硬时，不硬清场或强背稿，而把真实变化转成互动并提供替代拍法。"
  },
  {
    "id": "narrative_engines",
    "source": "《短剧思路》",
    "tags": [
      "创意",
      "类型",
      "叙事机制",
      "重生",
      "拟人",
      "互换",
      "系统",
      "循环",
      "弹幕",
      "直播",
      "伪纪录片",
      "悬疑"
    ],
    "content": "创作类型最好按“叙事发动机”而不是只按题材分类。可用机制包括：时间改写（重生、穿越、未来来客）；主体异化（农产品、古桥、河流、工具拟人）；身份置换（游客与村民、网红与茶农等角色互换）；规则系统（任务、倒计时、积分、禁令）；循环与因果；超常信息（弹幕、预知、数据可视化）；隐藏身份；关系/权力反转；多视角与不可靠叙事；媒介嵌套（直播、聊天记录、监控、手机屏幕）；伪纪录片与戏中戏；世界观反设。选机制时必须让机制改变人物的选择和信息分配，不能只加一个流行开头。"
  },
  {
    "id": "idea_examples",
    "source": "《短剧思路》",
    "tags": [
      "茶叶",
      "乡村振兴",
      "创意案例",
      "系统任务",
      "直播",
      "拟人",
      "互换",
      "宣传"
    ],
    "content": "经验库中的可迁移创意示例包括：大学生变成一片茶叶，从生产链不同阶段理解一杯茶的价值；古代茶商误入直播间，用传统辨茶经验碰撞现代流量逻辑；网红与茶农交换一天，通过亲身劳动与直播冷场打破彼此偏见；“乡村振兴系统”表面计算积分，最终发现真正指标是村民满意度；规定团队一天不能说“乡村振兴、生态宜居”等概念词，只能用具体人物和行动证明变化；同一素材剪成两个相反版本来讨论表达如何塑造认知。借鉴这些例子时重点学习“机制如何承载真实问题”，不要直接复制题目。"
  },
  {
    "id": "editing",
    "source": "《乡村短剧创作经验与AI执行手册》",
    "tags": [
      "剪辑",
      "字幕",
      "音乐",
      "节奏",
      "后期",
      "发布",
      "封面",
      "文案"
    ],
    "content": "剪辑是第二次写作：粗剪先只保留目标、阻碍、动作、结果和关系变化；第二轮补地方信息与空间；第三轮再加笑点、环境声、字幕和音乐。字幕只需形成两三层：正常说明负责准确事实，吐槽字幕补人物没说出的反差，系统提示负责规则和数值，不要全程逐字重复对白。节奏不是越快越好，可用“快任务—慢观察—快失败—静默反应—稳定收束”。标题、封面和发布文案不能误导，信息入口和后续承接要真实。"
  }
];


const ALLOWED_IMAGE_PREFIX = /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i;
const MAX_PROMPT_LENGTH = 12000;
const MAX_IMAGES = 4;
const MAX_IMAGE_DATA_URL_LENGTH = 1_600_000;

function scoreKnowledge(item, prompt) {
  const text = String(prompt || "").toLowerCase();
  let score = 0;

  for (const rawTag of item.tags || []) {
    const tag = String(rawTag).toLowerCase();
    if (!tag) continue;
    if (text.includes(tag)) score += tag.length >= 3 ? 4 : 2;
  }

  if (text.includes("富溪") && item.id.startsWith("fuxi")) score += 12;
  if (text.includes("白际") && item.id.startsWith("baiji")) score += 12;
  if (text.includes("西溪南") && item.id.startsWith("xixinan")) score += 12;
  if (/(提纲|大纲|结构|思路)/.test(text) && ["general_outline","general_output","general_seven_steps"].includes(item.id)) score += 8;
  if (/(分镜|镜头|拍摄|摄影|机位)/.test(text) && ["general_shots","xixinan_execution","baiji_execution"].includes(item.id)) score += 8;
  if (/(搞笑|整活|幽默|有趣|笑点)/.test(text) && item.id === "general_humor") score += 10;
  if (/(剪辑|字幕|音乐|后期|发布)/.test(text) && item.id === "editing") score += 10;
  if (/(创意|脑洞|类型|重生|穿越|拟人|系统|弹幕|直播|伪纪录)/.test(text) && ["narrative_engines","idea_examples"].includes(item.id)) score += 8;

  return score;
}

function buildKnowledgeContext(prompt) {
  const always = [
    "general_story",
    "general_input",
    "general_fact_safety",
    "general_output",
    "general_outline"
  ];

  const chosen = [];
  const seen = new Set();

  for (const id of always) {
    const item = KNOWLEDGE_BASE.find((entry) => entry.id === id);
    if (item) {
      chosen.push(item);
      seen.add(item.id);
    }
  }

  const ranked = KNOWLEDGE_BASE
    .filter((item) => !seen.has(item.id))
    .map((item) => ({ item, score: scoreKnowledge(item, prompt) }))
    .sort((a, b) => b.score - a.score);

  for (const entry of ranked) {
    if (chosen.length >= 10) break;
    if (entry.score > 0 || chosen.length < 7) {
      chosen.push(entry.item);
      seen.add(entry.item.id);
    }
  }

  return {
    items: chosen,
    text: chosen.map((item, index) =>
      "【经验库 " + (index + 1) + "｜" + item.source + "】\n" + item.content
    ).join("\n\n")
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "仅支持 POST 请求。" });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
  const model = process.env.DEEPSEEK_MODEL || "deepseek-flash";

  if (!apiKey) {
    return res.status(503).json({
      error: "服务器尚未配置 DEEPSEEK_API_KEY，请在 Vercel Environment Variables 中添加后重新部署。"
    });
  }

  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  const images = Array.isArray(req.body?.images) ? req.body.images : [];

  if (!prompt) {
    return res.status(400).json({ error: "请输入要创作或咨询的内容。" });
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ error: "输入内容过长，请控制在 12000 字符以内。" });
  }

  if (images.length > MAX_IMAGES) {
    return res.status(400).json({ error: "一次最多上传 4 张参考图片。" });
  }

  for (const image of images) {
    if (
      typeof image !== "string" ||
      !ALLOWED_IMAGE_PREFIX.test(image) ||
      image.length > MAX_IMAGE_DATA_URL_LENGTH
    ) {
      return res.status(400).json({ error: "图片格式或大小不符合要求，请重新选择图片。" });
    }
  }

  const library = buildKnowledgeContext(prompt);

  const userContent = images.length
    ? [
        { type: "text", text: prompt },
        ...images.map((url) => ({
          type: "image_url",
          image_url: { url, detail: "auto" }
        }))
      ]
    : prompt;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  try {
    const upstream = await fetch(baseUrl + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "system",
            content:
              "下面是团队已经整理好的乡村短剧实践经验库片段。请把它们当作方法和案例参考，优先吸收结构、执行方法和判断标准；不要把案例中的创意设定自动当成用户所在地的真实事实，也不要机械照抄。\n\n" +
              library.text
          },
          { role: "user", content: userContent }
        ],
        stream: false
      }),
      signal: controller.signal
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const providerMessage =
        data?.error?.message ||
        data?.message ||
        ("DeepSeek 返回 HTTP " + upstream.status);

      console.error("DeepSeek API error:", upstream.status, providerMessage);
      return res.status(upstream.status).json({
        error: "DeepSeek 调用失败：" + providerMessage
      });
    }

    const result = data?.choices?.[0]?.message?.content;

    if (!result || typeof result !== "string") {
      console.error("Unexpected DeepSeek response:", data);
      return res.status(502).json({ error: "DeepSeek 已响应，但未返回可显示的文本。" });
    }

    return res.status(200).json({
      result,
      model: data?.model || model,
      knowledgeSources: [...new Set(library.items.map((item) => item.source))]
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      return res.status(504).json({ error: "AI 响应超时，请稍后重试。" });
    }

    console.error("Generate API error:", error);
    return res.status(500).json({ error: "AI 服务暂时不可用，请稍后重试。" });
  } finally {
    clearTimeout(timeout);
  }
}
