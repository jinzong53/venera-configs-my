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
        "浪漫": "romance",
        "喜剧": "comedy",
        "剧情": "drama",
        "奇幻": "fantasy",
        "日常": "slice-of-life",
        "动作": "action",
        "冒险": "adventure",
        "心理": "psychological",
        "悬疑": "mystery",
        "历史": "historical",
        "悲剧": "tragedy",
        "科幻": "sci-fi",
        "恐怖": "horror",
        "异世界": "isekai",
        "运动": "sports",
        "惊悚": "thriller",
        "机甲": "mecha",
        "哲学": "philosophical",
        "武侠": "wuxia",
        "医疗": "medical",
        "魔法少女": "magical-girls",
        "超级英雄": "superhero",
        "少年爱": "shounen-ai",
        "成人": "mature",
        "性转": "gender-bender",
        "少女爱": "shoujo-ai",
        "单篇": "oneshot",
        "网络漫画": "web-comic",
        "同人志": "doujinshi",
        "全彩": "full-color",
        "长条": "long-strip",
        "改编": "adaptation",
        "选集": "anthology",
        "四格": "4-koma",
        "用户创作": "user-created",
        "获奖": "award-winning",
        "官方上色": "official-colored",
        "粉丝上色": "fan-colored",
        "校园生活": "school-life",
        "超自然": "supernatural",
        "魔法": "magic",
        "怪物": "monsters",
        "武术": "martial-arts",
        "动物": "animals",
        "恶魔": "demons",
        "后宫": "harem",
        "转生": "reincarnation",
        "上班族": "office-workers",
        "生存": "survival",
        "军事": "military",
        "女装": "crossdressing",
        "萝莉": "loli",
        "电子游戏": "video-games",
        "魔物娘": "monster-girls",
        "不良少年": "delinquents",
        "幽灵": "ghosts",
        "时间旅行": "time-travel",
        "烹饪": "cooking",
        "警察": "police",
        "外星人": "aliens",
        "音乐": "music",
        "黑帮": "mafia",
        "吸血鬼": "vampires",
        "武士": "samurai",
        "后末日": "post-apocalyptic",
        "辣妹": "gyaru",
        "恶役千金": "villainess",
        "逆后宫": "reverse-harem",
        "忍者": "ninja",
        "僵尸": "zombies",
        "传统游戏": "traditional-games",
        "虚拟现实": "virtual-reality",
        "百合": "yuri"
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

            let title = document.querySelector('h1')?.text.trim(); //测试通过

            //let cover = document.querySelector('div.mr-4.relative.row-span-5 > div.relative > a > img')?.attributes['src']; //测试通过
            //
            let all = document.querySelector("div.text-gray-500.overflow-auto.mt-3").text.trim()
            let author = document.querySelector("div.text-gray-500.dark\\:text-gray-400.overflow-auto.mt-3 ").text.trim()
            // let author = document.querySelector('div.overflow-auto.mt-3')?.text?.trim(); //测试通过
            //
            //
            // //let tags = document.querySelectorAll("div.tag-list > span").map(e => e.text.trim())
            // //tags = [...tags.filter(e => e !== "")]
            //
            // let genresRow = Array.from(document.querySelectorAll('td')).find(td => td.text.trim() === 'Genres:');
            // let temp = genresRow?.nextElementSibling?.text.trim(); //测试通过
            // let tags = temp?.split(/\s*,\s*/) || [];
            // tags = [...tags.filter(e => e !== "")];
            //
            //
            // // let updateTime = document.querySelector("div.supporting-text > div > span > em")?.text.trim().replace('(', '').replace(')', '')
            // //
            // // if (!updateTime) {
            // //     updateTime = " ";
            // // }
            let updateTime = " "; //这里目前还无法实现
            //
            let description = document.querySelector("div[class*=\"my-3\"][class*=\"md:my-5\"]").text.trim() //测试通过
            //
            //
            //
            let chapters = new Map()
            // let i = 0
            // for (let c of document.querySelectorAll("table.table-fixed.w-full > tbody> tr >td.customclass1 > a > div.truncate ")) {
            //     let a = c.querySelector("span.font-semibold").text.trim();
            //     let b = c.querySelector("span.text-xs").text.trim();
            //     chapters.set(i.toString(), a + " " + b);
            //     i++
            // }

            return {
                title: title,
                cover: " ",
                description: description,
                tags: {
                    "作者": [author],
                    "更新": [all],
                    "标签": []
                },
                chapters: chapters,
            }
        },
        loadEp: async (comicId, epId) => {
            const images = [];
            // let currentPageUrl = `${this.baseUrl}/comic/chapter/${comicId}/0_${epId}.html`;
            // let maxAttempts = 100;
            //
            // while (maxAttempts > 0) {
            //     const res = await Network.get(currentPageUrl);
            //     if (res.status !== 200) break;
            //
            //     // 解析当前页图片
            //     const doc = new HtmlDocument(res.body);
            //     doc.querySelectorAll("ul.comic-contain > div > amp-img").forEach(img => {
            //         const src = img?.attributes?.['src'];
            //         if (typeof src === 'string') images.push(src);
            //     });
            //
            //     // 查找下一页链接
            //     const nextLink = doc.querySelector("a#next-chapter");
            //     if (nextLink?.text?.match(/下一页|下一頁/)) {
            //         currentPageUrl = nextLink.attributes['href'];
            //     } else {
            //         break;
            //     }
            //     maxAttempts--;
            // }
        // 代理后图片水印更少
            return { images };
        }
    }
}