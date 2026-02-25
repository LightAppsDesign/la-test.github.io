// ============================================
// Мобильное меню
// ============================================
const mobileHeader = document.querySelector('.mobile-header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

if (mobileMenuToggle && mobileHeader) {
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        mobileHeader.classList.toggle('active');
        document.body.style.overflow = mobileHeader.classList.contains('active') ? 'hidden' : '';
    });
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', function() {
        if (mobileHeader) {
            mobileHeader.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ============================================
// Кнопка назад для header-nav2 (десктоп и мобильная)
// ============================================
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/';
    }
}

// Обработчики для всех кнопок назад header-nav2
document.querySelectorAll('.header-nav2-back-btn, .mobile-header-nav2-back-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        goBack();
    });
});

// ============================================
// Application Form - File Upload with Drag & Drop
// ============================================
const fileUploadArea = document.getElementById('fileUploadArea');
const fileInput = document.getElementById('file');
const uploadBtn = document.getElementById('uploadBtn');
const fileName = document.getElementById('fileName');
const removeFileBtn = document.getElementById('removeFileBtn');
const applicationForm = document.getElementById('applicationForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

if (fileUploadArea && fileInput && uploadBtn && fileName && removeFileBtn) {
    // Клик по кнопке Upload file
    uploadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });

    // Клик по области загрузки файла
    fileUploadArea.addEventListener('click', function(e) {
        // Если клик не по кнопкам и не по имени файла, открываем диалог выбора файла
        if (e.target !== uploadBtn && e.target !== fileName && e.target !== removeFileBtn && !removeFileBtn.contains(e.target)) {
            fileInput.click();
        }
    });

    // Обработка выбора файла через input
    fileInput.addEventListener('change', function(e) {
        handleFileSelect(e.target.files);
    });

    // Drag and Drop события
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.classList.add('drag-over');
    });

    fileUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.classList.remove('drag-over');
    });

    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files);
            // Устанавливаем файл в input для отправки формы
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(files[0]);
            fileInput.files = dataTransfer.files;
        }
    });

    // Функция обработки выбранного файла
    function handleFileSelect(files) {
        if (files.length > 0) {
            const file = files[0];
            fileName.textContent = file.name;
            fileName.classList.add('has-file');
            // Показываем кнопку удаления файла
            removeFileBtn.style.display = 'flex';
            // Скрываем текст "or drag and drop here" когда файл выбран
            const dragDropText = fileUploadArea.querySelector('.drag-drop-text');
            if (dragDropText) {
                dragDropText.style.display = 'none';
            }
            // Убираем класс ошибки при загрузке файла
            fileUploadArea.classList.remove('error');
        }
    }

    // Функция удаления файла
    function removeFile() {
        // Очищаем input
        fileInput.value = '';
        // Очищаем имя файла
        fileName.textContent = '';
        fileName.classList.remove('has-file');
        // Скрываем кнопку удаления
        removeFileBtn.style.display = 'none';
        // Показываем текст "or drag and drop here"
        const dragDropText = fileUploadArea.querySelector('.drag-drop-text');
        if (dragDropText) {
            dragDropText.style.display = 'block';
        }
    }

    // Обработчик клика по кнопке удаления файла
    removeFileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        removeFile();
    });

    // Функция для перезапуска анимации
    function restartAnimation(element) {
        if (element) {
            // Удаляем класс для сброса анимации
            element.classList.remove('error');
            // Принудительно перезапускаем анимацию через requestAnimationFrame
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    element.classList.add('error');
                });
            });
        }
    }
    
    // Функция валидации формы
    function validateForm() {
        let isValid = true;
        
        // Сначала убираем все ошибки для сброса анимации
        if (nameInput) {
            nameInput.classList.remove('error');
        }
        if (emailInput) {
            emailInput.classList.remove('error');
        }
        fileUploadArea.classList.remove('error');
        
        // Проверка поля Name
        if (!nameInput || !nameInput.value || !nameInput.value.trim()) {
            if (nameInput) {
                restartAnimation(nameInput);
            }
            isValid = false;
        }
        
        // Проверка поля Email
        if (!emailInput || !emailInput.value || !emailInput.value.trim() || !emailInput.validity.valid) {
            if (emailInput) {
                restartAnimation(emailInput);
            }
            isValid = false;
        }
        
        // Проверка файла
        if (!fileInput.files || fileInput.files.length === 0) {
            restartAnimation(fileUploadArea);
            isValid = false;
        }
        
        return isValid;
    }
    
    // Обработка отправки формы
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация всех полей - подсвечиваем красным все незаполненные
            if (!validateForm()) {
                return false;
            }
            
            // Если все поля валидны, продолжаем отправку формы
            // Здесь можно добавить логику отправки формы
            console.log('Form submitted');
            // Можно добавить отправку через fetch или другой метод
        });
    }
    
    // Убираем класс ошибки при вводе в поля
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('error');
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (this.value.trim() && this.validity.valid) {
                this.classList.remove('error');
            }
        });
    }
    
    // Убираем класс ошибки при загрузке файла
    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            fileUploadArea.classList.remove('error');
        }
    });
}

// ============================================
// Contact us — модальная форма (открытие/закрытие, валидация с покачиванием)
// ============================================
(function() {
    var contactBtn = document.getElementById('contactUsBtn');
    var contactModal = document.getElementById('contactModal');
    var contactModalClose = document.getElementById('contactModalClose');
    var contactForm = document.getElementById('contactForm');
    var contactName = document.getElementById('contactName');
    var contactEmail = document.getElementById('contactEmail');
    var contactMessage = document.getElementById('contactMessage');

    if (!contactModal || !contactForm) return;

    function openModal() {
        contactModal.classList.add('is-open');
        contactModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        contactModal.classList.remove('is-open');
        contactModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (contactBtn) {
        contactBtn.addEventListener('click', openModal);
        contactBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal();
            }
        });
    }
    if (contactModalClose) contactModalClose.addEventListener('click', closeModal);
    contactModal.addEventListener('click', function(e) {
        if (e.target === contactModal) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contactModal.classList.contains('is-open')) closeModal();
    });

    function restartAnimation(el) {
        if (!el) return;
        el.classList.remove('error');
        requestAnimationFrame(function() {
            requestAnimationFrame(function() { el.classList.add('error'); });
        });
    }

    function validateContactForm() {
        var valid = true;
        if (contactName) contactName.classList.remove('error');
        if (contactEmail) contactEmail.classList.remove('error');
        if (contactMessage) contactMessage.classList.remove('error');

        if (!contactName || !contactName.value.trim()) {
            if (contactName) restartAnimation(contactName);
            valid = false;
        }
        if (!contactEmail || !contactEmail.value.trim() || !contactEmail.validity.valid) {
            if (contactEmail) restartAnimation(contactEmail);
            valid = false;
        }
        if (!contactMessage || !contactMessage.value.trim()) {
            if (contactMessage) restartAnimation(contactMessage);
            valid = false;
        }
        return valid;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validateContactForm()) {
            var first = contactModal.querySelector('.form-input.error');
            if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        console.log('Contact form submitted');
        closeModal();
    });

    if (contactName) contactName.addEventListener('input', function() { if (this.value.trim()) this.classList.remove('error'); });
    if (contactEmail) contactEmail.addEventListener('input', function() { if (this.value.trim() && this.validity.valid) this.classList.remove('error'); });
    if (contactMessage) contactMessage.addEventListener('input', function() { if (this.value.trim()) this.classList.remove('error'); });
})();

// ============================================
// Анимации, связанные со скроллом: cat_head зеркально + параллакс, карточки main-vac шатаются
// ============================================
(function() {
    var ticking = false;
    var catHead = document.querySelector('.cat_head');
    var catHeadImgs = catHead ? catHead.querySelectorAll('.cat_head-img') : [];
    var mainVacRow = document.querySelector('.main-vac');
    var vacCards = mainVacRow ? mainVacRow.querySelectorAll('.vac-item-main1, .vac-item-main2, .vac-item-main3') : [];
    var bigCatSection = document.querySelector('.big_cat');
    var bigCatImg = bigCatSection ? bigCatSection.querySelector('.big_cat-img') : null;

    // Разные «фазы» для псевдо-рандомного зеркала от скролла (каждая картинка переворачивается в своей позиции)
    var catHeadScrollSteps = [97, 113, 79];
    var vacSeeds = [1337, 4242, 9001];

    function getScrollY() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    // Плавный псевдо-рандом (1D value noise) для «хаотичного» шатания без рывков
    function fract(x) {
        return x - Math.floor(x);
    }
    function hash1(n) {
        return fract(Math.sin(n) * 43758.5453123);
    }
    function smoothstep(t) {
        return t * t * (3 - 2 * t);
    }
    function noise1(x, seed) {
        var i0 = Math.floor(x);
        var i1 = i0 + 1;
        var t = x - i0;
        var a = hash1(i0 + seed);
        var b = hash1(i1 + seed);
        var u = smoothstep(t);
        return a + (b - a) * u; // 0..1
    }

    function updateScrollAnimations() {
        var scrollY = getScrollY();
        var vh = window.innerHeight;

        // Cat Head: параллакс + зеркальное отображение от скролла (рандомно по позиции)
        if (catHead && catHeadImgs.length) {
            var rect = catHead.getBoundingClientRect();
            var centerY = rect.top + rect.height / 2;
            var viewportCenter = vh / 2;
            var scrollFactor = (centerY - viewportCenter) * 0.2;
            var parallaxSpeeds = [0.4, 0.8, 0.4];
            catHeadImgs.forEach(function(img, i) {
                var offset = scrollFactor * (parallaxSpeeds[i] || 0.5);
                var step = catHeadScrollSteps[i] || 100;
                var mirror = (Math.floor(scrollY / step) + i) % 2 === 1;
                var scaleX = mirror ? -1 : 1;
                img.style.transform = 'translateY(' + offset + 'px) scaleX(' + scaleX + ')';
            });
        }

        // Карточки вакансий: активное шатание от скролла (будто качаются при прокрутке)
        if (mainVacRow && vacCards.length) {
            var vacRect = mainVacRow.getBoundingClientRect();
            var vacCenter = vacRect.top + vacRect.height / 2;
            var progress = 1 - Math.max(0, Math.min(1, (vacCenter - vh * 0.3) / (vh * 0.6)));
            // Основное покачивание (в зоне видимости) + хаотичное шатание (у каждой карточки своё)
            var sway = Math.sin(progress * Math.PI) * 4.5;
            var baseRotations = [2.5, 0, -2.5];
            vacCards.forEach(function(card, i) {
                var seed = vacSeeds[i] || (1000 + i * 77);
                var n1 = noise1(scrollY * 0.02, seed);      // 0..1 (медленнее)
                var n2 = noise1(scrollY * 0.055, seed + 19); // 0..1 (быстрее)
                var chaos = ((n1 - 0.5) * 8) + ((n2 - 0.5) * 4); // примерно -6..6 deg
                var deg = baseRotations[i] + sway + chaos;
                card.style.transform = 'rotate(' + deg + 'deg)';
            });
        }

        // Лёгкий параллакс для big_cat изображения
        if (bigCatSection && bigCatImg) {
            var bigRect = bigCatSection.getBoundingClientRect();
            var bigCenter = bigRect.top + bigRect.height / 2;
            var offset = (bigCenter - vh / 2) * 0.08;
            bigCatImg.style.transform = 'translateY(' + offset + 'px)';
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateScrollAnimations);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateScrollAnimations();
})();

// ============================================
// Vacancy card: смена картинки пина при наведении на кнопку Apply Now
// pic1.svg -> pic1ac.svg, pic2.svg -> pic2ac.svg, pic3.svg -> pic3ac.svg
// ============================================
(function() {
    var pinSwapMap = [
        { from: 'pic1.svg', to: 'pic1ac.svg' },
        { from: 'pic2.svg', to: 'pic2ac.svg' },
        { from: 'pic3.svg', to: 'pic3ac.svg' }
    ];

    document.querySelectorAll('.vac-item').forEach(function(vacItem) {
        var pin = vacItem.querySelector('.vac-item-pin');
        var btn = vacItem.querySelector('a.vac-item-btn[href*="vac_info"]');
        if (!pin || !btn || pin.tagName !== 'IMG') return;

        var originalSrc = pin.src || pin.getAttribute('src');
        if (!originalSrc) return;

        function getHoverSrc(src) {
            var path = src;
            for (var i = 0; i < pinSwapMap.length; i++) {
                if (path.indexOf(pinSwapMap[i].from) !== -1) {
                    return path.replace(pinSwapMap[i].from, pinSwapMap[i].to);
                }
            }
            return src;
        }

        btn.addEventListener('mouseenter', function() {
            pin.style.opacity = '0';
            var newSrc = getHoverSrc(originalSrc);
            requestAnimationFrame(function() {
                pin.src = newSrc;
                pin.setAttribute('src', newSrc);
                requestAnimationFrame(function() {
                    pin.style.opacity = '1';
                });
            });
        });

        btn.addEventListener('mouseleave', function() {
            pin.style.opacity = '0';
            requestAnimationFrame(function() {
                pin.src = originalSrc;
                pin.setAttribute('src', originalSrc);
                requestAnimationFrame(function() {
                    pin.style.opacity = '1';
                });
            });
        });
    });
})();

// ============================================
// Рандомное размещение .random-pin: слева / по центру / справа
// ============================================
(function() {
    var positions = ['pin-left', 'pin-center', 'pin-right'];
    document.querySelectorAll('.random-pin').forEach(function(pin) {
        var randomClass = positions[Math.floor(Math.random() * positions.length)];
        pin.classList.add(randomClass);
    });
})();

// ============================================
// vac_info: рандомная картинка из vac_ava при каждой загрузке
// Достаточно менять только количество файлов в папке (a1.png, a2.png, ...).
// ============================================
(function() {
    var vacImage = document.getElementById('vacImage');
    if (!vacImage) return;
    var vacAvaBase = 'scr/media/imgs/vac_ava/';
    var vacAvaCount = 5; // количество файлов a1.png … aN.png в папке vac_ava
    var randomIndex = 1 + Math.floor(Math.random() * vacAvaCount);
    vacImage.src = vacAvaBase + 'a' + randomIndex + '.png';
})();

// ============================================
// Hero: картинка ПК каждые 400ms меняется на pcver.png и обратно
// ============================================
(function() {
    var heroPcImg = document.querySelector('.main-hero-img-pc');
    if (!heroPcImg) return;
    var base = 'scr/media/imgs/main/main_header/';
    var imgs = [base + 'pchor.png', base + 'pcver.png'];
    var index = 0;
    setInterval(function() {
        index = 1 - index;
        heroPcImg.src = imgs[index];
    }, 400);
})();
