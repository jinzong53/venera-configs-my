class Comick extends ComicSource {
    // Note: The fields which are marked as [Optional] should be removed if not used

    // name of the source
    name = "comick"

    // unique id of the source
    key = "comick"

    version = "1.0.0"

    minAppVersion = "1.4.0"

    // update url
    url = "https://cdn.jsdelivr.net/gh/venera-app/venera-configs@main/baozi.js"

    /**
     * [Optional] init function
     */

    settings = {
        domains: {
            title: "主页源",
            type: "select",
            options: [
                { value: "comick.io/home2" },
                { value: "preview.comick.io" }
            ],
            default: "comick.io/home2"
        }
    }

    get baseUrl() {
        let domain = this.loadSetting('domains') || this.settings.domains.default;
        return `https://preview.comick.io/`;
    }

    static category_param_dict = {
        "romance": "浪漫",
        "comedy": "喜剧",
        "drama": "剧情",
        "fantasy": "奇幻",
        "slice-of-life": "日常",
        "action": "动作",
        "adventure": "冒险",
        "psychological": "心理",
        "mystery": "悬疑",
        "historical": "历史",
        "tragedy": "悲剧",
        "sci-fi": "科幻",
        "horror": "恐怖",
        "isekai": "异世界",
        "sports": "运动",
        "thriller": "惊悚",
        "mecha": "机甲",
        "philosophical": "哲学",
        "wuxia": "武侠",
        "medical": "医疗",
        "magical-girls": "魔法少女",
        "superhero": "超级英雄",
        "shounen-ai": "少年爱",
        "mature": "成人",
        "gender-bender": "性转",
        "shoujo-ai": "少女爱",
        "oneshot": "单篇",
        "web-comic": "网络漫画",
        "doujinshi": "同人志",
        "full-color": "全彩",
        "long-strip": "长条",
        "adaptation": "改编",
        "anthology": "选集",
        "4-koma": "四格",
        "user-created": "用户创作",
        "award-winning": "获奖",
        "official-colored": "官方上色",
        "fan-colored": "粉丝上色",
        "school-life": "校园生活",
        "supernatural": "超自然",
        "magic": "魔法",
        "monsters": "怪物",
        "martial-arts": "武术",
        "animals": "动物",
        "demons": "恶魔",
        "harem": "后宫",
        "reincarnation": "转生",
        "office-workers": "上班族",
        "survival": "生存",
        "military": "军事",
        "crossdressing": "女装",
        "loli": "萝莉",
        "video-games": "电子游戏",
        "monster-girls": "魔物娘",
        "delinquents": "不良少年",
        "ghosts": "幽灵",
        "time-travel": "时间旅行",
        "cooking": "烹饪",
        "police": "警察",
        "aliens": "外星人",
        "music": "音乐",
        "mafia": "黑帮",
        "vampires": "吸血鬼",
        "samurai": "武士",
        "post-apocalyptic": "后末日",
        "gyaru": "辣妹",
        "villainess": "恶役千金",
        "reverse-harem": "逆后宫",
        "ninja": "忍者",
        "zombies": "僵尸",
        "traditional-games": "传统游戏",
        "virtual-reality": "虚拟现实",
        "yuri": "百合"
    }

    parseComicSerch(e) {
        let url = e.querySelector("div.pl-3 > a.block")?.href; //测试通过

        let id = url.split("/").pop(); //测试通过

        let title = e.querySelector("div.pl-3 > a > p.font-bold.truncate").text.trim(); //测试通过

        let cover = e.querySelector("div.relative > a >img").attributes["src"]; //测试通过

        //let tags = e.querySelectorAll("div.tabs > span").map(e => e.text.trim())
        // 通过完整的类名路径定位
        let tags = e.querySelector('span[title="Published"]')?.textContent.trim() || '未知年份' //测试通过

        let description = e.querySelector('div.pl-3 > a > p.overflow-ellipsis')?.text.trim(); //测试通过

        return {
            id: id,
            title: title,
            cover: cover,
            tags: [tags],
            description: description
        }
    }

    parseComic(e){
        let url = e.querySelector("a")?.href; //测试通过

        let id = url.split("/").pop(); //测试通过

        let title = id; //测试通过

        let cover = e.querySelector("a>div>img").attributes["src"]; //测试通过

        //let tags = e.querySelectorAll("div.tabs > span").map(e => e.text.trim())
        // 通过完整的类名路径定位
        let tags = [" "] //测试通过

        //let description = e.querySelector('div.pl-3 > a > p.overflow-ellipsis')?.text.trim(); //测试通过

        return {
            id: id,
            title: title,
            cover: cover,
            tags: tags,
            description: " "
        }
    }

    // 测试通过
    explore = [{
        /// 标题
        /// 标题同时用作标识符, 不能重复
        title: "comick",

        /// singlePageWithMultiPart 或者 multiPageComicList
        type: "singlePageWithMultiPart",

        load: async () => {
            var res = await Network.get(this.baseUrl)
            if (res.status !== 200) {
                throw "Invalid status code: " + res.status
            }
            let document = new HtmlDocument(res.body);
            let jsonData = JSON.parse(document.getElementById('__NEXT_DATA__').text); //json解析方式
            // 获取漫画数据
            let mangaData = jsonData.props.pageProps.data;

            // 提取 rank 数据（简化版）
            let simplifiedRank = mangaData.rank.map(manga => ({
              title: manga.title,
              slug: manga.slug,
              lastChapter: manga.last_chapter ?? "未知",
              cover: manga.md_covers?.[0]?.b2key ?
                `https://meo.comick.pictures/${manga.md_covers[0].b2key}` : 'w7xqzd.jpg',
              rating: manga.content_rating,
              isEnglish: manga.is_english_title,
              genres: manga.genres
            }));

            // 提取 recentRank 数据（简化版）
            const simplifiedRecentRank = mangaData.recentRank.map(manga => ({
              title: manga.title,
              slug: manga.slug,
              lastChapter: manga.last_chapter ?? "未知",
              cover: manga.md_covers?.[0]?.b2key ?
                `https://meo.comick.pictures/${manga.md_covers[0].b2key}` :'w7xqzd.jpg',
              rating: manga.content_rating,
              isEnglish: manga.is_english_title,
              genres: manga.genres
            }));

            // 提取 news 数据（简化版）
            const simplifiedNews = mangaData.news.map(manga => ({
              title: manga.title,
              slug: manga.slug,
              lastChapter: manga.last_chapter ?? "未知",
              cover: manga.md_covers?.[0]?.b2key ?
                `https://meo.comick.pictures/${manga.md_covers[0].b2key}` :'w7xqzd.jpg',
              rating: manga.content_rating,
              isEnglish: manga.is_english_title,
              genres: manga.genres
            }));

            // 提取 extendedNews 数据（简化版）
            const simplifiedExtendedNews = mangaData.extendedNews.map(manga => ({
              title: manga.title,
              slug: manga.slug,
              lastChapter: manga.last_chapter ?? "未知",
              cover: manga.md_covers?.[0]?.b2key ?
                `https://meo.comick.pictures/${manga.md_covers[0].b2key}` :'w7xqzd.jpg',
              rating: manga.content_rating,
              isEnglish: manga.is_english_title,
              genres: manga.genres
            }));

            // 提取 completions 数据（简化版）
            const simplifiedCompletions = mangaData.completions.map(manga => ({
              title: manga.title,
              slug: manga.slug,
              lastChapter: manga.last_chapter ?? "未知",
              cover: manga.md_covers?.[0]?.b2key ?
                `https://meo.comick.pictures/${manga.md_covers[0].b2key}` :'w7xqzd.jpg',
              rating: manga.content_rating,
              isEnglish: manga.is_english_title,
              genres: manga.genres
            }));


            let result = {};

            let recent_hot = [];
            for (let book of simplifiedRecentRank) {
                let temp_book = {
                    id: book.slug,
                    title: book.title,
                    cover: book.cover,
                    tags: [],
                    description: "更新至：" + book.lastChapter
                }
                recent_hot.push(temp_book);
            }
            result["最近热门"] = recent_hot;

            let hot = [];
            for (let book of simplifiedRank) {
                let temp_book = {
                    id: book.slug,
                    title: book.title,
                    cover: book.cover,
                    tags: [],
                    description: "更新至：" + book.lastChapter
                }
                hot.push(temp_book);
            }
            result["总热门"] = hot;

            let new_updates = [];
            for (let book of simplifiedNews) {
                let temp_book = {
                    id: book.slug,
                    title: book.title,
                    cover: book.cover,
                    tags: [],
                    description: "更新至：" + book.lastChapter
                }
                new_updates.push(temp_book);
            }
            result["最近上传"] = new_updates;

            let new_extends = [];
            for (let book of simplifiedExtendedNews) {
                let temp_book = {
                    id: book.slug,
                    title: book.title,
                    cover: book.cover,
                    tags: [],
                    description: "更新至：" + book.lastChapter
                }
                new_extends.push(temp_book);
            }
            result["最近更新"] = new_extends;

            let new_completions = [];
            for (let book of simplifiedCompletions) {
                let temp_book = {
                    id: book.slug,
                    title: book.title,
                    cover: book.cover,
                    tags: [],
                    description: "更新至：" + book.lastChapter
                }
                new_completions.push(temp_book);
            }
            result["完结"] = new_completions;


            return result
        }
    }
    ]

    // categories
    category = {
        /// title of the category page, used to identify the page, it should be unique
        title: "",
        parts: [
            {
                // title of the part
                name: "Theme",

                // fixed or random or dynamic
                // if random, need to provide `randomNumber` field, which indicates the number of comics to display at the same time
                // if dynamic, need to provide `loader` field, which indicates the function to load comics
                type: "fixed",

                // Remove this if type is dynamic
                categories: [
                    {
                        label: "Category1",
                        /**
                         * @type {PageJumpTarget}
                         */
                        target: {
                            page: "category",
                            attributes: {
                                category: "category1",
                                param: null,
                            },
                        },
                    },
                ]

                // number of comics to display at the same time
                // randomNumber: 5,

                // load function for dynamic type
                // loader: async () => {
                //     return [
                //          // ...
                //     ]
                // }
            }
        ],
        // enable ranking page
        enableRankingPage: false,
    }

    /// category comic loading related
    categoryComics = {
        /**
         * load comics of a category
         * @param category {string} - category name
         * @param param {string?} - category param
         * @param options {string[]} - options from optionList
         * @param page {number} - page number
         * @returns {Promise<{comics: Comic[], maxPage: number}>}
         */
        load: async (category, param, options, page) => {
            /*
            ```
            let data = JSON.parse((await Network.get('...')).body)
            let maxPage = data.maxPage

            function parseComic(comic) {
                // ...

                return new Comic({
                    id: id,
                    title: title,
                    subTitle: author,
                    cover: cover,
                    tags: tags,
                    description: description
                })
            }

            return {
                comics: data.list.map(parseComic),
                maxPage: maxPage
            }
            ```
            */
        },
        // provide options for category comic loading
        optionList: [
            {
                // For a single option, use `-` to separate the value and text, left for value, right for text
                options: [
                    "newToOld-New to Old",
                    "oldToNew-Old to New"
                ],
                // [Optional] {string[]} - show this option only when the value not in the list
                notShowWhen: null,
                // [Optional] {string[]} - show this option only when the value in the list
                showWhen: null
            }
        ],
        ranking: {
            // For a single option, use `-` to separate the value and text, left for value, right for text
            options: [
                "day-Day",
                "week-Week"
            ],
            /**
             * load ranking comics
             * @param option {string} - option from optionList
             * @param page {number} - page number
             * @returns {Promise<{comics: Comic[], maxPage: number}>}
             */
            load: async (option, page) => {
                /*
                ```
                let data = JSON.parse((await Network.get('...')).body)
                let maxPage = data.maxPage

                function parseComic(comic) {
                    // ...

                    return new Comic({
                        id: id,
                        title: title,
                        subTitle: author,
                        cover: cover,
                        tags: tags,
                        description: description
                    })
                }

                return {
                    comics: data.list.map(parseComic),
                    maxPage: maxPage
                }
                ```
                */
            }
        }
    }

    /// search related
    search = {
        load: async (keyword, options, page) => {
            let res = await Network.get(`https://api.comick.io/v1.0/search?q=${keyword}&limit=49&page=1`)
            if (res.status !== 200) {
                throw "Invalid status code: " + res.status
            }
             // 解析 JSON 数据
            let mangaList = JSON.parse(res.body);

            // 检查是否成功解析
            if (!Array.isArray(mangaList)) {
                throw new Error("Response is not an array");
            }

            // 转换数据格式
            const formattedMangaList = mangaList.map(manga => {
                // 提取封面（如果 md_covers 不存在则使用默认封面）
                const cover = manga.md_covers?.[0]?`https://meo.comick.pictures/${manga.md_covers[0].b2key}` :'w7xqzd.jpg';

                // 返回格式化后的对象
                return {
                    id: manga.slug,                     // 漫画 ID
                    title: manga.title || "无标题",   // 漫画标题（默认值）
                    cover: cover,                    // 封面图片
                    //tags: manga.genres || [],         // 标签（数组，默认空数组） ，还没写对应关系
                    tags: [],         // 标签（数组，默认空数组）
                    description: manga.desc || "暂无描述" // 描述（默认值）
                };
            });

            return {
                comics: formattedMangaList ,
                maxPage: 1
            }
        },

        // 提供选项
        optionList: []
    }

    // favorite related
    favorites = {
        // whether support multi folders
        multiFolder: false,
        /**
         * add or delete favorite.
         * throw `Login expired` to indicate login expired, App will automatically re-login and re-add/delete favorite
         * @param comicId {string}
         * @param folderId {string}
         * @param isAdding {boolean} - true for add, false for delete
         * @param favoriteId {string?} - [Comic.favoriteId]
         * @returns {Promise<any>} - return any value to indicate success
         */
        addOrDelFavorite: async (comicId, folderId, isAdding, favoriteId) => {
            /*
            ```
            let res = await Network.post('...')
            if (res.status === 401) {
                throw `Login expired`;
            }
            return 'ok'
            ```
            */
        },
        /**
         * load favorite folders.
         * throw `Login expired` to indicate login expired, App will automatically re-login retry.
         * if comicId is not null, return favorite folders which contains the comic.
         * @param comicId {string?}
         * @returns {Promise<{folders: {[p: string]: string}, favorited: string[]}>} - `folders` is a map of folder id to folder name, `favorited` is a list of folder id which contains the comic
         */
        loadFolders: async (comicId) => {
            /*
            ```
            let data = JSON.parse((await Network.get('...')).body)

            let folders = {}

            data.folders.forEach((f) => {
                folders[f.id] = f.name
            })

            return {
                folders: folders,
                favorited: data.favorited
            }
            ```
            */
        },
        /**
         * add a folder
         * @param name {string}
         * @returns {Promise<any>} - return any value to indicate success
         */
        addFolder: async (name) => {
            /*
            ```
            let res = await Network.post('...')
            if (res.status === 401) {
                throw `Login expired`;
            }
            return 'ok'
            ```
            */
        },
        /**
         * delete a folder
         * @param folderId {string}
         * @returns {Promise<void>} - return any value to indicate success
         */
        deleteFolder: async (folderId) => {
            /*
            ```
            let res = await Network.delete('...')
            if (res.status === 401) {
                throw `Login expired`;
            }
            return 'ok'
            ```
            */
        },
        /**
         * load comics in a folder
         * throw `Login expired` to indicate login expired, App will automatically re-login retry.
         * @param page {number}
         * @param folder {string?} - folder id, null for non-multi-folder
         * @returns {Promise<{comics: Comic[], maxPage: number}>}
         */
        loadComics: async (page, folder) => {
            /*
            ```
            let data = JSON.parse((await Network.get('...')).body)
            let maxPage = data.maxPage

            function parseComic(comic) {
                // ...

                return new Comic{
                    id: id,
                    title: title,
                    subTitle: author,
                    cover: cover,
                    tags: tags,
                    description: description
                }
            }

            return {
                comics: data.list.map(parseComic),
                maxPage: maxPage
            }
            ```
            */
        },
        /**
         * load comics with next page token
         * @param next {string | null} - next page token, null for first page
         * @param folder {string}
         * @returns {Promise<{comics: Comic[], next: string?}>}
         */
        loadNext: async (next, folder) => {

        },
        /**
         * If the comic source only allows one comic in one folder, set this to true.
         */
        singleFolderForSingleComic: false,
    }


    /// single comic related
    comic = {
        // 加载漫画信息
        loadInfo: async (id) => {
            let res = await Network.get(`${this.baseUrl}/comic/${id}`)
            if (res.status !== 200) {
                throw "Invalid status code: " + res.status
            }

            let document = new HtmlDocument(res.body)

            let jsonData = JSON.parse(document.getElementById('__NEXT_DATA__').text); //json解析方式

            let comicData = jsonData.props.pageProps.comic;
            let authorData = jsonData.props.pageProps.authors;

            let title = comicData.title; //测试通过

            let cover = comicData.md_covers?.[0]?.b2key ?`https://meo.comick.pictures/${comicData.md_covers[0].b2key}` : 'w7xqzd.jpg';

            let author = authorData[0]?.name || "未知作者"; //测试通过

            // 提取标签的slug数组的代码
            let extractSlugs = (comicData) => {
                try {
                    // 获取md_comic_md_genres数组
                    const genres = comicData.md_comic_md_genres;

                    // 使用map提取每个md_genres中的slug
                    const slugs = genres.map(genre => genre.md_genres.slug);

                    return slugs;
                } catch (error) {
                    console.error("提取slug时出错:", error);
                    return []; // 返回空数组作为容错处理
                }
            };

            let tags = extractSlugs(comicData);
            // 转换 tags 数组，如果找不到对应值则保留原值
            const translatedTags = tags.map(tag => {
                return Comick.category_param_dict[tag] || tag; // 如果字典里没有，就返回原值
            });

            let updateTime = "第" + comicData.last_chapter + "话"; //这里目前还无法实现更新时间

            let description = comicData.desc || "暂无描述"; //测试通过

            let buildId = jsonData.buildId;
            let slug = jsonData.query.slug;
            let firstChapters =jsonData.props.pageProps.firstChapters[0];
            let chapters_url = "https://preview.comick.io/_next/data/" + buildId + "/comic/" + slug + "/" + firstChapters.hid + "-chapter-" + firstChapters.chap + "-en.json"
            //https://preview.comick.io/_next/data/.5d942a5daa586bb403870880fa68f600d34e779a/comic/my-new-girlfriend-is-not-human/F6yr92Xt-chapter-1-en.json"
            let list_res = await Network.get(chapters_url)
            if (list_res.status !== 200) {
                throw "Invalid status code: " + res.status
            }
            let chapters_raw = JSON.parse(list_res.body);
            let chapters = new Map()
            // 剩余解析章节信息
            let chapters_next = chapters_raw.pageProps.chapters.reverse();
            chapters_next.forEach((chapter, index) => {
                //let title = chapter.title ? chapter.title : "";
                let chapNum = chapter.chap ? "第" + chapter.chap + "话" : " ";
                chapters.set(chapter.hid + "//" + chapter.chap, chapNum);
            });

            return {
                title: title,
                cover: cover,
                description: description,
                tags: {
                    "作者": [author],
                    "更新": [updateTime],
                    "标签": translatedTags
                },
                chapters: chapters,
            }
        },
        loadEp: async (comicId, epId) => {
            const images = [];
            const [hid, chapter] = epId.split("//");  // 例如 "abc123//42" → ["abc123", "42"]

            // 检查分割结果是否有效
            if (!hid || !chapter) {
                console.error("Invalid epId format. Expected 'hid//chapter'");
                return { images };  // 返回空数组
            }

            // 构建章节的 web_JSON URL
            //https://preview.comick.io/comic/my-new-girlfriend-is-not-human/4MNGbfP8-chapter-120-en
            let url = "https://preview.comick.io/comic/" + comicId + "/" + hid + "-chapter-" + chapter + "-en.json";

            let maxAttempts = 100;

            while (maxAttempts > 0) {
                const res = await Network.get(url);
                if (res.status !== 200) break;

                let document = new HtmlDocument(res.body)

                let jsonData = JSON.parse(document.getElementById('__NEXT_DATA__').text); //json解析方式
                let imagesData = jsonData.props.pageProps.chapter.md_images;

                // 解析当前页图片
                imagesData.forEach(image => {
                    // 处理图片链接
                    let imageUrl = `https://meo.comick.pictures/${image.b2key}`;
                    images.push(imageUrl);
                });

                // 查找下一页链接
                const nextLink = document.querySelector("a#next-chapter");
                if (nextLink?.text?.match(/下一页|下一頁/)) {
                    url = nextLink.attributes['href'];
                } else {
                    break;
                }
                maxAttempts--;
            }
        // 代理后图片水印更少
            return { images };
        }
    }
}