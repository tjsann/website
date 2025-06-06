(() => {
	var e = {
			795: function(e, t, n) {
				var i;
				(t => {
					function r() {}
					var s = r.prototype,
						o = t.EventEmitter;

					function l(e, t) {
						for (var n = e.length; n--;)
							if (e[n].listener === t) return n;
						return -1
					}

					function a(e) {
						return function() {
							return this[e].apply(this, arguments)
						}
					}
					s.getListeners = function(e) {
						var t, n, i = this._getEvents();
						if (e instanceof RegExp)
							for (n in t = {}, i) i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n]);
						else t = i[e] || (i[e] = []);
						return t
					}, s.flattenListeners = function(e) {
						for (var n = [], t = 0; t < e.length; t += 1) n.push(e[t].listener);
						return n
					}, s.getListenersAsObject = function(e) {
						var t, n = this.getListeners(e);
						return n instanceof Array && ((t = {})[e] = n), t || n
					}, s.addListener = function(e, t) {
						if (! function c(e) {
								return "function" == typeof e || e instanceof RegExp || !(!e ||
									"object" != typeof e) && c(e.listener)
							}(t)) throw new TypeError("listener must be a function");
						var n, i = this.getListenersAsObject(e),
							r = "object" == typeof t;
						for (n in i) i.hasOwnProperty(n) && -1 === l(i[n], t) && i[n].push(r ?
							t : {
								listener: t,
								once: !1
							});
						return this
					}, s.on = a("addListener"), s.addOnceListener = function(e, t) {
						return this.addListener(e, {
							listener: t,
							once: !0
						})
					}, s.once = a("addOnceListener"), s.defineEvent = function(e) {
						return this.getListeners(e), this
					}, s.defineEvents = function(e) {
						for (var t = 0; t < e.length; t += 1) this.defineEvent(e[t]);
						return this
					}, s.removeListener = function(e, t) {
						var n, i, r = this.getListenersAsObject(e);
						for (i in r) r.hasOwnProperty(i) && -1 !== (n = l(r[i], t)) && r[i].splice(
							n, 1);
						return this
					}, s.off = a("removeListener"), s.addListeners = function(e, t) {
						return this.manipulateListeners(!1, e, t)
					}, s.removeListeners = function(e, t) {
						return this.manipulateListeners(!0, e, t)
					}, s.manipulateListeners = function(e, t, n) {
						var i, r, s = e ? this.removeListener : this.addListener,
							o = e ? this.removeListeners : this.addListeners;
						if ("object" != typeof t || t instanceof RegExp)
							for (i = n.length; i--;) s.call(this, t, n[i]);
						else
							for (i in t) t.hasOwnProperty(i) && (r = t[i]) && ("function" ==
								typeof r ? s : o).call(this, i, r);
						return this
					}, s.removeEvent = function(e) {
						var t, n = typeof e,
							i = this._getEvents();
						if ("string" == n) delete i[e];
						else if (e instanceof RegExp)
							for (t in i) i.hasOwnProperty(t) && e.test(t) && delete i[t];
						else delete this._events;
						return this
					}, s.removeAllListeners = a("removeEvent"), s.emitEvent = function(e,
						t) {
						var n, i, r, s, o = this.getListenersAsObject(e);
						for (s in o)
							if (o.hasOwnProperty(s))
								for (n = o[s].slice(0), r = 0; r < n.length; r++) !0 === (i = n[r])
									.once && this.removeListener(e, i.listener), i.listener.apply(this,
										t || []) === this._getOnceReturnValue() && this.removeListener(e,
										i.listener);
						return this
					}, s.trigger = a("emitEvent"), s.emit = function(e) {
						var t = Array.prototype.slice.call(arguments, 1);
						return this.emitEvent(e, t)
					}, s.setOnceReturnValue = function(e) {
						return this._onceReturnValue = e, this
					}, s._getOnceReturnValue = function() {
						return !this.hasOwnProperty("_onceReturnValue") || this._onceReturnValue
					}, s._getEvents = function() {
						return this._events || (this._events = {})
					}, r.noConflict = function() {
						return t.EventEmitter = o, r
					}, void 0 !== (i = function() {
						return r
					}.call(t, n, t, e)) && (e.exports = i)
				})("undefined" != typeof window ? window : this || {})
			}
		},
		t = {};

	function n(i) {
		var r = t[i];
		return void 0 !== r || (r = t[i] = {
			exports: {}
		}, e[i].call(r.exports, r, r.exports, n)), r.exports
	}
	n.n = e => {
		var t = e && e.__esModule ? () => e.default : () => e;
		return n.d(t, {
			a: t
		}), t
	}, n.d = (e, t) => {
		for (var i in t) n.o(t, i) && !n.o(e, i) && Object.defineProperty(e, i, {
			enumerable: !0,
			get: t[i]
		})
	}, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), (() => {
		class e {
			constructor(e) {
				this.menuList = e, this.menuSelector = "data-menu-open", this.menuContentSelector =
					".asobi_footer_menu_content", this.isAnim = !1, this.setMenuHeight(),
					this.menuList && this.menuList.forEach(e => {
						e = e.querySelector(".asobi_footer_menu_title_btn");
						null != e && e.addEventListener("click", this.toggle.bind(this))
					})
			}
			toggle(e) {
				if (1 != this.isAnim) {
					this.isAnim = !0;
					var t = e.target.closest(`[${this.menuSelector}]`);
					if (t) {
						var n = t.querySelector(this.menuContentSelector);
						if (n) {
							if ("true" === t.getAttribute(this.menuSelector)) n.style.height =
								"0px", t.setAttribute(this.menuSelector, "false");
							else {
								let e = n.scrollHeight;
								n.style.height = e + "px", t.setAttribute(this.menuSelector, "true")
							}
							setTimeout(() => {
								this.isAnim = !1
							}, 300)
						}
					}
				}
			}
			setMenuHeight() {
				null != this.menuList && this.menuList.forEach(e => {
					var t = e.querySelector(this.menuContentSelector);
					if (t)
						if ("true" === e.getAttribute(this.menuSelector)) {
							let e = t.scrollHeight;
							t.style.height = e + "px"
						} else t.style.height = "0px"
				})
			}
			clearMenuHeight() {
				null != this.menuList && this.menuList.forEach(e => {
					e = e.querySelector(this.menuContentSelector);
					e && (e.style.height = "auto")
				})
			}
		}
		class t {
			constructor() {
				this.menuList = document.querySelectorAll(".asobi_footer_menu_list"),
					this.isSp = window.innerWidth < 769, this.init()
			}
			init() {
				null != this.menuList && (this.accordingMenu = new e(this.menuList),
					window.addEventListener("resize", () => {
						var e, n = this.isSp;
						window.innerWidth < 769 ? (this.isSp = !0, null != (e = this.accordingMenu) &&
							e.setMenuHeight()) : (this.isSp = !1, n !== this.isSp && null !=
							(e = this.accordingMenu) && e.clearMenuHeight())
					}))
			}
		}
		var i = n(795),
			r = n.n(i);
		class s extends r() {
			constructor(e) {
				super(), this.isEvent = !1, this.className = e
			}
			handleClick(e) {
				e = e.target;
				e.closest(this.className) || e.closest("[data-active-content]") ||
					this.clearEvent()
			}
			openEvent() {
				this.isEvent || window.setTimeout(() => {
					this.isEvent = !0, document.addEventListener("click", this.handleClick
						.bind(this))
				}, 50)
			}
			clearEvent() {
				this.isEvent = !1, document.removeEventListener("click", this.handleClick
					.bind(this))
			}
		}
		class o extends s {
			constructor(e) {
				if (super(".asobi_utility_account_btn"), this.headerElm = e, this.headerElm) {
					let e = this.headerElm.querySelector(".asobi_utility_account_btn");
					null != e && e.addEventListener("click", this.menuClickHandler.bind(
						this))
				}
			}
			openEvent() {
				super.openEvent()
			}
			menuClickHandler() {
				var e;
				this.isEvent ? this.clearEvent() : (null != (e = this.headerElm) && e.setAttribute(
					"data-account-open", "true"), this.openEvent())
			}
			clearEvent() {
				var e;
				super.clearEvent(), null != (e = this.headerElm) && e.setAttribute(
					"data-account-open", "false")
			}
		}

		function l(e) {
			return (e = (e = (e = (e = (e = encodeURIComponent(e)).replace("!", "%21"))
				.replace("'", "%27")).replace("(", "%28")).replace(")", "%29")).replace(
				"*", "%2a")
		}
		class a extends s {
			constructor(e) {
				if (super(".asobi_utility_search"), this.headerElm = e, this.headerElm) {
					let e = this.headerElm.querySelector(".asobi_utility_search_btn"),
						t = (null != e && e.addEventListener("click", this.menuClickHandler.bind(
							this)), this.headerElm.querySelector(".asobi_utility_search_form"));
					t && t.addEventListener("submit", e => {
						e.preventDefault(), t.kw.value && (location.href = (e =>
							"https://shop.asobistore.jp/product/catalog/kw/" + l(e = (e => {
								if (e) {
									var t = ["ｶﾞ", "ｷﾞ", "ｸﾞ", "ｹﾞ", "ｺﾞ", "ｻﾞ", "ｼﾞ", "ｽﾞ",
											"ｾﾞ", "ｿﾞ", "ﾀﾞ", "ﾁﾞ", "ﾂﾞ", "ﾃﾞ", "ﾄﾞ", "ﾊﾞ", "ﾊﾟ", "ﾋﾞ",
											"ﾋﾟ", "ﾌﾞ", "ﾌﾟ", "ﾍﾞ", "ﾍﾟ", "ﾎﾞ", "ﾎﾟ", "ｳﾞ", "ｧ", "ｱ",
											"ｨ", "ｲ", "ｩ", "ｳ", "ｪ", "ｴ", "ｫ", "ｵ", "ｶ", "ｷ", "ｸ", "ｹ",
											"ｺ", "ｻ", "ｼ", "ｽ", "ｾ", "ｿ", "ﾀ", "ﾁ", "ｯ", "ﾂ", "ﾃ", "ﾄ",
											"ﾅ", "ﾆ", "ﾇ", "ﾈ", "ﾉ", "ﾊ", "ﾋ", "ﾌ", "ﾍ", "ﾎ", "ﾏ", "ﾐ",
											"ﾑ", "ﾒ", "ﾓ", "ｬ", "ﾔ", "ｭ", "ﾕ", "ｮ", "ﾖ", "ﾗ", "ﾘ", "ﾙ",
											"ﾚ", "ﾛ", "ﾜ", "ｦ", "ﾝ", "!", '"', "#", "$", "%", "&", "'",
											"(", ")", "*", "+", ",", "/", "<", "=", ">", "?", "@", "[",
											"]", "{", "}"
										],
										n = ["ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ",
											"ヂ", "ヅ", "デ", "ド", "バ", "パ", "ビ", "ピ", "ブ", "プ", "ベ", "ペ",
											"ボ", "ポ", "ヴ", "ァ", "ア", "ィ", "イ", "ゥ", "ウ", "ェ", "エ", "ォ",
											"オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ", "タ",
											"チ", "ッ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ",
											"フ", "ヘ", "ホ", "マ", "ミ", "ム", "メ", "モ", "ャ", "ヤ", "ュ", "ユ",
											"ョ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ヲ", "ン", "！", "”",
											"＃", "＄", "％", "＆", "’", "（", "）", "＊", "＋", "，", "／", "＜",
											"＝", "＞", "？", "＠", "［", "］", "｛", "｝"
										];
									for (let i = 0; i <= 102; i++)
										for (; 0 <= e.indexOf(t[i]);) e = e.replace(t[i], n[i])
								}
								return e
							})(e).replace(/(^\s+)|(\s+$)/g, "").replace(/(^%20+)|(%20+$)/g,
								"")) + "/t/keyword/?q=" + l(e))(t.kw.value))
					})
				}
			}
			openEvent() {
				super.openEvent()
			}
			menuClickHandler() {
				var e;
				this.isEvent ? this.clearEvent() : (null != (e = this.headerElm) && e.setAttribute(
					"data-search-open", "true"), this.openEvent())
			}
			clearEvent() {
				var e;
				super.clearEvent(), null != (e = this.headerElm) && e.setAttribute(
					"data-search-open", "false")
			}
		}
		class c extends s {
			constructor(e) {
				if (super(".asobi_header_bento_btn"), this.headerElm = e, this.headerElm) {
					let e = this.headerElm.querySelector(".asobi_header_bento_btn"),
						t = this.headerElm.querySelector(".asobi_header_bento_close_btn");
					null != e && e.addEventListener("click", this.bentoMenuClickHandler.bind(
						this)), null != t && t.addEventListener("click", this.bentoMenuCloseHandler
						.bind(this))
				}
			}
			bentoMenuCloseHandler() {
				this.clearEvent()
			}
			openEvent() {
				super.openEvent(), this.emitEvent("onBentoMenuOepn")
			}
			bentoMenuClickHandler() {
				var e;
				this.isEvent ? this.clearEvent() : (null != (e = this.headerElm) && e.setAttribute(
					"data-bento-open", "true"), this.openEvent())
			}
			clearEvent() {
				var e;
				super.clearEvent(), null != (e = this.headerElm) && e.setAttribute(
					"data-bento-open", "false")
			}
		}
		class h {
			constructor(e) {
				this.currentType = null, this.headerElm = e;
				var n, i = null == (e = this.headerElm) ? void 0 : e.querySelectorAll(
						".asobi_header_local_secondary_btn"),
					r = (this.wrapperElm = this.headerElm.querySelector(
						".asobi_header_local_secondary"), this.headerElm.querySelectorAll(
						".asobi_header_local_secondary_dropdown_close_btn"));
				for (let e = 0; e < i.length; e++) i[e].addEventListener("click", this.dropdownClickHandler
					.bind(this));
				for (let e = 0; e < r.length; e++) null != (n = r[e]) && n.addEventListener(
					"click", this.dropdownCloseHandler.bind(this))
			}
			dropdownClickHandler(e) {
				var t, e = e.currentTarget.getAttribute("data-type");
				e != this.currentType ? (null != (t = this.wrapperElm) && t.setAttribute(
					"data-show", "" + e), this.currentType = e) : this.clearEvent()
			}
			dropdownCloseHandler() {
				this.clearEvent()
			}
			clearEvent() {
				var e;
				null != (e = this.wrapperElm) && e.setAttribute("data-show", "false"),
					this.currentType = null
			}
		}
		class u {
			constructor() {
				this.headerElm = document.querySelector(".asobi_header"), this.init()
			}
			init() {
				var e;
				null != this.headerElm && (this.bentoMenu = new c(this.headerElm), this
					.asobiUtilityAcount = new o(this.headerElm), this.asobiUtilitySearch =
					new a(this.headerElm), this.localSecondaryMenu = new h(this.headerElm),
					this.bentoMenu.addListener("onBentoMenuOepn", () => {
						var e;
						null != (e = this.localSecondaryMenu) && e.clearEvent()
					}), this.currentService = null == (e = this.headerElm) ? void 0 : e.getAttribute(
						"data-current"))
			}
		}
		i = () => {
			console.log("common version: v1.0.1"), new u, new t
		}, "loading" === document.readyState ? window.addEventListener(
			"DOMContentLoaded", i) : i()
	})()

function updateTimeText() {
  const now = new Date();

  const hour = document.querySelector('.hour');
  const minute = document.querySelector('.minute');
  const second = document.querySelector('.second');

  const year = document.querySelector('.year');
  const month = document.querySelector('.month');
  const day = document.querySelector('.day');

  if (hour) hour.textContent = String(now.getHours()).padStart(2, '0');
  if (minute) minute.textContent = String(now.getMinutes()).padStart(2, '0');
  if (second) second.textContent = String(now.getSeconds()).padStart(2, '0');

  if (year) year.textContent = String(now.getFullYear());
  if (month) month.textContent = String(now.getMonth() + 1).padStart(2, '0');
  if (day) day.textContent = String(now.getDate()).padStart(2, '0');
}

let dividerHighlight = true;
let activeColor = '#ffffff'; // フォールバック（白）

function toggleDividerColor() {
  const dividers = document.querySelectorAll('.time .divider');

  // 時刻全体の親要素から色を取得（これが一番安定）
  const timeGroup = document.querySelector('.time');
  if (timeGroup) {
    activeColor = getComputedStyle(timeGroup).color;
  }

  dividers.forEach(div => {
    div.style.color = dividerHighlight ? activeColor : '#999999';
  });

  dividerHighlight = !dividerHighlight;
}

function animateProgressBar10s() {
  const progressBar = document.querySelector('.clock-progress-bar');
  if (!progressBar) return;

  function frame() {
    const now = new Date();
    const totalMs = now.getSeconds() * 1000 + now.getMilliseconds();
    const msInCycle = totalMs % 10000;
    const percent = (msInCycle / 10000) * 100;
    progressBar.style.left = `${percent - 100}%`;
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

// 起動
updateTimeText();
setInterval(updateTimeText, 1000);
setInterval(toggleDividerColor, 500);
animateProgressBar10s();


})();
