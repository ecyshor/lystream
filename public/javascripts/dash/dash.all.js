function X2JS(a, b, c) {
    function d(a) {
        var b = a.localName;
        return null == b && (b = a.baseName), (null == b || "" == b) && (b = a.nodeName), b
    }

    function e(a) {
        return a.prefix
    }

    function f(a) {
        return "string" == typeof a ? a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;") : a
    }

    function g(a) {
        return a.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/")
    }

    function h(f) {
        if (f.nodeType == u.DOCUMENT_NODE) {
            var i, j, k, l = f.firstChild;
            for (j = 0, k = f.childNodes.length; k > j; j += 1)if (f.childNodes[j].nodeType !== u.COMMENT_NODE) {
                l = f.childNodes[j];
                break
            }
            if (c)i = h(l); else {
                i = {};
                var m = d(l);
                i[m] = h(l)
            }
            return i
        }
        if (f.nodeType == u.ELEMENT_NODE) {
            var i = new Object;
            i.__cnt = 0;
            for (var n = f.childNodes, o = 0; o < n.length; o++) {
                var l = n.item(o), m = d(l);
                if (i.__cnt++, null == i[m])i[m] = h(l), i[m + "_asArray"] = new Array(1), i[m + "_asArray"][0] = i[m]; else {
                    if (null != i[m] && !(i[m]instanceof Array)) {
                        var p = i[m];
                        i[m] = new Array, i[m][0] = p, i[m + "_asArray"] = i[m]
                    }
                    for (var q = 0; null != i[m][q];)q++;
                    i[m][q] = h(l)
                }
            }
            for (var r = 0; r < f.attributes.length; r++) {
                var s = f.attributes.item(r);
                i.__cnt++;
                for (var v = s.value, w = 0, x = a.length; x > w; w++) {
                    var y = a[w];
                    y.test.call(this, s.value) && (v = y.converter.call(this, s.value))
                }
                i[b + s.name] = v
            }
            var z = e(f);
            return null != z && "" != z && (i.__cnt++, i.__prefix = z), 1 == i.__cnt && null != i["#text"] && (i = i["#text"]), null != i["#text"] && (i.__text = i["#text"], t && (i.__text = g(i.__text)), delete i["#text"], delete i["#text_asArray"]), null != i["#cdata-section"] && (i.__cdata = i["#cdata-section"], delete i["#cdata-section"], delete i["#cdata-section_asArray"]), (null != i.__text || null != i.__cdata) && (i.toString = function () {
                return (null != this.__text ? this.__text : "") + (null != this.__cdata ? this.__cdata : "")
            }), i
        }
        return f.nodeType == u.TEXT_NODE || f.nodeType == u.CDATA_SECTION_NODE ? f.nodeValue : f.nodeType == u.COMMENT_NODE ? null : void 0
    }

    function i(a, b, c, d) {
        var e = "<" + (null != a && null != a.__prefix ? a.__prefix + ":" : "") + b;
        if (null != c)for (var f = 0; f < c.length; f++) {
            var g = c[f], h = a[g];
            e += " " + g.substr(1) + "='" + h + "'"
        }
        return e += d ? "/>" : ">"
    }

    function j(a, b) {
        return "</" + (null != a.__prefix ? a.__prefix + ":" : "") + b + ">"
    }

    function k(a, b) {
        return -1 !== a.indexOf(b, a.length - b.length)
    }

    function l(a, b) {
        return k(b.toString(), "_asArray") || 0 == b.toString().indexOf("_") || a[b]instanceof Function ? !0 : !1
    }

    function m(a) {
        var b = 0;
        if (a instanceof Object)for (var c in a)l(a, c) || b++;
        return b
    }

    function n(a) {
        var b = [];
        if (a instanceof Object)for (var c in a)-1 == c.toString().indexOf("__") && 0 == c.toString().indexOf("_") && b.push(c);
        return b
    }

    function o(a) {
        var b = "";
        return null != a.__cdata && (b += "<![CDATA[" + a.__cdata + "]]>"), null != a.__text && (b += t ? f(a.__text) : a.__text), b
    }

    function p(a) {
        var b = "";
        return a instanceof Object ? b += o(a) : null != a && (b += t ? f(a) : a), b
    }

    function q(a, b, c) {
        var d = "";
        if (0 == a.length)d += i(a, b, c, !0); else for (var e = 0; e < a.length; e++)d += i(a[e], b, n(a[e]), !1), d += r(a[e]), d += j(a[e], b);
        return d
    }

    function r(a) {
        var b = "", c = m(a);
        if (c > 0)for (var d in a)if (!l(a, d)) {
            var e = a[d], f = n(e);
            if (null == e || void 0 == e)b += i(e, d, f, !0); else if (e instanceof Object)if (e instanceof Array)b += q(e, d, f); else {
                var g = m(e);
                g > 0 || null != e.__text || null != e.__cdata ? (b += i(e, d, f, !1), b += r(e), b += j(e, d)) : b += i(e, d, f, !0)
            } else b += i(e, d, f, !1), b += p(e), b += j(e, d)
        }
        return b += p(a)
    }

    (null === b || void 0 === b) && (b = "_"), (null === c || void 0 === c) && (c = !1);
    var s = "1.0.11", t = !1, u = {
        ELEMENT_NODE: 1,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9
    };
    this.parseXmlString = function (a) {
        var b;
        if (window.DOMParser) {
            var c = new window.DOMParser;
            b = c.parseFromString(a, "text/xml")
        } else 0 == a.indexOf("<?") && (a = a.substr(a.indexOf("?>") + 2)), b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a);
        return b
    }, this.xml2json = function (a) {
        return h(a)
    }, this.xml_str2json = function (a) {
        var b = this.parseXmlString(a);
        return this.xml2json(b)
    }, this.json2xml_str = function (a) {
        return r(a)
    }, this.json2xml = function (a) {
        var b = this.json2xml_str(a);
        return this.parseXmlString(b)
    }, this.getVersion = function () {
        return s
    }, this.escapeMode = function (a) {
        t = a
    }
}
function ObjectIron(a) {
    var b;
    for (b = [], i = 0, len = a.length; len > i; i += 1)b.push(a[i].isRoot ? "root" : a[i].name);
    var c = function (a, b) {
        var c;
        if (null !== a && null !== b)for (c in a)a.hasOwnProperty(c) && (b.hasOwnProperty(c) || (b[c] = a[c]))
    }, d = function (a, b, d) {
        var e, f, g, h, i;
        if (null !== a && 0 !== a.length)for (e = 0, f = a.length; f > e; e += 1)g = a[e], b.hasOwnProperty(g.name) && (d.hasOwnProperty(g.name) ? g.merge && (h = b[g.name], i = d[g.name], "object" == typeof h && "object" == typeof i ? c(h, i) : d[g.name] = null != g.mergeFunction ? g.mergeFunction(h, i) : h + i) : d[g.name] = b[g.name])
    }, e = function (a, b) {
        var c, f, g, h, i, j, k, l = a;
        if (null !== l.children && 0 !== l.children.length)for (c = 0, f = l.children.length; f > c; c += 1)if (j = l.children[c], b.hasOwnProperty(j.name))if (j.isArray)for (i = b[j.name + "_asArray"], g = 0, h = i.length; h > g; g += 1)k = i[g], d(l.properties, b, k), e(j, k); else k = b[j.name], d(l.properties, b, k), e(j, k)
    }, f = function (c) {
        var d, g, h, i, j, k, l;
        if (null === c)return c;
        if ("object" != typeof c)return c;
        for (d = 0, g = b.length; g > d; d += 1)"root" === b[d] && (j = a[d], k = c, e(j, k));
        for (i in c)if (c.hasOwnProperty(i)) {
            if (h = b.indexOf(i), -1 !== h)if (j = a[h], j.isArray)for (l = c[i + "_asArray"], d = 0, g = l.length; g > d; d += 1)k = l[d], e(j, k); else k = c[i], e(j, k);
            f(c[i])
        }
        return c
    };
    return {run: f}
}
if (function (a) {
        Q = a()
    }(function () {
        "use strict";
        function a(a) {
            var b = Function.call;
            return function () {
                return b.apply(a, arguments)
            }
        }

        function b(a) {
            return "[object StopIteration]" === hb(a) || a instanceof _
        }

        function c(a, b) {
            b.stack && "object" == typeof a && null !== a && a.stack && -1 === a.stack.indexOf(ib) && (a.stack = d(a.stack) + "\n" + ib + "\n" + d(b.stack))
        }

        function d(a) {
            for (var b = a.split("\n"), c = [], d = 0; d < b.length; ++d) {
                var g = b[d];
                f(g) || e(g) || c.push(g)
            }
            return c.join("\n")
        }

        function e(a) {
            return -1 !== a.indexOf("(module.js:") || -1 !== a.indexOf("(node.js:")
        }

        function f(a) {
            var b = /at .+ \((.*):(\d+):\d+\)/.exec(a);
            if (!b)return !1;
            var c = b[1], d = b[2];
            return c === X && d >= Z && nb >= d
        }

        function g() {
            if (Error.captureStackTrace) {
                var a, b, c = Error.prepareStackTrace;
                return Error.prepareStackTrace = function (c, d) {
                    a = d[1].getFileName(), b = d[1].getLineNumber()
                }, (new Error).stack, Error.prepareStackTrace = c, X = a, b
            }
        }

        function h(a) {
            return u(a)
        }

        function i() {
            function a(a) {
                c && (b = u(a), bb(c, function (a, c) {
                    Y(function () {
                        b.promiseDispatch.apply(b, c)
                    })
                }, void 0), c = void 0, d = void 0)
            }

            var b, c = [], d = [], e = eb(i.prototype), f = eb(k.prototype);
            return f.promiseDispatch = function (a, e, f) {
                var g = ab(arguments);
                c ? (c.push(g), "when" === e && f[1] && d.push(f[1])) : Y(function () {
                    b.promiseDispatch.apply(b, g)
                })
            }, f.valueOf = function () {
                return c ? f : b = l(b)
            }, Error.captureStackTrace && h.longStackJumpLimit > 0 && (Error.captureStackTrace(f, i), f.stack = f.stack.substring(f.stack.indexOf("\n") + 1)), e.promise = f, e.resolve = a, e.fulfill = function (b) {
                a(t(b))
            }, e.reject = function (b) {
                a(s(b))
            }, e.notify = function (a) {
                c && bb(d, function (b, c) {
                    Y(function () {
                        c(a)
                    })
                }, void 0)
            }, e
        }

        function j(a) {
            var b = i();
            return G(a, b.resolve, b.reject, b.notify).fail(b.reject), b.promise
        }

        function k(a, b, c, d, e) {
            void 0 === b && (b = function (a) {
                return s(new Error("Promise does not support operation: " + a))
            });
            var f = eb(k.prototype);
            return f.promiseDispatch = function (c, d, e) {
                var g;
                try {
                    g = a[d] ? a[d].apply(f, e) : b.call(f, d, e)
                } catch (h) {
                    g = s(h)
                }
                c && c(g)
            }, c && (f.valueOf = c), e && (f.exception = d), f
        }

        function l(a) {
            return m(a) ? a.valueOf() : a
        }

        function m(a) {
            return a && "function" == typeof a.promiseDispatch
        }

        function n(a) {
            return a && "function" == typeof a.then
        }

        function o(a) {
            return !p(a) && !q(a)
        }

        function p(a) {
            return !n(l(a))
        }

        function q(a) {
            return a = l(a), m(a) && "exception"in a
        }

        function r() {
            jb || "undefined" == typeof window || window.Touch || !window.console || console.log("Should be empty:", lb), jb = !0
        }

        function s(a) {
            var b = k({
                when: function (b) {
                    if (b) {
                        var c = cb(kb, this);
                        -1 !== c && (lb.splice(c, 1), kb.splice(c, 1))
                    }
                    return b ? b(a) : this
                }
            }, function () {
                return s(a)
            }, function () {
                return this
            }, a, !0);
            return r(), kb.push(b), lb.push(a), b
        }

        function t(a) {
            return k({
                when: function () {
                    return a
                }, get: function (b) {
                    return a[b]
                }, set: function (b, c) {
                    a[b] = c
                }, "delete": function (b) {
                    delete a[b]
                }, post: function (b, c) {
                    return null == b ? a.apply(void 0, c) : a[b].apply(a, c)
                }, apply: function (b, c) {
                    return a.apply(b, c)
                }, keys: function () {
                    return gb(a)
                }
            }, void 0, function () {
                return a
            })
        }

        function u(a) {
            return m(a) ? a : (a = l(a), n(a) ? v(a) : t(a))
        }

        function v(a) {
            var b = i();
            return Y(function () {
                try {
                    a.then(b.resolve, b.reject, b.notify)
                } catch (c) {
                    b.reject(c)
                }
            }), b.promise
        }

        function w(a) {
            return k({
                isDef: function () {
                }
            }, function (b, c) {
                return C(a, b, c)
            }, function () {
                return l(a)
            })
        }

        function x(a, b, d, e) {
            function f(a) {
                try {
                    return "function" == typeof b ? b(a) : a
                } catch (c) {
                    return s(c)
                }
            }

            function g(a) {
                if ("function" == typeof d) {
                    c(a, m);
                    try {
                        return d(a)
                    } catch (b) {
                        return s(b)
                    }
                }
                return s(a)
            }

            function j(a) {
                return "function" == typeof e ? e(a) : a
            }

            var k = i(), l = !1, m = u(a);
            return Y(function () {
                m.promiseDispatch(function (a) {
                    l || (l = !0, k.resolve(f(a)))
                }, "when", [function (a) {
                    l || (l = !0, k.resolve(g(a)))
                }])
            }), m.promiseDispatch(void 0, "when", [void 0, function (a) {
                var b, c = !1;
                try {
                    b = j(a)
                } catch (d) {
                    if (c = !0, !h.onerror)throw d;
                    h.onerror(d)
                }
                c || k.notify(b)
            }]), k.promise
        }

        function y(a, b, c) {
            return x(a, function (a) {
                return I(a).then(function (a) {
                    return b.apply(void 0, a)
                }, c)
            }, c)
        }

        function z(a) {
            return function () {
                function c(a, c) {
                    var g;
                    try {
                        g = d[a](c)
                    } catch (h) {
                        return b(h) ? h.value : s(h)
                    }
                    return x(g, e, f)
                }

                var d = a.apply(this, arguments), e = c.bind(c, "send"), f = c.bind(c, "throw");
                return e()
            }
        }

        function A(a) {
            throw new _(a)
        }

        function B(a) {
            return function () {
                return y([this, I(arguments)], function (b, c) {
                    return a.apply(b, c)
                })
            }
        }

        function C(a, b, c) {
            var d = i();
            return Y(function () {
                u(a).promiseDispatch(d.resolve, b, c)
            }), d.promise
        }

        function D(a) {
            return function (b) {
                var c = ab(arguments, 1);
                return C(b, a, c)
            }
        }

        function E(a, b) {
            var c = ab(arguments, 2);
            return mb(a, b, c)
        }

        function F(a, b) {
            return C(a, "apply", [void 0, b])
        }

        function G(a) {
            var b = ab(arguments, 1);
            return F(a, b)
        }

        function H(a) {
            var b = ab(arguments, 1);
            return function () {
                var c = b.concat(ab(arguments));
                return C(a, "apply", [this, c])
            }
        }

        function I(a) {
            return x(a, function (a) {
                var b = a.length;
                if (0 === b)return u(a);
                var c = i();
                return bb(a, function (d, e, f) {
                    p(e) ? (a[f] = l(e), 0 === --b && c.resolve(a)) : x(e, function (d) {
                        a[f] = d, 0 === --b && c.resolve(a)
                    }).fail(c.reject)
                }, void 0), c.promise
            })
        }

        function J(a) {
            return x(a, function (a) {
                return a = db(a, u), x(I(db(a, function (a) {
                    return x(a, $, $)
                })), function () {
                    return a
                })
            })
        }

        function K(a, b) {
            return x(a, void 0, b)
        }

        function L(a, b) {
            return x(a, void 0, void 0, b)
        }

        function M(a, b) {
            return x(a, function (a) {
                return x(b(), function () {
                    return a
                })
            }, function (a) {
                return x(b(), function () {
                    return s(a)
                })
            })
        }

        function N(a, b, d, e) {
            var f = function (b) {
                Y(function () {
                    if (c(b, a), !h.onerror)throw b;
                    h.onerror(b)
                })
            }, g = b || d || e ? x(a, b, d, e) : a;
            "object" == typeof process && process && process.domain && (f = process.domain.bind(f)), K(g, f)
        }

        function O(a, b) {
            var c = i(), d = setTimeout(function () {
                c.reject(new Error("Timed out after " + b + " ms"))
            }, b);
            return x(a, function (a) {
                clearTimeout(d), c.resolve(a)
            }, function (a) {
                clearTimeout(d), c.reject(a)
            }), c.promise
        }

        function P(a, b) {
            void 0 === b && (b = a, a = void 0);
            var c = i();
            return setTimeout(function () {
                c.resolve(a)
            }, b), c.promise
        }

        function Q(a, b) {
            var c = ab(b), d = i();
            return c.push(d.makeNodeResolver()), F(a, c).fail(d.reject), d.promise
        }

        function R(a) {
            var b = ab(arguments, 1), c = i();
            return b.push(c.makeNodeResolver()), F(a, b).fail(c.reject), c.promise
        }

        function S(a) {
            var b = ab(arguments, 1);
            return function () {
                var c = b.concat(ab(arguments)), d = i();
                return c.push(d.makeNodeResolver()), F(a, c).fail(d.reject), d.promise
            }
        }

        function T(a) {
            var b = ab(arguments, 1);
            return function () {
                function c() {
                    return a.apply(f, arguments)
                }

                var d = b.concat(ab(arguments)), e = i();
                d.push(e.makeNodeResolver());
                var f = this;
                return F(c, d).fail(e.reject), e.promise
            }
        }

        function U(a, b, c) {
            var d = ab(c || []), e = i();
            return d.push(e.makeNodeResolver()), mb(a, b, d).fail(e.reject), e.promise
        }

        function V(a, b) {
            var c = ab(arguments, 2), d = i();
            return c.push(d.makeNodeResolver()), mb(a, b, c).fail(d.reject), d.promise
        }

        function W(a, b) {
            return b ? void a.then(function (a) {
                Y(function () {
                    b(null, a)
                })
            }, function (a) {
                Y(function () {
                    b(a)
                })
            }) : a
        }

        var X, Y, Z = g(), $ = function () {
        };
        "undefined" != typeof process ? Y = process.nextTick : "function" == typeof setImmediate ? Y = "undefined" != typeof window ? setImmediate.bind(window) : setImmediate : !function () {
            function a() {
                if (--f, ++h >= e) {
                    h = 0, e *= 4;
                    for (var a = g && Math.min(g - 1, e); a > f;)++f, b()
                }
                for (; g;) {
                    --g, c = c.next;
                    var d = c.task;
                    c.task = void 0, d()
                }
                h = 0
            }

            var b, c = {task: void 0, next: null}, d = c, e = 2, f = 0, g = 0, h = 0;
            if (Y = function (a) {
                    d = d.next = {task: a, next: null}, f < ++g && e > f && (++f, b())
                }, "undefined" != typeof MessageChannel) {
                var i = new MessageChannel;
                i.port1.onmessage = a, b = function () {
                    i.port2.postMessage(0)
                }
            } else b = function () {
                setTimeout(a, 0)
            }
        }();
        var _, ab = a(Array.prototype.slice), bb = a(Array.prototype.reduce || function (a, b) {
            var c = 0, d = this.length;
            if (1 === arguments.length)for (; ;) {
                if (c in this) {
                    b = this[c++];
                    break
                }
                if (++c >= d)throw new TypeError
            }
            for (; d > c; c++)c in this && (b = a(b, this[c], c));
            return b
        }), cb = a(Array.prototype.indexOf || function (a) {
            for (var b = 0; b < this.length; b++)if (this[b] === a)return b;
            return -1
        }), db = a(Array.prototype.map || function (a, b) {
            var c = this, d = [];
            return bb(c, function (e, f, g) {
                d.push(a.call(b, f, g, c))
            }, void 0), d
        }), eb = Object.create || function (a) {
                function b() {
                }

                return b.prototype = a, new b
            }, fb = a(Object.prototype.hasOwnProperty), gb = Object.keys || function (a) {
                var b = [];
                for (var c in a)fb(a, c) && b.push(c);
                return b
            }, hb = a(Object.prototype.toString);
        _ = "undefined" != typeof ReturnValue ? ReturnValue : function (a) {
            this.value = a
        }, h.longStackJumpLimit = 1;
        var ib = "From previous event:";
        h.nextTick = Y, h.defer = i, i.prototype.makeNodeResolver = function () {
            var a = this;
            return function (b, c) {
                b ? a.reject(b) : a.resolve(arguments.length > 2 ? ab(arguments, 1) : c)
            }
        }, h.promise = j, h.makePromise = k, k.prototype.then = function (a, b, c) {
            return x(this, a, b, c)
        }, k.prototype.thenResolve = function (a) {
            return x(this, function () {
                return a
            })
        }, bb(["isFulfilled", "isRejected", "isPending", "dispatch", "when", "spread", "get", "put", "set", "del", "delete", "post", "send", "invoke", "keys", "fapply", "fcall", "fbind", "all", "allResolved", "timeout", "delay", "catch", "finally", "fail", "fin", "progress", "done", "nfcall", "nfapply", "nfbind", "denodeify", "nbind", "ncall", "napply", "nbind", "npost", "nsend", "ninvoke", "nodeify"], function (a, b) {
            k.prototype[b] = function () {
                return h[b].apply(h, [this].concat(ab(arguments)))
            }
        }, void 0), k.prototype.toSource = function () {
            return this.toString()
        }, k.prototype.toString = function () {
            return "[object Promise]"
        }, h.nearer = l, h.isPromise = m, h.isPromiseAlike = n, h.isPending = o, h.isFulfilled = p, h.isRejected = q;
        var jb, kb = [], lb = [];
        "undefined" != typeof process && process.on && process.on("exit", function () {
            for (var a = 0; a < lb.length; a++) {
                var b = lb[a];
                b && "undefined" != typeof b.stack ? console.warn("Unhandled rejected promise:", b.stack) : console.warn("Unhandled rejected promise (no stack):", b)
            }
        }), h.reject = s, h.fulfill = t, h.resolve = u, h.master = w, h.when = x, h.spread = y, h.async = z, h["return"] = A, h.promised = B, h.dispatch = C, h.dispatcher = D, h.get = D("get"), h.set = D("set"), h["delete"] = h.del = D("delete");
        var mb = h.post = D("post");
        h.send = E, h.invoke = E, h.fapply = F, h["try"] = G, h.fcall = G, h.fbind = H, h.keys = D("keys"), h.all = I, h.allResolved = J, h["catch"] = h.fail = K, h.progress = L, h["finally"] = h.fin = M, h.done = N, h.timeout = O, h.delay = P, h.nfapply = Q, h.nfcall = R, h.nfbind = S, h.denodeify = h.nfbind, h.nbind = T, h.npost = U, h.nsend = V, h.ninvoke = h.nsend, h.nodeify = W;
        var nb = g();
        return h
    }), function (a) {
        "use strict";
        var b = {VERSION: "0.5.3"};
        b.System = function () {
            this._mappings = {}, this._outlets = {}, this._handlers = {}, this.strictInjections = !0, this.autoMapOutlets = !1, this.postInjectionHook = "setup"
        }, b.System.prototype = {
            _createAndSetupInstance: function (a, b) {
                var c = new b;
                return this.injectInto(c, a), c
            }, _retrieveFromCacheOrCreate: function (a, b) {
                "undefined" == typeof b && (b = !1);
                var c;
                if (!this._mappings.hasOwnProperty(a))throw new Error(1e3);
                var d = this._mappings[a];
                return !b && d.isSingleton ? (null == d.object && (d.object = this._createAndSetupInstance(a, d.clazz)), c = d.object) : c = d.clazz ? this._createAndSetupInstance(a, d.clazz) : d.object, c
            }, mapOutlet: function (a, b, c) {
                if ("undefined" == typeof a)throw new Error(1010);
                return b = b || "global", c = c || a, this._outlets.hasOwnProperty(b) || (this._outlets[b] = {}), this._outlets[b][c] = a, this
            }, getObject: function (a) {
                if ("undefined" == typeof a)throw new Error(1020);
                return this._retrieveFromCacheOrCreate(a)
            }, mapValue: function (a, b) {
                if ("undefined" == typeof a)throw new Error(1030);
                return this._mappings[a] = {
                    clazz: null,
                    object: b,
                    isSingleton: !0
                }, this.autoMapOutlets && this.mapOutlet(a), this.hasMapping(a) && this.injectInto(b, a), this
            }, hasMapping: function (a) {
                if ("undefined" == typeof a)throw new Error(1040);
                return this._mappings.hasOwnProperty(a)
            }, mapClass: function (a, b) {
                if ("undefined" == typeof a)throw new Error(1050);
                if ("undefined" == typeof b)throw new Error(1051);
                return this._mappings[a] = {
                    clazz: b,
                    object: null,
                    isSingleton: !1
                }, this.autoMapOutlets && this.mapOutlet(a), this
            }, mapSingleton: function (a, b) {
                if ("undefined" == typeof a)throw new Error(1060);
                if ("undefined" == typeof b)throw new Error(1061);
                return this._mappings[a] = {
                    clazz: b,
                    object: null,
                    isSingleton: !0
                }, this.autoMapOutlets && this.mapOutlet(a), this
            }, instantiate: function (a) {
                if ("undefined" == typeof a)throw new Error(1070);
                return this._retrieveFromCacheOrCreate(a, !0)
            }, injectInto: function (a, b) {
                if ("undefined" == typeof a)throw new Error(1080);
                if ("object" == typeof a) {
                    var c = [];
                    this._outlets.hasOwnProperty("global") && c.push(this._outlets.global), "undefined" != typeof b && this._outlets.hasOwnProperty(b) && c.push(this._outlets[b]);
                    for (var d in c) {
                        var e = c[d];
                        for (var f in e) {
                            var g = e[f];
                            (!this.strictInjections || f in a) && (a[f] = this.getObject(g))
                        }
                    }
                    "setup"in a && a.setup.call(a)
                }
                return this
            }, unmap: function (a) {
                if ("undefined" == typeof a)throw new Error(1090);
                return delete this._mappings[a], this
            }, unmapOutlet: function (a, b) {
                if ("undefined" == typeof a)throw new Error(1100);
                if ("undefined" == typeof b)throw new Error(1101);
                return delete this._outlets[a][b], this
            }, mapHandler: function (a, b, c, d, e) {
                if ("undefined" == typeof a)throw new Error(1110);
                return b = b || "global", c = c || a, "undefined" == typeof d && (d = !1), "undefined" == typeof e && (e = !1), this._handlers.hasOwnProperty(a) || (this._handlers[a] = {}), this._handlers[a].hasOwnProperty(b) || (this._handlers[a][b] = []), this._handlers[a][b].push({
                    handler: c,
                    oneShot: d,
                    passEvent: e
                }), this
            }, unmapHandler: function (a, b, c) {
                if ("undefined" == typeof a)throw new Error(1120);
                if (b = b || "global", c = c || a, this._handlers.hasOwnProperty(a) && this._handlers[a].hasOwnProperty(b)) {
                    var d = this._handlers[a][b];
                    for (var e in d) {
                        var f = d[e];
                        if (f.handler === c) {
                            d.splice(e, 1);
                            break
                        }
                    }
                }
                return this
            }, notify: function (a) {
                if ("undefined" == typeof a)throw new Error(1130);
                var b = Array.prototype.slice.call(arguments), c = b.slice(1);
                if (this._handlers.hasOwnProperty(a)) {
                    var d = this._handlers[a];
                    for (var e in d) {
                        var f, g = d[e];
                        "global" !== e && (f = this.getObject(e));
                        var h, i, j = [];
                        for (h = 0, i = g.length; i > h; h++) {
                            var k, l = g[h];
                            k = f && "string" == typeof l.handler ? f[l.handler] : l.handler, l.oneShot && j.unshift(h), l.passEvent ? k.apply(f, b) : k.apply(f, c)
                        }
                        for (h = 0, i = j.length; i > h; h++)g.splice(j[h], 1)
                    }
                }
                return this
            }
        }, a.dijon = b
    }(this), "undefined" == typeof utils)var utils = {};
"undefined" == typeof utils.Math && (utils.Math = {}), utils.Math.to64BitNumber = function (a, b) {
    var c, d, e;
    return c = new goog.math.Long(0, b), d = new goog.math.Long(a, 0), e = c.add(d), e.toNumber()
}, goog = {}, goog.math = {}, goog.math.Long = function (a, b) {
    this.low_ = 0 | a, this.high_ = 0 | b
}, goog.math.Long.IntCache_ = {}, goog.math.Long.fromInt = function (a) {
    if (a >= -128 && 128 > a) {
        var b = goog.math.Long.IntCache_[a];
        if (b)return b
    }
    var c = new goog.math.Long(0 | a, 0 > a ? -1 : 0);
    return a >= -128 && 128 > a && (goog.math.Long.IntCache_[a] = c), c
}, goog.math.Long.fromNumber = function (a) {
    return isNaN(a) || !isFinite(a) ? goog.math.Long.ZERO : a <= -goog.math.Long.TWO_PWR_63_DBL_ ? goog.math.Long.MIN_VALUE : a + 1 >= goog.math.Long.TWO_PWR_63_DBL_ ? goog.math.Long.MAX_VALUE : 0 > a ? goog.math.Long.fromNumber(-a).negate() : new goog.math.Long(a % goog.math.Long.TWO_PWR_32_DBL_ | 0, a / goog.math.Long.TWO_PWR_32_DBL_ | 0)
}, goog.math.Long.fromBits = function (a, b) {
    return new goog.math.Long(a, b)
}, goog.math.Long.fromString = function (a, b) {
    if (0 == a.length)throw Error("number format error: empty string");
    var c = b || 10;
    if (2 > c || c > 36)throw Error("radix out of range: " + c);
    if ("-" == a.charAt(0))return goog.math.Long.fromString(a.substring(1), c).negate();
    if (a.indexOf("-") >= 0)throw Error('number format error: interior "-" character: ' + a);
    for (var d = goog.math.Long.fromNumber(Math.pow(c, 8)), e = goog.math.Long.ZERO, f = 0; f < a.length; f += 8) {
        var g = Math.min(8, a.length - f), h = parseInt(a.substring(f, f + g), c);
        if (8 > g) {
            var i = goog.math.Long.fromNumber(Math.pow(c, g));
            e = e.multiply(i).add(goog.math.Long.fromNumber(h))
        } else e = e.multiply(d), e = e.add(goog.math.Long.fromNumber(h))
    }
    return e
}, goog.math.Long.TWO_PWR_16_DBL_ = 65536, goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24, goog.math.Long.TWO_PWR_32_DBL_ = goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_, goog.math.Long.TWO_PWR_31_DBL_ = goog.math.Long.TWO_PWR_32_DBL_ / 2, goog.math.Long.TWO_PWR_48_DBL_ = goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_, goog.math.Long.TWO_PWR_64_DBL_ = goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_, goog.math.Long.TWO_PWR_63_DBL_ = goog.math.Long.TWO_PWR_64_DBL_ / 2, goog.math.Long.ZERO = goog.math.Long.fromInt(0), goog.math.Long.ONE = goog.math.Long.fromInt(1), goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1), goog.math.Long.MAX_VALUE = goog.math.Long.fromBits(-1, 2147483647), goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, -2147483648), goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24), goog.math.Long.prototype.toInt = function () {
    return this.low_
}, goog.math.Long.prototype.toNumber = function () {
    return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ + this.getLowBitsUnsigned()
}, goog.math.Long.prototype.toString = function (a) {
    var b = a || 10;
    if (2 > b || b > 36)throw Error("radix out of range: " + b);
    if (this.isZero())return "0";
    if (this.isNegative()) {
        if (this.equals(goog.math.Long.MIN_VALUE)) {
            var c = goog.math.Long.fromNumber(b), d = this.div(c), e = d.multiply(c).subtract(this);
            return d.toString(b) + e.toInt().toString(b)
        }
        return "-" + this.negate().toString(b)
    }
    for (var f = goog.math.Long.fromNumber(Math.pow(b, 6)), e = this, g = ""; ;) {
        var h = e.div(f), i = e.subtract(h.multiply(f)).toInt(), j = i.toString(b);
        if (e = h, e.isZero())return j + g;
        for (; j.length < 6;)j = "0" + j;
        g = "" + j + g
    }
}, goog.math.Long.prototype.getHighBits = function () {
    return this.high_
}, goog.math.Long.prototype.getLowBits = function () {
    return this.low_
}, goog.math.Long.prototype.getLowBitsUnsigned = function () {
    return this.low_ >= 0 ? this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_
}, goog.math.Long.prototype.getNumBitsAbs = function () {
    if (this.isNegative())return this.equals(goog.math.Long.MIN_VALUE) ? 64 : this.negate().getNumBitsAbs();
    for (var a = 0 != this.high_ ? this.high_ : this.low_, b = 31; b > 0 && 0 == (a & 1 << b); b--);
    return 0 != this.high_ ? b + 33 : b + 1
}, goog.math.Long.prototype.isZero = function () {
    return 0 == this.high_ && 0 == this.low_
}, goog.math.Long.prototype.isNegative = function () {
    return this.high_ < 0
}, goog.math.Long.prototype.isOdd = function () {
    return 1 == (1 & this.low_)
}, goog.math.Long.prototype.equals = function (a) {
    return this.high_ == a.high_ && this.low_ == a.low_
}, goog.math.Long.prototype.notEquals = function (a) {
    return this.high_ != a.high_ || this.low_ != a.low_
}, goog.math.Long.prototype.lessThan = function (a) {
    return this.compare(a) < 0
}, goog.math.Long.prototype.lessThanOrEqual = function (a) {
    return this.compare(a) <= 0
}, goog.math.Long.prototype.greaterThan = function (a) {
    return this.compare(a) > 0
}, goog.math.Long.prototype.greaterThanOrEqual = function (a) {
    return this.compare(a) >= 0
}, goog.math.Long.prototype.compare = function (a) {
    if (this.equals(a))return 0;
    var b = this.isNegative(), c = a.isNegative();
    return b && !c ? -1 : !b && c ? 1 : this.subtract(a).isNegative() ? -1 : 1
}, goog.math.Long.prototype.negate = function () {
    return this.equals(goog.math.Long.MIN_VALUE) ? goog.math.Long.MIN_VALUE : this.not().add(goog.math.Long.ONE)
}, goog.math.Long.prototype.add = function (a) {
    var b = this.high_ >>> 16, c = 65535 & this.high_, d = this.low_ >>> 16, e = 65535 & this.low_, f = a.high_ >>> 16, g = 65535 & a.high_, h = a.low_ >>> 16, i = 65535 & a.low_, j = 0, k = 0, l = 0, m = 0;
    return m += e + i, l += m >>> 16, m &= 65535, l += d + h, k += l >>> 16, l &= 65535, k += c + g, j += k >>> 16, k &= 65535, j += b + f, j &= 65535, goog.math.Long.fromBits(l << 16 | m, j << 16 | k)
}, goog.math.Long.prototype.subtract = function (a) {
    return this.add(a.negate())
}, goog.math.Long.prototype.multiply = function (a) {
    if (this.isZero())return goog.math.Long.ZERO;
    if (a.isZero())return goog.math.Long.ZERO;
    if (this.equals(goog.math.Long.MIN_VALUE))return a.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    if (a.equals(goog.math.Long.MIN_VALUE))return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    if (this.isNegative())return a.isNegative() ? this.negate().multiply(a.negate()) : this.negate().multiply(a).negate();
    if (a.isNegative())return this.multiply(a.negate()).negate();
    if (this.lessThan(goog.math.Long.TWO_PWR_24_) && a.lessThan(goog.math.Long.TWO_PWR_24_))return goog.math.Long.fromNumber(this.toNumber() * a.toNumber());
    var b = this.high_ >>> 16, c = 65535 & this.high_, d = this.low_ >>> 16, e = 65535 & this.low_, f = a.high_ >>> 16, g = 65535 & a.high_, h = a.low_ >>> 16, i = 65535 & a.low_, j = 0, k = 0, l = 0, m = 0;
    return m += e * i, l += m >>> 16, m &= 65535, l += d * i, k += l >>> 16, l &= 65535, l += e * h, k += l >>> 16, l &= 65535, k += c * i, j += k >>> 16, k &= 65535, k += d * h, j += k >>> 16, k &= 65535, k += e * g, j += k >>> 16, k &= 65535, j += b * i + c * h + d * g + e * f, j &= 65535, goog.math.Long.fromBits(l << 16 | m, j << 16 | k)
}, goog.math.Long.prototype.div = function (a) {
    if (a.isZero())throw Error("division by zero");
    if (this.isZero())return goog.math.Long.ZERO;
    if (this.equals(goog.math.Long.MIN_VALUE)) {
        if (a.equals(goog.math.Long.ONE) || a.equals(goog.math.Long.NEG_ONE))return goog.math.Long.MIN_VALUE;
        if (a.equals(goog.math.Long.MIN_VALUE))return goog.math.Long.ONE;
        var b = this.shiftRight(1), c = b.div(a).shiftLeft(1);
        if (c.equals(goog.math.Long.ZERO))return a.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
        var d = this.subtract(a.multiply(c)), e = c.add(d.div(a));
        return e
    }
    if (a.equals(goog.math.Long.MIN_VALUE))return goog.math.Long.ZERO;
    if (this.isNegative())return a.isNegative() ? this.negate().div(a.negate()) : this.negate().div(a).negate();
    if (a.isNegative())return this.div(a.negate()).negate();
    for (var f = goog.math.Long.ZERO, d = this; d.greaterThanOrEqual(a);) {
        for (var c = Math.max(1, Math.floor(d.toNumber() / a.toNumber())), g = Math.ceil(Math.log(c) / Math.LN2), h = 48 >= g ? 1 : Math.pow(2, g - 48), i = goog.math.Long.fromNumber(c), j = i.multiply(a); j.isNegative() || j.greaterThan(d);)c -= h, i = goog.math.Long.fromNumber(c), j = i.multiply(a);
        i.isZero() && (i = goog.math.Long.ONE), f = f.add(i), d = d.subtract(j)
    }
    return f
}, goog.math.Long.prototype.modulo = function (a) {
    return this.subtract(this.div(a).multiply(a))
}, goog.math.Long.prototype.not = function () {
    return goog.math.Long.fromBits(~this.low_, ~this.high_)
}, goog.math.Long.prototype.and = function (a) {
    return goog.math.Long.fromBits(this.low_ & a.low_, this.high_ & a.high_)
}, goog.math.Long.prototype.or = function (a) {
    return goog.math.Long.fromBits(this.low_ | a.low_, this.high_ | a.high_)
}, goog.math.Long.prototype.xor = function (a) {
    return goog.math.Long.fromBits(this.low_ ^ a.low_, this.high_ ^ a.high_)
}, goog.math.Long.prototype.shiftLeft = function (a) {
    if (a &= 63, 0 == a)return this;
    var b = this.low_;
    if (32 > a) {
        var c = this.high_;
        return goog.math.Long.fromBits(b << a, c << a | b >>> 32 - a)
    }
    return goog.math.Long.fromBits(0, b << a - 32)
}, goog.math.Long.prototype.shiftRight = function (a) {
    if (a &= 63, 0 == a)return this;
    var b = this.high_;
    if (32 > a) {
        var c = this.low_;
        return goog.math.Long.fromBits(c >>> a | b << 32 - a, b >> a)
    }
    return goog.math.Long.fromBits(b >> a - 32, b >= 0 ? 0 : -1)
}, goog.math.Long.prototype.shiftRightUnsigned = function (a) {
    if (a &= 63, 0 == a)return this;
    var b = this.high_;
    if (32 > a) {
        var c = this.low_;
        return goog.math.Long.fromBits(c >>> a | b << 32 - a, b >>> a)
    }
    return 32 == a ? goog.math.Long.fromBits(b, 0) : goog.math.Long.fromBits(b >>> a - 32, 0)
};
var UTF8 = {};
UTF8.encode = function (a) {
    for (var b = [], c = 0; c < a.length; ++c) {
        var d = a.charCodeAt(c);
        128 > d ? b.push(d) : 2048 > d ? (b.push(192 | d >> 6), b.push(128 | 63 & d)) : 65536 > d ? (b.push(224 | d >> 12), b.push(128 | 63 & d >> 6), b.push(128 | 63 & d)) : (b.push(240 | d >> 18), b.push(128 | 63 & d >> 12), b.push(128 | 63 & d >> 6), b.push(128 | 63 & d))
    }
    return b
}, UTF8.decode = function (a) {
    for (var b = [], c = 0; c < a.length;) {
        var d = a[c++];
        128 > d || (224 > d ? (d = (31 & d) << 6, d |= 63 & a[c++]) : 240 > d ? (d = (15 & d) << 12, d |= (63 & a[c++]) << 6, d |= 63 & a[c++]) : (d = (7 & d) << 18, d |= (63 & a[c++]) << 12, d |= (63 & a[c++]) << 6, d |= 63 & a[c++])), b.push(String.fromCharCode(d))
    }
    return b.join("")
};
var BASE64 = {};
if (function (b) {
        var c = function (a) {
            for (var c = 0, d = [], e = 0 | a.length / 3; 0 < e--;) {
                var f = (a[c] << 16) + (a[c + 1] << 8) + a[c + 2];
                c += 3, d.push(b.charAt(63 & f >> 18)), d.push(b.charAt(63 & f >> 12)), d.push(b.charAt(63 & f >> 6)), d.push(b.charAt(63 & f))
            }
            if (2 == a.length - c) {
                var f = (a[c] << 16) + (a[c + 1] << 8);
                d.push(b.charAt(63 & f >> 18)), d.push(b.charAt(63 & f >> 12)), d.push(b.charAt(63 & f >> 6)), d.push("=")
            } else if (1 == a.length - c) {
                var f = a[c] << 16;
                d.push(b.charAt(63 & f >> 18)), d.push(b.charAt(63 & f >> 12)), d.push("==")
            }
            return d.join("")
        }, d = function () {
            for (var a = [], c = 0; c < b.length; ++c)a[b.charCodeAt(c)] = c;
            return a["=".charCodeAt(0)] = 0, a
        }(), e = function (a) {
            for (var b = 0, c = [], e = 0 | a.length / 4; 0 < e--;) {
                var f = (d[a.charCodeAt(b)] << 18) + (d[a.charCodeAt(b + 1)] << 12) + (d[a.charCodeAt(b + 2)] << 6) + d[a.charCodeAt(b + 3)];
                c.push(255 & f >> 16), c.push(255 & f >> 8), c.push(255 & f), b += 4
            }
            return c && ("=" == a.charAt(b - 2) ? (c.pop(), c.pop()) : "=" == a.charAt(b - 1) && c.pop()), c
        }, f = {};
        f.encode = function (a) {
            for (var b = [], c = 0; c < a.length; ++c)b.push(a.charCodeAt(c));
            return b
        }, f.decode = function () {
            for (var b = 0; b < s.length; ++b)a[b] = String.fromCharCode(a[b]);
            return a.join("")
        }, BASE64.decodeArray = function (a) {
            var b = e(a);
            return new Uint8Array(b)
        }, BASE64.encodeASCII = function (a) {
            var b = f.encode(a);
            return c(b)
        }, BASE64.decodeASCII = function (a) {
            var b = e(a);
            return f.decode(b)
        }, BASE64.encode = function (a) {
            var b = UTF8.encode(a);
            return c(b)
        }, BASE64.decode = function (a) {
            var b = e(a);
            return UTF8.decode(b)
        }
    }("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), void 0 === btoa)var btoa = BASE64.encode;
if (void 0 === atob)var atob = BASE64.decode;
MediaPlayer = function (a) {
    "use strict";
    var b, c, d, e, f, g = "1.2.0", h = a, i = !1, j = !1, k = !0, l = !1, m = MediaPlayer.dependencies.BufferExtensions.BUFFER_SIZE_REQUIRED, n = function () {
        return !!c && !!d
    }, o = function () {
        if (!i)throw"MediaPlayer not initialized!";
        if (!this.capabilities.supportsMediaSource())return void this.errHandler.capabilityError("mediasource");
        if (!c || !d)throw"Missing view or source.";
        j = !0, e = b.getObject("streamController"), e.setVideoModel(f), e.setAutoPlay(k), e.load(d), b.mapValue("scheduleWhilePaused", l), b.mapOutlet("scheduleWhilePaused", "stream"), b.mapOutlet("scheduleWhilePaused", "bufferController"), b.mapValue("bufferMax", m), b.injectInto(this.bufferExt, "bufferMax")
    }, p = function () {
        n() && o.call(this)
    }, q = function () {
        var a = this.metricsModel.getReadOnlyMetricsFor("video") || this.metricsModel.getReadOnlyMetricsFor("audio");
        return this.metricsExt.getCurrentDVRInfo(a)
    }, r = function () {
        return q.call(this).mpd.timeShiftBufferDepth
    }, s = function (a) {
        var b = q.call(this), c = b.range.start + parseInt(a);
        return c > b.range.end && (c = b.range.end), c
    }, t = function (a) {
        f.getElement().currentTime = this.getDVRSeekOffset(a)
    }, u = function () {
        var a = q.call(this);
        return null === a ? 0 : Math.round(this.duration() - (a.range.end - a.time))
    }, v = function () {
        var a, b = q.call(this);
        return null === b ? 0 : (a = b.range.end - b.range.start, Math.round(a < b.mpd.timeShiftBufferDepth ? a : b.mpd.timeShiftBufferDepth))
    }, w = function () {
        var a, b, c = q.call(this);
        return null === c ? 0 : (a = c.mpd.availabilityStartTime.getTime() / 1e3, b = this.time() + (a + c.range.start), Math.round(b))
    }, x = function () {
        var a, b, c = q.call(this);
        return null === c ? 0 : (a = c.mpd.availabilityStartTime.getTime() / 1e3, b = a + c.range.start + this.duration(), Math.round(b))
    }, y = function (a, b, c) {
        var d = new Date(1e3 * a), e = d.toLocaleDateString(b), f = d.toLocaleTimeString(b, {hour12: c});
        return f + " " + e
    }, z = function (a) {
        a = Math.max(a, 0);
        var b = Math.floor(a / 3600), c = Math.floor(a % 3600 / 60), d = Math.floor(a % 3600 % 60);
        return (0 === b ? "" : 10 > b ? "0" + b.toString() + ":" : b.toString() + ":") + (10 > c ? "0" + c.toString() : c.toString()) + ":" + (10 > d ? "0" + d.toString() : d.toString())
    };
    return b = new dijon.System, b.mapValue("system", b), b.mapOutlet("system"), b.injectInto(h), {
        debug: void 0,
        eventBus: void 0,
        capabilities: void 0,
        abrController: void 0,
        metricsModel: void 0,
        metricsExt: void 0,
        bufferExt: void 0,
        errHandler: void 0,
        tokenAuthentication: void 0,
        uriQueryFragModel: void 0,
        addEventListener: function (a, b, c) {
            this.eventBus.addEventListener(a, b, c)
        },
        removeEventListener: function (a, b, c) {
            this.eventBus.removeEventListener(a, b, c)
        },
        getVersion: function () {
            return g
        },
        startup: function () {
            i || (b.injectInto(this), i = !0)
        },
        getDebug: function () {
            return this.debug
        },
        getVideoModel: function () {
            return f
        },
        setAutoPlay: function (a) {
            k = a
        },
        getAutoPlay: function () {
            return k
        },
        setScheduleWhilePaused: function (a) {
            l = a
        },
        getScheduleWhilePaused: function () {
            return l
        },
        setTokenAuthentication: function (a, b) {
            this.tokenAuthentication.setTokenAuthentication({name: a, type: b})
        },
        setBufferMax: function (a) {
            m = a
        },
        getBufferMax: function () {
            return m
        },
        getMetricsExt: function () {
            return this.metricsExt
        },
        getMetricsFor: function (a) {
            var b = this.metricsModel.getReadOnlyMetricsFor(a);
            return b
        },
        getQualityFor: function (a) {
            return this.abrController.getQualityFor(a)
        },
        setQualityFor: function (a, b) {
            this.abrController.setPlaybackQuality(a, b)
        },
        getAutoSwitchQuality: function () {
            return this.abrController.getAutoSwitchBitrate()
        },
        setAutoSwitchQuality: function (a) {
            this.abrController.setAutoSwitchBitrate(a)
        },
        attachView: function (a) {
            if (!i)throw"MediaPlayer not initialized!";
            c = a, f = null, c && (f = b.getObject("videoModel"), f.setElement(c)), j && e && (e.reset(), e = null, j = !1), n.call(this) && p.call(this)
        },
        attachSource: function (a) {
            if (!i)throw"MediaPlayer not initialized!";
            d = this.uriQueryFragModel.parseURI(a), this.setQualityFor("video", 0), this.setQualityFor("audio", 0), j && e && (e.reset(), e = null, j = !1), n.call(this) && p.call(this)
        },
        reset: function () {
            this.attachSource(null), this.attachView(null)
        },
        play: o,
        isReady: n,
        seek: t,
        time: u,
        duration: v,
        timeAsUTC: w,
        durationAsUTC: x,
        getDVRWindowSize: r,
        getDVRSeekOffset: s,
        formatUTC: y,
        convertToTimeCode: z
    }
}, MediaPlayer.prototype = {constructor: MediaPlayer}, MediaPlayer.dependencies = {}, MediaPlayer.utils = {}, MediaPlayer.models = {}, MediaPlayer.vo = {}, MediaPlayer.vo.metrics = {}, MediaPlayer.rules = {}, MediaPlayer.di = {}, MediaPlayer.di.Context = function () {
    "use strict";
    return {
        system: void 0, setup: function () {
            this.system.autoMapOutlets = !0, this.system.mapSingleton("debug", MediaPlayer.utils.Debug), this.system.mapSingleton("tokenAuthentication", MediaPlayer.utils.TokenAuthentication), this.system.mapSingleton("eventBus", MediaPlayer.utils.EventBus), this.system.mapSingleton("capabilities", MediaPlayer.utils.Capabilities), this.system.mapSingleton("textTrackExtensions", MediaPlayer.utils.TextTrackExtensions), this.system.mapSingleton("vttParser", MediaPlayer.utils.VTTParser), this.system.mapSingleton("ttmlParser", MediaPlayer.utils.TTMLParser), this.system.mapClass("videoModel", MediaPlayer.models.VideoModel), this.system.mapSingleton("manifestModel", MediaPlayer.models.ManifestModel), this.system.mapSingleton("metricsModel", MediaPlayer.models.MetricsModel), this.system.mapSingleton("uriQueryFragModel", MediaPlayer.models.URIQueryAndFragmentModel), this.system.mapClass("protectionModel", MediaPlayer.models.ProtectionModel), this.system.mapSingleton("textSourceBuffer", MediaPlayer.dependencies.TextSourceBuffer), this.system.mapSingleton("mediaSourceExt", MediaPlayer.dependencies.MediaSourceExtensions), this.system.mapSingleton("sourceBufferExt", MediaPlayer.dependencies.SourceBufferExtensions), this.system.mapSingleton("bufferExt", MediaPlayer.dependencies.BufferExtensions), this.system.mapSingleton("abrController", MediaPlayer.dependencies.AbrController), this.system.mapSingleton("errHandler", MediaPlayer.dependencies.ErrorHandler), this.system.mapSingleton("protectionExt", MediaPlayer.dependencies.ProtectionExtensions), this.system.mapSingleton("videoExt", MediaPlayer.dependencies.VideoModelExtensions), this.system.mapClass("protectionController", MediaPlayer.dependencies.ProtectionController), this.system.mapClass("metrics", MediaPlayer.models.MetricsList), this.system.mapClass("downloadRatioRule", MediaPlayer.rules.DownloadRatioRule), this.system.mapClass("insufficientBufferRule", MediaPlayer.rules.InsufficientBufferRule), this.system.mapClass("limitSwitchesRule", MediaPlayer.rules.LimitSwitchesRule), this.system.mapClass("abrRulesCollection", MediaPlayer.rules.BaseRulesCollection), this.system.mapClass("eventController", MediaPlayer.dependencies.EventController), this.system.mapClass("textController", MediaPlayer.dependencies.TextController), this.system.mapClass("bufferController", MediaPlayer.dependencies.BufferController), this.system.mapClass("manifestLoader", MediaPlayer.dependencies.ManifestLoader), this.system.mapSingleton("manifestUpdater", MediaPlayer.dependencies.ManifestUpdater), this.system.mapClass("fragmentController", MediaPlayer.dependencies.FragmentController), this.system.mapClass("fragmentLoader", MediaPlayer.dependencies.FragmentLoader), this.system.mapClass("fragmentModel", MediaPlayer.dependencies.FragmentModel), this.system.mapSingleton("streamController", MediaPlayer.dependencies.StreamController), this.system.mapClass("stream", MediaPlayer.dependencies.Stream), this.system.mapClass("requestScheduler", MediaPlayer.dependencies.RequestScheduler), this.system.mapSingleton("schedulerExt", MediaPlayer.dependencies.SchedulerExtensions), this.system.mapClass("schedulerModel", MediaPlayer.dependencies.SchedulerModel)
        }
    }
}, Dash = function () {
    "use strict";
    return {modules: {}, dependencies: {}, vo: {}, di: {}}
}(), Dash.di.DashContext = function () {
    "use strict";
    return {
        system: void 0, setup: function () {
            Dash.di.DashContext.prototype.setup.call(this), this.system.mapClass("parser", Dash.dependencies.DashParser), this.system.mapClass("indexHandler", Dash.dependencies.DashHandler), this.system.mapClass("baseURLExt", Dash.dependencies.BaseURLExtensions), this.system.mapClass("fragmentExt", Dash.dependencies.FragmentExtensions), this.system.mapSingleton("manifestExt", Dash.dependencies.DashManifestExtensions), this.system.mapSingleton("metricsExt", Dash.dependencies.DashMetricsExtensions), this.system.mapSingleton("timelineConverter", Dash.dependencies.TimelineConverter)
        }
    }
}, Dash.di.DashContext.prototype = new MediaPlayer.di.Context, Dash.di.DashContext.prototype.constructor = Dash.di.DashContext, Dash.dependencies.BaseURLExtensions = function () {
    "use strict";
    var a = function (a, b) {
        for (var c, d, e, f, g, h, i, j, k, l, m = new DataView(a), n = {}, o = 0; "sidx" !== j && o < m.byteLength;) {
            for (k = m.getUint32(o), o += 4, j = "", f = 0; 4 > f; f += 1)l = m.getInt8(o), j += String.fromCharCode(l), o += 1;
            "moof" !== j && "traf" !== j && "sidx" !== j ? o += k - 8 : "sidx" === j && (o -= 8)
        }
        if (e = m.getUint32(o, !1) + o, e > a.byteLength)throw"sidx terminates after array buffer";
        for (n.version = m.getUint8(o + 8), o += 12, n.timescale = m.getUint32(o + 4, !1), o += 8, 0 === n.version ? (n.earliest_presentation_time = m.getUint32(o, !1), n.first_offset = m.getUint32(o + 4, !1), o += 8) : (n.earliest_presentation_time = utils.Math.to64BitNumber(m.getUint32(o + 4, !1), m.getUint32(o, !1)), n.first_offset = (m.getUint32(o + 8, !1) << 32) + m.getUint32(o + 12, !1), o += 16), n.first_offset += e + (b || 0), n.reference_count = m.getUint16(o + 2, !1), o += 4, n.references = [], c = n.first_offset, d = n.earliest_presentation_time, f = 0; f < n.reference_count; f += 1)h = m.getUint32(o, !1), g = h >>> 31, h = 2147483647 & h, i = m.getUint32(o + 4, !1), o += 12, n.references.push({
            size: h,
            type: g,
            offset: c,
            duration: i,
            time: d,
            timescale: n.timescale
        }), c += h, d += i;
        if (o !== e)throw"Error: final pos " + o + " differs from SIDX end " + e;
        return n
    }, b = function (b, c, d) {
        var e, f, g, h, i, j, k, l;
        for (e = a.call(this, b, d), f = e.references, g = [], i = 0, j = f.length; j > i; i += 1)h = new Dash.vo.Segment, h.duration = f[i].duration, h.media = c, h.startTime = f[i].time, h.timescale = f[i].timescale, k = f[i].offset, l = f[i].offset + f[i].size - 1, h.mediaRange = k + "-" + l, g.push(h);
        return this.debug.log("Parsed SIDX box: " + g.length + " segments."), Q.when(g)
    }, c = function (a, b) {
        var d, e, f, g, h, i, j, k, l, m = Q.defer(), n = new DataView(a), o = 0, p = "", q = 0, r = !1, s = this;
        for (s.debug.log("Searching for initialization."); "moov" !== p && o < n.byteLength;) {
            for (q = n.getUint32(o), o += 4, p = "", i = 0; 4 > i; i += 1)j = n.getInt8(o), p += String.fromCharCode(j), o += 1;
            "ftyp" === p && (d = o - 8), "moov" === p && (e = o - 8), "moov" !== p && (o += q - 8)
        }
        return h = n.byteLength - o, "moov" !== p ? (s.debug.log("Loading more bytes to find initialization."), b.range.start = 0, b.range.end = b.bytesLoaded + b.bytesToLoad, k = new XMLHttpRequest, k.onloadend = function () {
            r || m.reject("Error loading initialization.")
        }, k.onload = function () {
            r = !0, b.bytesLoaded = b.range.end, c.call(s, k.response).then(function (a) {
                m.resolve(a)
            })
        }, k.onerror = function () {
            m.reject("Error loading initialization.")
        }, k.open("GET", s.tokenAuthentication.addTokenAsQueryArg(b.url)), k.responseType = "arraybuffer", k.setRequestHeader("Range", "bytes=" + b.range.start + "-" + b.range.end), k = s.tokenAuthentication.setTokenInRequestHeader(k), k.send(null)) : (f = void 0 === d ? e : d, g = e + q - 1, l = f + "-" + g, s.debug.log("Found the initialization.  Range: " + l), m.resolve(l)), m.promise
    }, d = function (a) {
        var b = Q.defer(), d = new XMLHttpRequest, e = !0, f = this, g = {
            url: a,
            range: {},
            searching: !1,
            bytesLoaded: 0,
            bytesToLoad: 1500,
            request: d
        };
        return f.debug.log("Start searching for initialization."), g.range.start = 0, g.range.end = g.bytesToLoad, d.onload = function () {
            d.status < 200 || d.status > 299 || (e = !1, g.bytesLoaded = g.range.end, c.call(f, d.response, g).then(function (a) {
                b.resolve(a)
            }))
        }, d.onloadend = d.onerror = function () {
            e && (e = !1, f.errHandler.downloadError("initialization", g.url, d), b.reject(d))
        }, d.open("GET", f.tokenAuthentication.addTokenAsQueryArg(g.url)), d.responseType = "arraybuffer", d.setRequestHeader("Range", "bytes=" + g.range.start + "-" + g.range.end), d = f.tokenAuthentication.setTokenInRequestHeader(d), d.send(null), f.debug.log("Perform init search: " + g.url), b.promise
    }, e = function (a, c) {
        var d, f, g, h, i, j, k, l, m = Q.defer(), n = new DataView(a), o = new XMLHttpRequest, p = 0, q = "", r = 0, s = !0, t = !1, u = this;
        for (u.debug.log("Searching for SIDX box."), u.debug.log(c.bytesLoaded + " bytes loaded."); "sidx" !== q && p < n.byteLength;) {
            for (r = n.getUint32(p), p += 4, q = "", i = 0; 4 > i; i += 1)j = n.getInt8(p), q += String.fromCharCode(j), p += 1;
            "sidx" !== q && (p += r - 8)
        }
        if (d = n.byteLength - p, "sidx" !== q)m.reject(); else if (r - 8 > d)u.debug.log("Found SIDX but we don't have all of it."), c.range.start = 0, c.range.end = c.bytesLoaded + (r - d), o.onload = function () {
            o.status < 200 || o.status > 299 || (s = !1, c.bytesLoaded = c.range.end, e.call(u, o.response, c).then(function (a) {
                m.resolve(a)
            }))
        }, o.onloadend = o.onerror = function () {
            s && (s = !1, u.errHandler.downloadError("SIDX", c.url, o), m.reject(o))
        }, o.open("GET", u.tokenAuthentication.addTokenAsQueryArg(c.url)), o.responseType = "arraybuffer", o.setRequestHeader("Range", "bytes=" + c.range.start + "-" + c.range.end), o = u.tokenAuthentication.setTokenInRequestHeader(o), o.send(null); else if (c.range.start = p - 8, c.range.end = c.range.start + r, u.debug.log("Found the SIDX box.  Start: " + c.range.start + " | End: " + c.range.end), f = new ArrayBuffer(c.range.end - c.range.start), h = new Uint8Array(f), g = new Uint8Array(a, c.range.start, c.range.end - c.range.start), h.set(g), k = this.parseSIDX.call(this, f, c.range.start), l = k.references, null !== l && void 0 !== l && l.length > 0 && (t = 1 === l[0].type), t) {
            u.debug.log("Initiate multiple SIDX load.");
            var v, w, x, y, z, A, B = [];
            for (v = 0, w = l.length; w > v; v += 1)x = l[v].offset, y = l[v].offset + l[v].size - 1, z = x + "-" + y, B.push(this.loadSegments.call(u, c.url, z));
            Q.all(B).then(function (a) {
                for (A = [], v = 0, w = a.length; w > v; v += 1)A = A.concat(a[v]);
                m.resolve(A)
            }, function (a) {
                m.reject(a)
            })
        } else u.debug.log("Parsing segments from SIDX."), b.call(u, f, c.url, c.range.start).then(function (a) {
            m.resolve(a)
        });
        return m.promise
    }, f = function (a, c) {
        var d, f = Q.defer(), g = new XMLHttpRequest, h = !0, i = this, j = {
            url: a,
            range: {},
            searching: !1,
            bytesLoaded: 0,
            bytesToLoad: 1500,
            request: g
        };
        return null === c ? (i.debug.log("No known range for SIDX request."), j.searching = !0, j.range.start = 0, j.range.end = j.bytesToLoad) : (d = c.split("-"), j.range.start = parseFloat(d[0]), j.range.end = parseFloat(d[1])), g.onload = function () {
            g.status < 200 || g.status > 299 || (h = !1, j.searching ? (j.bytesLoaded = j.range.end, e.call(i, g.response, j).then(function (a) {
                f.resolve(a)
            })) : b.call(i, g.response, j.url, j.range.start).then(function (a) {
                f.resolve(a)
            }))
        }, g.onloadend = g.onerror = function () {
            h && (h = !1, i.errHandler.downloadError("SIDX", j.url, g), f.reject(g))
        }, g.open("GET", i.tokenAuthentication.addTokenAsQueryArg(j.url)), g.responseType = "arraybuffer", g.setRequestHeader("Range", "bytes=" + j.range.start + "-" + j.range.end), g = i.tokenAuthentication.setTokenInRequestHeader(g), g.send(null), i.debug.log("Perform SIDX load: " + j.url), f.promise
    };
    return {
        debug: void 0,
        errHandler: void 0,
        tokenAuthentication: void 0,
        loadSegments: f,
        loadInitialization: d,
        parseSegments: b,
        parseSIDX: a,
        findSIDX: e
    }
}, Dash.dependencies.BaseURLExtensions.prototype = {constructor: Dash.dependencies.BaseURLExtensions}, Dash.dependencies.DashHandler = function () {
    "use strict";
    var a, b, c, d = -1, e = null, f = function (a, b) {
        for (; a.length < b;)a = "0" + a;
        return a
    }, g = function (a, b, c) {
        for (var d, e, g, h, i = 0, j = 0, k = b.length, l = "%0", m = l.length; ;) {
            if (i = a.indexOf("$" + b), 0 > i)return a;
            if (j = a.indexOf("$", i + k), 0 > j)return a;
            if (d = a.indexOf(l, i + k), d > i && j > d)switch (e = a.charAt(j - 1), g = parseInt(a.substring(d + m, j - 1), 10), e) {
                case"d":
                case"i":
                case"u":
                    h = f(c.toString(), g);
                    break;
                case"x":
                    h = f(c.toString(16), g);
                    break;
                case"X":
                    h = f(c.toString(16), g).toUpperCase();
                    break;
                case"o":
                    h = f(c.toString(8), g);
                    break;
                default:
                    return this.debug.log("Unsupported/invalid IEEE 1003.1 format identifier string in URL"), a
            } else h = c;
            a = a.substring(0, i) + h + a.substring(j + 1)
        }
    }, h = function (a) {
        return a.split("$$").join("$")
    }, i = function (a, b) {
        if (null === b || -1 === a.indexOf("$RepresentationID$"))return a;
        var c = b.toString();
        return a.split("$RepresentationID$").join(c)
    }, j = function (a, b) {
        return a.representation.startNumber + b
    }, k = function (a, b) {
        var c, d = b.adaptation.period.mpd.manifest.Period_asArray[b.adaptation.period.index].AdaptationSet_asArray[b.adaptation.index].Representation_asArray[b.index].BaseURL;
        return c = a === d ? a : -1 !== a.indexOf("http://") ? a : d + a
    }, l = function (a, c) {
        var d, e, f = this, g = new MediaPlayer.vo.SegmentRequest;
        return d = a.adaptation.period, g.streamType = c, g.type = "Initialization Segment", g.url = k(a.initialization, a), g.range = a.range, e = d.start, g.availabilityStartTime = f.timelineConverter.calcAvailabilityStartTimeFromPresentationTime(e, a.adaptation.period.mpd, b), g.availabilityEndTime = f.timelineConverter.calcAvailabilityEndTimeFromPresentationTime(e + d.duration, d.mpd, b), g.quality = a.index, g
    }, m = function (a) {
        var b = Q.defer(), d = null, e = null, f = this;
        return a ? (a.initialization ? (d = l.call(f, a, c), b.resolve(d)) : (e = a.adaptation.period.mpd.manifest.Period_asArray[a.adaptation.period.index].AdaptationSet_asArray[a.adaptation.index].Representation_asArray[a.index].BaseURL, f.baseURLExt.loadInitialization(e).then(function (g) {
            a.range = g, a.initialization = e, d = l.call(f, a, c), b.resolve(d)
        }, function (a) {
            b.reject(a)
        })), b.promise) : Q.reject("no represenation")
    }, n = function (a) {
        var c, f, g, h = a.adaptation.period, i = !1;
        return (null === e || e > a.segments[0].availabilityIdx) && (e = a.segments[0].availabilityIdx), b ? i = !1 : 0 > d ? i = !1 : d < a.availableSegmentsNumber + e ? (f = A(d, a), f && (g = f.presentationStartTime - h.start, c = a.adaptation.period.duration, this.debug.log(a.segmentInfoType + ": " + g + " / " + c), i = g >= c)) : i = !0, Q.when(i)
    }, o = function (a, c) {
        var d, e, f, g, h = this;
        return e = a.segmentDuration, f = a.adaptation.period.start + c * e, g = f + e, d = new Dash.vo.Segment, d.representation = a, d.duration = e, d.presentationStartTime = f, d.mediaStartTime = h.timelineConverter.calcMediaTimeFromPresentationTime(d.presentationStartTime, a), d.availabilityStartTime = h.timelineConverter.calcAvailabilityStartTimeFromPresentationTime(d.presentationStartTime, a.adaptation.period.mpd, b), d.availabilityEndTime = h.timelineConverter.calcAvailabilityEndTimeFromPresentationTime(g, a.adaptation.period.mpd, b), d.wallStartTime = h.timelineConverter.calcWallTimeForSegment(d, b), d.replacementNumber = j(d, c), d.availabilityIdx = c, d
    }, p = function (b) {
        var c, d, e, f, g, h, i, j, k, l, m, n, o, p, q = this, r = b.adaptation.period.mpd.manifest.Period_asArray[b.adaptation.period.index].AdaptationSet_asArray[b.adaptation.index].Representation_asArray[b.index].SegmentTemplate, t = r.SegmentTimeline, v = b.availableSegmentsNumber > 0, w = 10, x = [], y = 0, z = -1, A = function (a) {
            return u.call(q, b, y, a.d, p, r.media, a.mediaRange, z)
        };
        for (p = b.timescale, c = t.S_asArray, k = s.call(q, b), k ? (n = k.start, o = k.end) : m = q.timelineConverter.calcMediaTimeFromPresentationTime(a || 0, b), e = 0, f = c.length; f > e; e += 1)if (d = c[e], h = 0, d.hasOwnProperty("r") && (h = d.r), d.hasOwnProperty("t") && (y = d.t), 0 > h && (j = c[e + 1], i = j && j.hasOwnProperty("t") ? j.t / p : b.adaptation.period.duration, h = Math.ceil((i - y / p) / (d.d / p)) - 1), l) {
            if (v)break;
            z += h + 1
        } else for (g = 0; h >= g; g += 1) {
            if (z += 1, k) {
                if (z > o) {
                    if (l = !0, v)break;
                    continue
                }
                z >= n && x.push(A.call(q, d))
            } else {
                if (x.length > w) {
                    if (l = !0, v)break;
                    continue
                }
                y / p >= m - d.d / p && x.push(A.call(q, d))
            }
            y += d.d
        }
        if (!v) {
            var B, C, D = c[0];
            B = void 0 === D.t ? 0 : q.timelineConverter.calcPresentationTimeFromMediaTime(D.t / p, b), C = q.timelineConverter.calcPresentationTimeFromMediaTime((y - d.d) / p, b), b.segmentAvailabilityRange = {
                start: B,
                end: C
            }, b.availableSegmentsNumber = z + 1
        }
        return Q.when(x)
    }, q = function (a) {
        var c, d, e, f, h = [], i = this, j = Q.defer(), k = a.adaptation.period.mpd.manifest.Period_asArray[a.adaptation.period.index].AdaptationSet_asArray[a.adaptation.index].Representation_asArray[a.index].SegmentTemplate, l = a.segmentDuration, m = null, n = Math.floor(a.adaptation.period.start / l), p = null, q = null;
        return f = a.startNumber, t.call(i, a).then(function (s) {
            for (a.segmentAvailabilityRange = s, m = r.call(i, a), d = m.start, e = m.end, c = d; e >= c; c += 1)p = o.call(i, a, c - (b ? n : 0)), p.replacementTime = (f + c - 1) * a.segmentDuration, q = k.media, q = g(q, "Number", p.replacementNumber), q = g(q, "Time", p.replacementTime), p.media = q, h.push(p), p = null;
            a.availableSegmentsNumber = n + Math.ceil((s.end - s.start) / l), j.resolve(h)
        }), j.promise
    }, r = function (c) {
        var e, f, g, h = this, i = c.adaptation.period.start, j = c.segmentDuration, k = c.adaptation.period.mpd.manifest.minBufferTime, l = c.segmentAvailabilityRange, m = 0 / 0, n = null, o = c.segments, p = 2 * j, q = Math.max(2 * k, 10 * j);
        return l || (l = h.timelineConverter.calcSegmentAvailabilityRange(c, b)), b && !c.adaptation.period.mpd.isClientServerTimeSyncCompleted ? (e = Math.floor(l.start / j), f = Math.floor(l.end / j), g = {
            start: e,
            end: f
        }) : (o ? (n = A(d, c), m = n ? n.presentationStartTime - i : d > 0 ? d * j : a - i || o[0].presentationStartTime - i) : m = d > 0 ? d * j : b ? l.end : l.start, e = Math.floor(Math.max(m - p, l.start) / j), f = Math.floor(Math.min(e + q / j, l.end / j)), g = {
            start: e,
            end: f
        })
    }, s = function (c) {
        var e, f, g, h = 0 / 0, i = c.segments, j = 2, k = 10, l = 0, m = Number.POSITIVE_INFINITY;
        if (b && !c.adaptation.period.mpd.isClientServerTimeSyncCompleted)return g = {start: l, end: m};
        if (!b && a)return null;
        if (i) {
            if (0 > d)return null;
            h = d
        } else h = d > 0 ? d : b ? m : l;
        return e = Math.max(h - j, l), f = Math.min(h + k, m), g = {start: e, end: f}
    }, t = function (a) {
        var c, d, e = this, f = Q.defer(), g = function () {
            c = e.timelineConverter.calcSegmentAvailabilityRange(a, b), c.end > 0 ? f.resolve(c) : (d = 1e3 * Math.abs(c.end), setTimeout(g, d))
        };
        return g(), f.promise
    }, u = function (a, c, d, e, f, h, i) {
        var k, l, m, n = this, o = c / e, p = Math.min(d / e, a.adaptation.period.mpd.maxSegmentDuration);
        return k = n.timelineConverter.calcPresentationTimeFromMediaTime(o, a), l = k + p, m = new Dash.vo.Segment, m.representation = a, m.duration = p, m.mediaStartTime = o, m.presentationStartTime = k, m.availabilityStartTime = a.adaptation.period.mpd.manifest.mpdLoadedTime, m.availabilityEndTime = n.timelineConverter.calcAvailabilityEndTimeFromPresentationTime(l, a.adaptation.period.mpd, b), m.wallStartTime = n.timelineConverter.calcWallTimeForSegment(m, b), m.replacementTime = c, m.replacementNumber = j(m, i), f = g(f, "Number", m.replacementNumber), f = g(f, "Time", m.replacementTime), m.media = f, m.mediaRange = h, m.availabilityIdx = i, m
    }, v = function (a) {
        var c, d, e, f, g, h = this, i = [], j = Q.defer(), k = a.adaptation.period.mpd.manifest.Period_asArray[a.adaptation.period.index].AdaptationSet_asArray[a.adaptation.index].Representation_asArray[a.index].SegmentList, l = k.SegmentURL_asArray.length, m = 0, n = k.SegmentURL_asArray.length;
        return g = a.startNumber, t.call(h, a).then(function (p) {
            for (b || (f = r.call(h, a), m = f.start, n = f.end), c = m; n > c; c += 1)e = k.SegmentURL_asArray[c], d = o.call(h, a, c), d.replacementTime = (g + c - 1) * a.segmentDuration, d.media = e.media, d.mediaRange = e.mediaRange, d.index = e.index, d.indexRange = e.indexRange, i.push(d), d = null;
            a.segmentAvailabilityRange = p, a.availableSegmentsNumber = l, j.resolve(i)
        }), j.promise
    }, w = function (a) {
        var b, c, d, e, f = this, g = a.adaptation.period.mpd.manifest.Period_asArray[a.adaptation.period.index].AdaptationSet_asArray[a.adaptation.index].Representation_asArray[a.index].BaseURL, h = Q.defer(), i = [], j = 0, k = null;
        return a.indexRange && (k = a.indexRange), this.baseURLExt.loadSegments(g, k).then(function (g) {
            for (c = 0, d = g.length; d > c; c += 1)b = g[c], e = u.call(f, a, b.startTime, b.duration, b.timescale, b.media, b.mediaRange, j), i.push(e), e = null, j += 1;
            a.segmentAvailabilityRange = {
                start: i[0].presentationStartTime,
                end: i[d - 1].presentationStartTime
            }, a.availableSegmentsNumber = d, h.resolve(i)
        }), h.promise
    }, x = function (a) {
        var c, d, e = Q.defer(), f = this;
        return B.call(f, a) ? (c = "SegmentTimeline" === a.segmentInfoType ? p.call(f, a) : "SegmentTemplate" === a.segmentInfoType ? q.call(f, a) : "SegmentList" === a.segmentInfoType ? v.call(f, a) : w.call(f, a), Q.when(c).then(function (c) {
            if (a.segments = c, d = c.length - 1, b && isNaN(a.adaptation.period.liveEdge)) {
                var g = f.metricsModel.getMetricsFor("stream"), h = c[d].presentationStartTime;
                a.adaptation.period.liveEdge = h, f.metricsModel.updateManifestUpdateInfo(f.metricsExt.getCurrentManifestUpdate(g), {presentationStartTime: h})
            }
            e.resolve(c)
        }), e.promise) : Q.when(a.segments)
    }, y = function (a) {
        var b = this, c = Q.defer();
        return a.segments = null, x.call(b, a).then(function (b) {
            a.segments = b, c.resolve()
        }), c.promise
    }, z = function (a, b) {
        var c, d, e, f, g = b.segments, h = g.length - 1, i = -1, j = this;
        if (g && g.length > 0)for (f = h; f >= 0; f--) {
            if (c = g[f], d = c.presentationStartTime, e = c.duration, a + Dash.dependencies.DashHandler.EPSILON >= d && a - Dash.dependencies.DashHandler.EPSILON <= d + e) {
                i = c.availabilityIdx;
                break
            }
            -1 === i && a - Dash.dependencies.DashHandler.EPSILON > d + e && (i = isNaN(b.segmentDuration) ? c.availabilityIdx + 1 : Math.floor((a - b.adaptation.period.start) / b.segmentDuration))
        }
        return -1 === i && (isNaN(b.segmentDuration) ? (j.debug.log("Couldn't figure out a time!"), j.debug.log("Time: " + a), j.debug.log(g)) : i = Math.floor((a - b.adaptation.period.start) / b.segmentDuration)), Q.when(i)
    }, A = function (a, b) {
        if (!b || !b.segments)return null;
        var c, d, e = b.segments.length;
        for (d = 0; e > d; d += 1)if (c = b.segments[d], c.availabilityIdx === a)return c;
        return null
    }, B = function (a) {
        var b, c, e = !1, f = a.segments;
        return f ? (c = f[0].availabilityIdx, b = f[f.length - 1].availabilityIdx, e = c > d || d > b) : e = !0, e
    }, C = function (a) {
        if (null === a || void 0 === a)return Q.when(null);
        var b, d = new MediaPlayer.vo.SegmentRequest, e = a.representation, f = e.adaptation.period.mpd.manifest.Period_asArray[e.adaptation.period.index].AdaptationSet_asArray[e.adaptation.index].Representation_asArray[e.index].bandwidth;
        return b = k(a.media, e), b = g(b, "Number", a.replacementNumber), b = g(b, "Time", a.replacementTime), b = g(b, "Bandwidth", f), b = i(b, e.id), b = h(b), d.streamType = c, d.type = "Media Segment", d.url = b, d.range = a.mediaRange, d.startTime = a.presentationStartTime, d.duration = a.duration, d.timescale = e.timescale, d.availabilityStartTime = a.availabilityStartTime, d.availabilityEndTime = a.availabilityEndTime, d.wallStartTime = a.wallStartTime, d.quality = e.index, d.index = a.availabilityIdx, Q.when(d)
    }, D = function (b, c) {
        var e, f, g, h = this;
        return b ? (a = c, h.debug.log("Getting the request for time: " + c), e = Q.defer(), x.call(h, b).then(function () {
            var a;
            return a = z.call(h, c, b)
        }).then(function (a) {
            return h.debug.log("Index for time " + c + " is " + a), d = a, n.call(h, b)
        }).then(function (a) {
            var c = null;
            return a ? (f = new MediaPlayer.vo.SegmentRequest, f.action = f.ACTION_COMPLETE, f.index = d, h.debug.log("Signal complete."), h.debug.log(f), e.resolve(f)) : (g = A(d, b), c = C.call(h, g)), c
        }).then(function (a) {
            e.resolve(a)
        }), e.promise) : Q.reject("no represenation")
    }, E = function (b) {
        var c, e, f, g = this;
        if (!b)return Q.reject("no represenation");
        if (-1 === d)throw"You must call getSegmentRequestForTime first.";
        return a = null, d += 1, c = Q.defer(), n.call(g, b).then(function (a) {
            a ? (e = new MediaPlayer.vo.SegmentRequest, e.action = e.ACTION_COMPLETE, e.index = d, g.debug.log("Signal complete."), c.resolve(e)) : x.call(g, b).then(function () {
                var a;
                return f = A(d, b), a = C.call(g, f)
            }).then(function (a) {
                c.resolve(a)
            })
        }), c.promise
    }, F = function (a, b, c) {
        var d, e = this, f = Math.max(b - c, 0), g = Q.defer(), h = 0;
        return a ? (x.call(e, a).then(function (a) {
            d = a[0].duration, h = Math.ceil(f / d), g.resolve(h)
        }, function () {
            g.resolve(0)
        }), g.promise) : Q.reject("no represenation")
    }, G = function (a) {
        var b, c, e = this, f = Q.defer();
        return a ? (c = d, x.call(e, a).then(function (d) {
            0 > c ? b = e.timelineConverter.calcPresentationStartTime(a.adaptation.period) : (c = c < d[0].availabilityIdx ? d[0].availabilityIdx : Math.min(d[d.length - 1].availabilityIdx, c), b = A(c, a).presentationStartTime), f.resolve(b)
        }, function () {
            f.reject()
        }), f.promise) : Q.reject("no represenation")
    };
    return {
        debug: void 0,
        baseURLExt: void 0,
        metricsModel: void 0,
        metricsExt: void 0,
        manifestModel: void 0,
        manifestExt: void 0,
        errHandler: void 0,
        timelineConverter: void 0,
        getType: function () {
            return c
        },
        setType: function (a) {
            c = a
        },
        getIsDynamic: function () {
            return b
        },
        setIsDynamic: function (a) {
            b = a
        },
        getInitRequest: m,
        getSegmentRequestForTime: D,
        getNextSegmentRequest: E,
        getCurrentTime: G,
        getSegmentCountForDuration: F,
        updateSegmentList: y
    }
}, Dash.dependencies.DashHandler.EPSILON = .003, Dash.dependencies.DashHandler.prototype = {constructor: Dash.dependencies.DashHandler}, Dash.dependencies.DashManifestExtensions = function () {
    "use strict";
    this.timelineConverter = void 0
}, Dash.dependencies.DashManifestExtensions.prototype = {
    constructor: Dash.dependencies.DashManifestExtensions, getIsAudio: function (a) {
        "use strict";
        var b, c, d, e = a.ContentComponent_asArray, f = !1, g = !1;
        if (e)for (b = 0, c = e.length; c > b; b += 1)"audio" === e[b].contentType && (f = !0, g = !0);
        if (a.hasOwnProperty("mimeType") && (f = -1 !== a.mimeType.indexOf("audio"), g = !0), !g)for (b = 0, c = a.Representation_asArray.length; !g && c > b;)d = a.Representation_asArray[b], d.hasOwnProperty("mimeType") && (f = -1 !== d.mimeType.indexOf("audio"), g = !0), b += 1;
        return f && (a.type = "audio"), Q.when(f)
    }, getIsVideo: function (a) {
        "use strict";
        var b, c, d, e = a.ContentComponent_asArray, f = !1, g = !1;
        if (e)for (b = 0, c = e.length; c > b; b += 1)"video" === e[b].contentType && (f = !0, g = !0);
        if (a.hasOwnProperty("mimeType") && (f = -1 !== a.mimeType.indexOf("video"), g = !0), !g)for (b = 0, c = a.Representation_asArray.length; !g && c > b;)d = a.Representation_asArray[b], d.hasOwnProperty("mimeType") && (f = -1 !== d.mimeType.indexOf("video"), g = !0), b += 1;
        return f && (a.type = "video"), Q.when(f)
    }, getIsText: function (a) {
        "use strict";
        var b, c, d, e = a.ContentComponent_asArray, f = !1, g = !1;
        if (e)for (b = 0, c = e.length; c > b; b += 1)"text" === e[b].contentType && (f = !0, g = !0);
        if (a.hasOwnProperty("mimeType") && (f = -1 !== a.mimeType.indexOf("vtt") || -1 !== a.mimeType.indexOf("ttml"), g = !0), !g)for (b = 0, c = a.Representation_asArray.length; !g && c > b;)d = a.Representation_asArray[b], d.hasOwnProperty("mimeType") && (f = -1 !== d.mimeType.indexOf("vtt") || -1 !== d.mimeType.indexOf("ttml"), g = !0), b += 1;
        return Q.when(f)
    }, getIsTextTrack: function (a) {
        return "text/vtt" === a || "application/ttml+xml" === a
    }, getIsMain: function () {
        "use strict";
        return Q.when(!1)
    }, processAdaptation: function (a) {
        "use strict";
        return void 0 !== a.Representation_asArray && null !== a.Representation_asArray && a.Representation_asArray.sort(function (a, b) {
            return a.bandwidth - b.bandwidth
        }), a
    }, getDataForId: function (a, b, c) {
        "use strict";
        var d, e, f = b.Period_asArray[c].AdaptationSet_asArray;
        for (d = 0, e = f.length; e > d; d += 1)if (f[d].hasOwnProperty("id") && f[d].id === a)return Q.when(f[d]);
        return Q.when(null)
    }, getDataForIndex: function (a, b, c) {
        "use strict";
        var d = b.Period_asArray[c].AdaptationSet_asArray;
        return Q.when(d[a])
    }, getDataIndex: function (a, b, c) {
        "use strict";
        var d, e, f = b.Period_asArray[c].AdaptationSet_asArray;
        for (d = 0, e = f.length; e > d; d += 1)if (f[d] === a)return Q.when(d);
        return Q.when(-1)
    }, getVideoData: function (a, b) {
        "use strict";
        var c, d, e = a.Period_asArray[b].AdaptationSet_asArray, f = Q.defer(), g = [];
        for (c = 0, d = e.length; d > c; c += 1)g.push(this.getIsVideo(e[c]));
        return Q.all(g).then(function (a) {
            var b = !1;
            for (c = 0, d = a.length; d > c; c += 1)a[c] === !0 && (b = !0, f.resolve(e[c]));
            b || f.resolve(null)
        }), f.promise
    }, getTextData: function (a, b) {
        "use strict";
        var c, d, e = a.Period_asArray[b].AdaptationSet_asArray, f = Q.defer(), g = [];
        for (c = 0, d = e.length; d > c; c += 1)g.push(this.getIsText(e[c]));
        return Q.all(g).then(function (a) {
            var b = !1;
            for (c = 0, d = a.length; d > c && !b; c += 1)a[c] === !0 && (b = !0, f.resolve(e[c]));
            b || f.resolve(null)
        }), f.promise
    }, getAudioDatas: function (a, b) {
        "use strict";
        var c, d, e = a.Period_asArray[b].AdaptationSet_asArray, f = Q.defer(), g = [];
        for (c = 0, d = e.length; d > c; c += 1)g.push(this.getIsAudio(e[c]));
        return Q.all(g).then(function (a) {
            var b = [];
            for (c = 0, d = a.length; d > c; c += 1)a[c] === !0 && b.push(e[c]);
            f.resolve(b)
        }), f.promise
    }, getPrimaryAudioData: function (a, b) {
        "use strict";
        var c, d, e = Q.defer(), f = [], g = this;
        return this.getAudioDatas(a, b).then(function (a) {
            for (a && 0 !== a.length || e.resolve(null), c = 0, d = a.length; d > c; c += 1)f.push(g.getIsMain(a[c]));
            Q.all(f).then(function (b) {
                var f = !1;
                for (c = 0, d = b.length; d > c; c += 1)b[c] === !0 && (f = !0, e.resolve(g.processAdaptation(a[c])));
                f || e.resolve(a[0])
            })
        }), e.promise
    }, getCodec: function (a) {
        "use strict";
        var b = a.Representation_asArray[0], c = b.mimeType + ';codecs="' + b.codecs + '"';
        return Q.when(c)
    }, getMimeType: function (a) {
        "use strict";
        return Q.when(a.Representation_asArray[0].mimeType)
    }, getKID: function (a) {
        "use strict";
        return a && a.hasOwnProperty("cenc:default_KID") ? a["cenc:default_KID"] : null
    }, getContentProtectionData: function (a) {
        "use strict";
        return Q.when(a && a.hasOwnProperty("ContentProtection_asArray") && 0 !== a.ContentProtection_asArray.length ? a.ContentProtection_asArray : null)
    }, getIsDynamic: function (a) {
        "use strict";
        var b = !1, c = "dynamic";
        return a.hasOwnProperty("type") && (b = a.type === c), b
    }, getIsDVR: function (a) {
        "use strict";
        var b, c, d = this.getIsDynamic(a);
        return b = !isNaN(a.timeShiftBufferDepth), c = d && b, Q.when(c)
    }, getIsOnDemand: function (a) {
        "use strict";
        var b = !1;
        return a.profiles && a.profiles.length > 0 && (b = -1 !== a.profiles.indexOf("urn:mpeg:dash:profile:isoff-on-demand:2011")), Q.when(b)
    }, getDuration: function (a) {
        var b;
        return b = a.hasOwnProperty("mediaPresentationDuration") ? a.mediaPresentationDuration : Number.POSITIVE_INFINITY, Q.when(b)
    }, getBandwidth: function (a) {
        "use strict";
        return Q.when(a.bandwidth)
    }, getRefreshDelay: function (a) {
        "use strict";
        var b = 0 / 0, c = 2;
        return a.hasOwnProperty("minimumUpdatePeriod") && (b = Math.max(parseFloat(a.minimumUpdatePeriod), c)), Q.when(b)
    }, getRepresentationCount: function (a) {
        "use strict";
        return Q.when(a.Representation_asArray.length)
    }, getRepresentationFor: function (a, b) {
        "use strict";
        return Q.when(b.Representation_asArray[a])
    }, getRepresentationsForAdaptation: function (a, b) {
        for (var c, d, e, f, g = this, h = g.processAdaptation(a.Period_asArray[b.period.index].AdaptationSet_asArray[b.index]), i = [], j = Q.defer(), k = 0; k < h.Representation_asArray.length; k += 1)f = h.Representation_asArray[k], c = new Dash.vo.Representation, c.index = k, c.adaptation = b, f.hasOwnProperty("id") && (c.id = f.id), f.hasOwnProperty("SegmentBase") ? (e = f.SegmentBase, c.segmentInfoType = "SegmentBase") : f.hasOwnProperty("SegmentList") ? (e = f.SegmentList, c.segmentInfoType = "SegmentList", c.useCalculatedLiveEdgeTime = !0) : f.hasOwnProperty("SegmentTemplate") ? (e = f.SegmentTemplate, c.segmentInfoType = e.hasOwnProperty("SegmentTimeline") ? "SegmentTimeline" : "SegmentTemplate", e.hasOwnProperty("initialization") && (c.initialization = e.initialization.split("$Bandwidth$").join(f.bandwidth).split("$RepresentationID$").join(f.id))) : (e = f.BaseURL, c.segmentInfoType = "BaseURL"), e.hasOwnProperty("Initialization") ? (d = e.Initialization, d.hasOwnProperty("sourceURL") ? c.initialization = d.sourceURL : d.hasOwnProperty("range") && (c.initialization = f.BaseURL, c.range = d.range)) : f.hasOwnProperty("mimeType") && g.getIsTextTrack(f.mimeType) && (c.initialization = f.BaseURL, c.range = 0), e.hasOwnProperty("timescale") && (c.timescale = e.timescale), e.hasOwnProperty("duration") && (c.segmentDuration = e.duration / c.timescale), e.hasOwnProperty("startNumber") && (c.startNumber = e.startNumber), e.hasOwnProperty("indexRange") && (c.indexRange = e.indexRange), e.hasOwnProperty("presentationTimeOffset") && (c.presentationTimeOffset = e.presentationTimeOffset / c.timescale), c.MSETimeOffset = g.timelineConverter.calcMSETimeOffset(c), i.push(c);
        return j.resolve(i), j.promise
    }, getAdaptationsForPeriod: function (a, b) {
        for (var c, d = a.Period_asArray[b.index], e = [], f = 0; f < d.AdaptationSet_asArray.length; f += 1)c = new Dash.vo.AdaptationSet, c.index = f, c.period = b, e.push(c);
        return Q.when(e)
    }, getRegularPeriods: function (a, b) {
        var c, d, e = this, f = Q.defer(), g = [], h = e.getIsDynamic(a), i = null, j = null, k = null, l = null;
        for (c = 0, d = a.Period_asArray.length; d > c; c += 1)j = a.Period_asArray[c], j.hasOwnProperty("start") ? (l = new Dash.vo.Period, l.start = j.start) : null !== i && j.hasOwnProperty("duration") ? (l = new Dash.vo.Period, l.start = k.start + k.duration, l.duration = j.duration) : 0 !== c || h || (l = new Dash.vo.Period, l.start = 0), null !== k && isNaN(k.duration) && (k.duration = l.start - k.start), null !== l && j.hasOwnProperty("id") && (l.id = j.id), null !== l && j.hasOwnProperty("duration") && (l.duration = j.duration), null !== l && (l.index = c, l.mpd = b, g.push(l)), i = j, j = null, k = l, l = null;
        return 0 === g.length ? Q.when(g) : (e.getCheckTime(a, g[0]).then(function (a) {
            b.checkTime = a, null !== k && isNaN(k.duration) ? e.getEndTimeForLastPeriod(b).then(function (a) {
                k.duration = a - k.start, f.resolve(g)
            }) : f.resolve(g)
        }), Q.when(f.promise))
    }, getMpd: function (a) {
        var b = new Dash.vo.Mpd;
        return b.manifest = a, b.availabilityStartTime = new Date(a.hasOwnProperty("availabilityStartTime") ? a.availabilityStartTime.getTime() : a.mpdLoadedTime.getTime()), a.hasOwnProperty("availabilityEndTime") && (b.availabilityEndTime = new Date(a.availabilityEndTime.getTime())), a.hasOwnProperty("suggestedPresentationDelay") && (b.suggestedPresentationDelay = a.suggestedPresentationDelay), a.hasOwnProperty("timeShiftBufferDepth") && (b.timeShiftBufferDepth = a.timeShiftBufferDepth), a.hasOwnProperty("maxSegmentDuration") && (b.maxSegmentDuration = a.maxSegmentDuration), Q.when(b)
    }, getFetchTime: function (a, b) {
        var c = this.timelineConverter.calcPresentationTimeFromWallTime(a.mpdLoadedTime, b);
        return Q.when(c)
    }, getCheckTime: function (a, b) {
        var c = this, d = Q.defer(), e = 0 / 0;
        return a.hasOwnProperty("minimumUpdatePeriod") ? c.getFetchTime(a, b).then(function (b) {
            e = b + a.minimumUpdatePeriod, d.resolve(e)
        }) : d.resolve(e), d.promise
    }, getEndTimeForLastPeriod: function (a) {
        var b;
        if (a.manifest.mediaPresentationDuration)b = a.manifest.mediaPresentationDuration; else {
            if (isNaN(a.checkTime))return Q.fail(new Error("Must have @mediaPresentationDuration or @minimumUpdatePeriod on MPD or an explicit @duration on the last period."));
            b = a.checkTime
        }
        return Q.when(b)
    }, getEventsForPeriod: function (a, b) {
        var c = a.Period_asArray, d = c[b.index].EventStream_asArray, e = [];
        if (d)for (var f = 0; f < d.length; f += 1) {
            var g = new Dash.vo.EventStream;
            if (g.period = b, g.timescale = 1, !d[f].hasOwnProperty("schemeIdUri"))throw"Invalid EventStream. SchemeIdUri has to be set";
            g.schemeIdUri = d[f].schemeIdUri, d[f].hasOwnProperty("timescale") && (g.timescale = d[f].timescale), d[f].hasOwnProperty("value") && (g.value = d[f].value);
            for (var h = 0; h < d[f].Event_asArray.length; h += 1) {
                var i = new Dash.vo.Event;
                i.presentationTime = 0, i.eventStream = g, d[f].Event_asArray[h].hasOwnProperty("presentationTime") && (i.presentationTime = d[f].Event_asArray[h].presentationTime), d[f].Event_asArray[h].hasOwnProperty("duration") && (i.duration = d[f].Event_asArray[h].duration), d[f].Event_asArray[h].hasOwnProperty("id") && (i.id = d[f].Event_asArray[h].id), e.push(i)
            }
        }
        return Q.when(e)
    }, getEventStreamForAdaptationSet: function (a) {
        var b = [], c = a.InbandEventStream_asArray;
        if (c)for (var d = 0; d < c.length; d += 1) {
            var e = new Dash.vo.EventStream;
            if (e.timescale = 1, !c[d].hasOwnProperty("schemeIdUri"))throw"Invalid EventStream. SchemeIdUri has to be set";
            e.schemeIdUri = c[d].schemeIdUri, c[d].hasOwnProperty("timescale") && (e.timescale = c[d].timescale), c[d].hasOwnProperty("value") && (e.value = c[d].value), b.push(e)
        }
        return b
    }, getEventStreamForRepresentation: function (a, b) {
        var c = [], d = a.Representation_asArray[b.index].InbandEventStream_asArray;
        if (d)for (var e = 0; e < d.length; e++) {
            var f = new Dash.vo.EventStream;
            if (f.timescale = 1, f.representation = b, !d[e].hasOwnProperty("schemeIdUri"))throw"Invalid EventStream. SchemeIdUri has to be set";
            f.schemeIdUri = d[e].schemeIdUri, d[e].hasOwnProperty("timescale") && (f.timescale = d[e].timescale), d[e].hasOwnProperty("value") && (f.value = d[e].value), c.push(f)
        }
        return c
    }
}, Dash.dependencies.DashMetricsExtensions = function () {
    "use strict";
    var a = function (a, b) {
        var c, d, e, f, g, h, i, j;
        for (h = 0; h < a.length; h += 1)for (c = a[h], e = c.AdaptationSet_asArray, i = 0; i < e.length; i += 1)for (d = e[i], g = d.Representation_asArray, j = 0; j < g.length; j += 1)if (f = g[j], b === f.id)return j;
        return -1
    }, b = function (a, b) {
        var c, d, e, f, g, h, i, j;
        for (h = 0; h < a.length; h += 1)for (c = a[h], e = c.AdaptationSet_asArray, i = 0; i < e.length; i += 1)for (d = e[i], g = d.Representation_asArray, j = 0; j < g.length; j += 1)if (f = g[j], b === f.id)return f;
        return null
    }, c = function (a, b) {
        var c = !1;
        return "video" === b ? (this.manifestExt.getIsVideo(a), "video" === a.type && (c = !0)) : "audio" === b ? (this.manifestExt.getIsAudio(a), "audio" === a.type && (c = !0)) : c = !1, c
    }, d = function (a, b) {
        var d, e, f, g, h, i;
        for (h = 0; h < a.length; h += 1)for (d = a[h], f = d.AdaptationSet_asArray, i = 0; i < f.length; i += 1)if (e = f[i], g = e.Representation_asArray, c.call(this, e, b))return g.length;
        return -1
    }, e = function (a) {
        var c, d = this, e = d.manifestModel.getValue(), f = e.Period_asArray;
        return c = b.call(d, f, a), null === c ? null : c.bandwidth
    }, f = function (b) {
        var c, d = this, e = d.manifestModel.getValue(), f = e.Period_asArray;
        return c = a.call(d, f, b)
    }, g = function (a) {
        var b, c = this, e = c.manifestModel.getValue(), f = e.Period_asArray;
        return b = d.call(this, f, a)
    }, h = function (a) {
        if (null === a)return null;
        var b, c, d, e = a.RepSwitchList;
        return null === e || e.length <= 0 ? null : (b = e.length, c = b - 1, d = e[c])
    }, i = function (a) {
        if (null === a)return null;
        var b, c, d, e = a.BufferLevel;
        return null === e || e.length <= 0 ? null : (b = e.length, c = b - 1, d = e[c])
    }, j = function (a) {
        if (null === a)return null;
        var b, c, d = a.HttpList, e = null;
        if (null === d || d.length <= 0)return null;
        for (b = d.length, c = b - 1; c > 0;) {
            if (d[c].responsecode) {
                e = d[c];
                break
            }
            c -= 1
        }
        return e
    }, k = function (a) {
        return null === a ? [] : a.HttpList ? a.HttpList : []
    }, l = function (a) {
        if (null === a)return null;
        var b, c, d, e = a.DroppedFrames;
        return null === e || e.length <= 0 ? null : (b = e.length, c = b - 1, d = e[c])
    }, m = function (a) {
        if (null === a)return null;
        var b, c = a.DVRInfo, d = null;
        return null === c || c.length <= 0 ? null : (b = c.length - 1, d = c[b])
    }, n = function (a) {
        if (null === a)return null;
        var b, c, d, e = a.ManifestUpdate;
        return null === e || e.length <= 0 ? null : (b = e.length, c = b - 1, d = e[c])
    };
    return {
        manifestModel: void 0,
        manifestExt: void 0,
        getBandwidthForRepresentation: e,
        getIndexForRepresentation: f,
        getMaxIndexForBufferType: g,
        getCurrentRepresentationSwitch: h,
        getCurrentBufferLevel: i,
        getCurrentHttpRequest: j,
        getHttpRequests: k,
        getCurrentDroppedFrames: l,
        getCurrentDVRInfo: m,
        getCurrentManifestUpdate: n
    }
}, Dash.dependencies.DashMetricsExtensions.prototype = {constructor: Dash.dependencies.DashMetricsExtensions}, Dash.dependencies.DashParser = function () {
    "use strict";
    var a = 31536e3, b = 2592e3, c = 86400, d = 3600, e = 60, f = 60, g = 1e3, h = /^P(([\d.]*)Y)?(([\d.]*)M)?(([\d.]*)D)?T?(([\d.]*)H)?(([\d.]*)M)?(([\d.]*)S)?/, i = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})(?::([0-9]*)(\.[0-9]*)?)?(?:([+-])([0-9]{2})([0-9]{2}))?/, j = /^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$/, k = [{
        type: "duration",
        test: function (a) {
            return h.test(a)
        },
        converter: function (f) {
            var g = h.exec(f);
            return parseFloat(g[2] || 0) * a + parseFloat(g[4] || 0) * b + parseFloat(g[6] || 0) * c + parseFloat(g[8] || 0) * d + parseFloat(g[10] || 0) * e + parseFloat(g[12] || 0)
        }
    }, {
        type: "datetime", test: function (a) {
            return i.test(a)
        }, converter: function (a) {
            var b, c = i.exec(a);
            if (b = Date.UTC(parseInt(c[1], 10), parseInt(c[2], 10) - 1, parseInt(c[3], 10), parseInt(c[4], 10), parseInt(c[5], 10), c[6] && parseInt(c[6], 10) || 0, c[7] && parseFloat(c[7]) * g || 0), c[9] && c[10]) {
                var d = parseInt(c[9], 10) * f + parseInt(c[10], 10);
                b += ("+" === c[8] ? -1 : 1) * d * e * g
            }
            return new Date(b)
        }
    }, {
        type: "numeric", test: function (a) {
            return j.test(a)
        }, converter: function (a) {
            return parseFloat(a)
        }
    }], l = function () {
        var a, b, c, d;
        return d = [{name: "profiles", merge: !1}, {name: "width", merge: !1}, {
            name: "height",
            merge: !1
        }, {name: "sar", merge: !1}, {name: "frameRate", merge: !1}, {
            name: "audioSamplingRate",
            merge: !1
        }, {name: "mimeType", merge: !1}, {name: "segmentProfiles", merge: !1}, {
            name: "codecs",
            merge: !1
        }, {name: "maximumSAPPeriod", merge: !1}, {name: "startsWithSap", merge: !1}, {
            name: "maxPlayoutRate",
            merge: !1
        }, {name: "codingDependency", merge: !1}, {name: "scanType", merge: !1}, {
            name: "FramePacking",
            merge: !0
        }, {name: "AudioChannelConfiguration", merge: !0}, {
            name: "ContentProtection",
            merge: !0
        }], a = {}, a.name = "AdaptationSet", a.isRoot = !1, a.isArray = !0, a.parent = null, a.children = [], a.properties = d, b = {}, b.name = "Representation", b.isRoot = !1, b.isArray = !0, b.parent = a, b.children = [], b.properties = d, a.children.push(b), c = {}, c.name = "SubRepresentation", c.isRoot = !1, c.isArray = !0, c.parent = b, c.children = [], c.properties = d, b.children.push(c), a
    }, m = function () {
        var a, b, c, d;
        return d = [{name: "SegmentBase", merge: !0}, {name: "SegmentTemplate", merge: !0}, {
            name: "SegmentList",
            merge: !0
        }], a = {}, a.name = "Period", a.isRoot = !1, a.isArray = !0, a.parent = null, a.children = [], a.properties = d, b = {}, b.name = "AdaptationSet", b.isRoot = !1, b.isArray = !0, b.parent = a, b.children = [], b.properties = d, a.children.push(b), c = {}, c.name = "Representation", c.isRoot = !1, c.isArray = !0, c.parent = b, c.children = [], c.properties = d, b.children.push(c), a
    }, n = function () {
        var a, b, c, d, e;
        return e = [{
            name: "BaseURL", merge: !0, mergeFunction: function (a, b) {
                var c;
                return c = 0 === b.indexOf("http://") ? b : a + b
            }
        }], a = {}, a.name = "mpd", a.isRoot = !0, a.isArray = !0, a.parent = null, a.children = [], a.properties = e, b = {}, b.name = "Period", b.isRoot = !1, b.isArray = !0, b.parent = null, b.children = [], b.properties = e, a.children.push(b), c = {}, c.name = "AdaptationSet", c.isRoot = !1, c.isArray = !0, c.parent = b, c.children = [], c.properties = e, b.children.push(c), d = {}, d.name = "Representation", d.isRoot = !1, d.isArray = !0, d.parent = c, d.children = [], d.properties = e, c.children.push(d), a
    }, o = function () {
        var a = [];
        return a.push(l()), a.push(m()), a.push(n()), a
    }, p = function (a, b) {
        var c, d = new X2JS(k, "", !0), e = new ObjectIron(o()), f = new Date, g = null, h = null;
        try {
            c = d.xml_str2json(a), g = new Date, c.hasOwnProperty("BaseURL") ? (c.BaseURL = c.BaseURL_asArray[0], 0 !== c.BaseURL.toString().indexOf("http") && (c.BaseURL = b + c.BaseURL)) : c.BaseURL = b, e.run(c), h = new Date, this.debug.log("Parsing complete: ( xml2json: " + (g.getTime() - f.getTime()) + "ms, objectiron: " + (h.getTime() - g.getTime()) + "ms, total: " + (h.getTime() - f.getTime()) / 1e3 + "s)")
        } catch (i) {
            return this.errHandler.manifestError("parsing the manifest failed", "parse", a), Q.reject(i)
        }
        return Q.when(c)
    };
    return {debug: void 0, errHandler: void 0, parse: p}
}, Dash.dependencies.DashParser.prototype = {constructor: Dash.dependencies.DashParser}, Dash.dependencies.FragmentExtensions = function () {
    "use strict";
    var a = function (a) {
        for (var b, c, d, e, f, g, h = Q.defer(), i = new DataView(a), j = 0; "tfdt" !== e && j < i.byteLength;) {
            for (d = i.getUint32(j), j += 4, e = "", f = 0; 4 > f; f += 1)g = i.getInt8(j), e += String.fromCharCode(g), j += 1;
            "moof" !== e && "traf" !== e && "tfdt" !== e && (j += d - 8)
        }
        if (j === i.byteLength)throw"Error finding live offset.";
        return c = i.getUint8(j), this.debug.log("position: " + j), 0 === c ? (j += 4, b = i.getUint32(j, !1)) : (j += d - 16, b = utils.Math.to64BitNumber(i.getUint32(j + 4, !1), i.getUint32(j, !1))), h.resolve({
            version: c,
            base_media_decode_time: b
        }), h.promise
    }, b = function (a) {
        for (var b, c, d, e, f, g, h, i = new DataView(a), j = 0; "sidx" !== f && j < i.byteLength;) {
            for (g = i.getUint32(j), j += 4, f = "", e = 0; 4 > e; e += 1)h = i.getInt8(j), f += String.fromCharCode(h), j += 1;
            "moof" !== f && "traf" !== f && "sidx" !== f ? j += g - 8 : "sidx" === f && (j -= 8)
        }
        return b = i.getUint8(j + 8), j += 12, c = i.getUint32(j + 4, !1), j += 8, d = 0 === b ? i.getUint32(j, !1) : utils.Math.to64BitNumber(i.getUint32(j + 4, !1), i.getUint32(j, !1)), Q.when({
            earliestPresentationTime: d,
            timescale: c
        })
    }, c = function (b) {
        var c, d, e, f = Q.defer(), g = new XMLHttpRequest, h = !1;
        return c = b, g.onloadend = function () {
            h || (d = "Error loading fragment: " + c, f.reject(d))
        }, g.onload = function () {
            h = !0, e = a(g.response), f.resolve(e)
        }, g.onerror = function () {
            d = "Error loading fragment: " + c, f.reject(d)
        }, g.responseType = "arraybuffer", g.open("GET", c), g.send(null), f.promise
    };
    return {debug: void 0, loadFragment: c, parseTFDT: a, parseSIDX: b}
}, Dash.dependencies.FragmentExtensions.prototype = {constructor: Dash.dependencies.FragmentExtensions}, Dash.dependencies.RepresentationController = function () {
    "use strict";
    var a, b = null, c = -1, d = !0, e = [], f = function (c, f, h) {
        var j = this;
        if (d = !0, j.notify(j.eventList.ENAME_DATA_UPDATE_STARTED), e = i.call(j, c, f), a = g.call(j, j.abrController.getQualityFor(h)), b = c, "video" !== h && "audio" !== h)return void j.notify(j.eventList.ENAME_DATA_UPDATE_COMPLETED, b, a);
        for (var k = 0; k < e.length; k += 1)j.indexHandler.updateRepresentation(e[k], !0)
    }, g = function (a) {
        return e[a]
    }, h = function () {
        for (var a = 0, b = e.length; b > a; a += 1)if (null === e[a].segmentAvailabilityRange || null === e[a].initialization)return !1;
        return !0
    }, i = function (a, b) {
        var d, e, f = this, g = f.manifestModel.getValue();
        return c = f.manifestExt.getDataIndex(a, g, b.index), e = f.manifestExt.getAdaptationsForPeriod(g, b), d = f.manifestExt.getRepresentationsForAdaptation(g, e[c])
    }, j = function (a) {
        for (var b, c = this, d = 0, f = e.length; f > d; d += 1)b = e[d], b.segmentAvailabilityRange = c.timelineConverter.calcSegmentAvailabilityRange(b, a)
    }, k = function () {
        h() && (d = !1, this.notify(this.eventList.ENAME_DATA_UPDATE_COMPLETED, b, a))
    }, l = function (a, b) {
        j.call(this, b)
    }, m = function () {
        j.call(this, !0), this.indexHandler.updateRepresentation(a, !1)
    }, n = function (b, c, d, e) {
        var f = this;
        c === f.streamProcessor.getType() && (a = f.getRepresentationForQuality(e))
    };
    return {
        system: void 0,
        debug: void 0,
        manifestExt: void 0,
        manifestModel: void 0,
        bufferExt: void 0,
        abrController: void 0,
        timelineConverter: void 0,
        notify: void 0,
        subscribe: void 0,
        unsubscribe: void 0,
        eventList: {ENAME_DATA_UPDATE_COMPLETED: "dataUpdateCompleted", ENAME_DATA_UPDATE_STARTED: "dataUpdateStarted"},
        setup: function () {
            this.qualityChanged = n, this.representationUpdated = k, this.wallclockTimeUpdated = l, this.liveEdgeFound = m
        },
        initialize: function (a) {
            this.streamProcessor = a, this.indexHandler = a.indexHandler
        },
        getData: function () {
            return b
        },
        getDataIndex: function () {
            return c
        },
        isUpdating: function () {
            return d
        },
        updateData: f,
        getRepresentationForQuality: g,
        getCurrentRepresentation: function () {
            return a
        }
    }
}, Dash.dependencies.RepresentationController.prototype = {constructor: Dash.dependencies.RepresentationController}, Dash.dependencies.TimelineConverter = function () {
    "use strict";
    var a = 0, b = function (a, b, c, d) {
        var e = 0 / 0;
        return e = d ? c && b.timeShiftBufferDepth != Number.POSITIVE_INFINITY ? new Date(b.availabilityStartTime.getTime() + 1e3 * (a + b.timeShiftBufferDepth)) : b.availabilityEndTime : c ? new Date(b.availabilityStartTime.getTime() + 1e3 * a) : b.availabilityStartTime
    }, c = function (a, c, d) {
        return b.call(this, a, c, d)
    }, d = function (a, c, d) {
        return b.call(this, a, c, d, !0)
    }, e = function (a) {
        var b, c = "dynamic" === a.mpd.manifest.type, d = parseInt(this.uriQueryFragModel.getURIFragmentData.s);
        return c ? (!isNaN(d) && d > 1262304e3 && (b = d - a.mpd.availabilityStartTime.getTime() / 1e3, (b > a.liveEdge || b < a.liveEdge - a.mpd.timeShiftBufferDepth) && (b = null)), b = b || a.liveEdge) : b = !isNaN(d) && d < a.duration && d >= 0 ? d : a.start, b
    }, f = function (a, b) {
        return (a.getTime() - b.mpd.availabilityStartTime.getTime()) / 1e3
    }, g = function (a, b) {
        var c = b.presentationTimeOffset;
        return a - c
    }, h = function (a, b) {
        var c = b.presentationTimeOffset;
        return c + a
    }, i = function (a, b) {
        var c, d, e;
        return b && (c = a.representation.adaptation.period.mpd.suggestedPresentationDelay, d = a.presentationStartTime + c, e = new Date(a.availabilityStartTime.getTime() + 1e3 * d)), e
    }, j = function (a, b, c) {
        var d, e = this, f = a.adaptation.period.start, g = e.calcSegmentAvailabilityRange(a, c);
        return b >= g.start + f && b <= g.end + f ? b : d = Math.max(g.end - 2 * a.adaptation.period.mpd.manifest.minBufferTime, g.start)
    }, k = function (b, c) {
        var d, e, g = b.segmentDuration, h = 0, i = b.adaptation.period.duration, j = {start: h, end: i};
        return c ? b.adaptation.period.mpd.isClientServerTimeSyncCompleted && !isNaN(g) || !b.segmentAvailabilityRange ? (d = b.adaptation.period.mpd.checkTime, e = f(new Date((new Date).getTime() + a), b.adaptation.period), h = Math.max(e - b.adaptation.period.mpd.timeShiftBufferDepth, 0), d += a / 1e3, i = isNaN(d) ? e : Math.min(d, e), j = {
            start: h,
            end: i
        }) : b.segmentAvailabilityRange : j
    }, l = function (b, c, d) {
        d.mpd.isClientServerTimeSyncCompleted || (d.mpd.clientServerTimeShift = c - b, d.mpd.isClientServerTimeSyncCompleted = !0, a = 1e3 * d.mpd.clientServerTimeShift)
    }, m = function (a) {
        var b = a.presentationTimeOffset;
        return -b
    };
    return {
        system: void 0,
        debug: void 0,
        uriQueryFragModel: void 0,
        setup: function () {
            this.system.mapHandler("liveEdgeFound", void 0, l.bind(this))
        },
        calcAvailabilityStartTimeFromPresentationTime: c,
        calcAvailabilityEndTimeFromPresentationTime: d,
        calcPresentationTimeFromWallTime: f,
        calcPresentationTimeFromMediaTime: g,
        calcPresentationStartTime: e,
        calcActualPresentationTime: j,
        calcMediaTimeFromPresentationTime: h,
        calcSegmentAvailabilityRange: k,
        calcWallTimeForSegment: i,
        calcMSETimeOffset: m
    }
}, Dash.dependencies.TimelineConverter.prototype = {constructor: Dash.dependencies.TimelineConverter}, Dash.vo.AdaptationSet = function () {
    "use strict";
    this.period = null, this.index = -1
}, Dash.vo.AdaptationSet.prototype = {constructor: Dash.vo.AdaptationSet}, Dash.vo.Event = function () {
    "use strict";
    this.duration = 0 / 0, this.presentationTime = 0 / 0, this.id = 0 / 0, this.messageData = "", this.eventStream = null, this.presentationTimeDelta = 0 / 0
}, Dash.vo.Event.prototype = {constructor: Dash.vo.Event}, Dash.vo.EventStream = function () {
    "use strict";
    this.adaptionSet = null, this.representation = null, this.period = null, this.timescale = 1, this.value = "", this.schemeIdUri = ""
}, Dash.vo.EventStream.prototype = {constructor: Dash.vo.EventStream}, Dash.vo.Mpd = function () {
    "use strict";
    this.manifest = null, this.suggestedPresentationDelay = 0, this.availabilityStartTime = null, this.availabilityEndTime = Number.POSITIVE_INFINITY, this.timeShiftBufferDepth = Number.POSITIVE_INFINITY, this.maxSegmentDuration = Number.POSITIVE_INFINITY, this.checkTime = 0 / 0, this.clientServerTimeShift = 0, this.isClientServerTimeSyncCompleted = !1
}, Dash.vo.Mpd.prototype = {constructor: Dash.vo.Mpd}, Dash.vo.Period = function () {
    "use strict";
    this.id = null, this.index = -1, this.duration = 0 / 0, this.start = 0 / 0, this.mpd = null, this.liveEdge = 0 / 0
}, Dash.vo.Period.prototype = {constructor: Dash.vo.Period}, Dash.vo.Representation = function () {
    "use strict";
    this.id = null, this.index = -1, this.adaptation = null, this.segmentInfoType = null, this.initialization = null, this.segmentDuration = 0 / 0, this.timescale = 1, this.startNumber = 1, this.indexRange = null, this.range = null, this.presentationTimeOffset = 0, this.MSETimeOffset = 0 / 0, this.segmentAvailabilityRange = null, this.availableSegmentsNumber = 0
}, Dash.vo.Representation.prototype = {constructor: Dash.vo.Representation}, Dash.vo.Segment = function () {
    "use strict";
    this.indexRange = null, this.index = null, this.mediaRange = null, this.media = null, this.duration = 0 / 0, this.replacementTime = null, this.replacementNumber = 0 / 0, this.mediaStartTime = 0 / 0, this.presentationStartTime = 0 / 0, this.availabilityStartTime = 0 / 0, this.availabilityEndTime = 0 / 0, this.availabilityIdx = 0 / 0, this.wallStartTime = 0 / 0, this.representation = null
}, Dash.vo.Segment.prototype = {constructor: Dash.vo.Segment}, MediaPlayer.dependencies.AbrController = function () {
    "use strict";
    var a = !0, b = {}, c = {}, d = function (a) {
        var c;
        return b.hasOwnProperty(a) || (b[a] = 0), c = b[a]
    }, e = function (a, c) {
        b[a] = c
    }, f = function (a) {
        var b;
        return c.hasOwnProperty(a) || (c[a] = 0), b = c[a]
    }, g = function (a, b) {
        c[a] = b
    };
    return {
        debug: void 0,
        abrRulesCollection: void 0,
        manifestExt: void 0,
        metricsModel: void 0,
        getAutoSwitchBitrate: function () {
            return a
        },
        setAutoSwitchBitrate: function (b) {
            a = b
        },
        getMetricsFor: function (a) {
            var b = Q.defer(), c = this;
            return c.manifestExt.getIsVideo(a).then(function (d) {
                d ? b.resolve(c.metricsModel.getMetricsFor("video")) : c.manifestExt.getIsAudio(a).then(function (a) {
                    b.resolve(a ? c.metricsModel.getMetricsFor("audio") : c.metricsModel.getMetricsFor("stream"))
                })
            }), b.promise
        },
        getPlaybackQuality: function (b, c) {
            var h, i, j, k, l, m, n = this, o = Q.defer(), p = MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE, q = MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE, r = [];
            return l = d(b), m = f(b), a ? n.getMetricsFor(c).then(function (a) {
                n.abrRulesCollection.getRules().then(function (d) {
                    for (h = 0, i = d.length; i > h; h += 1)r.push(d[h].checkIndex(l, a, c));
                    Q.all(r).then(function (a) {
                        for (k = {}, k[MediaPlayer.rules.SwitchRequest.prototype.STRONG] = MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE, k[MediaPlayer.rules.SwitchRequest.prototype.WEAK] = MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE, k[MediaPlayer.rules.SwitchRequest.prototype.DEFAULT] = MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE, h = 0, i = a.length; i > h; h += 1)j = a[h], j.quality !== MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE && (k[j.priority] = Math.min(k[j.priority], j.quality));
                        k[MediaPlayer.rules.SwitchRequest.prototype.WEAK] !== MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE && (q = MediaPlayer.rules.SwitchRequest.prototype.WEAK, p = k[MediaPlayer.rules.SwitchRequest.prototype.WEAK]), k[MediaPlayer.rules.SwitchRequest.prototype.DEFAULT] !== MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE && (q = MediaPlayer.rules.SwitchRequest.prototype.DEFAULT, p = k[MediaPlayer.rules.SwitchRequest.prototype.DEFAULT]), k[MediaPlayer.rules.SwitchRequest.prototype.STRONG] !== MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE && (q = MediaPlayer.rules.SwitchRequest.prototype.STRONG, p = k[MediaPlayer.rules.SwitchRequest.prototype.STRONG]), p !== MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE && void 0 !== p && (l = p), q !== MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE && void 0 !== q && (m = q), n.manifestExt.getRepresentationCount(c).then(function (a) {
                            0 > l && (l = 0), l >= a && (l = a - 1), m != MediaPlayer.rules.SwitchRequest.prototype.STRONG && m != MediaPlayer.rules.SwitchRequest.prototype.WEAK && (m = MediaPlayer.rules.SwitchRequest.prototype.DEFAULT), e(b, l), g(b, m), o.resolve({
                                quality: l,
                                confidence: m
                            })
                        })
                    })
                })
            }) : (n.debug.log("Unchanged quality of " + l), o.resolve({quality: l, confidence: m})), o.promise
        },
        setPlaybackQuality: function (a, b) {
            var c = d(a);
            b !== c && e(a, b)
        },
        getQualityFor: function (a) {
            return d(a)
        }
    }
}, MediaPlayer.dependencies.AbrController.prototype = {constructor: MediaPlayer.dependencies.AbrController}, MediaPlayer.dependencies.BufferController = function () {
    "use strict";
    var a, b, c, d, e, f, g, h = .5, i = 22, j = "WAITING", k = "READY", l = "VALIDATING", m = "LOADING", n = j, o = !1, p = !1, q = !1, r = !0, s = [], t = !1, u = -1, v = !0, w = -1, x = -1, y = !1, z = !1, A = !1, B = [], C = null, D = Q.defer(), E = null, F = null, G = null, H = 0, I = null, J = 0, K = !1, L = null, M = 0, N = !1, O = null, P = null, R = null, S = null, T = !1, U = null, V = null, W = null, X = null, Y = !0, Z = !1, $ = function (a) {
        var b = this;
        n = a, null !== I && b.fragmentController.onBufferControllerStateChange()
    }, _ = function (a, b) {
        var c = 0, d = null;
        Y === !1 && (d = X.start, c = a.getTime() - d.getTime(), X.duration = c, X.stopreason = b, Y = !0)
    }, ab = function () {
        o && p && ($.call(this, k), this.requestScheduler.startScheduling(this, Jb), I = this.fragmentController.attachBufferController(this))
    }, bb = function () {
        var a;
        this.requestScheduler.isScheduled(this) || (t === !1 && (a = new Date, _(a, MediaPlayer.vo.metrics.PlayList.Trace.USER_REQUEST_STOP_REASON), W = this.metricsModel.addPlayList(f, a, 0, MediaPlayer.vo.metrics.PlayList.INITIAL_PLAY_START_REASON)), this.debug.log("BufferController " + f + " start."), p = !0, q = !0, ab.call(this))
    }, cb = function (a) {
        var b;
        this.debug.log("BufferController " + f + " seek: " + a), t = !0, u = a, b = new Date, _(b, MediaPlayer.vo.metrics.PlayList.Trace.USER_REQUEST_STOP_REASON), W = this.metricsModel.addPlayList(f, b, u, MediaPlayer.vo.metrics.PlayList.SEEK_START_REASON), bb.call(this)
    }, db = function () {
        n !== j && (this.debug.log("BufferController " + f + " stop."), $.call(this, A ? k : j), this.requestScheduler.stopScheduling(this), this.fragmentController.cancelPendingRequestsForModel(I), p = !1, q = !1, _(new Date, MediaPlayer.vo.metrics.PlayList.Trace.USER_REQUEST_STOP_REASON))
    }, eb = function (a, b) {
        var c = this, d = Q.defer(), e = c.manifestModel.getValue();
        return c.manifestExt.getDataIndex(a, e, b.index).then(function (a) {
            c.manifestExt.getAdaptationsForPeriod(e, b).then(function (b) {
                c.manifestExt.getRepresentationsForAdaptation(e, b[a]).then(function (a) {
                    d.resolve(a)
                })
            })
        }), d.promise
    }, fb = function (b) {
        return a[b]
    }, gb = function () {
        var a = this;
        n === m && (y && (y = !1, this.videoModel.stallStream(f, y)), $.call(a, k))
    }, hb = function (a) {
        if (this.fragmentController.isInitializationRequest(a))$.call(this, k); else {
            $.call(this, m);
            var b = this, c = b.fragmentController.getLoadingTime(b);
            if (null !== O)return;
            O = setTimeout(function () {
                Eb() && ($.call(b, k), Ib.call(b), O = null)
            }, c)
        }
    }, ib = function (a, b) {
        this.fragmentController.isInitializationRequest(a) ? rb.call(this, a, b) : jb.call(this, a, b)
    }, jb = function (a, b) {
        var c = this, d = fb.call(c, a.quality), e = this.manifestExt.getEventStreamForAdaptationSet(c.getData()), g = this.manifestExt.getEventStreamForRepresentation(c.getData(), d);
        M || isNaN(a.duration) || (M = a.duration), c.fragmentController.process(b.data).then(function (b) {
            null !== b && null !== C ? ((e.length > 0 || g.length > 0) && mb.call(c, b, a, e, g).then(function (a) {
                c.eventController.addInbandEvents(a)
            }), Q.when(C.promise).then(function () {
                nb.call(c, b).then(function (b) {
                    kb.call(c, b, a.quality, a.index).then(function () {
                        D.promise.then(function (b) {
                            b.index - 1 !== a.index || A || (A = !0, y && (y = !1, c.videoModel.stallStream(f, y)), $.call(c, k), c.system.notify("bufferingCompleted"))
                        })
                    })
                })
            })) : c.debug.log("No " + f + " bytes to push.")
        })
    }, kb = function (a, c, d) {
        var e, g = this, h = void 0 === d, k = L && a == L.data, l = k ? E : Q.defer(), m = k ? B.length : B.push(l), o = g.videoModel.getCurrentTime(), p = new Date;
        return Y === !0 && n !== j && -1 !== w && (Y = !1, X = g.metricsModel.appendPlayListTrace(W, b.id, null, p, o, null, 1, null)), Q.when(k || 2 > m || B[m - 2].promise).then(function () {
            Eb() && pb.call(g).then(function () {
                return c !== w && h || c !== x && !h ? (e = I.getExecutedRequestForQualityAndIndex(c, d), e && (window.removed = e, I.removeExecutedRequest(e), h || g.indexHandler.getSegmentRequestForTime(b, e.startTime).then(Bb.bind(g))), l.resolve(), void(k && (E = null, L = null))) : void Q.when(F ? F.promise : !0).then(function () {
                    Eb() && g.sourceBufferExt.append(V, a, g.videoModel).then(function () {
                        k && (E = null, L = null), h && (x = c), !g.requestScheduler.isScheduled(g) && Db.call(g) && bb.call(g), K = !1, lb.call(g).then(function () {
                            l.resolve()
                        }), g.sourceBufferExt.getAllRanges(V).then(function (a) {
                            if (a && a.length > 0) {
                                var b, c;
                                for (b = 0, c = a.length; c > b; b += 1)g.debug.log("Buffered " + f + " Range: " + a.start(b) + " - " + a.end(b))
                            }
                        })
                    }, function (b) {
                        b.err.code === i && (L = {data: a, quality: c, index: d}, E = l, K = !0, H = 0, db.call(g))
                    })
                })
            })
        }), l.promise
    }, lb = function () {
        if (!Eb())return Q.when(!1);
        var a = this, c = Q.defer(), d = Gb.call(a);
        return a.manifestExt.getMpd(a.manifestModel.getValue()).then(function (c) {
            var e = a.timelineConverter.calcSegmentAvailabilityRange(b, z);
            a.metricsModel.addDVRInfo(f, d, c, e)
        }), a.sourceBufferExt.getBufferLength(V, d).then(function (b) {
            return Eb() ? (J = b, a.metricsModel.addBufferLevel(f, new Date, J), ob.call(a), Cb.call(a), void c.resolve()) : void c.reject()
        }), c.promise
    }, mb = function (a, b, c, d) {
        var e, f, g, h = [], i = 0, j = Math.pow(256, 2), k = Math.pow(256, 3), l = Math.max(isNaN(b.startTime) ? 0 : b.startTime, 0), m = [];
        Z = !1, g = c.concat(d);
        for (var n = 0; n < g.length; n++)m[g[n].schemeIdUri] = g[n];
        for (; i < a.length && (e = String.fromCharCode(a[i + 4], a[i + 5], a[i + 6], a[i + 7]), f = a[i] * k + a[i + 1] * j + 256 * a[i + 2] + 1 * a[i + 3], "moov" != e && "moof" != e);) {
            if ("emsg" == e) {
                Z = !0;
                for (var o = ["", "", 0, 0, 0, 0, ""], p = 0, q = i + 12; f + i > q;)0 === p || 1 == p || 6 == p ? (0 !== a[q] ? o[p] += String.fromCharCode(a[q]) : p += 1, q += 1) : (o[p] = a[q] * k + a[q + 1] * j + 256 * a[q + 2] + 1 * a[q + 3], q += 4, p += 1);
                var r = o[0], s = o[1], t = o[2], u = o[3], v = o[4], w = o[5], x = o[6], y = l * t + u;
                if (m[r]) {
                    var z = new Dash.vo.Event;
                    z.eventStream = m[r], z.eventStream.value = s, z.eventStream.timescale = t, z.duration = v, z.id = w, z.presentationTime = y, z.messageData = x, z.presentationTimeDelta = u, h.push(z)
                }
            }
            i += f
        }
        return Q.when(h)
    }, nb = function (a) {
        if (!Z)return Q.when(a);
        for (var b, c, d = a.length, e = 0, f = 0, g = Math.pow(256, 2), h = Math.pow(256, 3), i = new Uint8Array(a.length); d > e;) {
            if (b = String.fromCharCode(a[e + 4], a[e + 5], a[e + 6], a[e + 7]), c = a[e] * h + a[e + 1] * g + 256 * a[e + 2] + 1 * a[e + 3], "emsg" != b)for (var j = e; e + c > j; j++)i[f] = a[j], f += 1;
            e += c
        }
        return Q.when(i.subarray(0, f))
    }, ob = function () {
        var a = this.bufferExt.getLeastBufferLevel(), b = 2 * M, c = J - a;
        c > b && !F ? (H = 0, F = Q.defer()) : b > c && F && (F.resolve(), F = null)
    }, pb = function () {
        var a, b = this, c = Q.defer(), d = 0;
        return K ? (a = function () {
            qb.call(b).then(function (b) {
                d += b, d >= M ? c.resolve() : setTimeout(a, 1e3 * M)
            })
        }, a.call(b), c.promise) : Q.when(!0)
    }, qb = function () {
        var a, b, c = this, e = Q.defer(), f = c.videoModel.getCurrentTime(), g = 0;
        return b = c.fragmentController.getExecutedRequestForTime(I, f), a = b && !isNaN(b.startTime) ? b.startTime : Math.floor(f), M = b && !isNaN(b.duration) ? b.duration : 1, c.sourceBufferExt.getBufferRange(V, f).then(function (b) {
            null === b && u === f && V.buffered.length > 0 && (a = V.buffered.end(V.buffered.length - 1)), g = V.buffered.start(0), c.sourceBufferExt.remove(V, g, a, G.duration, d).then(function () {
                c.fragmentController.removeExecutedRequestsBeforeTime(I, a), e.resolve(a - g)
            })
        }), e.promise
    }, rb = function (a, b) {
        var c = this, d = b.data, e = a.quality;
        c.debug.log("Initialization finished loading: " + a.streamType), c.fragmentController.process(d).then(function (b) {
            null !== b ? (s[e] = b, e === w && kb.call(c, b, a.quality).then(function () {
                C.resolve()
            })) : c.debug.log("No " + f + " bytes to push.")
        })
    }, sb = function () {
        n === m && $.call(this, k), this.system.notify("segmentLoadingFailed")
    }, tb = function () {
        var a = this, c = b.segmentAvailabilityRange, d = 43200;
        return R = c.end, P = {
            start: Math.max(0, R - d),
            end: R + d
        }, S = Math.floor((c.end - c.start) / 2), e = Q.defer(), b.useCalculatedLiveEdgeTime ? e.resolve(R) : a.indexHandler.getSegmentRequestForTime(b, R).then(ub.bind(a, R, wb, vb)), e.promise
    }, ub = function (a, c, d, e) {
        var f = this;
        null === e ? (b.segments = null, b.segmentAvailabilityRange = {
            start: a - S,
            end: a + S
        }, f.indexHandler.getSegmentRequestForTime(b, a).then(ub.bind(f, a, c, d))) : f.fragmentController.isFragmentExists(e).then(function (b) {
            b ? c.call(f, e, a) : d.call(f, e, a)
        })
    }, vb = function (a, c) {
        var d, e;
        return T ? void xb.call(this, !1, c) : (e = c - R, d = e > 0 ? R - e : R + Math.abs(e) + S, void(d < P.start && d > P.end ? this.system.notify("segmentLoadingFailed") : ($.call(this, k), this.indexHandler.getSegmentRequestForTime(b, d).then(ub.bind(this, d, wb, vb)))))
    }, wb = function (a, c) {
        var d, f = a.startTime, g = this;
        if (!T) {
            if (0 === M)return void e.resolve(f);
            if (T = !0, P.end = f + 2 * S, c === R)return d = c + M, void this.indexHandler.getSegmentRequestForTime(b, d).then(ub.bind(g, d, function () {
                xb.call(g, !0, d)
            }, function () {
                e.resolve(d)
            }))
        }
        xb.call(this, !0, c)
    }, xb = function (a, c) {
        var d, f;
        a ? P.start = c : P.end = c, d = Math.floor(P.end - P.start) <= M, d ? e.resolve(a ? c : c - M) : (f = (P.start + P.end) / 2, this.indexHandler.getSegmentRequestForTime(b, f).then(ub.bind(this, f, wb, vb)))
    }, yb = function (a) {
        this.debug.log(f + " Stream is complete."), _(new Date, MediaPlayer.vo.metrics.PlayList.Trace.END_OF_CONTENT_STOP_REASON), db.call(this), D.resolve(a)
    }, zb = function () {
        var b = null;
        if (r && (this.debug.log("Marking a special seek for initial " + f + " playback."), t || (t = !0, u = 0), r = !1), v)C && Q.isPending(C.promise) && C.resolve(), C = Q.defer(), s = [], b = this.indexHandler.getInitRequest(a[w]); else if (b = Q.when(null), x !== w || -1 === x) {
            if (C && Q.isPending(C.promise))return Q.when(null);
            C = Q.defer(), s[w] ? kb.call(this, s[w], w).then(function () {
                C.resolve()
            }) : b = this.indexHandler.getInitRequest(a[w])
        }
        return b
    }, Ab = function () {
        var a, d = this;
        if (v && !t)d.debug.log("Data changed - loading the " + f + " fragment for time: " + c), a = d.indexHandler.getSegmentRequestForTime(b, c); else {
            var e, g = Q.defer();
            a = g.promise, Q.when(t ? u : d.indexHandler.getCurrentTime(b)).then(function (a) {
                d.sourceBufferExt.getBufferRange(V, a).then(function (c) {
                    t && (b.segments = null), t = !1, e = c ? c.end : a, d.indexHandler.getSegmentRequestForTime(b, e).then(function (a) {
                        g.resolve(a)
                    }, function () {
                        g.reject()
                    })
                }, function () {
                    g.reject()
                })
            }, function () {
                g.reject()
            })
        }
        return a
    }, Bb = function (a) {
        var c = this;
        null !== a ? c.fragmentController.isFragmentLoadedOrPending(c, a) ? "complete" !== a.action ? c.indexHandler.getNextSegmentRequest(b).then(Bb.bind(c)) : (db.call(c), $.call(c, k)) : Q.when(F ? F.promise : !0).then(function () {
            c.fragmentController.prepareFragmentForLoading(c, a, hb, ib, sb, yb).then(function () {
                $.call(c, k)
            })
        }) : $.call(c, k)
    }, Cb = function () {
        if (q) {
            var a = Fb.call(this);
            g > J && (a > g || g >= a && !A) ? y || (this.debug.log("Waiting for more " + f + " buffer before starting playback."), y = !0, this.videoModel.stallStream(f, y)) : (this.debug.log("Got enough " + f + " buffer to start."), q = !1, y = !1, this.videoModel.stallStream(f, y))
        }
    }, Db = function () {
        var a = this.videoModel.isPaused();
        return !a || a && this.scheduleWhilePaused
    }, Eb = function () {
        return !!U && !!V
    }, Fb = function () {
        var a = this.videoModel.getCurrentTime();
        return G.start + G.duration - a
    }, Gb = function () {
        var a = -1;
        return a = this.videoModel.getCurrentTime()
    }, Hb = function () {
        var a = this, c = a.videoModel.getPlaybackRate(), d = J / Math.max(c, 1), e = Q.defer();
        return a.bufferExt.getRequiredBufferLength(q, a.requestScheduler.getExecuteInterval(a) / 1e3, z, G.duration).then(function (c) {
            a.indexHandler.getSegmentCountForDuration(b, c, d).then(function (a) {
                e.resolve(a)
            })
        }), e.promise
    }, Ib = function () {
        var a = this, b = a.fragmentController.getPendingRequests(a), c = a.fragmentController.getLoadingRequests(a), d = (b ? b.length : 0) + (c ? c.length : 0);
        H - d > 0 ? (H--, Ab.call(a).then(Bb.bind(a))) : (n === l && $.call(a, k), gb.call(a))
    }, Jb = function () {
        var a, c = this, d = !1, e = new Date, g = c.videoModel.getCurrentTime();
        if (Cb.call(c), !Db.call(c) && !r && !v)return void db.call(c);
        if (h > J && !y && (c.debug.log("Stalling " + f + " Buffer: " + f), _(new Date, MediaPlayer.vo.metrics.PlayList.Trace.REBUFFERING_REASON), y = !0, q = !0, c.videoModel.stallStream(f, y)), n === k) {
            $.call(c, l);
            var i = c.manifestModel.getValue().minBufferTime;
            c.bufferExt.decideBufferLength(i, G.duration, q).then(function (a) {
                c.setMinBufferTime(a), c.requestScheduler.adjustExecuteInterval()
            }), c.abrController.getPlaybackQuality(f, U).then(function (h) {
                var i = h.quality;
                if (void 0 !== i && (a = i), d = i !== w, d === !0) {
                    if (w = a, c.fragmentController.cancelPendingRequestsForModel(I), b = fb.call(c, a), null === b || void 0 === b)throw"Unexpected error!";
                    V.timestampOffset !== b.MSETimeOffset && (V.timestampOffset = b.MSETimeOffset), _(new Date, MediaPlayer.vo.metrics.PlayList.Trace.REPRESENTATION_SWITCH_STOP_REASON), c.metricsModel.addRepresentationSwitch(f, e, g, b.id)
                }
                return Hb.call(c, i)
            }).then(function (a) {
                H = a, zb.call(c).then(function (a) {
                    null !== a && (c.fragmentController.prepareFragmentForLoading(c, a, hb, ib, sb, yb).then(function () {
                        $.call(c, k)
                    }), v = !1)
                }), Ib.call(c)
            })
        } else n === l && $.call(c, k)
    };
    return {
        videoModel: void 0,
        metricsModel: void 0,
        metricsExt: void 0,
        manifestExt: void 0,
        manifestModel: void 0,
        bufferExt: void 0,
        sourceBufferExt: void 0,
        abrController: void 0,
        fragmentExt: void 0,
        indexHandler: void 0,
        debug: void 0,
        system: void 0,
        errHandler: void 0,
        scheduleWhilePaused: void 0,
        eventController: void 0,
        timelineConverter: void 0,
        initialize: function (a, c, d, e, f, h, i, j, k) {
            var l = this, m = l.manifestModel.getValue();
            z = l.manifestExt.getIsDynamic(m), l.setMediaSource(j), l.setVideoModel(f), l.setType(a), l.setBuffer(e), l.setScheduler(h), l.setFragmentController(i), l.setEventController(k), l.updateData(d, c).then(function () {
                return z ? void tb.call(l).then(function (a) {
                    var d, e, f, h = Math.max(a - g, b.segmentAvailabilityRange.start), i = l.metricsModel.getMetricsFor("stream"), j = l.metricsExt.getCurrentManifestUpdate(i);
                    l.indexHandler.getSegmentRequestForTime(b, h).then(function (g) {
                        l.system.notify("liveEdgeFound", c.liveEdge, a, c), d = g ? g.duration : M, f = g ? g.startTime : b.adaptation.period.end - M, e = f + d / 2, c.liveEdge = e, l.metricsModel.updateManifestUpdateInfo(j, {
                            currentTime: e,
                            presentationStartTime: a,
                            latency: a - e,
                            clientTimeOffset: b.adaptation.period.mpd.clientServerTimeShift
                        }), o = !0, ab.call(l), cb.call(l, f)
                    })
                }) : (o = !0, void ab.call(l))
            }), l.indexHandler.setIsDynamic(z), l.bufferExt.decideBufferLength(m.minBufferTime, c, q).then(function (a) {
                l.setMinBufferTime(a)
            })
        },
        getType: function () {
            return f
        },
        setType: function (a) {
            f = a, void 0 !== this.indexHandler && this.indexHandler.setType(a)
        },
        getPeriodInfo: function () {
            return G
        },
        getVideoModel: function () {
            return this.videoModel
        },
        setVideoModel: function (a) {
            this.videoModel = a
        },
        getScheduler: function () {
            return this.requestScheduler
        },
        setScheduler: function (a) {
            this.requestScheduler = a
        },
        getFragmentController: function () {
            return this.fragmentController
        },
        setFragmentController: function (a) {
            this.fragmentController = a
        },
        setEventController: function (a) {
            this.eventController = a
        },
        getAutoSwitchBitrate: function () {
            var a = this;
            return a.abrController.getAutoSwitchBitrate()
        },
        setAutoSwitchBitrate: function (a) {
            var b = this;
            b.abrController.setAutoSwitchBitrate(a)
        },
        getData: function () {
            return U
        },
        updateData: function (d, e) {
            var g, h, i, j = this, k = Q.defer(), l = j.metricsModel.getMetricsFor("stream"), m = j.metricsExt.getCurrentManifestUpdate(l), n = U;
            return n || (n = d), db.call(j), eb.call(j, d, e).then(function (l) {
                a = l, G = e, h = l.length;
                for (var n = 0; h > n; n += 1)i = l[n], j.metricsModel.addManifestUpdateRepresentationInfo(m, i.id, i.index, i.adaptation.period.index, f, i.presentationTimeOffset, i.startNumber, i.segmentInfoType);
                g = j.abrController.getQualityFor(f), b || (b = fb.call(j, g)), j.indexHandler.getCurrentTime(b).then(function (a) {
                    v = !0, c = a, w = g, b = fb.call(j, g), V.timestampOffset = b.MSETimeOffset, b.segmentDuration && (M = b.segmentDuration), U = d, j.bufferExt.updateData(U, f), j.seek(a), j.indexHandler.updateSegmentList(b).then(function () {
                        j.metricsModel.updateManifestUpdateInfo(m, {latency: b.segmentAvailabilityRange.end - j.videoModel.getCurrentTime()}), k.resolve()
                    })
                })
            }), k.promise
        },
        getCurrentRepresentation: function () {
            return b
        },
        getBuffer: function () {
            return V
        },
        setBuffer: function (a) {
            V = a
        },
        getMinBufferTime: function () {
            return g
        },
        setMinBufferTime: function (a) {
            g = a
        },
        setMediaSource: function (a) {
            d = a
        },
        isReady: function () {
            return true
        },
        isBufferingCompleted: function () {
            return A
        },
        clearMetrics: function () {
            var a = this;
            null !== f && "" !== f && a.metricsModel.clearCurrentMetricsForType(f)
        },
        updateBufferState: function () {
            var a = this;
            K && L && !N ? (N = !0, kb.call(a, L.data, L.quality, L.index).then(function () {
                N = !1
            })) : lb.call(a)
        },
        updateStalledState: function () {
            y = this.videoModel.isStalled(), Cb.call(this)
        },
        reset: function (a) {
            var b = this, c = function (a) {
                a && (a.reject(), a = null)
            };
            db.call(b), c(e), c(C), c(E), c(F), B.forEach(c), B = [], c(D), D = Q.defer(), b.clearMetrics(), b.fragmentController.abortRequestsForModel(I), b.fragmentController.detachBufferController(I), I = null, s = [], r = !0, P = null, R = null, T = !1, S = null, K = !1, L = null, N = !1, a || (b.sourceBufferExt.abort(d, V), b.sourceBufferExt.removeSourceBuffer(d, V)), U = null, V = null
        },
        start: bb,
        seek: cb,
        stop: db
    }
}, MediaPlayer.dependencies.BufferController.prototype = {constructor: MediaPlayer.dependencies.BufferController}, MediaPlayer.dependencies.BufferExtensions = function () {
    "use strict";
    var a, b, c = 0, d = 0, e = null, f = null, g = function (a) {
        var b = this.metricsExt.getCurrentHttpRequest(a);
        return null !== b ? (b.tresponse.getTime() - b.trequest.getTime()) / 1e3 : 0
    }, h = function () {
        var a, b, g, h = this;
        return a = e ? h.abrController.getQualityFor("audio") : c, b = f ? h.abrController.getQualityFor("video") : d, g = a === c && b === d
    };
    return {
        system: void 0,
        videoModel: void 0,
        manifestExt: void 0,
        metricsExt: void 0,
        metricsModel: void 0,
        abrController: void 0,
        bufferMax: void 0,
        updateData: function (a, b) {
            var g = a.Representation_asArray.length - 1;
            "audio" === b ? (c = g, e = a) : "video" === b && (d = g, f = a)
        },
        getTopQualityIndex: function (a) {
            var b = null;
            return "audio" === a ? b = c : "video" === a && (b = d), b
        },
        decideBufferLength: function (b, c) {
            return a = isNaN(c) || MediaPlayer.dependencies.BufferExtensions.DEFAULT_MIN_BUFFER_TIME < c && c > b ? Math.max(MediaPlayer.dependencies.BufferExtensions.DEFAULT_MIN_BUFFER_TIME, b) : b >= c ? Math.min(c, MediaPlayer.dependencies.BufferExtensions.DEFAULT_MIN_BUFFER_TIME) : Math.min(c, b), Q.when(a)
        },
        getLeastBufferLevel: function () {
            var a = this.metricsModel.getReadOnlyMetricsFor("video"), b = this.metricsExt.getCurrentBufferLevel(a), c = this.metricsModel.getReadOnlyMetricsFor("audio"), d = this.metricsExt.getCurrentBufferLevel(c), e = null;
            return e = null === b || null === d ? null !== d ? d.level : null !== b ? b.level : null : Math.min(d.level, b.level)
        },
        getRequiredBufferLength: function (c, d, e, f) {
            var i, j = this, k = j.metricsModel.getReadOnlyMetricsFor("video"), l = j.metricsModel.getReadOnlyMetricsFor("audio"), m = f >= MediaPlayer.dependencies.BufferExtensions.LONG_FORM_CONTENT_DURATION_THRESHOLD, n = Q.defer(), o = !1;
            return j.bufferMax === MediaPlayer.dependencies.BufferExtensions.BUFFER_SIZE_MIN ? (i = a, n.resolve(i)) : j.bufferMax === MediaPlayer.dependencies.BufferExtensions.BUFFER_SIZE_INFINITY ? (i = f, n.resolve(i)) : j.bufferMax === MediaPlayer.dependencies.BufferExtensions.BUFFER_SIZE_REQUIRED ? (b = a, e || c || (o = h.call(j)), o && (b = m ? MediaPlayer.dependencies.BufferExtensions.BUFFER_TIME_AT_TOP_QUALITY_LONG_FORM : MediaPlayer.dependencies.BufferExtensions.BUFFER_TIME_AT_TOP_QUALITY), i = b + d + Math.max(g.call(j, k), g.call(j, l)), n.resolve(i)) : n.reject("invalid bufferMax value: " + j.bufferMax), n.promise
        },
        getBufferTarget: function () {
            return void 0 === b ? a : b
        }
    }
}, MediaPlayer.dependencies.BufferExtensions.BUFFER_SIZE_REQUIRED = "required", MediaPlayer.dependencies.BufferExtensions.BUFFER_SIZE_MIN = "min", MediaPlayer.dependencies.BufferExtensions.BUFFER_SIZE_INFINITY = "infinity", MediaPlayer.dependencies.BufferExtensions.BUFFER_TIME_AT_STARTUP = 1, MediaPlayer.dependencies.BufferExtensions.DEFAULT_MIN_BUFFER_TIME = 8, MediaPlayer.dependencies.BufferExtensions.BUFFER_TIME_AT_TOP_QUALITY = 30, MediaPlayer.dependencies.BufferExtensions.BUFFER_TIME_AT_TOP_QUALITY_LONG_FORM = 300, MediaPlayer.dependencies.BufferExtensions.LONG_FORM_CONTENT_DURATION_THRESHOLD = 600, MediaPlayer.dependencies.BufferExtensions.prototype.constructor = MediaPlayer.dependencies.BufferExtensions, MediaPlayer.utils.Capabilities = function () {
    "use strict"
}, MediaPlayer.utils.Capabilities.prototype = {
    constructor: MediaPlayer.utils.Capabilities,
    supportsMediaSource: function () {
        "use strict";
        var a = "WebKitMediaSource"in window, b = "MediaSource"in window;
        return a || b
    },
    supportsMediaKeys: function () {
        "use strict";
        var a = "WebKitMediaKeys"in window, b = "MSMediaKeys"in window, c = "MediaKeys"in window;
        return a || b || c
    },
    supportsCodec: function (a, b) {
        "use strict";
        if (!(a instanceof HTMLMediaElement))throw"element must be of type HTMLMediaElement.";
        var c = a.canPlayType(b);
        return "probably" === c
    }
}, MediaPlayer.utils.Debug = function () {
    "use strict";
    var a = !0;
    return {
        eventBus: void 0, setLogToBrowserConsole: function (b) {
            a = b
        }, getLogToBrowserConsole: function () {
            return a
        }, log: function (b) {
            a && console.log(b), this.eventBus.dispatchEvent({type: "log", message: b})
        }
    }
}, MediaPlayer.dependencies.ErrorHandler = function () {
    "use strict";
    return {
        eventBus: void 0, capabilityError: function (a) {
            this.eventBus.dispatchEvent({type: "error", error: "capability", event: a})
        }, downloadError: function (a, b, c) {
            this.eventBus.dispatchEvent({type: "error", error: "download", event: {id: a, url: b, request: c}})
        }, manifestError: function (a, b, c) {
            this.eventBus.dispatchEvent({
                type: "error",
                error: "manifestError",
                event: {message: a, id: b, manifest: c}
            })
        }, closedCaptionsError: function (a, b, c) {
            this.eventBus.dispatchEvent({type: "error", error: "cc", event: {message: a, id: b, cc: c}})
        }, mediaSourceError: function (a) {
            this.eventBus.dispatchEvent({type: "error", error: "mediasource", event: a})
        }, mediaKeySessionError: function (a) {
            this.eventBus.dispatchEvent({type: "error", error: "key_session", event: a})
        }, mediaKeyMessageError: function (a) {
            this.eventBus.dispatchEvent({type: "error", error: "key_message", event: a})
        }, mediaKeySystemSelectionError: function (a) {
            this.eventBus.dispatchEvent({type: "error", error: "key_system_selection", event: a})
        }
    }
}, MediaPlayer.dependencies.ErrorHandler.prototype = {constructor: MediaPlayer.dependencies.ErrorHandler}, MediaPlayer.utils.EventBus = function () {
    "use strict";
    var a, b = function (b, c) {
        var d = (c ? "1" : "0") + b;
        return d in a || (a[d] = []), a[d]
    }, c = function () {
        a = {}
    };
    return c(), {
        addEventListener: function (a, c, d) {
            var e = b(a, d), f = e.indexOf(c);
            -1 === f && e.push(c)
        }, removeEventListener: function (a, c, d) {
            var e = b(a, d), f = e.indexOf(c);
            -1 !== f && e.splice(f, 1)
        }, dispatchEvent: function (a) {
            for (var c = b(a.type, !1).slice(), d = 0; d < c.length; d++)c[d].call(this, a);
            return !a.defaultPrevented
        }
    }
}, MediaPlayer.dependencies.EventController = function () {
    "use strict";
    var a = [], b = [], c = [], d = null, e = 100, f = e / 1e3, g = "urn:mpeg:dash:event:2012", h = 1, i = function () {
        null !== d && (clearInterval(d), d = null), a = null, b = null, c = null
    }, j = function () {
        null !== d && (clearInterval(d), d = null)
    }, k = function () {
        var a = this;
        a.debug.log("Start Event Controller"), isNaN(e) || (d = setInterval(n.bind(this), e))
    }, l = function (b) {
        var c = this;
        a = [], b && b.length > 0 && (a = b), c.debug.log("Added " + b.length + " inline events")
    }, m = function (a) {
        for (var c = this, d = 0; d < a.length; d++) {
            var e = a[d];
            b[e.id] = e, c.debug.log("Add inband event with id " + e.id)
        }
    }, n = function () {
        o.call(this, b), o.call(this, a), p.call(this)
    }, o = function (a) {
        var b, d = this, e = this.videoModel.getCurrentTime();
        if (a)for (var i = 0; i < a.length; i++) {
            var j = a[i];
            void 0 !== j && (b = j.presentationTime / j.eventStream.timescale, (0 === b || e >= b && b + f > e) && (d.debug.log("Start Event at " + e), j.duration > 0 && c.push(j), j.eventStream.schemeIdUri == g && j.eventStream.value == h && q.call(this), a.splice(i, 1)))
        }
    }, p = function () {
        var a = this;
        if (c)for (var b = this.videoModel.getCurrentTime(), d = 0; d < c.length; d++) {
            var e = c[d];
            null !== e && (e.duration + e.presentationTime) / e.eventStream.timescale < b && (a.debug.log("Remove Event at time " + b), e = null, c.splice(d, 1))
        }
    }, q = function () {
        var a = this, b = a.manifestModel.getValue(), c = b.mpdUrl;
        b.hasOwnProperty("Location") && (c = b.Location), a.debug.log("Refresh manifest @ " + c), a.manifestLoader.load(c).then(function (b) {
            a.manifestModel.setValue(b)
        })
    };
    return {
        manifestModel: void 0,
        manifestExt: void 0,
        manifestLoader: void 0,
        debug: void 0,
        system: void 0,
        errHandler: void 0,
        videoModel: void 0,
        addInlineEvents: l,
        addInbandEvents: m,
        reset: i,
        clear: j,
        start: k,
        getVideoModel: function () {
            return this.videoModel
        },
        setVideoModel: function (a) {
            this.videoModel = a
        },
        initialize: function (a) {
            this.setVideoModel(a)
        }
    }
}, MediaPlayer.dependencies.EventController.prototype = {constructor: MediaPlayer.dependencies.EventController}, MediaPlayer.dependencies.FragmentController = function () {
    "use strict";
    var a = [], b = function (b) {
        for (var c = a.length, d = 0; c > d; d++)if (a[d].getContext() == b)return a[d];
        return null
    }, c = function () {
        for (var b = !0, c = a.length, d = 0; c > d; d++)if (!a[d].isReady()) {
            b = !1;
            break
        }
        return b
    }, d = function () {
        for (var b = 0; b < a.length; b++)a[b].executeCurrentRequest()
    };
    return {
        system: void 0, debug: void 0, fragmentLoader: void 0, process: function (a) {
            var b = null;
            return null !== a && void 0 !== a && a.byteLength > 0 && (b = new Uint8Array(a)), Q.when(b)
        }, attachBufferController: function (c) {
            if (!c)return null;
            var d = b(c);
            return d || (d = this.system.getObject("fragmentModel"), d.setContext(c), a.push(d)), d
        }, detachBufferController: function (b) {
            var c = a.indexOf(b);
            c > -1 && a.splice(c, 1)
        }, onBufferControllerStateChange: function () {
            c() && d.call(this)
        }, isFragmentLoadedOrPending: function (a, c) {
            var d, e = b(a);
            return e ? d = e.isFragmentLoadedOrPending(c) : !1
        }, getPendingRequests: function (a) {
            var c = b(a);
            return c ? c.getPendingRequests() : null
        }, getLoadingRequests: function (a) {
            var c = b(a);
            return c ? c.getLoadingRequests() : null
        }, isInitializationRequest: function (a) {
            return a && a.type && "initialization segment" === a.type.toLowerCase()
        }, getLoadingTime: function (a) {
            var c = b(a);
            return c ? c.getLoadingTime() : null
        }, getExecutedRequestForTime: function (a, b) {
            return a ? a.getExecutedRequestForTime(b) : null
        }, removeExecutedRequest: function (a, b) {
            a && a.removeExecutedRequest(b)
        }, removeExecutedRequestsBeforeTime: function (a, b) {
            a && a.removeExecutedRequestsBeforeTime(b)
        }, cancelPendingRequestsForModel: function (a) {
            a && a.cancelPendingRequests()
        }, abortRequestsForModel: function (a) {
            a && a.abortRequests()
        }, isFragmentExists: function (a) {
            var b = Q.defer();
            return this.fragmentLoader.checkForExistence(a).then(function () {
                b.resolve(!0)
            }, function () {
                b.resolve(!1)
            }), b.promise
        }, prepareFragmentForLoading: function (a, c, d, e, f, g) {
            var h = b(a);
            return h && c ? (h.addRequest(c), h.setCallbacks(d, e, f, g), Q.when(!0)) : Q.when(null)
        }
    }
}, MediaPlayer.dependencies.FragmentController.prototype = {constructor: MediaPlayer.dependencies.FragmentController}, MediaPlayer.dependencies.FragmentLoader = function () {
    "use strict";
    var a = 3, b = 500, c = [], d = function (a, e) {
        var f = new XMLHttpRequest, g = null, h = !0, i = !0, j = null, k = this;
        c.push(f), a.requestStartDate = new Date, g = k.metricsModel.addHttpRequest(a.streamType, null, a.type, a.url, null, a.range, a.requestStartDate, null, null, null, null, a.duration), k.metricsModel.appendHttpTrace(g, a.requestStartDate, a.requestStartDate.getTime() - a.requestStartDate.getTime(), [0]), j = a.requestStartDate, f.open("GET", k.tokenAuthentication.addTokenAsQueryArg(a.url), !0), f.responseType = "arraybuffer", f = k.tokenAuthentication.setTokenInRequestHeader(f), a.range && f.setRequestHeader("Range", "bytes=" + a.range), f.onprogress = function (b) {
            var c = new Date;
            h && (h = !1, (!b.lengthComputable || b.lengthComputable && b.total != b.loaded) && (a.firstByteDate = c, g.tresponse = c)), k.metricsModel.appendHttpTrace(g, c, c.getTime() - j.getTime(), [f.response ? f.response.byteLength : 0]), j = c
        }, f.onload = function () {
            if (!(f.status < 200 || f.status > 299)) {
                i = !1;
                var b, c, d = new Date, e = f.response;
                a.firstByteDate || (a.firstByteDate = a.requestStartDate), a.requestEndDate = d, b = a.firstByteDate.getTime() - a.requestStartDate.getTime(), c = a.requestEndDate.getTime() - a.firstByteDate.getTime(), k.debug.log("loaded " + a.streamType + ":" + a.type + ":" + a.startTime + " (" + f.status + ", " + b + "ms, " + c + "ms)"), g.tresponse = a.firstByteDate, g.tfinish = a.requestEndDate, g.responsecode = f.status, k.metricsModel.appendHttpTrace(g, d, d.getTime() - j.getTime(), [e ? e.byteLength : 0]), j = d, a.deferred.resolve({
                    data: e,
                    request: a
                })
            }
        }, f.onloadend = f.onerror = function () {
            if (-1 !== c.indexOf(f) && (c.splice(c.indexOf(f), 1), i)) {
                i = !1;
                var h, l, m = new Date, n = f.response;
                a.firstByteDate || (a.firstByteDate = a.requestStartDate), a.requestEndDate = m, h = a.firstByteDate.getTime() - a.requestStartDate.getTime(), l = a.requestEndDate.getTime() - a.firstByteDate.getTime(), k.debug.log("failed " + a.streamType + ":" + a.type + ":" + a.startTime + " (" + f.status + ", " + h + "ms, " + l + "ms)"), g.tresponse = a.firstByteDate, g.tfinish = a.requestEndDate, g.responsecode = f.status, k.metricsModel.appendHttpTrace(g, m, m.getTime() - j.getTime(), [n ? n.byteLength : 0]), j = m, e > 0 ? (k.debug.log("Failed loading segment: " + a.streamType + ":" + a.type + ":" + a.startTime + ", retry in " + b + "ms attempts: " + e), e--, setTimeout(function () {
                    d.call(k, a, e)
                }, b)) : (k.debug.log("Failed loading segment: " + a.streamType + ":" + a.type + ":" + a.startTime + " no retry attempts left"), k.errHandler.downloadError("content", a.url, f), a.deferred.reject(f))
            }
        }, f.send()
    }, e = function (a) {
        var b = new XMLHttpRequest, c = !1;
        b.open("HEAD", a.url, !0), b.onload = function () {
            b.status < 200 || b.status > 299 || (c = !0, a.deferred.resolve(a))
        }, b.onloadend = b.onerror = function () {
            c || a.deferred.reject(b)
        }, b.send()
    };
    return {
        metricsModel: void 0, errHandler: void 0, debug: void 0, tokenAuthentication: void 0, load: function (b) {
            return b ? (b.deferred = Q.defer(), d.call(this, b, a), b.deferred.promise) : Q.when(null)
        }, checkForExistence: function (a) {
            return a ? (a.deferred = Q.defer(), e.call(this, a), a.deferred.promise) : Q.when(null)
        }, abort: function () {
            var a, b, d = c.length;
            for (a = 0; d > a; a += 1)b = c[a], c[a] = null, b.abort(), b = null;
            c = []
        }
    }
}, MediaPlayer.dependencies.FragmentLoader.prototype = {constructor: MediaPlayer.dependencies.FragmentLoader}, MediaPlayer.dependencies.FragmentModel = function () {
    "use strict";
    var a, b, c, d, e, f = [], g = [], h = [], i = 2, j = function (e) {
        var g, i, j = this;
        b.call(a, e), g = function (b, d) {
            h.splice(h.indexOf(b), 1), f.push(b), c.call(a, b, d), b.deferred = null
        }, i = function (b) {
            h.splice(h.indexOf(b), 1), d.call(a, b), b.deferred = null
        }, j.fragmentLoader.load(e).then(g.bind(a, e), i.bind(a, e))
    }, k = function (a, b) {
        var c = function (a, c) {
            return a[b] < c[b] ? -1 : a[b] > c[b] ? 1 : 0
        };
        a.sort(c)
    }, l = function (a) {
        var b = f.indexOf(a);
        -1 !== b && f.splice(b, 1)
    };
    return {
        system: void 0, debug: void 0, fragmentLoader: void 0, setContext: function (b) {
            a = b
        }, getContext: function () {
            return a
        }, addRequest: function (a) {
            if (a) {
                if (this.isFragmentLoadedOrPending(a))return;
                g.push(a), k.call(this, g, "index")
            }
        }, setCallbacks: function (a, f, g, h) {
            b = a, e = h, d = g, c = f
        }, isFragmentLoadedOrPending: function (a) {
            for (var b, c = !1, d = f.length, e = 0; d > e; e++)if (b = f[e], a.startTime === b.startTime || "complete" === b.action && a.action === b.action) {
                if (a.url === b.url) {
                    c = !0;
                    break
                }
                l(a)
            }
            if (!c)for (e = 0, d = g.length; d > e; e += 1)b = g[e], a.url === b.url && a.startTime === b.startTime && (c = !0);
            if (!c)for (e = 0, d = h.length; d > e; e += 1)b = h[e], a.url === b.url && a.startTime === b.startTime && (c = !0);
            return c
        }, isReady: function () {
            return a.isReady()
        }, getPendingRequests: function () {
            return g
        }, getLoadingRequests: function () {
            return h
        }, getLoadingTime: function () {
            var a, b, c = 0;
            for (b = f.length - 1; b >= 0; b -= 1)if (a = f[b], a.requestEndDate instanceof Date && a.firstByteDate instanceof Date) {
                c = a.requestEndDate.getTime() - a.firstByteDate.getTime();
                break
            }
            return c
        }, getExecutedRequestForTime: function (a) {
            var b, c = f.length - 1, d = 0 / 0, e = 0 / 0, g = null;
            for (b = c; b >= 0; b -= 1)if (g = f[b], d = g.startTime, e = d + g.duration, !isNaN(d) && !isNaN(e) && a > d && e > a)return g;
            return null
        }, getExecutedRequestForQualityAndIndex: function (a, b) {
            var c, d = f.length - 1, e = null;
            for (c = d; c >= 0; c -= 1)if (e = f[c], e.quality === a && e.index === b)return e;
            return null
        }, removeExecutedRequest: function (a) {
            l.call(this, a)
        }, removeExecutedRequestsBeforeTime: function (a) {
            var b, c = f.length - 1, d = 0 / 0, e = null;
            for (b = c; b >= 0; b -= 1)e = f[b], d = e.startTime, !isNaN(d) && a > d && l.call(this, e)
        }, cancelPendingRequests: function () {
            g = []
        }, abortRequests: function () {
            this.fragmentLoader.abort(), h = []
        }, executeCurrentRequest: function () {
            var b, c = this;
            if (0 !== g.length && !(h.length >= i))switch (b = g.shift(), b.action) {
                case"complete":
                    f.push(b), e.call(a, b);
                    break;
                case"download":
                    h.push(b), j.call(c, b);
                    break;
                default:
                    this.debug.log("Unknown request action."), b.deferred ? (b.deferred.reject(), b.deferred = null) : d.call(a, b)
            }
        }
    }
}, MediaPlayer.dependencies.FragmentModel.prototype = {constructor: MediaPlayer.dependencies.FragmentModel}, MediaPlayer.dependencies.LiveEdgeFinder = function () {
    "use strict";
    var a, b = !1, c = function (a) {
        var b = a.value;
        null !== b ? this.notify(this.eventList.ENAME_LIVE_EDGE_FOUND, b) : this.notify(this.eventList.ENAME_LIVE_EDGE_SEARCH_ERROR)
    }, d = function () {
        if (this.streamProcessor.isDynamic() && !b) {
            var d = this, e = this.streamProcessor.getType();
            a = d.scheduleRulesCollection.getRules(MediaPlayer.rules.ScheduleRulesCollection.prototype.LIVE_EDGE_RULES), b = !0, this.rulesController.applyRules(a, e, c.bind(d), null, function (a, b) {
                return b
            })
        }
    };
    return {
        system: void 0,
        scheduleRulesCollection: void 0,
        rulesController: void 0,
        notify: void 0,
        subscribe: void 0,
        unsubscribe: void 0,
        eventList: {ENAME_LIVE_EDGE_FOUND: "liveEdgeFound", ENAME_LIVE_EDGE_SEARCH_ERROR: "liveEdgeSearchError"},
        setup: function () {
            this.streamUpdated = d
        },
        initialize: function (a) {
            this.streamProcessor = a, this.indexHandler = a.indexHandler, this.fragmentLoader = a.fragmentLoader, this.scheduleRulesCollection.liveEdgeBinarySearchRule && this.scheduleRulesCollection.liveEdgeBinarySearchRule.setFinder(this)
        },
        abortSearch: function () {
            if (b = !1, a)for (var c = 0, d = a.length; d > c; c += 1)a[c].reset()
        }
    }
}, MediaPlayer.dependencies.LiveEdgeFinder.prototype = {constructor: MediaPlayer.dependencies.LiveEdgeFinder}, MediaPlayer.dependencies.ManifestLoader = function () {
    "use strict";
    var a = 3, b = 500, c = null, d = function (a) {
        var b = null;
        return -1 !== a.indexOf("/") && (-1 !== a.indexOf("?") && (a = a.substring(0, a.indexOf("?"))), b = a.substring(0, a.lastIndexOf("/") + 1)), b
    }, e = function (a, f) {
        var g = d(a), h = new XMLHttpRequest, i = new Date, j = null, k = !0, l = null, m = null, n = this;
        l = function () {
            h.status < 200 || h.status > 299 || (k = !1, j = new Date, n.tokenAuthentication.checkRequestHeaderForToken(h), n.metricsModel.addHttpRequest("stream", null, "MPD", a, null, null, i, j, h.status, null, null), n.parser.parse(h.responseText, g).then(function (b) {
                b.mpdUrl = a, b.mpdLoadedTime = j, n.metricsModel.addManifestUpdate("stream", b.type, i, j, b.availabilityStartTime), c.resolve(b)
            }, function () {
                c.reject(h)
            }))
        }, m = function () {
            k && (k = !1, n.metricsModel.addHttpRequest("stream", null, "MPD", a, null, null, i, new Date, h.status, null, null), f > 0 ? (n.debug.log("Failed loading manifest: " + a + ", retry in " + b + "ms attempts: " + f), f--, setTimeout(function () {
                e.call(n, a, f)
            }, b)) : (n.debug.log("Failed loading manifest: " + a + " no retry attempts left"), n.errHandler.downloadError("manifest", a, h), c.reject(h)))
        };
        try {
            h.onload = l, h.onloadend = m, h.onerror = m, h.open("GET", a, !0), h.send()
        } catch (o) {
            h.onerror()
        }
    };
    return {
        debug: void 0,
        parser: void 0,
        errHandler: void 0,
        metricsModel: void 0,
        tokenAuthentication: void 0,
        load: function (b) {
            return c = Q.defer(), e.call(this, b, a), c.promise
        }
    }
}, MediaPlayer.dependencies.ManifestLoader.prototype = {constructor: MediaPlayer.dependencies.ManifestLoader}, MediaPlayer.models.ManifestModel = function () {
    "use strict";
    var a;
    return {
        system: void 0, eventBus: void 0, getValue: function () {
            return a
        }, setValue: function (b) {
            a = b, this.system.notify("manifestUpdated"), this.eventBus.dispatchEvent({type: "manifestLoaded", data: b})
        }
    }
}, MediaPlayer.models.ManifestModel.prototype = {constructor: MediaPlayer.models.ManifestModel}, MediaPlayer.dependencies.ManifestUpdater = function () {
    "use strict";
    var a, b = 0 / 0, c = null, d = !1, e = function () {
        null !== c && (clearInterval(c), c = null)
    }, f = function () {
        e.call(this), isNaN(b) || (this.debug.log("Refresh manifest in " + b + " seconds."), c = setTimeout(h.bind(this), Math.min(1e3 * b, Math.pow(2, 31) - 1), this))
    }, g = function () {
        var a, c = this, d = c.manifestModel.getValue();
        void 0 !== d && null !== d && c.manifestExt.getRefreshDelay(d).then(function (e) {
            a = ((new Date).getTime() - d.mpdLoadedTime.getTime()) / 1e3, b = Math.max(e - a, 0), f.call(c)
        })
    }, h = function () {
        var b, c, e = this;
        Q.when(a ? a.promise : !0).then(function () {
            a = Q.defer(), b = e.manifestModel.getValue(), c = b.mpdUrl, b.hasOwnProperty("Location") && (c = b.Location), e.manifestLoader.load(c).then(function (a) {
                e.manifestModel.setValue(a), e.debug.log("Manifest has been refreshed."), d || g.call(e)
            })
        })
    }, i = function () {
        a && a.resolve()
    };
    return {
        debug: void 0,
        system: void 0,
        manifestModel: void 0,
        manifestExt: void 0,
        manifestLoader: void 0,
        setup: function () {
            g.call(this), this.system.mapHandler("streamsComposed", void 0, i.bind(this))
        },
        start: function () {
            d = !1, g.call(this)
        },
        stop: function () {
            d = !0, e.call(this)
        }
    }
}, MediaPlayer.dependencies.ManifestUpdater.prototype = {constructor: MediaPlayer.dependencies.ManifestUpdater}, MediaPlayer.dependencies.MediaSourceExtensions = function () {
    "use strict"
}, MediaPlayer.dependencies.MediaSourceExtensions.prototype = {
    constructor: MediaPlayer.dependencies.MediaSourceExtensions,
    createMediaSource: function () {
        "use strict";
        var a = "WebKitMediaSource"in window, b = "MediaSource"in window;
        return b ? Q.when(new MediaSource) : a ? Q.when(new WebKitMediaSource) : null
    },
    attachMediaSource: function (a, b) {
        "use strict";
        return b.setSource(window.URL.createObjectURL(a)), Q.when(!0)
    },
    detachMediaSource: function (a) {
        "use strict";
        return a.setSource(""), Q.when(!0)
    },
    setDuration: function (a, b) {
        "use strict";
        return a.duration = b, Q.when(a.duration)
    },
    signalEndOfStream: function (a) {
        "use strict";
        return a.endOfStream(), Q.when(!0)
    }
}, MediaPlayer.models.MetricsModel = function () {
    "use strict";
    return {
        system: void 0, eventBus: void 0, streamMetrics: {}, metricsChanged: function () {
            this.eventBus.dispatchEvent({type: "metricsChanged", data: {}})
        }, metricChanged: function (a) {
            this.eventBus.dispatchEvent({type: "metricChanged", data: {stream: a}}), this.metricsChanged()
        }, metricUpdated: function (a, b, c) {
            this.eventBus.dispatchEvent({
                type: "metricUpdated",
                data: {stream: a, metric: b, value: c}
            }), this.metricChanged(a)
        }, metricAdded: function (a, b, c) {
            this.eventBus.dispatchEvent({
                type: "metricAdded",
                data: {stream: a, metric: b, value: c}
            }), this.metricChanged(a)
        }, clearCurrentMetricsForType: function (a) {
            delete this.streamMetrics[a], this.metricChanged(a)
        }, clearAllCurrentMetrics: function () {
            var a = this;
            this.streamMetrics = {}, this.metricsChanged.call(a)
        }, getReadOnlyMetricsFor: function (a) {
            return this.streamMetrics.hasOwnProperty(a) ? this.streamMetrics[a] : null
        }, getMetricsFor: function (a) {
            var b;
            return this.streamMetrics.hasOwnProperty(a) ? b = this.streamMetrics[a] : (b = this.system.getObject("metrics"), this.streamMetrics[a] = b), b
        }, addTcpConnection: function (a, b, c, d, e, f) {
            var g = new MediaPlayer.vo.metrics.TCPConnection;
            return g.tcpid = b, g.dest = c, g.topen = d, g.tclose = e, g.tconnect = f, this.getMetricsFor(a).TcpList.push(g), this.metricAdded(a, "TcpConnection", g), g
        }, addHttpRequest: function (a, b, c, d, e, f, g, h, i, j, k, l) {
            var m = new MediaPlayer.vo.metrics.HTTPRequest;
            return m.stream = a, m.tcpid = b, m.type = c, m.url = d, m.actualurl = e, m.range = f, m.trequest = g, m.tresponse = h, m.tfinish = i, m.responsecode = j, m.interval = k, m.mediaduration = l, this.getMetricsFor(a).HttpList.push(m), this.metricAdded(a, "HttpRequest", m), m
        }, appendHttpTrace: function (a, b, c, d) {
            var e = new MediaPlayer.vo.metrics.HTTPRequest.Trace;
            return e.s = b, e.d = c, e.b = d, a.trace.push(e), this.metricUpdated(a.stream, "HttpRequestTrace", a), e
        }, addRepresentationSwitch: function (a, b, c, d, e) {
            var f = new MediaPlayer.vo.metrics.RepresentationSwitch;
            return f.t = b, f.mt = c, f.to = d, f.lto = e, this.getMetricsFor(a).RepSwitchList.push(f), this.metricAdded(a, "RepresentationSwitch", f), f
        }, addBufferLevel: function (a, b, c) {
            var d = new MediaPlayer.vo.metrics.BufferLevel;
            return d.t = b, d.level = c, this.getMetricsFor(a).BufferLevel.push(d), this.metricAdded(a, "BufferLevel", d), d
        }, addDVRInfo: function (a, b, c, d) {
            var e = new MediaPlayer.vo.metrics.DVRInfo;
            return e.time = b, e.range = d, e.mpd = c, this.getMetricsFor(a).DVRInfo.push(e), this.metricAdded(a, "DVRInfo", e), e
        }, addDroppedFrames: function (a, b) {
            var c = new MediaPlayer.vo.metrics.DroppedFrames, d = this.getMetricsFor(a).DroppedFrames;
            return c.time = b.creationTime, c.droppedFrames = b.droppedVideoFrames, d.length > 0 && d[d.length - 1] == c ? d[d.length - 1] : (d.push(c), this.metricAdded(a, "DroppedFrames", c), c)
        }, addManifestUpdate: function (a, b, c, d, e, f, g, h, i, j) {
            var k = new MediaPlayer.vo.metrics.ManifestUpdate, l = this.getMetricsFor("stream");
            return k.streamType = a, k.type = b, k.requestTime = c, k.fetchTime = d, k.availabilityStartTime = e, k.presentationStartTime = f, k.clientTimeOffset = g, k.currentTime = h, k.buffered = i, k.latency = j, l.ManifestUpdate.push(k), this.metricAdded(a, "ManifestUpdate", k), k
        }, updateManifestUpdateInfo: function (a, b) {
            for (var c in b)a[c] = b[c];
            this.metricUpdated(a.streamType, "ManifestUpdate", a)
        }, addManifestUpdatePeriodInfo: function (a, b, c, d, e) {
            var f = new MediaPlayer.vo.metrics.ManifestUpdate.PeriodInfo;
            return f.id = b, f.index = c, f.start = d, f.duration = e, a.periodInfo.push(f), this.metricUpdated(a.streamType, "ManifestUpdatePeriodInfo", a), f
        }, addManifestUpdateRepresentationInfo: function (a, b, c, d, e, f, g, h) {
            var i = new MediaPlayer.vo.metrics.ManifestUpdate.RepresentationInfo;
            return i.id = b, i.index = c, i.periodIndex = d, i.streamType = e, i.startNumber = g, i.segmentInfoType = h, i.presentationTimeOffset = f, a.representationInfo.push(i), this.metricUpdated(a.streamType, "ManifestUpdateRepresentationInfo", a), i
        }, addPlayList: function (a, b, c, d) {
            var e = new MediaPlayer.vo.metrics.PlayList;
            return e.stream = a, e.start = b, e.mstart = c, e.starttype = d, this.getMetricsFor(a).PlayList.push(e), this.metricAdded(a, "PlayList", e), e
        }, appendPlayListTrace: function (a, b, c, d, e, f, g, h) {
            var i = new MediaPlayer.vo.metrics.PlayList.Trace;
            return i.representationid = b, i.subreplevel = c, i.start = d, i.mstart = e, i.duration = f, i.playbackspeed = g, i.stopreason = h, a.trace.push(i), this.metricUpdated(a.stream, "PlayListTrace", a), i
        }
    }
}, MediaPlayer.models.MetricsModel.prototype = {constructor: MediaPlayer.models.MetricsModel}, MediaPlayer.dependencies.Notifier = function () {
    "use strict";
    var a, b = 0, c = function () {
        return this.id || (b += 1, this.id = "_id_" + b), this.id
    }, d = function (a) {
        var b, c = this.eventList;
        for (b in c)if (c[b] === a)return !0;
        return !1
    };
    return {
        system: void 0, setup: function () {
            a = this.system, a.mapValue("notify", this.notify), a.mapValue("subscribe", this.subscribe), a.mapValue("unsubscribe", this.unsubscribe)
        }, notify: function () {
            var b = [].slice.call(arguments);
            b.splice(1, 0, this), b[0] += c.call(this), a.notify.apply(a, b)
        }, subscribe: function (b, e, f, g) {
            if (!f && e[b] && (f = e[b] = e[b].bind(e)), !d.call(this, b))throw"object does not support given event " + b;
            if (!e)throw"observer object cannot be null or undefined";
            if (!f)throw"event handler cannot be null or undefined";
            b += c.call(this), a.mapHandler(b, void 0, f, g)
        }, unsubscribe: function (b, d, e) {
            e = e || d[b], b += c.call(this), a.unmapHandler(b, void 0, e)
        }
    }
}, MediaPlayer.dependencies.Notifier.prototype = {constructor: MediaPlayer.dependencies.Notifier}, MediaPlayer.dependencies.PlaybackController = function () {
    "use strict";
    var a, b, c, d, e, f = 1e3, g = 0, h = function () {
        var b = this, c = function () {
            x.call(b)
        };
        null !== a && i.call(this), a = setInterval(c, f)
    }, i = function () {
        clearInterval(a), a = null
    }, j = function () {
        var a = this.timelineConverter.calcPresentationStartTime(b);
        this.debug.log("Starting playback at offset: " + a), this.seek(a)
    }, k = function () {
        if (!this.isPaused()) {
            var a = this.getTime(), b = this.timelineConverter.calcActualPresentationTime(d, a, e), c = !isNaN(b) && b !== a;
            c && this.seek(b)
        }
    }, l = function (a, c, f) {
        d = f, b = d.adaptation.period, e = a.streamProcessor.isDynamic(), k.call(this)
    }, m = function () {
        0 !== c.getElement().readyState && j.call(this)
    }, n = function () {
        c && (c.unlisten("play", o), c.unlisten("pause", p), c.unlisten("error", w), c.unlisten("seeking", q), c.unlisten("seeked", r), c.unlisten("timeupdate", s), c.unlisten("progress", t), c.unlisten("ratechange", u), c.unlisten("loadedmetadata", v))
    }, o = function () {
        k.call(this), this.notify(this.eventList.ENAME_PLAYBACK_STARTED, this.getTime())
    }, p = function () {
        this.notify(this.eventList.ENAME_PLAYBACK_PAUSED)
    }, q = function () {
        this.notify(this.eventList.ENAME_PLAYBACK_SEEKING, this.getTime(), !1)
    }, r = function () {
        this.notify(this.eventList.ENAME_PLAYBACK_SEEKED)
    }, s = function () {
        var a = this.getTime();
        a !== g && (g = a, this.notify(this.eventList.ENAME_PLAYBACK_TIME_UPDATED, this.getTimeToPeriodEnd()))
    }, t = function () {
        var a, d, e, f = c.getElement().buffered;
        f.length && (a = f.length - 1, d = f.end(a), e = this.timelineConverter.calcPresentationStartTime(b) + b.duration - d), this.notify(this.eventList.ENAME_PLAYBACK_PROGRESS, c.getElement().buffered, e)
    }, u = function () {
        this.notify(this.eventList.ENAME_PLAYBACK_RATE_CHANGED)
    }, v = function () {
        this.debug.log("Got loadmetadata event."), (!e || b.isClientServerTimeSyncCompleted) && j.call(this), this.notify(this.eventList.ENAME_PLAYBACK_METADATA_LOADED), h.call(this)
    }, w = function (a) {
        this.notify(this.eventList.ENAME_PLAYBACK_ERROR, a.srcElement.error)
    }, x = function () {
        this.notify(this.eventList.ENAME_WALLCLOCK_TIME_UPDATED, e, new Date)
    }, y = function (a) {
        c = a, c.listen("play", o), c.listen("pause", p), c.listen("error", w), c.listen("seeking", q), c.listen("seeked", r), c.listen("timeupdate", s), c.listen("progress", t), c.listen("ratechange", u), c.listen("loadedmetadata", v)
    };
    return {
        debug: void 0,
        timelineConverter: void 0,
        notify: void 0,
        subscribe: void 0,
        unsubscribe: void 0,
        eventList: {
            ENAME_PLAYBACK_STARTED: "playbackStarted",
            ENAME_PLAYBACK_STOPPED: "playbackStopped",
            ENAME_PLAYBACK_PAUSED: "playbackPaused",
            ENAME_PLAYBACK_SEEKING: "playbackSeeking",
            ENAME_PLAYBACK_SEEKED: "playbackSeeked",
            ENAME_PLAYBACK_TIME_UPDATED: "playbackTimeUpdated",
            ENAME_PLAYBACK_PROGRESS: "playbackProgress",
            ENAME_PLAYBACK_RATE_CHANGED: "playbackRateChanged",
            ENAME_PLAYBACK_METADATA_LOADED: "playbackMetaDataLoaded",
            ENAME_PLAYBACK_ERROR: "playbackError",
            ENAME_WALLCLOCK_TIME_UPDATED: "wallclockTimeUpdated"
        },
        setup: function () {
            this.dataUpdateCompleted = l, this.liveEdgeFound = m, o = o.bind(this), p = p.bind(this), w = w.bind(this), q = q.bind(this), r = r.bind(this), s = s.bind(this), t = t.bind(this), u = u.bind(this), v = v.bind(this)
        },
        initialize: function (a, d) {
            b = a, c !== d && (n.call(this), y.call(this, d))
        },
        getTimeToPeriodEnd: function () {
            var a = c.getCurrentTime();
            return this.timelineConverter.calcPresentationStartTime(b) + b.duration - a
        },
        getPeriodDuration: function () {
            return b.duration
        },
        getTime: function () {
            return c.getCurrentTime()
        },
        getPlaybackRate: function () {
            return c.getPlaybackRate()
        },
        start: function () {
            c.play()
        },
        isPaused: function () {
            return c.isPaused()
        },
        pause: function () {
            c && c.pause()
        },
        isSeeking: function () {
            return c.getElement().seeking
        },
        seek: function (a) {
            a !== this.getTime() && (c.setCurrentTime(a), this.notify(this.eventList.ENAME_PLAYBACK_SEEKING, a, !0))
        },
        reset: function () {
            i.call(this), n.call(this), c = null, b = null, g = 0
        }
    }
}, MediaPlayer.dependencies.PlaybackController.prototype = {constructor: MediaPlayer.dependencies.PlaybackController}, MediaPlayer.dependencies.ProtectionController = function () {
    "use strict";
    var a = null, b = null, c = function (a) {
        var b = this;
        b.protectionModel.removeKeySystem(a)
    }, d = function (a, c) {
        for (var d = this, e = 0; e < b.length; ++e)for (var f = 0; f < c.length; ++f)if (b[e].isSupported(c[f]) && d.protectionExt.supportsCodec(b[e].keysTypeString, a)) {
            var g = d.manifestExt.getKID(c[f]);
            return g || (g = "unknown"), d.protectionModel.addKeySystem(g, c[f], b[e]), d.debug.log("DRM: Selected Key System: " + b[e].keysTypeString + " For KID: " + g), g
        }
        throw new Error("DRM: The protection system for this content is not supported.")
    }, e = function (a, b, c) {
        var d = this, e = null, f = null;
        d.protectionModel.needToAddKeySession(a) && (f = d.protectionModel.getInitData(a), !f && c ? (f = c, d.debug.log("DRM: Using initdata from needskey event. length: " + f.length)) : f && d.debug.log("DRM: Using initdata from prheader in mpd. length: " + f.length), f ? (e = d.protectionModel.addKeySession(a, b, f), d.debug.log("DRM: Added Key Session [" + e.sessionId + "] for KID: " + a + " type: " + b + " initData length: " + f.length)) : d.debug.log("DRM: initdata is null."))
    }, f = function (a, b, c, d) {
        var e, f = this;
        return e = f.protectionModel.updateFromMessage(a, c, d), e.then(function (a) {
            b.update(a)
        }), e
    };
    return {
        system: void 0,
        debug: void 0,
        manifestExt: void 0,
        capabilities: void 0,
        videoModel: void 0,
        protectionModel: void 0,
        protectionExt: void 0,
        setup: function () {
            b = this.protectionExt.getKeySystems()
        },
        init: function (b, c) {
            this.videoModel = b, this.protectionModel = c, a = this.videoModel.getElement()
        },
        selectKeySystem: d,
        ensureKeySession: e,
        updateFromMessage: f,
        teardownKeySystem: c
    }
}, MediaPlayer.dependencies.ProtectionController.prototype = {constructor: MediaPlayer.dependencies.ProtectionController}, MediaPlayer.dependencies.ProtectionExtensions = function () {
    "use strict"
}, MediaPlayer.dependencies.ProtectionExtensions.prototype = {
    constructor: MediaPlayer.dependencies.ProtectionExtensions,
    supportsCodec: function (a, b) {
        "use strict";
        var c = "WebKitMediaKeys"in window, d = "MSMediaKeys"in window, e = "MediaKeys"in window;
        return e ? MediaKeys.isTypeSupported(a, b) : c ? WebKitMediaKeys.isTypeSupported(a, b) : d ? MSMediaKeys.isTypeSupported(a, b) : !1
    },
    createMediaKeys: function (a) {
        "use strict";
        var b = "WebKitMediaKeys"in window, c = "MSMediaKeys"in window, d = "MediaKeys"in window;
        return d ? new MediaKeys(a) : b ? new WebKitMediaKeys(a) : c ? new MSMediaKeys(a) : null
    },
    setMediaKey: function (a, b) {
        var c = "WebKitSetMediaKeys"in a, d = "msSetMediaKeys"in a, e = "SetMediaKeys"in a;
        return e ? a.SetMediaKeys(b) : c ? a.WebKitSetMediaKeys(b) : d ? a.msSetMediaKeys(b) : void this.debug.log("no setmediakeys function in element")
    },
    createSession: function (a, b, c) {
        return a.createSession(b, c)
    },
    getKeySystems: function () {
        var a = function (a, b) {
            var c = Q.defer(), d = null, e = [], f = new DOMParser, g = f.parseFromString(a, "application/xml");
            if (!g.getElementsByTagName("Challenge")[0])return c.reject("DRM: playready update, can not find Challenge in keyMessage"), c.promise;
            var h = g.getElementsByTagName("Challenge")[0].childNodes[0].nodeValue;
            h && (d = BASE64.decode(h));
            var i = g.getElementsByTagName("name"), j = g.getElementsByTagName("value");
            if (i.length != j.length)return c.reject("DRM: playready update, invalid header name/value pair in keyMessage"), c.promise;
            for (var k = 0; k < i.length; k++)e[k] = {
                name: i[k].childNodes[0].nodeValue,
                value: j[k].childNodes[0].nodeValue
            };
            var l = new XMLHttpRequest;
            return l.onload = function () {
                200 == l.status ? c.resolve(new Uint8Array(l.response)) : c.reject('DRM: playready update, XHR status is "' + l.statusText + '" (' + l.status + "), expected to be 200. readyState is " + l.readyState)
            }, l.onabort = function () {
                c.reject('DRM: playready update, XHR aborted. status is "' + l.statusText + '" (' + l.status + "), readyState is " + l.readyState)
            }, l.onerror = function () {
                c.reject('DRM: playready update, XHR error. status is "' + l.statusText + '" (' + l.status + "), readyState is " + l.readyState)
            }, l.open("POST", b), l.responseType = "arraybuffer", e && e.forEach(function (a) {
                l.setRequestHeader(a.name, a.value)
            }), l.send(d), c.promise
        }, b = function (a, b) {
            return null === a && 0 === b.length
        }, c = function (a) {
            var b = 0, c = 0, d = 0, e = new Uint8Array([112, 115, 115, 104, 0, 0, 0, 0]), f = new Uint8Array([154, 4, 240, 121, 152, 64, 66, 134, 171, 146, 230, 91, 224, 136, 95, 149]), g = null, h = null, i = null, j = null;
            if ("pro"in a)g = BASE64.decodeArray(a.pro.__text); else {
                if (!("prheader"in a))return null;
                g = BASE64.decodeArray(a.prheader.__text)
            }
            return c = g.length, d = 4 + e.length + f.length + 4 + c, h = new ArrayBuffer(d), i = new Uint8Array(h), j = new DataView(h), j.setUint32(b, d), b += 4, i.set(e, b), b += e.length, i.set(f, b), b += f.length, j.setUint32(b, c), b += 4, i.set(g, b), b += c, i
        };
        return [{
            schemeIdUri: "urn:uuid:9a04f079-9840-4286-ab92-e65be0885f95",
            keysTypeString: "com.microsoft.playready",
            isSupported: function (a) {
                return this.schemeIdUri === a.schemeIdUri.toLowerCase()
            },
            needToAddKeySession: b,
            getInitData: c,
            getUpdate: a
        }, {
            schemeIdUri: "urn:mpeg:dash:mp4protection:2011",
            keysTypeString: "com.microsoft.playready",
            isSupported: function (a) {
                return this.schemeIdUri === a.schemeIdUri.toLowerCase() && "cenc" === a.value.toLowerCase()
            },
            needToAddKeySession: b,
            getInitData: function () {
                return null
            },
            getUpdate: a
        }, {
            schemeIdUri: "urn:uuid:00000000-0000-0000-0000-000000000000",
            keysTypeString: "webkit-org.w3.clearkey",
            isSupported: function (a) {
                return this.schemeIdUri === a.schemeIdUri.toLowerCase()
            },
            needToAddKeySession: function () {
                return !0
            },
            getInitData: function () {
                return null
            },
            getUpdate: function (a) {
                return Q.when(a)
            }
        }]
    },
    addKey: function (a, b, c, d, e) {
        a.webkitAddKey(b, c, d, e)
    },
    generateKeyRequest: function (a, b, c) {
        a.webkitGenerateKeyRequest(b, c)
    },
    listenToNeedKey: function (a, b) {
        a.listen("webkitneedkey", b), a.listen("msneedkey", b), a.listen("needKey", b)
    },
    listenToKeyError: function (a, b) {
        a.addEventListener("webkitkeyerror", b, !1), a.addEventListener("mskeyerror", b, !1), a.addEventListener("keyerror", b, !1)
    },
    listenToKeyMessage: function (a, b) {
        a.addEventListener("webkitkeymessage", b, !1), a.addEventListener("mskeymessage", b, !1), a.addEventListener("keymessage", b, !1)
    },
    listenToKeyAdded: function (a, b) {
        a.addEventListener("webkitkeyadded", b, !1), a.addEventListener("mskeyadded", b, !1), a.addEventListener("keyadded", b, !1)
    },
    unlistenToKeyError: function (a, b) {
        a.removeEventListener("webkitkeyerror", b), a.removeEventListener("mskeyerror", b), a.removeEventListener("keyerror", b)
    },
    unlistenToKeyMessage: function (a, b) {
        a.removeEventListener("webkitkeymessage", b), a.removeEventListener("mskeymessage", b), a.removeEventListener("keymessage", b)
    },
    unlistenToKeyAdded: function (a, b) {
        a.removeEventListener("webkitkeyadded", b), a.removeEventListener("mskeyadded", b), a.removeEventListener("keyadded", b)
    }
}, MediaPlayer.models.ProtectionModel = function () {
    "use strict";
    var a = null, b = null, c = null, d = null, e = [];
    return {
        system: void 0, videoModel: void 0, protectionExt: void 0, setup: function () {
            a = this.videoModel.getElement()
        }, init: function (b) {
            this.videoModel = b, a = this.videoModel.getElement()
        }, addKeySession: function (a, f, g) {
            var h = null;
            return h = this.protectionExt.createSession(e[a].keys, f, g), this.protectionExt.listenToKeyAdded(h, b), this.protectionExt.listenToKeyError(h, c), this.protectionExt.listenToKeyMessage(h, d), e[a].initData = g, e[a].keySessions.push(h), h
        }, addKeySystem: function (b, c, d) {
            var f = null;
            f = this.protectionExt.createMediaKeys(d.keysTypeString), this.protectionExt.setMediaKey(a, f), e[b] = {
                kID: b,
                contentProtection: c,
                keySystem: d,
                keys: f,
                initData: null,
                keySessions: []
            }
        }, removeKeySystem: function (a) {
            if (null !== a && void 0 !== e[a] && 0 !== e[a].keySessions.length) {
                for (var f = e[a].keySessions, g = 0; g < f.length; ++g)this.protectionExt.unlistenToKeyError(f[g], c), this.protectionExt.unlistenToKeyAdded(f[g], b), this.protectionExt.unlistenToKeyMessage(f[g], d), f[g].close();
                e[a] = void 0
            }
        }, needToAddKeySession: function (a) {
            var b = null;
            return b = e[a], b.keySystem.needToAddKeySession(b.initData, b.keySessions)
        }, getInitData: function (a) {
            var b = null;
            return b = e[a], b.keySystem.getInitData(b.contentProtection)
        }, updateFromMessage: function (a, b, c) {
            return e[a].keySystem.getUpdate(b, c)
        }, listenToNeedKey: function (a) {
            this.protectionExt.listenToNeedKey(this.videoModel, a)
        }, listenToKeyError: function (a) {
            c = a;
            for (var b = 0; b < e.length; ++b)for (var d = e[b].keySessions, f = 0; f < d.length; ++f)this.protectionExt.listenToKeyError(d[f], a)
        }, listenToKeyMessage: function (a) {
            d = a;
            for (var b = 0; b < e.length; ++b)for (var c = e[b].keySessions, f = 0; f < c.length; ++f)this.protectionExt.listenToKeyMessage(c[f], a)
        }, listenToKeyAdded: function (a) {
            b = a;
            for (var c = 0; c < e.length; ++c)for (var d = e[c].keySessions, f = 0; f < d.length; ++f)this.protectionExt.listenToKeyAdded(d[f], a)
        }
    }
}, MediaPlayer.models.ProtectionModel.prototype = {constructor: MediaPlayer.models.ProtectionModel}, MediaPlayer.dependencies.RequestScheduler = function () {
    "use strict";
    var a = [], b = null, c = null, d = !1, e = 0, f = 1, g = 2, h = function (a, b, c) {
        if (a && b) {
            var e;
            e = w.call(this, a, g), e.setScheduledTask(b), e.setIsScheduled(!0), e.setExecuteTime(c), d || i.call(this)
        }
    }, i = function () {
        var a = this.videoModel.getElement();
        this.schedulerExt.attachScheduleListener(a, j.bind(this)), this.schedulerExt.attachUpdateScheduleListener(a, m.bind(this)), d = !0
    }, j = function () {
        var a, b, c, d = x.call(this, g), e = d.length, f = this.videoModel.getCurrentTime();
        for (c = 0; e > c; c += 1)a = d[c], b = a.getExecuteTime(), a.getIsScheduled() && f > b && (a.executeScheduledTask(), a.setIsScheduled(!1))
    }, k = function (a) {
        var b, c = z(a, g);
        c && (y(c), b = x.call(this, g), 0 === b.length && l.call(this))
    }, l = function () {
        var a = this.videoModel.getElement();
        this.schedulerExt.detachScheduleListener(a, j.bind(this)), this.schedulerExt.detachUpdateScheduleListener(a, m.bind(this)), d = !1
    }, m = function () {
        n.call(this), j.call(this)
    }, n = function () {
        var a, b = x.call(this, g), c = b.length;
        for (a = 0; c > a; a += 1)b[a].setIsScheduled(!0)
    }, o = function (a, b, c) {
        if (a && b) {
            var d, e, g = c.getTime() - (new Date).getTime();
            e = w.call(this, a, f), e.setScheduledTask(b), d = setTimeout(function () {
                e.executeScheduledTask(), y(e)
            }, g), e.setExecuteId(d)
        }
    }, p = function (a) {
        var b = z(a, f);
        b && (clearTimeout(b.getExecuteId()), y(b))
    }, q = function (a, b) {
        if (a && b) {
            var c = z(a, e);
            c || (c = w.call(this, a, e)), c.setIsScheduled(!0), c.setScheduledTask(b), t.call(this), b.call(a)
        }
    }, r = function () {
        s.call(this)
    }, s = function () {
        var a, b, c = this, d = x.call(c, e), f = d.length;
        for (b = 0; f > b; b += 1)a = d[b], a.getIsScheduled() && a.executeScheduledTask()
    }, t = function () {
        null === c && (this.adjustExecuteInterval(), c = setInterval(r.bind(this), b))
    }, u = function (a) {
        var b = z(a, e), c = x.call(this, e);
        b && (y(b), 0 === c.length && v.call(this))
    }, v = function () {
        clearInterval(c), c = null
    }, w = function (b, c) {
        if (!b)return null;
        var d = this.system.getObject("schedulerModel");
        return d.setContext(b), d.setType(c), a.push(d), d
    }, x = function (b) {
        var c, d, e = [];
        for (d = 0; d < a.length; d += 1)c = a[d], c.getType() === b && e.push(c);
        return e
    }, y = function (b) {
        var c = a.indexOf(b);
        -1 !== c && a.splice(c, 1)
    }, z = function (b, c) {
        for (var d = 0; d < a.length; d++)if (a[d].getContext() === b && a[d].getType() === c)return a[d];
        return null
    };
    return {
        system: void 0,
        videoModel: void 0,
        debug: void 0,
        schedulerExt: void 0,
        isScheduled: function (a) {
            var b = z(a, e);
            return !!b && b.getIsScheduled()
        },
        getExecuteInterval: function () {
            return b
        },
        adjustExecuteInterval: function () {
            if (!(a.length < 1)) {
                var d = this.schedulerExt.getExecuteInterval(a[0].getContext());
                b !== d && (b = d, null !== c && (this.debug.log("Changing execute interval: " + b), clearInterval(c), c = setInterval(r.bind(this), b)))
            }
        },
        startScheduling: q,
        stopScheduling: u,
        setTriggerForVideoTime: h,
        setTriggerForWallTime: o,
        removeTriggerForVideoTime: k,
        removeTriggerForWallTime: p
    }
}, MediaPlayer.dependencies.RequestScheduler.prototype = {constructor: MediaPlayer.dependencies.RequestScheduler}, MediaPlayer.dependencies.ScheduleController = function () {
    "use strict";
    var a, b, c, d, e, f = 0, g = !0, h = null, i = !1, j = null, k = null, l = !0, m = function (a, b) {
        var c = 0, d = null;
        l === !1 && (d = k.start, c = a.getTime() - d.getTime(), k.duration = c, k.stopreason = b, l = !0)
    }, n = function () {
        if (b) {
            i = !1;
            var c = new Date;
            m(c, MediaPlayer.vo.metrics.PlayList.Trace.USER_REQUEST_STOP_REASON), j = this.metricsModel.addPlayList(a, c, 0, MediaPlayer.vo.metrics.PlayList.INITIAL_PLAY_START_REASON), g && (g = !1), this.debug.log("ScheduleController " + a + " start."), v.call(this)
        }
    }, o = function () {
        g && r.call(this, e.index), n.call(this)
    }, p = function (b) {
        i || (i = !0, this.debug.log("ScheduleController " + a + " stop."), b && this.fragmentController.cancelPendingRequestsForModel(c), m(new Date, MediaPlayer.vo.metrics.PlayList.Trace.USER_REQUEST_STOP_REASON))
    }, q = function (b) {
        var c = this, d = c.scheduleRulesCollection.getRules(MediaPlayer.rules.ScheduleRulesCollection.prototype.NEXT_SEGMENT_RULES);
        c.rulesController.applyRules(d, a, b, null, function (a, b) {
            return b
        })
    }, r = function (a) {
        var b, c = this;
        return b = c.indexHandler.getInitRequest(c.representationController.getRepresentationForQuality(a)), null !== b && c.fragmentController.prepareFragmentForLoading(c, b), b
    }, s = function (b) {
        var c = this, d = c.scheduleRulesCollection.getRules(MediaPlayer.rules.ScheduleRulesCollection.prototype.SEGMENTS_TO_SCHEDULE_RULES);
        c.rulesController.applyRules(d, a, b, f, function (a, b) {
            return Math.min(a, b)
        })
    }, t = function (b) {
        var c = this;
        return f = b.value, 0 >= f ? void c.fragmentController.executePendingRequests() : (c.abrController.getPlaybackQuality(a, c.streamProcessor.getData()), void q.call(c, u.bind(c)))
    }, u = function (a) {
        var b = a.value;
        null === b || b instanceof MediaPlayer.vo.SegmentRequest || (b = this.indexHandler.getSegmentRequestForTime(e, b.startTime)), b && (f--, this.fragmentController.prepareFragmentForLoading(this, b))
    }, v = function () {
        var a = (new Date).getTime(), b = h ? a - h > this.fragmentController.getLoadingTime(this) : !0;
        !b || i || this.playbackController.isPaused() && (!this.scheduleWhilePaused || d) || (h = a, s.call(this, t.bind(this)))
    }, w = function () {
        var b = this;
        null !== a && "" !== a && b.metricsModel.clearCurrentMetricsForType(a)
    }, x = function (a, c, f) {
        var g, h = this;
        g = h.indexHandler.getCurrentTime(e || f), e = f, J.call(h), d || (b = !0), b && o.call(h, g)
    }, y = function (b, c) {
        c === this.streamProcessor.getFragmentModel() && (this.debug.log(a + " Stream is complete."), m(new Date, MediaPlayer.vo.metrics.PlayList.Trace.END_OF_CONTENT_STOP_REASON))
    }, z = function (a, b) {
        var c = this;
        b === c.streamProcessor.getFragmentModel() && v.call(c)
    }, A = function () {
        p.call(this)
    }, B = function () {
        K.call(this)
    }, C = function () {
        p.call(this, !1)
    }, D = function (a, b) {
        r.call(this, b)
    }, E = function (a, b, d, e) {
        this.fragmentController.removeExecutedRequestsBeforeTime(c, d), e && n.call(this)
    }, F = function (b, c) {
        var d = this;
        c || d.playbackController.isSeeking() || (d.debug.log("Stalling " + a + " Buffer: " + a), m(new Date, MediaPlayer.vo.metrics.PlayList.Trace.REBUFFERING_REASON))
    }, G = function (b, c) {
        var d = this;
        d.metricsModel.addBufferLevel(a, new Date, c), v.call(this)
    }, H = function () {
        p.call(this, !1)
    }, I = function (b, c, d, f) {
        if (a === c) {
            var g = this;
            if (e = g.representationController.getRepresentationForQuality(f), null === e || void 0 === e)throw"Unexpected error!";
            m(new Date, MediaPlayer.vo.metrics.PlayList.Trace.REPRESENTATION_SWITCH_STOP_REASON), J.call(g)
        }
    }, J = function () {
        var b = new Date, c = this.playbackController.getTime();
        this.metricsModel.addRepresentationSwitch(a, b, c, e.id)
    }, K = function () {
        var a = this, b = a.playbackController.getTime(), c = a.playbackController.getPlaybackRate(), d = new Date;
        l === !0 && e && j && (l = !1, k = a.metricsModel.appendPlayListTrace(j, e.id, null, d, b, null, c, null))
    }, L = function (a, b) {
        var d = this, e = r.call(d, b);
        c.executeRequest(e)
    }, M = function () {
        n.call(this)
    }, N = function (b, d) {
        g || this.fragmentController.cancelPendingRequestsForModel(c);
        var e;
        this.debug.log("ScheduleController " + a + " seek: " + d), e = new Date, m(e, MediaPlayer.vo.metrics.PlayList.Trace.USER_REQUEST_STOP_REASON), j = this.metricsModel.addPlayList(a, e, d, MediaPlayer.vo.metrics.PlayList.SEEK_START_REASON), n.call(this)
    }, O = function () {
        K.call(this)
    }, P = function () {
        v.call(this)
    }, Q = function (a, c) {
        var d, f, g = this, h = Math.max(c - 2 * g.bufferController.getMinBufferTime(), e.segmentAvailabilityRange.start);
        d = g.indexHandler.getSegmentRequestForTime(e, h), f = d.startTime, e.adaptation.period.liveEdge = f + d.duration / 2, b = !0, o.call(g)
    };
    return {
        debug: void 0,
        system: void 0,
        metricsModel: void 0,
        bufferExt: void 0,
        scheduleWhilePaused: void 0,
        sourceBufferExt: void 0,
        abrController: void 0,
        scheduleRulesCollection: void 0,
        rulesController: void 0,
        eventList: void 0,
        notify: void 0,
        subscribe: void 0,
        unsubscribe: void 0,
        setup: function () {
            this.liveEdgeFound = Q, this.qualityChanged = I, this.dataUpdateStarted = C, this.dataUpdateCompleted = x, this.mediaSegmentLoadingStart = z, this.segmentLoadingFailed = A, this.streamCompleted = y, this.bufferCleared = E, this.bytesAppended = B, this.bufferLevelStateChanged = F, this.bufferLevelUpdated = G, this.initRequested = D, this.quotaExceeded = H, this.closedCaptioningRequested = L, this.playbackStarted = M, this.playbackSeeking = N, this.playbackRateChanged = O, this.wallclockTimeUpdated = P
        },
        initialize: function (b, e) {
            var f = this;
            a = b, f.streamProcessor = e, f.playbackController = e.playbackController, f.fragmentController = e.fragmentController, f.representationController = e.representationController, f.liveEdgeFinder = e.liveEdgeFinder, f.bufferController = e.bufferController, f.indexHandler = e.indexHandler, d = e.isDynamic(), c = this.fragmentController.getModel(this), f.scheduleRulesCollection.bufferLevelRule && f.scheduleRulesCollection.bufferLevelRule.setScheduleController(f), f.scheduleRulesCollection.pendingRequestsRule && f.scheduleRulesCollection.pendingRequestsRule.setScheduleController(f), f.scheduleRulesCollection.playbackTimeRule && f.scheduleRulesCollection.playbackTimeRule.setScheduleController(f)
        },
        getFragmentModel: function () {
            return c
        },
        reset: function () {
            var a = this;
            p.call(a, !0), a.bufferController.unsubscribe(a.bufferController.eventList.ENAME_BUFFER_LEVEL_OUTRUN, a.scheduleRulesCollection.bufferLevelRule), a.bufferController.unsubscribe(a.bufferController.eventList.ENAME_BUFFER_LEVEL_BALANCED, a.scheduleRulesCollection.bufferLevelRule), a.fragmentController.abortRequestsForModel(c), a.fragmentController.detachModel(c), w.call(a), f = 0
        },
        start: n,
        stop: p
    }
}, MediaPlayer.dependencies.ScheduleController.prototype = {constructor: MediaPlayer.dependencies.ScheduleController}, MediaPlayer.dependencies.SchedulerExtensions = function () {
    "use strict"
}, MediaPlayer.dependencies.SchedulerExtensions.prototype = {
    constructor: MediaPlayer.dependencies.SchedulerExtensions,
    getExecuteInterval: function (a) {
        var b = 1e3;
        return "undefined" != typeof a.getMinBufferTime && (b = 1e3 * a.getMinBufferTime() / 4, b = Math.max(b, 1e3)), b
    },
    attachScheduleListener: function (a, b) {
        a.addEventListener("timeupdate", b)
    },
    detachScheduleListener: function (a, b) {
        a.removeEventListener("timeupdate", b)
    },
    attachUpdateScheduleListener: function (a, b) {
        a.addEventListener("seeking", b)
    },
    detachUpdateScheduleListener: function (a, b) {
        a.removeEventListener("seeking", b)
    }
},MediaPlayer.dependencies.SchedulerModel = function () {
    "use strict";
    var a, b, c, d, e, f = !1;
    return {
        system: void 0, debug: void 0, schedulerExt: void 0, setContext: function (b) {
            a = b
        }, getContext: function () {
            return a
        }, setScheduledTask: function (a) {
            b = a
        }, executeScheduledTask: function () {
            b.call(a)
        }, setExecuteTime: function (a) {
            d = a
        }, getExecuteTime: function () {
            return d
        }, setExecuteId: function (a) {
            e = a
        }, getExecuteId: function () {
            return e
        }, setType: function (a) {
            c = a
        }, getType: function () {
            return c
        }, setIsScheduled: function (a) {
            f = a
        }, getIsScheduled: function () {
            return f
        }
    }
},MediaPlayer.dependencies.SchedulerModel.prototype = {constructor: MediaPlayer.dependencies.SchedulerModel},MediaPlayer.dependencies.SourceBufferExtensions = function () {
    "use strict";
    this.system = void 0, this.manifestExt = void 0
},MediaPlayer.dependencies.SourceBufferExtensions.prototype = {
    constructor: MediaPlayer.dependencies.SourceBufferExtensions,
    createSourceBuffer: function (a, b) {
        "use strict";
        var c = Q.defer(), d = this;
        try {
            c.resolve(a.addSourceBuffer(b))
        } catch (e) {
            d.manifestExt.getIsTextTrack(b) ? c.resolve(d.system.getObject("textSourceBuffer")) : c.reject(e.description)
        }
        return c.promise
    },
    removeSourceBuffer: function (a, b) {
        "use strict";
        var c = Q.defer();
        try {
            c.resolve(a.removeSourceBuffer(b))
        } catch (d) {
            b && "function" == typeof b.getTextTrackExtensions ? c.resolve() : c.reject(d.description)
        }
        return c.promise
    },
    getBufferRange: function (a, b, c) {
        "use strict";
        var d, e, f = null, g = 0, h = 0, i = null, j = null, k = 0, l = c || .15;
        try {
            f = a.buffered
        } catch (m) {
            return Q.when(null)
        }
        if (null !== f) {
            for (e = 0, d = f.length; d > e; e += 1)if (g = f.start(e), h = f.end(e), null === i) {
                if (k = Math.abs(g - b), b >= g && h > b) {
                    i = g, j = h;
                    continue
                }
                if (l >= k) {
                    i = g, j = h;
                    continue
                }
            } else {
                if (k = g - j, !(l >= k))break;
                j = h
            }
            if (null !== i)return Q.when({start: i, end: j})
        }
        return Q.when(null)
    },
    getAllRanges: function (a) {
        var b = null;
        try {
            return b = a.buffered, Q.when(b)
        } catch (c) {
            return Q.when(null)
        }
    },
    getBufferLength: function (a, b, c) {
        "use strict";
        var d = this, e = Q.defer();
        return d.getBufferRange(a, b, c).then(function (a) {
            e.resolve(null === a ? 0 : a.end - b)
        }), e.promise
    },
    waitForUpdateEnd: function (a) {
        "use strict";
        var b, c = Q.defer(), d = 50, e = function () {
            a.updating || (clearInterval(b), c.resolve(!0))
        }, f = function () {
            a.updating || (a.removeEventListener("updateend", f, !1), c.resolve(!0))
        };
        if ("function" == typeof a.addEventListener)try {
            a.addEventListener("updateend", f, !1)
        } catch (g) {
            b = setInterval(e, d)
        } else b = setInterval(e, d);
        return c.promise
    },
    append: function (a, b) {
        var c = Q.defer();
        try {
            "append"in a ? a.append(b) : "appendBuffer"in a && a.appendBuffer(b), this.waitForUpdateEnd(a).then(function () {
                c.resolve()
            })
        } catch (d) {
            c.reject({err: d, data: b})
        }
        return c.promise
    },
    remove: function (a, b, c, d, e) {
        var f = Q.defer();
        try {
            b >= 0 && d > b && c > b && "ended" !== e.readyState && a.remove(b, c), this.waitForUpdateEnd(a).then(function () {
                f.resolve()
            })
        } catch (g) {
            f.reject(g)
        }
        return f.promise
    },
    abort: function (a, b) {
        "use strict";
        var c = Q.defer();
        try {
            "open" === a.readyState && b.abort(), c.resolve()
        } catch (d) {
            c.reject(d.description)
        }
        return c.promise
    }
},MediaPlayer.dependencies.Stream = function () {
    "use strict";
    var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q = null, r = null, s = null, t = null, u = -1, v = null, w = -1, x = null, y = -1, z = !0, A = !1, B = !1, C = null, D = [], E = null, F = null, G = function () {
        A && this.videoModel.play()
    }, H = function () {
        this.videoModel.pause()
    }, I = function (a) {
        A && (this.debug.log("Do seek: " + a), this.system.notify("setCurrentTime"), this.videoModel.setCurrentTime(a), bb(a))
    }, J = function (a) {
        var b, c = this;
        if (b = "msneedkey" !== a.type ? a.type : q, D.push({
                type: b,
                initData: a.initData
            }), this.debug.log("DRM: Key required for - " + b), s && q && !C)try {
            C = c.protectionController.selectKeySystem(q, s)
        } catch (d) {
            H.call(c), c.debug.log(d), c.errHandler.mediaKeySystemSelectionError(d)
        }
        C && c.protectionController.ensureKeySession(C, b, a.initData)
    }, K = function (a) {
        var b = this, c = null, d = null, e = null, f = null;
        this.debug.log("DRM: Got a key message..."), c = a.target, d = new Uint16Array(a.message.buffer), e = String.fromCharCode.apply(null, d), f = a.destinationURL, b.protectionController.updateFromMessage(C, c, e, f).fail(function (a) {
            H.call(b), b.debug.log(a), b.errHandler.mediaKeyMessageError(a)
        })
    }, L = function () {
        this.debug.log("DRM: Key added.")
    }, M = function () {
        var a, b = event.target;
        switch (a = "DRM: MediaKeyError - sessionId: " + b.sessionId + " errorCode: " + b.error.code + " systemErrorCode: " + b.error.systemCode + " [", b.error.code) {
            case 1:
                a += "MEDIA_KEYERR_UNKNOWN - An unspecified error occurred. This value is used for errors that don't match any of the other codes.";
                break;
            case 2:
                a += "MEDIA_KEYERR_CLIENT - The Key System could not be installed or updated.";
                break;
            case 3:
                a += "MEDIA_KEYERR_SERVICE - The message passed into update indicated an error from the license service.";
                break;
            case 4:
                a += "MEDIA_KEYERR_OUTPUT - There is no available output device with the required characteristics for the content protection system.";
                break;
            case 5:
                a += "MEDIA_KEYERR_HARDWARECHANGE - A hardware configuration change caused a content protection error.";
                break;
            case 6:
                a += "MEDIA_KEYERR_DOMAIN - An error occurred in a multi-device domain licensing configuration. The most common error is a failure to join the domain."
        }
        a += "]", this.debug.log(a), this.errHandler.mediaKeySessionError(a)
    }, N = function (a) {
        var b = Q.defer(), c = this, d = function (e) {
            c.debug.log("MediaSource is open!"), c.debug.log(e), a.removeEventListener("sourceopen", d), a.removeEventListener("webkitsourceopen", d), b.resolve(a)
        };
        return a.addEventListener("sourceopen", d, !1), a.addEventListener("webkitsourceopen", d, !1), c.mediaSourceExt.attachMediaSource(a, c.videoModel), b.promise
    }, O = function () {
        var c = this;
        t && t.reset(B), v && v.reset(B), x && x.reset(B), F && F.reset(), b && c.mediaSourceExt.detachMediaSource(c.videoModel), A = !1, C = null, D = [], s = null, t = null, v = null, x = null, q = null, r = null, b = null, a = null
    }, P = function (b, c, d, e) {
        if (b && c && d)if (null === t && null === v && null === x) {
            var f = "No streams to play.";
            this.errHandler.manifestError(f, "nostreams", a), this.debug.log(f), e.reject()
        } else e.resolve(!0)
    }, R = function () {
        var c = Q.defer(), d = !1, e = !1, f = !1, g = this;
        return F = g.system.getObject("eventController"), F.initialize(g.videoModel), g.manifestExt.getDuration(a, E).then(function () {
            g.manifestExt.getVideoData(a, E.index).then(function (h) {
                return null !== h ? (g.manifestExt.getDataIndex(h, a, E.index).then(function (a) {
                    u = a
                }), g.manifestExt.getCodec(h).then(function (c) {
                    return g.debug.log("Video codec: " + c), q = c, g.manifestExt.getContentProtectionData(h).then(function (d) {
                        if (d && !g.capabilities.supportsMediaKeys())return g.errHandler.capabilityError("mediakeys"), Q.when(null);
                        if (s = d, !g.capabilities.supportsCodec(g.videoModel.getElement(), c)) {
                            var e = "Video Codec (" + c + ") is not supported.";
                            return g.errHandler.manifestError(e, "codec", a), g.debug.log(e), Q.when(null)
                        }
                        return g.sourceBufferExt.createSourceBuffer(b, c)
                    })
                }).then(function (a) {
                    null === a ? g.debug.log("No buffer was created, skipping video stream.") : (t = g.system.getObject("bufferController"), t.initialize("video", E, h, a, g.videoModel, g.requestScheduler, g.fragmentController, b, F)), d = !0, P.call(g, d, e, f, c)
                }, function () {
                    g.errHandler.mediaSourceError("Error creating video source buffer."), d = !0, P.call(g, d, e, f, c)
                })) : (g.debug.log("No video data."), d = !0, P.call(g, d, e, f, c)), g.manifestExt.getAudioDatas(a, E.index)
            }).then(function (h) {
                return null !== h && h.length > 0 ? g.manifestExt.getPrimaryAudioData(a, E.index).then(function (h) {
                    g.manifestExt.getDataIndex(h, a, E.index).then(function (a) {
                        w = a
                    }), g.manifestExt.getCodec(h).then(function (c) {
                        return g.debug.log("Audio codec: " + c), r = c, g.manifestExt.getContentProtectionData(h).then(function (d) {
                            if (d && !g.capabilities.supportsMediaKeys())return g.errHandler.capabilityError("mediakeys"), Q.when(null);
                            if (s = d, !g.capabilities.supportsCodec(g.videoModel.getElement(), c)) {
                                var e = "Audio Codec (" + c + ") is not supported.";
                                return g.errHandler.manifestError(e, "codec", a), g.debug.log(e), Q.when(null)
                            }
                            return g.sourceBufferExt.createSourceBuffer(b, c)
                        })
                    }).then(function (a) {
                        null === a ? g.debug.log("No buffer was created, skipping audio stream.") : (v = g.system.getObject("bufferController"), v.initialize("audio", E, h, a, g.videoModel, g.requestScheduler, g.fragmentController, b, F)), e = !0, P.call(g, d, e, f, c)
                    }, function () {
                        g.errHandler.mediaSourceError("Error creating audio source buffer."), e = !0, P.call(g, d, e, f, c)
                    })
                }) : (g.debug.log("No audio streams."), e = !0, P.call(g, d, e, f, c)), g.manifestExt.getTextData(a, E.index)
            }).then(function (h) {
                var i;
                return null !== h ? (g.manifestExt.getDataIndex(h, a, E.index).then(function (a) {
                    y = a
                }), g.manifestExt.getMimeType(h).then(function (a) {
                    return i = a, g.sourceBufferExt.createSourceBuffer(b, i)
                }).then(function (a) {
                    null === a ? g.debug.log("Source buffer was not created for text track") : (x = g.system.getObject("textController"), x.initialize(E, h, a, g.videoModel, b), a.hasOwnProperty("initialize") && a.initialize(i, x), f = !0, P.call(g, d, e, f, c))
                }, function (a) {
                    g.debug.log("Error creating text source buffer:"), g.debug.log(a), g.errHandler.mediaSourceError("Error creating text source buffer."), f = !0, P.call(g, d, e, f, c)
                })) : (g.debug.log("No text tracks."), f = !0, P.call(g, d, e, f, c)), g.manifestExt.getEventsForPeriod(a, E)
            }).then(function (a) {
                F.addInlineEvents(a)
            })
        }), c.promise
    }, S = function () {
        var a = this, c = Q.defer();
        return a.manifestExt.getDuration(a.manifestModel.getValue(), E).then(function (c) {
            return a.mediaSourceExt.setDuration(b, c)
        }).then(function (b) {
            a.debug.log("Duration successfully set to: " + b), A = !0, c.resolve(!0)
        }), c.promise
    }, T = function () {
        this.debug.log("Got loadmetadata event.");
        var a = this.timelineConverter.calcPresentationStartTime(E);
        this.debug.log("Starting playback at offset: " + a), this.videoModel.setCurrentTime(a), c.resolve(null)
    }, U = function () {
        eb.call(this)
    }, V = function () {
        db.call(this)
    }, W = function (a) {
        var b = a.srcElement.error, c = b.code, d = "";
        if (-1 !== c) {
            switch (c) {
                case 1:
                    d = "MEDIA_ERR_ABORTED";
                    break;
                case 2:
                    d = "MEDIA_ERR_NETWORK";
                    break;
                case 3:
                    d = "MEDIA_ERR_DECODE";
                    break;
                case 4:
                    d = "MEDIA_ERR_SRC_NOT_SUPPORTED";
                    break;
                case 5:
                    d = "MEDIA_ERR_ENCRYPTED"
            }
            B = !0, this.debug.log("Video Element Error: " + d), this.debug.log(b), this.errHandler.mediaSourceError(d), this.reset()
        }
    }, X = function () {
        var a = this.videoModel.getCurrentTime();
        bb(a)
    }, Y = function () {
        this.videoModel.listen("seeking", h), this.videoModel.unlisten("seeked", i)
    }, Z = function () {
        ab.call(this)
    }, $ = function () {
        ab.call(this)
    }, _ = function () {
        t && t.updateStalledState(), v && v.updateStalledState()
    }, ab = function () {
        t && t.updateBufferState(), v && v.updateBufferState()
    }, bb = function (a) {
        t && (void 0 === a ? t.start() : t.seek(a)), v && (void 0 === a ? v.start() : v.seek(a))
    }, cb = function () {
        t && t.stop(), v && v.stop()
    }, db = function () {
        (!this.scheduleWhilePaused || this.manifestExt.getIsDynamic(a)) && cb.call(this)
    }, eb = function () {
        if (!this.videoModel.isPaused()) {
            var b = this.videoModel.getCurrentTime(), c = t ? t.getCurrentRepresentation() : v.getCurrentRepresentation(), d = this.timelineConverter.calcActualPresentationTime(c, b, this.manifestExt.getIsDynamic(a)), e = !isNaN(d) && d !== b;
            e ? (this.videoModel.setCurrentTime(d), bb(d)) : bb()
        }
    }, fb = function (d) {
        var e = this;
        return a = d, e.mediaSourceExt.createMediaSource().then(function (a) {
            return N.call(e, a)
        }).then(function (a) {
            return b = a, R.call(e)
        }).then(function () {
            return S.call(e)
        }).then(function () {
            return c.promise
        }).then(function () {
            e.debug.log("element loaded!"), 0 === E.index && (F.start(), z && G.call(e))
        })
    }, gb = function () {
        this.debug.log("Current time has changed, block programmatic seek."), this.videoModel.unlisten("seeking", h), this.videoModel.listen("seeked", i)
    }, hb = function () {
        t && !t.isBufferingCompleted() || v && !v.isBufferingCompleted() || b && this.mediaSourceExt.signalEndOfStream(b)
    }, ib = function () {
        cb.call(this)
    }, jb = function (b) {
        var c, d, e, f, g, h, i = this, j = Q.defer(), k = Q.defer(), l = Q.defer(), m = Q.defer(), n = Q.defer();
        return a = i.manifestModel.getValue(), E = b, i.debug.log("Manifest updated... set new data on buffers."), t ? (c = t.getData(), f = c && c.hasOwnProperty("id") ? i.manifestExt.getDataForId(c.id, a, E.index) : i.manifestExt.getDataForIndex(u, a, E.index), f.then(function (a) {
            t.updateData(a, E).then(function () {
                k.resolve()
            })
        })) : k.resolve(), v ? (d = v.getData(), g = d && d.hasOwnProperty("id") ? i.manifestExt.getDataForId(d.id, a, E.index) : i.manifestExt.getDataForIndex(w, a, E.index), g.then(function (a) {
            v.updateData(a, E).then(function () {
                l.resolve()
            })
        })) : l.resolve(), x && (e = x.getData(), h = e && e.hasOwnProperty("id") ? i.manifestExt.getDataForId(e.id, a, E.index) : i.manifestExt.getDataForIndex(y, a, E.index), h.then(function (a) {
            x.updateData(a, E).then(function () {
                m.resolve()
            })
        })), F && i.manifestExt.getEventsForPeriod(a, E).then(function (a) {
            F.addInlineEvents(a), n.resolve()
        }), Q.when(k.promise, l.promise, m.promise).then(function () {
            eb.call(i), j.resolve()
        }), j.promise
    };
    return {
        system: void 0,
        videoModel: void 0,
        manifestLoader: void 0,
        manifestModel: void 0,
        mediaSourceExt: void 0,
        sourceBufferExt: void 0,
        bufferExt: void 0,
        manifestExt: void 0,
        fragmentController: void 0,
        abrController: void 0,
        fragmentExt: void 0,
        protectionModel: void 0,
        protectionController: void 0,
        protectionExt: void 0,
        capabilities: void 0,
        debug: void 0,
        metricsExt: void 0,
        errHandler: void 0,
        timelineConverter: void 0,
        requestScheduler: void 0,
        scheduleWhilePaused: void 0,
        setup: function () {
            this.system.mapHandler("setCurrentTime", void 0, gb.bind(this)), this.system.mapHandler("bufferingCompleted", void 0, hb.bind(this)), this.system.mapHandler("segmentLoadingFailed", void 0, ib.bind(this)), c = Q.defer(), e = U.bind(this), f = V.bind(this), g = W.bind(this), h = X.bind(this), i = Y.bind(this), k = Z.bind(this), l = _.bind(this), j = $.bind(this), d = T.bind(this)
        },
        load: function (a, b) {
            E = b, fb.call(this, a)
        },
        setVideoModel: function (a) {
            this.videoModel = a, this.videoModel.listen("play", e), this.videoModel.listen("pause", f), this.videoModel.listen("error", g), this.videoModel.listen("seeking", h), this.videoModel.listen("timeupdate", j), this.videoModel.listen("progress", k), this.videoModel.listen("ratechange", l), this.videoModel.listen("loadedmetadata", d), this.requestScheduler.videoModel = a
        },
        initProtection: function () {
            m = J.bind(this), n = K.bind(this), o = L.bind(this), p = M.bind(this), this.protectionModel = this.system.getObject("protectionModel"), this.protectionModel.init(this.getVideoModel()), this.protectionController = this.system.getObject("protectionController"), this.protectionController.init(this.videoModel, this.protectionModel), this.protectionModel.listenToNeedKey(m), this.protectionModel.listenToKeyMessage(n), this.protectionModel.listenToKeyError(p), this.protectionModel.listenToKeyAdded(o)
        },
        getVideoModel: function () {
            return this.videoModel
        },
        getManifestExt: function () {
            var a = this;
            return a.manifestExt
        },
        setAutoPlay: function (a) {
            z = a
        },
        getAutoPlay: function () {
            return z
        },
        reset: function () {
            H.call(this), this.videoModel.unlisten("play", e), this.videoModel.unlisten("pause", f), this.videoModel.unlisten("error", g), this.videoModel.unlisten("seeking", h), this.videoModel.unlisten("timeupdate", j), this.videoModel.unlisten("progress", k), this.videoModel.unlisten("loadedmetadata", d), O.call(this), this.protectionController && this.protectionController.teardownKeySystem(C), this.protectionController = void 0, this.protectionModel = void 0, this.fragmentController = void 0, this.requestScheduler = void 0, c = Q.defer()
        },
        getDuration: function () {
            return E.duration
        },
        getStartTime: function () {
            return E.start
        },
        getPeriodIndex: function () {
            return E.index
        },
        getId: function () {
            return E.id
        },
        getPeriodInfo: function () {
            return E
        },
        startEventController: function () {
            F.start()
        },
        resetEventController: function () {
            F.reset()
        },
        updateData: jb,
        play: G,
        seek: I,
        pause: H
    }
},MediaPlayer.dependencies.Stream.prototype = {constructor: MediaPlayer.dependencies.Stream},MediaPlayer.dependencies.StreamController = function () {
    "use strict";
    var a, b, c, d, e, f, g = [], h = 6, i = .2, j = !0, k = !1, l = function () {
        a.play()
    }, m = function () {
        a.pause()
    }, n = function (b) {
        a.seek(b)
    }, o = function (a, b) {
        var c = a.getElement(), d = b.getElement();
        return d.parentNode || c.parentNode.insertBefore(d, c), c.style.width = "0px", d.style.width = "100%", r(c, d), q.call(this, a), p.call(this, b), Q.when(!0)
    }, p = function (a) {
        a.listen("seeking", c), a.listen("progress", d), a.listen("timeupdate", b), a.listen("pause", e), a.listen("play", f)
    }, q = function (a) {
        a.unlisten("seeking", c), a.unlisten("progress", d), a.unlisten("timeupdate", b), a.unlisten("pause", e), a.unlisten("play", f)
    }, r = function (a, b) {
        ["controls", "loop", "muted", "playbackRate", "volume"].forEach(function (c) {
            b[c] = a[c]
        })
    }, s = function () {
        var b = a.getVideoModel().getElement().buffered;
        if (b.length) {
            var c = b.length - 1, e = b.end(c), f = a.getStartTime() + a.getDuration() - e;
            h > f && (a.getVideoModel().unlisten("progress", d), x())
        }
    }, t = function () {
        var b = a.getStartTime() + a.getDuration(), c = a.getVideoModel().getCurrentTime(), d = this;
        d.metricsModel.addDroppedFrames("video", d.videoExt.getPlaybackQuality(a.getVideoModel().getElement())), y() && (a.getVideoModel().getElement().seeking || i > b - c && C.call(this, a, y()))
    }, u = function () {
        var b = a.getVideoModel().getCurrentTime(), c = z(b);
        c && c !== a && C.call(this, a, c, b)
    }, v = function () {
        this.manifestUpdater.stop()
    }, w = function () {
        this.manifestUpdater.start()
    }, x = function () {
        var a = y();
        a && a.seek(a.getStartTime())
    }, y = function () {
        var b = a.getPeriodIndex() + 1;
        return b < g.length ? g[b] : null
    }, z = function (a) {
        var b = 0, c = null, d = g.length;
        d > 0 && (b += g[0].getStartTime());
        for (var e = 0; d > e; e++)if (c = g[e], b += c.getDuration(), b > a)return c
    }, A = function () {
        var a = this.system.getObject("videoModel"), b = document.createElement("video");
        return a.setElement(b), a
    }, B = function (a) {
        a.parentNode && a.parentNode.removeChild(a)
    }, C = function (b, c, d) {
        !k && b && c && b !== c && (k = !0, b.pause(), a = c, o.call(this, b.getVideoModel(), c.getVideoModel()), n(d ? b.getVideoModel().getCurrentTime() : c.getStartTime()), l(), b.resetEventController(), a.startEventController(), k = !1)
    }, D = function () {
        var b, c, d, e, f, h, i, k = this, l = k.manifestModel.getValue(), m = k.metricsModel.getMetricsFor("stream"), n = k.metricsExt.getCurrentManifestUpdate(m), o = Q.defer(), q = [];
        return l ? (k.manifestExt.getMpd(l).then(function (m) {
            a && (b = a.getPeriodInfo(), m.isClientServerTimeSyncCompleted = b.mpd.isClientServerTimeSyncCompleted, m.clientServerTimeShift = b.mpd.clientServerTimeShift), k.manifestExt.getRegularPeriods(l, m).then(function (b) {
                if (0 === b.length)return o.reject("There are no regular periods");
                for (k.metricsModel.updateManifestUpdateInfo(n, {
                    currentTime: k.videoModel.getCurrentTime(),
                    buffered: k.videoModel.getElement().buffered,
                    presentationStartTime: b[0].start,
                    clientTimeOffset: m.clientServerTimeShift
                }), e = 0, c = b.length; c > e; e += 1) {
                    for (h = b[e], f = 0, d = g.length; d > f; f += 1)g[f].getId() === h.id && (i = g[f], q.push(i.updateData(h)));
                    i || (i = k.system.getObject("stream"), i.setVideoModel(0 === e ? k.videoModel : A.call(k)), i.initProtection(), i.setAutoPlay(j), i.load(l, h), g.push(i)), k.metricsModel.addManifestUpdatePeriodInfo(n, h.id, h.index, h.start, h.duration), i = null
                }
                a || (a = g[0], p.call(k, a.getVideoModel())), Q.all(q).then(function () {
                    o.resolve()
                })
            })
        }), o.promise) : Q.when(!1)
    }, E = function () {
        var a = this;
        D.call(a).then(function () {
            a.system.notify("streamsComposed")
        }, function (b) {
            a.errHandler.manifestError(b, "nostreamscomposed", a.manifestModel.getValue()), a.reset()
        })
    };
    return {
        system: void 0,
        videoModel: void 0,
        manifestLoader: void 0,
        manifestUpdater: void 0,
        manifestModel: void 0,
        mediaSourceExt: void 0,
        sourceBufferExt: void 0,
        bufferExt: void 0,
        manifestExt: void 0,
        fragmentController: void 0,
        abrController: void 0,
        fragmentExt: void 0,
        capabilities: void 0,
        debug: void 0,
        metricsModel: void 0,
        metricsExt: void 0,
        videoExt: void 0,
        errHandler: void 0,
        setup: function () {
            this.system.mapHandler("manifestUpdated", void 0, E.bind(this)), b = t.bind(this), d = s.bind(this), c = u.bind(this), e = v.bind(this), f = w.bind(this)
        },
        getManifestExt: function () {
            return a.getManifestExt()
        },
        setAutoPlay: function (a) {
            j = a
        },
        getAutoPlay: function () {
            return j
        },
        getVideoModel: function () {
            return this.videoModel
        },
        setVideoModel: function (a) {
            this.videoModel = a
        },
        load: function (a) {
            var b = this;
            b.manifestLoader.load(a).then(function (a) {
                b.manifestModel.setValue(a), b.debug.log("Manifest has loaded."), b.manifestUpdater.start()
            }, function () {
                b.reset()
            })
        },
        reset: function () {
            a && q.call(this, a.getVideoModel());
            for (var b = 0, c = g.length; c > b; b++) {
                var d = g[b];
                d.reset(), d !== a && B(d.getVideoModel().getElement())
            }
            g = [], this.manifestUpdater.stop(), this.manifestModel.setValue(null), this.metricsModel.clearAllCurrentMetrics(), k = !1, a = null
        },
        play: l,
        seek: n,
        pause: m
    }
},MediaPlayer.dependencies.StreamController.prototype = {constructor: MediaPlayer.dependencies.StreamController},MediaPlayer.dependencies.StreamProcessor = function () {
    "use strict";
    var a, b, c, d, e = function (a) {
        var b = this, c = "video" === a || "audio" === a ? "bufferController" : "textController";
        return b.system.getObject(c)
    };
    return {
        system: void 0,
        manifestModel: void 0,
        manifestExt: void 0,
        indexHandler: void 0,
        liveEdgeFinder: void 0,
        eventList: void 0,
        timelineConverter: void 0,
        abrController: void 0,
        baseURLExt: void 0,
        initialize: function (f, g, h, i, j, k, l, m, n, o) {
            var p, q = this, r = q.manifestModel.getValue(), s = q.system.getObject("representationController"), t = q.system.getObject("scheduleController"), u = q.liveEdgeFinder, v = q.abrController, w = q.indexHandler, x = q.baseURLExt, y = this.system.getObject("fragmentLoader"), z = e.call(q, f);
            b = n, c = f, d = o, a = q.manifestExt.getIsDynamic(r), w.setType(c), w.setIsDynamic(a), q.bufferController = z, q.playbackController = j, q.scheduleController = t, q.representationController = s, q.videoModel = h, q.fragmentController = i, q.fragmentLoader = y, s.subscribe(s.eventList.ENAME_DATA_UPDATE_COMPLETED, z), i.subscribe(i.eventList.ENAME_INIT_SEGMENT_LOADED, z), z.subscribe(z.eventList.ENAME_CLOSED_CAPTIONING_REQUESTED, t), ("video" === c || "audio" === c) && (v.subscribe(v.eventList.ENAME_QUALITY_CHANGED, z), v.subscribe(v.eventList.ENAME_QUALITY_CHANGED, s), v.subscribe(v.eventList.ENAME_QUALITY_CHANGED, t), u.subscribe(u.eventList.ENAME_LIVE_EDGE_FOUND, q.timelineConverter), u.subscribe(u.eventList.ENAME_LIVE_EDGE_FOUND, t), u.subscribe(u.eventList.ENAME_LIVE_EDGE_FOUND, s), u.subscribe(u.eventList.ENAME_LIVE_EDGE_FOUND, j), s.subscribe(s.eventList.ENAME_DATA_UPDATE_STARTED, t), s.subscribe(s.eventList.ENAME_DATA_UPDATE_COMPLETED, t), s.subscribe(s.eventList.ENAME_DATA_UPDATE_COMPLETED, v), s.subscribe(s.eventList.ENAME_DATA_UPDATE_COMPLETED, b), s.subscribe(s.eventList.ENAME_DATA_UPDATE_COMPLETED, j), i.subscribe(i.eventList.ENAME_MEDIA_SEGMENT_LOADED, z), i.subscribe(i.eventList.ENAME_MEDIA_SEGMENT_LOADING_START, t), i.subscribe(i.eventList.ENAME_STREAM_COMPLETED, t), i.subscribe(i.eventList.ENAME_STREAM_COMPLETED, z), i.subscribe(i.eventList.ENAME_STREAM_COMPLETED, t.scheduleRulesCollection.bufferLevelRule), z.subscribe(z.eventList.ENAME_BUFFER_LEVEL_STATE_CHANGED, h), z.subscribe(z.eventList.ENAME_BUFFER_CLEARED, t), z.subscribe(z.eventList.ENAME_BYTES_APPENDED, t), z.subscribe(z.eventList.ENAME_BUFFER_LEVEL_UPDATED, t), z.subscribe(z.eventList.ENAME_BUFFER_LEVEL_STATE_CHANGED, t), z.subscribe(z.eventList.ENAME_INIT_REQUESTED, t), z.subscribe(z.eventList.ENAME_BUFFERING_COMPLETED, b), z.subscribe(z.eventList.ENAME_QUOTA_EXCEEDED, t), z.subscribe(z.eventList.ENAME_BUFFER_LEVEL_OUTRUN, t.scheduleRulesCollection.bufferLevelRule), z.subscribe(z.eventList.ENAME_BUFFER_LEVEL_BALANCED, t.scheduleRulesCollection.bufferLevelRule), j.subscribe(j.eventList.ENAME_PLAYBACK_PROGRESS, z), j.subscribe(j.eventList.ENAME_PLAYBACK_TIME_UPDATED, z), j.subscribe(j.eventList.ENAME_PLAYBACK_RATE_CHANGED, z), j.subscribe(j.eventList.ENAME_PLAYBACK_RATE_CHANGED, t), j.subscribe(j.eventList.ENAME_PLAYBACK_SEEKING, z), j.subscribe(j.eventList.ENAME_PLAYBACK_SEEKING, t), j.subscribe(j.eventList.ENAME_PLAYBACK_STARTED, t), j.subscribe(j.eventList.ENAME_PLAYBACK_SEEKING, t.scheduleRulesCollection.playbackTimeRule), a && j.subscribe(j.eventList.ENAME_WALLCLOCK_TIME_UPDATED, s), j.subscribe(j.eventList.ENAME_WALLCLOCK_TIME_UPDATED, z), j.subscribe(j.eventList.ENAME_WALLCLOCK_TIME_UPDATED, t), w.subscribe(w.eventList.ENAME_REPRESENTATION_UPDATED, s), x.subscribe(x.eventList.ENAME_INITIALIZATION_LOADED, w), x.subscribe(x.eventList.ENAME_SEGMENTS_LOADED, w)), z.initialize(c, g, k, q), t.initialize(c, this), p = this.getFragmentModel(), p.setLoader(y), p.subscribe(p.eventList.ENAME_FRAGMENT_LOADING_STARTED, i), p.subscribe(p.eventList.ENAME_FRAGMENT_LOADING_COMPLETED, i), p.subscribe(p.eventList.ENAME_STREAM_COMPLETED, i), p.subscribe(p.eventList.ENAME_FRAGMENT_LOADING_FAILED, t), y.subscribe(y.eventList.ENAME_LOADING_COMPLETED, p), ("video" === c || "audio" === c) && (z.subscribe(z.eventList.ENAME_BUFFER_LEVEL_OUTRUN, p), z.subscribe(z.eventList.ENAME_BUFFER_LEVEL_BALANCED, p), z.subscribe(z.eventList.ENAME_BYTES_REJECTED, p)), s.initialize(this), s.updateData(l, m, c)
        },
        getData: function () {
            return this.representationController.getData()
        },
        getDataIndex: function () {
            return this.representationController.getDataIndex()
        },
        isUpdating: function () {
            return this.representationController.isUpdating()
        },
        getType: function () {
            return c
        },
        getFragmentModel: function () {
            return this.scheduleController.getFragmentModel()
        },
        getEventController: function () {
            return d
        },
        updateData: function (a, b) {
            return this.representationController.updateData(a, b, c)
        },
        start: function () {
            this.scheduleController.start()
        },
        stop: function () {
            this.scheduleController.stop()
        },
        getCurrentRepresentation: function () {
            return this.representationController.getCurrentRepresentation()
        },
        isBufferingCompleted: function () {
            return this.bufferController.isBufferingCompleted()
        },
        isDynamic: function () {
            return a
        },
        reset: function (a) {
            var c = this, d = c.bufferController, e = c.representationController, f = c.scheduleController, g = c.liveEdgeFinder, h = c.fragmentController, i = c.abrController, j = c.playbackController, k = this.indexHandler, l = this.baseURLExt, m = this.getFragmentModel(), n = this.fragmentLoader, o = c.videoModel;
            i.unsubscribe(i.eventList.ENAME_QUALITY_CHANGED, d), i.unsubscribe(i.eventList.ENAME_QUALITY_CHANGED, e), i.unsubscribe(i.eventList.ENAME_QUALITY_CHANGED, f), g.unsubscribe(g.eventList.ENAME_LIVE_EDGE_FOUND, c.timelineConverter), g.unsubscribe(g.eventList.ENAME_LIVE_EDGE_FOUND, f), g.unsubscribe(g.eventList.ENAME_LIVE_EDGE_FOUND, e), g.unsubscribe(g.eventList.ENAME_LIVE_EDGE_FOUND, j), e.unsubscribe(e.eventList.ENAME_DATA_UPDATE_STARTED, f), e.unsubscribe(e.eventList.ENAME_DATA_UPDATE_COMPLETED, d), e.unsubscribe(e.eventList.ENAME_DATA_UPDATE_COMPLETED, f), e.unsubscribe(e.eventList.ENAME_DATA_UPDATE_COMPLETED, i), e.unsubscribe(e.eventList.ENAME_DATA_UPDATE_COMPLETED, b), e.unsubscribe(e.eventList.ENAME_DATA_UPDATE_COMPLETED, j), h.unsubscribe(h.eventList.ENAME_INIT_SEGMENT_LOADED, d), h.unsubscribe(h.eventList.ENAME_MEDIA_SEGMENT_LOADED, d), h.unsubscribe(h.eventList.ENAME_MEDIA_SEGMENT_LOADING_START, f), h.unsubscribe(h.eventList.ENAME_STREAM_COMPLETED, f), h.unsubscribe(h.eventList.ENAME_STREAM_COMPLETED, d), h.unsubscribe(h.eventList.ENAME_STREAM_COMPLETED, f.scheduleRulesCollection.bufferLevelRule), d.unsubscribe(d.eventList.ENAME_BUFFER_LEVEL_STATE_CHANGED, o), d.unsubscribe(d.eventList.ENAME_BUFFER_CLEARED, f), d.unsubscribe(d.eventList.ENAME_BYTES_APPENDED, f), d.unsubscribe(d.eventList.ENAME_BYTES_REJECTED, f), d.unsubscribe(d.eventList.ENAME_BUFFER_LEVEL_UPDATED, f), d.unsubscribe(d.eventList.ENAME_BUFFER_LEVEL_STATE_CHANGED, f), d.unsubscribe(d.eventList.ENAME_INIT_REQUESTED, f), d.unsubscribe(d.eventList.ENAME_BUFFERING_COMPLETED, b), d.unsubscribe(d.eventList.ENAME_CLOSED_CAPTIONING_REQUESTED, f), d.unsubscribe(d.eventList.ENAME_BUFFER_LEVEL_OUTRUN, f.scheduleRulesCollection.bufferLevelRule), d.unsubscribe(d.eventList.ENAME_BUFFER_LEVEL_BALANCED, f.scheduleRulesCollection.bufferLevelRule), j.unsubscribe(j.eventList.ENAME_PLAYBACK_PROGRESS, d), j.unsubscribe(j.eventList.ENAME_PLAYBACK_TIME_UPDATED, d), j.unsubscribe(j.eventList.ENAME_PLAYBACK_RATE_CHANGED, d), j.unsubscribe(j.eventList.ENAME_PLAYBACK_RATE_CHANGED, f), j.unsubscribe(j.eventList.ENAME_PLAYBACK_SEEKING, d), j.unsubscribe(j.eventList.ENAME_PLAYBACK_SEEKING, f), j.unsubscribe(j.eventList.ENAME_PLAYBACK_STARTED, f), j.unsubscribe(j.eventList.ENAME_WALLCLOCK_TIME_UPDATED, e), j.unsubscribe(j.eventList.ENAME_WALLCLOCK_TIME_UPDATED, d), j.unsubscribe(j.eventList.ENAME_WALLCLOCK_TIME_UPDATED, f), j.unsubscribe(j.eventList.ENAME_PLAYBACK_SEEKING, f.scheduleRulesCollection.playbackTimeRule), k.unsubscribe(k.eventList.ENAME_REPRESENTATION_UPDATED, e), l.unsubscribe(l.eventList.ENAME_INITIALIZATION_LOADED, k), l.unsubscribe(l.eventList.ENAME_SEGMENTS_LOADED, k), d.unsubscribe(d.eventList.ENAME_BUFFER_LEVEL_OUTRUN, m), d.unsubscribe(d.eventList.ENAME_BUFFER_LEVEL_BALANCED, m), d.unsubscribe(d.eventList.ENAME_BYTES_REJECTED, m), m.unsubscribe(m.eventList.ENAME_FRAGMENT_LOADING_STARTED, h), m.unsubscribe(m.eventList.ENAME_FRAGMENT_LOADING_COMPLETED, h), m.unsubscribe(m.eventList.ENAME_STREAM_COMPLETED, h), m.unsubscribe(m.eventList.ENAME_FRAGMENT_LOADING_FAILED, f), n.unsubscribe(n.eventList.ENAME_LOADING_COMPLETED, m), h.resetModel(m), this.bufferController.reset(a), this.scheduleController.reset(), this.bufferController = null, this.scheduleController = null, this.representationController = null, this.videoModel = null, this.fragmentController = null
        }
    }
},MediaPlayer.dependencies.StreamProcessor.prototype = {constructor: MediaPlayer.dependencies.StreamProcessor},MediaPlayer.utils.TokenAuthentication = function () {
    "use strict";
    var a = {type: MediaPlayer.utils.TokenAuthentication.TYPE_QUERY};
    return {
        debug: void 0, getTokenAuthentication: function () {
            return a
        }, setTokenAuthentication: function (b) {
            a = b
        }, checkRequestHeaderForToken: function (b) {
            void 0 !== a.name && null !== b.getResponseHeader(a.name) && (a.token = b.getResponseHeader(a.name), this.debug.log(a.name + " received: " + a.token))
        }, addTokenAsQueryArg: function (b) {
            if (void 0 !== a.name && void 0 !== a.token && a.type === MediaPlayer.utils.TokenAuthentication.TYPE_QUERY) {
                var c = -1 === b.indexOf("?") ? "?" : "&";
                b += c + a.name + "=" + a.token, this.debug.log(a.name + " is being appended on the request url with a value of : " + a.token)
            }
            return b
        }, setTokenInRequestHeader: function (b) {
            return a.type === MediaPlayer.utils.TokenAuthentication.TYPE_HEADER && (b.setRequestHeader(a.name, a.token), this.debug.log(a.name + " is being set in the request header with a value of : " + a.token)), b
        }
    }
},MediaPlayer.utils.TokenAuthentication.TYPE_QUERY = "query",MediaPlayer.utils.TokenAuthentication.TYPE_HEADER = "header",MediaPlayer.models.URIQueryAndFragmentModel = function () {
    "use strict";
    var a = new MediaPlayer.vo.URIFragmentData, b = [], c = function (c) {
        function d(a, b, c, d) {
            var e = d[0].split(/[=]/);
            return d.push({key: e[0], value: e[1]}), d.shift(), d
        }

        function e(a, c, d) {
            return c > 0 && (j && 0 === b.length ? b = d[c].split(/[&]/) : k && (g = d[c].split(/[&]/))), d
        }

        var f, g = [], h = new RegExp(/[?]/), i = new RegExp(/[#]/), j = h.test(c), k = i.test(c);
        return f = c.split(/[?#]/).map(e), b.length > 0 && (b = b.reduce(d, null)), g.length > 0 && (g = g.reduce(d, null), g.forEach(function (b) {
            a[b.key] = b.value
        })), c
    };
    return {parseURI: c, getURIFragmentData: a, getURIQueryData: b}
},MediaPlayer.models.URIQueryAndFragmentModel.prototype = {constructor: MediaPlayer.models.URIQueryAndFragmentModel},MediaPlayer.models.VideoModel = function () {
    "use strict";
    var a, b = [], c = function () {
        return b.length > 0
    }, d = function (c) {
        null !== c && (a.playbackRate = 0, b[c] !== !0 && (b.push(c), b[c] = !0))
    }, e = function (d) {
        if (null !== d) {
            b[d] = !1;
            var e = b.indexOf(d);
            -1 !== e && b.splice(e, 1), c() === !1 && (a.playbackRate = 1)
        }
    }, f = function (a, b) {
        b ? d(a) : e(a)
    };
    return {
        system: void 0, setup: function () {
        }, play: function () {
            a.play()
        }, pause: function () {
            a.pause()
        }, isPaused: function () {
            return a.paused
        }, getPlaybackRate: function () {
            return a.playbackRate
        }, setPlaybackRate: function (b) {
            a.playbackRate = b
        }, getCurrentTime: function () {
            return a.currentTime
        }, setCurrentTime: function (b) {
            a.currentTime != b && (a.currentTime = b)
        }, listen: function (b, c) {
            a.addEventListener(b, c, !1)
        }, unlisten: function (b, c) {
            a.removeEventListener(b, c, !1)
        }, getElement: function () {
            return a
        }, setElement: function (b) {
            a = b
        }, setSource: function (b) {
            a.src = b
        }, isStalled: function () {
            return 0 === a.playbackRate
        }, stallStream: f
    }
},MediaPlayer.models.VideoModel.prototype = {constructor: MediaPlayer.models.VideoModel},MediaPlayer.dependencies.VideoModelExtensions = function () {
    "use strict";
    return {
        getPlaybackQuality: function (a) {
            var b = "webkitDroppedFrameCount"in a, c = "getVideoPlaybackQuality"in a, d = null;
            return c ? d = a.getVideoPlaybackQuality() : b && (d = {
                droppedVideoFrames: a.webkitDroppedFrameCount,
                creationTime: new Date
            }), d
        }
    }
},MediaPlayer.dependencies.VideoModelExtensions.prototype = {constructor: MediaPlayer.dependencies.VideoModelExtensions},MediaPlayer.utils.TTMLParser = function () {
    "use strict";
    var a, b = 3600, c = 60, d = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])((\.[0-9][0-9][0-9])|(:[0-9][0-9]))$/, e = function (e) {
        var f, g, h, i = d.test(e);
        if (!i)return 0 / 0;
        if (f = e.split(":"), g = parseFloat(f[0]) * b + parseFloat(f[1]) * c + parseFloat(f[2]), f[3]) {
            if (h = a.tt.frameRate, !h || isNaN(h))return 0 / 0;
            g += parseFloat(f[3]) / h
        }
        return g
    }, f = function () {
        var b = !1, c = a.hasOwnProperty("tt"), d = c ? a.tt.hasOwnProperty("head") : !1, e = d ? a.tt.head.hasOwnProperty("layout") : !1, f = d ? a.tt.head.hasOwnProperty("styling") : !1, g = c ? a.tt.hasOwnProperty("body") : !1, h = d ? a.tt.head.hasOwnProperty("profile") : !1;
        return c && d && e && f && g && (b = !0), b && (b = h && "http://www.w3.org/ns/ttml/profile/sdp-us" === a.tt.head.profile.use), b
    }, g = function (a, b) {
        var c = Object.keys(a).filter(function (c) {
            return "xmlns" === c.split(":")[0] && a[c] === b
        }).map(function (a) {
            return a.split(":")[1]
        });
        return 1 != c.length ? null : c[0]
    }, h = function (b) {
        var c, d, h, i, j, k, l, m = [], n = new X2JS([], "", !1);
        try {
            if (a = n.xml_str2json(b), !f())return c = "TTML document has incorrect structure", Q.reject(c);
            if (k = g(a.tt, "http://www.w3.org/ns/ttml#parameter"), a.tt.hasOwnProperty(k + ":frameRate") && (a.tt.frameRate = parseInt(a.tt[k + ":frameRate"], 10)), d = a.tt.body.div_asArray[0].p_asArray, !d || 0 === d.length)return c = "TTML document does not contain any cues", Q.reject(c);
            for (l = 0; l < d.length; l += 1) {
                if (h = d[l], i = e(h.begin), j = e(h.end), isNaN(i) || isNaN(j))return c = "TTML document has incorrect timing value", Q.reject(c);
                m.push({start: i, end: j, data: h.__text})
            }
            return Q.when(m)
        } catch (o) {
            return c = o.message, Q.reject(c)
        }
    };
    return {parse: h}
},MediaPlayer.dependencies.TextController = function () {
    var a, b, c, d, e = "LOADING", f = "READY", g = !1, h = null, i = f, j = function (a) {
        this.debug.log("TextController setState to:" + a), i = a
    }, k = function () {
        if (g && i === f) {
            var a = this;
            a.indexHandler.getInitRequest(d[0]).then(function (b) {
                a.fragmentLoader.load(b).then(n.bind(a, b), o.bind(a, b)), j.call(a, e)
            })
        }
    }, l = function () {
        k.call(this)
    }, m = function (a, b) {
        var c = this, d = Q.defer(), e = c.manifestModel.getValue();
        return c.manifestExt.getDataIndex(a, e, b.index).then(function (a) {
            c.manifestExt.getAdaptationsForPeriod(e, b).then(function (b) {
                c.manifestExt.getRepresentationsForAdaptation(e, b[a]).then(function (a) {
                    d.resolve(a)
                })
            })
        }), d.promise
    }, n = function (a, b) {
        var d = this;
        d.fragmentController.process(b.data).then(function (a) {
            null !== a && d.sourceBufferExt.append(c, a, d.videoModel)
        })
    }, o = function () {
    };
    return {
        videoModel: void 0,
        fragmentLoader: void 0,
        fragmentController: void 0,
        indexHandler: void 0,
        sourceBufferExt: void 0,
        manifestModel: void 0,
        manifestExt: void 0,
        debug: void 0,
        initialize: function (a, b, c, d, e) {
            var f = this;
            f.setVideoModel(d), f.setBuffer(c), f.setMediaSource(e), f.updateData(b, a).then(function () {
                g = !0, k.call(f)
            })
        },
        setPeriodInfo: function (a) {
            h = a
        },
        getPeriodIndex: function () {
            return h.index
        },
        getVideoModel: function () {
            return this.videoModel
        },
        setVideoModel: function (a) {
            this.videoModel = a
        },
        getData: function () {
            return b
        },
        setData: function (a) {
            b = a
        },
        getBuffer: function () {
            return c
        },
        setBuffer: function (a) {
            c = a
        },
        setMediaSource: function (b) {
            a = b
        },
        updateData: function (a, c) {
            var e = this, g = Q.defer();
            return b = a, h = c, m.call(e, b, h).then(function (a) {
                d = a, j.call(e, f), k.call(e), g.resolve()
            }), g.promise
        },
        reset: function (b) {
            b || (this.sourceBufferExt.abort(a, c), this.sourceBufferExt.removeSourceBuffer(a, c))
        },
        start: l
    }
},MediaPlayer.dependencies.TextController.prototype = {constructor: MediaPlayer.dependencies.TextController},MediaPlayer.dependencies.TextSourceBuffer = function () {
    var a, b, c;
    return {
        system: void 0, eventBus: void 0, errHandler: void 0, initialize: function (d, e) {
            c = d, a = e.getVideoModel().getElement(), b = e.getData()
        }, append: function (c) {
            var d = this, e = String.fromCharCode.apply(null, new Uint16Array(c));
            d.getParser().parse(e).then(function (c) {
                var e = b.Representation_asArray[0].id, f = b.lang;
                d.getTextTrackExtensions().addTextTrack(a, c, e, f, !0).then(function () {
                    d.eventBus.dispatchEvent({type: "updateend"})
                })
            }, function (a) {
                d.errHandler.closedCaptionsError(a, "parse", e)
            })
        }, abort: function () {
            this.getTextTrackExtensions().deleteCues(a)
        }, getParser: function () {
            var a;
            return "text/vtt" === c ? a = this.system.getObject("vttParser") : "application/ttml+xml" === c && (a = this.system.getObject("ttmlParser")), a
        }, getTextTrackExtensions: function () {
            return this.system.getObject("textTrackExtensions")
        }, addEventListener: function (a, b, c) {
            this.eventBus.addEventListener(a, b, c)
        }, removeEventListener: function (a, b, c) {
            this.eventBus.removeEventListener(a, b, c)
        }
    }
},MediaPlayer.dependencies.TextSourceBuffer.prototype = {constructor: MediaPlayer.dependencies.TextSourceBuffer},MediaPlayer.utils.TextTrackExtensions = function () {
    "use strict";
    var a;
    return {
        setup: function () {
            a = window.VTTCue || window.TextTrackCue
        }, addTextTrack: function (b, c, d, e, f) {
            var g = b.addTextTrack("captions", d, e);
            g.default = f, g.mode = "showing";
            for (var h in c) {
                var i = c[h];
                g.addCue(new a(i.start, i.end, i.data))
            }
            return Q.when(g)
        }, deleteCues: function (a) {
            for (var b = a.textTracks[0], c = b.cues, d = c.length - 1, e = d; e >= 0; e -= 1)b.removeCue(c[e]);
            b.mode = "disabled"
        }
    }
},MediaPlayer.utils.VTTParser = function () {
    "use strict";
    var a = function (a) {
        var b = a.split(":"), c = b.length - 1;
        return a = 60 * parseInt(b[c - 1], 10) + parseFloat(b[c], 10), 2 === c && (a += 3600 * parseInt(b[0], 10)), a
    };
    return {
        parse: function (b) {
            var c, d = /(?:\r\n|\r|\n)/gm, e = /-->/, f = /(^[\s]+|[\s]+$)/g, g = [];
            b = b.split(d), c = b.length;
            for (var h = 0; c > h; h++) {
                var i = b[h];
                if (i.length > 0 && "WEBVTT" !== i && i.match(e)) {
                    var j = i.split(e), k = b[h + 1];
                    g.push({start: a(j[0].replace(f, "")), end: a(j[1].replace(f, "")), data: k})
                }
            }
            return Q.when(g)
        }
    }
},MediaPlayer.rules.ABRRulesCollection = function () {
    "use strict";
    var a = [];
    return {
        downloadRatioRule: void 0,
        insufficientBufferRule: void 0,
        limitSwitchesRule: void 0,
        getRules: function (b) {
            switch (b) {
                case MediaPlayer.rules.ABRRulesCollection.prototype.QUALITY_SWITCH_RULES:
                    return a;
                default:
                    return null
            }
        },
        setup: function () {
            a.push(this.downloadRatioRule), a.push(this.insufficientBufferRule), a.push(this.limitSwitchesRule)
        }
    }
},MediaPlayer.rules.ABRRulesCollection.prototype = {
    constructor: MediaPlayer.rules.ABRRulesCollection,
    QUALITY_SWITCH_RULES: "qualitySwitchRules"
},MediaPlayer.rules.DownloadRatioRule = function () {
    "use strict";
    var a = {}, b = function (a, b, c) {
        var d, e, f = this;
        return e = f.manifestExt.getRepresentationFor(a, c), d = f.manifestExt.getBandwidth(e), d / b
    };
    return {
        debug: void 0, manifestExt: void 0, metricsExt: void 0, metricsModel: void 0, setData: function (b) {
            this.manifestExt.getIsAudio(b) && (a.audio = b), this.manifestExt.getIsVideo(b) && (a.video = b)
        }, execute: function (c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q, r, s = this, t = a[c], u = s.metricsModel.getReadOnlyMetricsFor(c), v = s.metricsExt.getCurrentHttpRequest(u), w = .75;
            if (!u)return void d(new MediaPlayer.rules.SwitchRequest);
            if (null === v)return void d(new MediaPlayer.rules.SwitchRequest);
            if (g = (v.tfinish.getTime() - v.trequest.getTime()) / 1e3, f = (v.tfinish.getTime() - v.tresponse.getTime()) / 1e3, 0 >= g)return void d(new MediaPlayer.rules.SwitchRequest);
            if (null === v.mediaduration || void 0 === v.mediaduration || v.mediaduration <= 0 || isNaN(v.mediaduration))return void d(new MediaPlayer.rules.SwitchRequest);
            if (i = v.mediaduration / g, h = v.mediaduration / f * w, isNaN(h) || isNaN(i))return s.debug.log("The ratios are NaN, bailing."), void d(new MediaPlayer.rules.SwitchRequest);
            if (isNaN(h))r = new MediaPlayer.rules.SwitchRequest; else if (4 > h)e > 0 ? (s.debug.log("We are not at the lowest bitrate, so switch down."), n = s.manifestExt.getRepresentationFor(e - 1, t), k = s.manifestExt.getBandwidth(n), o = s.manifestExt.getRepresentationFor(e, t), m = s.manifestExt.getBandwidth(o), j = k / m, j > h ? (s.debug.log("Things must be going pretty bad, switch all the way down."), r = new MediaPlayer.rules.SwitchRequest(0)) : (s.debug.log("Things could be better, so just switch down one index."), r = new MediaPlayer.rules.SwitchRequest(e - 1))) : r = new MediaPlayer.rules.SwitchRequest(e); else if (q = s.manifestExt.getRepresentationCount(t) - 1, q > e)if (n = s.manifestExt.getRepresentationFor(e + 1, t), l = s.manifestExt.getBandwidth(n), o = s.manifestExt.getRepresentationFor(e, t), m = s.manifestExt.getBandwidth(o), j = l / m, h >= j)if (h > 100)s.debug.log("Tons of bandwidth available, go all the way up."), r = new MediaPlayer.rules.SwitchRequest(q - 1); else if (h > 10)s.debug.log("Just enough bandwidth available, switch up one."), r = new MediaPlayer.rules.SwitchRequest(e + 1); else {
                for (p = -1; (p += 1) < q && !(h < b.call(s, p, m, t)););
                s.debug.log("Calculated ideal new quality index is: " + p), r = new MediaPlayer.rules.SwitchRequest(p)
            } else r = new MediaPlayer.rules.SwitchRequest; else r = new MediaPlayer.rules.SwitchRequest(q);
            d(r)
        }, reset: function () {
            a = {}
        }
    }
},MediaPlayer.rules.DownloadRatioRule.prototype = {constructor: MediaPlayer.rules.DownloadRatioRule},MediaPlayer.rules.InsufficientBufferRule = function () {
    "use strict";
    var a = 0, b = 3;
    return {
        debug: void 0, metricsModel: void 0, execute: function (c, d, e) {
            var f, g, h = this, i = h.metricsModel.getReadOnlyMetricsFor(c), j = !1, k = MediaPlayer.rules.SwitchRequest.prototype.DEFAULT;
            return null === i.PlayList || void 0 === i.PlayList || 0 === i.PlayList.length ? void d(new MediaPlayer.rules.SwitchRequest) : (f = i.PlayList[i.PlayList.length - 1], null === f || void 0 === f || 0 === f.trace.length ? void d(new MediaPlayer.rules.SwitchRequest) : (g = f.trace[f.trace.length - 2], null === g || void 0 === g || null === g.stopreason || void 0 === g.stopreason ? void d(new MediaPlayer.rules.SwitchRequest) : (g.stopreason === MediaPlayer.vo.metrics.PlayList.Trace.REBUFFERING_REASON && (j = !0, a += 1, h.debug.log("Number of times the buffer has run dry: " + a)), a > b && (k = MediaPlayer.rules.SwitchRequest.prototype.STRONG, h.debug.log("Apply STRONG to buffer rule.")), void(j ? (h.debug.log("The buffer ran dry recently, switch down."), d(new MediaPlayer.rules.SwitchRequest(e - 1, k))) : a > b ? (h.debug.log("Too many dry buffer hits, quit switching bitrates."), d(new MediaPlayer.rules.SwitchRequest(e, k))) : d(new MediaPlayer.rules.SwitchRequest(MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE, k))))))
        }
    }
},MediaPlayer.rules.InsufficientBufferRule.prototype = {constructor: MediaPlayer.rules.InsufficientBufferRule},MediaPlayer.rules.LimitSwitchesRule = function () {
    "use strict";
    var a = 0, b = 2e3;
    return {
        debug: void 0, manifestModel: void 0, metricsModel: void 0, execute: function (c, d, e) {
            var f, g, h = this, i = this.metricsModel.getReadOnlyMetricsFor(c), j = h.manifestModel.getValue(), k = Number.POSITIVE_INFINITY, l = i.RepSwitchList.length - 1, m = i.RepSwitchList[l], n = (new Date).getTime();
            return j && (f = j.minBufferTime, j.hasOwnProperty("maxSegmentDuration") && (k = j.maxSegmentDuration), b = 1e3 * Math.min(f, k)), g = n - a, b > g && n - m.t.getTime() < b ? (h.debug.log("Wait some time before allowing another switch."), void d(new MediaPlayer.rules.SwitchRequest(e, MediaPlayer.rules.SwitchRequest.prototype.STRONG))) : (a = n, void d(new MediaPlayer.rules.SwitchRequest(MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE, MediaPlayer.rules.SwitchRequest.prototype.STRONG)))
        }
    }
},MediaPlayer.rules.LimitSwitchesRule.prototype = {constructor: MediaPlayer.rules.LimitSwitchesRule},MediaPlayer.rules.BaseRulesCollection = function () {
    "use strict";
    var a = [];
    return {
        downloadRatioRule: void 0, insufficientBufferRule: void 0, getRules: function () {
            return Q.when(a)
        }, setup: function () {
            var a = this;
            a.getRules().then(function (b) {
                b.push(a.downloadRatioRule), b.push(a.insufficientBufferRule)
            })
        }
    }
},MediaPlayer.rules.BaseRulesCollection.prototype = {constructor: MediaPlayer.rules.BaseRulesCollection},MediaPlayer.rules.DownloadRatioRule = function () {
    "use strict";
    var a = function (a, b, c) {
        var d = this, e = Q.defer();
        return d.manifestExt.getRepresentationFor(a, c).then(function (a) {
            d.manifestExt.getBandwidth(a).then(function (a) {
                e.resolve(a / b)
            })
        }), e.promise
    };
    return {
        debug: void 0, manifestExt: void 0, metricsExt: void 0, checkIndex: function (b, c, d) {
            var e, f, g, h, i, j, k, l, m, n = this, o = n.metricsExt.getCurrentHttpRequest(c), p = .75;
            return c ? null === o ? Q.when(new MediaPlayer.rules.SwitchRequest) : (f = (o.tfinish.getTime() - o.trequest.getTime()) / 1e3, e = (o.tfinish.getTime() - o.tresponse.getTime()) / 1e3, 0 >= f ? Q.when(new MediaPlayer.rules.SwitchRequest) : null === o.mediaduration || void 0 === o.mediaduration || o.mediaduration <= 0 || isNaN(o.mediaduration) ? Q.when(new MediaPlayer.rules.SwitchRequest) : (j = Q.defer(), h = o.mediaduration / f, g = o.mediaduration / e * p, isNaN(g) || isNaN(h) ? (n.debug.log("The ratios are NaN, bailing."), Q.when(new MediaPlayer.rules.SwitchRequest)) : (isNaN(g) ? j.resolve(new MediaPlayer.rules.SwitchRequest) : 4 > g ? b > 0 ? (n.debug.log("We are not at the lowest bitrate, so switch down."), n.manifestExt.getRepresentationFor(b - 1, d).then(function (a) {
                n.manifestExt.getBandwidth(a).then(function (a) {
                    n.manifestExt.getRepresentationFor(b, d).then(function (c) {
                        n.manifestExt.getBandwidth(c).then(function (c) {
                            i = a / c, i > g ? (n.debug.log("Things must be going pretty bad, switch all the way down."), j.resolve(new MediaPlayer.rules.SwitchRequest(0))) : (n.debug.log("Things could be better, so just switch down one index."), j.resolve(new MediaPlayer.rules.SwitchRequest(b - 1)))
                        })
                    })
                })
            })) : j.resolve(new MediaPlayer.rules.SwitchRequest(b)) : n.manifestExt.getRepresentationCount(d).then(function (c) {
                c -= 1, c > b ? n.manifestExt.getRepresentationFor(b + 1, d).then(function (e) {
                    n.manifestExt.getBandwidth(e).then(function (e) {
                        n.manifestExt.getRepresentationFor(b, d).then(function (f) {
                            n.manifestExt.getBandwidth(f).then(function (f) {
                                if (i = e / f, g >= i)if (g > 100)n.debug.log("Tons of bandwidth available, go all the way up."), j.resolve(new MediaPlayer.rules.SwitchRequest(c - 1)); else if (g > 10)n.debug.log("Just enough bandwidth available, switch up one."), j.resolve(new MediaPlayer.rules.SwitchRequest(b + 1)); else {
                                    for (l = -1, k = []; (l += 1) < c;)k.push(a.call(n, l, f, d));
                                    Q.all(k).then(function (a) {
                                        for (l = 0, m = a.length; m > l && !(g < a[l]); l += 1);
                                        n.debug.log("Calculated ideal new quality index is: " + l), j.resolve(new MediaPlayer.rules.SwitchRequest(l))
                                    })
                                } else j.resolve(new MediaPlayer.rules.SwitchRequest)
                            })
                        })
                    })
                }) : j.resolve(new MediaPlayer.rules.SwitchRequest(c))
            }), j.promise))) : Q.when(new MediaPlayer.rules.SwitchRequest)
        }
    }
},MediaPlayer.rules.DownloadRatioRule.prototype = {constructor: MediaPlayer.rules.DownloadRatioRule},MediaPlayer.rules.InsufficientBufferRule = function () {
    "use strict";
    var a = 0, b = 3;
    return {
        debug: void 0, checkIndex: function (c, d) {
            var e, f, g = this, h = !1, i = MediaPlayer.rules.SwitchRequest.prototype.DEFAULT;
            return null === d.PlayList || void 0 === d.PlayList || 0 === d.PlayList.length ? Q.when(new MediaPlayer.rules.SwitchRequest) : (e = d.PlayList[d.PlayList.length - 1], null === e || void 0 === e || 0 === e.trace.length ? Q.when(new MediaPlayer.rules.SwitchRequest) : (f = e.trace[e.trace.length - 2], null === f || void 0 === f || null === f.stopreason || void 0 === f.stopreason ? Q.when(new MediaPlayer.rules.SwitchRequest) : (f.stopreason === MediaPlayer.vo.metrics.PlayList.Trace.REBUFFERING_REASON && (h = !0, a += 1, g.debug.log("Number of times the buffer has run dry: " + a)), a > b && (i = MediaPlayer.rules.SwitchRequest.prototype.STRONG, g.debug.log("Apply STRONG to buffer rule.")), h ? (g.debug.log("The buffer ran dry recently, switch down."), Q.when(new MediaPlayer.rules.SwitchRequest(c - 1, i))) : a > b ? (g.debug.log("Too many dry buffer hits, quit switching bitrates."), Q.when(new MediaPlayer.rules.SwitchRequest(c, i))) : Q.when(new MediaPlayer.rules.SwitchRequest(MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE, i)))))
        }
    }
},MediaPlayer.rules.InsufficientBufferRule.prototype = {constructor: MediaPlayer.rules.InsufficientBufferRule},MediaPlayer.rules.LimitSwitchesRule = function () {
    "use strict";
    var a = 10, b = 2e4, c = 5, d = 0;
    return {
        debug: void 0, checkIndex: function (e, f) {
            if (d > 0)return d -= 1, Q.when(new MediaPlayer.rules.SwitchRequest(e, MediaPlayer.rules.SwitchRequest.prototype.STRONG));
            var g, h, i, j = this, k = !1, l = (new Date).getTime(), m = f.RepSwitchList.length;
            for (i = m - 1; i >= 0; i -= 1) {
                if (g = f.RepSwitchList[i], h = l - g.t.getTime(), h >= b) {
                    j.debug.log("Reached time limit, bailing.");
                    break
                }
                if (i >= a) {
                    j.debug.log("Found too many switches within validation time, force the stream to not change."), k = !0;
                    break
                }
            }
            return k ? (j.debug.log("Wait some time before allowing another switch."), d = c, Q.when(new MediaPlayer.rules.SwitchRequest(e, MediaPlayer.rules.SwitchRequest.prototype.STRONG))) : Q.when(new MediaPlayer.rules.SwitchRequest(MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE, MediaPlayer.rules.SwitchRequest.prototype.STRONG))
        }
    }
},MediaPlayer.rules.LimitSwitchesRule.prototype = {constructor: MediaPlayer.rules.LimitSwitchesRule},MediaPlayer.rules.BufferLevelRule = function () {
    "use strict";
    var a = {}, b = {}, c = {}, d = function (a, c, d) {
        b[d.streamType] = !0
    }, e = function (b) {
        a[b.streamProcessor.getType()] = !0
    }, f = function (b) {
        a[b.streamProcessor.getType()] = !1
    };
    return {
        metricsExt: void 0, manifestExt: void 0, bufferExt: void 0, metricsModel: void 0, setup: function () {
            this.bufferLevelOutrun = e, this.bufferLevelBalanced = f, this.streamCompleted = d
        }, setScheduleController: function (a) {
            c[a.streamProcessor.getType()] = a
        }, execute: function (d, e) {
            if (a[d])return void e(new MediaPlayer.rules.SwitchRequest(0, MediaPlayer.rules.SwitchRequest.prototype.STRONG));
            var f, g = this.metricsModel.getReadOnlyMetricsFor(d), h = this.metricsExt.getCurrentBufferLevel(g) ? this.metricsExt.getCurrentBufferLevel(g).level : 0, i = c[d].streamProcessor.getCurrentRepresentation(), j = this.manifestExt.getIsDynamic(i.adaptation.period.mpd.manifest), k = this.metricsExt.getCurrentPlaybackRate(g), l = i.adaptation.period.duration, m = h / Math.max(k, 1), n = i.segments[0].duration, o = c[d].playbackController.getTime(), p = j ? Number.POSITIVE_INFINITY : l - o, q = Math.min(this.bufferExt.getRequiredBufferLength(j, l), p), r = Math.max(q - m, 0);
            f = Math.ceil(r / n), m >= p && !b[d] && (f = f || 1), e(new MediaPlayer.rules.SwitchRequest(f, MediaPlayer.rules.SwitchRequest.prototype.DEFAULT))
        }, reset: function () {
            a = {}, b = {}, c = {}
        }
    }
},MediaPlayer.rules.BufferLevelRule.prototype = {constructor: MediaPlayer.rules.BufferLevelRule},MediaPlayer.rules.LiveEdgeBinarySearchRule = function () {
    "use strict";
    var a, b, c = 43200, d = 0 / 0, e = null, f = 0 / 0, g = null, h = !1, i = 0 / 0, j = MediaPlayer.rules.SwitchRequest.prototype.DEFAULT, k = function (b, c, d, e) {
        var h, i = this;
        if (null === e)g.segments = null, g.segmentAvailabilityRange = {
            start: b - f,
            end: b + f
        }, h = a.indexHandler.getSegmentRequestForTime(g, b), k.call(i, b, c, d, h); else {
            var j = function (e, f, g) {
                a.fragmentLoader.unsubscribe(a.fragmentLoader.eventList.ENAME_CHECK_FOR_EXISTENCE_COMPLETED, i, j), f ? c.call(i, g, b) : d.call(i, g, b)
            };
            a.fragmentLoader.subscribe(a.fragmentLoader.eventList.ENAME_CHECK_FOR_EXISTENCE_COMPLETED, i, j), a.fragmentLoader.checkForExistence(e)
        }
    }, l = function (c, i) {
        var o, p, q;
        return h ? void n.call(this, !1, i) : (q = i - d, o = q > 0 ? d - q : d + Math.abs(q) + f, void(o < e.start && o > e.end ? b(new MediaPlayer.rules.SwitchRequest(null, j)) : (p = a.indexHandler.getSegmentRequestForTime(g, o), k.call(this, o, m, l, p))))
    }, m = function (c, l) {
        var m, o, p = c.startTime, q = this;
        if (!h) {
            if (!g.segmentDuration)return void b(new MediaPlayer.rules.SwitchRequest(p, j));
            if (h = !0, e.end = p + 2 * f, l === d)return o = l + i, m = a.indexHandler.getSegmentRequestForTime(g, o), void k.call(q, o, function () {
                n.call(q, !0, o)
            }, function () {
                b(new MediaPlayer.rules.SwitchRequest(o, j))
            }, m)
        }
        n.call(this, !0, l)
    }, n = function (c, d) {
        var f, h, n;
        c ? e.start = d : e.end = d, f = Math.floor(e.end - e.start) <= i, f ? b(new MediaPlayer.rules.SwitchRequest(c ? d : d - i, j)) : (n = (e.start + e.end) / 2, h = a.indexHandler.getSegmentRequestForTime(g, n), k.call(this, n, m, l, h))
    };
    return {
        metricsExt: void 0, manifestExt: void 0, setFinder: function (b) {
            a = b
        }, execute: function (h, j) {
            var n, o, p = this;
            b = j, g = a.streamProcessor.getCurrentRepresentation(), i = g.segmentDuration, o = g.segmentAvailabilityRange, d = o.end, e = {
                start: Math.max(0, d - c),
                end: d + c
            }, f = Math.floor((o.end - o.start) / 2), n = a.indexHandler.getSegmentRequestForTime(g, d), k.call(p, d, m, l, n)
        }, reset: function () {
            d = 0 / 0, e = null, f = 0 / 0, g = null, h = !1, i = 0 / 0, a = null
        }
    }
},MediaPlayer.rules.LiveEdgeBinarySearchRule.prototype = {constructor: MediaPlayer.rules.LiveEdgeBinarySearchRule},MediaPlayer.rules.PendingRequestsRule = function () {
    "use strict";
    var a = 3, b = {};
    return {
        metricsExt: void 0, manifestExt: void 0, bufferExt: void 0, setScheduleController: function (a) {
            b[a.streamProcessor.getType()] = a
        }, execute: function (c, d, e) {
            var f = b[c], g = f.fragmentController.getPendingRequests(f), h = f.fragmentController.getLoadingRequests(f), i = g.length + h.length, j = Math.max(e - i, 0);
            return i > a ? void d(new MediaPlayer.rules.SwitchRequest(0, MediaPlayer.rules.SwitchRequest.prototype.DEFAULT)) : 0 === e ? void d(new MediaPlayer.rules.SwitchRequest(j, MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE)) : void d(new MediaPlayer.rules.SwitchRequest(j, MediaPlayer.rules.SwitchRequest.prototype.DEFAULT))
        }, reset: function () {
            b = {}
        }
    }
},MediaPlayer.rules.PendingRequestsRule.prototype = {constructor: MediaPlayer.rules.PendingRequestsRule},MediaPlayer.rules.PlaybackTimeRule = function () {
    "use strict";
    var a = {}, b = {}, c = function (b, c) {
        a.audio = c, a.video = c
    };
    return {
        setup: function () {
            this.playbackSeeking = c
        }, setScheduleController: function (a) {
            b[a.streamProcessor.getType()] = a
        }, execute: function (c, d) {
            var e, f, g, h = b[c], i = h.streamProcessor.getCurrentRepresentation(), j = a[c], k = j ? MediaPlayer.rules.SwitchRequest.prototype.STRONG : MediaPlayer.rules.SwitchRequest.prototype.DEFAULT, l = h.getFragmentModel().getRejectedRequests().shift(), m = !!l && !j, n = h.indexHandler.getCurrentTime(i), o = h.playbackController.getTime(), p = l ? l.startTime + l.duration : null, q = l && (p > o && l.startTime <= n || isNaN(n));
            if (f = j || (q ? l.startTime : n), isNaN(f))return void d(new MediaPlayer.rules.SwitchRequest(null, k));
            for (a[c] = null, e = h.sourceBufferExt.getBufferRange(h.bufferController.getBuffer(), f), null !== e && (f = e.end), g = h.indexHandler.getSegmentRequestForTime(i, f, m); g && h.fragmentController.isFragmentLoadedOrPending(h, g);) {
                if ("complete" === g.action) {
                    g = null, h.indexHandler.setCurrentTime(0 / 0);
                    break
                }
                g = h.indexHandler.getNextSegmentRequest(i)
            }
            g && !q && h.indexHandler.setCurrentTime(g.startTime + g.duration), d(new MediaPlayer.rules.SwitchRequest(g, k))
        }, reset: function () {
            a = {}, b = {}
        }
    }
},MediaPlayer.rules.PlaybackTimeRule.prototype = {constructor: MediaPlayer.rules.PlaybackTimeRule},MediaPlayer.rules.RulesController = function () {
    "use strict";
    var a = {}, b = ["execute"], c = function (a) {
        return a === this.SCHEDULING_RULE || a === this.ABR_RULE
    }, d = function (a) {
        var c = b.length, d = 0;
        for (d; c > d; d += 1)if (!a.hasOwnProperty(b[d]))return !1;
        return !0
    }, e = function (a) {
        var b = a.execute.bind(a);
        return a.execute = function (c, d, e) {
            var f = function (b) {
                d.call(a, new MediaPlayer.rules.SwitchRequest(b.value, b.priority))
            };
            b(c, f, e)
        }, "function" != typeof a.reset && (a.reset = function () {
        }), a
    }, f = function (a, b, c) {
        var f, g, h, i, j, k;
        for (g in b)if (i = b[g], j = i.length)for (k = 0; j > k; k += 1)f = i[k], d.call(this, f) && (f = e.call(this, f), h = a.getRules(g), c && (h.length = 0), h.push(f))
    };
    return {
        system: void 0, debug: void 0, SCHEDULING_RULE: 0, ABR_RULE: 1, initialize: function () {
            a[this.ABR_RULE] = this.system.getObject("abrRulesCollection"), a[this.SCHEDULING_RULE] = this.system.getObject("scheduleRulesCollection")
        }, setRules: function (b, d) {
            c.call(this, b) && d && f.call(this, a[b], d, !0)
        }, addRules: function (b, d) {
            c.call(this, b) && d && f.call(this, a[b], d, !1)
        }, applyRules: function (a, b, c, e, f) {
            var g, h, i = a.length, j = i, k = {}, l = function (a) {
                var b, d;
                a.value !== MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE && (k[a.priority] = f(k[a.priority], a.value)), --i || (k[MediaPlayer.rules.SwitchRequest.prototype.WEAK] !== MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE && (d = MediaPlayer.rules.SwitchRequest.prototype.WEAK, b = k[MediaPlayer.rules.SwitchRequest.prototype.WEAK]), k[MediaPlayer.rules.SwitchRequest.prototype.DEFAULT] !== MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE && (d = MediaPlayer.rules.SwitchRequest.prototype.DEFAULT, b = k[MediaPlayer.rules.SwitchRequest.prototype.DEFAULT]), k[MediaPlayer.rules.SwitchRequest.prototype.STRONG] !== MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE && (d = MediaPlayer.rules.SwitchRequest.prototype.STRONG, b = k[MediaPlayer.rules.SwitchRequest.prototype.STRONG]), d != MediaPlayer.rules.SwitchRequest.prototype.STRONG && d != MediaPlayer.rules.SwitchRequest.prototype.WEAK && (d = MediaPlayer.rules.SwitchRequest.prototype.DEFAULT), c({
                    value: b || e,
                    confidence: d
                }))
            };
            for (k[MediaPlayer.rules.SwitchRequest.prototype.STRONG] = MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE, k[MediaPlayer.rules.SwitchRequest.prototype.WEAK] = MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE, k[MediaPlayer.rules.SwitchRequest.prototype.DEFAULT] = MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE, h = 0; j > h; h += 1)g = a[h], d.call(this, g) ? g.execute(b, l, e) : i--
        }, reset: function () {
            a = {}
        }
    }
},MediaPlayer.rules.RulesController.prototype = {constructor: MediaPlayer.rules.RulesController},MediaPlayer.rules.SameTimeRequestRule = function () {
    "use strict";
    var a = 4, b = function (a, b) {
        var c, e, f, g, h, i = 0, j = a.length;
        for (i; j > i; i += 1)for (f = a[i].getPendingRequests(), d.call(this, f, "index"), g = 0, h = f.length; h > g; g++) {
            if (c = f[g], isNaN(c.startTime) && "complete" !== c.action) {
                e = c;
                break
            }
            c.startTime > b && (!e || c.startTime < e.startTime) && (e = c)
        }
        return e || c
    }, c = function (a, b) {
        var c, d, e = a.length, f = null;
        for (d = 0; e > d; d += 1)c = a[d].getPendingRequestForTime(b), c && (!f || c.startTime > f.startTime) && (f = c);
        return f
    }, d = function (a, b) {
        var c = function (a, c) {
            return a[b] < c[b] || isNaN(a[b]) && "complete" !== a.action ? -1 : a[b] > c[b] ? 1 : 0
        };
        a.sort(c)
    };
    return {
        setFragmentModels: function (a) {
            this.fragmentModels = a
        }, execute: function (d, e, f) {
            var g, h, i, j, k, l, m, n, o, p = MediaPlayer.rules.SwitchRequest.prototype.DEFAULT, q = this.fragmentModels, r = new Date, s = null, t = q ? q.length : null, u = !1, v = [];
            if (!q || !t)return void e(new MediaPlayer.rules.SwitchRequest([], p));
            if (l = Math.round(100 * q[0].getContext().playbackController.getTime()) / 100, m = c(q, l), k = m || b(q, l) || f, !k)return void e(new MediaPlayer.rules.SwitchRequest([], p));
            for (j = 0; t > j; j += 1)if (h = q[j], g = h.getContext().streamProcessor.getType(), ("video" === g || "audio" === g) && (n = h.getPendingRequests(), o = h.getLoadingRequests().length, !h.getIsPostponed() || isNaN(k.startTime))) {
                if (o > a)return void e(new MediaPlayer.rules.SwitchRequest([], p));
                if (s = s || (k === m ? l : k.startTime), -1 === n.indexOf(k)) {
                    if (i = h.getPendingRequestForTime(s))v.push(i); else if (i = h.getLoadingRequestForTime(s) || h.getExecutedRequestForTime(s), !i) {
                        u = !0;
                        break
                    }
                } else v.push(k)
            }
            return v = v.filter(function (a) {
                return "complete" === a.action || r.getTime() >= a.availabilityStartTime.getTime()
            }), u ? void e(new MediaPlayer.rules.SwitchRequest([], p)) : void e(new MediaPlayer.rules.SwitchRequest(v, p))
        }
    }
},MediaPlayer.rules.SameTimeRequestRule.prototype = {constructor: MediaPlayer.rules.SameTimeRequestRule},MediaPlayer.rules.ScheduleRulesCollection = function () {
    "use strict";
    var a = [], b = [], c = [], d = [];
    return {
        bufferLevelRule: void 0,
        pendingRequestsRule: void 0,
        playbackTimeRule: void 0,
        sameTimeRequestRule: void 0,
        liveEdgeBinarySearchRule: void 0,
        getRules: function (e) {
            switch (e) {
                case MediaPlayer.rules.ScheduleRulesCollection.prototype.SEGMENTS_TO_SCHEDULE_RULES:
                    return a;
                case MediaPlayer.rules.ScheduleRulesCollection.prototype.NEXT_SEGMENT_RULES:
                    return d;
                case MediaPlayer.rules.ScheduleRulesCollection.prototype.SEGMENTS_TO_EXECUTE_RULES:
                    return b;
                case MediaPlayer.rules.ScheduleRulesCollection.prototype.LIVE_EDGE_RULES:
                    return c;
                default:
                    return null
            }
        },
        setup: function () {
            a.push(this.bufferLevelRule), a.push(this.pendingRequestsRule), d.push(this.playbackTimeRule), b.push(this.sameTimeRequestRule), c.push(this.liveEdgeBinarySearchRule)
        }
    }
},MediaPlayer.rules.ScheduleRulesCollection.prototype = {
    constructor: MediaPlayer.rules.ScheduleRulesCollection,
    SEGMENTS_TO_SCHEDULE_RULES: "segmentsToScheduleRules",
    NEXT_SEGMENT_RULES: "nextSegmentRules",
    SEGMENTS_TO_EXECUTE_RULES: "segmentsToExecuteRules",
    LIVE_EDGE_RULES: "liveEdgeRules"
},MediaPlayer.rules.SwitchRequest = function (a, b) {
    "use strict";
    this.quality = a, this.priority = b, void 0 === this.quality && (this.quality = 999), void 0 === this.priority && (this.priority = .5)
},MediaPlayer.rules.SwitchRequest.prototype = {
    constructor: MediaPlayer.rules.SwitchRequest,
    NO_CHANGE: 999,
    DEFAULT: .5,
    STRONG: 1,
    WEAK: 0
},MediaPlayer.models.MetricsList = function () {
    "use strict";
    return {
        TcpList: [],
        HttpList: [],
        RepSwitchList: [],
        BufferLevel: [],
        PlayList: [],
        DroppedFrames: [],
        DVRInfo: [],
        ManifestUpdate: []
    }
},MediaPlayer.models.MetricsList.prototype = {constructor: MediaPlayer.models.MetricsList},MediaPlayer.vo.SegmentRequest = function () {
    "use strict";
    this.action = "download", this.startTime = 0 / 0, this.streamType = null, this.type = null, this.duration = 0 / 0, this.timescale = 0 / 0, this.range = null, this.url = null, this.requestStartDate = null, this.firstByteDate = null, this.requestEndDate = null, this.deferred = null, this.quality = 0 / 0, this.index = 0 / 0, this.availabilityStartTime = null, this.availabilityEndTime = null, this.wallStartTime = null
},MediaPlayer.vo.SegmentRequest.prototype = {
    constructor: MediaPlayer.vo.SegmentRequest,
    ACTION_DOWNLOAD: "download",
    ACTION_COMPLETE: "complete"
},MediaPlayer.vo.URIFragmentData = function () {
    "use strict";
    this.t = null, this.xywh = null, this.track = null, this.id = null, this.s = null
},MediaPlayer.vo.URIFragmentData.prototype = {constructor: MediaPlayer.vo.URIFragmentData},MediaPlayer.vo.metrics.BufferLevel = function () {
    "use strict";
    this.t = null, this.level = null
},MediaPlayer.vo.metrics.BufferLevel.prototype = {constructor: MediaPlayer.vo.metrics.BufferLevel},MediaPlayer.vo.metrics.DVRInfo = function () {
    "use strict";
    this.time = null, this.range = null, this.mpd = null
},MediaPlayer.vo.metrics.DVRInfo.prototype = {constructor: MediaPlayer.vo.metrics.DVRInfo},MediaPlayer.vo.metrics.DroppedFrames = function () {
    "use strict";
    this.time = null, this.droppedFrames = null
},MediaPlayer.vo.metrics.DroppedFrames.prototype = {constructor: MediaPlayer.vo.metrics.DroppedFrames},MediaPlayer.vo.metrics.HTTPRequest = function () {
    "use strict";
    this.stream = null, this.tcpid = null, this.type = null, this.url = null, this.actualurl = null, this.range = null, this.trequest = null, this.tresponse = null, this.tfinish = null, this.responsecode = null, this.interval = null, this.mediaduration = null, this.trace = []
},MediaPlayer.vo.metrics.HTTPRequest.prototype = {constructor: MediaPlayer.vo.metrics.HTTPRequest},MediaPlayer.vo.metrics.HTTPRequest.Trace = function () {
    "use strict";
    this.s = null, this.d = null, this.b = []
},MediaPlayer.vo.metrics.HTTPRequest.Trace.prototype = {constructor: MediaPlayer.vo.metrics.HTTPRequest.Trace},MediaPlayer.vo.metrics.ManifestUpdate = function () {
    "use strict";
    this.streamType = null, this.type = null, this.requestTime = null, this.fetchTime = null, this.availabilityStartTime = null, this.presentationStartTime = 0, this.clientTimeOffset = 0, this.currentTime = null, this.buffered = null, this.latency = 0, this.periodInfo = [], this.representationInfo = []
},MediaPlayer.vo.metrics.ManifestUpdate.PeriodInfo = function () {
    "use strict";
    this.id = null, this.index = null, this.start = null, this.duration = null
},MediaPlayer.vo.metrics.ManifestUpdate.RepresentationInfo = function () {
    "use strict";
    this.id = null, this.index = null, this.streamType = null, this.periodIndex = null, this.presentationTimeOffset = null, this.startNumber = null, this.segmentInfoType = null
},MediaPlayer.vo.metrics.ManifestUpdate.prototype = {constructor: MediaPlayer.vo.metrics.ManifestUpdate},MediaPlayer.vo.metrics.ManifestUpdate.PeriodInfo.prototype = {constructor: MediaPlayer.vo.metrics.ManifestUpdate.PeriodInfo},MediaPlayer.vo.metrics.ManifestUpdate.RepresentationInfo.prototype = {constructor: MediaPlayer.vo.metrics.ManifestUpdate.RepresentationInfo},MediaPlayer.vo.metrics.PlayList = function () {
    "use strict";
    this.stream = null, this.start = null, this.mstart = null, this.starttype = null, this.trace = []
},MediaPlayer.vo.metrics.PlayList.Trace = function () {
    "use strict";
    this.representationid = null, this.subreplevel = null, this.start = null, this.mstart = null, this.duration = null, this.playbackspeed = null, this.stopreason = null
},MediaPlayer.vo.metrics.PlayList.prototype = {constructor: MediaPlayer.vo.metrics.PlayList},MediaPlayer.vo.metrics.PlayList.INITIAL_PLAY_START_REASON = "initial_start",MediaPlayer.vo.metrics.PlayList.SEEK_START_REASON = "seek",MediaPlayer.vo.metrics.PlayList.Trace.prototype = {constructor: MediaPlayer.vo.metrics.PlayList.Trace()},MediaPlayer.vo.metrics.PlayList.Trace.USER_REQUEST_STOP_REASON = "user_request",MediaPlayer.vo.metrics.PlayList.Trace.REPRESENTATION_SWITCH_STOP_REASON = "representation_switch",MediaPlayer.vo.metrics.PlayList.Trace.END_OF_CONTENT_STOP_REASON = "end_of_content",MediaPlayer.vo.metrics.PlayList.Trace.REBUFFERING_REASON = "rebuffering",MediaPlayer.vo.metrics.RepresentationSwitch = function () {
    "use strict";
    this.t = null, this.mt = null, this.to = null, this.lto = null
},MediaPlayer.vo.metrics.RepresentationSwitch.prototype = {constructor: MediaPlayer.vo.metrics.RepresentationSwitch},MediaPlayer.vo.metrics.SchedulingInfo = function () {
    "use strict";
    this.streamType = null, this.t = null, this.type = null, this.startTime = null, this.availabilityStartTime = null, this.duration = null, this.quality = null, this.range = null, this.state = null
},MediaPlayer.vo.metrics.SchedulingInfo.prototype = {constructor: MediaPlayer.vo.metrics.SchedulingInfo},MediaPlayer.vo.metrics.SchedulingInfo.PENDING_STATE = "pending",MediaPlayer.vo.metrics.SchedulingInfo.LOADING_STATE = "loading",MediaPlayer.vo.metrics.SchedulingInfo.EXECUTED_STATE = "executed",MediaPlayer.vo.metrics.SchedulingInfo.REJECTED_STATE = "rejected",MediaPlayer.vo.metrics.SchedulingInfo.CANCELED_STATE = "canceled",MediaPlayer.vo.metrics.SchedulingInfo.FAILED_STATE = "failed",MediaPlayer.vo.metrics.TCPConnection = function () {
    "use strict";
    this.tcpid = null, this.dest = null, this.topen = null, this.tclose = null, this.tconnect = null
},MediaPlayer.vo.metrics.TCPConnection.prototype = {constructor: MediaPlayer.vo.metrics.TCPConnection};