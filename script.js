// 1. BANCO DE DADOS DOS PROJETOS
// Adicione a capa (cover) e as infos de cada projeto aqui
const projectsData = {
    projeto1: {
        title: "Stream Overlay Pack & Branding Completo",
        // AQUI você define qual vídeo/imagem será o PREVIEW do card
        cover: { type: "video", src: "images/projeto1/Start.mp4" },
        description: "Desenvolvimento de identidade visual completa e pacote de assets para canal de transmissão ao vivo (streaming). O projeto foi construído em torno do conceito de personalização de marca, onde a temática e os elementos visuais foram desenhados especificamente para dialogar com o nickname da streamer.",
        colors: ["#c1ff72", "#7ed957", "#00bf63", "#0499af"],
        // AQUI você lista todos os itens da galeria do modal
        gallery: [
            { type: "video", src: "images/projeto1/Start.mp4" },
            { type: "video", src: "images/projeto1/Transição.mp4" },
            { type: "video", src: "images/projeto1/Volto já.mp4" },
            { type: "image", src: "images/projeto1/Offline.gif" },
            { type: "image", src: "images/projeto1/Paineis.png" }
        ]
    },
    projeto2: {
        title: "Identidade Visual e Papelaria Corporativa",
        cover: { type: "image", src: "images/projeto2/3.png" },
        description: "Desenvolvimento de identidade visual completa e aplicação em papelaria corporativa para o escritório de advocacia Pâmela C. Lana & João Luiz Lani Advogados Associados. O objetivo principal do projeto foi transmitir seriedade, elegância, equilíbrio e segurança jurídica através de uma estética moderna e sóbria.",
        colors: ["#202a33", "#000000", "#D9d9d9", "#a6a6a6", "#737373"],
        gallery: [
            { type: "image", src: "images/projeto2/1.png" },
            { type: "image", src: "images/projeto2/2.png" },
            { type: "image", src: "images/projeto2/3.png" },
            { type: "image", src: "images/projeto2/4.png" },
            { type: "image", src: "images/projeto2/Cartão de Visita.png" }
        ]
    },
    projeto3: {
        title: "Identidade Visual & Kit de Redes Sociais",
        cover: { type: "image", src: "images/projeto3/Logo.png" },
        description: "Desenvolvimento da identidade visual e do kit de peças digitais para as redes sociais da marca Mãe & Filhos, focada na venda de hot-dogs artesanais. O objetivo principal foi criar um visual apetitoso, acolhedor e altamente funcional para a divulgação no Instagram e atração de clientes via delivery (iFood).",
        colors: ["#ffd795", "#000000", "#dd3b2f", "#f2eeec", "#583520"],
        gallery: [
            { type: "image", src: "images/projeto3/Logo.png" },
            { type: "image", src: "images/projeto3/Cardapio.png" },
            { type: "image", src: "images/projeto3/Divulgacao.png" },
            { type: "image", src: "images/projeto3/Horario.png" },
            { type: "image", src: "images/projeto3/Banner.png" }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.getElementById('projects-grid');
    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');

    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalColorsContainer = document.getElementById('modal-colors');
    const modalGalleryContainer = document.getElementById('modal-gallery');

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Estado da galeria do modal (escopado ao módulo)
    let currentGalleryIndex = 0;
    let currentGalleryItems = [];

    // 1.1 Lógica do CARROSSEL (setas de avançar/recuar)
    // Calcula a largura de 1 card + o gap para rolar exatamente 1 item por clique
    function getCarouselStep() {
        const firstCard = projectsGrid ? projectsGrid.querySelector('.project-card') : null;
        if (!firstCard) return 320; // Fallback seguro caso o card ainda não exista

        const cardWidth = firstCard.getBoundingClientRect().width;
        const gridStyle = window.getComputedStyle(projectsGrid);
        const gap = parseFloat(gridStyle.gap) || 20;
        return Math.round(cardWidth + gap);
    }

    // Máximo de rolagem possível (fim do carrossel)
    function getMaxScroll() {
        return projectsGrid.scrollWidth - projectsGrid.clientWidth;
    }

    if (prevBtn && nextBtn && projectsGrid) {
        nextBtn.addEventListener('click', () => {
            // LOOP: se já está no último card, volta suavemente ao primeiro
            if (projectsGrid.scrollLeft >= getMaxScroll() - 1) {
                projectsGrid.scrollTo({ left: 0, behavior: 'smooth' });
                return;
            }
            // Avança 1 card + gap para a direita (limitado ao fim)
            projectsGrid.scrollTo({
                left: Math.min(projectsGrid.scrollLeft + getCarouselStep(), getMaxScroll()),
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            // LOOP: se está no primeiro card, vai para o último
            if (projectsGrid.scrollLeft <= 1) {
                projectsGrid.scrollTo({ left: getMaxScroll(), behavior: 'smooth' });
                return;
            }
            // Recua 1 card + gap para a esquerda (limitado ao início)
            projectsGrid.scrollTo({
                left: Math.max(projectsGrid.scrollLeft - getCarouselStep(), 0),
                behavior: 'smooth'
            });
        });
    }

    // 1. Renderizar os cards dinamicamente
    function renderProjectCards() {
        if (!projectsGrid) return;

        // Monta toda a lista numa única string e injeta de uma vez (menos manipulação de DOM)
        const cardsHTML = Object.keys(projectsData).map((id, index) => {
            const project = projectsData[id];

            // O primeiro card carrega imediatamente (evita atraso na 1ª impressão);
            // os demais usam lazy loading para não pesar o carregamento inicial.
            const lazyAttr = index === 0 ? '' : ' loading="lazy"';

            const mediaHTML = project.cover.type === 'video'
                ? `<video autoplay loop muted playsinline class="card-media"><source src="${project.cover.src}" type="video/mp4"></video>`
                : `<img src="${project.cover.src}" alt="${project.cover.alt || project.title}" class="card-media"${lazyAttr}>`;

            return `
                <div class="project-card folder-style" data-project-id="${id}">
                    <div class="card-cover">
                        ${mediaHTML}
                        <div class="card-title-overlay">
                            <h3>${project.title}</h3>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        projectsGrid.innerHTML = cardsHTML;
    }

    // Delegação de eventos: 1 listener cobre todos os cards (clique em qualquer parte do card)
    if (projectsGrid) {
        projectsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (card) openProjectModal(card.dataset.projectId);
        });
    }

    // 2. Abrir Modal com Galeria em Slider (1 por vez)
    function openProjectModal(projectId) {
        const data = projectsData[projectId];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalDesc.textContent = data.description;

        // Renderizar Cores
        modalColorsContainer.innerHTML = '';
        data.colors.forEach(hex => {
            const swatch = document.createElement('span');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = hex;
            modalColorsContainer.appendChild(swatch);
        });

        // Configurar Galeria Slider
        currentGalleryItems = data.gallery;
        currentGalleryIndex = 0;
        renderModalGallery();

        modal.classList.add('modal-active');
    }

    // Renderizar item atual da galeria
    function renderModalGallery() {
        // 1. Limpa o container da galeria
        modalGalleryContainer.innerHTML = '';

        if (!currentGalleryItems || currentGalleryItems.length === 0) return;

        const item = currentGalleryItems[currentGalleryIndex];

        // 2. Cria a estrutura da Imagem/Mídia
        const wrapper = document.createElement('div');
        wrapper.className = 'modal-slider-wrapper';

        let mediaElement = item.type === 'image'
            ? `<img src="${item.src}" alt="${item.alt || ''}" class="modal-slide-media" loading="lazy">`
            : `<video src="${item.src}" autoplay loop muted playsinline class="modal-slide-media"></video>`;

        wrapper.innerHTML = `<div class="modal-image-holder">${mediaElement}</div>`;

        // Injeta a imagem/mídia
        modalGalleryContainer.appendChild(wrapper);

        // 3. Se houver mais de 1 item, cria os botões no próprio 'modalGalleryContainer'
        if (currentGalleryItems.length > 1) {
            const prevBtnHTML = `<button class="modal-slide-btn slide-prev" id="slidePrev" aria-label="Anterior">&#10094;</button>`;
            const nextBtnHTML = `<button class="modal-slide-btn slide-next" id="slideNext" aria-label="Próximo">&#10095;</button>`;
            const counterHTML = `<div class="modal-slide-counter">${currentGalleryIndex + 1} / ${currentGalleryItems.length}</div>`;

            // Adiciona os controles no container principal da galeria
            modalGalleryContainer.insertAdjacentHTML('beforeend', prevBtnHTML + nextBtnHTML + counterHTML);

            // Associa os cliques
            const btnPrev = document.getElementById('slidePrev');
            const btnNext = document.getElementById('slideNext');

            if (btnPrev) {
                btnPrev.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
                    renderModalGallery();
                });
            }

            if (btnNext) {
                btnNext.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryItems.length;
                    renderModalGallery();
                });
            }
        }
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => modal.classList.remove('modal-active'));
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('modal-active');
    });

    renderProjectCards();

    // Funcionalidade do Menu Hambúrguer (Mobile)
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});