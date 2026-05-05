import '../styles/DrinkMenu.css';

function MenuSection({ title, items, columnRight, pricesRight }) {
  return (
    <div className="menu-section">
      <div className="section-header">
        <span className="section-title">{title}</span>
      </div>
      <div className="section-body">
        <div className="section-left">
          <div className="section-col-header">
            <span className="col-label">M</span>
            <span className="col-label">L</span>
          </div>
          {items.map((item, i) => (
            <div className="menu-item-row" key={i}>
              <span className="item-name">{item.name}</span>
              <span className="item-prices">
                {item.m && <span>{item.m}</span>}
                {item.l && <span>{item.l}</span>}
              </span>
            </div>
          ))}
        </div>
        {columnRight && (
          <div className="section-right">
            <div className="section-col-header">
              <span className="col-label">M</span>
              <span className="col-label">L</span>
            </div>
            {columnRight.map((item, i) => (
              <div className="menu-item-row" key={i}>
                <span className="item-name">{item.name}</span>
                <span className="item-prices">
                  {item.m && <span>{item.m}</span>}
                  {item.l && <span>{item.l}</span>}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SingleColSection({ title, items }) {
  return (
    <div className="menu-section">
      <div className="section-header">
        <span className="section-title">{title}</span>
      </div>
      <div className="section-body-single">
        <div className="section-col-header-single">
          <span className="col-label-single">L</span>
        </div>
        {items.map((item, i) => (
          <div className="menu-item-row" key={i}>
            <span className="item-name">{item.name}</span>
            <span className="item-prices-single">
              <span>{item.price}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DrinkMenu() {
  const milkteaItems = [
    { name: 'CLASSIC', m: '80', l: '90' },
    { name: 'OKINAWA', m: '95', l: '105' },
    { name: 'WINTER MELON', m: '95', l: '105' },
    { name: 'COOKIES & CREAM', m: '95', l: '105' },
    { name: 'CARAMEL BUTTERCAKE', m: '95', l: '105' },
    { name: 'UJI MATCHA', m: '95', l: '105' },
    { name: 'STRAWBERRY', m: '95', l: '105' },
    { name: 'TARO', m: '95', l: '105' },
    { name: 'TIGER SUGAR', m: '95', l: '105' },
    { name: 'CHOCOLATE', m: '95', l: '105' },
  ];

  const fruitTeaItems = [
    { name: 'GREEN APPLE', m: '65', l: '75' },
    { name: 'STRAWBERRY', m: '65', l: '75' },
    { name: 'MANGO', m: '65', l: '75' },
    { name: 'LYCHEE', m: '65', l: '75' },
    { name: 'KIWI', m: '65', l: '75' },
    { name: 'BLUEBERRY', m: '65', l: '75' },
  ];

  const creamCheeseItems = [
    { name: 'CREAM CHEESE OREA', m: '110', l: '120' },
    { name: 'CREAM CHEESE OKINAWA', m: '110', l: '120' },
    { name: 'CREAM CHEESE WINTERMELON', m: '110', l: '120' },
    { name: 'CREAM CHEESE CHOCOLATE', m: '110', l: '120' },
  ];

  const icedCoffeeItems = [
    { name: 'ICED LATTE', price: '100' },
    { name: 'ICED AMERICANO', price: '110' },
    { name: 'ICED CARAMEL MACHIATO', price: '110' },
  ];

  const cheesecakeItems = [
    { name: 'CHEESECAKE MILKTEA', m: '110', l: '120' },
    { name: 'OREO CHEESE CAKE', m: '110', l: '120' },
    { name: 'MATCHA CHEESCAKE', m: '110', l: '120' },
    { name: 'BUTTER CARAMEL CHEESECAKE', m: '110', l: '120' },
    { name: 'TARO CHEESECAKE', m: '110', l: '120' },
  ];

  const frappeItems = [
    { name: 'STRAWBERRIES CREAM', price: '120' },
    { name: 'MANGO CREAM', price: '120' },
    { name: 'GREEN TEA CREAM', price: '120' },
    { name: 'COOKIES & CREAM', price: '120' },
  ];

  const hotCafeItems = [
    { name: 'HOT BLACK COFFEE/MILK', price: '105' },
    { name: 'HOT CARAMEL MACCHIATO', price: '110' },
    { name: 'HOT CHOCOLATE', price: '110' },
  ];

  const icedCoffeeFrappeItems = [
    { name: 'COFFEE LATTE', price: '120' },
    { name: 'JAVA CHIPS', price: '120' },
    { name: 'CARAMEL MACHIATO', price: '120' },
  ];

  const houseSpecialItems = [
    { name: 'LOVELY TEA SPECIAL', m: '110', l: '120' },
    { name: 'HERSHEY CHOCO CREAMPUFF', m: '110', l: '120' },
  ];

  return (
    <section className="drink-menu">
      <div className="drink-menu-bg">
        <img
          src="https://cdn.codia.ai/figma/j6usEFVSxdUGV7kLY9fG6C/img-6f28758484c7d1ad.png"
          alt="menu background"
          className="drink-menu-bg-img"
        />
      </div>
      <div className="drink-menu-content">
        <div className="menu-col">
          <MenuSection title="MILKTEA SERIES" items={milkteaItems} />
          <MenuSection title="CREAM CHEESE SERIES" items={creamCheeseItems} />
          <MenuSection title="CHESSCAKE SERIES" items={cheesecakeItems} />
          <div className="menu-section">
            <div className="section-header">
              <span className="section-title">HOT CAFE</span>
            </div>
            <div className="section-body-single">
              <div className="section-col-header-single">
                <span className="col-label-single">L</span>
              </div>
              {hotCafeItems.map((item, i) => (
                <div className="menu-item-row" key={i}>
                  <span className="item-name">{item.name}</span>
                  <span className="item-prices-single"><span>{item.price}</span></span>
                </div>
              ))}
            </div>
          </div>
          <MenuSection title="HOUSE SPECIAL" items={houseSpecialItems} />
        </div>

        <div className="menu-col">
          <MenuSection title="FRUIT TEA SERIES" items={fruitTeaItems} />
          <div className="menu-section">
            <div className="section-header">
              <span className="section-title">ICED COFFEE</span>
            </div>
            <div className="section-body-single">
              <div className="section-col-header-single">
                <span className="col-label-single">L</span>
              </div>
              {icedCoffeeItems.map((item, i) => (
                <div className="menu-item-row" key={i}>
                  <span className="item-name">{item.name}</span>
                  <span className="item-prices-single"><span>{item.price}</span></span>
                </div>
              ))}
            </div>
          </div>
          <div className="menu-section">
            <div className="section-header">
              <span className="section-title coffee-free-label">FRAPPE <span className="coffee-free">(COFFEE FREE)</span></span>
            </div>
            <div className="section-body-single">
              <div className="section-col-header-single">
                <span className="col-label-single">L</span>
              </div>
              {frappeItems.map((item, i) => (
                <div className="menu-item-row" key={i}>
                  <span className="item-name">{item.name}</span>
                  <span className="item-prices-single"><span>{item.price}</span></span>
                </div>
              ))}
            </div>
          </div>
          <div className="addons-box">
            <div className="addons-title">ADD ONS:</div>
            <div className="addons-grid">
              <div className="addons-col">
                <div className="addon-row"><span>PEARL</span><span>15</span></div>
                <div className="addon-row"><span>NATA DE COCO</span><span>15</span></div>
                <div className="addon-row"><span>COFFEE JELLY</span><span>15</span></div>
                <div className="addon-row"><span>OREO</span><span>15</span></div>
                <div className="addon-row"><span>CARAMEL</span><span>15</span></div>
              </div>
              <div className="addons-col">
                <div className="addon-row"><span>CREAM PUFF</span><span>15</span></div>
                <div className="addon-row"><span>NUTELLA</span><span>15</span></div>
                <div className="addon-row"><span>CREAM CHEESE</span><span>15</span></div>
                <div className="addon-row"><span>CHEESECAKE</span><span>15</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tea-cup-img">
        <img
          src="https://cdn.codia.ai/figma/j6usEFVSxdUGV7kLY9fG6C/img-55c4c51ca41a822d.png"
          alt="Tea cup"
        />
      </div>
    </section>
  );
}
