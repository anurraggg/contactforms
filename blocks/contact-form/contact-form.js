export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const title = rows[0].querySelector('div').textContent.trim();
  const desc = rows[1].querySelector('div').textContent.trim();

  const fields = rows.slice(2, rows.length - 1);
  const submitRow = rows[rows.length - 1];

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
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.style.display = 'block';
    form.reset();
  });
}
