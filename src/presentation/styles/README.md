# 🎨 AxeCode Design System

نظام تصميم موحد متبعاً النمط **Clean Brutalist** من `index.css` الرئيسي.

---

## 📁 هيكل المجلد

```
src/presentation/styles/
│
├── 📄 design-system.css           # ⭐ النظام الكامل - المتغيرات والـ Classes
├── 📄 theme.css                   # 🔗 المرجع السريع (يستورد design-system)
│
├── 📖 DESIGN_SYSTEM_GUIDE.md      # 📚 الدليل الشامل
├── 📖 MIGRATION_GUIDE.md          # 🔄 دليل التحويل من Green Theme
├── 📖 README.md                   # 📌 هذا الملف
│
├── 📁 components/                 # أنماط المكونات المشتركة
│   ├── header-new.module.css
│   ├── ProgressBar.module.css
│   └── ...
│
├── 📁 pages/                      # أنماط الصفحات
│   ├── home-new.module.css
│   ├── login.module.css
│   └── ...
│
└── 📁 examples/                   # أمثلة الاستخدام
    └── design-system-usage-example.module.css
```

---

## 🚀 البدء السريع

### 1. استيراد في ملف CSS Module

```css
@import '../theme.css';

.myComponent {
  composes: card from '../theme.css';
}
```

### 2. استخدام المتغيرات

```css
.myElement {
  background-color: var(--main-bg-color);
  color: var(--text-primary);
  box-shadow: var(--shadow-solid);
}
```

### 3. استخدام Utility Classes

```css
.myButton {
  composes: btn btn-black from '../theme.css';
}

.myContainer {
  composes: container from '../theme.css';
}

.myCard {
  composes: card hover-lift from '../theme.css';
}
```

---

## 🎨 النمط التصميمي

### الخصائص الأساسية

- **اللون الرئيسي**: بيج دافئ (`#f0eee6`)
- **النصوص**: أسود تقريباً (`#141413`)
- **الظل البارز**: `3px 3px 0px black` (Brutalist)
- **الزوايا**: صغيرة (3px - 8px)
- **البساطة**: Clean & Minimal
- **الاستجابة**: Mobile-First

### الفلسفة التصميمية

✅ **بسيط ونظيف** - لا زخارف زائدة
✅ **واضح ومباشر** - الظلال البارزة للتأكيد
✅ **متناسق** - نفس القيم في كل مكان
✅ **متجاوب** - يعمل على جميع الأحجام

---

## 📚 الدلائل المتاحة

### 1. دليل نظام التصميم
📖 **[DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md)**

الدليل الشامل يحتوي على:
- نظام الألوان الكامل
- جميع الأزرار والأنواع
- الكروت والحاويات
- الطباعة والتأثيرات
- أمثلة كاملة للاستخدام
- القواعد الذهبية

### 2. دليل التحويل
📖 **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)**

دليل تحويل من Green Theme إلى Clean Brutalist:
- مقارنة النظامين
- أمثلة قبل/بعد
- خطوات التحويل
- Checklist للتأكد

### 3. ملف الأمثلة
📄 **[examples/design-system-usage-example.module.css](./examples/design-system-usage-example.module.css)**

11 مثال عملي للاستخدام

---

## 🎯 Classes الأكثر شيوعاً

### الأزرار
```css
.btn              /* الزر الأساسي */
.btn-black        /* خلفية سوداء */
.btn-white        /* خلفية بيضاء */
.btn-outline      /* حدود فقط */
.btn-small        /* حجم صغير */
.btn-large        /* حجم كبير */
```

### الكروت
```css
.card             /* كرت أساسي */
.card-bordered    /* كرت Brutalist */
.card-grid        /* شبكة كروت */
```

### الحاويات
```css
.container        /* max-width: 1200px */
.container-flex   /* مع flex و gap */
.section          /* قسم بـ padding */
.section-hero     /* قسم Hero */
```

### المسافات
```css
.gap-xs, .gap-sm, .gap-md, .gap-lg
.p-xs, .p-sm, .p-md, .p-lg, .p-xl
.m-xs, .m-sm, .m-md, .m-lg, .m-xl
```

### التأثيرات
```css
.shadow-solid     /* ظل Brutalist */
.shadow-soft-sm   /* ظل ناعم صغير */
.hover-lift       /* رفع عند hover */
.hover-scale      /* تكبير عند hover */
```

---

## 💡 أمثلة سريعة

### مثال 1: زر بسيط
```jsx
<button className={styles.myButton}>انقر هنا</button>
```
```css
.myButton {
  composes: btn btn-black from '../theme.css';
}
```

### مثال 2: كرت
```jsx
<div className={styles.productCard}>
  <h3>المنتج</h3>
  <p>الوصف</p>
</div>
```
```css
.productCard {
  composes: card hover-lift from '../theme.css';
}
```

### مثال 3: شبكة كروت
```jsx
<div className={styles.productsGrid}>
  {products.map(p => <Card key={p.id} />)}
</div>
```
```css
.productsGrid {
  composes: card-grid from '../theme.css';
}
```

---

## 🎨 المتغيرات الأساسية

### الألوان
```css
var(--main-bg-color)    /* #f0eee6 - الخلفية */
var(--text-primary)     /* #141413 - النص الأساسي */
var(--text-secondary)   /* #5c5b5b - النص الثانوي */
var(--surface-card)     /* #e3dacc - خلفية الكروت */
```

### الظلال
```css
var(--shadow-solid)     /* 3px 3px 0px black */
var(--shadow-soft-sm)   /* 0 2px 8px rgba(0,0,0,0.08) */
var(--shadow-soft-md)   /* 0 4px 12px rgba(0,0,0,0.12) */
var(--shadow-soft-lg)   /* 0 8px 24px rgba(0,0,0,0.15) */
```

### الحدود
```css
var(--border-light)     /* #f0f0f0 */
var(--border-medium)    /* #ddd */
var(--border-dark)      /* #141413 */
```

---

## ⚡ نصائح سريعة

### ✅ افعل

```css
/* استخدم المتغيرات */
background-color: var(--main-bg-color);

/* استخدم composes */
composes: btn btn-black from '../theme.css';

/* اتبع نظام المسافات */
gap: 30px;
padding: 2rem;

/* استخدم الظلال المحددة */
box-shadow: var(--shadow-solid);
```

### ❌ لا تفعل

```css
/* لا تستخدم ألوان عشوائية */
background-color: #ff5733; /* ❌ */

/* لا تستخدم ظلال مخصصة */
box-shadow: 5px 10px 20px rgba(0,0,0,0.5); /* ❌ */

/* لا تكسر نظام المسافات */
padding: 17px; /* ❌ */
gap: 23px; /* ❌ */

/* لا تستخدم زوايا كبيرة */
border-radius: 25px; /* ❌ */
```

---

## 📱 الاستجابة (Responsive)

النظام يتبع **Mobile-First** approach:

### نقاط التوقف
- **< 480px** - موبايل صغير
- **480px - 767px** - موبايل كبير
- **768px - 991px** - تابلت
- **992px - 1023px** - ديسكتوب صغير
- **1024px+** - ديسكتوب
- **1280px+** - ديسكتوب كبير

### مثال
```css
.responsive {
  composes: card-grid from '../theme.css';
}

@media (max-width: 768px) {
  .responsive {
    grid-template-columns: 1fr;
  }
}
```

---

## 🔄 الترقية من النظام القديم

إذا كنت تستخدم النظام القديم (Green Theme):

1. **اقرأ** [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
2. **ابدأ** بالمكونات الصغيرة (الأزرار)
3. **استخدم** composes للـ utility classes
4. **اختبر** على جميع الشاشات

---

## 📞 الدعم

### الملفات المرجعية

- **التحليل الكامل**: `.gemini/.../design_system_analysis.md`
- **النظام الكامل**: `design-system.css`
- **المرجع السريع**: `theme.css`
- **الدليل الشامل**: `DESIGN_SYSTEM_GUIDE.md`
- **دليل التحويل**: `MIGRATION_GUIDE.md`

---

## 🎯 الخلاصة

هذا النظام يوفر:

✅ **تناسق كامل** - نفس الشكل في كل مكان
✅ **سرعة في التطوير** - classes جاهزة
✅ **صيانة سهلة** - تحديث مركزي
✅ **استجابة تلقائية** - responsive by default
✅ **نمط واضح** - Brutalist/Clean aesthetic

---

**🚀 ابدأ الآن بقراءة [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md) للتعمق أكثر!**
