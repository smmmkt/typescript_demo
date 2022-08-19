(()=>{"use strict";class e{_context;_pipeQueue;_return;constructor(e,t){const r=Array.isArray(t)?null:t;e?(this._context=e.context,this._pipeQueue=e.pipeQueue):(this._context=r?[]:t,this._pipeQueue=[]),r&&this._pipeQueue.push(r),this._return=r?[]:t}static createPipe(t){return new e(null,t)}get context(){return"function"==typeof this._context?this._context:[...this._context]}get pipeQueue(){return[...this._pipeQueue]}pipe(t){return new e(this,t instanceof e?t.pipeFunc():t)}pipeFunc(){const e=this._pipeQueue.slice().reverse();return 0===e.length?()=>this._return:async(...t)=>{let r=[...t];for(;e.length>0;)r=await(e.pop()?.(...r));return r}}async eval(){return await this.pipeFunc()(...this.context)}}const t=(e=0)=>t=>`[${t+e}m`,r=(e=0)=>t=>`[${38+e};5;${t}m`,n=(e=0)=>(t,r,n)=>`[${38+e};2;${t};${r};${n}m`,o=function(){const e=new Map,o={modifier:{reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],overline:[53,55],inverse:[7,27],hidden:[8,28],strikethrough:[9,29]},color:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],blackBright:[90,39],redBright:[91,39],greenBright:[92,39],yellowBright:[93,39],blueBright:[94,39],magentaBright:[95,39],cyanBright:[96,39],whiteBright:[97,39]},bgColor:{bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49],bgBlackBright:[100,49],bgRedBright:[101,49],bgGreenBright:[102,49],bgYellowBright:[103,49],bgBlueBright:[104,49],bgMagentaBright:[105,49],bgCyanBright:[106,49],bgWhiteBright:[107,49]}};o.color.gray=o.color.blackBright,o.bgColor.bgGray=o.bgColor.bgBlackBright,o.color.grey=o.color.blackBright,o.bgColor.bgGrey=o.bgColor.bgBlackBright;for(const[t,r]of Object.entries(o)){for(const[t,n]of Object.entries(r))o[t]={open:`[${n[0]}m`,close:`[${n[1]}m`},r[t]=o[t],e.set(n[0],n[1]);Object.defineProperty(o,t,{value:r,enumerable:!1})}return Object.defineProperty(o,"codes",{value:e,enumerable:!1}),o.color.close="[39m",o.bgColor.close="[49m",o.color.ansi=t(),o.color.ansi256=r(),o.color.ansi16m=n(),o.bgColor.ansi=t(10),o.bgColor.ansi256=r(10),o.bgColor.ansi16m=n(10),Object.defineProperties(o,{rgbToAnsi256:{value:(e,t,r)=>e===t&&t===r?e<8?16:e>248?231:Math.round((e-8)/247*24)+232:16+36*Math.round(e/255*5)+6*Math.round(t/255*5)+Math.round(r/255*5),enumerable:!1},hexToRgb:{value:e=>{const t=/(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(e.toString(16));if(!t)return[0,0,0];let{colorString:r}=t.groups;3===r.length&&(r=[...r].map((e=>e+e)).join(""));const n=Number.parseInt(r,16);return[n>>16&255,n>>8&255,255&n]},enumerable:!1},hexToAnsi256:{value:e=>o.rgbToAnsi256(...o.hexToRgb(e)),enumerable:!1},ansi256ToAnsi:{value:e=>{if(e<8)return 30+e;if(e<16)return e-8+90;let t,r,n;if(e>=232)t=(10*(e-232)+8)/255,r=t,n=t;else{const o=(e-=16)%36;t=Math.floor(e/36)/5,r=Math.floor(o/6)/5,n=o%6/5}const o=2*Math.max(t,r,n);if(0===o)return 30;let i=30+(Math.round(n)<<2|Math.round(r)<<1|Math.round(t));return 2===o&&(i+=60),i},enumerable:!1},rgbToAnsi:{value:(e,t,r)=>o.ansi256ToAnsi(o.rgbToAnsi256(e,t,r)),enumerable:!1},hexToAnsi:{value:e=>o.ansi256ToAnsi(o.hexToAnsi256(e)),enumerable:!1}}),o}(),i=o,s=require("node:process"),l=require("node:os"),c=require("node:tty");function u(e,t=s.argv){const r=e.startsWith("-")?"":1===e.length?"-":"--",n=t.indexOf(r+e),o=t.indexOf("--");return-1!==n&&(-1===o||n<o)}const{env:a}=s;let g;function h(e,t={}){return 0!==(r=function(e,{streamIsTTY:t,sniffFlags:r=!0}={}){const n=function(){if("FORCE_COLOR"in a)return"true"===a.FORCE_COLOR?1:"false"===a.FORCE_COLOR?0:0===a.FORCE_COLOR.length?1:Math.min(Number.parseInt(a.FORCE_COLOR,10),3)}();void 0!==n&&(g=n);const o=r?g:n;if(0===o)return 0;if(r){if(u("color=16m")||u("color=full")||u("color=truecolor"))return 3;if(u("color=256"))return 2}if(e&&!t&&void 0===o)return 0;const i=o||0;if("dumb"===a.TERM)return i;if("win32"===s.platform){const e=l.release().split(".");return Number(e[0])>=10&&Number(e[2])>=10586?Number(e[2])>=14931?3:2:1}if("CI"in a)return["TRAVIS","CIRCLECI","APPVEYOR","GITLAB_CI","GITHUB_ACTIONS","BUILDKITE","DRONE"].some((e=>e in a))||"codeship"===a.CI_NAME?1:i;if("TEAMCITY_VERSION"in a)return/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(a.TEAMCITY_VERSION)?1:0;if("TF_BUILD"in a&&"AGENT_NAME"in a)return 1;if("truecolor"===a.COLORTERM)return 3;if("TERM_PROGRAM"in a){const e=Number.parseInt((a.TERM_PROGRAM_VERSION||"").split(".")[0],10);switch(a.TERM_PROGRAM){case"iTerm.app":return e>=3?3:2;case"Apple_Terminal":return 2}}return/-256(color)?$/i.test(a.TERM)?2:/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(a.TERM)||"COLORTERM"in a?1:i}(e,{streamIsTTY:e&&e.isTTY,...t}))&&{level:r,hasBasic:!0,has256:r>=2,has16m:r>=3};var r}u("no-color")||u("no-colors")||u("color=false")||u("color=never")?g=0:(u("color")||u("colors")||u("color=true")||u("color=always"))&&(g=1);const p={stdout:h({isTTY:c.isatty(1)}),stderr:h({isTTY:c.isatty(2)})};function b(e,t,r){let n=e.indexOf(t);if(-1===n)return e;const o=t.length;let i=0,s="";do{s+=e.substr(i,n-i)+t+r,i=n+o,n=e.indexOf(t,i)}while(-1!==n);return s+=e.slice(i),s}const{stdout:f,stderr:d}=p,m=Symbol("GENERATOR"),O=Symbol("STYLER"),v=Symbol("IS_EMPTY"),T=["ansi","ansi","ansi256","ansi16m"],y=Object.create(null);function R(e){return(e=>{const t=(...e)=>e.join(" ");return((e,t={})=>{if(t.level&&!(Number.isInteger(t.level)&&t.level>=0&&t.level<=3))throw new Error("The `level` option should be an integer from 0 to 3");const r=f?f.level:0;e.level=void 0===t.level?r:t.level})(t,e),Object.setPrototypeOf(t,R.prototype),t})(e)}Object.setPrototypeOf(R.prototype,Function.prototype);for(const[e,t]of Object.entries(i))y[e]={get(){const r=E(this,B(t.open,t.close,this[O]),this[v]);return Object.defineProperty(this,e,{value:r}),r}};y.visible={get(){const e=E(this,this[O],!0);return Object.defineProperty(this,"visible",{value:e}),e}};const A=(e,t,r,...n)=>"rgb"===e?"ansi16m"===t?i[r].ansi16m(...n):"ansi256"===t?i[r].ansi256(i.rgbToAnsi256(...n)):i[r].ansi(i.rgbToAnsi(...n)):"hex"===e?A("rgb",t,r,...i.hexToRgb(...n)):i[r][e](...n),C=["rgb","hex","ansi256"];for(const e of C)y[e]={get(){const{level:t}=this;return function(...r){const n=B(A(e,T[t],"color",...r),i.color.close,this[O]);return E(this,n,this[v])}}},y["bg"+e[0].toUpperCase()+e.slice(1)]={get(){const{level:t}=this;return function(...r){const n=B(A(e,T[t],"bgColor",...r),i.bgColor.close,this[O]);return E(this,n,this[v])}}};const _=Object.defineProperties((()=>{}),{...y,level:{enumerable:!0,get(){return this[m].level},set(e){this[m].level=e}}}),B=(e,t,r)=>{let n,o;return void 0===r?(n=e,o=t):(n=r.openAll+e,o=t+r.closeAll),{open:e,close:t,openAll:n,closeAll:o,parent:r}},E=(e,t,r)=>{const n=(...e)=>M(n,1===e.length?""+e[0]:e.join(" "));return Object.setPrototypeOf(n,_),n[m]=e,n[O]=t,n[v]=r,n},M=(e,t)=>{if(e.level<=0||!t)return e[v]?"":t;let r=e[O];if(void 0===r)return t;const{openAll:n,closeAll:o}=r;if(t.includes(""))for(;void 0!==r;)t=b(t,r.close,r.open),r=r.parent;const i=t.indexOf("\n");return-1!==i&&(t=function(e,t,r,n){let o=0,i="";do{const s="\r"===e[n-1];i+=e.substr(o,(s?n-1:n)-o)+t+(s?"\r\n":"\n")+r,o=n+1,n=e.indexOf("\n",o)}while(-1!==n);return i+=e.slice(o),i}(t,o,n,i)),n+t+o};Object.defineProperties(R.prototype,y);const x=R(),w=(R({level:d?d.level:0}),x),I=new e(null,[122,12]).pipe(e.createPipe(((e,t)=>[e*t]))).pipe((e=>[e*(e%10)+13])).pipe((e=>[e,`${e}`])).pipe((S=[],F=[[[0,1],(e,t)=>e===parseInt(t)],[[0,1],()=>!0]],P=(...e)=>{const t=e.length;return F&&F.some((([e])=>e.some((e=>e>=t||e<0))))?(console.warn("Warning: Combination validator has some picker out of range."),[!1]):[S.every(((t,r)=>t(e[r])))&&(F?.every((([t,r])=>r(...t.map((t=>e[t])))))??!0)]},N=async(...e)=>{throw new Error(`${e}`)},"join",async(...e)=>{const t=(e=>Array.isArray(e)?e[0]:e)(await P(...e));if(t){0;try{await N(...e)}catch{return["reject",...e]}return["fulfilled",...e]}return["noop",...e]})).pipe((j=e=>console.log(w.bgGreen(w.whiteBright(e))),(...e)=>{const[t,...r]=e;return j(t),r})).pipe(((...e)=>(...t)=>[t,...e.map((e=>e(...t)))])((e=>[e,e])));var j,P,N,S,F;(async()=>{console.log(await I.pipeFunc()(1,2)),console.log("just some test")})()})();