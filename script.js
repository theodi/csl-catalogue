window.addEventListener('DOMContentLoaded', () => {
    generateODIQr();
    fetch('courses.json')
      .then(response => response.json())
      .then(courses => initCarousel(courses))
      .catch(err => console.error('Error loading courses:', err));

    function initCarousel(courses) {
      const listEl = document.getElementById('course-list');
      const titleEl = document.getElementById('course-title');
      const overviewEl = document.getElementById('course-overview');
      const outcomesEl = document.getElementById('course-outcomes');
      const durationEl = document.getElementById('course-duration');
      const levelEl = document.getElementById('course-level');
      const formatEl = document.getElementById('course-format');
      const linkEl = document.getElementById('course-link');
      const qrContainer = document.getElementById('course-qr');
      const toggleBtn = document.getElementById('toggle-btn');

      let currentIndex = 0;
      let isPaused = false;
      let pauseTimeout;
      let slideInterval;

      const logo = document.querySelector('.logo img');
      const aboutOdi = document.getElementById('about-odi');
      const courseModal = document.getElementById('course-modal');

      logo.addEventListener('click', () => {
        pauseCarousel();
        aboutOdi.classList.remove('hidden');
        courseModal.classList.add('hidden');
        setTimeout(() => {
            resumeCarousel();
        }, 60000);
      });

      function renderList() {
        listEl.innerHTML = '';
        courses.forEach((course, idx) => {
          const li = document.createElement('li');
          li.textContent = course.title;
          li.addEventListener('click', () => selectCourse(idx, true));
          if (idx === currentIndex) li.classList.add('selected');
          listEl.appendChild(li);
        });
      }
      const allQrContainer = document.getElementById('all-course-qr');

      courses.forEach((course, index) => {
        const qrWrapper = document.createElement('div');
        qrWrapper.id = `qr-${index}`;
        qrWrapper.className = 'qr-wrapper';
        qrWrapper.style.display = 'none';

        const qr = new QRCode(qrWrapper, {
          text: course.bookingLink,
          width: 150,
          height: 150
        });

        allQrContainer.appendChild(qrWrapper);
      });

      function selectCourse(index, manual = false) {
        const aboutOdi = document.getElementById('about-odi');
        const courseModal = document.getElementById('course-modal');
        aboutOdi.classList.add('hidden');
        courseModal.classList.remove('hidden');
        clearSelected();
        currentIndex = index;
        const course = courses[index];
        document.querySelectorAll('#course-list li')[index].classList.add('selected');
        titleEl.textContent = course.title;
        overviewEl.innerHTML = course.overview;

        // Populate outcomes
        outcomesEl.innerHTML = '';
        course.outcomes.forEach(item => {
          const li = document.createElement('li'); li.textContent = item;
          outcomesEl.appendChild(li);
        });

        durationEl.textContent = course.duration;
        levelEl.textContent = course.competencyLevel;

        const methodsContainer = document.getElementById('delivery-methods');
        methodsContainer.innerHTML = ''; // Clear previous

        course.deliveryMethods.forEach(method => {
            const displayName = method.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const wrapper = document.createElement('div');
            wrapper.className = 'icon-entry';

            const img = document.createElement('img');
            img.src = `img/${method}.svg`;
            img.alt = `${displayName} Icon`;
            img.className = 'icon';

            const text = document.createElement('span');
            text.textContent = displayName;

            wrapper.appendChild(img);
            wrapper.appendChild(text);
            methodsContainer.appendChild(wrapper);
        });

        linkEl.href = course.bookingLink;
        linkEl.textContent = course.bookingLink;
        const levelIcon = document.getElementById('level-icon');
        levelIcon.src = `img/${course.competencyLevel.toLowerCase()}.svg`;
        levelIcon.alt = `${course.competencyLevel} Level Icon`;

        document.querySelectorAll('.qr-wrapper').forEach(div => div.style.display = 'none');
        const matchingQr = document.getElementById(`qr-${index}`);
        if (matchingQr) {
            matchingQr.style.display = 'block';
        }

        if (manual) pauseCarousel();
      }

      function clearSelected() {
        document.querySelectorAll('#course-list li').forEach(li => li.classList.remove('selected'));
      }

      function nextCourse() {
        currentIndex = (currentIndex + 1) % courses.length;
        selectCourse(currentIndex);
      }

      /* script.js addition */
    const countdownEl = document.getElementById('countdown');
    let countdownValue = 15;
    let countdownTimer;

    function updateCountdown(seconds) {
        console.log('Updating countdown to:', seconds);
        clearInterval(countdownTimer);
        countdownValue = seconds;
        countdownEl.textContent = `${countdownValue}s`;
        countdownTimer = setInterval(() => {
            countdownValue--;
            countdownEl.textContent = `${countdownValue}s`;
            if (countdownValue <= 0) clearInterval(countdownTimer);
        }, 1000);
    }

    function startCarousel() {
        console.log('Starting carousel');
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            if (!isPaused) {
            nextCourse();
            updateCountdown(15);
            }
        }, 15000);
        updateCountdown(15);
    }

    function pauseCarousel() {
        isPaused = true;
        toggleBtn.textContent = '▶';
        clearInterval(slideInterval);
        clearTimeout(pauseTimeout);
        updateCountdown(60);
        pauseTimeout = setTimeout(() => resumeCarousel(), 60000);
    }

    function resumeCarousel() {
        const aboutOdi = document.getElementById('about-odi');
        const courseModal = document.getElementById('course-modal');
        aboutOdi.classList.add('hidden');
        courseModal.classList.remove('hidden');
        isPaused = false;
        toggleBtn.textContent = '⏸';
        clearInterval(slideInterval);
        startCarousel();
    }

      toggleBtn.addEventListener('click', () => {
        if (isPaused) resumeCarousel(); else pauseCarousel();
      });

      // Initialize display
      renderList();
      selectCourse(0);
      startCarousel();
    }
  });

  // Generate QR for theodi.org
function generateODIQr() {
    const qrDiv = document.getElementById('odi-qr');
    qrDiv.innerHTML = '';
    new QRCode(qrDiv, {
      text: "https://theodi.org",
      width: 150,
      height: 150
    });
  }