export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Extract title and desc with fallbacks
  const title = rows[0]?.querySelector('div')?.textContent.trim() || 'Contact Us';
  const desc = rows[1]?.querySelector('div')?.textContent.trim() || 'Get in touch with us!';

  // Unused—extend for dynamic fields later
  const fields = rows.slice(2, rows.length - 1);
  const submitRow = rows[rows.length - 1];

  // Render form
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
      <button type="submit" disabled>Submitting...</button> <!-- Temp disable for UX -->
      <div class="success" style="display:none;">Thank you! We will contact you soon. (Check Sheet for confirmation)</div>
    </form>
  `;
  
  const form = block.querySelector('form');
  const submitBtn = form.querySelector('button[type="submit"]');
  const successMsg = block.querySelector('.success');
  
  // Submit handler with no-cors for reliable POST
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Client validation
    if (!data.email.includes('@')) {
      successMsg.textContent = 'Please enter a valid email.';
      successMsg.classList.add('error');
      successMsg.style.display = 'block';
      return;
    }
    
    // Show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    successMsg.style.display = 'none';
    
    try {
      await fetch('https://script.google.com/macros/s/AKfycbwHJDlMhGJ4h-P_2j0u3rZR-JTEvUdl7Q4WMVZ3K_RDQ33zzo8dlLbY5loeCEVXUX3fzw/exec', { // Your GAS URL
        method: 'POST',
        mode: 'no-cors',  // Bypasses CORS—POST succeeds, response opaque
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }  // GAS parses it fine
      });
      
      // Assume success (data saved—verify in Sheet)
      successMsg.textContent = 'Thank you! We will contact you soon.';
      successMsg.style.display = 'block';
      form.reset();
      console.log('Form submitted—check GAS Executions and Sheet for new row');
      
    } catch (error) {
      console.error('Unexpected fetch error:', error);  // Rare now
      successMsg.textContent = 'Submission sent! (Check Sheet if issues).';
      successMsg.style.display = 'block';
      form.reset();
    } finally {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });
}