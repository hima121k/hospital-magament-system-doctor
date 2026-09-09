// ===== SGHMS Doctor Portal — Shared JavaScript =====

// ===== SIDEBAR TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        const mainContent = document.querySelector('.main-content');
        
        menuToggle.addEventListener('click', () => {
            if (window.innerWidth > 900) {
                sidebar.classList.toggle('collapsed');
                if (mainContent) mainContent.classList.toggle('expanded');
            } else {
                sidebar.classList.toggle('open');
            }
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 900 &&
                !sidebar.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // ===== STATUS SWITCHER =====
    const statusBtns = document.querySelectorAll('.status-btn');
    const queuePauseBanner = document.getElementById('queuePauseBanner');

    statusBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            statusBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const status = this.dataset.status;
            document.body.dataset.doctorStatus = status;

            // Show/hide pause banner
            if (queuePauseBanner) {
                if (status === 'opd') {
                    queuePauseBanner.classList.remove('visible');
                } else {
                    const messages = {
                        emergency: 'Queue paused — Doctor in Emergency Ward',
                        rounds: 'Queue paused — Doctor on Rounds',
                        break: 'Queue paused — Doctor on Break'
                    };
                    queuePauseBanner.querySelector('.pause-text').textContent = messages[status] || 'Queue paused';
                    queuePauseBanner.classList.add('visible');
                }
            }

            // Store in localStorage so it persists across pages
            localStorage.setItem('sghmsDoctorStatus', status);
        });
    });

    // Restore saved status
    const savedStatus = localStorage.getItem('sghmsDoctorStatus') || 'opd';
    const savedBtn = document.querySelector(`.status-btn[data-status="${savedStatus}"]`);
    if (savedBtn) {
        savedBtn.click();
    }

    // ===== ANIMATE STAT COUNTERS =====
    function animateValue(el, start, end, duration, suffix = '') {
        if (!el) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * (end - start) + start) + suffix;
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    setTimeout(() => {
        const statAppt = document.getElementById('statAppointments');
        const statQueue = document.getElementById('statQueue');
        const statReports = document.getElementById('statReports');
        const statSat = document.getElementById('statSatisfaction');
        if (statAppt) animateValue(statAppt, 0, 12, 900);
        if (statQueue) animateValue(statQueue, 0, 5, 700);
        if (statReports) animateValue(statReports, 0, 2, 500);
        if (statSat) animateValue(statSat, 0, 98, 1000, '%');
    }, 300);

    // ===== QUICK ACTION PRESS EFFECT =====
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            this.style.transform = 'scale(0.96)';
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    });
});
