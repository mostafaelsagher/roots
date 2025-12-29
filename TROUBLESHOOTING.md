# 🔧 دليل حل المشاكل - منصة جوزور

<div dir="rtl" align="right">

## 🚨 المشاكل الشائعة وحلولها

### 1. صفحة بيضاء فارغة ❌

#### الأسباب المحتملة:
- المسار الافتراضي يحتاج مصادقة
- ملفات الترجمة لا تُحمّل
- خطأ في JavaScript

#### الحل:
```bash
# أوقف السيرفر (Ctrl+C)
# ثم شغّله من جديد
npm start
```

**تم الإصلاح**: المسار الافتراضي الآن `/auth/login` بدلاً من `/dashboard`

---

### 2. خطأ في تحميل ملف ar.json ❌

#### الخطأ في Console:
```
Failed to load /assets/i18n/ar.json
```

#### الحل:
✅ تم إضافة src/assets إلى angular.json
✅ أعد تشغيل السيرفر

---

### 3. المنفذ 4200 مستخدم ❌

#### الخطأ:
```
Port 4200 is already in use
```

#### الحل:
```bash
# استخدم منفذ آخر
ng serve --port 4300
```

أو أوقف العملية الأخرى:
```bash
# macOS/Linux
lsof -ti:4200 | xargs kill -9

# Windows
netstat -ano | findstr :4200
taskkill /PID [PID_NUMBER] /F
```

---

### 4. مشاكل في التثبيت ❌

#### الأعراض:
- أخطاء عند npm install
- مكتبات ناقصة

#### الحل:
```bash
# احذف كل شيء وأعد التثبيت
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

### 5. خطأ في الذاكرة ❌

#### الخطأ:
```
JavaScript heap out of memory
```

#### الحل:
```bash
# زد الذاكرة المتاحة
export NODE_OPTIONS="--max-old-space-size=8192"
npm start
```

---

### 6. الخط العربي لا يظهر ❌

#### الأسباب:
- Google Fonts محجوب
- مشكلة في الاتصال

#### الحل:
تحقق من أن styles.scss يحتوي على:
```scss
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');
```

---

### 7. RTL لا يعمل ❌

#### الأعراض:
- النص من اليسار لليمين
- القوائم في الجهة الخاطئة

#### التحقق:
افتح DevTools وتحقق من:
```html
<html lang="ar" dir="rtl">
```

#### الحل:
تأكد من أن I18nService يعمل في app.ts:
```typescript
ngOnInit() {
  this.i18nService.loadTranslations('ar');
}
```

---

### 8. المكونات لا تظهر ❌

#### الأعراض:
- صفحة فارغة بعد تسجيل الدخول
- أخطاء في Console

#### الحل:
تحقق من Console للأخطاء:
```
F12 → Console
```

ابحث عن:
- Import errors
- Module not found
- Component errors

---

### 9. البيانات الوهمية لا تظهر ❌

#### الأسباب:
- الخدمات لا تُحمّل البيانات
- Observables لا تُنفّذ

#### التحقق:
افتح Console وابحث عن:
```javascript
console.log('Loading data...')
```

---

### 10. التنسيقات لا تطبّق ❌

#### الأعراض:
- ألوان خاطئة
- تخطيط غير صحيح

#### الحل:
```bash
# أعد بناء المشروع
npm run build
npm start
```

---

## 🔍 أدوات التشخيص

### Chrome DevTools

#### Console (F12)
- شاهد الأخطاء JavaScript
- تحقق من Network requests
- راقب API calls

#### Elements
- تحقق من HTML structure
- شاهد CSS المطبّق
- تحقق من dir="rtl"

#### Network
- تحقق من تحميل الملفات
- شاهد ar.json يُحمّل
- تحقق من 404 errors

#### Application
- تحقق من LocalStorage
- شاهد jozour_user
- شاهد jozour_token

---

## 📋 Checklist للتشخيص

عند مواجهة مشكلة، تحقق من:

- [ ] السيرفر يعمل بدون أخطاء
- [ ] المنفذ 4200 متاح
- [ ] Console خالي من الأخطاء
- [ ] Network يُحمّل ar.json
- [ ] HTML يحتوي على dir="rtl"
- [ ] الخط العربي يظهر
- [ ] node_modules موجود
- [ ] package.json صحيح

---

## 🆘 الحصول على المساعدة

### 1. تحقق من الوثائق
- README.md - نظرة عامة
- GUIDE.md - دليل المطور
- QUICKSTART.md - البدء السريع

### 2. تحقق من Console
افتح DevTools (F12) وابحث عن:
- أخطاء حمراء
- تحذيرات صفراء
- رسائل الشبكة

### 3. تحقق من Terminal
حيث يعمل npm start، ابحث عن:
- Compilation errors
- Warning messages
- Port conflicts

### 4. أعد التثبيت
كحل أخير:
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## ✅ التحقق من التشغيل الصحيح

يجب أن ترى:

### في المتصفح:
✅ صفحة تسجيل دخول عربية
✅ تصميم أخضر احترافي
✅ خط Cairo واضح
✅ RTL layout صحيح

### في Console:
✅ لا توجد أخطاء حمراء
✅ ar.json يُحمّل بنجاح (200)
✅ رسائل Angular العادية

### في Terminal:
✅ Compiled successfully
✅ Angular Live Development Server
✅ Listening on localhost:4200

---

## 💡 نصائح للتطوير

1. **استخدم Hot Reload**
   - التغييرات تُطبّق تلقائياً
   - لا حاجة لإعادة التشغيل

2. **افتح DevTools دائماً**
   - راقب Console
   - تحقق من Network
   - استخدم Responsive mode

3. **اختبر على متصفحات مختلفة**
   - Chrome (مفضّل)
   - Firefox
   - Safari
   - Edge

4. **اختبر RTL**
   - تحقق من كل صفحة
   - جرّب التفاعلات
   - شاهد الرسوم المتحركة

---

## 🎯 الخلاصة

معظم المشاكل تُحل بـ:

1. **إعادة تشغيل السيرفر**
   ```bash
   Ctrl+C
   npm start
   ```

2. **إعادة التثبيت**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **تحديث الصفحة**
   ```
   Ctrl+R أو F5
   ```

---

**إذا استمرت المشكلة، راجع Console و Terminal للأخطاء التفصيلية**

**جوزور © 2025 - دليل حل المشاكل**

</div>

