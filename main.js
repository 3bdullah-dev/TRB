document.addEventListener("DOMContentLoaded", () => {
  // 1. تشغيل مكتبة الأنيمشن
  AOS.init({
    duration: 800,
    easing: "ease-out-cubic",
    once: true,
    mirror: false,
    offset: 50,
  });

  // 2. القائمة المتجاوبة (للجوال)
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const icon = menuToggle.querySelector("i");
      if (navMenu.classList.contains("active")) {
        icon.className = "fas fa-times";
      } else {
        icon.className = "fas fa-bars";
      }
    });
  }

  const navLinks = document.querySelectorAll(".nav-menu ul li a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        menuToggle.querySelector("i").className = "fas fa-bars";
      }
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // 3. التبويبات (الأقسام) - يشمل القسم الجديد
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");

      const targetId = button.getAttribute("data-target");
      const targetPanel = document.getElementById(targetId);

      if (targetPanel) {
        targetPanel.classList.add("active");
        AOS.refresh();
      }
    });
  });

  // 4. تغيير شفافية الهيدر عند النزول بالصفحة
  const header = document.querySelector(".main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.padding = "10px 0";
      header.style.background = "rgba(10, 21, 32, 0.95)";
      header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
    } else {
      header.style.padding = "15px 0";
      header.style.background = "rgba(10, 21, 32, 0.85)";
      header.style.boxShadow = "none";
    }
  });

  // 5. معرض الصور المخصص (Lightbox) - يعمل مع جميع الأقسام بما فيها الأبواب الخشبية
  const lightboxOverlay = document.createElement("div");
  lightboxOverlay.className = "lightbox-overlay";
  lightboxOverlay.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="إغلاق"><i class="fas fa-times"></i></button>
      <button class="lightbox-nav lightbox-prev hover-target" aria-label="السابق"><i class="fas fa-chevron-right"></i></button>
      <img src="" alt="صورة المنتج" class="lightbox-image">
      <button class="lightbox-nav lightbox-next hover-target" aria-label="التالي"><i class="fas fa-chevron-left"></i></button>
    </div>
  `;
  document.body.appendChild(lightboxOverlay);

  let currentImages = [];
  let currentIndex = 0;

  const openLightbox = (wrapper) => {
    const hiddenImagesDiv = wrapper.querySelector(".hidden-images");
    if (!hiddenImagesDiv) return;

    const imgs = hiddenImagesDiv.querySelectorAll("img");
    currentImages = Array.from(imgs).map((img) => img.src);
    currentIndex = 0;

    updateLightboxImage();
    lightboxOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const updateLightboxImage = () => {
    const lightboxImg = lightboxOverlay.querySelector(".lightbox-image");
    lightboxImg.style.opacity = "0";
    setTimeout(() => {
      lightboxImg.src = currentImages[currentIndex];
      lightboxImg.style.opacity = "1";
    }, 150);
  };

  const closeLightbox = () => {
    lightboxOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".product-gallery-wrapper").forEach((wrapper) => {
    wrapper.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(wrapper);
    });
  });

  lightboxOverlay
    .querySelector(".lightbox-close")
    .addEventListener("click", closeLightbox);

  lightboxOverlay.addEventListener("click", (e) => {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  lightboxOverlay
    .querySelector(".lightbox-next")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % currentImages.length;
      updateLightboxImage();
    });

  lightboxOverlay
    .querySelector(".lightbox-prev")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex =
        (currentIndex - 1 + currentImages.length) % currentImages.length;
      updateLightboxImage();
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxOverlay.classList.contains("active"))
      closeLightbox();
    if (e.key === "ArrowLeft" && lightboxOverlay.classList.contains("active")) {
      currentIndex = (currentIndex + 1) % currentImages.length;
      updateLightboxImage();
    }
    if (
      e.key === "ArrowRight" &&
      lightboxOverlay.classList.contains("active")
    ) {
      currentIndex =
        (currentIndex - 1 + currentImages.length) % currentImages.length;
      updateLightboxImage();
    }
  });

  // 6. عدادات الإحصائيات المتحركة المحسنة
  const counters = document.querySelectorAll(".counter-num");
  const sectionAbout = document.getElementById("about");
  let started = false;

  const animateCounters = () => {
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      let count = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  };

  window.addEventListener("scroll", () => {
    if (
      sectionAbout &&
      window.scrollY >= sectionAbout.offsetTop - 300 &&
      !started
    ) {
      started = true;
      animateCounters();
    }
  });

  // 7. تأثير الإمالة ثلاثي الأبعاد (3D Tilt) - يعمل على جميع الكروت بما فيها الأبواب الخشبية
  if (window.matchMedia("(hover: hover)").matches) {
    const tiltCards = document.querySelectorAll(".glass-tilt");

    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xRotation = -(((y - rect.height / 2) / rect.height) * 6);
        const yRotation = ((x - rect.width / 2) / rect.width) * 6;

        card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) translateY(-5px)`;
        card.style.transition = "transform 0.1s ease-out";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
        card.style.transition = "transform 0.5s ease-out";
      });
    });
  }
});
