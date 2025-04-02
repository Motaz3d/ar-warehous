// == العناصر من الصفحة ==
const barcodeInput = document.getElementById("barcodeInput");
const inButton = document.getElementById("inButton");
const outButton = document.getElementById("outButton");
const logList = document.getElementById("logList");
const inCount = document.getElementById("inCount");
const outCount = document.getElementById("outCount");

// قاعدة بيانات مصغرة لأسماء المنتجات حسب الباركود (يمكن تحديثها لاحقًا)
const productNames = {
  "123": "حليب طويل الأجل",
  "456": "علبة تونة",
  "789": "كيس رز 5 كغ",
  "111": "زيت نباتي 1 لتر",
  "222": "معكرونة إيطالية"
};

// تحميل السجل من التخزين المحلي
let logEntries = JSON.parse(localStorage.getItem("log")) || [];

// عند تحميل الصفحة: عرض السجل والإحصائيات
logEntries.forEach(entry => renderEntry(entry));
updateStats();

// عند الضغط على زر الإدخال أو الإخراج
inButton.addEventListener("click", () => handleScan("in"));
outButton.addEventListener("click", () => handleScan("out"));

// معالجة الإدخال والإخراج
function handleScan(type) {
  const barcode = barcodeInput.value.trim();
  if (!barcode) {
    alert("يرجى إدخال باركود صالح");
    return;
  }

  const name = productNames[barcode] || "منتج غير معروف";

  const entry = {
    id: Date.now(),
    barcode,
    name,
    type, // in / out
    time: new Date().toLocaleString()
  };

  logEntries.push(entry);
  localStorage.setItem("log", JSON.stringify(logEntries));
  renderEntry(entry);
  updateStats();
  barcodeInput.value = "";
}

// عرض سجل واحد
function renderEntry(entry) {
  const li = document.createElement("li");
  li.textContent = `${entry.type === "in" ? "⬅️ إدخال" : "➡️ إخراج"} - ${entry.name} (${entry.barcode}) - ${entry.time}`;
  logList.prepend(li);
}

// تحديث الإحصائيات
function updateStats() {
  const ins = logEntries.filter(e => e.type === "in").length;
  const outs = logEntries.filter(e => e.type === "out").length;
  inCount.textContent = ins;
  outCount.textContent = outs;
}

// 📷 تشغيل الماسح بالكاميرا
function onScanSuccess(decodedText) {
  barcodeInput.value = decodedText;
  handleScan("in"); // يمكنك التغيير إلى "out" إذا كنت ترغب بذلك افتراضيًا
}

if (window.Html5Qrcode) {
  const html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScanSuccess
  ).catch(err => console.error("فشل تشغيل الكاميرا:", err));
}