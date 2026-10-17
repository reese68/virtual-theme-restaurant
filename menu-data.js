// 所有餐厅资料集中放在这里，方便以后增加餐厅或修改菜单。
// 新菜品加在对应的 menu 数组中；每道菜需要 name、description、chef、image、price。
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
      { name: "招牌大烧麦", description: "四代手艺传承，绝不预制，每一口都是不同的感受。", chef: "李飞", image: "images/dim-sum.svg", price: 18 },
      { name: "热巧克力", description: "来自异国的青春风味，带你回到那个纯真的年代。", chef: "热茶", image: "images/dim-sum.svg", price: 24 },
      { name: "左岸咖啡", description: "塞纳河畔，回到故事最初的地方。", chef: "文师傅，鑫师傅", image: "images/dim-sum.svg", price: 32 },
      { name: "云朵杏仁茶", description: "温热杏仁茶盖一层细密奶泡，甜度轻柔。", chef: "林小满", image: "images/dim-sum.svg", price: 18 }
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
      { name: "爆浆泡菜芝士饼", description: "酥脆外壳夹着酸辣泡菜与拉丝芝士。", chef: "韩美娜", image: "images/kimchi.svg", price: 36 },
      { name: "霓虹年糕锅", description: "软糯年糕、鱼饼和泡菜，在甜辣汤汁中翻滚。", chef: "朴灿宇", image: "images/kimchi.svg", price: 48 },
      { name: "发酵星球拌饭", description: "焦香锅巴配七色蔬菜、泡菜与半熟蛋。", chef: "韩美娜", image: "images/kimchi.svg", price: 42 },
      { name: "柚子气泡冰", description: "清爽柚子汽水加碎冰，为辣味按下暂停键。", chef: "李夏天", image: "images/kimchi.svg", price: 20 }
    ]
  },
  {
    name: "天鹅大酒楼",
    code: "2171",
   // theme: "湖畔怀旧宴",
    description: "水晶灯亮起，白天鹅掠过想象中的湖面。经典酒楼菜在这里换上优雅的新装，适合慢慢吃、慢慢聊。",
    colors: {
      accent: "#4761b6",
      dark: "#15296b",
      soft: "#89abeb",
      paper: "#eef6f2"
    },
    menu: [
      { name: "红烧排骨", description: "精选猪肋排，慢炖至肉质酥烂，色泽红亮，来自妈妈的味道。", chef: "李师傅", image: "images/banquet.svg", price: 58 },
      { name: "卤牛肉", description: "精选牛肉，经过特制卤料慢煮，肉质鲜嫩，香气扑鼻。", chef: "李师傅", image: "images/banquet.svg", price: 68 },
      { name: "酸辣白菜", description: "酸辣开胃，清爽解腻。", chef: "张师傅", image: "images/banquet.svg", price: 16 },
      { name: "金玉满堂饺子", description: "手工饺子，三位师傅一起包制，皮薄馅大。", chef: "李、张、小张三位师傅", image: "images/banquet.svg", price: 36 }
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
      { name: "月轨气泡饮", description: "青柠、柚子与苏打轻轻碰杯，像夜空里升起的第一颗星。", chef: "Noah", image: "images/moonride.svg", price: 32 },
      { name: "北境香草烤串", description: "迷迭香与烟熏香料包裹蔬菜和嫩肉，趁热享用。", chef: "Ari", image: "images/moonride.svg", price: 46 },
      { name: "地平线黑松露薯角", description: "厚切薯角烤至金黄，撒上黑松露盐与帕尔马干酪。", chef: "Ari", image: "images/moonride.svg", price: 38 },
      { name: "午夜可可云", description: "微苦可可慕斯配轻盈奶霜，为秘密旅程画上句号。", chef: "Mira", image: "images/moonride.svg", price: 34 }
    ]
  }
];
