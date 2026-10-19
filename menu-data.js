// 所有餐厅资料集中放在这里，方便以后增加餐厅或修改菜单。
// 新菜品加在对应的 menu 数组中；每道菜需要 name、description、chef、image、price。
// 菜品的 image 请指向 images/web/ 中的压缩版照片，原图留在 images/ 备份。
// 今日公开营业的餐厅代码：只改这一行即可。例如 ["2171", "SDFJ"] 表示两家营业。
// 秘密餐厅不放进名单，仍可用它自己的代码进入，也不计入首页数量。
const openRestaurantCodes = ["2171", "SDFJ", "KIMCHI"];

const restaurants = [
  {
    name: "十八楼烧麦",
    code: "SDFJ",
   // theme: "云端点心铺",
    description: "电梯升到十八楼，蒸笼刚好揭盖。这里把熟悉的街坊点心，装进一场轻盈的云端夜宴。",
    colors: {
      accent: "#d14f35",
      dark: "#76291f",
      soft: "#f4c9ad",
      paper: "#f8efe2"
    },
    menu: [
      { name: "招牌大烧麦", description: "四代手艺传承，绝不预制，每一口都是不同的感受。", chef: "李飞", image: "images/web/IMG_1086.jpg", price: 28 },
      { name: "热巧克力", description: "来自异国的青春风味，回到那个纯真的年代。", chef: "文师傅，鑫师傅", image: "images/web/IMG_1072.jpg", price: 18 },
      { name: "左岸咖啡", description: "塞纳河畔，回到故事最初的地方。", chef: "文师傅，鑫师傅", image: "images/web/IMG_1073.jpg", price: 24 },
      { name: "彩虹大福", description: "香草味是主厨的最爱哦。", chef: "文师傅，鑫师傅", image: "images/web/IMG_1079.jpg", price: 15 }
    ]
  },
  {
    name: "泡菜放题",
    code: "KIMCHI",
   // theme: "霓虹发酵所",
    description: "酸、辣、脆在霓虹灯下集合。这里的每道菜都围绕泡菜展开，热闹得像一场不会散场的深夜派对。",
    colors: {
      accent: "#e38940af",
      dark: "#b4691e",
      soft: "#e2bb3cd7",
      paper: "#fffdf0"
    },
    menu: [
      { name: "炽热意面", description: "eat it up,eat it up.", chef: "五炽", image: "images/web/IMG_1074.jpg", price: 36 },
      { name: "杏仁巧克力", description: "Almond chocolate,外表甜蜜滋味苦涩。", chef: "五礼", image: "images/web/IMG_1075.jpg", price: 28 },
      { name: "韩式烤五花肉", description: "主厨尝遍全韩国烤肉总结出的秘方。", chef: "田大厨", image: "images/web/IMG_1076.jpg", price: 91 },
      { name: "清爽冷面", description: "酸甜可口，清凉解腻，放了薄荷哦。", chef: "闵chef", image: "images/web/IMG_1077.jpg", price: 39 },
      { name: "桔梗花茶", description: "Tiffany特调，仅此一家。", chef: "训主厨，伦主厨", image: "images/web/IMG_1078.jpg", price: 20 }
    ]
  },
  {
    name: "天鹅大酒楼",
    code: "2171",
   // theme: "湖畔怀旧宴",
    description: "水晶灯亮起，白天鹅掠过窗外的湖面。在这里品尝家的味道，适合慢慢吃、慢慢聊。",
    colors: {
      accent: "#4761b6",
      dark: "#15296b",
      soft: "#89abeb",
      paper: "#eef6f2"
    },
    menu: [
      { name: "红烧排骨", description: "精选猪肋排，慢炖至肉质酥烂，色泽红亮，来自妈妈的味道。", chef: "李师傅", image: "images/web/IMG_1068.jpg", price: 58 },
      { name: "卤牛肉", description: "精选牛肉，经过特制卤料慢煮，肉质鲜嫩，香气扑鼻。", chef: "李师傅", image: "images/web/IMG_1069.jpg", price: 68 },
      { name: "酸辣白菜", description: "酸辣开胃，清爽解腻。", chef: "张师傅", image: "images/web/IMG_1070.jpg", price: 18 },
      { name: "番茄鸡蛋面", description: "番茄的酸甜与鸡蛋的香滑完美融合，限量供应。", chef: "张师傅", image: "images/web/IMG_1071.jpg", price: 16 },
      { name: "番茄炖牛腩", description: "精选澳洲牛肉，番茄与牛腩的完美结合，汤汁浓郁。", chef: "小张师傅", image: "images/web/IMG_1081.jpg", price: 42 },
      { name: "蒜香蒸菜", description: "时令蔬菜，每一口都感受到新鲜。", chef: "李师傅", image: "images/web/IMG_1092.jpg", price: 28 },
      { name: "秘制凉拌菜", description: "独家凉拌汁，品尝不一样的味道。", chef: "张师傅", image: "images/web/IMG_1093.jpg", price: 18 },
      { name: "茶叶蛋", description: "出口到澳大利亚的特色小吃。", chef: "小张师傅", image: "images/web/IMG_1096.jpg", price: 2 },
      { name: "蛋白冲剂（一杯）", description: "每天要吃够蛋白质哦。", chef: "李师傅", image: "images/web/IMG_1094.jpg", price: 8 },
      { name: "蜂蜜水（一杯）", description: "甜而不腻，暖心暖胃，主厨的最爱。", chef: "张师傅", image: "images/web/IMG_1095.jpg", price: 8 }
    ]
  },
  {
    name: "Northern Hemisphere Bar",
    code: "MOONRIDE",
    secret: true, // 隐藏餐厅：只能通过代码进入，不参与首页的公开名单。
    //theme: "AFTER DARK · 月轨酒吧",
    description: "回到北半球，循着回忆抵达一间只为知情者亮灯的小酒吧。这里的菜单随着星光展开。",
    colors: {
      accent: "#233a58",
      dark: "#1a304c",
      soft: "#c8d7e8",
      paper: "#eaf0f7"
    },
    menu: [
      { name: "照烧鸡腿饭", description: "精选澳洲鸡肉，复刻家乡味道。", chef: "欣主厨", image: "images/web/IMG_1080.jpg", price: 32 },
      { name: "红酸汤刀削面", description: "来自贵州的红酸汤，酸辣开胃。", chef: "芳主厨", image: "images/web/IMG_1082.jpg", price: 28 },
      { name: "黑椒菲力牛排", description: "精选澳大利亚安格斯牛肉，简单调味极致美味。", chef: "芳主厨", image: "images/web/IMG_1105.jpg", price: 46 },
      { name: "泡菜肉丸番茄意面", description: "泡菜的酸甜与肉丸的鲜美，完美融合。", chef: "欣主厨", image: "images/web/IMG_1107.jpg", price: 36 },
      { name: "火腿鸡蛋辣炒乌冬面", description: "韩式辣酱浸入软弹的乌冬面，每一口都是享受。", chef: "芳主厨", image: "images/web/IMG_1106.jpg", price: 30 },
      { name: "葡萄冰茶特调", description: "葡萄与冰茶的完美结合，就像我们每一次旅程。", chef: "欣主厨，芳主厨", image: "images/web/IMG_1083.jpg", price: 24 },
      { name: "椰林飘香", description: "养乐多与椰奶，意料之外的美好。", chef: "欣主厨，芳主厨", image: "images/web/IMG_1084.jpg", price: 22 },
      { name: "菠萝菠萝蜜", description: "菠萝加入伏特加，带来热带风情。", chef: "欣主厨，芳主厨", image: "images/web/IMG_1114.jpg", price: 18 },
      { name: "雪山晚霞", description: "草莓融化在椰子酒中，如梦如幻。", chef: "欣主厨", image: "images/web/IMG_1112.jpg", price: 20 },
      { name: "落日醉金", description: "将橘香和威士忌溶入余晖中。", chef: "芳主厨", image: "images/web/IMG_1109.jpg", price: 22 },
      { name: "魔法药水", description: "葡萄养乐多与朗姆的碰撞，带来夜色的神秘。", chef: "欣主厨", image: "images/web/IMG_1110.jpg", price: 18 }
    ]
  }
];
