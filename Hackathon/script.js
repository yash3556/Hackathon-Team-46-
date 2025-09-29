// Mobile Menu Toggle
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');

        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

// Theme Toggle with persistence
        const themeToggle = document.querySelector('.theme-toggle');
        const body = document.body;

        function applyThemeFromStorage() {
            const saved = localStorage.getItem('theme') || '';
            if (saved === 'dark') body.classList.add('dark-mode');
        }

        function saveTheme() {
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        }

        applyThemeFromStorage();

        function updateThemeIcon(){
            const icon = themeToggle?.querySelector('i');
            if (!icon) return;
            if (body.classList.contains('dark-mode')) {
                icon.className = 'fas fa-moon';
            } else {
                icon.className = 'fas fa-sun';
            }
        }

        // initialize icon based on current theme
        updateThemeIcon();

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            saveTheme();
            updateThemeIcon();
        });

        // FAQ Accordion
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });

// Navbar Scroll Effect (class toggle)
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });

        // Smooth Scrolling for Anchor Links and mobile dropdown tap support
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();
                const navbar = document.querySelector('.navbar');
                const offset = navbar ? navbar.offsetHeight + 10 : 80;
                const top = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });

                // Close mobile menu if open
                navMenu.classList.remove('active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Mobile-friendly dropdown toggles: tap the chevron or parent to open
        document.querySelectorAll('.nav-item.has-dropdown > .nav-link').forEach(link => {
            link.addEventListener('click', (ev) => {
                if (window.innerWidth > 768) return; // desktop hover works
                ev.preventDefault();
                const parent = link.parentElement;
                const open = parent.classList.toggle('open');
                // Close others
                document.querySelectorAll('.nav-item.has-dropdown').forEach(it => { if (it !== parent) it.classList.remove('open'); });
            });
        });

        // Scrollspy - highlight active nav link
        const sections = ['#home', '#products', '#about', '#contact'].map(id => document.querySelector(id)).filter(Boolean);
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));

        const onScroll = () => {
            const scrollPos = window.pageYOffset;
            const navbar = document.querySelector('.navbar');
            const offset = navbar ? navbar.offsetHeight + 20 : 100;
            let currentId = '';

            for (const section of sections) {
                if (section.offsetTop - offset <= scrollPos) {
                    currentId = '#' + section.id;
                }
            }

            navLinks.forEach(link => {
                if (!link.getAttribute('href') || !link.getAttribute('href').startsWith('#')) return;
                link.classList.toggle('active', link.getAttribute('href') === currentId);
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('load', onScroll);

        // Back to top
        const backToTop = document.querySelector('.back-to-top');
        const toggleBackToTop = () => {
            if (!backToTop) return;
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        };
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        window.addEventListener('load', toggleBackToTop);
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Carousel controls
        const track = document.querySelector('.carousel-track');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const scrollByAmount = 300;
        if (track && prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => { track.scrollBy({ left: -scrollByAmount, behavior: 'smooth' }); });
            nextBtn.addEventListener('click', () => { track.scrollBy({ left: scrollByAmount, behavior: 'smooth' }); });
        }

        // Memory Match Game
        const grid = document.querySelector('.memory-grid');
        const restartBtn = document.querySelector('.game-restart');
        const movesEl = document.querySelector('.game-moves');
        const timeEl = document.querySelector('.game-time');
        const msgEl = document.querySelector('.game-message');

        const images = [
            'game1.jpg', 'game2.jpg', 'game3.jpg',
            'game4.jpg', 'game5.jpg', 'game6.jpg'
        ];

        let deck = [];
        let firstCard = null;
        let secondCard = null;
        let lock = false;
        let moves = 0;
        let matchedPairs = 0;
        let timer = null;
        let seconds = 0;

        function shuffle(array){
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function startTimer(){
            clearInterval(timer);
            seconds = 0;
            timeEl.textContent = '0s';
            timer = setInterval(() => {
                seconds += 1;
                timeEl.textContent = seconds + 's';
            }, 1000);
        }

        function buildDeck(){
            const picks = images.slice(0, 6); // 6 pairs => 12 cards
            deck = shuffle([...picks, ...picks]);
        }

        function renderGrid(){
            if (!grid) return;
            grid.innerHTML = '';
            deck.forEach(src => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-inner">
                        <div class="card-face card-front">🍦</div>
                        <div class="card-face card-back" style="background-image:url('${src}')"></div>
                    </div>`;
                grid.appendChild(card);
                card.addEventListener('click', () => onCardClick(card, src));
            });
        }

        function resetGame(){
            firstCard = null; secondCard = null; lock = false; moves = 0; matchedPairs = 0;
            movesEl && (movesEl.textContent = '0');
            msgEl && (msgEl.textContent = '');
            buildDeck();
            renderGrid();
            startTimer();
        }

        function onCardClick(card, src){
            if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
            card.classList.add('flipped');
            if (!firstCard) {
                firstCard = { card, src };
                return;
            }
            secondCard = { card, src };
            moves += 1;
            movesEl && (movesEl.textContent = String(moves));
            if (firstCard.src === secondCard.src) {
                firstCard.card.classList.add('matched');
                secondCard.card.classList.add('matched');
                matchedPairs += 1;
                firstCard = null; secondCard = null;
                if (matchedPairs === deck.length / 2) {
                    clearInterval(timer);
                    msgEl && (msgEl.textContent = `Sweet! You won in ${moves} moves and ${seconds}s.`);
                }
            } else {
                lock = true;
                setTimeout(() => {
                    firstCard.card.classList.remove('flipped');
                    secondCard.card.classList.remove('flipped');
                    firstCard = null; secondCard = null; lock = false;
                }, 700);
            }
        }

        if (grid) {
            resetGame();
            restartBtn && restartBtn.addEventListener('click', resetGame);
        }

        // Reveal on scroll for elements with .reveal and carousel items
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll('.reveal, .carousel-item').forEach(el => revealObserver.observe(el));

        // Chatbot
        const bot = document.querySelector('.chatbot');
        const botToggle = document.querySelector('.chatbot-toggle');
        const botClose = document.querySelector('.chatbot-close');
        const botMsgs = document.querySelector('.chatbot-messages');
        const botForm = document.querySelector('.chatbot-input');
        const botText = document.querySelector('.chatbot-text');

        function botOpen(open){
            if (!bot) return;
            if (open) {
                bot.classList.add('open');
                bot.setAttribute('aria-hidden', 'false');
                if (botMsgs && botMsgs.children.length === 0) {
                    pushBot("Hi! I can help with flavors, prices, nearby stores, and hours.");
                    pushBot("Try: 'Show products', 'Find store', 'Open hours', or ask anything!");
                }
            } else {
                bot.classList.remove('open');
                bot.setAttribute('aria-hidden', 'true');
            }
        }

        function pushUser(text){
            if (!botMsgs) return;
            const el = document.createElement('div');
            el.className = 'msg user';
            el.textContent = text;
            botMsgs.appendChild(el);
            botMsgs.scrollTop = botMsgs.scrollHeight;
        }

        function pushBot(text){
            if (!botMsgs) return;
            const el = document.createElement('div');
            el.className = 'msg bot';
            el.textContent = text;
            botMsgs.appendChild(el);
            botMsgs.scrollTop = botMsgs.scrollHeight;
        }

        // Build lightweight site knowledge (pages, FAQs) from DOM or fetched HTML
        const sitePages = {
            home: 'index.html',
            products: 'products.html',
            about: 'about.html',
            contact: 'contact.html#contact',
            games: 'games.html',
            terms: 'terms.html',
            signup: 'signup.html'
        };

        let siteFaqs = [];
        (function buildFaqs(){
            try {
                const items = document.querySelectorAll('.faq-item');
                if (items && items.length){
                    siteFaqs = Array.from(items).map(it => ({
                        q: (it.querySelector('.faq-question')?.textContent||'').trim(),
                        a: (it.querySelector('.faq-answer')?.textContent||'').trim()
                    })).filter(x => x.q);
                }
            } catch {}
        })();

        function getFaqAnswer(s){
            if (!siteFaqs.length) return null;
            const q = s.toLowerCase();
            let best = null;
            let bestScore = 0;
            siteFaqs.forEach(f => {
                const hay = (f.q + ' ' + f.a).toLowerCase();
                let score = 0;
                q.split(/[^a-z0-9]+/).filter(Boolean).forEach(t => { if (hay.includes(t)) score += 1; });
                if (score > bestScore){ bestScore = score; best = f; }
            });
            return bestScore > 0 ? best : null;
        }

        function guideTo(pageKey, extra){
            const url = sitePages[pageKey];
            if (!url) return extra || '';
            return `${extra ? extra + ' ' : ''}(See: ${url})`;
        }

        function handleBotIntent(q){
            const s = q.toLowerCase().trim();
            // Greetings
            if (/(^|\b)(hello|hi|hey)(\b|$)/.test(s)) return "Hi! I can help with products, pages, FAQs, stores, and more. What do you need?";

            // Navigation intents
            if (/(go to|open|show) (home|products|about|contact|games|terms|sign ?up)/.test(s)){
                const dest = s.match(/(home|products|about|contact|games|terms|sign ?up)/)?.[1] || '';
                navigateTo(dest.replace(' ', ''));
                return `Opening ${dest}… ${guideTo(dest.replace(' ', ''))}`;
            }

            // Theme
            if (/\b(dark|light)\b.*mode|\btheme\b/.test(s)){
                toggleThemeByText(s);
                return body.classList.contains('dark-mode') ? 'Dark mode on.' : 'Light mode on.';
            }

            // Store locator
            if (/\b(store|nearby|find.*store|location)\b/.test(s)){
                try { openLocator(); } catch {}
                return 'Opening store locator… ' + guideTo('contact', 'For help, use the Contact page as well.');
            }

            // Game
            if (/\b(game|play|memory)\b/.test(s)){
                navigateTo('games');
                return 'Taking you to the Memory Match game… ' + guideTo('games');
            }

            // Contact
            if (/(contact|support|help.*(contact|form))/.test(s)){
                navigateTo('contact');
                return 'Opening the Contact section… ' + guideTo('contact');
            }

            // List products
            if (/list (all )?products|show products?$/.test(s)){
                listProducts();
                return 'Here are some products and prices: ' + guideTo('products');
            }

            // Product search e.g., "find cornetto" or "price of cups"
            if (/(find|search|price of|tell me about) /.test(s)){
                const name = s.replace(/^(find|search|price of|tell me about)\s+/,'').trim();
                if (name){
                    const found = findProductByName(name);
                    if (found){
                        window.location.href = found.url;
                        return `${found.title} — ${found.snippet || ''} ${guideTo('products')}`;
                    }
                    return `I’m sorry, I don’t have that information yet. Please check the contact page for more help.`;
                }
            }

            // FAQ matching
            const faq = getFaqAnswer(s);
            if (faq){
                return `${faq.a} ${guideTo('contact', 'Need more help?')}`.trim();
            }

            // Hours
            if (/hour|time|open|closing/.test(s)) return "Most partner stores are open 10am–10pm; hours vary by location. " + guideTo('contact');

            // Clarify if the message is very short / unclear
            if (s.split(/\s+/).filter(Boolean).length < 3){
                return "Could you share a bit more about what you need? For example: ‘find cornetto’, ‘open contact’, or ‘find a store’.";
            }

            // Fallback per rule
            return "I’m sorry, I don’t have that information yet. Please check the contact page for more help.";
        }

        function navigateTo(dest){
            const map = {
                home: 'index.html',
                products: 'products.html',
                about: 'about.html',
                contact: 'contact.html#contact',
                games: 'games.html',
                terms: 'terms.html',
                signup: 'signup.html'
            };
            const url = map[dest?.toLowerCase?.()] || null;
            if (url) { window.location.href = url; }
        }

        function toggleThemeByText(s){
            const wantDark = /dark/.test(s) && !/light/.test(s);
            const wantLight = /light/.test(s) && !/dark/.test(s);
            if (wantDark) { if (!body.classList.contains('dark-mode')) body.classList.add('dark-mode'); }
            else if (wantLight) { if (body.classList.contains('dark-mode')) body.classList.remove('dark-mode'); }
            else { body.classList.toggle('dark-mode'); }
            try { localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light'); } catch {}
        }

        function listProducts(){
            const lines = [];
            document.querySelectorAll('.product-card').forEach(card => {
                const n = (card.querySelector('h3')?.textContent||'').trim();
                const p = (card.querySelector('.product-price')?.textContent||'').trim();
                if (n) lines.push(`${n}${p ? ` (${p})` : ''}`);
            });
            if (lines.length){ pushBot(lines.join('\n')); return; }
            // Fallback: fetch products page
            fetch('products.html').then(r => r.ok ? r.text() : '').then(html => {
                if (!html) return;
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const items = [];
                doc.querySelectorAll('.product-card').forEach(card => {
                    const n = (card.querySelector('h3')?.textContent||'').trim();
                    const p = (card.querySelector('.product-price')?.textContent||'').trim();
                    if (n) items.push(`${n}${p ? ` (${p})` : ''}`);
                });
                if (items.length) pushBot(items.slice(0, 10).join('\n'));
            }).catch(()=>{});
        }

        function findProductByName(name){
            const q = name.toLowerCase();
            const idx = (typeof productIndex !== 'undefined' ? productIndex : []);
            let best = null;
            idx.forEach(it => {
                const title = (it.title||'').toLowerCase();
                if (title.includes(q)) best = best || it;
            });
            return best;
        }

        botToggle && botToggle.addEventListener('click', () => botOpen(!bot?.classList.contains('open')));
        botClose && botClose.addEventListener('click', () => botOpen(false));
        botForm && botForm.addEventListener('submit', () => {
            const text = (botText?.value || '').trim();
            if (!text) return;
            pushUser(text);
            const reply = handleBotIntent(text);
            setTimeout(() => pushBot(reply), 300);
            botText.value = '';
        });

        // Sign Up form enhancements
        const signupForm = document.querySelector('.signup-form');
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('signupEmail');
        const pwdInput = document.getElementById('password');
        const cpwdInput = document.getElementById('confirmPassword');
        const strengthBar = document.querySelector('.strength-meter > i');
        const strengthLabel = document.querySelector('.strength-label');

        function setToast(msg){
            let t = document.querySelector('.toast');
            if (!t){
                t = document.createElement('div');
                t.className = 'toast';
                document.body.appendChild(t);
            }
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 2200);
        }

        function passwordScore(p){
            let score = 0;
            if (p.length >= 8) score++;
            if (/[A-Z]/.test(p)) score++;
            if (/[a-z]/.test(p)) score++;
            if (/[0-9]/.test(p)) score++;
            if (/[^A-Za-z0-9]/.test(p)) score++;
            return Math.min(score, 5);
        }

        function updateStrength(){
            if (!pwdInput || !strengthBar || !strengthLabel) return;
            const s = passwordScore(pwdInput.value);
            const pct = [0, 20, 40, 60, 80, 100][s];
            strengthBar.style.width = pct + '%';
            const labels = ['Too short','Weak','Fair','Good','Strong','Excellent'];
            strengthLabel.textContent = labels[s];
        }

        function toggleInvalid(input, show, key){
            if (!input) return;
            input.classList.toggle('invalid', !!show);
            const err = document.querySelector(`.form-error[data-for="${key}"]`);
            if (err) err.classList.toggle('show', !!show);
        }

        function validateForm(){
            let ok = true;
            if (fullNameInput && fullNameInput.value.trim().length < 2){ ok = false; toggleInvalid(fullNameInput, true, 'fullName'); } else toggleInvalid(fullNameInput, false, 'fullName');
            if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)){ ok = false; toggleInvalid(emailInput, true, 'signupEmail'); } else toggleInvalid(emailInput, false, 'signupEmail');
            if (pwdInput && pwdInput.value.length < 8){ ok = false; toggleInvalid(pwdInput, true, 'password'); } else toggleInvalid(pwdInput, false, 'password');
            if (cpwdInput && cpwdInput.value !== (pwdInput?.value||'')){ ok = false; toggleInvalid(cpwdInput, true, 'confirmPassword'); } else toggleInvalid(cpwdInput, false, 'confirmPassword');
            const agree = document.getElementById('agree');
            if (agree && !agree.checked) ok = false;
            return ok;
        }

        document.querySelectorAll('[data-toggle-password]')?.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-toggle-password');
                const input = document.getElementById(id);
                if (!input) return;
                const isPw = input.getAttribute('type') === 'password';
                input.setAttribute('type', isPw ? 'text' : 'password');
                btn.innerHTML = isPw ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
            });
        });

        pwdInput && pwdInput.addEventListener('input', updateStrength);
        updateStrength();

        signupForm && signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validateForm()) { setToast('Please fix the errors and try again.'); return; }
            setToast('Account created! Welcome to Kwality Wall\'s.');
            signupForm.reset();
            updateStrength();
        });

        // Site Search (client-side) — PRODUCTS ONLY
        const searchForm = document.querySelector('.nav-search-form');
        const searchInput = document.querySelector('.nav-search-input');
        let productIndex = [];
        let searchReady = false;
        let indexBuilding = false;

        // Results dropdown
        let resultsBox = null;
        function ensureResultsBox(){
            if (resultsBox) return resultsBox;
            resultsBox = document.createElement('div');
            resultsBox.className = 'nav-search-results';
            // Inline minimal styles to avoid editing CSS file
            Object.assign(resultsBox.style, {
                position: 'absolute',
                zIndex: '1000',
                maxHeight: '300px',
                overflowY: 'auto',
                width: 'min(480px, 90vw)',
                background: getComputedStyle(document.body).getPropertyValue('--card-bg') || '#fff',
                color: 'inherit',
                boxShadow: '0 8px 24px rgba(0,0,0,.12)',
                borderRadius: '12px',
                padding: '8px',
                display: 'none'
            });
            const formRect = searchForm?.getBoundingClientRect();
            const top = (formRect?.bottom || 60) + window.scrollY + 6;
            const left = (formRect?.left || 16) + window.scrollX;
            resultsBox.style.top = top + 'px';
            resultsBox.style.left = left + 'px';
            document.body.appendChild(resultsBox);
            return resultsBox;
        }

        function hideResults(){ if (resultsBox) resultsBox.style.display = 'none'; }
        function showResults(){ ensureResultsBox().style.display = 'block'; }

        function renderResults(items){
            const box = ensureResultsBox();
            box.innerHTML = '';
            if (!items.length){ hideResults(); return; }
            const list = document.createElement('div');
            items.slice(0, 8).forEach(it => {
                const row = document.createElement('a');
                row.href = it.url;
                row.style.display = 'block';
                row.style.padding = '8px 10px';
                row.style.borderRadius = '8px';
                row.style.textDecoration = 'none';
                row.style.color = 'inherit';
                row.addEventListener('mouseover', () => { row.style.background = 'rgba(0,0,0,.06)'; });
                row.addEventListener('mouseout', () => { row.style.background = 'transparent'; });
                const title = document.createElement('div');
                title.textContent = it.title + (it.section ? ' · ' + it.section : '');
                title.style.fontWeight = '600';
                const snip = document.createElement('div');
                snip.textContent = it.snippet || '';
                snip.style.fontSize = '12px';
                snip.style.opacity = '0.8';
                row.appendChild(title);
                if (snip.textContent) row.appendChild(snip);
                list.appendChild(row);
            });
            box.appendChild(list);
            showResults();
        }

        function makeSnippet(text, query){
            const s = text.replace(/\s+/g, ' ').trim();
            const i = s.toLowerCase().indexOf(query.toLowerCase());
            if (i === -1) return s.slice(0, 120) + (s.length > 120 ? '…' : '');
            const start = Math.max(0, i - 40);
            const end = Math.min(s.length, i + query.length + 40);
            return (start > 0 ? '…' : '') + s.slice(start, end) + (end < s.length ? '…' : '');
        }

        function tokenize(q){
            return q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
        }

        function search(q){
            const tokens = tokenize(q);
            if (!tokens.length) return [];
            const score = (text) => tokens.reduce((acc, t) => acc + (text.includes(t) ? 1 : 0), 0);
            const results = [];
            for (const entry of productIndex){
                const hay = (entry.text || '').toLowerCase();
                const s = score(hay);
                if (s > 0){
                    results.push({
                        url: entry.url,
                        title: entry.title,
                        section: entry.section,
                        snippet: makeSnippet(entry.text, tokens[0])
                    });
                }
            }
            return results.sort((a, b) => b.snippet.length - a.snippet.length || a.title.localeCompare(b.title));
        }

        async function buildIndex(){
            if (indexBuilding || searchReady) return; 
            indexBuilding = true;
            // Build product-only index from current page and products.html
            function slugify(s){ return (s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''); }
            function addFromDoc(doc, baseUrl){
                doc.querySelectorAll('.product-card').forEach(card => {
                    const name = (card.querySelector('h3')?.textContent || '').trim();
                    const desc = (card.querySelector('p')?.textContent || '').trim();
                    const price = (card.querySelector('.product-price')?.textContent || '').trim();
                    if (!name) return;
                    const url = baseUrl + '#' + slugify(name);
                    const text = [name, desc, price].filter(Boolean).join(' \u2014 ');
                    productIndex.push({ url, title: name, section: 'Product', text });
                });
            }

            try { addFromDoc(document, (location.pathname.split('/').pop() || 'index.html')); } catch {}

            try {
                if (!location.pathname.endsWith('/products.html') && !location.pathname.endsWith('products.html')){
                    const res = await fetch('products.html', { credentials: 'same-origin' });
                    if (res.ok){
                        const html = await res.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        addFromDoc(doc, 'products.html');
                    }
                }
            } catch {}
            searchReady = true;
            indexBuilding = false;
        }

        function onQueryChange(){
            const q = (searchInput?.value || '').trim();
            if (!q){ hideResults(); return; }
            const items = search(q);
            renderResults(items);
        }

        if (searchInput && searchForm){
            searchInput.addEventListener('input', onQueryChange);
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const q = (searchInput.value || '').trim();
                if (!q) return;
                if (!searchReady) { buildIndex().then(()=>{ const items = search(q); if (items.length) window.location.href = items[0].url; else alert('No matching products.'); }); return; }
                const items = search(q);
                if (items.length) {
                    window.location.href = items[0].url;
                } else {
                    alert(searchReady ? 'No matching products.' : 'Building product index… If opened via file://, consider a local server.');
                }
            });
            const ensureBuilt = () => { if (!searchReady) buildIndex(); };
            searchInput.addEventListener('focus', ensureBuilt, { once: true });
            searchForm.addEventListener('mouseenter', ensureBuilt, { once: true });
            document.addEventListener('click', (ev) => {
                if (!resultsBox) return;
                if (ev.target === resultsBox || resultsBox.contains(ev.target) || ev.target === searchInput) return;
                hideResults();
            });
            window.addEventListener('resize', () => { resultsBox = null; ensureResultsBox(); });
            searchInput.addEventListener('focus', () => { if ((searchInput.value || '').trim()) showResults(); });
            searchInput.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') hideResults(); });
        }

        // Store Locator (Find a Store)
        const storeData = [
            { name: 'KW Express - Connaught Place', address: 'CP, New Delhi', lat: 28.6329, lng: 77.2195, city: 'delhi', hours: '10:00–22:00' },
            { name: 'KW Cart - Bandra Link', address: 'Bandra West, Mumbai', lat: 19.0596, lng: 72.8295, city: 'mumbai', hours: '10:00–22:00' },
            { name: 'KW Scoop Bar - Koregaon Park', address: 'Koregaon Park, Pune', lat: 18.5390, lng: 73.8937, city: 'pune', hours: '11:00–23:00' },
            { name: 'KW Parlour - BTM Layout', address: 'BTM 2nd Stage, Bengaluru', lat: 12.9166, lng: 77.6101, city: 'bengaluru', hours: '11:00–22:00' },
            { name: 'KW Freezer - Anna Nagar', address: 'Anna Nagar, Chennai', lat: 13.0860, lng: 80.2101, city: 'chennai', hours: '10:00–22:00' },
            { name: 'KW Corner - Park Street', address: 'Park Street, Kolkata', lat: 22.5535, lng: 88.3515, city: 'kolkata', hours: '10:00–21:30' }
        ];

        function haversineKm(aLat, aLng, bLat, bLng){
            const toRad = (d) => d * Math.PI / 180;
            const R = 6371;
            const dLat = toRad(bLat - aLat);
            const dLng = toRad(bLng - aLng);
            const la1 = toRad(aLat);
            const la2 = toRad(bLat);
            const h = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;
            return 2 * R * Math.asin(Math.sqrt(h));
        }

        let locatorModal = null;
        function openLocator(){
            if (!locatorModal){
                locatorModal = document.createElement('div');
                locatorModal.className = 'store-locator-modal';
                Object.assign(locatorModal.style, {
                    position: 'fixed', inset: '0', background: 'rgba(0,0,0,.4)', zIndex: '2000', display: 'flex', alignItems: 'center', justifyContent: 'center'
                });
                const card = document.createElement('div');
                Object.assign(card.style, {
                    width: 'min(720px, 92vw)', maxHeight: '80vh', overflow: 'auto', background: getComputedStyle(document.body).getPropertyValue('--card-bg') || '#fff', color: 'inherit', borderRadius: '16px', boxShadow: '0 16px 48px rgba(0,0,0,.2)'
                });
                card.innerHTML = `
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(0,0,0,.08)">
                        <div style="font-weight:700;font-size:18px">Find a Store</div>
                        <button class="loc-close" aria-label="Close" style="border:none;background:transparent;font-size:20px;cursor:pointer">×</button>
                    </div>
                    <div style="padding:14px 16px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
                        <button class="loc-use-gps btn" style="padding:8px 12px;border-radius:999px;border:1px solid rgba(0,0,0,.15);cursor:pointer">Use my location</button>
                        <input class="loc-query" type="text" placeholder="Enter city or area (e.g., Delhi, Pune)" style="flex:1;min-width:220px;padding:10px 12px;border-radius:10px;border:1px solid rgba(0,0,0,.15);background:transparent;color:inherit" />
                        <button class="loc-search btn" style="padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,.15);cursor:pointer">Search</button>
                    </div>
                    <div class="loc-status" style="padding:0 16px 10px 16px;font-size:13px;opacity:.8"></div>
                    <div class="loc-results" style="padding:6px 10px 16px 10px;display:grid;gap:8px"></div>
                `;
                locatorModal.appendChild(card);
                document.body.appendChild(locatorModal);

                locatorModal.addEventListener('click', (e) => { if (e.target === locatorModal) closeLocator(); });
                card.querySelector('.loc-close').addEventListener('click', closeLocator);
                card.querySelector('.loc-use-gps').addEventListener('click', useGPS);
                card.querySelector('.loc-search').addEventListener('click', () => doSearch((card.querySelector('.loc-query')?.value||'').trim()));
                card.querySelector('.loc-query').addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch((e.target.value||'').trim()); });
            }
            renderNearbyByGuess();
            locatorModal.style.display = 'flex';
        }

        function closeLocator(){ if (locatorModal) locatorModal.style.display = 'none'; }

        function setStatus(s){ const el = locatorModal?.querySelector('.loc-status'); if (el) el.textContent = s || ''; }
        function renderList(items){
            const wrap = locatorModal?.querySelector('.loc-results');
            if (!wrap) return;
            wrap.innerHTML = '';
            if (!items.length){
                const none = document.createElement('div');
                none.style.padding = '10px 12px';
                none.style.opacity = '.8';
                none.textContent = 'No nearby stores found. Try a different city.';
                wrap.appendChild(none);
                return;
            }
            items.forEach(it => {
                const row = document.createElement('div');
                Object.assign(row.style, { padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,.08)' });
                const title = document.createElement('div');
                title.style.fontWeight = '700';
                title.textContent = it.name;
                const addr = document.createElement('div');
                addr.style.fontSize = '13px';
                addr.style.opacity = '.85';
                addr.textContent = it.address + (typeof it.distanceKm === 'number' ? ` · ${it.distanceKm.toFixed(1)} km` : '');
                const sub = document.createElement('div');
                sub.style.display = 'flex';
                sub.style.gap = '8px';
                sub.style.marginTop = '8px';
                const dir = document.createElement('a');
                dir.className = 'btn';
                dir.textContent = 'Directions';
                dir.href = `https://www.google.com/maps/search/?api=1&query=${it.lat},${it.lng}`;
                dir.target = '_blank';
                dir.rel = 'noopener';
                Object.assign(dir.style, { padding: '6px 10px', borderRadius: '10px', border: '1px solid rgba(0,0,0,.15)', textDecoration: 'none', color: 'inherit' });
                const hours = document.createElement('div');
                hours.style.fontSize = '12px';
                hours.style.opacity = '.85';
                hours.textContent = `Hours: ${it.hours}`;
                sub.appendChild(dir);
                sub.appendChild(hours);
                row.appendChild(title);
                row.appendChild(addr);
                row.appendChild(sub);
                wrap.appendChild(row);
            });
        }

        function useGPS(){
            if (!navigator.geolocation){ setStatus('Geolocation not supported by your browser.'); return; }
            setStatus('Locating…');
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                const withDist = storeData.map(s => ({ ...s, distanceKm: haversineKm(latitude, longitude, s.lat, s.lng) }));
                withDist.sort((a,b) => a.distanceKm - b.distanceKm);
                renderList(withDist.slice(0, 5));
                setStatus('Showing closest stores to your location.');
            }, (err) => {
                setStatus('Could not get location. You can type a city name instead.');
            }, { enableHighAccuracy: true, timeout: 8000 });
        }

        function doSearch(query){
            if (!query){ setStatus('Type a city like Delhi, Mumbai, Pune…'); renderList([]); return; }
            const q = query.toLowerCase();
            const matches = storeData.filter(s => s.city.includes(q) || s.address.toLowerCase().includes(q));
            renderList(matches);
            setStatus(`Results for "${query}"`);
        }

        function renderNearbyByGuess(){
            // Try to guess by content language; otherwise show all cities grouped by name
            const all = [...storeData].sort((a,b) => a.city.localeCompare(b.city));
            renderList(all.slice(0, 5));
            setStatus('Tip: Click "Use my location" or type your city.');
        }

        // Hook up any "Find a Store" buttons
        document.querySelectorAll('.cta-item a, a.btn, a').forEach(a => {
            const label = (a.textContent || '').trim().toLowerCase();
            if (label === 'find a store'){
                a.addEventListener('click', (e) => { e.preventDefault(); openLocator(); });
            }
        });