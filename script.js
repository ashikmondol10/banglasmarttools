/* ---------- Lazy library loaders (performance: only load what a page actually needs) ---------- */
let _pdfjs=null;
async function loadPdfJs(){
  if(_pdfjs) return _pdfjs;
  _pdfjs = await import("pdfjs");
  _pdfjs.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.3.289/pdf.worker.min.mjs";
  return _pdfjs;
}
function loadScript(src){
  return new Promise((res,rej)=>{
    if(document.querySelector(`script[src="${src}"]`)) return res();
    const s=document.createElement("script");
    s.src=src; s.onload=res; s.onerror=()=>rej(new Error("load failed: "+src));
    document.head.appendChild(s);
  });
}
async function loadQRCode(){ if(!window.QRCode) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"); return window.QRCode; }
async function loadJSZip(){ if(!window.JSZip) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"); return window.JSZip; }
async function loadPdfLib(){ if(!window.PDFLib) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"); return window.PDFLib; }

/* ---------- Per-tool icons (each tool gets its own distinct mark, outline style, currentColor) ---------- */
const toolIcons={
"age-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="12" width="16" height="8" rx="1.5"/><line x1="4" y1="16" x2="20" y2="16"/><line x1="8" y1="12" x2="8" y2="8"/><line x1="12" y1="12" x2="12" y2="7"/><line x1="16" y1="12" x2="16" y2="8"/><circle cx="8" cy="6.5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="5.2" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
"percentage-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><circle cx="7.3" cy="7.3" r="2.5"/><circle cx="16.7" cy="16.7" r="2.5"/></svg>`,
"bmi-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="16" width="16" height="5" rx="1.4"/><circle cx="12" cy="18.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="12" cy="7.5" r="2.6"/><path d="M8 16c0-3 1.8-5.3 4-5.3s4 2.3 4 5.3"/></svg>`,
"discount-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12.5 12.5 20 4 11.5V4h7.5z"/><circle cx="8" cy="8" r="1.6" fill="currentColor" stroke="none"/><line x1="8.5" y1="15.5" x2="15.5" y2="8.5"/></svg>`,
"profit-loss-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,9 9,4 14,9"/><line x1="9" y1="4" x2="9" y2="14"/><polyline points="20,15 15,20 10,15"/><line x1="15" y1="10" x2="15" y2="20"/></svg>`,
"salary-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="16" cy="12" r="1.8"/><line x1="3" y1="10" x2="8" y2="10"/></svg>`,
"vat-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-2-1.3L14 21l-2-1.3L10 21l-2-1.3L6 21z"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
"emi-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,3 21,9 3,9"/><line x1="5" y1="9" x2="5" y2="19"/><line x1="10" y1="9" x2="10" y2="19"/><line x1="14" y1="9" x2="14" y2="19"/><line x1="19" y1="9" x2="19" y2="19"/><line x1="3" y1="19" x2="21" y2="19"/></svg>`,
"date-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="8" height="8" rx="1.3"/><line x1="3" y1="8" x2="11" y2="8"/><rect x="13" y="11" width="8" height="8" rx="1.3"/><line x1="13" y1="14" x2="21" y2="14"/><line x1="11" y1="9" x2="16" y2="14" stroke-dasharray="2 2"/></svg>`,
"currency-converter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13"/><polyline points="14,4 18,8 14,12"/><path d="M20 16H7"/><polyline points="10,20 6,16 10,12"/></svg>`,
"word-counter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="11" x2="20" y2="11"/><line x1="4" y1="16" x2="14" y2="16"/><line x1="17" y1="19" x2="17" y2="21.5"/><line x1="19" y1="19" x2="19" y2="21.5"/><line x1="21" y1="19" x2="21" y2="21.5"/></svg>`,
"character-counter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 19 10.5 5h1l4.5 14"/><line x1="7.6" y1="14" x2="14.4" y2="14"/><line x1="18" y1="7" x2="18" y2="9.5"/><line x1="20" y1="7" x2="20" y2="9.5"/></svg>`,
"case-converter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><text x="12" y="17.5" font-size="14" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">Aa</text></svg>`,
"image-compressor":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><polyline points="9,10 6,10 6,7"/><line x1="6" y1="10" x2="10" y2="6"/><polyline points="15,14 18,14 18,17"/><line x1="18" y1="14" x2="14" y2="18"/></svg>`,
"image-resizer":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><polyline points="14,9 18,9 18,13"/><line x1="18" y1="9" x2="13" y2="14"/><polyline points="10,15 6,15 6,11"/><line x1="6" y1="15" x2="11" y2="10"/></svg>`,
"jpg-to-png":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="8.5" width="7" height="7" rx="1.3" fill="currentColor" stroke="none"/><line x1="10.5" y1="12" x2="14.5" y2="12"/><polyline points="12.7,9.8 15.2,12 12.7,14.2"/><rect x="16" y="8.5" width="7" height="7" rx="1.3"/></svg>`,
"png-to-jpg":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="8.5" width="7" height="7" rx="1.3"/><line x1="10.5" y1="12" x2="14.5" y2="12"/><polyline points="12.7,9.8 15.2,12 12.7,14.2"/><rect x="16" y="8.5" width="7" height="7" rx="1.3" fill="currentColor" stroke="none"/></svg>`,
"pdf-to-jpg":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2h6l3 3v13H2z"/><line x1="4" y1="10" x2="8.5" y2="10"/><line x1="4" y1="13" x2="8.5" y2="13"/><polyline points="11.5,11 15,11"/><polyline points="13.3,8.8 15.7,11 13.3,13.2"/><rect x="16.5" y="6.5" width="7" height="7.5" rx="1.3"/><polyline points="17.3,12.3 19.5,9.8 21.8,12.7"/></svg>`,
"json-formatter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><text x="12" y="17.5" font-size="16" text-anchor="middle" font-family="Georgia,serif" font-weight="700" fill="currentColor" stroke="none">{ }</text></svg>`,
"password-generator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="4"/><line x1="11" y1="11" x2="20" y2="20"/><line x1="15.5" y1="15.5" x2="18" y2="13"/><line x1="18" y1="18" x2="20.5" y2="15.5"/></svg>`,
"qr-generator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="5.3" y="5.3" width="1.4" height="1.4" fill="currentColor" stroke="none"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="17.3" y="5.3" width="1.4" height="1.4" fill="currentColor" stroke="none"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="5.3" y="17.3" width="1.4" height="1.4" fill="currentColor" stroke="none"/><rect x="15" y="15" width="2.2" height="2.2" fill="currentColor" stroke="none"/><rect x="18.5" y="15" width="2.5" height="2.5" fill="currentColor" stroke="none"/><rect x="15" y="18.5" width="2.5" height="2.5" fill="currentColor" stroke="none"/><rect x="18.8" y="18.8" width="1.8" height="1.8" fill="currentColor" stroke="none"/></svg>`,
"unit-converter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="9" width="20" height="6" rx="1.5"/><line x1="6" y1="9" x2="6" y2="12"/><line x1="10" y1="9" x2="10" y2="12"/><line x1="14" y1="9" x2="14" y2="12"/><line x1="18" y1="9" x2="18" y2="12"/></svg>`,
"number-to-words":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><text x="1" y="14" font-size="9" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">123</text><polyline points="13,12 16.5,12"/><polyline points="14.8,10 17,12 14.8,14"/><line x1="19" y1="8.5" x2="23" y2="8.5"/><line x1="19" y1="12" x2="23" y2="12"/><line x1="19" y1="15.5" x2="21.5" y2="15.5"/></svg>`,
"bangla-number-converter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><text x="1" y="10" font-size="8" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">০৯</text><text x="12.5" y="21" font-size="8" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">09</text><polyline points="6,13 17,7"/><polyline points="14,7.3 17.3,7 17,10.3"/></svg>`,
"data-size-converter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="2.6"/><path d="M4 5v6c0 1.4 3.6 2.6 8 2.6s8-1.2 8-2.6V5"/><path d="M4 11v6c0 1.4 3.6 2.6 8 2.6s8-1.2 8-2.6v-6"/></svg>`,
"base-converter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="9" width="4.5" height="4.5" fill="currentColor" stroke="none"/><rect x="9" y="9" width="4.5" height="4.5"/><rect x="16" y="9" width="4.5" height="4.5" fill="currentColor" stroke="none"/></svg>`,
"color-converter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="4.2" fill="currentColor" stroke="none" opacity="0.8"/><circle cx="15.5" cy="8" r="4.2"/><circle cx="11.7" cy="15" r="4.2" fill="none"/></svg>`,
"base64-encoder-decoder":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><text x="12" y="16" font-size="10" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">B64</text></svg>`,
"url-encoder-decoder":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 15l6-6"/><path d="M7 12l-2.5 2.5a3 3 0 0 0 4.24 4.24L11 16.5"/><path d="M13 7.5l2.26-2.26a3 3 0 0 1 4.24 4.24L17 12"/></svg>`,
"uuid-generator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="7.5" cy="12" r="2"/><line x1="12.5" y1="9.5" x2="19" y2="9.5"/><line x1="12.5" y1="12" x2="19" y2="12"/><line x1="12.5" y1="14.5" x2="16.5" y2="14.5"/></svg>`,
"timestamp-converter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="12" r="7.5"/><polyline points="10,7.5 10,12 13.5,14"/><polyline points="19,9 22,9 22,12"/></svg>`,
"lorem-ipsum-generator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="11" x2="21" y2="11"/><line x1="3" y1="16" x2="15" y2="16"/><path d="M19 15.3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" stroke-width="1.3"/></svg>`,
"text-reverser":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><text x="1" y="10" font-size="8" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">AB</text><text x="14" y="21" font-size="8" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">BA</text><polyline points="6,13 17,7"/><polyline points="14,7.3 17.3,7 17,10.3"/></svg>`,
"sentence-counter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="15" y2="7"/><circle cx="18" cy="7" r="1" fill="currentColor" stroke="none"/><line x1="4" y1="13" x2="17" y2="13"/><circle cx="20" cy="13" r="1" fill="currentColor" stroke="none"/><line x1="4" y1="19" x2="12" y2="19"/><circle cx="15" cy="19" r="1" fill="currentColor" stroke="none"/></svg>`,
"remove-duplicate-lines":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="5" x2="15" y2="5"/><line x1="3" y1="9.5" x2="15" y2="9.5" opacity="0.35"/><line x1="17.5" y1="7" x2="21.5" y2="11"/><line x1="21.5" y1="7" x2="17.5" y2="11"/><line x1="3" y1="15" x2="17" y2="15"/><line x1="3" y1="19.5" x2="11" y2="19.5"/></svg>`,
"text-sorter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><text x="2" y="10" font-size="8" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">A</text><text x="2" y="21" font-size="8" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">Z</text><line x1="16" y1="4" x2="16" y2="19"/><polyline points="12.5,15.5 16,19 19.5,15.5"/></svg>`,
"time-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="12.5" r="7.5"/><line x1="10.5" y1="8" x2="10.5" y2="12.5"/><line x1="10.5" y1="12.5" x2="13.5" y2="14.5"/><line x1="19" y1="4" x2="19" y2="8"/><line x1="17" y1="6" x2="21" y2="6"/></svg>`,
"bkash-charge-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><line x1="6" y1="17" x2="18" y2="17"/><text x="12" y="12.5" font-size="8" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">৳</text></svg>`,
"nagad-charge-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><line x1="6" y1="17" x2="18" y2="17"/><polyline points="9,12 12,8.5 15,12"/><line x1="12" y1="8.5" x2="12" y2="14"/></svg>`,
"rocket-charge-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><line x1="6" y1="17" x2="18" y2="17"/><path d="M12 6.5c1.4 1 1.8 3 1.8 4.8-.6.35-1.2.35-1.8.35s-1.2 0-1.8-.35c0-1.8.4-3.8 1.8-4.8z"/><line x1="11" y1="11.6" x2="10.2" y2="13.2"/><line x1="13" y1="11.6" x2="13.8" y2="13.2"/></svg>`,
"income-tax-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-2-1.3L14 21l-2-1.3L10 21l-2-1.3L6 21z"/><line x1="8.5" y1="7.5" x2="14.5" y2="7.5"/><circle cx="9.3" cy="12" r="1.3"/><circle cx="14.7" cy="15.5" r="1.3"/><line x1="9" y1="16" x2="15" y2="11.5"/></svg>`,
"electricity-bill-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13,2 4,14 11,14 10,22 20,9 13,9 13,2"/></svg>`,
"ssc-hsc-gpa-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l10-4 10 4-10 4-10-4z"/><path d="M6 11v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5"/><line x1="21" y1="9" x2="21" y2="15"/></svg>`,
"cgpa-calculator":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="13" rx="2"/><line x1="7.5" y1="7" x2="16.5" y2="7"/><line x1="7.5" y1="10.5" x2="14" y2="10.5"/><path d="M9 16v5l3-2 3 2v-5"/></svg>`,
"html-formatter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="7,7 3,12 7,17"/><polyline points="17,7 21,12 17,17"/><line x1="10" y1="18" x2="14" y2="6"/></svg>`,
"css-minifier":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="10" height="6" rx="1.3"/><path d="M6 9v4a2 2 0 0 0 2 2h1"/><line x1="9" y1="15" x2="9" y2="21"/><line x1="7" y1="21" x2="11" y2="21"/></svg>`,
"js-minifier":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><text x="12" y="15.5" font-size="9" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">JS</text></svg>`,
"image-to-webp":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="8.5" width="7" height="7" rx="1.3" fill="currentColor" stroke="none"/><line x1="10.5" y1="12" x2="14.5" y2="12"/><polyline points="12.7,9.8 15.2,12 12.7,14.2"/><rect x="16" y="8.5" width="7" height="7" rx="1.3"/><text x="19.5" y="14" font-size="5" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">W</text></svg>`,
"webp-to-jpg":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="8.5" width="7" height="7" rx="1.3"/><text x="4.5" y="14" font-size="5" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">W</text><line x1="10.5" y1="12" x2="14.5" y2="12"/><polyline points="12.7,9.8 15.2,12 12.7,14.2"/><rect x="16" y="8.5" width="7" height="7" rx="1.3" fill="currentColor" stroke="none"/></svg>`,
"image-cropper":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>`,
"image-metadata-viewer":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="12" rx="2"/><circle cx="7.5" cy="9.5" r="1.2"/><polyline points="5,15 8.5,11 11,13.5 14,10"/><circle cx="19.5" cy="6.5" r="3.2"/><line x1="19.5" y1="5.6" x2="19.5" y2="7.6" stroke-width="1.3"/><circle cx="19.5" cy="4.6" r="0.4" fill="currentColor" stroke="none"/></svg>`,
"pdf-merge":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="7" height="6" rx="1.1"/><rect x="1" y="13" width="7" height="6" rx="1.1"/><polyline points="10.5,12 14,12"/><polyline points="12.2,9.8 14.5,12 12.2,14.2"/><rect x="16" y="7" width="7" height="10" rx="1.3"/><line x1="18" y1="10.5" x2="21" y2="10.5"/><line x1="18" y1="13" x2="21" y2="13"/></svg>`,
"pdf-split":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="7" width="7" height="10" rx="1.3"/><line x1="3" y1="10.5" x2="6" y2="10.5"/><line x1="3" y1="13" x2="6" y2="13"/><polyline points="10.5,12 14,12"/><polyline points="12.2,9.8 14.5,12 12.2,14.2"/><rect x="16" y="4" width="7" height="6" rx="1.1"/><rect x="16" y="13" width="7" height="6" rx="1.1"/></svg>`,
"jpg-to-pdf":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6.5" width="7" height="7.5" rx="1.3"/><polyline points="2,12.3 4.2,9.8 6.5,12.7"/><polyline points="10.5,10 14,10"/><polyline points="12.2,7.8 14.5,10 12.2,12.2"/><path d="M16 2h5v20h-9V6z"/><line x1="18.5" y1="9" x2="21" y2="9"/><line x1="18.5" y1="12" x2="21" y2="12"/><line x1="18.5" y1="15" x2="21" y2="15"/></svg>`,
"pdf-compressor":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2h7l4 4v16H7z"/><polyline points="12,10 9,10 9,7"/><line x1="9" y1="10" x2="13" y2="6"/><polyline points="12,15 15,15 15,18"/><line x1="15" y1="15" x2="11" y2="19"/></svg>`,
"bijoy-unicode-converter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><text x="1" y="10" font-size="6.5" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">Bijoy</text><text x="9" y="21" font-size="7" font-family="Arial,sans-serif" font-weight="700" fill="currentColor" stroke="none">বাংলা</text><polyline points="6,13 15,7"/><polyline points="12,7.3 15.3,7 15,10.3"/></svg>`
};
const genericIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>`;
const CAT_EMOJI={"ক্যালকুলেটর":"🧮","ফাইন্যান্স":"📊","টেক্সট":"📝","ইমেজ":"🖼️","PDF":"📄","ডেভেলপার":"💻","ইউটিলিটি":"🔐","কনভার্টার":"🔁","বাংলাদেশ":"🇧🇩","শিক্ষা":"🎓"};
function catLabel(c){return `${CAT_EMOJI[c]||"⚡"} ${c}`}
const shareIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.3"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="19" r="2.3"/><line x1="8" y1="10.8" x2="16" y2="6.2"/><line x1="8" y1="13.2" x2="16" y2="17.8"/></svg>`;

/* ---------- App state ---------- */
const $=s=>document.querySelector(s), app=$("#app"), toastEl=$("#toast");
const state={lang:localStorage.bst_lang||"bn",theme:localStorage.bst_theme||"light",recent:JSON.parse(localStorage.bst_recent||"[]"),favorites:JSON.parse(localStorage.bst_favorites||"[]")};
document.documentElement.dataset.theme=state.theme; $("#year").textContent=new Date().getFullYear();

const SITE="https://banglasmarttools.com/";

const tools=[
["age-calculator","বয়স ক্যালকুলেটর","জন্মতারিখ থেকে বয়স বের করুন","ক্যালকুলেটর"],
["percentage-calculator","Percentage Calculator","শতকরা হিসাব সহজে করুন","ক্যালকুলেটর"],
["bmi-calculator","BMI Calculator","উচ্চতা ও ওজন থেকে BMI হিসাব করুন","ক্যালকুলেটর"],
["discount-calculator","Discount Calculator","ছাড়ের পর দাম ও সাশ্রয় হিসাব করুন","ক্যালকুলেটর"],
["profit-loss-calculator","Profit & Loss","লাভ বা ক্ষতির পরিমাণ ও শতাংশ বের করুন","বিজনেস ও ফাইন্যান্স"],
["salary-calculator","Salary Calculator","মাসিক বেতন থেকে বার্ষিক মোট হিসাব","বিজনেস ও ফাইন্যান্স"],
["vat-calculator","VAT Calculator","VAT যোগ বা বাদ দিয়ে মূল্য হিসাব করুন","বিজনেস ও ফাইন্যান্স"],
["emi-calculator","EMI Calculator","ঋণের মাসিক কিস্তি হিসাব করুন","বিজনেস ও ফাইন্যান্স"],
["date-calculator","Date Calculator","দুই তারিখের ব্যবধান বের করুন","ক্যালকুলেটর"],
["currency-converter","Currency Converter","লাইভ exchange rate দিয়ে currency convert করুন","বিজনেস ও ফাইন্যান্স"],
["word-counter","Word Counter","শব্দ ও character গণনা করুন","টেক্সট"],
["character-counter","Character Counter","অক্ষর গণনা করুন","টেক্সট"],
["case-converter","Case Converter","UPPER, lower ও Title Case করুন","টেক্সট"],
["image-compressor","Image Compressor","ছবির file size কমান","ইমেজ"],
["image-resizer","Image Resizer","ছবির width ও height পরিবর্তন করুন","ইমেজ"],
["jpg-to-png","JPG to PNG","JPG ছবিকে PNG করুন","ইমেজ"],
["png-to-jpg","PNG to JPG","PNG ছবিকে JPG করুন","ইমেজ"],
["pdf-to-jpg","PDF to JPG","PDF-এর page JPG হিসেবে export করুন","PDF"],
["json-formatter","JSON Formatter","JSON format ও validate করুন","ডেভেলপার"],
["password-generator","Password Generator","নিরাপদ random password তৈরি করুন","নিরাপত্তা"],
["qr-generator","QR Code Generator","Text বা URL থেকে QR code তৈরি করুন","ইউটিলিটি"],
["unit-converter","Unit Converter","দৈর্ঘ্য, ওজন ও তাপমাত্রা একক পরিবর্তন করুন","কনভার্টার"],
["number-to-words","সংখ্যা থেকে কথায়","সংখ্যাকে বাংলায় কথায় রূপান্তর করুন — চেক/ইনভয়েস লেখার জন্য","কনভার্টার"],
["bangla-number-converter","বাংলা-ইংরেজি সংখ্যা","০-৯ থেকে ০-৯ বাংলা-ইংরেজি সংখ্যা রূপান্তর করুন","কনভার্টার"],
["data-size-converter","Data Size Converter","Bit, Byte, KB, MB, GB, TB পরিবর্তন করুন","কনভার্টার"],
["base-converter","Number Base Converter","Binary, Octal, Decimal, Hex রূপান্তর করুন","ডেভেলপার"],
["color-converter","Color Converter","HEX ও RGB color code রূপান্তর করুন","ডেভেলপার"],
["base64-encoder-decoder","Base64 Encoder/Decoder","টেক্সটকে Base64-এ এনকোড বা ডিকোড করুন","ডেভেলপার"],
["url-encoder-decoder","URL Encoder/Decoder","URL বা টেক্সট encode/decode করুন","ডেভেলপার"],
["uuid-generator","UUID Generator","Unique ID (UUID v4) তৈরি করুন","ডেভেলপার"],
["timestamp-converter","Timestamp Converter","Unix timestamp ও তারিখ-সময় রূপান্তর করুন","ডেভেলপার"],
["lorem-ipsum-generator","Lorem Ipsum Generator","Design/Development-এর জন্য placeholder text তৈরি করুন","টেক্সট"],
["text-reverser","Text Reverser","টেক্সট বা শব্দের ক্রম উল্টে দিন","টেক্সট"],
["sentence-counter","Sentence Counter","লেখায় কতগুলো বাক্য আছে গণনা করুন","টেক্সট"],
["remove-duplicate-lines","Remove Duplicate Lines","একই রকম লাইন বাদ দিয়ে unique list বানান","টেক্সট"],
["text-sorter","Text Sorter","লাইনগুলো A-Z বা Z-A ক্রমে সাজান","টেক্সট"],
["time-calculator","Time Calculator","দুই সময়ের মধ্যে ব্যবধান বের করুন","ক্যালকুলেটর"],
["bijoy-unicode-converter","Bijoy ↔ Unicode Converter","Bijoy ANSI টেক্সট Unicode বাংলায় রূপান্তর করুন","বাংলাদেশ"],
["bkash-charge-calculator","bKash Charge Calculator","bKash cash out চার্জ হিসাব করুন","বাংলাদেশ"],
["nagad-charge-calculator","Nagad Charge Calculator","Nagad cash out চার্জ হিসাব করুন","বাংলাদেশ"],
["rocket-charge-calculator","Rocket Charge Calculator","Rocket (DBBL) cash out চার্জ হিসাব করুন","বাংলাদেশ"],
["income-tax-calculator","Income Tax Calculator","বাংলাদেশের personal income tax আনুমানিক হিসাব করুন","বাংলাদেশ"],
["electricity-bill-calculator","Electricity Bill Calculator","মাসিক বিদ্যুৎ বিল আনুমানিক হিসাব করুন","বাংলাদেশ"],
["ssc-hsc-gpa-calculator","SSC/HSC GPA Calculator","বিষয়ভিত্তিক গ্রেড থেকে GPA বের করুন","শিক্ষা"],
["cgpa-calculator","CGPA Calculator","Credit-ভিত্তিক সেমিস্টার CGPA হিসাব করুন","শিক্ষা"],
["html-formatter","HTML Formatter","HTML code সুন্দরভাবে indent করুন","ডেভেলপার"],
["css-minifier","CSS Minifier","CSS থেকে comment ও extra space বাদ দিন","ডেভেলপার"],
["js-minifier","JavaScript Minifier","JS থেকে comment ও extra space নিরাপদে বাদ দিন","ডেভেলপার"],
["image-to-webp","Image to WebP","ছবিকে WebP format-এ রূপান্তর করুন","ইমেজ"],
["webp-to-jpg","WebP to JPG","WebP ছবিকে JPG-তে রূপান্তর করুন","ইমেজ"],
["image-cropper","Image Cropper","ছবি প্রয়োজনমতো crop করুন","ইমেজ"],
["image-metadata-viewer","Image Metadata Viewer","ছবির dimension, size ও type দেখুন","ইমেজ"],
["pdf-merge","PDF Merge","একাধিক PDF জোড়া লাগিয়ে একটি ফাইল বানান","PDF"],
["pdf-split","PDF Split","PDF থেকে নির্দিষ্ট page আলাদা ফাইল করুন","PDF"],
["jpg-to-pdf","JPG to PDF","একাধিক ছবি থেকে PDF তৈরি করুন","PDF"],
["pdf-compressor","PDF Compressor","PDF-এর file size কমান","PDF"]];

/* blogs: [slug, title, short description, sections[[heading, htmlBody]...], relatedToolId|null] */
const blogs=[
["vat-kivabe-hisab","VAT কীভাবে হিসাব করবেন?","VAT-এর basic formula, উদাহরণ ও calculator ব্যবহার।",[
["VAT কী","VAT (Value Added Tax) হলো পণ্য বা সেবার প্রতিটি ধাপে যোগ হওয়া মূল্যের উপর সরকার কর্তৃক আরোপিত একটি পরোক্ষ কর। বাংলাদেশে সাধারণ VAT হার ১৫%, তবে পণ্যভেদে ভিন্ন হার প্রযোজ্য হতে পারে।"],
["হিসাবের নিয়ম","মূল দামের সাথে VAT যোগ করতে হলে: VAT = মূল দাম × (VAT হার ÷ ১০০), এবং মোট দাম = মূল দাম + VAT। VAT-included দাম থেকে মূল দাম বের করতে হলে: মূল দাম = মোট দাম ÷ (১ + VAT হার ÷ ১০০)।"],
["উদাহরণ","ধরুন কোনো পণ্যের দাম ১,০০০ টাকা এবং VAT হার ১৫%। তাহলে VAT = ১,০০০ × ০.১৫ = ১৫০ টাকা, অর্থাৎ ক্রেতাকে মোট দিতে হবে ১,১৫০ টাকা।"],
["VAT ও Income Tax-এর পার্থক্য","VAT হলো পরোক্ষ কর — পণ্য/সেবা কেনার সময় সবাই একই হারে দেয়। Income Tax হলো প্রত্যক্ষ কর — ব্যক্তি বা প্রতিষ্ঠানের আয়ের উপর ভিত্তি করে হিসাব হয় এবং আয় অনুযায়ী হার ভিন্ন হয়। VAT প্রতিটি বেচাকেনায় যোগ হয়, Income Tax বছর শেষে আয়ের উপর।"],
["কারা VAT Registration করতে বাধ্য","নির্দিষ্ট বার্ষিক টার্নওভারের ঊর্ধ্বে থাকা ব্যবসা প্রতিষ্ঠানকে VAT Registration নিতে হয় এবং নিয়মিত VAT Return জমা দিতে হয়। সঠিক সীমা ও নিয়ম সময়ে সময়ে পরিবর্তিত হয়, তাই হালনাগাদ তথ্যের জন্য NBR-এর official সোর্স দেখে নেওয়া ভালো।"],
["দ্রুত হিসাবের জন্য","প্রতিবার হাতে হিসাব না করে আমাদের VAT Calculator ব্যবহার করলে সেকেন্ডেই দাম ও VAT বের করা যায়, VAT যোগ বা বাদ — দুই দিক থেকেই।"]
],"vat-calculator"],
["percentage-kivabe","Percentage কীভাবে বের করবেন?","শতকরা বের করার সহজ formula ও বাস্তব উদাহরণ।",[
["Percentage কী বোঝায়","শতকরা বা percentage মানে ১০০-এর মধ্যে কতটুকু অংশ। তুলনা, ছাড়, বৃদ্ধি-হ্রাস হিসাব করার সবচেয়ে সাধারণ পদ্ধতি এটি।"],
["মূল formula","কোনো সংখ্যার x% বের করতে: ফলাফল = (সংখ্যা × x) ÷ ১০০। আবার কোনো অংশ পুরো সংখ্যার কত শতাংশ তা বের করতে: শতাংশ = (অংশ ÷ পুরো) × ১০০।"],
["বাস্তব উদাহরণ","৫০০ টাকার ২০% হিসাব করতে: (৫০০ × ২০) ÷ ১০০ = ১০০ টাকা। আবার ৫০ জনের মধ্যে ১০ জন পাস করলে পাসের হার: (১০ ÷ ৫০) × ১০০ = ২০%।"],
["Percentage Increase/Decrease বের করার নিয়ম","বৃদ্ধি বা হ্রাসের শতাংশ বের করতে: পরিবর্তন% = ((নতুন মান − পুরনো মান) ÷ পুরনো মান) × ১০০। ফলাফল positive হলে বৃদ্ধি, negative হলে হ্রাস বোঝায়। যেমন কোনো পণ্যের দাম ২০০ থেকে ২৫০ হলে বৃদ্ধি = ((২৫০−২০০)÷২০০)×১০০ = ২৫%।"],
["Percentage Point vs Percentage","এই দুটো প্রায়ই গুলিয়ে ফেলা হয়। সুদের হার ৫% থেকে ৮% হলে তাকে বলা হয় ৩ percentage point বৃদ্ধি, কিন্তু percentage-এর হিসাবে এটি (৮−৫)÷৫×১০০ = ৬০% বৃদ্ধি। রিপোর্ট বা নিউজ পড়ার সময় এই পার্থক্য বোঝা জরুরি।"],
["কোথায় কাজে লাগে","পরীক্ষার নম্বর, discount, profit margin, ঋণের সুদ — সবখানেই percentage হিসাব দরকার হয়। আমাদের Percentage Calculator দিয়ে যেকোনো সংখ্যার শতাংশ সেকেন্ডেই বের করে নিন।"]
],"percentage-calculator"],
["excel-formula","Excel-এর গুরুত্বপূর্ণ ২০টি Formula","Accounts ও office work-এর জন্য দরকারি Excel formula।",[
["কেন এই formula গুলো জানা দরকার","Accounts, admin বা office কাজে প্রতিদিন Excel ব্যবহার হয়। কয়েকটা formula জানা থাকলে ঘণ্টার কাজ মিনিটে শেষ করা যায়।"],
["সবচেয়ে বেশি ব্যবহৃত ২০টি Formula","<ul><li><b>SUM()</b> — নির্দিষ্ট range-এর যোগফল</li><li><b>AVERAGE()</b> — গড় মান বের করে</li><li><b>COUNT()</b> — সংখ্যাযুক্ত cell গোনে</li><li><b>COUNTA()</b> — খালি নয় এমন cell গোনে</li><li><b>COUNTIF()</b> — শর্তসাপেক্ষে গোনে</li><li><b>SUMIF()</b> — শর্তসাপেক্ষে যোগ করে</li><li><b>IF()</b> — শর্ত অনুযায়ী ফলাফল দেখায়</li><li><b>VLOOKUP()</b> — column থেকে মান খুঁজে আনে</li><li><b>HLOOKUP()</b> — row থেকে মান খুঁজে আনে</li><li><b>INDEX + MATCH</b> — VLOOKUP-এর flexible বিকল্প</li><li><b>TEXTJOIN()</b> — একাধিক text জোড়া লাগায়</li><li><b>TRIM()</b> — অতিরিক্ত space সরায়</li><li><b>LEN()</b> — text-এর length বের করে</li><li><b>LEFT / RIGHT / MID</b> — text-এর অংশ বিশেষ কাটে</li><li><b>TODAY() / NOW()</b> — বর্তমান তারিখ/সময়</li><li><b>DATEDIF()</b> — দুই তারিখের ব্যবধান</li><li><b>ROUND()</b> — সংখ্যা রাউন্ড করে</li><li><b>IFERROR()</b> — error হলে বিকল্প মান দেখায়</li><li><b>SUBTOTAL()</b> — filtered data-র হিসাব</li><li><b>PMT()</b> — ঋণের কিস্তি হিসাব করে</li></ul>"],
["প্রতিদিন কাজে লাগে এমন Keyboard Shortcut","<ul><li><b>Ctrl+Arrow</b> — data-র শেষ পর্যন্ত এক লাফে যাওয়া</li><li><b>Ctrl+Shift+L</b> — Filter চালু/বন্ধ করা</li><li><b>Alt+=</b> — দ্রুত SUM বসানো</li><li><b>Ctrl+;</b> — আজকের তারিখ বসানো</li><li><b>F4</b> — শেষ action আবার করা / cell reference lock করা</li><li><b>Ctrl+Shift+Arrow</b> — পুরো data range select করা</li></ul>"],
["Common Excel Error ও সমাধান","<b>#DIV/0!</b> — শূন্য দিয়ে ভাগ হচ্ছে, IFERROR() দিয়ে ঢেকে দিন। <b>#REF!</b> — যে cell reference করা হয়েছিল সেটা delete হয়ে গেছে। <b>#N/A</b> — VLOOKUP-এ মান খুঁজে পায়নি, lookup value ঠিক আছে কিনা চেক করুন। <b>#VALUE!</b> — ভুল data type (যেমন text-কে number হিসেবে যোগ করা)।"],
["পরামর্শ","প্রতিটি formula আলাদা আলাদা ছোট ডেটাসেটে practice করুন, তারপর আসল কাজে প্রয়োগ করুন।"]
],null],
["tally-journal-entry","Tally Journal Entry কী?","Debit-credit ও journal entry বোঝার সহজ guide।",[
["Journal Entry কী","Tally-তে Journal Entry ব্যবহার হয় এমন transaction record করতে যেগুলো সরাসরি Cash বা Bank-এর সাথে জড়িত নয় — যেমন Depreciation, Adjustment বা Provision entry।"],
["Debit-Credit-এর মূল নিয়ম","প্রতিটি entry-তে অন্তত একটি account Debit এবং একটি account Credit হবে, এবং Debit-এর মোট সবসময় Credit-এর মোট সমান হতে হবে। Assets/Expenses বাড়লে Debit, কমলে Credit; Liabilities/Income/Capital বাড়লে Credit, কমলে Debit।"],
["উদাহরণ","মাস শেষে ৫,০০০ টাকা Depreciation ধরতে হলে entry হবে: Depreciation A/c Dr. ৫,০০০ — To Fixed Assets A/c ৫,০০০।"],
["Voucher Type-এর পার্থক্য","Tally-তে একাধিক Voucher Type থাকে — <b>Payment</b> (টাকা বের হলে), <b>Receipt</b> (টাকা এলে), <b>Contra</b> (Cash ও Bank-এর মধ্যে transfer), এবং <b>Journal</b> (Cash/Bank জড়িত নয় এমন adjustment)। সঠিক voucher type বেছে নিলে report ও ledger পরিষ্কার থাকে।"],
["সাধারণ ভুল যা এড়ানো উচিত","Cash/Bank জড়িত transaction-এ Journal voucher ব্যবহার করা, Narration না লেখা, এবং Debit-Credit total না মেলা সত্ত্বেও জোর করে save করা — এই ভুলগুলো পরে হিসাব মেলাতে সমস্যা তৈরি করে।"],
["Tally-তে কীভাবে করবেন","Gateway of Tally → Accounting Vouchers → F7 (Journal) চেপে entry দিন, Debit account সিলেক্ট করে amount দিন, তারপর Credit account সিলেক্ট করুন। Narration-এ কারণ লিখে রাখুন যাতে পরে বোঝা যায়।"]
],"profit-loss-calculator"],
["pdf-size-komano","PDF Size কমানোর নিয়ম","Online ও browser-based PDF workflow নিয়ে সহজ guide।",[
["কেন PDF size কমানো দরকার","Email attachment limit, website upload limit বা ধীর internet-এ বড় PDF পাঠানো/আপলোড করা কষ্টকর। Size কমালে share করা সহজ হয়।"],
["Size বাড়ার কারণ","সাধারণত high-resolution ছবি, scanned page বা embedded font-ই PDF-কে ভারী করে তোলে। Text-only PDF সাধারণত ছোট থাকে।"],
["Browser-based সহজ সমাধান","কোনো software install না করেই আমাদের PDF to JPG tool দিয়ে PDF-এর page গুলোকে ছবি হিসেবে বের করে, প্রয়োজনমতো compress করে আবার ব্যবহার করতে পারেন। পুরো process browser-এই হয়, ফাইল কোথাও upload হয় না — privacy বজায় থাকে।"],
["আরও কিছু উপায়","Word/PowerPoint থেকে PDF বানানোর সময় ছবি আগে থেকেই compress করে রাখুন। একাধিক page-এর scan একসাথে না করে, দরকারি page গুলো আলাদা করে scan করুন। Font embedding প্রয়োজন না হলে বন্ধ রাখুন।"],
["PDF Security ও Password টিপস","গুরুত্বপূর্ণ PDF শেয়ার করার আগে Password বা Watermark যোগ করে নেওয়া ভালো, বিশেষত financial বা personal document-এর ক্ষেত্রে। Public link-এ আপলোড করার আগে দুইবার ভাবুন — sensitive তথ্য থাকলে email-এ সরাসরি পাঠানো নিরাপদ।"],
["অতিরিক্ত টিপস","Scan করার সময় Resolution ১৫০–২০০ DPI-এর মধ্যে রাখুন (৩০০+ DPI অকারণে size বাড়ায়), এবং যেখানে সম্ভব color-এর বদলে grayscale scan ব্যবহার করুন।"]
],"pdf-to-jpg"],
["website-theke-income","Website থেকে কীভাবে আয় করা যায়?","Ads, affiliate ও useful tools দিয়ে website monetization-এর roadmap।",[
["কীভাবে একটি website থেকে আয় হয়","Website থেকে আয়ের মূল উৎস কয়েকটি: বিজ্ঞাপন (Google AdSense), Affiliate marketing, নিজের product/service বিক্রি, এবং Sponsored content।"],
["Ads দিয়ে আয়","Google AdSense-এর মতো ad network website-এ বিজ্ঞাপন দেখিয়ে visitor-প্রতি ছোট অংকের আয় দেয়। এর জন্য নিয়মিত organic traffic ও ভালো content দরকার — তাই SEO গুরুত্বপূর্ণ।"],
["Affiliate marketing","কোনো পণ্য/সেবার লিংক শেয়ার করে সেই লিংক দিয়ে বিক্রি হলে commission পাওয়া যায়। Tool বা blog site-এ প্রাসঙ্গিক product suggest করে এই আয় করা যায়।"],
["কত Traffic দরকার আয় শুরু করতে","নির্দিষ্ট কোনো সংখ্যা নেই, তবে বেশিরভাগ Ad network-এ আবেদনের জন্য ন্যূনতম কিছু নিয়মিত visitor ও organic content দরকার হয়। শুরুতে আয় কম হলেও ধারাবাহিক ভালো content ও SEO-এর মাধ্যমে ধীরে ধীরে traffic ও আয় দুটোই বাড়ে।"],
["Bangladesh-এ Payment নেওয়ার উপায়","আন্তর্জাতিক ad network বা client থেকে আয় আনতে Payoneer, Wise-এর মতো platform ব্যবহার হয়, যেখান থেকে সরাসরি local bank বা bKash-এ টাকা তোলা যায়। Freelance কাজের জন্য bKash/Nagad-এ সরাসরি local client payment নেওয়াও সাধারণ।"],
["Useful tools দিয়ে audience তৈরি","BanglaSmartTools-এর মতো free, প্রতিদিনের কাজে লাগে এমন tool মানুষকে বারবার ফিরিয়ে আনে, যা দীর্ঘমেয়াদে traffic ও আয় দুটোই বাড়ায়।"],
["বাস্তবতা","আয় শুরু হতে সময় লাগে — ধারাবাহিকভাবে ভালো content ও tool যোগ করা এবং real audience তৈরি করাই দীর্ঘমেয়াদী সাফল্যের চাবিকাঠি।"]
],null],
["bmi-ki-o-sustho-wjon","BMI কী এবং স্বাস্থ্যকর ওজন কীভাবে বুঝবেন","BMI হিসাবের নিয়ম, category ও এর সীমাবদ্ধতা।",[
["BMI কী","BMI (Body Mass Index) হলো উচ্চতা ও ওজনের অনুপাত থেকে বের করা একটি সংখ্যা, যা দিয়ে মোটামুটিভাবে বোঝা যায় কারও ওজন স্বাস্থ্যকর সীমার মধ্যে আছে কিনা।"],
["হিসাবের নিয়ম","BMI = ওজন (kg) ÷ (উচ্চতা (m) × উচ্চতা (m))। যেমন কারও ওজন ৭০ kg এবং উচ্চতা ১.৭৫ m হলে BMI = ৭০ ÷ (১.৭৫×১.৭৫) ≈ ২২.৯।"],
["BMI Category","সাধারণভাবে ব্যবহৃত সীমা: ১৮.৫-এর নিচে Underweight, ১৮.৫–২৪.৯ Normal, ২৫–২৯.৯ Overweight, এবং ৩০ বা তার বেশি Obese হিসেবে ধরা হয়।"],
["BMI-এর সীমাবদ্ধতা","BMI পেশী ও চর্বির পার্থক্য বোঝে না — তাই খুব পেশীবহুল মানুষের BMI বেশি দেখাতে পারে যদিও তার শরীরে চর্বি কম। এটি একটি সাধারণ screening indicator মাত্র, চূড়ান্ত স্বাস্থ্য নির্ণয় নয়।"],
["দ্রুত হিসাবের জন্য","আমাদের BMI Calculator-এ শুধু উচ্চতা ও ওজন দিলেই সেকেন্ডে BMI বের হয়ে যায়, হাতে হিসাব করার দরকার নেই।"]
],"bmi-calculator"],
["emi-loan-nawar-age","EMI Calculator: লোন নেওয়ার আগে যা জানা দরকার","EMI কীভাবে হিসাব হয় এবং লোন নেওয়ার আগে কী দেখা উচিত।",[
["EMI কী","EMI (Equated Monthly Installment) হলো লোনের প্রতি মাসে পরিশোধযোগ্য নির্দিষ্ট অংক, যার মধ্যে আসল (Principal) ও সুদ (Interest) দুটোই থাকে।"],
["হিসাবের Formula","EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), যেখানে P = Loan amount, r = মাসিক সুদের হার (বার্ষিক হার ÷ ১২ ÷ ১০০), এবং n = মোট মাসের সংখ্যা।"],
["উদাহরণ","৫,০০,০০০ টাকার লোন, বার্ষিক সুদ ১২%, মেয়াদ ৩৬ মাস হলে মাসিক EMI মোটামুটি ১৬,৬০০ টাকার কাছাকাছি হবে — সঠিক সংখ্যার জন্য calculator ব্যবহার করাই সহজ।"],
["লোন নেওয়ার আগে যা দেখা উচিত","শুধু EMI-এর অংক নয়, মোট কত সুদ দিতে হচ্ছে (Total Interest), Processing Fee, Early Settlement Charge এবং মাসিক আয়ের সাথে EMI-এর অনুপাত (সাধারণত আয়ের ৪০-৫০%-এর বেশি EMI না রাখাই ভালো) — এগুলো বিবেচনা করা জরুরি।"],
["দ্রুত হিসাবের জন্য","আমাদের EMI Calculator-এ Loan amount, সুদের হার ও মেয়াদ দিলেই মাসিক কিস্তি সাথে সাথে দেখা যায়।"]
],"emi-calculator"],
["strong-password-niyom","Strong Password তৈরির নিয়ম","নিরাপদ পাসওয়ার্ড তৈরি ও ব্যবস্থাপনার practical guide।",[
["দুর্বল পাসওয়ার্ড কেন বিপদজনক","নাম, জন্মতারিখ বা 123456-এর মতো সহজ পাসওয়ার্ড কয়েক সেকেন্ডেই অনুমান বা crack করা সম্ভব। একবার একটি account hack হলে একই পাসওয়ার্ড ব্যবহৃত অন্য সব account-ও ঝুঁকিতে পড়ে।"],
["Strong Password-এর বৈশিষ্ট্য","কমপক্ষে ১২-১৬ character, uppercase+lowercase+সংখ্যা+special character-এর মিশ্রণ, এবং কোনো অভিধানের শব্দ বা ব্যক্তিগত তথ্য (নাম, জন্মতারিখ) না থাকা।"],
["প্রতিটি Account-এ আলাদা Password","একই পাসওয়ার্ড একাধিক জায়গায় ব্যবহার করলে একটি site hack হলেই বাকি সব account বিপদে পড়ে। Password Manager ব্যবহার করলে প্রতিটির জন্য আলাদা strong password মনে রাখার দরকার হয় না।"],
["Two-Factor Authentication (2FA)","শুধু password-ই যথেষ্ট নয় — যেখানে সম্ভব 2FA চালু রাখুন, যাতে password জানা থাকলেও দ্বিতীয় ধাপ (OTP/Authenticator app) ছাড়া কেউ ঢুকতে না পারে।"],
["দ্রুত Password তৈরির জন্য","আমাদের Password Generator দিয়ে এক ক্লিকে random, unpredictable strong password তৈরি করে নিন — length নিজের মতো ঠিক করে নেওয়া যায়।"]
],"password-generator"],
["qr-code-ki","QR Code কী এবং কীভাবে কাজ করে","QR Code-এর ব্যবহার, সুবিধা ও তৈরির নিয়ম।",[
["QR Code কী","QR (Quick Response) Code হলো এক ধরনের 2D barcode যা text, URL, WiFi তথ্য বা contact info-এর মতো ডেটা store করতে পারে এবং camera দিয়ে স্ক্যান করলেই সাথে সাথে পড়া যায়।"],
["কোথায় ব্যবহার হয়","Payment (bKash/Nagad QR), Restaurant menu, Business card, Product packaging-এ verification, Event ticket, এবং WiFi login — এমন অসংখ্য জায়গায় QR Code ব্যবহৃত হয়।"],
["QR Code-এর সুবিধা","টাইপ করার ঝামেলা ছাড়াই মুহূর্তে link বা তথ্য share করা যায়, printed material-এও কাজ করে, এবং তৈরি করা সম্পূর্ণ বিনামূল্যে।"],
["নিজের QR Code তৈরি করার সময় খেয়াল রাখুন","QR Code-এর মধ্যে থাকা link বা তথ্য পরে পরিবর্তন করা যায় না (static QR), তাই ছাপানোর আগে link ঠিক আছে কিনা ভালো করে যাচাই করে নিন।"],
["দ্রুত QR Code তৈরির জন্য","আমাদের QR Code Generator-এ যেকোনো text বা URL লিখে সাথে সাথে scannable QR Code পেয়ে যাবেন, download করে ব্যবহার করা যায়।"]
],"qr-generator"],
["json-ki-developer-guide","JSON কী? Developer-দের জন্য সহজ গাইড","JSON format, syntax ও ব্যবহার নিয়ে শুরুর guide।",[
["JSON কী","JSON (JavaScript Object Notation) হলো ডেটা আদান-প্রদানের একটি হালকা, human-readable format, যা key-value pair আকারে তথ্য সংরক্ষণ করে। প্রায় সব modern API-এর response এই format-এই আসে।"],
["মূল Syntax","JSON-এ ডেটা থাকে <code>{ }</code> (object) বা <code>[ ]</code> (array) আকারে। প্রতিটি key অবশ্যই double quote-এ থাকতে হবে, যেমন: <code>{\"name\":\"Ashik\",\"age\":25,\"skills\":[\"HTML\",\"CSS\"]}</code>।"],
["সাধারণ ভুল","শেষ item-এর পর অতিরিক্ত comma রাখা, key-তে single quote ব্যবহার করা, বা string-এর ভেতরের quote escape না করা — এগুলো JSON invalid করে দেয় এবং parse error দেখায়।"],
["কেন Format করা দরকার","API থেকে আসা minified JSON পড়া কঠিন। Format (indent) করলে nested structure স্পষ্ট বোঝা যায়, debugging সহজ হয়।"],
["দ্রুত Format ও Validate করতে","আমাদের JSON Formatter-এ JSON paste করে Format বাটনে চাপলেই সুন্দরভাবে indent হয়ে যায়, আর ভুল থাকলে ঠিক কোথায় সমস্যা তা error message-এ দেখায়।"]
],"json-formatter"],
["image-optimize-website","Website-এর জন্য Image Optimize করার নিয়ম","দ্রুত loading website-এর জন্য ছবি optimize করার practical টিপস।",[
["কেন Image Optimize করা জরুরি","বড় সাইজের ছবি website-কে ধীর করে দেয়, যা user experience ও Google-এর Page Speed ranking দুটোতেই negative প্রভাব ফেলে।"],
["সঠিক Format বেছে নিন","Photo-এর জন্য JPG (ছোট size), transparency দরকার হলে PNG, আর icon/logo-এর জন্য SVG সবচেয়ে ভালো। প্রয়োজনে আমাদের JPG to PNG বা PNG to JPG tool দিয়ে সহজেই format বদলানো যায়।"],
["Compress করুন","একই ছবি visually প্রায় একই রকম রেখেও file size অনেকটা কমানো সম্ভব। আমাদের Image Compressor দিয়ে upload করা ছবি সাথে সাথে compress করে ফেলা যায়, কোনো software লাগে না।"],
["সঠিক Dimension-এ Resize করুন","Website-এ যতটুকু জায়গায় ছবি দেখানো হবে, তার চেয়ে বড় resolution-এর ছবি আপলোড করার দরকার নেই। আমাদের Image Resizer দিয়ে প্রয়োজনীয় width-height-এ resize করে নিন — এতে file size আরও কমে।"],
["অতিরিক্ত টিপস","Lazy loading ব্যবহার করুন (page-এর নিচের ছবি প্রথমে load না হয়ে scroll করলে load হবে), এবং একই ছবি বারবার আলাদা সাইজে আপলোড না করে একবার optimize করেই রাখুন।"]
],"image-compressor"]];

/* ---------- Per-tool page content: About / How to use / Benefits / Tips / FAQ ---------- */
const toolContent={
"text-reverser":{
about:"এই টুল দিয়ে যেকোনো লেখা এক ক্লিকে reverse করা যায় — অক্ষরের ক্রম উল্টে অথবা শব্দের ক্রম উল্টে, দুই ভাবেই।",
how:["টেক্সট বক্সে লেখা লিখুন বা paste করুন","\u201cঅক্ষর Reverse\u201d বা \u201cশব্দের ক্রম Reverse\u201d বাটনে চাপুন","ফলাফল Copy করে নিন"],
benefits:["Palindrome চেক করতে সুবিধাজনক","Word-order reverse করে caption/স্টাইল তৈরি করা যায়","কোনো software ছাড়াই ইনস্ট্যান্ট রেজাল্ট"],
tips:["জটিল বাংলা যুক্তাক্ষর/মাত্রাযুক্ত শব্দ character-by-character reverse করলে দেখতে অস্বাভাবিক লাগতে পারে — এক্ষেত্রে Word Reverse ব্যবহার করাই ভালো।","ইংরেজি বা সাধারণ সংখ্যার জন্য Character Reverse নিখুঁতভাবে কাজ করে।"],
faq:[["এটা কি বাংলা টেক্সটেও কাজ করে?","হ্যাঁ, তবে যুক্তাক্ষরযুক্ত জটিল বাংলা শব্দে character reverse করলে ফলাফল visually কিছুটা ভিন্ন দেখাতে পারে।"],["Word order reverse কী?","এটি পুরো শব্দগুলোর ক্রম উল্টে দেয়, প্রতিটি শব্দের ভেতরের অক্ষর অপরিবর্তিত থাকে।"],["এটি কি ফাইল সেভ করে?","না, সব processing browser-এই হয়, কোনো ডেটা সার্ভারে যায় না।"]]
},
"sentence-counter":{
about:"এই টুল লেখার মধ্যে কতগুলো বাক্য, শব্দ ও অক্ষর আছে তা রিয়েল-টাইমে গণনা করে — বাংলা \u201c।\u201d এবং ইংরেজি \u201c.\u201d, \u201c!\u201d, \u201c?\u201d সবই বাক্যের শেষ চিহ্ন হিসেবে ধরা হয়।",
how:["টেক্সট বক্সে লেখা লিখুন বা paste করুন","টাইপ করার সাথে সাথেই বাক্য, শব্দ ও অক্ষর সংখ্যা দেখা যাবে","প্রয়োজনমতো লেখা সম্পাদনা করুন"],
benefits:["রচনা বা articleর গঠন বুঝতে সাহায্য করে","Assignment/thesis-এর word ও sentence limit মেনে চলতে সুবিধা","কোনো সাইন-আপ ছাড়াই তাৎক্ষণিক ফলাফল"],
tips:["গড় বাক্যে ১৫-২০ শব্দ রাখলে লেখা পড়তে সহজ হয়।","অতিরিক্ত লম্বা বাক্য ভেঙে ছোট করলে readability বাড়ে।"],
faq:[["বাক্য কীভাবে গণনা করা হয়?","।, ., !, ? চিহ্নের ভিত্তিতে বাক্য আলাদা করা হয়।"],["সংক্ষিপ্ত রূপ (যেমন Dr.) কি ভুল গণনা করবে?","এই ধরনের বিশেষ সংক্ষিপ্ত রূপে মাঝেমধ্যে এক্সট্রা বাক্য গণনা হতে পারে, চূড়ান্ত হিসেবে ম্যানুয়াল চেক করে নেওয়া ভালো।"],["Word limit-ও কি দেখা যায়?","হ্যাঁ, শব্দ ও অক্ষর সংখ্যা একসাথেই দেখানো হয়।"]]
},
"remove-duplicate-lines":{
about:"একাধিক লাইনের তালিকা থেকে হুবহু একই রকম (duplicate) লাইন বাদ দিয়ে শুধু unique লাইনগুলো রেখে দেয় এই টুল।",
how:["প্রতি লাইনে একটি করে item/লাইন লিখুন বা paste করুন","\u201cDuplicate সরান\u201d বাটনে চাপুন","ফলাফল দেখে Copy করে নিন"],
benefits:["Email/ফোন নাম্বারের তালিকা পরিষ্কার করতে দ্রুত","Excel/CSV-তে paste করার আগে duplicate বাদ দেওয়া যায়","লাইনের মূল ক্রম (প্রথম occurrence) বজায় থাকে"],
tips:["শুধু শেষের বাড়তি space বাদ দিয়ে তুলনা করা হয়, তাই ভেতরের বানান ভিন্ন হলে সেগুলো আলাদা লাইন হিসেবেই গণ্য হবে।","Case-sensitive — \u201cDhaka\u201d ও \u201cdhaka\u201d আলাদা লাইন হিসেবে গণ্য হবে।"],
faq:[["খালি লাইন কি বাদ যায়?","খালি লাইনও একটি লাইন হিসেবে গণ্য হয়, একাধিক খালি লাইন থাকলে প্রথমটি ছাড়া বাকিগুলো বাদ যাবে।"],["লাইনের ক্রম কি পরিবর্তন হয়?","না, unique লাইনগুলো তাদের প্রথম আসা অবস্থানের ক্রমেই থাকে।"],["ফাইল আপলোড করা যায় কি?","না, বর্তমানে সরাসরি টেক্সট paste করে ব্যবহার করতে হয়।"]]
},
"text-sorter":{
about:"একাধিক লাইনের তালিকা A→Z বা Z→A ক্রমে সাজিয়ে দেয় এই টুল — নাম, ঠিকানা বা যেকোনো list গোছাতে কাজে লাগে।",
how:["প্রতি লাইনে একটি item লিখুন বা paste করুন","A→Z বা Z→A বাটনে চাপুন","সাজানো ফলাফল Copy করে নিন"],
benefits:["Alphabetically sorted list তৈরি করা সহজ","বাংলা ও ইংরেজি উভয় লেখাতেই কাজ করে","কোনো Excel/Spreadsheet খোলার দরকার নেই"],
tips:["সংখ্যা দিয়ে শুরু হওয়া লাইনগুলো alphabetically নয়, বরং প্রথম অক্ষরের ভিত্তিতে সাজবে।","খালি লাইন থাকলে সেগুলো সরিয়ে নেওয়াই ভালো ফলাফল দেবে।"],
faq:[["এটা কি সংখ্যাও সঠিকভাবে সাজায়?","এটি alphabetical/lexical সাজায়, তাই বড় সংখ্যাগুলো (যেমন ১০০ বনাম ৯) numeric ক্রমে নাও আসতে পারে।"],["বাংলা লেখা কি ঠিকভাবে সাজে?","হ্যাঁ, বাংলা বর্ণমালা অনুযায়ী sort করা হয়।"],["সাজানোর পর আগের ক্রম ফিরে পাওয়া যাবে?","না, তাই সাজানোর আগে মূল লেখা আলাদা করে রাখা ভালো।"]]
},
"time-calculator":{
about:"দুইটি সময় (ঘণ্টা:মিনিট) দিলে তাদের মধ্যে কত ঘণ্টা-মিনিট ব্যবধান তা এই টুল বের করে দেয় — কাজের সময়, শিফট বা মিটিং দৈর্ঘ্য হিসাব করতে কাজে লাগে।",
how:["শুরুর সময় সিলেক্ট করুন","শেষ সময় সিলেক্ট করুন","\u201cব্যবধান বের করুন\u201d বাটনে চাপুন"],
benefits:["Office/শিফটের কাজের সময় দ্রুত হিসাব করা যায়","Overnight (মধ্যরাত পার হওয়া) সময়ও সঠিকভাবে গণনা হয়","হাতে হিসাবের ভুল এড়ানো যায়"],
tips:["শেষ সময় শুরুর সময়ের চেয়ে ছোট হলে এটি পরের দিনের সময় ধরে নিয়ে হিসাব করে (২৪ ঘণ্টা যোগ করে)।","দিন পার হওয়া শিফটের জন্য এই ব্যবহারই সবচেয়ে সহজ।"],
faq:[["সেকেন্ড হিসাব করা যায় কি?","না, বর্তমানে ঘণ্টা ও মিনিট পর্যন্ত সাপোর্ট করে।"],["একাধিক দিনের ব্যবধান বের করতে চাইলে?","তারিখসহ ব্যবধানের জন্য আমাদের Date Calculator ব্যবহার করুন।"],["মধ্যরাত পার হওয়া শিফট কি ঠিকভাবে হিসাব হয়?","হ্যাঁ, যেমন রাত ১০টা থেকে সকাল ৬টা দিলে সঠিকভাবে ৮ ঘণ্টা দেখাবে।"]]
},
"bkash-charge-calculator":{
about:"bKash-এ Cash Out করলে কত চার্জ কাটবে তা এই টুল সাথে সাথে হিসাব করে দেয় — Standard Agent ও Priyo Agent/ATM, দুই রকম রেটই সাপোর্ট করে।",
how:["Cash Out-এর পরিমাণ লিখুন","Agent-এর ধরন বেছে নিন (Standard বা Priyo/ATM)","চার্জ ও হাতে পাওয়া টাকা দেখুন"],
benefits:["Agent-এ যাওয়ার আগেই সঠিক চার্জ জানা যায়","Priyo Agent ব্যবহারে কত সাশ্রয় হয় তা তুলনা করা যায়","কোনো app খোলার দরকার নেই"],
tips:["দুইটা নম্বরকে Priyo Agent হিসেবে সেট করলে মাসে ৫০,০০০ টাকা পর্যন্ত কম চার্জে (১.৪৯%) Cash Out করা যায়, তার বেশি হলে standard রেট (১.৮৫%) প্রযোজ্য হয়।","চার্জ সবসময় পরিবর্তনযোগ্য — bKash app-এ transaction confirm করার আগে দেখানো charge-ই চূড়ান্ত ধরুন।"],
faq:[["bKash cash out চার্জ কত?","Standard Agent-এ প্রতি হাজারে প্রায় ১৮.৫০ টাকা (১.৮৫%), আর Priyo Agent বা ATM-এ প্রায় ১৪.৯০ টাকা (১.৪৯%)।"],["Priyo Agent কী?","আপনি ২টি bKash Agent নম্বরকে \u201cপ্রিয়\u201d হিসেবে সেট করতে পারেন, যেখান থেকে কম চার্জে মাসে ৫০,০০০ টাকা পর্যন্ত Cash Out করা যায়।"],["এই হিসাব কি সবসময় সঠিক থাকবে?","চার্জ সময়ে সময়ে পরিবর্তিত হয়, তাই চূড়ান্ত সিদ্ধান্তের আগে bKash app বা official সোর্স দেখে নিশ্চিত হয়ে নিন।"]]
},
"nagad-charge-calculator":{
about:"Nagad-এ Cash Out করলে App বা USSD (*167#) — কোন মাধ্যমে কত চার্জ কাটবে তা এই টুল হিসাব করে দেয়।",
how:["Cash Out-এর পরিমাণ লিখুন","মাধ্যম বেছে নিন (App বা USSD)","চার্জ ও হাতে পাওয়া টাকা দেখুন"],
benefits:["App ও USSD-এর চার্জ তুলনা করে সাশ্রয়ী মাধ্যম বেছে নেওয়া যায়","দ্রুত, কোনো লগইনের দরকার নেই"],
tips:["App দিয়ে Cash Out করলে USSD-এর চেয়ে কম চার্জ কাটে, তাই ইন্টারনেট থাকলে App ব্যবহার করাই ভালো।"],
faq:[["Nagad cash out চার্জ কত?","App দিয়ে প্রতি হাজারে প্রায় ১২.৫০ টাকা (১.২৫%), আর USSD (*167#) দিয়ে প্রায় ১৫ টাকা (১.৫%)।"],["Islamic account-এও কি একই চার্জ?","হ্যাঁ, নিয়মিত ও Islamic উভয় account-এই একই হার প্রযোজ্য।"],["চার্জ কি পরিবর্তন হতে পারে?","হ্যাঁ, তাই লেনদেনের সময় Nagad app-এ দেখানো charge-কেই চূড়ান্ত ধরুন।"]]
},
"rocket-charge-calculator":{
about:"Dutch-Bangla Bank-এর Rocket সার্ভিসে Cash Out করলে Agent বা DBBL ATM/Branch — কোন মাধ্যমে কত চার্জ কাটবে তা এই টুল হিসাব করে দেয়।",
how:["Cash Out-এর পরিমাণ লিখুন","মাধ্যম বেছে নিন (Agent বা DBBL ATM/Branch)","চার্জ ও হাতে পাওয়া টাকা দেখুন"],
benefits:["ATM ব্যবহার করলে কত সাশ্রয় হয় তা সহজে বোঝা যায়","Salary Account হোল্ডারদের জন্য বিশেষ তথ্যও দেওয়া আছে"],
tips:["DBBL ATM/Branch থেকে Cash Out করলে Agent-এর তুলনায় চার্জ প্রায় অর্ধেক (০.৯%)।","Salary Account থাকলে DBBL ATM থেকে Cash Out সম্পূর্ণ ফ্রি হতে পারে — নিজের account type নিশ্চিত করে নিন।"],
faq:[["Rocket cash out চার্জ কত?","General Account-এ Agent থেকে প্রায় ১.৬৭% (হাজারে ১৬.৭০ টাকা), আর DBBL ATM/Branch থেকে প্রায় ০.৯% (হাজারে ৯ টাকা)।"],["Salary Account হলে কী সুবিধা?","Salary Account হোল্ডাররা DBBL ATM থেকে সাধারণত বিনামূল্যে Cash Out করতে পারেন।"],["এই রেট কি সব সময় ঠিক থাকে?","না, DBBL সময়ে সময়ে চার্জ পরিবর্তন করতে পারে — Rocket app-এ চূড়ান্ত চার্জ দেখে নিন।"]]
},
"income-tax-calculator":{
about:"বাংলাদেশের ব্যক্তিগত (individual) income tax-এর progressive slab অনুযায়ী আনুমানিক কর হিসাব করে এই টুল — এটি শুধুমাত্র প্রাথমিক ধারণার জন্য, চূড়ান্ত return filing নয়।",
how:["আপনার বার্ষিক করযোগ্য আয় লিখুন","Taxpayer category বেছে নিন (General/নারী ও প্রবীণ/প্রতিবন্ধী)","আনুমানিক tax দেখুন"],
benefits:["ট্যাক্স প্ল্যানিং-এর আগে দ্রুত ধারণা পাওয়া যায়","বিভিন্ন আয়ের স্তরে কর কেমন বাড়ে তা বোঝা সহজ হয়"],
tips:["Investment rebate (approved খাতে বিনিয়োগের ১৫%) এই হিসাবে যোগ করা হয়নি — প্রকৃত করদায় এর চেয়ে কম হতে পারে।","চূড়ান্ত filing-এর আগে অবশ্যই NBR-এর official website (nbr.gov.bd) বা tax consultant-এর সাথে যাচাই করে নিন, কারণ প্রতি বছর বাজেটে slab পরিবর্তন হতে পারে।"],
faq:[["Tax-free সীমা কত?","সাধারণ করদাতাদের জন্য বার্ষিক ৩,৭৫,০০০ টাকা পর্যন্ত আয়কর-মুক্ত (নারী/৬৫+ বছর: ৪,২৫,০০০, প্রতিবন্ধী/তৃতীয় লিঙ্গ: ৫,০০,০০০)।"],["সর্বোচ্চ tax rate কত?","সর্বোচ্চ ৩০%, যা সবচেয়ে উপরের স্তরের আয়ে প্রযোজ্য।"],["এই হিসাব কি চূড়ান্ত?","না, এটি আনুমানিক estimation মাত্র — rebate, minimum tax ও বিশেষ নিয়ম বিবেচনা করে চূড়ান্ত হিসাব NBR বা tax professional-এর মাধ্যমে করানো উচিত।"]]
},
"electricity-bill-calculator":{
about:"মাসিক ব্যবহৃত ইউনিট (kWh) দিলে BERC-এর residential (LT-A) স্ল্যাব রেট অনুযায়ী আনুমানিক বিদ্যুৎ বিল হিসাব করে দেয় এই টুল।",
how:["মাসে ব্যবহৃত ইউনিট (kWh) লিখুন","চাইলে sanctioned load (kW) দিন demand charge-এর জন্য","আনুমানিক বিল দেখুন"],
benefits:["মিটার রিডিং থেকেই মোটামুটি বিল অনুমান করা যায়","কোন স্ল্যাবে কত ইউনিট পড়ছে তা ভেঙে দেখানো হয়"],
tips:["বাংলাদেশে বিদ্যুৎ বিল cumulative slab পদ্ধতিতে হিসাব হয় — অর্থাৎ পুরো বিল সর্বোচ্চ রেটে নয়, ধাপে ধাপে বাড়ে।","এই হিসাবে Demand Charge, Meter Rent ও VAT আনুমানিকভাবে যোগ করা হয়েছে — DESCO/DPDC/NESCO/BPDB এলাকাভেদে ছোটখাটো পার্থক্য থাকতে পারে, প্রকৃত বিলের সাথে সামান্য তফাত হতে পারে।"],
faq:[["ইউনিট প্রতি দাম কত?","স্ল্যাব অনুযায়ী ভিন্ন — প্রথম ৫০ ইউনিট সবচেয়ে কম রেটে, তারপর ব্যবহার বাড়লে ধাপে ধাপে রেট বাড়ে (সর্বোচ্চ প্রায় ১৭.৩৫ টাকা/ইউনিট, ৬০০ ইউনিটের বেশি ব্যবহারে)।"],["VAT কি আলাদাভাবে যোগ হয়?","হ্যাঁ, energy charge-এর উপর ৫% VAT যোগ করা হয়।"],["সব বিতরণ কোম্পানির (DESCO/DPDC ইত্যাদি) রেট কি একই?","মূল ইউনিট রেট BERC কর্তৃক জাতীয়ভাবে নির্ধারিত, তাই মূলত একই থাকে — তবে meter rent বা সার্ভিস চার্জে সামান্য পার্থক্য থাকতে পারে।"]]
},
"ssc-hsc-gpa-calculator":{
about:"প্রতিটি বিষয়ের গ্রেড পয়েন্ট দিলে বাংলাদেশ শিক্ষা বোর্ডের মান অনুযায়ী গড় GPA বের করে দেয় এই টুল — SSC ও HSC উভয়ের জন্য একই পদ্ধতি।",
how:["প্রতিটি বিষয়ের Grade Point (0 থেকে 5) লিখুন, কমা দিয়ে আলাদা করে","\u201cGPA বের করুন\u201d বাটনে চাপুন","গড় GPA দেখুন"],
benefits:["দ্রুত নিজের সম্ভাব্য GPA অনুমান করা যায়","একাধিক বিষয়ের গ্রেড একসাথে গড় করা সহজ"],
tips:["গ্রেডিং স্কেল: A+ (৮০-১০০) = 5.00, A (৭০-৭৯) = 4.00, A- (৬০-৬৯) = 3.50, B (৫০-৫৯) = 3.00, C (৪০-৪৯) = 2.00, D (৩৩-৩৯) = 1.00, F (০-৩২) = 0.00।","৪র্থ বিষয়ের অতিরিক্ত পয়েন্ট যোগ করার নিয়ম বোর্ড ভেদে কিছুটা ভিন্ন হতে পারে, তাই এই টুল সরল গড় দেখায় — চূড়ান্ত ফলাফলের জন্য বোর্ডের নিয়ম অনুসরণ করুন।"],
faq:[["এই হিসাব কি official result-এর মতো নির্ভুল?","এটি একটি সাধারণ গড় হিসাব, ৪র্থ বিষয়ের বিশেষ নিয়ম বা bonus point এখানে যোগ করা হয় না, তাই official result-এর সাথে সামান্য পার্থক্য হতে পারে।"],["কোনো বিষয়ে F থাকলে?","F (0.00) থাকলেও গড়ে যোগ হবে, তবে বাস্তবে যেকোনো বিষয়ে F মানে সেই বিষয়ে fail — সামগ্রিক ফলাফলে ভিন্ন নিয়ম প্রযোজ্য হতে পারে।"],["GPA 5 পেতে হলে কী লাগে?","সবগুলো বিষয়ে A+ (Grade Point 5.00) পেতে হবে।"]]
},
"cgpa-calculator":{
about:"প্রতিটি কোর্সের Credit Hour ও Grade Point দিলে Credit-weighted CGPA হিসাব করে দেয় এই টুল — বিশ্ববিদ্যালয়ের সেমিস্টার বা সামগ্রিক CGPA বের করতে ব্যবহার করা যায়।",
how:["প্রতিটি কোর্সের জন্য Credit Hour ও Grade Point লিখুন","প্রয়োজনে আরও কোর্স যোগ করুন","CGPA হিসাব করুন"],
benefits:["Credit hour ভিন্ন হলেও সঠিক weighted average পাওয়া যায়","সেমিস্টার শেষে দ্রুত CGPA যাচাই করা যায়"],
tips:["CGPA = (প্রতিটি কোর্সের Credit × Grade Point-এর সমষ্টি) ÷ (মোট Credit)।","আপনার বিশ্ববিদ্যালয়ের নিজস্ব grading policy (যেমন repeat course নিয়ম) থাকলে চূড়ান্ত হিসাবে তা বিবেচনা করুন।"],
faq:[["Credit hour কী?","প্রতিটি কোর্সের ওজন বা গুরুত্ব বোঝাতে ব্যবহৃত সংখ্যা, সাধারণত সপ্তাহে ক্লাসের ঘণ্টার সাথে সম্পর্কিত।"],["F গ্রেড পাওয়া কোর্স কি হিসাবে ধরা হয়?","হ্যাঁ, এই ক্যালকুলেটরে Grade Point 0 দিয়ে দিলে তা গড়ে অন্তর্ভুক্ত হবে।"],["Repeat করা কোর্স কীভাবে হিসাব করব?","আপনার বিশ্ববিদ্যালয়ের নিয়ম অনুযায়ী শুধু সর্বশেষ বা সর্বোচ্চ grade যোগ করুন, প্রয়োজনে পুরনো কোর্সটি বাদ দিয়ে হিসাব করুন।"]]
},
"html-formatter":{
about:"এই টুল minified বা এলোমেলো HTML code-কে সুন্দরভাবে indent করে পড়ার উপযোগী করে দেয়।",
how:["HTML code paste করুন","\u201cFormat\u201d বাটনে চাপুন","Indent করা ফলাফল Copy করে নিন"],
benefits:["Minified HTML পড়া ও debug করা সহজ হয়","Nested tag-এর structure স্পষ্ট বোঝা যায়"],
tips:["খুব জটিল বা malformed HTML-এ (যেমন bare/unclosed tag) indentation সবসময় নিখুঁত নাও হতে পারে — গুরুত্বপূর্ণ কাজের আগে ফলাফল চোখে দেখে চেক করে নিন।"],
faq:[["এটা কি HTML validate করে?","না, এটি শুধু readable ভাবে সাজায়, syntax ভুল ধরে না।"],["Inline JS/CSS-ও কি format হয়?","script/style ট্যাগের ভেতরের কনটেন্ট অপরিবর্তিত থাকে, শুধু HTML tag structure indent হয়।"],["Minify করা যাবে কি?","এই টুল শুধু format/indent করে, minify করতে চাইলে অন্য tool দরকার।"]]
},
"css-minifier":{
about:"এই টুল CSS code থেকে comment ও অপ্রয়োজনীয় space/newline বাদ দিয়ে ছোট আকারে নিয়ে আসে — production-এ ব্যবহারের আগে file size কমাতে সাহায্য করে।",
how:["CSS code paste করুন","\u201cMinify\u201d বাটনে চাপুন","ফলাফল Copy করে নিন"],
benefits:["CSS file size কমে, page load দ্রুত হয়","Comment ও extra whitespace সহজেই সরানো যায়"],
tips:["Minify করার আগে মূল (unminified) CSS file আলাদা করে রেখে দিন, যাতে পরে সহজে edit করতে পারেন।"],
faq:[["এটা কি CSS-এর মধ্যে ভুল থাকলে ধরিয়ে দেয়?","না, এটি শুধু whitespace/comment সরায়, syntax validate করে না।"],["Variable বা custom property কি ঠিক থাকে?","হ্যাঁ, শুধু whitespace ও comment বাদ যায়, actual rule/value অপরিবর্তিত থাকে।"],["আসল production-grade minifier-এর মতো ছোট হবে কি?","এটি একটি হালকা, নিরাপদ minifier — সর্বোচ্চ compression-এর জন্য build-tool ভিত্তিক minifier (যেমন cssnano) বেশি কার্যকর।"]]
},
"js-minifier":{
about:"এই টুল JavaScript code থেকে comment ও অতিরিক্ত ফাঁকা জায়গা নিরাপদে বাদ দেয় — string/template literal-এর ভেতরের content অক্ষত রেখে।",
how:["JS code paste করুন","\u201cProcess\u201d বাটনে চাপুন","ফলাফল Copy করে নিন"],
benefits:["Comment ও ফাঁকা লাইন সরিয়ে code আরেকটু compact হয়","String/template literal-এর ভেতরের টেক্সট নিরাপদে অক্ষত থাকে"],
tips:["এটি variable rename বা aggressive minification করে না (production build-এর জন্য Terser/esbuild-এর মতো সঠিক tool ব্যবহার করুন) — শুধু নিরাপদে comment/whitespace সরায়।","Regex literal-এ (/ .../) মাঝেমধ্যে edge-case থাকতে পারে — ব্যবহারের আগে output চালিয়ে verify করে নিন।"],
faq:[["এটা কি পুরোপুরি safe?","String ও template literal-এর ভেতরের কনটেন্ট অক্ষুণ্ণ রেখে comment/whitespace সরানো হয়, তবে জটিল regex literal-এ বিরল edge case হতে পারে — output test করে নেওয়াই নিরাপদ।"],["Variable name ছোট করে দেয় কি?","না, এই টুল rename/mangle করে না — শুধু comment ও whitespace সরায়।"],["Production-এর জন্য যথেষ্ট কি?","ছোট script-এর জন্য যথেষ্ট, তবে বড় production app-এ dedicated bundler/minifier ব্যবহার করাই ভালো।"]]
},
"image-to-webp":{
about:"এই টুল JPG/PNG ছবিকে আধুনিক WebP format-এ রূপান্তর করে, যা একই মানে সাধারণত ছোট file size দেয়।",
how:["ছবি upload করুন","স্বয়ংক্রিয়ভাবে WebP-তে রূপান্তরিত হবে","Download করুন"],
benefits:["Website-এর জন্য ছোট, দ্রুত-লোড হওয়া ছবি তৈরি হয়","Modern browser-এ ভালো compression পাওয়া যায়"],
tips:["সব পুরনো software বা কিছু old device WebP সাপোর্ট নাও করতে পারে — প্রয়োজনে fallback হিসেবে JPG/PNG রেখে দিন।"],
faq:[["WebP কী?","Google-এর তৈরি একটি আধুনিক ছবি format, যা JPG/PNG-এর তুলনায় কম জায়গায় ভালো quality দেয়।"],["Quality কমে যাবে কি?","সাধারণত visually প্রায় একই থাকে, তবে অতিরিক্ত compression-এ সামান্য পার্থক্য হতে পারে।"],["সব browser-এ কি WebP চলে?","প্রায় সব modern browser সাপোর্ট করে, তবে খুব পুরনো software-এ সমস্যা হতে পারে।"]]
},
"webp-to-jpg":{
about:"এই টুল WebP ছবিকে সব জায়গায় সহজে ব্যবহারযোগ্য JPG format-এ রূপান্তর করে।",
how:["WebP ছবি upload করুন","স্বয়ংক্রিয়ভাবে JPG-তে রূপান্তরিত হবে","Download করুন"],
benefits:["যেসব software/website WebP সাপোর্ট করে না, সেখানে ব্যবহারযোগ্য হয়ে যায়","Universal compatibility পাওয়া যায়"],
tips:["JPG transparency সাপোর্ট করে না, তাই WebP-তে transparent অংশ থাকলে সাদা background-এ পরিণত হবে।"],
faq:[["Transparency থাকলে কী হয়?","JPG-তে transparency নেই, তাই transparent অংশ সাদা রঙে পরিণত হবে — প্রয়োজনে PNG-তে convert করুন।"],["Quality loss হবে কি?","সামান্য হতে পারে, কারণ JPG lossy compression ব্যবহার করে।"],["সব browser কি WebP upload নিতে পারে?","হ্যাঁ, বেশিরভাগ আধুনিক browser WebP পড়তে পারে, তাই upload-এ সমস্যা হবে না।"]]
},
"image-cropper":{
about:"এই টুল দিয়ে ছবির অপ্রয়োজনীয় অংশ বাদ দিয়ে নির্দিষ্ট অংশ crop করে নেওয়া যায়।",
how:["ছবি upload করুন","Crop এলাকা টেনে (drag) নির্বাচন করুন","Crop করুন ও Download করুন"],
benefits:["Profile picture বা thumbnail-এর জন্য নির্দিষ্ট অংশ বেছে নেওয়া যায়","কোনো software install ছাড়াই ব্রাউজারেই করা যায়"],
tips:["Social media profile picture সাধারণত square (1:1) ratio-তে ভালো দেখায়, crop করার সময় তা মাথায় রাখুন।"],
faq:[["Crop করা ছবির quality কমে যাবে কি?","না, শুধু নির্বাচিত অংশ কাটা হয়, অবশিষ্ট অংশের quality অপরিবর্তিত থাকে।"],["একাধিকবার crop করা যায় কি?","হ্যাঁ, ফলাফল download করে আবার upload করে দ্বিতীয়বার crop করা যায়।"],["ছবি কোথাও upload/সংরক্ষণ হয় কি?","না, পুরো processing আপনার browser-এই হয়, কোনো server-এ ছবি যায় না।"]]
},
"image-metadata-viewer":{
about:"এই টুল ছবির dimension (width×height), file size, format ও last modified-এর মতো basic তথ্য দেখায়।",
how:["ছবি upload করুন","তথ্য স্বয়ংক্রিয়ভাবে দেখা যাবে"],
benefits:["Upload করার আগে ছবির exact dimension ও size যাচাই করা যায়","Website/form-এর file size limit মানছে কিনা দ্রুত বোঝা যায়"],
tips:["এই টুল basic file তথ্য দেখায় (dimension, size, type) — camera-এর EXIF তথ্য (যেমন location, camera model) দেখাতে আলাদা specialized tool দরকার।"],
faq:[["EXIF/GPS তথ্যও কি দেখায়?","না, বর্তমানে শুধু dimension, file size, format ও last modified date দেখায়।"],["তথ্য কি নির্ভুল?","হ্যাঁ, browser থেকে সরাসরি পাওয়া file তথ্য দেখানো হয়।"],["ছবি upload হয় কি কোথাও?","না, সম্পূর্ণ processing browser-এই হয়।"]]
},
"pdf-merge":{
about:"এই টুল একাধিক PDF ফাইলকে একসাথে জোড়া লাগিয়ে একটি single PDF তৈরি করে দেয়।",
how:["একাধিক PDF ফাইল select করুন (ক্রম অনুযায়ী)","\u201cMerge\u201d বাটনে চাপুন","একত্রিত PDF Download করুন"],
benefits:["একাধিক document একটি ফাইলে পাঠানো সহজ হয়ে যায়","Print বা email করার আগে সব page গুছিয়ে নেওয়া যায়"],
tips:["ফাইল যে ক্রমে select করবেন, সাধারণত সেই ক্রমেই যুক্ত হবে — merge করার আগে ক্রম নিশ্চিত করে নিন।"],
faq:[["কতগুলো PDF একসাথে merge করা যায়?","একাধিক ফাইল merge করা যায়, তবে খুব বেশি বড় ফাইলে browser-এর memory limit-এর কারণে সময় বেশি লাগতে পারে।"],["Password-protected PDF কি merge করা যাবে?","না, প্রথমে password সরিয়ে নিতে হবে।"],["ফাইল কোথাও upload হয় কি?","না, পুরো processing browser-এই হয়, কোনো ফাইল server-এ যায় না।"]]
},
"pdf-split":{
about:"এই টুল একটি PDF থেকে নির্দিষ্ট page বা page-range আলাদা করে নতুন PDF ফাইল হিসেবে বের করে দেয়।",
how:["PDF ফাইল upload করুন","কোন page/range আলাদা করতে চান তা লিখুন (যেমন 1-3)","Split করে Download করুন"],
benefits:["বড় PDF থেকে দরকারি অংশটুকু আলাদা করে পাঠানো যায়","পুরো ফাইল না পাঠিয়ে প্রাসঙ্গিক page-ই শেয়ার করা যায়"],
tips:["Page number সবসময় ১ থেকে গোনা হয় (প্রথম page = 1)।"],
faq:[["একাধিক range একসাথে split করা যায় কি?","হ্যাঁ, কমা দিয়ে একাধিক page/range উল্লেখ করা যায়, যেমন 1-2,5।"],["Split করা page-গুলো কি আলাদা আলাদা ফাইল হয়?","এই টুল নির্বাচিত page-গুলো নিয়ে একটি নতুন PDF তৈরি করে।"],["মূল ফাইল কি পরিবর্তন হয়?","না, মূল ফাইল অপরিবর্তিত থাকে, নতুন ফাইল আলাদাভাবে তৈরি হয়।"]]
},
"jpg-to-pdf":{
about:"এই টুল একাধিক ছবি (JPG/PNG) থেকে একটি PDF ফাইল তৈরি করে দেয় — প্রতিটি ছবি একটি করে page হিসেবে যুক্ত হয়।",
how:["একাধিক ছবি select করুন (ক্রম অনুযায়ী)","\u201cPDF তৈরি করুন\u201d বাটনে চাপুন","PDF ফাইল Download করুন"],
benefits:["Scan করা ছবিগুলো থেকে সহজে document PDF বানানো যায়","একাধিক ছবি একসাথে গুছিয়ে পাঠানো সহজ হয়"],
tips:["ভালো ফলাফলের জন্য ছবিগুলো একই orientation (portrait/landscape) রাখলে PDF দেখতে বেশি গোছানো লাগে।"],
faq:[["ছবির ক্রম কীভাবে ঠিক হয়?","আপনি যে ক্রমে ছবি select করবেন, PDF-এও সাধারণত সেই ক্রমেই page যুক্ত হবে।"],["ছবির quality কি অক্ষুণ্ণ থাকে?","হ্যাঁ, মূল ছবির resolution অনুযায়ী PDF-এ বসানো হয়।"],["একসাথে অনেক ছবি দেওয়া যায় কি?","হ্যাঁ, তবে খুব বেশি বা বড় সাইজের ছবিতে browser-এর memory limit-এর কারণে সময় বেশি লাগতে পারে।"]]
},
"pdf-compressor":{
about:"এই টুল PDF-এর প্রতিটি page-কে ছবি হিসেবে re-render করে নির্দিষ্ট quality-তে compress করে আবার PDF আকারে তৈরি করে দেয় — মূলত scanned বা image-heavy PDF-এর জন্য কার্যকর।",
how:["PDF upload করুন","Compression level বেছে নিন","Compress করা PDF Download করুন"],
benefits:["Scanned document-এর বড় PDF ছোট করা যায়","Email attachment limit-এর মধ্যে আনা সহজ হয়"],
tips:["এই পদ্ধতি প্রতিটি page-কে ছবিতে রূপান্তর করে, তাই মূলত scanned/image-based PDF-এ ভালো কাজ করে — যদি PDF-এ selectable/searchable text থাকে, compress করার পর সেই text আর select করা যাবে না (page ছবিতে পরিণত হবে)।","Text-heavy PDF (যেমন Word থেকে export করা) compress করলে size কমার বদলে বাড়তেও পারে — সেক্ষেত্রে compress না করাই ভালো।"],
faq:[["Text selectable থাকবে কি compress করার পর?","না, এই পদ্ধতিতে page ছবিতে রূপান্তরিত হয়, তাই text আর select/search করা যাবে না।"],["সব PDF-এর size কমবে কি?","মূলত scanned/image-heavy PDF-এর size কমে; text-only PDF-এ উল্টো size বাড়তে পারে।"],["Quality কতটা কমে?","আপনি যে compression level বেছে নেবেন তার উপর নির্ভর করে — বেশি compression মানে ছোট size কিন্তু কম quality।"]]
},
"bijoy-unicode-converter":{
about:"পুরনো Bijoy ANSI keyboard layout-এ লেখা বাংলা টেক্সটকে আধুনিক Unicode বাংলায় রূপান্তরের জন্য এই টুল পরিকল্পনা করা হয়েছে — তবে নির্ভুল mapping table verify না হওয়া পর্যন্ত এটি এখনো চালু করা হয়নি।",
how:["এই মুহূর্তে টুলটি সক্রিয় নয়","বিকল্প হিসেবে Avro Converter বা OpenBangla Keyboard ব্যবহার করুন","আমরা verified mapping table যোগ হলে এখানে আপডেট করব"],
benefits:["ভবিষ্যতে চালু হলে পুরনো Bijoy document সহজে Unicode-এ আনা যাবে","এখন ভুল/garbled রূপান্তর দেখিয়ে বিভ্রান্ত করার বদলে honest থাকা হয়েছে"],
tips:["Bijoy-Unicode রূপান্তরে অসংখ্য ছোট নিয়ম (pre-base vowel reordering, conjunct handling) জড়িত — ভুল হলে লেখা silently garbled হয়ে যায়, তাই যাচাই না করে ছাড়া হয়নি।","জরুরি প্রয়োজনে এখন verified, পরীক্ষিত tool (Avro, OpenBangla Keyboard) ব্যবহার করুন।"],
faq:[["এই টুল কাজ করে না কেন?","সঠিক রূপান্তরের জন্য দরকারি byte-level mapping table নিয়ে আমরা যথেষ্ট নিশ্চিত নই বলে ভুল ফলাফল দেওয়ার বদলে honestly না-করাই বেছে নিয়েছি।"],["কবে চালু হবে?","নির্ভরযোগ্য mapping table verify করে যোগ করা হলে এটি চালু হবে।"],["এখন কী করব?","আপাতত Avro Converter বা OpenBangla Keyboard-এর মতো established tool ব্যবহার করুন।"]]
},
"age-calculator":{
about:"জন্মতারিখ দিলেই এই টুল আপনার সঠিক বয়স বছর, মাস ও দিন হিসেবে বের করে দেয় — চাকরির আবেদন, পরীক্ষার ফর্ম বা যেকোনো সরকারি কাজে বয়স লেখার জন্য এটি কাজে লাগে।",
how:["জন্মতারিখ সিলেক্ট করুন","\u201cহিসাব করুন\u201d বাটনে ক্লিক করুন","বছর-মাস-দিন আকারে ফলাফল দেখুন, চাইলে Copy করুন"],
benefits:["হাতে গণনার ভুল এড়ানো যায়","লিপ ইয়ার সহ নির্ভুল হিসাব"],
tips:["সরকারি ফর্মে জন্ম নিবন্ধন সনদের তারিখ ব্যবহার করুন","চাকরির বয়সসীমা যাচাইয়ে আবেদনের শেষ তারিখ পর্যন্ত হিসাব করুন"],
faq:[["এই বয়স কি সরকারি কাগজে ব্যবহার করা যাবে?","হ্যাঁ, এটি সঠিক ক্যালেন্ডার হিসাব দেয়, তবে চূড়ান্ত প্রমাণ হিসেবে জন্ম নিবন্ধন সনদই গণ্য হয়।"],["লিপ ইয়ার হিসাবে ধরা হয় কি?","হ্যাঁ, প্রতিটি মাসের প্রকৃত দিন সংখ্যা (লিপ ইয়ার সহ) হিসাব করা হয়।"],["ভবিষ্যতের তারিখ দিলে কী হবে?","ফলাফল সঠিক আসবে না, তাই জন্মতারিখ অতীতের হতে হবে।"]]
},
"percentage-calculator":{
about:"যেকোনো সংখ্যার নির্দিষ্ট শতাংশ (percentage) মুহূর্তেই বের করে দেয় এই টুল — পরীক্ষার নম্বর, ছাড় বা লাভের হিসাবে ব্যবহার করা যায়।",
how:["মূল সংখ্যাটি লিখুন","কত শতাংশ বের করতে চান তা লিখুন","\u201cহিসাব করুন\u201d চাপুন, ফলাফল সাথে সাথে দেখা যাবে"],
benefits:["ক্যালকুলেটরে টাইপ করার ঝামেলা নেই","ভুল হিসাবের ঝুঁকি থাকে না"],
tips:["Discount হিসাব করতে চাইলে আমাদের Discount Calculator ব্যবহার করুন","Percentage বৃদ্ধি/হ্রাস বের করতে সংশ্লিষ্ট ব্লগ পোস্ট দেখুন"],
faq:[["Percentage বের করার formula কী?","ফলাফল = (সংখ্যা × শতাংশ) ÷ ১০০।"],["Negative সংখ্যা দেওয়া যাবে?","হ্যাঁ, negative সংখ্যার শতাংশও সঠিকভাবে হিসাব হবে।"],["Decimal সংখ্যা সমর্থিত?","হ্যাঁ, দশমিক সংখ্যা দিয়েও হিসাব করা যায়।"]]
},
"bmi-calculator":{
about:"উচ্চতা ও ওজন দিয়ে Body Mass Index (BMI) হিসাব করে বোঝায় আপনার ওজন স্বাস্থ্যকর সীমার মধ্যে আছে কিনা।",
how:["ওজন কিলোগ্রামে লিখুন","উচ্চতা সেন্টিমিটারে লিখুন","\u201cহিসাব করুন\u201d চাপুন, BMI মান দেখুন"],
benefits:["দ্রুত স্বাস্থ্য সচেতনতা তৈরি করে","কোনো অ্যাপ ইনস্টল ছাড়াই ব্যবহারযোগ্য"],
tips:["১৮.৫–২৪.৯ সাধারণত স্বাস্থ্যকর সীমা হিসেবে ধরা হয়","BMI একটি সাধারণ indicator মাত্র, চূড়ান্ত রোগ নির্ণয় নয় — প্রয়োজনে ডাক্তারের পরামর্শ নিন"],
faq:[["BMI-এর formula কী?","BMI = ওজন(kg) ÷ (উচ্চতা(m) × উচ্চতা(m))।"],["BMI কি সবার জন্য নির্ভুল?","না, পেশীবহুল মানুষের ক্ষেত্রে BMI বিভ্রান্তিকর হতে পারে কারণ এটি পেশী ও চর্বির পার্থক্য বোঝে না।"],["শিশুদের জন্য এই calculator ব্যবহার করা যাবে?","না, শিশুদের BMI হিসাব বয়সভিত্তিক আলাদা পদ্ধতিতে হয়, এই টুল প্রাপ্তবয়স্কদের জন্য।"]]
},
"discount-calculator":{
about:"পণ্যের মূল দাম ও ছাড়ের হার দিলে কত টাকা বাঁচলো এবং চূড়ান্ত দাম কত হবে তা সাথে সাথে বের করে দেয়।",
how:["পণ্যের মূল দাম লিখুন","Discount শতাংশ লিখুন","ফলাফলে Discount ও Final Price দেখুন"],
benefits:["কেনাকাটার সময় দ্রুত সিদ্ধান্ত নিতে সাহায্য করে","একাধিক দোকানের অফার তুলনা করা সহজ হয়"],
tips:["একাধিক ধাপের discount (যেমন ২০%+১০%) থাকলে প্রতিটি ধাপ আলাদাভাবে হিসাব করুন","VAT-সহ চূড়ান্ত দাম জানতে VAT Calculator দিয়ে পরে হিসাব করুন"],
faq:[["Discount বের করার নিয়ম কী?","Discount = মূল দাম × (Discount% ÷ ১০০), Final Price = মূল দাম − Discount।"],["একাধিক discount একসাথে হিসাব করা যাবে?","একবারে একটি discount হিসাব হয়, একাধিক ধাপ থাকলে পরপর দুইবার ব্যবহার করুন।"],["Negative discount দিলে কী হবে?","এটি মূল দামের চেয়ে বেশি ফলাফল দেখাবে, তাই সঠিক শতাংশ দেওয়া জরুরি।"]]
},
"profit-loss-calculator":{
about:"ক্রয়মূল্য ও বিক্রয়মূল্য দিয়ে ব্যবসায় লাভ হয়েছে নাকি ক্ষতি হয়েছে এবং তার শতাংশ কত তা হিসাব করে দেয়।",
how:["পণ্যের ক্রয়মূল্য লিখুন","বিক্রয়মূল্য লিখুন","ফলাফলে লাভ/ক্ষতির পরিমাণ ও শতাংশ দেখুন"],
benefits:["ছোট ব্যবসায়ীদের দ্রুত হিসাব রাখতে সাহায্য করে","লাভের শতাংশ জানলে দাম নির্ধারণ সহজ হয়"],
tips:["একাধিক পণ্যের হিসাব রাখতে প্রতিটি পণ্য আলাদাভাবে হিসাব করুন","মাসিক সামগ্রিক হিসাবের জন্য Salary Calculator ও এই টুল একসাথে ব্যবহার করুন"],
faq:[["লাভ-ক্ষতির শতাংশ কীভাবে বের হয়?","(বিক্রয়মূল্য − ক্রয়মূল্য) ÷ ক্রয়মূল্য × ১০০।"],["ক্রয়মূল্য ও বিক্রয়মূল্য সমান হলে?","তখন লাভ বা ক্ষতি কোনোটাই হবে না, ফলাফল শূন্য দেখাবে।"],["এটি কি পাইকারি ব্যবসার জন্যও কাজ করে?","হ্যাঁ, যেকোনো একক পণ্যের ক্রয়-বিক্রয় হিসাবের জন্য এটি ব্যবহার করা যায়।"]]
},
"salary-calculator":{
about:"মাসিক বেতনের পরিমাণ দিলে বার্ষিক মোট বেতন কত হবে তা মুহূর্তেই বের করে দেয়।",
how:["মাসিক বেতনের পরিমাণ লিখুন","\u201cহিসাব করুন\u201d চাপুন","বার্ষিক মোট বেতন দেখুন"],
benefits:["চাকরির অফার তুলনা করা সহজ হয়","বাজেট পরিকল্পনায় সাহায্য করে"],
tips:["Bonus বা Incentive থাকলে সেটা আলাদাভাবে যোগ করে নিন","লোনের কিস্তি হিসাবের জন্য EMI Calculator ব্যবহার করুন"],
faq:[["Bonus এই হিসাবে যুক্ত হয়?","না, শুধু মাসিক বেতন × ১২ হিসাব করা হয়, Bonus আলাদাভাবে যোগ করতে হবে।"],["Tax কর্তনের পর net salary দেখায়?","না, এটি gross বার্ষিক বেতন দেখায়, tax হিসাব এতে যুক্ত নয়।"],["Hourly rate থেকে হিসাব করা যাবে?","না, এই মুহূর্তে শুধু মাসিক বেতন দিয়ে হিসাব করা যায়।"]]
},
"vat-calculator":{
about:"পণ্য বা সেবার মূল্যের সাথে VAT (মূল্য সংযোজন কর) যোগ বা বাদ দিয়ে সঠিক দাম হিসাব করার টুল।",
how:["পণ্যের মূল দাম লিখুন","VAT হার লিখুন (ডিফল্ট ১৫%)","VAT-এর পরিমাণ ও মোট দাম দেখুন"],
benefits:["ব্যবসায়ীদের invoice তৈরিতে সাহায্য করে","ক্রেতারা প্রকৃত দাম যাচাই করতে পারেন"],
tips:["বাংলাদেশে বেশিরভাগ পণ্যে সাধারণ VAT হার ১৫%, তবে পণ্যভেদে ভিন্ন হতে পারে","VAT সংক্রান্ত বিস্তারিত জানতে আমাদের ব্লগ পোস্ট দেখুন"],
faq:[["VAT হিসাবের নিয়ম কী?","VAT = মূল দাম × (VAT হার ÷ ১০০), মোট দাম = মূল দাম + VAT।"],["সব পণ্যে VAT হার একই?","না, পণ্যভেদে VAT হার ভিন্ন হতে পারে, সরকারি নির্দেশনা অনুযায়ী তা পরিবর্তিত হয়।"],["VAT ও Tax কি একই জিনিস?","না, VAT পরোক্ষ কর আর Income Tax প্রত্যক্ষ কর — দুটি আলাদা বিষয়।"]]
},
"emi-calculator":{
about:"লোনের পরিমাণ, সুদের হার ও মেয়াদ দিলে প্রতি মাসে কত কিস্তি (EMI) দিতে হবে তা হিসাব করে দেয়।",
how:["Loan amount লিখুন","বার্ষিক সুদের হার লিখুন","মেয়াদ (মাসে) লিখে মাসিক EMI দেখুন"],
benefits:["লোন নেওয়ার আগে বাজেট পরিকল্পনা করা যায়","বিভিন্ন ব্যাংকের অফার তুলনা করা সহজ হয়"],
tips:["শুধু EMI নয়, মোট সুদের পরিমাণও বিবেচনা করুন","মাসিক আয়ের ৪০-৫০%-এর বেশি EMI না রাখাই ভালো"],
faq:[["EMI-এর formula কী?","EMI = P×r×(1+r)^n ÷ ((1+r)^n−1), যেখানে P=Loan amount, r=মাসিক সুদহার, n=মোট মাস।"],["সুদের হার শূন্য দিলে কী হয়?","তখন EMI = Loan amount ÷ মেয়াদ (মাস), simple ভাগ হিসাব হবে।"],["এই হিসাব কি ব্যাংকের প্রকৃত EMI-এর সাথে হুবহু মিলবে?","কাছাকাছি হবে, তবে ব্যাংকভেদে processing fee ও হিসাবের পদ্ধতিতে সামান্য পার্থক্য থাকতে পারে।"]]
},
"date-calculator":{
about:"দুটি তারিখের মধ্যে মোট কত দিনের ব্যবধান তা মুহূর্তেই বের করে দেয় এই টুল।",
how:["শুরুর তারিখ সিলেক্ট করুন","শেষ তারিখ সিলেক্ট করুন","মোট দিনের ব্যবধান দেখুন"],
benefits:["ইভেন্ট পরিকল্পনা বা deadline হিসাবে সাহায্য করে","ম্যানুয়াল ক্যালেন্ডার গোনা লাগে না"],
tips:["ভ্রমণ বা ছুটির পরিকল্পনায় এই টুল দিয়ে মোট দিন হিসাব করে নিন","বয়স হিসাবের জন্য আলাদাভাবে Age Calculator ব্যবহার করুন"],
faq:[["তারিখের ক্রম উল্টো দিলে সমস্যা হবে?","না, ফলাফল সবসময় absolute (পূর্ণসংখ্যা) দিন হিসেবে দেখায়।"],["সপ্তাহ বা মাসে হিসাব দেখানো যায়?","বর্তমানে শুধু মোট দিন সংখ্যা দেখানো হয়।"],["একই তারিখ দুইবার দিলে?","ব্যবধান ০ দিন দেখাবে।"]]
},
"currency-converter":{
about:"লাইভ exchange rate ব্যবহার করে এক currency থেকে আরেক currency-তে রূপান্তর করে এই টুল।",
how:["Amount লিখুন","From ও To currency সিলেক্ট করুন","Convert চাপুন, লাইভ rate অনুযায়ী ফলাফল দেখুন"],
benefits:["Freelancer ও ব্যবসায়ীদের জন্য দ্রুত রেট যাচাই","আলাদা কোনো app ছাড়াই ব্যবহারযোগ্য"],
tips:["Bank rate ও market rate-এ সামান্য পার্থক্য থাকতে পারে, লেনদেনের আগে ব্যাংকের সাথে নিশ্চিত হয়ে নিন","Rate কয়েক ঘণ্টা পরপর আপডেট হয়, তাই সময়ভেদে সামান্য ভিন্ন হতে পারে"],
faq:[["Rate কোথা থেকে আসে?","ExchangeRate-API থেকে লাইভ rate নেওয়া হয়।"],["ইন্টারনেট ছাড়া কাজ করবে?","না, লাইভ rate আনতে ইন্টারনেট সংযোগ প্রয়োজন।"],["এই rate কি bKash/Bank-এর exchange rate-এর সমান?","সাধারণত কাছাকাছি থাকে, তবে bank বা exchange house নিজস্ব margin যোগ করতে পারে।"]]
},
"word-counter":{
about:"লেখার মধ্যে মোট কতগুলো শব্দ ও character আছে তা রিয়েল-টাইমে গুনে দেয় এই টুল।",
how:["Textbox-এ লেখা paste বা টাইপ করুন","উপরে সাথে সাথে Word ও Character সংখ্যা দেখুন"],
benefits:["Assignment বা article-এর word limit মেনে চলা সহজ হয়","Real-time গণনা, আলাদা বাটন চাপার দরকার নেই"],
tips:["Social media caption-এর character limit যাচাই করতে এই টুল ব্যবহার করুন","শুধু character গুনতে চাইলে Character Counter ব্যবহার করুন"],
faq:[["Space-কে word হিসেবে গোনা হয়?","না, শুধু continuous শব্দ (whitespace দিয়ে আলাদা) গোনা হয়।"],["বাংলা লেখাতেও কাজ করে?","হ্যাঁ, বাংলা ও ইংরেজি উভয় লেখাতেই সঠিকভাবে কাজ করে।"],["লেখা কোথাও সংরক্ষণ হয়?","না, সম্পূর্ণ প্রসেসিং আপনার browser-এই হয়, কোথাও পাঠানো হয় না।"]]
},
"character-counter":{
about:"লেখায় মোট কতগুলো character (স্পেস সহ) আছে তা রিয়েল-টাইমে দেখায় এই টুল।",
how:["Textbox-এ লেখা লিখুন","সাথে সাথে character সংখ্যা দেখুন"],
benefits:["SMS বা meta description-এর length limit যাচাই করা সহজ","কোনো delay ছাড়াই instant ফলাফল"],
tips:["Twitter/X বা SEO meta description লেখার সময় এই টুল দিয়ে length চেক করুন"],
faq:[["Space-ও গোনা হয়?","হ্যাঁ, স্পেস সহ প্রতিটি character গোনা হয়।"],["Word count-ও কি দেখায়?","না, শুধু character count দেখাতে এই টুল, word count-এর জন্য Word Counter ব্যবহার করুন।"],["বাংলা যুক্তাক্ষরে সঠিক গণনা হয়?","হ্যাঁ, প্রতিটি Unicode character হিসেবে গণনা হয়।"]]
},
"case-converter":{
about:"লেখাকে UPPERCASE, lowercase বা Title Case-এ রূপান্তর করে দেয় এক ক্লিকেই।",
how:["Textbox-এ লেখা লিখুন","UPPER, lower বা Title Case বাটনে ক্লিক করুন","ফলাফল Copy করুন"],
benefits:["ম্যানুয়ালি case পরিবর্তনের ঝামেলা এড়ানো যায়","Heading বা Title লেখার সময় দ্রুত format করা যায়"],
tips:["Email subject বা heading-এর জন্য Title Case ব্যবহার করুন","শুধু ইংরেজি টেক্সটের জন্য কার্যকর, বাংলায় case পরিবর্তন প্রযোজ্য নয়"],
faq:[["বাংলা লেখায় কাজ করে?","না, case (uppercase/lowercase) শুধুমাত্র ইংরেজি বর্ণে প্রযোজ্য।"],["Title Case কীভাবে কাজ করে?","প্রতিটি শব্দের প্রথম অক্ষর বড় ও বাকি অক্ষর ছোট করে দেয়।"],["মূল লেখা পরিবর্তন হয়ে যায়?","টুলের ভেতরের textbox-এর লেখা পরিবর্তন হয়, চাইলে Copy করে অন্য জায়গায় ব্যবহার করুন।"]]
},
"image-compressor":{
about:"ছবির মান প্রায় অক্ষুণ্ণ রেখে file size উল্লেখযোগ্যভাবে কমিয়ে দেয় এই টুল, সম্পূর্ণ browser-এই প্রসেস হয়।",
how:["ছবি আপলোড করুন","স্বয়ংক্রিয়ভাবে compressed ছবি তৈরি হবে","Download বাটনে চেপে সংরক্ষণ করুন"],
benefits:["Website বা email attachment-এর জন্য দ্রুত loading নিশ্চিত করে","ছবি কোথাও আপলোড হয় না, privacy বজায় থাকে"],
tips:["Website-এর জন্য ছবি compress করার পর Image Resizer দিয়ে প্রয়োজনীয় dimension-এও রিসাইজ করুন","PNG ছবিতে transparency থাকলে compress করার পর তা পরীক্ষা করে নিন"],
faq:[["ছবির মান কতটা কমে?","Visually প্রায় অপরিবর্তিত থাকে, শুধু file size উল্লেখযোগ্যভাবে কমে।"],["কোন format সমর্থিত?","সাধারণ JPG, PNG সহ browser-সমর্থিত সব image format কাজ করে।"],["ছবি কি server-এ আপলোড হয়?","না, পুরো প্রসেসিং আপনার browser-এই হয়, কোনো সার্ভারে যায় না।"]]
},
"image-resizer":{
about:"ছবির width ও height নিজের পছন্দমতো পরিবর্তন করার টুল, exact pixel dimension দিয়ে resize করা যায়।",
how:["ছবি আপলোড করুন","নতুন Width ও Height লিখুন","Resize করুন বাটনে চেপে Download করুন"],
benefits:["Website বা social media-র নির্দিষ্ট size requirement পূরণ করা সহজ","Aspect ratio নিজের মতো নিয়ন্ত্রণ করা যায়"],
tips:["Social media profile picture-এর জন্য সাধারণত square (১:১) dimension ব্যবহার করা ভালো","Aspect ratio বিকৃত না করতে চাইলে width-height অনুপাত মূল ছবির সমান রাখুন"],
faq:[["ছবি বিকৃত (stretch) হয়ে যাবে না?","আপনি যে width-height দেবেন সেই অনুযায়ীই resize হবে, তাই মূল অনুপাত মাথায় রাখা ভালো।"],["ছবির মান খারাপ হয়ে যায়?","ছোট থেকে বড় করলে সামান্য মান কমতে পারে, বড় থেকে ছোট করলে সাধারণত ভালো মান থাকে।"],["Batch-এ একাধিক ছবি resize করা যায়?","না, বর্তমানে একবারে একটি ছবি resize করা যায়।"]]
},
"jpg-to-png":{
about:"JPG ছবিকে PNG format-এ রূপান্তর করে এই টুল, সম্পূর্ণ ফ্রি ও browser-based।",
how:["JPG ছবি আপলোড করুন","স্বয়ংক্রিয়ভাবে PNG-তে রূপান্তরিত হবে","Download বাটনে চেপে সংরক্ষণ করুন"],
benefits:["Transparency প্রয়োজন হলে PNG format দরকার হয়","Design বা editing tool-এর জন্য উপযুক্ত format পাওয়া যায়"],
tips:["JPG-তে transparency থাকে না, তাই PNG-তে রূপান্তরের পরও background সাদা থাকবে যদি মূল ছবিতে transparency না থাকে"],
faq:[["রূপান্তরের পর মান কমে যায়?","না, JPG থেকে PNG-তে যাওয়ার সময় মান সাধারণত অক্ষুণ্ণ থাকে, তবে file size বাড়তে পারে।"],["Transparency যোগ হয়ে যাবে?","না, মূল JPG-তে transparency না থাকলে নতুন করে যোগ হবে না।"],["একাধিক ছবি একসাথে রূপান্তর করা যায়?","না, বর্তমানে একবারে একটি ছবি রূপান্তর করা যায়।"]]
},
"png-to-jpg":{
about:"PNG ছবিকে JPG format-এ রূপান্তর করে এই টুল, ফলে file size সাধারণত ছোট হয়।",
how:["PNG ছবি আপলোড করুন","স্বয়ংক্রিয়ভাবে JPG-তে রূপান্তরিত হবে","Download বাটনে চেপে সংরক্ষণ করুন"],
benefits:["File size কমিয়ে দ্রুত শেয়ার করা যায়","Website-এ ছবি ব্যবহারের জন্য উপযুক্ত format"],
tips:["PNG-তে transparency থাকলে JPG-তে রূপান্তরের পর সাদা background যুক্ত হয়ে যাবে, এটা মাথায় রাখুন"],
faq:[["Transparency-এর কী হয়?","JPG transparency সমর্থন করে না, তাই transparent অংশ সাদা রঙে রূপান্তরিত হয়।"],["মান কতটুকু কমে?","সামান্য কমতে পারে কারণ JPG lossy compression ব্যবহার করে, তবে visually প্রায় অপরিবর্তিত থাকে।"],["File size কতটা কমে?","সাধারণত PNG-এর চেয়ে উল্লেখযোগ্যভাবে কম হয়, বিশেষত ছবিতে বেশি রঙ থাকলে।"]]
},
"pdf-to-jpg":{
about:"PDF ফাইলের প্রতিটি page-কে আলাদা JPG ছবিতে রূপান্তর করে দেয় এই টুল, প্রয়োজনে সবগুলো একসাথে ZIP করে ডাউনলোড করা যায়।",
how:["PDF ফাইল আপলোড করুন","প্রতিটি page-এর preview ও ডাউনলোড লিংক দেখুন","আলাদা page বা সব page একসাথে ZIP আকারে Download করুন"],
benefits:["PDF থেকে নির্দিষ্ট page ছবি হিসেবে ব্যবহার করা যায়","Presentation বা document-এ ব্যবহারের জন্য সুবিধাজনক"],
tips:["বড় PDF ফাইলে page সংখ্যা বেশি থাকলে প্রসেস হতে কিছুটা সময় লাগতে পারে","একসাথে সব page ডাউনলোড করতে \u201cDownload all (ZIP)\u201d বাটন ব্যবহার করুন"],
faq:[["PDF কোথাও আপলোড হয়?","না, পুরো প্রসেসিং browser-এই হয়, ফাইল কোনো সার্ভারে যায় না।"],["Password-protected PDF কাজ করবে?","না, প্রথমে PDF-এর password সরিয়ে তারপর ব্যবহার করতে হবে।"],["ছবির মান নিয়ন্ত্রণ করা যায়?","বর্তমানে fixed মানে (high-quality JPG) export হয়।"]]
},
"json-formatter":{
about:"এলোমেলো বা minified JSON-কে সুন্দরভাবে indent করে readable বানায়, এবং ভুল থাকলে সেটাও চিহ্নিত করে।",
how:["JSON টেক্সট paste করুন","Format বা Minify বাটনে চাপুন","ফলাফল দেখুন বা Copy করুন"],
benefits:["API response debug করা সহজ হয়","Invalid JSON-এর সঠিক error message পাওয়া যায়"],
tips:["Nested object/array বেশি জটিল হলে Format করে কাঠামো ভালোভাবে বোঝা যায়","শেষ item-এর পর অতিরিক্ত comma রাখলে JSON invalid হয়ে যায়, এই ভুল এড়িয়ে চলুন"],
faq:[["Invalid JSON দিলে কী হয়?","স্পষ্ট error message দেখানো হয় যাতে সমস্যা কোথায় তা বোঝা যায়।"],["Minify মানে কী?","সব whitespace সরিয়ে JSON-কে সবচেয়ে ছোট আকারে নিয়ে আসা হয়, যা API call-এ data কম পাঠাতে সাহায্য করে।"],["আমার JSON data কোথাও সংরক্ষণ হয়?","না, সম্পূর্ণ প্রসেসিং browser-এই হয়, কোথাও পাঠানো হয় না।"]]
},
"password-generator":{
about:"Cryptographically random ও নিরাপদ password তৈরি করে দেয় এই টুল, নিজের পছন্দমতো length নির্ধারণ করা যায়।",
how:["Password-এর length লিখুন (৬-১২৮)","Generate বাটনে চাপুন","তৈরি হওয়া password Copy করুন"],
benefits:["প্রতিটি account-এর জন্য আলাদা strong password তৈরি করা সহজ হয়","Browser-এর crypto API ব্যবহার করায় সত্যিকারের random ফলাফল"],
tips:["কমপক্ষে ১২-১৬ character-এর password ব্যবহার করুন","একই password একাধিক জায়গায় ব্যবহার করবেন না, প্রয়োজনে Password Manager ব্যবহার করুন"],
faq:[["এই password কি সত্যিই random?","হ্যাঁ, browser-এর crypto.getRandomValues API ব্যবহার করে তৈরি হয়, যা সাধারণ Math.random-এর চেয়ে অনেক বেশি নিরাপদ।"],["Password কোথাও সংরক্ষণ হয়?","না, তৈরি হওয়া password শুধু আপনার screen-এই দেখানো হয়, কোথাও পাঠানো বা সংরক্ষণ করা হয় না।"],["সর্বোচ্চ কত length-এর password তৈরি করা যায়?","সর্বোচ্চ ১২৮ character পর্যন্ত।"]]
},
"qr-generator":{
about:"যেকোনো text বা URL দিয়ে সাথে সাথে scannable QR Code তৈরি করে দেয় এই টুল, সম্পূর্ণ ফ্রি।",
how:["Text বা URL লিখুন","Generate QR বাটনে চাপুন","QR Code স্ক্রিনশট নিন বা download করুন"],
benefits:["Business card, poster বা menu-তে ব্যবহারের জন্য উপযুক্ত","কোনো app install ছাড়াই তৈরি করা যায়"],
tips:["Print করার আগে scan করে link সঠিক আছে কিনা যাচাই করে নিন","QR Code-এর ভেতরের তথ্য পরে পরিবর্তন করা যায় না, তাই সঠিক link দিন"],
faq:[["QR Code পরে edit করা যাবে?","না, একবার তৈরি হলে সেই QR Code-এর তথ্য স্থায়ী থাকে, পরিবর্তনের জন্য নতুন QR Code তৈরি করতে হবে।"],["QR Code স্ক্যান করতে বিশেষ app লাগে?","না, বেশিরভাগ smartphone-এর ডিফল্ট camera app দিয়েই স্ক্যান করা যায়।"],["কত তথ্য একটি QR Code-এ রাখা যায়?","সাধারণত কয়েকশ character পর্যন্ত তথ্য রাখা যায়, বেশি তথ্যে QR Code জটিল হয়ে যায়।"]]
},
"unit-converter":{
about:"দৈর্ঘ্য, ওজন ও তাপমাত্রার একক (যেমন মিটার-ফুট, কেজি-মণ, সেলসিয়াস-ফারেনহাইট) একে অপরে রূপান্তর করে দেয় এই টুল।",
how:["একক পরিমাপের ধরন (দৈর্ঘ্য/ওজন/তাপমাত্রা) সিলেক্ট করুন","পরিমাণ ও From-To একক নির্বাচন করুন","Convert চাপুন, ফলাফল দেখুন"],
benefits:["একাধিক conversion chart মুখস্থ রাখার দরকার নেই","স্থানীয় একক যেমন মণ-ও সমর্থিত"],
tips:["জমির পরিমাপ বা কৃষি হিসাবে মণ-কেজি রূপান্তর এই টুল দিয়ে সহজে করা যায়","তাপমাত্রা রূপান্তরে সাধারণ multiplication নয়, formula ভিন্ন — এই টুল স্বয়ংক্রিয়ভাবে তা হিসাব করে"],
faq:[["মণ কী?","মণ বাংলাদেশ ও ভারতীয় উপমহাদেশে ব্যবহৃত একটি প্রচলিত ওজন একক, ১ মণ = ৩৭.৩২৪২ কেজি।"],["তাপমাত্রা রূপান্তর কীভাবে কাজ করে?","সেলসিয়াস, ফারেনহাইট ও কেলভিনের মধ্যে নির্দিষ্ট formula ব্যবহার করে সঠিক রূপান্তর করা হয়।"],["আরও একক যোগ করা হবে?","ব্যবহারকারীদের চাহিদা অনুযায়ী ভবিষ্যতে নতুন একক যোগ করা হতে পারে।"]]
},
"number-to-words":{
about:"যেকোনো সংখ্যাকে বাংলায় কথায় রূপান্তর করে দেয় এই টুল — চেক, ইনভয়েস বা অফিসিয়াল ডকুমেন্টে টাকার পরিমাণ লেখার জন্য উপযোগী।",
how:["সংখ্যাটি লিখুন (দশমিক সহ লেখা যায়)","\u201cকথায় লিখুন\u201d বাটনে চাপুন","শব্দে ও চেক-ফরম্যাটে ফলাফল দেখে Copy করুন"],
benefits:["চেক লেখার সময় ভুল বানান এড়ানো যায়","হিসাব-নিকাশ ও ইনভয়েসে দ্রুত ব্যবহারযোগ্য"],
tips:["চেকে লেখার সময় \u201cটাকা মাত্র\u201d অংশটি ব্যবহার করুন যাতে জালিয়াতি রোধ হয়","দশমিক থাকলে পয়সা আলাদাভাবে দেখানো হয়, তা লক্ষ্য করুন"],
faq:[["সর্বোচ্চ কত বড় সংখ্যা সমর্থিত?","প্রায় ৯৯,৯৯,৯৯,৯৯৯ (প্রায় ১০০ কোটি) পর্যন্ত সমর্থিত।"],["দশমিক সংখ্যা দেওয়া যায়?","হ্যাঁ, দশমিক অংশ পয়সা হিসেবে আলাদা করে দেখানো হয়।"],["Negative সংখ্যা দিলে কী হয়?","\u201cঋণাত্মক\u201d শব্দ যোগ করে ফলাফল দেখানো হয়।"]]
},
"bangla-number-converter":{
about:"লেখার মধ্যে থাকা সংখ্যাকে বাংলা (০-৯) থেকে ইংরেজি (0-9) বা তার উল্টো রূপান্তর করে দেয়, বাকি লেখা অপরিবর্তিত থাকে।",
how:["Textbox-এ লেখা বা সংখ্যা লিখুন","বাংলায় বা English-এ করুন বাটনে চাপুন","ফলাফল Copy করুন"],
benefits:["সরকারি ফর্ম বা ডকুমেন্টে সংখ্যা সঠিক ভাষায় লেখা সহজ হয়","লেখার বাকি অংশ (অক্ষর) অপরিবর্তিত থাকে, শুধু সংখ্যা বদলায়"],
tips:["পুরো paragraph paste করেও শুধু সংখ্যাগুলো রূপান্তর করা যায়","Invoice বা bill-এ বাংলা সংখ্যা প্রয়োজন হলে এই টুল ব্যবহার করুন"],
faq:[["শুধু সংখ্যা রূপান্তর হয়, নাকি পুরো লেখা?","শুধু সংখ্যা (০-৯ বা 0-9) রূপান্তর হয়, বাকি টেক্সট অপরিবর্তিত থাকে।"],["Decimal point বা কমা প্রভাবিত হয়?","না, শুধু সংখ্যার অঙ্কগুলো বদলায়, বাকি চিহ্ন অপরিবর্তিত থাকে।"],["একাধিকবার convert করলে সমস্যা হবে?","না, বারবার convert করলেও ফলাফল সঠিক থাকবে।"]]
},
"data-size-converter":{
about:"Bit, Byte, KB, MB, GB, TB-এর মধ্যে ডেটা সাইজ রূপান্তর করে দেয় এই টুল — ফাইল সাইজ বা ইন্টারনেট প্যাকেজ বোঝার জন্য উপযোগী।",
how:["পরিমাণ লিখুন","From ও To একক সিলেক্ট করুন","Convert চাপুন, ফলাফল দেখুন"],
benefits:["ইন্টারনেট ডেটা প্যাকেজ বোঝা সহজ হয়","ফাইল সাইজ সংক্রান্ত বিভ্রান্তি দূর হয়"],
tips:["১ GB = ১০২৪ MB (বাইনারি হিসাব) — এই টুল সেই standard অনুসরণ করে","মোবাইল ডেটা প্যাকেজ কেনার আগে সঠিক unit বুঝে নিন"],
faq:[["এখানে ১ GB কত MB ধরা হয়েছে?","১০২৪ MB (বাইনারি/1024-ভিত্তিক হিসাব), যা কম্পিউটিং-এ প্রচলিত standard।"],["Mobile অপারেটরদের হিসাবও কি একই?","কিছু অপারেটর মাঝে মাঝে 1000-ভিত্তিক হিসাব ব্যবহার করে, তাই সামান্য পার্থক্য থাকতে পারে।"],["Bit ও Byte-এর পার্থক্য কী?","১ Byte = ৮ Bit, ইন্টারনেট speed সাধারণত Bit-এ আর file size সাধারণত Byte-এ প্রকাশ করা হয়।"]]
},
"base-converter":{
about:"একটি সংখ্যাকে Binary, Octal, Decimal ও Hexadecimal — এই চার number system-এর মধ্যে রূপান্তর করে দেয়।",
how:["সংখ্যাটি লিখুন","সংখ্যাটি কোন base-এ আছে তা সিলেক্ট করুন","Convert চাপুন, চারটি base-এই ফলাফল দেখুন"],
benefits:["Programming ও computer science শেখার জন্য উপযোগী","Color code বা memory address বোঝার জন্য কাজে লাগে"],
tips:["Hexadecimal-এ A-F অক্ষরও ব্যবহার করা যায় (যেমন FF)","Binary সংখ্যায় শুধু 0 ও 1 ব্যবহার করুন"],
faq:[["ভুল base-এ ভুল digit দিলে কী হয়?","Error দেখানো হবে, যেমন Binary-তে 2 দিলে তা invalid বলে চিহ্নিত হবে।"],["Negative সংখ্যা সমর্থিত?","না, বর্তমানে শুধু non-negative সংখ্যা সমর্থিত।"],["Decimal সংখ্যা (fraction) সমর্থিত?","না, শুধু পূর্ণসংখ্যা (integer) সমর্থিত।"]]
},
"color-converter":{
about:"HEX color code (যেমন #14b8a6) থেকে RGB, অথবা RGB থেকে HEX-এ রূপান্তর করে দেয়, সাথে live color preview দেখায়।",
how:["HEX code লিখুন এবং HEX → RGB চাপুন, অথবা R, G, B মান লিখে RGB → HEX চাপুন","নিচে color preview দেখুন","ফলাফল থেকে code কপি করে নিন"],
benefits:["Web design ও CSS-এর কাজে দ্রুত color code পাওয়া যায়","Live preview দিয়ে রঙ সরাসরি চোখে দেখা যায়"],
tips:["৩-digit শর্টহ্যান্ড HEX (যেমন #fff) দিলেও এটি সঠিকভাবে বুঝে নেয়","Design system-এর জন্য brand color-এর HEX ও RGB দুটোই note করে রাখুন"],
faq:[["শর্টহ্যান্ড HEX (৩ digit) সমর্থিত?","হ্যাঁ, যেমন #14b লিখলেও তা #1144bb হিসেবে বোঝা হবে।"],["RGB মান কত পর্যন্ত দেওয়া যায়?","প্রতিটি R, G, B মান ০ থেকে ২৫৫-এর মধ্যে হতে হবে।"],["এটি কি CMYK সমর্থন করে?","না, বর্তমানে শুধু HEX ও RGB-এর মধ্যে রূপান্তর সমর্থিত।"]]
},
"base64-encoder-decoder":{
about:"টেক্সটকে Base64 format-এ এনকোড অথবা Base64 থেকে সাধারণ টেক্সটে ডিকোড করে দেয় এই টুল, বাংলা ও ইংরেজি উভয় লেখাতেই কাজ করে।",
how:["Textbox-এ টেক্সট বা Base64 code লিখুন","Encode বা Decode বাটনে চাপুন","ফলাফল Copy করুন"],
benefits:["API testing বা data transfer-এর কাজে দ্রুত ব্যবহারযোগ্য","কোনো software install ছাড়াই browser-এই কাজ করে"],
tips:["Email attachment বা image data base64-এ থাকলে তা decode করে আসল content দেখা যায়","Encode করা টেক্সট আসল data-কে encrypt করে না, এটি শুধু ভিন্ন format — sensitive তথ্যের জন্য যথেষ্ট নিরাপদ নয়"],
faq:[["Base64 কি এনক্রিপশন?","না, Base64 শুধু data-কে ভিন্ন format-এ উপস্থাপন করে, এটি কোনো নিরাপত্তা বা এনক্রিপশন প্রদান করে না।"],["বাংলা টেক্সট encode/decode করা যায়?","হ্যাঁ, UTF-8 encoding ব্যবহার করে বাংলা টেক্সটও সঠিকভাবে encode/decode হয়।"],["Invalid Base64 দিলে কী হয়?","Decode করার সময় error দেখানো হবে, তাই সঠিক Base64 string দেওয়া জরুরি।"]]
},
"url-encoder-decoder":{
about:"URL বা যেকোনো টেক্সটের special character-কে encode করে URL-safe বানায়, অথবা encoded URL-কে আসল টেক্সটে decode করে দেয়।",
how:["Textbox-এ URL বা টেক্সট লিখুন","Encode বা Decode বাটনে চাপুন","ফলাফল Copy করুন"],
benefits:["Query parameter-এ space বা special character থাকলে সমস্যা এড়ানো যায়","Developer-দের API/link তৈরির কাজে সাহায্য করে"],
tips:["URL-এ space, বাংলা অক্ষর বা & চিহ্ন থাকলে অবশ্যই encode করে ব্যবহার করুন","Encode করা URL browser address bar-এ paste করলে ঠিকভাবে কাজ করবে"],
faq:[["Encode করলে কী পরিবর্তন হয়?","Space, বাংলা অক্ষর ও special character-কে %XX ফরম্যাটে রূপান্তর করে যাতে URL-এ নিরাপদে ব্যবহার করা যায়।"],["সব character-ই কি encode হয়?","না, letter, number ও কিছু safe character (- _ . ~) অপরিবর্তিত থাকে।"],["Decode করার সময় ভুল হলে কী হয়?","সঠিক encoded ফরম্যাট না হলে error দেখানো হবে।"]]
},
"uuid-generator":{
about:"এলোমেলো, বিশ্বব্যাপী unique UUID (v4) তৈরি করে দেয় এই টুল — database record, session ID বা file naming-এর জন্য ব্যবহার করা যায়।",
how:["কতগুলো UUID দরকার তা লিখুন (সর্বোচ্চ ৫০)","Generate বাটনে চাপুন","ফলাফল থেকে একটি বা সবগুলো Copy করুন"],
benefits:["Programming-এ unique identifier হিসেবে ব্যবহারযোগ্য","Browser-এর crypto API ব্যবহার করায় collision হওয়ার সম্ভাবনা প্রায় শূন্য"],
tips:["Database primary key হিসেবে UUID ব্যবহার করলে distributed system-এ id conflict এড়ানো যায়","একসাথে অনেক UUID দরকার হলে \u201cসব Copy করুন\u201d বাটন ব্যবহার করুন"],
faq:[["UUID v4 কী?","এটি একটি র‍্যান্ডম-ভিত্তিক UUID সংস্করণ, যেখানে প্রতিটি ID সম্পূর্ণ এলোমেলোভাবে তৈরি হয়।"],["দুটি UUID কি কখনো একই হতে পারে?","সম্ভাবনা এতটাই কম (প্রায় শূন্যের কাছাকাছি) যে বাস্তবে এটি ধরা হয় না।"],["একসাথে সর্বোচ্চ কতগুলো তৈরি করা যায়?","একবারে সর্বোচ্চ ৫০টি UUID তৈরি করা যায়।"]]
},
"timestamp-converter":{
about:"Unix Timestamp (seconds) থেকে সাধারণ তারিখ-সময়ে, অথবা তারিখ-সময় থেকে Unix Timestamp-এ রূপান্তর করে দেয় এই টুল।",
how:["Timestamp থেকে তারিখ পেতে সংখ্যাটি লিখে \u201cতারিখে রূপান্তর\u201d চাপুন","তারিখ থেকে timestamp পেতে date-time সিলেক্ট করে \u201cTimestamp-এ রূপান্তর\u201d চাপুন","\u201cএখনকার Timestamp\u201d বাটনে বর্তমান সময়ের timestamp পাবেন"],
benefits:["API response-এর timestamp দ্রুত বোঝা যায়","Developer ও log-analysis কাজে সহায়ক"],
tips:["কিছু API millisecond-এ timestamp দেয় (১৩ digit), সেক্ষেত্রে শেষের তিনটি শূন্য বাদ দিয়ে seconds-এ (১০ digit) রূপান্তর করে ব্যবহার করুন","তারিখ-সময় আপনার browser-এর local timezone অনুযায়ী দেখানো হয়"],
faq:[["Unix Timestamp কী?","১৯৭০ সালের ১ জানুয়ারি (UTC) থেকে এখন পর্যন্ত পার হওয়া সেকেন্ডের সংখ্যা।"],["Millisecond timestamp সমর্থিত?","সরাসরি না, millisecond timestamp হলে শেষের তিনটি অঙ্ক বাদ দিয়ে seconds-এ রূপান্তর করে ব্যবহার করুন।"],["Timezone কীভাবে হিসাব হয়?","আপনার device/browser-এর local timezone অনুযায়ী তারিখ-সময় দেখানো হয়।"]]
},
"lorem-ipsum-generator":{
about:"Website বা design mockup-এর জন্য classic Lorem Ipsum placeholder text তৈরি করে দেয় এই টুল, প্রয়োজনমতো paragraph সংখ্যা ঠিক করা যায়।",
how:["কতগুলো paragraph দরকার তা লিখুন","Generate বাটনে চাপুন","তৈরি হওয়া টেক্সট Copy করে ডিজাইনে ব্যবহার করুন"],
benefits:["Design mockup-এ real content ছাড়াই layout দেখানো যায়","প্রতিবার আলাদা random টেক্সট তৈরি হয়"],
tips:["Website layout test করার সময় বিভিন্ন length-এর paragraph দিয়ে দেখুন কেমন লাগে","চূড়ান্ত publish করার আগে অবশ্যই আসল content দিয়ে replace করুন"],
faq:[["Lorem Ipsum-এর অর্থ কী?","এটি ল্যাটিন-সদৃশ একটি ঐতিহ্যবাহী placeholder টেক্সট, যা কয়েক শতাব্দী ধরে printing ও design industry-তে ব্যবহৃত হয়ে আসছে, এর কোনো সুনির্দিষ্ট অর্থ নেই।"],["প্রতিবার একই টেক্সট আসে?","না, প্রতিবার Generate করলে শব্দের এলোমেলো সমন্বয়ে ভিন্ন টেক্সট তৈরি হয়।"],["এই টেক্সট কি SEO-র জন্য ব্যবহার করা উচিত?","না, এটি শুধু layout/design testing-এর জন্য, প্রকৃত ওয়েবসাইটে আসল, অর্থবহ content ব্যবহার করা উচিত।"]]
}
};

/* ---------- Small utilities ---------- */
function toast(t){toastEl.textContent=t;toastEl.classList.add("show");clearTimeout(window.__tt);window.__tt=setTimeout(()=>toastEl.classList.remove("show"),2200)}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast(state.lang==="bn"?"কপি হয়েছে ✓":"Copied ✓")}catch{toast("Copy failed")}}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function saveRecent(id){state.recent=[id,...state.recent.filter(x=>x!==id)].slice(0,8);localStorage.bst_recent=JSON.stringify(state.recent)}
function enterSubmits(scopeSel,btnSel){document.querySelectorAll(`${scopeSel} input`).forEach(inp=>{inp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();const b=$(btnSel);if(b)b.click()}})})}

/* ---------- Number to Bangla words (0–99 traditional forms, grouped by Indian numbering: হাজার/লক্ষ/কোটি) ---------- */
const BN_ONES=["শূন্য","এক","দুই","তিন","চার","পাঁচ","ছয়","সাত","আট","নয়","দশ","এগারো","বারো","তেরো","চৌদ্দ","পনেরো","ষোল","সতেরো","আঠারো","ঊনিশ","বিশ","একুশ","বাইশ","তেইশ","চব্বিশ","পঁচিশ","ছাব্বিশ","সাতাশ","আটাশ","ঊনত্রিশ","ত্রিশ","একত্রিশ","বত্রিশ","তেত্রিশ","চৌত্রিশ","পঁয়ত্রিশ","ছত্রিশ","সাঁইত্রিশ","আটত্রিশ","ঊনচল্লিশ","চল্লিশ","একচল্লিশ","বিয়াল্লিশ","তেতাল্লিশ","চুয়াল্লিশ","পঁয়তাল্লিশ","ছেচল্লিশ","সাতচল্লিশ","আটচল্লিশ","ঊনপঞ্চাশ","পঞ্চাশ","একান্ন","বায়ান্ন","তিপ্পান্ন","চুয়ান্ন","পঞ্চান্ন","ছাপ্পান্ন","সাতান্ন","আটান্ন","ঊনষাট","ষাট","একষট্টি","বাষট্টি","তেষট্টি","চৌষট্টি","পঁয়ষট্টি","ছেষট্টি","সাতষট্টি","আটষট্টি","ঊনসত্তর","সত্তর","একাত্তর","বাহাত্তর","তিয়াত্তর","চুয়াত্তর","পঁচাত্তর","ছিয়াত্তর","সাতাত্তর","আটাত্তর","ঊনআশি","আশি","একাশি","বিরাশি","তিরাশি","চুরাশি","পঁচাশি","ছিয়াশি","সাতাশি","আটাশি","ঊননব্বই","নব্বই","একানব্বই","বিরানব্বই","তিরানব্বই","চুরানব্বই","পঁচানব্বই","ছিয়ানব্বই","সাতানব্বই","আটানব্বই","নিরানব্বই"];
function numToBanglaWords(num){
  num=Math.round(num);
  if(num===0)return BN_ONES[0];
  if(num<0)return "ঋণাত্মক "+numToBanglaWords(-num);
  const crore=Math.floor(num/10000000)%100,lakh=Math.floor(num/100000)%100,thousand=Math.floor(num/1000)%100,hundred=Math.floor(num/100)%10,rest=num%100;
  const parts=[];
  if(crore)parts.push(BN_ONES[crore]+" কোটি");
  if(lakh)parts.push(BN_ONES[lakh]+" লক্ষ");
  if(thousand)parts.push(BN_ONES[thousand]+" হাজার");
  if(hundred)parts.push(BN_ONES[hundred]+"শ");
  if(rest)parts.push(BN_ONES[rest]);
  return parts.join(" ");
}

/* ---------- Bijoy Classic -> Unicode converter: intentionally NOT auto-implemented ----------
   A correct converter needs the exact SutonnyMJ/Bijoy Classic byte-to-glyph table plus
   pre-base vowel-sign reordering. Shipping a guessed table risks silently corrupting
   people's Bangla text, so this tool instead gives clear guidance (see toolPage handler). */

/* ---------- SEO: per-page title/description/schema ---------- */
function setMeta(title,desc){
  document.title=title;
  const set=(sel,attr,val)=>{const el=document.querySelector(sel);if(el)el.setAttribute(attr,val)};
  set('meta[name="description"]',"content",desc);
  set('meta[property="og:title"]',"content",title);
  set('meta[property="og:description"]',"content",desc);
  set('meta[name="twitter:title"]',"content",title);
  set('meta[name="twitter:description"]',"content",desc);
}
function setSchema(obj){
  let el=document.getElementById("page-schema");
  if(!el){el=document.createElement("script");el.type="application/ld+json";el.id="page-schema";document.head.appendChild(el)}
  el.textContent=JSON.stringify(obj);
}
function clearSchema(){const el=document.getElementById("page-schema");if(el)el.remove();clearFaqSchema()}
function setFaqSchema(faqPairs){
  let el=document.getElementById("faq-schema");
  if(!el){el=document.createElement("script");el.type="application/ld+json";el.id="faq-schema";document.head.appendChild(el)}
  el.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqPairs.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a.replace(/<[^>]*>/g,"")}}))});
}
function clearFaqSchema(){const el=document.getElementById("faq-schema");if(el)el.remove()}
function breadcrumb(cat,title){
  return `<div class="breadcrumb" role="navigation" aria-label="Breadcrumb"><a href="#/">হোম</a> <span>/</span> <a href="#/tools?cat=${encodeURIComponent(cat)}">${catLabel(cat)}</a> <span>/</span> <span aria-current="page">${esc(title)}</span></div>`;
}
function toolContentBlock(id){
  const c=toolContent[id];
  if(!c)return "";
  const faqHtml=c.faq.map(([q,a])=>`<details class="faq-item"><summary>${esc(q)}</summary><p>${a}</p></details>`).join("");
  return `<div class="tool-content"><h2>এই টুল সম্পর্কে</h2><p>${c.about}</p><h2>ব্যবহারের নিয়ম</h2><ol>${c.how.map(s=>`<li>${s}</li>`).join("")}</ol><h2>সুবিধা</h2><ul>${c.benefits.map(s=>`<li>${s}</li>`).join("")}</ul><h2>টিপস</h2><ul>${c.tips.map(s=>`<li>${s}</li>`).join("")}</ul><h2>প্রায়ই জিজ্ঞাসিত প্রশ্ন</h2>${faqHtml}</div>`;
}

/* ---------- Share button ---------- */
function shareRow(title){
  const url=location.href;
  return `<div class="share-row"><button class="btn alt share-btn" id="shareBtn">${shareIcon} ${state.lang==="bn"?"শেয়ার করুন":"Share"}</button></div>`;
}
function bindShare(title){
  const b=$("#shareBtn"); if(!b)return;
  b.onclick=async()=>{
    if(navigator.share){try{await navigator.share({title,url:location.href})}catch{}}
    else{await copyText(location.href)}
  };
}

/* ---------- Cards / listing ---------- */
function toggleFavorite(id){
  const i=state.favorites.indexOf(id);
  if(i>-1)state.favorites.splice(i,1); else state.favorites.push(id);
  localStorage.bst_favorites=JSON.stringify(state.favorites);
  document.querySelectorAll(`.fav-btn[data-id="${id}"]`).forEach(b=>b.classList.toggle("active",state.favorites.includes(id)));
}
function toolIconTag(id,cls){return `<img class="${cls}" src="icons/${id}.png" alt="" width="44" height="44" loading="lazy">`}
function card(t){const fav=state.favorites.includes(t[0]);return `<div class="card tool-card"><button class="fav-btn${fav?" active":""}" data-id="${t[0]}" aria-label="Favorite" onclick="event.preventDefault();toggleFavorite('${t[0]}')">${fav?"★":"☆"}</button>${toolIconTag(t[0],"tool-icon")}<h3>${esc(t[1])}</h3><p>${esc(t[2])}</p><a class="btn" href="#/${t[0]}">ব্যবহার করুন →</a></div>`}
function relatedTools(currentId,category,n){
  const list=tools.filter(t=>t[0]!==currentId && t[3]===category).slice(0,n);
  if(!list.length)return "";
  return `<div class="related"><h3>${state.lang==="bn"?"সম্পর্কিত Tools":"Related tools"}</h3><div class="related-list">${list.map(t=>`<a href="#/${t[0]}">${toolIconTag(t[0],"tool-icon related-icon")}<span><b>${esc(t[1])}</b><br><small style="color:var(--muted)">${esc(t[2])}</small></span></a>`).join("")}</div></div>`;
}

/* ---------- Pages ---------- */
function home(){
  setMeta("BanglaSmartTools — বাংলায় ফ্রি Online Tools","বাংলায় সহজ, দ্রুত ও ফ্রি Online Tools — calculator, text, image, PDF, JSON, QR ও currency tools এক জায়গায়।");
  clearSchema();
  app.innerHTML=`<section class="hero"><div class="container"><h1>বাংলায় সহজ, দ্রুত ও ফ্রি<br>Online Tools</h1><p>Calculator, PDF, Image, Text, Finance ও Developer tools—সব এক জায়গায়।</p><div class="search"><input id="search" class="input" placeholder="যে tool খুঁজছেন লিখুন…"><button class="btn" id="searchBtn">Search</button></div><div class="chips">${[...new Set(tools.map(x=>x[3]))].map(c=>`<a class="chip" href="#/tools?cat=${encodeURIComponent(c)}">${catLabel(c)}</a>`).join("")}</div></div></section><section class="section" id="popular"><div class="container"><h2>জনপ্রিয় Tools</h2><div class="grid">${tools.slice(0,9).map(card).join("")}</div></div></section><section class="section"><div class="container"><h2>কেন BanglaSmartTools?</h2><div class="grid"><div class="card"><h3>⚡ দ্রুত</h3><p>বেশিরভাগ tool browser-এই কাজ করে।</p></div><div class="card"><h3>🔒 Privacy-friendly</h3><p>যেখানে সম্ভব local browser processing ব্যবহার করা হয়েছে।</p></div><div class="card"><h3>📱 Mobile friendly</h3><p>মোবাইল ও desktop উভয়ের জন্য responsive design।</p></div></div></div></section>`;
  $("#searchBtn").onclick=()=>searchTools($("#search").value);
  $("#search").oninput=e=>searchTools(e.target.value);
  $("#search").addEventListener("keydown",e=>{if(e.key==="Enter")searchTools(e.target.value)});
}
function searchTools(q){const a=tools.filter(t=>(t[1]+t[2]+t[3]).toLowerCase().includes(q.toLowerCase()));const box=document.querySelector("#searchResults");if(box)box.innerHTML=a.map(card).join("")||"<p>কোনো tool পাওয়া যায়নি।</p>";else if(q){app.insertAdjacentHTML("beforeend",`<section class="section container" id="searchResults">${a.map(card).join("")||"<p>কোনো tool পাওয়া যায়নি।</p>"}</section>`)}}
function toolsPage(cat){
  const showFav=cat==="__favorites__";
  const list=showFav?tools.filter(t=>state.favorites.includes(t[0])):(cat?tools.filter(t=>t[3]===cat):tools);
  const heading=showFav?"আমার Favorite Tools":(cat?`${cat} Tools`:"সব Tools");
  setMeta(`${heading} — BanglaSmartTools`,showFav?"আপনার পছন্দের tools এক জায়গায়।":(cat?`BanglaSmartTools-এর সব ${cat} ক্যাটেগরির ফ্রি অনলাইন tool।`:"BanglaSmartTools-এর সব ফ্রি অনলাইন tool এক জায়গায় — calculator, image, PDF, text ও developer tools।"));
  clearSchema();
  const cats=[...new Set(tools.map(x=>x[3]))];
  const chips=`<a class="chip${!cat?" active":""}" href="#/tools">সব</a>`+cats.map(c=>`<a class="chip${c===cat?" active":""}" href="#/tools?cat=${encodeURIComponent(c)}">${catLabel(c)}</a>`).join("")+`<a class="chip${showFav?" active":""}" href="#/tools?cat=__favorites__">★ Favorites</a>`;
  app.innerHTML=`<section class="section container"><h1>${heading}</h1><p>আপনার প্রয়োজনীয় free online tool বেছে নিন।</p><div class="chips" style="margin:14px 0 26px">${chips}</div><div class="grid">${list.map(card).join("")||(showFav?"<p>এখনো কোনো tool favorite করা হয়নি — card-এর ☆ আইকনে ক্লিক করুন।</p>":"<p>এই category-তে কোনো tool পাওয়া যায়নি।</p>")}</div></section>`;
}
function blog(){
  setMeta("Blog — BanglaSmartTools","VAT, Percentage, Excel, Tally ও PDF নিয়ে সহজ বাংলা guide।");
  clearSchema();
  app.innerHTML=`<section class="section container"><h1>Blog</h1><div class="grid">${blogs.map(b=>`<article class="card"><div class="blog-meta">BanglaSmartTools Guide</div><h2>${esc(b[1])}</h2><p>${esc(b[2])}</p><a class="btn" href="#/blog/${b[0]}">পড়ুন →</a></article>`).join("")}</div></section>`;
}
function article(slug){
  const b=blogs.find(x=>x[0]===slug)||blogs[0];
  setMeta(`${b[1]} — BanglaSmartTools Blog`,b[2]);
  setSchema({"@context":"https://schema.org","@type":"BlogPosting","headline":b[1],"description":b[2],"author":{"@type":"Organization","name":"BanglaSmartTools"},"publisher":{"@type":"Organization","name":"BanglaSmartTools"}});
  clearFaqSchema();
  const sections=b[3].map(([h,p])=>`<h2>${esc(h)}</h2><p>${p}</p>`).join("");
  const cta=b[4]?`<div class="result"><b>${state.lang==="bn"?"এখনই চেষ্টা করুন:":"Try it now:"}</b> <a class="btn" style="margin-top:10px;display:inline-block" href="#/${b[4]}">${esc((tools.find(t=>t[0]===b[4])||[,b[4]])[1])} ব্যবহার করুন →</a></div>`:"";
  app.innerHTML=`<article class="article container"><div class="blog-meta">BanglaSmartTools Blog</div><h1>${esc(b[1])}</h1><p>${esc(b[2])}</p>${shareRow(b[1])}<hr>${sections}${cta}</article>`;
  bindShare(b[1]);
}
function form(title,body){app.innerHTML=`<section class="tool-layout">${window.__crumb||""}<div class="card"><h1>${title}</h1>${body}</div></section>`}
function result(html){return `<div id="result" class="result">${html}</div>`}

function toolPage(id){
  saveRecent(id);
  const t=tools.find(x=>x[0]===id);
  if(!t)return notFound();
  setMeta(`${t[1]} — BanglaSmartTools`,`${t[2]} — সম্পূর্ণ ফ্রি, দ্রুত ও ব্রাউজার-ভিত্তিক BanglaSmartTools tool।`);
  setSchema({"@context":"https://schema.org","@type":"SoftwareApplication","name":t[1],"applicationCategory":"UtilitiesApplication","operatingSystem":"Any, Web Browser","description":t[2],"offers":{"@type":"Offer","price":"0","priceCurrency":"BDT"}});
  window.__crumb=breadcrumb(t[3],t[1]);
  if(toolContent[id])setFaqSchema(toolContent[id].faq); else clearFaqSchema();
  const pages={
"age-calculator":()=>{form(t[1],`<div class="field"><label>জন্মতারিখ</label><input id="birth" type="date" class="input"></div><button class="btn" id="go">হিসাব করুন</button>${result("ফলাফল এখানে দেখাবে")}`);enterSubmits(".tool-layout","#go");$("#go").onclick=()=>{const d=new Date($("#birth").value);if(isNaN(d))return toast("তারিখ দিন");const n=new Date();let y=n.getFullYear()-d.getFullYear(),m=n.getMonth()-d.getMonth(),day=n.getDate()-d.getDate();if(day<0){m--;day+=new Date(n.getFullYear(),n.getMonth(),0).getDate()}if(m<0){y--;m+=12}$("#result").innerHTML=`আপনার বয়স <b>${y} বছর ${m} মাস ${day} দিন</b>। <div class="actions"><button class="btn alt" id="copyAge">Copy</button></div>`;$("#copyAge").onclick=()=>copyText(`${y} বছর ${m} মাস ${day} দিন`)}},
"percentage-calculator":()=>{form(t[1],`<div class="form-grid"><div class="field"><label>সংখ্যা</label><input id="a" type="number" class="input"></div><div class="field"><label>শতাংশ (%)</label><input id="b" type="number" class="input"></div></div><button class="btn" id="go">হিসাব করুন</button>${result("ফলাফল")}`);enterSubmits(".tool-layout","#go");$("#go").onclick=()=>{const v=+$("#a").value*+$("#b").value/100;$("#result").innerHTML=`ফলাফল: <b>${v}</b> <button class="small" id="copy">Copy</button>`;$("#copy").onclick=()=>copyText(String(v))}},
"bmi-calculator":()=>{form(t[1],`<div class="form-grid"><div class="field"><label>ওজন (kg)</label><input id="w" type="number" class="input"></div><div class="field"><label>উচ্চতা (cm)</label><input id="h" type="number" class="input"></div></div><button class="btn" id="go">হিসাব করুন</button>${result("BMI ফলাফল")}`);enterSubmits(".tool-layout","#go");$("#go").onclick=()=>{const v=(+$("#w").value)/Math.pow(+$("#h").value/100,2);$("#result").innerHTML=`BMI: <b>${v.toFixed(2)}</b>`}},
"discount-calculator":()=>{form(t[1],`<div class="form-grid"><div class="field"><label>মূল দাম</label><input id="p" type="number" class="input"></div><div class="field"><label>Discount %</label><input id="d" type="number" class="input"></div></div><button class="btn" id="go">হিসাব করুন</button>${result("ফলাফল")}`);enterSubmits(".tool-layout","#go");$("#go").onclick=()=>{let p=+$("#p").value,d=+$("#d").value,s=p*d/100;$("#result").innerHTML=`Discount: <b>${s.toFixed(2)}</b><br>Final price: <b>${(p-s).toFixed(2)}</b>`}},
"profit-loss-calculator":()=>{form(t[1],`<div class="form-grid"><div class="field"><label>ক্রয়মূল্য</label><input id="c" type="number" class="input"></div><div class="field"><label>বিক্রয়মূল্য</label><input id="s" type="number" class="input"></div></div><button class="btn" id="go">হিসাব করুন</button>${result("ফলাফল")}`);enterSubmits(".tool-layout","#go");$("#go").onclick=()=>{let c=+$("#c").value,s=+$("#s").value,p=s-c,pc=c?p/c*100:0;$("#result").innerHTML=p>=0?`লাভ: <b>${p.toFixed(2)}</b> (${pc.toFixed(2)}%)`:`ক্ষতি: <b>${Math.abs(p).toFixed(2)}</b> (${Math.abs(pc).toFixed(2)}%)`}},
"salary-calculator":()=>{form(t[1],`<div class="field"><label>মাসিক বেতন</label><input id="m" type="number" class="input"></div><button class="btn" id="go">হিসাব করুন</button>${result("ফলাফল")}`);enterSubmits(".tool-layout","#go");$("#go").onclick=()=>{let m=+$("#m").value;$("#result").innerHTML=`বার্ষিক বেতন: <b>${(m*12).toFixed(2)}</b>`}},
"vat-calculator":()=>{form(t[1],`<div class="form-grid"><div class="field"><label>মূল মূল্য</label><input id="p" type="number" class="input"></div><div class="field"><label>VAT %</label><input id="v" type="number" value="15" class="input"></div></div><button class="btn" id="go">হিসাব করুন</button>${result("ফলাফল")}`);enterSubmits(".tool-layout","#go");$("#go").onclick=()=>{let p=+$("#p").value,v=+$("#v").value,x=p*v/100;$("#result").innerHTML=`VAT: <b>${x.toFixed(2)}</b><br>মোট: <b>${(p+x).toFixed(2)}</b>`}},
"emi-calculator":()=>{form(t[1],`<div class="form-grid"><div class="field"><label>Loan amount</label><input id="p" type="number" class="input"></div><div class="field"><label>Annual interest %</label><input id="r" type="number" class="input"></div><div class="field"><label>Months</label><input id="n" type="number" class="input"></div></div><button class="btn" id="go">হিসাব করুন</button>${result("ফলাফল")}`);enterSubmits(".tool-layout","#go");$("#go").onclick=()=>{let p=+$("#p").value,r=+$("#r").value/1200,n=+$("#n").value,e=r? p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):p/n;$("#result").innerHTML=`মাসিক EMI: <b>${e.toFixed(2)}</b>`}},
"date-calculator":()=>{form(t[1],`<div class="form-grid"><div class="field"><label>শুরুর তারিখ</label><input id="a" type="date" class="input"></div><div class="field"><label>শেষ তারিখ</label><input id="b" type="date" class="input"></div></div><button class="btn" id="go">হিসাব করুন</button>${result("ফলাফল")}`);enterSubmits(".tool-layout","#go");$("#go").onclick=()=>{let a=new Date($("#a").value),b=new Date($("#b").value);if(isNaN(a)||isNaN(b))return toast("দুইটি তারিখ দিন");$("#result").innerHTML=`ব্যবধান: <b>${Math.abs(Math.round((b-a)/86400000))} দিন</b>`}},
"currency-converter":()=>{form(t[1],`<div class="form-grid"><div class="field"><label>Amount</label><input id="amt" type="number" value="1" class="input"></div><div class="field"><label>From</label><select id="from" class="select"><option>BDT</option><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option><option>JPY</option></select></div><div class="field"><label>To</label><select id="to" class="select"><option>USD</option><option>BDT</option><option>EUR</option><option>GBP</option><option>INR</option><option>JPY</option></select></div></div><button class="btn" id="go">Convert</button>${result("Rate লোড করতে Convert চাপুন")}<p class="blog-meta">Rates are provided by ExchangeRate-API and may update daily.</p>`);enterSubmits(".tool-layout","#go");$("#go").onclick=async()=>{const amt=+$("#amt").value,from=$("#from").value,to=$("#to").value;$("#result").innerHTML=`<span class="loading-row"><span class="spinner"></span> Rate আনা হচ্ছে…</span>`;try{const r=await fetch(`https://open.er-api.com/v6/latest/${from}`);if(!r.ok)throw new Error("bad response");const j=await r.json();if(!j.rates||!j.rates[to])throw new Error("no rate");const v=amt*j.rates[to];$("#result").innerHTML=`<b>${amt} ${from} = ${v.toFixed(4)} ${to}</b><br>Rate: 1 ${from} = ${j.rates[to]} ${to}`}catch{toast("Rate পাওয়া যায়নি, একটু পর আবার চেষ্টা করুন");$("#result").textContent="এই মুহূর্তে rate আনা যায়নি — ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।"}}},
"word-counter":()=>textCounter(t[1],true),"character-counter":()=>textCounter(t[1],false),
"case-converter":()=>{form(t[1],`<textarea id="txt" class="textarea" placeholder="এখানে লিখুন…"></textarea><div class="actions"><button class="btn" id="upper">UPPER</button><button class="btn" id="lower">lower</button><button class="btn" id="title">Title Case</button><button class="btn alt" id="copy">Copy</button></div>`);const x=$("#txt");$("#upper").onclick=()=>x.value=x.value.toUpperCase();$("#lower").onclick=()=>x.value=x.value.toLowerCase();$("#title").onclick=()=>x.value=x.value.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());$("#copy").onclick=()=>copyText(x.value)},
"json-formatter":()=>{form(t[1],`<textarea id="txt" class="textarea" placeholder='{"name":"Ashik"}'></textarea><div class="actions"><button class="btn" id="format">Format</button><button class="btn alt" id="min">Minify</button><button class="btn alt" id="copy">Copy</button></div>${result("JSON output")}`);const x=$("#txt");$("#format").onclick=()=>{try{$("#result").textContent=JSON.stringify(JSON.parse(x.value),null,2)}catch(e){toast("Invalid JSON: "+e.message)}};$("#min").onclick=()=>{try{$("#result").textContent=JSON.stringify(JSON.parse(x.value))}catch(e){toast("Invalid JSON: "+e.message)}};$("#copy").onclick=()=>copyText(x.value)},
"password-generator":()=>{form(t[1],`<div class="form-grid"><div class="field"><label>Length</label><input id="n" type="number" min="6" max="128" value="16" class="input"></div></div><button class="btn" id="go">Generate</button>${result("Password")}`);enterSubmits(".tool-layout","#go");$("#go").onclick=()=>{let n=Math.min(128,Math.max(6,+$("#n").value||16)),chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-";let out="",a=new Uint32Array(n);crypto.getRandomValues(a);for(let i=0;i<n;i++)out+=chars[a[i]%chars.length];$("#result").innerHTML=`<code>${esc(out)}</code> <button class="small" id="copy">Copy</button>`;$("#copy").onclick=()=>copyText(out)}},
"qr-generator":()=>{form(t[1],`<input id="txt" class="input" placeholder="Text বা URL"><button class="btn" id="go">Generate QR</button><div id="qr" class="result"></div>`);enterSubmits(".tool-layout","#go");$("#go").onclick=async()=>{$("#qr").innerHTML=`<span class="loading-row"><span class="spinner"></span> লোড হচ্ছে…</span>`;try{await loadQRCode();$("#qr").innerHTML="";new QRCode($("#qr"),{text:$("#txt").value||" ",width:220,height:220})}catch{toast("QR library লোড করা যায়নি");$("#qr").textContent="ব্যর্থ হয়েছে, আবার চেষ্টা করুন।"}}},
"image-compressor":()=>imageTool(t[1],"compress"),"image-resizer":()=>imageTool(t[1],"resize"),"jpg-to-png":()=>imageTool(t[1],"jpgpng"),"png-to-jpg":()=>imageTool(t[1],"pngjpg"),
"pdf-to-jpg":()=>pdfTool(t[1]),
"unit-converter":()=>{
  const groups={
    length:{units:["মিটার (m)","কিলোমিটার (km)","সেন্টিমিটার (cm)","মিলিমিটার (mm)","মাইল (mile)","গজ (yard)","ফুট (feet)","ইঞ্চি (inch)"],factors:[1,1000,0.01,0.001,1609.34,0.9144,0.3048,0.0254]},
    weight:{units:["কিলোগ্রাম (kg)","গ্রাম (g)","পাউন্ড (lb)","মণ (maund)","টন (ton)"],factors:[1,0.001,0.453592,37.3242,1000]},
    temp:{units:["সেলসিয়াস (°C)","ফারেনহাইট (°F)","কেলভিন (K)"]}
  };
  const opts=g=>groups[g].units.map((u,i)=>`<option value="${i}">${u}</option>`).join("");
  form(t[1],`<div class="field"><label>ধরন</label><select id="grp" class="select"><option value="length">দৈর্ঘ্য (Length)</option><option value="weight">ওজন (Weight)</option><option value="temp">তাপমাত্রা (Temperature)</option></select></div><div class="form-grid"><div class="field"><label>পরিমাণ</label><input id="amt" type="number" value="1" class="input"></div><div class="field"><label>থেকে</label><select id="from" class="select"></select></div><div class="field"><label>এ</label><select id="to" class="select"></select></div></div><button class="btn" id="go">Convert</button>${result("ফলাফল")}`);
  const refresh=()=>{const g=$("#grp").value;$("#from").innerHTML=opts(g);$("#to").innerHTML=opts(g);$("#to").selectedIndex=1};
  refresh(); $("#grp").onchange=refresh;
  enterSubmits(".tool-layout","#go");
  $("#go").onclick=()=>{
    const g=$("#grp").value,amt=+$("#amt").value,fi=+$("#from").value,ti=+$("#to").value;
    let out;
    if(g==="temp"){let c=fi===0?amt:fi===1?(amt-32)*5/9:amt-273.15;out=ti===0?c:ti===1?c*9/5+32:c+273.15}
    else{const f=groups[g].factors;out=amt*f[fi]/f[ti]}
    $("#result").innerHTML=`<b>${amt} ${groups[g].units[fi]} = ${+out.toFixed(6)} ${groups[g].units[ti]}</b>`;
  };
},
"number-to-words":()=>{
  form(t[1],`<div class="field"><label>সংখ্যা লিখুন</label><input id="num" type="number" step="0.01" class="input" placeholder="যেমন: 123456"></div><button class="btn" id="go">কথায় লিখুন</button>${result("ফলাফল এখানে দেখাবে")}<p class="blog-meta">সর্বোচ্চ প্রায় ৯৯,৯৯,৯৯,৯৯৯ পর্যন্ত সমর্থিত।</p>`);
  enterSubmits(".tool-layout","#go");
  $("#go").onclick=()=>{
    const v=parseFloat($("#num").value);
    if(isNaN(v))return toast("সঠিক সংখ্যা দিন");
    const neg=v<0,abs=Math.abs(v),intPart=Math.floor(abs),paisa=Math.round((abs-intPart)*100);
    const words=(neg?"ঋণাত্মক ":"")+numToBanglaWords(intPart);
    const taka=words+" টাকা"+(paisa?` ${numToBanglaWords(paisa)} পয়সা`:"")+" মাত্র";
    $("#result").innerHTML=`<b>শব্দে:</b> ${words}<br><b>চেক/ইনভয়েসে লেখার জন্য:</b> ${taka} <button class="small" id="copy" style="margin-left:6px">Copy</button>`;
    $("#copy").onclick=()=>copyText(taka);
  };
},
"bangla-number-converter":()=>{
  form(t[1],`<textarea id="txt" class="textarea" placeholder="সংখ্যা বা টেক্সট লিখুন…"></textarea><div class="actions"><button class="btn" id="toBn">বাংলায় করুন</button><button class="btn alt" id="toEn">English-এ করুন</button><button class="btn alt" id="copy">Copy</button></div>`);
  const x=$("#txt"),bn="০১২৩৪৫৬৭৮৯";
  $("#toBn").onclick=()=>{x.value=x.value.replace(/[0-9]/g,d=>bn[+d])};
  $("#toEn").onclick=()=>{x.value=x.value.replace(/[০-৯]/g,d=>String(bn.indexOf(d)))};
  $("#copy").onclick=()=>copyText(x.value);
},
"data-size-converter":()=>{
  const units=["Bit","Byte","KB","MB","GB","TB"],factors=[1/8,1,1024,1024**2,1024**3,1024**4];
  form(t[1],`<div class="form-grid"><div class="field"><label>পরিমাণ</label><input id="amt" type="number" value="1" class="input"></div><div class="field"><label>থেকে</label><select id="from" class="select">${units.map((u,i)=>`<option value="${i}" ${i===2?"selected":""}>${u}</option>`).join("")}</select></div><div class="field"><label>এ</label><select id="to" class="select">${units.map((u,i)=>`<option value="${i}" ${i===3?"selected":""}>${u}</option>`).join("")}</select></div></div><button class="btn" id="go">Convert</button>${result("ফলাফল")}`);
  enterSubmits(".tool-layout","#go");
  $("#go").onclick=()=>{
    const amt=+$("#amt").value,fi=+$("#from").value,ti=+$("#to").value,bytes=amt*factors[fi],out=bytes/factors[ti];
    $("#result").innerHTML=`<b>${amt} ${units[fi]} = ${+out.toFixed(6)} ${units[ti]}</b>`;
  };
},
"base-converter":()=>{
  form(t[1],`<div class="form-grid"><div class="field"><label>সংখ্যা</label><input id="num" class="input" placeholder="যেমন: 255"></div><div class="field"><label>Base</label><select id="base" class="select"><option value="2">Binary (2)</option><option value="8">Octal (8)</option><option value="10" selected>Decimal (10)</option><option value="16">Hexadecimal (16)</option></select></div></div><button class="btn" id="go">Convert</button>${result("ফলাফল")}`);
  enterSubmits(".tool-layout","#go");
  $("#go").onclick=()=>{
    const base=+$("#base").value,val=$("#num").value.trim(),dec=parseInt(val,base);
    if(isNaN(dec))return toast("সঠিক সংখ্যা দিন (base অনুযায়ী)");
    $("#result").innerHTML=`Binary: <b>${dec.toString(2)}</b><br>Octal: <b>${dec.toString(8)}</b><br>Decimal: <b>${dec}</b><br>Hexadecimal: <b>${dec.toString(16).toUpperCase()}</b>`;
  };
},
"color-converter":()=>{
  form(t[1],`<div class="field"><label>HEX Code</label><input id="hex" class="input" value="#14b8a6"></div><div class="actions"><button class="btn" id="toRgb">HEX → RGB</button></div><div class="form-grid" style="margin-top:16px"><div class="field"><label>R</label><input id="r" type="number" min="0" max="255" class="input" value="20"></div><div class="field"><label>G</label><input id="g" type="number" min="0" max="255" class="input" value="184"></div><div class="field"><label>B</label><input id="b" type="number" min="0" max="255" class="input" value="166"></div></div><div class="actions"><button class="btn alt" id="toHex">RGB → HEX</button></div><div id="swatch" style="height:60px;border-radius:10px;margin-top:16px;border:1px solid var(--border)"></div>${result("ফলাফল")}`);
  const setSwatch=h=>{$("#swatch").style.background=h};
  $("#toRgb").onclick=()=>{
    let h=$("#hex").value.trim().replace("#","");
    if(h.length===3)h=h.split("").map(c=>c+c).join("");
    if(!/^[0-9a-fA-F]{6}$/.test(h))return toast("সঠিক HEX code দিন");
    const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
    $("#r").value=r;$("#g").value=g;$("#b").value=b;
    $("#result").innerHTML=`RGB: <b>rgb(${r}, ${g}, ${b})</b>`;
    setSwatch("#"+h);
  };
  $("#toHex").onclick=()=>{
    const r=Math.min(255,Math.max(0,+$("#r").value)),g=Math.min(255,Math.max(0,+$("#g").value)),b=Math.min(255,Math.max(0,+$("#b").value));
    const hex="#"+[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("");
    $("#hex").value=hex;
    $("#result").innerHTML=`HEX: <b>${hex}</b>`;
    setSwatch(hex);
  };
  setSwatch($("#hex").value);
},
"base64-encoder-decoder":()=>{
  form(t[1],`<textarea id="txt" class="textarea" placeholder="টেক্সট লিখুন…"></textarea><div class="actions"><button class="btn" id="enc">Encode</button><button class="btn alt" id="dec">Decode</button><button class="btn alt" id="copy">Copy</button></div>`);
  const x=$("#txt");
  $("#enc").onclick=()=>{try{x.value=btoa(unescape(encodeURIComponent(x.value)))}catch{toast("Encode করা যায়নি")}};
  $("#dec").onclick=()=>{try{x.value=decodeURIComponent(escape(atob(x.value)))}catch{toast("সঠিক Base64 টেক্সট দিন")}};
  $("#copy").onclick=()=>copyText(x.value);
},
"url-encoder-decoder":()=>{
  form(t[1],`<textarea id="txt" class="textarea" placeholder="URL বা টেক্সট লিখুন…"></textarea><div class="actions"><button class="btn" id="enc">Encode</button><button class="btn alt" id="dec">Decode</button><button class="btn alt" id="copy">Copy</button></div>`);
  const x=$("#txt");
  $("#enc").onclick=()=>{x.value=encodeURIComponent(x.value)};
  $("#dec").onclick=()=>{try{x.value=decodeURIComponent(x.value)}catch{toast("Decode করা যায়নি")}};
  $("#copy").onclick=()=>copyText(x.value);
},
"uuid-generator":()=>{
  form(t[1],`<div class="form-grid"><div class="field"><label>কতগুলো UUID চান</label><input id="n" type="number" min="1" max="50" value="1" class="input"></div></div><button class="btn" id="go">Generate</button>${result("UUID এখানে দেখাবে")}`);
  enterSubmits(".tool-layout","#go");
  $("#go").onclick=()=>{
    const n=Math.min(50,Math.max(1,+$("#n").value||1));
    const ids=Array.from({length:n},()=>crypto.randomUUID());
    $("#result").innerHTML=ids.map(id=>`<code>${id}</code>`).join("<br>")+`<div class="actions"><button class="btn alt" id="copy">সব Copy করুন</button></div>`;
    $("#copy").onclick=()=>copyText(ids.join("\n"));
  };
},
"timestamp-converter":()=>{
  form(t[1],`<div class="field"><label>Unix Timestamp (seconds)</label><input id="ts" type="number" class="input" placeholder="যেমন: 1700000000"></div><div class="actions"><button class="btn" id="toDate">তারিখে রূপান্তর</button><button class="btn alt" id="now">এখনকার Timestamp</button></div>${result("ফলাফল")}<hr style="margin:22px 0;border-color:var(--border)"><div class="field"><label>তারিখ ও সময়</label><input id="dt" type="datetime-local" class="input"></div><button class="btn alt" id="toTs" style="margin-top:10px">Timestamp-এ রূপান্তর</button><div id="result2" class="result">ফলাফল</div>`);
  $("#toDate").onclick=()=>{const ts=+$("#ts").value;if(isNaN(ts)||$("#ts").value==="")return toast("সঠিক timestamp দিন");const d=new Date(ts*1000);$("#result").innerHTML=`<b>${d.toString()}</b>`};
  $("#now").onclick=()=>{$("#ts").value=Math.floor(Date.now()/1000);toast("বর্তমান timestamp বসানো হয়েছে")};
  $("#toTs").onclick=()=>{const d=new Date($("#dt").value);if(isNaN(d))return toast("তারিখ দিন");$("#result2").innerHTML=`Unix Timestamp: <b>${Math.floor(d.getTime()/1000)}</b>`};
},
"lorem-ipsum-generator":()=>{
  const words="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");
  function genPara(){const n=6+Math.floor(Math.random()*4);let arr=[];for(let i=0;i<n;i++){const len=5+Math.floor(Math.random()*10);let s=[];for(let j=0;j<len;j++)s.push(words[Math.floor(Math.random()*words.length)]);s[0]=s[0][0].toUpperCase()+s[0].slice(1);arr.push(s.join(" ")+".")}return arr.join(" ")}
  form(t[1],`<div class="form-grid"><div class="field"><label>প্যারাগ্রাফ সংখ্যা</label><input id="n" type="number" min="1" max="20" value="3" class="input"></div></div><button class="btn" id="go">Generate</button>${result("Lorem Ipsum text এখানে দেখাবে")}`);
  enterSubmits(".tool-layout","#go");
  $("#go").onclick=()=>{
    const n=Math.min(20,Math.max(1,+$("#n").value||3));
    const paras=Array.from({length:n},genPara);
    $("#result").innerHTML=`<div style="white-space:pre-wrap">${paras.join("\n\n")}</div><div class="actions"><button class="btn alt" id="copy">Copy</button></div>`;
    $("#copy").onclick=()=>copyText(paras.join("\n\n"));
  };
},
"text-reverser":()=>{
  form(t[1],`<textarea id="txt" class="textarea" placeholder="এখানে টেক্সট লিখুন…"></textarea><div class="actions"><button class="btn" id="revChar">অক্ষর Reverse</button><button class="btn alt" id="revWord">শব্দের ক্রম Reverse</button><button class="btn alt" id="copy">Copy</button></div>`);
  const x=$("#txt");
  $("#revChar").onclick=()=>{x.value=[...x.value].reverse().join("")};
  $("#revWord").onclick=()=>{x.value=x.value.split(/\s+/).reverse().join(" ")};
  $("#copy").onclick=()=>copyText(x.value);
},
"sentence-counter":()=>{
  form(t[1],`<textarea id="txt" class="textarea" placeholder="এখানে লেখা লিখুন…"></textarea>${result("Sentences: 0 | Words: 0 | Characters: 0")}`);
  $("#txt").oninput=e=>{
    const s=e.target.value;
    const sentences=s.split(/(?<=[।.!?])\s+/).map(x=>x.trim()).filter(Boolean);
    const words=s.trim()?s.trim().split(/\s+/).length:0;
    $("#result").textContent=`Sentences: ${s.trim()?sentences.length:0} | Words: ${words} | Characters: ${s.length}`;
  };
},
"remove-duplicate-lines":()=>{
  form(t[1],`<textarea id="txt" class="textarea" placeholder="প্রতি লাইনে একটি করে item লিখুন…"></textarea><div class="actions"><button class="btn" id="go">Duplicate সরান</button><button class="btn alt" id="copy">Copy</button></div>${result("ফলাফল এখানে দেখাবে")}`);
  let out="";
  $("#go").onclick=()=>{
    const lines=$("#txt").value.split("\n");
    const seen=new Set(),keep=[];
    for(const l of lines){const k=l.trim();if(!seen.has(k)){seen.add(k);keep.push(l)}}
    out=keep.join("\n");
    $("#result").innerHTML=`<pre style="white-space:pre-wrap;margin:0;font-family:inherit">${esc(out)}</pre>`;
    toast(`${lines.length-keep.length}টা duplicate লাইন সরানো হয়েছে`);
  };
  $("#copy").onclick=()=>copyText(out);
},
"text-sorter":()=>{
  form(t[1],`<textarea id="txt" class="textarea" placeholder="প্রতি লাইনে একটি item লিখুন…"></textarea><div class="actions"><button class="btn" id="asc">A → Z</button><button class="btn alt" id="desc">Z → A</button><button class="btn alt" id="copy">Copy</button></div>`);
  const x=$("#txt");
  const sortIt=dir=>{const lines=x.value.split("\n").filter(l=>l.length);lines.sort((a,b)=>dir*a.localeCompare(b,"bn"));x.value=lines.join("\n")};
  $("#asc").onclick=()=>sortIt(1);
  $("#desc").onclick=()=>sortIt(-1);
  $("#copy").onclick=()=>copyText(x.value);
},
"time-calculator":()=>{
  form(t[1],`<div class="form-grid"><div class="field"><label>শুরুর সময়</label><input id="t1" type="time" class="input"></div><div class="field"><label>শেষ সময়</label><input id="t2" type="time" class="input"></div></div><button class="btn" id="go">ব্যবধান বের করুন</button>${result("ফলাফল")}`);
  enterSubmits(".tool-layout","#go");
  $("#go").onclick=()=>{
    const [h1,m1]=($("#t1").value||"").split(":").map(Number);
    const [h2,m2]=($("#t2").value||"").split(":").map(Number);
    if(isNaN(h1)||isNaN(h2))return toast("দুইটি সময় দিন");
    let mins=(h2*60+m2)-(h1*60+m1);
    if(mins<0)mins+=24*60;
    const h=Math.floor(mins/60),m=mins%60;
    $("#result").innerHTML=`ব্যবধান: <b>${h} ঘণ্টা ${m} মিনিট</b>`;
  };
},
"bkash-charge-calculator":()=>{
  form(t[1],`<div class="form-grid"><div class="field"><label>Cash Out পরিমাণ (৳)</label><input id="amt" type="number" value="1000" class="input"></div><div class="field"><label>ধরন</label><select id="type" class="select"><option value="1.49">Priyo Agent / ATM (১.৪৯%)</option><option value="1.85">Standard Agent (১.৮৫%)</option></select></div></div><button class="btn" id="go">চার্জ বের করুন</button>${result("ফলাফল")}<p class="blog-meta">চার্জ পরিবর্তনযোগ্য — bKash app-এ চূড়ান্ত charge দেখে নিন।</p>`);
  enterSubmits(".tool-layout","#go");
  $("#go").onclick=()=>{
    const amt=+$("#amt").value,rate=+$("#type").value,charge=amt*rate/100;
    $("#result").innerHTML=`চার্জ: <b>৳${charge.toFixed(2)}</b><br>হাতে পাবেন: <b>৳${(amt-charge).toFixed(2)}</b>`;
  };
},
"nagad-charge-calculator":()=>{
  form(t[1],`<div class="form-grid"><div class="field"><label>Cash Out পরিমাণ (৳)</label><input id="amt" type="number" value="1000" class="input"></div><div class="field"><label>মাধ্যম</label><select id="type" class="select"><option value="1.25">App (১.২৫%)</option><option value="1.5">USSD *167# (১.৫%)</option></select></div></div><button class="btn" id="go">চার্জ বের করুন</button>${result("ফলাফল")}<p class="blog-meta">চার্জ পরিবর্তনযোগ্য — Nagad app-এ চূড়ান্ত charge দেখে নিন।</p>`);
  enterSubmits(".tool-layout","#go");
  $("#go").onclick=()=>{
    const amt=+$("#amt").value,rate=+$("#type").value,charge=amt*rate/100;
    $("#result").innerHTML=`চার্জ: <b>৳${charge.toFixed(2)}</b><br>হাতে পাবেন: <b>৳${(amt-charge).toFixed(2)}</b>`;
  };
},
"rocket-charge-calculator":()=>{
  form(t[1],`<div class="form-grid"><div class="field"><label>Cash Out পরিমাণ (৳)</label><input id="amt" type="number" value="1000" class="input"></div><div class="field"><label>মাধ্যম</label><select id="type" class="select"><option value="1.67">Agent (১.৬৭%)</option><option value="0.9">DBBL ATM/Branch (০.৯%)</option></select></div></div><button class="btn" id="go">চার্জ বের করুন</button>${result("ফলাফল")}<p class="blog-meta">চার্জ পরিবর্তনযোগ্য — Rocket app-এ চূড়ান্ত charge দেখে নিন।</p>`);
  enterSubmits(".tool-layout","#go");
  $("#go").onclick=()=>{
    const amt=+$("#amt").value,rate=+$("#type").value,charge=amt*rate/100;
    $("#result").innerHTML=`চার্জ: <b>৳${charge.toFixed(2)}</b><br>হাতে পাবেন: <b>৳${(amt-charge).toFixed(2)}</b>`;
  };
},
"income-tax-calculator":()=>{
  form(t[1],`<div class="form-grid"><div class="field"><label>বার্ষিক করযোগ্য আয় (৳)</label><input id="inc" type="number" class="input"></div><div class="field"><label>Category</label><select id="cat" class="select"><option value="375000">General</option><option value="425000">নারী / ৬৫+ বছর</option><option value="500000">প্রতিবন্ধী / তৃতীয় লিঙ্গ</option><option value="525000">গেজেটেড মুক্তিযোদ্ধা</option></select></div></div><button class="btn" id="go">হিসাব করুন</button>${result("ফলাফল")}<p class="blog-meta">এটি আনুমানিক হিসাব (AY 2026-27 slab অনুযায়ী), চূড়ান্ত নয়। rebate/minimum tax বিবেচনা করা হয়নি।</p>`);
  enterSubmits(".tool-layout","#go");
  $("#go").onclick=()=>{
    let inc=+$("#inc").value,free=+$("#cat").value;
    if(!inc)return toast("আয় লিখুন");
    let rem=Math.max(0,inc-free),tax=0,brackets=[[300000,.10],[400000,.15],[500000,.20],[2000000,.25],[Infinity,.30]],breakdown=[];
    for(const [slab,rate] of brackets){
      if(rem<=0)break;
      const taxed=Math.min(rem,slab),t2=taxed*rate;
      if(taxed>0){tax+=t2;breakdown.push(`৳${taxed.toLocaleString()} × ${rate*100}% = ৳${t2.toLocaleString(undefined,{maximumFractionDigits:0})}`)}
      rem-=taxed;
    }
    $("#result").innerHTML=`আনুমানিক Tax: <b>৳${tax.toLocaleString(undefined,{maximumFractionDigits:0})}</b><br><small>${breakdown.join("<br>")||"Tax-free সীমার মধ্যে, কোনো Tax নেই"}</small>`;
  };
},
"electricity-bill-calculator":()=>{
  form(t[1],`<div class="field"><label>মাসিক ব্যবহার (Unit/kWh)</label><input id="units" type="number" class="input"></div><button class="btn" id="go">বিল হিসাব করুন</button>${result("ফলাফল")}<p class="blog-meta">BERC residential (LT-A) স্ল্যাব অনুযায়ী আনুমানিক, প্রকৃত বিলের সাথে সামান্য তফাত হতে পারে।</p>`);
  enterSubmits(".tool-layout","#go");
  $("#go").onclick=()=>{
    let u=+$("#units").value;
    if(!u)return toast("Unit লিখুন");
    const slabs=[[50,4.19],[25,5.72],[125,6.48],[100,7.59],[100,10.40],[200,12.30],[Infinity,13.44]];
    let rem=u,energy=0,breakdown=[];
    for(const [size,rate] of slabs){
      if(rem<=0)break;
      const use=Math.min(rem,size),cost=use*rate;
      energy+=cost;breakdown.push(`${use} ইউনিট × ৳${rate} = ৳${cost.toFixed(2)}`);
      rem-=use;
    }
    const vat=energy*0.05,total=energy+vat;
    $("#result").innerHTML=`মোট আনুমানিক বিল: <b>৳${total.toFixed(2)}</b><br><small>Energy charge: ৳${energy.toFixed(2)} + 5% VAT: ৳${vat.toFixed(2)}</small><br><small>${breakdown.join("<br>")}</small>`;
  };
},
"ssc-hsc-gpa-calculator":()=>{
  form(t[1],`<div class="field"><label>প্রতিটি বিষয়ের Grade Point (কমা দিয়ে আলাদা, 0-5)</label><textarea id="pts" class="textarea" placeholder="যেমন: 5, 4, 3.5, 5, 4, 5"></textarea></div><button class="btn" id="go">GPA বের করুন</button>${result("ফলাফল")}`);
  $("#go").onclick=()=>{
    const nums=$("#pts").value.split(",").map(s=>parseFloat(s.trim())).filter(n=>!isNaN(n));
    if(!nums.length)return toast("অন্তত একটি Grade Point দিন");
    const avg=nums.reduce((a,b)=>a+b,0)/nums.length;
    $("#result").innerHTML=`গড় GPA: <b>${avg.toFixed(2)}</b> (${nums.length}টি বিষয়ের ভিত্তিতে)`;
  };
},
"cgpa-calculator":()=>{
  let rows=[[3,4],[3,4]];
  const render=()=>`<div id="rowsBox">${rows.map((r,i)=>`<div class="form-grid" style="margin-bottom:8px"><div class="field"><label>Credit Hour</label><input type="number" class="input credit" data-i="${i}" value="${r[0]}"></div><div class="field"><label>Grade Point</label><input type="number" step="0.01" max="4" class="input gp" data-i="${i}" value="${r[1]}"></div></div>`).join("")}</div><button class="btn alt" id="addRow" type="button">+ কোর্স যোগ করুন</button>`;
  form(t[1],`${render()}<button class="btn" id="go" style="margin-top:14px">CGPA হিসাব করুন</button>${result("ফলাফল")}`);
  function bindRows(){
    document.querySelectorAll(".credit").forEach(el=>el.onchange=()=>rows[+el.dataset.i][0]=+el.value);
    document.querySelectorAll(".gp").forEach(el=>el.onchange=()=>rows[+el.dataset.i][1]=+el.value);
  }
  bindRows();
  $("#addRow").onclick=()=>{rows.push([3,4]);$("#rowsBox").outerHTML=render().match(/<div id="rowsBox">[\s\S]*?<\/div>(?=<button)/)[0];bindRows()};
  $("#go").onclick=()=>{
    const totalCredit=rows.reduce((a,r)=>a+r[0],0),weighted=rows.reduce((a,r)=>a+r[0]*r[1],0);
    if(!totalCredit)return toast("Credit hour দিন");
    $("#result").innerHTML=`CGPA: <b>${(weighted/totalCredit).toFixed(3)}</b> (মোট Credit: ${totalCredit})`;
  };
},
"html-formatter":()=>{
  form(t[1],`<textarea id="txt" class="textarea" placeholder="HTML code paste করুন…"></textarea><div class="actions"><button class="btn" id="go">Format</button><button class="btn alt" id="copy">Copy</button></div>${result("Formatted output")}`);
  $("#go").onclick=()=>{
    let src=$("#txt").value.trim();
    if(!src)return toast("HTML code দিন");
    src=src.replace(/>\s*</g,"><");
    let indent=0,out="";
    const tokens=src.split(/(<[^>]+>)/).filter(Boolean);
    const voidTags=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
    for(const tok of tokens){
      if(/^<\//.test(tok)){indent=Math.max(0,indent-1);out+="  ".repeat(indent)+tok+"\n"}
      else if(/^<[^!/]/.test(tok)){
        const tagName=(tok.match(/^<([a-zA-Z0-9-]+)/)||[])[1]||"";
        const selfClose=/\/>$/.test(tok)||voidTags.has(tagName.toLowerCase());
        out+="  ".repeat(indent)+tok+"\n";
        if(!selfClose)indent++;
      } else if(tok.trim()){out+="  ".repeat(indent)+tok.trim()+"\n"}
    }
    $("#result").innerHTML=`<pre style="white-space:pre-wrap;margin:0;font-family:monospace;font-size:13px">${esc(out.trim())}</pre>`;
    window.__htmlOut=out.trim();
  };
  $("#copy").onclick=()=>copyText(window.__htmlOut||"");
},
"css-minifier":()=>{
  form(t[1],`<textarea id="txt" class="textarea" placeholder="CSS code paste করুন…"></textarea><div class="actions"><button class="btn" id="go">Minify</button><button class="btn alt" id="copy">Copy</button></div>${result("Minified output")}`);
  $("#go").onclick=()=>{
    let src=$("#txt").value;
    if(!src.trim())return toast("CSS code দিন");
    src=src.replace(/\/\*[\s\S]*?\*\//g,"");
    src=src.replace(/\s+/g," ").trim();
    src=src.replace(/\s*([{}:;,])\s*/g,"$1");
    src=src.replace(/;}/g,"}");
    $("#result").innerHTML=`<pre style="white-space:pre-wrap;margin:0;font-family:monospace;font-size:13px">${esc(src)}</pre><small>${$("#txt").value.length} → ${src.length} characters</small>`;
    window.__cssOut=src;
  };
  $("#copy").onclick=()=>copyText(window.__cssOut||"");
},
"js-minifier":()=>{
  form(t[1],`<textarea id="txt" class="textarea" placeholder="JavaScript code paste করুন…"></textarea><div class="actions"><button class="btn" id="go">Process</button><button class="btn alt" id="copy">Copy</button></div>${result("Output")}`);
  $("#go").onclick=()=>{
    const src=$("#txt").value;
    if(!src.trim())return toast("JS code দিন");
    let out="",i=0,n=src.length;
    while(i<n){
      const c=src[i],c2=src[i+1];
      if(c==="/"&&c2==="/"){while(i<n&&src[i]!=="\n")i++;continue}
      if(c==="/"&&c2==="*"){i+=2;while(i<n&&!(src[i]==="*"&&src[i+1]==="/"))i++;i+=2;continue}
      if(c==='"'||c==="'"||c==="`"){const q=c;out+=c;i++;while(i<n&&src[i]!==q){if(src[i]==="\\"){out+=src[i]+src[i+1];i+=2;continue}out+=src[i];i++}out+=src[i]||"";i++;continue}
      out+=c;i++;
    }
    out=out.split("\n").map(l=>l.trim()).filter(l=>l.length).join("\n");
    $("#result").innerHTML=`<pre style="white-space:pre-wrap;margin:0;font-family:monospace;font-size:13px">${esc(out)}</pre><small>${src.length} → ${out.length} characters</small>`;
    window.__jsOut=out;
  };
  $("#copy").onclick=()=>copyText(window.__jsOut||"");
},
"image-to-webp":()=>{
  form(t[1],`<div class="drop"><input id="file" type="file" accept="image/*"></div>${result("Result")}`);
  $("#file").onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    const im=new Image();
    im.onload=()=>{
      const c=document.createElement("canvas");c.width=im.width;c.height=im.height;
      c.getContext("2d").drawImage(im,0,0);
      c.toBlob(b=>{
        if(!b)return toast("এই browser WebP export সাপোর্ট করছে না");
        const url=URL.createObjectURL(b);
        $("#result").innerHTML=`<a class="btn" href="${url}" download="image.webp">Download WebP</a><br><small>${Math.round(b.size/1024)} KB</small>`;
      },"image/webp",0.9);
    };
    im.src=URL.createObjectURL(f);
  };
},
"webp-to-jpg":()=>{
  form(t[1],`<div class="drop"><input id="file" type="file" accept="image/webp,.webp"></div>${result("Result")}`);
  $("#file").onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    const im=new Image();
    im.onload=()=>{
      const c=document.createElement("canvas");c.width=im.width;c.height=im.height;
      const ctx=c.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(im,0,0);
      c.toBlob(b=>{
        const url=URL.createObjectURL(b);
        $("#result").innerHTML=`<a class="btn" href="${url}" download="image.jpg">Download JPG</a><br><small>${Math.round(b.size/1024)} KB</small>`;
      },"image/jpeg",0.92);
    };
    im.onerror=()=>toast("এই ছবি পড়া যায়নি, WebP ফাইল কিনা নিশ্চিত করুন");
    im.src=URL.createObjectURL(f);
  };
},
"image-cropper":()=>{
  form(t[1],`<div class="drop"><input id="file" type="file" accept="image/*"></div><div id="cropBox" style="display:none;margin-top:14px"><div style="position:relative;max-width:100%;touch-action:none" id="stage"><img id="im" style="max-width:100%;display:block;user-select:none;pointer-events:none"><div id="sel" style="position:absolute;border:2px solid var(--primary);background:rgba(20,184,166,.15);cursor:move"></div></div><button class="btn" id="go" style="margin-top:14px">Crop করে Download</button></div>${result("Crop করা ছবি এখানে আসবে")}`);
  let img,scale=1,sel={x:20,y:20,w:120,h:120},drag=null;
  const stage=()=>$("#stage"),selEl=()=>$("#sel");
  function draw(){const s=selEl();s.style.left=sel.x+"px";s.style.top=sel.y+"px";s.style.width=sel.w+"px";s.style.height=sel.h+"px"}
  $("#file").onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    img=new Image();
    img.onload=()=>{
      $("#cropBox").style.display="block";
      const im=$("#im");im.src=URL.createObjectURL(f);
      im.onload=()=>{
        scale=img.width/im.clientWidth;
        sel={x:im.clientWidth*0.15,y:im.clientHeight*0.15,w:im.clientWidth*0.7,h:im.clientHeight*0.7};
        draw();
      };
    };
    img.src=URL.createObjectURL(f);
  };
  stage().addEventListener("pointerdown",e=>{
    const r=stage().getBoundingClientRect();
    drag={sx:e.clientX,sy:e.clientY,ox:sel.x,oy:sel.y};
  });
  window.addEventListener("pointermove",e=>{
    if(!drag)return;
    const im=$("#im");if(!im)return;
    sel.x=Math.max(0,Math.min(im.clientWidth-sel.w,drag.ox+(e.clientX-drag.sx)));
    sel.y=Math.max(0,Math.min(im.clientHeight-sel.h,drag.oy+(e.clientY-drag.sy)));
    draw();
  });
  window.addEventListener("pointerup",()=>drag=null);
  $("#go")?.addEventListener("click",()=>{});
  document.addEventListener("click",e=>{
    if(e.target&&e.target.id==="go"&&img){
      const c=document.createElement("canvas");
      c.width=sel.w*scale;c.height=sel.h*scale;
      c.getContext("2d").drawImage(img,sel.x*scale,sel.y*scale,sel.w*scale,sel.h*scale,0,0,c.width,c.height);
      c.toBlob(b=>{
        const url=URL.createObjectURL(b);
        $("#result").innerHTML=`<img style="max-width:100%;border-radius:8px" src="${url}"><br><a class="btn" href="${url}" download="cropped.png" style="margin-top:8px;display:inline-block">Download</a>`;
      },"image/png");
    }
  });
},
"image-metadata-viewer":()=>{
  form(t[1],`<div class="drop"><input id="file" type="file" accept="image/*"></div>${result("তথ্য এখানে দেখাবে")}`);
  $("#file").onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    const im=new Image();
    im.onload=()=>{
      $("#result").innerHTML=`<b>File name:</b> ${esc(f.name)}<br><b>Dimensions:</b> ${im.width} × ${im.height} px<br><b>File size:</b> ${(f.size/1024).toFixed(1)} KB<br><b>Type:</b> ${f.type||"অজানা"}<br><b>Last modified:</b> ${f.lastModified?new Date(f.lastModified).toLocaleString("bn-BD"):"অজানা"}`;
    };
    im.src=URL.createObjectURL(f);
  };
},
"pdf-merge":()=>{
  form(t[1],`<div class="drop"><input id="file" type="file" accept="application/pdf" multiple></div><p class="blog-meta">একাধিক PDF select করুন (Ctrl/Cmd চেপে ধরে)।</p>${result("")}`);
  $("#file").onchange=async e=>{
    const files=[...e.target.files];
    if(files.length<2)return toast("অন্তত ২টি PDF select করুন");
    $("#result").innerHTML=`<span class="loading-row"><span class="spinner"></span> Merge হচ্ছে…</span>`;
    try{
      const {PDFDocument}=await loadPdfLib();
      const merged=await PDFDocument.create();
      for(const f of files){
        const bytes=await f.arrayBuffer();
        const src=await PDFDocument.load(bytes);
        const pages=await merged.copyPages(src,src.getPageIndices());
        pages.forEach(p=>merged.addPage(p));
      }
      const bytes=await merged.save();
      const url=URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}));
      $("#result").innerHTML=`<a class="btn" href="${url}" download="merged.pdf">Download merged.pdf</a>`;
    }catch{toast("Merge করা যায়নি");$("#result").textContent="একটি সমস্যা হয়েছে, ফাইলগুলো ঠিক আছে কিনা দেখে আবার চেষ্টা করুন।"}
  };
},
"pdf-split":()=>{
  form(t[1],`<div class="drop"><input id="file" type="file" accept="application/pdf"></div><div class="field" style="margin-top:12px"><label>Page/Range (যেমন 1-3,5)</label><input id="range" class="input" placeholder="1-3,5"></div><button class="btn" id="go">Split করুন</button>${result("")}`);
  let fileObj=null;
  $("#file").onchange=e=>{fileObj=e.target.files[0]};
  $("#go").onclick=async()=>{
    if(!fileObj)return toast("প্রথমে একটি PDF select করুন");
    const rangeStr=$("#range").value.trim();
    if(!rangeStr)return toast("Page range লিখুন");
    $("#result").innerHTML=`<span class="loading-row"><span class="spinner"></span> Split হচ্ছে…</span>`;
    try{
      const {PDFDocument}=await loadPdfLib();
      const bytes=await fileObj.arrayBuffer();
      const src=await PDFDocument.load(bytes);
      const total=src.getPageCount();
      let idxs=[];
      rangeStr.split(",").forEach(part=>{
        part=part.trim();
        if(part.includes("-")){const [a,b]=part.split("-").map(Number);for(let i=a;i<=b;i++)if(i>=1&&i<=total)idxs.push(i-1)}
        else{const i=Number(part);if(i>=1&&i<=total)idxs.push(i-1)}
      });
      if(!idxs.length)return toast("সঠিক page range দিন (1-"+total+")");
      const out=await PDFDocument.create();
      const pages=await out.copyPages(src,idxs);
      pages.forEach(p=>out.addPage(p));
      const outBytes=await out.save();
      const url=URL.createObjectURL(new Blob([outBytes],{type:"application/pdf"}));
      $("#result").innerHTML=`<a class="btn" href="${url}" download="split.pdf">Download split.pdf</a>`;
    }catch{toast("Split করা যায়নি");$("#result").textContent="একটি সমস্যা হয়েছে, ফাইল ও page range ঠিক আছে কিনা দেখে আবার চেষ্টা করুন।"}
  };
},
"jpg-to-pdf":()=>{
  form(t[1],`<div class="drop"><input id="file" type="file" accept="image/*" multiple></div><p class="blog-meta">একাধিক ছবি select করুন, ক্রম অনুযায়ী page হবে।</p>${result("")}`);
  $("#file").onchange=async e=>{
    const files=[...e.target.files];
    if(!files.length)return toast("অন্তত একটি ছবি select করুন");
    $("#result").innerHTML=`<span class="loading-row"><span class="spinner"></span> PDF তৈরি হচ্ছে…</span>`;
    try{
      const {PDFDocument}=await loadPdfLib();
      const doc=await PDFDocument.create();
      for(const f of files){
        const bytes=await f.arrayBuffer();
        const isPng=f.type.includes("png");
        const img=isPng?await doc.embedPng(bytes):await doc.embedJpg(bytes);
        const page=doc.addPage([img.width,img.height]);
        page.drawImage(img,{x:0,y:0,width:img.width,height:img.height});
      }
      const outBytes=await doc.save();
      const url=URL.createObjectURL(new Blob([outBytes],{type:"application/pdf"}));
      $("#result").innerHTML=`<a class="btn" href="${url}" download="images.pdf">Download images.pdf</a>`;
    }catch{toast("PDF তৈরি করা যায়নি");$("#result").textContent="ছবিগুলো JPG/PNG format-এ আছে কিনা দেখে আবার চেষ্টা করুন।"}
  };
},
"pdf-compressor":()=>{
  form(t[1],`<div class="drop"><input id="file" type="file" accept="application/pdf"></div><div class="field" style="margin-top:12px"><label>Compression Level</label><select id="q" class="select"><option value="0.5">বেশি Compress (কম quality)</option><option value="0.7" selected>মাঝারি</option><option value="0.85">কম Compress (ভালো quality)</option></select></div>${result("")}`);
  $("#file").onchange=async e=>{
    const f=e.target.files[0];if(!f)return;
    $("#result").innerHTML=`<span class="loading-row"><span class="spinner"></span> Compress হচ্ছে, একটু সময় লাগতে পারে…</span>`;
    try{
      const pdfjsLib=await loadPdfJs();
      const {PDFDocument}=await loadPdfLib();
      const q=+$("#q").value;
      const data=new Uint8Array(await f.arrayBuffer());
      const pdf=await pdfjsLib.getDocument({data}).promise;
      const outDoc=await PDFDocument.create();
      for(let i=1;i<=pdf.numPages;i++){
        const page=await pdf.getPage(i),vp=page.getViewport({scale:1.3}),c=document.createElement("canvas");
        c.width=vp.width;c.height=vp.height;
        await page.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;
        const jpgBytes=await new Promise(r=>c.toBlob(b=>b.arrayBuffer().then(r),"image/jpeg",q));
        const img=await outDoc.embedJpg(jpgBytes);
        const p=outDoc.addPage([vp.width,vp.height]);
        p.drawImage(img,{x:0,y:0,width:vp.width,height:vp.height});
      }
      const outBytes=await outDoc.save();
      const url=URL.createObjectURL(new Blob([outBytes],{type:"application/pdf"}));
      $("#result").innerHTML=`<a class="btn" href="${url}" download="compressed.pdf">Download compressed.pdf</a><br><small>মূল: ${Math.round(f.size/1024)} KB → নতুন: ${Math.round(outBytes.length/1024)} KB</small>`;
    }catch{toast("Compress করা যায়নি");$("#result").textContent="PDF পড়া যায়নি, ফাইলটি ঠিক আছে কিনা দেখে আবার চেষ্টা করুন।"}
  };
},
"bijoy-unicode-converter":()=>{
  form(t[1],`<div class="result" style="line-height:1.7"><b>⚠️ এই টুলটি এখনো তৈরি হয়নি</b><br><br>সঠিকভাবে Bijoy → Unicode রূপান্তর করতে হলে প্রতিটি byte-এর জন্য verified mapping table ও যুক্তাক্ষর reordering rule লাগে। ভুল mapping দিলে লেখা silently ভুল/garbled হয়ে যেতে পারে — এবং সেই ভুল table নিয়ে আমরা যথেষ্ট নিশ্চিত নই। তাই ভুল ফলাফল দেওয়ার বদলে আমরা এই মুহূর্তে এটা খোলাখুলি "কাজ চলছে" হিসেবে রাখছি।</div><div class="form-grid" style="margin-top:16px"><div class="field"><label>এখনই দরকার হলে</label><p style="margin:0">Avro Converter বা OpenBangla Keyboard-এর মতো পরীক্ষিত, verified tool ব্যবহার করুন।</p></div></div>`);
}};
  (pages[id]||generic)(t[1]);
  const rel=relatedTools(id,t[3],3);
  if(rel)app.insertAdjacentHTML("beforeend",`<div class="tool-layout" style="margin-top:0">${rel}</div>`);
  const cb=toolContentBlock(id);
  if(cb)app.insertAdjacentHTML("beforeend",`<div class="tool-layout" style="margin-top:0">${cb}</div>`);
}
function textCounter(title,words){form(title,`<textarea id="txt" class="textarea"></textarea>${result("0")}`);$("#txt").oninput=e=>{let s=e.target.value;$("#result").textContent=words?`Words: ${s.trim()?s.trim().split(/\s+/).length:0} | Characters: ${s.length}`:`Characters: ${s.length}`}}

function imageTool(title,type){
  form(title,`<div class="drop"><input id="file" type="file" accept="image/*"></div><div id="opts"></div>${result("Image result")}`);
  $("#file").onchange=e=>{
    const f=e.target.files[0]; if(!f)return;
    const im=new Image();
    im.onload=()=>{
      if(type==="resize"){
        $("#opts").innerHTML=`<div class="form-grid" style="margin-top:12px"><div class="field"><label>Width</label><input id="rw" type="number" class="input" value="${im.width}"></div><div class="field"><label>Height</label><input id="rh" type="number" class="input" value="${im.height}"></div></div><button class="btn" id="resizeGo" style="margin-top:10px">Resize করুন</button>`;
        $("#resizeGo").onclick=()=>runImage(im,+$("#rw").value||im.width,+$("#rh").value||im.height,type);
      } else {
        runImage(im,im.width,im.height,type);
      }
    };
    im.src=URL.createObjectURL(f);
  };
  function runImage(im,w,h,type){
    const c=document.createElement("canvas");c.width=w;c.height=h;
    const ctx=c.getContext("2d");
    if(type==="pngjpg"||type==="webpjpg"){ctx.fillStyle="#fff";ctx.fillRect(0,0,w,h)}
    ctx.drawImage(im,0,0,w,h);
    const mime=type==="jpgpng"?"image/png":type==="towebp"?"image/webp":type==="webpjpg"?"image/jpeg":"image/jpeg";
    const ext=type==="towebp"?"webp":type==="webpjpg"?"jpg":mime.split('/')[1];
    c.toBlob(b=>{
      if(!b)return toast("এই format-এ export browser সাপোর্ট করছে না");
      const url=URL.createObjectURL(b);
      $("#result").innerHTML=`<a class="btn" href="${url}" download="banglasmarttools.${ext}">Download</a><br><small>${Math.round(b.size/1024)} KB</small>`;
    },mime,type==="compress"?.75:0.92);
  }
}

async function pdfTool(title){
  form(title,`<div class="drop"><input id="file" type="file" accept="application/pdf"></div>${result("PDF page previews will appear here")}`);
  $("#file").onchange=async e=>{
    const f=e.target.files[0]; if(!f)return;
    $("#result").innerHTML=`<span class="loading-row"><span class="spinner"></span> PDF প্রসেস হচ্ছে…</span>`;
    try{
      const pdfjsLib=await loadPdfJs();
      const data=new Uint8Array(await f.arrayBuffer());
      const pdf=await pdfjsLib.getDocument({data}).promise;
      const blobs=[];
      let html=`<b>${pdf.numPages} pages found</b> <button class="small" id="dlAll" style="margin-left:8px">Download all (ZIP)</button><div class="grid" style="margin-top:15px">`;
      for(let i=1;i<=pdf.numPages;i++){
        const page=await pdf.getPage(i),vp=page.getViewport({scale:1.4}),c=document.createElement("canvas");
        c.width=vp.width;c.height=vp.height;
        await page.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;
        const blob=await new Promise(r=>c.toBlob(r,"image/jpeg",.9));
        blobs.push(blob);
        const url=URL.createObjectURL(blob);
        html+=`<div class="card"><img style="max-width:100%" src="${url}" alt="Page ${i}"><br><a class="btn" href="${url}" download="page-${i}.jpg">Download page ${i}</a></div>`;
      }
      html+=`</div>`;
      $("#result").innerHTML=html;
      $("#dlAll").onclick=async()=>{
        $("#dlAll").textContent="তৈরি হচ্ছে…";
        try{
          const JSZip=await loadJSZip();
          const zip=new JSZip();
          blobs.forEach((b,i)=>zip.file(`page-${i+1}.jpg`,b));
          const content=await zip.generateAsync({type:"blob"});
          const url=URL.createObjectURL(content);
          const a=document.createElement("a");a.href=url;a.download="banglasmarttools-pages.zip";a.click();
          $("#dlAll").textContent="Download all (ZIP)";
        }catch{toast("ZIP তৈরি করা যায়নি");$("#dlAll").textContent="Download all (ZIP)"}
      };
    }catch{
      toast("PDF পড়া যায়নি");
      $("#result").textContent="এই PDF প্রসেস করা যায়নি। ফাইলটি ঠিক আছে কিনা দেখে আবার চেষ্টা করুন।";
    }
  };
}

function generic(title){form(title,`<p>এই tool-এর জন্য interface প্রস্তুত করা হয়েছে।</p><div class="actions"><button class="btn" onclick="toast('Coming soon')">Start</button></div>`)}

function legal(type){
  const data={
    about:["About Us","BanglaSmartTools শুরু হয়েছিল একটাই লক্ষ্য নিয়ে — বাংলাভাষী মানুষের প্রতিদিনের ছোট ছোট হিসাব-নিকাশ ও ফাইল-related কাজকে সহজ করে দেওয়া। কোনো app install ছাড়াই, বিনামূল্যে, browser থেকেই যেন সবাই calculator, PDF, image বা text tool ব্যবহার করতে পারে — সেই চিন্তা থেকেই এই platform তৈরি। আমরা privacy-কে গুরুত্ব দিই, তাই যেখানে সম্ভব সব processing আপনার নিজের browser-এই হয়, কোনো ফাইল আমাদের server-এ upload হয় না।"],
    contact:["Contact","কোনো প্রশ্ন, feedback বা tool request থাকলে নিচের form-এ লিখুন অথবা সরাসরি email/phone-এ যোগাযোগ করুন। সাধারণত ১-২ কর্মদিবসের মধ্যে reply দেওয়ার চেষ্টা করি।"],
    privacy:["Privacy Policy","আমরা প্রয়োজন ছাড়া ব্যক্তিগত তথ্য সংগ্রহ করি না। Browser-based tools-এর input সাধারণত আপনার device-এই process হয়। Third-party services যেমন currency API ব্যবহার করলে তাদের নিজস্ব terms ও privacy policy প্রযোজ্য হতে পারে। আমরা security-এর জন্য reasonable measures অনুসরণ করি, তবে internet transmission-এর সম্পূর্ণ নিরাপত্তা guarantee করা যায় না।"],
    terms:["Terms & Conditions","এই website-এর tools সাধারণ informational এবং convenience purpose-এর জন্য। ফলাফলের accuracy আপনার input-এর উপর নির্ভর করে। Financial, legal বা medical decision নেওয়ার আগে qualified professional-এর পরামর্শ নিন। Website-এর content ও tools পরিবর্তন, update বা বন্ধ করার অধিকার সংরক্ষিত।"],
    disclaimer:["Disclaimer","BanglaSmartTools কোনো financial, legal, medical বা professional advice প্রদান করে না। Online calculation-কে final authority হিসেবে ব্যবহার করবেন না। External links/services-এর availability বা accuracy-এর জন্য আমরা দায়ী নই।"]
  };
  const d=data[type]||data.about;
  setMeta(`${d[0]} — BanglaSmartTools`,String(d[1]).replace(/<[^>]*>/g,"").slice(0,155));
  clearSchema();
  let extra="";
  if(type==="contact"){
    extra=`<form class="contact-form" action="https://formsubmit.co/ashikmondol10@gmail.com" method="POST"><input type="text" name="_honey" class="hp-field" tabindex="-1" autocomplete="off"><input type="hidden" name="_subject" value="BanglaSmartTools contact form"><div class="field"><label>নাম</label><input class="input" type="text" name="name" required></div><div class="field"><label>Email</label><input class="input" type="email" name="email" required></div><div class="field"><label>Message</label><textarea class="textarea" name="message" required></textarea></div><button class="btn" type="submit">পাঠিয়ে দিন</button></form><div class="badge-row"><span class="badge">📧 ashikmondol10@gmail.com</span><span class="badge">📱 +880 1629272027</span></div>`;
  }
  app.innerHTML=`<section class="legal container"><h1>${d[0]}</h1><p>${d[1]}</p>${extra}<h2>সাধারণ তথ্য</h2><p>এই policy/page প্রয়োজন অনুযায়ী update হতে পারে। গুরুত্বপূর্ণ পরিবর্তন হলে website-এ নতুন version প্রকাশ করা হবে।</p></section>`;
}

function notFound(){
  setMeta("Page not found — BanglaSmartTools","দুঃখিত, পেজটি পাওয়া যায়নি।");
  clearSchema();
  app.innerHTML=`<section class="legal container"><h1>Page not found</h1><p>দুঃখিত, পেজটি পাওয়া যায়নি।</p><a class="btn" href="#/">হোমে ফিরুন</a></section>`;
}

function route(){
  let raw=location.hash.slice(2)||"";
  let [r,qs]=raw.split("?");
  const params=new URLSearchParams(qs||"");
  window.scrollTo(0,0);
  window.__crumb="";
  if(r==="")return home();
  if(r.startsWith("blog/"))return article(r.slice(5));
  if(["about","contact","privacy","terms","disclaimer"].includes(r))return legal(r);
  if(r==="tools")return toolsPage(params.get("cat"));
  if(r.startsWith("search"))return home();
  if(r==="blog")return blog();
  return toolPage(r);
}

$("#menuBtn").onclick=()=>$("#nav").classList.toggle("open");
$("#themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=state.theme;localStorage.bst_theme=state.theme};
$("#langBtn").onclick=()=>{state.lang=state.lang==="bn"?"en":"bn";localStorage.bst_lang=state.lang;$("#langBtn").textContent=state.lang==="bn"?"EN":"BN";toast(state.lang==="bn"?"বাংলা ভাষা সক্রিয়":"English mode active")};
$("#mobileSearchBtn").onclick=()=>{
  if(location.hash!=="#/"&&location.hash!=="")location.hash="#/";
  setTimeout(()=>{const s=$("#search");if(s){s.scrollIntoView({behavior:"smooth",block:"center"});s.focus()}},120);
};
$("#popularLink").onclick=e=>{
  if(location.hash==="#/"||location.hash===""){
    e.preventDefault();
    document.getElementById("popular")?.scrollIntoView({behavior:"smooth"});
  } else {
    sessionStorage.setItem("bst_scroll_popular","1");
  }
};
window.addEventListener("hashchange",route);
window.toast=toast;
window.toggleFavorite=toggleFavorite;
route();
if(sessionStorage.getItem("bst_scroll_popular")){
  sessionStorage.removeItem("bst_scroll_popular");
  setTimeout(()=>document.getElementById("popular")?.scrollIntoView({behavior:"smooth"}),150);
}
