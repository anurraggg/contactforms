// product-carousel.js
export default function decorate(block) {
    block.classList.add('product-carousel');
  
    // Extract slides from table
    const slides = [];
    const rows = block.querySelectorAll('tr');
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      if (index === 0) return; // skip header row if any
      if (cells.length >= 3) {
        slides.push({
          image: cells[0].querySelector('img')?.src || cells[0].innerText.trim(),
          title: cells[1].innerText.trim(),
          description: cells[2].innerText.trim(),
        });
      }
    });
  
    // Build DOM
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'product-carousel__wrapper';
  
    slides.forEach((slide, i) => {
      const slideEl = document.createElement('div');
      slideEl.className = 'product-carousel__slide';
      if (i === 0) slideEl.classList.add('active');
  
      const left = document.createElement('div');
      left.className = 'product-carousel__left';
      const img = document.createElement('img');
      img.src = slide.image;
      img.alt = slide.title;
      img.loading = 'lazy';
      left.appendChild(img);
  
      const right = document.createElement('div');
      right.className = 'product-carousel__right';
      const title = document.createElement('h3');
      title.textContent = slide.title;
      const desc = document.createElement('p');
      desc.textContent = slide.description;
      right.append(title, desc);
  
      slideEl.append(left, right);
      carouselWrapper.appendChild(slideEl);
    });
  
    // Controls
    const prevBtn = document.createElement('button');
    prevBtn.className = 'product-carousel__nav product-carousel__prev';
    prevBtn.innerHTML = '←';
  
    const nextBtn = document.createElement('button');
    nextBtn.className = 'product-carousel__nav product-carousel__next';
    nextBtn.innerHTML = '→';
  
    // Pagination dots
    const dots = document.createElement('div');
    dots.className = 'product-carousel__dots';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'product-carousel__dot';
      if (i === 0) dot.classList.add('active');
      dots.appendChild(dot);
    });
  
    block.innerHTML = '';
    block.append(carouselWrapper, prevBtn, nextBtn, dots);
  
    // JS logic
    let current = 0;
  
    function showSlide(index) {
      const allSlides = block.querySelectorAll('.product-carousel__slide');
      const allDots = block.querySelectorAll('.product-carousel__dot');
      allSlides.forEach(s => s.classList.remove('active'));
      allDots.forEach(d => d.classList.remove('active'));
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
  
    dots.querySelectorAll('.product-carousel__dot').forEach((dot, i) => {
      dot.addEventListener('click', () => {
        current = i;
        showSlide(i);
      });
    });
  }
  