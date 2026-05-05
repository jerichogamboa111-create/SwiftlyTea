import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          <p className="footer-accept">
            <em>We also accept</em><br />
            <strong>ADVANCE ORDERS &amp;</strong><br />
            <strong>DELIVERIES</strong>
          </p>
          <div className="footer-address-row">
            <span className="footer-pin">&#128205;</span>
            <span className="footer-address">Purok 4 Camba<br />Arayat Pampanga</span>
          </div>
          <div className="footer-social">
            <img
              src="https://cdn.codia.ai/figma/j6usEFVSxdUGV7kLY9fG6C/img-ec5eb57c68a4e377.png"
              alt="Social media icons"
              className="footer-social-img"
            />
          </div>
        </div>
        <div className="footer-qr">
          <img
            src="https://cdn.codia.ai/figma/j6usEFVSxdUGV7kLY9fG6C/img-6e328905b737a565.png"
            alt="QR Code"
            className="footer-qr-img"
          />
          <div className="footer-scan">
            <span>SCAN ME</span>
          </div>
        </div>
      </div>
      <div className="footer-delivery-img">
        <img
          src="https://cdn.codia.ai/figma/j6usEFVSxdUGV7kLY9fG6C/img-78f56edc02813f4f.png"
          alt="Delivery"
          className="footer-delivery"
        />
      </div>
    </footer>
  );
}
