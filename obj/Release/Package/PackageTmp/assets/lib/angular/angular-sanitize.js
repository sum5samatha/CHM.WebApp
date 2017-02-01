﻿/*
 AngularJS v1.5.0
 (c) 2010-2016 Google, Inc. http://angularjs.org
 License: MIT
*/
(function (A, e, B) {
    'use strict'; function C(a) { var c = []; v(c, e.noop).chars(a); return c.join("") } function h(a, c) { var b = {}, d = a.split(","), l; for (l = 0; l < d.length; l++) b[c ? e.lowercase(d[l]) : d[l]] = !0; return b } function D(a, c) {
        null === a || a === B ? a = "" : "string" !== typeof a && (a = "" + a); g.innerHTML = a; var b = 5; do { if (0 === b) throw w("uinput"); b--; 11 >= document.documentMode && n(g); a = g.innerHTML; g.innerHTML = a } while (a !== g.innerHTML); for (b = g.firstChild; b;) {
            switch (b.nodeType) {
                case 1: c.start(b.nodeName.toLowerCase(), E(b.attributes));
                    break; case 3: c.chars(b.textContent)
            } var d; if (!(d = b.firstChild) && (1 == b.nodeType && c.end(b.nodeName.toLowerCase()), d = b.nextSibling, !d)) for (; null == d;) { b = b.parentNode; if (b === g) break; d = b.nextSibling; 1 == b.nodeType && c.end(b.nodeName.toLowerCase()) } b = d
        } for (; b = g.firstChild;) g.removeChild(b)
    } function E(a) { for (var c = {}, b = 0, d = a.length; b < d; b++) { var l = a[b]; c[l.name] = l.value } return c } function x(a) {
        return a.replace(/&/g, "&amp;").replace(F, function (a) {
            var b = a.charCodeAt(0); a = a.charCodeAt(1); return "&#" + (1024 * (b - 55296) +
            (a - 56320) + 65536) + ";"
        }).replace(G, function (a) { return "&#" + a.charCodeAt(0) + ";" }).replace(/</g, "&lt;").replace(/>/g, "&gt;")
    } function v(a, c) {
        var b = !1, d = e.bind(a, a.push); return {
            start: function (a, f) { a = e.lowercase(a); !b && H[a] && (b = a); b || !0 !== t[a] || (d("<"), d(a), e.forEach(f, function (b, f) { var g = e.lowercase(f), h = "img" === a && "src" === g || "background" === g; !0 !== I[g] || !0 === y[g] && !c(b, h) || (d(" "), d(f), d('="'), d(x(b)), d('"')) }), d(">")) }, end: function (a) {
                a = e.lowercase(a); b || !0 !== t[a] || !0 === z[a] || (d("</"), d(a), d(">")); a ==
                b && (b = !1)
            }, chars: function (a) { b || d(x(a)) }
        }
    } function n(a) { if (a.nodeType === Node.ELEMENT_NODE) for (var c = a.attributes, b = 0, d = c.length; b < d; b++) { var e = c[b], f = e.name.toLowerCase(); if ("xmlns:ns1" === f || 0 === f.indexOf("ns1:")) a.removeAttributeNode(e), b--, d-- } (c = a.firstChild) && n(c); (c = a.nextSibling) && n(c) } var w = e.$$minErr("$sanitize"), F = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g, G = /([^\#-~ |!])/g, z = h("area,br,col,hr,img,wbr"), q = h("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"), k = h("rp,rt"), u = e.extend({}, k, q), q = e.extend({},
    q, h("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,section,table,ul")), k = e.extend({}, k, h("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")), J = h("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,stop,svg,switch,text,title,tspan"),
    H = h("script,style"), t = e.extend({}, z, q, k, u), y = h("background,cite,href,longdesc,src,xlink:href"), u = h("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,tabindex,target,title,type,valign,value,vspace,width"), k = h("accent-height,accumulate,additive,alphabetic,arabic-form,ascent,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan",
    !0), I = e.extend({}, y, k, u), g; (function (a) { if (a.document && a.document.implementation) a = a.document.implementation.createHTMLDocument("inert"); else throw w("noinert"); var c = (a.documentElement || a.getDocumentElement()).getElementsByTagName("body"); 1 === c.length ? g = c[0] : (c = a.createElement("html"), g = a.createElement("body"), c.appendChild(g), a.appendChild(c)) })(A); e.module("ngSanitize", []).provider("$sanitize", function () {
        var a = !1; this.$get = ["$$sanitizeUri", function (c) {
            a && e.extend(t, J); return function (a) {
                var d =
                []; D(a, v(d, function (a, b) { return !/^unsafe:/.test(c(a, b)) })); return d.join("")
            }
        }]; this.enableSvg = function (c) { return e.isDefined(c) ? (a = c, this) : a }
    }); e.module("ngSanitize").filter("linky", ["$sanitize", function (a) {
        var c = /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i, b = /^mailto:/i, d = e.$$minErr("linky"), g = e.isString; return function (f, h, m) {
            function k(a) { a && p.push(C(a)) } function q(a, b) {
                var c; p.push("<a "); e.isFunction(m) && (m = m(a)); if (e.isObject(m)) for (c in m) p.push(c +
                '="' + m[c] + '" '); else m = {}; !e.isDefined(h) || "target" in m || p.push('target="', h, '" '); p.push('href="', a.replace(/"/g, "&quot;"), '">'); k(b); p.push("</a>")
            } if (null == f || "" === f) return f; if (!g(f)) throw d("notstring", f); for (var r = f, p = [], s, n; f = r.match(c) ;) s = f[0], f[2] || f[4] || (s = (f[3] ? "http://" : "mailto:") + s), n = f.index, k(r.substr(0, n)), q(s, f[0].replace(b, "")), r = r.substring(n + f[0].length); k(r); return a(p.join(""))
        }
    }])
})(window, window.angular);
//# sourceMappingURL=angular-sanitize.min.js.map