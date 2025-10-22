// contactus.js
// eslint-disable-next-line no-unused-vars
export default async function decorate(block) {
    const config = readBlockConfig(block);
    const title = config.title || 'We’d love to hear from you';
    const subtitle = config.subtitle || 'Have any questions or feedback for us? Our dedicated team is ready to answer any questions you may have. Contact us today.';
    const submitUrl = config['submit-url'] || '/submit-contact'; // Update to your endpoint
  
    // Build form HTML
    const formHTML = `
      <h1 class="contactus__title">${title}</h1>
      <p class="contactus__subtitle">${subtitle}</p>
      <form class="contactus__form" novalidate>
        <div class="contactus__row">
          <div class="contactus__field">
            <label class="contactus__label required" for="first-name">First name</label>
            <input type="text" id="first-name" name="firstName" class="contactus__input" required>
            <div class="contactus__error" aria-live="polite"></div>
          </div>
          <div class="contactus__field">
            <label class="contactus__label required" for="last-name">Last name</label>
            <input type="text" id="last-name" name="lastName" class="contactus__input" required>
            <div class="contactus__error" aria-live="polite"></div>
          </div>
        </div>
        <div class="contactus__field">
          <label class="contactus__label required" for="mobile">Mobile Number</label>
          <div class="contactus__mobile-prefix">
            <span>+91</span>
            <input type="tel" id="mobile" name="mobile" class="contactus__input" placeholder="Enter contact number" pattern="[0-9]{10}" required maxlength="10">
          </div>
          <div class="contactus__error" aria-live="polite"></div>
        </div>
        <div class="contactus__field">
          <label class="contactus__label required" for="email">Email</label>
          <input type="email" id="email" name="email" class="contactus__input" required>
          <div class="contactus__error" aria-live="polite"></div>
        </div>
        <div class="contactus__field">
          <label class="contactus__label required" for="subject">Subject</label>
          <input type="text" id="subject" name="subject" class="contactus__input" placeholder="What is this about?" required>
          <div class="contactus__error" aria-live="polite"></div>
        </div>
        <div class="contactus__field">
          <label class="contactus__label" for="message">Talk to us</label>
          <textarea id="message" name="message" class="contactus__textarea" placeholder="Enter your text here..." maxlength="500"></textarea>
          <span class="contactus__char-count">0 of 500</span>
          <div class="contactus__error" aria-live="polite"></div>
        </div>
        <button type="submit" class="contactus__submit">Submit</button>
      </form>
    `;
  
    block.innerHTML = formHTML;
  
    // Char counter
    const textarea = block.querySelector('#message');
    const charCount = block.querySelector('.contactus__char-count');
    if (textarea && charCount) {
      textarea.addEventListener('input', () => {
        charCount.textContent = `${textarea.value.length} of 500`;
      });
    }
  
    // Form validation and submission
    const form = block.querySelector('.contactus__form');
    const errors = form.querySelectorAll('.contactus__error');
    const submitBtn = block.querySelector('.contactus__submit');
  
    const showError = (field, message) => {
      const errorEl = field.parentElement.querySelector('.contactus__error');
      errorEl.textContent = message;
      field.classList.add('error');
    };
  
    const clearError = (field) => {
      const errorEl = field.parentElement.querySelector('.contactus__error');
      errorEl.textContent = '';
      field.classList.remove('error');
    };
  
    const validateField = (field) => {
      clearError(field);
      if (!field.required || field.value.trim()) return true;
      showError(field, 'This field is required');
      return false;
    };
  
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email.value);
    };
  
    const validateMobile = (mobile) => {
      const value = mobile.value.replace(/\D/g, '');
      return value.length === 10;
    };
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;
  
      // Validate required fields
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach((field) => {
        if (!validateField(field)) isValid = false;
      });
  
      // Extra validation
      if (isValid) {
        const emailField = form.querySelector('#email');
        if (!validateEmail(emailField)) {
          showError(emailField, 'Please enter a valid email');
          isValid = false;
        }
  
        const mobileField = form.querySelector('#mobile');
        if (!validateMobile(mobileField)) {
          showError(mobileField, 'Please enter a valid 10-digit mobile number');
          isValid = false;
        }
      }
  
      if (isValid) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
  
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
  
        try {
          const response = await fetch(submitUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
  
          if (response.ok) {
            alert('Thank you! We\'ll get back to you soon.'); // Replace with better UX
            form.reset();
          } else {
            throw new Error('Submission failed');
          }
        } catch (error) {
          alert('Oops! Something went wrong. Please try again.'); // Replace with better UX
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        }
      }
    });
  
    // Real-time validation on blur
    form.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('blur', () => {
        if (field.required) validateField(field);
        if (field.type === 'email') {
          if (field.value && !validateEmail(field)) {
            showError(field, 'Please enter a valid email');
          }
        }
        if (field.name === 'mobile') {
          if (field.value && !validateMobile(field)) {
            showError(field, 'Please enter a valid 10-digit mobile number');
          }
        }
      });
    });
  }