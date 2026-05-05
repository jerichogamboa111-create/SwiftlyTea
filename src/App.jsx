import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DrinkMenu from './components/DrinkMenu';
import FoodMenu from './components/FoodMenu';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <Hero />
      <DrinkMenu />
      <FoodMenu />
      <Footer />
    </div>
  );
}
