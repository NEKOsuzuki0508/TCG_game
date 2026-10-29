const OFFICIAL_SEED = [
  {
    "id": 1,
    "name": "みぃ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "歌が得意なちびっこ。自分や仲間が死にそうなときだけは強い。",
    "hp": 170,
    "attack": 40,
    "defense": 70,
    "speed": 60,
    "role": "公式カード",
    "traitName": "ふくつのこころ",
    "trait": "1回だけ、HPがターン開始時の半分を下回ったとき、そのターンに受けたダメージの半分HPを回復する。なお、このとくせいは自動で発動する。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "かくれんぼ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "「先手で敵に80ダメージ」か「後手で攻撃を受けない」を選択する。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "さそいのうたごえ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵を攻撃できなくさせ、30ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "みがわり",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "次のターン、敵はこのキャラクターしか攻撃できなくなる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 2,
    "name": "こまめ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "赤いめがねのおまめさん。誰にでもやさしい。",
    "hp": 180,
    "attack": 50,
    "defense": 50,
    "speed": 40,
    "role": "公式カード",
    "traitName": "こまめのおこぼれ",
    "trait": "1回だけフィールド上のすべての仲間のHPを最大値の半分まで回復する。なお、このとくせいを発動する際には、手順4で相手プレイヤーに宣言する必要がある。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "なかよくなる",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "いまフィールドに出ている敵の技がどれか一つ使えるようになる（1バトルにつき最大2こまで。コピーした技を使用するときは、もとのコストをそのまま支払う必要がある。）",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "からみづた",
        "cost": 1,
        "costText": "1MP+葉っぱカード",
        "special": [
          "葉っぱ"
        ],
        "desc": "次のターン、敵が攻撃できなくなる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 3,
    "name": "おきく",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "魔法使い見習い。菊のペンダントを着けている。植物魔法が得意。",
    "hp": 140,
    "attack": 50,
    "defense": 60,
    "speed": 70,
    "role": "公式カード",
    "traitName": "きせきのきずな",
    "trait": "仲間が敵から受けた攻撃で瀕死（残りHPが最大HPの10%以下の状態）になってしまうとき、1回だけその攻撃をこのキャラクターが受ける。なお、このとくせいを発動する際には、手順4で相手プレイヤーに宣言する必要がある。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "からみづた",
        "cost": 1,
        "costText": "1MP+葉っぱカード",
        "special": [
          "葉っぱ"
        ],
        "desc": "次のターン、敵が攻撃できなくなる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "きれいな花には",
        "cost": 1,
        "costText": "1MP+葉っぱカード",
        "special": [
          "葉っぱ"
        ],
        "desc": "確定先手を取り、敵に30ダメージ。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ふしぎのちから",
        "cost": 5,
        "costText": "5MP+やみカード",
        "special": [
          "やみ"
        ],
        "desc": "敵全体に確定70ダメージ。ただしバトル中に1回しか使えない",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 4,
    "name": "サツ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "大魔法使い。三角帽子を被っている。炎魔法が得意。",
    "hp": 170,
    "attack": 60,
    "defense": 40,
    "speed": 50,
    "role": "公式カード",
    "traitName": "きせきのきずな",
    "trait": "仲間が敵から受けた攻撃で瀕死（残りHPが最大HPの10%以下の状態）になってしまうとき、1回だけその攻撃をこのキャラクターが受ける。なお、このとくせいを発動する際には、手順4で相手プレイヤーに宣言する必要がある。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "青ののはら",
        "cost": 5,
        "costText": "5MP",
        "special": [],
        "desc": "敵を、そのキャラクターの次の行動順のとき、このキャラクターに対する攻撃をできなくしてから確定70ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "フレアル",
        "cost": 2,
        "costText": "2MP+ほのおカード",
        "special": [
          "ほのお"
        ],
        "desc": "敵に10ダメージ+やけど状態を付与",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ハピネ",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "使われた時点でフィールド上にいるすべてのキャラクターのHPを10回復",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 5,
    "name": "はりねずみ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "まるくてとげとげのはりねずみ。常に時間に追われている。",
    "hp": 130,
    "attack": 40,
    "defense": 60,
    "speed": 50,
    "role": "公式カード",
    "traitName": "いそぎのようじ",
    "trait": "1回だけ、ターン開始時にフィールドに出ている全ての仲間をベンチに連れ帰る。なお、このとくせいを発動する際には、手順4で相手プレイヤーに宣言する必要がある。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "まるもちほっぺ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵を、そのキャラクターの次の行動順のときに攻撃できなくする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "とげねずみ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に50ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 50
        }
      },
      {
        "name": "はりねずみのジレンマ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "「敵に70ダメージ」か「次にこのキャラクターが受ける攻撃を防ぐ」のどちらかを選択する。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 6,
    "name": "シン",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "詩人。本人的にはあまり掘り起こされたくない記憶。",
    "hp": 140,
    "attack": 60,
    "defense": 40,
    "speed": 50,
    "role": "公式カード",
    "traitName": "やみへのさそい",
    "trait": "このキャラクターが死んだとき、このキャラクターと同じ技を持っているフィールド上の敵がランダムで1人道連れにされる",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "やまとうたは",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に30ダメージを与え、次のターンその敵は攻撃できなくなる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "シータを求めよ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "使ったターン、このキャラクターは必ず先手を取り、敵はこのキャラクターに攻撃できなくなる。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 7,
    "name": "コサ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "ファンタジー小説家。設定を練るのは好き。",
    "hp": 160,
    "attack": 60,
    "defense": 50,
    "speed": 50,
    "role": "公式カード",
    "traitName": "もうそうへき",
    "trait": "このキャラクターが初めてフィールドに出たとき、フィールドに出ている敵の技がランダムでどれか一つ使えるようになる",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "さくしゃの都合",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "フィールド上にいるキャラクターのうち誰か1人のHPを、±40までの範囲で変えられる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "シータを求めよ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "使われたターン、このキャラクターは必ず先手を取り、敵はこのキャラクターに攻撃できなくなる。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 8,
    "name": "タンジェ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "恋愛小説家。ドロドロの恋愛ものが好き。そろそろ引退予定。",
    "hp": 150,
    "attack": 50,
    "defense": 40,
    "speed": 60,
    "role": "公式カード",
    "traitName": "せいかん",
    "trait": "自分への攻撃を25%で味方の別のキャラクターに押し付ける",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "どろぬま",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵がフィールド上に2人以上いるとき、ランダムで2人の攻撃を味方のキャラクター1人のみに当たるようにする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "シータを求めよ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "使われたターン、このキャラクターは必ず先手を取り、敵はこのキャラクターに攻撃できなくなる。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 9,
    "name": "こはく",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "探偵事務所ジュエリーを経営している名探偵。愛猫家。",
    "hp": 150,
    "attack": 50,
    "defense": 60,
    "speed": 80,
    "role": "公式カード",
    "traitName": "みやぶり",
    "trait": "このキャラクターがフィールドにいる間、敵が次のターンに選ぼうとしている技が1回だけ事前にわかる。なお、このとくせいを発動する際には、手順4で相手プレイヤーに宣言する必要がある。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "裏の裏は",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵が攻撃技を選択していた場合その攻撃分のダメージをその敵に与え、相手が防御技・補助技を選択していたらこのキャラクターに確定50ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ぬすみどり",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "この技が使われた時点でフィールドに出ているキャラクターの技をどれか一つ発動する",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "「さて―」",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵を一人指定する（ただし、GMにのみ伝える）。その敵がとくせいを発動しようとした場合、それを防ぐ。発動しようとしなかった場合は、その敵の左隣のキャラクター（いなければ右隣のキャラクター）に40ダメージ。なお、この技を発動する際には、手順6でGMに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 10,
    "name": "るり",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "探偵事務所ジュエリーの看板猫。黒猫で、濃い青色の瞳を持つ。",
    "hp": 190,
    "attack": 70,
    "defense": 50,
    "speed": 90,
    "role": "公式カード",
    "traitName": "こねこのひとみ",
    "trait": "このキャラクターは、攻撃時、20%でこのキャラクターが攻撃した敵が次の行動時に攻撃できなくなる",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "なかよくなる",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "いまフィールドに出ている敵の技がどれか一つ使えるようになる（1バトルにつき最大2こまで。コピーした技を使用するときは、もとのコストをそのまま支払う必要がある。）",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 11,
    "name": "WHO",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "謎の犯罪者。間違っても国連の機関ではない。",
    "hp": 140,
    "attack": 70,
    "defense": 30,
    "speed": 40,
    "role": "公式カード",
    "traitName": "やみへのさそい",
    "trait": "このキャラクターが死んだとき、このキャラクターと同じ技を持っているフィールド上の敵のキャラクターがランダムで1人道連れにされる",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ぬすみどり",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "この技が使われた時点でフィールドに出ているキャラクターの技をどれか一つ発動する",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "トリックスター",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "発動したターン、すべてのフィールド上のキャラクターのすばやさを50にする。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "銀の弾丸",
        "cost": 2,
        "costText": "2MP+やみカード",
        "special": [
          "やみ"
        ],
        "desc": "使用したターン、選択した敵を行動できなくする。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 12,
    "name": "ラポーレ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "魔物世界の入り口を守る門番。体重も性格もどっしりしてる。",
    "hp": 200,
    "attack": 50,
    "defense": 70,
    "speed": 30,
    "role": "公式カード",
    "traitName": "もんばん",
    "trait": "やみカードを必要とする技の効果を受けない",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "泉のいりぐち",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "山札からMPカードを2枚引く",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ミズゴケのいわ",
        "cost": 1,
        "costText": "1MP+水カード+葉っぱカード",
        "special": [
          "水",
          "葉っぱ"
        ],
        "desc": "すばやさを70まで上げて敵に60ダメージ。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "「仲間」のけはい",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "やみカードを必要とする技を持つフィールド上の全キャラクターのHP+10",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 13,
    "name": "薬屋",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "ダンジョン近くに店を構える名もなき薬屋。いつかまともに戦うのが夢。",
    "hp": 130,
    "attack": 10,
    "defense": 10,
    "speed": 10,
    "role": "公式カード",
    "traitName": "ポーションマスター",
    "trait": "毎ターン開始時に、こうげき、ぼうぎょ、すばやさが1ターンに1つづつこの順に10上がる。また、10%でHPを10回復し、その最大値を10上げる。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "レシピ本",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "山札の上からコストカードを2枚引く",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ちっちゃいばくだん",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "2ターン後に敵全体に10ダメージ（ただし、2ターン後にこのキャラクターがフィールド上にいなくても、この技の効果は発動する）",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "小さないのち",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "次に受ける攻撃のダメージを-10する",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 14,
    "name": "セイラ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "海の浅瀬に暮らす人魚。気に入った男がいると、家に連れ帰ってしまう。",
    "hp": 170,
    "attack": 60,
    "defense": 50,
    "speed": 30,
    "role": "公式カード",
    "traitName": "こいするおとめ",
    "trait": "このキャラクターの左隣（いない場合、右隣）にいるキャラクターが攻撃されたとき、攻撃したキャラクターに確定30ダメージ",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "さそいのうたごえ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "相手を攻撃できなくさせ、30ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ミズゴケのいわ",
        "cost": 1,
        "costText": "1MP+水カード+葉っぱカード",
        "special": [
          "水",
          "葉っぱ"
        ],
        "desc": "すばやさを70まで上げて敵に60ダメージ。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "水でっぽう",
        "cost": 2,
        "costText": "2MP+水カード",
        "special": [
          "水"
        ],
        "desc": "敵に80ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 80
        }
      }
    ]
  },
  {
    "id": 15,
    "name": "グレイ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "裏通りに住む博打打ち。実は稼ぎもそれなりにあるらしい。",
    "hp": 150,
    "attack": 50,
    "defense": 50,
    "speed": 50,
    "role": "公式カード",
    "traitName": "運命のコイン",
    "trait": "ターン開始時、50%でこうげき+20、50%でこうげき-20",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "イカサマ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "このキャラクターのこのターンの行動順から次の行動順までの間、味方のキャラクター全てのランダム効果を成功扱いする",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ギャンブラーの誤謬",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "直前に味方のキャラクターの行動が失敗しているとき、敵に確定70ダメージ。直前の味方の行動が成功したとき、敵に40ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 16,
    "name": "ムウ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "寝ることが大好きな女の子。おひるね同好会を設立した。",
    "hp": 120,
    "attack": 40,
    "defense": 60,
    "speed": 30,
    "role": "公式カード",
    "traitName": "ゆめみのささやき",
    "trait": "このキャラクターの左隣（いない場合、右隣）のキャラクターは、ターン開始時にランダムでどれかのステータス+10（このターンのみ）",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "うたたね",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "山札からMPカードを2枚引く",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ゆめあるき",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "フィールド上のキャラクターを並び替える。ただしフィールドにいないキャラクターとの入れ替えはできない。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "おひるね同好会",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "フィールド上の選んだキャラクターをねむり状態にする。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 17,
    "name": "カクタ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "シルクロードを旅する商人。不思議なものをいろいろ持っている。",
    "hp": 170,
    "attack": 60,
    "defense": 50,
    "speed": 40,
    "role": "公式カード",
    "traitName": "キャラバン",
    "trait": "このキャラクターは登場時、山札から1枚カードを引く",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "オアシスの発見",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "山札から補助カードを1枚引く",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "旅人の勘",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクターランダム1人に確定30ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 18,
    "name": "アルフ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "孤独を好む剣士。",
    "hp": 160,
    "attack": 60,
    "defense": 40,
    "speed": 60,
    "role": "公式カード",
    "traitName": "いっぴきおおかみ",
    "trait": "このキャラクターの隣が空いている場合、一枠につきこうげき+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "いあいぎり",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "確定先手を取り、敵に70ダメージ。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "つうこんのいちげき",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "敵全体に60ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 19,
    "name": "イグニス",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "年齢不詳の炎使い。好戦的。",
    "hp": 140,
    "attack": 60,
    "defense": 40,
    "speed": 60,
    "role": "公式カード",
    "traitName": "ほのおのとうし",
    "trait": "前のターンに攻撃されたとき、このキャラクターの攻撃のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "フレアル",
        "cost": 2,
        "costText": "2MP+ほのおカード",
        "special": [
          "ほのお"
        ],
        "desc": "10ダメージ+やけど状態を付与",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ちっちゃいばくだん",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "2ターン後に敵全体に10ダメージ。（ただし、2ターン後にこのキャラクターのHPが0以下でも、この技の効果は発動する）",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "かえんぎり",
        "cost": 2,
        "costText": "2MP+ほのおカード",
        "special": [
          "ほのお"
        ],
        "desc": "敵に70ダメージ+やけど状態を付与",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 20,
    "name": "ピット",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "砂漠の罠師兼魔法使い。おっとり、のんびりした性格。",
    "hp": 150,
    "attack": 60,
    "defense": 50,
    "speed": 50,
    "role": "公式カード",
    "traitName": "じつはリーダー",
    "trait": "フィールドの味方がこのキャラクター含め3人いる場合、全員のぼうぎょを+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "まほうのわな",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "このターン、このキャラクターの向かいにいる敵のキャラクターを攻撃できなくする。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "オアシスの発見",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "山札から補助カードを1枚引く。",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "さそいこみ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に確定50ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "true_damage",
          "value": 50
        }
      }
    ]
  },
  {
    "id": 21,
    "name": "シズール",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "はさみやカッターを武器に戦う剣士（？）。好戦的だが根はやさしい。",
    "hp": 160,
    "attack": 70,
    "defense": 40,
    "speed": 40,
    "role": "公式カード",
    "traitName": "じつはサブリーダー",
    "trait": "フィールドの味方がこのキャラクター含め3人いる場合、全員のこうげきを+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "いあいぎり",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "確定先手を取り、敵に70ダメージ。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "いかく",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "このターン、このキャラクターの向かいにいる敵のキャラクターのすばやさを-10。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "こもり",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "残りHPが自身より少ない味方のキャラクター1人のHPを+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 22,
    "name": "ホイッパー",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "大食いの縄師。使命感が強く、頼もしい。",
    "hp": 170,
    "attack": 40,
    "defense": 60,
    "speed": 60,
    "role": "公式カード",
    "traitName": "じつはむしょく",
    "trait": "フィールドの味方がこのキャラクター含め3人いる場合、全員の最大HPを+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "なわなげ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に60ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 60
        }
      },
      {
        "name": "まほうのなわ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "このターン、このキャラクターの向かいにいる敵のキャラクターのぼうぎょ-10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ごはんのじかん",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "フィールド上の味方のキャラクター1人（このキャラクター含む）のHP+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 23,
    "name": "ルイ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "砂漠の迷い子。館で保護され、現在弓矢の練習中。",
    "hp": 140,
    "attack": 60,
    "defense": 70,
    "speed": 40,
    "role": "公式カード",
    "traitName": "しんきろうに魅せられて",
    "trait": "2ターンに1度、ランダムな敵に10ダメージ",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "元おまもり",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "山札からMPカードを2枚引く",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "まほうのゆみや",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に70ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 70
        }
      },
      {
        "name": "みがわり",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "次のターン、敵はこのキャラクターしか攻撃できなくなる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 24,
    "name": "ありん",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "森の奥に住むマッドサイエンティスト。双子の兄。",
    "hp": 150,
    "attack": 40,
    "defense": 70,
    "speed": 50,
    "role": "公式カード",
    "traitName": "マッドサイエンス",
    "trait": "2ターンに1度、ランダムなフィールド上のキャラクターに10ダメージ",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "そんざいしょうめい",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に90ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 90
        }
      },
      {
        "name": "発明",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "ランダムな敵に50ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "がらくたあつめ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "山札からカードを2枚引く",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 25,
    "name": "おりん",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "森の奥に住む少女。双子の妹。",
    "hp": 150,
    "attack": 50,
    "defense": 60,
    "speed": 50,
    "role": "公式カード",
    "traitName": "マッドサイエンス",
    "trait": "2ターンに1度、ランダムなフィールド上のキャラクターに10ダメージ",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "そんざいしょうめい",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に90ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 90
        }
      },
      {
        "name": "すわりこみ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "次に攻撃する味方のキャラクターの与えるダメージ+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "じっけんのきろく",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "直前に行動したフィールド上のキャラクターの使った技をもう一度発動",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 26,
    "name": "はべりん",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "森の奥に住むお姉さん。ツンデレ気質。",
    "hp": 160,
    "attack": 60,
    "defense": 50,
    "speed": 50,
    "role": "公式カード",
    "traitName": "ツンデレ",
    "trait": "このキャラクターが1人で場に出ているとき、このキャラクターのぼうぎょ+10。このキャラクターが2人以上で場に出ているとき、このキャラクターのこうげき+20。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "おつきのもの",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "このキャラクターの左隣（いない場合、右隣）のキャラクターのHP+10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ていねいさ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "このキャラクターの向かいにいる敵のキャラクターに70ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 27,
    "name": "いまそかりん",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "森の奥に住むお兄さん。見た目はいかついけど面倒見がよい。",
    "hp": 180,
    "attack": 70,
    "defense": 50,
    "speed": 50,
    "role": "公式カード",
    "traitName": "戦わずして",
    "trait": "このキャラクターの向かいにいる敵のキャラクターは、こうげき-10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "さそいこみ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に確定50ダメージ",
        "target": "enemy",
        "effect": {
          "type": "true_damage",
          "value": 50
        }
      },
      {
        "name": "みんなのためなら",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "次に味方のキャラクターが攻撃を受けたとき、身代わりになる",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ごはんのじかん",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "フィールド上の味方のキャラクター1人（このキャラクター含む）のHP+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 28,
    "name": "クララ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "深い海に住むミズダコ。足はふにゃふにゃなので、最初から立てない。",
    "hp": 170,
    "attack": 70,
    "defense": 50,
    "speed": 40,
    "role": "公式カード",
    "traitName": "なりすまし",
    "trait": "初めてフィールドに出たとき、フィールド上のキャラクター一人と同じとくせいをもつようになる。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ぎたい",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵の攻撃を防ぐ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "たこすみ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクターの中で、このキャラクターの次に行動するキャラクターを攻撃できなくする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "からみつき",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "敵を攻撃できなくさせてから80ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 29,
    "name": "カンタ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "冬になるとどこからともなく現れる謎の少年。菅笠を被り、みのを着ている。",
    "hp": 140,
    "attack": 50,
    "defense": 30,
    "speed": 80,
    "role": "公式カード",
    "traitName": "きたかぜこぞう",
    "trait": "20%でこのキャラクターが攻撃した敵のぼうぎょ値-20",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "からっかぜ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "次に受ける敵からの攻撃をそのまま跳ね返す",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "きょうふう",
        "cost": 3,
        "costText": "3MP+風カード",
        "special": [
          "風"
        ],
        "desc": "ほのおカードを使用する敵の攻撃で必要なほのおカードの枚数を2にする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "つむじかぜ",
        "cost": 3,
        "costText": "3MP+風カード",
        "special": [
          "風"
        ],
        "desc": "敵全体に70ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 30,
    "name": "つくるん",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "後川高校の3年生。非公式非科学現象捜査班の創設者の1人。",
    "hp": 150,
    "attack": 40,
    "defense": 60,
    "speed": 60,
    "role": "公式カード",
    "traitName": "空のぶつだん",
    "trait": "このキャラクターが死んだとき、このキャラクターは1回だけ「そうぞう」を発動できる（その場合、隣り合う二人のキャラクターに効果が適用される）。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "そうぞう",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "このキャラクターがフィールドの端にいるとき、このキャラクターと隣のキャラクターへの敵からの攻撃を防ぐ。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ふいうち",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に70ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 70
        }
      },
      {
        "name": "とくをつむ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "味方のキャラクター全体をHPを20回復",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 31,
    "name": "ありっち",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "後川高校の3年生。非公式非科学現象捜査班の班長。",
    "hp": 150,
    "attack": 60,
    "defense": 40,
    "speed": 40,
    "role": "公式カード",
    "traitName": "せんりがん",
    "trait": "このキャラクターが敵のキャラクターの中で最もぼうぎょ値が低いキャラクターを攻撃するとき、このキャラクターの攻撃のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "みぬき",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "次に行動する敵のキャラクターがどの行動を取るか、相手プレイヤーに聞く。相手プレイヤーは正直に答えること。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "電子レンジでゆでたまご",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "50%で敵に100ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ラブレター...？",
        "cost": 7,
        "costText": "7MP",
        "special": [],
        "desc": "次に行動する敵のキャラクターを、味方のキャラクターにする。ただしバトル中に1回しか使えない。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 32,
    "name": "ゆい",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "後川高校の1年生。神社の娘。",
    "hp": 140,
    "attack": 40,
    "defense": 70,
    "speed": 60,
    "role": "公式カード",
    "traitName": "下から張る派",
    "trait": "行動順がこのキャラクターより後の敵のキャラクターの攻撃を50%で防ぐ",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "おそなえもの",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "相手プレイヤーの手札から1枚奪って自分のものにする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "けっかい",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "味方のキャラクター2人を選ぶ。そのキャラクターが次に受ける攻撃を防ぐ。ただし、その攻撃がやみカードを用いる攻撃の場合、この技の効果はダメージ半減にとどまる。",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "逆・けっかい",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクター1人を選ぶ。そのキャラクターが次に行う攻撃をできなくする。ただし、その攻撃がやみカードを用いる攻撃の場合、このカードの効果はダメージ半減にとどまる。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 33,
    "name": "みらい",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "後川高校の1年生。ギャル。",
    "hp": 180,
    "attack": 50,
    "defense": 50,
    "speed": 70,
    "role": "公式カード",
    "traitName": "ギャル",
    "trait": "フィールドに出たとき、両隣のキャラクターのぼうぎょがこのキャラクターのぼうぎょ以下だったときそのキャラクター（たち）のHP+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "みらいよち",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "次に指定した敵のキャラクターが行う行動が90%でわかる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "フラペチーノ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "HPを10回復し、次のターンこのキャラクターのこうげき+10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "げんじつ「に」とうひ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に70ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 70
        }
      }
    ]
  },
  {
    "id": 34,
    "name": "とおる",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "後川高校の1年生。影が薄い一族に生まれ、本人もものすごく影が薄い。",
    "hp": 170,
    "attack": 60,
    "defense": 70,
    "speed": 70,
    "role": "公式カード",
    "traitName": "うすいかげ",
    "trait": "このキャラクターの行動は、どんな技やとくせいを使用しても敵のキャラクターにバレることがない。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ふいうち",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に70ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 70
        }
      },
      {
        "name": "かじばのばかぢから",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "HPが最大HPの25%未満のとき、敵に100ダメージ。それ以上のとき、敵に[このキャラクターのこうげき]ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ごはんのじかん",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "フィールド上の味方のキャラクター1人（このキャラクター含む）のHP+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 35,
    "name": "ニーコ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "三毛猫の猫又。実は怪異の一種だったりする。",
    "hp": 180,
    "attack": 80,
    "defense": 50,
    "speed": 80,
    "role": "公式カード",
    "traitName": "こねこ",
    "trait": "？）のひとみ（このキャラクターは、攻撃時、20%でこのキャラクターが攻撃した敵が次の行動時に攻撃できなくなる",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ねこのおどりば",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "相手の山札から補助カードを一枚もらう",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "さばのみそに",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "このキャラクターのHPを10回復し、次のターンこうげきを+10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ヒトじゃないからわかること",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "次のターン、敵の、人でないキャラクターの攻撃を防ぐ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 36,
    "name": "きゅーた",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "九尾の狐の男の子。お稲荷様の眷属で、お祈りに来た人々の言葉を聞き続けたためヒト語も話せる。",
    "hp": 180,
    "attack": 80,
    "defense": 50,
    "speed": 60,
    "role": "公式カード",
    "traitName": "けんぞく",
    "trait": "このキャラクターがフィールドに出されたとき、このキャラクターの隣にいるキャラクター（複数いる場合、よりHPが少ない方）のHPを10回復する",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "しっぽのちから",
        "cost": 5,
        "costText": "5MP",
        "special": [],
        "desc": "選択した敵のキャラクターの次の行動順のとき、このキャラクターに対する攻撃をできなくしてから70ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "おそなえもの",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "相手プレイヤーの手札から1枚奪って自分のものにする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ヒトじゃないからわかること",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "次のターン、敵の、人でないキャラクターの攻撃を防ぐ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 37,
    "name": "ミーナ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "生物毒の専門家。かわいい顔して結構怖い。",
    "hp": 140,
    "attack": 40,
    "defense": 60,
    "speed": 40,
    "role": "公式カード",
    "traitName": "せんもんかには",
    "trait": "このキャラクターに攻撃をしたキャラクターがいるとき、このキャラクターはそのキャラクターに確定10ダメージ",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "どくのしずく",
        "cost": 1,
        "costText": "1MP+どくカード",
        "special": [
          "どく"
        ],
        "desc": "敵をどく状態にする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "まるごとさくらんぼのジュース",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に80ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 80
        }
      },
      {
        "name": "吹き矢",
        "cost": 2,
        "costText": "2MP+どくカード",
        "special": [
          "どく"
        ],
        "desc": "敵に10ダメージを与え、どく状態にする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 38,
    "name": "ナイト",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "nightの名を冠するknight…ではなく、職業は執事。このゲームきっての紳士枠。",
    "hp": 160,
    "attack": 50,
    "defense": 50,
    "speed": 60,
    "role": "公式カード",
    "traitName": "しんし",
    "trait": "このキャラクターが攻撃するとき、このキャラクターの向かいにいる敵のキャラクターを攻撃するなら、このキャラクターのこうげき+20",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ていねいさ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "このキャラクターの向かいにいる敵のキャラクターに70ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "しつじのつとめ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "このキャラクターの左隣のキャラクター（いない場合、右隣）のHPが、最大HPの20%以下になったとき、そのキャラクターが受ける攻撃を身代わりする。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "つきよのひかり",
        "cost": 3,
        "costText": "3MP+ひかりカード",
        "special": [
          "ひかり"
        ],
        "desc": "フィールドに出ている味方のキャラクター全員のHP+30",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 39,
    "name": "ヨミ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "黒地にヒガンバナと川の模様の浴衣の少女。夏祭りの日にお寺の裏に現れる。",
    "hp": 170,
    "attack": 50,
    "defense": 70,
    "speed": 70,
    "role": "公式カード",
    "traitName": "たかいたか～い",
    "trait": "バトル中1回だけ、このキャラクターとその時最もHPの低い敵のキャラクターのHP-[各キャラクターのその時点での残りHP]する",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ふしぎのこ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクターをみりょう状態にする。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "つれかえり",
        "cost": 5,
        "costText": "5MP+やみカード",
        "special": [
          "やみ"
        ],
        "desc": "このキャラクターのHPが0より多いとき、HPが0以下のキャラクターのHPを+[そのキャラクターが最後に受けた攻撃のダメージ（その技のテキストに記載の量）]し、ベンチに戻す",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "なつまつり",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "以下の三つの中から、好きな効果を一つ発動する。　1.フィールドに出ている味方キャラクターのうち誰か一人の好きなステータス+10　2.山札からカードを2枚引く　3.フィールドに出ている味方キャラクターのうち誰か一人のHPを10回復し、次のターンそのキャラクターのこうげき+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 40,
    "name": "エウラ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "春になると現れる、ふわふわした女の子。彼女が歩けば花が咲く。",
    "hp": 150,
    "attack": 60,
    "defense": 30,
    "speed": 70,
    "role": "公式カード",
    "traitName": "こちふかば",
    "trait": "葉っぱカードを使用する技のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "つむじかぜ",
        "cost": 3,
        "costText": "3MP+風カード",
        "special": [
          "風"
        ],
        "desc": "敵全体に60ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "きれいな花には",
        "cost": 1,
        "costText": "1MP+葉っぱカード",
        "special": [
          "葉っぱ"
        ],
        "desc": "確定先手を取り、敵に30ダメージ。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "はるねむり",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクターをねむり状態にする。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 41,
    "name": "サン",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "夏になると現れる、活発な男の子。虫取りが好き。",
    "hp": 170,
    "attack": 80,
    "defense": 40,
    "speed": 40,
    "role": "公式カード",
    "traitName": "たいよう",
    "trait": "斜め左前の敵のキャラクターのぼうぎょ-20",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "なつのひかり",
        "cost": 2,
        "costText": "2MP+ひかりカード",
        "special": [
          "ひかり"
        ],
        "desc": "敵に90ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 90
        }
      },
      {
        "name": "じゆうけんきゅう",
        "cost": 2,
        "costText": "2MP+ひかりカード",
        "special": [
          "ひかり"
        ],
        "desc": "敵に確定40ダメージを与え、50%でやけど状態にする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "かんさつにっき",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "直前に行動したフィールド上のキャラクターの使った技をもう一度発動",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 42,
    "name": "旅人",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "秋になるとどこからともなくやってくる旅人。その名は誰も知らない。",
    "hp": 160,
    "attack": 60,
    "defense": 80,
    "speed": 90,
    "role": "公式カード",
    "traitName": "たびびと",
    "trait": "このキャラクターがフィールドに出ているかつ直前のターン開始時にフィールドにいなかったとき、このキャラクターのこうげき+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "むしくいどんぐり",
        "cost": 2,
        "costText": "2MP+どくカード",
        "special": [
          "どく"
        ],
        "desc": "敵をどく状態にし、さらに70%でその敵と隣の敵のキャラクターに確定30ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "むしのうた",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵を攻撃できなくする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "あしまかせ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に50ダメージを与え、ベンチに戻る",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 43,
    "name": "テル",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "晴れを呼ぶ少女。",
    "hp": 170,
    "attack": 40,
    "defense": 70,
    "speed": 50,
    "role": "公式カード",
    "traitName": "あした天気になあれ",
    "trait": "このキャラクターが登場した次のターン、味方キャラクターのこうげき+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "さかさづり",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "フィールド上の味方キャラクターは、その各々が次に行動するとき、水カードを規定枚数-1枚で使用できる",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "げたうらない",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に確定40ダメージ",
        "target": "enemy",
        "effect": {
          "type": "true_damage",
          "value": 40
        }
      },
      {
        "name": "みずふうせん",
        "cost": 2,
        "costText": "2MP+水カード",
        "special": [
          "水"
        ],
        "desc": "敵に40ダメージ。さらにその隣のキャラクターにも20ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 44,
    "name": "フルミ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "雨を呼ぶ青年。",
    "hp": 130,
    "attack": 60,
    "defense": 30,
    "speed": 50,
    "role": "公式カード",
    "traitName": "あまごい",
    "trait": "前のターンにこのキャラクターがフィールドにいたとき、味方キャラクターのぼうぎょ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "きつねのよめいり",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵をこんらん状態にする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "げたうらない",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に確定40ダメージ",
        "target": "enemy",
        "effect": {
          "type": "true_damage",
          "value": 40
        }
      },
      {
        "name": "あめのゆみ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "味方キャラクター全員のHP+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 45,
    "name": "メロイタ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "夢見がちな女の子。一度恋をするともう止まらない。",
    "hp": 120,
    "attack": 80,
    "defense": 40,
    "speed": 60,
    "role": "公式カード",
    "traitName": "こいするおとめ",
    "trait": "このキャラクターの左隣（いない場合、右隣）にいるキャラクターが攻撃されたとき、攻撃したキャラクターに確定30ダメージ",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "メロメロこうせん",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクターをみりょう状態にする。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "食べちゃいたい！",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "敵に確定50ダメージ。ただし、この攻撃は、相手がこのキャラクターによるみりょう状態のとき、敵に確定70ダメージを与える",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 46,
    "name": "グラン",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "メモ魔。",
    "hp": 180,
    "attack": 40,
    "defense": 60,
    "speed": 50,
    "role": "公式カード",
    "traitName": "メモとり",
    "trait": "一度使用したことのある技を使用するとき、その技のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "めもちょう",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "直前に行動したフィールド上のキャラクターの使った技をもう一度発動",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "いたをほる",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に70ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 70
        }
      },
      {
        "name": "かいぶんしょ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵をこんらん状態にする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 47,
    "name": "マンジャ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "美味しいものが大好きなコックさん。",
    "hp": 170,
    "attack": 50,
    "defense": 70,
    "speed": 40,
    "role": "公式カード",
    "traitName": "コックさん",
    "trait": "このキャラクターがフィールドに出たとき、隣のキャラクターのHP+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ごはんのじかん",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "フィールド上の味方のキャラクター1人（このキャラクター含む）のHP+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "げきからりょうり",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に80ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 80
        }
      },
      {
        "name": "うまみのおだし",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "3ターンの間、敵のこうげき-10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 48,
    "name": "ルルイ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "心理学者。いつか人心掌握するのが夢。",
    "hp": 150,
    "attack": 70,
    "defense": 40,
    "speed": 50,
    "role": "公式カード",
    "traitName": "せんもんかには",
    "trait": "このキャラクターに攻撃をしたキャラクターがいるとき、このキャラクターはそのキャラクターに確定10ダメージ",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "メロメロこうせん",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクターをみりょう状態にする。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "さいみんじゅつ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵をこんらん状態にする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "おにほめ！",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "味方1人のこうげき+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 49,
    "name": "ミツイタチ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "かまいたちの家族。3人で一緒に行動する。",
    "hp": 160,
    "attack": 70,
    "defense": 50,
    "speed": 90,
    "role": "公式カード",
    "traitName": "かぜのり",
    "trait": "直前のキャラクターが風カードを使用する技を使用したとき（ターンを超えてもよい）、このキャラクターの攻撃のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ころばせや",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に確定30ダメージ。さらにその後20ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "かまさき",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に90ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 90
        }
      },
      {
        "name": "きずぐすり",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "フィールド上のキャラクター1人の状態異常を治し、そのキャラクターのHP+10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 50,
    "name": "メルロ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "熱い心を持ったマジシャンの青年。熱いものが好き。",
    "hp": 140,
    "attack": 60,
    "defense": 50,
    "speed": 60,
    "role": "公式カード",
    "traitName": "マジシャン",
    "trait": "このキャラクターは攻撃するとき、10%で敵をこんらん状態にする（こんらん状態：3ターンの間、この状態になったキャラクターは確定10ダメージ）",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "フレアル",
        "cost": 2,
        "costText": "2MP+ほのおカード",
        "special": [
          "ほのお"
        ],
        "desc": "10ダメージ+やけど状態を付与",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ヒートスナップ",
        "cost": 2,
        "costText": "2MP+ほのおカード",
        "special": [
          "ほのお"
        ],
        "desc": "敵に50ダメージ+やけど状態を付与",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ほのおげい",
        "cost": 4,
        "costText": "4MP+ほのおカード",
        "special": [
          "ほのお"
        ],
        "desc": "敵全体に70ダメージ+やけど状態を付与",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 51,
    "name": "かがり",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "パイプを嗜む大人の女性。若干アグレッシブ。",
    "hp": 180,
    "attack": 40,
    "defense": 60,
    "speed": 50,
    "role": "公式カード",
    "traitName": "もえさし",
    "trait": "直前のキャラクターがほのおカードを使用する技を使用したとき（ターンを超えてもよい）、このキャラクターの攻撃のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "パイプのけむり",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に30ダメージを与え、そのキャラクターの次の行動順のときに行動できなくする。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ふんじんだいばくはつ",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "敵全体に70ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "かがりび",
        "cost": 2,
        "costText": "2MP+ほのおカード",
        "special": [
          "ほのお"
        ],
        "desc": "2ターンの間、やみカードを使用する敵の技が全てダメージ-10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 52,
    "name": "チーカ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "竹林に住むメスのパンダ。のんびりした性格。",
    "hp": 170,
    "attack": 60,
    "defense": 50,
    "speed": 30,
    "role": "公式カード",
    "traitName": "山ぐらし",
    "trait": "直前のキャラクターが葉っぱカードを使用する技を使用したとき（ターンを超えてもよい）、このキャラクターの攻撃のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "マダケ",
        "cost": 3,
        "costText": "3MP+葉っぱカード",
        "special": [
          "葉っぱ"
        ],
        "desc": "確定先手を取り、敵に70ダメージ。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "きゃくよせ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクター1人を指定する。今後バトル中に、フィールド上のキャラクターがそのキャラクターに攻撃するとき、そのダメージ+10。ただしこの技はバトル中に2回までしか使えない。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "たけのこ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "ランダムな敵に確定40ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 53,
    "name": "みお",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "川沿いの村に住む女の子。活発で明るい。",
    "hp": 160,
    "attack": 60,
    "defense": 40,
    "speed": 70,
    "role": "公式カード",
    "traitName": "さかなつり",
    "trait": "フィールドに出たとき、50%でこのキャラクターのHP+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "水でっぽう",
        "cost": 2,
        "costText": "2MP+水カード",
        "special": [
          "水"
        ],
        "desc": "敵に80ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 80
        }
      },
      {
        "name": "みずふうせん",
        "cost": 2,
        "costText": "2MP+水カード",
        "special": [
          "水"
        ],
        "desc": "敵に40ダメージ。さらにその隣のキャラクターにも20ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "うちみず",
        "cost": 3,
        "costText": "3MP+水カード",
        "special": [
          "水"
        ],
        "desc": "敵全体に50ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 54,
    "name": "キュッパ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "山奥の池で暮らすカッパ。初夏になると人里に降りてくる。",
    "hp": 170,
    "attack": 60,
    "defense": 30,
    "speed": 60,
    "role": "公式カード",
    "traitName": "かわながれ",
    "trait": "直前のキャラクターが水カードを使用する技を使用したとき（ターンを超えてもよい）、このキャラクターの攻撃のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "しりこだま",
        "cost": 5,
        "costText": "5MP",
        "special": [],
        "desc": "敵を一人指定する。そのキャラクターは次に攻撃を受けるとき、一時的にぼうぎょが0になる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "水でっぽう",
        "cost": 2,
        "costText": "2MP+水カード",
        "special": [
          "水"
        ],
        "desc": "敵に80ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 80
        }
      },
      {
        "name": "冷やしきゅうり",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "HPを10回復し、次のターンこのキャラクターのこうげき+10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 55,
    "name": "カラサ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "からかさお化け。古くなって持ち主に捨てられた傘に、おばけが取り憑いている。",
    "hp": 200,
    "attack": 40,
    "defense": 70,
    "speed": 60,
    "role": "公式カード",
    "traitName": "つくもがみ",
    "trait": "このキャラクターは、バトル中1度だけベンチにいるときに「とりつき」を発動する",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "やぶれがさ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "このキャラクターの隣のキャラクター（複数いる場合、次の行動順が先に回ってくる方）が次に受ける攻撃のダメージを1/2にする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "とりつき",
        "cost": 3,
        "costText": "3MP+やみカード",
        "special": [
          "やみ"
        ],
        "desc": "3ターンの間、このキャラクターのぼうぎょを-10し、敵に確定40ダメージ。さらに、このキャラクターは3ターンの間必ずフィールドに出続けなければならず、またその間行動することはできなくなる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "おばけがさ",
        "cost": 2,
        "costText": "2MP+やみカード",
        "special": [
          "やみ"
        ],
        "desc": "敵に60ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 60
        }
      }
    ]
  },
  {
    "id": 56,
    "name": "ハイリ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "裏通りの消費者金融。",
    "hp": 160,
    "attack": 50,
    "defense": 60,
    "speed": 70,
    "role": "公式カード",
    "traitName": "あくにん",
    "trait": "このキャラクターが2ターンの間誰にも攻撃されなかったとき、このキャラクターのHP+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "こうりがし",
        "cost": 3,
        "costText": "3MP+やみカード",
        "special": [
          "やみ"
        ],
        "desc": "このキャラクターのHP-10し、敵のキャラクターのHP+10。2ターン後の終了時、このキャラクターのHPとそのキャラクターのHPが0より多ければ、その敵のHP-30し、このキャラクターのHP+30",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "おいたて",
        "cost": 2,
        "costText": "2MP+やみカード",
        "special": [
          "やみ"
        ],
        "desc": "敵に10ダメージ。ただし、この技は同じキャラクターに使うたび、ダメージが20ずつ上がる。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 57,
    "name": "フータ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "風を操る神（の見習い）。",
    "hp": 150,
    "attack": 70,
    "defense": 30,
    "speed": 80,
    "role": "公式カード",
    "traitName": "ふうじんみならい",
    "trait": "このキャラクターがフィールドに出たとき、味方キャラクター全員のすばやさ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "きょうふう",
        "cost": 3,
        "costText": "3MP+風カード",
        "special": [
          "風"
        ],
        "desc": "ほのおカードを使用する敵の攻撃で必要なほのおカードの枚数を2にする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "つむじかぜ",
        "cost": 3,
        "costText": "3MP+風カード",
        "special": [
          "風"
        ],
        "desc": "敵全体に60ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "かぜあつめ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "山札から風カードを1枚引く。なければ捨て札から引いても良い。",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 58,
    "name": "ヨシツネ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "山奥に暮らす大天狗。",
    "hp": 200,
    "attack": 60,
    "defense": 40,
    "speed": 80,
    "role": "公式カード",
    "traitName": "やまぶし",
    "trait": "このキャラクターは、バトル中3回まで、このキャラクターがフィールドに出ているターン中に行動しない代わり、好きなステータス+10することができる。なお、このとくせいはこのキャラクターの行動順のときに発動するか選択する。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "かくれみの",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "次の敵からの攻撃を受けない",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "はっぱのうちわ",
        "cost": 2,
        "costText": "2MP+風カード",
        "special": [
          "風"
        ],
        "desc": "敵全体に40ダメージ。また、敵のキャラクターの並び順を好きなように入れ替える。ただし、ベンチにいるキャラクターとの交代はさせられない。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "はなたかだか",
        "cost": 5,
        "costText": "5MP",
        "special": [],
        "desc": "敵に100ダメージ。その後、このキャラクターはベンチに戻る。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 59,
    "name": "リル",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "やさしいお医者さん。研究医としても働いている。",
    "hp": 190,
    "attack": 40,
    "defense": 70,
    "speed": 40,
    "role": "公式カード",
    "traitName": "しんだん",
    "trait": "どれかのステータスがフィールドにいるキャラクター内で最も低いキャラクターを攻撃するとき、その技のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "どくのしずく",
        "cost": 1,
        "costText": "1MP+どくカード",
        "special": [
          "どく"
        ],
        "desc": "敵をどく状態にする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "どくをもって",
        "cost": 2,
        "costText": "2MP+どくカード",
        "special": [
          "どく"
        ],
        "desc": "味方の状態異常を1つ解除",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "しょほうせん",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクター1人を指定する。今後バトル中に、フィールド上のキャラクターがそのキャラクターに攻撃するとき、そのダメージ+10。ただしこの技はバトル中に2回までしか使えない。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 60,
    "name": "でぃか",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "ちょっと怖そうな顔の薬剤師さん。怖そうなのは顔だけ。",
    "hp": 170,
    "attack": 60,
    "defense": 60,
    "speed": 50,
    "role": "公式カード",
    "traitName": "しょほう",
    "trait": "味方に、どれかのステータスがフィールドにいるキャラクター内で最も低いキャラクターがいるとき、そのキャラクターのそのステータス+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "どくをもって",
        "cost": 2,
        "costText": "2MP+どくカード",
        "special": [
          "どく"
        ],
        "desc": "味方の状態異常を1つ解除",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "おくすりてちょう",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "フィールド上のキャラクター1人のHP+10。さらに、そのキャラクターがバトル中に1度でも回復しているなら、さらにそのキャラクターのHP+10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "にらみつける",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に確定50ダメージ",
        "target": "enemy",
        "effect": {
          "type": "true_damage",
          "value": 50
        }
      }
    ]
  },
  {
    "id": 61,
    "name": "フィルン",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "圧倒的光属性の看護師さん。困っている人にはすぐに手を差し伸べてくれる。",
    "hp": 140,
    "attack": 30,
    "defense": 60,
    "speed": 40,
    "role": "公式カード",
    "traitName": "てんしのほほえみ",
    "trait": "このキャラクターがフィールドに出たとき、フィールドに出ている味方キャラクター全員のHP+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "つきよのひかり",
        "cost": 3,
        "costText": "3MP+ひかりカード",
        "special": [
          "ひかり"
        ],
        "desc": "フィールドに出ている味方のキャラクター全員のHP+30",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ハピネ",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "使われた時点でフィールド上にいるすべてのキャラクターのHPを10回復",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "こもれび",
        "cost": 2,
        "costText": "2MP+ひかりカード",
        "special": [
          "ひかり"
        ],
        "desc": "フィールドに出ている味方キャラクター1人のこうげき+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 62,
    "name": "ミルラ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "鏡と光の反射を利用して戦う女性。",
    "hp": 170,
    "attack": 70,
    "defense": 40,
    "speed": 40,
    "role": "公式カード",
    "traitName": "はんしゃきょう",
    "trait": "直前のキャラクターがひかりカードを使用する技を使用したとき（ターンを超えてもよい）、このキャラクターの攻撃のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "じゆうけんきゅう",
        "cost": 2,
        "costText": "2MP+ひかりカード",
        "special": [
          "ひかり"
        ],
        "desc": "敵に確定40ダメージを与え、50%でやけど状態にする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "マジックミラー",
        "cost": 4,
        "costText": "4MP+ひかりカード",
        "special": [
          "ひかり"
        ],
        "desc": "[次に受ける攻撃のダメージ+このキャラクターのこうげき]を敵に与える",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "てらす",
        "cost": 2,
        "costText": "2MP+ひかりカード",
        "special": [
          "ひかり"
        ],
        "desc": "2ターンの間、やみカードを使用する敵の技が全てダメージ-10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 63,
    "name": "ぺんた",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "ペンギンの男の子。",
    "hp": 160,
    "attack": 40,
    "defense": 60,
    "speed": 60,
    "role": "公式カード",
    "traitName": "ファーストペンギン",
    "trait": "味方キャラクターの中でこのキャラクターが最も早く行動順が回ってくるとき、味方キャラクター全員のこうげき+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "おさんぽ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "次のターン、敵1人はこのキャラクターに攻撃できない",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "トボガン",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "敵に80ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 80
        }
      },
      {
        "name": "フリッパー",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に60ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 60
        }
      }
    ]
  },
  {
    "id": 64,
    "name": "そめの",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "春、桜並木がきれいな公園にいる不思議な女性。",
    "hp": 200,
    "attack": 30,
    "defense": 60,
    "speed": 40,
    "role": "公式カード",
    "traitName": "地に足うまってる",
    "trait": "このキャラクターは、水カードを使用する技の影響を受けない。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ふしぎのこ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクターをみりょう状態にする。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "きれいな花には",
        "cost": 1,
        "costText": "1MP+葉っぱカード",
        "special": [
          "葉っぱ"
        ],
        "desc": "確実に先手を取り、敵に30ダメージ。なお、この技を発動する際には、手順6で相手プレイヤーに宣言する必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "さくらふぶき",
        "cost": 2,
        "costText": "2MP+風カード",
        "special": [
          "風"
        ],
        "desc": "次のターン、敵1人はこのキャラクターに攻撃できない。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 65,
    "name": "おゆき",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "冬、美しい彼女が訪ねてきたなら、暖炉の火を消してあげよう。",
    "hp": 180,
    "attack": 50,
    "defense": 40,
    "speed": 70,
    "role": "公式カード",
    "traitName": "ひみつのやくそく",
    "trait": "このキャラクターの行動が敵のキャラクターの技やとくせいによって事前に相手プレイヤーに知られたとき、伝える代わりにその敵キャラクターのHPをその時点での残りHPの半分にする。なお、このとくせいは自動で発動する。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ふぶき",
        "cost": 5,
        "costText": "5MP",
        "special": [],
        "desc": "敵全体に確定40ダメージ。また、敵がそれぞれ50%で次の行動時に攻撃できなくなる。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "とりつき",
        "cost": 3,
        "costText": "3MP+やみカード",
        "special": [
          "やみ"
        ],
        "desc": "3ターンの間、このキャラクターのぼうぎょを-10し、敵に確定40ダメージ。さらに、このキャラクターは3ターンの間必ずフィールドに出続けなければならず、またその間行動することはできなくなる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ゆきげしょう",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "5ターンの間、味方キャラクターのひかりカードの技のダメージ+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 66,
    "name": "ライ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "体育教師になりたかった国語教師。運動神経は抜群。",
    "hp": 170,
    "attack": 70,
    "defense": 60,
    "speed": 60,
    "role": "公式カード",
    "traitName": "たいいくがよかった",
    "trait": "相手が使った技の名前（かな表記）の文字数が8文字以上10文字以下なら受けるダメージ-10。10文字より長ければ-20。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "みんなのためなら",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "次に味方のキャラクターが攻撃を受けたとき、身代わりになる",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "つまづかない古典文法",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に確定30ダメージ",
        "target": "enemy",
        "effect": {
          "type": "true_damage",
          "value": 30
        }
      },
      {
        "name": "くさやきゅう",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に90ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 90
        }
      }
    ]
  },
  {
    "id": 67,
    "name": "にっしー",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "旅が好きな英語教師。ハイテクなものに興味津々。",
    "hp": 140,
    "attack": 40,
    "defense": 70,
    "speed": 40,
    "role": "公式カード",
    "traitName": "はいしんしゃ",
    "trait": "このキャラクターは、ベンチに居る間、1回だけ敵に確定30ダメージを与える",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "あしまかせ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に50ダメージを与え、ベンチに戻る",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "きょうしむけフォーラム",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "好きなステータス+20。ただし、一度使用すると5ターン以内に再度使うことができなくなる。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "クイズ大会",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "味方のキャラクターの中からランダムで1人のこうげき+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 68,
    "name": "ハナコ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "午後4時44分に女子トイレにいるやつ。地域によるけど結構怖い。",
    "hp": 130,
    "attack": 60,
    "defense": 30,
    "speed": 40,
    "role": "公式カード",
    "traitName": "さんばんめ",
    "trait": "このキャラクターがフィールド上の最も左にいるとき、このキャラクターのこうげき+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "あそびましょ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "直前のキャラクターがこのキャラクターに攻撃していたとき、敵全体に60ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "なわとび",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に80ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 80
        }
      },
      {
        "name": "おままごと",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵に70ダメージ。また、両隣のキャラクターにも10ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 69,
    "name": "そんとく",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "金次郎って呼ばれがち。あんまり怖くはない。",
    "hp": 160,
    "attack": 40,
    "defense": 60,
    "speed": 50,
    "role": "公式カード",
    "traitName": "どうぞう",
    "trait": "直前のキャラクターがやみカードを使用する技を使用したとき（ターンを超えてもよい）、このキャラクターの攻撃のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "歩きどくしょ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に60ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 60
        }
      },
      {
        "name": "まきわり",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に50ダメージ。さらに、その敵が葉っぱカードを使用する持ち技をもつ場合、ダメージ+20",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 70,
    "name": "ピオナ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "夜に音楽室で勝手にピアノを弾いてるとか、いないとか...",
    "hp": 130,
    "attack": 50,
    "defense": 50,
    "speed": 60,
    "role": "公式カード",
    "traitName": "おんがくか",
    "trait": "このキャラクターのHPが0以下になったとき、味方のキャラクターのうちHPが0より多いキャラクター1人は、このキャラクターの持ち技を一つ使えるようになる",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ピアノのねいろ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵を、その次の行動順のときに攻撃できなくする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "4かいきくなら",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "敵に確定[そのキャラクターの最大HPの1/4（端数は1,2なら0、3-7なら5、8,9なら10）]ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "アンコール",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "直前のこのキャラクターの行動順以降に発動された技からどれか一つをランダムで発動する",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 71,
    "name": "カコウ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "平時はやる気がほぼないが、窮地に陥ったときの采配は上手い。窮地に陥ったときは。",
    "hp": 170,
    "attack": 40,
    "defense": 60,
    "speed": 70,
    "role": "公式カード",
    "traitName": "ふくつのしれいとう",
    "trait": "このキャラクターのHPが最大HPの半分以下かつ0より多いとき、味方全員の攻撃のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "かじばのばかぢから",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "HPが最大HPの25%未満のとき、敵に100ダメージ。それ以上のとき、敵に[このキャラクターのこうげき]ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "みがわり",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "次のターン、敵はこのキャラクターしか攻撃できなくなる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ぼうけんしん",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "山札を上から3枚見て、そのうち1枚を手札に加える",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 72,
    "name": "カンナ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "平時は頼れるリーダーだが、窮地に陥ったときは抱え込んでしまうことも。",
    "hp": 130,
    "attack": 60,
    "defense": 40,
    "speed": 30,
    "role": "公式カード",
    "traitName": "たよれるしれいとう",
    "trait": "このキャラクターのHPが最大HPの半分より多いとき、味方全員の攻撃のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "おくりだし",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "次に攻撃する味方のキャラクターの与えるダメージ+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "かかえこみ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "次に攻撃する敵のキャラクターはこのキャラクターしか攻撃できなくする。さらに、このキャラクターのぼうぎょ+10。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "くうそうせかい",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵1人の攻撃のダメージを以後-10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 73,
    "name": "ハナビシ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "花菱花火工房の一人息子。最近親父の工房を継いだ。",
    "hp": 170,
    "attack": 70,
    "defense": 50,
    "speed": 50,
    "role": "公式カード",
    "traitName": "あとつぎ",
    "trait": "味方キャラクターの中に瀕死（残りHPが最大HPの10%以下の状態）のキャラクターがいる状態で、このキャラクターを初めてフィールドに出すと、このキャラクターのこうげき+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "はなびし",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "次に行動するキャラクターを行動できなくする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "かやくだま",
        "cost": 2,
        "costText": "2MP+ほのおカード",
        "special": [
          "ほのお"
        ],
        "desc": "2ターン後に敵全体に50ダメージ（ただし、2ターン後にこのキャラクターのHPが0以下でも、この技の効果は発動する）。また、敵の各キャラクターに対してそれぞれ30%の確率でやけど状態にする。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "なつまつり",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "以下の三つの中から、好きな効果を一つ発動する。　1.フィールドに出ている味方キャラクターのうち誰か一人の好きなステータス+10　2.山札からカードを2枚引く　3.フィールドに出ている味方キャラクターのうち誰か一人のHPを10回復し、次のターンそのキャラクターのこうげき+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 74,
    "name": "ミュダグ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "割とヤバいヤツ。でも人狼では「村人」引く率100%。そんなわけない。",
    "hp": 100,
    "attack": 10,
    "defense": 10,
    "speed": 10,
    "role": "公式カード",
    "traitName": "やみへのさそい",
    "trait": "このキャラクターが死んだとき、このキャラクターと同じ技を持っているフィールド上の敵のキャラクターがランダムで1人道連れにされる",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "なかよくなる",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "いまフィールドに出ている敵の技がどれか一つ使えるようになる（1バトルにつき最大2こまで。コピーした技を使用するときは、もとのコストをそのまま支払う必要がある。）",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "フレネミー",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "フィールドにいるキャラクターの中から誰か一人に確定30ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "きょうじん",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "フィールドにいるキャラクターの中から誰か一人に80ダメージ。さらに、この技を味方に使ったとき、このキャラクターのHP+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 75,
    "name": "ロイ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "おもちゃ屋さんの店主。",
    "hp": 180,
    "attack": 50,
    "defense": 70,
    "speed": 50,
    "role": "公式カード",
    "traitName": "こどものえがお",
    "trait": "フィールドに居る味方キャラクターの中に、最大HPがこのキャラクターのものより低いキャラクターがいるとき、そのキャラクターのHP+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "なまりのへいたい",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に60ダメージ。さらに、その敵がやみカードを使用する持ち技をもつ場合、ダメージ+20",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "くるみわりにんぎょう",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "敵に確定[そのキャラクターの残りHPの½（端数は1,2なら0、3-7なら5、8,9なら10）]ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "くうそうせかい",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵1人の攻撃のダメージを以後-10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 76,
    "name": "タレビー",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "雨が降ると醤油になる（？）。本名はランチャーム。",
    "hp": 130,
    "attack": 60,
    "defense": 70,
    "speed": 50,
    "role": "公式カード",
    "traitName": "タレビン",
    "trait": "直前に水カードを使用する技が使われたとき、このキャラクターの水カードを使用する技のダメージを+10する",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "しょうゆ漬け",
        "cost": 2,
        "costText": "2MP+水カード",
        "special": [
          "水"
        ],
        "desc": "5ターンの間、敵に確定10ダメージを与える。ただし、この技は、1ターン目で発動を宣言した後であれば、5ターン内にこのキャラクターがフィールド以外の場所に行っても発動され続ける。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "水でっぽう",
        "cost": 2,
        "costText": "2MP+水カード",
        "special": [
          "水"
        ],
        "desc": "敵に80ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 80
        }
      },
      {
        "name": "すいとり",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "敵のHPを-40し、このキャラクターのHP+40",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 77,
    "name": "ククル",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "とにかく運に恵まれた女性。底抜けに明るい。",
    "hp": 170,
    "attack": 70,
    "defense": 60,
    "speed": 30,
    "role": "公式カード",
    "traitName": "ラッキー！",
    "trait": "このキャラクターの行動時にこのキャラクターのHPが0より多いとき、このキャラクターはランダムな敵1人に10ダメージを与える。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "こううんのめがみ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "このキャラクターのこのターンの行動順から次の行動順までの間、味方のキャラクター全てのランダム効果を成功扱いする",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "さいころ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "フィールド上のキャラクターをランダムで1人選ぶ。そのキャラクターが味方キャラクターだったとき、そのキャラクターの次の行動順のときの攻撃のダメージ+20。敵のキャラクターだったとき、そのキャラクターの次の行動順のときの攻撃のダメージ-20。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "なにがでるかな",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "このキャラクターのHPを、5刻みで10から40までの間のランダムな値回復させる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 78,
    "name": "ホーン",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "いたずら好きの羊飼いの少年。誕生日は4月1日。",
    "hp": 180,
    "attack": 60,
    "defense": 50,
    "speed": 70,
    "role": "公式カード",
    "traitName": "エイプリルフール",
    "trait": "このキャラクターが前のターンフィールドにいなかった、かつこのターンフィールドにいるとき、このキャラクターのこうげきは攻撃する敵のキャラクターのこうげきと等しくなる。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "うそつき",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "このキャラクターのこうげき・ぼうぎょ・すばやさの値をランダムに入れ替える",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ひつじがいっぴき",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "このキャラクターの好きなステータス+10。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "おおかみしょうねん",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "フィールドにいる敵のキャラクター2人をベンチに戻すか、ベンチの敵のキャラクターと入れ替える",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 79,
    "name": "ベーグル",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "パン屋を営むおねえさん。",
    "hp": 170,
    "attack": 50,
    "defense": 60,
    "speed": 70,
    "role": "公式カード",
    "traitName": "朝です。パンのいい香りがただよってきました",
    "trait": "このキャラクターの技やとくせいは、ほかのどんなキャラクターの技やとくせいを用いてもコピーすることができない。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ふんじんだいばくはつ",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "敵全体に70ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "やきたてパン",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "フィールドに出ている味方のキャラクター全員のHP+30",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "かまどのねつ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "味方キャラクター1人のこうげき+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 80,
    "name": "クロノ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "古い時計店を営むおじさん。",
    "hp": 170,
    "attack": 60,
    "defense": 50,
    "speed": 50,
    "role": "公式カード",
    "traitName": "まきもどし",
    "trait": "1回だけ、プレイフィールド上の全てのものの状態を、前ターン終了時に戻す",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ちっちゃいばくだん",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "2ターン後に敵全体に10ダメージ（ただし、2ターン後にこのキャラクターがフィールド上にいなくても、この技の効果は発動する）",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ながいはり",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "攻撃1回につき30ダメージ。この技を発動した回数に応じて、攻撃1回ごとの成功率が30%から10%ずつ上昇する。攻撃に成功した場合、続けて次の攻撃の判定を行う。判定に失敗するか、10回攻撃した時点で、この技の一回分の発動が終了する。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ストップ・ウォッチ！",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵を、その次の行動順のときに、行動できなくする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 81,
    "name": "ソウ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "出版会社「てんぷら社」の社長。",
    "hp": 170,
    "attack": 80,
    "defense": 30,
    "speed": 50,
    "role": "公式カード",
    "traitName": "しゅっぱんしゃ",
    "trait": "このキャラクターの前の行動順から次の行動順までの間に敵が使った技やとくせいの名前（かな表記）の合計文字数が24文字以上30文字以下なら受けるダメージ-20。30文字より長ければ-30。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "しんかんはつばい",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "両プレイヤーの手札・墓場にいないキャラクターカードの枚数×10ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "さくしゃの都合",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "フィールド上にいるキャラクターのうち誰か1人のHPを、±40までの範囲で変えられる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "うそつき",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "このキャラクターのこうげき・ぼうぎょ・すばやさの値をランダムに入れ替える",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 82,
    "name": "アオバ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "ガーデニングが趣味の女性。",
    "hp": 160,
    "attack": 40,
    "defense": 60,
    "speed": 50,
    "role": "公式カード",
    "traitName": "ガーデニング",
    "trait": "このキャラクターの二つ前の行動順から一つ前の行動順までの間に葉っぱカードを用いる技を使ったキャラクターがフィールドにいるとき、このキャラクターのぼうぎょ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "からみづた",
        "cost": 1,
        "costText": "1MP+葉っぱカード",
        "special": [
          "葉っぱ"
        ],
        "desc": "次のターン、敵が攻撃できなくなる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "きれいな花には",
        "cost": 1,
        "costText": "1MP+葉っぱカード",
        "special": [
          "葉っぱ"
        ],
        "desc": "確定先手を取り、敵に30ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "たねまき",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "4ターンの間、毎ターン敵のHP-10、このキャラクターのHP+10。4ターンの間にこのキャラクターのHPが0以下になったときは、敵のHPが減る効果のみが持続する。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 83,
    "name": "おその",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "駄菓子屋さんの店主。いつ行ってもカウンターの奥で三毛猫を撫でている。",
    "hp": 150,
    "attack": 30,
    "defense": 70,
    "speed": 30,
    "role": "公式カード",
    "traitName": "だがしやさん",
    "trait": "このキャラクターがフィールドにいるとき、そのターンのみランダムな味方キャラクターの最も高いステータス+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "あまからもんじゃ",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "味方キャラクター全員のHPを10回復し、次のターンこうげき+10",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "フーセンガム",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "6面体サイコロを1回振る。[出た目]ターンの間、敵1人がフィールドに出られなくなる。選んだ敵がその時点でフィールドにいたとき、そのキャラクターをベンチに戻す。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "ねりあめ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵が、その次の行動順のときに、攻撃できなくなる。さらに、その敵のHP-10。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 84,
    "name": "てんちょー",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "コンビニの店長（？）。名札に「てんちょー」って書いてあるからそう呼ぶしかない。",
    "hp": 200,
    "attack": 40,
    "defense": 40,
    "speed": 70,
    "role": "公式カード",
    "traitName": "24じかんえいぎょう",
    "trait": "このキャラクターは、たとえHPが0以下になったとしても、そのターンの終了時までは場に残る。ただし、このキャラクターの行動順が来る前にHPが0以下になったとき、技の発動はできない。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ざいこかくにん",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "山札の上からカードを4枚みる。そのうち1枚を手札に加え、残り3枚を好きな順に山札に戻す。",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "けいえいじゅつ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "フィールド上の敵のキャラクターより早く行動順がきたとき、確定[このキャラクターのこうげき+10×先回った人数]ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "タイムセール",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "このターン、味方キャラクターが発動する技の必要MPを-1する。",
        "target": "ally",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 85,
    "name": "レム",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "睡魔に負けがち。ずっと寝てる。",
    "hp": 160,
    "attack": 40,
    "defense": 70,
    "speed": 40,
    "role": "公式カード",
    "traitName": "そろそろ起きなきゃ",
    "trait": "このキャラクターは、「ねむり状態」になっても行動できる。ただし、その間に発動できる攻撃技は「めざまし止めなきゃ」のみである。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "めざまし止めなきゃ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "ランダムな敵のキャラクター1人に70ダメージ。ただしこの技は、このキャラクターの前の行動順から次の行動順までの間に音に関する技（「さそいのうたごえ」など）が発動されているとき、ダメージ+20。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "こもりうた",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "このキャラクターと、フィールド上のキャラクター1人を「ねむり状態」にする",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "うたたね",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "山札からMPカードを2枚引く",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 86,
    "name": "ソロク",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "正真正銘の戦闘狂。見つけたらさっさと逃げ出したほうがいい。",
    "hp": 140,
    "attack": 90,
    "defense": 30,
    "speed": 70,
    "role": "公式カード",
    "traitName": "もう死んだのか？",
    "trait": "このキャラクターは、フィールドにいるとき、こうげき+[敵の、墓場にいるキャラクター数×10]",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "おいうち",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "状態異常にかかっているキャラクターに、それと同じ状態異常を重ね掛けする。ただし、その状態異常が重ね掛けできないものの場合は、それと異なるものをランダムで1つかける。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "だいこんせん",
        "cost": 5,
        "costText": "5MP",
        "special": [],
        "desc": "フィールド上の全キャラクターが、そのキャラクターにとっての敵のキャラクターランダム1人に通常攻撃する。この技が発動したあとも、全てのキャラクターはそのキャラクターの行動順のときに普通の行動を行うことができる。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 87,
    "name": "アケボノ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "どんなときでも日の出の前には起きて窓辺に座っている。彼女より早く起きるといいことがある...かも？",
    "hp": 180,
    "attack": 30,
    "defense": 80,
    "speed": 60,
    "role": "公式カード",
    "traitName": "はやおき",
    "trait": "このキャラクターは、フィールドに出たターン、山札からMPカードを1枚引く",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "はるねむり",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクターをねむり状態にする。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "しろい山ぎわ",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "このターンのみ、すばやさを90にする。その後、ランダムな敵1人に確定30ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "むらさきぐも",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "次のターン、敵が攻撃できなくなる",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 88,
    "name": "ハチヤ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "よく見る事務員さん。穴あけパンチを常に持っている。",
    "hp": 170,
    "attack": 50,
    "defense": 70,
    "speed": 40,
    "role": "公式カード",
    "traitName": "穴あけパンチ",
    "trait": "このキャラクターが敵の両端にいるキャラクターを攻撃するとき、攻撃のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "はさみこみ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に60ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 60
        }
      },
      {
        "name": "あなあけ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクターのうち、両端にいる2人に60ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "かみふぶき",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "今フィールドにいる敵のキャラクター全員を、このキャラクターの次の行動順まで攻撃できなくさせる。さらに、それぞれに40%で確定20ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 89,
    "name": "ステイラ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "よく見る事務員さん。ホチキス止め係。",
    "hp": 150,
    "attack": 70,
    "defense": 50,
    "speed": 40,
    "role": "公式カード",
    "traitName": "ホチキス",
    "trait": "このキャラクターが、このキャラクターの向かいにいる敵のキャラクターを攻撃するとき、攻撃のダメージ+10",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "はさみこみ",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "敵に60ダメージ",
        "target": "enemy",
        "effect": {
          "type": "damage",
          "value": 60
        }
      },
      {
        "name": "かみどめ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "敵のキャラクターのうち、このキャラクターの向かいにいるキャラクターに80ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "とじこみ",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "今フィールドにいる敵のキャラクターのうち2人を、次のターン終了時までフィールド以外の場所に移動できなくさせる。さらに、それぞれに40%で確定20ダメージ。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 90,
    "name": "イーゼル",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "芸術に命を捧げている男。根っからの芸術家。",
    "hp": 140,
    "attack": 60,
    "defense": 60,
    "speed": 60,
    "role": "公式カード",
    "traitName": "げいじゅつか",
    "trait": "このキャラクターは、毎ターン開始時にランダムで「こうげき+20, ぼうぎょ-20」か「こうげき-20, ぼうぎょ+20」になる。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "ちっちゃいばくだん",
        "cost": 1,
        "costText": "1MP",
        "special": [],
        "desc": "2ターン後に敵全体に10ダメージ（ただし、2ターン後にこのキャラクターがフィールド上にいなくても、この技の効果は発動する）",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "デッサン",
        "cost": 3,
        "costText": "3MP",
        "special": [],
        "desc": "好きなステータスを+10",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "会心のでき",
        "cost": 4,
        "costText": "4MP",
        "special": [],
        "desc": "プレイフィールド上にいる全ての敵のキャラクターに確定20ダメージ",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  },
  {
    "id": 91,
    "name": "リーズ",
    "origin": "公式カード",
    "faction": "公式カード",
    "archetype": "基本カード",
    "desc": "リユースショップの店主。",
    "hp": 170,
    "attack": 40,
    "defense": 60,
    "speed": 70,
    "role": "公式カード",
    "traitName": "おおもうけ",
    "trait": "このキャラクターは、その前の行動順から次の行動順までの間にプレイヤーが使用したコストカードおよび補助カードの枚数に応じてそのターンのみ好きなステータス+10。ただし分配してもよい。",
    "traitEffect": "manual",
    "skills": [
      {
        "name": "リユース",
        "cost": 2,
        "costText": "2MP",
        "special": [],
        "desc": "捨て札にあるカードを裏向きで1枚引き、手札に加える",
        "target": "none",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "りようほう",
        "cost": 0,
        "costText": "[任意のカード]",
        "special": [],
        "desc": "カードごとに効果が異なる。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      },
      {
        "name": "かいとり",
        "cost": 0,
        "costText": "[その技の必要コスト+1MP]",
        "special": [],
        "desc": "敵のキャラクターが持つ技がどれか一つ使えるようになる。さらに、そのキャラクターはその技を今後使えなくなる。ただし、プレイ中に2回まで。ただし、この技のコストは相手プレイヤーに払う必要がある。",
        "target": "enemy",
        "effect": {
          "type": "manual",
          "value": 0
        }
      }
    ]
  }
];
CARD_DATA.push(...OFFICIAL_SEED);
