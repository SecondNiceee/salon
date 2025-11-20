import path from "path"
import dotenv from "dotenv"

// Load env vars to get the URL if defined, otherwise default to localhost
dotenv.config({ path: path.resolve(process.cwd(), ".production.env") })
dotenv.config()

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL
  ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/globals/cities`
  : "http://localhost:3000/api/globals/cities"

const citiesToAdd = [
  {
    name: "Москва",
    slug: "moskva",
    declensions: {
      nominative: "Москва",
      genitive: "Москвы",
      prepositional: "в Москве",
    },
  },
  {
    name: "Санкт-Петербург",
    slug: "spb",
    declensions: {
      nominative: "Санкт-Петербург",
      genitive: "Санкт-Петербурга",
      prepositional: "в Санкт-Петербурге",
    },
  },
  {
    name: "Новосибирск",
    slug: "novosibirsk",
    declensions: {
      nominative: "Новосибирск",
      genitive: "Новосибирска",
      prepositional: "в Новосибирске",
    },
  },
  {
    name: "Екатеринбург",
    slug: "ekaterinburg",
    declensions: {
      nominative: "Екатеринбург",
      genitive: "Екатеринбурга",
      prepositional: "в Екатеринбурге",
    },
  },
  {
    name: "Нижний Новгород",
    slug: "nn",
    declensions: {
      nominative: "Нижний Новгород",
      genitive: "Нижнего Новгорода",
      prepositional: "в Нижнем Новгороде",
    },
  },
  {
    name: "Казань",
    slug: "kazan",
    declensions: {
      nominative: "Казань",
      genitive: "Казани",
      prepositional: "в казани",
    },
  },
  {
    name: "Челябинск",
    slug: "chelyabinsk",
    declensions: {
      nominative: "Челябинск",
      genitive: "Челябинска",
      prepositional: "в Челябинске",
    },
  },
  {
    name: "Омск",
    slug: "omsk",
    declensions: {
      nominative: "Омск",
      genitive: "Омска",
      prepositional: "в Омске",
    },
  },
  {
    name: "Самара",
    slug: "samara",
    declensions: {
      nominative: "Самара",
      genitive: "Самары",
      prepositional: "в Самаре",
    },
  },
  {
    name: "Уфа",
    slug: "ufa",
    declensions: {
      nominative: "Уфа",
      genitive: "Уфы",
      prepositional: "в Уфе",
    },
  },
  {
    name: "Ростов-на-Дону",
    slug: "rostov-na-donu",
    declensions: {
      nominative: "Ростов-на-Дону",
      genitive: "Ростова-на-Дону",
      prepositional: "в Ростове-на-Дону",
    },
  },
  {
    name: "Красноярск",
    slug: "krasnoyarsk",
    declensions: {
      nominative: "Красноярск",
      genitive: "Красноярска",
      prepositional: "в Красноярске",
    },
  },
  {
    name: "Пермь",
    slug: "perm",
    declensions: {
      nominative: "Пермь",
      genitive: "Перми",
      prepositional: "в Перми",
    },
  },
  {
    name: "Воронеж",
    slug: "voronezh",
    declensions: {
      nominative: "Воронеж",
      genitive: "Воронежа",
      prepositional: "в Воронеже",
    },
  },
  {
    name: "Волгоград",
    slug: "volgograd",
    declensions: {
      nominative: "Волгоград",
      genitive: "Волгограда",
      prepositional: "в Волгограде",
    },
  },
  {
    name: "Краснодар",
    slug: "krasnodar",
    declensions: {
      nominative: "Краснодар",
      genitive: "Краснодара",
      prepositional: "в Краснодаре",
    },
  },
  {
    name: "Саратов",
    slug: "saratov",
    declensions: {
      nominative: "Саратов",
      genitive: "Саратова",
      prepositional: "в Саратове",
    },
  },
  {
    name: "Тюмень",
    slug: "tyumen",
    declensions: {
      nominative: "Тюмень",
      genitive: "Тюмени",
      prepositional: "в Тюмени",
    },
  },
  {
    name: "Тольятти",
    slug: "tolyatti",
    declensions: {
      nominative: "Тольятти",
      genitive: "Тольятти",
      prepositional: "в Тольятти",
    },
  },
  {
    name: "Ижевск",
    slug: "izhevsk",
    declensions: {
      nominative: "Ижевск",
      genitive: "Ижевска",
      prepositional: "в Ижевске",
    },
  },
  {
    name: "Барнаул",
    slug: "barnaul",
    declensions: {
      nominative: "Барнаул",
      genitive: "Барнаула",
      prepositional: "в Барнауле",
    },
  },
  {
    name: "Ульяновск",
    slug: "ulyanovsk",
    declensions: {
      nominative: "Ульяновск",
      genitive: "Ульяновска",
      prepositional: "в Ульяновске",
    },
  },
  {
    name: "Иркутск",
    slug: "irkutsk",
    declensions: {
      nominative: "Иркутск",
      genitive: "Иркутска",
      prepositional: "в Иркутске",
    },
  },
  {
    name: "Хабаровск",
    slug: "khabarovsk",
    declensions: {
      nominative: "Хабаровск",
      genitive: "Хабаровска",
      prepositional: "в Хабаровске",
    },
  },
  {
    name: "Ярославль",
    slug: "yaroslavl",
    declensions: {
      nominative: "Ярославль",
      genitive: "Ярославля",
      prepositional: "в Ярославле",
    },
  },
  {
    name: "Владивосток",
    slug: "vladivostok",
    declensions: {
      nominative: "Владивосток",
      genitive: "Владивостока",
      prepositional: "в Владивостоке",
    },
  },
  {
    name: "Махачкала",
    slug: "makhachkala",
    declensions: {
      nominative: "Махачкала",
      genitive: "Махачкалы",
      prepositional: "в Махачкале",
    },
  },
  {
    name: "Томск",
    slug: "tomsk",
    declensions: {
      nominative: "Томск",
      genitive: "Томска",
      prepositional: "в Томске",
    },
  },
  {
    name: "Оренбург",
    slug: "orenburg",
    declensions: {
      nominative: "Оренбург",
      genitive: "Оренбурга",
      prepositional: "в Оренбурге",
    },
  },
  {
    name: "Кемерово",
    slug: "kemerovo",
    declensions: {
      nominative: "Кемерово",
      genitive: "Кемерова",
      prepositional: "в Кемерове",
    },
  },
  {
    name: "Новокузнецк",
    slug: "novokuzneczk",
    declensions: {
      nominative: "Новокузнецк",
      genitive: "Новокузнецка",
      prepositional: "в Новокузнецке",
    },
  },
  {
    name: "Рязань",
    slug: "ryazan",
    declensions: {
      nominative: "Рязань",
      genitive: "Рязани",
      prepositional: "в Рязани",
    },
  },
  {
    name: "Астрахань",
    slug: "astrakhan",
    declensions: {
      nominative: "Астрахань",
      genitive: "Астрахани",
      prepositional: "в Астрахани",
    },
  },
  {
    name: "Набережные Челны",
    slug: "naberezhnye-chelny",
    declensions: {
      nominative: "Набережные Челны",
      genitive: "Набережных Челнов",
      prepositional: "в Набережных Челнах",
    },
  },
  {
    name: "Пенза",
    slug: "penza",
    declensions: {
      nominative: "Пенза",
      genitive: "Пензы",
      prepositional: "в Пензе",
    },
  },
  {
    name: "Липецк",
    slug: "lipeczk",
    declensions: {
      nominative: "Липецк",
      genitive: "Липецка",
      prepositional: "в Липецке",
    },
  },
  {
    name: "Киров",
    slug: "kirov",
    declensions: {
      nominative: "Киров",
      genitive: "Кирова",
      prepositional: "в Кирове",
    },
  },
  {
    name: "Чебоксары",
    slug: "cheboksary",
    declensions: {
      nominative: "Чебоксары",
      genitive: "Чебоксар",
      prepositional: "в Чебоксарах",
    },
  },
  {
    name: "Калининград",
    slug: "kaliningrad",
    declensions: {
      nominative: "Калининград",
      genitive: "Калининграда",
      prepositional: "в Калининграде",
    },
  },
  {
    name: "Балашиха",
    slug: "balashikha",
    declensions: {
      nominative: "Балашиха",
      genitive: "Балашихи",
      prepositional: "в Балашихе",
    },
  },
  {
    name: "Курск",
    slug: "kursk",
    declensions: {
      nominative: "Курск",
      genitive: "Курска",
      prepositional: "в Курске",
    },
  },
  {
    name: "Севастополь",
    slug: "sevastopol",
    declensions: {
      nominative: "Севастополь",
      genitive: "Севастополя",
      prepositional: "в Севастополе",
    },
  },
  {
    name: "Улан-Удэ",
    slug: "ulan-ude",
    declensions: {
      nominative: "Улан-Удэ",
      genitive: "Улан-Удэ",
      prepositional: "в Улан-Удэ",
    },
  },
  {
    name: "Ставрополь",
    slug: "stavropol",
    declensions: {
      nominative: "Ставрополь",
      genitive: "Ставрополя",
      prepositional: "в Ставрополе",
    },
  },
  {
    name: "Сочи",
    slug: "sochi",
    declensions: {
      nominative: "Сочи",
      genitive: "Сочи",
      prepositional: "в Сочи",
    },
  },
  {
    name: "Тверь",
    slug: "tver",
    declensions: {
      nominative: "Тверь",
      genitive: "Твери",
      prepositional: "в Твери",
    },
  },
  {
    name: "Магнитогорск",
    slug: "magnitogorsk",
    declensions: {
      nominative: "Магнитогорск",
      genitive: "Магнитогорска",
      prepositional: "в Магнитогорске",
    },
  },
  {
    name: "Иваново",
    slug: "ivanovo",
    declensions: {
      nominative: "Иваново",
      genitive: "Иванова",
      prepositional: "в Иванове",
    },
  },
  {
    name: "Брянск",
    slug: "bryansk",
    declensions: {
      nominative: "Брянск",
      genitive: "Брянска",
      prepositional: "в Брянске",
    },
  },
  {
    name: "Белгород",
    slug: "belgorod",
    declensions: {
      nominative: "Белгород",
      genitive: "Белгорода",
      prepositional: "в Белгороде",
    },
  },
  {
    name: "Сургут",
    slug: "surgut",
    declensions: {
      nominative: "Сургут",
      genitive: "Сургута",
      prepositional: "в Сургуте",
    },
  },
  {
    name: "Нижний Тагил",
    slug: "nizhniy-tagil",
    declensions: {
      nominative: "Нижний Тагил",
      genitive: "Нижнего Тагила",
      prepositional: "в Нижнем Тагиле",
    },
  },
  {
    name: "Архангельск",
    slug: "arkhangelsk",
    declensions: {
      nominative: "Архангельск",
      genitive: "Архангельска",
      prepositional: "в Архангельске",
    },
  },
  {
    name: "Чита",
    slug: "chita",
    declensions: {
      nominative: "Чита",
      genitive: "Читы",
      prepositional: "в Чите",
    },
  },
  {
    name: "Симферополь",
    slug: "simferopol",
    declensions: {
      nominative: "Симферополь",
      genitive: "Симферополя",
      prepositional: "в Симферополе",
    },
  },
  {
    name: "Калуга",
    slug: "kaluga",
    declensions: {
      nominative: "Калуга",
      genitive: "Калуги",
      prepositional: "в Калуге",
    },
  },
  {
    name: "Смоленск",
    slug: "smolensk",
    declensions: {
      nominative: "Смоленск",
      genitive: "Смоленска",
      prepositional: "в Смоленске",
    },
  },
  {
    name: "Волжский",
    slug: "volzhskiy",
    declensions: {
      nominative: "Волжский",
      genitive: "Волжского",
      prepositional: "в Волжском",
    },
  },
  {
    name: "Курган",
    slug: "kurgan",
    declensions: {
      nominative: "Курган",
      genitive: "Кургана",
      prepositional: "в Кургане",
    },
  },
  {
    name: "Якутск",
    slug: "yakutsk",
    declensions: {
      nominative: "Якутск",
      genitive: "Якутска",
      prepositional: "в Якутске",
    },
  },
  {
    name: "Владикавказ",
    slug: "vladikavkaz",
    declensions: {
      nominative: "Владикавказ",
      genitive: "Владикавказа",
      prepositional: "в Владикавказе",
    },
  },
  {
    name: "Подольск",
    slug: "podolsk",
    declensions: {
      nominative: "Подольск",
      genitive: "Подольска",
      prepositional: "в Подольске",
    },
  },
  {
    name: "Мурманск",
    slug: "murmansk",
    declensions: {
      nominative: "Мурманск",
      genitive: "Мурманска",
      prepositional: "в Мурманске",
    },
  },
  {
    name: "Тамбов",
    slug: "tambov",
    declensions: {
      nominative: "Тамбов",
      genitive: "Тамбова",
      prepositional: "в Тамбове",
    },
  },
  {
    name: "Стерлитамак",
    slug: "sterlitamak",
    declensions: {
      nominative: "Стерлитамак",
      genitive: "Стерлитамака",
      prepositional: "в Стерлитамаке",
    },
  },
  {
    name: "Петрозаводск",
    slug: "petrozavodsk",
    declensions: {
      nominative: "Петрозаводск",
      genitive: "Петрозаводска",
      prepositional: "в Петрозаводске",
    },
  },
  {
    name: "Кострома",
    slug: "kostroma",
    declensions: {
      nominative: "Кострома",
      genitive: "Костромы",
      prepositional: "в Костроме",
    },
  },
  {
    name: "Новороссийск",
    slug: "novorossiysk",
    declensions: {
      nominative: "Новороссийск",
      genitive: "Новороссийска",
      prepositional: "в Новороссийске",
    },
  },
  {
    name: "Химки",
    slug: "khimki",
    declensions: {
      nominative: "Химки",
      genitive: "Химок",
      prepositional: "в Химках",
    },
  },
  {
    name: "Таганрог",
    slug: "taganrog",
    declensions: {
      nominative: "Таганрог",
      genitive: "Таганрога",
      prepositional: "в Таганроге",
    },
  },
  {
    name: "Комсомольск-на-Амуре",
    slug: "komsomolsk-na-amure",
    declensions: {
      nominative: "Комсомольск-на-Амуре",
      genitive: "Комсомольска-на-Амуре",
      prepositional: "в Комсомольске-на-Амуре",
    },
  },
  {
    name: "Сыктывкар",
    slug: "syktyvkar",
    declensions: {
      nominative: "Сыктывкар",
      genitive: "Сыктывкара",
      prepositional: "в Сыктывкаре",
    },
  },
  {
    name: "Нальчик",
    slug: "nalchik",
    declensions: {
      nominative: "Нальчик",
      genitive: "Нальчика",
      prepositional: "в Нальчике",
    },
  },
  {
    name: "Нижнекамск",
    slug: "nizhnekamsk",
    declensions: {
      nominative: "Нижнекамск",
      genitive: "Нижнекамска",
      prepositional: "в Нижнекамске",
    },
  },
  {
    name: "Дзержинск",
    slug: "dzerzhinsk",
    declensions: {
      nominative: "Дзержинск",
      genitive: "Дзержинска",
      prepositional: "в Дзержинске",
    },
  },
  {
    name: "Шахты",
    slug: "shakhty",
    declensions: {
      nominative: "Шахты",
      genitive: "Шахт",
      prepositional: "в Шахтах",
    },
  },
  {
    name: "Братск",
    slug: "bratsk",
    declensions: {
      nominative: "Братск",
      genitive: "Братска",
      prepositional: "в Братске",
    },
  },
  {
    name: "Орск",
    slug: "orsk",
    declensions: {
      nominative: "Орск",
      genitive: "Орска",
      prepositional: "в Орске",
    },
  },
  {
    name: "Ангарск",
    slug: "angarsk",
    declensions: {
      nominative: "Ангарск",
      genitive: "Ангарска",
      prepositional: "в Ангарске",
    },
  },
  {
    name: "Благовещенск",
    slug: "blagoveschensk",
    declensions: {
      nominative: "Благовещенск",
      genitive: "Благовещенска",
      prepositional: "в Благовещенске",
    },
  },
  {
    name: "Старый Оскол",
    slug: "staryy-oskol",
    declensions: {
      nominative: "Старый Оскол",
      genitive: "Старого Оскола",
      prepositional: "в Старом Осколе",
    },
  },
  {
    name: "Королёв",
    slug: "korolyov",
    declensions: {
      nominative: "Королёв",
      genitive: "Королёва",
      prepositional: "в Королёве",
    },
  },
  {
    name: "Великий Новгород",
    slug: "velikiy-novgorod",
    declensions: {
      nominative: "Великий Новгород",
      genitive: "Великого Новгорода",
      prepositional: "в Великом Новгороде",
    },
  },
  {
    name: "Мытищи",
    slug: "mytischi",
    declensions: {
      nominative: "Мытищи",
      genitive: "Мытищ",
      prepositional: "в Мытищах",
    },
  },
  {
    name: "Псков",
    slug: "pskov",
    declensions: {
      nominative: "Псков",
      genitive: "Пскова",
      prepositional: "в Пскове",
    },
  },
  {
    name: "Люберцы",
    slug: "lyubercy",
    declensions: {
      nominative: "Люберцы",
      genitive: "Люберец",
      prepositional: "в Люберцах",
    },
  },
  {
    name: "Бийск",
    slug: "biysk",
    declensions: {
      nominative: "Бийск",
      genitive: "Бийска",
      prepositional: "в Бийске",
    },
  },
  {
    name: "Прокопьевск",
    slug: "prokopevsk",
    declensions: {
      nominative: "Прокопьевск",
      genitive: "Прокопьевска",
      prepositional: "в Прокопьевске",
    },
  },
  {
    name: "Армавир",
    slug: "armavir",
    declensions: {
      nominative: "Армавир",
      genitive: "Армавира",
      prepositional: "в Армавире",
    },
  },
  {
    name: "Балаково",
    slug: "balakovo",
    declensions: {
      nominative: "Балаково",
      genitive: "Балакова",
      prepositional: "в Балакове",
    },
  },
  {
    name: "Рыбинск",
    slug: "rybinsk",
    declensions: {
      nominative: "Рыбинск",
      genitive: "Рыбинска",
      prepositional: "в Рыбинске",
    },
  },
  {
    name: "Абакан",
    slug: "abakan",
    declensions: {
      nominative: "Абакан",
      genitive: "Абакана",
      prepositional: "в Абакане",
    },
  },
  {
    name: "Северодвинск",
    slug: "severodvinsk",
    declensions: {
      nominative: "Северодвинск",
      genitive: "Северодвинска",
      prepositional: "в Северодвинске",
    },
  },
  {
    name: "Норильск",
    slug: "norilsk",
    declensions: {
      nominative: "Норильск",
      genitive: "Норильска",
      prepositional: "в Норильске",
    },
  },
  {
    name: "Волгодонск",
    slug: "volgodonsk",
    declensions: {
      nominative: "Волгодонск",
      genitive: "Волгодонска",
      prepositional: "в Волгодонске",
    },
  },
  {
    name: "Уссурийск",
    slug: "ussuriysk",
    declensions: {
      nominative: "Уссурийск",
      genitive: "Уссурийска",
      prepositional: "в Уссурийске",
    },
  },
  {
    name: "Каменск-Уральский",
    slug: "kamensk-uralskiy",
    declensions: {
      nominative: "Каменск-Уральский",
      genitive: "Каменска-Уральского",
      prepositional: "в Каменске-Уральском",
    },
  },
  {
    name: "Новочеркасск",
    slug: "novocherkassk",
    declensions: {
      nominative: "Новочеркасск",
      genitive: "Новочеркасска",
      prepositional: "в Новочеркасске",
    },
  },
  {
    name: "Златоуст",
    slug: "zlatoust",
    declensions: {
      nominative: "Златоуст",
      genitive: "Златоуста",
      prepositional: "в Златоусте",
    },
  },
  {
    name: "Красногорск",
    slug: "krasnogorsk",
    declensions: {
      nominative: "Красногорск",
      genitive: "Красногорска",
      prepositional: "в Красногорске",
    },
  },
  {
    name: "Электросталь",
    slug: "elektrostal",
    declensions: {
      nominative: "Электросталь",
      genitive: "Электростали",
      prepositional: "в Электростали",
    },
  },
  {
    name: "Альметьевск",
    slug: "almetevsk",
    declensions: {
      nominative: "Альметьевск",
      genitive: "Альметьевска",
      prepositional: "в Альметьевске",
    },
  },
  {
    name: "Салават",
    slug: "salavat",
    declensions: {
      nominative: "Салават",
      genitive: "Салавата",
      prepositional: "в Салавате",
    },
  },
  {
    name: "Миасс",
    slug: "miass",
    declensions: {
      nominative: "Миасс",
      genitive: "Миасса",
      prepositional: "в Миассе",
    },
  },
  {
    name: "Керчь",
    slug: "kerch",
    declensions: {
      nominative: "Керчь",
      genitive: "Керчи",
      prepositional: "в Керчи",
    },
  },
  {
    name: "Находка",
    slug: "nakhodka",
    declensions: {
      nominative: "Находка",
      genitive: "Находки",
      prepositional: "в Находке",
    },
  },
  {
    name: "Копейск",
    slug: "kopeysk",
    declensions: {
      nominative: "Копейск",
      genitive: "Копейска",
      prepositional: "в Копейске",
    },
  },
  {
    name: "Пятигорск",
    slug: "pyatigorsk",
    declensions: {
      nominative: "Пятигорск",
      genitive: "Пятигорска",
      prepositional: "в Пятигорске",
    },
  },
  {
    name: "Рубцовск",
    slug: "rubczovsk",
    declensions: {
      nominative: "Рубцовск",
      genitive: "Рубцовска",
      prepositional: "в Рубцовске",
    },
  },
  {
    name: "Березники",
    slug: "berezniki",
    declensions: {
      nominative: "Березники",
      genitive: "Березников",
      prepositional: "в Березниках",
    },
  },
  {
    name: "Коломна",
    slug: "kolomna",
    declensions: {
      nominative: "Коломна",
      genitive: "Коломны",
      prepositional: "в Коломне",
    },
  },
  {
    name: "Майкоп",
    slug: "maykop",
    declensions: {
      nominative: "Майкоп",
      genitive: "Майкопа",
      prepositional: "в Майкопе",
    },
  },
  {
    name: "Хасавюрт",
    slug: "khasavyurt",
    declensions: {
      nominative: "Хасавюрт",
      genitive: "Хасавюрта",
      prepositional: "в Хасавюрте",
    },
  },
  {
    name: "Одинцово",
    slug: "odinczovo",
    declensions: {
      nominative: "Одинцово",
      genitive: "Одинцова",
      prepositional: "в Одинцове",
    },
  },
  {
    name: "Нефтекамск",
    slug: "neftekamsk",
    declensions: {
      nominative: "Нефтекамск",
      genitive: "Нефтекамска",
      prepositional: "в Нефтекамске",
    },
  },
  {
    name: "Кисловодск",
    slug: "kislovodsk",
    declensions: {
      nominative: "Кисловодск",
      genitive: "Кисловодска",
      prepositional: "в Кисловодске",
    },
  },
  {
    name: "Домодедово",
    slug: "domodedovo",
    declensions: {
      nominative: "Домодедово",
      genitive: "Домодедова",
      prepositional: "в Домодедове",
    },
  },
  {
    name: "Новочебоксарск",
    slug: "novocheboksarsk",
    declensions: {
      nominative: "Новочебоксарск",
      genitive: "Новочебоксарска",
      prepositional: "в Новочебоксарске",
    },
  },
  {
    name: "Батайск",
    slug: "bataysk",
    declensions: {
      nominative: "Батайск",
      genitive: "Батайска",
      prepositional: "в Батайске",
    },
  },
  {
    name: "Серпухов",
    slug: "serpukhov",
    declensions: {
      nominative: "Серпухов",
      genitive: "Серпухова",
      prepositional: "в Серпухове",
    },
  },
  {
    name: "Щёлково",
    slug: "schyolkovo",
    declensions: {
      nominative: "Щёлково",
      genitive: "Щёлкова",
      prepositional: "в Щёлкове",
    },
  },
  {
    name: "Дербент",
    slug: "derbent",
    declensions: {
      nominative: "Дербент",
      genitive: "Дербента",
      prepositional: "в Дербенте",
    },
  },
  {
    name: "Первоуральск",
    slug: "pervouralsk",
    declensions: {
      nominative: "Первоуральск",
      genitive: "Первоуральска",
      prepositional: "в Первоуральске",
    },
  },
  {
    name: "Черкесск",
    slug: "cherkessk",
    declensions: {
      nominative: "Черкесск",
      genitive: "Черкесска",
      prepositional: "в Черкесске",
    },
  },
  {
    name: "Орехово-Зуево",
    slug: "orekhovo-zuevo",
    declensions: {
      nominative: "Орехово-Зуево",
      genitive: "Орехова-Зуева",
      prepositional: "в Орехове-Зуеве",
    },
  },
  {
    name: "Невинномысск",
    slug: "nevinnomyssk",
    declensions: {
      nominative: "Невинномысск",
      genitive: "Невинномысска",
      prepositional: "в Невинномысске",
    },
  },
  {
    name: "Кызыл",
    slug: "kyzyl",
    declensions: {
      nominative: "Кызыл",
      genitive: "Кызыла",
      prepositional: "в Кызыле",
    },
  },
  {
    name: "Каспийск",
    slug: "kaspiysk",
    declensions: {
      nominative: "Каспийск",
      genitive: "Каспийска",
      prepositional: "в Каспийске",
    },
  },
  {
    name: "Раменское",
    slug: "ramenskoe",
    declensions: {
      nominative: "Раменское",
      genitive: "Раменского",
      prepositional: "в Раменском",
    },
  },
  {
    name: "Димитровград",
    slug: "dimitrovgrad",
    declensions: {
      nominative: "Димитровград",
      genitive: "Димитровграда",
      prepositional: "в Димитровграде",
    },
  },
  {
    name: "Обнинск",
    slug: "obninsk",
    declensions: {
      nominative: "Обнинск",
      genitive: "Обнинска",
      prepositional: "в Обнинске",
    },
  },
  {
    name: "Октябрьский",
    slug: "oktyabrskiy",
    declensions: {
      nominative: "Октябрьский",
      genitive: "Октябрьского",
      prepositional: "в Октябрьском",
    },
  },
  {
    name: "Камышин",
    slug: "kamyshin",
    declensions: {
      nominative: "Камышин",
      genitive: "Камышина",
      prepositional: "в Камышине",
    },
  },
  {
    name: "Долгопрудный",
    slug: "dolgoprudnyy",
    declensions: {
      nominative: "Долгопрудный",
      genitive: "Долгопрудного",
      prepositional: "в Долгопрудном",
    },
  },
  {
    name: "Ессентуки",
    slug: "essentuki",
    declensions: {
      nominative: "Ессентуки",
      genitive: "Ессентуков",
      prepositional: "в Ессентуках",
    },
  },
  {
    name: "Новошахтинск",
    slug: "novoshakhtinsk",
    declensions: {
      nominative: "Новошахтинск",
      genitive: "Новошахтинска",
      prepositional: "в Новошахтинске",
    },
  },
  {
    name: "Жуковский",
    slug: "zhukovskiy",
    declensions: {
      nominative: "Жуковский",
      genitive: "Жуковского",
      prepositional: "в Жуковском",
    },
  },
  {
    name: "Северск",
    slug: "seversk",
    declensions: {
      nominative: "Северск",
      genitive: "Северска",
      prepositional: "в Северске",
    },
  },
  {
    name: "Ноябрьск",
    slug: "noyabrsk",
    declensions: {
      nominative: "Ноябрьск",
      genitive: "Ноябрьска",
      prepositional: "в Ноябрьске",
    },
  },
  {
    name: "Артём",
    slug: "artyom",
    declensions: {
      nominative: "Артём",
      genitive: "Артёма",
      prepositional: "в Артёме",
    },
  },
  {
    name: "Евпатория",
    slug: "evpatoriya",
    declensions: {
      nominative: "Евпатория",
      genitive: "Евпатории",
      prepositional: "в Евпатории",
    },
  },
  {
    name: "Ачинск",
    slug: "achinsk",
    declensions: {
      nominative: "Ачинск",
      genitive: "Ачинска",
      prepositional: "в Ачинске",
    },
  },
  {
    name: "Пушкино",
    slug: "pushkino",
    declensions: {
      nominative: "Пушкино",
      genitive: "Пушкина",
      prepositional: "в Пушкине",
    },
  },
  {
    name: "Арзамас",
    slug: "arzamas",
    declensions: {
      nominative: "Арзамас",
      genitive: "Арзамаса",
      prepositional: "в Арзамасе",
    },
  },
  {
    name: "Елец",
    slug: "elecz",
    declensions: {
      nominative: "Елец",
      genitive: "Ельца",
      prepositional: "в Ельце",
    },
  },
  {
    name: "Реутов",
    slug: "reutov",
    declensions: {
      nominative: "Реутов",
      genitive: "Реутова",
      prepositional: "в Реутове",
    },
  },
  {
    name: "Бердск",
    slug: "berdsk",
    declensions: {
      nominative: "Бердск",
      genitive: "Бердска",
      prepositional: "в Бердске",
    },
  },
  {
    name: "Сергиев Посад",
    slug: "sergiev-posad",
    declensions: {
      nominative: "Сергиев Посад",
      genitive: "Сергиева Посада",
      prepositional: "в Сергиевом Посаде",
    },
  },
  {
    name: "Элиста",
    slug: "elista",
    declensions: {
      nominative: "Элиста",
      genitive: "Элисты",
      prepositional: "в Элисте",
    },
  },
  {
    name: "Ногинск",
    slug: "noginsk",
    declensions: {
      nominative: "Ногинск",
      genitive: "Ногинска",
      prepositional: "в Ногинске",
    },
  },
  {
    name: "Железногорск",
    slug: "zheleznogorsk",
    declensions: {
      nominative: "Железногорск",
      genitive: "Железногорска",
      prepositional: "в Железногорске",
    },
  },
  {
    name: "Владимир",
    slug: "vladimir",
    declensions: {
      nominative: "Владимир",
      genitive: "Владимира",
      prepositional: "во Владимире",
    },
  },
  {
    name: "Череповец",
    slug: "cherepovecz",
    declensions: {
      nominative: "Череповец",
      genitive: "Череповца",
      prepositional: "в Череповце",
    },
  },
  {
    name: "Орёл",
    slug: "oryol",
    declensions: {
      nominative: "Орёл",
      genitive: "Орла",
      prepositional: "в Орле",
    },
  },
  {
    name: "Саранск",
    slug: "saransk",
    declensions: {
      nominative: "Саранск",
      genitive: "Саранска",
      prepositional: "в Саранске",
    },
  },
  {
    name: "Вологда",
    slug: "vologda",
    declensions: {
      nominative: "Вологда",
      genitive: "Вологды",
      prepositional: "в Вологде",
    },
  },
  {
    name: "Грозный",
    slug: "groznyy",
    declensions: {
      nominative: "Грозный",
      genitive: "Грозного",
      prepositional: "в Грозном",
    },
  },
  {
    name: "Нижневартовск",
    slug: "nizhnevartovsk",
    declensions: {
      nominative: "Нижневартовск",
      genitive: "Нижневартовска",
      prepositional: "в Нижневартовске",
    },
  },
  {
    name: "Йошкар-Ола",
    slug: "yoshkar-ola",
    declensions: {
      nominative: "Йошкар-Ола",
      genitive: "Йошкар-Олы",
      prepositional: "в Йошкар-Оле",
    },
  },
  {
    name: "Энгельс",
    slug: "engels",
    declensions: {
      nominative: "Энгельс",
      genitive: "Энгельса",
      prepositional: "в Энгельсе",
    },
  },
  {
    name: "Южно-Сахалинск",
    slug: "yuzhno-sakhalinsk",
    declensions: {
      nominative: "Южно-Сахалинск",
      genitive: "Южно-Сахалинска",
      prepositional: "в Южно-Сахалинске",
    },
  },
  {
    name: "Петропавловск-Камчатский",
    slug: "petropavlovsk-kamchatskiy",
    declensions: {
      nominative: "Петропавловск-Камчатский",
      genitive: "Петропавловска-Камчатского",
      prepositional: "в Петропавловске-Камчатском",
    },
  },
  {
    name: "Сызрань",
    slug: "syzran",
    declensions: {
      nominative: "Сызрань",
      genitive: "Сызрани",
      prepositional: "в Сызрани",
    },
  },
  {
    name: "Ковров",
    slug: "kovrov",
    declensions: {
      nominative: "Ковров",
      genitive: "Коврова",
      prepositional: "в Коврове",
    },
  },
  {
    name: "Нефтеюганск",
    slug: "nefteyugansk",
    declensions: {
      nominative: "Нефтеюганск",
      genitive: "Нефтеюганска",
      prepositional: "в Нефтеюганске",
    },
  },
  {
    name: "Новомосковск",
    slug: "novomoskovsk",
    declensions: {
      nominative: "Новомосковск",
      genitive: "Новомосковска",
      prepositional: "в Новомосковске",
    },
  },
  {
    name: "Назрань",
    slug: "nazran",
    declensions: {
      nominative: "Назрань",
      genitive: "Назрани",
      prepositional: "в Назрани",
    },
  },
  {
    name: "Новый Уренгой",
    slug: "novyy-urengoy",
    declensions: {
      nominative: "Новый Уренгой",
      genitive: "Нового Уренгоя",
      prepositional: "в Новом Уренгое",
    },
  },
  {
    name: "Муром",
    slug: "murom",
    declensions: {
      nominative: "Муром",
      genitive: "Мурома",
      prepositional: "в Муроме",
    },
  },
  {
    name: "Новокуйбышевск",
    slug: "novokuybyshevsk",
    declensions: {
      nominative: "Новокуйбышевск",
      genitive: "Новокуйбышевска",
      prepositional: "в Новокуйбышевске",
    },
  },
]

async function seed() {
  console.log(`Connecting to ${API_URL}...`)

  try {
    // 1. Get existing cities
    const getResponse = await fetch(API_URL)

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch existing cities: ${getResponse.status} ${getResponse.statusText}`)
    }

    const data = await getResponse.json()
    const existingCities = data.cities || []
    const existingSlugs = new Set(existingCities.map((c: any) => c.slug))

    // 2. Filter new cities
    const newCities = citiesToAdd.filter((c) => !existingSlugs.has(c.slug))

    if (newCities.length === 0) {
      console.log("No new cities to add.")
      process.exit(0)
    }

    console.log(`Adding ${newCities.length} new cities...`)

    // 3. Update global
    const updateResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cities: [...existingCities, ...newCities],
      }),
    })

    if (!updateResponse.ok) {
      throw new Error(`Failed to update cities: ${updateResponse.status} ${updateResponse.statusText}`)
    }

    console.log("Cities updated successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding cities:", error)
    process.exit(1)
  }
}

seed()
