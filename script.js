// ============================================
// RESTAURANTE COTOLAY - Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- Mobile menu toggle ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Carta tabs ---
    const tabs = document.querySelectorAll('.carta-tab');
    const panels = document.querySelectorAll('.carta-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('panel-' + target).classList.add('active');
            
            // Auto-scroll to content on mobile
            if (window.innerWidth <= 768) {
                const navbar = document.getElementById('navbar');
                const offset = (navbar ? navbar.offsetHeight : 60) + 10;
                const panelsContainer = document.querySelector('.carta-panels');
                if (panelsContainer) {
                    const top = panelsContainer.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

    // --- Apple-style scroll motion ---
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollSections = document.querySelectorAll(
        '.hero, .intro, .historia, .especialidades, .carta, ' +
        '.photo-strip, .opiniones, .camino, .contacto, .mapa'
    );
    const revealElements = document.querySelectorAll(
        '.intro-text, .intro-features .feature, .historia-content, ' +
        '.historia-timeline .timeline-item, .especialidades .section-header, ' +
        '.especialidades-grid .especialidad-card, .carta .section-header, ' +
        '.carta-lang, .carta-tabs, .carta-panels, .photo-strip-item, ' +
        '.opiniones .section-header, .opiniones-grid .opinion-card, ' +
        '.camino-content, .contacto-info, .contacto-details, .mapa-container'
    );
    const staggerGroups = [
        '.intro-features .feature',
        '.historia-timeline .timeline-item',
        '.especialidades-grid .especialidad-card',
        '.photo-strip .photo-strip-item',
        '.opiniones-grid .opinion-card'
    ];

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const easeOutCubic = value => 1 - Math.pow(1 - value, 3);

    scrollSections.forEach(section => section.classList.add('apple-section'));
    revealElements.forEach(el => {
        el.classList.add('apple-reveal');
        if (el.classList.contains('section-header') || el.classList.contains('carta-panels')) {
            el.classList.add('apple-reveal--soft');
        }
    });
    staggerGroups.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.style.setProperty('--stagger-index', index);
        });
    });

    if (reduceMotion) {
        revealElements.forEach(el => el.classList.add('is-visible'));
    } else {
        document.body.classList.add('apple-motion');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.16, rootMargin: '0px 0px -48px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));

        const especialidadesSection = document.querySelector('.especialidades');
        const especialidadImages = document.querySelectorAll('.especialidad-img');

        let scrollRafPending = false;

        const applyAppleScroll = () => {
            const viewportHeight = window.innerHeight || 1;

            scrollSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
                const focus = clamp(1 - Math.abs(progress - 0.5) * 1.8, 0, 1);
                const easedFocus = easeOutCubic(focus);
                const y = (0.5 - progress) * 24;
                const mediaY = (0.5 - progress) * -52;

                section.style.setProperty('--section-progress', progress.toFixed(4));
                section.style.setProperty('--section-y', `${y.toFixed(2)}px`);
                section.style.setProperty('--section-scale', (0.992 + easedFocus * 0.008).toFixed(4));
                section.style.setProperty('--section-opacity', (0.94 + easedFocus * 0.06).toFixed(3));
                section.style.setProperty('--media-y', `${mediaY.toFixed(2)}px`);

                if (section.classList.contains('hero')) {
                    section.style.setProperty('--hero-bg-y', `${(progress * -44).toFixed(2)}px`);
                }
            });

            if (especialidadesSection && especialidadImages.length > 0) {
                const rect = especialidadesSection.getBoundingClientRect();
                const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
                especialidadImages.forEach((image, index) => {
                    const direction = index % 2 === 0 ? 1 : -1;
                    image.style.setProperty('--dish-y', `${((0.5 - progress) * 18 * direction).toFixed(2)}px`);
                    image.style.setProperty('--dish-scale', (0.985 + easeOutCubic(progress) * 0.015).toFixed(4));
                });
            }

            scrollRafPending = false;
        };

        const requestAppleScroll = () => {
            if (!scrollRafPending) {
                scrollRafPending = true;
                requestAnimationFrame(applyAppleScroll);
            }
        };

        window.addEventListener('scroll', requestAppleScroll, { passive: true });
        window.addEventListener('resize', requestAppleScroll);
        applyAppleScroll();
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 16;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active',
                        link.getAttribute('href') === '#' + id
                    );
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // --- Carta language switcher ---
    const cartaLogo = '<img src="logo-transparent.png" alt="Cotolay" class="title-logo">';
    const i18n = {
        es: {
            cartaLabel: 'Nuestra Carta', cartaTitle: `El menú de ${cartaLogo}`,
            tabRaciones: 'Raciones y Sopas', tabArroces: 'Arroces', tabEnsaladas: 'Ensaladas',
            tabPescados: 'Pescados', tabCarnes: 'Carnes', tabPostres: 'Postres',
            tabVinos: 'Carta de Vinos', tabMenu: 'Menú del Día',
            r1: 'Jamón ibérico (100gr.)', r2: 'Chorizo ibérico', r3: 'Tabla de quesos',
            r4: 'Chipirones fritos', r5: 'Chipirones a la plancha', r6: 'Pulpo á feira',
            r7: 'Gambas al ajillo', r8: 'Langostinos a la plancha', r9: 'Mejillones al vapor',
            r10: 'Almejas a la marinera', r11: 'Navajas a la plancha', r12: 'Zamburiñas a la plancha',
            r13: 'Vieira al horno (unidad)', r14: 'Pimientos de Padrón (en temporada)',
            r15: 'Croquetas caseras', r16: 'Croquetas caseras de calamares en su tinta',
            r17: 'Raxo al ajillo', r18: 'Patatas bravas', r19: 'Pan (ración)', r20: 'Caldo gallego',
            a1: 'Arroz con bogavante', a2: 'Arroz con langostinos y zamburiñas', a3: 'Arroz con mariscos',
            a4: 'Arroz negro con almejas y chipirones', a5: 'Arroz con vegetales',
            a1note: 'Plato para dos personas', a2note: 'Plato para dos personas',
            a3note: 'Plato para dos personas', a4note: 'Plato para dos personas',
            e1: 'Ensalada tomate, lechuga y cebolla', e2: 'Ensalada "Cotolay"',
            p1: 'Bacalao a la gallega', p2: 'Bacalao a la plancha', p3: 'Pescado del día',
            priceConsultar: 'Consultar',
            c1: 'Chuletón (según peso)', c2: 'Entrecot de vaca', c3: 'Croca de vaca',
            c4: 'Pechuga de pollo a la plancha', c5: 'Cordero asado', c6: 'Chuletillas de cordero',
            c7: 'Chuleta de cerdo', c8: 'Codillo asado', carnesNote: 'Guarnición: patatas fritas o verduras',
            d1: 'Tarta de chocolate', d3: 'Flan casero', d4: 'Tarta de Santiago',
            d5: 'Tarta de queso', d6: 'Arroz con leche', d7: 'Fruta fresca', d8: 'Yogur',
            vAlbCasa: 'Albariño de la casa', vRibCasa: 'Ribeiro de la casa',
            sangriaCat: 'Sangría', vSangria: 'Elaboración de la casa (1 litro)',
            vinosNote: 'Todos los vinos contienen sulfitos',
            menuTitle: 'Menú del Día', menuPrimer: 'Primer Plato', menuSegundo: 'Segundo Plato',
            menu1: 'Caldo gallego', menu2: 'Ensalada mixta', menu3: 'Croquetas caseras',
            menu4: 'Chuleta de cerdo a la plancha', menu5: 'Filete de pollo a la plancha',
            menu6: 'Pescado del día',
            menuIncludes: 'Incluye: bebida (1 copa de vino de la casa o agua), postre y pan',
            menuSchedule: 'De lunes a viernes, 13:00 a 15:00 (excepto festivos)',
            cartaFooter1: 'Carta sujeta a disponibilidad y temporada. Precios con IVA incluido.',
            tabGrupos: 'Menús para Grupos', grupo1Title: 'Menú Grupo', grupo2Title: 'Menú Grupo', grupo3Title: 'Menú Grupo',
            grupoEntrantes: 'Entrantes', grupoSegundos: 'Segundos Platos a Elegir',
            g1e1: 'Empanada casera', g1e2: 'Croquetas', g1e3: 'Langostinos',
            g1s1: 'Lubina a la plancha', g1s2: 'Codillo asado',
            g1bebidas: 'Bebidas: Rioja crianza, ribeiro y agua', g1postre: 'Postre y café',
            g2e1: 'Empanada casera', g2e2: '1 Vieira por persona', g2e3: 'Langostinos a la plancha',
            g2s1: 'Corvina a la plancha', g2s2: 'Croca de vaca a la plancha',
            g2bebidas: 'Bebidas: Rioja crianza, ribeiro y agua', g2postre: 'Postre y café',
            g3e1: 'Tabla de quesos gallegos y embutidos ibéricos', g3e2: 'Zamburiñas a la plancha', g3e3: 'Almejas a la marinera',
            g3s1: 'Bacalao a la plancha con patatas panadera', g3s2: 'Entrecot a la pimienta',
            g3bebidas: 'Bebidas: Albariño, Mencía y agua', g3postre: 'Postre, café y licores'
        },
        gl: {
            cartaLabel: 'A Nosa Carta', cartaTitle: `O menú de ${cartaLogo}`,
            tabRaciones: 'Racións e Sopas', tabArroces: 'Arroces', tabEnsaladas: 'Ensaladas',
            tabPescados: 'Peixes', tabCarnes: 'Carnes', tabPostres: 'Sobremesas',
            tabVinos: 'Carta de Viños', tabMenu: 'Menú do Día',
            r1: 'Xamón ibérico (100gr.)', r2: 'Chourizo ibérico', r3: 'Táboa de queixos',
            r4: 'Chipironcitos fritos', r5: 'Chipironcitos á prancha', r6: 'Polbo á feira',
            r7: 'Gambas ao alliño', r8: 'Lagostinos á prancha', r9: 'Mexillóns ao vapor',
            r10: 'Ameixas á mariñeira', r11: 'Navallas á prancha', r12: 'Zamburiñas á prancha',
            r13: 'Vieira ao forno (unidade)', r14: 'Pementos de Padrón (en tempada)',
            r15: 'Croquetas caseiras', r16: 'Croquetas caseiras de calamares na súa tinta',
            r17: 'Raxo ao alliño', r18: 'Patacas bravas', r19: 'Pan (ración)', r20: 'Caldo galego',
            a1: 'Arroz con lumbrigante', a2: 'Arroz con lagostinos e zamburiñas', a3: 'Arroz con mariscos',
            a4: 'Arroz negro con ameixas e chipironcitos', a5: 'Arroz con vexetais',
            a1note: 'Prato para dúas persoas', a2note: 'Prato para dúas persoas',
            a3note: 'Prato para dúas persoas', a4note: 'Prato para dúas persoas',
            e1: 'Ensalada tomate, leituga e cebola', e2: 'Ensalada "Cotolay"',
            p1: 'Bacallau á galega', p2: 'Bacallau á prancha', p3: 'Peixe do día',
            priceConsultar: 'Consultar',
            c1: 'Chuletón (segundo peso)', c2: 'Entrecot de vaca', c3: 'Croca de vaca',
            c4: 'Peito de polo á prancha', c5: 'Año asado', c6: 'Chuletiñas de año',
            c7: 'Costela de porco', c8: 'Codelo asado', carnesNote: 'Guarnición: patacas fritas ou verduras',
            d1: 'Torta de chocolate', d3: 'Flan caseiro', d4: 'Torta de Santiago',
            d5: 'Torta de queixo', d6: 'Arroz con leite', d7: 'Froita fresca', d8: 'Iogur',
            vAlbCasa: 'Albariño da casa', vRibCasa: 'Ribeiro da casa',
            sangriaCat: 'Sangría', vSangria: 'Elaboración da casa (1 litro)',
            vinosNote: 'Todos os viños conteñen sulfitos',
            menuTitle: 'Menú do Día', menuPrimer: 'Primeiro Prato', menuSegundo: 'Segundo Prato',
            menu1: 'Caldo galego', menu2: 'Ensalada mixta', menu3: 'Croquetas caseiras',
            menu4: 'Costela de porco á grella', menu5: 'Filete de polo á grella',
            menu6: 'Peixe do día',
            menuIncludes: 'Inclúe: bebida (1 copa de viño da casa ou auga), sobremesa e pan',
            menuSchedule: 'De luns a venres, 13:00 a 15:00 (excepto festivos)',
            cartaFooter1: 'Carta suxeita a dispoñibilidade e tempada. Prezos con IVE incluído.',
            tabGrupos: 'Menús para Grupos', grupo1Title: 'Menú Grupo', grupo2Title: 'Menú Grupo', grupo3Title: 'Menú Grupo',
            grupoEntrantes: 'Entrantes', grupoSegundos: 'Segundos Pratos a Elixir',
            g1e1: 'Empanada caseira', g1e2: 'Croquetas', g1e3: 'Lagostinos',
            g1s1: 'Robalo á prancha', g1s2: 'Codelo asado',
            g1bebidas: 'Bebidas: Rioja crianza, ribeiro e auga', g1postre: 'Sobremesa e café',
            g2e1: 'Empanada caseira', g2e2: '1 Vieira por persoa', g2e3: 'Lagostinos á prancha',
            g2s1: 'Corvina á prancha', g2s2: 'Croca de vaca á prancha',
            g2bebidas: 'Bebidas: Rioja crianza, ribeiro e auga', g2postre: 'Sobremesa e café',
            g3e1: 'Táboa de queixos galegos e embutidos ibéricos', g3e2: 'Zamburiñas á prancha', g3e3: 'Ameixas á mariñeira',
            g3s1: 'Bacallau á prancha con patacas panadeiras', g3s2: 'Entrecot á pementa',
            g3bebidas: 'Bebidas: Albariño, Mencía e auga', g3postre: 'Sobremesa, café e licores'
        },
        en: {
            cartaLabel: 'Our Menu', cartaTitle: `The ${cartaLogo} menu`,
            tabRaciones: 'Portions & Soups', tabArroces: 'Rice Dishes', tabEnsaladas: 'Salads',
            tabPescados: 'Fish', tabCarnes: 'Meats', tabPostres: 'Desserts',
            tabVinos: 'Wine List', tabMenu: 'Daily Menu',
            r1: 'Iberian ham (100g)', r2: 'Iberian chorizo', r3: 'Cheese board',
            r4: 'Fried baby squid', r5: 'Grilled baby squid', r6: 'Galician-style octopus',
            r7: 'Garlic prawns', r8: 'Grilled king prawns', r9: 'Steamed mussels',
            r10: 'Clams in white wine sauce', r11: 'Grilled razor clams', r12: 'Grilled scallops',
            r13: 'Baked scallop (each)', r14: 'Padrón peppers (seasonal)',
            r15: 'Homemade croquettes', r16: 'Homemade squid ink croquettes',
            r17: 'Garlic pork loin', r18: 'Patatas bravas', r19: 'Bread (portion)', r20: 'Galician broth',
            a1: 'Rice with lobster', a2: 'Rice with king prawns and scallops', a3: 'Seafood rice',
            a4: 'Black rice with clams and baby squid', a5: 'Vegetable rice',
            a1note: 'Dish for two', a2note: 'Dish for two',
            a3note: 'Dish for two', a4note: 'Dish for two',
            e1: 'Tomato, lettuce and onion salad', e2: '"Cotolay" salad',
            p1: 'Galician-style cod', p2: 'Grilled cod', p3: 'Catch of the day',
            priceConsultar: 'Ask',
            c1: 'T-bone steak (by weight)', c2: 'Beef entrecôte', c3: 'Beef rump steak',
            c4: 'Grilled chicken breast', c5: 'Roast lamb', c6: 'Lamb chops',
            c7: 'Pork chop', c8: 'Roasted pork knuckle', carnesNote: 'Side: chips or vegetables',
            d1: 'Chocolate cake', d3: 'Homemade flan', d4: 'Santiago almond cake',
            d5: 'Cheesecake', d6: 'Rice pudding', d7: 'Fresh fruit', d8: 'Yoghurt',
            vAlbCasa: 'House Albariño', vRibCasa: 'House Ribeiro',
            sangriaCat: 'Sangria', vSangria: 'House sangria (1 litre)',
            vinosNote: 'All wines contain sulphites',
            menuTitle: 'Daily Menu', menuPrimer: 'First Course', menuSegundo: 'Second Course',
            menu1: 'Galician broth', menu2: 'Mixed salad', menu3: 'Homemade croquettes',
            menu4: 'Grilled pork chop', menu5: 'Grilled chicken fillet',
            menu6: 'Catch of the day',
            menuIncludes: 'Includes: drink (1 glass of house wine or water), dessert and bread',
            menuSchedule: 'Monday to Friday, 1:00 PM to 3:00 PM (except holidays)',
            cartaFooter1: 'Menu subject to availability and season. Prices include VAT.',
            tabGrupos: 'Group Menus', grupo1Title: 'Group Menu', grupo2Title: 'Group Menu', grupo3Title: 'Group Menu',
            grupoEntrantes: 'Starters', grupoSegundos: 'Main Courses (choose one)',
            g1e1: 'Homemade pie', g1e2: 'Croquettes', g1e3: 'King prawns',
            g1s1: 'Grilled sea bass', g1s2: 'Roasted pork knuckle',
            g1bebidas: 'Drinks: Rioja crianza, ribeiro and water', g1postre: 'Dessert and coffee',
            g2e1: 'Homemade pie', g2e2: '1 Scallop per person', g2e3: 'Grilled king prawns',
            g2s1: 'Grilled meagre fish', g2s2: 'Grilled beef rump steak',
            g2bebidas: 'Drinks: Rioja crianza, ribeiro and water', g2postre: 'Dessert and coffee',
            g3e1: 'Galician cheese board and Iberian cold cuts', g3e2: 'Grilled scallops', g3e3: 'Clams in white wine sauce',
            g3s1: 'Grilled cod with baked potatoes', g3s2: 'Pepper entrecôte',
            g3bebidas: 'Drinks: Albariño, Mencía and water', g3postre: 'Dessert, coffee and liqueurs'
        },
        pt: {
            cartaLabel: 'A Nossa Carta', cartaTitle: `O menu do ${cartaLogo}`,
            tabRaciones: 'Porções e Sopas', tabArroces: 'Arrozes', tabEnsaladas: 'Saladas',
            tabPescados: 'Peixes', tabCarnes: 'Carnes', tabPostres: 'Sobremesas',
            tabVinos: 'Carta de Vinhos', tabMenu: 'Menu do Dia',
            r1: 'Presunto ibérico (100g)', r2: 'Chouriço ibérico', r3: 'Tábua de queijos',
            r4: 'Lulas fritas', r5: 'Lulas grelhadas', r6: 'Polvo à galega',
            r7: 'Gambas ao alho', r8: 'Lagostins grelhados', r9: 'Mexilhões ao vapor',
            r10: 'Amêijoas à marinheira', r11: 'Lingueirões grelhados', r12: 'Zamburiñas grelhadas',
            r13: 'Vieira ao forno (unidade)', r14: 'Pimentos de Padrón (época)',
            r15: 'Croquetes caseiros', r16: 'Croquetes caseiros de lulas em sua tinta',
            r17: 'Lombo de porco ao alho', r18: 'Batatas bravas', r19: 'Pão (porção)', r20: 'Caldo galego',
            a1: 'Arroz com lavagante', a2: 'Arroz com lagostins e zamburiñas', a3: 'Arroz com mariscos',
            a4: 'Arroz negro com amêijoas e lulas', a5: 'Arroz com legumes',
            a1note: 'Prato para duas pessoas', a2note: 'Prato para duas pessoas',
            a3note: 'Prato para duas pessoas', a4note: 'Prato para duas pessoas',
            e1: 'Salada de tomate, alface e cebola', e2: 'Salada "Cotolay"',
            p1: 'Bacalhau à galega', p2: 'Bacalhau grelhado', p3: 'Peixe do dia',
            priceConsultar: 'Consultar',
            c1: 'Costeleta (conforme peso)', c2: 'Entrecosto de vaca', c3: 'Alcatra de vaca',
            c4: 'Peito de frango grelhado', c5: 'Borrego assado', c6: 'Costeletas de borrego',
            c7: 'Costeleta de porco', c8: 'Joelho de porco assado', carnesNote: 'Guarnição: batatas fritas ou legumes',
            d1: 'Bolo de chocolate', d3: 'Pudim caseiro', d4: 'Bolo de Santiago',
            d5: 'Bolo de queijo', d6: 'Arroz doce', d7: 'Fruta fresca', d8: 'Iogurte',
            vAlbCasa: 'Albariño da casa', vRibCasa: 'Ribeiro da casa',
            sangriaCat: 'Sangria', vSangria: 'Sangria da casa (1 litro)',
            vinosNote: 'Todos os vinhos contêm sulfitos',
            menuTitle: 'Menu do Dia', menuPrimer: 'Primeiro Prato', menuSegundo: 'Segundo Prato',
            menu1: 'Caldo galego', menu2: 'Salada mista', menu3: 'Croquetes caseiros',
            menu4: 'Costeleta de porco grelhada', menu5: 'Filete de frango grelhado',
            menu6: 'Peixe do dia',
            menuIncludes: 'Inclui: bebida (1 copo de vinho da casa ou água), sobremesa e pão',
            menuSchedule: 'De segunda a sexta, 13:00 às 15:00 (exceto feriados)',
            cartaFooter1: 'Carta sujeita a disponibilidade e época. Preços com IVA incluído.',
            tabGrupos: 'Menus para Grupos', grupo1Title: 'Menu Grupo', grupo2Title: 'Menu Grupo', grupo3Title: 'Menu Grupo',
            grupoEntrantes: 'Entradas', grupoSegundos: 'Segundos Pratos à Escolha',
            g1e1: 'Empada caseira', g1e2: 'Croquetes', g1e3: 'Lagostins',
            g1s1: 'Robalo grelhado', g1s2: 'Joelho de porco assado',
            g1bebidas: 'Bebidas: Rioja crianza, ribeiro e água', g1postre: 'Sobremesa e café',
            g2e1: 'Empada caseira', g2e2: '1 Vieira por pessoa', g2e3: 'Lagostins grelhados',
            g2s1: 'Corvina grelhada', g2s2: 'Alcatra de vaca grelhada',
            g2bebidas: 'Bebidas: Rioja crianza, ribeiro e água', g2postre: 'Sobremesa e café',
            g3e1: 'Tábua de queijos galegos e enchidos ibéricos', g3e2: 'Zamburiñas grelhadas', g3e3: 'Amêijoas à marinheira',
            g3s1: 'Bacalhau grelhado com batatas ao forno', g3s2: 'Entrecosto à pimenta',
            g3bebidas: 'Bebidas: Albariño, Mencía e água', g3postre: 'Sobremesa, café e licores'
        },
        fr: {
            cartaLabel: 'Notre Carte', cartaTitle: `Le menu du ${cartaLogo}`,
            tabRaciones: 'Portions et Soupes', tabArroces: 'Riz', tabEnsaladas: 'Salades',
            tabPescados: 'Poissons', tabCarnes: 'Viandes', tabPostres: 'Desserts',
            tabVinos: 'Carte des Vins', tabMenu: 'Menu du Jour',
            r1: 'Jambon ibérique (100g)', r2: 'Chorizo ibérique', r3: 'Plateau de fromages',
            r4: 'Petits calamars frits', r5: 'Petits calamars grillés', r6: 'Poulpe à la galicienne',
            r7: 'Crevettes à l\'ail', r8: 'Langoustines grillées', r9: 'Moules à la vapeur',
            r10: 'Palourdes à la marinière', r11: 'Couteaux grillés', r12: 'Pétoncles grillés',
            r13: 'Coquille Saint-Jacques au four (unité)', r14: 'Piments de Padrón (saison)',
            r15: 'Croquettes maison', r16: 'Croquettes maison de calamars à l\'encre',
            r17: 'Longe de porc à l\'ail', r18: 'Patatas bravas', r19: 'Pain (portion)', r20: 'Bouillon galicien',
            a1: 'Riz au homard', a2: 'Riz aux langoustines et pétoncles', a3: 'Riz aux fruits de mer',
            a4: 'Riz noir aux palourdes et calamars', a5: 'Riz aux légumes',
            a1note: 'Plat pour deux personnes', a2note: 'Plat pour deux personnes',
            a3note: 'Plat pour deux personnes', a4note: 'Plat pour deux personnes',
            e1: 'Salade tomate, laitue et oignon', e2: 'Salade "Cotolay"',
            p1: 'Morue à la galicienne', p2: 'Morue grillée', p3: 'Poisson du jour',
            priceConsultar: 'Demander',
            c1: 'Côte de bœuf (selon poids)', c2: 'Entrecôte de bœuf', c3: 'Rumsteck de bœuf',
            c4: 'Blanc de poulet grillé', c5: 'Agneau rôti', c6: 'Côtelettes d\'agneau',
            c7: 'Côte de porc', c8: 'Jarret de porc rôti', carnesNote: 'Garniture : frites ou légumes',
            d1: 'Gâteau au chocolat', d3: 'Flan maison', d4: 'Gâteau de Santiago',
            d5: 'Gâteau au fromage', d6: 'Riz au lait', d7: 'Fruits frais', d8: 'Yaourt',
            vAlbCasa: 'Albariño maison', vRibCasa: 'Ribeiro maison',
            sangriaCat: 'Sangria', vSangria: 'Sangria maison (1 litre)',
            vinosNote: 'Tous les vins contiennent des sulfites',
            menuTitle: 'Menu du Jour', menuPrimer: 'Premier Plat', menuSegundo: 'Deuxième Plat',
            menu1: 'Bouillon galicien', menu2: 'Salade mixte', menu3: 'Croquettes maison',
            menu4: 'Côte de porc grillée', menu5: 'Filet de poulet grillé',
            menu6: 'Poisson du jour',
            menuIncludes: 'Comprend : boisson (1 verre de vin maison ou eau), dessert et pain',
            menuSchedule: 'Du lundi au vendredi, 13h00 à 15h00 (sauf jours fériés)',
            cartaFooter1: 'Carte soumise à disponibilité et saison. Prix TTC.',
            tabGrupos: 'Menus de Groupe', grupo1Title: 'Menu Groupe', grupo2Title: 'Menu Groupe', grupo3Title: 'Menu Groupe',
            grupoEntrantes: 'Entrées', grupoSegundos: 'Plats Principaux au Choix',
            g1e1: 'Tourte maison', g1e2: 'Croquettes', g1e3: 'Langoustines',
            g1s1: 'Bar grillé', g1s2: 'Jarret de porc rôti',
            g1bebidas: 'Boissons : Rioja crianza, ribeiro et eau', g1postre: 'Dessert et café',
            g2e1: 'Tourte maison', g2e2: '1 Coquille Saint-Jacques par personne', g2e3: 'Langoustines grillées',
            g2s1: 'Maigre grillé', g2s2: 'Rumsteck de bœuf grillé',
            g2bebidas: 'Boissons : Rioja crianza, ribeiro et eau', g2postre: 'Dessert et café',
            g3e1: 'Plateau de fromages galiciens et charcuterie ibérique', g3e2: 'Pétoncles grillés', g3e3: 'Palourdes à la marinière',
            g3s1: 'Morue grillée avec pommes boulangères', g3s2: 'Entrecôte au poivre',
            g3bebidas: 'Boissons : Albariño, Mencía et eau', g3postre: 'Dessert, café et liqueurs'
        },
        de: {
            cartaLabel: 'Unsere Speisekarte', cartaTitle: `Das Menü von ${cartaLogo}`,
            tabRaciones: 'Portionen und Suppen', tabArroces: 'Reisgerichte', tabEnsaladas: 'Salate',
            tabPescados: 'Fisch', tabCarnes: 'Fleisch', tabPostres: 'Nachspeisen',
            tabVinos: 'Weinkarte', tabMenu: 'Tagesmenü',
            r1: 'Iberischer Schinken (100g)', r2: 'Iberische Chorizo', r3: 'Käseplatte',
            r4: 'Frittierte Babytintenfische', r5: 'Gegrillte Babytintenfische', r6: 'Galizischer Oktopus',
            r7: 'Knoblauchgarnelen', r8: 'Gegrillte Riesengarnelen', r9: 'Gedämpfte Miesmuscheln',
            r10: 'Venusmuscheln in Weißweinsoße', r11: 'Gegrillte Schwertmuscheln', r12: 'Gegrillte Jakobsmuscheln',
            r13: 'Überbackene Jakobsmuschel (Stück)', r14: 'Padrón-Paprika (saisonal)',
            r15: 'Hausgemachte Kroketten', r16: 'Hausgemachte Tintenfisch-Kroketten',
            r17: 'Schweinelende mit Knoblauch', r18: 'Patatas bravas', r19: 'Brot (Portion)', r20: 'Galizische Brühe',
            a1: 'Reis mit Hummer', a2: 'Reis mit Riesengarnelen und Jakobsmuscheln', a3: 'Meeresfrüchtereis',
            a4: 'Schwarzer Reis mit Muscheln und Tintenfisch', a5: 'Gemüsereis',
            a1note: 'Gericht für zwei Personen', a2note: 'Gericht für zwei Personen',
            a3note: 'Gericht für zwei Personen', a4note: 'Gericht für zwei Personen',
            e1: 'Salat mit Tomate, Kopfsalat und Zwiebel', e2: '"Cotolay"-Salat',
            p1: 'Kabeljau auf galizische Art', p2: 'Gegrillter Kabeljau', p3: 'Tagesfisch',
            priceConsultar: 'Auf Anfrage',
            c1: 'T-Bone-Steak (nach Gewicht)', c2: 'Rinderentrecôte', c3: 'Rinderhüftsteak',
            c4: 'Gegrillte Hähnchenbrust', c5: 'Lammbraten', c6: 'Lammkoteletts',
            c7: 'Schweinekotelett', c8: 'Gebratene Schweinshaxe', carnesNote: 'Beilage: Pommes frites oder Gemüse',
            d1: 'Schokoladenkuchen', d3: 'Hausgemachter Flan', d4: 'Santiago-Mandeltorte',
            d5: 'Käsekuchen', d6: 'Milchreis', d7: 'Frisches Obst', d8: 'Joghurt',
            vAlbCasa: 'Haus-Albariño', vRibCasa: 'Haus-Ribeiro',
            sangriaCat: 'Sangria', vSangria: 'Haussangria (1 Liter)',
            vinosNote: 'Alle Weine enthalten Sulfite',
            menuTitle: 'Tagesmenü', menuPrimer: 'Erster Gang', menuSegundo: 'Zweiter Gang',
            menu1: 'Galizische Brühe', menu2: 'Gemischter Salat', menu3: 'Hausgemachte Kroketten',
            menu4: 'Gegrilltes Schweinekotelett', menu5: 'Gegrilltes Hähnchenfilet',
            menu6: 'Tagesfisch',
            menuIncludes: 'Inklusive: Getränk (1 Glas Hauswein oder Wasser), Nachspeise und Brot',
            menuSchedule: 'Montag bis Freitag, 13:00 bis 15:00 Uhr (außer Feiertage)',
            cartaFooter1: 'Speisekarte abhängig von Verfügbarkeit und Saison. Preise inkl. MwSt.',
            tabGrupos: 'Gruppenmenüs', grupo1Title: 'Gruppenmenü', grupo2Title: 'Gruppenmenü', grupo3Title: 'Gruppenmenü',
            grupoEntrantes: 'Vorspeisen', grupoSegundos: 'Hauptgerichte zur Auswahl',
            g1e1: 'Hausgemachte Pastete', g1e2: 'Kroketten', g1e3: 'Riesengarnelen',
            g1s1: 'Gegrillter Wolfsbarsch', g1s2: 'Gebratene Schweinshaxe',
            g1bebidas: 'Getränke: Rioja Crianza, Ribeiro und Wasser', g1postre: 'Nachspeise und Kaffee',
            g2e1: 'Hausgemachte Pastete', g2e2: '1 Jakobsmuschel pro Person', g2e3: 'Gegrillte Riesengarnelen',
            g2s1: 'Gegrillter Adlerfisch', g2s2: 'Gegrilltes Rinderhüftsteak',
            g2bebidas: 'Getränke: Rioja Crianza, Ribeiro und Wasser', g2postre: 'Nachspeise und Kaffee',
            g3e1: 'Galizische Käseplatte und iberische Wurstwaren', g3e2: 'Gegrillte Jakobsmuscheln', g3e3: 'Venusmuscheln in Weißweinsoße',
            g3s1: 'Gegrillter Kabeljau mit Kartoffeln', g3s2: 'Pfefferentrecôte',
            g3bebidas: 'Getränke: Albariño, Mencía und Wasser', g3postre: 'Nachspeise, Kaffee und Liköre'
        }
    };

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const texts = i18n[lang];
            if (!texts) return;
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (texts[key]) el.innerHTML = texts[key];
            });
        });
    });

}); // cierre DOMContentLoaded
