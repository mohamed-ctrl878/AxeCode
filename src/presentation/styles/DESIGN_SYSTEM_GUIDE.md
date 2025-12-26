# 🎨 دليل نظام التصميم - AxeCode Design System

## نظرة عامة

تم إنشاء نظام تصميم موحد يتبع الأسلوب **Brutalist/Clean** المستخدم في `index.css` الرئيسي. هذا النظام يضمن التناسق عبر جميع صفحات ومكونات التطبيق.

---

## 📁 ملفات النظام

```
src/presentation/styles/
├── design-system.css          # نظام التصميم الكامل
├── theme.css                  # المرجع السريع + يستورد design-system
└── examples/
    └── design-system-usage-example.module.css  # أمثلة الاستخدام
```

---

## 🚀 البدء السريع

### 1. استيراد النظام في ملف CSS Module

```css
@import '../theme.css';

.myComponent {
  composes: card from '../theme.css';
  /* مكونك الآن له جميع خصائص الكرت */
}
```

### 2. استخدام المتغيرات

```css
.myCustomElement {
  background-color: var(--main-bg-color);
  color: var(--text-primary);
  box-shadow: var(--shadow-solid);
}
```

### 3. استخدام الـ Utility Classes

```css
.myButton {
  composes: btn btn-black from '../theme.css';
}

.myContainer {
  composes: container from '../theme.css';
}
```

---

## 🎨 نظام الألوان

### الألوان الأساسية

| المتغير | القيمة | الاستخدام |
|---------|--------|-----------|
| `--main-bg-color` | `#f0eee6` | الخلفية الرئيسية (بيج) |
| `--text-primary` | `#141413` | النصوص الأساسية (أسود) |
| `--text-secondary` | `#5c5b5b` | النصوص الثانوية (رمادي) |
| `--text-muted` | `#aaa` | النصوص الخفيفة |
| `--surface-card` | `#e3dacc` | خلفية الكروت (بيج فاتح) |
| `--surface-white` | `rgba(255,255,255,0.87)` | الأبيض شبه الشفاف |
| `--surface-footer` | `#293952` | خلفية الفوتر (أزرق داكن) |

### الحدود

| المتغير | القيمة |
|---------|--------|
| `--border-light` | `#f0f0f0` |
| `--border-medium` | `#ddd` |
| `--border-dark` | `#141413` |

### الظلال

| المتغير | القيمة | النمط |
|---------|--------|-------|
| `--shadow-solid` | `3px 3px 0px black` | Brutalist |
| `--shadow-soft-sm` | `0 2px 8px rgba(0,0,0,0.08)` | ناعم صغير |
| `--shadow-soft-md` | `0 4px 12px rgba(0,0,0,0.12)` | ناعم متوسط |
| `--shadow-soft-lg` | `0 8px 24px rgba(0,0,0,0.15)` | ناعم كبير |

---

## 🔘 الأزرار

### الأنواع المتاحة

```css
/* الزر الأساسي */
.btn {
  /* box-shadow: var(--shadow-solid) */
  /* border-radius: 3px */
  /* padding: 0.6rem 1.2rem */
}

/* الأنواع */
.btn-black      /* خلفية سوداء، نص أبيض */
.btn-white      /* خلفية بيضاء، نص أسود */
.btn-outline    /* شفاف مع حدود */

/* الأحجام */
.btn-small      /* padding: 0.5rem 0.9rem */
.btn-large      /* padding: 1.2rem 2.5rem */
```

### مثال استخدام

```jsx
// React Component
<button className={styles.submitButton}>
  إرسال
</button>
```

```css
/* CSS Module */
@import '../theme.css';

.submitButton {
  composes: btn btn-black from '../theme.css';
}

.submitButton:hover {
  /* Automatically lifts up on hover */
}
```

---

## 🎴 الكروت

### الأنواع المتاحة

```css
.card             /* كرت أساسي مع ظل ناعم */
.card-flat        /* كرت مسطح مع حدود */
.card-bordered    /* كرت مع ظل Brutalist */
.card-horizontal  /* كرت أفقي */
.card-grid        /* شبكة للكروت */
```

### مثال كرت بسيط

```jsx
<div className={styles.productCard}>
  <h3>عنوان المنتج</h3>
  <p>وصف المنتج هنا</p>
  <button className={styles.cardButton}>المزيد</button>
</div>
```

```css
@import '../theme.css';

.productCard {
  composes: card from '../theme.css';
  /* يحصل تلقائياً على:
     - background-color: var(--surface-card)
     - border-radius: 8px
     - padding: 2rem
     - box-shadow: var(--shadow-soft-sm)
     - hover effect (lift up)
  */
}

.cardButton {
  composes: btn btn-black btn-small from '../theme.css';
}
```

### مثال شبكة كروت

```jsx
<div className={styles.productsContainer}>
  <div className={styles.productCard}>Card 1</div>
  <div className={styles.productCard}>Card 2</div>
  <div className={styles.productCard}>Card 3</div>
</div>
```

```css
.productsContainer {
  composes: card-grid from '../theme.css';
  /* Grid responsive تلقائي:
     grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
  */
}

.productCard {
  composes: card from '../theme.css';
}
```

---

## 📐 الحاويات (Containers)

### الأنواع

```css
.container          /* max-width: 1200px */
.container-flex     /* flex مع gap: 30px */
.container-narrow   /* max-width: 800px */
.container-wide     /* max-width: 1400px */
.section            /* padding: 4rem 1rem */
.section-hero       /* full height hero section */
```

### مثال صفحة

```jsx
<div className={styles.page}>
  <section className={styles.heroSection}>
    <div className={styles.heroContent}>
      <h1>عنوان رئيسي</h1>
      <p>نص فرعي</p>
    </div>
  </section>
  
  <section className={styles.contentSection}>
    <div className={styles.container}>
      {/* محتوى الصفحة */}
    </div>
  </section>
</div>
```

```css
@import '../theme.css';

.page {
  background-color: var(--main-bg-color);
  min-height: 100vh;
}

.heroSection {
  composes: section-hero from '../theme.css';
}

.heroContent {
  composes: container-narrow from '../theme.css';
  text-align: center;
}

.contentSection {
  composes: section from '../theme.css';
}

.container {
  composes: container from '../theme.css';
}
```

---

## ✍️ الطباعة (Typography)

### Classes المتاحة

```css
.text-hero        /* 2.5rem - للعناوين الرئيسية */
.text-h1          /* 2.2rem */
.text-h2          /* 1.8rem */
.text-h3          /* 1.4rem */
.text-h4          /* 1.1rem */
.text-body        /* نص عادي مع line-height: 1.7 */
.text-small       /* 0.9rem */
.text-responsive  /* يتغير حسب حجم الشاشة */
```

### مثال

```jsx
<h1 className={styles.mainTitle}>AxeCode</h1>
<p className={styles.description}>منصة تعليمية للبرمجة</p>
```

```css
.mainTitle {
  composes: text-hero from '../theme.css';
  color: var(--text-primary);
  text-align: center;
}

.description {
  composes: text-body from '../theme.css';
}
```

---

## 🎭 التأثيرات والانتقالات

### Classes الجاهزة

```css
/* الانتقالات */
.transition-fast      /* 0.1s ease */
.transition-normal    /* 0.3s ease (الافتراضي) */
.transition-slow      /* 0.4s ease */

/* التأثيرات */
.hover-lift           /* translateY(-2px) on hover */
.hover-scale          /* scale(1.05) on hover */

/* الظلال */
.shadow-solid         /* 3px 3px 0px black */
.shadow-soft-sm       /* ظل ناعم صغير */
.shadow-soft-md       /* ظل ناعم متوسط */
.shadow-soft-lg       /* ظل ناعم كبير */
```

### مثال

```css
.interactiveCard {
  composes: card hover-lift transition-normal from '../theme.css';
}
```

---

## 📱 الاستجابة (Responsive)

### نقاط التوقف (Breakpoints)

| الجهاز | العرض | التطبيق |
|--------|-------|---------|
| Mobile Small | < 480px | تكديس عمودي، أحجام صغيرة |
| Mobile Large | 480px - 767px | تخطيط موبايل |
| Tablet | 768px - 991px | تخطيط متوسط |
| Desktop Small | 992px - 1023px | تخطيط desktop صغير |
| Desktop | 1024px - 1279px | تخطيط كامل |
| Desktop Large | ≥ 1280px | تخطيط واسع |

### مثال Responsive

```css
.responsiveSection {
  composes: section from '../theme.css';
  padding: 4rem 2rem;
}

.responsiveGrid {
  composes: card-grid from '../theme.css';
}

/* Mobile */
@media (max-width: 480px) {
  .responsiveSection {
    padding: 2rem 1rem;
  }
  
  .responsiveGrid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Tablet */
@media (max-width: 768px) {
  .responsiveSection {
    padding: 3rem 1.5rem;
  }
}
```

---

## 🎯 القواعد الذهبية

### ✅ DO - افعل

1. **استخدم المتغيرات دائماً**
   ```css
   background-color: var(--main-bg-color);  /* ✅ */
   ```

2. **استخدم الـ Utility Classes**
   ```css
   composes: btn btn-black from '../theme.css';  /* ✅ */
   ```

3. **اتبع نظام المسافات**
   ```css
   gap: 30px;  /* ✅ من النظام */
   padding: 2rem;  /* ✅ من النظام */
   ```

4. **استخدم الظلال المحددة**
   ```css
   box-shadow: var(--shadow-solid);  /* ✅ Brutalist */
   box-shadow: var(--shadow-soft-sm);  /* ✅ Soft */
   ```

5. **الزوايا الدائرية الصغيرة**
   ```css
   border-radius: 3px;  /* ✅ للأزرار */
   border-radius: 8px;  /* ✅ للكروت */
   ```

### ❌ DON'T - لا تفعل

1. **لا تستخدم ألوان عشوائية**
   ```css
   background-color: #ff5733;  /* ❌ */
   ```

2. **لا تستخدم ظلال مخصصة دون سبب**
   ```css
   box-shadow: 5px 10px 20px rgba(0,0,0,0.5);  /* ❌ */
   ```

3. **لا تكسر نظام المسافات**
   ```css
   padding: 17px;  /* ❌ */
   gap: 23px;  /* ❌ */
   ```

4. **لا تستخدم زوايا دائرية كبيرة**
   ```css
   border-radius: 25px;  /* ❌ إلا بسبب وجيه */
   ```

5. **لا تنسى الاستجابة**
   ```css
   /* ❌ لا تفعل */
   .myElement {
     width: 1000px;  /* Fixed width */
   }
   
   /* ✅ افعل */
   .myElement {
     max-width: 1000px;
     width: 100%;
   }
   ```

---

## 🔧 Utility Classes الشائعة

### Layout

```css
.flex              /* display: flex */
.flex-col          /* flex-direction: column */
.flex-center       /* center items */
.flex-between      /* space-between */
.grid              /* display: grid */
```

### Text

```css
.text-center       /* text-align: center */
.text-left         /* text-align: left */
.text-right        /* text-align: right */
.uppercase         /* text-transform: uppercase */
.capitalize        /* text-transform: capitalize */
```

### Position

```css
.relative          /* position: relative */
.absolute          /* position: absolute */
.fixed             /* position: fixed */
```

### Spacing

```css
/* Gap */
.gap-xs            /* gap: 5px */
.gap-sm            /* gap: 10px */
.gap-md            /* gap: 20px */
.gap-lg            /* gap: 30px */

/* Padding */
.p-xs              /* padding: 0.6rem */
.p-sm              /* padding: 1rem */
.p-md              /* padding: 2rem */
.p-lg              /* padding: 3rem */
.p-xl              /* padding: 4rem */

/* Margin */
.m-xs              /* margin: 0.6rem */
.m-sm              /* margin: 1rem */
.m-md              /* margin: 1.5rem */
.m-lg              /* margin: 2.5rem */
.m-xl              /* margin: 4rem */
```

---

## 📝 أمثلة كاملة

### مثال 1: صفحة المدونة

```jsx
// BlogPage.jsx
import styles from './BlogPage.module.css';

function BlogPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>المدونة</h1>
        <p className={styles.subtitle}>أحدث المقالات في البرمجة</p>
      </section>
      
      <section className={styles.postsSection}>
        <div className={styles.postsGrid}>
          {posts.map(post => (
            <article key={post.id} className={styles.postCard}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <button className={styles.readMore}>اقرأ المزيد</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
```

```css
/* BlogPage.module.css */
@import '../theme.css';

.page {
  background-color: var(--main-bg-color);
  min-height: 100vh;
  padding-top: 70px;
}

.hero {
  composes: section-hero from '../theme.css';
  min-height: 50vh;
}

.title {
  composes: text-hero from '../theme.css';
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 1rem;
}

.subtitle {
  composes: text-body from '../theme.css';
  text-align: center;
  opacity: 0.8;
}

.postsSection {
  composes: section from '../theme.css';
}

.postsGrid {
  composes: card-grid from '../theme.css';
  max-width: 1200px;
  margin: 0 auto;
}

.postCard {
  composes: card hover-lift from '../theme.css';
}

.postCard h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.postCard p {
  composes: text-body from '../theme.css';
  margin-bottom: 1.5rem;
}

.readMore {
  composes: btn btn-black btn-small from '../theme.css';
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    min-height: 40vh;
  }
  
  .postsGrid {
    grid-template-columns: 1fr;
  }
}
```

### مثال 2: فورم التسجيل

```jsx
// RegisterForm.jsx
import styles from './RegisterForm.module.css';

function RegisterForm() {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h2 className={styles.formTitle}>إنشاء حساب جديد</h2>
        
        <div className={styles.inputGroup}>
          <label>الاسم الكامل</label>
          <input type="text" placeholder="أدخل اسمك" />
        </div>
        
        <div className={styles.inputGroup}>
          <label>البريد الإلكتروني</label>
          <input type="email" placeholder="example@email.com" />
        </div>
        
        <div className={styles.inputGroup}>
          <label>كلمة المرور</label>
          <input type="password" placeholder="••••••••" />
        </div>
        
        <button type="submit" className={styles.submitBtn}>
          تسجيل
        </button>
      </form>
    </div>
  );
}
```

```css
/* RegisterForm.module.css */
@import '../theme.css';

.container {
  composes: section from '../theme.css';
  composes: flex-center from '../theme.css';
  min-height: 100vh;
  background-color: var(--main-bg-color);
}

.form {
  composes: card from '../theme.css';
  max-width: 500px;
  width: 100%;
}

.formTitle {
  composes: text-h2 from '../theme.css';
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 2rem;
}

.inputGroup {
  composes: input-container from '../theme.css';
}

.inputGroup label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
}

.submitBtn {
  composes: btn btn-black btn-large from '../theme.css';
  width: 100%;
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 480px) {
  .form {
    padding: 1.5rem;
  }
}
```

---

## 🎨 الخلاصة

نظام التصميم الجديد يوفر:

✅ **التناسق** - نفس الشكل في كل مكان
✅ **السرعة** - classes جاهزة للاستخدام
✅ **المرونة** - متغيرات قابلة للتخصيص
✅ **الاستجابة** - responsive by default
✅ **الصيانة** - سهولة التحديث والتطوير

---

## 📚 المصادر

- **الملف الرئيسي**: `src/presentation/styles/design-system.css`
- **المرجع السريع**: `src/presentation/styles/theme.css`
- **الأمثلة**: `src/presentation/styles/examples/design-system-usage-example.module.css`
- **التحليل الكامل**: `.gemini/antigravity/brain/.../design_system_analysis.md`

---

**Happy Coding! 🚀**
