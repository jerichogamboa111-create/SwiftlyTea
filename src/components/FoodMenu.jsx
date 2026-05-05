import '../styles/FoodMenu.css';

export default function FoodMenu() {
  return (
    <section className="food-menu">
      <div className="food-menu-bg">
        <img
          src="https://cdn.codia.ai/figma/j6usEFVSxdUGV7kLY9fG6C/img-97c4c81f7796493d.png"
          alt="food background"
          className="food-menu-bg-img"
        />
      </div>
      <div className="food-menu-grid">
        {/* Appetizer */}
        <div className="food-section">
          <h2 className="food-section-title">Appetizer</h2>
          <div className="food-table">
            <div className="food-row food-row-header">
              <span></span>
              <span className="price-col"></span>
            </div>
            <div className="food-row"><span>PLAIN FRIES</span><span>49</span></div>
            <div className="food-row"><span>CHEESY FRIES</span><span>55</span></div>
            <div className="food-row"><span>LOADED FRIES</span><span>65</span></div>
            <div className="food-row"><span>BEEFY NACHOS</span><span>65</span></div>
          </div>
        </div>

        {/* Rice Meal */}
        <div className="food-section">
          <h2 className="food-section-title">Rice Meal</h2>
          <div className="food-table">
            <div className="food-row"><span>4PCS CHICKEN WINGS</span><span>99</span></div>
            <div className="food-row"><span>6PCS CHICKEN WINGS</span><span>145</span></div>
            <div className="food-row"><span>4PCS BEEFY SHANGHAI</span><span>65</span></div>
            <div className="food-row"><span>4PCS CHICKEN SHANGHAI</span><span>65</span></div>
            <div className="food-row"><span>SHAWARMA RICE</span><span>65</span></div>
            <div className="food-row"><span>SPAM WITH EGG</span><span>85</span></div>
          </div>
        </div>

        {/* Snack */}
        <div className="food-section">
          <h2 className="food-section-title">Snack</h2>
          <div className="food-table">
            <div className="food-row"><span>BEEFY SHAWARMA BUY 1 GET 1</span><span>90</span></div>
            <div className="food-row"><span>BEEFY SHAWARMA SINGLE ORDER</span><span>60</span></div>
            <div className="food-row"><span>BURGER BUY 1 GET 1</span><span>79</span></div>
            <div className="food-row"><span>BBQ FLAVOR BURGER BUY 1 GET 1</span><span>79</span></div>
            <div className="food-row"><span>SPECIAL BURGER</span><span>89</span></div>
            <div className="food-row"><span>WHEAT BUN BEEFY BURGER</span><span>98</span></div>
            <div className="food-row"><span>DOUBLE CHEESE BURGER</span><span>89</span></div>
          </div>
        </div>

        {/* Combo Meal */}
        <div className="food-section">
          <h2 className="food-section-title">Combo Meal</h2>
          <div className="food-table">
            <div className="food-row"><span>BURGER WITH FRIES</span><span>70</span></div>
            <div className="food-row"><span>SPECIAL BURGER WITH FRIES</span><span>114</span></div>
            <div className="food-row"><span>SNACK COMBO MEAL</span><span>199</span></div>
          </div>
        </div>
      </div>

      {/* Food images */}
      <div className="food-photos">
        <img
          src="https://cdn.codia.ai/figma/j6usEFVSxdUGV7kLY9fG6C/img-e9656578795dea02.png"
          alt="Food"
          className="food-photo"
        />
      </div>

      <div className="shawarma-imgs">
        <img
          src="https://cdn.codia.ai/figma/j6usEFVSxdUGV7kLY9fG6C/img-6bb6390847d0bb1e.png"
          alt="Shawarma"
          className="shawarma-img shawarma-img-1"
        />
        <img
          src="https://cdn.codia.ai/figma/j6usEFVSxdUGV7kLY9fG6C/img-6bb6390847d0bb1e.png"
          alt="Shawarma"
          className="shawarma-img shawarma-img-2"
        />
        <img
          src="https://cdn.codia.ai/figma/j6usEFVSxdUGV7kLY9fG6C/img-6bb6390847d0bb1e.png"
          alt="Shawarma"
          className="shawarma-img shawarma-img-3"
        />
      </div>
    </section>
  );
}
