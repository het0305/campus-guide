import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FoodCourt.css";

const defaultFoodShops = [
  {
    name: "Shree Rang Bhojak",
    location: "Main Food Court",
    lat: 21.066388546385735,
    lng: 73.13040236751597,
    items: [
      { name: "Dabeli", price: 30 },
      { name: "Vadapav", price: 30 },
      { name: "Samosa", price: 20 },
      { name: "Puff", price: 25 },
      { name: "Tea", price: 15 },
      { name: "Coffee", price: 20 },
    ],
  },
  {
    name: "Mahalaxmi Fast Food",
    location: "Block B Canteen",
    lat: 21.06630520389074,
    lng: 73.13042469542985,
    items: [
      { name: "Regular Pulav", price: 100 },
      { name: "Butter Pulav", price: 130 },
      { name: "Cheese Pav Bhaji", price: 150 },
      { name: "Paneer Pav Bhaji", price: 150 },
      { name: "Manchurian", price: 110 },
      { name: "Noodles", price: 130 },
    ],
  },
  {
    name: "Foodies Cafe",
    location: "Library Side",
    lat: 21.066638573591465,
    lng: 73.13027477943602,
    items: [
      { name: "Cold Coffee", price: 80 },
      { name: "Milkshake", price: 100 },
      { name: "Veg Burger", price: 70 },
      { name: "Cheese Paratha", price: 90 },
      { name: "Veg Frankie", price: 90 },
    ],
  },
  {
    name: "Chirag Tea Center",
    location: "Food Court in Middle",
    lat: 21.06812533386228,
    lng: 73.13045978215283,
    items: [
      { name: "Dal Fry Jeera Rice", price: 130 },
      { name: "Khaman", price: 40 },
      { name: "Patudi", price: 50 },
      { name: "Uttapam", price: 80 },
      { name: "Masala Dosa", price: 100 },
      { name: "Mysore Masala Dosa", price: 120 },
      { name: "Paneer Dosa", price: 140 },
      { name: "Cheese Paper Dosa", price: 150 },
      { name: "Manchurian", price: 120 },
      { name: "Cutting Tea", price: 20 },
    ],
  },
];

export default function FoodCourt() {
  const [showShops, setShowShops] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [foodShops, setFoodShops] = useState(defaultFoodShops);
  const navigate = useNavigate();

  // Load any admin-updated food court location (simple example)
  useEffect(() => {
    const updatedLocation = localStorage.getItem("foodCourt");
    if (updatedLocation) {
      setFoodShops((prev) =>
        prev.map((shop, index) =>
          index === 0 ? { ...shop, location: updatedLocation } : shop
        )
      );
    }
  }, []);

  return (
    <div className="food-wrapper">
      {/* STEP 1 BUTTON */}
      {!showShops && (
        <div className="hero">
          <h1>🍽 Campus Food Court</h1>
          <p>Discover all food shops inside campus</p>

          <button className="explore-btn" onClick={() => setShowShops(true)}>
            Explore Food Shops in Campus
          </button>
        </div>
      )}

      {/* STEP 2 SHOP LIST */}
      {showShops && !selectedShop && (
        <div className="shop-view">
          <h2>Select a Food Shop</h2>

          <div className="shop-grid">
            {foodShops.map((shop, index) => (
              <div
                key={index}
                className="shop-card"
                onClick={() => setSelectedShop(shop)}
              >
                <h3>{shop.name}</h3>
                <p>📍 {shop.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 MENU VIEW */}
      {selectedShop && (
        <div className="menu-view">
          <button className="back-btn" onClick={() => setSelectedShop(null)}>
            ← Back to Shops
          </button>

          <div className="menu-card">
            <h2>{selectedShop.name}</h2>
            <p className="location">📍 {selectedShop.location}</p>

            <div className="menu-list">
              {selectedShop.items.map((item, idx) => (
                <div className="menu-row" key={idx}>
                  <span>{item.name}</span>
                  <strong>₹{item.price}</strong>
                </div>
              ))}
            </div>

            <button
              className="map-btn"
              onClick={() =>
                navigate("/map", {
                  state: {
                    lat: selectedShop.lat,
                    lng: selectedShop.lng,
                    name: selectedShop.name,
                  },
                })
              }
            >
              Open Shop on Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
