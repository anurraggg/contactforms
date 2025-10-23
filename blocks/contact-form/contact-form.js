export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const title = rows[0]?.querySelector('div')?.textContent.trim() || 'Contact Us'; // Added fallback
  const desc = rows[1]?.querySelector('div')?.textContent.trim() || 'Get in touch with us!'; // Added fallback

  const fields = rows.slice(2, rows.length - 1); // Still unused—consider dynamic fields later
  const submitRow = rows[rows.length - 1]; // Still unused

  block.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <form>
      <div class="row">
        <input type="text" name="firstname" placeholder="First Name *" required>
        <input type="text" name="lastname" placeholder="Last Name *" required>
      </div>
      <input type="tel" name="mobile" placeholder="Mobile Number *" required>
      <input type="email" name="email" placeholder="Email *" required>
      <input type="text" name="subject" placeholder="Subject *" required>
      <textarea name="message" placeholder="Enter your text here..." maxlength="500" required></textarea>
      <button type="submit">Submit</button>
      <div class="success" style="display:none;">Thank you! We will contact you soon.</div>
    </form>
  `;
  
  const form = block.querySelector('form');
  const successMsg = block.querySelector('.success');
  
  // NEW: Updated submit handler with backend integration
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Optional: Basic client-side validation (e.g., email format)
    if (!data.email.includes('@')) {
      successMsg.textContent = 'Please enter a valid email.';
      successMsg.classList.add('error');
      successMsg.style.display = 'block';
      return;
    }
    
    try {
      const response = await fetch('YOUR_WEB_APP_URL_HERE', { // e.g., https://script.google.com/macros/s/.../exec
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json(); // Now readable!
      
      if (result.status === 'success') {
        successMsg.textContent = result.message;
        successMsg.style.display = 'block';
        form.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      successMsg.textContent = `Error: ${error.message}. Please try again.`;
      successMsg.classList.add('error');
      successMsg.style.display = 'block';
    }
  });
}