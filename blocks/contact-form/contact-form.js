export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Extract title and desc with fallbacks (safe against missing rows)
  const title = rows[0]?.querySelector('div')?.textContent.trim() || 'Contact Us';
  const desc = rows[1]?.querySelector('div')?.textContent.trim() || 'Get in touch with us!';

  // Unused for now—could loop these for dynamic fields later
  const fields = rows.slice(2, rows.length - 1);
  const submitRow = rows[rows.length - 1];

  // Render the form HTML
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
  
  // Enhanced submit handler with backend integration
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Quick client-side validation
    if (!data.email.includes('@')) {
      successMsg.textContent = 'Please enter a valid email.';
      successMsg.classList.add('error');
      successMsg.style.display = 'block';
      return;
    }
    
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwCpz3ZWWmLJeX3eFOmuHtqW5cQ8C7UNJtpEvwiyox3uapk8SUTamhRH9Is1gHg7a8x8g/exec', { // Replace with your GAS URL, e.g., https://script.google.com/macros/s/AKfycbx.../exec
        method: 'POST',
        mode: 'cors',  // Enables CORS handling
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Check response status
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      let result;
      try {
        result = await response.json();  // Parse JSON response
      } catch (parseErr) {
        // Fallback if response is opaque (CORS edge case)
        console.warn('Response not readable—assuming success (check GAS logs)');
        result = { status: 'success', message: 'Thank you! We will contact you soon.' };
      }
      
      if (result.status === 'success') {
        successMsg.textContent = result.message;
        successMsg.style.display = 'block';
        form.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Fetch error:', error);  // Browser console for details
      let errorMsg = 'Please try again.';
      if (error.message.includes('Failed to fetch')) {
        errorMsg = 'Network issue—check connection and try again.';
      } else if (error.message.includes('Server error')) {
        errorMsg = `Server problem (${error.message})—data may still be saved.`;
      }
      successMsg.textContent = `Error: ${errorMsg}`;
      successMsg.classList.add('error');
      successMsg.style.display = 'block';
    }
  });
}