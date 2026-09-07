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
"color-converter":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="4.2" fill="currentColor" stroke="none" opacity="0.8"/><circle cx="15.5" cy="8" r="4.2"/><circle cx="11.7" cy="15" r="4.2" fill="none"/></svg>`
};
const genericIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>`;
const shareIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.3"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="19" r="2.3"/><line x1="8" y1="10.8" x2="16" y2="6.2"/><line x1="8" y1="13.2" x2="16" y2="17.8"/></svg>`;

/* ---------- App state ---------- */
const $=s=>document.querySelector(s), app=$("#app"), toastEl=$("#toast");
const state={lang:localStorage.bst_lang||"bn",theme:localStorage.bst_theme||"light",recent:JSON.parse(localStorage.bst_recent||"[]")};
document.documentElement.dataset.theme=state.theme; $("#year").textContent=new Date().getFullYear();

const SITE="https://banglasmarttools.com/";

const tools=[
["age-calculator","বয়স ক্যালকুলেটর","জন্মতারিখ থেকে বয়স বের করুন","ক্যালকুলেটর"],
["percentage-calculator","Percentage Calculator","শতকরা হিসাব সহজে করুন","ক্যালকুলেটর"],
["bmi-calculator","BMI Calculator","উচ্চতা ও ওজন থেকে BMI হিসাব করুন","ক্যালকুলেটর"],
["discount-calculator","Discount Calculator","ছাড়ের পর দাম ও সাশ্রয় হিসাব করুন","ক্যালকুলেটর"],
["profit-loss-calculator","Profit & Loss","লাভ বা ক্ষতির পরিমাণ ও শতাংশ বের করুন","ফাইন্যান্স"],
["salary-calculator","Salary Calculator","মাসিক বেতন থেকে বার্ষিক মোট হিসাব","ফাইন্যান্স"],
["vat-calculator","VAT Calculator","VAT যোগ বা বাদ দিয়ে মূল্য হিসাব করুন","ফাইন্যান্স"],
["emi-calculator","EMI Calculator","ঋণের মাসিক কিস্তি হিসাব করুন","ফাইন্যান্স"],
["date-calculator","Date Calculator","দুই তারিখের ব্যবধান বের করুন","ক্যালকুলেটর"],
["currency-converter","Currency Converter","লাইভ exchange rate দিয়ে currency convert করুন","ফাইন্যান্স"],
["word-counter","Word Counter","শব্দ ও character গণনা করুন","টেক্সট"],
["character-counter","Character Counter","অক্ষর গণনা করুন","টেক্সট"],
["case-converter","Case Converter","UPPER, lower ও Title Case করুন","টেক্সট"],
["image-compressor","Image Compressor","ছবির file size কমান","ইমেজ"],
["image-resizer","Image Resizer","ছবির width ও height পরিবর্তন করুন","ইমেজ"],
["jpg-to-png","JPG to PNG","JPG ছবিকে PNG করুন","ইমেজ"],
["png-to-jpg","PNG to JPG","PNG ছবিকে JPG করুন","ইমেজ"],
["pdf-to-jpg","PDF to JPG","PDF-এর page JPG হিসেবে export করুন","PDF"],
["json-formatter","JSON Formatter","JSON format ও validate করুন","ডেভেলপার"],
["password-generator","Password Generator","নিরাপদ random password তৈরি করুন","ইউটিলিটি"],
["qr-generator","QR Code Generator","Text বা URL থেকে QR code তৈরি করুন","ইউটিলিটি"],
["unit-converter","Unit Converter","দৈর্ঘ্য, ওজন ও তাপমাত্রা একক পরিবর্তন করুন","কনভার্টার"],
["number-to-words","সংখ্যা থেকে কথায়","সংখ্যাকে বাংলায় কথায় রূপান্তর করুন — চেক/ইনভয়েস লেখার জন্য","কনভার্টার"],
["bangla-number-converter","বাংলা-ইংরেজি সংখ্যা","০-৯ থেকে ০-৯ বাংলা-ইংরেজি সংখ্যা রূপান্তর করুন","কনভার্টার"],
["data-size-converter","Data Size Converter","Bit, Byte, KB, MB, GB, TB পরিবর্তন করুন","কনভার্টার"],
["base-converter","Number Base Converter","Binary, Octal, Decimal, Hex রূপান্তর করুন","ডেভেলপার"],
["color-converter","Color Converter","HEX ও RGB color code রূপান্তর করুন","ডেভেলপার"]];

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
function clearSchema(){const el=document.getElementById("page-schema");if(el)el.remove()}

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
function card(t){return `<div class="card tool-card"><div class="tool-icon">${toolIcons[t[0]]||genericIcon}</div><h3>${esc(t[1])}</h3><p>${esc(t[2])}</p><a class="btn" href="#/${t[0]}">ব্যবহার করুন →</a></div>`}
function relatedTools(currentId,category,n){
  const list=tools.filter(t=>t[0]!==currentId && t[3]===category).slice(0,n);
  if(!list.length)return "";
  return `<div class="related"><h3>${state.lang==="bn"?"সম্পর্কিত Tools":"Related tools"}</h3><div class="related-list">${list.map(t=>`<a href="#/${t[0]}"><span class="tool-icon">${toolIcons[t[0]]||genericIcon}</span><span><b>${esc(t[1])}</b><br><small style="color:var(--muted)">${esc(t[2])}</small></span></a>`).join("")}</div></div>`;
}

/* ---------- Pages ---------- */
function home(){
  setMeta("BanglaSmartTools — বাংলায় ফ্রি Online Tools","বাংলায় সহজ, দ্রুত ও ফ্রি Online Tools — calculator, text, image, PDF, JSON, QR ও currency tools এক জায়গায়।");
  clearSchema();
  app.innerHTML=`<section class="hero"><div class="container"><h1>বাংলায় সহজ, দ্রুত ও ফ্রি<br>Online Tools</h1><p>Calculator, PDF, Image, Text, Finance ও Developer tools—সব এক জায়গায়।</p><div class="search"><input id="search" class="input" placeholder="যে tool খুঁজছেন লিখুন…"><button class="btn" id="searchBtn">Search</button></div><div class="chips">${[...new Set(tools.map(x=>x[3]))].map(c=>`<a class="chip" href="#/tools?cat=${encodeURIComponent(c)}">${c}</a>`).join("")}</div></div></section><section class="section"><div class="container"><h2>জনপ্রিয় Tools</h2><div class="grid">${tools.slice(0,9).map(card).join("")}</div></div></section><section class="section"><div class="container"><h2>কেন BanglaSmartTools?</h2><div class="grid"><div class="card"><h3>⚡ দ্রুত</h3><p>বেশিরভাগ tool browser-এই কাজ করে।</p></div><div class="card"><h3>🔒 Privacy-friendly</h3><p>যেখানে সম্ভব local browser processing ব্যবহার করা হয়েছে।</p></div><div class="card"><h3>📱 Mobile friendly</h3><p>মোবাইল ও desktop উভয়ের জন্য responsive design।</p></div></div></div></section>`;
  $("#searchBtn").onclick=()=>searchTools($("#search").value);
  $("#search").oninput=e=>searchTools(e.target.value);
  $("#search").addEventListener("keydown",e=>{if(e.key==="Enter")searchTools(e.target.value)});
}
function searchTools(q){const a=tools.filter(t=>(t[1]+t[2]+t[3]).toLowerCase().includes(q.toLowerCase()));const box=document.querySelector("#searchResults");if(box)box.innerHTML=a.map(card).join("")||"<p>কোনো tool পাওয়া যায়নি।</p>";else if(q){app.insertAdjacentHTML("beforeend",`<section class="section container" id="searchResults">${a.map(card).join("")||"<p>কোনো tool পাওয়া যায়নি।</p>"}</section>`)}}
function toolsPage(cat){
  const list=cat?tools.filter(t=>t[3]===cat):tools;
  const heading=cat?`${cat} Tools`:"সব Tools";
  setMeta(`${heading} — BanglaSmartTools`,cat?`BanglaSmartTools-এর সব ${cat} ক্যাটেগরির ফ্রি অনলাইন tool।`:"BanglaSmartTools-এর সব ফ্রি অনলাইন tool এক জায়গায় — calculator, image, PDF, text ও developer tools।");
  clearSchema();
  const cats=[...new Set(tools.map(x=>x[3]))];
  const chips=`<a class="chip${!cat?" active":""}" href="#/tools">সব</a>`+cats.map(c=>`<a class="chip${c===cat?" active":""}" href="#/tools?cat=${encodeURIComponent(c)}">${c}</a>`).join("");
  app.innerHTML=`<section class="section container"><h1>${heading}</h1><p>আপনার প্রয়োজনীয় free online tool বেছে নিন।</p><div class="chips" style="margin:14px 0 26px">${chips}</div><div class="grid">${list.map(card).join("")||"<p>এই category-তে কোনো tool পাওয়া যায়নি।</p>"}</div></section>`;
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
  const sections=b[3].map(([h,p])=>`<h2>${esc(h)}</h2><p>${p}</p>`).join("");
  const cta=b[4]?`<div class="result"><b>${state.lang==="bn"?"এখনই চেষ্টা করুন:":"Try it now:"}</b> <a class="btn" style="margin-top:10px;display:inline-block" href="#/${b[4]}">${esc((tools.find(t=>t[0]===b[4])||[,b[4]])[1])} ব্যবহার করুন →</a></div>`:"";
  app.innerHTML=`<article class="article container"><div class="blog-meta">BanglaSmartTools Blog</div><h1>${esc(b[1])}</h1><p>${esc(b[2])}</p>${shareRow(b[1])}<hr>${sections}${cta}</article>`;
  bindShare(b[1]);
}
function form(title,body){app.innerHTML=`<section class="tool-layout"><div class="card"><h1>${title}</h1>${body}</div></section>`}
function result(html){return `<div id="result" class="result">${html}</div>`}

function toolPage(id){
  saveRecent(id);
  const t=tools.find(x=>x[0]===id);
  if(!t)return notFound();
  setMeta(`${t[1]} — BanglaSmartTools`,`${t[2]} — সম্পূর্ণ ফ্রি, দ্রুত ও ব্রাউজার-ভিত্তিক BanglaSmartTools tool।`);
  setSchema({"@context":"https://schema.org","@type":"SoftwareApplication","name":t[1],"applicationCategory":"UtilitiesApplication","operatingSystem":"Any, Web Browser","description":t[2],"offers":{"@type":"Offer","price":"0","priceCurrency":"BDT"}});
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
}};
  (pages[id]||generic)(t[1]);
  const rel=relatedTools(id,t[3],3);
  if(rel)app.insertAdjacentHTML("beforeend",`<div class="tool-layout" style="margin-top:0">${rel}</div>`);
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
    if(type==="pngjpg"){ctx.fillStyle="#fff";ctx.fillRect(0,0,w,h)}
    ctx.drawImage(im,0,0,w,h);
    const mime=type==="jpgpng"?"image/png":"image/jpeg";
    c.toBlob(b=>{
      const url=URL.createObjectURL(b);
      $("#result").innerHTML=`<a class="btn" href="${url}" download="banglasmarttools.${mime.split('/')[1]}">Download</a><br><small>${Math.round(b.size/1024)} KB</small>`;
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
window.addEventListener("hashchange",route);
window.toast=toast;
route();
