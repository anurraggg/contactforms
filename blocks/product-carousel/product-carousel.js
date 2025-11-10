export default function decorate(block) {
    console.log('✅ Product Carousel JS loaded!');
  
    block.classList.add('product-carousel');
  
    // Find the table (even if wrapped inside a div)
    const table = block.querySelector('table, div > table');
    if (!table) {
      console.warn('⚠️ No table found inside product-carousel block');
      return;
    }
  
    const rows = table.querySelectorAll('tr');
    const slides = [];
  
    // Parse rows and skip header
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 3) {
        const firstCell = cells[0].innerText.trim().toLowerCase();
        if (firstCell === 'product carousel' || index === 0) return; // skip header
  
        // Detect image
        let imgSrc = '';
        const imgEl = cells[0].querySelector('img');
        if (imgEl) imgSrc = imgEl.src;
        else if (cells[0].innerText.match(/^https?:\/\//)) imgSrc = cells[0].innerText.trim();
  
        slides.push({
          image: imgSrc,
          title: cells[1].innerText.trim(),
          description: cells[2].innerText.trim(),
        });
      }
    });
  
    console.log('Slides found:', slides);
  
    if (slides.length === 0) {
      console.warn('⚠️ No valid slides detected in table');
      return;
    }
  
    // Build wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'product-carousel__wrapper';
  
    slides.forEach((slide, i) => {
      const slideEl = document.createElement('div');
      slideEl.className = 'product-carousel__slide';
      if (i === 0) slideEl.classList.add('active');
  
      const left = document.createElement('div');
      left.className = 'product-carousel__left';
      const img = document.createElement('img');
      img.src = slide.image;
      img.alt = slide.title || 'Product image';
      img.loading = 'lazy';
      left.appendChild(img);
  
      const right = document.createElement('div');
      right.className = 'product-carousel__right';
      right.innerHTML = `
        <h3>${slide.title}</h3>
        <p>${slide.description}</p>
      `;
  
      slideEl.append(left, right);
      wrapper.appendChild(slideEl);
    });
  
    // Replace old content with new carousel structure
    block.innerHTML = '';
    block.appendChild(wrapper);
  
    // Navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'product-carousel__nav product-carousel__prev';
    prevBtn.innerHTML = '←';
  
    const nextBtn = document.createElement('button');
    nextBtn.className = 'product-carousel__nav product-carousel__next';
    nextBtn.innerHTML = '→';
  
    // Dots navigation
    const dots = document.createElement('div');
    dots.className = 'product-carousel__dots';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'product-carousel__dot';
      if (i === 0) dot.classList.add('active');
      dots.appendChild(dot);
    });
  
    block.append(prevBtn, nextBtn, dots);
  
    // Carousel logic
    let current = 0;
    const allSlides = block.querySelectorAll('.product-carousel__slide');
    const allDots = block.querySelectorAll('.product-carousel__dot');
  
    function showSlide(index) {
      allSlides.forEach((s) => s.classList.remove('active'));
      allDots.forEach((d) => d.classList.remove('active'));
      allSlides[index].classList.add('active');
      allDots[index].classList.add('active');
    }
  
    prevBtn.addEventListener('click', () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    });
  
    nextBtn.addEventListener('click', () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    });
  
    allDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        current = i;
        showSlide(i);
      });
    });
  }
  