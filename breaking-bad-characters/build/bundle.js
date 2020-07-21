var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function r(t){t.forEach(e)}function o(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(t,e){t.appendChild(e)}function i(t,e,n){t.insertBefore(e,n||null)}function a(t){t.parentNode.removeChild(t)}function l(t){return document.createElement(t)}function u(t){return document.createTextNode(t)}function f(){return u(" ")}function d(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function m(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function g(t,e){e=""+e,t.data!==e&&(t.data=e)}function h(t,e){t.value=null==e?"":e}let p;function $(t){p=t}function v(){if(!p)throw new Error("Function called outside component initialization");return p}function y(){const t=v();return(e,n)=>{const r=t.$$.callbacks[e];if(r){const o=function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(e,n);r.slice().forEach(e=>{e.call(t,o)})}}}const x=[],b=[],w=[],k=[],_=Promise.resolve();let j=!1;function E(t){w.push(t)}let C=!1;const M=new Set;function S(){if(!C){C=!0;do{for(let t=0;t<x.length;t+=1){const e=x[t];$(e),A(e.$$)}for(x.length=0;b.length;)b.pop()();for(let t=0;t<w.length;t+=1){const e=w[t];M.has(e)||(M.add(e),e())}w.length=0}while(x.length);for(;k.length;)k.pop()();j=!1,C=!1,M.clear()}}function A(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const L=new Set;let N;function T(){N={r:0,c:[],p:N}}function z(){N.r||r(N.c),N=N.p}function B(t,e){t&&t.i&&(L.delete(t),t.i(e))}function H(t,e,n,r){if(t&&t.o){if(L.has(t))return;L.add(t),N.c.push(()=>{L.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}function O(t,e){H(t,1,1,()=>{e.delete(t.key)})}function q(t){t&&t.c()}function F(t,n,c){const{fragment:s,on_mount:i,on_destroy:a,after_update:l}=t.$$;s&&s.m(n,c),E(()=>{const n=i.map(e).filter(o);a?a.push(...n):r(n),t.$$.on_mount=[]}),l.forEach(E)}function P(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function D(t,e){-1===t.$$.dirty[0]&&(x.push(t),j||(j=!0,_.then(S)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function G(e,o,c,s,i,l,u=[-1]){const f=p;$(e);const d=o.props||{},m=e.$$={fragment:null,ctx:null,props:l,update:t,not_equal:i,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:[]),callbacks:n(),dirty:u};let g=!1;if(m.ctx=c?c(e,d,(t,n,...r)=>{const o=r.length?r[0]:n;return m.ctx&&i(m.ctx[t],m.ctx[t]=o)&&(m.bound[t]&&m.bound[t](o),g&&D(e,t)),n}):[],m.update(),g=!0,r(m.before_update),m.fragment=!!s&&s(m.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);m.fragment&&m.fragment.l(t),t.forEach(a)}else m.fragment&&m.fragment.c();o.intro&&B(e.$$.fragment),F(e,o.target,o.anchor),S()}$(f)}class I{$destroy(){P(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}function J(e){let n;return{c(){n=l("header"),n.innerHTML='<img src="./images/logo.png" alt="" class="svelte-hhghi3">',m(n,"class","center svelte-hhghi3")},m(t,e){i(t,n,e)},p:t,i:t,o:t,d(t){t&&a(n)}}}class K extends I{constructor(t){super(),G(this,t,null,J,c,{})}}function Q(e){let n,r,o,c,d,h,p,$,v,y,x,b,w,k,_,j,E,C,M,S,A,L,N,T,z,B,H,O,q,F,P=e[0].name+"",D=e[0].portrayed+"",G=e[0].nickname+"",I=e[0].birthday+"",J=e[0].status+"";return{c(){n=l("div"),r=l("div"),o=l("div"),c=l("img"),h=f(),p=l("div"),$=l("h1"),v=u(P),y=f(),x=l("ul"),b=l("li"),w=l("strong"),w.textContent="Actor Name:",k=f(),_=u(D),j=f(),E=l("li"),C=l("strong"),C.textContent="Nickname:",M=f(),S=u(G),A=f(),L=l("li"),N=l("strong"),N.textContent="Birthday:",T=f(),z=u(I),B=f(),H=l("li"),O=l("strong"),O.textContent="Status:",q=f(),F=u(J),c.src!==(d=e[0].img)&&m(c,"src",d),m(c,"alt",""),m(c,"class","svelte-rrjvei"),m(o,"class","card-front svelte-rrjvei"),m($,"class","svelte-rrjvei"),m(b,"class","svelte-rrjvei"),m(E,"class","svelte-rrjvei"),m(L,"class","svelte-rrjvei"),m(H,"class","svelte-rrjvei"),m(p,"class","card-back svelte-rrjvei"),m(r,"class","card-inner svelte-rrjvei"),m(n,"class","card svelte-rrjvei")},m(t,e){i(t,n,e),s(n,r),s(r,o),s(o,c),s(r,h),s(r,p),s(p,$),s($,v),s(p,y),s(p,x),s(x,b),s(b,w),s(b,k),s(b,_),s(x,j),s(x,E),s(E,C),s(E,M),s(E,S),s(x,A),s(x,L),s(L,N),s(L,T),s(L,z),s(x,B),s(x,H),s(H,O),s(H,q),s(H,F)},p(t,[e]){1&e&&c.src!==(d=t[0].img)&&m(c,"src",d),1&e&&P!==(P=t[0].name+"")&&g(v,P),1&e&&D!==(D=t[0].portrayed+"")&&g(_,D),1&e&&G!==(G=t[0].nickname+"")&&g(S,G),1&e&&I!==(I=t[0].birthday+"")&&g(z,I),1&e&&J!==(J=t[0].status+"")&&g(F,J)},i:t,o:t,d(t){t&&a(n)}}}function R(t,e,n){let{item:r={}}=e;return t.$set=t=>{"item"in t&&n(0,r=t.item)},[r]}class U extends I{constructor(t){super(),G(this,t,R,Q,c,{item:0})}}function V(t,e,n){const r=t.slice();return r[1]=e[n],r}function W(t,e){let n,r,o;return r=new U({props:{item:e[1]}}),{key:t,first:null,c(){n=u(""),q(r.$$.fragment),this.first=n},m(t,e){i(t,n,e),F(r,t,e),o=!0},p(t,e){const n={};1&e&&(n.item=t[1]),r.$set(n)},i(t){o||(B(r.$$.fragment,t),o=!0)},o(t){H(r.$$.fragment,t),o=!1},d(t){t&&a(n),P(r,t)}}}function X(t){let e,n,r=[],o=new Map,c=t[0];const s=t=>t[1].char_id;for(let e=0;e<c.length;e+=1){let n=V(t,c,e),i=s(n);o.set(i,r[e]=W(i,n))}return{c(){e=l("section");for(let t=0;t<r.length;t+=1)r[t].c();m(e,"class","cards svelte-18mkzxi")},m(t,o){i(t,e,o);for(let t=0;t<r.length;t+=1)r[t].m(e,null);n=!0},p(t,[n]){if(1&n){const c=t[0];T(),r=function(t,e,n,r,o,c,s,i,a,l,u,f){let d=t.length,m=c.length,g=d;const h={};for(;g--;)h[t[g].key]=g;const p=[],$=new Map,v=new Map;for(g=m;g--;){const t=f(o,c,g),i=n(t);let a=s.get(i);a?r&&a.p(t,e):(a=l(i,t),a.c()),$.set(i,p[g]=a),i in h&&v.set(i,Math.abs(g-h[i]))}const y=new Set,x=new Set;function b(t){B(t,1),t.m(i,u),s.set(t.key,t),u=t.first,m--}for(;d&&m;){const e=p[m-1],n=t[d-1],r=e.key,o=n.key;e===n?(u=e.first,d--,m--):$.has(o)?!s.has(r)||y.has(r)?b(e):x.has(o)?d--:v.get(r)>v.get(o)?(x.add(r),b(e)):(y.add(o),d--):(a(n,s),d--)}for(;d--;){const e=t[d];$.has(e.key)||a(e,s)}for(;m;)b(p[m-1]);return p}(r,n,s,1,t,c,o,e,O,W,null,V),z()}},i(t){if(!n){for(let t=0;t<c.length;t+=1)B(r[t]);n=!0}},o(t){for(let t=0;t<r.length;t+=1)H(r[t]);n=!1},d(t){t&&a(e);for(let t=0;t<r.length;t+=1)r[t].d()}}}function Y(t,e,n){let{items:r=[]}=e;return t.$set=t=>{"items"in t&&n(0,r=t.items)},[r]}class Z extends I{constructor(t){super(),G(this,t,Y,X,c,{items:0})}}function tt(e){let n;return{c(){n=l("div"),n.innerHTML='<img src="./images/spinner.gif" alt="Loading">',m(n,"class","center")},m(t,e){i(t,n,e)},p:t,i:t,o:t,d(t){t&&a(n)}}}class et extends I{constructor(t){super(),G(this,t,null,tt,c,{})}}function nt(e){let n,o,c,u,f;return{c(){n=l("section"),o=l("div"),c=l("input"),m(c,"type","text"),m(c,"placeholder","Search characters"),m(c,"class","svelte-1gycorj"),m(n,"class","search svelte-1gycorj")},m(t,r){i(t,n,r),s(n,o),s(o,c),h(c,e[0]),u||(f=[d(c,"input",e[2]),d(c,"input",e[3])],u=!0)},p(t,[e]){1&e&&c.value!==t[0]&&h(c,t[0])},i:t,o:t,d(t){t&&a(n),u=!1,r(f)}}}function rt(t,e,n){let r="";const o=y();function c(t){n(0,r=t),o("notify",t)}return[r,c,function(){r=this.value,n(0,r)},t=>c(t.target.value)]}class ot extends I{constructor(t){super(),G(this,t,rt,nt,c,{})}}function ct(t){let e,n;return e=new Z({props:{items:t[0]}}),{c(){q(e.$$.fragment)},m(t,r){F(e,t,r),n=!0},p(t,n){const r={};1&n&&(r.items=t[0]),e.$set(r)},i(t){n||(B(e.$$.fragment,t),n=!0)},o(t){H(e.$$.fragment,t),n=!1},d(t){P(e,t)}}}function st(e){let n,r;return n=new et({}),{c(){q(n.$$.fragment)},m(t,e){F(n,t,e),r=!0},p:t,i(t){r||(B(n.$$.fragment,t),r=!0)},o(t){H(n.$$.fragment,t),r=!1},d(t){P(n,t)}}}function it(t){let e,n,r,o,c,u,d,g;n=new K({}),o=new ot({}),o.$on("notify",t[2]);const h=[st,ct],p=[];function $(t,e){return t[1]?0:1}return u=$(t),d=p[u]=h[u](t),{c(){e=l("div"),q(n.$$.fragment),r=f(),q(o.$$.fragment),c=f(),d.c(),m(e,"class","container svelte-myr4lu")},m(t,a){i(t,e,a),F(n,e,null),s(e,r),F(o,e,null),s(e,c),p[u].m(e,null),g=!0},p(t,[n]){let r=u;u=$(t),u===r?p[u].p(t,n):(T(),H(p[r],1,1,()=>{p[r]=null}),z(),d=p[u],d||(d=p[u]=h[u](t),d.c()),B(d,1),d.m(e,null))},i(t){g||(B(n.$$.fragment,t),B(o.$$.fragment,t),B(d),g=!0)},o(t){H(n.$$.fragment,t),H(o.$$.fragment,t),H(d),g=!1},d(t){t&&a(e),P(n),P(o),p[u].d()}}}function at(t,e,n){let r=[],o=!0,c="";async function s(t){const e=await fetch("https://www.breakingbadapi.com/api/characters?name="+t),c=await e.json();n(0,r=c),n(1,o=!1)}var i;return i=()=>{s(c)},v().$$.on_mount.push(i),[r,o,function(t){c=t.detail,s(c)}]}return new class extends I{constructor(t){super(),G(this,t,at,it,c,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map