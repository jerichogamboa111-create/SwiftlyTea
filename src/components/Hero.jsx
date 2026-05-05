import '../styles/Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img
          src="https://cdn.codia.ai/figma/j6usEFVSxdUGV7kLY9fG6C/img-73ce191f2e4b797a.png"
          alt="background"
          className="hero-bg-img"
        />
      </div>
      <div className="hero-content">
        <div className="hero-drink-img">
          <img
            src="https://cdn.codia.ai/figma/j6usEFVSxdUGV7kLY9fG6C/img-55c4c51ca41a822d.png"
            alt="Milk Tea Drink"
          />
        </div>
        <div className="hero-text">
          <h1 className="hero-headline">YOUR<br />MILKTEA</h1>
          <p className="hero-tagline">A TASTE OF TAIWAN MILKTEA</p>
        </div>
      </div>
      <div className="hero-menu-title">
        <span className="menu-word">MENU</span>
      </div>
    </section>
  );
}
