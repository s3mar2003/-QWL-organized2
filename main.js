// حالة الواجهة   li
const UI = {
  theme: localStorage.getItem('theme') || 'light',
  lang: localStorage.getItem('lang') || 'ar',
  page: localStorage.getItem('page') || 'home',
  projects: [],
  filtered: [],
  search: '',
  loading: false,

  // تطبيق الإعدادات (الثيم واللغة والصفحة)
  apply() {
    document.documentElement.setAttribute('data-theme', this.theme);
    document.documentElement.lang = this.lang;

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.textContent = this.theme === 'dark' ? '☀️' : '🌙';

    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.textContent = this.lang === 'ar' ? 'EN' : 'AR';

    document.querySelectorAll('.nav-list a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(this.page)) link.classList.add('active');
    });
  },

  // تحديث أي خاصية مع الحفظ
  update(key, value) {
    this[key] = value;
    localStorage.setItem(key, value);
    this.apply();
  }
};

// التطبيق
const App = {
  init() {
    UI.apply();
    this.addEvents();
    this.loadProjects();
    this.setPage();
    this.initPage();
  },

  // ضبط الأحداث
  addEvents() {
    document.body.addEventListener('click', (e) => {
      if (e.target.closest('#themeToggle')) {
        e.preventDefault();
        UI.update('theme', UI.theme === 'dark' ? 'light' : 'dark');
      }
      if (e.target.closest('#langToggle')) {
        e.preventDefault();
        UI.update('lang', UI.lang === 'ar' ? 'en' : 'ar');
        alert('التبديل بين اللغتين سيضاف لاحقًا');
      }
      if (e.target.closest('.menu-toggle')) {
        const menu = document.getElementById('main-menu');
        const toggle = e.target.closest('.menu-toggle');
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !open);
        menu.style.display = open ? 'none' : 'block';
      }
      if (e.target.closest('#main-menu a')) {
        document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
        document.getElementById('main-menu').style.display = 'none';
      }
      if (e.target.closest('.search-btn')) this.searchProjects();
      if (e.target.closest('.filter-btn')) this.filterProjects(e.target.dataset.filter);
    });

    // البحث مع Debounce
    const input = document.getElementById('searchInput');
    if (input) input.addEventListener('input', debounce(() => this.searchProjects(), 300));

    // النماذج
    document.addEventListener('submit', (e) => {
      if (e.target.closest('.newsletter-form')) {
        e.preventDefault();
        this.handleNewsletter(e.target);
      }
      if (e.target.closest('#contactForm')) {
        e.preventDefault();
        this.handleContact(e.target);
      }
    });

    // تمرير (Throttle)
    window.addEventListener('scroll', throttle(() => this.onScroll(), 200));

    // تغيير حجم الشاشة (Debounce)
    window.addEventListener('resize', debounce(() => this.onResize(), 300));

    // الروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  },

  // تحميل بيانات المشاريع (وهمية)
  async loadProjects() {
    UI.loading = true;
    await new Promise(r => setTimeout(r, 500)); // محاكاة شبكة
    UI.projects = [
      {
        id: 1,
        title: "افتتاح مبنى مدرسة ابن خلدون الجديد بمحافظة لحج",
        description: "يهدف المشروع إلى تطوير البنية التحتية التعليمية في مديرية المضاربة ورأس العارة عبر إنشاء فصول دراسية متكاملة ومجهزة بكافة المرافق الأساسية، مما يضمن بيئة تعليمية آمنة وجاذبة للطلاب",
        category: "education",
        location: "لحج",
        beneficiaries: 500,
        image: "image/project3.webp"
      },
      {
        id: 2,
        title: "مشروع إنارة شوارع مديريتي القاهرة والمظفر بتعز بالطاقة الشمسية",
        description: "يتضمن المشروع تركيب 425 وحدة إنارة تعمل بالطاقة الشمسية، إلى جانب 27 عمود إنارة جديد، مع إجراء صيانة شاملة للأعمدة القائمة وتركيب قواعد خراسانية لدعمها.",
        category: "developer",
        location: "تعز",
        beneficiaries: 200,
        image: "image/project1.webp"
      },
      {
        id: 3,
        title: "ندوة بعنوان دور المرأة وقيادتها في الاستجابة الإنسانية",
        description: " نظمت منظمة أجيال بلا قات، اليوم الخميس 6 أكتوبر 2022، في مديرية صالة بمحافظة تعز الندوة الخاصة حول دور المرأة وقيادتها في الاستجابة الإنساني",
        category: "awareness",
        location: "تعز",
        beneficiaries: 60,
        image: "image/project5.jpeg"
      },
      {
        id: 4,
        title: "ورشة عمل لتمويل خطة تنمية تعز",
        description: "ورشة عمل لدعم خطة التنمية الاقتصادية والاجتماعية لمحافظة تعز (2024-2026)،   بتنظيم مشترك بين السلطة المحلية وبرنامج الأمم المتحدة الإنمائي، وبمشاركة الحكومة اليمنية،   الاتحاد الأوروبي، المانحين، القطاع الخاص، والمجتمع المدن",
        category: "developer",
        location: "تعز",
        beneficiaries: 1200,
        image: "image/project7.webp"
      },
      {
        id: 5,
        title: "برنامج التدريب المهني للنساء",
        description: "تدريب 150 امرأة على الحرف والمهن البديلة لدعم الأسر المحتاجة.",
        category: "empowerment",
        location: "صنعاء",
        beneficiaries: 150,
        image: "image/project10.jpeg"
      },
      {
        id: 6,
        title: "تجهيز المكتبات المدرسية في المناطق الريفية",
        description: "توفير الكتب والمراجع التعليمية لـ 20 مدرسة في المناطق الريفية.",
        category: "education",
        location: "إب",
        beneficiaries: 5000,
        image: "image/Project11.webp"
      }
    ];
    UI.filtered = [...UI.projects]; //نسخه جديده من المشاريع
    UI.loading = false;
    if (UI.page === 'projects') this.renderProjects();
  },

  // عرض المشاريع 
  renderProjects() {
    const container = document.querySelector('.projects-container');
    if (!container) return;
    container.innerHTML = '';
    const frag = document.createDocumentFragment();
    UI.filtered.forEach(p => {
      const el = document.createElement('article');
      el.className = 'project-item';
      el.innerHTML = `
        <div class="project-image">
          <img src="${p.image}" alt="${p.title}">
        </div>
        <div class="project-info">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <span><i class="fas fa-map-marker-alt"></i> ${p.location}</span>
          <span><i class="fas fa-users"></i> ${p.beneficiaries}+ مستفيد</span>
        </div>
      `;
      frag.appendChild(el);
    });
    container.appendChild(frag);
  },

  // البحث
  searchProjects() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    const q = input.value.toLowerCase();// قراءه النص الذي ادخله المستخدم
    UI.filtered = q ? UI.projects.filter(p =>
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    ) : [...UI.projects];
    this.renderProjects();
  },

  // الفلترة
  filterProjects(category) {
    UI.filtered = category === 'all'
      ? [...UI.projects]
      : UI.projects.filter(p => p.category === category);
    this.renderProjects();
  },

  // نموذج الاتصال
  handleContact(form) {
    const data = Object.fromEntries(new FormData(form));
    const saved = JSON.parse(localStorage.getItem('contacts') || '[]');
    saved.push({ ...data, date: new Date().toISOString() });
    localStorage.setItem('contacts', JSON.stringify(saved));
    form.reset();
    alert('تم إرسال رسالتك!');
  },

  // النشرة البريدية
  handleNewsletter(form) {
    const email = form.querySelector('input[type="email"]').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('بريد غير صحيح');
    const subs = JSON.parse(localStorage.getItem('subs') || '[]');
    subs.push(email);
    localStorage.setItem('subs', JSON.stringify(subs));
    form.reset();
    alert('شكراً لاشتراكك!');
  },

  // التوجيه (Routing)
  setPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (path.includes('index.html')) UI.page = 'home';
    else if (path.includes('about.html')) UI.page = 'about';
    else if (path.includes('project.html')) UI.page = 'projects';
    else if (path.includes('contact.html')) UI.page = 'contact';
    UI.apply();
  },

  initPage() {
    if (UI.page === 'home') this.animateStats();
    if (UI.page === 'projects') this.renderProjects();
  },

  animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    const section = document.querySelector('.about-stats');
    if (!section) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stats.forEach(stat => {
            const target = parseInt(stat.textContent.replace('+', ''));
            let current = 0, step = target / 60;
            const timer = setInterval(() => {
              current += step;
              if (current >= target) { clearInterval(timer); stat.textContent = target + '+'; }
              else stat.textContent = Math.floor(current) + '+';
            }, 16);
          });
         // observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(section);
  },

  onScroll() {
    this.animateOnScroll();
   // this.animateTimeline();
  },

  animateOnScroll() {
    document.querySelectorAll('.project-item, .section-header').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  },

  

  onResize() {
    const menu = document.getElementById('main-menu');
    if (window.innerWidth > 768) menu.style.display = 'block';
    else {
      menu.style.display = 'none';
      document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
    }
  }
};

// دوال تحسين الأداء
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// تشغيل التطبيق
document.addEventListener('DOMContentLoaded', () => App.init());
