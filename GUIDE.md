# دليل المطور - منصة جوزور

<div dir="rtl" align="right">

## 📚 جدول المحتويات

1. [مقدمة](#مقدمة)
2. [البنية المعمارية](#البنية-المعمارية)
3. [الخدمات الأساسية](#الخدمات-الأساسية)
4. [المكونات المشتركة](#المكونات-المشتركة)
5. [مكونات المميزات](#مكونات-المميزات)
6. [نظام الترجمة](#نظام-الترجمة)
7. [نظام الحماية](#نظام-الحماية)
8. [إدارة الحالة](#إدارة-الحالة)
9. [التنسيقات RTL](#التنسيقات-rtl)
10. [أفضل الممارسات](#أفضل-الممارسات)

## مقدمة

هذا الدليل موجه للمطورين الذين يعملون على منصة جوزور. يشرح البنية التقنية وكيفية إضافة مميزات جديدة والتعامل مع الكود.

## البنية المعمارية

### Clean Architecture

المشروع يتبع مبادئ Clean Architecture:

```
Core (القلب)
  ↓
Shared (المشترك)
  ↓
Features (المميزات)
```

### المجلدات الرئيسية

#### 1. Core (القلب)
يحتوي على الكود المستقل عن Framework:

```typescript
core/
├── models/          // النماذج والأنواع
├── services/        // خدمات الأعمال
└── guards/          // حماية المسارات
```

**مثال - إنشاء Model جديد:**

```typescript
// core/models/example.model.ts
export interface Example {
  id: string;
  name: string;
  status: ExampleStatus;
  createdAt: Date;
}

export type ExampleStatus = 'active' | 'inactive';
```

**مثال - إنشاء Service جديد:**

```typescript
// core/services/example.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Example } from '../models/example.model';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private items = signal<Example[]>([]);

  getItems(): Observable<Example[]> {
    return of(this.items()).pipe(delay(300));
  }

  createItem(item: Partial<Example>): Observable<Example> {
    const newItem: Example = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      ...item
    } as Example;

    const items = this.items();
    items.push(newItem);
    this.items.set([...items]);

    return of(newItem).pipe(delay(500));
  }
}
```

#### 2. Shared (المشترك)
مكونات قابلة لإعادة الاستخدام:

```typescript
shared/
└── components/
    ├── layout/
    ├── header/
    ├── sidebar/
    ├── stepper/
    ├── status-badge/
    ├── card/
    └── loading/
```

**مثال - إنشاء مكون مشترك:**

```typescript
// shared/components/button/button.component.ts
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  template: `
    <button 
      [type]="type()"
      [disabled]="disabled()"
      [class]="'btn btn-' + variant()"
      (click)="handleClick()">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    .btn-primary {
      background: #059669;
      color: white;
      
      &:hover:not(:disabled) {
        background: #047857;
      }
    }
  `]
})
export class ButtonComponent {
  type = input<'button' | 'submit'>('button');
  variant = input<'primary' | 'secondary'>('primary');
  disabled = input<boolean>(false);
  clicked = output<void>();

  handleClick() {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
```

#### 3. Features (المميزات)
المميزات الرئيسية للتطبيق:

```typescript
features/
├── auth/           // المصادقة
├── dashboard/      // لوحة التحكم
├── requests/       // الطلبات
├── quotations/     // عروض الأسعار
└── shipments/      // الشحنات
```

## الخدمات الأساسية

### 1. I18nService (خدمة الترجمة)

```typescript
// الاستخدام في المكونات
constructor(private i18nService: I18nService) {}

// ترجمة بسيطة
const text = this.i18nService.translate('common.save');

// ترجمة مع parameters
const text = this.i18nService.translate(
  'importerRequest.availableInDays', 
  { days: 5 }
);
```

### 2. AuthService (خدمة المصادقة)

```typescript
// تسجيل الدخول
this.authService.login(email, password, role).subscribe({
  next: (response) => {
    this.authService.setCurrentUser(response.user, response.token);
    this.router.navigate(['/dashboard']);
  }
});

// الحصول على المستخدم الحالي
const user = this.authService.getCurrentUser();

// التحقق من الدور
const hasRole = this.authService.hasRole(['admin', 'importer']);

// تسجيل الخروج
this.authService.logout();
```

### 3. RequestService (خدمة الطلبات)

```typescript
// إنشاء طلب
this.requestService.createRequest(request).subscribe({
  next: (createdRequest) => {
    console.log('تم إنشاء الطلب:', createdRequest);
  }
});

// جلب الطلبات
this.requestService.getRequests().subscribe({
  next: (requests) => {
    this.requests.set(requests);
  }
});

// تحديث حالة الطلب
this.requestService.updateRequestStatus(id, 'approved').subscribe({
  next: (updatedRequest) => {
    console.log('تم تحديث الطلب:', updatedRequest);
  }
});
```

## المكونات المشتركة

### 1. Stepper (خطوات النموذج)

```typescript
// في المكون
steps = computed((): Step[] => [
  { label: 'الخطوة الأولى', completed: this.currentStep() > 0 },
  { label: 'الخطوة الثانية', completed: this.currentStep() > 1 },
  { label: 'الخطوة الثالثة', completed: this.currentStep() > 2 }
]);

// في القالب
<app-stepper 
  [steps]="steps()" 
  [currentStep]="currentStep()"
  (stepChange)="goToStep($event)" />
```

### 2. StatusBadge (شارات الحالة)

```typescript
// في القالب
<app-status-badge [status]="request.status" />
```

يدعم الحالات التالية:
- pending, in_review, awaiting_quotes
- approved, rejected, completed
- in_transit, delivered
- verified, pending_verification

### 3. Card (البطاقة)

```typescript
// في القالب
<app-card 
  [title]="'عنوان البطاقة'" 
  [subtitle]="'وصف البطاقة'"
  [hover]="true">
  
  <!-- المحتوى -->
  <p>محتوى البطاقة هنا</p>
  
  <!-- Footer (اختياري) -->
  <div footer>
    <button>إجراء</button>
  </div>
</app-card>
```

## مكونات المميزات

### إنشاء مميزة جديدة

#### 1. إنشاء المجلد

```bash
mkdir -p src/app/features/new-feature
```

#### 2. إنشاء المكون

```typescript
// features/new-feature/new-feature.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-new-feature',
  imports: [CommonModule],
  template: `
    <div class="new-feature">
      <h1>{{ t('newFeature.title') }}</h1>
      <!-- المحتوى -->
    </div>
  `,
  styles: [`
    .new-feature {
      max-width: 1400px;
      margin: 0 auto;
    }
  `]
})
export class NewFeatureComponent implements OnInit {
  loading = signal(true);

  constructor(private i18nService: I18nService) {}

  ngOnInit() {
    this.loadData();
  }

  t(key: string): string {
    return this.i18nService.translate(key);
  }

  loadData() {
    // تحميل البيانات
  }
}
```

#### 3. إضافة المسار

```typescript
// app.routes.ts
{
  path: 'new-feature',
  loadComponent: () => import('./features/new-feature/new-feature.component')
    .then(m => m.NewFeatureComponent)
}
```

#### 4. إضافة الترجمة

```json
// assets/i18n/ar.json
{
  "newFeature": {
    "title": "المميزة الجديدة",
    "subtitle": "وصف المميزة"
  }
}
```

## نظام الترجمة

### إضافة ترجمات جديدة

```json
// assets/i18n/ar.json
{
  "mySection": {
    "title": "العنوان",
    "message": "رسالة مع {param}",
    "nested": {
      "value": "قيمة متداخلة"
    }
  }
}
```

### الاستخدام

```typescript
// ترجمة بسيطة
this.i18nService.translate('mySection.title')

// ترجمة مع parameters
this.i18nService.translate('mySection.message', { param: 'قيمة' })

// ترجمة متداخلة
this.i18nService.translate('mySection.nested.value')
```

### إضافة لغة جديدة

1. إنشاء ملف الترجمة:

```bash
touch src/assets/i18n/en.json
```

2. إضافة الترجمات بنفس البنية:

```json
{
  "app": {
    "title": "Jozour - Trade Platform",
    "slogan": "B2B International Trade Platform"
  }
}
```

3. إضافة خيار تبديل اللغة:

```typescript
switchLanguage(lang: 'ar' | 'en') {
  this.i18nService.loadTranslations(lang);
}
```

## نظام الحماية

### 1. Auth Guard

يحمي المسارات من الوصول غير المصرح:

```typescript
// في المسارات
{
  path: 'protected',
  canActivate: [authGuard],
  loadComponent: () => import('./protected.component')
}
```

### 2. Role Guard

يحمي المسارات بناءً على الدور:

```typescript
// في المسارات
{
  path: 'admin',
  canActivate: [roleGuard],
  data: { roles: ['admin'] },
  loadComponent: () => import('./admin.component')
}
```

### إنشاء Guard جديد

```typescript
// core/guards/custom.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const customGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  // منطق الحماية
  const isAllowed = true; // تحقق من الشرط
  
  if (!isAllowed) {
    router.navigate(['/access-denied']);
    return false;
  }
  
  return true;
};
```

## إدارة الحالة

### استخدام Signals

المشروع يستخدم Angular Signals لإدارة الحالة:

```typescript
import { signal, computed } from '@angular/core';

export class MyComponent {
  // إنشاء signal
  count = signal(0);
  
  // computed signal
  doubleCount = computed(() => this.count() * 2);
  
  // تحديث signal
  increment() {
    this.count.set(this.count() + 1);
    // أو
    this.count.update(value => value + 1);
  }
}
```

### في القالب

```html
<p>العدد: {{ count() }}</p>
<p>الضعف: {{ doubleCount() }}</p>
<button (click)="increment()">زيادة</button>
```

## التنسيقات RTL

### قواعد SCSS للـ RTL

```scss
// استخدم inline-start/end بدلاً من left/right
.element {
  margin-inline-start: 1rem;  // يصبح margin-right في RTL
  margin-inline-end: 1rem;    // يصبح margin-left في RTL
  padding-inline: 1rem;        // padding على الجانبين
}

// للخصائص المعتمدة على الاتجاه
.element {
  text-align: start;  // right في RTL
  float: inline-start; // right في RTL
}

// للحالات الخاصة
[dir="rtl"] .element {
  // تنسيقات خاصة بالـ RTL
}

[dir="ltr"] .element {
  // تنسيقات خاصة بالـ LTR
}
```

### Flexbox مع RTL

```scss
.container {
  display: flex;
  flex-direction: row; // يتغير تلقائياً مع RTL
  
  // استخدم start/end
  justify-content: flex-start;
  align-items: flex-start;
}
```

### Grid مع RTL

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  // Grid يعمل تلقائياً مع RTL
}
```

## أفضل الممارسات

### 1. تسمية الملفات

```
feature-name.component.ts
feature-name.component.html
feature-name.component.scss
feature-name.service.ts
feature-name.model.ts
```

### 2. هيكل المكون

```typescript
import { Component, OnInit, signal, computed } from '@angular/core';
// استيراد المكتبات أولاً

// استيراد الخدمات
import { ServiceName } from '../../core/services/...';

// استيراد المكونات
import { ComponentName } from '../../shared/components/...';

// استيراد النماذج
import { ModelName } from '../../core/models/...';

@Component({
  selector: 'app-feature',
  imports: [CommonModule, ComponentName],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.scss'
})
export class FeatureComponent implements OnInit {
  // 1. Signals
  loading = signal(true);
  data = signal<ModelName[]>([]);
  
  // 2. Computed
  filteredData = computed(() => {
    return this.data().filter(/* ... */);
  });
  
  // 3. Constructor
  constructor(private service: ServiceName) {}
  
  // 4. Lifecycle hooks
  ngOnInit() {
    this.loadData();
  }
  
  // 5. Public methods
  loadData() {
    // ...
  }
  
  // 6. Event handlers
  onSubmit() {
    // ...
  }
  
  // 7. Private/helper methods
  private processData() {
    // ...
  }
}
```

### 3. معالجة الأخطاء

```typescript
this.service.getData().subscribe({
  next: (data) => {
    this.data.set(data);
    this.loading.set(false);
  },
  error: (error) => {
    console.error('Error loading data:', error);
    this.loading.set(false);
    // إظهار رسالة خطأ للمستخدم
    alert(this.t('common.error'));
  }
});
```

### 4. TypeScript Types

```typescript
// دائماً استخدم الأنواع القوية
interface MyData {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

// تجنب any
const data: any = {}; // ❌ سيء
const data: MyData = {}; // ✅ جيد
```

### 5. Lazy Loading

```typescript
// استخدم lazy loading للمسارات
{
  path: 'feature',
  loadComponent: () => import('./features/feature/feature.component')
    .then(m => m.FeatureComponent)
}
```

### 6. Performance

```typescript
// استخدم OnPush change detection للمكونات الكبيرة
@Component({
  selector: 'app-feature',
  changeDetection: ChangeDetectionStrategy.OnPush
})

// استخدم trackBy في *ngFor
<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>

trackById(index: number, item: any): string {
  return item.id;
}
```

### 7. Accessibility

```html
<!-- استخدم ARIA attributes -->
<button 
  aria-label="إغلاق"
  (click)="close()">
  ×
</button>

<!-- استخدم semantic HTML -->
<nav>
  <ul>
    <li><a href="/home">الرئيسية</a></li>
  </ul>
</nav>
```

## الاختبار

### Unit Tests

```typescript
// feature.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureComponent } from './feature.component';

describe('FeatureComponent', () => {
  let component: FeatureComponent;
  let fixture: ComponentFixture<FeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## الأوامر المفيدة

```bash
# تشغيل بيئة التطوير
npm start

# بناء للإنتاج
npm run build

# تشغيل الاختبارات
npm test

# فحص الكود
ng lint

# إنشاء مكون جديد
ng generate component features/feature-name

# إنشاء خدمة جديدة
ng generate service core/services/service-name

# إنشاء guard جديد
ng generate guard core/guards/guard-name
```

## الخلاصة

هذا الدليل يغطي الجوانب الأساسية للعمل على منصة جوزور. للمزيد من المعلومات:

- راجع الكود الموجود كأمثلة
- اتبع نفس الأنماط والبنية
- استخدم TypeScript بشكل كامل
- اهتم بالـ RTL في كل التنسيقات
- اختبر على متصفحات مختلفة

**جوزور © 2025 - دليل المطور**

</div>

