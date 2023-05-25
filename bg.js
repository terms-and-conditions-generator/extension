! function() {
    var e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {};

    function t(e) {
        return e && e.__esModule ? e.default : e
    }

    function n(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }

    function r(e, t, n) {
        Object.defineProperty(e, t, {
            get: n,
            enumerable: !0
        })
    }
    const o = {
            get: function(e, t) {
                if (!this._supported()) return t;
                const n = localStorage.getItem(e);
                if (null == n) return t;
                if ("true" === n) return !0;
                if ("false" === n) return !1;
                if (n.startsWith("[") || n.startsWith("{")) return JSON.parse(n);
                const r = Number(n);
                return Number.isNaN(r) ? n : r
            },
            set: function(e, t) {
                if (this._supported()) try {
                    "string" == typeof t ? localStorage.setItem(e, t) : localStorage.setItem(e, JSON.stringify(t))
                } catch (n) {
                    console.error("local-storage-json: failed to set", {
                        key: e,
                        value: t,
                        details: n
                    })
                }
            },
            has: function(e) {
                return !!this._supported() && e in localStorage
            },
            remove: function(e) {
                this._supported() && localStorage.removeItem(e)
            },
            _supported: function() {
                return "undefined" != typeof window && !!window.localStorage
            }
        },
        i = chrome.runtime.getManifest(),
        a = i.version,
        s = o.get("env.is") || (i.name.includes("DEV") ? "development" : i.name.includes("BETA") ? "beta" : "production");
    let l = {
        version: a,
        manifestVersion: chrome.runtime.getManifest().manifest_version,
        is: {
            popup: location.pathname.includes("inssist.html"),
            background: location.pathname.includes("background"),
            production: "development" !== s && "beta" !== s,
            beta: "beta" === s,
            development: "development" === s
        }
    };
    l = {
        ...l,
        features: {
            fspring: o.get("env.features.fspring", !0),
            iframes: o.get("env.features.iframes", !0),
            trial: !0,
            log: o.get("env.features.log", l.is.beta || l.is.development)
        },
        options: {}
    };
    var u = l;
    var c = [{
        id: "schedule",
        icon: "sidebar-mediator.schedule",
        title: "Post Assistant",
        description: "\n      Schedule and pre-plan posts in a Grid or Calendar.\n      Use Time Slots to schedule content rapidly.\n    "
    }, {
        id: "hashtags",
        icon: "sidebar-mediator.hashtags",
        title: "Hashtag Assistant",
        description: "\n      Find effective hashtags to increase your posts engagement.\n      Create hashtag collections.\n    "
    }, {
        id: "reels",
        icon: "sidebar-mediator.covers",
        title: "Reels and Video Stories",
        description: "\n      Publish Video Reels and Instagram Video Stories from your desktop PC / Mac.\n    "
    }, {
        id: "music",
        icon: "sidebar-mediator.music",
        title: "Music, Covers, Ghost View",
        description: "\n      Add music to your videos. Select or upload custom covers.\n      View stories anonymously.\n    "
    }];
    var d = [{
        title: "Post Photos & Videos, Photo Stories",
        isFree: !0,
        isPro: !0
    }, {
        title: "Send Direct Messages",
        isFree: !0,
        isPro: !0
    }, {
        title: "Search for Relevant Hashtags",
        isFree: !0,
        isPro: !0
    }, {
        title: "Multiaccount Support",
        isFree: !0,
        isPro: !0
    }, {
        title: "Dark Mode",
        isFree: !0,
        isPro: !0
    }, {
        title: "Zen Mode",
        isFree: !0,
        isPro: !0,
        isPaddedBottom: !0
    }, {
        title: "Post Reels",
        isPro: !0,
        icons: ["sidebar-mediator.schedule", "sidebar-mediator.covers", "sidebar-mediator.hashtags"],
        tooltip: {
            text: "Reels are supported for countries where Instagram Reels are available"
        }
    }, {
        title: "Video Stories",
        isPro: !0
    }, {
        title: "Add Music to Videos",
        isPro: !0
    }, {
        title: "Ghost Story View",
        isPro: !0,
        tooltip: {
            text: "Stay anonymous while viewing Instagram stories"
        }
    }, {
        title: "Custom Video Covers",
        isPro: !0
    }, {
        title: "Hashtags Metrics & Collections",
        isPro: !0
    }, {
        title: "Schedule Posts",
        isPro: !0
    }, {
        title: "Schedule Reels",
        isPro: !0
    }, {
        title: "Schedule Photo / Video Stories",
        isPro: !0
    }];
    const f = 5,
        p = 3,
        h = {
            dmAdvanced: e => e.dmAdvanced >= 50,
            schedule: e => e.schedule >= 2,
            insights: e => e.insights >= 2,
            analytics: e => e.analytics >= 5,
            coverAssist: e => e.coverAssist >= 2,
            musicAssist: e => e.musicAssist >= 2,
            storyAssist: e => e.storyAssist >= f,
            tagAssist: e => e.tagAssist >= 4,
            addLinkToStory: e => e.addLinkToStory >= 2,
            repost: e => e.repost >= 3,
            reels: e => e.reels >= 2,
            ghostStoryView: e => e.ghostStoryView >= p
        },
        g = 6e4,
        m = 36e5,
        v = 864e5,
        b = 6048e5,
        y = 26784e5;
    var w = {
            SECOND: 1e3,
            MINUTE: g,
            HOUR: m,
            DAY: v,
            WEEK: b,
            MONTH: y
        },
        _ = {
            apiUrl: o.get("env.options.tagAssist.apiUrl", (u.is.production || u.is.beta, "https://fc.inssist.com/api/v1/hashtag")),
            collectionsTagDataTtl: 26784e5,
            userTagScanTtl: 6048e5,
            userTagScanPeriod: 2592e5,
            userTagScanCount: 30,
            sendCollectedTagsTimeout: 6e5,
            maxTagsToQuery: 5,
            maxRelevantTagsToKeep: 100,
            accountStatsTtl: 864e5
        };
    u.options = {
        ...u.options,
        apiUrl: o.get("env.options.apiUrl", "https://api.inssist.com/api/v1"),
        collectBillingStats: o.get("env.options.collectBillingStats", !1),
        domain: o.get("env.options.domain", "inssist.com"),
        storefront: o.get("env.options.storefront", u.is.production || u.is.beta ? "slashed.onfastspring.com" : "slashed.test.onfastspring.com"),
        checkoutContainer: o.get("env.options.checkoutContainer", "https://inssist.com"),
        billingPlans: {
            "inssist-pro-monthly": {
                type: "subscription",
                pricing: {
                    US: {
                        currency: "USD",
                        price: 4.99
                    }
                }
            },
            "inssist-pro-lifetime": {
                type: "product",
                pricing: {
                    US: {
                        currency: "USD",
                        price: 45
                    }
                },
                isActive: e => {
                    const {
                        billing: t,
                        authStatus: n
                    } = e;
                    return (t.orders || []).some((e => {
                        var t, r;
                        return "inssist-pro-lifetime" === e.product && (null === (t = e.tags) || void 0 === t || null === (r = t.accounts) || void 0 === r ? void 0 : r.some((e => e.id === (null == n ? void 0 : n.userId) || e.name === (null == n ? void 0 : n.username))))
                    }))
                }
            },
            "inssist-pro-infinite": {
                type: "product",
                pricing: {
                    US: {
                        currency: "USD",
                        price: 240
                    }
                }
            }
        },
        billingProFeaturesList: c,
        billingProFeaturesTable: d,
        trialFeaturesLimits: h,
        tagAssist: _
    };
    var S = {
        unique: function(e) {
            return Array.from(new Set(e))
        },
        gaussian: x,
        gaussianInt: function(e, t) {
            return Math.round(e + x() * (t - e))
        },
        forceLayout: function() {
            document.body.getBoundingClientRect()
        },
        hashCode: P,
        pseudorandom: function(e) {
            return 16807 * Math.max(Math.abs(P(e)), 1) % 2147483647 / 2147483646
        },
        rotate: function(e, t = 1) {
            const n = "slashed.io";
            let r = "";
            return Array.from(e).forEach(((e, o) => {
                const i = n[o % n.length].charCodeAt(),
                    a = (e.charCodeAt() + t * i + 65536) % 65536;
                r += String.fromCharCode(a)
            })), r
        },
        getUnixTime: function() {
            return Math.round(Date.now() / 1e3)
        },
        takeBetween: function(e, t, n) {
            const r = e.split(t)[1];
            if (!r) return null;
            return r.split(n)[0] || null
        },
        takeAllBetween: function(e, t, n) {
            return e.split(t).slice(1).map((e => e.split(n)[0]))
        },
        capitalize: function(e) {
            return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()
        },
        getIntegralNumberPart: function(e) {
            const t = Math.abs(e);
            return e > 0 ? Math.floor(t) : -Math.floor(t)
        },
        getFractalNumberPart: function(e) {
            const t = Math.abs(e);
            return Number((t - Math.floor(t)).toFixed(12))
        }
    };

    function x() {
        let e = 0;
        for (let t = 0; t < 6; t += 1) e += Math.random();
        return e / 6
    }

    function P(e) {
        if (!e) return 0;
        let t, n, r = 0;
        if (0 === e.length) return r;
        for (t = 0; t < e.length; t++) n = e.charCodeAt(t), r = (r << 5) - r + n, r |= 0;
        return r
    }
    async function k(e) {
        if ("number" == typeof e && Number.isFinite(e)) {
            const t = e;
            await new Promise((e => setTimeout(e, t)))
        } else {
            if (!e || "object" != typeof e || e.constructor !== Object) throw new Error("unexpected sleep function argument: number or object expected, got", e); {
                const {
                    min: t,
                    max: n
                } = e.longBreak && Math.random() < 1 - Math.pow(.5, 1 / e.longBreak.every) ? {
                    min: 0,
                    max: 0,
                    ...e.longBreak
                } : {
                    min: 0,
                    max: 0,
                    ...e
                }, r = n - t, o = t + S.gaussianInt(0, r);
                if (0 === o) return;
                await new Promise((e => setTimeout(e, o)))
            }
        }
    }
    const D = async e => {
        const t = URL.createObjectURL(e),
            n = document.createElement("img");
        return await new Promise(((e, r) => {
            n.onload = e, n.onerror = r, n.src = t
        })), {
            img: n,
            width: n.width,
            height: n.height,
            ratio: n.width / n.height
        }
    }, E = async (e, {
        type: t = "image/jpeg",
        quality: n = .8
    } = {}) => await new Promise(((r, o) => {
        e.toBlob((e => {
            e ? r(e) : o("canvas.toBlob failed")
        }), t, n)
    })), I = {
        scaleToFitSize: async function(e, t, n, r = .8) {
            const {
                img: o,
                width: i,
                height: a
            } = await D(e);
            if (i <= t && a <= n) return e;
            const s = t / i,
                l = n / a,
                u = Math.min(s, l),
                c = document.createElement("canvas");
            c.width = i * u, c.height = a * u;
            return c.getContext("2d").drawImage(o, 0, 0, i, a, 0, 0, c.width, c.height), await E(c)
        },
        scaleToFitRatio: async function(e, t, n = .8) {
            const {
                img: r,
                width: o,
                height: i,
                ratio: a
            } = await D(e), s = document.createElement("canvas");
            a > t ? (s.width = o, s.height = o / t) : (s.height = i, s.width = i * t);
            const l = s.getContext("2d"),
                u = (s.width - o) / 2,
                c = (s.height - i) / 2;
            return l.drawImage(r, u, c, o, i), await E(s)
        }
    };

    function T(e, t, n) {
        return n.indexOf(e) === t
    }

    function C(e) {
        return Object.keys(e).map((t => {
            const n = e[t];
            return A(n) ? F(t, n) : Array.isArray(n) ? n.map((e => F(t, e))).join("&") : null
        })).filter(Boolean).join("&").replace(/%5B/g, "[").replace(/%5D/g, "]")
    }

    function F(e, t) {
        return A(t) || (t = JSON.stringify(t)), `${encodeURIComponent(e)}=${encodeURIComponent(t)}`
    }

    function A(e) {
        return "string" == typeof e || "number" == typeof e || "boolean" == typeof e
    }

    function O(e, t = {}) {
        const n = C(t);
        return n ? `${e}?${n}` : e
    }

    function M(e) {
        return Array.isArray(e) ? e : [e]
    }

    function R() {
        const e = [];
        return Object.assign(t, {
            handle: function(e) {
                if ("function" != typeof e) return void console.error("function is expected");
                t(e)
            },
            clear: function() {
                e.length = 0
            },
            off: function(t) {
                const n = e.indexOf(t); - 1 !== n && e.splice(n, 1)
            },
            isEmpty: function() {
                return 0 === e.length
            }
        });

        function t(...t) {
            "function" == typeof t[0] ? e.push(t[0]) : e.forEach((e => e(...t)))
        }
    }
    let N, U;

    function B({
        hashOptional: e = !1
    } = {}) {
        return N || (N = /()([#\uFF03])((?:[A-Za-zªµºÀ-ÖØ-öø-Ɂɐ-ˁˆ-ˑˠ-ˤˮͺΆΈ-ΊΌΎ-ΡΣ-ώϐ-ϵϷ-ҁҊ-ӎ-ӹԀ-ԏԱ-Ֆՙա-ևא-תװ-ײء-غـ-يٮ-ٯٱ-ۓەۥ-ۦۮ-ۯۺ-ۼۿܐܒ-ܯݍ-ݭހ-ޥޱऄ-हऽॐक़-ॡॽঅ-ঌএ-ঐও-নপ-রলশ-হঽৎড়-ঢ়য়-ৡৰ-ৱਅ-ਊਏ-ਐਓ-ਨਪ-ਰਲ-ਲ਼ਵ-ਸ਼ਸ-ਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલ-ળવ-હઽૐૠ-ૡଅ-ଌଏ-ଐଓ-ନପ-ରଲ-ଳଵ-ହଽଡ଼-ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹఅ-ఌఎ-ఐఒ-నప-ళవ-హౠ-ౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠ-ೡഅ-ഌഎ-ഐഒ-നപ-ഹൠ-ൡඅ-ඖක-නඳ-රලව-ෆก-ะา-ำเ-ๆກ-ຂຄງ-ຈຊຍດ-ທນ-ຟມ-ຣລວສ-ຫອ-ະາ-ຳຽເ-ໄໆໜ-ໝༀཀ-ཇཉ-ཪྈ-ྋက-အဣ-ဧဩ-ဪၐ-ၕႠ-Ⴥა-ჺჼᄀ-ᅙᅟ-ᆢᆨ-ᇹሀ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏ-Ᏼᐁ-ᙬᙯ-ᙶᚁ-ᚚᚠ-ᛪᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦩᧁ-ᧇᨀ-ᨖᴀ-ᶿḀ-ẛẠ-ỹἀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₔℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℱℳ-ℹℼ-ℿⅅ-ⅉⰀ-Ⱞⰰ-ⱞⲀ-ⳤⵥⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〆〱-〵〻-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄬㄱ-ㆎㆠ-ㆷㇰ-ㇿ-䶵一-龻ꀀ-ꒌꠀ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢ가-힣豈-鶴侮-頻並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּ-לּמּנּ-סּףּ-פּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ̀ﾡ-ￜァ-ヺー-ヾｦ-ﾟ０-９Ａ-Ｚａ-ｚぁ-ゖ゙-ゞ㐀-䶿一-鿿꜀-뜿띀-렟-﨟〃々〻0-9٠-٩۰-۹०-९০-৯੦-੯૦-૯୦-୯௦-௯౦-౯೦-೯൦-൯๐-๙໐-໙༠-༩၀-၉០-៩᠐-᠙᥆-᥏᧐-᧙０-９_]|(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2694\u2696\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD79\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED0\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3]|\uD83E[\uDD10-\uDD18\uDD80-\uDD84\uDDC0]|(?:0\u20E3|1\u20E3|2\u20E3|3\u20E3|4\u20E3|5\u20E3|6\u20E3|7\u20E3|8\u20E3|9\u20E3|#\u20E3|\\*\u20E3|\uD83C(?:\uDDE6\uD83C(?:\uDDEB|\uDDFD|\uDDF1|\uDDF8|\uDDE9|\uDDF4|\uDDEE|\uDDF6|\uDDEC|\uDDF7|\uDDF2|\uDDFC|\uDDE8|\uDDFA|\uDDF9|\uDDFF|\uDDEA)|\uDDE7\uD83C(?:\uDDF8|\uDDED|\uDDE9|\uDDE7|\uDDFE|\uDDEA|\uDDFF|\uDDEF|\uDDF2|\uDDF9|\uDDF4|\uDDE6|\uDDFC|\uDDFB|\uDDF7|\uDDF3|\uDDEC|\uDDEB|\uDDEE|\uDDF6|\uDDF1)|\uDDE8\uD83C(?:\uDDF2|\uDDE6|\uDDFB|\uDDEB|\uDDF1|\uDDF3|\uDDFD|\uDDF5|\uDDE8|\uDDF4|\uDDEC|\uDDE9|\uDDF0|\uDDF7|\uDDEE|\uDDFA|\uDDFC|\uDDFE|\uDDFF|\uDDED)|\uDDE9\uD83C(?:\uDDFF|\uDDF0|\uDDEC|\uDDEF|\uDDF2|\uDDF4|\uDDEA)|\uDDEA\uD83C(?:\uDDE6|\uDDE8|\uDDEC|\uDDF7|\uDDEA|\uDDF9|\uDDFA|\uDDF8|\uDDED)|\uDDEB\uD83C(?:\uDDF0|\uDDF4|\uDDEF|\uDDEE|\uDDF7|\uDDF2)|\uDDEC\uD83C(?:\uDDF6|\uDDEB|\uDDE6|\uDDF2|\uDDEA|\uDDED|\uDDEE|\uDDF7|\uDDF1|\uDDE9|\uDDF5|\uDDFA|\uDDF9|\uDDEC|\uDDF3|\uDDFC|\uDDFE|\uDDF8|\uDDE7)|\uDDED\uD83C(?:\uDDF7|\uDDF9|\uDDF2|\uDDF3|\uDDF0|\uDDFA)|\uDDEE\uD83C(?:\uDDF4|\uDDE8|\uDDF8|\uDDF3|\uDDE9|\uDDF7|\uDDF6|\uDDEA|\uDDF2|\uDDF1|\uDDF9)|\uDDEF\uD83C(?:\uDDF2|\uDDF5|\uDDEA|\uDDF4)|\uDDF0\uD83C(?:\uDDED|\uDDFE|\uDDF2|\uDDFF|\uDDEA|\uDDEE|\uDDFC|\uDDEC|\uDDF5|\uDDF7|\uDDF3)|\uDDF1\uD83C(?:\uDDE6|\uDDFB|\uDDE7|\uDDF8|\uDDF7|\uDDFE|\uDDEE|\uDDF9|\uDDFA|\uDDF0|\uDDE8)|\uDDF2\uD83C(?:\uDDF4|\uDDF0|\uDDEC|\uDDFC|\uDDFE|\uDDFB|\uDDF1|\uDDF9|\uDDED|\uDDF6|\uDDF7|\uDDFA|\uDDFD|\uDDE9|\uDDE8|\uDDF3|\uDDEA|\uDDF8|\uDDE6|\uDDFF|\uDDF2|\uDDF5|\uDDEB)|\uDDF3\uD83C(?:\uDDE6|\uDDF7|\uDDF5|\uDDF1|\uDDE8|\uDDFF|\uDDEE|\uDDEA|\uDDEC|\uDDFA|\uDDEB|\uDDF4)|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C(?:\uDDEB|\uDDF0|\uDDFC|\uDDF8|\uDDE6|\uDDEC|\uDDFE|\uDDEA|\uDDED|\uDDF3|\uDDF1|\uDDF9|\uDDF7|\uDDF2)|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C(?:\uDDEA|\uDDF4|\uDDFA|\uDDFC|\uDDF8)|\uDDF8\uD83C(?:\uDDFB|\uDDF2|\uDDF9|\uDDE6|\uDDF3|\uDDE8|\uDDF1|\uDDEC|\uDDFD|\uDDF0|\uDDEE|\uDDE7|\uDDF4|\uDDF8|\uDDED|\uDDE9|\uDDF7|\uDDEF|\uDDFF|\uDDEA|\uDDFE)|\uDDF9\uD83C(?:\uDDE9|\uDDEB|\uDDFC|\uDDEF|\uDDFF|\uDDED|\uDDF1|\uDDEC|\uDDF0|\uDDF4|\uDDF9|\uDDE6|\uDDF3|\uDDF7|\uDDF2|\uDDE8|\uDDFB)|\uDDFA\uD83C(?:\uDDEC|\uDDE6|\uDDF8|\uDDFE|\uDDF2|\uDDFF)|\uDDFB\uD83C(?:\uDDEC|\uDDE8|\uDDEE|\uDDFA|\uDDE6|\uDDEA|\uDDF3)|\uDDFC\uD83C(?:\uDDF8|\uDDEB)|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C(?:\uDDF9|\uDDEA)|\uDDFF\uD83C(?:\uDDE6|\uDDF2|\uDDFC))))[\uFE00-\uFE0F\u200D]*)+)/gi, U = new RegExp(N.toString().replace("/", "").replace("/gi", "").replace("[#\\uFF03]", "[#\\uFF03]?"), "gi")), e ? U : N
    }
    var L = {};
    Object.assign(L, {
        ls: o,
        safe: function(e, t = null) {
            try {
                const n = e();
                return n instanceof Promise ? new Promise(((e, r) => {
                    n.then(e).catch((n => {
                        n && console.error(n), e(t)
                    }))
                })) : n
            } catch (e) {
                return console.error(e), t
            }
        },
        sleep: k,
        scaler: I,
        unique: T,
        isVideo: function(e) {
            return e.type.startsWith("video/")
        },
        isObject: function(e) {
            return "[object Object]" === Object.prototype.toString.call(e)
        },
        setTimer: function(e, t = 0) {
            const n = `timer-${Math.random().toString().slice(2)}`,
                r = Date.now() + Math.max(t, 0),
                o = t => {
                    t.name === n && (i(), e())
                },
                i = () => {
                    chrome.alarms.clear(n), chrome.alarms.onAlarm.removeListener(o)
                };
            return chrome.alarms.create(n, {
                when: r
            }), chrome.alarms.onAlarm.addListener(o), {
                clear: i
            }
        },
        loadImage: D,
        callAsync: async function(e, ...t) {
            return new Promise((n => {
                e(...t, n)
            }))
        },
        createUrl: O,
        jsonEscape: function(e) {
            return e.replace(/[\n\r\t]/g, " ")
        },
        ensureArray: M,
        createAlarm: function(e, {
            delay: t,
            period: n,
            when: r
        }, o) {
            const i = {};
            "number" == typeof t && (i.delayInMinutes = t / g), "number" == typeof n && (i.periodInMinutes = n / g), "number" == typeof r && (i.when = r), chrome.alarms.create(e, i), chrome.alarms.onAlarm.addListener((t => {
                t.name === e && o()
            }))
        },
        extractFrame: async (e, t = 0) => {
            const n = URL.createObjectURL(e),
                r = document.createElement("video");
            r.src = n, r.muted = !0, await new Promise((e => r.addEventListener("loadedmetadata", e))), r.currentTime = t * r.duration, await new Promise((e => r.addEventListener("timeupdate", e)));
            const o = document.createElement("canvas"),
                i = o.getContext("2d");
            o.width = r.videoWidth, o.height = r.videoHeight, i.drawImage(r, 0, 0);
            return await new Promise((e => o.toBlob(e, "image/jpeg")))
        },
        createEmitter: R,
        safeJsonParse: function(e) {
            try {
                return JSON.parse(e)
            } catch (e) {
                return null
            }
        },
        calcEngagement: function(e, t) {
            return (e || 0) + 10 * (t || 0)
        },
        getHashtagRegex: B,
        removeFromArray: function(e, t) {
            let n;
            n = "function" == typeof t ? e.findIndex(t) : e.indexOf(t), -1 !== n && e.splice(n, 1)
        },
        watchForIgCookie: function(e, t) {
            chrome.cookies.onChanged.addListener((async ({
                cookie: n,
                cause: r,
                removed: o
            }) => {
                n.domain.includes("instagram.com") && n.name === e && "explicit" === r && (o || (await t(n), chrome.cookies.remove({
                    url: "https://www.instagram.com",
                    name: e
                }), chrome.cookies.onChanged.removeListener()))
            }))
        },
        loadVideoMetadata: async function(e) {
            const t = "string" == typeof e ? e : URL.createObjectURL(e),
                n = document.createElement("video");
            n.src = t, n.muted = !0, n.volume = 0, n.preload = "metadata", n.play();
            const r = {};
            return await new Promise(((e, t) => {
                n.addEventListener("loadedmetadata", (async () => {
                    await async function(e, t = null) {
                        let n, r;
                        return "number" == typeof t ? (n = t, r = 100) : t ? (n = t.timeout || 3e4, r = t.frequency || 100) : (n = 3e4, r = 100), new Promise(((t, o) => {
                            const i = e();
                            if (i) return void t(i);
                            const a = setInterval((() => {
                                const n = e();
                                n && (clearInterval(a), t(n))
                            }), r);
                            setTimeout((() => {
                                clearInterval(a), t(null)
                            }), n)
                        }))
                    }((() => n.webkitAudioDecodedByteCount), 100), r.width = n.videoWidth, r.height = n.videoHeight, r.ratio = n.videoWidth / n.videoHeight, r.duration = n.duration, r.hasAudio = n.webkitAudioDecodedByteCount > 0, e()
                })), n.addEventListener("error", (() => {
                    t(n.error)
                }))
            })), n.remove(), r
        },
        createQueryString: C,
        createResolvablePromise: function() {
            let e;
            const t = new Promise((t => {
                e = t
            }));
            return Object.defineProperty(t, "resolve", {
                get: () => e
            }), t
        },
        time: w
    });
    var j = {},
        V = {},
        H = {},
        q = {},
        z = 1;
    q = {
        nextValue: function() {
            return (z = (9301 * z + 49297) % 233280) / 233280
        },
        seed: function(e) {
            z = e
        }
    };
    var G, $, W, Y = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";

    function J() {
        W = !1
    }

    function Q(e) {
        if (e) {
            if (e !== G) {
                if (e.length !== Y.length) throw new Error("Custom alphabet for shortid must be " + Y.length + " unique characters. You submitted " + e.length + " characters: " + e);
                var t = e.split("").filter((function(e, t, n) {
                    return t !== n.lastIndexOf(e)
                }));
                if (t.length) throw new Error("Custom alphabet for shortid must be " + Y.length + " unique characters. These characters were not unique: " + t.join(", "));
                G = e, J()
            }
        } else G !== Y && (G = Y, J())
    }

    function K() {
        return W || (W = function() {
            G || Q(Y);
            for (var e, t = G.split(""), n = [], r = q.nextValue(); t.length > 0;) r = q.nextValue(), e = Math.floor(r * t.length), n.push(t.splice(e, 1)[0]);
            return n.join("")
        }())
    }
    H = {
        get: function() {
            return G || Y
        },
        characters: function(e) {
            return Q(e), G
        },
        seed: function(e) {
            q.seed(e), $ !== e && (J(), $ = e)
        },
        lookup: function(e) {
            return K()[e]
        },
        shuffled: K
    };
    var X = "object" == typeof window && (window.crypto || window.msCrypto),
        Z = X && X.getRandomValues ? function(e) {
            return X.getRandomValues(new Uint8Array(e))
        } : function(e) {
            for (var t = [], n = 0; n < e; n++) t.push(Math.floor(256 * Math.random()));
            return t
        },
        ee = function(e, t, n) {
            for (var r = (2 << Math.log(t.length - 1) / Math.LN2) - 1, o = -~(1.6 * r * n / t.length), i = "";;)
                for (var a = e(o), s = o; s--;)
                    if ((i += t[a[s] & r] || "").length === +n) return i
        };
    var te, ne, re = function(e) {
        for (var t, n = 0, r = ""; !t;) r += ee(Z, H.get(), 1), t = e < Math.pow(16, n + 1), n++;
        return r
    };
    var oe = function(e) {
        var t = "",
            n = Math.floor(.001 * (Date.now() - 1567752802062));
        return n === ne ? te++ : (te = 0, ne = n), t += re(7), t += re(e), te > 0 && (t += re(te)), t += re(n)
    };
    var ie, ae = function(e) {
            return !(!e || "string" != typeof e || e.length < 6) && !new RegExp("[^" + H.get().replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&") + "]").test(e)
        },
        se = !1;
    var le = (se || (se = !0, ie = {}, ie = 0), ie || 0);

    function ue() {
        return oe(le)
    }
    var ce = ue;
    (V = ue).generate = ce;
    var de = function(e) {
        return H.seed(e), V
    };
    V.seed = de;
    var fe = function(e) {
        return le = e, V
    };
    V.worker = fe;
    var pe = function(e) {
        return void 0 !== e && H.characters(e), H.shuffled()
    };
    V.characters = pe;
    var he = ae;
    V.isValid = he;
    var ge = t(j = V);
    var me = function() {
            var t = {
                exports: this
            };
            this.__esModule = !0;
            var n = function(e) {
                var t, n = e.Symbol;
                return "function" == typeof n ? n.observable ? t = n.observable : (t = n("observable"), n.observable = t) : t = "@@observable", t
            }("undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== e ? e : void 0 !== t ? t : Function("return this")());
            return r(this, "default", (function() {
                return n
            })), t.exports
        }.call({}),
        ve = function() {
            return Math.random().toString(36).substring(7).split("").join(".")
        },
        be = {
            INIT: "@@redux/INIT" + ve(),
            REPLACE: "@@redux/REPLACE" + ve(),
            PROBE_UNKNOWN_ACTION: function() {
                return "@@redux/PROBE_UNKNOWN_ACTION" + ve()
            }
        };

    function ye(e) {
        if ("object" != typeof e || null === e) return !1;
        for (var t = e; null !== Object.getPrototypeOf(t);) t = Object.getPrototypeOf(t);
        return Object.getPrototypeOf(e) === t
    }

    function we(e, t, n) {
        var r;
        if ("function" == typeof t && "function" == typeof n || "function" == typeof n && "function" == typeof arguments[3]) throw new Error("It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function.");
        if ("function" == typeof t && void 0 === n && (n = t, t = void 0), void 0 !== n) {
            if ("function" != typeof n) throw new Error("Expected the enhancer to be a function.");
            return n(we)(e, t)
        }
        if ("function" != typeof e) throw new Error("Expected the reducer to be a function.");
        var o = e,
            i = t,
            a = [],
            s = a,
            l = !1;

        function u() {
            s === a && (s = a.slice())
        }

        function c() {
            if (l) throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
            return i
        }

        function d(e) {
            if ("function" != typeof e) throw new Error("Expected the listener to be a function.");
            if (l) throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api-reference/store#subscribelistener for more details.");
            var t = !0;
            return u(), s.push(e),
                function() {
                    if (t) {
                        if (l) throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api-reference/store#subscribelistener for more details.");
                        t = !1, u();
                        var n = s.indexOf(e);
                        s.splice(n, 1), a = null
                    }
                }
        }

        function f(e) {
            if (!ye(e)) throw new Error("Actions must be plain objects. Use custom middleware for async actions.");
            if (void 0 === e.type) throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');
            if (l) throw new Error("Reducers may not dispatch actions.");
            try {
                l = !0, i = o(i, e)
            } finally {
                l = !1
            }
            for (var t = a = s, n = 0; n < t.length; n++) {
                (0, t[n])()
            }
            return e
        }

        function p(e) {
            if ("function" != typeof e) throw new Error("Expected the nextReducer to be a function.");
            o = e, f({
                type: be.REPLACE
            })
        }

        function h() {
            var e, t = d;
            return (e = {
                subscribe: function(e) {
                    if ("object" != typeof e || null === e) throw new TypeError("Expected the observer to be an object.");

                    function n() {
                        e.next && e.next(c())
                    }
                    return n(), {
                        unsubscribe: t(n)
                    }
                }
            })[me.default] = function() {
                return this
            }, e
        }
        return f({
            type: be.INIT
        }), (r = {
            dispatch: f,
            subscribe: d,
            getState: c,
            replaceReducer: p
        })[me.default] = h, r
    }

    function _e(e, t) {
        return function() {
            return t(e.apply(this, arguments))
        }
    }
    const Se = {
        store: null,
        init: function(e = {}) {
            if (this.store) return;
            const t = this._reduce.bind(this);
            return u.is.development && globalThis.devToolsExtension ? this.store = we(t, e, globalThis.devToolsExtension()) : this.store = we(t, e), this.store
        },
        get state() {
            return this.store.getState()
        },
        dispatch: function(e, t) {
            "influx.set-state" !== e.type && log(`%cdispatching %c${e.type}`, "color: #0091ec", "color: #0091ec; font-weight: bold;"), this.store.dispatch({
                type: e.type,
                perform: e,
                payload: t
            })
        },
        observe: function(e, t, n = !0) {
            let r = e(this.state);
            const o = this.store.subscribe((() => {
                const n = e(this.state);
                if (n !== r) {
                    const e = r;
                    r = n, t(r, e)
                }
            }));
            return n && t(r, void 0), o
        },
        _reduce: function(e = {}, t) {
            return t.perform ? t.perform(e, ...t.payload) : e
        }
    };
    var xe, Pe, ke, De, Ee = !1;

    function Ie(e) {
        if (null == e) throw new TypeError("Object.assign cannot be called with null or undefined");
        return Object(e)
    }

    function Te() {
        xe = {}, Pe = Object.getOwnPropertySymbols, ke = Object.prototype.hasOwnProperty, De = Object.prototype.propertyIsEnumerable, xe = function() {
            try {
                if (!Object.assign) return !1;
                var e = new String("abc");
                if (e[5] = "de", "5" === Object.getOwnPropertyNames(e)[0]) return !1;
                for (var t = {}, n = 0; n < 10; n++) t["_" + String.fromCharCode(n)] = n;
                if ("0123456789" !== Object.getOwnPropertyNames(t).map((function(e) {
                        return t[e]
                    })).join("")) return !1;
                var r = {};
                return "abcdefghijklmnopqrst".split("").forEach((function(e) {
                    r[e] = e
                })), "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, r)).join("")
            } catch (e) {
                return !1
            }
        }() ? Object.assign : function(e, t) {
            for (var n, r, o = Ie(e), i = 1; i < arguments.length; i++) {
                for (var a in n = Object(arguments[i])) ke.call(n, a) && (o[a] = n[a]);
                if (Pe) {
                    r = Pe(n);
                    for (var s = 0; s < r.length; s++) De.call(n, r[s]) && (o[r[s]] = n[r[s]])
                }
            }
            return o
        }
    }

    function Ce() {
        return Ee || (Ee = !0, Te()), xe
    }
    var Fe, Ae, Oe, Me, Re, Ne, Ue, Be, Le, je, Ve, He, qe, ze, Ge, $e, We, Ye, Je, Qe, Ke, Xe, Ze, et, tt, nt, rt, ot, it, at, st, lt, ut, ct, dt, ft, pt, ht, gt, mt, vt, bt, yt, wt, _t, St, xt, Pt, kt, Dt, Et, It, Tt = !1;

    function Ct(e) {
        for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
        return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    }

    function Ft(e, t, n) {
        this.props = e, this.context = t, this.refs = We, this.updater = n || $e
    }

    function At() {}

    function Ot(e, t, n) {
        this.props = e, this.context = t, this.refs = We, this.updater = n || $e
    }

    function Mt(e, t, n) {
        var r, o = {},
            i = null,
            a = null;
        if (null != t)
            for (r in void 0 !== t.ref && (a = t.ref), void 0 !== t.key && (i = "" + t.key), t) Qe.call(t, r) && !Ke.hasOwnProperty(r) && (o[r] = t[r]);
        var s = arguments.length - 2;
        if (1 === s) o.children = n;
        else if (1 < s) {
            for (var l = Array(s), u = 0; u < s; u++) l[u] = arguments[u + 2];
            o.children = l
        }
        if (e && e.defaultProps)
            for (r in s = e.defaultProps) void 0 === o[r] && (o[r] = s[r]);
        return {
            $$typeof: Me,
            type: e,
            key: i,
            ref: a,
            props: o,
            _owner: Je.current
        }
    }

    function Rt(e) {
        return "object" == typeof e && null !== e && e.$$typeof === Me
    }

    function Nt(e, t, n, r) {
        if (Ze.length) {
            var o = Ze.pop();
            return o.result = e, o.keyPrefix = t, o.func = n, o.context = r, o.count = 0, o
        }
        return {
            result: e,
            keyPrefix: t,
            func: n,
            context: r,
            count: 0
        }
    }

    function Ut(e) {
        e.result = null, e.keyPrefix = null, e.func = null, e.context = null, e.count = 0, 10 > Ze.length && Ze.push(e)
    }

    function Bt(e, t, n, r) {
        var o = typeof e;
        "undefined" !== o && "boolean" !== o || (e = null);
        var i = !1;
        if (null === e) i = !0;
        else switch (o) {
            case "string":
            case "number":
                i = !0;
                break;
            case "object":
                switch (e.$$typeof) {
                    case Me:
                    case Re:
                        i = !0
                }
        }
        if (i) return n(r, e, "" === t ? "." + jt(e, 0) : t), 1;
        if (i = 0, t = "" === t ? "." : t + ":", Array.isArray(e))
            for (var a = 0; a < e.length; a++) {
                var s = t + jt(o = e[a], a);
                i += Bt(o, s, n, r)
            } else if (null === e || "object" != typeof e ? s = null : s = "function" == typeof(s = Ge && e[Ge] || e["@@iterator"]) ? s : null, "function" == typeof s)
                for (e = s.call(e), a = 0; !(o = e.next()).done;) i += Bt(o = o.value, s = t + jt(o, a++), n, r);
            else if ("object" === o) throw n = "" + e, Error(Ct(31, "[object Object]" === n ? "object with keys {" + Object.keys(e).join(", ") + "}" : n, ""));
        return i
    }

    function Lt(e, t, n) {
        return null == e ? 0 : Bt(e, "", t, n)
    }

    function jt(e, t) {
        return "object" == typeof e && null !== e && null != e.key ? function(e) {
            var t = {
                "=": "=0",
                ":": "=2"
            };
            return "$" + ("" + e).replace(/[=:]/g, (function(e) {
                return t[e]
            }))
        }(e.key) : t.toString(36)
    }

    function Vt(e, t) {
        e.func.call(e.context, t, e.count++)
    }

    function Ht(e, t, n) {
        var r = e.result,
            o = e.keyPrefix;
        e = e.func.call(e.context, t, e.count++), Array.isArray(e) ? qt(e, r, n, (function(e) {
            return e
        })) : null != e && (Rt(e) && (e = function(e, t) {
            return {
                $$typeof: Me,
                type: e.type,
                key: t,
                ref: e.ref,
                props: e.props,
                _owner: e._owner
            }
        }(e, o + (!e.key || t && t.key === e.key ? "" : ("" + e.key).replace(Xe, "$&/") + "/") + n)), r.push(e))
    }

    function qt(e, t, n, r, o) {
        var i = "";
        null != n && (i = ("" + n).replace(Xe, "$&/") + "/"), Lt(e, Ht, t = Nt(t, i, r, o)), Ut(t)
    }

    function zt() {
        var e = et.current;
        if (null === e) throw Error(Ct(321));
        return e
    }

    function Gt() {
        return Tt || (Tt = !0, Fe = {}, Ae = Ce(), Oe = "function" == typeof Symbol && Symbol.for, Me = Oe ? Symbol.for("react.element") : 60103, Re = Oe ? Symbol.for("react.portal") : 60106, Ne = Oe ? Symbol.for("react.fragment") : 60107, Ue = Oe ? Symbol.for("react.strict_mode") : 60108, Be = Oe ? Symbol.for("react.profiler") : 60114, Le = Oe ? Symbol.for("react.provider") : 60109, je = Oe ? Symbol.for("react.context") : 60110, Ve = Oe ? Symbol.for("react.forward_ref") : 60112, He = Oe ? Symbol.for("react.suspense") : 60113, qe = Oe ? Symbol.for("react.memo") : 60115, ze = Oe ? Symbol.for("react.lazy") : 60116, Ge = "function" == typeof Symbol && Symbol.iterator, $e = {
            isMounted: function() {
                return !1
            },
            enqueueForceUpdate: function() {},
            enqueueReplaceState: function() {},
            enqueueSetState: function() {}
        }, We = {}, Ft.prototype.isReactComponent = {}, Ft.prototype.setState = function(e, t) {
            if ("object" != typeof e && "function" != typeof e && null != e) throw Error(Ct(85));
            this.updater.enqueueSetState(this, e, t, "setState")
        }, Ft.prototype.forceUpdate = function(e) {
            this.updater.enqueueForceUpdate(this, e, "forceUpdate")
        }, At.prototype = Ft.prototype, (Ye = Ot.prototype = new At).constructor = Ot, Ae(Ye, Ft.prototype), Ye.isPureReactComponent = !0, Je = {
            current: null
        }, Qe = Object.prototype.hasOwnProperty, Ke = {
            key: !0,
            ref: !0,
            __self: !0,
            __source: !0
        }, Xe = /\/+/g, Ze = [], tt = {
            ReactCurrentDispatcher: et = {
                current: null
            },
            ReactCurrentBatchConfig: {
                suspense: null
            },
            ReactCurrentOwner: Je,
            IsSomeRendererActing: {
                current: !1
            },
            assign: Ae
        }, nt = {
            map: function(e, t, n) {
                if (null == e) return e;
                var r = [];
                return qt(e, r, null, t, n), r
            },
            forEach: function(e, t, n) {
                if (null == e) return e;
                Lt(e, Vt, t = Nt(null, null, t, n)), Ut(t)
            },
            count: function(e) {
                return Lt(e, (function() {
                    return null
                }), null)
            },
            toArray: function(e) {
                var t = [];
                return qt(e, t, null, (function(e) {
                    return e
                })), t
            },
            only: function(e) {
                if (!Rt(e)) throw Error(Ct(143));
                return e
            }
        }, Fe.Children = nt, rt = Ft, Fe.Component = rt, ot = Ne, Fe.Fragment = ot, it = Be, Fe.Profiler = it, at = Ot, Fe.PureComponent = at, st = Ue, Fe.StrictMode = st, lt = He, Fe.Suspense = lt, ut = tt, Fe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ut, ct = function(e, t, n) {
            if (null == e) throw Error(Ct(267, e));
            var r = Ae({}, e.props),
                o = e.key,
                i = e.ref,
                a = e._owner;
            if (null != t) {
                if (void 0 !== t.ref && (i = t.ref, a = Je.current), void 0 !== t.key && (o = "" + t.key), e.type && e.type.defaultProps) var s = e.type.defaultProps;
                for (l in t) Qe.call(t, l) && !Ke.hasOwnProperty(l) && (r[l] = void 0 === t[l] && void 0 !== s ? s[l] : t[l])
            }
            var l = arguments.length - 2;
            if (1 === l) r.children = n;
            else if (1 < l) {
                s = Array(l);
                for (var u = 0; u < l; u++) s[u] = arguments[u + 2];
                r.children = s
            }
            return {
                $$typeof: Me,
                type: e.type,
                key: o,
                ref: i,
                props: r,
                _owner: a
            }
        }, Fe.cloneElement = ct, dt = function(e, t) {
            return void 0 === t && (t = null), (e = {
                $$typeof: je,
                _calculateChangedBits: t,
                _currentValue: e,
                _currentValue2: e,
                _threadCount: 0,
                Provider: null,
                Consumer: null
            }).Provider = {
                $$typeof: Le,
                _context: e
            }, e.Consumer = e
        }, Fe.createContext = dt, ft = Mt, Fe.createElement = ft, pt = function(e) {
            var t = Mt.bind(null, e);
            return t.type = e, t
        }, Fe.createFactory = pt, ht = function() {
            return {
                current: null
            }
        }, Fe.createRef = ht, gt = function(e) {
            return {
                $$typeof: Ve,
                render: e
            }
        }, Fe.forwardRef = gt, mt = Rt, Fe.isValidElement = mt, vt = function(e) {
            return {
                $$typeof: ze,
                _ctor: e,
                _status: -1,
                _result: null
            }
        }, Fe.lazy = vt, bt = function(e, t) {
            return {
                $$typeof: qe,
                type: e,
                compare: void 0 === t ? null : t
            }
        }, Fe.memo = bt, yt = function(e, t) {
            return zt().useCallback(e, t)
        }, Fe.useCallback = yt, wt = function(e, t) {
            return zt().useContext(e, t)
        }, Fe.useContext = wt, _t = function() {}, Fe.useDebugValue = _t, St = function(e, t) {
            return zt().useEffect(e, t)
        }, Fe.useEffect = St, xt = function(e, t, n) {
            return zt().useImperativeHandle(e, t, n)
        }, Fe.useImperativeHandle = xt, Pt = function(e, t) {
            return zt().useLayoutEffect(e, t)
        }, Fe.useLayoutEffect = Pt, kt = function(e, t) {
            return zt().useMemo(e, t)
        }, Fe.useMemo = kt, Dt = function(e, t, n) {
            return zt().useReducer(e, t, n)
        }, Fe.useReducer = Dt, Et = function(e) {
            return zt().useRef(e)
        }, Fe.useRef = Et, It = function(e) {
            return zt().useState(e)
        }, Fe.useState = It, "16.13.1", Fe.version = "16.13.1"), Fe
    }
    var $t, Wt, Yt = !1;

    function Jt() {
        return Yt || (Yt = !0, $t = {}, $t = Gt(), Wt = t($t)), $t
    }
    Jt();
    var Qt, Kt = !1;

    function Xt() {
        return Kt || (Kt = !0, Qt = {}, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED", Qt = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"), Qt
    }
    var Zt, en, tn = !1;

    function nn() {}

    function rn() {}(tn || (tn = !0, Zt = {}, en = Xt(), rn.resetWarningCache = nn, Zt = function() {
        function e(e, t, n, r, o, i) {
            if (i !== en) {
                var a = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
                throw a.name = "Invariant Violation", a
            }
        }

        function t() {
            return e
        }
        e.isRequired = e;
        var n = {
            array: e,
            bool: e,
            func: e,
            number: e,
            object: e,
            string: e,
            symbol: e,
            any: e,
            arrayOf: t,
            element: e,
            elementType: e,
            instanceOf: t,
            node: e,
            objectOf: t,
            oneOf: t,
            oneOfType: t,
            shape: t,
            exact: t,
            checkPropTypes: rn,
            resetWarningCache: nn
        };
        return n.PropTypes = n, n
    }), Zt)();
    Jt();
    var on = Wt.createContext(null);
    var an = function(e) {
            e()
        },
        sn = {
            notify: function() {}
        };

    function ln() {
        var e = an,
            t = null,
            n = null;
        return {
            clear: function() {
                t = null, n = null
            },
            notify: function() {
                e((function() {
                    for (var e = t; e;) e.callback(), e = e.next
                }))
            },
            get: function() {
                for (var e = [], n = t; n;) e.push(n), n = n.next;
                return e
            },
            subscribe: function(e) {
                var r = !0,
                    o = n = {
                        callback: e,
                        next: null,
                        prev: n
                    };
                return o.prev ? o.prev.next = o : t = o,
                    function() {
                        r && null !== t && (r = !1, o.next ? o.next.prev = o.prev : n = o.prev, o.prev ? o.prev.next = o.next : t = o.next)
                    }
            }
        }
    }
    var un = function() {
        function e(e, t) {
            this.store = e, this.parentSub = t, this.unsubscribe = null, this.listeners = sn, this.handleChangeWrapper = this.handleChangeWrapper.bind(this)
        }
        var t = e.prototype;
        return t.addNestedSub = function(e) {
            return this.trySubscribe(), this.listeners.subscribe(e)
        }, t.notifyNestedSubs = function() {
            this.listeners.notify()
        }, t.handleChangeWrapper = function() {
            this.onStateChange && this.onStateChange()
        }, t.isSubscribed = function() {
            return Boolean(this.unsubscribe)
        }, t.trySubscribe = function() {
            this.unsubscribe || (this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.handleChangeWrapper) : this.store.subscribe(this.handleChangeWrapper), this.listeners = ln())
        }, t.tryUnsubscribe = function() {
            this.unsubscribe && (this.unsubscribe(), this.unsubscribe = null, this.listeners.clear(), this.listeners = sn)
        }, e
    }();

    function cn() {
        return (cn = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }).apply(this, arguments)
    }
    var dn = cn;

    function fn(e, t) {
        if (null == e) return {};
        var n, r, o = {},
            i = Object.keys(e);
        for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) >= 0 || (o[n] = e[n]);
        return o
    }
    var pn, hn, gn, mn, vn, bn, yn, wn, _n, Sn, xn, Pn, kn, Dn, En, In, Tn, Cn, Fn, An, On, Mn, Rn, Nn, Un, Bn, Ln, jn, Vn, Hn, qn, zn, Gn, $n, Wn, Yn, Jn, Qn, Kn, Xn, Zn, er, tr, nr, rr, or, ir, ar, sr = !1;

    function lr(e) {
        if ("object" == typeof e && null !== e) {
            var t = e.$$typeof;
            switch (t) {
                case gn:
                    switch (e = e.type) {
                        case Sn:
                        case xn:
                        case vn:
                        case yn:
                        case bn:
                        case kn:
                            return e;
                        default:
                            switch (e = e && e.$$typeof) {
                                case _n:
                                case Pn:
                                case In:
                                case En:
                                case wn:
                                    return e;
                                default:
                                    return t
                            }
                    }
                case mn:
                    return t
            }
        }
    }

    function ur(e) {
        return lr(e) === xn
    }
    var cr = {};
    sr || (sr = !0, pn = {}, hn = "function" == typeof Symbol && Symbol.for, gn = hn ? Symbol.for("react.element") : 60103, mn = hn ? Symbol.for("react.portal") : 60106, vn = hn ? Symbol.for("react.fragment") : 60107, bn = hn ? Symbol.for("react.strict_mode") : 60108, yn = hn ? Symbol.for("react.profiler") : 60114, wn = hn ? Symbol.for("react.provider") : 60109, _n = hn ? Symbol.for("react.context") : 60110, Sn = hn ? Symbol.for("react.async_mode") : 60111, xn = hn ? Symbol.for("react.concurrent_mode") : 60111, Pn = hn ? Symbol.for("react.forward_ref") : 60112, kn = hn ? Symbol.for("react.suspense") : 60113, Dn = hn ? Symbol.for("react.suspense_list") : 60120, En = hn ? Symbol.for("react.memo") : 60115, In = hn ? Symbol.for("react.lazy") : 60116, Tn = hn ? Symbol.for("react.block") : 60121, Cn = hn ? Symbol.for("react.fundamental") : 60117, Fn = hn ? Symbol.for("react.responder") : 60118, An = hn ? Symbol.for("react.scope") : 60119, On = Sn, pn.AsyncMode = On, Mn = xn, pn.ConcurrentMode = Mn, Rn = _n, pn.ContextConsumer = Rn, Nn = wn, pn.ContextProvider = Nn, Un = gn, pn.Element = Un, Bn = Pn, pn.ForwardRef = Bn, Ln = vn, pn.Fragment = Ln, jn = In, pn.Lazy = jn, Vn = En, pn.Memo = Vn, Hn = mn, pn.Portal = Hn, qn = yn, pn.Profiler = qn, zn = bn, pn.StrictMode = zn, Gn = kn, pn.Suspense = Gn, $n = function(e) {
        return ur(e) || lr(e) === Sn
    }, pn.isAsyncMode = $n, Wn = ur, pn.isConcurrentMode = Wn, Yn = function(e) {
        return lr(e) === _n
    }, pn.isContextConsumer = Yn, Jn = function(e) {
        return lr(e) === wn
    }, pn.isContextProvider = Jn, Qn = function(e) {
        return "object" == typeof e && null !== e && e.$$typeof === gn
    }, pn.isElement = Qn, Kn = function(e) {
        return lr(e) === Pn
    }, pn.isForwardRef = Kn, Xn = function(e) {
        return lr(e) === vn
    }, pn.isFragment = Xn, Zn = function(e) {
        return lr(e) === In
    }, pn.isLazy = Zn, er = function(e) {
        return lr(e) === En
    }, pn.isMemo = er, tr = function(e) {
        return lr(e) === mn
    }, pn.isPortal = tr, nr = function(e) {
        return lr(e) === yn
    }, pn.isProfiler = nr, rr = function(e) {
        return lr(e) === bn
    }, pn.isStrictMode = rr, or = function(e) {
        return lr(e) === kn
    }, pn.isSuspense = or, ir = function(e) {
        return "string" == typeof e || "function" == typeof e || e === vn || e === xn || e === yn || e === bn || e === kn || e === Dn || "object" == typeof e && null !== e && (e.$$typeof === In || e.$$typeof === En || e.$$typeof === wn || e.$$typeof === _n || e.$$typeof === Pn || e.$$typeof === Cn || e.$$typeof === Fn || e.$$typeof === An || e.$$typeof === Tn)
    }, pn.isValidElementType = ir, ar = lr, pn.typeOf = ar);
    var dr = {
            childContextTypes: !0,
            contextType: !0,
            contextTypes: !0,
            defaultProps: !0,
            displayName: !0,
            getDefaultProps: !0,
            getDerivedStateFromError: !0,
            getDerivedStateFromProps: !0,
            mixins: !0,
            propTypes: !0,
            type: !0
        },
        fr = {
            name: !0,
            length: !0,
            prototype: !0,
            caller: !0,
            callee: !0,
            arguments: !0,
            arity: !0
        },
        pr = {
            $$typeof: !0,
            compare: !0,
            defaultProps: !0,
            displayName: !0,
            propTypes: !0,
            type: !0
        },
        hr = {};

    function gr(e) {
        return cr.isMemo(e) ? pr : hr[e.$$typeof] || dr
    }
    hr[(cr = pn).ForwardRef] = {
        $$typeof: !0,
        render: !0,
        defaultProps: !0,
        displayName: !0,
        propTypes: !0
    }, hr[cr.Memo] = pr;
    var mr = Object.defineProperty,
        vr = Object.getOwnPropertyNames,
        br = Object.getOwnPropertySymbols,
        yr = Object.getOwnPropertyDescriptor,
        wr = Object.getPrototypeOf,
        _r = Object.prototype;
    var Sr = t((function e(t, n, r) {
        if ("string" != typeof n) {
            if (_r) {
                var o = wr(n);
                o && o !== _r && e(t, o, r)
            }
            var i = vr(n);
            br && (i = i.concat(br(n)));
            for (var a = gr(t), s = gr(n), l = 0; l < i.length; ++l) {
                var u = i[l];
                if (!(fr[u] || r && r[u] || s && s[u] || a && a[u])) {
                    var c = yr(n, u);
                    try {
                        mr(t, u, c)
                    } catch (e) {}
                }
            }
        }
        return t
    }));
    Jt(), Jt();
    var xr = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement ? Jt().useLayoutEffect : Jt().useEffect,
        Pr = [],
        kr = [null, null];

    function Dr(e, t) {
        var n = e[1];
        return [t.payload, n + 1]
    }

    function Er(e, t, n) {
        xr((function() {
            return e.apply(void 0, t)
        }), n)
    }

    function Ir(e, t, n, r, o, i, a) {
        e.current = r, t.current = o, n.current = !1, i.current && (i.current = null, a())
    }

    function Tr(e, t, n, r, o, i, a, s, l, u) {
        if (e) {
            var c = !1,
                d = null,
                f = function() {
                    if (!c) {
                        var e, n, f = t.getState();
                        try {
                            e = r(f, o.current)
                        } catch (e) {
                            n = e, d = e
                        }
                        n || (d = null), e === i.current ? a.current || l() : (i.current = e, s.current = e, a.current = !0, u({
                            type: "STORE_UPDATED",
                            payload: {
                                error: n
                            }
                        }))
                    }
                };
            n.onStateChange = f, n.trySubscribe(), f();
            return function() {
                if (c = !0, n.tryUnsubscribe(), n.onStateChange = null, d) throw d
            }
        }
    }
    var Cr = function() {
        return [null, 0]
    };

    function Fr(e, t) {
        void 0 === t && (t = {});
        var n = t,
            r = n.getDisplayName,
            o = void 0 === r ? function(e) {
                return "ConnectAdvanced(" + e + ")"
            } : r,
            i = n.methodName,
            a = void 0 === i ? "connectAdvanced" : i,
            s = n.renderCountProp,
            l = void 0 === s ? void 0 : s,
            u = n.shouldHandleStateChanges,
            c = void 0 === u || u,
            d = n.storeKey,
            f = void 0 === d ? "store" : d,
            p = (n.withRef, n.forwardRef),
            h = void 0 !== p && p,
            g = n.context,
            m = void 0 === g ? on : g,
            v = fn(n, ["getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef", "forwardRef", "context"]),
            b = m;
        return function(t) {
            var n = t.displayName || t.name || "Component",
                r = o(n),
                i = dn({}, v, {
                    getDisplayName: o,
                    methodName: a,
                    renderCountProp: l,
                    shouldHandleStateChanges: c,
                    storeKey: f,
                    displayName: r,
                    wrappedComponentName: n,
                    WrappedComponent: t
                }),
                s = v.pure;
            var u = s ? Jt().useMemo : function(e) {
                return e()
            };

            function d(n) {
                var r = Jt().useMemo((function() {
                        var e = n.reactReduxForwardedRef,
                            t = fn(n, ["reactReduxForwardedRef"]);
                        return [n.context, e, t]
                    }), [n]),
                    o = r[0],
                    a = r[1],
                    s = r[2],
                    l = Jt().useMemo((function() {
                        return o && o.Consumer && cr.isContextConsumer(Wt.createElement(o.Consumer, null)) ? o : b
                    }), [o, b]),
                    d = Jt().useContext(l),
                    f = Boolean(n.store) && Boolean(n.store.getState) && Boolean(n.store.dispatch);
                Boolean(d) && Boolean(d.store);
                var p = f ? n.store : d.store,
                    h = Jt().useMemo((function() {
                        return function(t) {
                            return e(t.dispatch, i)
                        }(p)
                    }), [p]),
                    g = Jt().useMemo((function() {
                        if (!c) return kr;
                        var e = new un(p, f ? null : d.subscription),
                            t = e.notifyNestedSubs.bind(e);
                        return [e, t]
                    }), [p, f, d]),
                    m = g[0],
                    v = g[1],
                    y = Jt().useMemo((function() {
                        return f ? d : dn({}, d, {
                            subscription: m
                        })
                    }), [f, d, m]),
                    w = Jt().useReducer(Dr, Pr, Cr),
                    _ = w[0][0],
                    S = w[1];
                if (_ && _.error) throw _.error;
                var x = Jt().useRef(),
                    P = Jt().useRef(s),
                    k = Jt().useRef(),
                    D = Jt().useRef(!1),
                    E = u((function() {
                        return k.current && s === P.current ? k.current : h(p.getState(), s)
                    }), [p, _, s]);
                Er(Ir, [P, x, D, s, E, k, v]), Er(Tr, [c, p, m, h, P, x, D, k, v, S], [p, m, h]);
                var I = Jt().useMemo((function() {
                    return Wt.createElement(t, dn({}, E, {
                        ref: a
                    }))
                }), [a, t, E]);
                return Jt().useMemo((function() {
                    return c ? Wt.createElement(l.Provider, {
                        value: y
                    }, I) : I
                }), [l, I, y])
            }
            var p = s ? Wt.memo(d) : d;
            if (p.WrappedComponent = t, p.displayName = r, h) {
                var g = Wt.forwardRef((function(e, t) {
                    return Wt.createElement(p, dn({}, e, {
                        reactReduxForwardedRef: t
                    }))
                }));
                return g.displayName = r, g.WrappedComponent = t, Sr(g, t)
            }
            return Sr(p, t)
        }
    }

    function Ar(e, t) {
        return e === t ? 0 !== e || 0 !== t || 1 / e == 1 / t : e != e && t != t
    }

    function Or(e, t) {
        if (Ar(e, t)) return !0;
        if ("object" != typeof e || null === e || "object" != typeof t || null === t) return !1;
        var n = Object.keys(e),
            r = Object.keys(t);
        if (n.length !== r.length) return !1;
        for (var o = 0; o < n.length; o++)
            if (!Object.prototype.hasOwnProperty.call(t, n[o]) || !Ar(e[n[o]], t[n[o]])) return !1;
        return !0
    }

    function Mr(e) {
        return function(t, n) {
            var r = e(t, n);

            function o() {
                return r
            }
            return o.dependsOnOwnProps = !1, o
        }
    }

    function Rr(e) {
        return null !== e.dependsOnOwnProps && void 0 !== e.dependsOnOwnProps ? Boolean(e.dependsOnOwnProps) : 1 !== e.length
    }

    function Nr(e, t) {
        return function(t, n) {
            n.displayName;
            var r = function(e, t) {
                return r.dependsOnOwnProps ? r.mapToProps(e, t) : r.mapToProps(e)
            };
            return r.dependsOnOwnProps = !0, r.mapToProps = function(t, n) {
                r.mapToProps = e, r.dependsOnOwnProps = Rr(e);
                var o = r(t, n);
                return "function" == typeof o && (r.mapToProps = o, r.dependsOnOwnProps = Rr(o), o = r(t, n)), o
            }, r
        }
    }
    var Ur = [function(e) {
        return "function" == typeof e ? Nr(e) : void 0
    }, function(e) {
        return e ? void 0 : Mr((function(e) {
            return {
                dispatch: e
            }
        }))
    }, function(e) {
        return e && "object" == typeof e ? Mr((function(t) {
            return function(e, t) {
                if ("function" == typeof e) return _e(e, t);
                if ("object" != typeof e || null === e) throw new Error("bindActionCreators expected an object or a function, instead received " + (null === e ? "null" : typeof e) + '. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
                var n = {};
                for (var r in e) {
                    var o = e[r];
                    "function" == typeof o && (n[r] = _e(o, t))
                }
                return n
            }(e, t)
        })) : void 0
    }];
    var Br = [function(e) {
        return "function" == typeof e ? Nr(e) : void 0
    }, function(e) {
        return e ? void 0 : Mr((function() {
            return {}
        }))
    }];

    function Lr(e, t, n) {
        return dn({}, n, {}, e, {}, t)
    }
    var jr = [function(e) {
        return "function" == typeof e ? function(e) {
            return function(t, n) {
                n.displayName;
                var r, o = n.pure,
                    i = n.areMergedPropsEqual,
                    a = !1;
                return function(t, n, s) {
                    var l = e(t, n, s);
                    return a ? o && i(l, r) || (r = l) : (a = !0, r = l), r
                }
            }
        }(e) : void 0
    }, function(e) {
        return e ? void 0 : function() {
            return Lr
        }
    }];

    function Vr(e, t, n, r) {
        return function(o, i) {
            return n(e(o, i), t(r, i), i)
        }
    }

    function Hr(e, t, n, r, o) {
        var i, a, s, l, u, c = o.areStatesEqual,
            d = o.areOwnPropsEqual,
            f = o.areStatePropsEqual,
            p = !1;

        function h(o, p) {
            var h, g, m = !d(p, a),
                v = !c(o, i);
            return i = o, a = p, m && v ? (s = e(i, a), t.dependsOnOwnProps && (l = t(r, a)), u = n(s, l, a)) : m ? (e.dependsOnOwnProps && (s = e(i, a)), t.dependsOnOwnProps && (l = t(r, a)), u = n(s, l, a)) : v ? (h = e(i, a), g = !f(h, s), s = h, g && (u = n(s, l, a)), u) : u
        }
        return function(o, c) {
            return p ? h(o, c) : (s = e(i = o, a = c), l = t(r, a), u = n(s, l, a), p = !0, u)
        }
    }

    function qr(e, t) {
        var n = t.initMapStateToProps,
            r = t.initMapDispatchToProps,
            o = t.initMergeProps,
            i = fn(t, ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"]),
            a = n(e, i),
            s = r(e, i),
            l = o(e, i);
        return (i.pure ? Hr : Vr)(a, s, l, e, i)
    }

    function zr(e, t, n) {
        for (var r = t.length - 1; r >= 0; r--) {
            var o = t[r](e);
            if (o) return o
        }
        return function(t, r) {
            throw new Error("Invalid value of type " + typeof e + " for " + n + " argument when connecting component " + r.wrappedComponentName + ".")
        }
    }

    function Gr(e, t) {
        return e === t
    }

    function $r(e) {
        var t = void 0 === e ? {} : e,
            n = t.connectHOC,
            r = void 0 === n ? Fr : n,
            o = t.mapStateToPropsFactories,
            i = void 0 === o ? Br : o,
            a = t.mapDispatchToPropsFactories,
            s = void 0 === a ? Ur : a,
            l = t.mergePropsFactories,
            u = void 0 === l ? jr : l,
            c = t.selectorFactory,
            d = void 0 === c ? qr : c;
        return function(e, t, n, o) {
            void 0 === o && (o = {});
            var a = o,
                l = a.pure,
                c = void 0 === l || l,
                f = a.areStatesEqual,
                p = void 0 === f ? Gr : f,
                h = a.areOwnPropsEqual,
                g = void 0 === h ? Or : h,
                m = a.areStatePropsEqual,
                v = void 0 === m ? Or : m,
                b = a.areMergedPropsEqual,
                y = void 0 === b ? Or : b,
                w = fn(a, ["pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual"]),
                _ = zr(e, i, "mapStateToProps"),
                S = zr(t, s, "mapDispatchToProps"),
                x = zr(n, u, "mergeProps");
            return r(d, dn({
                methodName: "connect",
                getDisplayName: function(e) {
                    return "Connect(" + e + ")"
                },
                shouldHandleStateChanges: Boolean(e),
                initMapStateToProps: _,
                initMapDispatchToProps: S,
                initMergeProps: x,
                pure: c,
                areStatesEqual: p,
                areOwnPropsEqual: g,
                areStatePropsEqual: v,
                areMergedPropsEqual: y
            }, w))
        }
    }
    var Wr = $r();
    Jt(), Jt();
    Jt();
    var Yr, Jr, Qr, Kr, Xr, Zr, eo, to, no, ro, oo, io, ao, so, lo, uo, co, fo, po, ho, go, mo, vo, bo, yo, wo, _o, So, xo, Po, ko, Do, Eo, Io, To, Co, Fo, Ao, Oo, Mo, Ro, No, Uo, Bo, Lo, jo = !1;

    function Vo(e, t) {
        var n = e.length;
        e.push(t);
        e: for (;;) {
            var r = n - 1 >>> 1,
                o = e[r];
            if (!(void 0 !== o && 0 < zo(o, t))) break e;
            e[r] = t, e[n] = o, n = r
        }
    }

    function Ho(e) {
        return void 0 === (e = e[0]) ? null : e
    }

    function qo(e) {
        var t = e[0];
        if (void 0 !== t) {
            var n = e.pop();
            if (n !== t) {
                e[0] = n;
                e: for (var r = 0, o = e.length; r < o;) {
                    var i = 2 * (r + 1) - 1,
                        a = e[i],
                        s = i + 1,
                        l = e[s];
                    if (void 0 !== a && 0 > zo(a, n)) void 0 !== l && 0 > zo(l, a) ? (e[r] = l, e[s] = n, r = s) : (e[r] = a, e[i] = n, r = i);
                    else {
                        if (!(void 0 !== l && 0 > zo(l, n))) break e;
                        e[r] = l, e[s] = n, r = s
                    }
                }
            }
            return t
        }
        return null
    }

    function zo(e, t) {
        var n = e.sortIndex - t.sortIndex;
        return 0 !== n ? n : e.id - t.id
    }

    function Go(e) {
        for (var t = Ho(_o); null !== t;) {
            if (null === t.callback) qo(_o);
            else {
                if (!(t.startTime <= e)) break;
                qo(_o), t.sortIndex = t.expirationTime, Vo(wo, t)
            }
            t = Ho(_o)
        }
    }

    function $o(e) {
        if (Eo = !1, Go(e), !Do)
            if (null !== Ho(wo)) Do = !0, Kr(Wo);
            else {
                var t = Ho(_o);
                null !== t && Xr($o, t.startTime - e)
            }
    }

    function Wo(e, t) {
        Do = !1, Eo && (Eo = !1, Zr()), ko = !0;
        var n = Po;
        try {
            for (Go(t), xo = Ho(wo); null !== xo && (!(xo.expirationTime > t) || e && !eo());) {
                var r = xo.callback;
                if (null !== r) {
                    xo.callback = null, Po = xo.priorityLevel;
                    var o = r(xo.expirationTime <= t);
                    t = Yr(), "function" == typeof o ? xo.callback = o : xo === Ho(wo) && qo(wo), Go(t)
                } else qo(wo);
                xo = Ho(wo)
            }
            if (null !== xo) var i = !0;
            else {
                var a = Ho(_o);
                null !== a && Xr($o, a.startTime - t), i = !1
            }
            return i
        } finally {
            xo = null, Po = n, ko = !1
        }
    }

    function Yo(e) {
        switch (e) {
            case 1:
                return -1;
            case 2:
                return 250;
            case 5:
                return 1073741823;
            case 4:
                return 1e4;
            default:
                return 5e3
        }
    }

    function Jo() {
        return jo || (jo = !0, Qr = {}, "undefined" == typeof window || "function" != typeof MessageChannel ? (no = null, ro = null, oo = function() {
            if (null !== no) try {
                var e = Yr();
                no(!0, e), no = null
            } catch (e) {
                throw setTimeout(oo, 0), e
            }
        }, io = Date.now(), Yr = function() {
            return Date.now() - io
        }, Qr.unstable_now = Yr, Kr = function(e) {
            null !== no ? setTimeout(Kr, 0, e) : (no = e, setTimeout(oo, 0))
        }, Xr = function(e, t) {
            ro = setTimeout(e, t)
        }, Zr = function() {
            clearTimeout(ro)
        }, eo = function() {
            return !1
        }, Jr = function() {}, to = Qr.unstable_forceFrameRate = Jr) : (ao = window.performance, so = window.Date, lo = window.setTimeout, uo = window.clearTimeout, "undefined" != typeof console && (co = window.cancelAnimationFrame, "function" != typeof window.requestAnimationFrame && console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"), "function" != typeof co && console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills")), "object" == typeof ao && "function" == typeof ao.now ? (Yr = function() {
            return ao.now()
        }, Qr.unstable_now = Yr) : (fo = so.now(), Yr = function() {
            return so.now() - fo
        }, Qr.unstable_now = Yr), po = !1, ho = null, go = -1, mo = 5, vo = 0, eo = function() {
            return Yr() >= vo
        }, to = function() {}, Jr = function(e) {
            0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing framerates higher than 125 fps is not unsupported") : mo = 0 < e ? Math.floor(1e3 / e) : 5
        }, Qr.unstable_forceFrameRate = Jr, bo = new MessageChannel, yo = bo.port2, bo.port1.onmessage = function() {
            if (null !== ho) {
                var e = Yr();
                vo = e + mo;
                try {
                    ho(!0, e) ? yo.postMessage(null) : (po = !1, ho = null)
                } catch (e) {
                    throw yo.postMessage(null), e
                }
            } else po = !1
        }, Kr = function(e) {
            ho = e, po || (po = !0, yo.postMessage(null))
        }, Xr = function(e, t) {
            go = lo((function() {
                e(Yr())
            }), t)
        }, Zr = function() {
            uo(go), go = -1
        }), wo = [], _o = [], So = 1, xo = null, Po = 3, ko = !1, Do = !1, Eo = !1, Io = to, 5, Qr.unstable_IdlePriority = 5, 1, Qr.unstable_ImmediatePriority = 1, 4, Qr.unstable_LowPriority = 4, 3, Qr.unstable_NormalPriority = 3, null, Qr.unstable_Profiling = null, 2, Qr.unstable_UserBlockingPriority = 2, To = function(e) {
            e.callback = null
        }, Qr.unstable_cancelCallback = To, Co = function() {
            Do || ko || (Do = !0, Kr(Wo))
        }, Qr.unstable_continueExecution = Co, Fo = function() {
            return Po
        }, Qr.unstable_getCurrentPriorityLevel = Fo, Ao = function() {
            return Ho(wo)
        }, Qr.unstable_getFirstCallbackNode = Ao, Oo = function(e) {
            switch (Po) {
                case 1:
                case 2:
                case 3:
                    var t = 3;
                    break;
                default:
                    t = Po
            }
            var n = Po;
            Po = t;
            try {
                return e()
            } finally {
                Po = n
            }
        }, Qr.unstable_next = Oo, Mo = function() {}, Qr.unstable_pauseExecution = Mo, Ro = Io, Qr.unstable_requestPaint = Ro, No = function(e, t) {
            switch (e) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                default:
                    e = 3
            }
            var n = Po;
            Po = e;
            try {
                return t()
            } finally {
                Po = n
            }
        }, Qr.unstable_runWithPriority = No, Uo = function(e, t, n) {
            var r = Yr();
            if ("object" == typeof n && null !== n) {
                var o = n.delay;
                o = "number" == typeof o && 0 < o ? r + o : r, n = "number" == typeof n.timeout ? n.timeout : Yo(e)
            } else n = Yo(e), o = r;
            return e = {
                id: So++,
                callback: t,
                priorityLevel: e,
                startTime: o,
                expirationTime: n = o + n,
                sortIndex: -1
            }, o > r ? (e.sortIndex = o, Vo(_o, e), null === Ho(wo) && e === Ho(_o) && (Eo ? Zr() : Eo = !0, Xr($o, o - r))) : (e.sortIndex = n, Vo(wo, e), Do || ko || (Do = !0, Kr(Wo))), e
        }, Qr.unstable_scheduleCallback = Uo, Bo = function() {
            var e = Yr();
            Go(e);
            var t = Ho(wo);
            return t !== xo && null !== xo && null !== t && null !== t.callback && t.startTime <= e && t.expirationTime < xo.expirationTime || eo()
        }, Qr.unstable_shouldYield = Bo, Lo = function(e) {
            var t = Po;
            return function() {
                var n = Po;
                Po = t;
                try {
                    return e.apply(this, arguments)
                } finally {
                    Po = n
                }
            }
        }, Qr.unstable_wrapCallback = Lo), Qr
    }
    var Qo, Ko = !1;

    function Xo() {
        return Ko || (Ko = !0, Qo = {}, Qo = Jo()), Qo
    }
    var Zo, ei, ti, ni, ri, oi, ii, ai, si, li, ui, ci, di, fi, pi, hi, gi, mi, vi, bi, yi, wi, _i, Si, xi, Pi, ki, Di, Ei, Ii, Ti, Ci, Fi, Ai, Oi, Mi, Ri, Ni, Ui, Bi, Li, ji, Vi, Hi, qi, zi, Gi, $i, Wi, Yi, Ji, Qi, Ki, Xi, Zi, ea, ta, na, ra, oa, ia, aa, sa, la, ua, ca, da, fa, pa, ha, ga, ma, va, ba, ya, wa, _a, Sa, xa, Pa, ka, Da, Ea, Ia, Ta, Ca, Fa, Aa, Oa, Ma, Ra, Na, Ua, Ba, La, ja, Va, Ha, qa, za, Ga, $a, Wa, Ya, Ja, Qa, Ka, Xa, Za, es, ts, ns, rs, os, is, as, ss, ls, us, cs, ds, fs, ps, hs, gs, ms, vs, bs, ys, ws, _s, Ss, xs, Ps, ks, Ds, Es, Is, Ts, Cs, Fs, As, Os, Ms, Rs, Ns, Us, Bs, Ls, js, Vs, Hs, qs, zs, Gs, $s, Ws, Ys, Js, Qs, Ks, Xs, Zs, el, tl, nl, rl, ol, il, al, sl, ll, ul, cl, dl, fl, pl, hl, gl, ml, vl, bl, yl, wl, _l, Sl, xl, Pl, kl, Dl, El, Il, Tl, Cl, Fl, Al, Ol, Ml, Rl, Nl, Ul, Bl, Ll, jl, Vl, Hl, ql, zl, Gl, $l, Wl, Yl, Jl, Ql, Kl, Xl, Zl, eu, tu, nu, ru, ou, iu, au, su, lu, uu, cu, du, fu, pu, hu, gu, mu, vu, bu, yu, wu, _u, Su, xu, Pu, ku, Du, Eu, Iu, Tu, Cu, Fu, Au, Ou, Mu, Ru, Nu, Uu, Bu, Lu, ju, Vu, Hu, qu, zu, Gu, $u, Wu, Yu, Ju = !1;

    function Qu(e) {
        for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
        return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    }

    function Ku(e, t, n, r, o, i, a, s, l) {
        var u = Array.prototype.slice.call(arguments, 3);
        try {
            t.apply(n, u)
        } catch (e) {
            this.onError(e)
        }
    }

    function Xu(e, t, n, r, o, i, a, s, l) {
        ni = !1, ri = null, Ku.apply(ai, arguments)
    }

    function Zu(e, t, n) {
        var r = e.type || "unknown-event";
        e.currentTarget = ui(n),
            function(e, t, n, r, o, i, a, s, l) {
                if (Xu.apply(this, arguments), ni) {
                    if (!ni) throw Error(Qu(198));
                    var u = ri;
                    ni = !1, ri = null, oi || (oi = !0, ii = u)
                }
            }(r, t, void 0, e), e.currentTarget = null
    }

    function ec() {
        if (ci)
            for (var e in di) {
                var t = di[e],
                    n = ci.indexOf(e);
                if (!(-1 < n)) throw Error(Qu(96, e));
                if (!fi[n]) {
                    if (!t.extractEvents) throw Error(Qu(97, e));
                    for (var r in fi[n] = t, n = t.eventTypes) {
                        var o = void 0,
                            i = n[r],
                            a = t,
                            s = r;
                        if (pi.hasOwnProperty(s)) throw Error(Qu(99, s));
                        pi[s] = i;
                        var l = i.phasedRegistrationNames;
                        if (l) {
                            for (o in l) l.hasOwnProperty(o) && tc(l[o], a, s);
                            o = !0
                        } else i.registrationName ? (tc(i.registrationName, a, s), o = !0) : o = !1;
                        if (!o) throw Error(Qu(98, r, e))
                    }
                }
            }
    }

    function tc(e, t, n) {
        if (hi[e]) throw Error(Qu(100, e));
        hi[e] = t, gi[e] = t.eventTypes[n].dependencies
    }

    function nc(e) {
        var t, n = !1;
        for (t in e)
            if (e.hasOwnProperty(t)) {
                var r = e[t];
                if (!di.hasOwnProperty(t) || di[t] !== r) {
                    if (di[t]) throw Error(Qu(102, t));
                    di[t] = r, n = !0
                }
            } n && ec()
    }

    function rc(e) {
        if (e = li(e)) {
            if ("function" != typeof vi) throw Error(Qu(280));
            var t = e.stateNode;
            t && (t = si(t), vi(e.stateNode, e.type, t))
        }
    }

    function oc(e) {
        bi ? yi ? yi.push(e) : yi = [e] : bi = e
    }

    function ic() {
        if (bi) {
            var e = bi,
                t = yi;
            if (yi = bi = null, rc(e), t)
                for (e = 0; e < t.length; e++) rc(t[e])
        }
    }

    function ac(e, t) {
        return e(t)
    }

    function sc(e, t, n, r, o) {
        return e(t, n, r, o)
    }

    function lc() {}

    function uc() {
        null === bi && null === yi || (lc(), ic())
    }

    function cc(e, t, n) {
        if (Si) return e(t, n);
        Si = !0;
        try {
            return wi(e, t, n)
        } finally {
            Si = !1, uc()
        }
    }

    function dc(e, t, n, r, o, i) {
        this.acceptsBooleans = 2 === t || 3 === t || 4 === t, this.attributeName = r, this.attributeNamespace = o, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i
    }

    function fc(e) {
        return e[1].toUpperCase()
    }

    function pc(e, t, n, r) {
        var o = Ei.hasOwnProperty(t) ? Ei[t] : null;
        (null !== o ? 0 === o.type : !r && (2 < t.length && ("o" === t[0] || "O" === t[0]) && ("n" === t[1] || "N" === t[1]))) || (function(e, t, n, r) {
            if (null == t || function(e, t, n, r) {
                    if (null !== n && 0 === n.type) return !1;
                    switch (typeof t) {
                        case "function":
                        case "symbol":
                            return !0;
                        case "boolean":
                            return !r && (null !== n ? !n.acceptsBooleans : "data-" !== (e = e.toLowerCase().slice(0, 5)) && "aria-" !== e);
                        default:
                            return !1
                    }
                }(e, t, n, r)) return !0;
            if (r) return !1;
            if (null !== n) switch (n.type) {
                case 3:
                    return !t;
                case 4:
                    return !1 === t;
                case 5:
                    return isNaN(t);
                case 6:
                    return isNaN(t) || 1 > t
            }
            return !1
        }(t, n, o, r) && (n = null), r || null === o ? function(e) {
            return !!Pi.call(Di, e) || !Pi.call(ki, e) && (xi.test(e) ? Di[e] = !0 : (ki[e] = !0, !1))
        }(t) && (null === n ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : o.mustUseProperty ? e[o.propertyName] = null === n ? 3 !== o.type && "" : n : (t = o.attributeName, r = o.attributeNamespace, null === n ? e.removeAttribute(t) : (n = 3 === (o = o.type) || 4 === o && !0 === n ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))))
    }

    function hc(e) {
        return null === e || "object" != typeof e ? null : "function" == typeof(e = $i && e[$i] || e["@@iterator"]) ? e : null
    }

    function gc(e) {
        if (null == e) return null;
        if ("function" == typeof e) return e.displayName || e.name || null;
        if ("string" == typeof e) return e;
        switch (e) {
            case Mi:
                return "Fragment";
            case Oi:
                return "Portal";
            case Ni:
                return "Profiler";
            case Ri:
                return "StrictMode";
            case Vi:
                return "Suspense";
            case Hi:
                return "SuspenseList"
        }
        if ("object" == typeof e) switch (e.$$typeof) {
            case Bi:
                return "Context.Consumer";
            case Ui:
                return "Context.Provider";
            case ji:
                var t = e.render;
                return t = t.displayName || t.name || "", e.displayName || ("" !== t ? "ForwardRef(" + t + ")" : "ForwardRef");
            case qi:
                return gc(e.type);
            case Gi:
                return gc(e.render);
            case zi:
                if (e = 1 === e._status ? e._result : null) return gc(e)
        }
        return null
    }

    function mc(e) {
        var t = "";
        do {
            e: switch (e.tag) {
                case 3:
                case 4:
                case 6:
                case 7:
                case 10:
                case 9:
                    var n = "";
                    break e;
                default:
                    var r = e._debugOwner,
                        o = e._debugSource,
                        i = gc(e.type);
                    n = null, r && (n = gc(r.type)), r = i, i = "", o ? i = " (at " + o.fileName.replace(Ci, "") + ":" + o.lineNumber + ")" : n && (i = " (created by " + n + ")"), n = "\n    in " + (r || "Unknown") + i
            }
            t += n,
            e = e.return
        } while (e);
        return t
    }

    function vc(e) {
        switch (typeof e) {
            case "boolean":
            case "number":
            case "object":
            case "string":
            case "undefined":
                return e;
            default:
                return ""
        }
    }

    function bc(e) {
        var t = e.type;
        return (e = e.nodeName) && "input" === e.toLowerCase() && ("checkbox" === t || "radio" === t)
    }

    function yc(e) {
        e._valueTracker || (e._valueTracker = function(e) {
            var t = bc(e) ? "checked" : "value",
                n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
                r = "" + e[t];
            if (!e.hasOwnProperty(t) && void 0 !== n && "function" == typeof n.get && "function" == typeof n.set) {
                var o = n.get,
                    i = n.set;
                return Object.defineProperty(e, t, {
                    configurable: !0,
                    get: function() {
                        return o.call(this)
                    },
                    set: function(e) {
                        r = "" + e, i.call(this, e)
                    }
                }), Object.defineProperty(e, t, {
                    enumerable: n.enumerable
                }), {
                    getValue: function() {
                        return r
                    },
                    setValue: function(e) {
                        r = "" + e
                    },
                    stopTracking: function() {
                        e._valueTracker = null, delete e[t]
                    }
                }
            }
        }(e))
    }

    function wc(e) {
        if (!e) return !1;
        var t = e._valueTracker;
        if (!t) return !0;
        var n = t.getValue(),
            r = "";
        return e && (r = bc(e) ? e.checked ? "true" : "false" : e.value), (e = r) !== n && (t.setValue(e), !0)
    }

    function _c(e, t) {
        var n = t.checked;
        return ti({}, t, {
            defaultChecked: void 0,
            defaultValue: void 0,
            value: void 0,
            checked: null != n ? n : e._wrapperState.initialChecked
        })
    }

    function Sc(e, t) {
        var n = null == t.defaultValue ? "" : t.defaultValue,
            r = null != t.checked ? t.checked : t.defaultChecked;
        n = vc(null != t.value ? t.value : n), e._wrapperState = {
            initialChecked: r,
            initialValue: n,
            controlled: "checkbox" === t.type || "radio" === t.type ? null != t.checked : null != t.value
        }
    }

    function xc(e, t) {
        null != (t = t.checked) && pc(e, "checked", t, !1)
    }

    function Pc(e, t) {
        xc(e, t);
        var n = vc(t.value),
            r = t.type;
        if (null != n) "number" === r ? (0 === n && "" === e.value || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
        else if ("submit" === r || "reset" === r) return void e.removeAttribute("value");
        t.hasOwnProperty("value") ? Dc(e, t.type, n) : t.hasOwnProperty("defaultValue") && Dc(e, t.type, vc(t.defaultValue)), null == t.checked && null != t.defaultChecked && (e.defaultChecked = !!t.defaultChecked)
    }

    function kc(e, t, n) {
        if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
            var r = t.type;
            if (!("submit" !== r && "reset" !== r || void 0 !== t.value && null !== t.value)) return;
            t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t
        }
        "" !== (n = e.name) && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, "" !== n && (e.name = n)
    }

    function Dc(e, t, n) {
        "number" === t && e.ownerDocument.activeElement === e || (null == n ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n))
    }

    function Ec(e, t) {
        return e = ti({
            children: void 0
        }, t), (t = function(e) {
            var t = "";
            return ei.Children.forEach(e, (function(e) {
                null != e && (t += e)
            })), t
        }(t.children)) && (e.children = t), e
    }

    function Ic(e, t, n, r) {
        if (e = e.options, t) {
            t = {};
            for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
            for (n = 0; n < e.length; n++) o = t.hasOwnProperty("$" + e[n].value), e[n].selected !== o && (e[n].selected = o), o && r && (e[n].defaultSelected = !0)
        } else {
            for (n = "" + vc(n), t = null, o = 0; o < e.length; o++) {
                if (e[o].value === n) return e[o].selected = !0, void(r && (e[o].defaultSelected = !0));
                null !== t || e[o].disabled || (t = e[o])
            }
            null !== t && (t.selected = !0)
        }
    }

    function Tc(e, t) {
        if (null != t.dangerouslySetInnerHTML) throw Error(Qu(91));
        return ti({}, t, {
            value: void 0,
            defaultValue: void 0,
            children: "" + e._wrapperState.initialValue
        })
    }

    function Cc(e, t) {
        var n = t.value;
        if (null == n) {
            if (n = t.children, t = t.defaultValue, null != n) {
                if (null != t) throw Error(Qu(92));
                if (Array.isArray(n)) {
                    if (!(1 >= n.length)) throw Error(Qu(93));
                    n = n[0]
                }
                t = n
            }
            null == t && (t = ""), n = t
        }
        e._wrapperState = {
            initialValue: vc(n)
        }
    }

    function Fc(e, t) {
        var n = vc(t.value),
            r = vc(t.defaultValue);
        null != n && ((n = "" + n) !== e.value && (e.value = n), null == t.defaultValue && e.defaultValue !== n && (e.defaultValue = n)), null != r && (e.defaultValue = "" + r)
    }

    function Ac(e) {
        var t = e.textContent;
        t === e._wrapperState.initialValue && "" !== t && null !== t && (e.value = t)
    }

    function Oc(e) {
        switch (e) {
            case "svg":
                return "http://www.w3.org/2000/svg";
            case "math":
                return "http://www.w3.org/1998/Math/MathML";
            default:
                return "http://www.w3.org/1999/xhtml"
        }
    }

    function Mc(e, t) {
        return null == e || "http://www.w3.org/1999/xhtml" === e ? Oc(t) : "http://www.w3.org/2000/svg" === e && "foreignObject" === t ? "http://www.w3.org/1999/xhtml" : e
    }

    function Rc(e, t) {
        if (t) {
            var n = e.firstChild;
            if (n && n === e.lastChild && 3 === n.nodeType) return void(n.nodeValue = t)
        }
        e.textContent = t
    }

    function Nc(e, t) {
        var n = {};
        return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n
    }

    function Uc(e) {
        if (Ki[e]) return Ki[e];
        if (!Qi[e]) return e;
        var t, n = Qi[e];
        for (t in n)
            if (n.hasOwnProperty(t) && t in Xi) return Ki[e] = n[t];
        return e
    }

    function Bc(e) {
        var t = oa.get(e);
        return void 0 === t && (t = new Map, oa.set(e, t)), t
    }

    function Lc(e) {
        var t = e,
            n = e;
        if (e.alternate)
            for (; t.return;) t = t.return;
        else {
            e = t;
            do {
                0 != (1026 & (t = e).effectTag) && (n = t.return), e = t.return
            } while (e)
        }
        return 3 === t.tag ? n : null
    }

    function jc(e) {
        if (13 === e.tag) {
            var t = e.memoizedState;
            if (null === t && (null !== (e = e.alternate) && (t = e.memoizedState)), null !== t) return t.dehydrated
        }
        return null
    }

    function Vc(e) {
        if (Lc(e) !== e) throw Error(Qu(188))
    }

    function Hc(e) {
        if (!(e = function(e) {
                var t = e.alternate;
                if (!t) {
                    if (null === (t = Lc(e))) throw Error(Qu(188));
                    return t !== e ? null : e
                }
                for (var n = e, r = t;;) {
                    var o = n.return;
                    if (null === o) break;
                    var i = o.alternate;
                    if (null === i) {
                        if (null !== (r = o.return)) {
                            n = r;
                            continue
                        }
                        break
                    }
                    if (o.child === i.child) {
                        for (i = o.child; i;) {
                            if (i === n) return Vc(o), e;
                            if (i === r) return Vc(o), t;
                            i = i.sibling
                        }
                        throw Error(Qu(188))
                    }
                    if (n.return !== r.return) n = o, r = i;
                    else {
                        for (var a = !1, s = o.child; s;) {
                            if (s === n) {
                                a = !0, n = o, r = i;
                                break
                            }
                            if (s === r) {
                                a = !0, r = o, n = i;
                                break
                            }
                            s = s.sibling
                        }
                        if (!a) {
                            for (s = i.child; s;) {
                                if (s === n) {
                                    a = !0, n = i, r = o;
                                    break
                                }
                                if (s === r) {
                                    a = !0, r = i, n = o;
                                    break
                                }
                                s = s.sibling
                            }
                            if (!a) throw Error(Qu(189))
                        }
                    }
                    if (n.alternate !== r) throw Error(Qu(190))
                }
                if (3 !== n.tag) throw Error(Qu(188));
                return n.stateNode.current === n ? e : t
            }(e))) return null;
        for (var t = e;;) {
            if (5 === t.tag || 6 === t.tag) return t;
            if (t.child) t.child.return = t, t = t.child;
            else {
                if (t === e) break;
                for (; !t.sibling;) {
                    if (!t.return || t.return === e) return null;
                    t = t.return
                }
                t.sibling.return = t.return, t = t.sibling
            }
        }
        return null
    }

    function qc(e, t) {
        if (null == t) throw Error(Qu(30));
        return null == e ? t : Array.isArray(e) ? Array.isArray(t) ? (e.push.apply(e, t), e) : (e.push(t), e) : Array.isArray(t) ? [e].concat(t) : [e, t]
    }

    function zc(e, t, n) {
        Array.isArray(e) ? e.forEach(t, n) : e && t.call(n, e)
    }

    function Gc(e) {
        if (e) {
            var t = e._dispatchListeners,
                n = e._dispatchInstances;
            if (Array.isArray(t))
                for (var r = 0; r < t.length && !e.isPropagationStopped(); r++) Zu(e, t[r], n[r]);
            else t && Zu(e, t, n);
            e._dispatchListeners = null, e._dispatchInstances = null, e.isPersistent() || e.constructor.release(e)
        }
    }

    function $c(e) {
        if (null !== e && (ia = qc(ia, e)), e = ia, ia = null, e) {
            if (zc(e, Gc), ia) throw Error(Qu(95));
            if (oi) throw e = ii, oi = !1, ii = null, e
        }
    }

    function Wc(e) {
        return (e = e.target || e.srcElement || window).correspondingUseElement && (e = e.correspondingUseElement), 3 === e.nodeType ? e.parentNode : e
    }

    function Yc(e) {
        if (!mi) return !1;
        var t = (e = "on" + e) in document;
        return t || ((t = document.createElement("div")).setAttribute(e, "return;"), t = "function" == typeof t[e]), t
    }

    function Jc(e) {
        e.topLevelType = null, e.nativeEvent = null, e.targetInst = null, e.ancestors.length = 0, 10 > aa.length && aa.push(e)
    }

    function Qc(e, t, n, r) {
        if (aa.length) {
            var o = aa.pop();
            return o.topLevelType = e, o.eventSystemFlags = r, o.nativeEvent = t, o.targetInst = n, o
        }
        return {
            topLevelType: e,
            eventSystemFlags: r,
            nativeEvent: t,
            targetInst: n,
            ancestors: []
        }
    }

    function Kc(e) {
        var t = e.targetInst,
            n = t;
        do {
            if (!n) {
                e.ancestors.push(n);
                break
            }
            var r = n;
            if (3 === r.tag) r = r.stateNode.containerInfo;
            else {
                for (; r.return;) r = r.return;
                r = 3 !== r.tag ? null : r.stateNode.containerInfo
            }
            if (!r) break;
            5 !== (t = n.tag) && 6 !== t || e.ancestors.push(n), n = Fd(r)
        } while (n);
        for (n = 0; n < e.ancestors.length; n++) {
            t = e.ancestors[n];
            var o = Wc(e.nativeEvent);
            r = e.topLevelType;
            var i = e.nativeEvent,
                a = e.eventSystemFlags;
            0 === n && (a |= 64);
            for (var s = null, l = 0; l < fi.length; l++) {
                var u = fi[l];
                u && (u = u.extractEvents(r, t, i, o, a)) && (s = qc(s, u))
            }
            $c(s)
        }
    }

    function Xc(e, t, n) {
        if (!n.has(e)) {
            switch (e) {
                case "scroll":
                    cd(t, "scroll", !0);
                    break;
                case "focus":
                case "blur":
                    cd(t, "focus", !0), cd(t, "blur", !0), n.set("blur", null), n.set("focus", null);
                    break;
                case "cancel":
                case "close":
                    Yc(e) && cd(t, e, !0);
                    break;
                case "invalid":
                case "submit":
                case "reset":
                    break;
                default:
                    -1 === ra.indexOf(e) && ud(e, t)
            }
            n.set(e, null)
        }
    }

    function Zc(e, t, n, r, o) {
        return {
            blockedOn: e,
            topLevelType: t,
            eventSystemFlags: 32 | n,
            nativeEvent: o,
            container: r
        }
    }

    function ed(e, t) {
        switch (e) {
            case "focus":
            case "blur":
                fa = null;
                break;
            case "dragenter":
            case "dragleave":
                pa = null;
                break;
            case "mouseover":
            case "mouseout":
                ha = null;
                break;
            case "pointerover":
            case "pointerout":
                ga.delete(t.pointerId);
                break;
            case "gotpointercapture":
            case "lostpointercapture":
                ma.delete(t.pointerId)
        }
    }

    function td(e, t, n, r, o, i) {
        return null === e || e.nativeEvent !== i ? (e = Zc(t, n, r, o, i), null !== t && (null !== (t = Ad(t)) && la(t)), e) : (e.eventSystemFlags |= r, e)
    }

    function nd(e) {
        var t = Fd(e.target);
        if (null !== t) {
            var n = Lc(t);
            if (null !== n)
                if (13 === (t = n.tag)) {
                    if (null !== (t = jc(n))) return e.blockedOn = t, void Xo().unstable_runWithPriority(e.priority, (function() {
                        ua(n)
                    }))
                } else if (3 === t && n.stateNode.hydrate) return void(e.blockedOn = 3 === n.tag ? n.stateNode.containerInfo : null)
        }
        e.blockedOn = null
    }

    function rd(e) {
        if (null !== e.blockedOn) return !1;
        var t = hd(e.topLevelType, e.eventSystemFlags, e.container, e.nativeEvent);
        if (null !== t) {
            var n = Ad(t);
            return null !== n && la(n), e.blockedOn = t, !1
        }
        return !0
    }

    function od(e, t, n) {
        rd(e) && n.delete(t)
    }

    function id() {
        for (ca = !1; 0 < da.length;) {
            var e = da[0];
            if (null !== e.blockedOn) {
                null !== (e = Ad(e.blockedOn)) && sa(e);
                break
            }
            var t = hd(e.topLevelType, e.eventSystemFlags, e.container, e.nativeEvent);
            null !== t ? e.blockedOn = t : da.shift()
        }
        null !== fa && rd(fa) && (fa = null), null !== pa && rd(pa) && (pa = null), null !== ha && rd(ha) && (ha = null), ga.forEach(od), ma.forEach(od)
    }

    function ad(e, t) {
        e.blockedOn === t && (e.blockedOn = null, ca || (ca = !0, Xo().unstable_scheduleCallback(Xo().unstable_NormalPriority, id)))
    }

    function sd(e) {
        function t(t) {
            return ad(t, e)
        }
        if (0 < da.length) {
            ad(da[0], e);
            for (var n = 1; n < da.length; n++) {
                var r = da[n];
                r.blockedOn === e && (r.blockedOn = null)
            }
        }
        for (null !== fa && ad(fa, e), null !== pa && ad(pa, e), null !== ha && ad(ha, e), ga.forEach(t), ma.forEach(t), n = 0; n < va.length; n++)(r = va[n]).blockedOn === e && (r.blockedOn = null);
        for (; 0 < va.length && null === (n = va[0]).blockedOn;) nd(n), null === n.blockedOn && va.shift()
    }

    function ld(e, t) {
        for (var n = 0; n < e.length; n += 2) {
            var r = e[n],
                o = e[n + 1],
                i = "on" + (o[0].toUpperCase() + o.slice(1));
            i = {
                phasedRegistrationNames: {
                    bubbled: i,
                    captured: i + "Capture"
                },
                dependencies: [r],
                eventPriority: t
            }, Sa.set(r, t), _a.set(r, i), wa[o] = i
        }
    }

    function ud(e, t) {
        cd(t, e, !1)
    }

    function cd(e, t, n) {
        var r = Sa.get(t);
        switch (void 0 === r ? 2 : r) {
            case 0:
                r = dd.bind(null, t, 1, e);
                break;
            case 1:
                r = fd.bind(null, t, 1, e);
                break;
            default:
                r = pd.bind(null, t, 1, e)
        }
        n ? e.addEventListener(t, r, !0) : e.addEventListener(t, r, !1)
    }

    function dd(e, t, n, r) {
        _i || lc();
        var o = pd,
            i = _i;
        _i = !0;
        try {
            sc(o, e, t, n, r)
        } finally {
            (_i = i) || uc()
        }
    }

    function fd(e, t, n, r) {
        Ea(Da, pd.bind(null, e, t, n, r))
    }

    function pd(e, t, n, r) {
        if (Ia)
            if (0 < da.length && -1 < ba.indexOf(e)) e = Zc(null, e, t, n, r), da.push(e);
            else {
                var o = hd(e, t, n, r);
                if (null === o) ed(e, r);
                else if (-1 < ba.indexOf(e)) e = Zc(o, e, t, n, r), da.push(e);
                else if (! function(e, t, n, r, o) {
                        switch (t) {
                            case "focus":
                                return fa = td(fa, e, t, n, r, o), !0;
                            case "dragenter":
                                return pa = td(pa, e, t, n, r, o), !0;
                            case "mouseover":
                                return ha = td(ha, e, t, n, r, o), !0;
                            case "pointerover":
                                var i = o.pointerId;
                                return ga.set(i, td(ga.get(i) || null, e, t, n, r, o)), !0;
                            case "gotpointercapture":
                                return i = o.pointerId, ma.set(i, td(ma.get(i) || null, e, t, n, r, o)), !0
                        }
                        return !1
                    }(o, e, t, n, r)) {
                    ed(e, r), e = Qc(e, r, null, t);
                    try {
                        cc(Kc, e)
                    } finally {
                        Jc(e)
                    }
                }
            }
    }

    function hd(e, t, n, r) {
        if (null !== (n = Fd(n = Wc(r)))) {
            var o = Lc(n);
            if (null === o) n = null;
            else {
                var i = o.tag;
                if (13 === i) {
                    if (null !== (n = jc(o))) return n;
                    n = null
                } else if (3 === i) {
                    if (o.stateNode.hydrate) return 3 === o.tag ? o.stateNode.containerInfo : null;
                    n = null
                } else o !== n && (n = null)
            }
        }
        e = Qc(e, r, n, t);
        try {
            cc(Kc, e)
        } finally {
            Jc(e)
        }
        return null
    }

    function gd(e, t, n) {
        return null == t || "boolean" == typeof t || "" === t ? "" : n || "number" != typeof t || 0 === t || Ta.hasOwnProperty(e) && Ta[e] ? ("" + t).trim() : t + "px"
    }

    function md(e, t) {
        for (var n in e = e.style, t)
            if (t.hasOwnProperty(n)) {
                var r = 0 === n.indexOf("--"),
                    o = gd(n, t[n], r);
                "float" === n && (n = "cssFloat"), r ? e.setProperty(n, o) : e[n] = o
            }
    }

    function vd(e, t) {
        if (t) {
            if (Fa[e] && (null != t.children || null != t.dangerouslySetInnerHTML)) throw Error(Qu(137, e, ""));
            if (null != t.dangerouslySetInnerHTML) {
                if (null != t.children) throw Error(Qu(60));
                if ("object" != typeof t.dangerouslySetInnerHTML || !("__html" in t.dangerouslySetInnerHTML)) throw Error(Qu(61))
            }
            if (null != t.style && "object" != typeof t.style) throw Error(Qu(62, ""))
        }
    }

    function bd(e, t) {
        if (-1 === e.indexOf("-")) return "string" == typeof t.is;
        switch (e) {
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph":
                return !1;
            default:
                return !0
        }
    }

    function yd(e, t) {
        var n = Bc(e = 9 === e.nodeType || 11 === e.nodeType ? e : e.ownerDocument);
        t = gi[t];
        for (var r = 0; r < t.length; r++) Xc(t[r], e, n)
    }

    function wd() {}

    function _d(e) {
        if (void 0 === (e = e || ("undefined" != typeof document ? document : void 0))) return null;
        try {
            return e.activeElement || e.body
        } catch (t) {
            return e.body
        }
    }

    function Sd(e) {
        for (; e && e.firstChild;) e = e.firstChild;
        return e
    }

    function xd(e, t) {
        var n, r = Sd(e);
        for (e = 0; r;) {
            if (3 === r.nodeType) {
                if (n = e + r.textContent.length, e <= t && n >= t) return {
                    node: r,
                    offset: t - e
                };
                e = n
            }
            e: {
                for (; r;) {
                    if (r.nextSibling) {
                        r = r.nextSibling;
                        break e
                    }
                    r = r.parentNode
                }
                r = void 0
            }
            r = Sd(r)
        }
    }

    function Pd(e, t) {
        return !(!e || !t) && (e === t || (!e || 3 !== e.nodeType) && (t && 3 === t.nodeType ? Pd(e, t.parentNode) : "contains" in e ? e.contains(t) : !!e.compareDocumentPosition && !!(16 & e.compareDocumentPosition(t))))
    }

    function kd() {
        for (var e = window, t = _d(); t instanceof e.HTMLIFrameElement;) {
            try {
                var n = "string" == typeof t.contentWindow.location.href
            } catch (e) {
                n = !1
            }
            if (!n) break;
            t = _d((e = t.contentWindow).document)
        }
        return t
    }

    function Dd(e) {
        var t = e && e.nodeName && e.nodeName.toLowerCase();
        return t && ("input" === t && ("text" === e.type || "search" === e.type || "tel" === e.type || "url" === e.type || "password" === e.type) || "textarea" === t || "true" === e.contentEditable)
    }

    function Ed(e, t) {
        switch (e) {
            case "button":
            case "input":
            case "select":
            case "textarea":
                return !!t.autoFocus
        }
        return !1
    }

    function Id(e, t) {
        return "textarea" === e || "option" === e || "noscript" === e || "string" == typeof t.children || "number" == typeof t.children || "object" == typeof t.dangerouslySetInnerHTML && null !== t.dangerouslySetInnerHTML && null != t.dangerouslySetInnerHTML.__html
    }

    function Td(e) {
        for (; null != e; e = e.nextSibling) {
            var t = e.nodeType;
            if (1 === t || 3 === t) break
        }
        return e
    }

    function Cd(e) {
        e = e.previousSibling;
        for (var t = 0; e;) {
            if (8 === e.nodeType) {
                var n = e.data;
                if (n === Oa || n === Na || n === Ra) {
                    if (0 === t) return e;
                    t--
                } else n === Ma && t++
            }
            e = e.previousSibling
        }
        return null
    }

    function Fd(e) {
        var t = e[Ha];
        if (t) return t;
        for (var n = e.parentNode; n;) {
            if (t = n[za] || n[Ha]) {
                if (n = t.alternate, null !== t.child || null !== n && null !== n.child)
                    for (e = Cd(e); null !== e;) {
                        if (n = e[Ha]) return n;
                        e = Cd(e)
                    }
                return t
            }
            n = (e = n).parentNode
        }
        return null
    }

    function Ad(e) {
        return !(e = e[Ha] || e[za]) || 5 !== e.tag && 6 !== e.tag && 13 !== e.tag && 3 !== e.tag ? null : e
    }

    function Od(e) {
        if (5 === e.tag || 6 === e.tag) return e.stateNode;
        throw Error(Qu(33))
    }

    function Md(e) {
        return e[qa] || null
    }

    function Rd(e) {
        do {
            e = e.return
        } while (e && 5 !== e.tag);
        return e || null
    }

    function Nd(e, t) {
        var n = e.stateNode;
        if (!n) return null;
        var r = si(n);
        if (!r) return null;
        n = r[t];
        e: switch (t) {
            case "onClick":
            case "onClickCapture":
            case "onDoubleClick":
            case "onDoubleClickCapture":
            case "onMouseDown":
            case "onMouseDownCapture":
            case "onMouseMove":
            case "onMouseMoveCapture":
            case "onMouseUp":
            case "onMouseUpCapture":
            case "onMouseEnter":
                (r = !r.disabled) || (r = !("button" === (e = e.type) || "input" === e || "select" === e || "textarea" === e)), e = !r;
                break e;
            default:
                e = !1
        }
        if (e) return null;
        if (n && "function" != typeof n) throw Error(Qu(231, t, typeof n));
        return n
    }

    function Ud(e, t, n) {
        (t = Nd(e, n.dispatchConfig.phasedRegistrationNames[t])) && (n._dispatchListeners = qc(n._dispatchListeners, t), n._dispatchInstances = qc(n._dispatchInstances, e))
    }

    function Bd(e) {
        if (e && e.dispatchConfig.phasedRegistrationNames) {
            for (var t = e._targetInst, n = []; t;) n.push(t), t = Rd(t);
            for (t = n.length; 0 < t--;) Ud(n[t], "captured", e);
            for (t = 0; t < n.length; t++) Ud(n[t], "bubbled", e)
        }
    }

    function Ld(e, t, n) {
        e && n && n.dispatchConfig.registrationName && (t = Nd(e, n.dispatchConfig.registrationName)) && (n._dispatchListeners = qc(n._dispatchListeners, t), n._dispatchInstances = qc(n._dispatchInstances, e))
    }

    function jd(e) {
        e && e.dispatchConfig.registrationName && Ld(e._targetInst, null, e)
    }

    function Vd(e) {
        zc(e, Bd)
    }

    function Hd() {
        if (Wa) return Wa;
        var e, t, n = $a,
            r = n.length,
            o = "value" in Ga ? Ga.value : Ga.textContent,
            i = o.length;
        for (e = 0; e < r && n[e] === o[e]; e++);
        var a = r - e;
        for (t = 1; t <= a && n[r - t] === o[i - t]; t++);
        return Wa = o.slice(e, 1 < t ? 1 - t : void 0)
    }

    function qd() {
        return !0
    }

    function zd() {
        return !1
    }

    function Gd(e, t, n, r) {
        for (var o in this.dispatchConfig = e, this._targetInst = t, this.nativeEvent = n, e = this.constructor.Interface) e.hasOwnProperty(o) && ((t = e[o]) ? this[o] = t(n) : "target" === o ? this.target = r : this[o] = n[o]);
        return this.isDefaultPrevented = (null != n.defaultPrevented ? n.defaultPrevented : !1 === n.returnValue) ? qd : zd, this.isPropagationStopped = zd, this
    }

    function $d(e, t, n, r) {
        if (this.eventPool.length) {
            var o = this.eventPool.pop();
            return this.call(o, e, t, n, r), o
        }
        return new this(e, t, n, r)
    }

    function Wd(e) {
        if (!(e instanceof this)) throw Error(Qu(279));
        e.destructor(), 10 > this.eventPool.length && this.eventPool.push(e)
    }

    function Yd(e) {
        e.eventPool = [], e.getPooled = $d, e.release = Wd
    }

    function Jd(e, t) {
        switch (e) {
            case "keyup":
                return -1 !== Qa.indexOf(t.keyCode);
            case "keydown":
                return 229 !== t.keyCode;
            case "keypress":
            case "mousedown":
            case "blur":
                return !0;
            default:
                return !1
        }
    }

    function Qd(e) {
        return "object" == typeof(e = e.detail) && "data" in e ? e.data : null
    }

    function Kd(e) {
        var t = e && e.nodeName && e.nodeName.toLowerCase();
        return "input" === t ? !!as[e.type] : "textarea" === t
    }

    function Xd(e, t, n) {
        return (e = Gd.getPooled(ss.change, e, t, n)).type = "change", oc(n), Vd(e), e
    }

    function Zd(e) {
        $c(e)
    }

    function ef(e) {
        if (wc(Od(e))) return e
    }

    function tf(e, t) {
        if ("change" === e) return t
    }

    function nf() {
        ls && (ls.detachEvent("onpropertychange", rf), us = ls = null)
    }

    function rf(e) {
        if ("value" === e.propertyName && ef(us))
            if (e = Xd(us, e, Wc(e)), _i) $c(e);
            else {
                _i = !0;
                try {
                    ac(Zd, e)
                } finally {
                    _i = !1, uc()
                }
            }
    }

    function of(e, t, n) {
        "focus" === e ? (nf(), us = n, (ls = t).attachEvent("onpropertychange", rf)) : "blur" === e && nf()
    }

    function af(e) {
        if ("selectionchange" === e || "keyup" === e || "keydown" === e) return ef(us)
    }

    function sf(e, t) {
        if ("click" === e) return ef(t)
    }

    function lf(e, t) {
        if ("input" === e || "change" === e) return ef(t)
    }

    function uf(e) {
        var t = this.nativeEvent;
        return t.getModifierState ? t.getModifierState(e) : !!(e = ps[e]) && !!t[e]
    }

    function cf() {
        return uf
    }

    function df(e, t) {
        return e === t && (0 !== e || 1 / e == 1 / t) || e != e && t != t
    }

    function ff(e, t) {
        if (Ss(e, t)) return !0;
        if ("object" != typeof e || null === e || "object" != typeof t || null === t) return !1;
        var n = Object.keys(e),
            r = Object.keys(t);
        if (n.length !== r.length) return !1;
        for (r = 0; r < n.length; r++)
            if (!xs.call(t, n[r]) || !Ss(e[n[r]], t[n[r]])) return !1;
        return !0
    }

    function pf(e, t) {
        var n = t.window === t ? t.document : 9 === t.nodeType ? t : t.ownerDocument;
        return Ts || null == Ds || Ds !== _d(n) ? null : ("selectionStart" in (n = Ds) && Dd(n) ? n = {
            start: n.selectionStart,
            end: n.selectionEnd
        } : n = {
            anchorNode: (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection()).anchorNode,
            anchorOffset: n.anchorOffset,
            focusNode: n.focusNode,
            focusOffset: n.focusOffset
        }, Is && ff(Is, n) ? null : (Is = n, (e = Gd.getPooled(ks.select, Es, e, t)).type = "select", e.target = Ds, Vd(e), e))
    }

    function hf(e) {
        var t = e.keyCode;
        return "charCode" in e ? 0 === (e = e.charCode) && 13 === t && (e = 13) : e = t, 10 === e && (e = 13), 32 <= e || 13 === e ? e : 0
    }

    function gf(e) {
        0 > qs || (e.current = Hs[qs], Hs[qs] = null, qs--)
    }

    function mf(e, t) {
        qs++, Hs[qs] = e.current, e.current = t
    }

    function vf(e, t) {
        var n = e.type.contextTypes;
        if (!n) return zs;
        var r = e.stateNode;
        if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
        var o, i = {};
        for (o in n) i[o] = t[o];
        return r && ((e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = i), i
    }

    function bf(e) {
        return null != (e = e.childContextTypes)
    }

    function yf() {
        gf($s), gf(Gs)
    }

    function wf(e, t, n) {
        if (Gs.current !== zs) throw Error(Qu(168));
        mf(Gs, t), mf($s, n)
    }

    function _f(e, t, n) {
        var r = e.stateNode;
        if (e = t.childContextTypes, "function" != typeof r.getChildContext) return n;
        for (var o in r = r.getChildContext())
            if (!(o in e)) throw Error(Qu(108, gc(t) || "Unknown", o));
        return ti({}, n, {}, r)
    }

    function Sf(e) {
        return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || zs, Ws = Gs.current, mf(Gs, e), mf($s, $s.current), !0
    }

    function xf(e, t, n) {
        var r = e.stateNode;
        if (!r) throw Error(Qu(169));
        n ? (e = _f(e, t, Ws), r.__reactInternalMemoizedMergedChildContext = e, gf($s), gf(Gs), mf(Gs, e)) : gf($s), mf($s, n)
    }

    function Pf() {
        switch (Zs()) {
            case el:
                return 99;
            case tl:
                return 98;
            case nl:
                return 97;
            case rl:
                return 96;
            case ol:
                return 95;
            default:
                throw Error(Qu(332))
        }
    }

    function kf(e) {
        switch (e) {
            case 99:
                return el;
            case 98:
                return tl;
            case 97:
                return nl;
            case 96:
                return rl;
            case 95:
                return ol;
            default:
                throw Error(Qu(332))
        }
    }

    function Df(e, t) {
        return e = kf(e), Ys(e, t)
    }

    function Ef(e, t, n) {
        return e = kf(e), Js(e, t, n)
    }

    function If(e) {
        return null === ll ? (ll = [e], ul = Js(el, Cf)) : ll.push(e), il
    }

    function Tf() {
        if (null !== ul) {
            var e = ul;
            ul = null, Qs(e)
        }
        Cf()
    }

    function Cf() {
        if (!cl && null !== ll) {
            cl = !0;
            var e = 0;
            try {
                var t = ll;
                Df(99, (function() {
                    for (; e < t.length; e++) {
                        var n = t[e];
                        do {
                            n = n(!0)
                        } while (null !== n)
                    }
                })), ll = null
            } catch (t) {
                throw null !== ll && (ll = ll.slice(e + 1)), Js(el, Tf), t
            } finally {
                cl = !1
            }
        }
    }

    function Ff(e, t, n) {
        return 1073741821 - (1 + ((1073741821 - e + t / 10) / (n /= 10) | 0)) * n
    }

    function Af(e, t) {
        if (e && e.defaultProps)
            for (var n in t = ti({}, t), e = e.defaultProps) void 0 === t[n] && (t[n] = e[n]);
        return t
    }

    function Of() {
        ml = gl = hl = null
    }

    function Mf(e) {
        var t = pl.current;
        gf(pl), e.type._context._currentValue = t
    }

    function Rf(e, t) {
        for (; null !== e;) {
            var n = e.alternate;
            if (e.childExpirationTime < t) e.childExpirationTime = t, null !== n && n.childExpirationTime < t && (n.childExpirationTime = t);
            else {
                if (!(null !== n && n.childExpirationTime < t)) break;
                n.childExpirationTime = t
            }
            e = e.return
        }
    }

    function Nf(e, t) {
        hl = e, ml = gl = null, null !== (e = e.dependencies) && null !== e.firstContext && (e.expirationTime >= t && (zl = !0), e.firstContext = null)
    }

    function Uf(e, t) {
        if (ml !== e && !1 !== t && 0 !== t)
            if ("number" == typeof t && 1073741823 !== t || (ml = e, t = 1073741823), t = {
                    context: e,
                    observedBits: t,
                    next: null
                }, null === gl) {
                if (null === hl) throw Error(Qu(308));
                gl = t, hl.dependencies = {
                    expirationTime: 0,
                    firstContext: t,
                    responders: null
                }
            } else gl = gl.next = t;
        return e._currentValue
    }

    function Bf(e) {
        e.updateQueue = {
            baseState: e.memoizedState,
            baseQueue: null,
            shared: {
                pending: null
            },
            effects: null
        }
    }

    function Lf(e, t) {
        e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
            baseState: e.baseState,
            baseQueue: e.baseQueue,
            shared: e.shared,
            effects: e.effects
        })
    }

    function jf(e, t) {
        return (e = {
            expirationTime: e,
            suspenseConfig: t,
            tag: 0,
            payload: null,
            callback: null,
            next: null
        }).next = e
    }

    function Vf(e, t) {
        if (null !== (e = e.updateQueue)) {
            var n = (e = e.shared).pending;
            null === n ? t.next = t : (t.next = n.next, n.next = t), e.pending = t
        }
    }

    function Hf(e, t) {
        var n = e.alternate;
        null !== n && Lf(n, e), null === (n = (e = e.updateQueue).baseQueue) ? (e.baseQueue = t.next = t, t.next = t) : (t.next = n.next, n.next = t)
    }

    function qf(e, t, n, r) {
        var o = e.updateQueue;
        vl = !1;
        var i = o.baseQueue,
            a = o.shared.pending;
        if (null !== a) {
            if (null !== i) {
                var s = i.next;
                i.next = a.next, a.next = s
            }
            i = a, o.shared.pending = null, null !== (s = e.alternate) && (null !== (s = s.updateQueue) && (s.baseQueue = a))
        }
        if (null !== i) {
            s = i.next;
            var l = o.baseState,
                u = 0,
                c = null,
                d = null,
                f = null;
            if (null !== s)
                for (var p = s;;) {
                    if ((a = p.expirationTime) < r) {
                        var h = {
                            expirationTime: p.expirationTime,
                            suspenseConfig: p.suspenseConfig,
                            tag: p.tag,
                            payload: p.payload,
                            callback: p.callback,
                            next: null
                        };
                        null === f ? (d = f = h, c = l) : f = f.next = h, a > u && (u = a)
                    } else {
                        null !== f && (f = f.next = {
                            expirationTime: 1073741823,
                            suspenseConfig: p.suspenseConfig,
                            tag: p.tag,
                            payload: p.payload,
                            callback: p.callback,
                            next: null
                        }), Ch(a, p.suspenseConfig);
                        e: {
                            var g = e,
                                m = p;
                            switch (a = t, h = n, m.tag) {
                                case 1:
                                    if ("function" == typeof(g = m.payload)) {
                                        l = g.call(h, l, a);
                                        break e
                                    }
                                    l = g;
                                    break e;
                                case 3:
                                    g.effectTag = -4097 & g.effectTag | 64;
                                case 0:
                                    if (null == (a = "function" == typeof(g = m.payload) ? g.call(h, l, a) : g)) break e;
                                    l = ti({}, l, a);
                                    break e;
                                case 2:
                                    vl = !0
                            }
                        }
                        null !== p.callback && (e.effectTag |= 32, null === (a = o.effects) ? o.effects = [p] : a.push(p))
                    }
                    if (null === (p = p.next) || p === s) {
                        if (null === (a = o.shared.pending)) break;
                        p = i.next = a.next, a.next = s, o.baseQueue = i = a, o.shared.pending = null
                    }
                }
            null === f ? c = l : f.next = d, o.baseState = c, o.baseQueue = f, Fh(u), e.expirationTime = u, e.memoizedState = l
        }
    }

    function zf(e, t, n) {
        if (e = t.effects, t.effects = null, null !== e)
            for (t = 0; t < e.length; t++) {
                var r = e[t],
                    o = r.callback;
                if (null !== o) {
                    if (r.callback = null, r = o, o = n, "function" != typeof r) throw Error(Qu(191, r));
                    r.call(o)
                }
            }
    }

    function Gf(e, t, n, r) {
        n = null == (n = n(r, t = e.memoizedState)) ? t : ti({}, t, n), e.memoizedState = n, 0 === e.expirationTime && (e.updateQueue.baseState = n)
    }

    function $f(e, t, n, r, o, i, a) {
        return "function" == typeof(e = e.stateNode).shouldComponentUpdate ? e.shouldComponentUpdate(r, i, a) : !t.prototype || !t.prototype.isPureReactComponent || (!ff(n, r) || !ff(o, i))
    }

    function Wf(e, t, n) {
        var r = !1,
            o = zs,
            i = t.contextType;
        return "object" == typeof i && null !== i ? i = Uf(i) : (o = bf(t) ? Ws : Gs.current, i = (r = null != (r = t.contextTypes)) ? vf(e, o) : zs), t = new t(n, i), e.memoizedState = null !== t.state && void 0 !== t.state ? t.state : null, t.updater = wl, e.stateNode = t, t._reactInternalFiber = e, r && ((e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext = o, e.__reactInternalMemoizedMaskedChildContext = i), t
    }

    function Yf(e, t, n, r) {
        e = t.state, "function" == typeof t.componentWillReceiveProps && t.componentWillReceiveProps(n, r), "function" == typeof t.UNSAFE_componentWillReceiveProps && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && wl.enqueueReplaceState(t, t.state, null)
    }

    function Jf(e, t, n, r) {
        var o = e.stateNode;
        o.props = n, o.state = e.memoizedState, o.refs = yl, Bf(e);
        var i = t.contextType;
        "object" == typeof i && null !== i ? o.context = Uf(i) : (i = bf(t) ? Ws : Gs.current, o.context = vf(e, i)), qf(e, n, o, r), o.state = e.memoizedState, "function" == typeof(i = t.getDerivedStateFromProps) && (Gf(e, t, i, n), o.state = e.memoizedState), "function" == typeof t.getDerivedStateFromProps || "function" == typeof o.getSnapshotBeforeUpdate || "function" != typeof o.UNSAFE_componentWillMount && "function" != typeof o.componentWillMount || (t = o.state, "function" == typeof o.componentWillMount && o.componentWillMount(), "function" == typeof o.UNSAFE_componentWillMount && o.UNSAFE_componentWillMount(), t !== o.state && wl.enqueueReplaceState(o, o.state, null), qf(e, n, o, r), o.state = e.memoizedState), "function" == typeof o.componentDidMount && (e.effectTag |= 4)
    }

    function Qf(e, t, n) {
        if (null !== (e = n.ref) && "function" != typeof e && "object" != typeof e) {
            if (n._owner) {
                if (n = n._owner) {
                    if (1 !== n.tag) throw Error(Qu(309));
                    var r = n.stateNode
                }
                if (!r) throw Error(Qu(147, e));
                var o = "" + e;
                return null !== t && null !== t.ref && "function" == typeof t.ref && t.ref._stringRef === o ? t.ref : ((t = function(e) {
                    var t = r.refs;
                    t === yl && (t = r.refs = {}), null === e ? delete t[o] : t[o] = e
                })._stringRef = o, t)
            }
            if ("string" != typeof e) throw Error(Qu(284));
            if (!n._owner) throw Error(Qu(290, e))
        }
        return e
    }

    function Kf(e, t) {
        if ("textarea" !== e.type) throw Error(Qu(31, "[object Object]" === Object.prototype.toString.call(t) ? "object with keys {" + Object.keys(t).join(", ") + "}" : t, ""))
    }

    function Xf(e) {
        function t(t, n) {
            if (e) {
                var r = t.lastEffect;
                null !== r ? (r.nextEffect = n, t.lastEffect = n) : t.firstEffect = t.lastEffect = n, n.nextEffect = null, n.effectTag = 8
            }
        }

        function n(n, r) {
            if (!e) return null;
            for (; null !== r;) t(n, r), r = r.sibling;
            return null
        }

        function r(e, t) {
            for (e = new Map; null !== t;) null !== t.key ? e.set(t.key, t) : e.set(t.index, t), t = t.sibling;
            return e
        }

        function o(e, t) {
            return (e = Jh(e, t)).index = 0, e.sibling = null, e
        }

        function i(t, n, r) {
            return t.index = r, e ? null !== (r = t.alternate) ? (r = r.index) < n ? (t.effectTag = 2, n) : r : (t.effectTag = 2, n) : n
        }

        function a(t) {
            return e && null === t.alternate && (t.effectTag = 2), t
        }

        function s(e, t, n, r) {
            return null === t || 6 !== t.tag ? ((t = Xh(n, e.mode, r)).return = e, t) : ((t = o(t, n)).return = e, t)
        }

        function l(e, t, n, r) {
            return null !== t && t.elementType === n.type ? ((r = o(t, n.props)).ref = Qf(e, t, n), r.return = e, r) : ((r = Qh(n.type, n.key, n.props, null, e.mode, r)).ref = Qf(e, t, n), r.return = e, r)
        }

        function u(e, t, n, r) {
            return null === t || 4 !== t.tag || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? ((t = Zh(n, e.mode, r)).return = e, t) : ((t = o(t, n.children || [])).return = e, t)
        }

        function c(e, t, n, r, i) {
            return null === t || 7 !== t.tag ? ((t = Kh(n, e.mode, r, i)).return = e, t) : ((t = o(t, n)).return = e, t)
        }

        function d(e, t, n) {
            if ("string" == typeof t || "number" == typeof t) return (t = Xh("" + t, e.mode, n)).return = e, t;
            if ("object" == typeof t && null !== t) {
                switch (t.$$typeof) {
                    case Ai:
                        return (n = Qh(t.type, t.key, t.props, null, e.mode, n)).ref = Qf(e, null, t), n.return = e, n;
                    case Oi:
                        return (t = Zh(t, e.mode, n)).return = e, t
                }
                if (_l(t) || hc(t)) return (t = Kh(t, e.mode, n, null)).return = e, t;
                Kf(e, t)
            }
            return null
        }

        function f(e, t, n, r) {
            var o = null !== t ? t.key : null;
            if ("string" == typeof n || "number" == typeof n) return null !== o ? null : s(e, t, "" + n, r);
            if ("object" == typeof n && null !== n) {
                switch (n.$$typeof) {
                    case Ai:
                        return n.key === o ? n.type === Mi ? c(e, t, n.props.children, r, o) : l(e, t, n, r) : null;
                    case Oi:
                        return n.key === o ? u(e, t, n, r) : null
                }
                if (_l(n) || hc(n)) return null !== o ? null : c(e, t, n, r, null);
                Kf(e, n)
            }
            return null
        }

        function p(e, t, n, r, o) {
            if ("string" == typeof r || "number" == typeof r) return s(t, e = e.get(n) || null, "" + r, o);
            if ("object" == typeof r && null !== r) {
                switch (r.$$typeof) {
                    case Ai:
                        return e = e.get(null === r.key ? n : r.key) || null, r.type === Mi ? c(t, e, r.props.children, o, r.key) : l(t, e, r, o);
                    case Oi:
                        return u(t, e = e.get(null === r.key ? n : r.key) || null, r, o)
                }
                if (_l(r) || hc(r)) return c(t, e = e.get(n) || null, r, o, null);
                Kf(t, r)
            }
            return null
        }

        function h(o, a, s, l) {
            for (var u = null, c = null, h = a, g = a = 0, m = null; null !== h && g < s.length; g++) {
                h.index > g ? (m = h, h = null) : m = h.sibling;
                var v = f(o, h, s[g], l);
                if (null === v) {
                    null === h && (h = m);
                    break
                }
                e && h && null === v.alternate && t(o, h), a = i(v, a, g), null === c ? u = v : c.sibling = v, c = v, h = m
            }
            if (g === s.length) return n(o, h), u;
            if (null === h) {
                for (; g < s.length; g++) null !== (h = d(o, s[g], l)) && (a = i(h, a, g), null === c ? u = h : c.sibling = h, c = h);
                return u
            }
            for (h = r(o, h); g < s.length; g++) null !== (m = p(h, o, g, s[g], l)) && (e && null !== m.alternate && h.delete(null === m.key ? g : m.key), a = i(m, a, g), null === c ? u = m : c.sibling = m, c = m);
            return e && h.forEach((function(e) {
                return t(o, e)
            })), u
        }

        function g(o, a, s, l) {
            var u = hc(s);
            if ("function" != typeof u) throw Error(Qu(150));
            if (null == (s = u.call(s))) throw Error(Qu(151));
            for (var c = u = null, h = a, g = a = 0, m = null, v = s.next(); null !== h && !v.done; g++, v = s.next()) {
                h.index > g ? (m = h, h = null) : m = h.sibling;
                var b = f(o, h, v.value, l);
                if (null === b) {
                    null === h && (h = m);
                    break
                }
                e && h && null === b.alternate && t(o, h), a = i(b, a, g), null === c ? u = b : c.sibling = b, c = b, h = m
            }
            if (v.done) return n(o, h), u;
            if (null === h) {
                for (; !v.done; g++, v = s.next()) null !== (v = d(o, v.value, l)) && (a = i(v, a, g), null === c ? u = v : c.sibling = v, c = v);
                return u
            }
            for (h = r(o, h); !v.done; g++, v = s.next()) null !== (v = p(h, o, g, v.value, l)) && (e && null !== v.alternate && h.delete(null === v.key ? g : v.key), a = i(v, a, g), null === c ? u = v : c.sibling = v, c = v);
            return e && h.forEach((function(e) {
                return t(o, e)
            })), u
        }
        return function(e, r, i, s) {
            var l = "object" == typeof i && null !== i && i.type === Mi && null === i.key;
            l && (i = i.props.children);
            var u = "object" == typeof i && null !== i;
            if (u) switch (i.$$typeof) {
                case Ai:
                    e: {
                        for (u = i.key, l = r; null !== l;) {
                            if (l.key === u) {
                                switch (l.tag) {
                                    case 7:
                                        if (i.type === Mi) {
                                            n(e, l.sibling), (r = o(l, i.props.children)).return = e, e = r;
                                            break e
                                        }
                                        break;
                                    default:
                                        if (l.elementType === i.type) {
                                            n(e, l.sibling), (r = o(l, i.props)).ref = Qf(e, l, i), r.return = e, e = r;
                                            break e
                                        }
                                }
                                n(e, l);
                                break
                            }
                            t(e, l), l = l.sibling
                        }
                        i.type === Mi ? ((r = Kh(i.props.children, e.mode, s, i.key)).return = e, e = r) : ((s = Qh(i.type, i.key, i.props, null, e.mode, s)).ref = Qf(e, r, i), s.return = e, e = s)
                    }
                    return a(e);
                case Oi:
                    e: {
                        for (l = i.key; null !== r;) {
                            if (r.key === l) {
                                if (4 === r.tag && r.stateNode.containerInfo === i.containerInfo && r.stateNode.implementation === i.implementation) {
                                    n(e, r.sibling), (r = o(r, i.children || [])).return = e, e = r;
                                    break e
                                }
                                n(e, r);
                                break
                            }
                            t(e, r), r = r.sibling
                        }(r = Zh(i, e.mode, s)).return = e,
                        e = r
                    }
                    return a(e)
            }
            if ("string" == typeof i || "number" == typeof i) return i = "" + i, null !== r && 6 === r.tag ? (n(e, r.sibling), (r = o(r, i)).return = e, e = r) : (n(e, r), (r = Xh(i, e.mode, s)).return = e, e = r), a(e);
            if (_l(i)) return h(e, r, i, s);
            if (hc(i)) return g(e, r, i, s);
            if (u && Kf(e, i), void 0 === i && !l) switch (e.tag) {
                case 1:
                case 0:
                    throw e = e.type, Error(Qu(152, e.displayName || e.name || "Component"))
            }
            return n(e, r)
        }
    }

    function Zf(e) {
        if (e === Pl) throw Error(Qu(174));
        return e
    }

    function ep(e, t) {
        switch (mf(El, t), mf(Dl, e), mf(kl, Pl), e = t.nodeType) {
            case 9:
            case 11:
                t = (t = t.documentElement) ? t.namespaceURI : Mc(null, "");
                break;
            default:
                t = Mc(t = (e = 8 === e ? t.parentNode : t).namespaceURI || null, e = e.tagName)
        }
        gf(kl), mf(kl, t)
    }

    function tp() {
        gf(kl), gf(Dl), gf(El)
    }

    function np(e) {
        Zf(El.current);
        var t = Zf(kl.current),
            n = Mc(t, e.type);
        t !== n && (mf(Dl, e), mf(kl, n))
    }

    function rp(e) {
        Dl.current === e && (gf(kl), gf(Dl))
    }

    function op(e) {
        for (var t = e; null !== t;) {
            if (13 === t.tag) {
                var n = t.memoizedState;
                if (null !== n && (null === (n = n.dehydrated) || n.data === Ra || n.data === Na)) return t
            } else if (19 === t.tag && void 0 !== t.memoizedProps.revealOrder) {
                if (0 != (64 & t.effectTag)) return t
            } else if (null !== t.child) {
                t.child.return = t, t = t.child;
                continue
            }
            if (t === e) break;
            for (; null === t.sibling;) {
                if (null === t.return || t.return === e) return null;
                t = t.return
            }
            t.sibling.return = t.return, t = t.sibling
        }
        return null
    }

    function ip(e, t) {
        return {
            responder: e,
            props: t
        }
    }

    function ap() {
        throw Error(Qu(321))
    }

    function sp(e, t) {
        if (null === t) return !1;
        for (var n = 0; n < t.length && n < e.length; n++)
            if (!Ss(e[n], t[n])) return !1;
        return !0
    }

    function lp(e, t, n, r, o, i) {
        if (Fl = i, Al = t, t.memoizedState = null, t.updateQueue = null, t.expirationTime = 0, Tl.current = null === e || null === e.memoizedState ? Ul : Bl, e = n(r, o), t.expirationTime === Fl) {
            i = 0;
            do {
                if (t.expirationTime = 0, !(25 > i)) throw Error(Qu(301));
                i += 1, Ml = Ol = null, t.updateQueue = null, Tl.current = Ll, e = n(r, o)
            } while (t.expirationTime === Fl)
        }
        if (Tl.current = Nl, t = null !== Ol && null !== Ol.next, Fl = 0, Ml = Ol = Al = null, Rl = !1, t) throw Error(Qu(300));
        return e
    }

    function up() {
        var e = {
            memoizedState: null,
            baseState: null,
            baseQueue: null,
            queue: null,
            next: null
        };
        return null === Ml ? Al.memoizedState = Ml = e : Ml = Ml.next = e, Ml
    }

    function cp() {
        if (null === Ol) {
            var e = Al.alternate;
            e = null !== e ? e.memoizedState : null
        } else e = Ol.next;
        var t = null === Ml ? Al.memoizedState : Ml.next;
        if (null !== t) Ml = t, Ol = e;
        else {
            if (null === e) throw Error(Qu(310));
            e = {
                memoizedState: (Ol = e).memoizedState,
                baseState: Ol.baseState,
                baseQueue: Ol.baseQueue,
                queue: Ol.queue,
                next: null
            }, null === Ml ? Al.memoizedState = Ml = e : Ml = Ml.next = e
        }
        return Ml
    }

    function dp(e, t) {
        return "function" == typeof t ? t(e) : t
    }

    function fp(e) {
        var t = cp(),
            n = t.queue;
        if (null === n) throw Error(Qu(311));
        n.lastRenderedReducer = e;
        var r = Ol,
            o = r.baseQueue,
            i = n.pending;
        if (null !== i) {
            if (null !== o) {
                var a = o.next;
                o.next = i.next, i.next = a
            }
            r.baseQueue = o = i, n.pending = null
        }
        if (null !== o) {
            o = o.next, r = r.baseState;
            var s = a = i = null,
                l = o;
            do {
                var u = l.expirationTime;
                if (u < Fl) {
                    var c = {
                        expirationTime: l.expirationTime,
                        suspenseConfig: l.suspenseConfig,
                        action: l.action,
                        eagerReducer: l.eagerReducer,
                        eagerState: l.eagerState,
                        next: null
                    };
                    null === s ? (a = s = c, i = r) : s = s.next = c, u > Al.expirationTime && (Al.expirationTime = u, Fh(u))
                } else null !== s && (s = s.next = {
                    expirationTime: 1073741823,
                    suspenseConfig: l.suspenseConfig,
                    action: l.action,
                    eagerReducer: l.eagerReducer,
                    eagerState: l.eagerState,
                    next: null
                }), Ch(u, l.suspenseConfig), r = l.eagerReducer === e ? l.eagerState : e(r, l.action);
                l = l.next
            } while (null !== l && l !== o);
            null === s ? i = r : s.next = a, Ss(r, t.memoizedState) || (zl = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = s, n.lastRenderedState = r
        }
        return [t.memoizedState, n.dispatch]
    }

    function pp(e) {
        var t = cp(),
            n = t.queue;
        if (null === n) throw Error(Qu(311));
        n.lastRenderedReducer = e;
        var r = n.dispatch,
            o = n.pending,
            i = t.memoizedState;
        if (null !== o) {
            n.pending = null;
            var a = o = o.next;
            do {
                i = e(i, a.action), a = a.next
            } while (a !== o);
            Ss(i, t.memoizedState) || (zl = !0), t.memoizedState = i, null === t.baseQueue && (t.baseState = i), n.lastRenderedState = i
        }
        return [i, r]
    }

    function hp(e) {
        var t = up();
        return "function" == typeof e && (e = e()), t.memoizedState = t.baseState = e, e = (e = t.queue = {
            pending: null,
            dispatch: null,
            lastRenderedReducer: dp,
            lastRenderedState: e
        }).dispatch = Tp.bind(null, Al, e), [t.memoizedState, e]
    }

    function gp(e, t, n, r) {
        return e = {
            tag: e,
            create: t,
            destroy: n,
            deps: r,
            next: null
        }, null === (t = Al.updateQueue) ? (t = {
            lastEffect: null
        }, Al.updateQueue = t, t.lastEffect = e.next = e) : null === (n = t.lastEffect) ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e
    }

    function mp() {
        return cp().memoizedState
    }

    function vp(e, t, n, r) {
        var o = up();
        Al.effectTag |= e, o.memoizedState = gp(1 | t, n, void 0, void 0 === r ? null : r)
    }

    function bp(e, t, n, r) {
        var o = cp();
        r = void 0 === r ? null : r;
        var i = void 0;
        if (null !== Ol) {
            var a = Ol.memoizedState;
            if (i = a.destroy, null !== r && sp(r, a.deps)) return void gp(t, n, i, r)
        }
        Al.effectTag |= e, o.memoizedState = gp(1 | t, n, i, r)
    }

    function yp(e, t) {
        return vp(516, 4, e, t)
    }

    function wp(e, t) {
        return bp(516, 4, e, t)
    }

    function _p(e, t) {
        return bp(4, 2, e, t)
    }

    function Sp(e, t) {
        return "function" == typeof t ? (e = e(), t(e), function() {
            t(null)
        }) : null != t ? (e = e(), t.current = e, function() {
            t.current = null
        }) : void 0
    }

    function xp(e, t, n) {
        return n = null != n ? n.concat([e]) : null, bp(4, 2, Sp.bind(null, t, e), n)
    }

    function Pp() {}

    function kp(e, t) {
        return up().memoizedState = [e, void 0 === t ? null : t], e
    }

    function Dp(e, t) {
        var n = cp();
        t = void 0 === t ? null : t;
        var r = n.memoizedState;
        return null !== r && null !== t && sp(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e)
    }

    function Ep(e, t) {
        var n = cp();
        t = void 0 === t ? null : t;
        var r = n.memoizedState;
        return null !== r && null !== t && sp(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e)
    }

    function Ip(e, t, n) {
        var r = Pf();
        Df(98 > r ? 98 : r, (function() {
            e(!0)
        })), Df(97 < r ? 97 : r, (function() {
            var r = Cl.suspense;
            Cl.suspense = void 0 === t ? null : t;
            try {
                e(!1), n()
            } finally {
                Cl.suspense = r
            }
        }))
    }

    function Tp(e, t, n) {
        var r = vh(),
            o = bl.suspense;
        o = {
            expirationTime: r = bh(r, e, o),
            suspenseConfig: o,
            action: n,
            eagerReducer: null,
            eagerState: null,
            next: null
        };
        var i = t.pending;
        if (null === i ? o.next = o : (o.next = i.next, i.next = o), t.pending = o, i = e.alternate, e === Al || null !== i && i === Al) Rl = !0, o.expirationTime = Fl, Al.expirationTime = Fl;
        else {
            if (0 === e.expirationTime && (null === i || 0 === i.expirationTime) && null !== (i = t.lastRenderedReducer)) try {
                var a = t.lastRenderedState,
                    s = i(a, n);
                if (o.eagerReducer = i, o.eagerState = s, Ss(s, a)) return
            } catch (e) {}
            yh(e, r)
        }
    }

    function Cp(e, t) {
        var n = Wh(5, null, null, 0);
        n.elementType = "DELETED", n.type = "DELETED", n.stateNode = t, n.return = e, n.effectTag = 8, null !== e.lastEffect ? (e.lastEffect.nextEffect = n, e.lastEffect = n) : e.firstEffect = e.lastEffect = n
    }

    function Fp(e, t) {
        switch (e.tag) {
            case 5:
                var n = e.type;
                return null !== (t = 1 !== t.nodeType || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t) && (e.stateNode = t, !0);
            case 6:
                return null !== (t = "" === e.pendingProps || 3 !== t.nodeType ? null : t) && (e.stateNode = t, !0);
            case 13:
            default:
                return !1
        }
    }

    function Ap(e) {
        if (Hl) {
            var t = Vl;
            if (t) {
                var n = t;
                if (!Fp(e, t)) {
                    if (!(t = Td(n.nextSibling)) || !Fp(e, t)) return e.effectTag = -1025 & e.effectTag | 2, Hl = !1, void(jl = e);
                    Cp(jl, n)
                }
                jl = e, Vl = Td(t.firstChild)
            } else e.effectTag = -1025 & e.effectTag | 2, Hl = !1, jl = e
        }
    }

    function Op(e) {
        for (e = e.return; null !== e && 5 !== e.tag && 3 !== e.tag && 13 !== e.tag;) e = e.return;
        jl = e
    }

    function Mp(e) {
        if (e !== jl) return !1;
        if (!Hl) return Op(e), Hl = !0, !1;
        var t = e.type;
        if (5 !== e.tag || "head" !== t && "body" !== t && !Id(t, e.memoizedProps))
            for (t = Vl; t;) Cp(e, t), t = Td(t.nextSibling);
        if (Op(e), 13 === e.tag) {
            if (!(e = null !== (e = e.memoizedState) ? e.dehydrated : null)) throw Error(Qu(317));
            e: {
                for (e = e.nextSibling, t = 0; e;) {
                    if (8 === e.nodeType) {
                        var n = e.data;
                        if (n === Ma) {
                            if (0 === t) {
                                Vl = Td(e.nextSibling);
                                break e
                            }
                            t--
                        } else n !== Oa && n !== Na && n !== Ra || t++
                    }
                    e = e.nextSibling
                }
                Vl = null
            }
        } else Vl = jl ? Td(e.stateNode.nextSibling) : null;
        return !0
    }

    function Rp() {
        Vl = jl = null, Hl = !1
    }

    function Np(e, t, n, r) {
        t.child = null === e ? xl(t, null, n, r) : Sl(t, e.child, n, r)
    }

    function Up(e, t, n, r, o) {
        n = n.render;
        var i = t.ref;
        return Nf(t, o), r = lp(e, t, n, r, i, o), null === e || zl ? (t.effectTag |= 1, Np(e, t, r, o), t.child) : (t.updateQueue = e.updateQueue, t.effectTag &= -517, e.expirationTime <= o && (e.expirationTime = 0), Jp(e, t, o))
    }

    function Bp(e, t, n, r, o, i) {
        if (null === e) {
            var a = n.type;
            return "function" != typeof a || Yh(a) || void 0 !== a.defaultProps || null !== n.compare || void 0 !== n.defaultProps ? ((e = Qh(n.type, null, r, null, t.mode, i)).ref = t.ref, e.return = t, t.child = e) : (t.tag = 15, t.type = a, Lp(e, t, a, r, o, i))
        }
        return a = e.child, o < i && (o = a.memoizedProps, (n = null !== (n = n.compare) ? n : ff)(o, r) && e.ref === t.ref) ? Jp(e, t, i) : (t.effectTag |= 1, (e = Jh(a, r)).ref = t.ref, e.return = t, t.child = e)
    }

    function Lp(e, t, n, r, o, i) {
        return null !== e && ff(e.memoizedProps, r) && e.ref === t.ref && (zl = !1, o < i) ? (t.expirationTime = e.expirationTime, Jp(e, t, i)) : Vp(e, t, n, r, i)
    }

    function jp(e, t) {
        var n = t.ref;
        (null === e && null !== n || null !== e && e.ref !== n) && (t.effectTag |= 128)
    }

    function Vp(e, t, n, r, o) {
        var i = bf(n) ? Ws : Gs.current;
        return i = vf(t, i), Nf(t, o), n = lp(e, t, n, r, i, o), null === e || zl ? (t.effectTag |= 1, Np(e, t, n, o), t.child) : (t.updateQueue = e.updateQueue, t.effectTag &= -517, e.expirationTime <= o && (e.expirationTime = 0), Jp(e, t, o))
    }

    function Hp(e, t, n, r, o) {
        if (bf(n)) {
            var i = !0;
            Sf(t)
        } else i = !1;
        if (Nf(t, o), null === t.stateNode) null !== e && (e.alternate = null, t.alternate = null, t.effectTag |= 2), Wf(t, n, r), Jf(t, n, r, o), r = !0;
        else if (null === e) {
            var a = t.stateNode,
                s = t.memoizedProps;
            a.props = s;
            var l = a.context,
                u = n.contextType;
            "object" == typeof u && null !== u ? u = Uf(u) : u = vf(t, u = bf(n) ? Ws : Gs.current);
            var c = n.getDerivedStateFromProps,
                d = "function" == typeof c || "function" == typeof a.getSnapshotBeforeUpdate;
            d || "function" != typeof a.UNSAFE_componentWillReceiveProps && "function" != typeof a.componentWillReceiveProps || (s !== r || l !== u) && Yf(t, a, r, u), vl = !1;
            var f = t.memoizedState;
            a.state = f, qf(t, r, a, o), l = t.memoizedState, s !== r || f !== l || $s.current || vl ? ("function" == typeof c && (Gf(t, n, c, r), l = t.memoizedState), (s = vl || $f(t, n, s, r, f, l, u)) ? (d || "function" != typeof a.UNSAFE_componentWillMount && "function" != typeof a.componentWillMount || ("function" == typeof a.componentWillMount && a.componentWillMount(), "function" == typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount()), "function" == typeof a.componentDidMount && (t.effectTag |= 4)) : ("function" == typeof a.componentDidMount && (t.effectTag |= 4), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = u, r = s) : ("function" == typeof a.componentDidMount && (t.effectTag |= 4), r = !1)
        } else a = t.stateNode, Lf(e, t), s = t.memoizedProps, a.props = t.type === t.elementType ? s : Af(t.type, s), l = a.context, "object" == typeof(u = n.contextType) && null !== u ? u = Uf(u) : u = vf(t, u = bf(n) ? Ws : Gs.current), (d = "function" == typeof(c = n.getDerivedStateFromProps) || "function" == typeof a.getSnapshotBeforeUpdate) || "function" != typeof a.UNSAFE_componentWillReceiveProps && "function" != typeof a.componentWillReceiveProps || (s !== r || l !== u) && Yf(t, a, r, u), vl = !1, l = t.memoizedState, a.state = l, qf(t, r, a, o), f = t.memoizedState, s !== r || l !== f || $s.current || vl ? ("function" == typeof c && (Gf(t, n, c, r), f = t.memoizedState), (c = vl || $f(t, n, s, r, l, f, u)) ? (d || "function" != typeof a.UNSAFE_componentWillUpdate && "function" != typeof a.componentWillUpdate || ("function" == typeof a.componentWillUpdate && a.componentWillUpdate(r, f, u), "function" == typeof a.UNSAFE_componentWillUpdate && a.UNSAFE_componentWillUpdate(r, f, u)), "function" == typeof a.componentDidUpdate && (t.effectTag |= 4), "function" == typeof a.getSnapshotBeforeUpdate && (t.effectTag |= 256)) : ("function" != typeof a.componentDidUpdate || s === e.memoizedProps && l === e.memoizedState || (t.effectTag |= 4), "function" != typeof a.getSnapshotBeforeUpdate || s === e.memoizedProps && l === e.memoizedState || (t.effectTag |= 256), t.memoizedProps = r, t.memoizedState = f), a.props = r, a.state = f, a.context = u, r = c) : ("function" != typeof a.componentDidUpdate || s === e.memoizedProps && l === e.memoizedState || (t.effectTag |= 4), "function" != typeof a.getSnapshotBeforeUpdate || s === e.memoizedProps && l === e.memoizedState || (t.effectTag |= 256), r = !1);
        return qp(e, t, n, r, i, o)
    }

    function qp(e, t, n, r, o, i) {
        jp(e, t);
        var a = 0 != (64 & t.effectTag);
        if (!r && !a) return o && xf(t, n, !1), Jp(e, t, i);
        r = t.stateNode, ql.current = t;
        var s = a && "function" != typeof n.getDerivedStateFromError ? null : r.render();
        return t.effectTag |= 1, null !== e && a ? (t.child = Sl(t, e.child, null, i), t.child = Sl(t, null, s, i)) : Np(e, t, s, i), t.memoizedState = r.state, o && xf(t, n, !0), t.child
    }

    function zp(e) {
        var t = e.stateNode;
        t.pendingContext ? wf(0, t.pendingContext, t.pendingContext !== t.context) : t.context && wf(0, t.context, !1), ep(e, t.containerInfo)
    }

    function Gp(e, t, n) {
        var r, o = t.mode,
            i = t.pendingProps,
            a = Il.current,
            s = !1;
        if ((r = 0 != (64 & t.effectTag)) || (r = 0 != (2 & a) && (null === e || null !== e.memoizedState)), r ? (s = !0, t.effectTag &= -65) : null !== e && null === e.memoizedState || void 0 === i.fallback || !0 === i.unstable_avoidThisFallback || (a |= 1), mf(Il, 1 & a), null === e) {
            if (void 0 !== i.fallback && Ap(t), s) {
                if (s = i.fallback, (i = Kh(null, o, 0, null)).return = t, 0 == (2 & t.mode))
                    for (e = null !== t.memoizedState ? t.child.child : t.child, i.child = e; null !== e;) e.return = i, e = e.sibling;
                return (n = Kh(s, o, n, null)).return = t, i.sibling = n, t.memoizedState = Gl, t.child = i, n
            }
            return o = i.children, t.memoizedState = null, t.child = xl(t, null, o, n)
        }
        if (null !== e.memoizedState) {
            if (o = (e = e.child).sibling, s) {
                if (i = i.fallback, (n = Jh(e, e.pendingProps)).return = t, 0 == (2 & t.mode) && (s = null !== t.memoizedState ? t.child.child : t.child) !== e.child)
                    for (n.child = s; null !== s;) s.return = n, s = s.sibling;
                return (o = Jh(o, i)).return = t, n.sibling = o, n.childExpirationTime = 0, t.memoizedState = Gl, t.child = n, o
            }
            return n = Sl(t, e.child, i.children, n), t.memoizedState = null, t.child = n
        }
        if (e = e.child, s) {
            if (s = i.fallback, (i = Kh(null, o, 0, null)).return = t, i.child = e, null !== e && (e.return = i), 0 == (2 & t.mode))
                for (e = null !== t.memoizedState ? t.child.child : t.child, i.child = e; null !== e;) e.return = i, e = e.sibling;
            return (n = Kh(s, o, n, null)).return = t, i.sibling = n, n.effectTag |= 2, i.childExpirationTime = 0, t.memoizedState = Gl, t.child = i, n
        }
        return t.memoizedState = null, t.child = Sl(t, e, i.children, n)
    }

    function $p(e, t) {
        e.expirationTime < t && (e.expirationTime = t);
        var n = e.alternate;
        null !== n && n.expirationTime < t && (n.expirationTime = t), Rf(e.return, t)
    }

    function Wp(e, t, n, r, o, i) {
        var a = e.memoizedState;
        null === a ? e.memoizedState = {
            isBackwards: t,
            rendering: null,
            renderingStartTime: 0,
            last: r,
            tail: n,
            tailExpiration: 0,
            tailMode: o,
            lastEffect: i
        } : (a.isBackwards = t, a.rendering = null, a.renderingStartTime = 0, a.last = r, a.tail = n, a.tailExpiration = 0, a.tailMode = o, a.lastEffect = i)
    }

    function Yp(e, t, n) {
        var r = t.pendingProps,
            o = r.revealOrder,
            i = r.tail;
        if (Np(e, t, r.children, n), 0 != (2 & (r = Il.current))) r = 1 & r | 2, t.effectTag |= 64;
        else {
            if (null !== e && 0 != (64 & e.effectTag)) e: for (e = t.child; null !== e;) {
                if (13 === e.tag) null !== e.memoizedState && $p(e, n);
                else if (19 === e.tag) $p(e, n);
                else if (null !== e.child) {
                    e.child.return = e, e = e.child;
                    continue
                }
                if (e === t) break e;
                for (; null === e.sibling;) {
                    if (null === e.return || e.return === t) break e;
                    e = e.return
                }
                e.sibling.return = e.return, e = e.sibling
            }
            r &= 1
        }
        if (mf(Il, r), 0 == (2 & t.mode)) t.memoizedState = null;
        else switch (o) {
            case "forwards":
                for (n = t.child, o = null; null !== n;) null !== (e = n.alternate) && null === op(e) && (o = n), n = n.sibling;
                null === (n = o) ? (o = t.child, t.child = null) : (o = n.sibling, n.sibling = null), Wp(t, !1, o, n, i, t.lastEffect);
                break;
            case "backwards":
                for (n = null, o = t.child, t.child = null; null !== o;) {
                    if (null !== (e = o.alternate) && null === op(e)) {
                        t.child = o;
                        break
                    }
                    e = o.sibling, o.sibling = n, n = o, o = e
                }
                Wp(t, !0, n, null, i, t.lastEffect);
                break;
            case "together":
                Wp(t, !1, null, null, void 0, t.lastEffect);
                break;
            default:
                t.memoizedState = null
        }
        return t.child
    }

    function Jp(e, t, n) {
        null !== e && (t.dependencies = e.dependencies);
        var r = t.expirationTime;
        if (0 !== r && Fh(r), t.childExpirationTime < n) return null;
        if (null !== e && t.child !== e.child) throw Error(Qu(153));
        if (null !== t.child) {
            for (n = Jh(e = t.child, e.pendingProps), t.child = n, n.return = t; null !== e.sibling;) e = e.sibling, (n = n.sibling = Jh(e, e.pendingProps)).return = t;
            n.sibling = null
        }
        return t.child
    }

    function Qp(e, t) {
        switch (e.tailMode) {
            case "hidden":
                t = e.tail;
                for (var n = null; null !== t;) null !== t.alternate && (n = t), t = t.sibling;
                null === n ? e.tail = null : n.sibling = null;
                break;
            case "collapsed":
                n = e.tail;
                for (var r = null; null !== n;) null !== n.alternate && (r = n), n = n.sibling;
                null === r ? t || null === e.tail ? e.tail = null : e.tail.sibling = null : r.sibling = null
        }
    }

    function Kp(e, t, n) {
        var r = t.pendingProps;
        switch (t.tag) {
            case 2:
            case 16:
            case 15:
            case 0:
            case 11:
            case 7:
            case 8:
            case 12:
            case 9:
            case 14:
                return null;
            case 1:
                return bf(t.type) && yf(), null;
            case 3:
                return tp(), gf($s), gf(Gs), (n = t.stateNode).pendingContext && (n.context = n.pendingContext, n.pendingContext = null), null !== e && null !== e.child || !Mp(t) || (t.effectTag |= 4), Wl(t), null;
            case 5:
                rp(t), n = Zf(El.current);
                var o = t.type;
                if (null !== e && null != t.stateNode) Yl(e, t, o, r, n), e.ref !== t.ref && (t.effectTag |= 128);
                else {
                    if (!r) {
                        if (null === t.stateNode) throw Error(Qu(166));
                        return null
                    }
                    if (e = Zf(kl.current), Mp(t)) {
                        r = t.stateNode, o = t.type;
                        var i = t.memoizedProps;
                        switch (r[Ha] = t, r[qa] = i, o) {
                            case "iframe":
                            case "object":
                            case "embed":
                                ud("load", r);
                                break;
                            case "video":
                            case "audio":
                                for (e = 0; e < ra.length; e++) ud(ra[e], r);
                                break;
                            case "source":
                                ud("error", r);
                                break;
                            case "img":
                            case "image":
                            case "link":
                                ud("error", r), ud("load", r);
                                break;
                            case "form":
                                ud("reset", r), ud("submit", r);
                                break;
                            case "details":
                                ud("toggle", r);
                                break;
                            case "input":
                                Sc(r, i), ud("invalid", r), yd(n, "onChange");
                                break;
                            case "select":
                                r._wrapperState = {
                                    wasMultiple: !!i.multiple
                                }, ud("invalid", r), yd(n, "onChange");
                                break;
                            case "textarea":
                                Cc(r, i), ud("invalid", r), yd(n, "onChange")
                        }
                        for (var a in vd(o, i), e = null, i)
                            if (i.hasOwnProperty(a)) {
                                var s = i[a];
                                "children" === a ? "string" == typeof s ? r.textContent !== s && (e = ["children", s]) : "number" == typeof s && r.textContent !== "" + s && (e = ["children", "" + s]) : hi.hasOwnProperty(a) && null != s && yd(n, a)
                            } switch (o) {
                            case "input":
                                yc(r), kc(r, i, !0);
                                break;
                            case "textarea":
                                yc(r), Ac(r);
                                break;
                            case "select":
                            case "option":
                                break;
                            default:
                                "function" == typeof i.onClick && (r.onclick = wd)
                        }
                        n = e, t.updateQueue = n, null !== n && (t.effectTag |= 4)
                    } else {
                        switch (a = 9 === n.nodeType ? n : n.ownerDocument, e === Aa && (e = Oc(o)), e === Aa ? "script" === o ? ((e = a.createElement("div")).innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : "string" == typeof r.is ? e = a.createElement(o, {
                                is: r.is
                            }) : (e = a.createElement(o), "select" === o && (a = e, r.multiple ? a.multiple = !0 : r.size && (a.size = r.size))) : e = a.createElementNS(e, o), e[Ha] = t, e[qa] = r, $l(e, t, !1, !1), t.stateNode = e, a = bd(o, r), o) {
                            case "iframe":
                            case "object":
                            case "embed":
                                ud("load", e), s = r;
                                break;
                            case "video":
                            case "audio":
                                for (s = 0; s < ra.length; s++) ud(ra[s], e);
                                s = r;
                                break;
                            case "source":
                                ud("error", e), s = r;
                                break;
                            case "img":
                            case "image":
                            case "link":
                                ud("error", e), ud("load", e), s = r;
                                break;
                            case "form":
                                ud("reset", e), ud("submit", e), s = r;
                                break;
                            case "details":
                                ud("toggle", e), s = r;
                                break;
                            case "input":
                                Sc(e, r), s = _c(e, r), ud("invalid", e), yd(n, "onChange");
                                break;
                            case "option":
                                s = Ec(e, r);
                                break;
                            case "select":
                                e._wrapperState = {
                                    wasMultiple: !!r.multiple
                                }, s = ti({}, r, {
                                    value: void 0
                                }), ud("invalid", e), yd(n, "onChange");
                                break;
                            case "textarea":
                                Cc(e, r), s = Tc(e, r), ud("invalid", e), yd(n, "onChange");
                                break;
                            default:
                                s = r
                        }
                        vd(o, s);
                        var l = s;
                        for (i in l)
                            if (l.hasOwnProperty(i)) {
                                var u = l[i];
                                "style" === i ? md(e, u) : "dangerouslySetInnerHTML" === i ? null != (u = u ? u.__html : void 0) && Ji(e, u) : "children" === i ? "string" == typeof u ? ("textarea" !== o || "" !== u) && Rc(e, u) : "number" == typeof u && Rc(e, "" + u) : "suppressContentEditableWarning" !== i && "suppressHydrationWarning" !== i && "autoFocus" !== i && (hi.hasOwnProperty(i) ? null != u && yd(n, i) : null != u && pc(e, i, u, a))
                            } switch (o) {
                            case "input":
                                yc(e), kc(e, r, !1);
                                break;
                            case "textarea":
                                yc(e), Ac(e);
                                break;
                            case "option":
                                null != r.value && e.setAttribute("value", "" + vc(r.value));
                                break;
                            case "select":
                                e.multiple = !!r.multiple, null != (n = r.value) ? Ic(e, !!r.multiple, n, !1) : null != r.defaultValue && Ic(e, !!r.multiple, r.defaultValue, !0);
                                break;
                            default:
                                "function" == typeof s.onClick && (e.onclick = wd)
                        }
                        Ed(o, r) && (t.effectTag |= 4)
                    }
                    null !== t.ref && (t.effectTag |= 128)
                }
                return null;
            case 6:
                if (e && null != t.stateNode) Jl(e, t, e.memoizedProps, r);
                else {
                    if ("string" != typeof r && null === t.stateNode) throw Error(Qu(166));
                    n = Zf(El.current), Zf(kl.current), Mp(t) ? (n = t.stateNode, r = t.memoizedProps, n[Ha] = t, n.nodeValue !== r && (t.effectTag |= 4)) : ((n = (9 === n.nodeType ? n : n.ownerDocument).createTextNode(r))[Ha] = t, t.stateNode = n)
                }
                return null;
            case 13:
                return gf(Il), r = t.memoizedState, 0 != (64 & t.effectTag) ? (t.expirationTime = n, t) : (n = null !== r, r = !1, null === e ? void 0 !== t.memoizedProps.fallback && Mp(t) : (r = null !== (o = e.memoizedState), n || null === o || null !== (o = e.child.sibling) && (null !== (i = t.firstEffect) ? (t.firstEffect = o, o.nextEffect = i) : (t.firstEffect = t.lastEffect = o, o.nextEffect = null), o.effectTag = 8)), n && !r && 0 != (2 & t.mode) && (null === e && !0 !== t.memoizedProps.unstable_avoidThisFallback || 0 != (1 & Il.current) ? gu === iu && (gu = lu) : (gu !== iu && gu !== lu || (gu = uu), 0 !== wu && null !== fu && (ng(fu, hu), rg(fu, wu)))), (n || r) && (t.effectTag |= 4), null);
            case 4:
                return tp(), Wl(t), null;
            case 10:
                return Mf(t), null;
            case 17:
                return bf(t.type) && yf(), null;
            case 19:
                if (gf(Il), null === (r = t.memoizedState)) return null;
                if (o = 0 != (64 & t.effectTag), null === (i = r.rendering)) {
                    if (o) Qp(r, !1);
                    else if (gu !== iu || null !== e && 0 != (64 & e.effectTag))
                        for (i = t.child; null !== i;) {
                            if (null !== (e = op(i))) {
                                for (t.effectTag |= 64, Qp(r, !1), null !== (o = e.updateQueue) && (t.updateQueue = o, t.effectTag |= 4), null === r.lastEffect && (t.firstEffect = null), t.lastEffect = r.lastEffect, r = t.child; null !== r;) i = n, (o = r).effectTag &= 2, o.nextEffect = null, o.firstEffect = null, o.lastEffect = null, null === (e = o.alternate) ? (o.childExpirationTime = 0, o.expirationTime = i, o.child = null, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null) : (o.childExpirationTime = e.childExpirationTime, o.expirationTime = e.expirationTime, o.child = e.child, o.memoizedProps = e.memoizedProps, o.memoizedState = e.memoizedState, o.updateQueue = e.updateQueue, i = e.dependencies, o.dependencies = null === i ? null : {
                                    expirationTime: i.expirationTime,
                                    firstContext: i.firstContext,
                                    responders: i.responders
                                }), r = r.sibling;
                                return mf(Il, 1 & Il.current | 2), t.child
                            }
                            i = i.sibling
                        }
                } else {
                    if (!o)
                        if (null !== (e = op(i))) {
                            if (t.effectTag |= 64, o = !0, null !== (n = e.updateQueue) && (t.updateQueue = n, t.effectTag |= 4), Qp(r, !0), null === r.tail && "hidden" === r.tailMode && !i.alternate) return null !== (t = t.lastEffect = r.lastEffect) && (t.nextEffect = null), null
                        } else 2 * fl() - r.renderingStartTime > r.tailExpiration && 1 < n && (t.effectTag |= 64, o = !0, Qp(r, !1), t.expirationTime = t.childExpirationTime = n - 1);
                    r.isBackwards ? (i.sibling = t.child, t.child = i) : (null !== (n = r.last) ? n.sibling = i : t.child = i, r.last = i)
                }
                return null !== r.tail ? (0 === r.tailExpiration && (r.tailExpiration = fl() + 500), n = r.tail, r.rendering = n, r.tail = n.sibling, r.lastEffect = t.lastEffect, r.renderingStartTime = fl(), n.sibling = null, t = Il.current, mf(Il, o ? 1 & t | 2 : 1 & t), n) : null
        }
        throw Error(Qu(156, t.tag))
    }

    function Xp(e) {
        switch (e.tag) {
            case 1:
                bf(e.type) && yf();
                var t = e.effectTag;
                return 4096 & t ? (e.effectTag = -4097 & t | 64, e) : null;
            case 3:
                if (tp(), gf($s), gf(Gs), 0 != (64 & (t = e.effectTag))) throw Error(Qu(285));
                return e.effectTag = -4097 & t | 64, e;
            case 5:
                return rp(e), null;
            case 13:
                return gf(Il), 4096 & (t = e.effectTag) ? (e.effectTag = -4097 & t | 64, e) : null;
            case 19:
                return gf(Il), null;
            case 4:
                return tp(), null;
            case 10:
                return Mf(e), null;
            default:
                return null
        }
    }

    function Zp(e, t) {
        return {
            value: e,
            source: t,
            stack: mc(t)
        }
    }

    function eh(e, t) {
        var n = t.source,
            r = t.stack;
        null === r && null !== n && (r = mc(n)), null !== n && gc(n.type), t = t.value, null !== e && 1 === e.tag && gc(e.type);
        try {
            console.error(t)
        } catch (e) {
            setTimeout((function() {
                throw e
            }))
        }
    }

    function th(e) {
        var t = e.ref;
        if (null !== t)
            if ("function" == typeof t) try {
                t(null)
            } catch (t) {
                qh(e, t)
            } else t.current = null
    }

    function nh(e, t) {
        switch (t.tag) {
            case 0:
            case 11:
            case 15:
            case 22:
                return;
            case 1:
                if (256 & t.effectTag && null !== e) {
                    var n = e.memoizedProps,
                        r = e.memoizedState;
                    t = (e = t.stateNode).getSnapshotBeforeUpdate(t.elementType === t.type ? n : Af(t.type, n), r), e.__reactInternalSnapshotBeforeUpdate = t
                }
                return;
            case 3:
            case 5:
            case 6:
            case 4:
            case 17:
                return
        }
        throw Error(Qu(163))
    }

    function rh(e, t) {
        if (null !== (t = null !== (t = t.updateQueue) ? t.lastEffect : null)) {
            var n = t = t.next;
            do {
                if ((n.tag & e) === e) {
                    var r = n.destroy;
                    n.destroy = void 0, void 0 !== r && r()
                }
                n = n.next
            } while (n !== t)
        }
    }

    function oh(e, t) {
        if (null !== (t = null !== (t = t.updateQueue) ? t.lastEffect : null)) {
            var n = t = t.next;
            do {
                if ((n.tag & e) === e) {
                    var r = n.create;
                    n.destroy = r()
                }
                n = n.next
            } while (n !== t)
        }
    }

    function ih(e, t, n) {
        switch (n.tag) {
            case 0:
            case 11:
            case 15:
            case 22:
                return void oh(3, n);
            case 1:
                if (e = n.stateNode, 4 & n.effectTag)
                    if (null === t) e.componentDidMount();
                    else {
                        var r = n.elementType === n.type ? t.memoizedProps : Af(n.type, t.memoizedProps);
                        e.componentDidUpdate(r, t.memoizedState, e.__reactInternalSnapshotBeforeUpdate)
                    } return void(null !== (t = n.updateQueue) && zf(n, t, e));
            case 3:
                if (null !== (t = n.updateQueue)) {
                    if (e = null, null !== n.child) switch (n.child.tag) {
                        case 5:
                            e = n.child.stateNode;
                            break;
                        case 1:
                            e = n.child.stateNode
                    }
                    zf(n, t, e)
                }
                return;
            case 5:
                return e = n.stateNode, void(null === t && 4 & n.effectTag && Ed(n.type, n.memoizedProps) && e.focus());
            case 6:
            case 4:
            case 12:
                return;
            case 13:
                return void(null === n.memoizedState && (n = n.alternate, null !== n && (n = n.memoizedState, null !== n && (n = n.dehydrated, null !== n && sd(n)))));
            case 19:
            case 17:
            case 20:
            case 21:
                return
        }
        throw Error(Qu(163))
    }

    function ah(e, t, n) {
        switch ("function" == typeof Uu && Uu(t), t.tag) {
            case 0:
            case 11:
            case 14:
            case 15:
            case 22:
                if (null !== (e = t.updateQueue) && null !== (e = e.lastEffect)) {
                    var r = e.next;
                    Df(97 < n ? 97 : n, (function() {
                        var e = r;
                        do {
                            var n = e.destroy;
                            if (void 0 !== n) {
                                var o = t;
                                try {
                                    n()
                                } catch (e) {
                                    qh(o, e)
                                }
                            }
                            e = e.next
                        } while (e !== r)
                    }))
                }
                break;
            case 1:
                th(t), "function" == typeof(n = t.stateNode).componentWillUnmount && function(e, t) {
                    try {
                        t.props = e.memoizedProps, t.state = e.memoizedState, t.componentWillUnmount()
                    } catch (t) {
                        qh(e, t)
                    }
                }(t, n);
                break;
            case 5:
                th(t);
                break;
            case 4:
                fh(e, t, n)
        }
    }

    function sh(e) {
        var t = e.alternate;
        e.return = null, e.child = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.alternate = null, e.firstEffect = null, e.lastEffect = null, e.pendingProps = null, e.memoizedProps = null, e.stateNode = null, null !== t && sh(t)
    }

    function lh(e) {
        return 5 === e.tag || 3 === e.tag || 4 === e.tag
    }

    function uh(e) {
        e: {
            for (var t = e.return; null !== t;) {
                if (lh(t)) {
                    var n = t;
                    break e
                }
                t = t.return
            }
            throw Error(Qu(160))
        }
        switch (t = n.stateNode, n.tag) {
            case 5:
                var r = !1;
                break;
            case 3:
            case 4:
                t = t.containerInfo, r = !0;
                break;
            default:
                throw Error(Qu(161))
        }
        16 & n.effectTag && (Rc(t, ""), n.effectTag &= -17);e: t: for (n = e;;) {
            for (; null === n.sibling;) {
                if (null === n.return || lh(n.return)) {
                    n = null;
                    break e
                }
                n = n.return
            }
            for (n.sibling.return = n.return, n = n.sibling; 5 !== n.tag && 6 !== n.tag && 18 !== n.tag;) {
                if (2 & n.effectTag) continue t;
                if (null === n.child || 4 === n.tag) continue t;
                n.child.return = n, n = n.child
            }
            if (!(2 & n.effectTag)) {
                n = n.stateNode;
                break e
            }
        }
        r ? ch(e, n, t) : dh(e, n, t)
    }

    function ch(e, t, n) {
        var r = e.tag,
            o = 5 === r || 6 === r;
        if (o) e = o ? e.stateNode : e.stateNode.instance, t ? 8 === n.nodeType ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (8 === n.nodeType ? (t = n.parentNode).insertBefore(e, n) : (t = n).appendChild(e), null != (n = n._reactRootContainer) || null !== t.onclick || (t.onclick = wd));
        else if (4 !== r && null !== (e = e.child))
            for (ch(e, t, n), e = e.sibling; null !== e;) ch(e, t, n), e = e.sibling
    }

    function dh(e, t, n) {
        var r = e.tag,
            o = 5 === r || 6 === r;
        if (o) e = o ? e.stateNode : e.stateNode.instance, t ? n.insertBefore(e, t) : n.appendChild(e);
        else if (4 !== r && null !== (e = e.child))
            for (dh(e, t, n), e = e.sibling; null !== e;) dh(e, t, n), e = e.sibling
    }

    function fh(e, t, n) {
        for (var r, o, i = t, a = !1;;) {
            if (!a) {
                a = i.return;
                e: for (;;) {
                    if (null === a) throw Error(Qu(160));
                    switch (r = a.stateNode, a.tag) {
                        case 5:
                            o = !1;
                            break e;
                        case 3:
                        case 4:
                            r = r.containerInfo, o = !0;
                            break e
                    }
                    a = a.return
                }
                a = !0
            }
            if (5 === i.tag || 6 === i.tag) {
                e: for (var s = e, l = i, u = n, c = l;;)
                    if (ah(s, c, u), null !== c.child && 4 !== c.tag) c.child.return = c, c = c.child;
                    else {
                        if (c === l) break e;
                        for (; null === c.sibling;) {
                            if (null === c.return || c.return === l) break e;
                            c = c.return
                        }
                        c.sibling.return = c.return, c = c.sibling
                    }o ? (s = r, l = i.stateNode, 8 === s.nodeType ? s.parentNode.removeChild(l) : s.removeChild(l)) : r.removeChild(i.stateNode)
            }
            else if (4 === i.tag) {
                if (null !== i.child) {
                    r = i.stateNode.containerInfo, o = !0, i.child.return = i, i = i.child;
                    continue
                }
            } else if (ah(e, i, n), null !== i.child) {
                i.child.return = i, i = i.child;
                continue
            }
            if (i === t) break;
            for (; null === i.sibling;) {
                if (null === i.return || i.return === t) return;
                4 === (i = i.return).tag && (a = !1)
            }
            i.sibling.return = i.return, i = i.sibling
        }
    }

    function ph(e, t) {
        switch (t.tag) {
            case 0:
            case 11:
            case 14:
            case 15:
            case 22:
                return void rh(3, t);
            case 1:
                return;
            case 5:
                var n = t.stateNode;
                if (null != n) {
                    var r = t.memoizedProps,
                        o = null !== e ? e.memoizedProps : r;
                    e = t.type;
                    var i = t.updateQueue;
                    if (t.updateQueue = null, null !== i) {
                        for (n[qa] = r, "input" === e && "radio" === r.type && null != r.name && xc(n, r), bd(e, o), t = bd(e, r), o = 0; o < i.length; o += 2) {
                            var a = i[o],
                                s = i[o + 1];
                            "style" === a ? md(n, s) : "dangerouslySetInnerHTML" === a ? Ji(n, s) : "children" === a ? Rc(n, s) : pc(n, a, s, t)
                        }
                        switch (e) {
                            case "input":
                                Pc(n, r);
                                break;
                            case "textarea":
                                Fc(n, r);
                                break;
                            case "select":
                                t = n._wrapperState.wasMultiple, n._wrapperState.wasMultiple = !!r.multiple, null != (e = r.value) ? Ic(n, !!r.multiple, e, !1) : t !== !!r.multiple && (null != r.defaultValue ? Ic(n, !!r.multiple, r.defaultValue, !0) : Ic(n, !!r.multiple, r.multiple ? [] : "", !1))
                        }
                    }
                }
                return;
            case 6:
                if (null === t.stateNode) throw Error(Qu(162));
                return void(t.stateNode.nodeValue = t.memoizedProps);
            case 3:
                return void((t = t.stateNode).hydrate && (t.hydrate = !1, sd(t.containerInfo)));
            case 12:
                return;
            case 13:
                if (n = t, null === t.memoizedState ? r = !1 : (r = !0, n = t.child, Su = fl()), null !== n) e: for (e = n;;) {
                    if (5 === e.tag) i = e.stateNode, r ? "function" == typeof(i = i.style).setProperty ? i.setProperty("display", "none", "important") : i.display = "none" : (i = e.stateNode, o = null != (o = e.memoizedProps.style) && o.hasOwnProperty("display") ? o.display : null, i.style.display = gd("display", o));
                    else if (6 === e.tag) e.stateNode.nodeValue = r ? "" : e.memoizedProps;
                    else {
                        if (13 === e.tag && null !== e.memoizedState && null === e.memoizedState.dehydrated) {
                            (i = e.child.sibling).return = e, e = i;
                            continue
                        }
                        if (null !== e.child) {
                            e.child.return = e, e = e.child;
                            continue
                        }
                    }
                    if (e === n) break;
                    for (; null === e.sibling;) {
                        if (null === e.return || e.return === n) break e;
                        e = e.return
                    }
                    e.sibling.return = e.return, e = e.sibling
                }
                return void hh(t);
            case 19:
                return void hh(t);
            case 17:
                return
        }
        throw Error(Qu(163))
    }

    function hh(e) {
        var t = e.updateQueue;
        if (null !== t) {
            e.updateQueue = null;
            var n = e.stateNode;
            null === n && (n = e.stateNode = new Ql), t.forEach((function(t) {
                var r = Gh.bind(null, e, t);
                n.has(t) || (n.add(t), t.then(r, r))
            }))
        }
    }

    function gh(e, t, n) {
        (n = jf(n, null)).tag = 3, n.payload = {
            element: null
        };
        var r = t.value;
        return n.callback = function() {
            ku || (ku = !0, Du = r), eh(e, t)
        }, n
    }

    function mh(e, t, n) {
        (n = jf(n, null)).tag = 3;
        var r = e.type.getDerivedStateFromError;
        if ("function" == typeof r) {
            var o = t.value;
            n.payload = function() {
                return eh(e, t), r(o)
            }
        }
        var i = e.stateNode;
        return null !== i && "function" == typeof i.componentDidCatch && (n.callback = function() {
            "function" != typeof r && (null === Eu ? Eu = new Set([this]) : Eu.add(this), eh(e, t));
            var n = t.stack;
            this.componentDidCatch(t.value, {
                componentStack: null !== n ? n : ""
            })
        }), n
    }

    function vh() {
        return (du & (ru | ou)) !== tu ? 1073741821 - (fl() / 10 | 0) : 0 !== Mu ? Mu : Mu = 1073741821 - (fl() / 10 | 0)
    }

    function bh(e, t, n) {
        if (0 == (2 & (t = t.mode))) return 1073741823;
        var r = Pf();
        if (0 == (4 & t)) return 99 === r ? 1073741823 : 1073741822;
        if ((du & ru) !== tu) return hu;
        if (null !== n) e = Ff(e, 0 | n.timeoutMs || 5e3, 250);
        else switch (r) {
            case 99:
                e = 1073741823;
                break;
            case 98:
                e = Ff(e, 150, 100);
                break;
            case 97:
            case 96:
                e = Ff(e, 5e3, 250);
                break;
            case 95:
                e = 2;
                break;
            default:
                throw Error(Qu(326))
        }
        return null !== fu && e === hu && --e, e
    }

    function yh(e, t) {
        if (50 < Au) throw Au = 0, Ou = null, Error(Qu(185));
        if (null !== (e = wh(e, t))) {
            var n = Pf();
            1073741823 === t ? (du & nu) !== tu && (du & (ru | ou)) === tu ? Ph(e) : (Sh(e), du === tu && Tf()) : Sh(e), (4 & du) === tu || 98 !== n && 99 !== n || (null === Fu ? Fu = new Map([
                [e, t]
            ]) : (void 0 === (n = Fu.get(e)) || n > t) && Fu.set(e, t))
        }
    }

    function wh(e, t) {
        e.expirationTime < t && (e.expirationTime = t);
        var n = e.alternate;
        null !== n && n.expirationTime < t && (n.expirationTime = t);
        var r = e.return,
            o = null;
        if (null === r && 3 === e.tag) o = e.stateNode;
        else
            for (; null !== r;) {
                if (n = r.alternate, r.childExpirationTime < t && (r.childExpirationTime = t), null !== n && n.childExpirationTime < t && (n.childExpirationTime = t), null === r.return && 3 === r.tag) {
                    o = r.stateNode;
                    break
                }
                r = r.return
            }
        return null !== o && (fu === o && (Fh(t), gu === uu && ng(o, hu)), rg(o, t)), o
    }

    function _h(e) {
        var t = e.lastExpiredTime;
        if (0 !== t) return t;
        if (!tg(e, t = e.firstPendingTime)) return t;
        var n = e.lastPingedTime;
        return 2 >= (e = n > (e = e.nextKnownPendingLevel) ? n : e) && t !== e ? 0 : e
    }

    function Sh(e) {
        if (0 !== e.lastExpiredTime) e.callbackExpirationTime = 1073741823, e.callbackPriority = 99, e.callbackNode = If(Ph.bind(null, e));
        else {
            var t = _h(e),
                n = e.callbackNode;
            if (0 === t) null !== n && (e.callbackNode = null, e.callbackExpirationTime = 0, e.callbackPriority = 90);
            else {
                var r = vh();
                if (1073741823 === t ? r = 99 : 1 === t || 2 === t ? r = 95 : r = 0 >= (r = 10 * (1073741821 - t) - 10 * (1073741821 - r)) ? 99 : 250 >= r ? 98 : 5250 >= r ? 97 : 95, null !== n) {
                    var o = e.callbackPriority;
                    if (e.callbackExpirationTime === t && o >= r) return;
                    n !== il && Qs(n)
                }
                e.callbackExpirationTime = t, e.callbackPriority = r, t = 1073741823 === t ? If(Ph.bind(null, e)) : Ef(r, xh.bind(null, e), {
                    timeout: 10 * (1073741821 - t) - fl()
                }), e.callbackNode = t
            }
        }
    }

    function xh(e, t) {
        if (Mu = 0, t) return og(e, t = vh()), Sh(e), null;
        var n = _h(e);
        if (0 !== n) {
            if (t = e.callbackNode, (du & (ru | ou)) !== tu) throw Error(Qu(327));
            if (jh(), e === fu && n === hu || Eh(e, n), null !== pu) {
                var r = du;
                du |= ru;
                for (var o = Th();;) try {
                    Oh();
                    break
                } catch (t) {
                    Ih(e, t)
                }
                if (Of(), du = r, Zl.current = o, gu === au) throw t = mu, Eh(e, n), ng(e, n), Sh(e), t;
                if (null === pu) switch (o = e.finishedWork = e.current.alternate, e.finishedExpirationTime = n, r = gu, fu = null, r) {
                    case iu:
                    case au:
                        throw Error(Qu(345));
                    case su:
                        og(e, 2 < n ? 2 : n);
                        break;
                    case lu:
                        if (ng(e, n), n === (r = e.lastSuspendedTime) && (e.nextKnownPendingLevel = Nh(o)), 1073741823 === vu && 10 < (o = Su + xu - fl())) {
                            if (_u) {
                                var i = e.lastPingedTime;
                                if (0 === i || i >= n) {
                                    e.lastPingedTime = n, Eh(e, n);
                                    break
                                }
                            }
                            if (0 !== (i = _h(e)) && i !== n) break;
                            if (0 !== r && r !== n) {
                                e.lastPingedTime = r;
                                break
                            }
                            e.timeoutHandle = La(Uh.bind(null, e), o);
                            break
                        }
                        Uh(e);
                        break;
                    case uu:
                        if (ng(e, n), n === (r = e.lastSuspendedTime) && (e.nextKnownPendingLevel = Nh(o)), _u && (0 === (o = e.lastPingedTime) || o >= n)) {
                            e.lastPingedTime = n, Eh(e, n);
                            break
                        }
                        if (0 !== (o = _h(e)) && o !== n) break;
                        if (0 !== r && r !== n) {
                            e.lastPingedTime = r;
                            break
                        }
                        if (1073741823 !== bu ? r = 10 * (1073741821 - bu) - fl() : 1073741823 === vu ? r = 0 : (r = 10 * (1073741821 - vu) - 5e3, 0 > (r = (o = fl()) - r) && (r = 0), (n = 10 * (1073741821 - n) - o) < (r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Xl(r / 1960)) - r) && (r = n)), 10 < r) {
                            e.timeoutHandle = La(Uh.bind(null, e), r);
                            break
                        }
                        Uh(e);
                        break;
                    case cu:
                        if (1073741823 !== vu && null !== yu) {
                            i = vu;
                            var a = yu;
                            if (0 >= (r = 0 | a.busyMinDurationMs) ? r = 0 : (o = 0 | a.busyDelayMs, r = (i = fl() - (10 * (1073741821 - i) - (0 | a.timeoutMs || 5e3))) <= o ? 0 : o + r - i), 10 < r) {
                                ng(e, n), e.timeoutHandle = La(Uh.bind(null, e), r);
                                break
                            }
                        }
                        Uh(e);
                        break;
                    default:
                        throw Error(Qu(329))
                }
                if (Sh(e), e.callbackNode === t) return xh.bind(null, e)
            }
        }
        return null
    }

    function Ph(e) {
        var t = e.lastExpiredTime;
        if (t = 0 !== t ? t : 1073741823, (du & (ru | ou)) !== tu) throw Error(Qu(327));
        if (jh(), e === fu && t === hu || Eh(e, t), null !== pu) {
            var n = du;
            du |= ru;
            for (var r = Th();;) try {
                Ah();
                break
            } catch (t) {
                Ih(e, t)
            }
            if (Of(), du = n, Zl.current = r, gu === au) throw n = mu, Eh(e, t), ng(e, t), Sh(e), n;
            if (null !== pu) throw Error(Qu(261));
            e.finishedWork = e.current.alternate, e.finishedExpirationTime = t, fu = null, Uh(e), Sh(e)
        }
        return null
    }

    function kh(e, t) {
        var n = du;
        du |= 1;
        try {
            return e(t)
        } finally {
            (du = n) === tu && Tf()
        }
    }

    function Dh(e, t) {
        var n = du;
        du &= -2, du |= nu;
        try {
            return e(t)
        } finally {
            (du = n) === tu && Tf()
        }
    }

    function Eh(e, t) {
        e.finishedWork = null, e.finishedExpirationTime = 0;
        var n = e.timeoutHandle;
        if (-1 !== n && (e.timeoutHandle = -1, ja(n)), null !== pu)
            for (n = pu.return; null !== n;) {
                var r = n;
                switch (r.tag) {
                    case 1:
                        null != (r = r.type.childContextTypes) && yf();
                        break;
                    case 3:
                        tp(), gf($s), gf(Gs);
                        break;
                    case 5:
                        rp(r);
                        break;
                    case 4:
                        tp();
                        break;
                    case 13:
                    case 19:
                        gf(Il);
                        break;
                    case 10:
                        Mf(r)
                }
                n = n.return
            }
        fu = e, pu = Jh(e.current, null), hu = t, gu = iu, mu = null, bu = vu = 1073741823, yu = null, wu = 0, _u = !1
    }

    function Ih(e, t) {
        for (;;) {
            try {
                if (Of(), Tl.current = Nl, Rl)
                    for (var n = Al.memoizedState; null !== n;) {
                        var r = n.queue;
                        null !== r && (r.pending = null), n = n.next
                    }
                if (Fl = 0, Ml = Ol = Al = null, Rl = !1, null === pu || null === pu.return) return gu = au, mu = t, pu = null;
                e: {
                    var o = e,
                        i = pu.return,
                        a = pu,
                        s = t;
                    if (t = hu, a.effectTag |= 2048, a.firstEffect = a.lastEffect = null, null !== s && "object" == typeof s && "function" == typeof s.then) {
                        var l = s;
                        if (0 == (2 & a.mode)) {
                            var u = a.alternate;
                            u ? (a.updateQueue = u.updateQueue, a.memoizedState = u.memoizedState, a.expirationTime = u.expirationTime) : (a.updateQueue = null, a.memoizedState = null)
                        }
                        var c = 0 != (1 & Il.current),
                            d = i;
                        do {
                            var f;
                            if (f = 13 === d.tag) {
                                var p = d.memoizedState;
                                if (null !== p) f = null !== p.dehydrated;
                                else {
                                    var h = d.memoizedProps;
                                    f = void 0 !== h.fallback && (!0 !== h.unstable_avoidThisFallback || !c)
                                }
                            }
                            if (f) {
                                var g = d.updateQueue;
                                if (null === g) {
                                    var m = new Set;
                                    m.add(l), d.updateQueue = m
                                } else g.add(l);
                                if (0 == (2 & d.mode)) {
                                    if (d.effectTag |= 64, a.effectTag &= -2981, 1 === a.tag)
                                        if (null === a.alternate) a.tag = 17;
                                        else {
                                            var v = jf(1073741823, null);
                                            v.tag = 2, Vf(a, v)
                                        } a.expirationTime = 1073741823;
                                    break e
                                }
                                s = void 0, a = t;
                                var b = o.pingCache;
                                if (null === b ? (b = o.pingCache = new Kl, s = new Set, b.set(l, s)) : void 0 === (s = b.get(l)) && (s = new Set, b.set(l, s)), !s.has(a)) {
                                    s.add(a);
                                    var y = zh.bind(null, o, l, a);
                                    l.then(y, y)
                                }
                                d.effectTag |= 4096, d.expirationTime = t;
                                break e
                            }
                            d = d.return
                        } while (null !== d);
                        s = Error((gc(a.type) || "A React component") + " suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display." + mc(a))
                    }
                    gu !== cu && (gu = su),
                    s = Zp(s, a),
                    d = i;do {
                        switch (d.tag) {
                            case 3:
                                l = s, d.effectTag |= 4096, d.expirationTime = t, Hf(d, gh(d, l, t));
                                break e;
                            case 1:
                                l = s;
                                var w = d.type,
                                    _ = d.stateNode;
                                if (0 == (64 & d.effectTag) && ("function" == typeof w.getDerivedStateFromError || null !== _ && "function" == typeof _.componentDidCatch && (null === Eu || !Eu.has(_)))) {
                                    d.effectTag |= 4096, d.expirationTime = t, Hf(d, mh(d, l, t));
                                    break e
                                }
                        }
                        d = d.return
                    } while (null !== d)
                }
                pu = Rh(pu)
            } catch (e) {
                t = e;
                continue
            }
            break
        }
    }

    function Th() {
        var e = Zl.current;
        return Zl.current = Nl, null === e ? Nl : e
    }

    function Ch(e, t) {
        e < vu && 2 < e && (vu = e), null !== t && e < bu && 2 < e && (bu = e, yu = t)
    }

    function Fh(e) {
        e > wu && (wu = e)
    }

    function Ah() {
        for (; null !== pu;) pu = Mh(pu)
    }

    function Oh() {
        for (; null !== pu && !al();) pu = Mh(pu)
    }

    function Mh(e) {
        var t = Ru(e.alternate, e, hu);
        return e.memoizedProps = e.pendingProps, null === t && (t = Rh(e)), eu.current = null, t
    }

    function Rh(e) {
        pu = e;
        do {
            var t = pu.alternate;
            if (e = pu.return, 0 == (2048 & pu.effectTag)) {
                if (t = Kp(t, pu, hu), 1 === hu || 1 !== pu.childExpirationTime) {
                    for (var n = 0, r = pu.child; null !== r;) {
                        var o = r.expirationTime,
                            i = r.childExpirationTime;
                        o > n && (n = o), i > n && (n = i), r = r.sibling
                    }
                    pu.childExpirationTime = n
                }
                if (null !== t) return t;
                null !== e && 0 == (2048 & e.effectTag) && (null === e.firstEffect && (e.firstEffect = pu.firstEffect), null !== pu.lastEffect && (null !== e.lastEffect && (e.lastEffect.nextEffect = pu.firstEffect), e.lastEffect = pu.lastEffect), 1 < pu.effectTag && (null !== e.lastEffect ? e.lastEffect.nextEffect = pu : e.firstEffect = pu, e.lastEffect = pu))
            } else {
                if (null !== (t = Xp(pu))) return t.effectTag &= 2047, t;
                null !== e && (e.firstEffect = e.lastEffect = null, e.effectTag |= 2048)
            }
            if (null !== (t = pu.sibling)) return t;
            pu = e
        } while (null !== pu);
        return gu === iu && (gu = cu), null
    }

    function Nh(e) {
        var t = e.expirationTime;
        return t > (e = e.childExpirationTime) ? t : e
    }

    function Uh(e) {
        var t = Pf();
        return Df(99, Bh.bind(null, e, t)), null
    }

    function Bh(e, t) {
        do {
            jh()
        } while (null !== Tu);
        if ((du & (ru | ou)) !== tu) throw Error(Qu(327));
        var n = e.finishedWork,
            r = e.finishedExpirationTime;
        if (null === n) return null;
        if (e.finishedWork = null, e.finishedExpirationTime = 0, n === e.current) throw Error(Qu(177));
        e.callbackNode = null, e.callbackExpirationTime = 0, e.callbackPriority = 90, e.nextKnownPendingLevel = 0;
        var o = Nh(n);
        if (e.firstPendingTime = o, r <= e.lastSuspendedTime ? e.firstSuspendedTime = e.lastSuspendedTime = e.nextKnownPendingLevel = 0 : r <= e.firstSuspendedTime && (e.firstSuspendedTime = r - 1), r <= e.lastPingedTime && (e.lastPingedTime = 0), r <= e.lastExpiredTime && (e.lastExpiredTime = 0), e === fu && (pu = fu = null, hu = 0), 1 < n.effectTag ? null !== n.lastEffect ? (n.lastEffect.nextEffect = n, o = n.firstEffect) : o = n : o = n.firstEffect, null !== o) {
            var i = du;
            du |= ou, eu.current = null, Ua = Ia;
            var a = kd();
            if (Dd(a)) {
                if ("selectionStart" in a) var s = {
                    start: a.selectionStart,
                    end: a.selectionEnd
                };
                else e: {
                    var l = (s = (s = a.ownerDocument) && s.defaultView || window).getSelection && s.getSelection();
                    if (l && 0 !== l.rangeCount) {
                        s = l.anchorNode;
                        var u = l.anchorOffset,
                            c = l.focusNode;
                        l = l.focusOffset;
                        try {
                            s.nodeType, c.nodeType
                        } catch (e) {
                            s = null;
                            break e
                        }
                        var d = 0,
                            f = -1,
                            p = -1,
                            h = 0,
                            g = 0,
                            m = a,
                            v = null;
                        t: for (;;) {
                            for (var b; m !== s || 0 !== u && 3 !== m.nodeType || (f = d + u), m !== c || 0 !== l && 3 !== m.nodeType || (p = d + l), 3 === m.nodeType && (d += m.nodeValue.length), null !== (b = m.firstChild);) v = m, m = b;
                            for (;;) {
                                if (m === a) break t;
                                if (v === s && ++h === u && (f = d), v === c && ++g === l && (p = d), null !== (b = m.nextSibling)) break;
                                v = (m = v).parentNode
                            }
                            m = b
                        }
                        s = -1 === f || -1 === p ? null : {
                            start: f,
                            end: p
                        }
                    } else s = null
                }
                s = s || {
                    start: 0,
                    end: 0
                }
            } else s = null;
            Ba = {
                activeElementDetached: null,
                focusedElem: a,
                selectionRange: s
            }, Ia = !1, Pu = o;
            do {
                try {
                    Lh()
                } catch (e) {
                    if (null === Pu) throw Error(Qu(330));
                    qh(Pu, e), Pu = Pu.nextEffect
                }
            } while (null !== Pu);
            Pu = o;
            do {
                try {
                    for (a = e, s = t; null !== Pu;) {
                        var y = Pu.effectTag;
                        if (16 & y && Rc(Pu.stateNode, ""), 128 & y) {
                            var w = Pu.alternate;
                            if (null !== w) {
                                var _ = w.ref;
                                null !== _ && ("function" == typeof _ ? _(null) : _.current = null)
                            }
                        }
                        switch (1038 & y) {
                            case 2:
                                uh(Pu), Pu.effectTag &= -3;
                                break;
                            case 6:
                                uh(Pu), Pu.effectTag &= -3, ph(Pu.alternate, Pu);
                                break;
                            case 1024:
                                Pu.effectTag &= -1025;
                                break;
                            case 1028:
                                Pu.effectTag &= -1025, ph(Pu.alternate, Pu);
                                break;
                            case 4:
                                ph(Pu.alternate, Pu);
                                break;
                            case 8:
                                fh(a, u = Pu, s), sh(u)
                        }
                        Pu = Pu.nextEffect
                    }
                } catch (e) {
                    if (null === Pu) throw Error(Qu(330));
                    qh(Pu, e), Pu = Pu.nextEffect
                }
            } while (null !== Pu);
            if (_ = Ba, w = kd(), y = _.focusedElem, s = _.selectionRange, w !== y && y && y.ownerDocument && Pd(y.ownerDocument.documentElement, y)) {
                null !== s && Dd(y) && (w = s.start, void 0 === (_ = s.end) && (_ = w), "selectionStart" in y ? (y.selectionStart = w, y.selectionEnd = Math.min(_, y.value.length)) : (_ = (w = y.ownerDocument || document) && w.defaultView || window).getSelection && (_ = _.getSelection(), u = y.textContent.length, a = Math.min(s.start, u), s = void 0 === s.end ? a : Math.min(s.end, u), !_.extend && a > s && (u = s, s = a, a = u), u = xd(y, a), c = xd(y, s), u && c && (1 !== _.rangeCount || _.anchorNode !== u.node || _.anchorOffset !== u.offset || _.focusNode !== c.node || _.focusOffset !== c.offset) && ((w = w.createRange()).setStart(u.node, u.offset), _.removeAllRanges(), a > s ? (_.addRange(w), _.extend(c.node, c.offset)) : (w.setEnd(c.node, c.offset), _.addRange(w))))), w = [];
                for (_ = y; _ = _.parentNode;) 1 === _.nodeType && w.push({
                    element: _,
                    left: _.scrollLeft,
                    top: _.scrollTop
                });
                for ("function" == typeof y.focus && y.focus(), y = 0; y < w.length; y++)(_ = w[y]).element.scrollLeft = _.left, _.element.scrollTop = _.top
            }
            Ia = !!Ua, Ba = Ua = null, e.current = n, Pu = o;
            do {
                try {
                    for (y = e; null !== Pu;) {
                        var S = Pu.effectTag;
                        if (36 & S && ih(y, Pu.alternate, Pu), 128 & S) {
                            w = void 0;
                            var x = Pu.ref;
                            if (null !== x) {
                                var P = Pu.stateNode;
                                switch (Pu.tag) {
                                    case 5:
                                        w = P;
                                        break;
                                    default:
                                        w = P
                                }
                                "function" == typeof x ? x(w) : x.current = w
                            }
                        }
                        Pu = Pu.nextEffect
                    }
                } catch (e) {
                    if (null === Pu) throw Error(Qu(330));
                    qh(Pu, e), Pu = Pu.nextEffect
                }
            } while (null !== Pu);
            Pu = null, sl(), du = i
        } else e.current = n;
        if (Iu) Iu = !1, Tu = e, Cu = t;
        else
            for (Pu = o; null !== Pu;) t = Pu.nextEffect, Pu.nextEffect = null, Pu = t;
        if (0 === (t = e.firstPendingTime) && (Eu = null), 1073741823 === t ? e === Ou ? Au++ : (Au = 0, Ou = e) : Au = 0, "function" == typeof Nu && Nu(n.stateNode, r), Sh(e), ku) throw ku = !1, e = Du, Du = null, e;
        return (du & nu) !== tu || Tf(), null
    }

    function Lh() {
        for (; null !== Pu;) {
            var e = Pu.effectTag;
            0 != (256 & e) && nh(Pu.alternate, Pu), 0 == (512 & e) || Iu || (Iu = !0, Ef(97, (function() {
                return jh(), null
            }))), Pu = Pu.nextEffect
        }
    }

    function jh() {
        if (90 !== Cu) {
            var e = 97 < Cu ? 97 : Cu;
            return Cu = 90, Df(e, Vh)
        }
    }

    function Vh() {
        if (null === Tu) return !1;
        var e = Tu;
        if (Tu = null, (du & (ru | ou)) !== tu) throw Error(Qu(331));
        var t = du;
        for (du |= ou, e = e.current.firstEffect; null !== e;) {
            try {
                var n = e;
                if (0 != (512 & n.effectTag)) switch (n.tag) {
                    case 0:
                    case 11:
                    case 15:
                    case 22:
                        rh(5, n), oh(5, n)
                }
            } catch (t) {
                if (null === e) throw Error(Qu(330));
                qh(e, t)
            }
            n = e.nextEffect, e.nextEffect = null, e = n
        }
        return du = t, Tf(), !0
    }

    function Hh(e, t, n) {
        Vf(e, t = gh(e, t = Zp(n, t), 1073741823)), null !== (e = wh(e, 1073741823)) && Sh(e)
    }

    function qh(e, t) {
        if (3 === e.tag) Hh(e, e, t);
        else
            for (var n = e.return; null !== n;) {
                if (3 === n.tag) {
                    Hh(n, e, t);
                    break
                }
                if (1 === n.tag) {
                    var r = n.stateNode;
                    if ("function" == typeof n.type.getDerivedStateFromError || "function" == typeof r.componentDidCatch && (null === Eu || !Eu.has(r))) {
                        Vf(n, e = mh(n, e = Zp(t, e), 1073741823)), null !== (n = wh(n, 1073741823)) && Sh(n);
                        break
                    }
                }
                n = n.return
            }
    }

    function zh(e, t, n) {
        var r = e.pingCache;
        null !== r && r.delete(t), fu === e && hu === n ? gu === uu || gu === lu && 1073741823 === vu && fl() - Su < xu ? Eh(e, hu) : _u = !0 : tg(e, n) && (0 !== (t = e.lastPingedTime) && t < n || (e.lastPingedTime = n, Sh(e)))
    }

    function Gh(e, t) {
        var n = e.stateNode;
        null !== n && n.delete(t), 0 === (t = 0) && (t = bh(t = vh(), e, null)), null !== (e = wh(e, t)) && Sh(e)
    }

    function $h(e, t, n, r) {
        this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.effectTag = 0, this.lastEffect = this.firstEffect = this.nextEffect = null, this.childExpirationTime = this.expirationTime = 0, this.alternate = null
    }

    function Wh(e, t, n, r) {
        return new $h(e, t, n, r)
    }

    function Yh(e) {
        return !(!(e = e.prototype) || !e.isReactComponent)
    }

    function Jh(e, t) {
        var n = e.alternate;
        return null === n ? ((n = Wh(e.tag, t, e.key, e.mode)).elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.effectTag = 0, n.nextEffect = null, n.firstEffect = null, n.lastEffect = null), n.childExpirationTime = e.childExpirationTime, n.expirationTime = e.expirationTime, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = null === t ? null : {
            expirationTime: t.expirationTime,
            firstContext: t.firstContext,
            responders: t.responders
        }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n
    }

    function Qh(e, t, n, r, o, i) {
        var a = 2;
        if (r = e, "function" == typeof e) Yh(e) && (a = 1);
        else if ("string" == typeof e) a = 5;
        else e: switch (e) {
            case Mi:
                return Kh(n.children, o, i, t);
            case Li:
                a = 8, o |= 7;
                break;
            case Ri:
                a = 8, o |= 1;
                break;
            case Ni:
                return (e = Wh(12, n, t, 8 | o)).elementType = Ni, e.type = Ni, e.expirationTime = i, e;
            case Vi:
                return (e = Wh(13, n, t, o)).type = Vi, e.elementType = Vi, e.expirationTime = i, e;
            case Hi:
                return (e = Wh(19, n, t, o)).elementType = Hi, e.expirationTime = i, e;
            default:
                if ("object" == typeof e && null !== e) switch (e.$$typeof) {
                    case Ui:
                        a = 10;
                        break e;
                    case Bi:
                        a = 9;
                        break e;
                    case ji:
                        a = 11;
                        break e;
                    case qi:
                        a = 14;
                        break e;
                    case zi:
                        a = 16, r = null;
                        break e;
                    case Gi:
                        a = 22;
                        break e
                }
                throw Error(Qu(130, null == e ? e : typeof e, ""))
        }
        return (t = Wh(a, n, t, o)).elementType = e, t.type = r, t.expirationTime = i, t
    }

    function Kh(e, t, n, r) {
        return (e = Wh(7, e, r, t)).expirationTime = n, e
    }

    function Xh(e, t, n) {
        return (e = Wh(6, e, null, t)).expirationTime = n, e
    }

    function Zh(e, t, n) {
        return (t = Wh(4, null !== e.children ? e.children : [], e.key, t)).expirationTime = n, t.stateNode = {
            containerInfo: e.containerInfo,
            pendingChildren: null,
            implementation: e.implementation
        }, t
    }

    function eg(e, t, n) {
        this.tag = t, this.current = null, this.containerInfo = e, this.pingCache = this.pendingChildren = null, this.finishedExpirationTime = 0, this.finishedWork = null, this.timeoutHandle = -1, this.pendingContext = this.context = null, this.hydrate = n, this.callbackNode = null, this.callbackPriority = 90, this.lastExpiredTime = this.lastPingedTime = this.nextKnownPendingLevel = this.lastSuspendedTime = this.firstSuspendedTime = this.firstPendingTime = 0
    }

    function tg(e, t) {
        var n = e.firstSuspendedTime;
        return e = e.lastSuspendedTime, 0 !== n && n >= t && e <= t
    }

    function ng(e, t) {
        var n = e.firstSuspendedTime,
            r = e.lastSuspendedTime;
        n < t && (e.firstSuspendedTime = t), (r > t || 0 === n) && (e.lastSuspendedTime = t), t <= e.lastPingedTime && (e.lastPingedTime = 0), t <= e.lastExpiredTime && (e.lastExpiredTime = 0)
    }

    function rg(e, t) {
        t > e.firstPendingTime && (e.firstPendingTime = t);
        var n = e.firstSuspendedTime;
        0 !== n && (t >= n ? e.firstSuspendedTime = e.lastSuspendedTime = e.nextKnownPendingLevel = 0 : t >= e.lastSuspendedTime && (e.lastSuspendedTime = t + 1), t > e.nextKnownPendingLevel && (e.nextKnownPendingLevel = t))
    }

    function og(e, t) {
        var n = e.lastExpiredTime;
        (0 === n || n > t) && (e.lastExpiredTime = t)
    }

    function ig(e, t, n, r) {
        var o = t.current,
            i = vh(),
            a = bl.suspense;
        i = bh(i, o, a);
        e: if (n) {
            t: {
                if (Lc(n = n._reactInternalFiber) !== n || 1 !== n.tag) throw Error(Qu(170));
                var s = n;do {
                    switch (s.tag) {
                        case 3:
                            s = s.stateNode.context;
                            break t;
                        case 1:
                            if (bf(s.type)) {
                                s = s.stateNode.__reactInternalMemoizedMergedChildContext;
                                break t
                            }
                    }
                    s = s.return
                } while (null !== s);
                throw Error(Qu(171))
            }
            if (1 === n.tag) {
                var l = n.type;
                if (bf(l)) {
                    n = _f(n, l, s);
                    break e
                }
            }
            n = s
        }
        else n = zs;
        return null === t.context ? t.context = n : t.pendingContext = n, (t = jf(i, a)).payload = {
            element: e
        }, null !== (r = void 0 === r ? null : r) && (t.callback = r), Vf(o, t), yh(o, i), i
    }

    function ag(e) {
        if (!(e = e.current).child) return null;
        switch (e.child.tag) {
            case 5:
            default:
                return e.child.stateNode
        }
    }

    function sg(e, t) {
        null !== (e = e.memoizedState) && null !== e.dehydrated && e.retryTime < t && (e.retryTime = t)
    }

    function lg(e, t) {
        sg(e, t), (e = e.alternate) && sg(e, t)
    }

    function ug(e, t, n) {
        var r = new eg(e, t, n = null != n && !0 === n.hydrate),
            o = Wh(3, null, null, 2 === t ? 7 : 1 === t ? 3 : 0);
        r.current = o, o.stateNode = r, Bf(o), e[za] = r.current, n && 0 !== t && function(e, t) {
            var n = Bc(t);
            ba.forEach((function(e) {
                Xc(e, t, n)
            })), ya.forEach((function(e) {
                Xc(e, t, n)
            }))
        }(0, 9 === e.nodeType ? e : e.ownerDocument), this._internalRoot = r
    }

    function cg(e) {
        return !(!e || 1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType && (8 !== e.nodeType || " react-mount-point-unstable " !== e.nodeValue))
    }

    function dg(e, t, n, r, o) {
        var i = n._reactRootContainer;
        if (i) {
            var a = i._internalRoot;
            if ("function" == typeof o) {
                var s = o;
                o = function() {
                    var e = ag(a);
                    s.call(e)
                }
            }
            ig(t, a, e, o)
        } else {
            if (i = n._reactRootContainer = function(e, t) {
                    if (t || (t = !(!(t = e ? 9 === e.nodeType ? e.documentElement : e.firstChild : null) || 1 !== t.nodeType || !t.hasAttribute("data-reactroot"))), !t)
                        for (var n; n = e.lastChild;) e.removeChild(n);
                    return new ug(e, 0, t ? {
                        hydrate: !0
                    } : void 0)
                }(n, r), a = i._internalRoot, "function" == typeof o) {
                var l = o;
                o = function() {
                    var e = ag(a);
                    l.call(e)
                }
            }
            Dh((function() {
                ig(t, a, e, o)
            }))
        }
        return ag(a)
    }

    function fg(e, t, n) {
        var r = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
        return {
            $$typeof: Oi,
            key: null == r ? null : "" + r,
            children: e,
            containerInfo: t,
            implementation: n
        }
    }

    function pg(e, t) {
        var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
        if (!cg(t)) throw Error(Qu(200));
        return fg(e, t, null, n)
    }

    function hg() {
        if (Zo = {}, ei = Jt(), ti = Ce(), Xo(), !ei) throw Error(Qu(227));
        var e;
        ni = !1, ri = null, oi = !1, ii = null, ai = {
            onError: function(e) {
                ni = !0, ri = e
            }
        }, si = null, li = null, ui = null, ci = null, di = {}, fi = [], pi = {}, hi = {}, gi = {}, mi = !("undefined" == typeof window || void 0 === window.document || void 0 === window.document.createElement), vi = null, bi = null, yi = null, wi = ac, _i = !1, Si = !1, xi = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Pi = Object.prototype.hasOwnProperty, ki = {}, Di = {}, Ei = {}, "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach((function(e) {
            Ei[e] = new dc(e, 0, !1, e, null, !1)
        })), [
            ["acceptCharset", "accept-charset"],
            ["className", "class"],
            ["htmlFor", "for"],
            ["httpEquiv", "http-equiv"]
        ].forEach((function(e) {
            var t = e[0];
            Ei[t] = new dc(t, 1, !1, e[1], null, !1)
        })), ["contentEditable", "draggable", "spellCheck", "value"].forEach((function(e) {
            Ei[e] = new dc(e, 2, !1, e.toLowerCase(), null, !1)
        })), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach((function(e) {
            Ei[e] = new dc(e, 2, !1, e, null, !1)
        })), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach((function(e) {
            Ei[e] = new dc(e, 3, !1, e.toLowerCase(), null, !1)
        })), ["checked", "multiple", "muted", "selected"].forEach((function(e) {
            Ei[e] = new dc(e, 3, !0, e, null, !1)
        })), ["capture", "download"].forEach((function(e) {
            Ei[e] = new dc(e, 4, !1, e, null, !1)
        })), ["cols", "rows", "size", "span"].forEach((function(e) {
            Ei[e] = new dc(e, 6, !1, e, null, !1)
        })), ["rowSpan", "start"].forEach((function(e) {
            Ei[e] = new dc(e, 5, !1, e.toLowerCase(), null, !1)
        })), Ii = /[\-:]([a-z])/g, "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach((function(e) {
            var t = e.replace(Ii, fc);
            Ei[t] = new dc(t, 1, !1, e, null, !1)
        })), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach((function(e) {
            var t = e.replace(Ii, fc);
            Ei[t] = new dc(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1)
        })), ["xml:base", "xml:lang", "xml:space"].forEach((function(e) {
            var t = e.replace(Ii, fc);
            Ei[t] = new dc(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1)
        })), ["tabIndex", "crossOrigin"].forEach((function(e) {
            Ei[e] = new dc(e, 1, !1, e.toLowerCase(), null, !1)
        })), Ei.xlinkHref = new dc("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0), ["src", "href", "action", "formAction"].forEach((function(e) {
            Ei[e] = new dc(e, 1, !1, e.toLowerCase(), null, !0)
        })), (Ti = ei.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED).hasOwnProperty("ReactCurrentDispatcher") || (Ti.ReactCurrentDispatcher = {
            current: null
        }), Ti.hasOwnProperty("ReactCurrentBatchConfig") || (Ti.ReactCurrentBatchConfig = {
            suspense: null
        }), Ci = /^(.*)[\\\/]/, Fi = "function" == typeof Symbol && Symbol.for, Ai = Fi ? Symbol.for("react.element") : 60103, Oi = Fi ? Symbol.for("react.portal") : 60106, Mi = Fi ? Symbol.for("react.fragment") : 60107, Ri = Fi ? Symbol.for("react.strict_mode") : 60108, Ni = Fi ? Symbol.for("react.profiler") : 60114, Ui = Fi ? Symbol.for("react.provider") : 60109, Bi = Fi ? Symbol.for("react.context") : 60110, Li = Fi ? Symbol.for("react.concurrent_mode") : 60111, ji = Fi ? Symbol.for("react.forward_ref") : 60112, Vi = Fi ? Symbol.for("react.suspense") : 60113, Hi = Fi ? Symbol.for("react.suspense_list") : 60120, qi = Fi ? Symbol.for("react.memo") : 60115, zi = Fi ? Symbol.for("react.lazy") : 60116, Gi = Fi ? Symbol.for("react.block") : 60121, $i = "function" == typeof Symbol && Symbol.iterator, Wi = {
            html: "http://www.w3.org/1999/xhtml",
            mathml: "http://www.w3.org/1998/Math/MathML",
            svg: "http://www.w3.org/2000/svg"
        }, e = function(e, t) {
            if (e.namespaceURI !== Wi.svg || "innerHTML" in e) e.innerHTML = t;
            else {
                for ((Yi = Yi || document.createElement("div")).innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Yi.firstChild; e.firstChild;) e.removeChild(e.firstChild);
                for (; t.firstChild;) e.appendChild(t.firstChild)
            }
        }, Ji = "undefined" != typeof MSApp && MSApp.execUnsafeLocalFunction ? function(t, n, r, o) {
            MSApp.execUnsafeLocalFunction((function() {
                return e(t, n)
            }))
        } : e, Qi = {
            animationend: Nc("Animation", "AnimationEnd"),
            animationiteration: Nc("Animation", "AnimationIteration"),
            animationstart: Nc("Animation", "AnimationStart"),
            transitionend: Nc("Transition", "TransitionEnd")
        }, Ki = {}, Xi = {}, mi && (Xi = document.createElement("div").style, "AnimationEvent" in window || (delete Qi.animationend.animation, delete Qi.animationiteration.animation, delete Qi.animationstart.animation), "TransitionEvent" in window || delete Qi.transitionend.transition), Zi = Uc("animationend"), ea = Uc("animationiteration"), ta = Uc("animationstart"), na = Uc("transitionend"), ra = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), oa = new("function" == typeof WeakMap ? WeakMap : Map), ia = null, aa = [], ca = !1, da = [], fa = null, pa = null, ha = null, ga = new Map, ma = new Map, va = [], ba = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput close cancel copy cut paste click change contextmenu reset submit".split(" "), ya = "focus blur dragenter dragleave mouseover mouseout pointerover pointerout gotpointercapture lostpointercapture".split(" "), wa = {}, _a = new Map, Sa = new Map, xa = ["abort", "abort", Zi, "animationEnd", ea, "animationIteration", ta, "animationStart", "canplay", "canPlay", "canplaythrough", "canPlayThrough", "durationchange", "durationChange", "emptied", "emptied", "encrypted", "encrypted", "ended", "ended", "error", "error", "gotpointercapture", "gotPointerCapture", "load", "load", "loadeddata", "loadedData", "loadedmetadata", "loadedMetadata", "loadstart", "loadStart", "lostpointercapture", "lostPointerCapture", "playing", "playing", "progress", "progress", "seeking", "seeking", "stalled", "stalled", "suspend", "suspend", "timeupdate", "timeUpdate", na, "transitionEnd", "waiting", "waiting"], ld("blur blur cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focus focus input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "), 0), ld("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "), 1), ld(xa, 2);
        for (Pa = "change selectionchange textInput compositionstart compositionend compositionupdate".split(" "), ka = 0; ka < Pa.length; ka++) Sa.set(Pa[ka], 0);
        if (Da = Xo().unstable_UserBlockingPriority, Ea = Xo().unstable_runWithPriority, Ia = !0, Ta = {
                animationIterationCount: !0,
                borderImageOutset: !0,
                borderImageSlice: !0,
                borderImageWidth: !0,
                boxFlex: !0,
                boxFlexGroup: !0,
                boxOrdinalGroup: !0,
                columnCount: !0,
                columns: !0,
                flex: !0,
                flexGrow: !0,
                flexPositive: !0,
                flexShrink: !0,
                flexNegative: !0,
                flexOrder: !0,
                gridArea: !0,
                gridRow: !0,
                gridRowEnd: !0,
                gridRowSpan: !0,
                gridRowStart: !0,
                gridColumn: !0,
                gridColumnEnd: !0,
                gridColumnSpan: !0,
                gridColumnStart: !0,
                fontWeight: !0,
                lineClamp: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                tabSize: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0,
                fillOpacity: !0,
                floodOpacity: !0,
                stopOpacity: !0,
                strokeDasharray: !0,
                strokeDashoffset: !0,
                strokeMiterlimit: !0,
                strokeOpacity: !0,
                strokeWidth: !0
            }, Ca = ["Webkit", "ms", "Moz", "O"], Object.keys(Ta).forEach((function(e) {
                Ca.forEach((function(t) {
                    t = t + e.charAt(0).toUpperCase() + e.substring(1), Ta[t] = Ta[e]
                }))
            })), Fa = ti({
                menuitem: !0
            }, {
                area: !0,
                base: !0,
                br: !0,
                col: !0,
                embed: !0,
                hr: !0,
                img: !0,
                input: !0,
                keygen: !0,
                link: !0,
                meta: !0,
                param: !0,
                source: !0,
                track: !0,
                wbr: !0
            }), Aa = Wi.html, Oa = "$", Ma = "/$", Ra = "$?", Na = "$!", Ua = null, Ba = null, La = "function" == typeof setTimeout ? setTimeout : void 0, ja = "function" == typeof clearTimeout ? clearTimeout : void 0, Va = Math.random().toString(36).slice(2), Ha = "__reactInternalInstance$" + Va, qa = "__reactEventHandlers$" + Va, za = "__reactContainere$" + Va, Ga = null, $a = null, Wa = null, ti(Gd.prototype, {
                preventDefault: function() {
                    this.defaultPrevented = !0;
                    var e = this.nativeEvent;
                    e && (e.preventDefault ? e.preventDefault() : "unknown" != typeof e.returnValue && (e.returnValue = !1), this.isDefaultPrevented = qd)
                },
                stopPropagation: function() {
                    var e = this.nativeEvent;
                    e && (e.stopPropagation ? e.stopPropagation() : "unknown" != typeof e.cancelBubble && (e.cancelBubble = !0), this.isPropagationStopped = qd)
                },
                persist: function() {
                    this.isPersistent = qd
                },
                isPersistent: zd,
                destructor: function() {
                    var e, t = this.constructor.Interface;
                    for (e in t) this[e] = null;
                    this.nativeEvent = this._targetInst = this.dispatchConfig = null, this.isPropagationStopped = this.isDefaultPrevented = zd, this._dispatchInstances = this._dispatchListeners = null
                }
            }), Gd.Interface = {
                type: null,
                target: null,
                currentTarget: function() {
                    return null
                },
                eventPhase: null,
                bubbles: null,
                cancelable: null,
                timeStamp: function(e) {
                    return e.timeStamp || Date.now()
                },
                defaultPrevented: null,
                isTrusted: null
            }, Gd.extend = function(e) {
                function t() {}

                function n() {
                    return r.apply(this, arguments)
                }
                var r = this;
                t.prototype = r.prototype;
                var o = new t;
                return ti(o, n.prototype), n.prototype = o, n.prototype.constructor = n, n.Interface = ti({}, r.Interface, e), n.extend = r.extend, Yd(n), n
            }, Yd(Gd), Ya = Gd.extend({
                data: null
            }), Ja = Gd.extend({
                data: null
            }), Qa = [9, 13, 27, 32], Ka = mi && "CompositionEvent" in window, Xa = null, mi && "documentMode" in document && (Xa = document.documentMode), Za = mi && "TextEvent" in window && !Xa, es = mi && (!Ka || Xa && 8 < Xa && 11 >= Xa), ts = String.fromCharCode(32), ns = {
                beforeInput: {
                    phasedRegistrationNames: {
                        bubbled: "onBeforeInput",
                        captured: "onBeforeInputCapture"
                    },
                    dependencies: ["compositionend", "keypress", "textInput", "paste"]
                },
                compositionEnd: {
                    phasedRegistrationNames: {
                        bubbled: "onCompositionEnd",
                        captured: "onCompositionEndCapture"
                    },
                    dependencies: "blur compositionend keydown keypress keyup mousedown".split(" ")
                },
                compositionStart: {
                    phasedRegistrationNames: {
                        bubbled: "onCompositionStart",
                        captured: "onCompositionStartCapture"
                    },
                    dependencies: "blur compositionstart keydown keypress keyup mousedown".split(" ")
                },
                compositionUpdate: {
                    phasedRegistrationNames: {
                        bubbled: "onCompositionUpdate",
                        captured: "onCompositionUpdateCapture"
                    },
                    dependencies: "blur compositionupdate keydown keypress keyup mousedown".split(" ")
                }
            }, rs = !1, os = !1, is = {
                eventTypes: ns,
                extractEvents: function(e, t, n, r) {
                    var o;
                    if (Ka) e: {
                        switch (e) {
                            case "compositionstart":
                                var i = ns.compositionStart;
                                break e;
                            case "compositionend":
                                i = ns.compositionEnd;
                                break e;
                            case "compositionupdate":
                                i = ns.compositionUpdate;
                                break e
                        }
                        i = void 0
                    }
                    else os ? Jd(e, n) && (i = ns.compositionEnd) : "keydown" === e && 229 === n.keyCode && (i = ns.compositionStart);
                    return i ? (es && "ko" !== n.locale && (os || i !== ns.compositionStart ? i === ns.compositionEnd && os && (o = Hd()) : ($a = "value" in (Ga = r) ? Ga.value : Ga.textContent, os = !0)), i = Ya.getPooled(i, t, n, r), o ? i.data = o : null !== (o = Qd(n)) && (i.data = o), Vd(i), o = i) : o = null, (e = Za ? function(e, t) {
                        switch (e) {
                            case "compositionend":
                                return Qd(t);
                            case "keypress":
                                return 32 !== t.which ? null : (rs = !0, ts);
                            case "textInput":
                                return (e = t.data) === ts && rs ? null : e;
                            default:
                                return null
                        }
                    }(e, n) : function(e, t) {
                        if (os) return "compositionend" === e || !Ka && Jd(e, t) ? (e = Hd(), Wa = $a = Ga = null, os = !1, e) : null;
                        switch (e) {
                            case "paste":
                                return null;
                            case "keypress":
                                if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
                                    if (t.char && 1 < t.char.length) return t.char;
                                    if (t.which) return String.fromCharCode(t.which)
                                }
                                return null;
                            case "compositionend":
                                return es && "ko" !== t.locale ? null : t.data;
                            default:
                                return null
                        }
                    }(e, n)) ? ((t = Ja.getPooled(ns.beforeInput, t, n, r)).data = e, Vd(t)) : t = null, null === o ? t : null === t ? o : [o, t]
                }
            }, as = {
                color: !0,
                date: !0,
                datetime: !0,
                "datetime-local": !0,
                email: !0,
                month: !0,
                number: !0,
                password: !0,
                range: !0,
                search: !0,
                tel: !0,
                text: !0,
                time: !0,
                url: !0,
                week: !0
            }, ss = {
                change: {
                    phasedRegistrationNames: {
                        bubbled: "onChange",
                        captured: "onChangeCapture"
                    },
                    dependencies: "blur change click focus input keydown keyup selectionchange".split(" ")
                }
            }, ls = null, us = null, cs = !1, mi && (cs = Yc("input") && (!document.documentMode || 9 < document.documentMode)), ds = {
                eventTypes: ss,
                _isInputEventSupported: cs,
                extractEvents: function(e, t, n, r) {
                    var o = t ? Od(t) : window,
                        i = o.nodeName && o.nodeName.toLowerCase();
                    if ("select" === i || "input" === i && "file" === o.type) var a = tf;
                    else if (Kd(o))
                        if (cs) a = lf;
                        else {
                            a = af;
                            var s = of
                        }
                    else(i = o.nodeName) && "input" === i.toLowerCase() && ("checkbox" === o.type || "radio" === o.type) && (a = sf);
                    if (a && (a = a(e, t))) return Xd(a, n, r);
                    s && s(e, o, t), "blur" === e && (e = o._wrapperState) && e.controlled && "number" === o.type && Dc(o, "number", o.value)
                }
            }, fs = Gd.extend({
                view: null,
                detail: null
            }), ps = {
                Alt: "altKey",
                Control: "ctrlKey",
                Meta: "metaKey",
                Shift: "shiftKey"
            }, hs = 0, gs = 0, ms = !1, vs = !1, bs = fs.extend({
                screenX: null,
                screenY: null,
                clientX: null,
                clientY: null,
                pageX: null,
                pageY: null,
                ctrlKey: null,
                shiftKey: null,
                altKey: null,
                metaKey: null,
                getModifierState: cf,
                button: null,
                buttons: null,
                relatedTarget: function(e) {
                    return e.relatedTarget || (e.fromElement === e.srcElement ? e.toElement : e.fromElement)
                },
                movementX: function(e) {
                    if ("movementX" in e) return e.movementX;
                    var t = hs;
                    return hs = e.screenX, ms ? "mousemove" === e.type ? e.screenX - t : 0 : (ms = !0, 0)
                },
                movementY: function(e) {
                    if ("movementY" in e) return e.movementY;
                    var t = gs;
                    return gs = e.screenY, vs ? "mousemove" === e.type ? e.screenY - t : 0 : (vs = !0, 0)
                }
            }), ys = bs.extend({
                pointerId: null,
                width: null,
                height: null,
                pressure: null,
                tangentialPressure: null,
                tiltX: null,
                tiltY: null,
                twist: null,
                pointerType: null,
                isPrimary: null
            }), _s = {
                eventTypes: ws = {
                    mouseEnter: {
                        registrationName: "onMouseEnter",
                        dependencies: ["mouseout", "mouseover"]
                    },
                    mouseLeave: {
                        registrationName: "onMouseLeave",
                        dependencies: ["mouseout", "mouseover"]
                    },
                    pointerEnter: {
                        registrationName: "onPointerEnter",
                        dependencies: ["pointerout", "pointerover"]
                    },
                    pointerLeave: {
                        registrationName: "onPointerLeave",
                        dependencies: ["pointerout", "pointerover"]
                    }
                },
                extractEvents: function(e, t, n, r, o) {
                    var i = "mouseover" === e || "pointerover" === e,
                        a = "mouseout" === e || "pointerout" === e;
                    if (i && 0 == (32 & o) && (n.relatedTarget || n.fromElement) || !a && !i) return null;
                    (i = r.window === r ? r : (i = r.ownerDocument) ? i.defaultView || i.parentWindow : window, a) ? (a = t, null !== (t = (t = n.relatedTarget || n.toElement) ? Fd(t) : null) && (t !== Lc(t) || 5 !== t.tag && 6 !== t.tag) && (t = null)) : a = null;
                    if (a === t) return null;
                    if ("mouseout" === e || "mouseover" === e) var s = bs,
                        l = ws.mouseLeave,
                        u = ws.mouseEnter,
                        c = "mouse";
                    else "pointerout" !== e && "pointerover" !== e || (s = ys, l = ws.pointerLeave, u = ws.pointerEnter, c = "pointer");
                    if (e = null == a ? i : Od(a), i = null == t ? i : Od(t), (l = s.getPooled(l, a, n, r)).type = c + "leave", l.target = e, l.relatedTarget = i, (n = s.getPooled(u, t, n, r)).type = c + "enter", n.target = i, n.relatedTarget = e, c = t, (r = a) && c) e: {
                        for (u = c, a = 0, e = s = r; e; e = Rd(e)) a++;
                        for (e = 0, t = u; t; t = Rd(t)) e++;
                        for (; 0 < a - e;) s = Rd(s),
                        a--;
                        for (; 0 < e - a;) u = Rd(u),
                        e--;
                        for (; a--;) {
                            if (s === u || s === u.alternate) break e;
                            s = Rd(s), u = Rd(u)
                        }
                        s = null
                    }
                    else s = null;
                    for (u = s, s = []; r && r !== u && (null === (a = r.alternate) || a !== u);) s.push(r), r = Rd(r);
                    for (r = []; c && c !== u && (null === (a = c.alternate) || a !== u);) r.push(c), c = Rd(c);
                    for (c = 0; c < s.length; c++) Ld(s[c], "bubbled", l);
                    for (c = r.length; 0 < c--;) Ld(r[c], "captured", n);
                    return 0 == (64 & o) ? [l] : [l, n]
                }
            }, Ss = "function" == typeof Object.is ? Object.is : df, xs = Object.prototype.hasOwnProperty, Ps = mi && "documentMode" in document && 11 >= document.documentMode, ks = {
                select: {
                    phasedRegistrationNames: {
                        bubbled: "onSelect",
                        captured: "onSelectCapture"
                    },
                    dependencies: "blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(" ")
                }
            }, Ds = null, Es = null, Is = null, Ts = !1, Cs = {
                eventTypes: ks,
                extractEvents: function(e, t, n, r, o, i) {
                    if (!(i = !(o = i || (r.window === r ? r.document : 9 === r.nodeType ? r : r.ownerDocument)))) {
                        e: {
                            o = Bc(o),
                            i = gi.onSelect;
                            for (var a = 0; a < i.length; a++)
                                if (!o.has(i[a])) {
                                    o = !1;
                                    break e
                                } o = !0
                        }
                        i = !o
                    }
                    if (i) return null;
                    switch (o = t ? Od(t) : window, e) {
                        case "focus":
                            (Kd(o) || "true" === o.contentEditable) && (Ds = o, Es = t, Is = null);
                            break;
                        case "blur":
                            Is = Es = Ds = null;
                            break;
                        case "mousedown":
                            Ts = !0;
                            break;
                        case "contextmenu":
                        case "mouseup":
                        case "dragend":
                            return Ts = !1, pf(n, r);
                        case "selectionchange":
                            if (Ps) break;
                        case "keydown":
                        case "keyup":
                            return pf(n, r)
                    }
                    return null
                }
            }, Fs = Gd.extend({
                animationName: null,
                elapsedTime: null,
                pseudoElement: null
            }), As = Gd.extend({
                clipboardData: function(e) {
                    return "clipboardData" in e ? e.clipboardData : window.clipboardData
                }
            }), Os = fs.extend({
                relatedTarget: null
            }), Ms = {
                Esc: "Escape",
                Spacebar: " ",
                Left: "ArrowLeft",
                Up: "ArrowUp",
                Right: "ArrowRight",
                Down: "ArrowDown",
                Del: "Delete",
                Win: "OS",
                Menu: "ContextMenu",
                Apps: "ContextMenu",
                Scroll: "ScrollLock",
                MozPrintableKey: "Unidentified"
            }, Rs = {
                8: "Backspace",
                9: "Tab",
                12: "Clear",
                13: "Enter",
                16: "Shift",
                17: "Control",
                18: "Alt",
                19: "Pause",
                20: "CapsLock",
                27: "Escape",
                32: " ",
                33: "PageUp",
                34: "PageDown",
                35: "End",
                36: "Home",
                37: "ArrowLeft",
                38: "ArrowUp",
                39: "ArrowRight",
                40: "ArrowDown",
                45: "Insert",
                46: "Delete",
                112: "F1",
                113: "F2",
                114: "F3",
                115: "F4",
                116: "F5",
                117: "F6",
                118: "F7",
                119: "F8",
                120: "F9",
                121: "F10",
                122: "F11",
                123: "F12",
                144: "NumLock",
                145: "ScrollLock",
                224: "Meta"
            }, Ns = fs.extend({
                key: function(e) {
                    if (e.key) {
                        var t = Ms[e.key] || e.key;
                        if ("Unidentified" !== t) return t
                    }
                    return "keypress" === e.type ? 13 === (e = hf(e)) ? "Enter" : String.fromCharCode(e) : "keydown" === e.type || "keyup" === e.type ? Rs[e.keyCode] || "Unidentified" : ""
                },
                location: null,
                ctrlKey: null,
                shiftKey: null,
                altKey: null,
                metaKey: null,
                repeat: null,
                locale: null,
                getModifierState: cf,
                charCode: function(e) {
                    return "keypress" === e.type ? hf(e) : 0
                },
                keyCode: function(e) {
                    return "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0
                },
                which: function(e) {
                    return "keypress" === e.type ? hf(e) : "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0
                }
            }), Us = bs.extend({
                dataTransfer: null
            }), Bs = fs.extend({
                touches: null,
                targetTouches: null,
                changedTouches: null,
                altKey: null,
                metaKey: null,
                ctrlKey: null,
                shiftKey: null,
                getModifierState: cf
            }), Ls = Gd.extend({
                propertyName: null,
                elapsedTime: null,
                pseudoElement: null
            }), js = bs.extend({
                deltaX: function(e) {
                    return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0
                },
                deltaY: function(e) {
                    return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0
                },
                deltaZ: null,
                deltaMode: null
            }), Vs = {
                eventTypes: wa,
                extractEvents: function(e, t, n, r) {
                    var o = _a.get(e);
                    if (!o) return null;
                    switch (e) {
                        case "keypress":
                            if (0 === hf(n)) return null;
                        case "keydown":
                        case "keyup":
                            e = Ns;
                            break;
                        case "blur":
                        case "focus":
                            e = Os;
                            break;
                        case "click":
                            if (2 === n.button) return null;
                        case "auxclick":
                        case "dblclick":
                        case "mousedown":
                        case "mousemove":
                        case "mouseup":
                        case "mouseout":
                        case "mouseover":
                        case "contextmenu":
                            e = bs;
                            break;
                        case "drag":
                        case "dragend":
                        case "dragenter":
                        case "dragexit":
                        case "dragleave":
                        case "dragover":
                        case "dragstart":
                        case "drop":
                            e = Us;
                            break;
                        case "touchcancel":
                        case "touchend":
                        case "touchmove":
                        case "touchstart":
                            e = Bs;
                            break;
                        case Zi:
                        case ea:
                        case ta:
                            e = Fs;
                            break;
                        case na:
                            e = Ls;
                            break;
                        case "scroll":
                            e = fs;
                            break;
                        case "wheel":
                            e = js;
                            break;
                        case "copy":
                        case "cut":
                        case "paste":
                            e = As;
                            break;
                        case "gotpointercapture":
                        case "lostpointercapture":
                        case "pointercancel":
                        case "pointerdown":
                        case "pointermove":
                        case "pointerout":
                        case "pointerover":
                        case "pointerup":
                            e = ys;
                            break;
                        default:
                            e = Gd
                    }
                    return Vd(t = e.getPooled(o, t, n, r)), t
                }
            }, ci) throw Error(Qu(101));
        ci = Array.prototype.slice.call("ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" ")), ec(), si = Md, li = Ad, ui = Od, nc({
                SimpleEventPlugin: Vs,
                EnterLeaveEventPlugin: _s,
                ChangeEventPlugin: ds,
                SelectEventPlugin: Cs,
                BeforeInputEventPlugin: is
            }), Hs = [], qs = -1, Gs = {
                current: zs = {}
            }, $s = {
                current: !1
            }, Ws = zs, Ys = Xo().unstable_runWithPriority, Js = Xo().unstable_scheduleCallback, Qs = Xo().unstable_cancelCallback, Ks = Xo().unstable_requestPaint, Xs = Xo().unstable_now, Zs = Xo().unstable_getCurrentPriorityLevel, el = Xo().unstable_ImmediatePriority, tl = Xo().unstable_UserBlockingPriority, nl = Xo().unstable_NormalPriority, rl = Xo().unstable_LowPriority, ol = Xo().unstable_IdlePriority, il = {}, al = Xo().unstable_shouldYield, sl = void 0 !== Ks ? Ks : function() {}, ll = null, ul = null, cl = !1, dl = Xs(), fl = 1e4 > dl ? Xs : function() {
                return Xs() - dl
            }, pl = {
                current: null
            }, hl = null, gl = null, ml = null, vl = !1, bl = Ti.ReactCurrentBatchConfig, yl = (new ei.Component).refs, wl = {
                isMounted: function(e) {
                    return !!(e = e._reactInternalFiber) && Lc(e) === e
                },
                enqueueSetState: function(e, t, n) {
                    e = e._reactInternalFiber;
                    var r = vh(),
                        o = bl.suspense;
                    (o = jf(r = bh(r, e, o), o)).payload = t, null != n && (o.callback = n), Vf(e, o), yh(e, r)
                },
                enqueueReplaceState: function(e, t, n) {
                    e = e._reactInternalFiber;
                    var r = vh(),
                        o = bl.suspense;
                    (o = jf(r = bh(r, e, o), o)).tag = 1, o.payload = t, null != n && (o.callback = n), Vf(e, o), yh(e, r)
                },
                enqueueForceUpdate: function(e, t) {
                    e = e._reactInternalFiber;
                    var n = vh(),
                        r = bl.suspense;
                    (r = jf(n = bh(n, e, r), r)).tag = 2, null != t && (r.callback = t), Vf(e, r), yh(e, n)
                }
            }, _l = Array.isArray, Sl = Xf(!0), xl = Xf(!1), kl = {
                current: Pl = {}
            }, Dl = {
                current: Pl
            }, El = {
                current: Pl
            }, Il = {
                current: 0
            }, Tl = Ti.ReactCurrentDispatcher, Cl = Ti.ReactCurrentBatchConfig, Fl = 0, Al = null, Ol = null, Ml = null, Rl = !1, Nl = {
                readContext: Uf,
                useCallback: ap,
                useContext: ap,
                useEffect: ap,
                useImperativeHandle: ap,
                useLayoutEffect: ap,
                useMemo: ap,
                useReducer: ap,
                useRef: ap,
                useState: ap,
                useDebugValue: ap,
                useResponder: ap,
                useDeferredValue: ap,
                useTransition: ap
            }, Ul = {
                readContext: Uf,
                useCallback: kp,
                useContext: Uf,
                useEffect: yp,
                useImperativeHandle: function(e, t, n) {
                    return n = null != n ? n.concat([e]) : null, vp(4, 2, Sp.bind(null, t, e), n)
                },
                useLayoutEffect: function(e, t) {
                    return vp(4, 2, e, t)
                },
                useMemo: function(e, t) {
                    var n = up();
                    return t = void 0 === t ? null : t, e = e(), n.memoizedState = [e, t], e
                },
                useReducer: function(e, t, n) {
                    var r = up();
                    return t = void 0 !== n ? n(t) : t, r.memoizedState = r.baseState = t, e = (e = r.queue = {
                        pending: null,
                        dispatch: null,
                        lastRenderedReducer: e,
                        lastRenderedState: t
                    }).dispatch = Tp.bind(null, Al, e), [r.memoizedState, e]
                },
                useRef: function(e) {
                    return e = {
                        current: e
                    }, up().memoizedState = e
                },
                useState: hp,
                useDebugValue: Pp,
                useResponder: ip,
                useDeferredValue: function(e, t) {
                    var n = hp(e),
                        r = n[0],
                        o = n[1];
                    return yp((function() {
                        var n = Cl.suspense;
                        Cl.suspense = void 0 === t ? null : t;
                        try {
                            o(e)
                        } finally {
                            Cl.suspense = n
                        }
                    }), [e, t]), r
                },
                useTransition: function(e) {
                    var t = hp(!1),
                        n = t[0];
                    return t = t[1], [kp(Ip.bind(null, t, e), [t, e]), n]
                }
            }, Bl = {
                readContext: Uf,
                useCallback: Dp,
                useContext: Uf,
                useEffect: wp,
                useImperativeHandle: xp,
                useLayoutEffect: _p,
                useMemo: Ep,
                useReducer: fp,
                useRef: mp,
                useState: function() {
                    return fp(dp)
                },
                useDebugValue: Pp,
                useResponder: ip,
                useDeferredValue: function(e, t) {
                    var n = fp(dp),
                        r = n[0],
                        o = n[1];
                    return wp((function() {
                        var n = Cl.suspense;
                        Cl.suspense = void 0 === t ? null : t;
                        try {
                            o(e)
                        } finally {
                            Cl.suspense = n
                        }
                    }), [e, t]), r
                },
                useTransition: function(e) {
                    var t = fp(dp),
                        n = t[0];
                    return t = t[1], [Dp(Ip.bind(null, t, e), [t, e]), n]
                }
            }, Ll = {
                readContext: Uf,
                useCallback: Dp,
                useContext: Uf,
                useEffect: wp,
                useImperativeHandle: xp,
                useLayoutEffect: _p,
                useMemo: Ep,
                useReducer: pp,
                useRef: mp,
                useState: function() {
                    return pp(dp)
                },
                useDebugValue: Pp,
                useResponder: ip,
                useDeferredValue: function(e, t) {
                    var n = pp(dp),
                        r = n[0],
                        o = n[1];
                    return wp((function() {
                        var n = Cl.suspense;
                        Cl.suspense = void 0 === t ? null : t;
                        try {
                            o(e)
                        } finally {
                            Cl.suspense = n
                        }
                    }), [e, t]), r
                },
                useTransition: function(e) {
                    var t = pp(dp),
                        n = t[0];
                    return t = t[1], [Dp(Ip.bind(null, t, e), [t, e]), n]
                }
            }, jl = null, Vl = null, Hl = !1, ql = Ti.ReactCurrentOwner, zl = !1, Gl = {
                dehydrated: null,
                retryTime: 0
            }, $l = function(e, t) {
                for (var n = t.child; null !== n;) {
                    if (5 === n.tag || 6 === n.tag) e.appendChild(n.stateNode);
                    else if (4 !== n.tag && null !== n.child) {
                        n.child.return = n, n = n.child;
                        continue
                    }
                    if (n === t) break;
                    for (; null === n.sibling;) {
                        if (null === n.return || n.return === t) return;
                        n = n.return
                    }
                    n.sibling.return = n.return, n = n.sibling
                }
            }, Wl = function() {}, Yl = function(e, t, n, r, o) {
                var i = e.memoizedProps;
                if (i !== r) {
                    var a, s, l = t.stateNode;
                    switch (Zf(kl.current), e = null, n) {
                        case "input":
                            i = _c(l, i), r = _c(l, r), e = [];
                            break;
                        case "option":
                            i = Ec(l, i), r = Ec(l, r), e = [];
                            break;
                        case "select":
                            i = ti({}, i, {
                                value: void 0
                            }), r = ti({}, r, {
                                value: void 0
                            }), e = [];
                            break;
                        case "textarea":
                            i = Tc(l, i), r = Tc(l, r), e = [];
                            break;
                        default:
                            "function" != typeof i.onClick && "function" == typeof r.onClick && (l.onclick = wd)
                    }
                    for (a in vd(n, r), n = null, i)
                        if (!r.hasOwnProperty(a) && i.hasOwnProperty(a) && null != i[a])
                            if ("style" === a)
                                for (s in l = i[a]) l.hasOwnProperty(s) && (n || (n = {}), n[s] = "");
                            else "dangerouslySetInnerHTML" !== a && "children" !== a && "suppressContentEditableWarning" !== a && "suppressHydrationWarning" !== a && "autoFocus" !== a && (hi.hasOwnProperty(a) ? e || (e = []) : (e = e || []).push(a, null));
                    for (a in r) {
                        var u = r[a];
                        if (l = null != i ? i[a] : void 0, r.hasOwnProperty(a) && u !== l && (null != u || null != l))
                            if ("style" === a)
                                if (l) {
                                    for (s in l) !l.hasOwnProperty(s) || u && u.hasOwnProperty(s) || (n || (n = {}), n[s] = "");
                                    for (s in u) u.hasOwnProperty(s) && l[s] !== u[s] && (n || (n = {}), n[s] = u[s])
                                } else n || (e || (e = []), e.push(a, n)), n = u;
                        else "dangerouslySetInnerHTML" === a ? (u = u ? u.__html : void 0, l = l ? l.__html : void 0, null != u && l !== u && (e = e || []).push(a, u)) : "children" === a ? l === u || "string" != typeof u && "number" != typeof u || (e = e || []).push(a, "" + u) : "suppressContentEditableWarning" !== a && "suppressHydrationWarning" !== a && (hi.hasOwnProperty(a) ? (null != u && yd(o, a), e || l === u || (e = [])) : (e = e || []).push(a, u))
                    }
                    n && (e = e || []).push("style", n), o = e, (t.updateQueue = o) && (t.effectTag |= 4)
                }
            }, Jl = function(e, t, n, r) {
                n !== r && (t.effectTag |= 4)
            }, Ql = "function" == typeof WeakSet ? WeakSet : Set, Kl = "function" == typeof WeakMap ? WeakMap : Map, Xl = Math.ceil, Zl = Ti.ReactCurrentDispatcher, eu = Ti.ReactCurrentOwner, nu = 8, ru = 16, ou = 32, au = 1, su = 2, lu = 3, uu = 4, cu = 5, du = tu = 0, fu = null, pu = null, hu = 0, gu = iu = 0, mu = null, vu = 1073741823, bu = 1073741823, yu = null, wu = 0, _u = !1, Su = 0, xu = 500, Pu = null, ku = !1, Du = null, Eu = null, Iu = !1, Tu = null, Cu = 90, Fu = null, Au = 0, Ou = null, Mu = 0, Ru = function(e, t, n) {
                var r = t.expirationTime;
                if (null !== e) {
                    var o = t.pendingProps;
                    if (e.memoizedProps !== o || $s.current) zl = !0;
                    else {
                        if (r < n) {
                            switch (zl = !1, t.tag) {
                                case 3:
                                    zp(t), Rp();
                                    break;
                                case 5:
                                    if (np(t), 4 & t.mode && 1 !== n && o.hidden) return t.expirationTime = t.childExpirationTime = 1, null;
                                    break;
                                case 1:
                                    bf(t.type) && Sf(t);
                                    break;
                                case 4:
                                    ep(t, t.stateNode.containerInfo);
                                    break;
                                case 10:
                                    r = t.memoizedProps.value, o = t.type._context, mf(pl, o._currentValue), o._currentValue = r;
                                    break;
                                case 13:
                                    if (null !== t.memoizedState) return 0 !== (r = t.child.childExpirationTime) && r >= n ? Gp(e, t, n) : (mf(Il, 1 & Il.current), null !== (t = Jp(e, t, n)) ? t.sibling : null);
                                    mf(Il, 1 & Il.current);
                                    break;
                                case 19:
                                    if (r = t.childExpirationTime >= n, 0 != (64 & e.effectTag)) {
                                        if (r) return Yp(e, t, n);
                                        t.effectTag |= 64
                                    }
                                    if (null !== (o = t.memoizedState) && (o.rendering = null, o.tail = null), mf(Il, Il.current), !r) return null
                            }
                            return Jp(e, t, n)
                        }
                        zl = !1
                    }
                } else zl = !1;
                switch (t.expirationTime = 0, t.tag) {
                    case 2:
                        if (r = t.type, null !== e && (e.alternate = null, t.alternate = null, t.effectTag |= 2), e = t.pendingProps, o = vf(t, Gs.current), Nf(t, n), o = lp(null, t, r, e, o, n), t.effectTag |= 1, "object" == typeof o && null !== o && "function" == typeof o.render && void 0 === o.$$typeof) {
                            if (t.tag = 1, t.memoizedState = null, t.updateQueue = null, bf(r)) {
                                var i = !0;
                                Sf(t)
                            } else i = !1;
                            t.memoizedState = null !== o.state && void 0 !== o.state ? o.state : null, Bf(t);
                            var a = r.getDerivedStateFromProps;
                            "function" == typeof a && Gf(t, r, a, e), o.updater = wl, t.stateNode = o, o._reactInternalFiber = t, Jf(t, r, e, n), t = qp(null, t, r, !0, i, n)
                        } else t.tag = 0, Np(null, t, o, n), t = t.child;
                        return t;
                    case 16:
                        e: {
                            if (o = t.elementType, null !== e && (e.alternate = null, t.alternate = null, t.effectTag |= 2), e = t.pendingProps, function(e) {
                                    if (-1 === e._status) {
                                        e._status = 0;
                                        var t = e._ctor;
                                        t = t(), e._result = t, t.then((function(t) {
                                            0 === e._status && (t = t.default, e._status = 1, e._result = t)
                                        }), (function(t) {
                                            0 === e._status && (e._status = 2, e._result = t)
                                        }))
                                    }
                                }(o), 1 !== o._status) throw o._result;
                            switch (o = o._result, t.type = o, i = t.tag = function(e) {
                                    if ("function" == typeof e) return Yh(e) ? 1 : 0;
                                    if (null != e) {
                                        if ((e = e.$$typeof) === ji) return 11;
                                        if (e === qi) return 14
                                    }
                                    return 2
                                }(o), e = Af(o, e), i) {
                                case 0:
                                    t = Vp(null, t, o, e, n);
                                    break e;
                                case 1:
                                    t = Hp(null, t, o, e, n);
                                    break e;
                                case 11:
                                    t = Up(null, t, o, e, n);
                                    break e;
                                case 14:
                                    t = Bp(null, t, o, Af(o.type, e), r, n);
                                    break e
                            }
                            throw Error(Qu(306, o, ""))
                        }
                        return t;
                    case 0:
                        return r = t.type, o = t.pendingProps, Vp(e, t, r, o = t.elementType === r ? o : Af(r, o), n);
                    case 1:
                        return r = t.type, o = t.pendingProps, Hp(e, t, r, o = t.elementType === r ? o : Af(r, o), n);
                    case 3:
                        if (zp(t), r = t.updateQueue, null === e || null === r) throw Error(Qu(282));
                        if (r = t.pendingProps, o = null !== (o = t.memoizedState) ? o.element : null, Lf(e, t), qf(t, r, null, n), (r = t.memoizedState.element) === o) Rp(), t = Jp(e, t, n);
                        else {
                            if ((o = t.stateNode.hydrate) && (Vl = Td(t.stateNode.containerInfo.firstChild), jl = t, o = Hl = !0), o)
                                for (n = xl(t, null, r, n), t.child = n; n;) n.effectTag = -3 & n.effectTag | 1024, n = n.sibling;
                            else Np(e, t, r, n), Rp();
                            t = t.child
                        }
                        return t;
                    case 5:
                        return np(t), null === e && Ap(t), r = t.type, o = t.pendingProps, i = null !== e ? e.memoizedProps : null, a = o.children, Id(r, o) ? a = null : null !== i && Id(r, i) && (t.effectTag |= 16), jp(e, t), 4 & t.mode && 1 !== n && o.hidden ? (t.expirationTime = t.childExpirationTime = 1, t = null) : (Np(e, t, a, n), t = t.child), t;
                    case 6:
                        return null === e && Ap(t), null;
                    case 13:
                        return Gp(e, t, n);
                    case 4:
                        return ep(t, t.stateNode.containerInfo), r = t.pendingProps, null === e ? t.child = Sl(t, null, r, n) : Np(e, t, r, n), t.child;
                    case 11:
                        return r = t.type, o = t.pendingProps, Up(e, t, r, o = t.elementType === r ? o : Af(r, o), n);
                    case 7:
                        return Np(e, t, t.pendingProps, n), t.child;
                    case 8:
                    case 12:
                        return Np(e, t, t.pendingProps.children, n), t.child;
                    case 10:
                        e: {
                            r = t.type._context,
                            o = t.pendingProps,
                            a = t.memoizedProps,
                            i = o.value;
                            var s = t.type._context;
                            if (mf(pl, s._currentValue), s._currentValue = i, null !== a)
                                if (s = a.value, 0 === (i = Ss(s, i) ? 0 : 0 | ("function" == typeof r._calculateChangedBits ? r._calculateChangedBits(s, i) : 1073741823))) {
                                    if (a.children === o.children && !$s.current) {
                                        t = Jp(e, t, n);
                                        break e
                                    }
                                } else
                                    for (null !== (s = t.child) && (s.return = t); null !== s;) {
                                        var l = s.dependencies;
                                        if (null !== l) {
                                            a = s.child;
                                            for (var u = l.firstContext; null !== u;) {
                                                if (u.context === r && 0 != (u.observedBits & i)) {
                                                    1 === s.tag && ((u = jf(n, null)).tag = 2, Vf(s, u)), s.expirationTime < n && (s.expirationTime = n), null !== (u = s.alternate) && u.expirationTime < n && (u.expirationTime = n), Rf(s.return, n), l.expirationTime < n && (l.expirationTime = n);
                                                    break
                                                }
                                                u = u.next
                                            }
                                        } else a = 10 === s.tag && s.type === t.type ? null : s.child;
                                        if (null !== a) a.return = s;
                                        else
                                            for (a = s; null !== a;) {
                                                if (a === t) {
                                                    a = null;
                                                    break
                                                }
                                                if (null !== (s = a.sibling)) {
                                                    s.return = a.return, a = s;
                                                    break
                                                }
                                                a = a.return
                                            }
                                        s = a
                                    }
                            Np(e, t, o.children, n),
                            t = t.child
                        }
                        return t;
                    case 9:
                        return o = t.type, r = (i = t.pendingProps).children, Nf(t, n), r = r(o = Uf(o, i.unstable_observedBits)), t.effectTag |= 1, Np(e, t, r, n), t.child;
                    case 14:
                        return i = Af(o = t.type, t.pendingProps), Bp(e, t, o, i = Af(o.type, i), r, n);
                    case 15:
                        return Lp(e, t, t.type, t.pendingProps, r, n);
                    case 17:
                        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Af(r, o), null !== e && (e.alternate = null, t.alternate = null, t.effectTag |= 2), t.tag = 1, bf(r) ? (e = !0, Sf(t)) : e = !1, Nf(t, n), Wf(t, r, o), Jf(t, r, o, n), qp(null, t, r, !0, e, n);
                    case 19:
                        return Yp(e, t, n)
                }
                throw Error(Qu(156, t.tag))
            }, Nu = null, Uu = null, ug.prototype.render = function(e) {
                ig(e, this._internalRoot, null, null)
            }, ug.prototype.unmount = function() {
                var e = this._internalRoot,
                    t = e.containerInfo;
                ig(null, e, null, (function() {
                    t[za] = null
                }))
            }, sa = function(e) {
                if (13 === e.tag) {
                    var t = Ff(vh(), 150, 100);
                    yh(e, t), lg(e, t)
                }
            }, la = function(e) {
                13 === e.tag && (yh(e, 3), lg(e, 3))
            }, ua = function(e) {
                if (13 === e.tag) {
                    var t = vh();
                    yh(e, t = bh(t, e, null)), lg(e, t)
                }
            }, vi = function(e, t, n) {
                switch (t) {
                    case "input":
                        if (Pc(e, n), t = n.name, "radio" === n.type && null != t) {
                            for (n = e; n.parentNode;) n = n.parentNode;
                            for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
                                var r = n[t];
                                if (r !== e && r.form === e.form) {
                                    var o = Md(r);
                                    if (!o) throw Error(Qu(90));
                                    wc(r), Pc(r, o)
                                }
                            }
                        }
                        break;
                    case "textarea":
                        Fc(e, n);
                        break;
                    case "select":
                        null != (t = n.value) && Ic(e, !!n.multiple, t, !1)
                }
            }, ac = kh, sc = function(e, t, n, r, o) {
                var i = du;
                du |= 4;
                try {
                    return Df(98, e.bind(null, t, n, r, o))
                } finally {
                    (du = i) === tu && Tf()
                }
            }, lc = function() {
                (du & (1 | ru | ou)) === tu && (function() {
                    if (null !== Fu) {
                        var e = Fu;
                        Fu = null, e.forEach((function(e, t) {
                            og(t, e), Sh(t)
                        })), Tf()
                    }
                }(), jh())
            }, wi = function(e, t) {
                var n = du;
                du |= 2;
                try {
                    return e(t)
                } finally {
                    (du = n) === tu && Tf()
                }
            }, Bu = {
                Events: [Ad, Od, Md, nc, pi, Vd, function(e) {
                    zc(e, jd)
                }, oc, ic, pd, $c, jh, {
                    current: !1
                }]
            },
            function(e) {
                var t = e.findFiberByHostInstance;
                (function(e) {
                    if ("undefined" == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) return !1;
                    var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
                    if (t.isDisabled || !t.supportsFiber) return !0;
                    try {
                        var n = t.inject(e);
                        Nu = function(e) {
                            try {
                                t.onCommitFiberRoot(n, e, void 0, 64 == (64 & e.current.effectTag))
                            } catch (e) {}
                        }, Uu = function(e) {
                            try {
                                t.onCommitFiberUnmount(n, e)
                            } catch (e) {}
                        }
                    } catch (e) {}
                })(ti({}, e, {
                    overrideHookState: null,
                    overrideProps: null,
                    setSuspenseHandler: null,
                    scheduleUpdate: null,
                    currentDispatcherRef: Ti.ReactCurrentDispatcher,
                    findHostInstanceByFiber: function(e) {
                        return null === (e = Hc(e)) ? null : e.stateNode
                    },
                    findFiberByHostInstance: function(e) {
                        return t ? t(e) : null
                    },
                    findHostInstancesForRefresh: null,
                    scheduleRefresh: null,
                    scheduleRoot: null,
                    setRefreshHandler: null,
                    getCurrentFiber: null
                }))
            }({
                findFiberByHostInstance: Fd,
                bundleType: 0,
                version: "16.13.1",
                rendererPackageName: "react-dom"
            }), Lu = Bu, Zo.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Lu, ju = pg, Zo.createPortal = ju, Vu = function(e) {
                if (null == e) return null;
                if (1 === e.nodeType) return e;
                var t = e._reactInternalFiber;
                if (void 0 === t) {
                    if ("function" == typeof e.render) throw Error(Qu(188));
                    throw Error(Qu(268, Object.keys(e)))
                }
                return e = null === (e = Hc(t)) ? null : e.stateNode
            }, Zo.findDOMNode = Vu, Hu = function(e, t) {
                if ((du & (ru | ou)) !== tu) throw Error(Qu(187));
                var n = du;
                du |= 1;
                try {
                    return Df(99, e.bind(null, t))
                } finally {
                    du = n, Tf()
                }
            }, Zo.flushSync = Hu, qu = function(e, t, n) {
                if (!cg(t)) throw Error(Qu(200));
                return dg(null, e, t, !0, n)
            }, Zo.hydrate = qu, zu = function(e, t, n) {
                if (!cg(t)) throw Error(Qu(200));
                return dg(null, e, t, !1, n)
            }, Zo.render = zu, Gu = function(e) {
                if (!cg(e)) throw Error(Qu(40));
                return !!e._reactRootContainer && (Dh((function() {
                    dg(null, null, e, !1, (function() {
                        e._reactRootContainer = null, e[za] = null
                    }))
                })), !0)
            }, Zo.unmountComponentAtNode = Gu, $u = kh, Zo.unstable_batchedUpdates = $u, Wu = function(e, t) {
                return pg(e, t, 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null)
            }, Zo.unstable_createPortal = Wu, Yu = function(e, t, n, r) {
                if (!cg(n)) throw Error(Qu(200));
                if (null == e || void 0 === e._reactInternalFiber) throw Error(Qu(38));
                return dg(e, t, n, !1, r)
            }, Zo.unstable_renderSubtreeIntoContainer = Yu, "16.13.1", Zo.version = "16.13.1"
    }
    var gg, mg = {};
    ! function e() {
        if ("undefined" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE) try {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e)
        } catch (e) {
            console.error(e)
        }
    }(), Ju || (Ju = !0, hg()), mg = Zo, r({}, "unstable_batchedUpdates", (function() {
        return mg.unstable_batchedUpdates
    })), gg = mg.unstable_batchedUpdates, an = gg;
    const vg = e => t => Wr(((t, n) => e(t, n)), null, null, {
            forwardRef: !0
        })(t),
        bg = function(...e) {
            Se.dispatch(this, e)
        };

    function yg(e, t) {
        return t.type = e, t.dispatch = bg, t
    }
    const wg = Symbol("isProxy"),
        _g = Symbol("isProxifiedArray");
    let Sg = !1;

    function xg(e) {
        if (Array.isArray(e)) {
            const t = e.map(xg);
            return t[_g] = !0, t
        }
        if ("[object Object]" !== Object.prototype.toString.call(e)) return e;
        const t = {
                ...e
            },
            n = new Set,
            r = new Proxy(t, {
                get: function(e, r) {
                    if (r in t) return Sg && !n.has(r) && (t[r] = xg(t[r]), n.add(r)), t[r]
                },
                set: function(e, n, r) {
                    return t[n] = r, !0
                },
                deleteProperty: function(e, n) {
                    return delete t[n], !0
                }
            });
        return r[wg] = !0, r
    }

    function Pg(e) {
        if (e && e[_g]) return delete e[_g], e.map(Pg);
        if (Array.isArray(e) && e.forEach(((t, n) => {
                t && t[wg] && (e[n] = Pg(t))
            })), !e || !e[wg]) return e;
        const t = {};
        for (const n in e) t[n] = Pg(e[n]);
        return t
    }
    const kg = yg("influx.set-state", ((e, t) => t));
    var Dg = {
            model: Se,
            influx: vg,
            action: yg,
            transaction: function(e) {
                const t = function(e, t) {
                    const n = xg(e),
                        r = Sg;
                    return Sg = !0, t(n), Sg = r, Pg(n)
                }(Se.state, e);
                kg.dispatch(t)
            },
            connect: vg
        },
        Eg = {
            fetch: Og,
            fetchText: async function(...e) {
                const t = await Og(...e);
                return await t.text()
            },
            fetchJson: async function(...e) {
                const t = await Og(...e);
                return await t.json()
            },
            getCache: function() {
                return Ig
            },
            cleanCache: function() {
                Mg("cleaning fetcher cache"), Ig = []
            },
            ignoreCache: function(e = 1) {
                Tg += e
            },
            isIgnoreCache: function() {
                return Tg > 0
            }
        };
    let Ig = [],
        Tg = 0;
    const Cg = 2e4,
        Fg = 864e5,
        Ag = !1;
    async function Og(e, t = {}, n = Cg) {
        return new Promise(((r, o) => {
            (async () => {
                let i = setTimeout((() => {
                    i && (i = null, o({
                        message: "Timed out"
                    }))
                }), n);
                try {
                    const n = await async function(e, t) {
                        if (Mg(`fetching ${e}`), (t = t || {}).method = t.method || "GET", t.method && "GET" !== t.method) return fetch(e, t);
                        if (Tg <= 0) {
                            const t = Date.now();
                            Ig = Ig.filter((e => t - e.on < Fg));
                            const n = Ig.find((t => t.url === e));
                            if (n) return Mg("  fetch cache hit"), n.res.clone()
                        } else Mg("  ignoring fetch cache");
                        Tg > 0 && Tg--;
                        const n = await fetch(e, t);
                        return Ig.push({
                            url: e,
                            on: Date.now(),
                            res: n.clone()
                        }), n
                    }(e, {
                        credentials: "include",
                        ...t
                    });
                    if (!i) return;
                    if (clearTimeout(i), i = null, n.ok) return void r(n);
                    if (400 !== n.status) return void o({
                        message: String(n.status)
                    });
                    try {
                        const e = await n.text();
                        o({
                            message: String(n.status),
                            body: e
                        })
                    } catch (e) {
                        o({
                            message: String(n.status),
                            body: null
                        })
                    }
                } catch (e) {
                    if (!i) return;
                    clearTimeout(i), i = null, o(e)
                }
            })()
        }))
    }

    function Mg(e) {
        Ag && console.log(`%c${e}`, "color: #00ec91")
    }
    var Rg = Eg;
    const Ng = "https://www.instagram.com/",
        Ug = {
            maxMentions: 30,
            base: Ng,
            challenge: '<link rel="alternate" href="https://www.instagram.com/challenge/',
            scriptPath: {
                followings: {
                    regexp: [/(?:src|href)="\/(static\/bundles\/[\S]+\/Consumer\.js\/[\S]+)"/i, /(?:src|href)="\/\/www.instagram.com\/(static\/bundles\/[\S]+\/Consumer\.js\/[\S]+)"/i, /(?:src|href)="\/\/z-p3.www.instagram.com\/(static\/bundles\/[\S]+\/Consumer\.js\/[\S]+)"/i]
                },
                followers: {
                    regexp: [/(?:src|href)="\/(static\/bundles\/[\S]+\/Consumer\.js\/[\S]+)"/i, /(?:src|href)="\/\/www.instagram.com\/(static\/bundles\/[\S]+\/Consumer\.js\/[\S]+)"/i, /(?:src|href)="\/\/z-p3.www.instagram.com\/(static\/bundles\/[\S]+\/Consumer\.js\/[\S]+)"/i]
                },
                timeline: {
                    regexp: [/(?:src|href)="\/(static\/bundles\/[\S]+\/ConsumerLibCommons\.js\/[\S]+)"/i, /(?:src|href)="\/\/www.instagram.com\/(static\/bundles\/[\S]+\/ConsumerLibCommons\.js\/[\S]+)"/i, /(?:src|href)="\/\/z-p3.www.instagram.com\/(static\/bundles\/[\S]+\/ConsumerLibCommons\.js\/[\S]+)"/i]
                },
                "user-posts": {
                    regexp: [/(?:src|href)="\/(static\/bundles\/[\S]+\/Consumer\.js\/[\S]+)"/i, /(?:src|href)="\/\/www.instagram.com\/(static\/bundles\/[\S]+\/Consumer\.js\/[\S]+)"/i, /(?:src|href)="\/\/z-p3.www.instagram.com\/(static\/bundles\/[\S]+\/Consumer\.js\/[\S]+)"/i]
                }
            },
            queryHash: {
                followings: {
                    regexp: [/,o="([\dabcdef]{32})",u=1/, /,s="([\dabcdef]{32})",f=1/, /,l="([\dabcdef]{32})",s=1/, /,l="([\dabcdef]{32})",u=1/, /,n="([\dabcdef]{32})",u=1/]
                },
                followers: {
                    regexp: [/\),u="([\dabcdef]{32})",l="/, /\),c="([\dabcdef]{32})",l="/, /\),l="([\dabcdef]{32})",s="/, /\),a="([\dabcdef]{32})",l="/, /;var n="([\dabcdef]{32})",o="/, /;var t="([\dabcdef]{32})",n="/, /;const c="([\dabcdef]{32})",l="/, /;const s="([\dabcdef]{32})",l="/, /;const t="([\dabcdef]{32})",n="/]
                },
                timeline: {
                    regexp: [/,e\.FEED_QUERY_ID="([\dabcdef]{32})",/]
                },
                "user-posts": {
                    regexp: [/l.pagination},queryId:"([\dabcdef]{32})",/, /c.pagination},queryId:"([\dabcdef]{32})",/]
                }
            },
            sharedData: {
                prefix: '<script type="text/javascript">window._sharedData =',
                suffix: ";<\/script>"
            },
            additionalData: {
                prefix: '<script type="text/javascript">window.__additionalDataLoaded(',
                suffix: ");<\/script>"
            },
            home: {
                url: Ng
            },
            loginActivity: {
                url: "https://i.instagram.com/api/v1/session/login_activity/?__a=1"
            },
            post: {
                url: e => `https://www.instagram.com/p/${e}/`
            },
            hashtag: {
                url: (e, {
                    json: t = !1
                } = {}) => t ? O("https://i.instagram.com/api/v1/tags/web_info", {
                    tag_name: e
                }) : `https://www.instagram.com/explore/tags/${e}/`
            },
            explore: {
                url: "https://www.instagram.com/explore/grid/"
            },
            user: {
                url: (e = null) => e ? `https://www.instagram.com/${e}/` : Ng
            },
            userPage: {
                url: e => `https://www.instagram.com/${e}/`
            },
            editAccount: {
                url: "https://www.instagram.com/accounts/edit/"
            },
            rootTagPosts: {
                url: e => `https://www.instagram.com/explore/tags/${e.toLowerCase()}/`
            },
            rootTimelinePosts: {
                url: (e, t) => {
                    const n = JSON.stringify({
                        cached_feed_item_ids: [],
                        fetch_media_item_count: 12,
                        fetch_media_item_cursor: null,
                        fetch_comment_count: 4,
                        fetch_like: 3,
                        has_stories: !1,
                        has_threaded_comments: !0
                    });
                    return `https://www.instagram.com/graphql/query/?${t&&t.timeline?`query_hash=${t.timeline}`:"query_hash=6b838488258d7a4820e48d209ef79eb1"}&variables=${encodeURI(n)}`
                }
            },
            moreTimelinePosts: {
                url: (e, t) => {
                    const n = JSON.stringify(t || {
                        cached_feed_item_ids: [],
                        fetch_media_item_count: 12,
                        fetch_media_item_cursor: e.lastCursor,
                        fetch_comment_count: 4,
                        fetch_like: 3,
                        has_stories: !1,
                        has_threaded_comments: !0
                    });
                    return `https://www.instagram.com/graphql/query/?${e.queryHash&&e.queryHash.timeline?`query_hash=${e.queryHash.timeline}`:"query_hash=6b838488258d7a4820e48d209ef79eb1"}&variables=${encodeURI(n)}`
                }
            },
            rootUserPosts: {
                url: e => {
                    const t = JSON.stringify({
                        id: e,
                        first: 50,
                        after: null
                    });
                    return `https://www.instagram.com/graphql/query/?query_hash=003056d32c2554def87228bc3fd9668a&variables=${encodeURI(t)}`
                }
            },
            moreUserPosts: {
                url: (e, t) => {
                    const n = JSON.stringify(t || {
                        id: e.userId,
                        first: 50,
                        after: e.lastCursor
                    });
                    return `https://www.instagram.com/graphql/query/?query_hash=003056d32c2554def87228bc3fd9668a&variables=${encodeURI(n)}`
                }
            },
            rootUserFollowers: {
                url: (e, t) => {
                    const n = JSON.stringify({
                        id: e,
                        first: 24,
                        include_reel: !0,
                        fetch_mutual: !1
                    });
                    return `https://www.instagram.com/graphql/query/?${t&&t.followers?`query_hash=${t.followers}`:"query_hash=c76146de99bb02f6415203be841dd25a"}&variables=${encodeURI(n)}`
                }
            },
            moreUserFollowers: {
                url: (e, t) => {
                    const n = JSON.stringify(t || {
                        id: e.userId,
                        first: 50,
                        after: e.lastCursor,
                        include_reel: !0,
                        fetch_mutual: !1
                    });
                    return `https://www.instagram.com/graphql/query/?${e.queryHash&&e.queryHash.followers?`query_hash=${e.queryHash.followers}`:"query_hash=c76146de99bb02f6415203be841dd25a"}&variables=${encodeURI(n)}`
                }
            },
            rootUserFollowings: {
                url: (e, t) => {
                    const n = JSON.stringify({
                        id: e,
                        first: 24,
                        include_reel: !0,
                        fetch_mutual: !1
                    });
                    return `https://www.instagram.com/graphql/query/?${t&&t.followings?`query_hash=${t.followings}`:"query_hash=d04b0a864b4b54837c0d870b0e77e076"}&variables=${encodeURI(n)}`
                }
            },
            moreUserFollowings: {
                url: (e, t) => {
                    const n = JSON.stringify(t || {
                        id: e.userId,
                        first: 50,
                        after: e.lastCursor,
                        include_reel: !0,
                        fetch_mutual: !1
                    });
                    return `https://www.instagram.com/graphql/query/?${e.queryHash&&e.queryHash.followings?`query_hash=${e.queryHash.followings}`:"query_hash=d04b0a864b4b54837c0d870b0e77e076"}&variables=${encodeURI(n)}`
                }
            },
            logout: {
                url: "https://www.instagram.com/accounts/logout"
            },
            login: {
                link: '<link rel="canonical" href="https://www.instagram.com/accounts/login/',
                url: "https://www.instagram.com/accounts/login/?source=auth_switcher"
            },
            locale: {
                url: Ng,
                regexp: /"locale":"([^"]+)"/
            }
        },
        Bg = {
            min: 1e3,
            max: 6e3
        },
        Lg = {
            min: 600,
            max: 7e3
        };
    var jg = {},
        Vg = {
            on: function(e, t) {
                Gg();
                (Hg[e] || (Hg[e] = [])).push(t)
            },
            off: function(e, t) {
                const n = Hg[e];
                if (!n) return;
                for (;;) {
                    const e = n.findIndex((e => e === t));
                    if (-1 === e) break;
                    n.splice(e, 1)
                }
            },
            send: function(e, ...t) {
                let n;
                const r = t[t.length - 1];
                "function" == typeof r ? (n = r, t = t.slice(0, -1)) : n = null;
                return new Promise((r => {
                    chrome.runtime.sendMessage({
                        [qg]: e,
                        [zg]: t
                    }, (e => {
                        chrome.runtime.lastError || (n && n(e), r(e))
                    }))
                }))
            }
        };
    const Hg = {},
        qg = "__$chromeBus.name",
        zg = "__$chromeBus.args";

    function Gg() {
        const e = Gg;
        e.init || (e.init = !0, chrome.runtime.onMessage.addListener(((e, t, n) => {
            const r = e["__$chromeBus.name"];
            if (!r) return !1;
            const o = e["__$chromeBus.args"] || [],
                i = Hg[r] || [];
            return 0 !== i.length && ((async () => {
                const e = await Promise.all(i.map((e => e(...o)))),
                    t = e[e.length - 1];
                n(t)
            })(), !!n)
        })))
    }
    var $g = Vg,
        Wg = {};
    const {
        model: Yg
    } = Dg, Jg = {
        isLoggedIn: function() {
            return !!Yg.state.billing.account.token
        },
        hasPro: function({
            feature: e
        } = {}) {
            var t;
            return !(!u.is.development || !(null === (t = Yg.state.experiments) || void 0 === t ? void 0 : t.enabled)) || (!!Jg.hasProPaid() || (!!Jg.hasProPromocode() || !(!e || !Jg.hasTrialFeature(e))))
        },
        hasTrialFeature: function(e = "*") {
            if (!u.features.trial) return !1;
            const t = Yg.state.billing.trial;
            if (!t) return !1;
            if ("*" === e) {
                for (e in t)
                    if (u.options.trialFeaturesLimits[e] && u.options.trialFeaturesLimits[e](t)) return !1;
                return !0
            }
            return !!e && (!u.options.trialFeaturesLimits[e] || !u.options.trialFeaturesLimits[e](t))
        },
        hasProPaid: function(e = null) {
            if (!Jg.isLoggedIn()) return !1;
            const t = Yg.state.billing,
                n = Date.now(),
                r = t.optimistic || {
                    on: 0,
                    plan: null
                };
            if (r.plan === e && r.on <= n && n - r.on <= 36e5) return !0;
            for (const r in u.options.billingPlans) {
                if (e && e !== r) continue;
                const a = u.options.billingPlans[r];
                if (a.isActive) {
                    if (a.isActive(Yg.state)) return !0
                } else if ("subscription" === a.type) {
                    var o;
                    const e = (null === (o = t.subscriptions) || void 0 === o ? void 0 : o[r]) || {};
                    if ("active" === e.state) return !0;
                    if ("canceled" === e.state && n <= e.next) return !0
                } else if ("product" === a.type) {
                    var i;
                    if (((null === (i = t.products) || void 0 === i ? void 0 : i[r]) || 0) > 0) return !0
                }
            }
            return !1
        },
        hasProPromocode: function() {
            const e = Yg.state.billing.promocode;
            if (!e) return !1;
            const t = Date.now(),
                [n, r, o] = e.split("."),
                i = new Date(`${r}-${n}-${o}`);
            return i.setHours(23), i.setMinutes(59), i.setSeconds(59), i.getTime() >= t
        },
        fspringExpirationDate: function(e) {
            if (!e) return null;
            const t = Yg.state.billing,
                n = t.subscriptions && t.subscriptions[e] || {};
            return n.active && "canceled" === n.state ? new Date(n.next).toLocaleDateString() : null
        }
    };
    var Qg, Kg, Xg, Zg = {},
        em = Qg = {};

    function tm() {
        throw new Error("setTimeout has not been defined")
    }

    function nm() {
        throw new Error("clearTimeout has not been defined")
    }

    function rm(e) {
        if (Kg === setTimeout) return setTimeout(e, 0);
        if ((Kg === tm || !Kg) && setTimeout) return Kg = setTimeout, setTimeout(e, 0);
        try {
            return Kg(e, 0)
        } catch (t) {
            try {
                return Kg.call(null, e, 0)
            } catch (t) {
                return Kg.call(this, e, 0)
            }
        }
    }! function() {
        try {
            Kg = "function" == typeof setTimeout ? setTimeout : tm
        } catch (e) {
            Kg = tm
        }
        try {
            Xg = "function" == typeof clearTimeout ? clearTimeout : nm
        } catch (e) {
            Xg = nm
        }
    }();
    var om, im = [],
        am = !1,
        sm = -1;

    function lm() {
        am && om && (am = !1, om.length ? im = om.concat(im) : sm = -1, im.length && um())
    }

    function um() {
        if (!am) {
            var e = rm(lm);
            am = !0;
            for (var t = im.length; t;) {
                for (om = im, im = []; ++sm < t;) om && om[sm].run();
                sm = -1, t = im.length
            }
            om = null, am = !1,
                function(e) {
                    if (Xg === clearTimeout) return clearTimeout(e);
                    if ((Xg === nm || !Xg) && clearTimeout) return Xg = clearTimeout, clearTimeout(e);
                    try {
                        Xg(e)
                    } catch (t) {
                        try {
                            return Xg.call(null, e)
                        } catch (t) {
                            return Xg.call(this, e)
                        }
                    }
                }(e)
        }
    }

    function cm(e, t) {
        this.fun = e, this.array = t
    }

    function dm() {}
    em.nextTick = function(e) {
        var t = new Array(arguments.length - 1);
        if (arguments.length > 1)
            for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
        im.push(new cm(e, t)), 1 !== im.length || am || rm(um)
    }, cm.prototype.run = function() {
        this.fun.apply(null, this.array)
    }, em.title = "browser", em.browser = !0, em.env = {}, em.argv = [], em.version = "", em.versions = {}, em.on = dm, em.addListener = dm, em.once = dm, em.off = dm, em.removeListener = dm, em.removeAllListeners = dm, em.emit = dm, em.prependListener = dm, em.prependOnceListener = dm, em.listeners = function(e) {
        return []
    }, em.binding = function(e) {
        throw new Error("process.binding is not supported")
    }, em.cwd = function() {
        return "/"
    }, em.chdir = function(e) {
        throw new Error("process.chdir is not supported")
    }, em.umask = function() {
        return 0
    };
    var fm = Qg;
    /**
     * [js-sha256]{@link https://github.com/emn178/js-sha256}
     *
     * @version 0.9.0
     * @author Chen, Yi-Cyuan [emn178@gmail.com]
     * @copyright Chen, Yi-Cyuan 2014-2017
     * @license MIT
     */
    ! function() {
        var t = "input is invalid type",
            n = "object" == typeof window,
            r = n ? window : {};
        r.JS_SHA256_NO_WINDOW && (n = !1);
        var o = !n && "object" == typeof self,
            i = !r.JS_SHA256_NO_NODE_JS && "object" == typeof fm && fm.versions && fm.versions.node;
        i ? r = e : o && (r = self);
        var a = !r.JS_SHA256_NO_COMMON_JS && Zg,
            s = !r.JS_SHA256_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer,
            l = "0123456789abcdef".split(""),
            u = [-2147483648, 8388608, 32768, 128],
            c = [24, 16, 8, 0],
            d = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
            f = ["hex", "array", "digest", "arrayBuffer"],
            p = [];
        !r.JS_SHA256_NO_NODE_JS && Array.isArray || (Array.isArray = function(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        }), !s || !r.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView || (ArrayBuffer.isView = function(e) {
            return "object" == typeof e && e.buffer && e.buffer.constructor === ArrayBuffer
        });
        var h = function(e, t) {
                return function(n) {
                    return new y(t, !0).update(n)[e]()
                }
            },
            g = function(e) {
                var t = h("hex", e);
                i && (t = m(t, e)), t.create = function() {
                    return new y(e)
                }, t.update = function(e) {
                    return t.create().update(e)
                };
                for (var n = 0; n < f.length; ++n) {
                    var r = f[n];
                    t[r] = h(r, e)
                }
                return t
            },
            m = function(e, t) {},
            v = function(e, t) {
                return function(n, r) {
                    return new w(n, t, !0).update(r)[e]()
                }
            },
            b = function(e) {
                var t = v("hex", e);
                t.create = function(t) {
                    return new w(t, e)
                }, t.update = function(e, n) {
                    return t.create(e).update(n)
                };
                for (var n = 0; n < f.length; ++n) {
                    var r = f[n];
                    t[r] = v(r, e)
                }
                return t
            };

        function y(e, t) {
            t ? (p[0] = p[16] = p[1] = p[2] = p[3] = p[4] = p[5] = p[6] = p[7] = p[8] = p[9] = p[10] = p[11] = p[12] = p[13] = p[14] = p[15] = 0, this.blocks = p) : this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], e ? (this.h0 = 3238371032, this.h1 = 914150663, this.h2 = 812702999, this.h3 = 4144912697, this.h4 = 4290775857, this.h5 = 1750603025, this.h6 = 1694076839, this.h7 = 3204075428) : (this.h0 = 1779033703, this.h1 = 3144134277, this.h2 = 1013904242, this.h3 = 2773480762, this.h4 = 1359893119, this.h5 = 2600822924, this.h6 = 528734635, this.h7 = 1541459225), this.block = this.start = this.bytes = this.hBytes = 0, this.finalized = this.hashed = !1, this.first = !0, this.is224 = e
        }

        function w(e, n, r) {
            var o, i = typeof e;
            if ("string" === i) {
                var a, l = [],
                    u = e.length,
                    c = 0;
                for (o = 0; o < u; ++o)(a = e.charCodeAt(o)) < 128 ? l[c++] = a : a < 2048 ? (l[c++] = 192 | a >> 6, l[c++] = 128 | 63 & a) : a < 55296 || a >= 57344 ? (l[c++] = 224 | a >> 12, l[c++] = 128 | a >> 6 & 63, l[c++] = 128 | 63 & a) : (a = 65536 + ((1023 & a) << 10 | 1023 & e.charCodeAt(++o)), l[c++] = 240 | a >> 18, l[c++] = 128 | a >> 12 & 63, l[c++] = 128 | a >> 6 & 63, l[c++] = 128 | 63 & a);
                e = l
            } else {
                if ("object" !== i) throw new Error(t);
                if (null === e) throw new Error(t);
                if (s && e.constructor === ArrayBuffer) e = new Uint8Array(e);
                else if (!(Array.isArray(e) || s && ArrayBuffer.isView(e))) throw new Error(t)
            }
            e.length > 64 && (e = new y(n, !0).update(e).array());
            var d = [],
                f = [];
            for (o = 0; o < 64; ++o) {
                var p = e[o] || 0;
                d[o] = 92 ^ p, f[o] = 54 ^ p
            }
            y.call(this, n, r), this.update(f), this.oKeyPad = d, this.inner = !0, this.sharedMemory = r
        }
        y.prototype.update = function(e) {
            if (!this.finalized) {
                var n, r = typeof e;
                if ("string" !== r) {
                    if ("object" !== r) throw new Error(t);
                    if (null === e) throw new Error(t);
                    if (s && e.constructor === ArrayBuffer) e = new Uint8Array(e);
                    else if (!(Array.isArray(e) || s && ArrayBuffer.isView(e))) throw new Error(t);
                    n = !0
                }
                for (var o, i, a = 0, l = e.length, u = this.blocks; a < l;) {
                    if (this.hashed && (this.hashed = !1, u[0] = this.block, u[16] = u[1] = u[2] = u[3] = u[4] = u[5] = u[6] = u[7] = u[8] = u[9] = u[10] = u[11] = u[12] = u[13] = u[14] = u[15] = 0), n)
                        for (i = this.start; a < l && i < 64; ++a) u[i >> 2] |= e[a] << c[3 & i++];
                    else
                        for (i = this.start; a < l && i < 64; ++a)(o = e.charCodeAt(a)) < 128 ? u[i >> 2] |= o << c[3 & i++] : o < 2048 ? (u[i >> 2] |= (192 | o >> 6) << c[3 & i++], u[i >> 2] |= (128 | 63 & o) << c[3 & i++]) : o < 55296 || o >= 57344 ? (u[i >> 2] |= (224 | o >> 12) << c[3 & i++], u[i >> 2] |= (128 | o >> 6 & 63) << c[3 & i++], u[i >> 2] |= (128 | 63 & o) << c[3 & i++]) : (o = 65536 + ((1023 & o) << 10 | 1023 & e.charCodeAt(++a)), u[i >> 2] |= (240 | o >> 18) << c[3 & i++], u[i >> 2] |= (128 | o >> 12 & 63) << c[3 & i++], u[i >> 2] |= (128 | o >> 6 & 63) << c[3 & i++], u[i >> 2] |= (128 | 63 & o) << c[3 & i++]);
                    this.lastByteIndex = i, this.bytes += i - this.start, i >= 64 ? (this.block = u[16], this.start = i - 64, this.hash(), this.hashed = !0) : this.start = i
                }
                return this.bytes > 4294967295 && (this.hBytes += this.bytes / 4294967296 << 0, this.bytes = this.bytes % 4294967296), this
            }
        }, y.prototype.finalize = function() {
            if (!this.finalized) {
                this.finalized = !0;
                var e = this.blocks,
                    t = this.lastByteIndex;
                e[16] = this.block, e[t >> 2] |= u[3 & t], this.block = e[16], t >= 56 && (this.hashed || this.hash(), e[0] = this.block, e[16] = e[1] = e[2] = e[3] = e[4] = e[5] = e[6] = e[7] = e[8] = e[9] = e[10] = e[11] = e[12] = e[13] = e[14] = e[15] = 0), e[14] = this.hBytes << 3 | this.bytes >>> 29, e[15] = this.bytes << 3, this.hash()
            }
        }, y.prototype.hash = function() {
            var e, t, n, r, o, i, a, s, l, u = this.h0,
                c = this.h1,
                f = this.h2,
                p = this.h3,
                h = this.h4,
                g = this.h5,
                m = this.h6,
                v = this.h7,
                b = this.blocks;
            for (e = 16; e < 64; ++e) t = ((o = b[e - 15]) >>> 7 | o << 25) ^ (o >>> 18 | o << 14) ^ o >>> 3, n = ((o = b[e - 2]) >>> 17 | o << 15) ^ (o >>> 19 | o << 13) ^ o >>> 10, b[e] = b[e - 16] + t + b[e - 7] + n << 0;
            for (l = c & f, e = 0; e < 64; e += 4) this.first ? (this.is224 ? (i = 300032, v = (o = b[0] - 1413257819) - 150054599 << 0, p = o + 24177077 << 0) : (i = 704751109, v = (o = b[0] - 210244248) - 1521486534 << 0, p = o + 143694565 << 0), this.first = !1) : (t = (u >>> 2 | u << 30) ^ (u >>> 13 | u << 19) ^ (u >>> 22 | u << 10), r = (i = u & c) ^ u & f ^ l, v = p + (o = v + (n = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7)) + (h & g ^ ~h & m) + d[e] + b[e]) << 0, p = o + (t + r) << 0), t = (p >>> 2 | p << 30) ^ (p >>> 13 | p << 19) ^ (p >>> 22 | p << 10), r = (a = p & u) ^ p & c ^ i, m = f + (o = m + (n = (v >>> 6 | v << 26) ^ (v >>> 11 | v << 21) ^ (v >>> 25 | v << 7)) + (v & h ^ ~v & g) + d[e + 1] + b[e + 1]) << 0, t = ((f = o + (t + r) << 0) >>> 2 | f << 30) ^ (f >>> 13 | f << 19) ^ (f >>> 22 | f << 10), r = (s = f & p) ^ f & u ^ a, g = c + (o = g + (n = (m >>> 6 | m << 26) ^ (m >>> 11 | m << 21) ^ (m >>> 25 | m << 7)) + (m & v ^ ~m & h) + d[e + 2] + b[e + 2]) << 0, t = ((c = o + (t + r) << 0) >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10), r = (l = c & f) ^ c & p ^ s, h = u + (o = h + (n = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7)) + (g & m ^ ~g & v) + d[e + 3] + b[e + 3]) << 0, u = o + (t + r) << 0;
            this.h0 = this.h0 + u << 0, this.h1 = this.h1 + c << 0, this.h2 = this.h2 + f << 0, this.h3 = this.h3 + p << 0, this.h4 = this.h4 + h << 0, this.h5 = this.h5 + g << 0, this.h6 = this.h6 + m << 0, this.h7 = this.h7 + v << 0
        }, y.prototype.hex = function() {
            this.finalize();
            var e = this.h0,
                t = this.h1,
                n = this.h2,
                r = this.h3,
                o = this.h4,
                i = this.h5,
                a = this.h6,
                s = this.h7,
                u = l[e >> 28 & 15] + l[e >> 24 & 15] + l[e >> 20 & 15] + l[e >> 16 & 15] + l[e >> 12 & 15] + l[e >> 8 & 15] + l[e >> 4 & 15] + l[15 & e] + l[t >> 28 & 15] + l[t >> 24 & 15] + l[t >> 20 & 15] + l[t >> 16 & 15] + l[t >> 12 & 15] + l[t >> 8 & 15] + l[t >> 4 & 15] + l[15 & t] + l[n >> 28 & 15] + l[n >> 24 & 15] + l[n >> 20 & 15] + l[n >> 16 & 15] + l[n >> 12 & 15] + l[n >> 8 & 15] + l[n >> 4 & 15] + l[15 & n] + l[r >> 28 & 15] + l[r >> 24 & 15] + l[r >> 20 & 15] + l[r >> 16 & 15] + l[r >> 12 & 15] + l[r >> 8 & 15] + l[r >> 4 & 15] + l[15 & r] + l[o >> 28 & 15] + l[o >> 24 & 15] + l[o >> 20 & 15] + l[o >> 16 & 15] + l[o >> 12 & 15] + l[o >> 8 & 15] + l[o >> 4 & 15] + l[15 & o] + l[i >> 28 & 15] + l[i >> 24 & 15] + l[i >> 20 & 15] + l[i >> 16 & 15] + l[i >> 12 & 15] + l[i >> 8 & 15] + l[i >> 4 & 15] + l[15 & i] + l[a >> 28 & 15] + l[a >> 24 & 15] + l[a >> 20 & 15] + l[a >> 16 & 15] + l[a >> 12 & 15] + l[a >> 8 & 15] + l[a >> 4 & 15] + l[15 & a];
            return this.is224 || (u += l[s >> 28 & 15] + l[s >> 24 & 15] + l[s >> 20 & 15] + l[s >> 16 & 15] + l[s >> 12 & 15] + l[s >> 8 & 15] + l[s >> 4 & 15] + l[15 & s]), u
        }, y.prototype.toString = y.prototype.hex, y.prototype.digest = function() {
            this.finalize();
            var e = this.h0,
                t = this.h1,
                n = this.h2,
                r = this.h3,
                o = this.h4,
                i = this.h5,
                a = this.h6,
                s = this.h7,
                l = [e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e, t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, 255 & t, n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, 255 & n, r >> 24 & 255, r >> 16 & 255, r >> 8 & 255, 255 & r, o >> 24 & 255, o >> 16 & 255, o >> 8 & 255, 255 & o, i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, 255 & i, a >> 24 & 255, a >> 16 & 255, a >> 8 & 255, 255 & a];
            return this.is224 || l.push(s >> 24 & 255, s >> 16 & 255, s >> 8 & 255, 255 & s), l
        }, y.prototype.array = y.prototype.digest, y.prototype.arrayBuffer = function() {
            this.finalize();
            var e = new ArrayBuffer(this.is224 ? 28 : 32),
                t = new DataView(e);
            return t.setUint32(0, this.h0), t.setUint32(4, this.h1), t.setUint32(8, this.h2), t.setUint32(12, this.h3), t.setUint32(16, this.h4), t.setUint32(20, this.h5), t.setUint32(24, this.h6), this.is224 || t.setUint32(28, this.h7), e
        }, w.prototype = new y, w.prototype.finalize = function() {
            if (y.prototype.finalize.call(this), this.inner) {
                this.inner = !1;
                var e = this.array();
                y.call(this, this.is224, this.sharedMemory), this.update(this.oKeyPad), this.update(e), y.prototype.finalize.call(this)
            }
        };
        var _ = g();
        _.sha256 = _, _.sha224 = g(!0), _.sha256.hmac = b(), _.sha224.hmac = b(!0), a ? Zg = _ : (r.sha256 = _.sha256, r.sha224 = _.sha224)
    }();
    var pm = t(Zg);
    class hm {
        constructor(e = {}) {
            this.options = e
        }
        send(e, {
            params: t,
            query: n,
            body: r,
            method: o,
            headers: i,
            token: a
        } = {}) {
            if (!e) throw new Error("url parameter is mandatory");
            if (this.options.by && this.options.secret) {
                const e = this.options.by,
                    t = j.generate(),
                    r = hm._hash(this.options.secret, t);
                n = {
                    ...n,
                    by: e,
                    salt: t,
                    hash: r
                }
            }
            return o = o || (r ? "POST" : "GET"), r = JSON.stringify(r), e = `${this._inject(e,t)}?${this._encode(n)}`, this.options.urlPrefix && !e.startsWith("http") && (e = `${this.options.urlPrefix}${e}`), "POST" === o && (i = {
                ...i,
                "content-type": "application/json"
            }), a && (i = {
                ...i,
                Authorization: `Bearer ${a}`
            }), fetch(e, {
                body: r,
                method: o,
                headers: i
            }).then(hm._toJson)
        }
        _inject(e, t) {
            if (!t) return e;
            for (const n in t) {
                const r = t[n];
                e = e.replace(`:${n}`, encodeURIComponent(r))
            }
            return e
        }
        _encode(e) {
            return e ? Object.keys(e).map((t => `${encodeURIComponent(t)}=${encodeURIComponent(e[t])}`)).join("&") : ""
        }
        static _toJson(e) {
            return e.json()
        }
        static _hash(e, t) {
            return pm(`${e}${t}`)
        }
    }
    var gm = {
            Sender: hm
        },
        mm = function(e, t) {
            return (mm = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(e, t) {
                    e.__proto__ = t
                } || function(e, t) {
                    for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                })(e, t)
        };
    /*! *****************************************************************************
      Copyright (c) Microsoft Corporation.
      
      Permission to use, copy, modify, and/or distribute this software for any
      purpose with or without fee is hereby granted.
      
      THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
      REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
      AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
      INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
      LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
      OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
      PERFORMANCE OF THIS SOFTWARE.
      ******************************************************************************/
    function vm(e, t) {
        function n() {
            this.constructor = e
        }
        mm(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
    }
    var bm = function() {
        return (bm = Object.assign || function(e) {
            for (var t, n = 1, r = arguments.length; n < r; n++)
                for (var o in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            return e
        }).apply(this, arguments)
    };

    function ym(e) {
        var t = "function" == typeof Symbol && Symbol.iterator,
            n = t && e[t],
            r = 0;
        if (n) return n.call(e);
        if (e && "number" == typeof e.length) return {
            next: function() {
                return e && r >= e.length && (e = void 0), {
                    value: e && e[r++],
                    done: !e
                }
            }
        };
        throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.")
    }

    function wm(e, t) {
        var n = "function" == typeof Symbol && e[Symbol.iterator];
        if (!n) return e;
        var r, o, i = n.call(e),
            a = [];
        try {
            for (;
                (void 0 === t || t-- > 0) && !(r = i.next()).done;) a.push(r.value)
        } catch (e) {
            o = {
                error: e
            }
        } finally {
            try {
                r && !r.done && (n = i.return) && n.call(i)
            } finally {
                if (o) throw o.error
            }
        }
        return a
    }

    function _m() {
        for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(wm(arguments[t]));
        return e
    }
    var Sm = {};

    function xm(e) {
        switch (Object.prototype.toString.call(e)) {
            case "[object Error]":
            case "[object Exception]":
            case "[object DOMException]":
                return !0;
            default:
                return Rm(e, Error)
        }
    }

    function Pm(e) {
        return "[object ErrorEvent]" === Object.prototype.toString.call(e)
    }

    function km(e) {
        return "[object DOMError]" === Object.prototype.toString.call(e)
    }

    function Dm(e) {
        return "[object DOMException]" === Object.prototype.toString.call(e)
    }

    function Em(e) {
        return "[object String]" === Object.prototype.toString.call(e)
    }

    function Im(e) {
        return null === e || "object" != typeof e && "function" != typeof e
    }

    function Tm(e) {
        return "[object Object]" === Object.prototype.toString.call(e)
    }

    function Cm(e) {
        return "undefined" != typeof Event && Rm(e, Event)
    }

    function Fm(e) {
        return "undefined" != typeof Element && Rm(e, Element)
    }

    function Am(e) {
        return "[object RegExp]" === Object.prototype.toString.call(e)
    }

    function Om(e) {
        return Boolean(e && e.then && "function" == typeof e.then)
    }

    function Mm(e) {
        return Tm(e) && "nativeEvent" in e && "preventDefault" in e && "stopPropagation" in e
    }

    function Rm(e, t) {
        try {
            return e instanceof t
        } catch (e) {
            return !1
        }
    }

    function Nm(e) {
        try {
            for (var t = e, n = [], r = 0, o = 0, i = " > ".length, a = void 0; t && r++ < 5 && !("html" === (a = Um(t)) || r > 1 && o + n.length * i + a.length >= 80);) n.push(a), o += a.length, t = t.parentNode;
            return n.reverse().join(" > ")
        } catch (e) {
            return "<unknown>"
        }
    }

    function Um(e) {
        var t, n, r, o, i, a = e,
            s = [];
        if (!a || !a.tagName) return "";
        if (s.push(a.tagName.toLowerCase()), a.id && s.push("#" + a.id), (t = a.className) && Em(t))
            for (n = t.split(/\s+/), i = 0; i < n.length; i++) s.push("." + n[i]);
        var l = ["type", "name", "title", "alt"];
        for (i = 0; i < l.length; i++) r = l[i], (o = a.getAttribute(r)) && s.push("[" + r + '="' + o + '"]');
        return s.join("")
    }
    r(Sm, "isError", (function() {
        return xm
    })), r(Sm, "isErrorEvent", (function() {
        return Pm
    })), r(Sm, "isDOMError", (function() {
        return km
    })), r(Sm, "isDOMException", (function() {
        return Dm
    })), r(Sm, "isString", (function() {
        return Em
    })), r(Sm, "isPrimitive", (function() {
        return Im
    })), r(Sm, "isPlainObject", (function() {
        return Tm
    })), r(Sm, "isEvent", (function() {
        return Cm
    })), r(Sm, "isElement", (function() {
        return Fm
    })), r(Sm, "isRegExp", (function() {
        return Am
    })), r(Sm, "isThenable", (function() {
        return Om
    })), r(Sm, "isSyntheticEvent", (function() {
        return Mm
    })), r(Sm, "isInstanceOf", (function() {
        return Rm
    })), r({}, "htmlTreeAsString", (function() {
        return Nm
    }));
    var Bm = Object.setPrototypeOf || ({
            __proto__: []
        }
        instanceof Array ? function(e, t) {
            return e.__proto__ = t, e
        } : function(e, t) {
            for (var n in t) e.hasOwnProperty(n) || (e[n] = t[n]);
            return e
        });
    var Lm = function(e) {
        function t(t) {
            var n = this.constructor,
                r = e.call(this, t) || this;
            return r.message = t, r.name = n.prototype.constructor.name, Bm(r, n.prototype), r
        }
        return vm(t, e), t
    }(Error);
    r({}, "SentryError", (function() {
        return Lm
    }));
    var jm = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+))?@)([\w.-]+)(?::(\d+))?\/(.+)/,
        Vm = "Invalid Dsn",
        Hm = function() {
            function e(e) {
                "string" == typeof e ? this._fromString(e) : this._fromComponents(e), this._validate()
            }
            return e.prototype.toString = function(e) {
                void 0 === e && (e = !1);
                var t = this,
                    n = t.host,
                    r = t.path,
                    o = t.pass,
                    i = t.port,
                    a = t.projectId;
                return t.protocol + "://" + t.user + (e && o ? ":" + o : "") + "@" + n + (i ? ":" + i : "") + "/" + (r ? r + "/" : r) + a
            }, e.prototype._fromString = function(e) {
                var t = jm.exec(e);
                if (!t) throw new Lm(Vm);
                var n = wm(t.slice(1), 6),
                    r = n[0],
                    o = n[1],
                    i = n[2],
                    a = void 0 === i ? "" : i,
                    s = n[3],
                    l = n[4],
                    u = void 0 === l ? "" : l,
                    c = "",
                    d = n[5],
                    f = d.split("/");
                if (f.length > 1 && (c = f.slice(0, -1).join("/"), d = f.pop()), d) {
                    var p = d.match(/^\d+/);
                    p && (d = p[0])
                }
                this._fromComponents({
                    host: s,
                    pass: a,
                    path: c,
                    projectId: d,
                    port: u,
                    protocol: r,
                    user: o
                })
            }, e.prototype._fromComponents = function(e) {
                this.protocol = e.protocol, this.user = e.user, this.pass = e.pass || "", this.host = e.host, this.port = e.port || "", this.path = e.path || "", this.projectId = e.projectId
            }, e.prototype._validate = function() {
                var e = this;
                if (["protocol", "user", "host", "projectId"].forEach((function(t) {
                        if (!e[t]) throw new Lm("Invalid Dsn: " + t + " missing")
                    })), !this.projectId.match(/^\d+$/)) throw new Lm("Invalid Dsn: Invalid projectId " + this.projectId);
                if ("http" !== this.protocol && "https" !== this.protocol) throw new Lm("Invalid Dsn: Invalid protocol " + this.protocol);
                if (this.port && isNaN(parseInt(this.port, 10))) throw new Lm("Invalid Dsn: Invalid port " + this.port)
            }, e
        }();
    r({}, "Dsn", (function() {
        return Hm
    }));
    var qm = {},
        zm = {},
        Gm = function() {
            function e() {
                this._hasWeakSet = "function" == typeof WeakSet, this._inner = this._hasWeakSet ? new WeakSet : []
            }
            return e.prototype.memoize = function(e) {
                if (this._hasWeakSet) return !!this._inner.has(e) || (this._inner.add(e), !1);
                for (var t = 0; t < this._inner.length; t++) {
                    if (this._inner[t] === e) return !0
                }
                return this._inner.push(e), !1
            }, e.prototype.unmemoize = function(e) {
                if (this._hasWeakSet) this._inner.delete(e);
                else
                    for (var t = 0; t < this._inner.length; t++)
                        if (this._inner[t] === e) {
                            this._inner.splice(t, 1);
                            break
                        }
            }, e
        }();
    r({}, "Memo", (function() {
        return Gm
    }));
    var $m = "<anonymous>";

    function Wm(e) {
        try {
            return e && "function" == typeof e && e.name || $m
        } catch (e) {
            return $m
        }
    }
    r({}, "getFunctionName", (function() {
        return Wm
    }));
    var Ym = {};

    function Jm(e, t) {
        return void 0 === t && (t = 0), "string" != typeof e || 0 === t || e.length <= t ? e : e.substr(0, t) + "..."
    }

    function Qm(e, t) {
        var n = e,
            r = n.length;
        if (r <= 150) return n;
        t > r && (t = r);
        var o = Math.max(t - 60, 0);
        o < 5 && (o = 0);
        var i = Math.min(o + 140, r);
        return i > r - 5 && (i = r), i === r && (o = Math.max(i - 140, 0)), n = n.slice(o, i), o > 0 && (n = "'{snip} " + n), i < r && (n += " {snip}"), n
    }

    function Km(e, t) {
        if (!Array.isArray(e)) return "";
        for (var n = [], r = 0; r < e.length; r++) {
            var o = e[r];
            try {
                n.push(String(o))
            } catch (e) {
                n.push("[value cannot be serialized]")
            }
        }
        return n.join(t)
    }

    function Xm(e, t) {
        return !!Em(e) && (Am(t) ? t.test(e) : "string" == typeof t && -1 !== e.indexOf(t))
    }

    function Zm(e, t, n) {
        if (t in e) {
            var r = e[t],
                o = n(r);
            if ("function" == typeof o) try {
                o.prototype = o.prototype || {}, Object.defineProperties(o, {
                    __sentry_original__: {
                        enumerable: !1,
                        value: r
                    }
                })
            } catch (e) {}
            e[t] = o
        }
    }

    function ev(e) {
        return Object.keys(e).map((function(t) {
            return encodeURIComponent(t) + "=" + encodeURIComponent(e[t])
        })).join("&")
    }

    function tv(e) {
        if (xm(e)) {
            var t = e,
                n = {
                    message: t.message,
                    name: t.name,
                    stack: t.stack
                };
            for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (n[r] = t[r]);
            return n
        }
        if (Cm(e)) {
            var o = e,
                i = {};
            i.type = o.type;
            try {
                i.target = Fm(o.target) ? Nm(o.target) : Object.prototype.toString.call(o.target)
            } catch (e) {
                i.target = "<unknown>"
            }
            try {
                i.currentTarget = Fm(o.currentTarget) ? Nm(o.currentTarget) : Object.prototype.toString.call(o.currentTarget)
            } catch (e) {
                i.currentTarget = "<unknown>"
            }
            for (var r in "undefined" != typeof CustomEvent && Rm(e, CustomEvent) && (i.detail = o.detail), o) Object.prototype.hasOwnProperty.call(o, r) && (i[r] = o);
            return i
        }
        return e
    }

    function nv(e) {
        return function(e) {
            return ~-encodeURI(e).split(/%..|./).length
        }(JSON.stringify(e))
    }

    function rv(e, t, n) {
        void 0 === t && (t = 3), void 0 === n && (n = 102400);
        var r = av(e, t);
        return nv(r) > n ? rv(e, t - 1, n) : r
    }

    function ov(t, n) {
        return "domain" === n && t && "object" == typeof t && t._events ? "[Domain]" : "domainEmitter" === n ? "[DomainEmitter]" : void 0 !== e && t === e ? "[Global]" : "undefined" != typeof window && t === window ? "[Window]" : "undefined" != typeof document && t === document ? "[Document]" : Mm(t) ? "[SyntheticEvent]" : "number" == typeof t && t != t ? "[NaN]" : void 0 === t ? "[undefined]" : "function" == typeof t ? "[Function: " + Wm(t) + "]" : t
    }

    function iv(e, t, n, r) {
        if (void 0 === n && (n = 1 / 0), void 0 === r && (r = new Gm), 0 === n) return function(e) {
            var t = Object.prototype.toString.call(e);
            if ("string" == typeof e) return e;
            if ("[object Object]" === t) return "[Object]";
            if ("[object Array]" === t) return "[Array]";
            var n = ov(e);
            return Im(n) ? n : t
        }(t);
        if (null != t && "function" == typeof t.toJSON) return t.toJSON();
        var o = ov(t, e);
        if (Im(o)) return o;
        var i = tv(t),
            a = Array.isArray(t) ? [] : {};
        if (r.memoize(t)) return "[Circular ~]";
        for (var s in i) Object.prototype.hasOwnProperty.call(i, s) && (a[s] = iv(s, i[s], n - 1, r));
        return r.unmemoize(t), a
    }

    function av(e, t) {
        try {
            return JSON.parse(JSON.stringify(e, (function(e, n) {
                return iv(e, n, t)
            })))
        } catch (e) {
            return "**non-serializable**"
        }
    }

    function sv(e, t) {
        void 0 === t && (t = 40);
        var n = Object.keys(tv(e));
        if (n.sort(), !n.length) return "[object has no keys]";
        if (n[0].length >= t) return Jm(n[0], t);
        for (var r = n.length; r > 0; r--) {
            var o = n.slice(0, r).join(", ");
            if (!(o.length > t)) return r === n.length ? o : Jm(o, t)
        }
        return ""
    }
    r(Ym, "truncate", (function() {
        return Jm
    })), r(Ym, "snipLine", (function() {
        return Qm
    })), r(Ym, "safeJoin", (function() {
        return Km
    })), r(Ym, "isMatchingPattern", (function() {
        return Xm
    })), r(zm, "fill", (function() {
        return Zm
    })), r(zm, "urlEncode", (function() {
        return ev
    })), r(zm, "normalizeToSize", (function() {
        return rv
    })), r(zm, "normalize", (function() {
        return av
    })), r(zm, "extractExceptionKeysForMessage", (function() {
        return sv
    }));
    var lv = function() {
            var e = this,
                t = {
                    exports: this
                };
            e.__esModule = !0;
            var n = Qg;

            function o() {
                return "[object process]" === Object.prototype.toString.call(void 0 !== n ? n : 0)
            }

            function i(e, t) {
                return e.require(t)
            }
            r(e, "isNodeEnv", (function() {
                return o
            })), r(e, "dynamicRequire", (function() {
                return i
            }));
            var a = ["cookies", "data", "headers", "method", "query_string", "url"];

            function s(e, n) {
                if (void 0 === n && (n = a), !o()) throw new Error("Can't get node request data outside of a node environment");
                var r = {},
                    s = e.headers || e.header || {},
                    l = e.method,
                    u = e.hostname || e.host || s.host || "<no host>",
                    c = "https" === e.protocol || e.secure || (e.socket || {}).encrypted ? "https" : "http",
                    d = e.originalUrl || e.url,
                    f = c + "://" + u + d;
                return n.forEach((function(n) {
                    switch (n) {
                        case "headers":
                            r.headers = s;
                            break;
                        case "method":
                            r.method = l;
                            break;
                        case "url":
                            r.url = f;
                            break;
                        case "cookies":
                            r.cookies = i(t, "cookie").parse(s.cookie || "");
                            break;
                        case "query_string":
                            r.query_string = i(t, "url").parse(d || "", !1).query;
                            break;
                        case "data":
                            if ("GET" === l || "HEAD" === l) break;
                            void 0 !== e.body && (r.data = Em(e.body) ? e.body : JSON.stringify(av(e.body)));
                            break;
                        default:
                            ({}).hasOwnProperty.call(e, n) && (r[n] = e[n])
                    }
                })), r
            }
            return r(e, "extractNodeRequestData", (function() {
                return s
            })), t.exports
        }.call({}),
        uv = {};

    function cv() {
        return lv.isNodeEnv() ? e : "undefined" != typeof window ? window : "undefined" != typeof self ? self : uv
    }

    function dv() {
        var e = cv(),
            t = e.crypto || e.msCrypto;
        if (void 0 !== t && t.getRandomValues) {
            var n = new Uint16Array(8);
            t.getRandomValues(n), n[3] = 4095 & n[3] | 16384, n[4] = 16383 & n[4] | 32768;
            var r = function(e) {
                for (var t = e.toString(16); t.length < 4;) t = "0" + t;
                return t
            };
            return r(n[0]) + r(n[1]) + r(n[2]) + r(n[3]) + r(n[4]) + r(n[5]) + r(n[6]) + r(n[7])
        }
        return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (function(e) {
            var t = 16 * Math.random() | 0;
            return ("x" === e ? t : 3 & t | 8).toString(16)
        }))
    }

    function fv(e) {
        if (!e) return {};
        var t = e.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
        if (!t) return {};
        var n = t[6] || "",
            r = t[8] || "";
        return {
            host: t[4],
            path: t[5],
            protocol: t[2],
            relative: t[5] + n + r
        }
    }

    function pv(e) {
        if (e.message) return e.message;
        if (e.exception && e.exception.values && e.exception.values[0]) {
            var t = e.exception.values[0];
            return t.type && t.value ? t.type + ": " + t.value : t.type || t.value || e.event_id || "<unknown>"
        }
        return e.event_id || "<unknown>"
    }

    function hv(e) {
        var t = cv();
        if (!("console" in t)) return e();
        var n = t.console,
            r = {};
        ["debug", "info", "warn", "error", "log", "assert"].forEach((function(e) {
            e in t.console && n[e].__sentry_original__ && (r[e] = n[e], n[e] = n[e].__sentry_original__)
        }));
        var o = e();
        return Object.keys(r).forEach((function(e) {
            n[e] = r[e]
        })), o
    }

    function gv(e, t, n) {
        e.exception = e.exception || {}, e.exception.values = e.exception.values || [], e.exception.values[0] = e.exception.values[0] || {}, e.exception.values[0].value = e.exception.values[0].value || t || "", e.exception.values[0].type = e.exception.values[0].type || n || "Error"
    }

    function mv(e, t) {
        void 0 === t && (t = {});
        try {
            e.exception.values[0].mechanism = e.exception.values[0].mechanism || {}, Object.keys(t).forEach((function(n) {
                e.exception.values[0].mechanism[n] = t[n]
            }))
        } catch (e) {}
    }

    function vv() {
        try {
            return document.location.href
        } catch (e) {
            return ""
        }
    }
    r(qm, "getGlobalObject", (function() {
        return cv
    })), r(qm, "uuid4", (function() {
        return dv
    })), r(qm, "parseUrl", (function() {
        return fv
    })), r(qm, "getEventDescription", (function() {
        return pv
    })), r(qm, "consoleSandbox", (function() {
        return hv
    })), r(qm, "addExceptionTypeValue", (function() {
        return gv
    })), r(qm, "addExceptionMechanism", (function() {
        return mv
    })), r(qm, "getLocationHref", (function() {
        return vv
    }));

    function bv(e, t) {
        if (!t) return 6e4;
        var n = parseInt("" + t, 10);
        if (!isNaN(n)) return 1e3 * n;
        var r = Date.parse("" + t);
        return isNaN(r) ? 6e4 : r - e
    }
    r(qm, "parseRetryAfterHeader", (function() {
        return bv
    }));
    var yv = cv(),
        wv = function() {
            function e() {
                this._enabled = !1
            }
            return e.prototype.disable = function() {
                this._enabled = !1
            }, e.prototype.enable = function() {
                this._enabled = !0
            }, e.prototype.log = function() {
                for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                this._enabled && hv((function() {
                    yv.console.log("Sentry Logger [Log]: " + e.join(" "))
                }))
            }, e.prototype.warn = function() {
                for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                this._enabled && hv((function() {
                    yv.console.warn("Sentry Logger [Warn]: " + e.join(" "))
                }))
            }, e.prototype.error = function() {
                for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                this._enabled && hv((function() {
                    yv.console.error("Sentry Logger [Error]: " + e.join(" "))
                }))
            }, e
        }();
    yv.__SENTRY__ = yv.__SENTRY__ || {};
    var _v = yv.__SENTRY__.logger || (yv.__SENTRY__.logger = new wv);
    r({}, "logger", (function() {
        return _v
    }));
    var Sv = {};

    function xv() {
        if (!("fetch" in cv())) return !1;
        try {
            return new Headers, new Request(""), new Response, !0
        } catch (e) {
            return !1
        }
    }

    function Pv(e) {
        return e && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(e.toString())
    }

    function kv() {
        if (!xv()) return !1;
        var e = cv();
        if (Pv(e.fetch)) return !0;
        var t = !1,
            n = e.document;
        if (n && "function" == typeof n.createElement) try {
            var r = n.createElement("iframe");
            r.hidden = !0, n.head.appendChild(r), r.contentWindow && r.contentWindow.fetch && (t = Pv(r.contentWindow.fetch)), n.head.removeChild(r)
        } catch (e) {
            _v.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", e)
        }
        return t
    }

    function Dv() {
        if (!xv()) return !1;
        try {
            return new Request("_", {
                referrerPolicy: "origin"
            }), !0
        } catch (e) {
            return !1
        }
    }

    function Ev() {
        var e = cv(),
            t = e.chrome,
            n = t && t.app && t.app.runtime,
            r = "history" in e && !!e.history.pushState && !!e.history.replaceState;
        return !n && r
    }
    r(Sv, "supportsFetch", (function() {
        return xv
    })), r(Sv, "supportsNativeFetch", (function() {
        return kv
    })), r(Sv, "supportsReferrerPolicy", (function() {
        return Dv
    })), r(Sv, "supportsHistory", (function() {
        return Ev
    }));
    var Iv, Tv = cv(),
        Cv = {},
        Fv = {};

    function Av(e) {
        if (!Fv[e]) switch (Fv[e] = !0, e) {
            case "console":
                ! function() {
                    if (!("console" in Tv)) return;
                    ["debug", "info", "warn", "error", "log", "assert"].forEach((function(e) {
                        e in Tv.console && Zm(Tv.console, e, (function(t) {
                            return function() {
                                for (var n = [], r = 0; r < arguments.length; r++) n[r] = arguments[r];
                                Mv("console", {
                                    args: n,
                                    level: e
                                }), t && Function.prototype.apply.call(t, Tv.console, n)
                            }
                        }))
                    }))
                }();
                break;
            case "dom":
                ! function() {
                    if (!("document" in Tv)) return;
                    Tv.document.addEventListener("click", jv("click", Mv.bind(null, "dom")), !1), Tv.document.addEventListener("keypress", Vv(Mv.bind(null, "dom")), !1), ["EventTarget", "Node"].forEach((function(e) {
                        var t = Tv[e] && Tv[e].prototype;
                        t && t.hasOwnProperty && t.hasOwnProperty("addEventListener") && (Zm(t, "addEventListener", (function(e) {
                            return function(t, n, r) {
                                return n && n.handleEvent ? ("click" === t && Zm(n, "handleEvent", (function(e) {
                                    return function(t) {
                                        return jv("click", Mv.bind(null, "dom"))(t), e.call(this, t)
                                    }
                                })), "keypress" === t && Zm(n, "handleEvent", (function(e) {
                                    return function(t) {
                                        return Vv(Mv.bind(null, "dom"))(t), e.call(this, t)
                                    }
                                }))) : ("click" === t && jv("click", Mv.bind(null, "dom"), !0)(this), "keypress" === t && Vv(Mv.bind(null, "dom"))(this)), e.call(this, t, n, r)
                            }
                        })), Zm(t, "removeEventListener", (function(e) {
                            return function(t, n, r) {
                                try {
                                    e.call(this, t, n.__sentry_wrapped__, r)
                                } catch (e) {}
                                return e.call(this, t, n, r)
                            }
                        })))
                    }))
                }();
                break;
            case "xhr":
                ! function() {
                    if (!("XMLHttpRequest" in Tv)) return;
                    var e = [],
                        t = [],
                        n = XMLHttpRequest.prototype;
                    Zm(n, "open", (function(n) {
                        return function() {
                            for (var r = [], o = 0; o < arguments.length; o++) r[o] = arguments[o];
                            var i = this,
                                a = r[1];
                            i.__sentry_xhr__ = {
                                method: Em(r[0]) ? r[0].toUpperCase() : r[0],
                                url: r[1]
                            }, Em(a) && "POST" === i.__sentry_xhr__.method && a.match(/sentry_key/) && (i.__sentry_own_request__ = !0);
                            var s = function() {
                                if (4 === i.readyState) {
                                    try {
                                        i.__sentry_xhr__ && (i.__sentry_xhr__.status_code = i.status)
                                    } catch (e) {}
                                    try {
                                        var n = e.indexOf(i);
                                        if (-1 !== n) {
                                            e.splice(n);
                                            var o = t.splice(n)[0];
                                            i.__sentry_xhr__ && void 0 !== o[0] && (i.__sentry_xhr__.body = o[0])
                                        }
                                    } catch (e) {}
                                    Mv("xhr", {
                                        args: r,
                                        endTimestamp: Date.now(),
                                        startTimestamp: Date.now(),
                                        xhr: i
                                    })
                                }
                            };
                            return "onreadystatechange" in i && "function" == typeof i.onreadystatechange ? Zm(i, "onreadystatechange", (function(e) {
                                return function() {
                                    for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                                    return s(), e.apply(i, t)
                                }
                            })) : i.addEventListener("readystatechange", s), n.apply(i, r)
                        }
                    })), Zm(n, "send", (function(n) {
                        return function() {
                            for (var r = [], o = 0; o < arguments.length; o++) r[o] = arguments[o];
                            return e.push(this), t.push(r), Mv("xhr", {
                                args: r,
                                startTimestamp: Date.now(),
                                xhr: this
                            }), n.apply(this, r)
                        }
                    }))
                }();
                break;
            case "fetch":
                ! function() {
                    if (!kv()) return;
                    Zm(Tv, "fetch", (function(e) {
                        return function() {
                            for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                            var r = {
                                args: t,
                                fetchData: {
                                    method: Rv(t),
                                    url: Nv(t)
                                },
                                startTimestamp: Date.now()
                            };
                            return Mv("fetch", bm({}, r)), e.apply(Tv, t).then((function(e) {
                                return Mv("fetch", bm(bm({}, r), {
                                    endTimestamp: Date.now(),
                                    response: e
                                })), e
                            }), (function(e) {
                                throw Mv("fetch", bm(bm({}, r), {
                                    endTimestamp: Date.now(),
                                    error: e
                                })), e
                            }))
                        }
                    }))
                }();
                break;
            case "history":
                ! function() {
                    if (!Ev()) return;
                    var e = Tv.onpopstate;

                    function t(e) {
                        return function() {
                            for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                            var r = t.length > 2 ? t[2] : void 0;
                            if (r) {
                                var o = Iv,
                                    i = String(r);
                                Iv = i, Mv("history", {
                                    from: o,
                                    to: i
                                })
                            }
                            return e.apply(this, t)
                        }
                    }
                    Tv.onpopstate = function() {
                        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                        var r = Tv.location.href,
                            o = Iv;
                        if (Iv = r, Mv("history", {
                                from: o,
                                to: r
                            }), e) return e.apply(this, t)
                    }, Zm(Tv.history, "pushState", t), Zm(Tv.history, "replaceState", t)
                }();
                break;
            case "error":
                Hv = Tv.onerror, Tv.onerror = function(e, t, n, r, o) {
                    return Mv("error", {
                        column: r,
                        error: o,
                        line: n,
                        msg: e,
                        url: t
                    }), !!Hv && Hv.apply(this, arguments)
                };
                break;
            case "unhandledrejection":
                qv = Tv.onunhandledrejection, Tv.onunhandledrejection = function(e) {
                    return Mv("unhandledrejection", e), !qv || qv.apply(this, arguments)
                };
                break;
            default:
                _v.warn("unknown instrumentation type:", e)
        }
    }

    function Ov(e) {
        e && "string" == typeof e.type && "function" == typeof e.callback && (Cv[e.type] = Cv[e.type] || [], Cv[e.type].push(e.callback), Av(e.type))
    }

    function Mv(e, t) {
        var n, r;
        if (e && Cv[e]) try {
            for (var o = ym(Cv[e] || []), i = o.next(); !i.done; i = o.next()) {
                var a = i.value;
                try {
                    a(t)
                } catch (t) {
                    _v.error("Error while triggering instrumentation handler.\nType: " + e + "\nName: " + Wm(a) + "\nError: " + t)
                }
            }
        } catch (e) {
            n = {
                error: e
            }
        } finally {
            try {
                i && !i.done && (r = o.return) && r.call(o)
            } finally {
                if (n) throw n.error
            }
        }
    }

    function Rv(e) {
        return void 0 === e && (e = []), "Request" in Tv && Rm(e[0], Request) && e[0].method ? String(e[0].method).toUpperCase() : e[1] && e[1].method ? String(e[1].method).toUpperCase() : "GET"
    }

    function Nv(e) {
        return void 0 === e && (e = []), "string" == typeof e[0] ? e[0] : "Request" in Tv && Rm(e[0], Request) ? e[0].url : String(e[0])
    }
    r({}, "addInstrumentationHandler", (function() {
        return Ov
    }));
    var Uv, Bv, Lv = 0;

    function jv(e, t, n) {
        return void 0 === n && (n = !1),
            function(r) {
                Uv = void 0, r && Bv !== r && (Bv = r, Lv && clearTimeout(Lv), n ? Lv = setTimeout((function() {
                    t({
                        event: r,
                        name: e
                    })
                })) : t({
                    event: r,
                    name: e
                }))
            }
    }

    function Vv(e) {
        return function(t) {
            var n;
            try {
                n = t.target
            } catch (e) {
                return
            }
            var r = n && n.tagName;
            r && ("INPUT" === r || "TEXTAREA" === r || n.isContentEditable) && (Uv || jv("input", e)(t), clearTimeout(Uv), Uv = setTimeout((function() {
                Uv = void 0
            }), 1e3))
        }
    }
    var Hv = null;
    var qv = null;
    var zv, Gv;
    (Gv = zv || (zv = {})).PENDING = "PENDING", Gv.RESOLVED = "RESOLVED", Gv.REJECTED = "REJECTED";
    var $v = function() {
        function e(e) {
            var t = this;
            this._state = zv.PENDING, this._handlers = [], this._resolve = function(e) {
                t._setResult(zv.RESOLVED, e)
            }, this._reject = function(e) {
                t._setResult(zv.REJECTED, e)
            }, this._setResult = function(e, n) {
                t._state === zv.PENDING && (Om(n) ? n.then(t._resolve, t._reject) : (t._state = e, t._value = n, t._executeHandlers()))
            }, this._attachHandler = function(e) {
                t._handlers = t._handlers.concat(e), t._executeHandlers()
            }, this._executeHandlers = function() {
                if (t._state !== zv.PENDING) {
                    var e = t._handlers.slice();
                    t._handlers = [], e.forEach((function(e) {
                        e.done || (t._state === zv.RESOLVED && e.onfulfilled && e.onfulfilled(t._value), t._state === zv.REJECTED && e.onrejected && e.onrejected(t._value), e.done = !0)
                    }))
                }
            };
            try {
                e(this._resolve, this._reject)
            } catch (e) {
                this._reject(e)
            }
        }
        return e.resolve = function(t) {
            return new e((function(e) {
                e(t)
            }))
        }, e.reject = function(t) {
            return new e((function(e, n) {
                n(t)
            }))
        }, e.all = function(t) {
            return new e((function(n, r) {
                if (Array.isArray(t))
                    if (0 !== t.length) {
                        var o = t.length,
                            i = [];
                        t.forEach((function(t, a) {
                            e.resolve(t).then((function(e) {
                                i[a] = e, 0 === (o -= 1) && n(i)
                            })).then(null, r)
                        }))
                    } else n([]);
                else r(new TypeError("Promise.all requires an array as input."))
            }))
        }, e.prototype.then = function(t, n) {
            var r = this;
            return new e((function(e, o) {
                r._attachHandler({
                    done: !1,
                    onfulfilled: function(n) {
                        if (t) try {
                            return void e(t(n))
                        } catch (e) {
                            return void o(e)
                        } else e(n)
                    },
                    onrejected: function(t) {
                        if (n) try {
                            return void e(n(t))
                        } catch (e) {
                            return void o(e)
                        } else o(t)
                    }
                })
            }))
        }, e.prototype.catch = function(e) {
            return this.then((function(e) {
                return e
            }), e)
        }, e.prototype.finally = function(t) {
            var n = this;
            return new e((function(e, r) {
                var o, i;
                return n.then((function(e) {
                    i = !1, o = e, t && t()
                }), (function(e) {
                    i = !0, o = e, t && t()
                })).then((function() {
                    i ? r(o) : e(o)
                }))
            }))
        }, e.prototype.toString = function() {
            return "[object SyncPromise]"
        }, e
    }();
    r({}, "SyncPromise", (function() {
        return $v
    }));
    var Wv = function() {
        function e(e) {
            this._limit = e, this._buffer = []
        }
        return e.prototype.isReady = function() {
            return void 0 === this._limit || this.length() < this._limit
        }, e.prototype.add = function(e) {
            var t = this;
            return this.isReady() ? (-1 === this._buffer.indexOf(e) && this._buffer.push(e), e.then((function() {
                return t.remove(e)
            })).then(null, (function() {
                return t.remove(e).then(null, (function() {}))
            })), e) : $v.reject(new Lm("Not adding Promise due to buffer limit reached."))
        }, e.prototype.remove = function(e) {
            return this._buffer.splice(this._buffer.indexOf(e), 1)[0]
        }, e.prototype.length = function() {
            return this._buffer.length
        }, e.prototype.drain = function(e) {
            var t = this;
            return new $v((function(n) {
                var r = setTimeout((function() {
                    e && e > 0 && n(!1)
                }), e);
                $v.all(t._buffer).then((function() {
                    clearTimeout(r), n(!0)
                })).then(null, (function() {
                    n(!0)
                }))
            }))
        }, e
    }();
    r({}, "PromiseBuffer", (function() {
        return Wv
    }));
    var Yv = function() {
            var e = this,
                t = {
                    exports: this
                };
            e.__esModule = !0;
            var n = {
                nowSeconds: function() {
                    return Date.now() / 1e3
                }
            };
            var o = lv.isNodeEnv() ? function() {
                    try {
                        return lv.dynamicRequire(t, "perf_hooks").performance
                    } catch (e) {
                        return
                    }
                }() : function() {
                    var e = cv().performance;
                    if (e && e.now) return {
                        now: function() {
                            return e.now()
                        },
                        timeOrigin: Date.now() - e.now()
                    }
                }(),
                i = void 0 === o ? n : {
                    nowSeconds: function() {
                        return (o.timeOrigin + o.now()) / 1e3
                    }
                },
                a = n.nowSeconds.bind(n);
            r(e, "dateTimestampInSeconds", (function() {
                return a
            }));
            var s = i.nowSeconds.bind(i);
            r(e, "timestampInSeconds", (function() {
                return s
            }));
            var l = s;
            r(e, "timestampWithMs", (function() {
                return l
            }));
            var u = void 0 !== o;
            r(e, "usingPerformanceAPI", (function() {
                return u
            }));
            var c = function() {
                var e = cv().performance;
                if (e) return e.timeOrigin ? e.timeOrigin : e.timing && e.timing.navigationStart || Date.now()
            }();
            return r(e, "browserPerformanceTimeOrigin", (function() {
                return c
            })), t.exports
        }.call({}),
        Jv = function() {
            function e() {
                this._notifyingListeners = !1, this._scopeListeners = [], this._eventProcessors = [], this._breadcrumbs = [], this._user = {}, this._tags = {}, this._extra = {}, this._contexts = {}
            }
            return e.clone = function(t) {
                var n = new e;
                return t && (n._breadcrumbs = _m(t._breadcrumbs), n._tags = bm({}, t._tags), n._extra = bm({}, t._extra), n._contexts = bm({}, t._contexts), n._user = t._user, n._level = t._level, n._span = t._span, n._transactionName = t._transactionName, n._fingerprint = t._fingerprint, n._eventProcessors = _m(t._eventProcessors)), n
            }, e.prototype.addScopeListener = function(e) {
                this._scopeListeners.push(e)
            }, e.prototype.addEventProcessor = function(e) {
                return this._eventProcessors.push(e), this
            }, e.prototype.setUser = function(e) {
                return this._user = e || {}, this._notifyScopeListeners(), this
            }, e.prototype.setTags = function(e) {
                return this._tags = bm(bm({}, this._tags), e), this._notifyScopeListeners(), this
            }, e.prototype.setTag = function(e, t) {
                var n;
                return this._tags = bm(bm({}, this._tags), ((n = {})[e] = t, n)), this._notifyScopeListeners(), this
            }, e.prototype.setExtras = function(e) {
                return this._extra = bm(bm({}, this._extra), e), this._notifyScopeListeners(), this
            }, e.prototype.setExtra = function(e, t) {
                var n;
                return this._extra = bm(bm({}, this._extra), ((n = {})[e] = t, n)), this._notifyScopeListeners(), this
            }, e.prototype.setFingerprint = function(e) {
                return this._fingerprint = e, this._notifyScopeListeners(), this
            }, e.prototype.setLevel = function(e) {
                return this._level = e, this._notifyScopeListeners(), this
            }, e.prototype.setTransactionName = function(e) {
                return this._transactionName = e, this._notifyScopeListeners(), this
            }, e.prototype.setTransaction = function(e) {
                return this.setTransactionName(e)
            }, e.prototype.setContext = function(e, t) {
                var n;
                return null === t ? delete this._contexts[e] : this._contexts = bm(bm({}, this._contexts), ((n = {})[e] = t, n)), this._notifyScopeListeners(), this
            }, e.prototype.setSpan = function(e) {
                return this._span = e, this._notifyScopeListeners(), this
            }, e.prototype.getSpan = function() {
                return this._span
            }, e.prototype.getTransaction = function() {
                var e, t, n, r, o = this.getSpan();
                return (null === (e = o) || void 0 === e ? void 0 : e.transaction) ? null === (t = o) || void 0 === t ? void 0 : t.transaction : (null === (r = null === (n = o) || void 0 === n ? void 0 : n.spanRecorder) || void 0 === r ? void 0 : r.spans[0]) ? o.spanRecorder.spans[0] : void 0
            }, e.prototype.update = function(t) {
                if (!t) return this;
                if ("function" == typeof t) {
                    var n = t(this);
                    return n instanceof e ? n : this
                }
                return t instanceof e ? (this._tags = bm(bm({}, this._tags), t._tags), this._extra = bm(bm({}, this._extra), t._extra), this._contexts = bm(bm({}, this._contexts), t._contexts), t._user && (this._user = t._user), t._level && (this._level = t._level), t._fingerprint && (this._fingerprint = t._fingerprint)) : Tm(t) && (t = t, this._tags = bm(bm({}, this._tags), t.tags), this._extra = bm(bm({}, this._extra), t.extra), this._contexts = bm(bm({}, this._contexts), t.contexts), t.user && (this._user = t.user), t.level && (this._level = t.level), t.fingerprint && (this._fingerprint = t.fingerprint)), this
            }, e.prototype.clear = function() {
                return this._breadcrumbs = [], this._tags = {}, this._extra = {}, this._user = {}, this._contexts = {}, this._level = void 0, this._transactionName = void 0, this._fingerprint = void 0, this._span = void 0, this._notifyScopeListeners(), this
            }, e.prototype.addBreadcrumb = function(e, t) {
                var n = bm({
                    timestamp: Yv.dateTimestampInSeconds()
                }, e);
                return this._breadcrumbs = void 0 !== t && t >= 0 ? _m(this._breadcrumbs, [n]).slice(-t) : _m(this._breadcrumbs, [n]), this._notifyScopeListeners(), this
            }, e.prototype.clearBreadcrumbs = function() {
                return this._breadcrumbs = [], this._notifyScopeListeners(), this
            }, e.prototype.applyToEvent = function(e, t) {
                return this._extra && Object.keys(this._extra).length && (e.extra = bm(bm({}, this._extra), e.extra)), this._tags && Object.keys(this._tags).length && (e.tags = bm(bm({}, this._tags), e.tags)), this._user && Object.keys(this._user).length && (e.user = bm(bm({}, this._user), e.user)), this._contexts && Object.keys(this._contexts).length && (e.contexts = bm(bm({}, this._contexts), e.contexts)), this._level && (e.level = this._level), this._transactionName && (e.transaction = this._transactionName), this._span && (e.contexts = bm({
                    trace: this._span.getTraceContext()
                }, e.contexts)), this._applyFingerprint(e), e.breadcrumbs = _m(e.breadcrumbs || [], this._breadcrumbs), e.breadcrumbs = e.breadcrumbs.length > 0 ? e.breadcrumbs : void 0, this._notifyEventProcessors(_m(Qv(), this._eventProcessors), e, t)
            }, e.prototype._notifyEventProcessors = function(e, t, n, r) {
                var o = this;
                return void 0 === r && (r = 0), new $v((function(i, a) {
                    var s = e[r];
                    if (null === t || "function" != typeof s) i(t);
                    else {
                        var l = s(bm({}, t), n);
                        Om(l) ? l.then((function(t) {
                            return o._notifyEventProcessors(e, t, n, r + 1).then(i)
                        })).then(null, a) : o._notifyEventProcessors(e, l, n, r + 1).then(i).then(null, a)
                    }
                }))
            }, e.prototype._notifyScopeListeners = function() {
                var e = this;
                this._notifyingListeners || (this._notifyingListeners = !0, setTimeout((function() {
                    e._scopeListeners.forEach((function(t) {
                        t(e)
                    })), e._notifyingListeners = !1
                })))
            }, e.prototype._applyFingerprint = function(e) {
                e.fingerprint = e.fingerprint ? Array.isArray(e.fingerprint) ? e.fingerprint : [e.fingerprint] : [], this._fingerprint && (e.fingerprint = e.fingerprint.concat(this._fingerprint)), e.fingerprint && !e.fingerprint.length && delete e.fingerprint
            }, e
        }();

    function Qv() {
        var e = cv();
        return e.__SENTRY__ = e.__SENTRY__ || {}, e.__SENTRY__.globalEventProcessors = e.__SENTRY__.globalEventProcessors || [], e.__SENTRY__.globalEventProcessors
    }

    function Kv(e) {
        Qv().push(e)
    }
    var Xv = function() {
        function e(e, t, n) {
            void 0 === t && (t = new Jv), void 0 === n && (n = 3), this._version = n, this._stack = [], this._stack.push({
                client: e,
                scope: t
            }), this.bindClient(e)
        }
        return e.prototype.isOlderThan = function(e) {
            return this._version < e
        }, e.prototype.bindClient = function(e) {
            this.getStackTop().client = e, e && e.setupIntegrations && e.setupIntegrations()
        }, e.prototype.pushScope = function() {
            var e = this.getStack(),
                t = e.length > 0 ? e[e.length - 1].scope : void 0,
                n = Jv.clone(t);
            return this.getStack().push({
                client: this.getClient(),
                scope: n
            }), n
        }, e.prototype.popScope = function() {
            return void 0 !== this.getStack().pop()
        }, e.prototype.withScope = function(e) {
            var t = this.pushScope();
            try {
                e(t)
            } finally {
                this.popScope()
            }
        }, e.prototype.getClient = function() {
            return this.getStackTop().client
        }, e.prototype.getScope = function() {
            return this.getStackTop().scope
        }, e.prototype.getStack = function() {
            return this._stack
        }, e.prototype.getStackTop = function() {
            return this._stack[this._stack.length - 1]
        }, e.prototype.captureException = function(e, t) {
            var n = this._lastEventId = dv(),
                r = t;
            if (!t) {
                var o = void 0;
                try {
                    throw new Error("Sentry syntheticException")
                } catch (e) {
                    o = e
                }
                r = {
                    originalException: e,
                    syntheticException: o
                }
            }
            return this._invokeClient("captureException", e, bm(bm({}, r), {
                event_id: n
            })), n
        }, e.prototype.captureMessage = function(e, t, n) {
            var r = this._lastEventId = dv(),
                o = n;
            if (!n) {
                var i = void 0;
                try {
                    throw new Error(e)
                } catch (e) {
                    i = e
                }
                o = {
                    originalException: e,
                    syntheticException: i
                }
            }
            return this._invokeClient("captureMessage", e, t, bm(bm({}, o), {
                event_id: r
            })), r
        }, e.prototype.captureEvent = function(e, t) {
            var n = this._lastEventId = dv();
            return this._invokeClient("captureEvent", e, bm(bm({}, t), {
                event_id: n
            })), n
        }, e.prototype.lastEventId = function() {
            return this._lastEventId
        }, e.prototype.addBreadcrumb = function(e, t) {
            var n = this.getStackTop();
            if (n.scope && n.client) {
                var r = n.client.getOptions && n.client.getOptions() || {},
                    o = r.beforeBreadcrumb,
                    i = void 0 === o ? null : o,
                    a = r.maxBreadcrumbs,
                    s = void 0 === a ? 100 : a;
                if (!(s <= 0)) {
                    var l = Yv.dateTimestampInSeconds(),
                        u = bm({
                            timestamp: l
                        }, e),
                        c = i ? hv((function() {
                            return i(u, t)
                        })) : u;
                    null !== c && n.scope.addBreadcrumb(c, Math.min(s, 100))
                }
            }
        }, e.prototype.setUser = function(e) {
            var t = this.getStackTop();
            t.scope && t.scope.setUser(e)
        }, e.prototype.setTags = function(e) {
            var t = this.getStackTop();
            t.scope && t.scope.setTags(e)
        }, e.prototype.setExtras = function(e) {
            var t = this.getStackTop();
            t.scope && t.scope.setExtras(e)
        }, e.prototype.setTag = function(e, t) {
            var n = this.getStackTop();
            n.scope && n.scope.setTag(e, t)
        }, e.prototype.setExtra = function(e, t) {
            var n = this.getStackTop();
            n.scope && n.scope.setExtra(e, t)
        }, e.prototype.setContext = function(e, t) {
            var n = this.getStackTop();
            n.scope && n.scope.setContext(e, t)
        }, e.prototype.configureScope = function(e) {
            var t = this.getStackTop();
            t.scope && t.client && e(t.scope)
        }, e.prototype.run = function(e) {
            var t = eb(this);
            try {
                e(this)
            } finally {
                eb(t)
            }
        }, e.prototype.getIntegration = function(e) {
            var t = this.getClient();
            if (!t) return null;
            try {
                return t.getIntegration(e)
            } catch (t) {
                return _v.warn("Cannot retrieve integration " + e.id + " from the current Hub"), null
            }
        }, e.prototype.startSpan = function(e) {
            return this._callExtensionMethod("startSpan", e)
        }, e.prototype.startTransaction = function(e, t) {
            return this._callExtensionMethod("startTransaction", e, t)
        }, e.prototype.traceHeaders = function() {
            return this._callExtensionMethod("traceHeaders")
        }, e.prototype._invokeClient = function(e) {
            for (var t, n = [], r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
            var o = this.getStackTop();
            o && o.client && o.client[e] && (t = o.client)[e].apply(t, _m(n, [o.scope]))
        }, e.prototype._callExtensionMethod = function(e) {
            for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
            var r = Zv(),
                o = r.__SENTRY__;
            if (o && o.extensions && "function" == typeof o.extensions[e]) return o.extensions[e].apply(this, t);
            _v.warn("Extension method " + e + " couldn't be found, doing nothing.")
        }, e
    }();

    function Zv() {
        var e = cv();
        return e.__SENTRY__ = e.__SENTRY__ || {
            extensions: {},
            hub: void 0
        }, e
    }

    function eb(e) {
        var t = Zv(),
            n = rb(t);
        return ob(t, e), n
    }

    function tb() {
        var e = Zv();
        return nb(e) && !rb(e).isOlderThan(3) || ob(e, new Xv), lv.isNodeEnv() ? function(e) {
            try {
                var t = (r = Zv().__SENTRY__) && r.extensions && r.extensions.domain && r.extensions.domain.active;
                if (!t) return rb(e);
                if (!nb(t) || rb(t).isOlderThan(3)) {
                    var n = rb(e).getStackTop();
                    ob(t, new Xv(n.client, Jv.clone(n.scope)))
                }
                return rb(t)
            } catch (t) {
                return rb(e)
            }
            var r
        }(e) : rb(e)
    }

    function nb(e) {
        return !!(e && e.__SENTRY__ && e.__SENTRY__.hub)
    }

    function rb(e) {
        return e && e.__SENTRY__ && e.__SENTRY__.hub || (e.__SENTRY__ = e.__SENTRY__ || {}, e.__SENTRY__.hub = new Xv), e.__SENTRY__.hub
    }

    function ob(e, t) {
        return !!e && (e.__SENTRY__ = e.__SENTRY__ || {}, e.__SENTRY__.hub = t, !0)
    }

    function ib(e) {
        for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
        var r = tb();
        if (r && r[e]) return r[e].apply(r, _m(t));
        throw new Error("No hub defined or " + e + " was not found on the hub, please open a bug report.")
    }

    function ab(e, t) {
        var n;
        try {
            throw new Error("Sentry syntheticException")
        } catch (e) {
            n = e
        }
        return ib("captureException", e, {
            captureContext: t,
            originalException: e,
            syntheticException: n
        })
    }

    function sb(e) {
        ib("withScope", e)
    }
    var lb = function() {
            function e(e) {
                this.dsn = e, this._dsnObject = new Hm(e)
            }
            return e.prototype.getDsn = function() {
                return this._dsnObject
            }, e.prototype.getBaseApiEndpoint = function() {
                var e = this._dsnObject,
                    t = e.protocol ? e.protocol + ":" : "",
                    n = e.port ? ":" + e.port : "";
                return t + "//" + e.host + n + (e.path ? "/" + e.path : "") + "/api/"
            }, e.prototype.getStoreEndpoint = function() {
                return this._getIngestEndpoint("store")
            }, e.prototype.getStoreEndpointWithUrlEncodedAuth = function() {
                return this.getStoreEndpoint() + "?" + this._encodedAuth()
            }, e.prototype.getEnvelopeEndpointWithUrlEncodedAuth = function() {
                return this._getEnvelopeEndpoint() + "?" + this._encodedAuth()
            }, e.prototype.getStoreEndpointPath = function() {
                var e = this._dsnObject;
                return (e.path ? "/" + e.path : "") + "/api/" + e.projectId + "/store/"
            }, e.prototype.getRequestHeaders = function(e, t) {
                var n = this._dsnObject,
                    r = ["Sentry sentry_version=7"];
                return r.push("sentry_client=" + e + "/" + t), r.push("sentry_key=" + n.user), n.pass && r.push("sentry_secret=" + n.pass), {
                    "Content-Type": "application/json",
                    "X-Sentry-Auth": r.join(", ")
                }
            }, e.prototype.getReportDialogEndpoint = function(e) {
                void 0 === e && (e = {});
                var t = this._dsnObject,
                    n = this.getBaseApiEndpoint() + "embed/error-page/",
                    r = [];
                for (var o in r.push("dsn=" + t.toString()), e)
                    if ("user" === o) {
                        if (!e.user) continue;
                        e.user.name && r.push("name=" + encodeURIComponent(e.user.name)), e.user.email && r.push("email=" + encodeURIComponent(e.user.email))
                    } else r.push(encodeURIComponent(o) + "=" + encodeURIComponent(e[o]));
                return r.length ? n + "?" + r.join("&") : n
            }, e.prototype._getEnvelopeEndpoint = function() {
                return this._getIngestEndpoint("envelope")
            }, e.prototype._getIngestEndpoint = function(e) {
                return "" + this.getBaseApiEndpoint() + this._dsnObject.projectId + "/" + e + "/"
            }, e.prototype._encodedAuth = function() {
                return ev({
                    sentry_key: this._dsnObject.user,
                    sentry_version: "7"
                })
            }, e
        }(),
        ub = [];

    function cb(e) {
        var t = {};
        return function(e) {
            var t = e.defaultIntegrations && _m(e.defaultIntegrations) || [],
                n = e.integrations,
                r = [];
            if (Array.isArray(n)) {
                var o = n.map((function(e) {
                        return e.name
                    })),
                    i = [];
                t.forEach((function(e) {
                    -1 === o.indexOf(e.name) && -1 === i.indexOf(e.name) && (r.push(e), i.push(e.name))
                })), n.forEach((function(e) {
                    -1 === i.indexOf(e.name) && (r.push(e), i.push(e.name))
                }))
            } else "function" == typeof n ? (r = n(t), r = Array.isArray(r) ? r : [r]) : r = _m(t);
            var a = r.map((function(e) {
                    return e.name
                })),
                s = "Debug";
            return -1 !== a.indexOf(s) && r.push.apply(r, _m(r.splice(a.indexOf(s), 1))), r
        }(e).forEach((function(e) {
            t[e.name] = e,
                function(e) {
                    -1 === ub.indexOf(e.name) && (e.setupOnce(Kv, tb), ub.push(e.name), _v.log("Integration installed: " + e.name))
                }(e)
        })), t
    }
    var db, fb, pb, hb, gb = function() {
        function e(e, t) {
            this._integrations = {}, this._processing = !1, this._backend = new e(t), this._options = t, t.dsn && (this._dsn = new Hm(t.dsn))
        }
        return e.prototype.captureException = function(e, t, n) {
            var r = this,
                o = t && t.event_id;
            return this._processing = !0, this._getBackend().eventFromException(e, t).then((function(e) {
                o = r.captureEvent(e, t, n)
            })), o
        }, e.prototype.captureMessage = function(e, t, n, r) {
            var o = this,
                i = n && n.event_id;
            return this._processing = !0, (Im(e) ? this._getBackend().eventFromMessage("" + e, t, n) : this._getBackend().eventFromException(e, n)).then((function(e) {
                i = o.captureEvent(e, n, r)
            })), i
        }, e.prototype.captureEvent = function(e, t, n) {
            var r = this,
                o = t && t.event_id;
            return this._processing = !0, this._processEvent(e, t, n).then((function(e) {
                o = e && e.event_id, r._processing = !1
            })).then(null, (function(e) {
                _v.error(e), r._processing = !1
            })), o
        }, e.prototype.getDsn = function() {
            return this._dsn
        }, e.prototype.getOptions = function() {
            return this._options
        }, e.prototype.flush = function(e) {
            var t = this;
            return this._isClientProcessing(e).then((function(n) {
                return clearInterval(n.interval), t._getBackend().getTransport().close(e).then((function(e) {
                    return n.ready && e
                }))
            }))
        }, e.prototype.close = function(e) {
            var t = this;
            return this.flush(e).then((function(e) {
                return t.getOptions().enabled = !1, e
            }))
        }, e.prototype.setupIntegrations = function() {
            this._isEnabled() && (this._integrations = cb(this._options))
        }, e.prototype.getIntegration = function(e) {
            try {
                return this._integrations[e.id] || null
            } catch (t) {
                return _v.warn("Cannot retrieve integration " + e.id + " from the current Client"), null
            }
        }, e.prototype._isClientProcessing = function(e) {
            var t = this;
            return new $v((function(n) {
                var r = 0,
                    o = 0;
                clearInterval(o), o = setInterval((function() {
                    t._processing ? (r += 1, e && r >= e && n({
                        interval: o,
                        ready: !1
                    })) : n({
                        interval: o,
                        ready: !0
                    })
                }), 1)
            }))
        }, e.prototype._getBackend = function() {
            return this._backend
        }, e.prototype._isEnabled = function() {
            return !1 !== this.getOptions().enabled && void 0 !== this._dsn
        }, e.prototype._prepareEvent = function(e, t, n) {
            var r = this,
                o = this.getOptions().normalizeDepth,
                i = void 0 === o ? 3 : o,
                a = bm(bm({}, e), {
                    event_id: e.event_id || (n && n.event_id ? n.event_id : dv()),
                    timestamp: e.timestamp || Yv.dateTimestampInSeconds()
                });
            this._applyClientOptions(a), this._applyIntegrationsMetadata(a);
            var s = t;
            n && n.captureContext && (s = Jv.clone(s).update(n.captureContext));
            var l = $v.resolve(a);
            return s && (l = s.applyToEvent(a, n)), l.then((function(e) {
                return "number" == typeof i && i > 0 ? r._normalizeEvent(e, i) : e
            }))
        }, e.prototype._normalizeEvent = function(e, t) {
            if (!e) return null;
            var n = bm(bm(bm(bm(bm({}, e), e.breadcrumbs && {
                breadcrumbs: e.breadcrumbs.map((function(e) {
                    return bm(bm({}, e), e.data && {
                        data: av(e.data, t)
                    })
                }))
            }), e.user && {
                user: av(e.user, t)
            }), e.contexts && {
                contexts: av(e.contexts, t)
            }), e.extra && {
                extra: av(e.extra, t)
            });
            return e.contexts && e.contexts.trace && (n.contexts.trace = e.contexts.trace), n
        }, e.prototype._applyClientOptions = function(e) {
            var t = this.getOptions(),
                n = t.environment,
                r = t.release,
                o = t.dist,
                i = t.maxValueLength,
                a = void 0 === i ? 250 : i;
            void 0 === e.environment && void 0 !== n && (e.environment = n), void 0 === e.release && void 0 !== r && (e.release = r), void 0 === e.dist && void 0 !== o && (e.dist = o), e.message && (e.message = Jm(e.message, a));
            var s = e.exception && e.exception.values && e.exception.values[0];
            s && s.value && (s.value = Jm(s.value, a));
            var l = e.request;
            l && l.url && (l.url = Jm(l.url, a))
        }, e.prototype._applyIntegrationsMetadata = function(e) {
            var t = e.sdk,
                n = Object.keys(this._integrations);
            t && n.length > 0 && (t.integrations = n)
        }, e.prototype._sendEvent = function(e) {
            this._getBackend().sendEvent(e)
        }, e.prototype._processEvent = function(e, t, n) {
            var r = this,
                o = this.getOptions(),
                i = o.beforeSend,
                a = o.sampleRate;
            if (!this._isEnabled()) return $v.reject("SDK not enabled, will not send event.");
            var s = "transaction" === e.type;
            return !s && "number" == typeof a && Math.random() > a ? $v.reject("This event has been sampled, will not send event.") : new $v((function(o, a) {
                r._prepareEvent(e, n, t).then((function(e) {
                    if (null !== e) {
                        var n = e;
                        if (t && t.data && !0 === t.data.__sentry__ || !i || s) return r._sendEvent(n), void o(n);
                        var l = i(e, t);
                        if (void 0 === l) _v.error("`beforeSend` method has to return `null` or a valid event.");
                        else if (Om(l)) r._handleAsyncBeforeSend(l, o, a);
                        else {
                            if (null === (n = l)) return _v.log("`beforeSend` returned `null`, will not send event."), void o(null);
                            r._sendEvent(n), o(n)
                        }
                    } else a("An event processor returned null, will not send event.")
                })).then(null, (function(e) {
                    r.captureException(e, {
                        data: {
                            __sentry__: !0
                        },
                        originalException: e
                    }), a("Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: " + e)
                }))
            }))
        }, e.prototype._handleAsyncBeforeSend = function(e, t, n) {
            var r = this;
            e.then((function(e) {
                null !== e ? (r._sendEvent(e), t(e)) : n("`beforeSend` returned `null`, will not send event.")
            })).then(null, (function(e) {
                n("beforeSend rejected with " + e)
            }))
        }, e
    }();
    (fb = db || (db = {})).Fatal = "fatal", fb.Error = "error", fb.Warning = "warning", fb.Log = "log", fb.Info = "info", fb.Debug = "debug", fb.Critical = "critical",
        function(e) {
            e.fromString = function(t) {
                switch (t) {
                    case "debug":
                        return e.Debug;
                    case "info":
                        return e.Info;
                    case "warn":
                    case "warning":
                        return e.Warning;
                    case "error":
                        return e.Error;
                    case "fatal":
                        return e.Fatal;
                    case "critical":
                        return e.Critical;
                    case "log":
                    default:
                        return e.Log
                }
            }
        }(db || (db = {})), (hb = pb || (pb = {})).Unknown = "unknown", hb.Skipped = "skipped", hb.Success = "success", hb.RateLimit = "rate_limit", hb.Invalid = "invalid", hb.Failed = "failed",
        function(e) {
            e.fromHttpCode = function(t) {
                return t >= 200 && t < 300 ? e.Success : 429 === t ? e.RateLimit : t >= 400 && t < 500 ? e.Invalid : t >= 500 ? e.Failed : e.Unknown
            }
        }(pb || (pb = {}));
    var mb = function() {
            function e() {}
            return e.prototype.sendEvent = function(e) {
                return $v.resolve({
                    reason: "NoopTransport: Event has been skipped because no Dsn is configured.",
                    status: pb.Skipped
                })
            }, e.prototype.close = function(e) {
                return $v.resolve(!0)
            }, e
        }(),
        vb = function() {
            function e(e) {
                this._options = e, this._options.dsn || _v.warn("No DSN provided, backend will not do anything."), this._transport = this._setupTransport()
            }
            return e.prototype.eventFromException = function(e, t) {
                throw new Lm("Backend has to implement `eventFromException` method")
            }, e.prototype.eventFromMessage = function(e, t, n) {
                throw new Lm("Backend has to implement `eventFromMessage` method")
            }, e.prototype.sendEvent = function(e) {
                this._transport.sendEvent(e).then(null, (function(e) {
                    _v.error("Error while sending event: " + e)
                }))
            }, e.prototype.getTransport = function() {
                return this._transport
            }, e.prototype._setupTransport = function() {
                return new mb
            }, e
        }();

    function bb(e, t) {
        var n = "transaction" === e.type,
            r = {
                body: JSON.stringify(e),
                url: n ? t.getEnvelopeEndpointWithUrlEncodedAuth() : t.getStoreEndpointWithUrlEncodedAuth()
            };
        if (n) {
            var o = JSON.stringify({
                event_id: e.event_id,
                sent_at: (new Date).toISOString()
            }) + "\n" + JSON.stringify({
                type: e.type
            }) + "\n" + r.body;
            r.body = o
        }
        return r
    }
    var yb, wb = {},
        _b = function() {
            function e() {
                this.name = e.id
            }
            return e.prototype.setupOnce = function() {
                yb = Function.prototype.toString, Function.prototype.toString = function() {
                    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                    var n = this.__sentry_original__ || this;
                    return yb.apply(n, e)
                }
            }, e.id = "FunctionToString", e
        }(),
        Sb = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/],
        xb = function() {
            function e(t) {
                void 0 === t && (t = {}), this._options = t, this.name = e.id
            }
            return e.prototype.setupOnce = function() {
                Kv((function(t) {
                    var n = tb();
                    if (!n) return t;
                    var r = n.getIntegration(e);
                    if (r) {
                        var o = n.getClient(),
                            i = o ? o.getOptions() : {},
                            a = r._mergeOptions(i);
                        if (r._shouldDropEvent(t, a)) return null
                    }
                    return t
                }))
            }, e.prototype._shouldDropEvent = function(e, t) {
                return this._isSentryError(e, t) ? (_v.warn("Event dropped due to being internal Sentry Error.\nEvent: " + pv(e)), !0) : this._isIgnoredError(e, t) ? (_v.warn("Event dropped due to being matched by `ignoreErrors` option.\nEvent: " + pv(e)), !0) : this._isDeniedUrl(e, t) ? (_v.warn("Event dropped due to being matched by `denyUrls` option.\nEvent: " + pv(e) + ".\nUrl: " + this._getEventFilterUrl(e)), !0) : !this._isAllowedUrl(e, t) && (_v.warn("Event dropped due to not being matched by `allowUrls` option.\nEvent: " + pv(e) + ".\nUrl: " + this._getEventFilterUrl(e)), !0)
            }, e.prototype._isSentryError = function(e, t) {
                if (!t.ignoreInternal) return !1;
                try {
                    return e && e.exception && e.exception.values && e.exception.values[0] && "SentryError" === e.exception.values[0].type || !1
                } catch (e) {
                    return !1
                }
            }, e.prototype._isIgnoredError = function(e, t) {
                return !(!t.ignoreErrors || !t.ignoreErrors.length) && this._getPossibleEventMessages(e).some((function(e) {
                    return t.ignoreErrors.some((function(t) {
                        return Xm(e, t)
                    }))
                }))
            }, e.prototype._isDeniedUrl = function(e, t) {
                if (!t.denyUrls || !t.denyUrls.length) return !1;
                var n = this._getEventFilterUrl(e);
                return !!n && t.denyUrls.some((function(e) {
                    return Xm(n, e)
                }))
            }, e.prototype._isAllowedUrl = function(e, t) {
                if (!t.allowUrls || !t.allowUrls.length) return !0;
                var n = this._getEventFilterUrl(e);
                return !n || t.allowUrls.some((function(e) {
                    return Xm(n, e)
                }))
            }, e.prototype._mergeOptions = function(e) {
                return void 0 === e && (e = {}), {
                    allowUrls: _m(this._options.whitelistUrls || [], this._options.allowUrls || [], e.whitelistUrls || [], e.allowUrls || []),
                    denyUrls: _m(this._options.blacklistUrls || [], this._options.denyUrls || [], e.blacklistUrls || [], e.denyUrls || []),
                    ignoreErrors: _m(this._options.ignoreErrors || [], e.ignoreErrors || [], Sb),
                    ignoreInternal: void 0 === this._options.ignoreInternal || this._options.ignoreInternal
                }
            }, e.prototype._getPossibleEventMessages = function(e) {
                if (e.message) return [e.message];
                if (e.exception) try {
                    var t = e.exception.values && e.exception.values[0] || {},
                        n = t.type,
                        r = void 0 === n ? "" : n,
                        o = t.value,
                        i = void 0 === o ? "" : o;
                    return ["" + i, r + ": " + i]
                } catch (t) {
                    return _v.error("Cannot extract message for event " + pv(e)), []
                }
                return []
            }, e.prototype._getEventFilterUrl = function(e) {
                try {
                    if (e.stacktrace) {
                        var t = e.stacktrace.frames;
                        return t && t[t.length - 1].filename || null
                    }
                    if (e.exception) {
                        var n = e.exception.values && e.exception.values[0].stacktrace && e.exception.values[0].stacktrace.frames;
                        return n && n[n.length - 1].filename || null
                    }
                    return null
                } catch (t) {
                    return _v.error("Cannot extract url for event " + pv(e)), null
                }
            }, e.id = "InboundFilters", e
        }();
    r(wb, "FunctionToString", (function() {
        return _b
    })), r(wb, "InboundFilters", (function() {
        return xb
    }));
    var Pb = "?",
        kb = /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
        Db = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:file|https?|blob|chrome|webpack|resource|moz-extension|capacitor).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js))(?::(\d+))?(?::(\d+))?\s*$/i,
        Eb = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
        Ib = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
        Tb = /\((\S*)(?::(\d+))(?::(\d+))\)/,
        Cb = /Minified React error #\d+;/i;

    function Fb(e) {
        var t = null,
            n = 0;
        e && ("number" == typeof e.framesToPop ? n = e.framesToPop : Cb.test(e.message) && (n = 1));
        try {
            if (t = function(e) {
                    if (!e || !e.stacktrace) return null;
                    for (var t, n = e.stacktrace, r = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i, o = / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\((.*)\))? in (.*):\s*$/i, i = n.split("\n"), a = [], s = 0; s < i.length; s += 2) {
                        var l = null;
                        (t = r.exec(i[s])) ? l = {
                            url: t[2],
                            func: t[3],
                            args: [],
                            line: +t[1],
                            column: null
                        }: (t = o.exec(i[s])) && (l = {
                            url: t[6],
                            func: t[3] || t[4],
                            args: t[5] ? t[5].split(",") : [],
                            line: +t[1],
                            column: +t[2]
                        }), l && (!l.func && l.line && (l.func = Pb), a.push(l))
                    }
                    if (!a.length) return null;
                    return {
                        message: Ob(e),
                        name: e.name,
                        stack: a
                    }
                }(e)) return Ab(t, n)
        } catch (e) {}
        try {
            if (t = function(e) {
                    if (!e || !e.stack) return null;
                    for (var t, n, r, o = [], i = e.stack.split("\n"), a = 0; a < i.length; ++a) {
                        if (n = kb.exec(i[a])) {
                            var s = n[2] && 0 === n[2].indexOf("native");
                            n[2] && 0 === n[2].indexOf("eval") && (t = Tb.exec(n[2])) && (n[2] = t[1], n[3] = t[2], n[4] = t[3]), r = {
                                url: n[2] && 0 === n[2].indexOf("address at ") ? n[2].substr("address at ".length) : n[2],
                                func: n[1] || Pb,
                                args: s ? [n[2]] : [],
                                line: n[3] ? +n[3] : null,
                                column: n[4] ? +n[4] : null
                            }
                        } else if (n = Eb.exec(i[a])) r = {
                            url: n[2],
                            func: n[1] || Pb,
                            args: [],
                            line: +n[3],
                            column: n[4] ? +n[4] : null
                        };
                        else {
                            if (!(n = Db.exec(i[a]))) continue;
                            n[3] && n[3].indexOf(" > eval") > -1 && (t = Ib.exec(n[3])) ? (n[1] = n[1] || "eval", n[3] = t[1], n[4] = t[2], n[5] = "") : 0 !== a || n[5] || void 0 === e.columnNumber || (o[0].column = e.columnNumber + 1), r = {
                                url: n[3],
                                func: n[1] || Pb,
                                args: n[2] ? n[2].split(",") : [],
                                line: n[4] ? +n[4] : null,
                                column: n[5] ? +n[5] : null
                            }
                        }!r.func && r.line && (r.func = Pb), o.push(r)
                    }
                    if (!o.length) return null;
                    return {
                        message: Ob(e),
                        name: e.name,
                        stack: o
                    }
                }(e)) return Ab(t, n)
        } catch (e) {}
        return {
            message: Ob(e),
            name: e && e.name,
            stack: [],
            failed: !0
        }
    }

    function Ab(e, t) {
        try {
            return bm(bm({}, e), {
                stack: e.stack.slice(t)
            })
        } catch (t) {
            return e
        }
    }

    function Ob(e) {
        var t = e && e.message;
        return t ? t.error && "string" == typeof t.error.message ? t.error.message : t : "No error message"
    }

    function Mb(e) {
        var t = Nb(e.stack),
            n = {
                type: e.name,
                value: e.message
            };
        return t && t.length && (n.stacktrace = {
            frames: t
        }), void 0 === n.type && "" === n.value && (n.value = "Unrecoverable error caught"), n
    }

    function Rb(e) {
        return {
            exception: {
                values: [Mb(e)]
            }
        }
    }

    function Nb(e) {
        if (!e || !e.length) return [];
        var t = e,
            n = t[0].func || "",
            r = t[t.length - 1].func || "";
        return -1 === n.indexOf("captureMessage") && -1 === n.indexOf("captureException") || (t = t.slice(1)), -1 !== r.indexOf("sentryWrapped") && (t = t.slice(0, -1)), t.slice(0, 50).map((function(e) {
            return {
                colno: null === e.column ? void 0 : e.column,
                filename: e.url || t[0].url,
                function: e.func || "?",
                in_app: !0,
                lineno: null === e.line ? void 0 : e.line
            }
        })).reverse()
    }

    function Ub(e, t, n) {
        var r;
        if (void 0 === n && (n = {}), Pm(e) && e.error) return r = Rb(Fb(e = e.error));
        if (km(e) || Dm(e)) {
            var o = e,
                i = o.name || (km(o) ? "DOMError" : "DOMException"),
                a = o.message ? i + ": " + o.message : i;
            return gv(r = Bb(a, t, n), a), r
        }
        return xm(e) ? r = Rb(Fb(e)) : Tm(e) || Cm(e) ? (mv(r = function(e, t, n) {
            var r = {
                exception: {
                    values: [{
                        type: Cm(e) ? e.constructor.name : n ? "UnhandledRejection" : "Error",
                        value: "Non-Error " + (n ? "promise rejection" : "exception") + " captured with keys: " + sv(e)
                    }]
                },
                extra: {
                    __serialized__: rv(e)
                }
            };
            if (t) {
                var o = Nb(Fb(t).stack);
                r.stacktrace = {
                    frames: o
                }
            }
            return r
        }(e, t, n.rejection), {
            synthetic: !0
        }), r) : (gv(r = Bb(e, t, n), "" + e, void 0), mv(r, {
            synthetic: !0
        }), r)
    }

    function Bb(e, t, n) {
        void 0 === n && (n = {});
        var r = {
            message: e
        };
        if (n.attachStacktrace && t) {
            var o = Nb(Fb(t).stack);
            r.stacktrace = {
                frames: o
            }
        }
        return r
    }
    var Lb = {},
        jb = function() {
            function e(e) {
                this.options = e, this._buffer = new Wv(30), this._api = new lb(this.options.dsn), this.url = this._api.getStoreEndpointWithUrlEncodedAuth()
            }
            return e.prototype.sendEvent = function(e) {
                throw new Lm("Transport Class has to implement `sendEvent` method")
            }, e.prototype.close = function(e) {
                return this._buffer.drain(e)
            }, e
        }(),
        Vb = cv(),
        Hb = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._disabledUntil = new Date(Date.now()), t
            }
            return vm(t, e), t.prototype.sendEvent = function(e) {
                var t = this;
                if (new Date(Date.now()) < this._disabledUntil) return Promise.reject({
                    event: e,
                    reason: "Transport locked till " + this._disabledUntil + " due to too many requests.",
                    status: 429
                });
                var n = bb(e, this._api),
                    r = {
                        body: n.body,
                        method: "POST",
                        referrerPolicy: Dv() ? "origin" : ""
                    };
                return void 0 !== this.options.fetchParameters && Object.assign(r, this.options.fetchParameters), void 0 !== this.options.headers && (r.headers = this.options.headers), this._buffer.add(new $v((function(e, o) {
                    Vb.fetch(n.url, r).then((function(n) {
                        var r = pb.fromHttpCode(n.status);
                        if (r !== pb.Success) {
                            if (r === pb.RateLimit) {
                                var i = Date.now(),
                                    a = n.headers.get("Retry-After");
                                t._disabledUntil = new Date(i + bv(i, a)), _v.warn("Too many requests, backing off till: " + t._disabledUntil)
                            }
                            o(n)
                        } else e({
                            status: r
                        })
                    })).catch(o)
                })))
            }, t
        }(jb),
        qb = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t._disabledUntil = new Date(Date.now()), t
            }
            return vm(t, e), t.prototype.sendEvent = function(e) {
                var t = this;
                if (new Date(Date.now()) < this._disabledUntil) return Promise.reject({
                    event: e,
                    reason: "Transport locked till " + this._disabledUntil + " due to too many requests.",
                    status: 429
                });
                var n = bb(e, this._api);
                return this._buffer.add(new $v((function(e, r) {
                    var o = new XMLHttpRequest;
                    for (var i in o.onreadystatechange = function() {
                            if (4 === o.readyState) {
                                var n = pb.fromHttpCode(o.status);
                                if (n !== pb.Success) {
                                    if (n === pb.RateLimit) {
                                        var i = Date.now(),
                                            a = o.getResponseHeader("Retry-After");
                                        t._disabledUntil = new Date(i + bv(i, a)), _v.warn("Too many requests, backing off till: " + t._disabledUntil)
                                    }
                                    r(o)
                                } else e({
                                    status: n
                                })
                            }
                        }, o.open("POST", n.url), t.options.headers) t.options.headers.hasOwnProperty(i) && o.setRequestHeader(i, t.options.headers[i]);
                    o.send(n.body)
                })))
            }, t
        }(jb);
    r(Lb, "BaseTransport", (function() {
        return jb
    })), r(Lb, "FetchTransport", (function() {
        return Hb
    })), r(Lb, "XHRTransport", (function() {
        return qb
    }));
    var zb = function(e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return vm(t, e), t.prototype.eventFromException = function(e, t) {
                return function(e, t, n) {
                    var r = Ub(t, n && n.syntheticException || void 0, {
                        attachStacktrace: e.attachStacktrace
                    });
                    return mv(r, {
                        handled: !0,
                        type: "generic"
                    }), r.level = db.Error, n && n.event_id && (r.event_id = n.event_id), $v.resolve(r)
                }(this._options, e, t)
            }, t.prototype.eventFromMessage = function(e, t, n) {
                return void 0 === t && (t = db.Info),
                    function(e, t, n, r) {
                        void 0 === n && (n = db.Info);
                        var o = Bb(t, r && r.syntheticException || void 0, {
                            attachStacktrace: e.attachStacktrace
                        });
                        return o.level = n, r && r.event_id && (o.event_id = r.event_id), $v.resolve(o)
                    }(this._options, e, t, n)
            }, t.prototype._setupTransport = function() {
                if (!this._options.dsn) return e.prototype._setupTransport.call(this);
                var t = bm(bm({}, this._options.transportOptions), {
                    dsn: this._options.dsn
                });
                return this._options.transport ? new this._options.transport(t) : xv() ? new Hb(t) : new qb(t)
            }, t
        }(vb),
        Gb = 0;

    function $b() {
        return Gb > 0
    }

    function Wb() {
        Gb += 1, setTimeout((function() {
            Gb -= 1
        }))
    }

    function Yb(e, t, n) {
        if (void 0 === t && (t = {}), "function" != typeof e) return e;
        try {
            if (e.__sentry__) return e;
            if (e.__sentry_wrapped__) return e.__sentry_wrapped__
        } catch (t) {
            return e
        }
        var r = function() {
            var r = Array.prototype.slice.call(arguments);
            try {
                n && "function" == typeof n && n.apply(this, arguments);
                var o = r.map((function(e) {
                    return Yb(e, t)
                }));
                return e.handleEvent ? e.handleEvent.apply(this, o) : e.apply(this, o)
            } catch (e) {
                throw Wb(), sb((function(n) {
                    n.addEventProcessor((function(e) {
                        var n = bm({}, e);
                        return t.mechanism && (gv(n, void 0, void 0), mv(n, t.mechanism)), n.extra = bm(bm({}, n.extra), {
                            arguments: r
                        }), n
                    })), ab(e)
                })), e
            }
        };
        try {
            for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o])
        } catch (e) {}
        e.prototype = e.prototype || {}, r.prototype = e.prototype, Object.defineProperty(e, "__sentry_wrapped__", {
            enumerable: !1,
            value: r
        }), Object.defineProperties(r, {
            __sentry__: {
                enumerable: !1,
                value: !0
            },
            __sentry_original__: {
                enumerable: !1,
                value: e
            }
        });
        try {
            Object.getOwnPropertyDescriptor(r, "name").configurable && Object.defineProperty(r, "name", {
                get: function() {
                    return e.name
                }
            })
        } catch (e) {}
        return r
    }

    function Jb(e) {
        if (void 0 === e && (e = {}), e.eventId)
            if (e.dsn) {
                var t = document.createElement("script");
                t.async = !0, t.src = new lb(e.dsn).getReportDialogEndpoint(e), e.onLoad && (t.onload = e.onLoad), (document.head || document.body).appendChild(t)
            } else _v.error("Missing dsn option in showReportDialog call");
        else _v.error("Missing eventId option in showReportDialog call")
    }
    var Qb = {},
        Kb = function() {
            function e(t) {
                this.name = e.id, this._onErrorHandlerInstalled = !1, this._onUnhandledRejectionHandlerInstalled = !1, this._options = bm({
                    onerror: !0,
                    onunhandledrejection: !0
                }, t)
            }
            return e.prototype.setupOnce = function() {
                Error.stackTraceLimit = 50, this._options.onerror && (_v.log("Global Handler attached: onerror"), this._installGlobalOnErrorHandler()), this._options.onunhandledrejection && (_v.log("Global Handler attached: onunhandledrejection"), this._installGlobalOnUnhandledRejectionHandler())
            }, e.prototype._installGlobalOnErrorHandler = function() {
                var t = this;
                this._onErrorHandlerInstalled || (Ov({
                    callback: function(n) {
                        var r = n.error,
                            o = tb(),
                            i = o.getIntegration(e),
                            a = r && !0 === r.__sentry_own_request__;
                        if (i && !$b() && !a) {
                            var s = o.getClient(),
                                l = Im(r) ? t._eventFromIncompleteOnError(n.msg, n.url, n.line, n.column) : t._enhanceEventWithInitialFrame(Ub(r, void 0, {
                                    attachStacktrace: s && s.getOptions().attachStacktrace,
                                    rejection: !1
                                }), n.url, n.line, n.column);
                            mv(l, {
                                handled: !1,
                                type: "onerror"
                            }), o.captureEvent(l, {
                                originalException: r
                            })
                        }
                    },
                    type: "error"
                }), this._onErrorHandlerInstalled = !0)
            }, e.prototype._installGlobalOnUnhandledRejectionHandler = function() {
                var t = this;
                this._onUnhandledRejectionHandlerInstalled || (Ov({
                    callback: function(n) {
                        var r = n;
                        try {
                            "reason" in n ? r = n.reason : "detail" in n && "reason" in n.detail && (r = n.detail.reason)
                        } catch (e) {}
                        var o = tb(),
                            i = o.getIntegration(e),
                            a = r && !0 === r.__sentry_own_request__;
                        if (!i || $b() || a) return !0;
                        var s = o.getClient(),
                            l = Im(r) ? t._eventFromIncompleteRejection(r) : Ub(r, void 0, {
                                attachStacktrace: s && s.getOptions().attachStacktrace,
                                rejection: !0
                            });
                        l.level = db.Error, mv(l, {
                            handled: !1,
                            type: "onunhandledrejection"
                        }), o.captureEvent(l, {
                            originalException: r
                        })
                    },
                    type: "unhandledrejection"
                }), this._onUnhandledRejectionHandlerInstalled = !0)
            }, e.prototype._eventFromIncompleteOnError = function(e, t, n, r) {
                var o, i = Pm(e) ? e.message : e;
                if (Em(i)) {
                    var a = i.match(/^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i);
                    a && (o = a[1], i = a[2])
                }
                var s = {
                    exception: {
                        values: [{
                            type: o || "Error",
                            value: i
                        }]
                    }
                };
                return this._enhanceEventWithInitialFrame(s, t, n, r)
            }, e.prototype._eventFromIncompleteRejection = function(e) {
                return {
                    exception: {
                        values: [{
                            type: "UnhandledRejection",
                            value: "Non-Error promise rejection captured with value: " + e
                        }]
                    }
                }
            }, e.prototype._enhanceEventWithInitialFrame = function(e, t, n, r) {
                e.exception = e.exception || {}, e.exception.values = e.exception.values || [], e.exception.values[0] = e.exception.values[0] || {}, e.exception.values[0].stacktrace = e.exception.values[0].stacktrace || {}, e.exception.values[0].stacktrace.frames = e.exception.values[0].stacktrace.frames || [];
                var o = isNaN(parseInt(r, 10)) ? void 0 : r,
                    i = isNaN(parseInt(n, 10)) ? void 0 : n,
                    a = Em(t) && t.length > 0 ? t : vv();
                return 0 === e.exception.values[0].stacktrace.frames.length && e.exception.values[0].stacktrace.frames.push({
                    colno: o,
                    filename: a,
                    function: "?",
                    in_app: !0,
                    lineno: i
                }), e
            }, e.id = "GlobalHandlers", e
        }(),
        Xb = ["EventTarget", "Window", "Node", "ApplicationCache", "AudioTrackList", "ChannelMergerNode", "CryptoOperation", "EventSource", "FileReader", "HTMLUnknownElement", "IDBDatabase", "IDBRequest", "IDBTransaction", "KeyOperation", "MediaController", "MessagePort", "ModalWindow", "Notification", "SVGElementInstance", "Screen", "TextTrack", "TextTrackCue", "TextTrackList", "WebSocket", "WebSocketWorker", "Worker", "XMLHttpRequest", "XMLHttpRequestEventTarget", "XMLHttpRequestUpload"],
        Zb = function() {
            function e(t) {
                this.name = e.id, this._options = bm({
                    XMLHttpRequest: !0,
                    eventTarget: !0,
                    requestAnimationFrame: !0,
                    setInterval: !0,
                    setTimeout: !0
                }, t)
            }
            return e.prototype.setupOnce = function() {
                var e = cv();
                (this._options.setTimeout && Zm(e, "setTimeout", this._wrapTimeFunction.bind(this)), this._options.setInterval && Zm(e, "setInterval", this._wrapTimeFunction.bind(this)), this._options.requestAnimationFrame && Zm(e, "requestAnimationFrame", this._wrapRAF.bind(this)), this._options.XMLHttpRequest && "XMLHttpRequest" in e && Zm(XMLHttpRequest.prototype, "send", this._wrapXHR.bind(this)), this._options.eventTarget) && (Array.isArray(this._options.eventTarget) ? this._options.eventTarget : Xb).forEach(this._wrapEventTarget.bind(this))
            }, e.prototype._wrapTimeFunction = function(e) {
                return function() {
                    for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                    var r = t[0];
                    return t[0] = Yb(r, {
                        mechanism: {
                            data: {
                                function: Wm(e)
                            },
                            handled: !0,
                            type: "instrument"
                        }
                    }), e.apply(this, t)
                }
            }, e.prototype._wrapRAF = function(e) {
                return function(t) {
                    return e.call(this, Yb(t, {
                        mechanism: {
                            data: {
                                function: "requestAnimationFrame",
                                handler: Wm(e)
                            },
                            handled: !0,
                            type: "instrument"
                        }
                    }))
                }
            }, e.prototype._wrapEventTarget = function(e) {
                var t = cv(),
                    n = t[e] && t[e].prototype;
                n && n.hasOwnProperty && n.hasOwnProperty("addEventListener") && (Zm(n, "addEventListener", (function(t) {
                    return function(n, r, o) {
                        try {
                            "function" == typeof r.handleEvent && (r.handleEvent = Yb(r.handleEvent.bind(r), {
                                mechanism: {
                                    data: {
                                        function: "handleEvent",
                                        handler: Wm(r),
                                        target: e
                                    },
                                    handled: !0,
                                    type: "instrument"
                                }
                            }))
                        } catch (e) {}
                        return t.call(this, n, Yb(r, {
                            mechanism: {
                                data: {
                                    function: "addEventListener",
                                    handler: Wm(r),
                                    target: e
                                },
                                handled: !0,
                                type: "instrument"
                            }
                        }), o)
                    }
                })), Zm(n, "removeEventListener", (function(e) {
                    return function(t, n, r) {
                        try {
                            e.call(this, t, n.__sentry_wrapped__, r)
                        } catch (e) {}
                        return e.call(this, t, n, r)
                    }
                })))
            }, e.prototype._wrapXHR = function(e) {
                return function() {
                    for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                    var r = this,
                        o = ["onload", "onerror", "onprogress", "onreadystatechange"];
                    return o.forEach((function(e) {
                        e in r && "function" == typeof r[e] && Zm(r, e, (function(t) {
                            var n = {
                                mechanism: {
                                    data: {
                                        function: e,
                                        handler: Wm(t)
                                    },
                                    handled: !0,
                                    type: "instrument"
                                }
                            };
                            return t.__sentry_original__ && (n.mechanism.data.handler = Wm(t.__sentry_original__)), Yb(t, n)
                        }))
                    })), e.apply(this, t)
                }
            }, e.id = "TryCatch", e
        }(),
        ey = function() {
            function e(t) {
                this.name = e.id, this._options = bm({
                    console: !0,
                    dom: !0,
                    fetch: !0,
                    history: !0,
                    sentry: !0,
                    xhr: !0
                }, t)
            }
            return e.prototype.addSentryBreadcrumb = function(e) {
                this._options.sentry && tb().addBreadcrumb({
                    category: "sentry." + ("transaction" === e.type ? "transaction" : "event"),
                    event_id: e.event_id,
                    level: e.level,
                    message: pv(e)
                }, {
                    event: e
                })
            }, e.prototype.setupOnce = function() {
                var e = this;
                this._options.console && Ov({
                    callback: function() {
                        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                        e._consoleBreadcrumb.apply(e, _m(t))
                    },
                    type: "console"
                }), this._options.dom && Ov({
                    callback: function() {
                        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                        e._domBreadcrumb.apply(e, _m(t))
                    },
                    type: "dom"
                }), this._options.xhr && Ov({
                    callback: function() {
                        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                        e._xhrBreadcrumb.apply(e, _m(t))
                    },
                    type: "xhr"
                }), this._options.fetch && Ov({
                    callback: function() {
                        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                        e._fetchBreadcrumb.apply(e, _m(t))
                    },
                    type: "fetch"
                }), this._options.history && Ov({
                    callback: function() {
                        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                        e._historyBreadcrumb.apply(e, _m(t))
                    },
                    type: "history"
                })
            }, e.prototype._consoleBreadcrumb = function(e) {
                var t = {
                    category: "console",
                    data: {
                        arguments: e.args,
                        logger: "console"
                    },
                    level: db.fromString(e.level),
                    message: Km(e.args, " ")
                };
                if ("assert" === e.level) {
                    if (!1 !== e.args[0]) return;
                    t.message = "Assertion failed: " + (Km(e.args.slice(1), " ") || "console.assert"), t.data.arguments = e.args.slice(1)
                }
                tb().addBreadcrumb(t, {
                    input: e.args,
                    level: e.level
                })
            }, e.prototype._domBreadcrumb = function(e) {
                var t;
                try {
                    t = e.event.target ? Nm(e.event.target) : Nm(e.event)
                } catch (e) {
                    t = "<unknown>"
                }
                0 !== t.length && tb().addBreadcrumb({
                    category: "ui." + e.name,
                    message: t
                }, {
                    event: e.event,
                    name: e.name
                })
            }, e.prototype._xhrBreadcrumb = function(e) {
                if (e.endTimestamp) {
                    if (e.xhr.__sentry_own_request__) return;
                    var t = e.xhr.__sentry_xhr__ || {},
                        n = t.method,
                        r = t.url,
                        o = t.status_code,
                        i = t.body;
                    tb().addBreadcrumb({
                        category: "xhr",
                        data: {
                            method: n,
                            url: r,
                            status_code: o
                        },
                        type: "http"
                    }, {
                        xhr: e.xhr,
                        input: i
                    })
                } else;
            }, e.prototype._fetchBreadcrumb = function(e) {
                e.endTimestamp && (e.fetchData.url.match(/sentry_key/) && "POST" === e.fetchData.method || (e.error ? tb().addBreadcrumb({
                    category: "fetch",
                    data: e.fetchData,
                    level: db.Error,
                    type: "http"
                }, {
                    data: e.error,
                    input: e.args
                }) : tb().addBreadcrumb({
                    category: "fetch",
                    data: bm(bm({}, e.fetchData), {
                        status_code: e.response.status
                    }),
                    type: "http"
                }, {
                    input: e.args,
                    response: e.response
                })))
            }, e.prototype._historyBreadcrumb = function(e) {
                var t = cv(),
                    n = e.from,
                    r = e.to,
                    o = fv(t.location.href),
                    i = fv(n),
                    a = fv(r);
                i.path || (i = o), o.protocol === a.protocol && o.host === a.host && (r = a.relative), o.protocol === i.protocol && o.host === i.host && (n = i.relative), tb().addBreadcrumb({
                    category: "navigation",
                    data: {
                        from: n,
                        to: r
                    }
                })
            }, e.id = "Breadcrumbs", e
        }(),
        ty = function() {
            function e(t) {
                void 0 === t && (t = {}), this.name = e.id, this._key = t.key || "cause", this._limit = t.limit || 5
            }
            return e.prototype.setupOnce = function() {
                Kv((function(t, n) {
                    var r = tb().getIntegration(e);
                    return r ? r._handler(t, n) : t
                }))
            }, e.prototype._handler = function(e, t) {
                if (!(e.exception && e.exception.values && t && Rm(t.originalException, Error))) return e;
                var n = this._walkErrorTree(t.originalException, this._key);
                return e.exception.values = _m(n, e.exception.values), e
            }, e.prototype._walkErrorTree = function(e, t, n) {
                if (void 0 === n && (n = []), !Rm(e[t], Error) || n.length + 1 >= this._limit) return n;
                var r = Mb(Fb(e[t]));
                return this._walkErrorTree(e[t], t, _m([r], n))
            }, e.id = "LinkedErrors", e
        }(),
        ny = cv(),
        ry = function() {
            function e() {
                this.name = e.id
            }
            return e.prototype.setupOnce = function() {
                Kv((function(t) {
                    var n, r, o;
                    if (tb().getIntegration(e)) {
                        if (!ny.navigator && !ny.location && !ny.document) return t;
                        var i = (null === (n = t.request) || void 0 === n ? void 0 : n.url) || (null === (r = ny.location) || void 0 === r ? void 0 : r.href),
                            a = (ny.document || {}).referrer,
                            s = (ny.navigator || {}).userAgent,
                            l = bm(bm(bm({}, null === (o = t.request) || void 0 === o ? void 0 : o.headers), a && {
                                Referer: a
                            }), s && {
                                "User-Agent": s
                            }),
                            u = bm(bm({}, i && {
                                url: i
                            }), {
                                headers: l
                            });
                        return bm(bm({}, t), {
                            request: u
                        })
                    }
                    return t
                }))
            }, e.id = "UserAgent", e
        }();
    r(Qb, "GlobalHandlers", (function() {
        return Kb
    })), r(Qb, "TryCatch", (function() {
        return Zb
    })), r(Qb, "Breadcrumbs", (function() {
        return ey
    })), r(Qb, "LinkedErrors", (function() {
        return ty
    })), r(Qb, "UserAgent", (function() {
        return ry
    }));
    var oy = "5.25.0",
        iy = function(e) {
            function t(t) {
                return void 0 === t && (t = {}), e.call(this, zb, t) || this
            }
            return vm(t, e), t.prototype.showReportDialog = function(e) {
                void 0 === e && (e = {}), cv().document && (this._isEnabled() ? Jb(bm(bm({}, e), {
                    dsn: e.dsn || this.getDsn()
                })) : _v.error("Trying to call showReportDialog with Sentry Client disabled"))
            }, t.prototype._prepareEvent = function(t, n, r) {
                return t.platform = t.platform || "javascript", t.sdk = bm(bm({}, t.sdk), {
                    name: "sentry.javascript.browser",
                    packages: _m(t.sdk && t.sdk.packages || [], [{
                        name: "npm:@sentry/browser",
                        version: oy
                    }]),
                    version: oy
                }), e.prototype._prepareEvent.call(this, t, n, r)
            }, t.prototype._sendEvent = function(t) {
                var n = this.getIntegration(ey);
                n && n.addSentryBreadcrumb(t), e.prototype._sendEvent.call(this, t)
            }, t
        }(gb),
        ay = [new wb.InboundFilters, new wb.FunctionToString, new Zb, new ey, new Kb, new ty, new ry];

    function sy(e) {
        if (void 0 === e && (e = {}), void 0 === e.defaultIntegrations && (e.defaultIntegrations = ay), void 0 === e.release) {
            var t = cv();
            t.SENTRY_RELEASE && t.SENTRY_RELEASE.id && (e.release = t.SENTRY_RELEASE.id)
        }! function(e, t) {
            !0 === t.debug && _v.enable();
            var n = tb(),
                r = new e(t);
            n.bindClient(r)
        }(iy, e)
    }
    const {
        model: ly
    } = Dg, uy = ["ResizeObserver loop limit exceeded", "Unable to preventDefault inside passive event listener", "Extension context invalidated.", "Invalid or unexpected token", "AbortError: The play() request was interrupted by a call to pause(). https://goo.gl/LdLk22", "InvalidStateError: Failed to execute 'transaction' on 'IDBDatabase'", "Timed out", "Failed to fetch"];
    var cy = {
        controller: {
            throttle: !1,
            init: function({
                throttleBy: e = 10,
                dsn: t
            }) {
                if (t) {
                    if (this.dsn = t, u.is.development) this.throttle = !1;
                    else if (e <= 1) this.throttle = !1;
                    else {
                        let t = localStorage.getItem("sentry-user-hash");
                        t || (t = Math.floor(1e13 * Math.random()), localStorage.setItem("sentry-user-hash", t)), this.throttle = t % e != 0
                    }
                    this._setup()
                } else console.error("sentry init failed: dsn is not provided")
            },
            _setup: function() {
                u.is.development || (sy({
                    dsn: this.dsn,
                    release: u.version,
                    debug: u.is.development,
                    ignoreErrors: uy,
                    environment: u.is.development ? "development" : u.is.production ? "production" : "unknown",
                    beforeSend: (e, t) => {
                        if (u.is.production && "debug" === e.level) return null;
                        if (this.throttle) return null;
                        if (ly.store && ly.state) {
                            let t = {
                                ...ly.state,
                                authStatus: {
                                    ...ly.state.authStatus
                                }
                            };
                            delete t.authStatus.cookies, t = JSON.stringify(t), t = t.length > 102400 ? t.substr(0, 102400) + "..." : ly.state, e.extra = {
                                ...e.extra || {},
                                state: t
                            }
                        }
                        const n = t.originalException,
                            r = n && n.message || String(n);
                        return r && uy.some((e => r.includes(e))) ? null : e
                    }
                }), log("sentry-controller: initialisation succeeded"))
            },
            sendError: function(e, t = "error", n = null, r = null) {
                console.log("%csentry", "color: #c818dc", e, n), u.is.background && $g.send("popup.log", "%csentry error [background]", "color: #c818dc", e, n), "string" == typeof e && (e = new Error(e)), ib("configureScope", (o => {
                    if (o.setFingerprint([e.message]), o.setLevel(t), ly.store && ly.state && ly.state.authStatus && o.setUser({
                            username: ly.state.authStatus.username
                        }), n)
                        for (const e in n) {
                            let t = n[e];
                            "string" == typeof t && t.length > 15500 && (t = t.substr(0, 15500)), o.setExtra(e, t)
                        }
                    if (r)
                        for (const e in r) {
                            const t = r[e];
                            o.setTag(e, t)
                        }
                })), ab(e)
            }
        }
    };
    new gm.Sender({
        urlPrefix: u.options.apiUrl
    });
    var dy = Jg;
    const {
        model: fy
    } = Dg, py = {
        ...dy,
        isAcknowledged: function(e) {
            return -1 !== fy.state.acknowledged[e]
        },
        userId: function() {
            return fy.state.authStatus.userId
        },
        username: function() {
            return fy.state.authStatus.username
        },
        allUsernames: function() {
            const e = fy.state,
                t = [],
                n = e => t.push(e.authStatus.username);
            n(e);
            for (const t in e.userStates) n(e.userStates[t]);
            return t
        }
    }, {
        action: hy
    } = Dg;
    var gy = hy("state.replace-state", ((e, t) => t));
    const {
        action: my
    } = Dg;
    var vy = my("state.acknowledge", ((e, t) => {
            const n = S.getUnixTime();
            return {
                ...e,
                acknowledged: {
                    ...e.acknowledged,
                    [t]: n
                }
            }
        })),
        by = () => [{
            id: "v25.1.0",
            header: "Carousels Post Later",
            subheader: "v25.1.0",
            hexImage: "hex-schedule",
            content: ["Upload or drag & drop multiple files to Post Later to schedule them for posting as a carousel."]
        }, {
            id: "v25.0.0",
            header: "Advanced Post Later",
            subheader: "v25.0.0",
            hexImage: "hex-schedule",
            content: ["Improved Post Later interface and auto-publishing stability. Manage multiple accounts in Post Later interface seamlessly. Bulk upload files for scheduling."]
        }, {
            id: "v24.0.0",
            header: "Post Later",
            subheader: "v24.0.0",
            hexImage: "hex-schedule",
            content: ["INSSIST now supports Delayed Posting for Posts, Photo and Video Stories and Reels. Facebook account is not required to schedule posts with delayed posting."]
        }, {
            id: "v23.6.0",
            header: "Fixes and Future Plans",
            subheader: "v23.6.0",
            hexImage: "hex-schedule"
        }, {
            id: "v23.3.0",
            header: "Major Functionality Fixes",
            subheader: "v23.3.0",
            hexImage: "hex-bug",
            content: ["Restored all app functions broken due to recent changes introduced by Instagram update to internal data and media handling systems."]
        }, {
            id: "v23.1.0",
            header: "Instagram Update Bug Fixes",
            subheader: "v23.1.0",
            hexImage: "hex-bug",
            content: ["Fixed a number of bugs introduced by Instagram in the recent mobile and desktop app update: reels failed to be published through instagram.com, posted videos were duplicated under reels tab and showing with a wrong icon, restored search panel functionality of the explore page, and other improvements and fixes."]
        }, {
            id: "v23.0.0",
            header: "Ghost View Mode for Stories",
            subheader: "v23.0.0",
            hexImage: "hex-ghost",
            content: ["Switch to a Ghost View Mode and watch stories anonymously. Story owner won’t know if you watched their story."]
        }, {
            id: "v22.0.0",
            header: "Story Assist",
            subheader: "v22.0.0",
            hexImage: "hex-story",
            content: ["Added user tagging feature in stories, fixed avatars rendering Instagram bug, fixed reels API connectivity and other issues."]
        }, {
            id: "v21.1.0",
            header: "Improvements and Bug Fixes",
            subheader: "v21.1.0",
            hexImage: "hex-update",
            content: ["Fixed custom video covers and music file uploads to fail in certain scenarios. Styling and usability improvements in the app. Fixed tooltips rendering in the IG frame. Fixed app rendering artifacts on slow Internet connection and more."]
        }, {
            id: "v21.0.0",
            header: "Posting Functionality Restored",
            subheader: "v21.0.0",
            hexImage: "hex-bug",
            content: ["Restored posting functionality and fixed problems caused by the IG platform overhaul.", "Improved app stability, dark theme, custom cover feature, videos autoplay on carousels and fixed multiple bugs."]
        }, {
            id: "v20.2.0",
            header: "Reels Improvements",
            subheader: "v20.2.0",
            hexImage: "hex-bug",
            content: ["Added support for locations and people mentions (tagging) on Reels posting.", "Fixed original audio automatically muted by Chrome v100. Fixed followers and followings not showing up correctly in the wide mode. Fixed DM not showing DM folders."]
        }, {
            id: "v20.1.0",
            header: "Bug Fixing",
            subheader: "v20.1.0",
            hexImage: "hex-bug",
            content: ["Fixed scheduling connection setup, fixed isolation policy error, improved reels posting, post management error handling and usability."]
        }, {
            id: "v20.0.0",
            header: "Music",
            subheader: "v20.0.0",
            hexImage: "hex-music",
            content: ["Add music or upload your tracks to Reels, Stories and Videos. Royalty-free music is provided by tunetank.com."]
        }, {
            id: "v19.0.0",
            header: "Quick Replies in DM",
            subheader: "v19.0.0",
            hexImage: "hex-dm",
            content: ["Send Quick Replies in chats by typing / symbol followed by reply shortcut. Configure an unlimited number of replies for business or personal use.", "Inssist Quick Replies support template messages and @name, @username variables."]
        }, {
            id: "v18.0.9",
            header: "Bug Fixing",
            subheader: "v18.0.9",
            hexImage: "hex-bug",
            content: ["Fixed Instagram bug that caused a blank screen to load for some users. Fixed Zen mode, story mentions and other issues."]
        }, {
            id: "posting-from-website",
            header: "Posting from website",
            subheader: "v18.0.0",
            hexImage: "hex-igswiss"
        }, {
            id: "v17.3.0",
            header: "60s Reels",
            subheader: "v17.3.0",
            hexImage: "hex-reels",
            content: ["Inssist can now post Reels of up to 60s long, up from 30s before.", "CSV import now supports “multiline \\n captions” and break lines with \\n symbols.", "This release improves posting stability."]
        }, {
            id: "v17.0.0",
            header: "Bulk & CSV Scheduling",
            subheader: "v17.0.0",
            hexImage: "hex-schedule",
            content: ["Added “BULK” section to the Scheduling module that supports applying bulk commands: scheduling, drafting, deleting posts.", "You can now reschedule posts across time-slots or intervals with a few clicks and edit captions of all scheduled posts from a single screen.", "Inssist now knows how to parse CSV files so that you can drag and drop those and schedule posts even faster.", "Scheduling interface has been significantly speed up comparing to the previous versions."]
        }, {
            id: "macos",
            header: "Experimental MacOS version",
            subheader: "v15.2.3",
            hexImage: "hex-macos"
        }, {
            id: "v15.1.0",
            header: "Usability & Bug Fixes",
            subheader: "v15.1.0",
            hexImage: "hex-bug",
            content: ["Post Assistant now supports custom aspect ratios for images in addition to default square, portrait and landscape ones.", "Fix for the Instagram “video failed to post” and other bugs."]
        }, {
            id: "v15.0.3",
            header: "Bug Fixing",
            subheader: "v15.0.3",
            hexImage: "hex-bug",
            content: ["Fixed missing delete button in Post Assistant. Fixed dark theme Reels UI. Fixed “Post did not upload” video publishing issue."]
        }, {
            id: "reels",
            header: "Reels",
            subheader: "v15.0.0",
            hexImage: "hex-reels",
            content: ["Inssist can now post Reels! It ensures the best quality and does not compress your videos.", "Instagram Reels is a short-video format, similar to TikTok. Instagram platform limits Reels to 50 countries, including the United States.", "Posting Reels is a PRO feature, and you can repost Reels from other accounts and apply custom covers with Inssist."]
        }, {
            id: "v13.1.0",
            header: "Hashtag Collections",
            subheader: "v13.1.0",
            hexImage: "hex-tag",
            content: ["Now you can create and manage your Hashtag collections with Inssist."]
        }, {
            id: "v11.5.0",
            header: "Lifetime Deal",
            subheader: "v11.5.0",
            hexImage: "hex-lifetime",
            content: ["Claim your Inssist PRO Lifetime Deal!", "Now you can get Inssist PRO license for life with a one time purchase, before only a monthly subscription option was available.", "For businesses managing many accounts there is a special Infinite plan. Check it out!"]
        }, {
            id: "v11.2.0",
            header: "Swipe Up",
            subheader: "v11.2.0",
            hexImage: "hex-swipe-up",
            content: ["Swipe Up feature (adding links to stories) is now available for accounts of more than 10k followers."]
        }, {
            id: "v11.1.0",
            header: "Editing Captions",
            subheader: "v11.1.0",
            hexImage: "hex-caption",
            content: ["This version brings support for editing posts. You can now edit posts and update post captions after they are published without a need to connect to Facebook API."]
        }, {
            id: "v11.0.0",
            header: "Video Thumbnails / Covers",
            subheader: "v11.0.0",
            hexImage: "hex-video",
            content: ["Version 11 brings support for covers to video posting.", "Whenever you upload a video to post you can choose a thumbnail from a list of auto-generated covers, a specific video frame or even upload a custom image to be used.", "You can also preview your Instagram grid with the selected cover before posting."]
        }, {
            id: "v10.1.0",
            header: "Zen Mode",
            subheader: "v10.1.0",
            hexImage: "hex-zen",
            content: ["Make your Instagram browsing experience cleaner with the new Zen mode.", "Switch Instagram home feed into Zen hides post captions and comments on the posts. Give it a try!", "This release also fixes a number of bugs, making posting Stories more stable in particular."]
        }, {
            id: "v10.0.1",
            header: "Share Post to Story",
            subheader: "v10.0.1",
            hexImage: "hex-story",
            content: ["Version 10 brings support for sharing any post to your story in a few clicks.", "Locate a share icon below any post, video or photo, click it and select “Share to Story”. A photo will then be shared to your story.", "This feature is free. Enjoy!"]
        }, {
            id: "v10.0.0",
            header: "Bug Fixing",
            subheader: "v10.0.0",
            hexImage: "hex-bug",
            content: ["Fixed comments scrolling caused the app to refresh the page.", "Post Assistant now supports uploading and previewing posts in a grid without a Facebook API connection.", "Changed the dark theme background not to be so dark. Redesigned side bar and Facebook API connection setup dialogs.", "And a host of other improvements and stability enhancements under the hood."]
        }, {
            id: "v9.0.0",
            header: "Bulk Scheduling",
            subheader: "v9.0.0",
            hexImage: "hex-ship",
            content: ["Inssist Scheduling now supports uploading multiple photos at once to speed up posting.", "You can also drag & drop photos and videos from the system to Inssist to schedule or publish them.", "Scheduling engine has been significantly improved to support bulk upload and future improvements coming down the line."]
        }, {
            id: "v8.9.1",
            header: "Bug Fixing & Usability",
            subheader: "v8.9.1",
            hexImage: "hex-bug",
            content: ["Stories uploaded with Inssist are now uploaded in the best quality possible.", "Fixed internal bugs and improved DM module stability."]
        }, {
            id: "v8.8.5",
            header: "Bug Fixing & Usability",
            subheader: "v8.8.5",
            hexImage: "hex-bug",
            content: ["Inssist now prevents Instagram from blurring photos when switching between screen modes.", "Inssist now shows @usernames upon hovering over accounts in multiaccount box.", "Increased DM text input size, fixed elements positioning on Instagram authorization screen, fixed wordings across the application and other improvements.", "Added support for sending debug reports if Inssist fails to connect Scheduling."]
        }, {
            id: "v8.6.0",
            header: "Scheduling patch",
            subheader: "v8.6.0",
            hexImage: "hex-bug",
            content: ["Fixed a bug preventing scheduling connection setup to reliably connect Instagram account to Scheduling API.", "Fixed a cross-posting bug preventing Facebook Page selection from rendering.", "Fixed sending post from the home feed to Direct Messages. Other internal fixes."]
        }, {
            id: "v8.5.1",
            header: "Story and Scheduling fixes",
            subheader: "v8.5.1",
            hexImage: "hex-bug",
            content: ["Improved aspect ratio detection on stories: video stories should upload to Instagram more reliably.", "Uploaded stories now have the first frame selected as a cover rather than a random one.", "Fixed Infinite Loading loop bug on scheduling."]
        }, {
            id: "v8.5.0",
            header: "Story Improvements",
            subheader: "v8.5.0",
            hexImage: "hex-bug",
            content: ["Photo Stories are no longer cut in preview when they do not fit the aspect ratios. Inssist now detects and warns about unsupported Video Story lengths: shorter than 1 second and longer than 15 seconds. Other internal improvements."]
        }, {
            id: "v8.4.0",
            header: "Story Mentions",
            subheader: "v8.4.0",
            hexImage: "hex-mentions",
            content: ["Support for @mentions (account tagging) has arrived for photo stories. This is a free feature available on all plans."]
        }, {
            id: "v8.3.0",
            header: "Bug Fixing",
            subheader: "v8.3.0",
            hexImage: "hex-bug",
            content: ["Added mouse scroll to stories panel. Added photo upload spinner during posting.", "Fixed modal windows positioning bug in Instagram. Fixed tab buttons spacing on Instagram profile page."]
        }, {
            id: "v8.2.1",
            header: "Bug Fixing",
            subheader: "v8.2.1",
            hexImage: "hex-bug",
            content: ["Fixed excess image rotation on new and scheduled posts.", "Fixed a black screen scheduling state bug caused by selecting a Custom Time interval."]
        }, {
            id: "v8.2.0",
            header: "Facebook Cross-Posting",
            subheader: "v8.2.0",
            hexImage: "hex-schedule",
            content: ["If your Instagram @account is connected to a custom Facebook Page, Inssist will let you clone posts to that Facebook Page during scheduling."]
        }, {
            id: "v8.1.0",
            header: "Scheduling Performance",
            subheader: "v8.1.0",
            hexImage: "hex-schedule",
            content: ["Over the past few weeks we have redesigned and rebuilt Scheduling engine from ground-up, making it far more stable and performing much better than before. Give it a try!", "A few User Interface fixes are delivered with this update."]
        }, {
            id: "v8.0.0",
            header: "Multiaccount Support",
            subheader: "v8.0.0",
            hexImage: "hex-multiaccount",
            content: ["Got more than one Instagram account? Connect them all to Inssist and seamlessly switch between them without a need to relogin. Handy!"]
        }, {
            id: "v6.2.0",
            header: "Wide Screen",
            subheader: "v6.2.0",
            hexImage: "hex-monitor",
            content: ["Wide screen mode has been redesigned with images taking more space and page layouts improved."]
        }, {
            id: "v6.1.0",
            header: "Bug Fixing",
            subheader: "v6.1.0",
            hexImage: "hex-bug",
            content: ["Stories can now be scrolled with LEFT / RIGHT keys and exited with ESC key. Fixed polls styling on stories in dark theme.", "Fixed videos playing sound for a split second upon navigation within plugin. Fixed an Instagram bug with videos refusing to playing on click.", "Fixed Scheduling incorrectly ordering posts upon updating post caption. Improved Scheduling interface buttons styling.", "Plugin URL now contains Instagram page URL for quick navigation.", "Direct Messages no longer marked as read while DM module is hidden. Fixed DM module buttons overlap. Clicking Back button no longer causes navigation in Direct Messaging module. Videos sent in Direct Messages can now be viewed in a separate tab."]
        }, {
            id: "v6.0.1",
            header: "Carousels",
            subheader: "v6.0.1",
            hexImage: "hex-carousel",
            content: ["Inssist now supports carousel posts through the Post Assistant. Check it out!", "Multiaccount support is coming next!"]
        }, {
            id: "v6.0.0",
            header: "Scheduling",
            subheader: "v6.0.0",
            hexImage: "hex-schedule",
            content: ["Scheduling now supports drag&drop operations both on Grid and Calendar. Scheduling is out of Beta and has been substantially improved, debugged and redesigned."]
        }, {
            id: "v5.0.1",
            header: "Bug Fixing",
            subheader: "v5.0.1",
            hexImage: "hex-bug",
            content: ["Fixed Instagram bug when adding multiline text on stories caused Instagram UI to break. Captions containing emojis are no longer cut off."]
        }, {
            id: "v4.0.5",
            header: "Bug Fixing",
            subheader: "v4.0.5",
            hexImage: "hex-bug",
            content: ["A ton of bug fixes and improvements:", "You can now send DMs to any account without following them first. Images in DM module are no longer cropped and take all available space.", "Added a button to open image in a new tab in DM module. Requests tab in DM no longer overflows the new DM button and DM actions tooltips is no longer cut off. Fixed fonts in DM module.\n", "Added “Open in Inssist” button on Instagram website. Added DM US button to reach out to us quickly. Icons in side bar no longer overlap on small screens.", "Fixed “show more” button on post captions and other small fixes across UI."]
        }, {
            id: "v4.0.0",
            header: "Direct Messages",
            subheader: "v4.0.0",
            hexImage: "hex-dm",
            content: ["Psst… Check out the brand new Direct Messages panel on the left. You can now send DMs while having the Instagram view on the right simultaneously. Handy! 💌", "The next feature we’re working on is Scheduling drag & drop support."]
        }, {
            id: "v3.1.0",
            header: "Bug fixing",
            subheader: "v3.1.0",
            hexImage: "hex-bug",
            content: ["Bug fixes and improvements: fixed emojis 🤧 in the dark theme, better scheduling setup logic and setup errors interception, permissions verification screen, scheduling migrated onto optimistic transactions mechanism, image pre-caching and scheduling loading speed-up, fixed IGTV screen and UI cleanup."]
        }, {
            id: "v3.0.0",
            header: "Dark Mode",
            subheader: "v3.0.0",
            hexImage: "hex-moon",
            content: ["Join the Dark Side! Switch Inssist to Dark mode which is less strenuous on your beautiful 👀 with a click of a button. Instagram web interface has been thoroughly restyled to Dark mode as well."]
        }, {
            id: "v2.3.0",
            header: "Calendar and Time Slots",
            subheader: "v2.3.0",
            hexImage: "hex-schedule",
            content: ["Configure Time Slots to schedule posts efficiently. Browse posts in a weekly and monthly post calendars. Fixed scheduling setup, auto-logout and freezing bugs."]
        }, {
            id: "v2.2.0",
            header: "Scheduling Usability",
            subheader: "v2.2.0",
            hexImage: "hex-schedule",
            content: ["Added scheduling time & date selection calendar. Improved Posts Grid performance. Fixed scheduling connection setup problems."]
        }, {
            id: "v2.1.0",
            header: "Scheduling Beta",
            subheader: "v2.1.0",
            hexImage: "hex-schedule",
            content: ["Scheduling has arrived.", "Upload photos, videos, IGTVs and carousel posts. Preview them in a grid, save as draft, publish or schedule for auto-publish.", "Scheduled media are published automatically, no need to install extra software, Inssist handles auto-publish for you even if you are offline.", "Scheduling is currently available through our Beta program. You can enable Beta features for free by sharing a word about Inssist.", "All bug reports and feature requests are welcomed at inssist@slashed.io  🐜🐜🐜"]
        }, {
            id: "v1.6.0",
            header: "IGTV Support",
            subheader: "v1.6.0",
            hexImage: "hex-igtv",
            content: ["Plugin now supports uploading IGTV videos.", "To publish IGTV, simply upload a video as you would normally do. If the video is longer than 1 minute, Inssist will present an IGTV video upload interface to you."]
        }, {
            id: "v1.3.0",
            header: "Relevant Hashtags",
            subheader: "v1.3.0",
            hexImage: "hex-tag",
            content: ["Inssist now suggests relevant hashtags. Try it out!"]
        }, {
            id: "v1.2.2",
            header: "Bug fixing",
            subheader: "v1.2.2",
            hexImage: "hex-bug",
            content: ["Fixed “Instagram.com refused to connect” issue. If you still experience “Instagram.com refused to connect” error, please try to relogin to Instagram.com from a separate browser tab and reinstall Inssist from get.inssist.com.", "Fixed video playback jittering."]
        }, {
            id: "v1.2.0",
            header: "Autoplay for Videos",
            subheader: "v1.2.0",
            hexImage: "hex-update",
            content: ["Videos on the feed will now autoplay (muted) when scrolled into the view. Clicking videos un-mutes them.", "Improved posting screen usability, stability and bundle size."]
        }, {
            id: "v1.1.0",
            header: "Usability Improvements",
            subheader: "v1.1.0",
            hexImage: "hex-update",
            content: ["Text inside the Instagram view can now be selected and copied to clipboard.", "Posting photos and videos now supports locations tagging.", "Fixed issue with instagram.com not connecting after navigation to direct messages.", "Fixed issue with opening facebook.com links from DM messages caused a browser page error.", "Pressing Enter in DM screen now sends the message right away.", "Other miscellaneous usability improvements."]
        }, {
            id: "v0.9.12",
            header: "Bug fixing & Performance",
            subheader: "v0.9.12",
            hexImage: "hex-bug",
            content: ["Extension rebranded to Inssist.", "Loading and rendering speed improved. Fixed an issue when replying to comments rendered an unnecessary actions popup."]
        }, {
            id: "v0.9.5",
            header: "Improved Image Quality",
            subheader: "v0.9.5",
            hexImage: "hex-quality",
            content: ["Landscape and Portrait photos now retain high image quality when uploaded with the plugin."]
        }, {
            id: "v0.9.2",
            header: "Video Support",
            subheader: "v0.9.2",
            hexImage: "hex-video",
            content: ["Plugin now supports Video uploads."]
        }, {
            id: "v0.8.9",
            header: "Stickers and Markers Support",
            subheader: "v0.8.9",
            hexImage: "hex-marker",
            content: ["Stories can now be uploaded with stickers and markers."]
        }, {
            id: "v0.8.3",
            header: "Improved UI",
            subheader: "v0.8.3",
            hexImage: "hex-bug",
            content: ["User profile, stories reel and other parts of user interface and user experience were improved. Fixed stories viewer not showing stories on a first click."]
        }, {
            id: "v0.8.0",
            header: "Basic version",
            subheader: "v0.8.0",
            hexImage: "hex-igswiss",
            content: ["Plugin now supports photos and stories upload and direct messages."]
        }],
        yy = () => ({
            version: 234,
            authStatus: {
                userId: null,
                username: null,
                fullName: null,
                email: null,
                avatarUrl: null,
                isLoggedIn: !1,
                cookies: {
                    igSessionId: null,
                    ig: [],
                    fb: []
                }
            },
            coverAssist: {
                shown: !1,
                loading: !0,
                videoUrl: null,
                coverUrl: null,
                selectedTabId: "auto",
                showGrid: !1,
                gridImages: [],
                frameGalleryImages: [],
                frameGallerySelectedImage: null,
                frameSelectImage: null,
                frameSelectValue: null,
                frameUploadImage: null
            },
            musicAssist: {
                shown: !1,
                videoUrl: null,
                videoVolume: 0,
                musicVolume: .5,
                videoCurrentTime: 0,
                categoryIdsOrder: [],
                selectedCategoryId: 0,
                selectedTrackId: null,
                selectedTrackStart: 0,
                customTrack: null,
                showUpsellOverlay: !1,
                isStory: !1
            },
            storyAssist: {
                shown: !1,
                isVideo: !1,
                selectedTabId: "later",
                showUpsellOverlay: !1,
                coverUrl: null,
                mentions: {
                    query: "",
                    foundUsers: [],
                    selectedUsers: []
                }
            },
            ghostStoryView: {
                enabled: !1,
                lastUsedOn: null,
                showUpsellOverlay: !1
            },
            dm: {
                badgeText: "",
                ghostModeEnabled: !0,
                ghostModeFailed: !1
            },
            reels: {
                creating: !1
            },
            igTask: {
                actionBlockCode: null,
                followStatus: {},
                likeStatus: {}
            },
            later: {
                cookies: null,
                showBodyPanel: !1,
                showAssistPanel: !1,
                selectedUserId: null,
                selectedPostId: null,
                selectedPillId: null,
                selectedIgDate: null,
                errors: [],
                lastDate: null,
                processing: !1,
                timeSlots: [{
                    time: 288e5
                }, {
                    time: 468e5
                }, {
                    time: 576e5
                }, {
                    time: 72e6
                }],
                posts: []
            },
            schedule: {
                posts: [],
                timeSlots: [{
                    time: 288e5
                }, {
                    time: 468e5
                }, {
                    time: 576e5
                }, {
                    time: 72e6
                }],
                addCard: {
                    saved: !1,
                    fileCount: 0,
                    attention: !1,
                    draggingFiles: !1,
                    selectedOption: "multiple",
                    savingTitle: null,
                    savingText: null,
                    savingPreview: null
                },
                loading: !1,
                recentScheduledOn: null,
                lastFcsPostsUpdateOn: null,
                lastIgPostsUpdateOn: null,
                fcsError: null,
                fcsFailed: !1,
                isErrorShown: !1,
                isUpsellShown: !1,
                isDraggingPost: !1,
                showTagAssist: !1,
                addingFiles: !1,
                fileUploadErrors: [],
                fallback: {
                    isEnabled: !1,
                    isFailedToReconnect: !1,
                    isRetryingFbConnection: !1,
                    hideSwitchToFallbackButton: !1
                },
                navigation: {
                    isOpen: !1,
                    selectedTabId: null,
                    isFcsLoading: !1,
                    withBackToCalendarButton: !1
                },
                filters: {
                    showInfo: !0,
                    showLocalLabel: !0,
                    photo: !0,
                    video: !0,
                    carousel: !0,
                    posted: !0,
                    local: !0,
                    draft: !0,
                    scheduled: !0
                },
                fcsSetup: {
                    screen: "welcome",
                    checking: !1,
                    connected: !1,
                    connecting: !1,
                    showPanel: !1,
                    errorCode: null,
                    steps: {
                        fbLogin: null,
                        igProfessional: null,
                        igConnectedToFbPage: null
                    },
                    failed: !1
                },
                dateDialog: {
                    isOpen: !1,
                    selectedOption: "publish-now",
                    periodStart: null,
                    selectedDay: null,
                    selectedSlotTime: null,
                    customTime: null,
                    timezone: null,
                    isTimeError: !1
                },
                calendar: {
                    periodType: "month",
                    periodStart: null,
                    showTimeSlots: !0
                }
            },
            bulk: {
                saving: !1,
                selectedPostIds: [],
                activeActionId: null,
                actions: {},
                dateDialog: {
                    show: !1,
                    selectedTypeId: "interval",
                    startingDay: {
                        selectedTypeId: "today",
                        periodStart: null,
                        selectedDay: null
                    },
                    calendar: {
                        periodStart: null,
                        selectedDay: null,
                        selectedSlotTime: null,
                        customTime: null,
                        errorMessage: null
                    },
                    interval: {
                        frequency: "1:1",
                        timeList: []
                    },
                    week: {
                        selectedDays: [],
                        selectedSlotTime: null,
                        customTime: null,
                        dayErrorMessage: null,
                        timeErrorMessage: null
                    },
                    timeSlots: {
                        errorMessage: null
                    }
                }
            }
        }),
        wy = () => "Hello {@name}! 👋\n\n\n  {Thank you|Thanks} {@name}! 🙏\n\n\n  /tnx follow\n  {Hi|Hey|Hello|Greetings} {@name}! Thank you so much for following! Feel free to send me a DM!\n\n\n  /tnx contact\n  {Thank you for contacting us.|Thank you for reaching out to us.|Thank you for contacting us here.} {We have received your message and will be in touch shortly.|We will be in touch shortly, and you may also find answers to some of your questions on our FAQ page.|We will be in touch soon.}\n\n\n  /sorry missed\n  Hi {@username}! I am sorry I missed your message. I will get back to you as soon as possible. I look forward to speaking with you!\n\n\n  /ask feedback\n  {Hi|Hello|Hey|Greetings}! Just wanted to follow back with you and check how you find the product? Feel free to send me your feedback, suggestions or ideas.\n\n\n  /tmm\n  Thank you for contacting us. Due to an unusual level of activity, responses are delayed. We anticipate responding to your message within two business days. In the meantime, please feel free to reach out to us via email with any urgent needs or requests.\n  ".split("\n").map((e => e.trim())).join("\n"),
        _y = () => ({
            installedAt: Date.now(),
            installedEventSent: !1,
            isAfterTheEndUser: !0,
            userStates: {},
            experiments: {
                enabled: !1
            },
            abTesting: {
                hash: Math.random(),
                wideScreenState: null
            },
            multiaccount: {
                userIds: [],
                selectedUserId: null,
                addingNewAccount: !1
            },
            welcome: {
                shown: !0
            },
            sidebar: {
                selectedTabId: null,
                isOpen: !1
            },
            igView: {
                fullscreen: !1,
                fullscreenWidth: 460,
                withBorder: !0,
                creationCardShown: !1
            },
            zen: {
                enabled: !1
            },
            quickReplies: {
                shown: !1,
                content: wy(),
                total: 7
            },
            settings: {
                laterAutoRetry: 12 * L.time.HOUR
            },
            tagAssist: {
                shown: !1,
                query: "",
                tagMetricsUpsellDismissed: !1,
                searching: !1,
                latinOnly: !1,
                errorCode: null,
                selectedTabId: "search",
                selectedGroupId: "low",
                igSelectedTags: [],
                fcsSelectedTags: [],
                sidebarSelectedTags: [],
                sidebarSelectedTagsAsText: "",
                lastDayUsedOn: null,
                ladderEngagementSort: null,
                summaryEngagementSort: null,
                ladderPostCountSort: null,
                summaryPostCountSort: null,
                lastTagScanOn: null,
                accountStats: {},
                ladder: null,
                ladderLoadingTags: [],
                ladderConfig: {
                    lastUpdateOn: Date.now(),
                    tiers: {
                        low: .7,
                        medium: 1.5,
                        high: 5
                    }
                },
                collections: [],
                newCollection: {
                    name: "",
                    text: "",
                    showForm: !1
                },
                collectionsTagData: {},
                collectionsLoadingTags: []
            },
            acknowledged: {
                upsell: -1,
                postLimitations: -1,
                storyLimitations: -1,
                tosSummary: -1,
                scheduleTip: -1,
                scheduleDndTip: -1,
                followUs: -1,
                rateUs: -1,
                theEnd: -1
            },
            followUs: {
                shown: !1
            },
            rateUs: {
                shown: !1,
                rate: null
            },
            whatsNew: [{
                id: "v25.1.0",
                header: "Carousels Post Later",
                subheader: "v25.1.0",
                hexImage: "hex-schedule",
                content: ["Upload or drag & drop multiple files to Post Later to schedule them for posting as a carousel."]
            }, {
                id: "v25.0.0",
                header: "Advanced Post Later",
                subheader: "v25.0.0",
                hexImage: "hex-schedule",
                content: ["Improved Post Later interface and auto-publishing stability. Manage multiple accounts in Post Later interface seamlessly. Bulk upload files for scheduling."]
            }, {
                id: "v24.0.0",
                header: "Post Later",
                subheader: "v24.0.0",
                hexImage: "hex-schedule",
                content: ["INSSIST now supports Delayed Posting for Posts, Photo and Video Stories and Reels. Facebook account is not required to schedule posts with delayed posting."]
            }, {
                id: "v23.6.0",
                header: "Fixes and Future Plans",
                subheader: "v23.6.0",
                hexImage: "hex-schedule"
            }, {
                id: "v23.3.0",
                header: "Major Functionality Fixes",
                subheader: "v23.3.0",
                hexImage: "hex-bug",
                content: ["Restored all app functions broken due to recent changes introduced by Instagram update to internal data and media handling systems."]
            }, {
                id: "v23.1.0",
                header: "Instagram Update Bug Fixes",
                subheader: "v23.1.0",
                hexImage: "hex-bug",
                content: ["Fixed a number of bugs introduced by Instagram in the recent mobile and desktop app update: reels failed to be published through instagram.com, posted videos were duplicated under reels tab and showing with a wrong icon, restored search panel functionality of the explore page, and other improvements and fixes."]
            }, {
                id: "v23.0.0",
                header: "Ghost View Mode for Stories",
                subheader: "v23.0.0",
                hexImage: "hex-ghost",
                content: ["Switch to a Ghost View Mode and watch stories anonymously. Story owner won’t know if you watched their story."]
            }, {
                id: "v22.0.0",
                header: "Story Assist",
                subheader: "v22.0.0",
                hexImage: "hex-story",
                content: ["Added user tagging feature in stories, fixed avatars rendering Instagram bug, fixed reels API connectivity and other issues."]
            }, {
                id: "v21.1.0",
                header: "Improvements and Bug Fixes",
                subheader: "v21.1.0",
                hexImage: "hex-update",
                content: ["Fixed custom video covers and music file uploads to fail in certain scenarios. Styling and usability improvements in the app. Fixed tooltips rendering in the IG frame. Fixed app rendering artifacts on slow Internet connection and more."]
            }, {
                id: "v21.0.0",
                header: "Posting Functionality Restored",
                subheader: "v21.0.0",
                hexImage: "hex-bug",
                content: ["Restored posting functionality and fixed problems caused by the IG platform overhaul.", "Improved app stability, dark theme, custom cover feature, videos autoplay on carousels and fixed multiple bugs."]
            }, {
                id: "v20.2.0",
                header: "Reels Improvements",
                subheader: "v20.2.0",
                hexImage: "hex-bug",
                content: ["Added support for locations and people mentions (tagging) on Reels posting.", "Fixed original audio automatically muted by Chrome v100. Fixed followers and followings not showing up correctly in the wide mode. Fixed DM not showing DM folders."]
            }, {
                id: "v20.1.0",
                header: "Bug Fixing",
                subheader: "v20.1.0",
                hexImage: "hex-bug",
                content: ["Fixed scheduling connection setup, fixed isolation policy error, improved reels posting, post management error handling and usability."]
            }, {
                id: "v20.0.0",
                header: "Music",
                subheader: "v20.0.0",
                hexImage: "hex-music",
                content: ["Add music or upload your tracks to Reels, Stories and Videos. Royalty-free music is provided by tunetank.com."]
            }, {
                id: "v19.0.0",
                header: "Quick Replies in DM",
                subheader: "v19.0.0",
                hexImage: "hex-dm",
                content: ["Send Quick Replies in chats by typing / symbol followed by reply shortcut. Configure an unlimited number of replies for business or personal use.", "Inssist Quick Replies support template messages and @name, @username variables."]
            }, {
                id: "v18.0.9",
                header: "Bug Fixing",
                subheader: "v18.0.9",
                hexImage: "hex-bug",
                content: ["Fixed Instagram bug that caused a blank screen to load for some users. Fixed Zen mode, story mentions and other issues."]
            }, {
                id: "posting-from-website",
                header: "Posting from website",
                subheader: "v18.0.0",
                hexImage: "hex-igswiss"
            }, {
                id: "v17.3.0",
                header: "60s Reels",
                subheader: "v17.3.0",
                hexImage: "hex-reels",
                content: ["Inssist can now post Reels of up to 60s long, up from 30s before.", "CSV import now supports “multiline \\n captions” and break lines with \\n symbols.", "This release improves posting stability."]
            }, {
                id: "v17.0.0",
                header: "Bulk & CSV Scheduling",
                subheader: "v17.0.0",
                hexImage: "hex-schedule",
                content: ["Added “BULK” section to the Scheduling module that supports applying bulk commands: scheduling, drafting, deleting posts.", "You can now reschedule posts across time-slots or intervals with a few clicks and edit captions of all scheduled posts from a single screen.", "Inssist now knows how to parse CSV files so that you can drag and drop those and schedule posts even faster.", "Scheduling interface has been significantly speed up comparing to the previous versions."]
            }, {
                id: "macos",
                header: "Experimental MacOS version",
                subheader: "v15.2.3",
                hexImage: "hex-macos"
            }, {
                id: "v15.1.0",
                header: "Usability & Bug Fixes",
                subheader: "v15.1.0",
                hexImage: "hex-bug",
                content: ["Post Assistant now supports custom aspect ratios for images in addition to default square, portrait and landscape ones.", "Fix for the Instagram “video failed to post” and other bugs."]
            }, {
                id: "v15.0.3",
                header: "Bug Fixing",
                subheader: "v15.0.3",
                hexImage: "hex-bug",
                content: ["Fixed missing delete button in Post Assistant. Fixed dark theme Reels UI. Fixed “Post did not upload” video publishing issue."]
            }, {
                id: "reels",
                header: "Reels",
                subheader: "v15.0.0",
                hexImage: "hex-reels",
                content: ["Inssist can now post Reels! It ensures the best quality and does not compress your videos.", "Instagram Reels is a short-video format, similar to TikTok. Instagram platform limits Reels to 50 countries, including the United States.", "Posting Reels is a PRO feature, and you can repost Reels from other accounts and apply custom covers with Inssist."]
            }, {
                id: "v13.1.0",
                header: "Hashtag Collections",
                subheader: "v13.1.0",
                hexImage: "hex-tag",
                content: ["Now you can create and manage your Hashtag collections with Inssist."]
            }, {
                id: "v11.5.0",
                header: "Lifetime Deal",
                subheader: "v11.5.0",
                hexImage: "hex-lifetime",
                content: ["Claim your Inssist PRO Lifetime Deal!", "Now you can get Inssist PRO license for life with a one time purchase, before only a monthly subscription option was available.", "For businesses managing many accounts there is a special Infinite plan. Check it out!"]
            }, {
                id: "v11.2.0",
                header: "Swipe Up",
                subheader: "v11.2.0",
                hexImage: "hex-swipe-up",
                content: ["Swipe Up feature (adding links to stories) is now available for accounts of more than 10k followers."]
            }, {
                id: "v11.1.0",
                header: "Editing Captions",
                subheader: "v11.1.0",
                hexImage: "hex-caption",
                content: ["This version brings support for editing posts. You can now edit posts and update post captions after they are published without a need to connect to Facebook API."]
            }, {
                id: "v11.0.0",
                header: "Video Thumbnails / Covers",
                subheader: "v11.0.0",
                hexImage: "hex-video",
                content: ["Version 11 brings support for covers to video posting.", "Whenever you upload a video to post you can choose a thumbnail from a list of auto-generated covers, a specific video frame or even upload a custom image to be used.", "You can also preview your Instagram grid with the selected cover before posting."]
            }, {
                id: "v10.1.0",
                header: "Zen Mode",
                subheader: "v10.1.0",
                hexImage: "hex-zen",
                content: ["Make your Instagram browsing experience cleaner with the new Zen mode.", "Switch Instagram home feed into Zen hides post captions and comments on the posts. Give it a try!", "This release also fixes a number of bugs, making posting Stories more stable in particular."]
            }, {
                id: "v10.0.1",
                header: "Share Post to Story",
                subheader: "v10.0.1",
                hexImage: "hex-story",
                content: ["Version 10 brings support for sharing any post to your story in a few clicks.", "Locate a share icon below any post, video or photo, click it and select “Share to Story”. A photo will then be shared to your story.", "This feature is free. Enjoy!"]
            }, {
                id: "v10.0.0",
                header: "Bug Fixing",
                subheader: "v10.0.0",
                hexImage: "hex-bug",
                content: ["Fixed comments scrolling caused the app to refresh the page.", "Post Assistant now supports uploading and previewing posts in a grid without a Facebook API connection.", "Changed the dark theme background not to be so dark. Redesigned side bar and Facebook API connection setup dialogs.", "And a host of other improvements and stability enhancements under the hood."]
            }, {
                id: "v9.0.0",
                header: "Bulk Scheduling",
                subheader: "v9.0.0",
                hexImage: "hex-ship",
                content: ["Inssist Scheduling now supports uploading multiple photos at once to speed up posting.", "You can also drag & drop photos and videos from the system to Inssist to schedule or publish them.", "Scheduling engine has been significantly improved to support bulk upload and future improvements coming down the line."]
            }, {
                id: "v8.9.1",
                header: "Bug Fixing & Usability",
                subheader: "v8.9.1",
                hexImage: "hex-bug",
                content: ["Stories uploaded with Inssist are now uploaded in the best quality possible.", "Fixed internal bugs and improved DM module stability."]
            }, {
                id: "v8.8.5",
                header: "Bug Fixing & Usability",
                subheader: "v8.8.5",
                hexImage: "hex-bug",
                content: ["Inssist now prevents Instagram from blurring photos when switching between screen modes.", "Inssist now shows @usernames upon hovering over accounts in multiaccount box.", "Increased DM text input size, fixed elements positioning on Instagram authorization screen, fixed wordings across the application and other improvements.", "Added support for sending debug reports if Inssist fails to connect Scheduling."]
            }, {
                id: "v8.6.0",
                header: "Scheduling patch",
                subheader: "v8.6.0",
                hexImage: "hex-bug",
                content: ["Fixed a bug preventing scheduling connection setup to reliably connect Instagram account to Scheduling API.", "Fixed a cross-posting bug preventing Facebook Page selection from rendering.", "Fixed sending post from the home feed to Direct Messages. Other internal fixes."]
            }, {
                id: "v8.5.1",
                header: "Story and Scheduling fixes",
                subheader: "v8.5.1",
                hexImage: "hex-bug",
                content: ["Improved aspect ratio detection on stories: video stories should upload to Instagram more reliably.", "Uploaded stories now have the first frame selected as a cover rather than a random one.", "Fixed Infinite Loading loop bug on scheduling."]
            }, {
                id: "v8.5.0",
                header: "Story Improvements",
                subheader: "v8.5.0",
                hexImage: "hex-bug",
                content: ["Photo Stories are no longer cut in preview when they do not fit the aspect ratios. Inssist now detects and warns about unsupported Video Story lengths: shorter than 1 second and longer than 15 seconds. Other internal improvements."]
            }, {
                id: "v8.4.0",
                header: "Story Mentions",
                subheader: "v8.4.0",
                hexImage: "hex-mentions",
                content: ["Support for @mentions (account tagging) has arrived for photo stories. This is a free feature available on all plans."]
            }, {
                id: "v8.3.0",
                header: "Bug Fixing",
                subheader: "v8.3.0",
                hexImage: "hex-bug",
                content: ["Added mouse scroll to stories panel. Added photo upload spinner during posting.", "Fixed modal windows positioning bug in Instagram. Fixed tab buttons spacing on Instagram profile page."]
            }, {
                id: "v8.2.1",
                header: "Bug Fixing",
                subheader: "v8.2.1",
                hexImage: "hex-bug",
                content: ["Fixed excess image rotation on new and scheduled posts.", "Fixed a black screen scheduling state bug caused by selecting a Custom Time interval."]
            }, {
                id: "v8.2.0",
                header: "Facebook Cross-Posting",
                subheader: "v8.2.0",
                hexImage: "hex-schedule",
                content: ["If your Instagram @account is connected to a custom Facebook Page, Inssist will let you clone posts to that Facebook Page during scheduling."]
            }, {
                id: "v8.1.0",
                header: "Scheduling Performance",
                subheader: "v8.1.0",
                hexImage: "hex-schedule",
                content: ["Over the past few weeks we have redesigned and rebuilt Scheduling engine from ground-up, making it far more stable and performing much better than before. Give it a try!", "A few User Interface fixes are delivered with this update."]
            }, {
                id: "v8.0.0",
                header: "Multiaccount Support",
                subheader: "v8.0.0",
                hexImage: "hex-multiaccount",
                content: ["Got more than one Instagram account? Connect them all to Inssist and seamlessly switch between them without a need to relogin. Handy!"]
            }, {
                id: "v6.2.0",
                header: "Wide Screen",
                subheader: "v6.2.0",
                hexImage: "hex-monitor",
                content: ["Wide screen mode has been redesigned with images taking more space and page layouts improved."]
            }, {
                id: "v6.1.0",
                header: "Bug Fixing",
                subheader: "v6.1.0",
                hexImage: "hex-bug",
                content: ["Stories can now be scrolled with LEFT / RIGHT keys and exited with ESC key. Fixed polls styling on stories in dark theme.", "Fixed videos playing sound for a split second upon navigation within plugin. Fixed an Instagram bug with videos refusing to playing on click.", "Fixed Scheduling incorrectly ordering posts upon updating post caption. Improved Scheduling interface buttons styling.", "Plugin URL now contains Instagram page URL for quick navigation.", "Direct Messages no longer marked as read while DM module is hidden. Fixed DM module buttons overlap. Clicking Back button no longer causes navigation in Direct Messaging module. Videos sent in Direct Messages can now be viewed in a separate tab."]
            }, {
                id: "v6.0.1",
                header: "Carousels",
                subheader: "v6.0.1",
                hexImage: "hex-carousel",
                content: ["Inssist now supports carousel posts through the Post Assistant. Check it out!", "Multiaccount support is coming next!"]
            }, {
                id: "v6.0.0",
                header: "Scheduling",
                subheader: "v6.0.0",
                hexImage: "hex-schedule",
                content: ["Scheduling now supports drag&drop operations both on Grid and Calendar. Scheduling is out of Beta and has been substantially improved, debugged and redesigned."]
            }, {
                id: "v5.0.1",
                header: "Bug Fixing",
                subheader: "v5.0.1",
                hexImage: "hex-bug",
                content: ["Fixed Instagram bug when adding multiline text on stories caused Instagram UI to break. Captions containing emojis are no longer cut off."]
            }, {
                id: "v4.0.5",
                header: "Bug Fixing",
                subheader: "v4.0.5",
                hexImage: "hex-bug",
                content: ["A ton of bug fixes and improvements:", "You can now send DMs to any account without following them first. Images in DM module are no longer cropped and take all available space.", "Added a button to open image in a new tab in DM module. Requests tab in DM no longer overflows the new DM button and DM actions tooltips is no longer cut off. Fixed fonts in DM module.\n", "Added “Open in Inssist” button on Instagram website. Added DM US button to reach out to us quickly. Icons in side bar no longer overlap on small screens.", "Fixed “show more” button on post captions and other small fixes across UI."]
            }, {
                id: "v4.0.0",
                header: "Direct Messages",
                subheader: "v4.0.0",
                hexImage: "hex-dm",
                content: ["Psst… Check out the brand new Direct Messages panel on the left. You can now send DMs while having the Instagram view on the right simultaneously. Handy! 💌", "The next feature we’re working on is Scheduling drag & drop support."]
            }, {
                id: "v3.1.0",
                header: "Bug fixing",
                subheader: "v3.1.0",
                hexImage: "hex-bug",
                content: ["Bug fixes and improvements: fixed emojis 🤧 in the dark theme, better scheduling setup logic and setup errors interception, permissions verification screen, scheduling migrated onto optimistic transactions mechanism, image pre-caching and scheduling loading speed-up, fixed IGTV screen and UI cleanup."]
            }, {
                id: "v3.0.0",
                header: "Dark Mode",
                subheader: "v3.0.0",
                hexImage: "hex-moon",
                content: ["Join the Dark Side! Switch Inssist to Dark mode which is less strenuous on your beautiful 👀 with a click of a button. Instagram web interface has been thoroughly restyled to Dark mode as well."]
            }, {
                id: "v2.3.0",
                header: "Calendar and Time Slots",
                subheader: "v2.3.0",
                hexImage: "hex-schedule",
                content: ["Configure Time Slots to schedule posts efficiently. Browse posts in a weekly and monthly post calendars. Fixed scheduling setup, auto-logout and freezing bugs."]
            }, {
                id: "v2.2.0",
                header: "Scheduling Usability",
                subheader: "v2.2.0",
                hexImage: "hex-schedule",
                content: ["Added scheduling time & date selection calendar. Improved Posts Grid performance. Fixed scheduling connection setup problems."]
            }, {
                id: "v2.1.0",
                header: "Scheduling Beta",
                subheader: "v2.1.0",
                hexImage: "hex-schedule",
                content: ["Scheduling has arrived.", "Upload photos, videos, IGTVs and carousel posts. Preview them in a grid, save as draft, publish or schedule for auto-publish.", "Scheduled media are published automatically, no need to install extra software, Inssist handles auto-publish for you even if you are offline.", "Scheduling is currently available through our Beta program. You can enable Beta features for free by sharing a word about Inssist.", "All bug reports and feature requests are welcomed at inssist@slashed.io  🐜🐜🐜"]
            }, {
                id: "v1.6.0",
                header: "IGTV Support",
                subheader: "v1.6.0",
                hexImage: "hex-igtv",
                content: ["Plugin now supports uploading IGTV videos.", "To publish IGTV, simply upload a video as you would normally do. If the video is longer than 1 minute, Inssist will present an IGTV video upload interface to you."]
            }, {
                id: "v1.3.0",
                header: "Relevant Hashtags",
                subheader: "v1.3.0",
                hexImage: "hex-tag",
                content: ["Inssist now suggests relevant hashtags. Try it out!"]
            }, {
                id: "v1.2.2",
                header: "Bug fixing",
                subheader: "v1.2.2",
                hexImage: "hex-bug",
                content: ["Fixed “Instagram.com refused to connect” issue. If you still experience “Instagram.com refused to connect” error, please try to relogin to Instagram.com from a separate browser tab and reinstall Inssist from get.inssist.com.", "Fixed video playback jittering."]
            }, {
                id: "v1.2.0",
                header: "Autoplay for Videos",
                subheader: "v1.2.0",
                hexImage: "hex-update",
                content: ["Videos on the feed will now autoplay (muted) when scrolled into the view. Clicking videos un-mutes them.", "Improved posting screen usability, stability and bundle size."]
            }, {
                id: "v1.1.0",
                header: "Usability Improvements",
                subheader: "v1.1.0",
                hexImage: "hex-update",
                content: ["Text inside the Instagram view can now be selected and copied to clipboard.", "Posting photos and videos now supports locations tagging.", "Fixed issue with instagram.com not connecting after navigation to direct messages.", "Fixed issue with opening facebook.com links from DM messages caused a browser page error.", "Pressing Enter in DM screen now sends the message right away.", "Other miscellaneous usability improvements."]
            }, {
                id: "v0.9.12",
                header: "Bug fixing & Performance",
                subheader: "v0.9.12",
                hexImage: "hex-bug",
                content: ["Extension rebranded to Inssist.", "Loading and rendering speed improved. Fixed an issue when replying to comments rendered an unnecessary actions popup."]
            }, {
                id: "v0.9.5",
                header: "Improved Image Quality",
                subheader: "v0.9.5",
                hexImage: "hex-quality",
                content: ["Landscape and Portrait photos now retain high image quality when uploaded with the plugin."]
            }, {
                id: "v0.9.2",
                header: "Video Support",
                subheader: "v0.9.2",
                hexImage: "hex-video",
                content: ["Plugin now supports Video uploads."]
            }, {
                id: "v0.8.9",
                header: "Stickers and Markers Support",
                subheader: "v0.8.9",
                hexImage: "hex-marker",
                content: ["Stories can now be uploaded with stickers and markers."]
            }, {
                id: "v0.8.3",
                header: "Improved UI",
                subheader: "v0.8.3",
                hexImage: "hex-bug",
                content: ["User profile, stories reel and other parts of user interface and user experience were improved. Fixed stories viewer not showing stories on a first click."]
            }, {
                id: "v0.8.0",
                header: "Basic version",
                subheader: "v0.8.0",
                hexImage: "hex-igswiss",
                content: ["Plugin now supports photos and stories upload and direct messages."]
            }].map((e => ({
                id: e.id,
                acknowledged: !0
            }))),
            userDetails: {},
            billing: {
                navigation: {
                    isBodyOpen: !1
                },
                discount: {
                    availableTill: -1,
                    showSnackbarMessage: !1
                },
                account: {
                    email: null,
                    token: null
                },
                recordedUsernames: [],
                promocode: null,
                recentFeature: null,
                trial: {
                    installedOn: Date.now(),
                    dmAdvanced: 0,
                    schedule: 0,
                    insights: 0,
                    analytics: 0,
                    coverAssist: 0,
                    musicAssist: 0,
                    tagAssist: 0,
                    storyAssist: 0,
                    addLinkToStory: 0,
                    repost: 0,
                    reels: 0,
                    ghostStoryView: 0,
                    postsPublished: 0,
                    storiesPublished: 0,
                    dmsSent: 0
                },
                optimistic: null,
                subscriptions: {},
                products: {},
                orders: [],
                selectedPlan: null,
                purchasingPlan: null,
                countryIso: null,
                pricing: null,
                snapshot: {},
                verificationCodeEmail: null
            }
        });
    var Sy = {
            proxy: py,
            replaceState: gy,
            getWhatsNewItems: by,
            getTemplateUserState: yy,
            getTemplateSharedState: _y,
            actions: {
                acknowledge: vy
            }
        },
        xy = {},
        Py = {
            get: async function(e) {
                const t = await Dy();
                return await ky, ky = new Promise(((n, r) => {
                    const o = t.transaction("data", "readonly").objectStore("data").get(e);
                    o.onsuccess = e => {
                        n(e.target.result ? e.target.result.value : void 0)
                    }, o.onerror = () => {
                        console.error("idb-controller → get", {
                            key: e,
                            req: o,
                            error: o.error
                        }), r(o.error)
                    }
                })), ky
            },
            set: async function(e, t) {
                const n = await Dy();
                return await ky, ky = new Promise(((r, o) => {
                    const i = n.transaction("data", "readwrite").objectStore("data").put({
                        id: e,
                        value: t
                    });
                    i.onsuccess = () => {
                        r()
                    }, i.onerror = () => {
                        console.error("idb-controller → set", {
                            key: e,
                            req: i,
                            error: i.error
                        }), o(i.error)
                    }
                })), ky
            },
            delete: async function(e) {
                const t = await Dy();
                return await ky, ky = new Promise(((n, r) => {
                    const o = t.transaction("data", "readwrite").objectStore("data").delete(e);
                    o.onsuccess = () => {
                        n()
                    }, o.onerror = () => {
                        console.error("idb-controller → delete", {
                            key: e,
                            req: o,
                            error: o.error
                        }), r(o.error)
                    }
                })), ky
            },
            getAllKeys: async function() {
                const e = await Dy();
                return await ky, ky = new Promise(((t, n) => {
                    const r = e.transaction("data", "readonly").objectStore("data").getAllKeys();
                    r.onsuccess = e => {
                        const n = e.target.result;
                        t(n)
                    }, r.onerror = () => {
                        n(r.error)
                    }
                })), ky
            }
        };
    let ky = Promise.resolve();
    async function Dy() {
        const e = Dy;
        return e.db || (e.db = await new Promise(((e, t) => {
            const n = indexedDB.open("inssist", 1);
            n.onupgradeneeded = e => {
                e.target.result.createObjectStore("data", {
                    keyPath: "id"
                })
            }, n.onsuccess = t => {
                e(t.target.result)
            }, n.onerror = () => {
                console.error("idb-controller → getDb", {
                    req: n,
                    error: n.error
                }), t(n.error)
            }
        }))), e.db
    }
    var Ey = {
            controller: Py
        },
        Iy = {
            init: async function() {
                return void await Ey.controller.delete("image-proxy.cache");
                Fy = await Ey.controller.get("image-proxy.cache") || {}, Cy.resolve(), $g.on("image-proxy.save", Ay), $g.on("image-proxy.cache-item-used", Oy)
            },
            save: Ay
        };
    const Ty = 15 * L.time.SECOND,
        Cy = L.createResolvablePromise();
    let Fy;
    async function Ay(e) {}
    async function Oy(e) {
        Fy[e] && (Fy[e].lastUsedAt = Date.now(), My())
    }

    function My() {
        const e = My;
        clearTimeout(e.timeout), e.timeout = setTimeout((async () => {
            Ey.controller.set("image-proxy.cache", Fy)
        }), Ty)
    }
    var Ry = {
            controller: Iy
        },
        Ny = {
            init: function() {
                By = -1, $g.on("core-web-request.popup-tab-id", (e => {
                    Uy = e
                }))
            },
            watch: function(e, t) {
                chrome.webRequest.onBeforeRequest.addListener((e => {
                    let n = null;
                    const r = new URL(e.url).host;
                    return t({
                        details: e,
                        isBeforeRequest: !0,
                        isRequest: !1,
                        isResponse: !1,
                        fromExtension: jy(e),
                        checkUrl: function(t) {
                            return e.url.includes(t)
                        },
                        checkHost: function(e) {
                            return r.includes(e)
                        },
                        redirect: function(e) {
                            n = {
                                redirectUrl: e
                            }
                        },
                        cancel: function() {
                            n = {
                                cancel: !0
                            }
                        },
                        getHeader: function() {},
                        setHeader: function() {}
                    }), n
                }), {
                    urls: e
                }, ["blocking"]), chrome.webRequest.onBeforeSendHeaders.addListener((e => {
                    Ly(e.requestHeaders);
                    const n = new URL(e.url).host,
                        r = {
                            details: e,
                            isBeforeRequest: !1,
                            isRequest: !0,
                            isResponse: !1,
                            fromExtension: jy(e),
                            redirect: function() {},
                            cancel: function() {},
                            checkUrl: function(t) {
                                return e.url.includes(t)
                            },
                            checkHost: function(e) {
                                return n.includes(e)
                            },
                            getHeader: function(t) {
                                return t = t.toLowerCase(), e.requestHeaders.find((e => e.name === t))
                            },
                            setHeader: function(t, n) {
                                t = t.toLowerCase(), e.requestHeaders = e.requestHeaders.filter((e => e.name !== t)), e.requestHeaders.push({
                                    name: t,
                                    value: n
                                })
                            },
                            removeHeader: function(t) {
                                t = t.toLowerCase(), e.requestHeaders = e.requestHeaders.filter((e => e.name !== t))
                            }
                        };
                    return t(r), {
                        requestHeaders: e.requestHeaders
                    }
                }), {
                    urls: e
                }, ["blocking", "requestHeaders", "extraHeaders"]), chrome.webRequest.onHeadersReceived.addListener((e => {
                    Ly(e.responseHeaders);
                    const n = new URL(e.url).host;
                    return t({
                        details: e,
                        isBeforeRequest: !1,
                        isRequest: !1,
                        isResponse: !0,
                        fromExtension: jy(e),
                        redirect: function() {},
                        cancel: function() {},
                        checkUrl: function(t) {
                            return e.url.includes(t)
                        },
                        checkHost: function(e) {
                            return n.includes(e)
                        },
                        getHeader: function(t) {
                            return t = t.toLowerCase(), e.responseHeaders.find((e => e.name === t))
                        },
                        setHeader: function(t, n) {
                            t = t.toLowerCase(), e.responseHeaders = e.responseHeaders.filter((e => e.name !== t)), e.responseHeaders.push({
                                name: t,
                                value: n
                            })
                        },
                        removeHeader: function(t) {
                            t = t.toLowerCase(), e.responseHeaders = e.responseHeaders.filter((e => e.name !== t))
                        }
                    }), {
                        responseHeaders: e.responseHeaders
                    }
                }), {
                    urls: e
                }, ["blocking", "responseHeaders", "extraHeaders"])
            }
        };
    let Uy = null,
        By = null;

    function Ly(e) {
        for (const t of e) t.name = t.name.toLowerCase()
    }

    function jy(e) {
        return e.tabId === Uy || e.tabId === By
    }
    var Vy = {
        controller: Ny
    };
    const Hy = R();
    let qy;

    function zy({
        details: e,
        isBeforeRequest: t,
        isRequest: n,
        isResponse: r,
        fromExtension: o,
        redirect: i,
        cancel: a,
        getHeader: s,
        setHeader: l,
        removeHeader: u,
        checkUrl: c,
        checkHost: d
    }) {
        if (Hy(arguments[0]), n && d("instagram.com") && s("x-inssist-cookies")) {
            u("cookie");
            const e = s("x-inssist-cookies");
            try {
                const t = JSON.parse(e.value);
                l("cookie", Object.entries(t).map((([e, t]) => `${e}=${t}`)).join("; "))
            } catch (e) {
                console.error(e)
            }
            u("x-inssist-cookies")
        }
        if (t && d("app.inssist.com") && i(chrome.runtime.getURL("/inssist.html")), t && d("instagram.com") && c("service-worker") && i(chrome.runtime.getURL("/js/ig-service-worker.js")), n && o && (d("instagram.com") || d("facebook.com") || d("fastspring.com"))) {
            const t = s("origin");
            if (!t || (null == t ? void 0 : t.value.startsWith("chrome-extension"))) {
                l("origin", new URL(e.url).origin)
            }
        }
        if (n && o && d("instagram.com")) {
            "iframe" === s("sec-fetch-dest").value && l("sec-fetch-dest", "document")
        }
        if (n && o && d("instagram.com") && ("sub_frame" !== e.type || !c("/direct/"))) {
            l("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1")
        }
        if (r && d("instagram.com") && l("access-control-expose-headers", "*, Authorization"), r && (d("instagram.com") || d("facebook.com") || d("inssist.com") || d("onfastspring.com")) && (e.responseHeaders = e.responseHeaders.filter((e => "x-frame-options" !== e.name))), r && (d("instagram.com") || d("facebook.com") || d("inssist.com") || d("onfastspring.com")) && (e.responseHeaders = e.responseHeaders.filter((e => "content-security-policy" !== e.name && "content-security-policy-report-only" !== e.name))), t && c("facebook.com/x/oauth/status") && a(), t && c("/csp/reporting") && a(), r && d("instagram.com")) {
            const e = s("x-ig-set-www-claim");
            e && qy !== e.value && (qy = e.value)
        }
        if (n && d("instagram.com")) {
            !s("x-ig-www-claim") && qy && l("x-ig-www-claim", qy)
        }
        n && o && d("instagram.com") && (u("sec-ch-ua"), u("sec-ch-ua-platform"), u("sec-ch-ua-mobile"), l("sec-fetch-user", "?1"), l("sec-fetch-site", "same-origin"), l("sec-ch-prefers-color-scheme", "light"))
    }
    var Gy = {
            controller: {
                init: function() {
                    Vy.controller.watch(["https://*.onfastspring.com/*", "https://*.instagram.com/*", "https://*.facebook.com/*", "https://*.inssist.com/*"], zy)
                },
                onRequest: Hy
            }
        },
        $y = {};
    const {
        model: Wy,
        transaction: Yy
    } = Dg;
    let Jy = null,
        Qy = !1;
    $y.controller = {
        init: async function() {
            await this._setAuthStatusIfAbsent(), this._refreshUserOnSessionIdChange(), this._watchAndSaveFbCookies(), this._updateUserOnPopupStart(), $g.on("auth.set-ig-initial-url", this._setIgInitialUrl.bind(this)), $g.on("auth.login", this._login.bind(this)), $g.on("auth.logout", this._logout.bind(this))
        },
        toggleSessionWatcher: function(e) {
            Qy = !e
        },
        updateUser: async function(e = !1) {
            log("auth-controller: updating user id...");
            const t = await this.refreshUser();
            t && await Wg.actualizeCookies(), !t && e && this._navigateToInstagram()
        },
        refreshUser: async function() {
            const e = this.refreshUser,
                t = j.generate();
            e.requestId = t, Rg.ignoreCache();
            const n = await jg.api.fetchViewerInfo();
            if (e.requestId !== t) return !1;
            if (n.error) return !1;
            const r = n.result || null,
                o = r && Wy.state.authStatus.userId === r.userId;
            return r && Ry.controller.save(r.avatarUrl), Yy((e => {
                if (r && e.authStatus.userId === r.userId) return e.authStatus.username = r.username, e.authStatus.avatarUrl = r.avatarUrl, void(e.multiaccount.selectedUserId = r.userId);
                if (r) {
                    const t = e.multiaccount.userIds;
                    e.multiaccount.addingNewAccount ? e.multiaccount.addingNewAccount = !1 : e.authStatus.isLoggedIn || L.removeFromArray(t, e.multiaccount.selectedUserId), t.includes(r.userId) || t.push(r.userId), e.multiaccount.selectedUserId = r.userId
                }
                if (e.authStatus.userId) {
                    e.userStates[e.authStatus.userId] = {};
                    const t = Sy.getTemplateUserState();
                    for (const n in t) e.userStates[e.authStatus.userId][n] = e[n]
                }
                let t = null;
                r && e.userStates[r.userId] ? (t = e.userStates[r.userId], delete e.userStates[r.userId]) : t = Sy.getTemplateUserState(), t.authStatus.userId = (null == r ? void 0 : r.userId) || null, t.authStatus.username = (null == r ? void 0 : r.username) || null, t.authStatus.avatarUrl = (null == r ? void 0 : r.avatarUrl) || null, t.authStatus.isLoggedIn = !!r, Object.assign(e, t)
            })), await this._actualizeCoookies(), o || ($g.send("iframe-bus", "ig.clear-and-show-spinner"), r ? Jy ? $g.send("iframe-bus", "ig.hard-go", Jy) : (xy.controller.cleanUpState(), $g.send("igView.refresh")) : $g.send("iframe-bus", "ig.hard-go", "/accounts/login/"), $g.send("iframe-bus", "dm.refresh"), $g.send("iframe-bus", "schedule.fcs-refresh-page")), Jy = null, $g.send("auth.refreshed"), !!r
        },
        _clearCookies: async function(e) {
            const t = await L.callAsync(chrome.cookies.getAll, {
                domain: `.${e}`
            });
            for (const n of t) await L.callAsync(chrome.cookies.remove, {
                url: `https://*.${e}`,
                name: n.name
            })
        },
        _updateUserOnPopupStart: function() {
            let e = null;
            $g.on("popup.start", (async () => {
                var t, n;
                const r = await L.callAsync(chrome.cookies.get, {
                        url: "https://*.instagram.com",
                        name: "sessionid"
                    }),
                    o = null === (t = Wy.state.authStatus) || void 0 === t || null === (n = t.cookies) || void 0 === n ? void 0 : n.igSessionId,
                    i = Date.now();
                r && o === r.value && e && i - e <= 6 * L.time.HOUR || (e = i, await this.updateUser())
            }))
        },
        _navigateToInstagram: function() {
            chrome.tabs.update({
                url: Ug.login.url
            })
        },
        _setAuthStatusIfAbsent: async function() {
            if ("username" in Wy.state.authStatus) return;
            Rg.ignoreCache();
            const e = await jg.api.fetchViewerInfo();
            if (e.error) return;
            const t = e.result || null;
            Yy((e => {
                e.authStatus.userId = (null == t ? void 0 : t.userId) || null, e.authStatus.username = (null == t ? void 0 : t.username) || null, e.authStatus.fullName = (null == t ? void 0 : t.fullName) || null, e.authStatus.email = (null == t ? void 0 : t.email) || null, e.authStatus.avatarUrl = (null == t ? void 0 : t.avatarUrl) || null, e.authStatus.isLoggedIn = !!t, e.authStatus.cookies = (null == t ? void 0 : t.cookies) || {
                    igSessionId: null,
                    fb: []
                }
            })), await this._actualizeCoookies()
        },
        _refreshUserOnSessionIdChange: function() {
            let e;
            chrome.cookies.onChanged.addListener((({
                cookie: t,
                removed: n
            }) => {
                this._isSessionWatcherPaused() || ".instagram.com" === t.domain && "sessionid" === t.name && (clearTimeout(e), e = setTimeout((() => this.refreshUser())))
            }))
        },
        _watchAndSaveFbCookies: function() {
            let e;
            Gy.controller.onRequest((({
                details: n,
                isResponse: r,
                checkHost: o
            }) => {
                if (r && o("facebook.com")) {
                    !!n.responseHeaders.find((e => "set-cookie" === e.name)) && (clearTimeout(e), e = setTimeout(t))
                }
            }));
            const t = async () => {
                const e = await L.callAsync(chrome.cookies.getAll, {
                    domain: ".facebook.com"
                });
                Yy((t => {
                    t.authStatus.cookies.fb = e
                }))
            }
        },
        _setIgInitialUrl: function(e) {
            Jy = e
        },
        _login: async function(e) {
            var t;
            const n = null === (t = Wy.state.userStates[e]) || void 0 === t ? void 0 : t.authStatus;
            if (n) {
                this.toggleSessionWatcher(!1);
                try {
                    await this._clearCookies("facebook.com"), await this._applyCookies("facebook.com", n.cookies.fb), await this._clearCookies("instagram.com"), await this._applyCookies("instagram.com", n.cookies.ig), await L.callAsync(chrome.cookies.set, {
                        url: "https://*.instagram.com",
                        name: "sessionid",
                        value: n.cookies.igSessionId,
                        domain: ".instagram.com",
                        path: "/",
                        secure: !0,
                        httpOnly: !1,
                        sameSite: "no_restriction",
                        expirationDate: Math.round((Date.now() + 365 * L.time.DAY) / 1e3)
                    })
                } catch (e) {
                    console.error(e)
                }
                this.toggleSessionWatcher(!0), setTimeout((() => this.refreshUser()))
            } else console.error("auth status not found", {
                userId: e
            })
        },
        _applyCookies: async function(e, t) {
            for (const n of t) "facebook.com" === e && "_js_datr" === n.name || await L.callAsync(chrome.cookies.set, {
                url: `https://*.${e}`,
                name: n.name,
                value: n.value,
                domain: n.domain,
                path: n.path,
                secure: n.secure,
                httpOnly: n.httpOnly,
                sameSite: n.sameSite,
                storeId: n.storeId,
                expirationDate: n.expirationDate
            })
        },
        _logout: async function() {
            await this._clearCookies("facebook.com"), await this._clearCookies("instagram.com")
        },
        _isSessionWatcherPaused: function() {
            return Qy || Wy.state.schedule.fcsSetup.connecting
        },
        _actualizeCoookies: async function() {
            const e = await L.callAsync(chrome.cookies.get, {
                    url: "https://*.instagram.com",
                    name: "sessionid"
                }),
                t = await L.callAsync(chrome.cookies.getAll, {
                    domain: ".facebook.com"
                }),
                n = await L.callAsync(chrome.cookies.getAll, {
                    domain: ".instagram.com"
                });
            Yy((r => {
                r.authStatus.cookies.igSessionId = (null == e ? void 0 : e.value) || null, r.authStatus.cookies.ig = n, r.authStatus.cookies.fb = t
            }))
        }
    };
    var Ky = {};
    const {
        model: Xy
    } = Dg;
    Ky.controller = {
        status: null,
        init: function() {
            this._subscribeToInflux()
        },
        _subscribeToInflux: function() {
            Xy.observe((e => e.whatsNew.some((e => !e.acknowledged)) ? "updated" : "normal"), (e => {
                this._updateBadge(e)
            }))
        },
        _updateBadge: function(e) {
            if (this.status === e) return;
            (chrome.browserAction || chrome.action).setIcon({
                path: {
                    48: `/img/icon-badge-48-${e}.png`
                }
            })
        }
    }, jg.ec = {
        noNetwork: "no-network",
        timedOut: "timed-out",
        redirectToLogin: "redirect-to-login",
        suspended: "suspended-400",
        missingPost: "missing-post-400x",
        missingUser: "missing-user",
        forbidden: "forbidden-403",
        notFound: "not-found-404",
        tooManyRequests: "too-many-requests-429",
        serverIsDown: "server-is-down-500",
        badGateway: "bad-gateway-502",
        serviceUnavailable: "service-unavailable-503",
        serviceDown: "service-down-560",
        other: "other"
    };
    const Zy = jg.ec,
        ew = {
            "Failed to fetch": Zy.noNetwork,
            "Timed out": Zy.timedOut,
            "Redirect to login": Zy.redirectToLogin,
            "Missing user": Zy.missingUser,
            400: Zy.suspended,
            "400x": Zy.missingPost,
            403: Zy.forbidden,
            404: Zy.notFound,
            429: Zy.tooManyRequests,
            500: Zy.serverIsDown,
            502: Zy.badGateway,
            503: Zy.serviceUnavailable,
            560: Zy.serviceDown
        };
    jg.Response = class e {
        constructor(e, t, n, r) {
            this.result = e, this.error = t ? {
                code: t,
                message: n,
                body: r
            } : null
        }
        isSuccess() {
            return !this.error
        }
        reportError(e, t) {
            return this.error.code === Zy.other && cy.controller.sendError(`ig-api.${e}: unknown error`, "error", {
                details: t
            }, {
                actor: "ig-api"
            }), this
        }
        static ofResult(t) {
            return new e(t)
        }
        static ofNetworkError(t) {
            t && t.message && "400" === t.message && (t && "missing media" === t.body || t && "Sorry, this photo has been deleted" === t.body) && (t.message = "400x");
            const n = t && t.message && ew[t.message] || Zy.other,
                r = t && t.message || null,
                o = t && t.body || null;
            return new e(null, n, r, o)
        }
    };
    const tw = {
        headers: {
            "x-ig-app-id": "1217981644879628"
        }
    };

    function nw(e, t) {
        const n = Date.now();
        return e * (Math.log(.061 * L.time.DAY) / Math.log(.061 * (n - t)))
    }

    function rw(e) {
        if (e && e.includes(Ug.challenge)) {
            const e = new Error;
            throw e.message = "400", e.body = "Challenge", e
        }
        return e
    }

    function ow(e) {
        if (e && e.includes(Ug.login.link)) {
            const e = new Error;
            throw e.message = "Redirect to login", e.body = "Redirect to login", e
        }
        return e
    }

    function iw(e, t) {
        const n = async function(...n) {
            try {
                const t = await e(...n);
                return jg.Response.ofResult(t)
            } catch (e) {
                return jg.Response.ofNetworkError(e).reportError(t, e)
            }
        };
        return $g.on(`ig-api.${t}`, n), n
    }
    jg.api = {
        fetchViewerInfo: iw((async function() {
            try {
                return await async function() {
                    Rg.ignoreCache();
                    const e = (await Rg.fetchText("https://instagram.com")).split("\n").find((e => e.includes("is_professional_account")));
                    if (!e) return null;
                    const t = e.split("XIGSharedData")[1].replaceAll('\\"', '"').replaceAll("\\/", "/").replaceAll("\\u", "u"),
                        n = (e, n = "string") => {
                            try {
                                let r;
                                return "string" === n ? r = t.split(`"${e}":"`)[1].split('"')[0] : "bool" === n && (r = t.split(`"${e}":`)[1].split(",")[0], r = "false" !== r), r
                            } catch (t) {
                                return console.error(`Failed to extract "${e}"`, t), null
                            }
                        };
                    let r = n("profile_pic_url");
                    r && (r = r.replaceAll("\\u0026", "&"));
                    return {
                        userId: n("viewerId"),
                        username: n("username"),
                        fullName: n("full_name"),
                        email: null,
                        avatarUrl: r,
                        isProfessionalAccount: n("is_professional_account", "bool")
                    }
                }()
            } catch (e) {
                console.error("Failed to fetch viewer info (v2)", e)
            }
            try {
                return await async function() {
                    const e = "https://i.instagram.com/api/v1/accounts/edit/web_form_data/";
                    Rg.ignoreCache();
                    const t = await Rg.fetchText(e, tw),
                        n = L.safeJsonParse(t);
                    if (!n) return null;
                    const r = n.form_data.username,
                        o = await async function(e) {
                            var t;
                            const n = L.createUrl("https://i.instagram.com/api/v1/users/web_profile_info/", {
                                    username: e
                                }),
                                r = await Rg.fetchJson(n, tw);
                            return (null == r || null === (t = r.data) || void 0 === t ? void 0 : t.user) || null
                        }(r);
                    if (!o) return null;
                    return {
                        userId: o.id,
                        username: r,
                        fullName: o.full_name,
                        email: n.form_data.email,
                        avatarUrl: o.profile_pic_url_hd,
                        isProfessionalAccount: o.is_professional_account || o.is_business_account
                    }
                }()
            } catch (e) {
                console.error("Failed to fetch viewer info (v1)", e)
            }
            throw new Error("Failed to fetch viewer info")
        }), "fetch-viewer-info"),
        fetchLoginActivity: iw((async function() {
            return Rg.fetchJson(Ug.loginActivity.url, tw)
        }), "fetch-login-activity"),
        fetchTag: iw((async function(e, {
            incognito: t = !1
        } = {}) {
            const n = {
                name: e,
                isBanned: null,
                isFlagged: null,
                avgLikes: null,
                avgComments: null,
                avgPosts: null,
                totalPosts: null,
                relevantTags: []
            };
            let r, o = !1;
            try {
                const n = Ug.hashtag.url(e, {
                        json: !0
                    }),
                    o = t ? "omit" : "include";
                Rg.ignoreCache(), r = await Rg.fetchText(n, {
                    credentials: o,
                    ...tw
                })
            } catch (e) {
                if ("404" !== e.message) throw e;
                o = !0
            }
            if (rw(r), ow(r), o) return n.isBanned = !0, n.isFlagged = !1, n;
            const i = JSON.parse(r);
            if ("graphql" in i) {
                const t = i.graphql.hashtag,
                    r = t.edge_hashtag_to_top_posts.edges,
                    o = t.edge_hashtag_to_media.edges;
                let a, s = 0,
                    l = 0; {
                    const e = r.map((e => {
                        const t = e.node,
                            n = 1e3 * t.taken_at_timestamp,
                            r = t.edge_liked_by.count,
                            o = t.edge_media_to_comment.count;
                        return {
                            likes: nw(r, n),
                            comments: nw(o, n)
                        }
                    })).sort(((e, t) => L.calcEngagement(e.likes, t.comments) - L.calcEngagement(t.likes, t.comments))).slice(Math.floor(r.length / 2 - Math.min(5, r.length / 3 / 2)), Math.floor(r.length / 2 + Math.min(5, r.length / 3 / 2)));
                    if (e.length > 0) {
                        for (const t of e) s += t.likes, l += t.comments;
                        s = Math.round(s / e.length), l = Math.round(l / e.length)
                    }
                } {
                    const e = new Set,
                        t = o.map((e => ({
                            ts: 1e3 * e.node.taken_at_timestamp,
                            ownerId: e.node.owner.id
                        }))).sort(((e, t) => t.ts - e.ts)).slice(0, 30).filter((t => {
                            const n = t.ownerId;
                            return !e.has(n) && (e.add(n), !0)
                        })).map((e => e.ts)),
                        n = t[0] - t[t.length - 1],
                        r = Math.max(100, n / t.length);
                    a = Math.round(L.time.DAY / r)
                }
                let u = []; {
                    const t = {},
                        n = [{
                            edges: r,
                            relevance: 2
                        }, {
                            edges: o,
                            relevance: 1
                        }];
                    for (const e of n) {
                        const n = L.getHashtagRegex(),
                            r = e.edges.map((e => {
                                var t, n, r, o, i;
                                return (null === (t = e.node) || void 0 === t || null === (n = t.edge_media_to_caption) || void 0 === n || null === (r = n.edges) || void 0 === r || null === (o = r[0]) || void 0 === o || null === (i = o.node) || void 0 === i ? void 0 : i.text) || ""
                            })).map((e => e.match(n) || [])).flat().map((e => e.replace("#", "")));
                        for (const n of r) t[n] = (t[n] || 0) + e.relevance
                    }
                    for (const n in t) {
                        if (n === e) continue;
                        const r = t[n];
                        u.push({
                            tag: n,
                            relevance: r
                        })
                    }
                    u = u.sort(((e, t) => t.relevance - e.relevance)).map((e => e.tag))
                }
                n.isBanned = !1, n.isFlagged = t.is_top_media_only && !t.allow_following, n.totalPosts = t.edge_hashtag_to_media.count, n.avgLikes = s, n.avgComments = l, n.avgPosts = a, n.relevantTags = u
            } else {
                const t = i.data,
                    r = t.top.sections.map((e => e.layout_content.medias)).flat().map((e => e.media)),
                    o = t.recent.sections.map((e => e.layout_content.medias)).flat().map((e => e.media));
                let a = 0,
                    s = 0; {
                    const e = r.map((e => {
                        const t = 1e3 * e.taken_at,
                            n = e.like_count,
                            r = e.comment_count;
                        return {
                            likes: nw(n, t),
                            comments: nw(r, t)
                        }
                    })).sort(((e, t) => L.calcEngagement(e.likes, t.comments) - L.calcEngagement(t.likes, t.comments))).slice(Math.floor(r.length / 2 - Math.min(5, r.length / 3 / 2)), Math.floor(r.length / 2 + Math.min(5, r.length / 3 / 2)));
                    if (e.length > 0) {
                        for (const t of e) a += t.likes, s += t.comments;
                        a = Math.round(a / e.length), s = Math.round(s / e.length)
                    }
                }
                let l = 0; {
                    const e = new Set,
                        t = o.map((e => ({
                            ts: 1e3 * e.taken_at,
                            ownerId: e.user.pk
                        }))).sort(((e, t) => t.ts - e.ts)).slice(0, 15).filter((t => {
                            const n = t.ownerId;
                            return !e.has(n) && (e.add(n), !0)
                        })).map((e => e.ts));
                    if (t.length > 2) {
                        const e = t[0] - t[t.length - 1],
                            n = Math.max(100, e / t.length);
                        l = Math.round(L.time.DAY / n)
                    }
                }
                let u = []; {
                    const t = {},
                        n = [{
                            posts: r,
                            relevance: 2
                        }, {
                            posts: o,
                            relevance: 1
                        }];
                    for (const e of n) {
                        const n = L.getHashtagRegex(),
                            r = e.posts.map((e => {
                                var t;
                                return (null === (t = e.caption) || void 0 === t ? void 0 : t.text) || ""
                            })).map((e => e.match(n) || [])).flat().map((e => e.replace("#", "")));
                        for (const n of r) t[n] = (t[n] || 0) + e.relevance
                    }
                    for (const n in t) {
                        if (n === e) continue;
                        const r = t[n];
                        u.push({
                            tag: n,
                            relevance: r
                        })
                    }
                    u = u.sort(((e, t) => t.relevance - e.relevance)).map((e => e.tag))
                }
                n.isBanned = !1, n.isFlagged = !t.allow_following && !!t.recent.warning_message, n.totalPosts = t.media_count, n.avgLikes = a, n.avgComments = s, n.avgPosts = l, n.relevantTags = u
            }
            return n
        }), "fetch-tag"),
        fetchUserPosts: iw((async function e(t, n = 10, r = [], o = null) {
            const i = L.createUrl(`https://i.instagram.com/api/v1/feed/user/${t}/username/`, {
                    count: 33,
                    ...o && {
                        max_id: o
                    }
                }),
                a = await Rg.fetchJson(i, tw);
            r.push(...a.items), r.length < n && a.more_available && await e(t, n, r, a.next_max_id);
            return (r = r.slice(0, n)).map((e => {
                var t, n, r, o, i, a, s, l, u, c;
                const d = (null === (t = e.carousel_media) || void 0 === t || null === (n = t[0].image_versions2) || void 0 === n ? void 0 : n.candidates) || (null === (r = e.image_versions2) || void 0 === r ? void 0 : r.candidates) || [];
                return {
                    id: String(e.pk),
                    code: e.code,
                    stats: {
                        likes: Number(e.like_count) || 0,
                        comments: Number(e.comment_count) || 0
                    },
                    on: 1e3 * e.taken_at,
                    caption: (null === (o = e.caption) || void 0 === o ? void 0 : o.text) || "",
                    owner: String((null === (i = e.user) || void 0 === i ? void 0 : i.pk) || ""),
                    ownerName: (null === (a = e.user) || void 0 === a ? void 0 : a.username) || "",
                    type: {
                        1: "photo",
                        2: "video",
                        8: "carousel"
                    } [e.media_type] || "photo",
                    isLiked: e.has_liked,
                    isVideo: "view_count" in e,
                    imgx: (null === (s = d[0]) || void 0 === s ? void 0 : s.url) || null,
                    img: (null === (l = d.at(-1)) || void 0 === l ? void 0 : l.url) || null,
                    imgMedium: (null === (u = d.find((e => 320 === e.width))) || void 0 === u ? void 0 : u.url) || (null === (c = d[0]) || void 0 === c ? void 0 : c.url) || null
                }
            }))
        }), "fetch-user-posts"),
        searchProfiles: iw((async function(e) {
            const t = L.createUrl(`${Ug.base}web/search/topsearch/`, {
                context: "user",
                query: e
            });
            return (await Rg.fetchJson(t)).users.map((e => ({
                id: e.user.pk,
                username: e.user.username,
                fullName: e.user.full_name,
                avatar: e.user.profile_pic_url
            })))
        }), "search-profiles"),
        normalizePostStat24h: nw,
        createUserObject: function(e) {
            return {
                userId: e.id,
                username: e.username,
                fullName: e.full_name,
                avatarUrl: e.profile_pic_url,
                bio: e.biography,
                postsCount: e.edge_owner_to_timeline_media.count,
                followersCount: e.edge_followed_by.count,
                followingsCount: e.edge_follow.count,
                isFresh: e.is_joined_recently,
                isPrivate: e.is_private,
                isVerified: e.is_verified,
                isBusiness: e.is_business_account,
                businessCategory: e.category_name,
                isFollowingViewer: e.follows_viewer,
                isFollowedByViewer: e.followed_by_viewer,
                hasAvatar: e.profile_pic_url.includes("150x150"),
                hasHighlights: e.highlight_reel_count > 0,
                hasIgtv: e.edge_felix_video_timeline.count > 0,
                lastPosts: e.edge_owner_to_timeline_media.edges.map((e => ({
                    ts: 1e3 * e.node.taken_at_timestamp
                })))
            }
        }
    }, jg.Publisher = class {
        constructor(e = null) {
            this._debug = !0, this._igAppId = "1217981644879628", this._cookies = e
        }
        async postPhoto(e, {
            caption: t = "",
            mentions: n = null,
            location: r = null
        }) {
            const o = this._generateUploadName();
            this._log("⏳ upload photo..."), await this._uploadPhoto(o, e), this._log("⏳ publish photo..."), await this._configure("/api/v1/media/configure/", {
                caption: t,
                source_type: "library",
                upload_id: this._getUploadId(o),
                ...n && {
                    usertags: JSON.stringify(n)
                },
                ...r && {
                    location: JSON.stringify(r),
                    geotag_enabled: !0
                }
            }), this._log("✅ success")
        }
        async postVideo(e, t, {
            caption: n = "",
            mentions: r = null,
            location: o = null
        }) {
            const i = this._generateUploadName();
            this._log("⏳ upload video..."), await this._uploadVideo(i, e, {
                type: "post"
            }), this._log("⏳ upload video cover..."), await this._uploadPhoto(i, t, {
                isVideoCover: !0
            }), this._log("⏳ publish video..."), await this._configure("/igtv/configure_to_igtv/", {
                caption: n,
                source_type: "library",
                is_unified_video: 1,
                igtv_share_preview_to_feed: 1,
                upload_id: this._getUploadId(i),
                ...r && {
                    usertags: JSON.stringify(r)
                },
                ...o && {
                    location: JSON.stringify(o),
                    geotag_enabled: !0
                }
            }), this._log("✅ success")
        }
        async postReel(e, t, {
            caption: n = "",
            mentions: r = null,
            location: o = null,
            shareToFeed: i = !1
        }) {
            const a = this._generateUploadName();
            this._log("⏳ upload reel..."), await this._uploadVideo(a, e, {
                type: "reel"
            }), this._log("⏳ upload reel cover..."), await this._uploadPhoto(a, t, {
                isVideoCover: !0
            }), this._log("⏳ publish reel..."), await this._configure("/api/v1/media/configure_to_clips/", {
                caption: n,
                is_unified_video: 1,
                disable_comments: 0,
                source_type: "library",
                disable_oa_reuse: !1,
                video_subtitles_enabled: 0,
                igtv_share_preview_to_feed: 1,
                like_and_view_counts_disabled: 0,
                clips_share_preview_to_feed: i ? 1 : 0,
                upload_id: this._getUploadId(a),
                ...r && {
                    usertags: JSON.stringify(r)
                },
                ...o && {
                    location: JSON.stringify(o),
                    geotag_enabled: !0
                }
            }), this._log("✅ success")
        }
        async postStoryPhoto(e, {
            mentions: t = null
        }) {
            const n = this._generateUploadName("story");
            this._log("⏳ upload story photo..."), await this._uploadPhoto(n, e), this._log("⏳ publish story photo..."), await this._configure("/api/v1/web/create/configure_to_story/", {
                upload_id: this._getUploadId(n),
                ...t && {
                    reel_mentions: JSON.stringify(t)
                }
            }), this._log("✅ success")
        }
        async postStoryVideo(e, {
            mentions: t = null
        }) {
            const n = this._generateUploadName("story");
            this._log("⏳ upload story video..."), await this._uploadVideo(n, e, {
                type: "story"
            }), this._log("⏳ upload story video cover...");
            const r = await L.extractFrame(e, 0);
            await this._uploadPhoto(n, r, {
                isVideoCover: !0
            }), this._log("⏳ publish story video..."), await this._configure("/api/v1/web/create/configure_to_story/", {
                upload_id: this._getUploadId(n),
                ...t && {
                    reel_mentions: JSON.stringify(t)
                }
            }), this._log("✅ success")
        }
        async postCarousel(e, {
            caption: t = ""
        } = {}) {
            const n = [];
            for (let t of e) {
                const r = `carousel [${n.length+1}/${e.length}]:`,
                    o = this._generateUploadName(),
                    i = this._getUploadId(o);
                n.push(i);
                let a = null;
                t instanceof Blob || (a = t.coverBlob, t = t.blob), L.isVideo(t) ? (this._log(`⏳ ${r} upload video...`), await this._uploadVideo(o, t, {
                    type: "carousel"
                }), this._log(`⏳ ${r} upload video cover...`), a || (a = await L.extractFrame(t, .5)), await this._uploadPhoto(o, a, {
                    isVideoCover: !0
                })) : (this._log(`⏳ ${r} upload photo...`), await this._uploadPhoto(o, t))
            }
            this._log("⏳ publish carousel..."), await this._configureJson("/api/v1/media/configure_sidecar/", {
                caption: t,
                source_type: "library",
                disable_comments: 0,
                like_and_view_counts_disabled: 0,
                client_sidecar_id: this._generateUploadId(),
                children_metadata: n.map((e => ({
                    upload_id: e
                })))
            }), this._log("✅ success")
        }
        async _uploadPhoto(e, t, {
            isVideoCover: n = !1,
            cookies: r
        } = {}) {
            "image/png" === t.type && (t = await this._toJpeg(t)), await this._fetch({
                attempts: 2,
                url: `https://i.instagram.com/rupload_igphoto/${e}`,
                opts: {
                    method: "POST",
                    body: t,
                    headers: {
                        accept: "*/*",
                        offset: "0",
                        "x-entity-name": e,
                        "x-entity-length": t.size,
                        "x-ig-app-id": this._igAppId,
                        "x-instagram-rupload-params": JSON.stringify({
                            upload_id: this._getUploadId(e),
                            media_type: n ? 2 : 1
                        })
                    }
                }
            })
        }
        async _uploadVideo(e, t, {
            type: n
        }) {
            await this._fetch({
                url: `https://i.instagram.com/rupload_igvideo/${e}`,
                opts: {
                    method: "POST",
                    body: t,
                    headers: {
                        accept: "*/*",
                        offset: "0",
                        "x-entity-name": e,
                        "x-entity-length": t.size,
                        "x-ig-app-id": this._igAppId,
                        "x-instagram-rupload-params": JSON.stringify({
                            is_sidecar: 0,
                            media_type: 2,
                            "client-passthrough": 1,
                            upload_id: this._getUploadId(e),
                            ..."post" === n && {
                                for_album: !1,
                                is_igtv_video: !0,
                                is_unified_video: 1
                            },
                            ..."reel" === n && {
                                for_album: !1,
                                is_clips_video: 1
                            },
                            ..."carousel" === n && {
                                is_sidecar: "1",
                                for_album: !1,
                                is_unified_video: 0,
                                video_format: ""
                            },
                            ..."story" === n && {
                                for_album: !0,
                                is_unified_video: 0
                            }
                        })
                    }
                }
            })
        }
        _generateUploadId() {
            return String(Date.now())
        }
        _generateUploadName(e = "fb_uploader") {
            return `${e}_${this._generateUploadId()}`
        }
        _getUploadId(e) {
            return e.split("_").pop()
        }
        _log(...e) {
            this._debug && console.log("%c[$igApi]", "color: #bb57d1", ...e)
        }
        async _fetchCsrfToken() {
            if (this._cookies && this._cookies.csrftoken) return this._cookies.csrftoken;
            return (await this._fetch({
                url: "https://www.instagram.com/"
            })).replaceAll("\\", "").split("csrf_token").slice(1).find((e => !e.includes("biography"))).split('"')[2]
        }
        async _configure(e, t, n = !1) {
            let r, o;
            n ? (r = JSON.stringify(t), o = "application/json; charset=utf-8") : (r = new URLSearchParams(t).toString(), o = "application/x-www-form-urlencoded"), await this._fetch({
                attempts: 5,
                url: `https://www.instagram.com${e}`,
                opts: {
                    method: "POST",
                    credentials: "include",
                    body: r,
                    headers: {
                        accept: "*/*",
                        "content-type": o,
                        "x-csrftoken": await this._fetchCsrfToken(),
                        "x-ig-app-id": this._igAppId
                    }
                }
            })
        }
        async _configureJson(e, t) {
            await this._configure(e, t, !0)
        }
        async _fetch({
            url: e,
            opts: t = {},
            attempts: n = 1,
            checkResponse: r
        }) {
            r || (r = e => 200 === e.status), this._cookies ? (t.headers || (t.headers = {}), t.headers["x-inssist-cookies"] = JSON.stringify(this._cookies)) : t.credentials = "include";
            const o = async (o = "Failed to fetch") => {
                if ((n -= 1) <= 0) throw new Error(o);
                await L.sleep(3 * L.time.SECOND);
                return await this._fetch({
                    url: e,
                    opts: t,
                    attempts: n,
                    checkResponse: r
                })
            };
            let i, a;
            try {
                i = await fetch(e, t)
            } catch (n) {
                return console.error("Failed to fetch", {
                    url: e,
                    opts: t,
                    e: n
                }), o(n.message)
            }
            try {
                a = await i.text()
            } catch (n) {
                return console.error("Failed to call res.text()", {
                    url: e,
                    opts: t,
                    e: n
                }), o(`Failed to call res.text(): ${n.message}`)
            }
            return r(i) ? a : (console.error("Invalid response", {
                url: e,
                opts: t,
                text: a
            }), o(`Response: ${a}`))
        }
        async _toJpeg(e) {
            const t = document.createElement("img");
            t.src = URL.createObjectURL(e), await new Promise((e => t.addEventListener("load", e)));
            const n = document.createElement("canvas");
            n.width = t.width, n.height = t.height;
            n.getContext("2d").drawImage(t, 0, 0);
            return await new Promise((e => n.toBlob(e, "image/jpeg", 1)))
        }
    };
    var aw = {};
    aw.controller = {
        init: function() {
            L.ls.remove("ab-testing-hash")
        }
    }, Wg.actualizeCookies = async () => {
        const e = await L.callAsync(chrome.cookies.getAll, {
            domain: ".instagram.com"
        });
        Dg.transaction((t => {
            t.later.cookies = {};
            for (const n of e) t.later.cookies[n.name] = n.value
        }))
    }, Wg.config = {
        mimeTypes: ["image/jpeg", "image/png", "video/quicktime", "video/mp4", "video/webm"],
        maxFileSize: 524288e3,
        minVideoDurationSec: 1,
        maxVideoDurationSec: 900.9,
        maxCarouselVideoDurationSec: 60.9,
        maxStoryDurationSec: 300.9,
        minVideoRatio: .12,
        maxVideoRatio: 1.91,
        minImageRatio: .6,
        maxImageRatio: 1.91,
        maxImageWidth: 4e3,
        maxImageHeight: 4e3,
        maxCaptionLength: 2200
    };
    var sw = {};
    Wg.cleanupController = {
        init: function() {
            this._lastIdbCleanupAt = 0, this._cleanupOnPopupStart()
        },
        _cleanupOnPopupStart: function() {
            $g.on("popup.start", (async () => {
                this._cleanupState(), await this._cleanupIdb()
            }))
        },
        _cleanupState: function() {
            Dg.transaction((e => {
                const t = Wg.proxy.getAllPosts(e);
                for (const e of t) delete e.fresh
            }))
        },
        _cleanupIdb: async function() {
            const e = Date.now();
            if (e - this._lastIdbCleanupAt < 5 * L.time.MINUTE) return;
            this._lastIdbCleanupAt = e;
            const t = await sw.controller.getFileIds("later"),
                n = Wg.proxy.getAllPosts();
            for (const e of t) {
                !!n.find((t => t.mediaList.some((t => t.fileId === e || t.coverId === e || t.previewId === e)))) || await sw.controller.remove(e)
            }
        }
    }, Wg.controller = {
        init: function() {
            this._cleanupState(), Wg.scheduler.init(), Wg.cleanupController.init()
        },
        _cleanupState: function() {
            Dg.transaction((e => {
                e.later.posts.filter((e => "posting" === e.status)).forEach((e => e.status = "scheduled"))
            }))
        }
    };
    var lw = {},
        uw = {};
    Wg.scheduler = {
        init: function() {
            this._timer = null, this._debug = !0, this._publishing = !1, this._lastPublishedAt = 0, this._setup()
        },
        _setup: function() {
            this._schedule(), Dg.model.observe((() => Wg.proxy.getConnectedUsersPosts().map((e => `${e.id}-${e.date}-${e.status}`)).join(":")), (() => this._schedule()), !1), Dg.model.observe((e => e.later.selectedPostId), (() => this._schedule()), !1)
        },
        _schedule: function() {
            if (this._publishing) return;
            this._timer && this._timer.clear();
            const e = Dg.model.state,
                t = Wg.proxy.getConnectedUsersPosts().filter((e => "scheduled" === e.status)).sort(((e, t) => e.date - t.date)).at(0);
            if (!t) return void this._log("no posts to publish");
            const n = Wg.proxy.getPostOwnerState(e, t.id),
                r = (null == n ? void 0 : n.authStatus.username) || null,
                o = {
                    post: t,
                    owner: r
                };
            let i;
            const a = Date.now();
            if (i = 0 === e.settings.laterAutoRetry ? t.date < a - 5 * L.time.MINUTE : -1 !== e.settings.laterAutoRetry && t.date < a - e.settings.laterAutoRetry, i) return this._log("too old to publish", o), void Wg.proxy.updatePost(t.id, (e => {
                e.status = "failed", e.error = {
                    message: "Chrome was offline at the given time"
                }
            }));
            if (t.date > a) {
                const e = new Date(t.date).toLocaleString();
                return this._log(`scheduled for ${e}`, o), void(this._timer = L.setTimer((() => this._schedule()), t.date - a))
            }(async () => {
                this._log("publish", o), this._publishing = !0, uw.controller.online ? await this._publishSafe(t) : await uw.controller.waitForOnline(), this._publishing = !1, this._schedule()
            })()
        },
        _publishSafe: async function(e) {
            const t = Wg.proxy.getPostPublishType(e);
            $y.controller.toggleSessionWatcher(!1);
            try {
                await this._publish(e), lw.controller.sendEvent("user", "later:publish-success", t)
            } catch (r) {
                var n;
                console.error(r);
                const o = (null === (n = r.message) || void 0 === n ? void 0 : n.slice(0, 100)) || "unknown";
                lw.controller.sendEvent("user", "later:publish-error", t), lw.controller.sendEvent("user", "later:publish-error-message", o), Wg.proxy.updatePost(e.id, (e => {
                    e.status = "failed", e.error = {
                        message: "Error happened during posting",
                        details: r.message ? r.message.slice(0, 300) : null
                    }
                }))
            }
            $y.controller.toggleSessionWatcher(!0), this._lastPublishedAt = Date.now()
        },
        _publish: async function(e) {
            const t = Dg.model.state,
                n = () => Wg.proxy.getPostOwnerState(t, e.id);
            Wg.proxy.updatePost(e.id, (e => {
                e.status = "posting", e.error = null
            }));
            n().authStatus.userId === t.authStatus.userId && await Wg.actualizeCookies();
            const r = Date.now() - this._lastPublishedAt,
                o = 10 * L.time.SECOND;
            r < o && await L.sleep(o - r);
            const i = n().later.cookies,
                a = new jg.Publisher(i),
                s = (e.caption || "").slice(0, Wg.config.maxCaptionLength);
            if (uw.controller.offline) return void Wg.proxy.updatePost(e.id, (e => e.status = "scheduled"));
            const l = Wg.proxy.getPostPublishType(e);
            if ("photo" === l) {
                const t = await sw.controller.read(e.mediaList[0].fileId);
                await a.postPhoto(t, {
                    caption: s,
                    location: e.location,
                    mentions: e.mentions
                })
            } else if ("video" === l) {
                const t = await sw.controller.read(e.mediaList[0].fileId),
                    n = await sw.controller.read(e.mediaList[0].coverId);
                await a.postVideo(t, n, {
                    caption: s,
                    location: e.location,
                    mentions: e.mentions
                })
            } else if ("reel" === l) {
                const t = await sw.controller.read(e.mediaList[0].fileId),
                    n = await sw.controller.read(e.mediaList[0].coverId);
                await a.postReel(t, n, {
                    caption: s,
                    location: e.location,
                    mentions: e.mentions,
                    shareToFeed: !!e.shareToFeed
                })
            } else if ("story-photo" === l) {
                const t = await sw.controller.read(e.mediaList[0].fileId);
                await a.postStoryPhoto(t, {
                    mentions: e.mentions
                })
            } else if ("story-video" === l) {
                const t = await sw.controller.read(e.mediaList[0].fileId);
                await a.postStoryVideo(t, {
                    mentions: e.mentions
                })
            } else if ("carousel" === l) {
                if (!this._checkCarouselVideosDuration(e)) return void Wg.proxy.updatePost(e.id, (e => {
                    e.status = "failed", e.error = {
                        message: "Error happened during posting",
                        details: "Instagram does not support videos longer than 1 minute for carousels."
                    }
                }));
                const t = await this._prepareCarouselFiles(e);
                await a.postCarousel(t, {
                    caption: s
                })
            }
            Wg.proxy.updatePost(e.id, (e => {
                e.status = "posted"
            }))
        },
        _checkCarouselVideosDuration: function(e) {
            const t = Wg.config.maxCarouselVideoDurationSec;
            for (const n of e.mediaList)
                if (n.isVideo && !(n.duration < t)) return !1;
            return !0
        },
        _prepareCarouselFiles: async function(e) {
            const t = [];
            for (const n of e.mediaList) {
                const e = await sw.controller.read(n.fileId),
                    r = n.coverId && await sw.controller.read(n.coverId);
                t.push({
                    file: e,
                    cover: r,
                    isVideo: n.isVideo
                })
            }
            let n, r; {
                const e = t[0];
                if (e.isVideo) {
                    n = (await L.loadVideoMetadata(e.file)).ratio
                } else {
                    n = (await L.loadImage(e.file)).ratio
                }
            } {
                const e = Wg.config.minImageRatio,
                    t = Wg.config.maxImageRatio;
                r = Math.max(e, Math.min(n, t))
            }
            for (const e of t) {
                e === t[0] && n === r || (e.isVideo || (e.file = await L.scaler.scaleToFitRatio(e.file, r)))
            }
            return t.filter((e => {
                const t = Wg.config.maxCarouselVideoDurationSec;
                return !(e.isVideo && e.duration > t)
            })).map((e => ({
                blob: e.file,
                ...e.cover && {
                    coverBlob: e.cover
                }
            })))
        },
        _log: function(...e) {
            this._debug && console.log("%c[$later]", "color: #e07a00", ...e)
        }
    }, Wg.proxy = {
        getAllStates: function(e = Dg.model.state) {
            return [e, ...Object.values(e.userStates)]
        },
        getAllConnectedStates: function(e = Dg.model.state) {
            return this.getAllStates(e).filter((t => {
                const n = t.authStatus.userId;
                return e.multiaccount.userIds.includes(n)
            }))
        },
        getSelectedUserState: function(e = Dg.model.state) {
            return this.getUserState(e, e.later.selectedUserId)
        },
        getUserState: function(e, t) {
            return this.getAllStates(e).find((e => e.authStatus.userId === t)) || null
        },
        getPostOwnerState: function(e, t) {
            const n = this.getAllStates(e).find((e => e.later.posts.some((e => e.id === t))));
            return n || null
        },
        getSelectedUserPosts: function() {
            const e = this.getSelectedUserState();
            if (!e) return [];
            const t = [...e.later.posts];
            return t.sort(((e, n) => {
                if ("draft" !== e.status && "draft" === n.status) return 1;
                if ("draft" === e.status && "draft" !== n.status) return -1;
                if (e.date && n.date) return n.date - e.date;
                if (e.date) return 1;
                if (n.date) return -1;
                const r = t.indexOf(e);
                return t.indexOf(n) - r
            }))
        },
        getAllPosts: function(e = Dg.model.state) {
            return this.getAllStates(e).map((e => e.later.posts)).flat()
        },
        getConnectedUsersPosts: function() {
            return this.getAllConnectedStates().map((e => e.later.posts)).flat()
        },
        getSelectedPost: function() {
            const e = Dg.model.state;
            return this.getAllPosts().find((t => t.id === e.later.selectedPostId))
        },
        getPost: function(e) {
            const t = this.getAllConnectedStates();
            for (const n of t) {
                const t = n.later.posts.find((t => t.id === e));
                if (t) return t
            }
            return null
        },
        getPostPublishType: function(e) {
            if ("post" === e.type && e.mediaList.length > 1) return "carousel";
            const t = e.mediaList[0].isVideo;
            return "reel" === e.type ? "reel" : "post" === e.type && t ? "video" : "post" !== e.type || t ? "story" === e.type && t ? "story-video" : "story" !== e.type || t ? void 0 : "story-photo" : "photo"
        },
        updatePost: function(e, t = (() => {})) {
            Dg.transaction((n => {
                const r = (n = this.getPostOwnerState(n, e)).later.posts.find((t => t.id === e));
                r && t(r)
            }))
        },
        deletePost: function(e) {
            Dg.transaction((t => {
                const n = (t = this.getPostOwnerState(t, e)).later.posts.findIndex((t => t.id === e));
                t.later.posts.splice(n, 1)
            }))
        },
        isPostEditable: function(e) {
            return "posted" !== e.status && "posting" !== e.status
        }
    };
    const cw = "__iframeBus.name",
        dw = "__iframeBus.args",
        fw = "__iframeBus.callbackId",
        pw = "undefined" != typeof parent && parent !== window;

    function hw(e, t) {
        const n = bw(e),
            r = t["__iframeBus.handlers"] || (t["__iframeBus.handlers"] = {});
        r[e] = async r => {
            if (r.data["__iframeBus.name"] === n) {
                const n = r.data["__iframeBus.args"] || [],
                    o = r.data["__iframeBus.callbackId"] || null,
                    i = await t(...n);
                o && vw(`${e}:response-${o}`, i)
            }
        }, window.addEventListener("message", r[e])
    }

    function gw(e, t) {
        hw(e, (function n(...r) {
            return mw(e, n), t(...r)
        }))
    }

    function mw(e, t) {
        const n = t["__iframeBus.handlers"] || (t["__iframeBus.handlers"] = {});
        window.removeEventListener("message", n[e])
    }
    async function vw(e, ...t) {
        let n;
        const r = t[t.length - 1];
        "function" == typeof r ? (n = r, t = t.slice(0, -1)) : n = null;
        const o = e.includes(":response-"),
            i = bw(e),
            a = o ? null : j.generate();
        if (pw ? parent.postMessage({
                [cw]: i,
                [dw]: t,
                [fw]: a
            }, "*") : function(e, t = document) {
                e = M(e);
                const n = [];
                for (const r of e) {
                    const e = t.querySelectorAll(r);
                    for (const t of e) n.includes(t) || n.push(t)
                }
                return n
            }("iframe").forEach((e => {
                e.contentWindow.postMessage({
                    [cw]: i,
                    [dw]: t,
                    [fw]: a
                }, "*")
            })), !o) return new Promise((t => {
            const r = o => {
                n && n(o), mw(`${e}:response-${a}`, r), t(o)
            };
            hw(`${e}:response-${a}`, r)
        }))
    }

    function bw(e) {
        return `iframe-bus.${e}`
    }
    var yw = {
        init: function() {
            $g.on("iframe-bus", ((e, ...t) => vw(e, ...t))), hw("chrome-bus", ((e, ...t) => $g.send(e, ...t)))
        },
        on: hw,
        once: gw,
        off: mw,
        send: vw,
        wait: async function(e) {
            return await new Promise((t => {
                gw(e, t)
            }))
        }
    };
    lw.controller = {
        init: function() {
            return u.is.popup ? (this._insertAnalyticsScript(), this._initIframeMessage(), this._sendBgEvents()) : u.is.background && this._initChromeMessage(), this
        },
        _insertAnalyticsScript: function() {
            globalThis.ga = (...e) => {
                (globalThis.ga.q = globalThis.ga.q || []).push(e)
            };
            const e = document.createElement("script");
            e.src = "/js/analytics.js", document.body.appendChild(e);
            const t = "ga:clientId";
            globalThis.ga("create", "UA-146823118-1", {
                storage: "none",
                clientId: localStorage.getItem(t)
            }), globalThis.ga((function(e) {
                localStorage.setItem(t, e.get("clientId"))
            })), globalThis.ga("set", "checkProtocolTask", (() => {})), globalThis.ga("require", "displayfeatures")
        },
        _initIframeMessage: function() {
            yw.on("ga.send-event", ((...e) => {
                this.sendEvent(...e)
            }))
        },
        _initChromeMessage: function() {
            $g.on("ga.send-event", ((...e) => {
                this.sendEvent(...e)
            }))
        },
        _sendBgEvents: async function() {
            const e = await Ey.controller.get("ga.bgEvents") || [];
            await Ey.controller.set("ga.bgEvents", []);
            for (const t of e) this._ga(...t)
        },
        sendPageview: function() {
            if (!this._enabled()) return this;
            const e = u.is.background ? "background" : document.location.pathname;
            return this._ga("send", "pageview", e), this
        },
        sendInstall: function() {
            if (!Dg.model.state.installedEventSent) {
                const e = chrome.runtime.getManifest().version,
                    t = "installed:" + (globalThis.electron ? "electron" : "chrome");
                this.sendEvent("user", t, e), Dg.transaction((e => {
                    e.installedEventSent = !0
                }))
            }
            return this
        },
        sendEvent: function(e, t, n, r, o = {
            nonInteraction: 1
        }) {
            if (!e) throw new Error("[$ga] category is required");
            if (!t) throw new Error("[$ga] action is required");
            if (r && !Number.isInteger(r)) throw new Error("[$ga] value must be an integer");
            return this._enabled() ? (this._ga("send", "event", e, t, n || null, r || null, o || null), this) : (console.log("%c[$ga]", "color: #00c579", ...arguments), this)
        },
        _enabled: function() {
            return !u.is.development
        },
        _ga: async function(...e) {
            if (u.is.background) {
                console.warn("GA", e);
                const t = await Ey.controller.get("ga.bgEvents") || [];
                t.push(e), await Ey.controller.set("ga.bgEvents", t)
            } else {
                if (!globalThis.ga) return;
                globalThis.ga(...e)
            }
        }
    };

    function ww(e, t, {
        once: n = !1
    } = {}) {
        globalThis.addEventListener(`__event-bus.${e}`, (e => {
            const n = e.detail || [];
            t(...n)
        }), {
            once: n
        })
    }
    var _w = {
        send: function(e, ...t) {
            const n = new CustomEvent(`__event-bus.${e}`, {
                detail: t
            });
            globalThis.dispatchEvent(n)
        },
        on: ww,
        once: function(e, t) {
            ww(e, t, {
                once: !0
            })
        }
    };
    var Sw = "fb-api.fb-error",
        xw = "fb-api.unknown",
        Pw = {
            isError: function(e, t = null) {
                return e && e[kw] && (!t || e.code === t)
            },
            checkAuth: Iw((async function e(t = !0) {
                let n;
                try {
                    Rg.ignoreCache(), n = await Rg.fetch("https://www.facebook.com/settings?tab=your_facebook_information")
                } catch (n) {
                    return t ? e(!1) : (cy.controller.sendError("fbApi.checkAuth: failed", "error", {
                        details: n
                    }, {
                        actor: "fb-api"
                    }), !1)
                }
                if (n.redirected) return !1;
                return !0
            }), "check-auth"),
            switchToFcs: Iw((async function() {
                await Ew({
                    url: "https://business.facebook.com/api/graphql/",
                    body: {
                        doc_id: "7406802046028852",
                        variables: JSON.stringify({
                            config: {
                                user_saved_tailoring_experience: "DEFAULT"
                            }
                        })
                    }
                })
            }), "switch-to-fcs"),
            fcsDeletePost: Iw((async function(e) {
                await Ew({
                    url: L.createUrl("https://business.facebook.com/media/manager/instagram_media/delete/", {
                        id: e
                    })
                })
            }), "fcs-delete-post"),
            fcsSaveAsDraft: Iw((async function(e, {
                caption: t = null
            } = {}) {
                await Ew({
                    url: L.createUrl("https://business.facebook.com/media/manager/instagram_media/edit/save/", {
                        "edit_data[media_id]": e,
                        "edit_data[save_as_draft]": !0,
                        "edit_data[source_product_name]": "MEDIA_MANAGER",
                        ...t && {
                            "edit_data[caption]": t
                        }
                    })
                })
            }), "fcs-save-as-draft"),
            fcsSaveAsScheduled: Iw((async function(e, t, {
                caption: n = null
            } = {}) {
                await Ew({
                    url: L.createUrl("https://business.facebook.com/media/manager/instagram_media/edit/save/", {
                        "edit_data[media_id]": e,
                        "edit_data[save_as_scheduled]": !0,
                        "edit_data[scheduled_publish_time]": Math.round(t / 1e3),
                        "edit_data[source_product_name]": "MEDIA_MANAGER",
                        ...n && {
                            "edit_data[caption]": n
                        }
                    })
                })
            }), "fcs-save-as-scheduled"),
            fcsSaveAsPublished: Iw((async function(e, {
                caption: t = null
            } = {}) {
                await Ew({
                    url: L.createUrl("https://business.facebook.com/media/manager/instagram_media/edit/save/", {
                        "edit_data[media_id]": e,
                        "edit_data[publish_now]": !0,
                        "edit_data[source_product_name]": "MEDIA_MANAGER",
                        ...t && {
                            "edit_data[caption]": t
                        }
                    })
                })
            }), "fcs-save-as-published")
        };
    const kw = Symbol("isFbApiError");

    function Dw(e = {}) {
        return {
            ...e,
            [kw]: !0
        }
    }
    async function Ew({
        url: e,
        incognito: t = !1,
        body: n = {}
    }) {
        var r;
        Rg.ignoreCache();
        const o = (null === (r = (await Rg.fetchText("https://business.facebook.com/creatorstudio")).match(/"DTSGInitialData"[^"]*"token":"([^"]*)"/)) || void 0 === r ? void 0 : r[1]) || null,
            i = (await Rg.fetchText(e, {
                method: "POST",
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                body: L.createQueryString({
                    __a: 1,
                    locale: "en_US",
                    ...o && {
                        fb_dtsg: o
                    },
                    ...n
                })
            })).replace("for (;;);", "") || "{}",
            a = JSON.parse(L.jsonEscape(i)),
            s = a.payload || {};
        if (Array.isArray(s.error) && s.error.length || L.isObject(s.error) && Object.keys(s.error).length || s.error_code || s.errorCode || s.errorMessage) throw Dw({
            code: Sw,
            payload: s
        });
        return a
    }

    function Iw(e, t) {
        const n = async (...n) => {
            try {
                return await e(...n)
            } catch (e) {
                if (e && e[kw]) throw e.method = t, e;
                throw cy.controller.sendError(`fb-api.${t}`, "error", {
                    details: e
                }, {
                    actor: "fb-api"
                }), Dw({
                    code: xw,
                    method: t,
                    details: e
                })
            }
        };
        return $g.on(`fb-api.${t}`, (async (...e) => {
            let t, r;
            try {
                t = await n(...e)
            } catch (e) {
                r = e
            }
            return {
                result: t,
                error: r
            }
        })), n
    }
    var Tw = {
        api: Pw
    };
    const {
        model: Cw,
        transaction: Fw
    } = Dg;
    var Aw = {
        init: function() {
            $g.on("schedule.connect-to-fcs", Ow), $g.on("schedule.drop-fb-xs-cookie", Uw)
        }
    };
    async function Ow({
        skipFbLogin: e = !1
    } = {}) {
        if (Cw.state.schedule.fcsSetup.connecting) return;
        Fw((e => {
            e.schedule.fcsSetup.screen = "steps", e.schedule.fcsSetup.connecting = !0
        })), Mw(e ? {
            fbLogin: "skipped",
            igProfessional: "loading",
            igConnectedToFbPage: null
        } : {
            fbLogin: "loading",
            igProfessional: null,
            igConnectedToFbPage: null
        });
        if (await Nw()) return;
        if (!e) {
            let e;
            try {
                e = await Tw.api.checkAuth()
            } catch (e) {
                return console.error("[fcs setup] failed to check fb auth", e), Mw({
                    fbLogin: "failed"
                }), void Fw((e => e.schedule.fcsSetup.connecting = !1))
            }
            if (!e) return Mw({
                fbLogin: "nok"
            }), void Fw((e => e.schedule.fcsSetup.connecting = !1))
        }
        Mw({
            fbLogin: e ? "skipped" : "ok",
            igProfessional: "loading"
        }), await L.sleep(1e3), Rg.ignoreCache();
        const t = (await jg.api.fetchViewerInfo()).result;
        if (!t) return Mw({
            igProfessional: "failed"
        }), void Fw((e => e.schedule.fcsSetup.connecting = !1));
        if (!t.isProfessionalAccount) return Mw({
            igProfessional: "nok"
        }), void Fw((e => e.schedule.fcsSetup.connecting = !1));
        Mw({
            igProfessional: "ok",
            igConnectedToFbPage: "loading"
        });
        if (await Nw()) return;
        let n;
        if (n = e ? await $g.send("iframe-bus", "schedule.connect-via-ig") : await $g.send("iframe-bus", "schedule.connect-via-fb"), n.error) return e && Uw(), "not-connected-to-fb-page" === n.error ? Mw({
            igConnectedToFbPage: "nok"
        }) : "auth-window-closed-by-user" === n.error ? (Mw({
            igConnectedToFbPage: "failed"
        }), $y.controller.refreshUser()) : (console.error("[fcs setup]", n.error), Mw({
            igConnectedToFbPage: "failed"
        }, n.error)), void Fw((e => e.schedule.fcsSetup.connecting = !1));
        if (e) {
            const {
                fcsConnected: e
            } = await Rw();
            if (!e) return Uw(), Mw({
                igConnectedToFbPage: "failed"
            }, "failed-to-skip-fb-login"), void Fw((e => e.schedule.fcsSetup.connecting = !1))
        }
        try {
            await $y.controller.refreshUser()
        } catch (e) {
            return console.error("[fcs setup] failed to refresh user", e), Mw({
                igConnectedToFbPage: "failed"
            }, "failed-to-refresh-user"), void Fw((e => e.schedule.fcsSetup.connecting = !1))
        }
        Mw({
            igConnectedToFbPage: "ok"
        }), await L.sleep(1e3), Fw((e => {
            e.schedule.fcsSetup.connecting = !1, e.schedule.fcsSetup.showPanel = !1, e.schedule.loading = !0
        })), $g.send("iframe-bus", "schedule.fcs-refresh-page"), lw.controller.sendEvent("user", "schedule:setup-connection-success")
    }

    function Mw(e = {}, t = null) {
        for (const n in e)
            if ("failed" === e[n]) {
                const e = t ? `${n}_${t}` : n;
                lw.controller.sendEvent("user", "schedule:setup-connection-error", e);
                break
            } Fw((t => {
            Object.assign(t.schedule.fcsSetup.steps, e)
        }))
    }
    async function Rw() {
        return $g.send("iframe-bus", "schedule.fcs-refresh-page"), new Promise((e => {
            $g.on("schedule.fcs-connection-status", (function t({
                fcsConnected: n
            }) {
                $g.off("schedule.fcs-connection-status", t), e({
                    fcsConnected: n
                })
            }))
        }))
    }
    async function Nw() {
        const {
            fcsConnected: e
        } = await Rw();
        return !!e && ($g.send("iframe-bus", "schedule.fcs-refresh-page"), Fw((e => {
            e.schedule.fcsSetup.connecting = !1, e.schedule.fcsSetup.showPanel = !1, e.schedule.loading = !0
        })), !0)
    }
    async function Uw() {
        await L.callAsync(chrome.cookies.remove, {
            url: "https://*.facebook.com/*",
            name: "xs"
        })
    }
    var Bw = {
        init: function() {
            ! function() {
                let e;
                $g.on("schedule.upload-99", (t => {
                    clearTimeout(e), e = setTimeout((() => {
                        cy.controller.sendError("Upload stuck at 99.9%", "error", {
                            debugData: t
                        }, {
                            actor: "schedule"
                        })
                    }), 20 * L.time.SECOND)
                })), $g.on("schedule.upload-100", (() => {
                    clearTimeout(e)
                }))
            }()
        }
    };
    const {
        model: Lw,
        transaction: jw
    } = Dg;
    async function Vw(e = !1) {
        const t = Lw.state,
            n = t.authStatus.username;
        if (!n) return;
        if (!e) {
            if (t.schedule.fcsSetup.checking) return;
            if (t.schedule.fcsSetup.connected) return
        }
        Rg.ignoreCache();
        const r = await jg.api.fetchUserPosts(n, 50);
        if (t.authStatus.username !== n) return;
        const o = (r.result || []).map((e => {
            const t = {
                photo: "photo",
                video: "video",
                carousel: "carousel"
            } [e.type];
            return t ? function(e) {
                const t = (t, n) => (t in e || console.error(`error in post object generation: no ${t} provided`), e[t] || n);
                return {
                    id: t("id"),
                    source: t("source"),
                    type: t("type"),
                    isIgtv: e.isIgtv || !1,
                    status: t("status"),
                    image: t("image", null),
                    preview: t("preview", null),
                    imageAvgColor: t("imageAvgColor", null),
                    on: t("on", null),
                    createdOn: t("createdOn", null),
                    stats: t("stats", null),
                    crosspostToFb: t("crosspostToFb", !1),
                    saveStatus: t("saveStatus", null),
                    draftOrder: t("draftOrder", null),
                    caption: t("caption", "")
                }
            }({
                id: e.id,
                source: "ig",
                type: t,
                status: "posted",
                image: e.imgMedium || e.img || e.imgx,
                preview: e.imgMedium || e.img || e.imgx,
                imageAvgColor: null,
                on: e.on,
                createdOn: e.on,
                stats: {
                    likes: e.stats.likes,
                    comments: e.stats.comments
                },
                crosspostToFb: null,
                saveStatus: null,
                draftOrder: null,
                caption: ""
            }) : null
        })).filter(Boolean);
        jw((e => {
            e.schedule.loading = !1, e.schedule.lastIgPostsUpdateOn = Date.now(), e.schedule.posts = e.schedule.posts.filter((e => "local" === e.source)).concat(o)
        }))
    }
    var Hw = {
            controller: {
                init: function() {
                    Aw.init(), Bw.init(), async function() {
                        $g.on("popup.start", (async () => {
                            const e = [Lw.state, ...Object.values(Lw.state.userStates)],
                                t = e.map((e => e.schedule.posts)).flat().filter((e => "fcs" === e.source)).map((e => e.id.toString())),
                                n = e.map((e => e.schedule.posts)).flat().filter((e => "local" === e.source)).map((e => e.id.toString())),
                                r = await Ey.controller.getAllKeys();
                            for (const e of r)
                                if (e.startsWith("schedule.fcs-post-preview:")) {
                                    const n = e.split(":")[1];
                                    if (t.includes(n)) continue;
                                    await L.safe((() => Ey.controller.delete(e)))
                                } else if (e.startsWith("schedule.local-post:")) {
                                const t = e.split(":")[1];
                                if (n.includes(t)) continue;
                                await L.safe((() => Ey.controller.delete(e)))
                            }
                        }))
                    }(), $g.on("schedule.update-ig-posts", Vw), _w.on("schedule.update-ig-posts", Vw)
                },
                getReport: async function() {
                    return await $g.send("iframe-bus", "schedule.fcs-get-report")
                }
            },
            getDefaultDateDialogState: function(e) {
                const t = e.schedule.timeSlots;
                return {
                    isOpen: !1,
                    selectedOption: "publish-now",
                    periodStart: null,
                    selectedDay: null,
                    selectedSlotTime: t.length > 0 ? t[0].time : null,
                    customTime: null,
                    timezone: null,
                    isTimeError: !1
                }
            }
        },
        qw = {
            shown: !1,
            loading: !0,
            videoUrl: null,
            coverUrl: null,
            selectedTabId: "auto",
            showGrid: !1,
            gridImages: [],
            frameGalleryImages: [],
            frameGallerySelectedImage: null,
            frameSelectImage: null,
            frameSelectValue: .5,
            frameUploadImage: null
        };

    function zw(e) {
        const t = Sy.getTemplateUserState();
        Dg.transaction((n => {
            var r;
            n.cleanupId = e, n.dm.badgeText = "", n.dm.ghostModeFailed = !1, n.reels.creating = !1, n.igView.creationCardShown = !1, n.igView.fullscreenWidth = 460, n.billing.purchasingPlan = null, n.tagAssist.shown = !1, n.tagAssist.query = "", n.tagAssist.searching = !1, n.tagAssist.errorCode = null, n.tagAssist.selectedTabId = "search", n.tagAssist.selectedGroupId = "medium", n.tagAssist.igSelectedTags = [], n.tagAssist.fcsSelectedTags = [], n.tagAssist.sidebarSelectedTags = [], n.tagAssist.sidebarSelectedTagsAsText = "", n.tagAssist.ladderEngagementSort = null, n.tagAssist.summaryEngagementSort = "descending", n.tagAssist.ladderPostCountSort = null, n.tagAssist.summaryPostCountSort = null, n.tagAssist.ladder = null, n.tagAssist.ladderLoadingTags = [], n.tagAssist.newCollection.name = "", n.tagAssist.newCollection.text = "", n.tagAssist.newCollection.showForm = !1, n.tagAssist.collectionsLoadingTags = [];
            for (const e of n.tagAssist.collections) e.editing = !1, e.editName = "", e.editText = "";
            const o = n.tagAssist.accountStats[n.authStatus.userId] || null,
                i = (null == o ? void 0 : o.mostUsedTags) || [];
            i.length > 0 && (n.tagAssist.searching = !0, n.tagAssist.query = i.slice(0, 2).map((e => `#${e}`)).join(" ")), Object.assign(n.coverAssist, qw), n.musicAssist.shown = !1, n.storyAssist.shown = !1, n.storyAssist.isVideo = !1, n.storyAssist.coverUrl = null, n.storyAssist.showUpsellOverlay = !1, n.storyAssist.mentions.query = "", n.storyAssist.mentions.foundUsers = [], n.storyAssist.mentions.selectedUsers = [], n.later.showBodyPanel = !1, n.later.showAssistPanel = !1, n.later.selectedUserId = n.authStatus.userId, n.later.selectedPostId = null, n.later.selectedPillId = null, n.later.selectedIgDate = null, n.later.errors = [], n.later.processing = !1, n.ghostStoryView.showUpsellOverlay = !1, n.schedule.loading = !0, n.schedule.fcsError = null, n.schedule.fcsFailed = !1, n.schedule.isErrorShown = !1, n.schedule.isUpsellShown = !1, n.schedule.isDraggingPost = !1, n.schedule.showTagAssist = !1, n.schedule.addingFiles = !1, n.schedule.fileUploadErrors = [], n.schedule.posts = n.schedule.posts.filter((e => "saving" !== e.saveStatus)).filter((e => "deleting" !== e.saveStatus)), n.schedule.fallback.isFailedToReconnect = !1, n.schedule.fallback.isRetryingFbConnection = !1, n.schedule.fallback.hideSwitchToFallbackButton = !1, n.schedule.navigation.isOpen = !1, n.schedule.navigation.selectedTabId = null, n.schedule.navigation.withBackToCalendarButton = !1, n.schedule.fcsSetup.screen = "welcome", n.schedule.fcsSetup.checking = !0, n.schedule.fcsSetup.connected = !1, n.schedule.fcsSetup.connecting = !1, n.schedule.fcsSetup.showPanel = !1, n.schedule.fcsSetup.errorCode = null, n.schedule.fcsSetup.failed = !1, n.schedule.fcsSetup.steps.fbLogin = null, n.schedule.fcsSetup.steps.igProfessional = null, n.schedule.fcsSetup.steps.igConnectedToFbPage = null, n.schedule.calendar.periodStart = null, n.schedule.dateDialog = Hw.getDefaultDateDialogState(n), n.schedule.addCard = t.schedule.addCard, n.bulk = t.bulk;
            const a = Date.now() + L.time.DAY,
                s = (null === (r = n.schedule.timeSlots[0]) || void 0 === r ? void 0 : r.time) || null;
            n.bulk.dateDialog.week.selectedSlotTime = s, n.bulk.dateDialog.calendar.periodStart = a, n.bulk.dateDialog.calendar.selectedDay = a, n.bulk.dateDialog.calendar.selectedSlotTime = s, n.bulk.dateDialog.startingDay.periodStart = a, n.bulk.dateDialog.startingDay.selectedDay = a
        }))
    }
    xy.controller = {
        init: function() {
            $g.on("cleanup.clean-up-state", (() => {
                const e = Date.now();
                return zw(e), e
            }))
        },
        cleanUpState: zw
    };
    var Gw = {
            getConfig: () => {
                const e = o.get("fusion.config");
                return e && e.version >= Gw.config.version ? e : Gw.config
            }
        },
        $w = {
            reset: function() {
                Ww(), $g.send("reset.reset")
            },
            onReset: function(e) {
                Ww(e), $g.on("reset.reset", e)
            }
        };
    const Ww = R();
    var Yw = {
        controller: $w
    };
    let Jw, Qw;

    function Kw() {
        L.ls.remove("fusion.last-check-on")
    }
    async function Xw() {
        const e = 15 * L.time.MINUTE,
            t = Number(L.ls.get("fusion.last-check-on"));
        if (t && Date.now() < t + e) return;
        L.ls.set("fusion.last-check-on", Date.now());
        const n = Gw.getConfig(),
            r = `${u.options.apiUrl}/fusion?version=${n.version}`;
        Rg.ignoreCache();
        const o = (await Rg.fetchText(r, {
                credentials: "omit"
            })).replace(/&amp;/g, "&").replace(/&#34;/g, '\\"').replace(/&#39/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
            i = JSON.parse(o);
        if (!i.config) return;
        const a = JSON.parse(JSON.stringify(n));
        Qw = e_(a, i.config);
        chrome.extension.getViews({
            type: "tab"
        }).length > 0 ? $g.send("fusion.new-version-available") : Zw()
    }

    function Zw() {
        Qw && (L.ls.set("fusion.config", Qw), location.reload())
    }

    function e_(e, t) {
        for (const n in t) L.isObject(e[n]) && L.isObject(t[n]) ? e_(e[n], t[n]) : e[n] = t[n];
        return e
    }
    Gw.controller = {
        init: function() {
            $g.on("fusion.check-new-version", Xw), $g.on("fusion.popup-tab-id", (e => {
                Jw = e
            })), Yw.controller.onReset(Kw), chrome.tabs.onRemoved.addListener((e => {
                e === Jw && Qw && Zw()
            })), $g.on("fusion.update-now-click", (() => {
                L.ls.set("fusion.reload-popup-on-background-start", !0), Zw()
            })), L.ls.get("fusion.reload-popup-on-background-start") && (L.ls.remove("fusion.reload-popup-on-background-start"), $g.send("fusion.reload-popup")), chrome.alarms.onAlarm.addListener((async e => {
                "fusion.refresh-config" === e.name && Xw()
            })), chrome.alarms.create("fusion.refresh-config", {
                when: Date.now(),
                periodInMinutes: 1440
            })
        }
    }, Gw.config = {
        version: 128,
        dmSelectors: {
            general: {
                reactRoot: ["#react-root", '[id^="mount"]'],
                page: [".t30g8", ".PolarisDirectShell._a9-0", "section.PolarisBaseShell > ._a9-0", "section.PolarisBaseShell > ._aa5f"],
                header: ["._lz6s", ".PolarisDesktopNav._acum"],
                main: [".x14k21rp"],
                iconButton: [".wpO6b", "._abl-"],
                blueButton: [".y3zKF:not(.yWX7d)", ".PolarisIGCoreButton:not(._acao)"],
                postActionsTooltip: [".eeDIk", "._a3gq ._acqw"],
                postActionsTooltipMe: [".AeyYE", "._a3gq ._acqx"],
                postActionsTooltipPeer: [".DgKgc", "._a3gq ._acqy"],
                postActionsTooltipTail: ["._18Jen", "._a3gq ._abwl"],
                errorReportPixel: 'body > img[src*="Error"]',
                mediaViewerContainer: ['.RnEpo [role="dialog"] [style*="max-width"][style*="max-height"] > div', '.BaseDialog [role="dialog"] [style*="max-width"][style*="max-height"] > div'],
                mediaViewerImage: ['.RnEpo [role="dialog"] [style*="max-width"][style*="max-height"] img', '.BaseDialog [role="dialog"] [style*="max-width"][style*="max-height"] img'],
                mediaViewerVideo: ['.RnEpo [role="dialog"] [style*="max-width"][style*="max-height"] video', '.BaseDialog [role="dialog"] [style*="max-width"][style*="max-height"] video'],
                writeBar: [".HcJZg .X3a-9", ".PolarisDirectComposer._acrb"],
                addMediaButton: [".X3a-9 div + .wpO6b", ".PolarisDirectComposer > button:nth-of-type(1)"],
                textarea: [".X3a-9 textarea", ".PolarisDirectComposer textarea"],
                messageBody: [".hjZTB", ".PolarisIGCoreText._aadf"],
                emojiPicker: ["._01UL2", ".PolarisIGCorePopover._aa61"],
                postPreview: [".z82Jr", ".PolarisDirectMessageMediaShare._acfr"],
                postViewerModal: ["._Yhr4"],
                portal: ".BasePortal",
                threadHeader: [".PolarisDirectThreadViewHeader > .PolarisGenericDesktopHeader"],
                threadDetailsHeader: [".PolarisDirectThreadView > .PolarisGenericDesktopHeader"],
                threadDetailsMuteSection: [".PolarisDirectThreadDetailsView > div:first-child"],
                content: ["section.PolarisRefreshedBaseShell"],
                navigation: [".createKeyCommandWrapper > .PolarisNavigation"],
                accountSwitcher: [".PolarisGenericDesktopHeader._aa4o"]
            },
            leftPanel: {
                header: [".oNO81 .S-mcP", ".PolarisDesktopDirectPage._aa5c .PolarisGenericDesktopHeader._aa4j"],
                subheaderWhenNoFolders: [".oNO81 .iHqQ7", ".PolarisDesktopDirectPage._aa5c ._abbz"],
                switchAccountButton: [".oNO81 .S-mcP .m7ETg button", ".PolarisDesktopDirectPage._aa5c .PolarisIGCoreBox > button"],
                newMessageButton: [".oNO81 .S-mcP .EQ1Mr button", ".PolarisDesktopDirectPage._aa5c button._abm2"],
                tabsContainer: [".emXTk > div:first-child", ".PolarisDesktopDirectPage > div.PolarisDirectInboxTabbedHeader > div:first-child"],
                folderTab: [".k8Vux", "nav.PolarisDirectInboxTabbedHeader > div"],
                folderTabGeneral: [".k8Vux:nth-child(2)", "nav.PolarisDirectInboxTabbedHeader > div:nth-child(2)"],
                folderTabsContainer: ['.emXTk [style*="60%"]', '.PolarisDirectInboxTabbedHeader [style*="60%"]'],
                requestsDescription: [".tHaIX", ".PolarisDirectPendingRequests > div:first-child"],
                requestsTab: [".jCRms", '.PolarisDirectInboxTabbedHeader [style*="40%"] > span'],
                requestsTabText: ["h5.gtFbE", ".PolarisDirectInboxTabbedHeader h5"],
                requestsTabContainer: ['.emXTk [style*="40%"]', '.PolarisDirectInboxTabbedHeader [style*="40%"]'],
                conversationItemWrapSkeleton: ['.PolarisDirectInboxList > div > div[data-visualcompletion="loading-state"]'],
                conversationItem: [".-qQT3", ".rOtsg", ".PolarisDirectInboxList > div > .PolarisIGCoreBox._ab99 > *:first-child"],
                conversationUnreadDot: [".Sapc9", '._ab8n[style*="height: 8px"]'],
                threadListWrap: [".N9abW", ".PolarisIGVirtualList.PolarisDirectInboxList"],
                threadList: [".N9abW > div", ".PolarisIGVirtualList.PolarisDirectInboxList > div"],
                threadListSpinner: [".N9abW .HVWg4", ".PolarisIGVirtualList.PolarisDirectInboxList > div > ._ab9h"]
            },
            dialog: {
                root: [".RnEpo", '.BasePortal[style]:not([style*="display: none"]) .createKeyCommandWrapper > .BaseDialog'],
                background: ".BaseCometModal > .BaseCometModal",
                window: ['.RnEpo [role="dialog"]', '.createKeyCommandWrapper > .BaseDialog .IGDSDialog[role="dialog"]'],
                header: [".CpMFL .S-mcP", ".PolarisDirectThreadViewHeader > .PolarisGenericDesktopHeader"],
                searchRow: ['.RnEpo [role="dialog"] .TGYkm', ".PolarisDirectSearchUserContainer._aag-"],
                searchRowLabel: ['.RnEpo [role="dialog"] .TGYkm .BI4qX', ".PolarisDirectSearchUserContainerTokenField > .PolarisIGCoreBox"],
                submitButton: [".RnEpo button.cB_4K", ".PolarisIGCoreModalHeader .PolarisIGCoreButton"],
                mediaViewerCloseButton: [".RnEpo ._5AwC2", ".IGDSDialog .ped7jm3c"]
            }
        },
        igSelectors: {
            general: {
                reactRoot: ["#react-root", '[id^="mount"]'],
                root: ["#react-root > section", "#react-root > div > div > section", "section.PolarisBaseShell", "section.PolarisRefreshedBaseShell"],
                rootNewNavDesign: ["section.PolarisRefreshedBaseShell"],
                content: ["#react-root > section > *:nth-child(2)", "main.PolarisShellContent", "main.PolarisRefreshedShellContent"],
                contentSection: ["main.PolarisShellContent > section", "main.PolarisRefreshedShellContent > section"],
                header: ["._9ezyW", "header.PolarisGenericMobileHeader"],
                headerContent: [".b5itu", "header.PolarisGenericMobileHeader ._ab16"],
                headerTitle: [".K3Sf1", "h1.PolarisGenericMobileHeader"],
                footer: [".PolarisShellFooter"],
                main: [".uzKWK", ".PolarisBaseShell main.PolarisShellContent._a996", ".PolarisRefreshedBaseShell main"],
                pageLayoutNewNavDesign: [".PolarisPageLayoutHandler"],
                nextPageLoaderProfile: ["._4emnV", ".PolarisVirtualPostsGrid._aanh"],
                nextPageLoaderExplore: ['html[data-page="exploreLandingPage"] .Id0Rh', 'html[data-page="exploreLandingPage"] .PolarisGenericVirtualFeed._aalg'],
                nextPageLoaderFeed: ['html[data-page="feedPage"] .Id0Rh', 'html[data-page="feedPage"] .PolarisGenericVirtualFeed._aalg'],
                creationPopup: [".PolarisMobileCreationNavItem ._aa5x", ".PolarisMobileCreationNavItem ._ad8j", ".PolarisMobileCreationNavItem ._aa5-", ".IGDSPopover:has(.PolarisMobileCreationMenuContent)", ".PolarisMobileCreationMenuContent"],
                creationPopupPostButton: ['.PolarisMobileCreationNavItem ._aa5x [role="button"]:first-child', '.PolarisMobileCreationNavItem ._ad8j [role="button"]:first-child', '.PolarisMobileCreationNavItem ._aa5- [role="button"]:first-child', '.PolarisMobileCreationMenuContent [role="button"]:first-child'],
                creationPopupStoryButton: ['.PolarisMobileCreationNavItem ._aa5x [role="button"]:last-child', '.PolarisMobileCreationNavItem ._ad8j [role="button"]:last-child', '.PolarisMobileCreationNavItem ._aa5- [role="button"]:last-child', '.PolarisMobileCreationMenuContent [role="button"]:last-child'],
                tabBar: [".KGiwt", ".PolarisNavigation > ._abpb", '.PolarisNavigation[style*="transform"]', ".xaeubzz"],
                tabBarWrap: [".ZoygQ", ".IGDSBox > .PolarisNavigation", ".createKeyCommandWrapper > .PolarisNavigation"],
                tabBarContainer: [".IGDSBox > .PolarisNavigation > div", ".createKeyCommandWrapper .PolarisNavigation > div[class]"],
                tabBarTopContainer: [".IGDSBox:has(> .createKeyCommandWrapper)"],
                tabBarInput: [".ZoygQ input", ".PolarisNavigation input.PolarisImageFileForm"],
                tabBarCreatePostInput: [".PolarisMobileCreationNavItem > form:last-child > input"],
                tabBarButton: ['.PolarisNavigation[style*="transform"] > div', ".xaeubzz > div"],
                tabBarCreatePostButton: ["._0TPg", ".BvyAW > div:nth-child(3)", '[data-testid="new-post-button"]', ".PolarisMobileNavLoggedIn._abp8", ".PolarisMobileNavLoggedIn > div:nth-child(3)", '.PolarisNavigation[style*="transform"] > div:nth-child(3)', ".xaeubzz > div:nth-child(3)"],
                tabBarCreatePostButtonLink: ['[data-testid="new-post-button"] a', ".PolarisMobileNavLoggedIn._abp8 a", ".PolarisMobileNavLoggedIn > div:nth-child(3) a", '.PolarisNavigation[style*="transform"] > div:nth-child(3) a', ".xaeubzz > div:nth-child(3) a"],
                tabBarCreatePostIconOldNavDesign: [".PolarisMobileNavLoggedIn > svg"],
                tabBarAvatarContainer: [".PolarisMobileNavLoggedInButton span.PolarisUserAvatar"],
                storyTrayViewerAvatarContainer: [".PolarisStoryTray .PolarisStoryTray._aauk:first-child span.PolarisUserAvatar"],
                tabBarLink: [".PolarisMobileNavLoggedIn a", '.PolarisNavigation[style*="transform"] a', ".createKeyCommandWrapper .PolarisNavigationItem a"],
                storyFooter: [".mLi3m", "footer.PolarisMobileStoriesFooter", "footer.PolarisMobileOwnerStoriesOverlay"],
                storyQuickReactionsBackground: ".x4U7z",
                storyPreviewContainer: [".zGtbP", ".PolarisShellContent ._aac4", ".PolarisRefreshedShellContent ._aac4"],
                settingsRectangle: ".BvMHM",
                recommendationsContainer: [".bq3Mi", ".tHaIX", ".PolarisSuggestedUserFeedUnit"],
                modal: [".RnEpo", '.PolarisIGCoreModalBackdrop[role="presentation"]'],
                modalWindow: ['.RnEpo [role="dialog"]', '.PolarisIGCoreModalBackdrop[role="presentation"] [role="dialog"]'],
                modalWindowHashtagContent: ['.RnEpo [role="dialog"] ._8zyFd'],
                bottomNotification: ".Z2m7o",
                createStoryHeaderButton: [".mTGkH", ".PLytv", "button.PolarisFeedPageMobileHeader"],
                peersPage: '[data-page="followList"]',
                peersPageHeader: ['[data-page="followList"] .b5itu', '[data-page="followList"] .PolarisGenericMobileHeader > ._ab16'],
                peersModalHeader: ".HYpXt .eiUFA",
                storiesBar: [".qf6s4", ".PolarisIGVirtualList.PolarisStoryTray"],
                storiesBarLoadingPanel: [".PolarisFeedLoadingSpinner._ab6o", ".PolarisFeedPage ._ab6o"],
                blueLinkButton: ".UP43G",
                actionSheet: [".xkuux", ".PolarisIGCoreModalBackdrop > ._ac7o"],
                useAppGradientBar: [".xZ2Xk", ".PolarisMobileNav + section._aa9n"],
                actionDialog: [".mt3GC", ".IGCoreDialog._a9-z"],
                actionDialogItem: [".mt3GC .aOOlW", ".IGCoreDialog._a9--"],
                actionDialogWithoutHeader: [".mt3GC:first-child", ".IGCoreDialog._a9-z:first-child"],
                iconButton: [".wpO6b", "._abl-"],
                planeIcon: '[points*="11.698 20.334 22 3.001"]',
                post: "article[data-post-id]",
                postThreeDotsButton: [".MEAGs button", ".PolarisPostOptionsButtonPicker button"],
                postVideoContainer: ["._5wCQW", ".PolarisDeclarativeVideo._ab1c"],
                publishingBarText: [".o5gub span", ".PolarisUploadProgressBar._aaug"],
                uploadPanel: [".TExId", ".PolarisUploadProgressBar._aauh"],
                uploadPanelText: [".PolarisUploadProgressBar._aaug"],
                uploadPanelVideoIcon: ".TExId .cRc_w",
                expandVideoButton: "._7zNgw",
                continueWatchingOverlay: ".oNYBg",
                cookieModalContent: ".RnEpo ._74vy-",
                carouselNavButton: ".PolarisSidecar .PolarisHSnapScroll > button",
                blueButton: "button._acas:not(._acao)",
                toastMessage: [".PolarisToastWrapper._a999"],
                postCaption: [".PolarisPostPreviewCommentsPicker ._ab9o > span:last-child > span:first-child"],
                postCaptionLink: [".PolarisPostPreviewCommentsPicker ._ab9o > span:last-child > span:first-child a"],
                exceptionDialogOkButton: ['.CometExceptionDialog .PressableText[role="button"]'],
                errorPageContent: ["._a3gq ._ab8q"],
                dialogRoot: [".BasePortal > .BaseView"],
                postPhotoOverlay: [".PolarisPhoto._aagw"],
                tryMbsSection: [".PolarisQPBloksRenderer._a9_9"],
                splashScreen: ["body > #splash-screen"]
            },
            dragPanel: {
                root: [".RnEpo.xpORG._9Mt7n", ".PolarisIGCoreModalBackdrop > ._ac7o"],
                handle: [".BHY8D", ".PolarisIGCoreSheet._ac7m"],
                igIcon: ".glyphsSpriteApp_Icon_36.u-__7",
                sendEmailLink: ['.-qQT3[href^="mailto:"]', '._abm4[href^="mailto:"]', '._abm4 [href^="mailto:"]', 'a.Pressable[target="_top"][href^="mailto:"]'],
                shareMenuItem: [".RnEpo.xpORG._9Mt7n .-qQT3", ".PolarisIGCoreModalBackdrop > ._ac7o ._abm4", ".PolarisIGCoreModalBackdrop a.Pressable"]
            },
            authScreen: {
                loginContainer: ".rxwpz",
                loginContainerParagraph: ".rxwpz p",
                loginFormParagraph: ".HmktE p",
                avatar: ".rxwpz img",
                username: ['html[data-page="unifiedHome"] .l9hKg', 'html[data-page="loginPage"] .l9hKg'],
                footer: ['html[data-page="unifiedHome"] footer', 'html[data-page="loginPage"] footer'],
                fromFacebookBar: ['html[data-page="unifiedHome"] .O1flK', 'html[data-page="loginPage"] .O1flK']
            },
            storyViewer: {
                root: [".PolarisMobileOwnerStories.PolarisStoriesReel", ".PolarisMobileStoriesPage > .PolarisMobileStories", "section.PolarisBaseShell > .PolarisMobileStories"],
                videoPlayer: ['.PolarisStoryVideoPlayerWrapper > div[style*="top: 0"]'],
                avatar: [".PolarisMobileOwnerStories img.PolarisUserAvatar", ".PolarisMobileOwnerStoriesOverlay img.PolarisUserAvatar"],
                time: ["time.PwV9z", "time.PolarisStoriesHeaderOwner"],
                pollContainer: ".tj63N",
                pollButtons: ".tj63N",
                pollAnswerDigitOrEmoji: ".KUQv0",
                closeButton: [".kj03O .afkep", ".PolarisMobileOwnerStoriesOverlay button:last-child"],
                prevButton: [".r2nYK", ".PolarisMobileStoryEventZone > button:nth-child(2)"],
                nextButton: ["._4sLyX", ".PolarisMobileStoryEventZone > button:nth-child(3)"],
                videoPoster: "img.PolarisStoryVideo",
                mediaContainer: ".PolarisStoryMediaLayout._aa64",
                image: ".PolarisStoryImage img.PolarisStoryImage",
                video: ["video.PolarisStoryVideo", ".PolarisMobileStoryViewer video"],
                viewAsAvatar: [".PolarisStoryMediaLayout img.PolarisUserAvatar"]
            },
            storyCreation: {
                root: ["._650Zr", ".PolarisStoryCreationPage", 'body[data-page="StoryCreationPage"] section.PolarisBaseShell'],
                canvas: [".PolarisStoryCreationPage canvas", 'body[data-page="StoryCreationPage"] canvas'],
                headerButton: [".PolarisStoryCreationPage header button", 'body[data-page="StoryCreationPage"] header button'],
                textInput: ["[contenteditable]", ".PolarisStoryCreationTextInput[contenteditable]"],
                topRightButtonsContainer: [".o4NXM", ".PolarisStoryCreationPage header > div.PolarisStoryImageCreationContainer", 'body[data-page="StoryCreationPage"] header > div.PolarisStoryImageCreationContainer'],
                topRightButton: [".o4NXM button", ".PolarisStoryCreationPage header > div button", 'body[data-page="StoryCreationPage"] header > div button'],
                downloadButton: ['[class*="storiesSpriteDownload"]', ".PolarisStoryCreationPage header > div button:nth-child(1)", 'body[data-page="StoryCreationPage"] header > div button:nth-child(1)'],
                mentionBarContainer: [".uPlSl", ".PolarisTypeahead.PolarisStoryCreationTextInput"],
                mentionBar: [".imGmP", ".PolarisTypeahead.PolarisStoryCreationTextInput > div"],
                mentionReel: [".imGmP > div", ".PolarisTypeahead.PolarisStoryCreationTextInput > div > div"],
                mentionReelRow: [".imGmP > div > div", ".PolarisTypeahead.PolarisStoryCreationTextInput > div > div > div"],
                mentionReelItem: ["#touch_mention.qOsKV", "#touch_mention.PolarisStoryTypeaheadResultsList._acn7"],
                mentionReelItemName: ["#touch_mention.qOsKV .KMpYj", "#touch_mention.PolarisStoryTypeaheadResultsList ._acn9"],
                mentionReelItemAvatar: ["#touch_mention.PolarisStoryTypeaheadResultsList img.PolarisStoryTypeaheadResultsList"],
                videoHeader: ["._9o3e0", "header.PolarisStoryVideoCreationContainer"],
                photoControls: [".PolarisStoryImageCreationContainer._aa3f", "header.PolarisStoryImageCreationContainer > div:last-child"],
                videoWrap: ["header.PolarisStoryVideoCreationContainer + .PolarisStoryVideoCreationContainer"],
                video: [".JHXak", "video.PolarisStoryVideoCreationContainer"],
                videoPoster: [".pSeby", "video.PolarisStoryVideoCreationContainer + img"],
                footer: [".GRPvx ~ footer", "footer.PolarisStoryCreationShareFooter"],
                videoPlayButton: [".JHXak ~ .videoSpritePlayButton", "div.PolarisStoryVideoCreationContainer > span"],
                videoCreationExitButton: ["header.PolarisStoryVideoCreationContainer > button.PolarisIGCoreIconButton"],
                submitButton: [".PolarisStoryCreationShareFooter > button"],
                submitButtonText: [".PolarisStoryCreationShareFooter > button .PolarisStoryCreationShareFooter"],
                uploadHeader: [".PolarisStoryCreationPage .PolarisSharingProgressModal header", 'body[data-page="StoryCreationPage"] .PolarisSharingProgressModal header'],
                uploadBar: [".PolarisStoryCreationPage .PolarisSharingProgressModal header > div", 'body[data-page="StoryCreationPage"] .PolarisSharingProgressModal header > div'],
                uploadText: [".PolarisStoryCreationPage .PolarisSharingProgressModal header h1", 'body[data-page="StoryCreationPage"] .PolarisSharingProgressModal header h1'],
                textColorPicker: [".PolarisStoryCreationColorPicker.PolarisStoryCreationTextInput"],
                drawColorPicker: [".PolarisStoryCreationDrawColorPicker.PolarisStoryCreationDrawing"],
                colorPickerSelectedCircle: ["button.PolarisStoryCreationColorPicker > ._aa87", "button.PolarisStoryCreationDrawColorPicker > ._aa82"]
            },
            explorePage: {
                nav: ['html[data-page="exploreLandingPage"] nav.PolarisShellMobileHeader'],
                header: "header.PolarisExploreMobileHeader",
                searchInputPlaceholder: [".PolarisDynamicExplorePageContentWrapper input.PolarisIGCoreSearchInput::placeholder"],
                searchContainer: [".PolarisDynamicExplorePageContentWrapper > .PolarisIGCoreBox"],
                search: [".PolarisDynamicExplorePageContentWrapper > .PolarisIGCoreBox > .PolarisIGCoreBox:first-child"],
                main: ["main > .PolarisDynamicExplorePageContentWrapper"],
                content: [".mJ2Qv", ".PolarisDynamicExplorePageSharedContent", ".PolarisDynamicExplorePageContentWrapper"],
                contentInner: [".K6yM_", ".PolarisDynamicExplorePageSharedContent > *", ".PolarisDynamicExplorePageContentWrapper > *"],
                post: [".pKKVh", ".PolarisDynamicExploreSectionalItem"],
                searchResults: [".gJlPN", ".PolarisDynamicExplorePageSharedContent > .PolarisSearchResultsList", ".PolarisDynamicExplorePageContentWrapper > .PolarisSearchResultsList"]
            },
            profilePage: {
                content: [".v9tJq", "main.PolarisShellContent > .PolarisProfilePage", "main.PolarisRefreshedShellContent > .PolarisProfilePage"],
                header: [".zw3Ow", ".PolarisProfilePage header"],
                username: [".KV-D4", "section.PolarisProfilePageHeader h2.PolarisIGCoreText"],
                avatarWithStoryWrap: [".RR-M-.h5uC0", ".PolarisProfilePageHeader div.PolarisUserAvatarWithStories"],
                avatarStoryRing: ['html[data-page="profilePage"] .RR-M-.h5uC0 canvas', ".PolarisProfilePageHeader canvas.PolarisStoryRing"],
                followButton: [".nZSzR .y3zKF.sqdOP", ".XBGH5 ._4EzTm .soMvl:last-child", '[data-page="profilePage"] .PolarisFollowButton button'],
                toggleSuggestionsButton: [".PolarisFollowButton > .PolarisDropdownButton:last-child"],
                writeButton: [".JI_ht.vwCYk", 'html[data-page="profilePage"] .i0EQd', ".PolarisProfilePageHeader ._ab9s"],
                subscribeButtonWrap: [".vBF20"],
                blueButtonsWrap: [".nZSzR .vwCYk"],
                buttonsRow: [".Y2E37 > div:first-child"],
                settingsMenuWrap: ["._7XkEo", ".PolarisNavigationalHeader + ._ac8b"],
                settingsMenu: ["._7XkEo > div", ".PolarisNavigationalHeader + ._ac8b > div"],
                postRow: [".v9tJq .weEfm", ".PolarisProfileMediaBrowser .PolarisIGVirtualGrid", ".PolarisProfileTabChannel .PolarisIGVirtualGrid"],
                postContainer: [".v9tJq ._bz0w", ".PolarisProfileMediaBrowser .PolarisPostsGridItem", ".PolarisProfileTabChannel .PolarisVirtualPostsGrid"],
                post: ['.v9tJq ._bz0w a[href^="/p/"]', '.PolarisProfileMediaBrowser .PolarisPostsGridItem > a[href^="/p/"]'],
                reelRow: [".v9tJq .gmGWn", ".v9tJq .Nnq7C", ".PolarisProfilePage .PolarisIGVirtualList .PolarisIGVirtualGrid._abq4"],
                reelContainer: [".v9tJq .k1v61", ".v9tJq .b9_1r", ".PolarisProfilePage .PolarisClipsGrid", "div:has(> .PolarisClipsGridItem)"],
                reelPreviewStats: [".v9tJq .b9_1r .qn-0x", ".PolarisPostsGridItemOverlay._ac2d"],
                reelIcon: ['.PolarisPostsGridItemMediaIndicator path[d*="m12.823 1 2.974"]'],
                moreButton: [".VMs3J", "section.PolarisProfilePageHeader > .PolarisProfilePageHeader > div.PolarisProfilePageHeader"],
                tab: ["._9VEo1", ".PolarisProfilePage .PolarisTabbedContent > .PressableText"],
                activeTab: ['.PolarisProfilePage .PolarisTabbedContent > .PressableText[aria-selected="true"]'],
                openMbsButton: ['div:has(> a[href*="https://business.facebook.com/business/loginpage/"])', 'div:has(> a[href*="instagram.com/?u=https%3A%2F%2Fbusiness.facebook.com"])'],
                postVideoIcon: [".CzVzU svg"],
                postVideoOverlay: [".qn-0x"],
                followersFollowingsLink: ".Y8-fY a"
            },
            profilePageFeedTab: {
                postFooter: ["article.PolarisPost ._ae3w"],
                addCommentSection: ["article.PolarisPost ._ae3w section.PolarisPostCommentInput"],
                addCommentTypeahead: ["article.PolarisPost ._ae3w .PolarisTypeahead"]
            },
            postPage: {
                postHeader: [".PolarisPostPage ._aasi", ".PolarisPostPage article > div > div:first-child"],
                postFooter: [".PolarisPostPage ._aast", ".PolarisPostPage article > div > div:last-child > div"]
            },
            commentsPage: {
                body: 'html[data-page="mobileAllCommentsPage"] .CometMainContentWrapper',
                footer: 'html[data-page="mobileAllCommentsPage"] nav.PolarisNavWrapper',
                scrollContainer: [".XQXOT", ".PolarisThreadedComments > ul"],
                showMoreButton: ["li > div > .wpO6b", ".PolarisThreadedComments > ul > li:last-child"],
                lastListItem: ".PolarisThreadedComments > ul > *:last-child",
                comment: [".C4VMK", ".PolarisPostComment._a9zr"]
            },
            feedPage: {
                body: [".Wamc7", "section > ._aam1"],
                postsContainer: [".IGDSBox > .PolarisFeedPage"],
                followSuggestions: [".bq3Mi", ".PolarisSuggestedUserFeedUnit"],
                post: ["article._8Rm4L", "article.PolarisPost", "article.PolarisPostFunctional"],
                postLocationRow: [".M30cS", ".PolarisPostHeader._aaql"],
                postHashtagLocation: ".M30cS > div:not(:empty) + .JF9hh",
                postHeader: [".UE9AK", ".PolarisIGCoreBox > ._aaqw"],
                postHeaderBeforePseudo: [".UE9AK::before", ".PolarisIGCoreBox > ._aaqw::before"],
                postHeaderItem: ".UE9AK > *",
                postBody: ["article.PolarisPost ._aatk", "article.PolarisPost ._ab12"],
                postFooterWrap1: ["article._8Rm4L ._97aPb + div", "._aatk + .PolarisIGCoreBox", "._ab12 + .PolarisIGCoreBox"],
                postFooterWrap2: ["article._8Rm4L .cv3IO", "._aatk + .PolarisIGCoreBox > ._aast", "._ab12 + .PolarisIGCoreBox > div", "._aatk + .PolarisIGCoreBox > div"],
                postFooter: [".eo2As", "._aatk + .PolarisIGCoreBox > ._aast > ._aasx", "._ab12 + .PolarisIGCoreBox > div > div", "._aatk + .PolarisIGCoreBox > div > div"],
                postActions: [".Slqrh", ".PolarisPostFeedbackControls._aamu"],
                postAfterActions: [".PolarisPostFeedbackControls._aamu ~ *"],
                postThreeDotsButtonWrap: [".PolarisPostOptionsButtonPicker"],
                postThreeDotsButton: [".MEAGs", ".PolarisPostOptionsButtonPicker > button"],
                postAction: [".Slqrh > *", ".PolarisPostFeedbackControls._aamu > *"],
                postActionIconDefault: [".rrUvL", ".PolarisPostFeedbackControls button._abl- > div:last-child"],
                postActionIconHovered: [".B58H7", ".PolarisPostFeedbackControls button._abl- .PolarisIGCoreSVGIconButton"],
                postUnderActionsContent: [".eo2As > *:not(.Slqrh)", "._aasx > *:not(.PolarisPostFeedbackControls)"],
                postPhoto: [".KL4Bh img", "article.PolarisPost .PolarisPhoto img", "article.PolarisPostFunctional .PolarisPhoto img"],
                postVideo: ["article._8Rm4L video", "article.PolarisPost .PolarisVideo video", "article.PolarisPostFunctional .PolarisVideo video"],
                postMediaContainer: ["._97aPb", ".PolarisPhoto._aagu"],
                postPhotoContainer: ["._9AhH0", ".PolarisPost .PolarisPost.PolarisPhoto", ".PolarisPost .PolarisPost.PolarisPhotoWithIndicator", ".PolarisPostFunctional .PolarisPostFunctional.PolarisPhoto", ".PolarisPostFunctional .PolarisPostFunctional.PolarisPhotoWithIndicator"],
                postVideoContainer: [".GRtmf", ".PolarisPost .PolarisMedia.PolarisVideo", ".PolarisPostFunctional .PolarisMedia.PolarisVideo", '[data-media-actions-post-type="igtv"] > .PolarisIGCoreBox'],
                postCarouselContainer: [".rQDP3", ".PolarisSidecar._aamn"],
                carouselDots: [".ijCUd", ".PolarisStepIndicator"],
                carouselDot: [".Yi5aA", ".PolarisStepIndicator ._acnb"]
            },
            postCreation: {
                body: ['[data-page="CreationDetailsPage"] .PolarisCreationShell', '[data-page="CreationDetailsPage"] .PolarisBaseShell'],
                nextButton: ['[data-page="CreationStylePage"] .UP43G', '[data-page="CreationStylePage"] .PolarisNavigationalHeader ._ab5p'],
                closeButton: [".PolarisCreationShell .PolarisGenericMobileHeader._ab19 button.PolarisNavigationalHeader"],
                captionContainer: [".IpSxo", ".PolarisCreationDetailsPage._abru"],
                captionTextarea: [".IpSxo textarea", "textarea.PolarisCreationCaptionInput", ".PolarisCreationCaptionInput textarea"],
                userAvatar: [".IpSxo .GsWMc", ".IpSxo ._2dbep", ".PolarisUserAvatar.PolarisCreationDetailsPage"],
                imageContainer: [".N7f6u", ".PolarisCreationCroppingUnit._abqh"],
                videoContainer: [".YMoW3", ".PolarisCreationStyleVideoUnit._abe_"],
                video: [".YMoW3 video", ".PolarisCreationStyleVideoUnit._abe_ video"],
                videoPoster: [".YMoW3 img", ".PolarisCreationStyleVideoUnit._abe_ img"],
                videoPlayButton: ['.PolarisCreationStyleVideoUnit._abe_ span._abf6[role="button"]'],
                filtersReel: [".PDNx9", ".PolarisIGVirtualList.PolarisCreationFilteringUnit"],
                submitPostButton: [".hfWwk .UP43G", '[data-page="CreationDetailsPage"] ._ab5p'],
                rowButton: ["._2OfRz", ".PolarisCreationDetailsPage._abrf"],
                previewContainer: ['html[data-page="CreationDetailsPage"] .g5kp1', ".PolarisCreationDetailsPage ._aau7"],
                previewPostTypeIcon: [".cRc_w", ".PolarisCreationDetailsPage .PolarisMediaPreviewThumbnail svg"],
                previewPostImage: [".IpSxo .FuaTR", "img.PolarisMediaPreviewThumbnail"],
                expandImageButton: [".pHnkA", ".PolarisCroppableImage._abfb"],
                mentionsOverlay: [".cDEf6", ".PolarisCreationCaptionInput._aby4"],
                tagPeopleButton: [".DG8Ws", "button.PolarisCreationTagVideo._a9z-"]
            },
            loginBar: {
                root: ".Xwp_P .KGiwt",
                content: ".Xwp_P .KGiwt .ryLs_",
                openAppButton: [".Xwp_P .KGiwt button", ".PolarisMobileTopNavLoggedOut button._acap"]
            },
            activityPage: {
                headerBottomLine: ['html[data-page="ActivityFeedPage"] .PolarisGenericMobileHeader::before'],
                topListContainer: ['html[data-page="ActivityFeedPage"] .PolarisShellContent > .PolarisIGVirtualList > div']
            },
            "general_use-application-bar": [".Z_Gl2", ".MFkQJ", "._acc8"],
            "post-item": ["._97aPb", ".PolarisPost div:first-child:last-child:not([class]) > .PolarisPhoto", ".PolarisPost div:first-child:last-child:not([class]) > .PolarisPhotoWithIndicator > .PolarisPhoto", ".PolarisPost .PolarisMedia.PolarisVideo", ".PolarisPost .PolarisSidecar li.PolarisVirtualHSnapScrollComponents", ".PolarisPostFunctional .PolarisPostFunctional.PolarisPhoto", ".PolarisPostFunctional .PolarisPostFunctional.PolarisPhotoWithIndicator", ".PolarisPostFunctional .PolarisMedia.PolarisVideo", ".PolarisPostFunctional .PolarisSidecar li.PolarisVirtualHSnapScrollComponents", ".PolarisPostVideoPlayerWrapper[style]", ".PolarisVideoLegacy"],
            "post-video": [".GRtmf video", ".PolarisPost ._aatk video", ".PolarisPostFunctional ._ab12 video"],
            "post-video-poster": [".GRtmf video + img", ".PolarisPost ._aatk video + img", ".PolarisPostFunctional ._ab12 video + img"],
            "post-video-overlay": [".B1JlO .fXIG0", ".PolarisVideoPlayButton._aakl", ".PolarisVideoPlayButton._aakh", ".PolarisPost .VideoPlayerComponentContainer[data-visualcompletion]"],
            "post-tagged-people-button": [".G_hoz", "._a3gq ._a9-6", ".PolarisVideo ._a9-6"],
            "story-container": [".qbCDp", ".PolarisMobileOwnerStories._aa2i", "section > .PolarisMobileStories"],
            "story-image": [".qbCDp img", "img.PolarisStoryImage"],
            "story-video": [".qbCDp video", "video.PolarisStoryVideo", ".PolarisMobileStoryViewer video"],
            "story-loading-preview": ".qbCDp canvas",
            "story-video-play-button": [".qbCDp .videoSpritePlayButton", ".PolarisMobileStoryEventZone._9zwu"],
            "stories-viewer": [".UIujo", ".PolarisMobileStoriesPage"],
            "highlights-container": [".YlNGR", ".PolarisProfileStoryHighlightsTray .PolarisHSnapScroll._aap0"],
            "comments-list-on-comments-page": ".XQXOT",
            "profile-page-stat-container": ".LH36I",
            "profile-page-stat-item": "._81NM2",
            "profile-page-grid-stretch-element": "._2z6nI article:first-child:empty",
            "profile-send-message-button": ".fAR91",
            "header-top-level-button": [".HOQT4", ".PolarisGenericMobileHeader._ab18._ab1b"],
            "your-story-button-text": [".XdXBI", ".PolarisOwnStoryTrayItem._aac2"],
            "comment-form": [".RxpZH", ".PolarisPostCommentInput._aaof"],
            "comment-form-avatar": [".RxpZH ._2dbep", ".PolarisPostCommentInput > img.PolarisUserAvatar"],
            "comment-form-form": [".RxpZH form", "form.PolarisPostCommentInput"],
            "comment-form-textarea": [".RxpZH textarea", "textarea.PolarisPostCommentInput"],
            "comment-form-submit-button": ['.RxpZH button[type="submit"]', "form.PolarisPostCommentInput button"],
            postCreationPage: ['html[data-page="CreationStylePage"]'],
            storyCreationPage: ['html[data-page="StoryCreationPage"]'],
            "new-post_tag-people-image-container": ".qJfNm"
        },
        ig: {
            STORY_REELS_ITEM_SEEN: "STORY_REELS_ITEM_SEEN"
        },
        fcs: {
            MIN_MINUTES_FROM_NOW: 10,
            MAX_DAYS_FROM_NOW: 74,
            MediaManagerDispatcher: "MediaManagerDispatcher",
            MediaManagerInstagramComposerMetaDataActions: "MediaManagerInstagramComposerMetaDataActions",
            MediaManagerInstagramComposerMetaDataStore: "MediaManagerInstagramComposerMetaDataStore",
            MediaManagerInstagramComposerRootActions: "MediaManagerInstagramComposerRootActions",
            MediaManagerInstagramComposerUploadStore: "MediaManagerInstagramComposerUploadStore",
            DateTime: "DateTime",
            ImageExifRotation: "ImageExifRotation",
            TimezoneNamesData: "TimezoneNamesData",
            CurrentUserInitialData: "CurrentUserInitialData",
            SWITCH_CROSSPOST_POST_MODE: "SWITCH_CROSSPOST_POST_MODE",
            SWITCH_POST_MODE: "SWITCH_POST_MODE",
            postMode: "postMode",
            postModeDraft: "draft",
            postModePublish: "publish",
            postModeSchedule: "schedule",
            isEditComposer: "isEditComposer",
            SELECT_CROSSPOST_SCHEDULED_DATE: "SELECT_CROSSPOST_SCHEDULED_DATE",
            SELECT_SCHEDULED_DATE: "SELECT_SCHEDULED_DATE",
            scheduledDate: "scheduledDate",
            SUBMIT_MEDIA_ORDER: "SUBMIT_MEDIA_ORDER",
            mediaOrderId: "id",
            prevIndex: "prevIndex",
            newIndexString: "newIndexString",
            totalMedia: "totalMedia",
            postDetailsTrayPost: "post",
            CONTENT_INSTAGRAM_EDIT_POST: "CONTENT_INSTAGRAM_EDIT_POST",
            FILES_ADDED: "FILES_ADDED",
            files: "files",
            LOAD_TAB_START: "LOAD_TAB_START",
            LOAD_TAB_FINISHED: "LOAD_TAB_FINISHED",
            tab: "tab",
            instagram_content_posts: "instagram_content_posts",
            SELECT_IG_PROFILES: "SELECT_IG_PROFILES",
            selectedProfileIDs: "selectedProfileIDs",
            LOAD_CONTENT_TABLE_FINISHED: "LOAD_CONTENT_TABLE_FINISHED",
            rows: "rows",
            CONTENT_TABLE_REFRESH_ROWS_FINISHED: "CONTENT_TABLE_REFRESH_ROWS_FINISHED",
            rowsByIDs: "rowsByIDs",
            PUSH_NOTIFICATION: "PUSH_NOTIFICATION",
            CLOSE_NOTIFICATION: "CLOSE_NOTIFICATION",
            isSuccess: "isSuccess",
            notificationData: "notificationData",
            notificationDataLabel: "label",
            CLOSE_COMPOSER: "CLOSE_COMPOSER",
            INSTAGRAM_COMPOSER: "INSTAGRAM_COMPOSER",
            SHOW_EXIT_COMPOSER_CONFIRM_DIALOG: "SHOW_EXIT_COMPOSER_CONFIRM_DIALOG",
            UPDATE_CAPTION: "UPDATE_CAPTION",
            TOGGLE_CROSSPOST_TO_FACEBOOK_CHECKBOX: "TOGGLE_CROSSPOST_TO_FACEBOOK_CHECKBOX",
            post_type: "post_type",
            post_status: "post_status",
            limit: "limit",
            POST_TYPE_ALL: "ALL",
            POST_TYPE_PHOTOS: "PHOTOS",
            POST_TYPE_IG_STORIES: "IG_STORIES",
            POST_TYPE_CAROUSELS: "CAROUSELS",
            POST_TYPE_IGTV: "IGTV",
            POST_TYPE_VIDEOS: "VIDEOS",
            POST_STATUS_DRAFT: "DRAFT",
            POST_STATUS_SCHEDULED: "SCHEDULED",
            POST_STATUS_PUBLISHED: "PUBLISHED",
            immutable: "immutable",
            queryIGMediaData: "queryIGMediaData",
            MediaManagerInstagramContentActions: "MediaManagerInstagramContentActions",
            MediaManagerLazyLoadActions: "MediaManagerLazyLoadActions",
            instagram_content_library_posts: "instagram_content_library_posts",
            REFRESH_TAB: "REFRESH_TAB",
            SELECT_CONTENT_TABLE: "SELECT_CONTENT_TABLE",
            SELECT_INSTAGRAM_ACCOUNT: "SELECT_INSTAGRAM_ACCOUNT",
            SET_CONTENT_LIBRARY_DATA: "SET_CONTENT_LIBRARY_DATA",
            INSTAGRAM_VIDEO_POSTS: "INSTAGRAM_VIDEO_POSTS",
            INSTAGRAM_PHOTO_POSTS: "INSTAGRAM_PHOTO_POSTS",
            INSTAGRAM_CAROUSEL_POSTS: "INSTAGRAM_CAROUSEL_POSTS",
            INSTAGRAM_IGTV_POSTS: "INSTAGRAM_IGTV_POSTS",
            IG_FEED_ORGANIC: "IG_FEED_ORGANIC",
            "/media_manager/content_library": "/media_manager/content_library",
            "/media_manager/media_manager_instagram_content": "/media_manager/media_manager_instagram_content",
            "/media/manager/instagram_media/edit/save": "/media/manager/instagram_media/edit/save",
            "/media/manager/instagram_composer/create_post": "/media/manager/instagram_composer/create_post",
            "https://www.facebook.com/confirmemail.php": "https://www.facebook.com/confirmemail.php",
            'action="/confirm_code/': 'action="/confirm_code/',
            "edit_data[save_as_draft]": "edit_data[save_as_draft]",
            "edit_data[save_as_scheduled]": "edit_data[save_as_scheduled]"
        },
        fcsSelectors: {
            welcome: {
                getStartedButton: "._7iri button._1qjd._271m._271k",
                acceptCookieButton: "button[data-cookiebanner]"
            },
            whatsNew: {
                closeButton: 'body:not(.bizsitePage) ._9l2g[role="dialog"] [role="button"]'
            },
            general: {
                pandaErrorImage: "._1ldz",
                cookieBannerTitle: "#cookie_banner_title",
                fbLoginRequiredContainer: ".UIPage_LoggedOut",
                headerMessageIconContainer: ".MediaManagerInstagramComposerHeaderMessage",
                translationsButton: ".fbDockWrapperRight"
            },
            sidePanel: {
                root: "#creator_studio_sliding_tray_root",
                loadingOverlay: "._8eef",
                captionScrollContainer: "._5yk1",
                captionTextarea: "._5yk1 [contenteditable]",
                locationRoot: "._7yq5",
                locationInput: "._7yq5 input",
                mediaPreview: "._5i4g",
                mediaPreviewContainer: ".BackgroundImage",
                mediaPreviewControls: "._9aiv",
                mediaPreviewVideo: "._80o3 video",
                uploadingVideo: "video._ox1",
                uploadingVideoPlayButton: "video._ox1 ~ i",
                uploadingVideoCustomControls: "video._ox1 ~ ._27db",
                coverSelectionRadioBox: "._6epv",
                goToPostButton: "#creator_studio_sliding_tray_root ._6qig div:nth-child(1)",
                editPostButton: ".MediaManagerInstagramPostDetailsTray > .FlexLayout button",
                doneButton: "#creator_studio_sliding_tray_root ._6qig div:nth-child(3)",
                save: "#creator_studio_sliding_tray_root ._85h_ button:not([id]):not(.delete-post-button)",
                dateDialogTrigger: "#creator_studio_sliding_tray_root ._85h_ button:not([id]):not(.delete-post-button) + * button",
                editPostTitle: "#creator_studio_sliding_tray_root ._6y1b ._3qn7",
                editPostBottomRow: "#creator_studio_sliding_tray_root ._85h_",
                mediaList: "._80o3",
                body: "._7-i-",
                bodyContent: ["._7-i- > .FlexLayout", "._7-i- > ._3qn7"],
                sidebar: "._7yqd",
                sidebarTab: '.MediaManagerInstagramComposerBodyTabSections[role="button"]',
                sidebarTabIcon: '.MediaManagerInstagramComposerBodyTabSections[role="button"] .ImageCore',
                sidebarTabTitle: '.MediaManagerInstagramComposerBodyTabSections[role="button"] .ImageCore + span',
                postPreviewCaption: ".MediaManagerInstagramPostPreview > p",
                uploadProgress: "._6eqx",
                postPerformancePane: ".MediaManagerInstagramPostDetailsBody._75fj"
            },
            postToFb: {
                root: "#creator_studio_sliding_tray_root ._3qn7._61-3._2fyh._3qnf",
                title: '#creator_studio_sliding_tray_root ._3qn7._61-3._2fyh._3qnf [role="heading"]',
                checkboxRow: "#creator_studio_sliding_tray_root ._3qn7._61-3._2fyh._3qnf ._8ung > div",
                checkboxButton: "#creator_studio_sliding_tray_root ._3qn7._61-3._2fyh._3qnf ._8ung button",
                checkboxText: "#creator_studio_sliding_tray_root ._3qn7._61-3._2fyh._3qnf ._8ung > div > div:first-child > div:last-child",
                body: "#creator_studio_sliding_tray_root ._3qn7._61-3._2fyh._3qnf ._83li",
                publishTypeButton: '#creator_studio_sliding_tray_root ._3qn7._61-3._2fyh._3qnf button[aria-haspopup="true"]'
            },
            tooltip: {
                root: ".uiContextualLayerPositioner",
                bubbleWrap: ".uiContextualLayer",
                bubble: ".uiTooltipX"
            },
            upload: {
                root: "._7_8t",
                button: "._7_8t button",
                buttonWrap: "._7_8t ._82ht",
                addContentButton: 'div[aria-haspopup="true"][id^="js_"] button',
                addContentButtonWrap: 'div[aria-haspopup="true"][id^="js_"]',
                input: 'input[accept^="video"]'
            },
            confirmDialog: {
                yes: '[action="confirm"]'
            },
            dateDialog: {
                root: ["._53ii ._53ik", '[style*="right: 30px"][style*="z-index: 400"] > div > div'],
                rootOpen: ["._53ii:not(.hidden_elem) ._53ik", '[style*="right: 30px"][style*="z-index: 400"]:not(.hidden_elem) > div > div']
            }
        }
    };
    var t_ = {};
    t_.controller = {
        init: async function() {
            3 === u.manifestVersion && (this._lastRuleId = 1, this._globalRules = [], this._tabRuleIds = [], this._tabRuleCreators = [], this._watchForPopupTab(), await this._dropAllRules(), await this._applyGlobalRules())
        },
        _watchForPopupTab: function() {
            $g.on("wri.popup-tab-created", (async e => {
                await this._removeRules(this._tabRuleIds);
                const t = this._tabRuleCreators.map((t => t(e))),
                    n = await this._applyRules(t);
                this._tabRuleIds = n
            }))
        },
        _dropAllRules: async function() {
            const e = await L.callAsync(chrome.declarativeNetRequest.getSessionRules);
            this._removeRules(e.map((e => e.id)))
        },
        _applyGlobalRules: async function() {
            await this._applyRules(this._globalRules)
        },
        _addRule: async function(e) {
            "function" == typeof e ? this._tabRuleCreators.push(e) : this._globalRules.push(e)
        },
        _removeRules: async function(e) {
            await L.callAsync(chrome.declarativeNetRequest.updateSessionRules, {
                removeRuleIds: e
            })
        },
        _applyRules: async function(e) {
            return e = e.map((e => ({
                id: this._lastRuleId++,
                priority: 1,
                ...e,
                condition: {
                    resourceTypes: ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "webtransport", "webbundle"],
                    ...e.condition
                }
            }))), await L.callAsync(chrome.declarativeNetRequest.updateSessionRules, {
                addRules: e
            }), e.map((e => e.id))
        }
    }, uw.controller = {
        init: function() {
            this._onOnline = L.createEmitter(), this._onOffline = L.createEmitter(), this._watchOnlineStatus(), this._updateUserWhenOnlineStatusChanges(), setInterval((() => this._recoverIfOffline()), 5 * L.time.MINUTE)
        },
        get online() {
            return navigator.onLine
        },
        get offline() {
            return !this.online
        },
        waitForOnline: async function() {
            this.online || await new Promise((e => {
                const t = () => {
                    e(), this._onOnline.off(t)
                };
                this._onOnline(t)
            }))
        },
        _watchOnlineStatus: function() {
            if (3 === u.manifestVersion) {
                if (!navigator.connection) return;
                let e = navigator.onLine;
                navigator.connection.addEventListener("change", (() => {
                    navigator.onLine !== e && (e = navigator.onLine, e ? this._onOnline() : this._onOffline())
                }))
            } else globalThis.addEventListener("online", (() => this._onOnline())), globalThis.addEventListener("offline", (() => this._onOffline()))
        },
        _updateUserWhenOnlineStatusChanges: function() {
            this._onOnline((() => {
                log("[$chromeStarter] going online"), null === Dg.model.state.authStatus.userId && $y.controller.updateUser()
            })), this._onOffline((() => {
                log("[$chromeStarter] going offline"), null !== Dg.model.state.authStatus.userId && $y.controller.updateUser()
            }))
        },
        _recoverIfOffline: function() {
            null === Dg.model.state.authStatus.userId && (log("[$chromeStarter] trying to recover from offline"), $y.controller.updateUser())
        }
    };
    var n_ = {
        credibilityToGrade: e => {
            const t = r_.find((t => t.condition(e)));
            return {
                value: t.value,
                label: t.label,
                color: t.color
            }
        }
    };
    const r_ = [{
        condition: e => e > .85,
        value: "A",
        label: "credible",
        color: "#74BE86"
    }, {
        condition: e => e > .7,
        value: "B",
        label: "credible",
        color: "#74BE86"
    }, {
        condition: e => e > .55,
        value: "C",
        label: "could be spam",
        color: "#BAD043"
    }, {
        condition: e => e > .35,
        value: "D",
        label: "likely spam",
        color: "#FFCC24"
    }, {
        condition: e => "number" == typeof e,
        value: "F",
        label: "spam / inactive",
        color: "#E34E21"
    }, {
        condition: e => "failed" === e,
        value: "N/A",
        label: "check failed",
        color: "#D8DADD"
    }, {
        condition: () => !0,
        value: "N/A",
        label: "user is private",
        color: "#D8DADD"
    }];
    n_.getSpamColor = e => o_.find((t => t.condition(e))).color;
    const o_ = [{
        condition: e => e > .35,
        color: "#E34E21"
    }, {
        condition: e => "number" == typeof e,
        color: "#74BE86"
    }, {
        condition: () => !0,
        color: "#D8DADD"
    }];
    n_.controller = {
        init: async function() {
            $g.on("insights.get-credibility-grade", this._getCredibilityGrade.bind(this))
        },
        _getCredibilityGrade: function(e) {
            const t = Dg.model.state.authStatus.userId,
                n = this._getCredibility(e, t);
            return n_.credibilityToGrade(n)
        },
        _getCredibility: function(e, t = null, {
            forcePrivate: n = !1
        } = {}) {
            const r = e.userId === t;
            if (e.isPrivate && !r && !n) return null;
            if (e.isVerified) return 1;
            if ("inssistapp" === e.username) return 1;
            let o = 0,
                i = 0;
            Object.values(this._getRules()).forEach((t => {
                o += t.getValue(e) * t.weight, i += Math.max(t.weight, 0)
            }));
            const a = e.followingsCount > 7e3 ? .45 : e.followingsCount > 6500 ? .4 : e.followingsCount > 6e3 ? .35 : e.followingsCount > 5500 ? .25 : e.followingsCount > 5e3 ? .1 : 0,
                s = 1 - this._between01(o / i + a);
            return Math.round(100 * s) / 100
        },
        _getRules: function() {
            return {
                "followings-to-followers-ratio": {
                    weight: 150,
                    getValue: e => {
                        const t = Math.log2(e.followingsCount / e.followersCount / 4) / 1.5;
                        return this._between01(t)
                    }
                },
                "short-bio": {
                    weight: 30,
                    getValue: e => {
                        if (!e.bio) return 1;
                        const t = (20 - e.bio.length) / 20;
                        return this._between01(t)
                    }
                },
                "no-avatar": {
                    weight: 100,
                    getValue: e => e.hasAvatar ? 0 : 1
                },
                "few-posts": {
                    weight: 200,
                    getValue: e => {
                        const t = (24 - e.postsCount) / 24;
                        return this._between01(t)
                    }
                },
                "username-ends-with-digits": {
                    weight: 100,
                    getValue: e => {
                        if (!e.username) return 0;
                        const t = e.username.replace(/[_.]*/g, "").match(/.*(\d{4,})$/),
                            n = t && t[1];
                        if (!n) return 0;
                        const r = Number(n);
                        return r > 1950 && r < 2030 ? 0 : 1
                    }
                },
                "has-highlights": {
                    weight: -25,
                    getValue: e => e.hasHighlights ? 1 : 0
                },
                "posts-frequency": {
                    weight: 150,
                    getValue: e => {
                        if (e.isPrivate) return 0;
                        const t = e.lastPosts ? e.lastPosts.length : 0;
                        if (0 === t) return 1;
                        const n = Date.now(),
                            r = 2592e6,
                            o = e.lastPosts.map((e => e.ts)).sort();
                        if (o.some((e => n - e < r))) return 0;
                        let i = 0,
                            a = 0,
                            s = 0;
                        for (;;) {
                            if (o[a] - o[i] < r && a < t ? (a++, s = Math.max(s, a - i)) : i++, i === t - 1) break
                        }
                        const l = (s / t - .6) / .4;
                        return this._between01(l)
                    }
                }
            }
        },
        _between01: function(e) {
            return Math.min(Math.max(0, e), 1)
        }
    }, sw.controller = {
        save: async function(e, t = "") {
            const n = ge.generate(),
                r = t ? `${t}.${n}` : n;
            return await Ey.controller.set(`files.${r}`, e), r
        },
        read: async function(e) {
            return await Ey.controller.get(`files.${e}`) || null
        },
        remove: async function(e) {
            await Ey.controller.delete(`files.${e}`)
        },
        getFileIds: async function(e = "") {
            const t = await Ey.controller.getAllKeys(),
                n = e ? `files.${e}.` : "files.";
            return t.filter((e => e.startsWith(n))).map((e => e.replace("files.", "")))
        }
    };
    (function() {
        var t = this,
            n = {
                exports: this
            };
        return function() {
            function r(e, t) {
                for (var n = -1, r = t.length, o = e.length; ++n < r;) e[o + n] = t[n];
                return e
            }

            function o(e, t) {
                for (var n = -1, r = null == e ? 0 : e.length; ++n < r;)
                    if (t(e[n], n, e)) return !0;
                return !1
            }

            function i(e) {
                return function(t) {
                    return e(t)
                }
            }

            function a(e) {
                var t = -1,
                    n = Array(e.size);
                return e.forEach((function(e, r) {
                    n[++t] = [r, e]
                })), n
            }

            function s(e) {
                var t = Object;
                return function(n) {
                    return e(t(n))
                }
            }

            function l(e) {
                var t = -1,
                    n = Array(e.size);
                return e.forEach((function(e) {
                    n[++t] = e
                })), n
            }

            function u() {}

            function c(e) {
                var t = -1,
                    n = null == e ? 0 : e.length;
                for (this.clear(); ++t < n;) {
                    var r = e[t];
                    this.set(r[0], r[1])
                }
            }

            function d(e) {
                var t = -1,
                    n = null == e ? 0 : e.length;
                for (this.clear(); ++t < n;) {
                    var r = e[t];
                    this.set(r[0], r[1])
                }
            }

            function f(e) {
                var t = -1,
                    n = null == e ? 0 : e.length;
                for (this.clear(); ++t < n;) {
                    var r = e[t];
                    this.set(r[0], r[1])
                }
            }

            function p(e) {
                var t = -1,
                    n = null == e ? 0 : e.length;
                for (this.__data__ = new f; ++t < n;) this.add(e[t])
            }

            function h(e) {
                this.size = (this.__data__ = new d(e)).size
            }

            function g(e, t) {
                var n = $e(e),
                    r = !n && Ge(e),
                    o = !n && !r && We(e),
                    i = !n && !r && !o && Qe(e);
                if (n = n || r || o || i) {
                    r = e.length;
                    for (var a = String, s = -1, l = Array(r); ++s < r;) l[s] = a(s);
                    r = l
                } else r = [];
                var u;
                a = r.length;
                for (u in e) {
                    if (!(s = !t && !de.call(e, u)) && (s = n) && !(s = "length" == u || o && ("offset" == u || "parent" == u) || i && ("buffer" == u || "byteLength" == u || "byteOffset" == u))) {
                        var c = typeof(s = u);
                        s = !!(l = null == (l = a) ? 9007199254740991 : l) && ("number" == c || "symbol" != c && W.test(s)) && -1 < s && 0 == s % 1 && s < l
                    }
                    s || r.push(u)
                }
                return r
            }

            function m(e, t, n) {
                var r = e[t];
                de.call(e, t) && M(r, n) && (n !== z || t in e) || b(e, t, n)
            }

            function v(e, t) {
                for (var n = e.length; n--;)
                    if (M(e[n][0], t)) return n;
                return -1
            }

            function b(e, t, n) {
                "__proto__" == t && Pe ? Pe(e, t, {
                    configurable: !0,
                    enumerable: !0,
                    value: n,
                    writable: !0
                }) : e[t] = n
            }

            function y(e, t, n, r, o, i) {
                var a, s = 1 & t,
                    l = 2 & t,
                    u = 4 & t;
                if (n && (a = o ? n(e, r, o, i) : n(e)), a !== z) return a;
                if (!B(e)) return e;
                if (r = $e(e)) {
                    if (a = function(e) {
                            var t = e.length,
                                n = new e.constructor(t);
                            return t && "string" == typeof e[0] && de.call(e, "index") && (n.index = e.index, n.input = e.input), n
                        }(e), !s) return function(e, t) {
                        var n = -1,
                            r = e.length;
                        for (t || (t = Array(r)); ++n < r;) t[n] = e[n];
                        return t
                    }(e, a)
                } else {
                    var c = ze(e),
                        d = "[object Function]" == c || "[object GeneratorFunction]" == c;
                    if (We(e)) return function(e, t) {
                        if (t) return e.slice();
                        var n = e.length;
                        n = be ? be(n) : new e.constructor(n);
                        return e.copy(n), n
                    }(e, s);
                    if ("[object Object]" == c || "[object Arguments]" == c || d && !o) {
                        if (a = l || d || "function" != typeof e.constructor || A(e) ? {} : Ve(ye(e)), !s) return l ? function(e, t) {
                            return k(e, qe(e), t)
                        }(e, function(e, t) {
                            return e && k(t, V(t), e)
                        }(a, e)) : function(e, t) {
                            return k(e, He(e), t)
                        }(e, function(e, t) {
                            return e && k(t, j(t), e)
                        }(a, e))
                    } else {
                        if (!J[c]) return o ? e : {};
                        a = function(e, t, n) {
                            var r = e.constructor;
                            switch (t) {
                                case "[object ArrayBuffer]":
                                    return P(e);
                                case "[object Boolean]":
                                case "[object Date]":
                                    return new r(+e);
                                case "[object DataView]":
                                    return t = n ? P(e.buffer) : e.buffer, new e.constructor(t, e.byteOffset, e.byteLength);
                                case "[object Float32Array]":
                                case "[object Float64Array]":
                                case "[object Int8Array]":
                                case "[object Int16Array]":
                                case "[object Int32Array]":
                                case "[object Uint8Array]":
                                case "[object Uint8ClampedArray]":
                                case "[object Uint16Array]":
                                case "[object Uint32Array]":
                                    return t = n ? P(e.buffer) : e.buffer, new e.constructor(t, e.byteOffset, e.length);
                                case "[object Map]":
                                    return new r;
                                case "[object Number]":
                                case "[object String]":
                                    return new r(e);
                                case "[object RegExp]":
                                    return (t = new e.constructor(e.source, G.exec(e))).lastIndex = e.lastIndex, t;
                                case "[object Set]":
                                    return new r;
                                case "[object Symbol]":
                                    return je ? Object(je.call(e)) : {}
                            }
                        }(e, c, s)
                    }
                }
                if (i || (i = new h), o = i.get(e)) return o;
                if (i.set(e, a), Je(e)) return e.forEach((function(r) {
                    a.add(y(r, t, n, r, e, i))
                })), a;
                if (Ye(e)) return e.forEach((function(r, o) {
                    a.set(o, y(r, t, n, o, e, i))
                })), a;
                l = u ? l ? T : I : l ? V : j;
                var f = r ? z : l(e);
                return function(e, t) {
                    for (var n = -1, r = null == e ? 0 : e.length; ++n < r && !1 !== t(e[n], n, e););
                }(f || e, (function(r, o) {
                    f && (r = e[o = r]), m(a, o, y(r, t, n, o, e, i))
                })), a
            }

            function w(e, t, n) {
                return t = t(e), $e(e) ? t : r(t, n(e))
            }

            function _(e) {
                if (null == e) e = e === z ? "[object Undefined]" : "[object Null]";
                else if (xe && xe in Object(e)) {
                    var t = de.call(e, xe),
                        n = e[xe];
                    try {
                        e[xe] = z;
                        var r = !0
                    } catch (e) {}
                    var o = pe.call(e);
                    r && (t ? e[xe] = n : delete e[xe]), e = o
                } else e = pe.call(e);
                return e
            }

            function S(e) {
                return L(e) && "[object Arguments]" == _(e)
            }

            function x(e, t, n, r, o) {
                if (e === t) t = !0;
                else if (null == e || null == t || !L(e) && !L(t)) t = e != e && t != t;
                else e: {
                    var i, a, s = $e(e),
                        l = $e(t),
                        u = "[object Object]" == (i = "[object Arguments]" == (i = s ? "[object Array]" : ze(e)) ? "[object Object]" : i);l = "[object Object]" == (a = "[object Arguments]" == (a = l ? "[object Array]" : ze(t)) ? "[object Object]" : a);
                    if ((a = i == a) && We(e)) {
                        if (!We(t)) {
                            t = !1;
                            break e
                        }
                        s = !0, u = !1
                    }
                    if (a && !u) o || (o = new h),
                    t = s || Qe(e) ? D(e, t, n, r, x, o) : E(e, t, i, n, r, x, o);
                    else {
                        if (!(1 & n) && (s = u && de.call(e, "__wrapped__"), i = l && de.call(t, "__wrapped__"), s || i)) {
                            e = s ? e.value() : e, t = i ? t.value() : t, o || (o = new h), t = x(e, t, n, r, o);
                            break e
                        }
                        if (a) t: if (o || (o = new h), s = 1 & n, i = I(e), l = i.length, a = I(t).length, l == a || s) {
                            for (u = l; u--;) {
                                var c = i[u];
                                if (!(s ? c in t : de.call(t, c))) {
                                    t = !1;
                                    break t
                                }
                            }
                            if ((a = o.get(e)) && o.get(t)) t = a == t;
                            else {
                                a = !0, o.set(e, t), o.set(t, e);
                                for (var d = s; ++u < l;) {
                                    var f = e[c = i[u]],
                                        p = t[c];
                                    if (r) var g = s ? r(p, f, c, t, e, o) : r(f, p, c, e, t, o);
                                    if (g === z ? f !== p && !x(f, p, n, r, o) : !g) {
                                        a = !1;
                                        break
                                    }
                                    d || (d = "constructor" == c)
                                }
                                a && !d && ((n = e.constructor) != (r = t.constructor) && "constructor" in e && "constructor" in t && !("function" == typeof n && n instanceof n && "function" == typeof r && r instanceof r) && (a = !1)), o.delete(e), o.delete(t), t = a
                            }
                        } else t = !1;
                        else t = !1
                    }
                }
                return t
            }

            function P(e) {
                var t = new e.constructor(e.byteLength);
                return new ve(t).set(new ve(e)), t
            }

            function k(e, t, n) {
                var r = !n;
                n || (n = {});
                for (var o = -1, i = t.length; ++o < i;) {
                    var a = t[o],
                        s = z;
                    s === z && (s = e[a]), r ? b(n, a, s) : m(n, a, s)
                }
                return n
            }

            function D(e, t, n, r, i, a) {
                var s = 1 & n,
                    l = e.length;
                if (l != (u = t.length) && !(s && u > l)) return !1;
                if ((u = a.get(e)) && a.get(t)) return u == t;
                var u = -1,
                    c = !0,
                    d = 2 & n ? new p : z;
                for (a.set(e, t), a.set(t, e); ++u < l;) {
                    var f = e[u],
                        h = t[u];
                    if (r) var g = s ? r(h, f, u, t, e, a) : r(f, h, u, e, t, a);
                    if (g !== z) {
                        if (g) continue;
                        c = !1;
                        break
                    }
                    if (d) {
                        if (!o(t, (function(e, t) {
                                if (!d.has(t) && (f === e || i(f, e, n, r, a))) return d.push(t)
                            }))) {
                            c = !1;
                            break
                        }
                    } else if (f !== h && !i(f, h, n, r, a)) {
                        c = !1;
                        break
                    }
                }
                return a.delete(e), a.delete(t), c
            }

            function E(e, t, n, r, o, i, s) {
                switch (n) {
                    case "[object DataView]":
                        if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) break;
                        e = e.buffer, t = t.buffer;
                    case "[object ArrayBuffer]":
                        if (e.byteLength != t.byteLength || !i(new ve(e), new ve(t))) break;
                        return !0;
                    case "[object Boolean]":
                    case "[object Date]":
                    case "[object Number]":
                        return M(+e, +t);
                    case "[object Error]":
                        return e.name == t.name && e.message == t.message;
                    case "[object RegExp]":
                    case "[object String]":
                        return e == t + "";
                    case "[object Map]":
                        var u = a;
                    case "[object Set]":
                        if (u || (u = l), e.size != t.size && !(1 & r)) break;
                        return (n = s.get(e)) ? n == t : (r |= 2, s.set(e, t), t = D(u(e), u(t), r, o, i, s), s.delete(e), t);
                    case "[object Symbol]":
                        if (je) return je.call(e) == je.call(t)
                }
                return !1
            }

            function I(e) {
                return w(e, j, He)
            }

            function T(e) {
                return w(e, V, qe)
            }

            function C(e, t) {
                var n = e.__data__,
                    r = typeof t;
                return ("string" == r || "number" == r || "symbol" == r || "boolean" == r ? "__proto__" !== t : null === t) ? n["string" == typeof t ? "string" : "hash"] : n.map
            }

            function F(e, t) {
                var n = null == e ? z : e[t];
                return !B(n) || fe && fe in n || !(N(n) ? he : $).test(O(n)) ? z : n
            }

            function A(e) {
                var t = e && e.constructor;
                return e === ("function" == typeof t && t.prototype || le)
            }

            function O(e) {
                if (null != e) {
                    try {
                        return ce.call(e)
                    } catch (e) {}
                    return e + ""
                }
                return ""
            }

            function M(e, t) {
                return e === t || e != e && t != t
            }

            function R(e) {
                return null != e && U(e.length) && !N(e)
            }

            function N(e) {
                return !!B(e) && ("[object Function]" == (e = _(e)) || "[object GeneratorFunction]" == e || "[object AsyncFunction]" == e || "[object Proxy]" == e)
            }

            function U(e) {
                return "number" == typeof e && -1 < e && 0 == e % 1 && 9007199254740991 >= e
            }

            function B(e) {
                var t = typeof e;
                return null != e && ("object" == t || "function" == t)
            }

            function L(e) {
                return null != e && "object" == typeof e
            }

            function j(e) {
                if (R(e)) e = g(e);
                else if (A(e)) {
                    var t, n = [];
                    for (t in Object(e)) de.call(e, t) && "constructor" != t && n.push(t);
                    e = n
                } else e = Ee(e);
                return e
            }

            function V(e) {
                if (R(e)) e = g(e, !0);
                else if (B(e)) {
                    var t, n = A(e),
                        r = [];
                    for (t in e)("constructor" != t || !n && de.call(e, t)) && r.push(t);
                    e = r
                } else {
                    if (t = [], null != e)
                        for (n in Object(e)) t.push(n);
                    e = t
                }
                return e
            }

            function H() {
                return []
            }

            function q() {
                return !1
            }
            var z, G = /\w*$/,
                $ = /^\[object .+?Constructor\]$/,
                W = /^(?:0|[1-9]\d*)$/,
                Y = {};
            Y["[object Float32Array]"] = Y["[object Float64Array]"] = Y["[object Int8Array]"] = Y["[object Int16Array]"] = Y["[object Int32Array]"] = Y["[object Uint8Array]"] = Y["[object Uint8ClampedArray]"] = Y["[object Uint16Array]"] = Y["[object Uint32Array]"] = !0, Y["[object Arguments]"] = Y["[object Array]"] = Y["[object ArrayBuffer]"] = Y["[object Boolean]"] = Y["[object DataView]"] = Y["[object Date]"] = Y["[object Error]"] = Y["[object Function]"] = Y["[object Map]"] = Y["[object Number]"] = Y["[object Object]"] = Y["[object RegExp]"] = Y["[object Set]"] = Y["[object String]"] = Y["[object WeakMap]"] = !1;
            var J = {};
            J["[object Arguments]"] = J["[object Array]"] = J["[object ArrayBuffer]"] = J["[object DataView]"] = J["[object Boolean]"] = J["[object Date]"] = J["[object Float32Array]"] = J["[object Float64Array]"] = J["[object Int8Array]"] = J["[object Int16Array]"] = J["[object Int32Array]"] = J["[object Map]"] = J["[object Number]"] = J["[object Object]"] = J["[object RegExp]"] = J["[object Set]"] = J["[object String]"] = J["[object Symbol]"] = J["[object Uint8Array]"] = J["[object Uint8ClampedArray]"] = J["[object Uint16Array]"] = J["[object Uint32Array]"] = !0, J["[object Error]"] = J["[object Function]"] = J["[object WeakMap]"] = !1;
            var Q, K = "object" == typeof e && e && e.Object === Object && e,
                X = "object" == typeof self && self && self.Object === Object && self,
                Z = K || X || Function("return this")(),
                ee = "object" == typeof t && t && !t.nodeType && t,
                te = ee && "object" == typeof n && n && !n.nodeType && n,
                ne = te && te.exports === ee,
                re = ne && K.process;
            e: {
                try {
                    Q = re && re.binding && re.binding("util");
                    break e
                } catch (e) {}
                Q = void 0
            }
            var oe = Q && Q.isMap,
                ie = Q && Q.isSet,
                ae = Q && Q.isTypedArray,
                se = Array.prototype,
                le = Object.prototype,
                ue = Z["__core-js_shared__"],
                ce = Function.prototype.toString,
                de = le.hasOwnProperty,
                fe = function() {
                    var e = /[^.]+$/.exec(ue && ue.keys && ue.keys.IE_PROTO || "");
                    return e ? "Symbol(src)_1." + e : ""
                }(),
                pe = le.toString,
                he = RegExp("^" + ce.call(de).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                ge = ne ? Z.Buffer : z,
                me = Z.Symbol,
                ve = Z.Uint8Array,
                be = ge ? ge.a : z,
                ye = s(Object.getPrototypeOf),
                we = Object.create,
                _e = le.propertyIsEnumerable,
                Se = se.splice,
                xe = me ? me.toStringTag : z,
                Pe = function() {
                    try {
                        var e = F(Object, "defineProperty");
                        return e({}, "", {}), e
                    } catch (e) {}
                }(),
                ke = Object.getOwnPropertySymbols,
                De = ge ? ge.isBuffer : z,
                Ee = s(Object.keys),
                Ie = F(Z, "DataView"),
                Te = F(Z, "Map"),
                Ce = F(Z, "Promise"),
                Fe = F(Z, "Set"),
                Ae = F(Z, "WeakMap"),
                Oe = F(Object, "create"),
                Me = O(Ie),
                Re = O(Te),
                Ne = O(Ce),
                Ue = O(Fe),
                Be = O(Ae),
                Le = me ? me.prototype : z,
                je = Le ? Le.valueOf : z,
                Ve = function() {
                    function e() {}
                    return function(t) {
                        return B(t) ? we ? we(t) : (e.prototype = t, t = new e, e.prototype = z, t) : {}
                    }
                }();
            c.prototype.clear = function() {
                this.__data__ = Oe ? Oe(null) : {}, this.size = 0
            }, c.prototype.delete = function(e) {
                return e = this.has(e) && delete this.__data__[e], this.size -= e ? 1 : 0, e
            }, c.prototype.get = function(e) {
                var t = this.__data__;
                return Oe ? "__lodash_hash_undefined__" === (e = t[e]) ? z : e : de.call(t, e) ? t[e] : z
            }, c.prototype.has = function(e) {
                var t = this.__data__;
                return Oe ? t[e] !== z : de.call(t, e)
            }, c.prototype.set = function(e, t) {
                var n = this.__data__;
                return this.size += this.has(e) ? 0 : 1, n[e] = Oe && t === z ? "__lodash_hash_undefined__" : t, this
            }, d.prototype.clear = function() {
                this.__data__ = [], this.size = 0
            }, d.prototype.delete = function(e) {
                var t = this.__data__;
                return !(0 > (e = v(t, e)) || (e == t.length - 1 ? t.pop() : Se.call(t, e, 1), --this.size, 0))
            }, d.prototype.get = function(e) {
                var t = this.__data__;
                return 0 > (e = v(t, e)) ? z : t[e][1]
            }, d.prototype.has = function(e) {
                return -1 < v(this.__data__, e)
            }, d.prototype.set = function(e, t) {
                var n = this.__data__,
                    r = v(n, e);
                return 0 > r ? (++this.size, n.push([e, t])) : n[r][1] = t, this
            }, f.prototype.clear = function() {
                this.size = 0, this.__data__ = {
                    hash: new c,
                    map: new(Te || d),
                    string: new c
                }
            }, f.prototype.delete = function(e) {
                return e = C(this, e).delete(e), this.size -= e ? 1 : 0, e
            }, f.prototype.get = function(e) {
                return C(this, e).get(e)
            }, f.prototype.has = function(e) {
                return C(this, e).has(e)
            }, f.prototype.set = function(e, t) {
                var n = C(this, e),
                    r = n.size;
                return n.set(e, t), this.size += n.size == r ? 0 : 1, this
            }, p.prototype.add = p.prototype.push = function(e) {
                return this.__data__.set(e, "__lodash_hash_undefined__"), this
            }, p.prototype.has = function(e) {
                return this.__data__.has(e)
            }, h.prototype.clear = function() {
                this.__data__ = new d, this.size = 0
            }, h.prototype.delete = function(e) {
                var t = this.__data__;
                return e = t.delete(e), this.size = t.size, e
            }, h.prototype.get = function(e) {
                return this.__data__.get(e)
            }, h.prototype.has = function(e) {
                return this.__data__.has(e)
            }, h.prototype.set = function(e, t) {
                var n = this.__data__;
                if (n instanceof d) {
                    var r = n.__data__;
                    if (!Te || 199 > r.length) return r.push([e, t]), this.size = ++n.size, this;
                    n = this.__data__ = new f(r)
                }
                return n.set(e, t), this.size = n.size, this
            };
            var He = ke ? function(e) {
                    return null == e ? [] : (e = Object(e), function(e, t) {
                        for (var n = -1, r = null == e ? 0 : e.length, o = 0, i = []; ++n < r;) {
                            var a = e[n];
                            t(a, n, e) && (i[o++] = a)
                        }
                        return i
                    }(ke(e), (function(t) {
                        return _e.call(e, t)
                    })))
                } : H,
                qe = ke ? function(e) {
                    for (var t = []; e;) r(t, He(e)), e = ye(e);
                    return t
                } : H,
                ze = _;
            (Ie && "[object DataView]" != ze(new Ie(new ArrayBuffer(1))) || Te && "[object Map]" != ze(new Te) || Ce && "[object Promise]" != ze(Ce.resolve()) || Fe && "[object Set]" != ze(new Fe) || Ae && "[object WeakMap]" != ze(new Ae)) && (ze = function(e) {
                var t = _(e);
                if (e = (e = "[object Object]" == t ? e.constructor : z) ? O(e) : "") switch (e) {
                    case Me:
                        return "[object DataView]";
                    case Re:
                        return "[object Map]";
                    case Ne:
                        return "[object Promise]";
                    case Ue:
                        return "[object Set]";
                    case Be:
                        return "[object WeakMap]"
                }
                return t
            });
            var Ge = S(function() {
                    return arguments
                }()) ? S : function(e) {
                    return L(e) && de.call(e, "callee") && !_e.call(e, "callee")
                },
                $e = Array.isArray,
                We = De || q,
                Ye = oe ? i(oe) : function(e) {
                    return L(e) && "[object Map]" == ze(e)
                },
                Je = ie ? i(ie) : function(e) {
                    return L(e) && "[object Set]" == ze(e)
                },
                Qe = ae ? i(ae) : function(e) {
                    return L(e) && U(e.length) && !!Y[_(e)]
                };
            u.keys = j, u.keysIn = V, u.cloneDeep = function(e) {
                return y(e, 5)
            }, u.eq = M, u.isArguments = Ge, u.isArray = $e, u.isArrayLike = R, u.isBuffer = We, u.isEqual = function(e, t) {
                return x(e, t)
            }, u.isFunction = N, u.isLength = U, u.isMap = Ye, u.isNil = function(e) {
                return null == e
            }, u.isObject = B, u.isObjectLike = L, u.isSet = Je, u.isTypedArray = Qe, u.stubArray = H, u.stubFalse = q, u.VERSION = "4.17.5", Z._ = u
        }.call(this), n.exports
    }).call({});
    const i_ = globalThis._;
    delete globalThis._;
    var a_ = {
        controller: {
            init: function() {
                (function() {
                    if (Array.prototype.flat) return;
                    Array.prototype.flat = function() {
                        const e = [...this],
                            t = [];
                        for (const n of e) Array.isArray(n) ? t.push(...n) : t.push(n);
                        return t
                    }
                })(), String.prototype.replaceAll || (String.prototype.replaceAll = function(e, t) {
                    return this.split(e).join(t)
                })
            }
        }
    };
    var s_ = {
        init: function() {
            globalThis.log = u.features.log ? (...e) => {
                console.log(...e)
            } : () => {}, globalThis.error = (...e) => {
                console.error(...e)
            }, globalThis.warn = (...e) => {
                console.warn(...e)
            }, globalThis.dir = (...e) => {
                console.dir(...e)
            }
        }
    };

    function l_(e) {
        const t = chrome.i18n.getMessage(e);
        if ("" === t) throw new Error(`i18n: no message found for id '${e}'`);
        return t
    }
    var u_ = {
            controller: {
                init: function() {
                    globalThis.lo = l_
                }
            }
        },
        c_ = t(function() {
            var e = {
                    exports: this
                },
                t = function() {
                    var e = String.fromCharCode,
                        t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                        n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
                        r = {};

                    function o(e, t) {
                        if (!r[e]) {
                            r[e] = {};
                            for (var n = 0; n < e.length; n++) r[e][e.charAt(n)] = n
                        }
                        return r[e][t]
                    }
                    var i = {
                        compressToBase64: function(e) {
                            if (null == e) return "";
                            var n = i._compress(e, 6, (function(e) {
                                return t.charAt(e)
                            }));
                            switch (n.length % 4) {
                                default:
                                case 0:
                                    return n;
                                case 1:
                                    return n + "===";
                                case 2:
                                    return n + "==";
                                case 3:
                                    return n + "="
                            }
                        },
                        decompressFromBase64: function(e) {
                            return null == e ? "" : "" == e ? null : i._decompress(e.length, 32, (function(n) {
                                return o(t, e.charAt(n))
                            }))
                        },
                        compressToUTF16: function(t) {
                            return null == t ? "" : i._compress(t, 15, (function(t) {
                                return e(t + 32)
                            })) + " "
                        },
                        decompressFromUTF16: function(e) {
                            return null == e ? "" : "" == e ? null : i._decompress(e.length, 16384, (function(t) {
                                return e.charCodeAt(t) - 32
                            }))
                        },
                        compressToUint8Array: function(e) {
                            for (var t = i.compress(e), n = new Uint8Array(2 * t.length), r = 0, o = t.length; r < o; r++) {
                                var a = t.charCodeAt(r);
                                n[2 * r] = a >>> 8, n[2 * r + 1] = a % 256
                            }
                            return n
                        },
                        decompressFromUint8Array: function(t) {
                            if (null == t) return i.decompress(t);
                            for (var n = new Array(t.length / 2), r = 0, o = n.length; r < o; r++) n[r] = 256 * t[2 * r] + t[2 * r + 1];
                            var a = [];
                            return n.forEach((function(t) {
                                a.push(e(t))
                            })), i.decompress(a.join(""))
                        },
                        compressToEncodedURIComponent: function(e) {
                            return null == e ? "" : i._compress(e, 6, (function(e) {
                                return n.charAt(e)
                            }))
                        },
                        decompressFromEncodedURIComponent: function(e) {
                            return null == e ? "" : "" == e ? null : (e = e.replace(/ /g, "+"), i._decompress(e.length, 32, (function(t) {
                                return o(n, e.charAt(t))
                            })))
                        },
                        compress: function(t) {
                            return i._compress(t, 16, (function(t) {
                                return e(t)
                            }))
                        },
                        _compress: function(e, t, n) {
                            if (null == e) return "";
                            var r, o, i, a = {},
                                s = {},
                                l = "",
                                u = "",
                                c = "",
                                d = 2,
                                f = 3,
                                p = 2,
                                h = [],
                                g = 0,
                                m = 0;
                            for (i = 0; i < e.length; i += 1)
                                if (l = e.charAt(i), Object.prototype.hasOwnProperty.call(a, l) || (a[l] = f++, s[l] = !0), u = c + l, Object.prototype.hasOwnProperty.call(a, u)) c = u;
                                else {
                                    if (Object.prototype.hasOwnProperty.call(s, c)) {
                                        if (c.charCodeAt(0) < 256) {
                                            for (r = 0; r < p; r++) g <<= 1, m == t - 1 ? (m = 0, h.push(n(g)), g = 0) : m++;
                                            for (o = c.charCodeAt(0), r = 0; r < 8; r++) g = g << 1 | 1 & o, m == t - 1 ? (m = 0, h.push(n(g)), g = 0) : m++, o >>= 1
                                        } else {
                                            for (o = 1, r = 0; r < p; r++) g = g << 1 | o, m == t - 1 ? (m = 0, h.push(n(g)), g = 0) : m++, o = 0;
                                            for (o = c.charCodeAt(0), r = 0; r < 16; r++) g = g << 1 | 1 & o, m == t - 1 ? (m = 0, h.push(n(g)), g = 0) : m++, o >>= 1
                                        }
                                        0 == --d && (d = Math.pow(2, p), p++), delete s[c]
                                    } else
                                        for (o = a[c], r = 0; r < p; r++) g = g << 1 | 1 & o, m == t - 1 ? (m = 0, h.push(n(g)), g = 0) : m++, o >>= 1;
                                    0 == --d && (d = Math.pow(2, p), p++), a[u] = f++, c = String(l)
                                } if ("" !== c) {
                                if (Object.prototype.hasOwnProperty.call(s, c)) {
                                    if (c.charCodeAt(0) < 256) {
                                        for (r = 0; r < p; r++) g <<= 1, m == t - 1 ? (m = 0, h.push(n(g)), g = 0) : m++;
                                        for (o = c.charCodeAt(0), r = 0; r < 8; r++) g = g << 1 | 1 & o, m == t - 1 ? (m = 0, h.push(n(g)), g = 0) : m++, o >>= 1
                                    } else {
                                        for (o = 1, r = 0; r < p; r++) g = g << 1 | o, m == t - 1 ? (m = 0, h.push(n(g)), g = 0) : m++, o = 0;
                                        for (o = c.charCodeAt(0), r = 0; r < 16; r++) g = g << 1 | 1 & o, m == t - 1 ? (m = 0, h.push(n(g)), g = 0) : m++, o >>= 1
                                    }
                                    0 == --d && (d = Math.pow(2, p), p++), delete s[c]
                                } else
                                    for (o = a[c], r = 0; r < p; r++) g = g << 1 | 1 & o, m == t - 1 ? (m = 0, h.push(n(g)), g = 0) : m++, o >>= 1;
                                0 == --d && (d = Math.pow(2, p), p++)
                            }
                            for (o = 2, r = 0; r < p; r++) g = g << 1 | 1 & o, m == t - 1 ? (m = 0, h.push(n(g)), g = 0) : m++, o >>= 1;
                            for (;;) {
                                if (g <<= 1, m == t - 1) {
                                    h.push(n(g));
                                    break
                                }
                                m++
                            }
                            return h.join("")
                        },
                        decompress: function(e) {
                            return null == e ? "" : "" == e ? null : i._decompress(e.length, 32768, (function(t) {
                                return e.charCodeAt(t)
                            }))
                        },
                        _decompress: function(t, n, r) {
                            var o, i, a, s, l, u, c, d = [],
                                f = 4,
                                p = 4,
                                h = 3,
                                g = "",
                                m = [],
                                v = {
                                    val: r(0),
                                    position: n,
                                    index: 1
                                };
                            for (o = 0; o < 3; o += 1) d[o] = o;
                            for (a = 0, l = Math.pow(2, 2), u = 1; u != l;) s = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = n, v.val = r(v.index++)), a |= (s > 0 ? 1 : 0) * u, u <<= 1;
                            switch (a) {
                                case 0:
                                    for (a = 0, l = Math.pow(2, 8), u = 1; u != l;) s = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = n, v.val = r(v.index++)), a |= (s > 0 ? 1 : 0) * u, u <<= 1;
                                    c = e(a);
                                    break;
                                case 1:
                                    for (a = 0, l = Math.pow(2, 16), u = 1; u != l;) s = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = n, v.val = r(v.index++)), a |= (s > 0 ? 1 : 0) * u, u <<= 1;
                                    c = e(a);
                                    break;
                                case 2:
                                    return ""
                            }
                            for (d[3] = c, i = c, m.push(c);;) {
                                if (v.index > t) return "";
                                for (a = 0, l = Math.pow(2, h), u = 1; u != l;) s = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = n, v.val = r(v.index++)), a |= (s > 0 ? 1 : 0) * u, u <<= 1;
                                switch (c = a) {
                                    case 0:
                                        for (a = 0, l = Math.pow(2, 8), u = 1; u != l;) s = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = n, v.val = r(v.index++)), a |= (s > 0 ? 1 : 0) * u, u <<= 1;
                                        d[p++] = e(a), c = p - 1, f--;
                                        break;
                                    case 1:
                                        for (a = 0, l = Math.pow(2, 16), u = 1; u != l;) s = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = n, v.val = r(v.index++)), a |= (s > 0 ? 1 : 0) * u, u <<= 1;
                                        d[p++] = e(a), c = p - 1, f--;
                                        break;
                                    case 2:
                                        return m.join("")
                                }
                                if (0 == f && (f = Math.pow(2, h), h++), d[c]) g = d[c];
                                else {
                                    if (c !== p) return null;
                                    g = i + i.charAt(0)
                                }
                                m.push(g), d[p++] = i + g.charAt(0), i = g, 0 == --f && (f = Math.pow(2, h), h++)
                            }
                        }
                    };
                    return i
                }();
            return void 0 !== e && null != e && (e.exports = t), e.exports
        }.call({}));
    const d_ = {
            init: async function() {
                {
                    const e = await this.read();
                    if (e) return e
                } {
                    const e = await this._readStateFromDeprecatedStorage();
                    if (e) return e
                }
                return null
            },
            read: async function() {
                const e = Date.now(),
                    t = await Ey.controller.get("state");
                if (!t) return null;
                const n = this._deuglify(t),
                    r = Date.now() - e;
                return log(`[$synch] state read in ${r}ms`), n
            },
            save: async function(e) {
                const t = Date.now(),
                    n = this._uglify(e);
                await Ey.controller.set("state", n);
                const r = Date.now() - t;
                log(`[$synch] state saved in ${r}ms`)
            },
            _readStateFromDeprecatedStorage: async function() {
                if (!!!(await indexedDB.databases()).find((e => "keyval-store" === e.name))) return null;
                let e, t, n;
                try {
                    e = await new Promise(((e, t) => {
                        const n = indexedDB.open("keyval-store", 1);
                        n.onerror = () => t(n.error), n.onsuccess = () => e(n.result)
                    }))
                } catch (e) {
                    return console.error(e), null
                }
                try {
                    t = await new Promise(((t, n) => {
                        const r = e.transaction("keyval", "readonly").objectStore("keyval").get("state");
                        r.onerror = () => n(r.error), r.onsuccess = () => t(r.result)
                    }))
                } catch (e) {
                    return console.error(e), null
                }
                if (t || "undefined" == typeof localStorage || (t = localStorage.state), !t) return null;
                try {
                    const e = c_.decompressFromUTF16(t);
                    n = JSON.parse(e)
                } catch (e) {
                    return console.error(e), null
                }
                return n
            },
            _uglify: function(e) {
                return btoa(encodeURIComponent(JSON.stringify(e)))
            },
            _deuglify: function(e) {
                return JSON.parse(decodeURIComponent(atob(e)))
            }
        },
        {
            action: f_
        } = Dg;
    var p_ = f_("synch.synch-state", ((e, t) => {
        if (u.is.popup) {
            t.schedule.addCard.saved = e.schedule.addCard.saved;
            for (const n of t.schedule.posts) {
                const t = e.schedule.posts.find((e => e.id === n.id));
                t && (n.saveStatus = t.saveStatus)
            }
        }
        return t
    }));
    const {
        model: h_
    } = Dg, g_ = {
        ...Sy.getTemplateUserState(),
        ...Sy.getTemplateSharedState()
    };
    var m_ = {
        controller: {
            isStorageMaster: !1,
            currentState: null,
            unsubscribe: null,
            storeBatchingId: null,
            synchBatchingId: null,
            init: function(e, t) {
                this.id = e, this.isStorageMaster = t;
                let n = [];
                return chrome.runtime.onMessage.addListener(((t, r, o) => {
                    if (t.sender === e) return !1;
                    if ("synch-state" === t.name) {
                        if (!h_.store) return;
                        return this._onStateUpdatedByPeer(t.deltaState), !1
                    }
                    return "fetch-state" === t.name && (n ? n.push(o) : o(h_.state), !0)
                })), Promise.resolve().then((() => this._fetchState())).then((() => {
                    const e = n;
                    n = null, e.forEach((e => e(h_.state)))
                })).then((() => {
                    this._subscribeToInflux()
                }))
            },
            _fetchState: function() {
                return this.isStorageMaster ? d_.init().then((e => e || g_)).then((e => {
                    this.currentState = e, h_.init(e)
                })) : new Promise((e => {
                    chrome.runtime.sendMessage({
                        name: "fetch-state",
                        sender: this.id
                    }, (t => {
                        this.currentState = t, h_.init(t), e()
                    }))
                }))
            },
            _subscribeToInflux: function(e = !1) {
                this.unsubscribe = h_.observe((e => e), (e => {
                    this.synchBatchingId && clearTimeout(this.synchBatchingId), this.synchBatchingId = setTimeout((() => {
                        this.synchBatchingId = null;
                        const t = this._deltaState(e, this.currentState);
                        this.currentState = e, this._saveToStorage(e), chrome.runtime.sendMessage({
                            name: "synch-state",
                            sender: this.id,
                            deltaState: t
                        })
                    }))
                }), e)
            },
            _onStateUpdatedByPeer: function(e) {
                this.unsubscribe && this.unsubscribe(), this.currentState = {
                    ...h_.state,
                    ...e
                }, p_.dispatch(this.currentState), this._saveToStorage(this.currentState), this._subscribeToInflux(this.currentState !== h_.state)
            },
            _saveToStorage: function(e) {
                this.isStorageMaster && (this.storeBatchingId && clearTimeout(this.storeBatchingId), this.storeBatchingId = setTimeout((() => {
                    this.storeBatchingId = null, d_.save(e)
                }), u.is.development || window.electron ? 1e3 : 3e3))
            },
            _deltaState: function(e, t) {
                const n = {};
                for (const r in e) {
                    const o = e[r];
                    t && t[r] === o || (n[r] = o)
                }
                return n
            }
        },
        storageController: d_
    };
    const {
        model: v_,
        transaction: b_
    } = Dg, y_ = {
        init: function({
            parent: e
        }) {
            this.parent = e, v_.observe((e => e.authStatus ? e.authStatus.username : null), (() => {
                this.updatePromocode()
            }), !1)
        },
        updatePro: async function() {
            await new Promise((e => this.updatePromocode(e)))
        },
        updatePromocode: function(e) {
            log("billing: updating promocode...");
            const {
                username: t,
                userId: n
            } = v_.state.authStatus;
            if (t) {
                const r = {
                    username: t,
                    userId: n
                };
                if (u.options.collectBillingStats) {
                    const {
                        followersCount: e,
                        followingsCount: t,
                        postsCount: o
                    } = v_.state.userDetails[n] || {};
                    "number" == typeof e && (r.followers = e), "number" == typeof t && (r.followings = t), "number" == typeof o && (r.posts = o)
                }
                this.parent.apiSender.send("/promo", {
                    query: r
                }).then((t => {
                    if (!t || "ok" !== t.status) throw t;
                    log(`  received promocode: ${JSON.stringify(t)}`);
                    const n = t && t.expiresAt;
                    v_.state.billing.promocode !== n && b_((e => {
                        e.billing.promocode = n
                    })), this.parent.reply(e, n)
                })).catch((t => {
                    log(`  retrieving promocode failed: ${JSON.stringify(t)}`), this.parent.reply(e, v_.state.billing.promocode)
                }))
            } else log("  no username to retrieve promocode for"), this.parent.reply(e, v_.state.billing.promocode);
            return !!e
        }
    }, {
        model: w_,
        transaction: __
    } = Dg, S_ = {
        init: function({
            parent: e
        }) {
            this.parent = e, w_.observe((e => e.billing.trial), (e => {
                this.updateCookie(e)
            }), !1)
        },
        updatePro: async function() {
            await new Promise((e => this.updateTrial(e)))
        },
        setTrialCookie: async function(e) {
            await this._setCookie({
                name: "tsd",
                value: e
            })
        },
        updateTrial: async function(e) {
            log("billing: updating trial period...");
            const t = w_.state.billing.trial,
                n = await this._getCookie({
                    name: "tsd"
                });
            if (this._isCookieEmpty(n)) return void this.parent.reply(e, t);
            const r = this._mergeTrialValues(t, n);
            r.installedOn || (r.installedOn = Date.now()), i_.isEqual(t, r) || __((e => {
                e.billing.trial = r
            })), i_.isEqual(n, r) || this._setCookie({
                name: "tsd",
                value: r
            }), this.parent.reply(e, r)
        },
        updateCookie: async function(e) {
            const t = await this._getCookie({
                name: "tsd"
            });
            this._isCookieEmpty(t) || (e = this._mergeTrialValues(t, e)), i_.isEqual(t, e) || this._setCookie({
                name: "tsd",
                value: e
            })
        },
        _isCookieEmpty: function(e) {
            return !e || 1 === Object.keys(e).length
        },
        _mergeTrialValues: function(e, t) {
            const n = {
                ...e,
                ...t
            };
            n.installedOn > e.installedOn && (n.installedOn = e.installedOn);
            for (const t in n)(e[t] || 0) > (n[t] || 0) && (n[t] = e[t] || 0);
            return n
        },
        _getCookie: async function({
            name: e
        }) {
            return new Promise((t => {
                chrome.cookies.getAll({
                    url: `https://${u.options.domain}`
                }, (n => {
                    let r = (n || []).filter((t => t.name === e))[0] || {
                        value: ""
                    };
                    r = r.value;
                    try {
                        r = atob(r)
                    } catch (e) {}
                    try {
                        r = JSON.parse(r)
                    } catch (e) {
                        r = null
                    }
                    t(r)
                }))
            }))
        },
        _setCookie: async function({
            name: e,
            value: t
        }) {
            const n = Math.round(Date.now() / 1e3),
                r = n + 31536e4 > 2147483647 ? n + 31536e4 : 2147483647;
            return new Promise((n => {
                chrome.cookies.set({
                    name: e || "cookie",
                    value: btoa(JSON.stringify(t)),
                    url: `https://${u.options.domain}`,
                    path: "/",
                    httpOnly: !1,
                    secure: !1,
                    storeId: "0",
                    domain: u.options.domain,
                    sameSite: "strict",
                    expirationDate: r
                }, n)
            }))
        }
    }, {
        model: x_,
        transaction: P_
    } = Dg, k_ = {
        init: function({
            parent: e
        }) {
            this.parent = e, chrome.runtime.onMessage.addListener(((e, t, n) => "fspring.subscription-success" === e.name ? this.onFSpringSubscriptionSuccess(e, n) : "fspring.subscription-failure" === e.name ? this.onFSpringSubscriptionFailure(e, n) : void 0)), chrome.runtime.onMessage.addListener(((e, t, n) => "update-fspring-status" === e.name && this.updateFSpringStatus(n))), x_.observe((e => e.authStatus ? e.authStatus.username : null), (() => {
                this.recordUsernames()
            }), !0), x_.observe((e => e.billing && e.billing.account ? e.billing.account.token : null), (() => {
                this.recordUsernames()
            }), !1), x_.observe((e => e.billing && e.billing.account ? e.billing.account.token : null), (() => {
                this.updateFSpringStatus()
            }), !1)
        },
        recordUsernames: function() {
            const {
                billing: e,
                authStatus: t
            } = x_.state, n = t.username;
            if (!n) return;
            const r = e.account ? e.account.token : null;
            if (!r) return;
            if (-1 !== e.recordedUsernames.indexOf(n)) return;
            log("billing: updating associated fspring account usernames...");
            const o = {
                usernames: [n]
            };
            this.parent.apiSender.send("/auth/record-usernames", {
                body: o,
                token: r
            }).then((() => {
                P_((e => {
                    e.billing.recordedUsernames = [...e.billing.recordedUsernames, n]
                }))
            })).catch((() => {}))
        },
        updatePro: async function() {
            return new Promise((e => this.updateFSpringStatus(e)))
        },
        updateFSpringStatus: function(e) {
            log("billing: updating fspring status...");
            const {
                billing: t
            } = x_.state, n = t.account ? t.account.token : null;
            if (n) {
                const t = "/fspring/data";
                this.parent.apiSender.send(t, {
                    token: n
                }).then((t => {
                    if (!t || "ok" !== t.status) throw t;
                    P_((e => {
                        e.billing.subscriptions = t.subscriptions || {}, e.billing.products = t.products || {}, e.billing.orders = t.orders || []
                    })), this.parent.reply(e, x_.state.billing)
                })).catch((n => {
                    "TypeError" === n.name && "Failed to fetch" === n.message || ("forbidden" === n.status || "unauthorized" === n.status || "account-not-found" === n.status || "account-is-not-active" === n.status ? P_((e => {
                        e.billing.account.email = null, e.billing.account.token = null
                    })) : cy.controller.sendError(`Unexpected API error at ${t}`, "error", {
                        error: n
                    }, {
                        actor: "auth"
                    })), this.parent.reply(e, x_.state.billing)
                }))
            } else P_((e => {
                e.billing.optimistic = null, e.billing.subscriptions = {}, e.billing.products = {}, e.billing.orders = []
            })), this.parent.reply(e, x_.state.billing);
            return !!e
        },
        onFSpringSubscriptionSuccess: function(e, t) {
            log("billing: handling fspring subscription success..."), P_((e => {
                e.billing.optimistic = {
                    on: Date.now(),
                    plan: e.billing.purchasingPlan.id
                }, e.billing.purchasingPlan = null
            }));
            const n = JSON.stringify({
                    subscriptions: x_.state.billing.subscriptions,
                    products: x_.state.billing.products,
                    orders: x_.state.billing.orders
                }),
                r = Date.now();
            let o = 3e3;
            const i = () => {
                log("billing: polling server for status update..."), x_.state.billing.optimistic && this.updateFSpringStatus((e => {
                    const t = Date.now();
                    t - r > 36e5 ? P_((e => {
                        e.billing.optimistic = null
                    })) : (e = JSON.stringify({
                        subscriptions: e.subscriptions,
                        products: e.products,
                        orders: e.orders
                    }), n === e ? (o = t - r > 3e4 ? 6e5 : 3e3, setTimeout(i, o)) : P_((e => {
                        e.billing.optimistic = null
                    })))
                }))
            };
            return setTimeout(i, o), !!t
        },
        onFSpringSubscriptionFailure: function(e, t) {
            return log("billing: handling fspring subscription failure..."), P_((e => {
                e.billing.purchasingPlan = null
            })), !!t
        }
    };
    var D_ = {
        controller: {
            init: function() {
                this.apiSender = new gm.Sender({
                    urlPrefix: u.options.apiUrl
                }), y_.init({
                    parent: this
                }), S_.init({
                    parent: this
                }), k_.init({
                    parent: this
                });
                return chrome.alarms.create("update-pro", {
                    delayInMinutes: 1440,
                    periodInMinutes: 1440
                }), chrome.alarms.onAlarm.addListener((e => {
                    "update-pro" === e.name && this.updatePro()
                })), chrome.runtime.onMessage.addListener(((e, t, n) => "update-pro" === e.name && this.updatePro())), this
            },
            updatePro: async function() {
                await Promise.all([y_.updatePro(), S_.updatePro(), k_.updatePro()])
            },
            reply: function(e, t) {
                if (e) try {
                    e(t)
                } catch (e) {}
            }
        },
        trialController: S_
    };
    const {
        model: E_
    } = Dg;
    var I_ = {
        init: function() {
            $g.on("overseer.send-report", F_)
        },
        sendReport: F_
    };
    const T_ = ["acknowledged", "analytics", "dm", "experiments", "followUs", "igTask", "igView", "insights", "multiaccount", "rateUs", "sidebar", "tagAssist", "userDetails", "welcome", {
            field: "authStatus",
            cb: e => i_.cloneDeep(e)
        }, {
            field: "authStatus.cookies",
            cb: () => "!sanitized"
        }, {
            field: "billing",
            cb: e => i_.cloneDeep(e)
        }, {
            field: "billing.account.token",
            cb: () => "!sanitized"
        }, {
            field: "schedule",
            cb: e => {
                const t = i_.cloneDeep(e);
                return t && t.posts && (t.posts = t.posts.map((e => (delete e.image, delete e.preview, e)))), t
            }
        }, {
            field: "userStates",
            cb: () => "!ignored"
        }, {
            field: "whatsNew",
            cb: () => "!ignored"
        }],
        C_ = new gm.Sender({
            urlPrefix: u.options.apiUrl
        });
    async function F_({
        key: e,
        filters: t,
        data: n
    } = {}) {
        if (e = e || "system", n = n || {}, (t = t || {}).username || (t.username = Sy.proxy.username() || "unknown"), "string" != typeof n && !n.state) {
            const e = E_.state,
                t = {};
            T_.forEach((n => {
                if ("string" == typeof n) t[n] = e[n];
                else {
                    const r = e[n.field];
                    t[n.field] = n.cb(r)
                }
            })), n.state = t
        }
        "string" == typeof n || n.schedule || (n.schedule = await Hw.controller.getReport());
        try {
            n = JSON.stringify(n)
        } catch (e) {
            n = e.message
        }
        const r = {
            key: e,
            filters: t,
            data: n
        };
        u.is.development && $g.send("popup.log", "%coverseer report [background]", "color: #c818dc", {
            key: e,
            filters: t,
            data: JSON.parse(n)
        }), C_.send("/overseer", {
            body: r
        }).then((t => {
            log(`overseer ${e} report of ${n.length} bytes was sent`)
        })).catch((t => {
            error(`! failed sending ${e} overseer report of ${n.length} bytes:`), error(t)
        }))
    }
    var A_ = {
        controller: I_
    };
    const {
        model: O_,
        transaction: M_
    } = Dg, R_ = e => "string" != typeof e && "boolean" != typeof e && "number" != typeof e ? JSON.stringify(e) : e, N_ = function(e) {
        console.log(`%c[test] ${R_(e)}`, "color: #3d9d30")
    }, U_ = function(e) {
        console.log(`%c[test] ${R_(e)}`, "color: #e94b35")
    }, B_ = function(e) {
        console.log(R_(e))
    }, L_ = {
        init: function() {
            globalThis.$env = u, globalThis.ig = Ug, globalThis.utils = S, globalThis.$igApi = jg, globalThis.$fbApi = Tw, globalThis.$eventBus = _w, globalThis.$chromeBus = $g, globalThis.$iframeBus = yw, globalThis.$abTesting = aw, globalThis.$ga = lw, globalThis.$fetcher = Rg, globalThis.$coreBilling = D_, globalThis.$idb = Ey, globalThis.$sentry = cy, globalThis.$overseer = A_, globalThis.$insights = n_, globalThis.setState = this.setState, globalThis.downgradeVersion = this.downgradeVersion, globalThis.testGetSkuDetails = this.testGetSkuDetails, globalThis.testGetPurchases = this.testGetPurchases, globalThis.testAll = this.testAll, globalThis.errorsDelta = this.errorsDelta, globalThis.activityDelta = this.activityDelta, globalThis.countMadeActions = this.countMadeActions, (u.is.development || u.is.beta) && (globalThis.model = O_, globalThis.transaction = M_, globalThis.$utils = L, globalThis.$synch = m_, globalThis.$state = Sy, globalThis.$later = Wg, globalThis.$files = sw, globalThis.$influx = Dg, globalThis.$chromeStarter = uw, globalThis.unbanAllTasks = this.unbanAllTasks, this.defineCommit())
        },
        countMadeActions: function(e = 86400) {
            const t = globalThis.__debug.state,
                n = S.getUnixTime(),
                r = {
                    likes: 0
                };
            for (let o = 0; o < t.stats.activity.length; o++) {
                const i = t.stats.activity[o];
                if (n - i.on > e) break;
                "like" === i.type && r.likes++
            }
            return r
        },
        errorsDelta: function() {
            const e = globalThis.__debug.errors;
            let t = e[0].on;
            e.forEach((e => {
                log((t - e.on) / 60), t = e.on
            }))
        },
        activityDelta: function() {
            const e = globalThis.__debug.state.stats.activity;
            let t = e[0].on;
            globalThis.__debug.state.stats.activity = e.map((e => {
                const n = t;
                return t = e.on, {
                    ...e,
                    since: Math.floor((n - e.on) / 60)
                }
            }))
        },
        setState: function(e) {
            const t = i_.cloneDeep(e);
            Sy.replaceState.dispatch(t)
        },
        downgradeVersion: function() {
            const e = i_.cloneDeep(O_.state);
            e.version = e.version - 1, Sy.replaceState.dispatch(e)
        },
        unbanAllTasks: function() {
            const e = i_.cloneDeep(O_.state);
            e.stats.activity = e.stats.activity.filter((e => "ban" !== e.type)), Sy.replaceState.dispatch(e)
        },
        testGetSkuDetails: function() {
            return N_("billing.getSkuDetails..."), new Promise((e => {
                google.payments.inapp.getSkuDetails({
                    parameters: {
                        env: "prod"
                    },
                    success: t => {
                        N_("  success:"), B_(t), e()
                    },
                    failure: t => {
                        u.is.development && t && t.response && "INVALID_RESPONSE_ERROR" === t.response.errorType ? N_("  success:") : U_("  failure:"), B_(t), e()
                    }
                })
            }))
        },
        testGetPurchases: function() {
            return N_("billing.getPurchases..."), new Promise((e => {
                google.payments.inapp.getPurchases({
                    parameters: {
                        env: "prod"
                    },
                    success: t => {
                        N_("  success:"), B_(t), e()
                    },
                    failure: t => {
                        U_("  failure:"), B_(t), e()
                    }
                })
            }))
        },
        testAll: function() {
            new Promise((e => {
                setTimeout(e, 0)
            })).then(L_.testGetSkuDetails).then(L_.testGetPurchases)
        },
        defineCommit: function() {
            Object.defineProperty(globalThis, "commit", {
                get: () => (this.setState(O_.state), null)
            })
        }
    };
    var j_ = {
            controller: L_
        },
        V_ = {
            init: async function() {
                await async function() {
                    for (const e of H_) {
                        const t = (await L.callAsync(chrome.cookies.getAll, {
                            url: e
                        })).filter((e => "unspecified" === e.sameSite));
                        await Promise.all(t.map((async t => {
                            e.startsWith("http://") ? await L.callAsync(chrome.cookies.remove, {
                                url: e,
                                name: t.name
                            }) : await L.callAsync(chrome.cookies.set, {
                                url: e,
                                name: t.name,
                                value: t.value,
                                domain: t.domain,
                                path: t.path,
                                secure: !0,
                                httpOnly: t.httpOnly,
                                sameSite: "no_restriction",
                                expirationDate: t.expirationDate,
                                storeId: t.storeId
                            })
                        })))
                    }
                }(), chrome.webRequest.onHeadersReceived.addListener(q_, {
                    urls: H_
                }, ["blocking", "responseHeaders", "extraHeaders"])
            }
        };
    const H_ = ["http://*.instagram.com/*", "https://*.instagram.com/*", "https://*.facebook.com/*", "http://*.doubleclick.net/*"];

    function q_(e) {
        return e.responseHeaders.forEach((e => {
            "set-cookie" === e.name && -1 !== e.value.indexOf("Secure") && (-1 !== e.value.indexOf("SameSite=Strict") ? e.value = e.value.replace(/SameSite=Strict/g, "SameSite=None") : -1 !== e.value.indexOf("SameSite=Lax") ? e.value = e.value.replace(/SameSite=Lax/g, "SameSite=None") : e.value = e.value.replace(/; Secure/g, "; SameSite=None; Secure"))
        })), {
            responseHeaders: e.responseHeaders
        }
    }
    var z_ = {
        controller: V_
    };

    function G_(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    var $_ = {},
        W_ = {
            update: function(e) {
                if (!e.userStates) return e;
                const t = {
                    ...e,
                    tagAssist: {
                        ...e.tagAssist,
                        relevantTags: []
                    }
                };
                return delete t.tagAssist.foundTags, t
            }
        };
    r($_, "default", (function() {
        return W_
    })), n($_);
    var Y_ = {},
        J_ = {
            update: function(e) {
                return e.userStates && Ey.controller.delete("tag-assist.tag-data"), e
            }
        };
    r(Y_, "default", (function() {
        return J_
    })), n(Y_);
    var Q_ = {},
        K_ = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    tagAssist: {
                        ...e.tagAssist,
                        ladderConfig: {
                            lastUpdateOn: Date.now(),
                            tiers: {
                                low: .7,
                                medium: 1.5,
                                high: 5
                            }
                        }
                    }
                } : e
            }
        };
    r(Q_, "default", (function() {
        return K_
    })), n(Q_);
    var X_ = {},
        Z_ = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    tagAssist: {
                        ...e.tagAssist,
                        ladder: null
                    }
                } : e
            }
        };
    r(X_, "default", (function() {
        return Z_
    })), n(X_);
    var eS = {},
        tS = {
            update: function(e) {
                return e.userStates && Ey.controller.delete("tag-assist.tag-data"), e
            }
        };
    r(eS, "default", (function() {
        return tS
    })), n(eS);
    var nS = {},
        rS = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    tagAssist: {
                        ...e.tagAssist,
                        selectedTabId: "search"
                    }
                } : e
            }
        };
    r(nS, "default", (function() {
        return rS
    })), n(nS);
    var oS = {},
        iS = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    tagAssist: {
                        ...e.tagAssist,
                        newCollection: {
                            name: "",
                            text: "",
                            showForm: !1
                        },
                        collections: e.tagAssist.collections.map((e => ({
                            ...e,
                            editing: !1,
                            editName: "",
                            editText: ""
                        })))
                    }
                } : e
            }
        };
    r(oS, "default", (function() {
        return iS
    })), n(oS);
    var aS = {},
        sS = {
            update: function(e) {
                if (!e.userStates) return e;
                const t = {
                    ...e,
                    tagAssist: {
                        ...e.tagAssist,
                        selectedGroupId: "low",
                        ladderLoadingTags: [],
                        collectionsTagData: {},
                        collectionsLoadingTags: []
                    }
                };
                return delete t.tagAssist.relevantTags, delete t.tagAssist.loadingTags, t
            }
        };
    r(aS, "default", (function() {
        return sS
    })), n(aS);
    var lS = {},
        uS = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    tagAssist: {
                        ...e.tagAssist,
                        engagementSort: null
                    }
                } : e
            }
        };
    r(lS, "default", (function() {
        return uS
    })), n(lS);
    var cS = {},
        dS = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    tagAssist: {
                        ...e.tagAssist,
                        lastDayUsedOn: null
                    },
                    billing: {
                        ...e.billing,
                        trial: {
                            ...e.billing.trial,
                            tagAssist: 0
                        }
                    }
                } : e
            }
        };
    r(cS, "default", (function() {
        return dS
    })), n(cS);
    var fS = {},
        pS = {
            update: function(e) {
                if (!e.userStates) return e;
                const t = e.billing.trial;
                return {
                    ...e,
                    billing: {
                        ...e.billing,
                        trial: {
                            ...t,
                            installedOn: t.installedOn || Date.now(),
                            dmAdvanced: t.dmAdvanced || 0,
                            schedule: t.schedule || 0,
                            insights: t.insights || 0,
                            analytics: t.analytics || 0,
                            zen: t.zen || 0,
                            coverAssist: t.coverAssist || 0,
                            tagAssist: t.tagAssist || 0,
                            addLinkToStory: t.addLinkToStory || 0,
                            postsPublished: t.postsPublished || 0,
                            storiesPublished: t.storiesPublished || 0,
                            dmsSent: t.dmsSent || 0,
                            repost: t.repost || 0
                        }
                    }
                }
            }
        };
    r(fS, "default", (function() {
        return pS
    })), n(fS);
    var hS = {},
        gS = {
            update: function(e) {
                if (!e.userStates) return e;
                const t = {
                    ...e,
                    tagAssist: {
                        ...e.tagAssist,
                        ladderEngagementSort: e.tagAssist.engagementSort,
                        summaryEngagementSort: null
                    }
                };
                return delete t.tagAssist.engagementSort, t
            }
        };
    r(hS, "default", (function() {
        return gS
    })), n(hS);
    var mS = {},
        vS = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    tagAssist: {
                        ...e.tagAssist,
                        preselectedTags: [],
                        preselectedText: ""
                    }
                } : e
            }
        };
    r(mS, "default", (function() {
        return vS
    })), n(mS);
    var bS = {},
        yS = {
            update: function(e) {
                return {
                    ...e,
                    reels: {
                        supported: !1
                    }
                }
            }
        };
    r(bS, "default", (function() {
        return yS
    })), n(bS);
    var wS = {},
        _S = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    billing: {
                        ...e.billing,
                        trial: {
                            ...e.billing.trial,
                            reels: 0
                        }
                    }
                } : e
            }
        };
    r(wS, "default", (function() {
        return _S
    })), n(wS);
    var SS = {},
        xS = {
            update: function(e) {
                return {
                    ...e,
                    reels: {
                        ...e.reels,
                        creating: !1
                    }
                }
            }
        };
    r(SS, "default", (function() {
        return xS
    })), n(SS);
    var PS = {},
        kS = {
            update: function(e) {
                return {
                    ...e,
                    authStatus: {
                        ...e.authStatus,
                        isMobileSession: !1
                    }
                }
            }
        };
    r(PS, "default", (function() {
        return kS
    })), n(PS);
    var DS = {},
        ES = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    billing: {
                        ...e.billing,
                        recentFeature: null
                    }
                } : e
            }
        };
    r(DS, "default", (function() {
        return ES
    })), n(DS);
    var IS = {},
        TS = {
            update: function(e) {
                const t = {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        loading: !1
                    }
                };
                return delete t.schedule.isRefreshingGrid, t
            }
        };
    r(IS, "default", (function() {
        return TS
    })), n(IS);
    var CS = {},
        FS = {
            update: function(e) {
                const t = {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        navigation: {
                            ...e.schedule.navigation
                        }
                    }
                };
                return delete t.schedule.navigation.fcsTitle, t
            }
        };
    r(CS, "default", (function() {
        return FS
    })), n(CS);
    var AS = {},
        OS = {
            update: function(e) {
                return {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        filters: {
                            ...e.schedule.filters,
                            mediaTypes: e.schedule.filters.mediaTypes.filter((e => "igtv" !== e))
                        }
                    }
                }
            }
        };
    r(AS, "default", (function() {
        return OS
    })), n(AS);
    var MS = {},
        RS = {
            update: function(e) {
                const t = {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        posts: [...e.schedule.localPosts.map((e => ({
                            id: e.id,
                            source: "local",
                            type: e.type,
                            status: "draft",
                            image: e.image,
                            preview: null,
                            imageAvgColor: e.imageAverageColor,
                            on: e.on,
                            createdOn: Date.now(),
                            stats: null,
                            crosspostToFb: null,
                            draftOrder: e.draftOrder
                        }))), ...e.schedule.fcsPosts.map((e => ({
                            id: e.id,
                            source: "fcs",
                            type: e.type,
                            status: e.status,
                            image: e.image,
                            preview: e.preview,
                            imageAvgColor: e.imageAverageColor,
                            on: e.on,
                            stats: e.stats ? {
                                ...e.stats
                            } : null,
                            crosspostToFb: e.crosspostToFb,
                            draftOrder: e.draftOrder
                        })))]
                    }
                };
                return delete t.schedule.igPosts, delete t.schedule.fcsPosts, delete t.schedule.localPosts, t
            }
        };
    r(MS, "default", (function() {
        return RS
    })), n(MS);
    var NS = {},
        US = {
            update: function(e) {
                const t = {
                    ...e,
                    schedule: {
                        ...e.schedule
                    }
                };
                if (e.userStates) {
                    const n = [e, ...Object.values(e.userStates)];
                    t.acknowledged = {
                        ...e.acknowledged,
                        scheduleDndTip: n.some((e => e.schedule.isDndTipAcknowledged)) ? Date.now() : -1
                    }
                }
                return delete t.schedule.isDndTipAcknowledged, t
            }
        };
    r(NS, "default", (function() {
        return US
    })), n(NS);
    var BS = {},
        LS = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    installedEventSent: !0,
                    tagAssist: {
                        ...e.tagAssist,
                        tagMetricsUpsellDismissed: !1
                    }
                } : e
            }
        };
    r(BS, "default", (function() {
        return LS
    })), n(BS);
    var jS = {},
        VS = {
            update: function(e) {
                if (!e.userStates) return e;
                const t = {
                    ...e,
                    tagAssist: {
                        ...e.tagAssist,
                        igSelectedTags: [...e.tagAssist.selectedTags],
                        fcsSelectedTags: [],
                        sidebarSelectedTags: [...e.tagAssist.preselectedTags],
                        sidebarSelectedTagsAsText: [...e.tagAssist.preselectedText]
                    }
                };
                return delete t.tagAssist.selectedTags, delete t.tagAssist.preselectedTags, delete t.tagAssist.preselectedText, t
            }
        };
    r(jS, "default", (function() {
        return VS
    })), n(jS);
    var HS = {},
        qS = {
            update: function(e) {
                return {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        showTagAssist: !1
                    }
                }
            }
        };
    r(HS, "default", (function() {
        return qS
    })), n(HS);
    var zS = {},
        GS = {
            update: function(e) {
                const t = {
                    ...e,
                    reels: {
                        ...e.reels
                    }
                };
                return delete t.reels.supported, t
            }
        };
    r(zS, "default", (function() {
        return GS
    })), n(zS);
    var $S = {},
        WS = {
            update: function(e) {
                return chrome.alarms.clearAll(), {
                    ...e,
                    analytics: {
                        ...e.analytics,
                        scheduleDay: -1,
                        scheduleHour: 21
                    }
                }
            }
        };
    r($S, "default", (function() {
        return WS
    })), n($S);
    var YS = {},
        JS = {
            update: function(e) {
                let t;
                if (e.userStats) {
                    delete {
                        ...e,
                        billing: {
                            ...e.billing,
                            trial: {
                                ...e.billing.trial
                            }
                        }
                    }.billing.trial.zen
                } else t = {
                    ...e,
                    zen: {
                        ...e.zen
                    }
                }, delete t.zen.lastTrialUpdateOn;
                return t
            }
        };
    r(YS, "default", (function() {
        return JS
    })), n(YS);
    var QS = {},
        KS = {
            update: function(e) {
                return e.userStats ? {
                    ...e,
                    tagAssist: {
                        ...e.tagAssist,
                        lastTagScanOn: null
                    }
                } : e
            }
        };
    r(QS, "default", (function() {
        return KS
    })), n(QS);
    var XS = {},
        ZS = {
            update: function(e) {
                return {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        filters: {
                            showInfo: e.schedule.filters.showInfo,
                            photo: e.schedule.filters.mediaTypes.includes("photo"),
                            video: e.schedule.filters.mediaTypes.includes("video"),
                            carousel: e.schedule.filters.mediaTypes.includes("carousel"),
                            posted: e.schedule.filters.statuses.includes("posted"),
                            local: e.schedule.filters.statuses.includes("local"),
                            draft: e.schedule.filters.statuses.includes("draft"),
                            scheduled: e.schedule.filters.statuses.includes("scheduled")
                        }
                    }
                }
            }
        };
    r(XS, "default", (function() {
        return ZS
    })), n(XS);
    var ex = {},
        tx = {
            update: function(e) {
                const t = {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        fileUploadErrors: [...e.schedule.bulkUploadErrors]
                    }
                };
                return delete t.schedule.bulkUploadErrors, t
            }
        };
    r(ex, "default", (function() {
        return tx
    })), n(ex);
    var nx = {},
        rx = {
            update: function(e) {
                const t = {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        addCardAttention: !1
                    }
                };
                return delete t.schedule.gridAddCardAttention, t
            }
        };
    r(nx, "default", (function() {
        return rx
    })), n(nx);
    var ox = {},
        ix = {
            update: function(e) {
                const t = {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        addCard: {
                            saved: !1,
                            fileCount: 0,
                            attention: e.schedule.addCardAttention,
                            draggingFiles: !1,
                            selectedOption: "multiple"
                        }
                    }
                };
                return delete t.schedule.addCardAttention, t
            }
        };
    r(ox, "default", (function() {
        return ix
    })), n(ox);
    var ax = {},
        sx = {
            update: function(e) {
                return {
                    ...e,
                    bulk: {
                        saving: !1,
                        selectedPostIds: [],
                        actions: {}
                    }
                }
            }
        };
    r(ax, "default", (function() {
        return sx
    })), n(ax);
    var lx = {},
        ux = {
            update: function(e) {
                return {
                    ...e,
                    bulk: {
                        ...e.bulk,
                        activeActionId: null
                    }
                }
            }
        };
    r(lx, "default", (function() {
        return ux
    })), n(lx);
    var cx = {},
        dx = {
            update: function(e) {
                return {
                    ...e,
                    bulk: {
                        ...e.bulk,
                        dateDialog: {
                            selectedTypeId: "interval",
                            calendar: {
                                periodStart: null,
                                selectedDay: null,
                                selectedSlotTime: null,
                                customTime: null,
                                timezone: null,
                                isTimeError: !1
                            },
                            interval: {
                                frequency: "1:1",
                                timeListetuser: [{
                                    selectedSlotTime: null,
                                    customTime: null
                                }]
                            },
                            week: {
                                selectedDays: [],
                                selectedSlotTime: null,
                                customTime: null
                            }
                        }
                    }
                }
            }
        };
    r(cx, "default", (function() {
        return dx
    })), n(cx);
    var fx = {},
        px = {
            update: function(e) {
                const t = {
                    ...e,
                    bulk: {
                        ...e.bulk,
                        dateDialog: {
                            show: !1,
                            ...e.bulk.dateDialog,
                            calendar: {
                                ...e.bulk.dateDialog.calendar,
                                errorMessage: null
                            }
                        }
                    }
                };
                return delete t.bulk.dateDialog.calendar.isTimeError, t
            }
        };
    r(fx, "default", (function() {
        return px
    })), n(fx);
    var hx = {},
        gx = {
            update: function(e) {
                return {
                    ...e,
                    bulk: {
                        ...e.bulk,
                        dateDialog: {
                            ...e.bulk.dateDialog,
                            week: {
                                ...e.bulk.dateDialog.week,
                                dayErrorMessage: null,
                                timeErrorMessage: null
                            },
                            timeSlots: {
                                errorMessage: null
                            }
                        }
                    }
                }
            }
        };
    r(hx, "default", (function() {
        return gx
    })), n(hx);
    var mx = {},
        vx = {
            update: function(e) {
                return {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        isDraggingPost: !1
                    }
                }
            }
        };
    r(mx, "default", (function() {
        return vx
    })), n(mx);
    var bx = {},
        yx = {
            update: function(e) {
                return {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        addCard: {
                            ...e.schedule.addCard,
                            savingTitle: null,
                            savingText: null
                        }
                    }
                }
            }
        };
    r(bx, "default", (function() {
        return yx
    })), n(bx);
    var wx = {},
        _x = {
            update: function(e) {
                const t = {
                    ...e,
                    schedule: {
                        ...e.schedule
                    }
                };
                return delete t.schedule.hasUncommitedChanges, delete t.schedule.tasks, t
            }
        };
    r(wx, "default", (function() {
        return _x
    })), n(wx);
    var Sx = {},
        xx = {
            update: function(e) {
                return {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        addCard: {
                            ...e.schedule.addCard,
                            savingPreview: null
                        }
                    }
                }
            }
        };
    r(Sx, "default", (function() {
        return xx
    })), n(Sx);
    var Px = {},
        kx = {
            update: function(e) {
                return {
                    ...e,
                    bulk: {
                        ...e.bulk,
                        startingDay: {
                            selectedTypeId: "today",
                            periodStart: null,
                            selectedDay: null
                        }
                    }
                }
            }
        };
    r(Px, "default", (function() {
        return kx
    })), n(Px);
    var Dx = {},
        Ex = {
            update: function(e) {
                const t = {
                    ...e,
                    dm: {
                        ...e.dm
                    }
                };
                return delete t.dm.supported, t
            }
        };
    r(Dx, "default", (function() {
        return Ex
    })), n(Dx);
    var Ix = {},
        Tx = {
            update: function(e) {
                return {
                    ...e,
                    dm: {
                        ...e.dm,
                        ghostModeEnabled: !0
                    }
                }
            }
        };
    r(Ix, "default", (function() {
        return Tx
    })), n(Ix);
    var Cx = {},
        Fx = {
            update: function(e) {
                const t = {
                    ...e
                };
                return delete t.analytics, delete t.insights, async function() {
                    const e = await Ey.controller.getAllKeys();
                    for (const t of e)(t.startsWith("insights.") || t.startsWith("block:analytics:")) && Ey.controller.delete(t)
                }(), t
            }
        };
    r(Cx, "default", (function() {
        return Fx
    })), n(Cx);
    var Ax = {},
        Ox = {
            update: function(e) {
                return {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        fcsSetup: {
                            ...e.schedule.fcsSetup,
                            newApi: !0,
                            flipApiOnFail: !1
                        }
                    }
                }
            }
        };
    r(Ax, "default", (function() {
        return Ox
    })), n(Ax);
    var Mx = {},
        Rx = {
            update: function(e) {
                const t = {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        fcsSetup: {
                            ...e.schedule.fcsSetup,
                            attempted: !1,
                            failed: !1
                        }
                    }
                };
                return delete t.schedule.fcsSetup.flipApiOnFail, t
            }
        };
    r(Mx, "default", (function() {
        return Rx
    })), n(Mx);
    var Nx = {},
        Ux = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    acknowledged: {
                        ...e.acknowledged,
                        discount: -1
                    },
                    billing: {
                        ...e.billing,
                        discount: {
                            available: !1,
                            showSnackbarMessage: !1
                        }
                    }
                } : e
            }
        };
    r(Nx, "default", (function() {
        return Ux
    })), n(Nx);
    var Bx = {},
        Lx = {
            update: function(e) {
                const t = {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        fcsSetup: {
                            ...e.schedule.fcsSetup,
                            steps: {
                                fbLogin: null,
                                igProfessional: null,
                                igConnectedToFbPage: null
                            }
                        }
                    }
                };
                return delete t.schedule.fcsSetup.newApi, delete t.schedule.fcsSetup.attempted, t
            }
        };
    r(Bx, "default", (function() {
        return Lx
    })), n(Bx);
    var jx = {},
        Vx = {
            update: function(e) {
                if (!e.userStates) return e;
                const t = {
                    ...e,
                    acknowledged: {
                        ...e.acknowledged
                    },
                    billing: {
                        ...e.billing,
                        discount: {
                            ...e.billing.discount,
                            availableTill: -1
                        }
                    }
                };
                return delete t.acknowledged.discount, delete t.billing.discount.available, t
            }
        };
    r(jx, "default", (function() {
        return Vx
    })), n(jx);
    var Hx = {},
        qx = {
            update: function(e) {
                if (!e.userStates) return e;
                return {
                    ...e,
                    quickReplies: {
                        shown: !1,
                        content: wy(),
                        total: 7
                    }
                }
            }
        };
    r(Hx, "default", (function() {
        return qx
    })), n(Hx);
    var zx = {},
        Gx = {
            update: function(e) {
                return {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        filters: {
                            ...e.schedule.filters,
                            showLocalLabel: !0
                        }
                    }
                }
            }
        };
    r(zx, "default", (function() {
        return Gx
    })), n(zx);
    var $x = {},
        Wx = {
            update: function(e) {
                const t = {
                    ...e
                };
                return delete t.igtvUpload, t
            }
        };
    r($x, "default", (function() {
        return Wx
    })), n($x);
    var Yx = {},
        Jx = {
            update: function(e) {
                return {
                    ...e,
                    schedule: {
                        ...e.schedule,
                        fcsSetup: {
                            ...e.schedule.fcsSetup,
                            screen: "welcome"
                        }
                    }
                }
            }
        };
    r(Yx, "default", (function() {
        return Jx
    })), n(Yx);
    var Qx = {},
        Kx = {
            update: function(e) {
                return {
                    ...e,
                    musicAssist: {
                        shown: !1,
                        videoUrl: null,
                        videoVolume: 0,
                        musicVolume: 0,
                        categoryIdsOrder: [],
                        selectedCategoryId: "popular",
                        selectedTrackId: null,
                        selectedTrackStart: 0,
                        customTrack: null
                    }
                }
            }
        };
    r(Qx, "default", (function() {
        return Kx
    })), n(Qx);
    var Xx = {},
        Zx = {
            update: function(e) {
                return {
                    ...e,
                    musicAssist: {
                        ...e.musicAssist,
                        showUpsellOverlay: !1
                    }
                }
            }
        };
    r(Xx, "default", (function() {
        return Zx
    })), n(Xx);
    var eP = {},
        tP = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    billing: {
                        ...e.billing,
                        trial: {
                            ...e.billing.trial,
                            musicAssist: 0
                        }
                    }
                } : e
            }
        };
    r(eP, "default", (function() {
        return tP
    })), n(eP);
    var nP = {},
        rP = {
            update: function(e) {
                return {
                    ...e,
                    musicAssist: {
                        ...e.musicAssist,
                        isStory: !1
                    }
                }
            }
        };
    r(nP, "default", (function() {
        return rP
    })), n(nP);
    var oP = {},
        iP = {
            update: function(e) {
                if (!e.userStates) return e;
                const t = {
                    ...e.billing.trial,
                    reels: 0,
                    coverAssist: 0,
                    musicAssist: 0
                };
                return D_.trialController.setTrialCookie(t), {
                    ...e,
                    billing: {
                        ...e.billing,
                        trial: t
                    }
                }
            }
        };
    r(oP, "default", (function() {
        return iP
    })), n(oP);
    var aP = {},
        sP = {
            update: function(e) {
                return {
                    ...e,
                    musicAssist: {
                        ...e.musicAssist,
                        videoVolume: 0,
                        musicVolume: .5
                    }
                }
            }
        };
    r(aP, "default", (function() {
        return sP
    })), n(aP);
    var lP = {},
        uP = {
            update: function(e) {
                return {
                    ...e,
                    musicAssist: {
                        ...e.musicAssist,
                        videoCurrentTime: 0
                    }
                }
            }
        };
    r(lP, "default", (function() {
        return uP
    })), n(lP);
    var cP = {},
        dP = {
            update: function(e) {
                if (!e.userStates) return e;
                const t = {
                    ...e.billing.trial,
                    reels: Math.max(0, e.billing.trial.reels - 3),
                    musicAssist: Math.max(0, e.billing.trial.musicAssist - 3)
                };
                return D_.trialController.setTrialCookie(t), {
                    ...e,
                    billing: {
                        ...e.billing,
                        trial: t
                    }
                }
            }
        };
    r(cP, "default", (function() {
        return dP
    })), n(cP);
    var fP = {},
        pP = {
            update: function(e) {
                if (!e.userStates) return e;
                const t = {
                    ...e.billing.trial,
                    schedule: 0
                };
                return D_.trialController.setTrialCookie(t), {
                    ...e,
                    billing: {
                        ...e.billing,
                        trial: t
                    }
                }
            }
        };
    r(fP, "default", (function() {
        return pP
    })), n(fP);
    var hP = {},
        gP = {
            update: function(e) {
                return {
                    ...e,
                    storyAssist: {
                        shown: !1,
                        selectedTabId: "mentions",
                        mentions: {
                            query: "",
                            foundUsers: [],
                            selectedUsers: []
                        }
                    }
                }
            }
        };
    r(hP, "default", (function() {
        return gP
    })), n(hP);
    var mP = {},
        vP = {
            update: function(e) {
                return {
                    ...e,
                    storyAssist: {
                        ...e.storyAssist,
                        showUpsellOverlay: !1
                    }
                }
            }
        };
    r(mP, "default", (function() {
        return vP
    })), n(mP);
    var bP = {},
        yP = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    billing: {
                        ...e.billing,
                        trial: {
                            ...e.billing.trial,
                            storyAssist: 0
                        }
                    }
                } : e
            }
        };
    r(bP, "default", (function() {
        return yP
    })), n(bP);
    var wP = {},
        _P = {
            update: function(e) {
                return {
                    ...e,
                    storyAssist: {
                        ...e.storyAssist,
                        selectedTabId: "music"
                    }
                }
            }
        };
    r(wP, "default", (function() {
        return _P
    })), n(wP);
    var SP = {},
        xP = {
            update: function(e) {
                return {
                    ...e,
                    storyAssist: {
                        ...e.storyAssist,
                        coverUrl: null
                    }
                }
            }
        };
    r(SP, "default", (function() {
        return xP
    })), n(SP);
    var PP = {},
        kP = {
            update: function(e) {
                return {
                    ...e,
                    ghostStoryView: {
                        enabled: !1
                    }
                }
            }
        };
    r(PP, "default", (function() {
        return kP
    })), n(PP);
    var DP = {},
        EP = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    billing: {
                        ...e.billing,
                        trial: {
                            ...e.billing.trial,
                            ghostStoryView: 0
                        }
                    }
                } : e
            }
        };
    r(DP, "default", (function() {
        return EP
    })), n(DP);
    var IP = {},
        TP = {
            update: function(e) {
                return {
                    ...e,
                    ghostStoryView: {
                        ...e.ghostStoryView,
                        lastUsedOn: null,
                        showUpsellOverlay: !1
                    }
                }
            }
        };
    r(IP, "default", (function() {
        return TP
    })), n(IP);
    var CP = {},
        FP = {
            update: function(e) {
                return {
                    ...e,
                    musicAssist: {
                        ...e.musicAssist,
                        categoryIdsOrder: [],
                        selectedCategoryId: 0
                    }
                }
            }
        };
    r(CP, "default", (function() {
        return FP
    })), n(CP);
    var AP = {},
        OP = {
            update: async function(e) {
                if (!e.userStates) return e;
                try {
                    const e = await new Promise(((e, t) => {
                            const n = indexedDB.open("keyval-store", 1);
                            n.onerror = () => t(n.error), n.onsuccess = () => e(n.result)
                        })),
                        t = await new Promise(((t, n) => {
                            const r = e.transaction("keyval", "readonly").objectStore("keyval").get("state");
                            r.onerror = () => n(r.error), r.onsuccess = () => t(r.result)
                        })),
                        n = c_.decompressFromUTF16(t),
                        r = btoa(encodeURIComponent(n));
                    await Ey.controller.set("state", r), await new Promise(((t, n) => {
                        const r = e.transaction("keyval", "readwrite").objectStore("keyval").delete("state");
                        r.onerror = () => n(r.error), r.onsuccess = () => t()
                    })), delete localStorage.state
                } catch (e) {
                    console.error("failed to apply version-204", e)
                }
                return e
            }
        };
    r(AP, "default", (function() {
        return OP
    })), n(AP);
    var MP = {},
        RP = {
            update: function(e) {
                const t = {
                    ...e,
                    authStatus: {
                        ...e.authStatus
                    }
                };
                return delete t.authStatus.isMobileSession, t
            }
        };
    r(MP, "default", (function() {
        return RP
    })), n(MP);
    var NP = {},
        UP = {
            update: function(e) {
                if (!e.userStates) return e;
                const t = {
                    ...e
                };
                return delete t.desktopPlatform, t
            }
        };
    r(NP, "default", (function() {
        return UP
    })), n(NP);
    var BP = {},
        LP = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    abTesting: {
                        hash: Math.random(),
                        wideScreenState: null
                    }
                } : e
            }
        };
    r(BP, "default", (function() {
        return LP
    })), n(BP);
    var jP = {},
        VP = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    abTesting: {
                        ...e.abTesting,
                        wideScreenState: null
                    }
                } : e
            }
        };
    r(jP, "default", (function() {
        return VP
    })), n(jP);
    var HP = {},
        qP = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        showAssistPanel: !1
                    }
                }
            }
        };
    r(HP, "default", (function() {
        return qP
    })), n(HP);
    var zP = {},
        GP = {
            update: function(e) {
                return {
                    ...e,
                    authStatus: {
                        ...e.authStatus,
                        cookies: {
                            ...e.authStatus.cookies,
                            ig: []
                        }
                    }
                }
            }
        };
    r(zP, "default", (function() {
        return GP
    })), n(zP);
    var $P = {},
        WP = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        posts: []
                    }
                }
            }
        };
    r($P, "default", (function() {
        return WP
    })), n($P);
    var YP = {},
        JP = {
            update: function(e) {
                return {
                    ...e,
                    storyAssist: {
                        ...e.storyAssist,
                        isVideo: !1
                    }
                }
            }
        };
    r(YP, "default", (function() {
        return JP
    })), n(YP);
    var QP = {},
        KP = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        editPostId: null
                    }
                }
            }
        };
    r(QP, "default", (function() {
        return KP
    })), n(QP);
    var XP = {},
        ZP = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        cookies: null
                    }
                }
            }
        };
    r(XP, "default", (function() {
        return ZP
    })), n(XP);
    var ek = {},
        tk = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        date: null
                    }
                }
            }
        };
    r(ek, "default", (function() {
        return tk
    })), n(ek);
    var nk = {},
        rk = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        userId: null
                    }
                }
            }
        };
    r(nk, "default", (function() {
        return rk
    })), n(nk);
    var ok = {},
        ik = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        selectedPill: null
                    }
                }
            }
        };
    r(ok, "default", (function() {
        return ik
    })), n(ok);
    var ak = {},
        sk = {
            update: function(e) {
                const t = {
                    ...e,
                    later: {
                        ...e.later,
                        showBodyPanel: !1,
                        selectedUserId: e.later.userId || e.authStatus.userId,
                        selectedPostId: e.later.editPostId,
                        selectedPillId: e.later.selectedPill
                    }
                };
                return delete t.later.userId, delete t.later.editPostId, delete t.later.selectedPill, t
            }
        };
    r(ak, "default", (function() {
        return sk
    })), n(ak);
    var lk = {},
        uk = {
            update: function(e) {
                const t = {
                    ...e,
                    later: {
                        ...e.later,
                        posts: e.later.posts.map((e => ({
                            ...e,
                            previewColor: e.previewAvgColor
                        })))
                    }
                };
                return t.later.posts.forEach((e => delete e.previewAvgColor)), t
            }
        };
    r(lk, "default", (function() {
        return uk
    })), n(lk);
    var ck = {},
        dk = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        posts: e.later.posts.map((e => {
                            const [t, n] = {
                                "story-photo": ["story", !1],
                                "story-video": ["story", !0],
                                photo: ["post", !1],
                                video: ["post", !0],
                                reel: ["reel", !0]
                            } [e.type];
                            return {
                                ...e,
                                type: t,
                                isVideo: n,
                                changes: {}
                            }
                        }))
                    }
                }
            }
        };
    r(ck, "default", (function() {
        return dk
    })), n(ck);
    var fk = {},
        pk = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        posts: e.later.posts.map((e => {
                            const t = {
                                ...e
                            };
                            return delete t.changes, t
                        }))
                    }
                }
            }
        };
    r(fk, "default", (function() {
        return pk
    })), n(fk);
    var hk = {},
        gk = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        timeSlots: [...e.schedule.timeSlots]
                    }
                }
            }
        };
    r(hk, "default", (function() {
        return gk
    })), n(hk);
    var mk = {},
        vk = {
            update: function(e) {
                return e.userStates ? {
                    ...e,
                    settings: {
                        laterAutoRetry: 12 * L.time.HOUR
                    }
                } : e
            }
        };
    r(mk, "default", (function() {
        return vk
    })), n(mk);
    var bk = {},
        yk = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        errors: []
                    }
                }
            }
        };
    r(bk, "default", (function() {
        return yk
    })), n(bk);
    var wk = {},
        _k = {
            update: async function(e) {
                const t = {
                    ...e,
                    later: {
                        ...e.later,
                        posts: e.later.posts.map((e => ({
                            ...e
                        })))
                    }
                };
                for (const e of t.later.posts) {
                    if (!e.isVideo) continue;
                    let t, n;
                    try {
                        t = await Ey.controller.get(`later.post-${e.id}`)
                    } catch (e) {
                        console.error(e);
                        continue
                    }
                    try {
                        n = await L.loadVideoMetadata(t.blob)
                    } catch (e) {
                        console.error(e);
                        continue
                    }
                    e.duration = n.duration
                }
                return t
            }
        };
    r(wk, "default", (function() {
        return _k
    })), n(wk);
    var Sk = {},
        xk = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        lastDate: null
                    }
                }
            }
        };
    r(Sk, "default", (function() {
        return xk
    })), n(Sk);
    var Pk = {},
        kk = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        posts: e.later.posts.map((e => {
                            let t;
                            t = "failed" !== e.status || e.errorMessage ? e.errorMessage : "Chrome was offline at the given time";
                            const n = {
                                ...e
                            };
                            return t && (n.error = {
                                message: t
                            }), delete n.errorMessage, n
                        }))
                    }
                }
            }
        };
    r(Pk, "default", (function() {
        return kk
    })), n(Pk);
    var Dk = {},
        Ek = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        processing: !1
                    }
                }
            }
        };
    r(Dk, "default", (function() {
        return Ek
    })), n(Dk);
    var Ik = {},
        Tk = {
            update: async function(e) {
                const t = {
                    ...e,
                    later: {
                        ...e.later,
                        posts: e.later.posts.map((e => ({
                            ...e
                        })))
                    }
                };
                for (const e of t.later.posts) {
                    let t, n, r, o;
                    try {
                        t = await Ey.controller.get(`later.post-${e.id}`)
                    } catch (e) {
                        console.error(e)
                    }
                    if (t) {
                        if (t.blob) try {
                            n = await sw.controller.save(t.blob, "later")
                        } catch (e) {
                            console.error(e)
                        }
                        if (t.previewBlob) try {
                            r = await sw.controller.save(t.previewBlob, "later")
                        } catch (e) {
                            console.error(e)
                        }
                        if (t.coverBlob) try {
                            o = await sw.controller.save(t.coverBlob, "later")
                        } catch (e) {
                            console.error(e)
                        }
                        try {
                            await Ey.controller.delete(`later.post-${e.id}`)
                        } catch (e) {
                            console.error(e)
                        }
                        delete e.previewUrl, e.files = [{
                            fileId: n || null,
                            previewId: r || null,
                            ...o && {
                                coverId: o
                            }
                        }]
                    } else e.files = []
                }
                return t
            }
        };
    r(Ik, "default", (function() {
        return Tk
    })), n(Ik);
    var Ck = {},
        Fk = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        posts: e.later.posts.map((e => {
                            const t = {
                                ...e,
                                files: e.files.length > 0 ? [{
                                    ...e.files[0],
                                    duration: e.duration
                                }] : []
                            };
                            return delete t.isVideo, delete t.duration, t
                        }))
                    }
                }
            }
        };
    r(Ck, "default", (function() {
        return Fk
    })), n(Ck);
    var Ak = {},
        Ok = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        posts: e.later.posts.map((e => {
                            const t = {
                                ...e,
                                mediaList: e.files.map((e => ({
                                    ...e,
                                    isVideo: !!e.coverId
                                })))
                            };
                            return delete t.files, t
                        }))
                    }
                }
            }
        };
    r(Ak, "default", (function() {
        return Ok
    })), n(Ak);
    var Mk = {},
        Rk = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        posts: e.later.posts.map((e => {
                            const t = {
                                ...e,
                                mediaList: [{
                                    ...e.mediaList[0],
                                    color: e.previewColor
                                }]
                            };
                            return delete t.previewColor, t
                        }))
                    }
                }
            }
        };
    r(Mk, "default", (function() {
        return Rk
    })), n(Mk);
    var Nk = {},
        Uk = {
            update: async function(e) {
                const t = {
                    ...e,
                    later: {
                        ...e.later,
                        posts: e.later.posts.map((e => ({
                            ...e,
                            mediaList: e.mediaList.map((e => ({
                                ...e
                            })))
                        })))
                    }
                };
                for (const e of t.later.posts)
                    for (const t of e.mediaList) try {
                        if (!t.isVideo) continue;
                        const e = await sw.controller.read(t.fileId);
                        if (!e) continue;
                        const n = await L.loadVideoMetadata(e);
                        t.duration = n.duration
                    } catch (e) {
                        console.error(e)
                    }
                return t
            }
        };
    r(Nk, "default", (function() {
        return Uk
    })), n(Nk);
    var Bk = {},
        Lk = {
            update: function(e) {
                return {
                    ...e,
                    later: {
                        ...e.later,
                        posts: e.later.posts.map((e => ({
                            ...e,
                            mediaList: e.mediaList.filter(Boolean)
                        })))
                    }
                }
            }
        };
    r(Bk, "default", (function() {
        return Lk
    })), n(Bk);
    const jk = {
            "version-130": G_($_).default,
            "version-131": G_(Y_).default,
            "version-132": G_(Q_).default,
            "version-133": G_(X_).default,
            "version-134": G_(eS).default,
            "version-135": G_(nS).default,
            "version-136": G_(oS).default,
            "version-137": G_(aS).default,
            "version-138": G_(lS).default,
            "version-139": G_(cS).default,
            "version-140": G_(fS).default,
            "version-141": G_(hS).default,
            "version-142": G_(mS).default,
            "version-143": G_(bS).default,
            "version-144": G_(wS).default,
            "version-145": G_(SS).default,
            "version-146": G_(PS).default,
            "version-147": G_(DS).default,
            "version-148": G_(IS).default,
            "version-149": G_(CS).default,
            "version-150": G_(AS).default,
            "version-151": G_(MS).default,
            "version-152": G_(NS).default,
            "version-153": G_(BS).default,
            "version-154": G_(jS).default,
            "version-155": G_(HS).default,
            "version-156": G_(zS).default,
            "version-157": G_($S).default,
            "version-158": G_(YS).default,
            "version-159": G_(QS).default,
            "version-160": G_(XS).default,
            "version-161": G_(ex).default,
            "version-162": G_(nx).default,
            "version-163": G_(ox).default,
            "version-164": G_(ax).default,
            "version-165": G_(lx).default,
            "version-166": G_(cx).default,
            "version-167": G_(fx).default,
            "version-168": G_(hx).default,
            "version-169": G_(mx).default,
            "version-170": G_(bx).default,
            "version-171": G_(wx).default,
            "version-172": G_(Sx).default,
            "version-173": G_(Px).default,
            "version-174": G_(Dx).default,
            "version-175": G_(Ix).default,
            "version-176": G_(Cx).default,
            "version-177": G_(Ax).default,
            "version-178": G_(Mx).default,
            "version-179": G_(Nx).default,
            "version-180": G_(Bx).default,
            "version-181": G_(jx).default,
            "version-182": G_(Hx).default,
            "version-183": G_(zx).default,
            "version-184": G_($x).default,
            "version-185": G_(Yx).default,
            "version-186": G_(Qx).default,
            "version-187": G_(Xx).default,
            "version-188": G_(eP).default,
            "version-189": G_(nP).default,
            "version-190": G_(oP).default,
            "version-191": G_(aP).default,
            "version-192": G_(lP).default,
            "version-193": G_(cP).default,
            "version-194": G_(fP).default,
            "version-195": G_(hP).default,
            "version-196": G_(mP).default,
            "version-197": G_(bP).default,
            "version-198": G_(wP).default,
            "version-199": G_(SP).default,
            "version-200": G_(PP).default,
            "version-201": G_(DP).default,
            "version-202": G_(IP).default,
            "version-203": G_(CP).default,
            "version-204": G_(AP).default,
            "version-205": G_(MP).default,
            "version-206": G_(NP).default,
            "version-207": G_(BP).default,
            "version-208": G_(jP).default,
            "version-209": G_(HP).default,
            "version-210": G_(zP).default,
            "version-211": G_($P).default,
            "version-212": G_(YP).default,
            "version-213": G_(QP).default,
            "version-214": G_(XP).default,
            "version-215": G_(ek).default,
            "version-216": G_(nk).default,
            "version-217": G_(ok).default,
            "version-218": G_(ak).default,
            "version-219": G_(lk).default,
            "version-220": G_(ck).default,
            "version-221": G_(fk).default,
            "version-222": G_(hk).default,
            "version-223": G_(mk).default,
            "version-224": G_(bk).default,
            "version-225": G_(wk).default,
            "version-226": G_(Sk).default,
            "version-227": G_(Pk).default,
            "version-228": G_(Dk).default,
            "version-229": G_(Ik).default,
            "version-230": G_(Ck).default,
            "version-231": G_(Ak).default,
            "version-232": G_(Mk).default,
            "version-233": G_(Nk).default,
            "version-234": G_(Bk).default
        },
        Vk = {
            versioners: {},
            init: function() {
                const e = /version-(\d+)/i;
                Object.keys(jk).map((t => {
                    const n = parseInt(t.match(e)[1]);
                    return {
                        key: t,
                        version: n
                    }
                })).sort(((e, t) => e.version - t.version)).forEach((e => {
                    this.versioners[e.version] = jk[e.key]
                }))
            },
            update: async function(e) {
                let t = e,
                    n = t.version || 0;
                log(`versioner: model version is ${n}`);
                for (; n < 234;) {
                    log(`versioner: applying versioner ${n+1}`);
                    const e = this.versioners[n + 1];
                    t = await e.update(t), t.version = n + 1;
                    const r = t.backups || t.userStates;
                    for (const t in r) {
                        const o = r[t];
                        try {
                            r[t] = await e.update(o), r[t].version = n + 1
                        } catch (e) {
                            delete r[t]
                        }
                    }
                    n++
                }
                return t
            }
        };
    Vk.init();
    const Hk = function(e) {
            const t = Array.isArray(e.whatsNew) ? e.whatsNew : [];
            let n = !1;
            const r = [{
                id: "v25.1.0",
                header: "Carousels Post Later",
                subheader: "v25.1.0",
                hexImage: "hex-schedule",
                content: ["Upload or drag & drop multiple files to Post Later to schedule them for posting as a carousel."]
            }, {
                id: "v25.0.0",
                header: "Advanced Post Later",
                subheader: "v25.0.0",
                hexImage: "hex-schedule",
                content: ["Improved Post Later interface and auto-publishing stability. Manage multiple accounts in Post Later interface seamlessly. Bulk upload files for scheduling."]
            }, {
                id: "v24.0.0",
                header: "Post Later",
                subheader: "v24.0.0",
                hexImage: "hex-schedule",
                content: ["INSSIST now supports Delayed Posting for Posts, Photo and Video Stories and Reels. Facebook account is not required to schedule posts with delayed posting."]
            }, {
                id: "v23.6.0",
                header: "Fixes and Future Plans",
                subheader: "v23.6.0",
                hexImage: "hex-schedule"
            }, {
                id: "v23.3.0",
                header: "Major Functionality Fixes",
                subheader: "v23.3.0",
                hexImage: "hex-bug",
                content: ["Restored all app functions broken due to recent changes introduced by Instagram update to internal data and media handling systems."]
            }, {
                id: "v23.1.0",
                header: "Instagram Update Bug Fixes",
                subheader: "v23.1.0",
                hexImage: "hex-bug",
                content: ["Fixed a number of bugs introduced by Instagram in the recent mobile and desktop app update: reels failed to be published through instagram.com, posted videos were duplicated under reels tab and showing with a wrong icon, restored search panel functionality of the explore page, and other improvements and fixes."]
            }, {
                id: "v23.0.0",
                header: "Ghost View Mode for Stories",
                subheader: "v23.0.0",
                hexImage: "hex-ghost",
                content: ["Switch to a Ghost View Mode and watch stories anonymously. Story owner won’t know if you watched their story."]
            }, {
                id: "v22.0.0",
                header: "Story Assist",
                subheader: "v22.0.0",
                hexImage: "hex-story",
                content: ["Added user tagging feature in stories, fixed avatars rendering Instagram bug, fixed reels API connectivity and other issues."]
            }, {
                id: "v21.1.0",
                header: "Improvements and Bug Fixes",
                subheader: "v21.1.0",
                hexImage: "hex-update",
                content: ["Fixed custom video covers and music file uploads to fail in certain scenarios. Styling and usability improvements in the app. Fixed tooltips rendering in the IG frame. Fixed app rendering artifacts on slow Internet connection and more."]
            }, {
                id: "v21.0.0",
                header: "Posting Functionality Restored",
                subheader: "v21.0.0",
                hexImage: "hex-bug",
                content: ["Restored posting functionality and fixed problems caused by the IG platform overhaul.", "Improved app stability, dark theme, custom cover feature, videos autoplay on carousels and fixed multiple bugs."]
            }, {
                id: "v20.2.0",
                header: "Reels Improvements",
                subheader: "v20.2.0",
                hexImage: "hex-bug",
                content: ["Added support for locations and people mentions (tagging) on Reels posting.", "Fixed original audio automatically muted by Chrome v100. Fixed followers and followings not showing up correctly in the wide mode. Fixed DM not showing DM folders."]
            }, {
                id: "v20.1.0",
                header: "Bug Fixing",
                subheader: "v20.1.0",
                hexImage: "hex-bug",
                content: ["Fixed scheduling connection setup, fixed isolation policy error, improved reels posting, post management error handling and usability."]
            }, {
                id: "v20.0.0",
                header: "Music",
                subheader: "v20.0.0",
                hexImage: "hex-music",
                content: ["Add music or upload your tracks to Reels, Stories and Videos. Royalty-free music is provided by tunetank.com."]
            }, {
                id: "v19.0.0",
                header: "Quick Replies in DM",
                subheader: "v19.0.0",
                hexImage: "hex-dm",
                content: ["Send Quick Replies in chats by typing / symbol followed by reply shortcut. Configure an unlimited number of replies for business or personal use.", "Inssist Quick Replies support template messages and @name, @username variables."]
            }, {
                id: "v18.0.9",
                header: "Bug Fixing",
                subheader: "v18.0.9",
                hexImage: "hex-bug",
                content: ["Fixed Instagram bug that caused a blank screen to load for some users. Fixed Zen mode, story mentions and other issues."]
            }, {
                id: "posting-from-website",
                header: "Posting from website",
                subheader: "v18.0.0",
                hexImage: "hex-igswiss"
            }, {
                id: "v17.3.0",
                header: "60s Reels",
                subheader: "v17.3.0",
                hexImage: "hex-reels",
                content: ["Inssist can now post Reels of up to 60s long, up from 30s before.", "CSV import now supports “multiline \\n captions” and break lines with \\n symbols.", "This release improves posting stability."]
            }, {
                id: "v17.0.0",
                header: "Bulk & CSV Scheduling",
                subheader: "v17.0.0",
                hexImage: "hex-schedule",
                content: ["Added “BULK” section to the Scheduling module that supports applying bulk commands: scheduling, drafting, deleting posts.", "You can now reschedule posts across time-slots or intervals with a few clicks and edit captions of all scheduled posts from a single screen.", "Inssist now knows how to parse CSV files so that you can drag and drop those and schedule posts even faster.", "Scheduling interface has been significantly speed up comparing to the previous versions."]
            }, {
                id: "macos",
                header: "Experimental MacOS version",
                subheader: "v15.2.3",
                hexImage: "hex-macos"
            }, {
                id: "v15.1.0",
                header: "Usability & Bug Fixes",
                subheader: "v15.1.0",
                hexImage: "hex-bug",
                content: ["Post Assistant now supports custom aspect ratios for images in addition to default square, portrait and landscape ones.", "Fix for the Instagram “video failed to post” and other bugs."]
            }, {
                id: "v15.0.3",
                header: "Bug Fixing",
                subheader: "v15.0.3",
                hexImage: "hex-bug",
                content: ["Fixed missing delete button in Post Assistant. Fixed dark theme Reels UI. Fixed “Post did not upload” video publishing issue."]
            }, {
                id: "reels",
                header: "Reels",
                subheader: "v15.0.0",
                hexImage: "hex-reels",
                content: ["Inssist can now post Reels! It ensures the best quality and does not compress your videos.", "Instagram Reels is a short-video format, similar to TikTok. Instagram platform limits Reels to 50 countries, including the United States.", "Posting Reels is a PRO feature, and you can repost Reels from other accounts and apply custom covers with Inssist."]
            }, {
                id: "v13.1.0",
                header: "Hashtag Collections",
                subheader: "v13.1.0",
                hexImage: "hex-tag",
                content: ["Now you can create and manage your Hashtag collections with Inssist."]
            }, {
                id: "v11.5.0",
                header: "Lifetime Deal",
                subheader: "v11.5.0",
                hexImage: "hex-lifetime",
                content: ["Claim your Inssist PRO Lifetime Deal!", "Now you can get Inssist PRO license for life with a one time purchase, before only a monthly subscription option was available.", "For businesses managing many accounts there is a special Infinite plan. Check it out!"]
            }, {
                id: "v11.2.0",
                header: "Swipe Up",
                subheader: "v11.2.0",
                hexImage: "hex-swipe-up",
                content: ["Swipe Up feature (adding links to stories) is now available for accounts of more than 10k followers."]
            }, {
                id: "v11.1.0",
                header: "Editing Captions",
                subheader: "v11.1.0",
                hexImage: "hex-caption",
                content: ["This version brings support for editing posts. You can now edit posts and update post captions after they are published without a need to connect to Facebook API."]
            }, {
                id: "v11.0.0",
                header: "Video Thumbnails / Covers",
                subheader: "v11.0.0",
                hexImage: "hex-video",
                content: ["Version 11 brings support for covers to video posting.", "Whenever you upload a video to post you can choose a thumbnail from a list of auto-generated covers, a specific video frame or even upload a custom image to be used.", "You can also preview your Instagram grid with the selected cover before posting."]
            }, {
                id: "v10.1.0",
                header: "Zen Mode",
                subheader: "v10.1.0",
                hexImage: "hex-zen",
                content: ["Make your Instagram browsing experience cleaner with the new Zen mode.", "Switch Instagram home feed into Zen hides post captions and comments on the posts. Give it a try!", "This release also fixes a number of bugs, making posting Stories more stable in particular."]
            }, {
                id: "v10.0.1",
                header: "Share Post to Story",
                subheader: "v10.0.1",
                hexImage: "hex-story",
                content: ["Version 10 brings support for sharing any post to your story in a few clicks.", "Locate a share icon below any post, video or photo, click it and select “Share to Story”. A photo will then be shared to your story.", "This feature is free. Enjoy!"]
            }, {
                id: "v10.0.0",
                header: "Bug Fixing",
                subheader: "v10.0.0",
                hexImage: "hex-bug",
                content: ["Fixed comments scrolling caused the app to refresh the page.", "Post Assistant now supports uploading and previewing posts in a grid without a Facebook API connection.", "Changed the dark theme background not to be so dark. Redesigned side bar and Facebook API connection setup dialogs.", "And a host of other improvements and stability enhancements under the hood."]
            }, {
                id: "v9.0.0",
                header: "Bulk Scheduling",
                subheader: "v9.0.0",
                hexImage: "hex-ship",
                content: ["Inssist Scheduling now supports uploading multiple photos at once to speed up posting.", "You can also drag & drop photos and videos from the system to Inssist to schedule or publish them.", "Scheduling engine has been significantly improved to support bulk upload and future improvements coming down the line."]
            }, {
                id: "v8.9.1",
                header: "Bug Fixing & Usability",
                subheader: "v8.9.1",
                hexImage: "hex-bug",
                content: ["Stories uploaded with Inssist are now uploaded in the best quality possible.", "Fixed internal bugs and improved DM module stability."]
            }, {
                id: "v8.8.5",
                header: "Bug Fixing & Usability",
                subheader: "v8.8.5",
                hexImage: "hex-bug",
                content: ["Inssist now prevents Instagram from blurring photos when switching between screen modes.", "Inssist now shows @usernames upon hovering over accounts in multiaccount box.", "Increased DM text input size, fixed elements positioning on Instagram authorization screen, fixed wordings across the application and other improvements.", "Added support for sending debug reports if Inssist fails to connect Scheduling."]
            }, {
                id: "v8.6.0",
                header: "Scheduling patch",
                subheader: "v8.6.0",
                hexImage: "hex-bug",
                content: ["Fixed a bug preventing scheduling connection setup to reliably connect Instagram account to Scheduling API.", "Fixed a cross-posting bug preventing Facebook Page selection from rendering.", "Fixed sending post from the home feed to Direct Messages. Other internal fixes."]
            }, {
                id: "v8.5.1",
                header: "Story and Scheduling fixes",
                subheader: "v8.5.1",
                hexImage: "hex-bug",
                content: ["Improved aspect ratio detection on stories: video stories should upload to Instagram more reliably.", "Uploaded stories now have the first frame selected as a cover rather than a random one.", "Fixed Infinite Loading loop bug on scheduling."]
            }, {
                id: "v8.5.0",
                header: "Story Improvements",
                subheader: "v8.5.0",
                hexImage: "hex-bug",
                content: ["Photo Stories are no longer cut in preview when they do not fit the aspect ratios. Inssist now detects and warns about unsupported Video Story lengths: shorter than 1 second and longer than 15 seconds. Other internal improvements."]
            }, {
                id: "v8.4.0",
                header: "Story Mentions",
                subheader: "v8.4.0",
                hexImage: "hex-mentions",
                content: ["Support for @mentions (account tagging) has arrived for photo stories. This is a free feature available on all plans."]
            }, {
                id: "v8.3.0",
                header: "Bug Fixing",
                subheader: "v8.3.0",
                hexImage: "hex-bug",
                content: ["Added mouse scroll to stories panel. Added photo upload spinner during posting.", "Fixed modal windows positioning bug in Instagram. Fixed tab buttons spacing on Instagram profile page."]
            }, {
                id: "v8.2.1",
                header: "Bug Fixing",
                subheader: "v8.2.1",
                hexImage: "hex-bug",
                content: ["Fixed excess image rotation on new and scheduled posts.", "Fixed a black screen scheduling state bug caused by selecting a Custom Time interval."]
            }, {
                id: "v8.2.0",
                header: "Facebook Cross-Posting",
                subheader: "v8.2.0",
                hexImage: "hex-schedule",
                content: ["If your Instagram @account is connected to a custom Facebook Page, Inssist will let you clone posts to that Facebook Page during scheduling."]
            }, {
                id: "v8.1.0",
                header: "Scheduling Performance",
                subheader: "v8.1.0",
                hexImage: "hex-schedule",
                content: ["Over the past few weeks we have redesigned and rebuilt Scheduling engine from ground-up, making it far more stable and performing much better than before. Give it a try!", "A few User Interface fixes are delivered with this update."]
            }, {
                id: "v8.0.0",
                header: "Multiaccount Support",
                subheader: "v8.0.0",
                hexImage: "hex-multiaccount",
                content: ["Got more than one Instagram account? Connect them all to Inssist and seamlessly switch between them without a need to relogin. Handy!"]
            }, {
                id: "v6.2.0",
                header: "Wide Screen",
                subheader: "v6.2.0",
                hexImage: "hex-monitor",
                content: ["Wide screen mode has been redesigned with images taking more space and page layouts improved."]
            }, {
                id: "v6.1.0",
                header: "Bug Fixing",
                subheader: "v6.1.0",
                hexImage: "hex-bug",
                content: ["Stories can now be scrolled with LEFT / RIGHT keys and exited with ESC key. Fixed polls styling on stories in dark theme.", "Fixed videos playing sound for a split second upon navigation within plugin. Fixed an Instagram bug with videos refusing to playing on click.", "Fixed Scheduling incorrectly ordering posts upon updating post caption. Improved Scheduling interface buttons styling.", "Plugin URL now contains Instagram page URL for quick navigation.", "Direct Messages no longer marked as read while DM module is hidden. Fixed DM module buttons overlap. Clicking Back button no longer causes navigation in Direct Messaging module. Videos sent in Direct Messages can now be viewed in a separate tab."]
            }, {
                id: "v6.0.1",
                header: "Carousels",
                subheader: "v6.0.1",
                hexImage: "hex-carousel",
                content: ["Inssist now supports carousel posts through the Post Assistant. Check it out!", "Multiaccount support is coming next!"]
            }, {
                id: "v6.0.0",
                header: "Scheduling",
                subheader: "v6.0.0",
                hexImage: "hex-schedule",
                content: ["Scheduling now supports drag&drop operations both on Grid and Calendar. Scheduling is out of Beta and has been substantially improved, debugged and redesigned."]
            }, {
                id: "v5.0.1",
                header: "Bug Fixing",
                subheader: "v5.0.1",
                hexImage: "hex-bug",
                content: ["Fixed Instagram bug when adding multiline text on stories caused Instagram UI to break. Captions containing emojis are no longer cut off."]
            }, {
                id: "v4.0.5",
                header: "Bug Fixing",
                subheader: "v4.0.5",
                hexImage: "hex-bug",
                content: ["A ton of bug fixes and improvements:", "You can now send DMs to any account without following them first. Images in DM module are no longer cropped and take all available space.", "Added a button to open image in a new tab in DM module. Requests tab in DM no longer overflows the new DM button and DM actions tooltips is no longer cut off. Fixed fonts in DM module.\n", "Added “Open in Inssist” button on Instagram website. Added DM US button to reach out to us quickly. Icons in side bar no longer overlap on small screens.", "Fixed “show more” button on post captions and other small fixes across UI."]
            }, {
                id: "v4.0.0",
                header: "Direct Messages",
                subheader: "v4.0.0",
                hexImage: "hex-dm",
                content: ["Psst… Check out the brand new Direct Messages panel on the left. You can now send DMs while having the Instagram view on the right simultaneously. Handy! 💌", "The next feature we’re working on is Scheduling drag & drop support."]
            }, {
                id: "v3.1.0",
                header: "Bug fixing",
                subheader: "v3.1.0",
                hexImage: "hex-bug",
                content: ["Bug fixes and improvements: fixed emojis 🤧 in the dark theme, better scheduling setup logic and setup errors interception, permissions verification screen, scheduling migrated onto optimistic transactions mechanism, image pre-caching and scheduling loading speed-up, fixed IGTV screen and UI cleanup."]
            }, {
                id: "v3.0.0",
                header: "Dark Mode",
                subheader: "v3.0.0",
                hexImage: "hex-moon",
                content: ["Join the Dark Side! Switch Inssist to Dark mode which is less strenuous on your beautiful 👀 with a click of a button. Instagram web interface has been thoroughly restyled to Dark mode as well."]
            }, {
                id: "v2.3.0",
                header: "Calendar and Time Slots",
                subheader: "v2.3.0",
                hexImage: "hex-schedule",
                content: ["Configure Time Slots to schedule posts efficiently. Browse posts in a weekly and monthly post calendars. Fixed scheduling setup, auto-logout and freezing bugs."]
            }, {
                id: "v2.2.0",
                header: "Scheduling Usability",
                subheader: "v2.2.0",
                hexImage: "hex-schedule",
                content: ["Added scheduling time & date selection calendar. Improved Posts Grid performance. Fixed scheduling connection setup problems."]
            }, {
                id: "v2.1.0",
                header: "Scheduling Beta",
                subheader: "v2.1.0",
                hexImage: "hex-schedule",
                content: ["Scheduling has arrived.", "Upload photos, videos, IGTVs and carousel posts. Preview them in a grid, save as draft, publish or schedule for auto-publish.", "Scheduled media are published automatically, no need to install extra software, Inssist handles auto-publish for you even if you are offline.", "Scheduling is currently available through our Beta program. You can enable Beta features for free by sharing a word about Inssist.", "All bug reports and feature requests are welcomed at inssist@slashed.io  🐜🐜🐜"]
            }, {
                id: "v1.6.0",
                header: "IGTV Support",
                subheader: "v1.6.0",
                hexImage: "hex-igtv",
                content: ["Plugin now supports uploading IGTV videos.", "To publish IGTV, simply upload a video as you would normally do. If the video is longer than 1 minute, Inssist will present an IGTV video upload interface to you."]
            }, {
                id: "v1.3.0",
                header: "Relevant Hashtags",
                subheader: "v1.3.0",
                hexImage: "hex-tag",
                content: ["Inssist now suggests relevant hashtags. Try it out!"]
            }, {
                id: "v1.2.2",
                header: "Bug fixing",
                subheader: "v1.2.2",
                hexImage: "hex-bug",
                content: ["Fixed “Instagram.com refused to connect” issue. If you still experience “Instagram.com refused to connect” error, please try to relogin to Instagram.com from a separate browser tab and reinstall Inssist from get.inssist.com.", "Fixed video playback jittering."]
            }, {
                id: "v1.2.0",
                header: "Autoplay for Videos",
                subheader: "v1.2.0",
                hexImage: "hex-update",
                content: ["Videos on the feed will now autoplay (muted) when scrolled into the view. Clicking videos un-mutes them.", "Improved posting screen usability, stability and bundle size."]
            }, {
                id: "v1.1.0",
                header: "Usability Improvements",
                subheader: "v1.1.0",
                hexImage: "hex-update",
                content: ["Text inside the Instagram view can now be selected and copied to clipboard.", "Posting photos and videos now supports locations tagging.", "Fixed issue with instagram.com not connecting after navigation to direct messages.", "Fixed issue with opening facebook.com links from DM messages caused a browser page error.", "Pressing Enter in DM screen now sends the message right away.", "Other miscellaneous usability improvements."]
            }, {
                id: "v0.9.12",
                header: "Bug fixing & Performance",
                subheader: "v0.9.12",
                hexImage: "hex-bug",
                content: ["Extension rebranded to Inssist.", "Loading and rendering speed improved. Fixed an issue when replying to comments rendered an unnecessary actions popup."]
            }, {
                id: "v0.9.5",
                header: "Improved Image Quality",
                subheader: "v0.9.5",
                hexImage: "hex-quality",
                content: ["Landscape and Portrait photos now retain high image quality when uploaded with the plugin."]
            }, {
                id: "v0.9.2",
                header: "Video Support",
                subheader: "v0.9.2",
                hexImage: "hex-video",
                content: ["Plugin now supports Video uploads."]
            }, {
                id: "v0.8.9",
                header: "Stickers and Markers Support",
                subheader: "v0.8.9",
                hexImage: "hex-marker",
                content: ["Stories can now be uploaded with stickers and markers."]
            }, {
                id: "v0.8.3",
                header: "Improved UI",
                subheader: "v0.8.3",
                hexImage: "hex-bug",
                content: ["User profile, stories reel and other parts of user interface and user experience were improved. Fixed stories viewer not showing stories on a first click."]
            }, {
                id: "v0.8.0",
                header: "Basic version",
                subheader: "v0.8.0",
                hexImage: "hex-igswiss",
                content: ["Plugin now supports photos and stories upload and direct messages."]
            }].map((e => {
                let r;
                if (n) r = !0;
                else {
                    const o = t.find((t => t.id === e.id));
                    r = o && o.acknowledged || !1, r && (n = !0)
                }
                return {
                    id: e.id,
                    acknowledged: r
                }
            }));
            return {
                ...e,
                whatsNew: r
            }
        },
        {
            action: qk
        } = Dg;
    var zk = qk("state.setup-default-state", (e => e.whatsNew ? e : {
        version: 234,
        authStatus: {
            userId: null,
            username: null,
            fullName: null,
            email: null,
            avatarUrl: null,
            isLoggedIn: !1,
            cookies: {
                igSessionId: null,
                ig: [],
                fb: []
            }
        },
        coverAssist: {
            shown: !1,
            loading: !0,
            videoUrl: null,
            coverUrl: null,
            selectedTabId: "auto",
            showGrid: !1,
            gridImages: [],
            frameGalleryImages: [],
            frameGallerySelectedImage: null,
            frameSelectImage: null,
            frameSelectValue: null,
            frameUploadImage: null
        },
        musicAssist: {
            shown: !1,
            videoUrl: null,
            videoVolume: 0,
            musicVolume: .5,
            videoCurrentTime: 0,
            categoryIdsOrder: [],
            selectedCategoryId: 0,
            selectedTrackId: null,
            selectedTrackStart: 0,
            customTrack: null,
            showUpsellOverlay: !1,
            isStory: !1
        },
        storyAssist: {
            shown: !1,
            isVideo: !1,
            selectedTabId: "later",
            showUpsellOverlay: !1,
            coverUrl: null,
            mentions: {
                query: "",
                foundUsers: [],
                selectedUsers: []
            }
        },
        ghostStoryView: {
            enabled: !1,
            lastUsedOn: null,
            showUpsellOverlay: !1
        },
        dm: {
            badgeText: "",
            ghostModeEnabled: !0,
            ghostModeFailed: !1
        },
        reels: {
            creating: !1
        },
        igTask: {
            actionBlockCode: null,
            followStatus: {},
            likeStatus: {}
        },
        later: {
            cookies: null,
            showBodyPanel: !1,
            showAssistPanel: !1,
            selectedUserId: null,
            selectedPostId: null,
            selectedPillId: null,
            selectedIgDate: null,
            errors: [],
            lastDate: null,
            processing: !1,
            timeSlots: [{
                time: 288e5
            }, {
                time: 468e5
            }, {
                time: 576e5
            }, {
                time: 72e6
            }],
            posts: []
        },
        schedule: {
            posts: [],
            timeSlots: [{
                time: 288e5
            }, {
                time: 468e5
            }, {
                time: 576e5
            }, {
                time: 72e6
            }],
            addCard: {
                saved: !1,
                fileCount: 0,
                attention: !1,
                draggingFiles: !1,
                selectedOption: "multiple",
                savingTitle: null,
                savingText: null,
                savingPreview: null
            },
            loading: !1,
            recentScheduledOn: null,
            lastFcsPostsUpdateOn: null,
            lastIgPostsUpdateOn: null,
            fcsError: null,
            fcsFailed: !1,
            isErrorShown: !1,
            isUpsellShown: !1,
            isDraggingPost: !1,
            showTagAssist: !1,
            addingFiles: !1,
            fileUploadErrors: [],
            fallback: {
                isEnabled: !1,
                isFailedToReconnect: !1,
                isRetryingFbConnection: !1,
                hideSwitchToFallbackButton: !1
            },
            navigation: {
                isOpen: !1,
                selectedTabId: null,
                isFcsLoading: !1,
                withBackToCalendarButton: !1
            },
            filters: {
                showInfo: !0,
                showLocalLabel: !0,
                photo: !0,
                video: !0,
                carousel: !0,
                posted: !0,
                local: !0,
                draft: !0,
                scheduled: !0
            },
            fcsSetup: {
                screen: "welcome",
                checking: !1,
                connected: !1,
                connecting: !1,
                showPanel: !1,
                errorCode: null,
                steps: {
                    fbLogin: null,
                    igProfessional: null,
                    igConnectedToFbPage: null
                },
                failed: !1
            },
            dateDialog: {
                isOpen: !1,
                selectedOption: "publish-now",
                periodStart: null,
                selectedDay: null,
                selectedSlotTime: null,
                customTime: null,
                timezone: null,
                isTimeError: !1
            },
            calendar: {
                periodType: "month",
                periodStart: null,
                showTimeSlots: !0
            }
        },
        bulk: {
            saving: !1,
            selectedPostIds: [],
            activeActionId: null,
            actions: {},
            dateDialog: {
                show: !1,
                selectedTypeId: "interval",
                startingDay: {
                    selectedTypeId: "today",
                    periodStart: null,
                    selectedDay: null
                },
                calendar: {
                    periodStart: null,
                    selectedDay: null,
                    selectedSlotTime: null,
                    customTime: null,
                    errorMessage: null
                },
                interval: {
                    frequency: "1:1",
                    timeList: []
                },
                week: {
                    selectedDays: [],
                    selectedSlotTime: null,
                    customTime: null,
                    dayErrorMessage: null,
                    timeErrorMessage: null
                },
                timeSlots: {
                    errorMessage: null
                }
            }
        },
        ..._y()
    }));
    const {
        model: Gk
    } = Dg;
    var $k = {
        controller: {
            init: async function() {
                zk.dispatch(), await this._update()
            },
            _update: async function() {
                let e = Gk.state;
                e = await Vk.update(e), e = Hk(e), e !== Gk.state && gy.dispatch(e)
            }
        }
    };
    var Wk = {
        controller: {
            init: function() {
                chrome.runtime.setUninstallURL("https://forms.gle/L6nZ8YUTqUspM34s7")
            }
        }
    };
    class Yk {
        constructor(e) {
            this.defaultDelay = e, this.queue = Promise.resolve(), this.totalTasks = 0, this.cleanupIndex = -1
        }
        async addTask(e, t) {
            const n = this.totalTasks++;
            return new Promise(((r, o) => {
                this.queue = this.queue.then((async () => {
                    if (n <= this.cleanupIndex) t ? r(await t()) : r();
                    else try {
                        r(await e())
                    } catch (e) {
                        o(e)
                    }
                })), this.defaultDelay && this.addDelay(this.defaultDelay)
            }))
        }
        async addDelay(e) {
            const t = this.totalTasks++;
            return new Promise((n => {
                this.queue = this.queue.then((async () => {
                    t <= this.cleanupIndex || await k(e), n()
                }))
            }))
        }
        enqueueTask(e, t) {
            const n = this.totalTasks++;
            return this.queue = this.queue.then((async () => {
                if (n <= this.cleanupIndex) t && await t();
                else try {
                    await e()
                } catch (e) {}
            })), this.defaultDelay && this.enqueueDelay(this.defaultDelay), this
        }
        enqueueDelay(e) {
            const t = this.totalTasks++;
            return this.queue = this.queue.then((async () => {
                t <= this.cleanupIndex || await k(e)
            })), this
        }
        cleanup() {
            this.cleanupIndex = this.totalTasks - 1
        }
    }
    const Jk = new Yk(Bg),
        {
            model: Qk
        } = Dg;
    var Kk = {
        controller: {
            init: async function() {
                log("ig-task: initialisation succeeded"), Qk.observe((() => Sy.proxy.userId()), (() => Jk.cleanup()), !1)
            }
        },
        peersQueue: new Yk(Lg),
        actionsQueue: Jk
    };
    var Xk = {
        controller: {
            init: function() {
                L.watchForIgCookie("open-in-inssist", (async e => {
                    const t = e.value;
                    t.startsWith("/direct/") && "/direct/" !== t ? Dg.transaction((e => {
                        e.sidebar.isOpen = !0, e.sidebar.selectedTabId = "tab-dm"
                    })) : Dg.transaction((e => {
                        e.sidebar.isOpen = !1
                    })), chrome.tabs.create({
                        url: `chrome-extension://${chrome.runtime.id}/inssist.html#instagram.com${t}`,
                        active: !0
                    })
                }))
            }
        }
    };
    let Zk;
    var eD = {
        controller: {
            getVersion: function() {
                if (void 0 === Zk) {
                    const e = /Chrome\/([0-9.]+)/.exec(globalThis.navigator.userAgent)[1];
                    Zk = e ? Number(e.split(".")[0]) : -1
                }
                return Zk
            }
        }
    };
    var tD = function() {
        const e = Dg.model.state,
            t = e.authStatus.userId;
        return e.tagAssist.accountStats[t] || {}
    };
    const {
        model: nD,
        transaction: rD
    } = Dg;
    var oD = {
        init: function() {
            nD.observe((e => e.authStatus.userId), (() => {
                iD()
            })), L.createAlarm("tag-assist.update-account-stats", {
                period: 4 * L.time.HOUR
            }, (() => {
                iD()
            }))
        }
    };
    async function iD(e = 0) {
        const t = nD.state,
            n = t.authStatus.userId;
        if (!n) return;
        const r = Date.now(),
            o = tD(),
            i = o && r - o.lastScanOn;
        if (i && i < u.options.tagAssist.accountStatsTtl) return;
        const a = t.authStatus.username,
            s = await jg.api.fetchUserPosts(a, 42);
        if (s.error) return e < 2 ? void iD(e + 1) : void console.error("failed to update account stats", s);
        const l = s.result;
        let c = 0,
            d = 0;
        for (const e of l) c += jg.api.normalizePostStat24h(e.stats.likes, e.on), d += jg.api.normalizePostStat24h(e.stats.comments, e.on);
        l.length > 0 && (c = Math.round(c / l.length), d = Math.round(d / l.length));
        const f = function(e) {
            const t = []; {
                const n = {},
                    r = e.flat();
                for (const e of r) n[e] = (n[e] || 0) + 1;
                for (const e in n) {
                    const r = n[e];
                    let o = t.find((e => e.frequency === r));
                    o || (o = {
                        frequency: r,
                        strs: []
                    }, t.push(o)), o.strs.push(e)
                }
                t.sort(((e, t) => t.frequency - e.frequency))
            }
            for (const n of t) {
                const t = {};
                for (const r of e) {
                    let e = 0;
                    for (const o of r) n.strs.includes(o) && (t[o] = (t[o] || 0) + e, e += 1)
                }
                n.strs.sort(((e, n) => t[e] - t[n]))
            }
            return t.map((e => e.strs)).flat()
        }(l.map((e => e.caption || "")).map((e => function(e, t = !1) {
            const n = B({
                hashOptional: !t
            });
            return (e.match(n) || []).map((e => e.startsWith("#") ? e.substr(1) : e)).map((e => e.toLowerCase())).filter(T)
        }(e, !0))));
        rD((e => {
            e.tagAssist.accountStats[n] = {
                avgLikes: c,
                avgComments: d,
                mostUsedTags: f.slice(0, 3),
                lastScanOn: Date.now()
            }
        }))
    }
    var aD = {
        controller: {
            init: function() {
                oD.init()
            }
        }
    };
    const {
        model: sD,
        transaction: lD
    } = Dg;

    function uD() {
        return {
            hasPro: Sy.proxy.hasPro(),
            freeReels: Math.max(0, 2 - sD.state.billing.trial.reels),
            maxFreeReels: 2
        }
    }
    async function cD(e) {
        const t = await L.callAsync(chrome.windows.getLastFocused),
            n = await L.callAsync(chrome.tabs.getSelected, t.id);
        chrome.tabs.create({
            url: "https://app.inssist.com",
            active: !0
        }), lD((e => {
            e.sidebar.isOpen = !0, e.sidebar.selectedTabId = "tab-billing", e.billing.recentFeature = "desktop-reels"
        })), e.value.includes("keep-ig-tab") || await L.callAsync(chrome.tabs.remove, n.id)
    }
    async function dD() {
        lw.controller.sendEvent("user", "reels:submit", "desktop"), Sy.proxy.hasProPaid() ? lw.controller.sendEvent("user", "pro-paid-usage:reels", "desktop") : lD((e => {
            e.billing.trial.reels += 1
        }))
    }

    function fD() {
        chrome.cookies.set({
            name: "desktop-reels.initial-data",
            value: JSON.stringify(uD()),
            url: "https://www.instagram.com",
            path: "/",
            httpOnly: !1,
            secure: !1,
            storeId: "0",
            domain: "instagram.com",
            sameSite: "strict",
            expirationDate: Date.now() + 30 * L.time.SECOND
        })
    }
    var pD = {
        controller: {
            init: function() {
                $g.on("desktop-reels.get-initial-data", uD), L.watchForIgCookie("desktop-reels.open-billing", cD), L.watchForIgCookie("desktop-reels.submit-success", dD), L.watchForIgCookie("desktop-reels.get-initial-data", fD)
            }
        }
    };
    !async function() {
        let e = !1;
        $g.on("bg.is-ready", (() => e)), globalThis._ = i_, a_.controller.init();
        const t = eD.controller.getVersion();
        console.log(`chrome version is: ${t}`), s_.init(), await z_.controller.init(), cy.controller.init({
            dsn: "https://bea0900834f541bca8157710f7fd31fe@sentry.io/1547551"
        }), u_.controller.init(), await t_.controller.init(), Vy.controller.init(), Gy.controller.init(), Wk.controller.init(), await m_.controller.init("background", !0), await $k.controller.init(), xy.controller.init(), A_.controller.init(), j_.controller.init(), Kk.controller.init(), n_.controller.init(), Xk.controller.init(), Gw.controller.init(), Ry.controller.init(), aD.controller.init(), pD.controller.init(), aw.controller.init(), Wg.controller.init(), lw.controller.init().sendPageview().sendInstall(), $y.controller.init(), await $y.controller.updateUser(), D_.controller.init(), await D_.controller.updatePro(), Ky.controller.init(), uw.controller.init(), e = !0
    }()
}();
