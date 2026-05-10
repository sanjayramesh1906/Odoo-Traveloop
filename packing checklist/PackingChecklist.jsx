import React, { useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import './PackingChecklist.css';
import initialCategories from './data.json';

export default function PackingChecklist() {
  const [categories, setCategories] = useState(initialCategories);
  const [newItemText, setNewItemText] = useState({ Essentials: '', Clothing: '' });

  const toggleItem = (categoryName, itemId) => {
    setCategories(prev => ({
      ...prev,
      [categoryName]: prev[categoryName].map(item => 
        item.id === itemId ? { ...item, packed: !item.packed } : item
      )
    }));
  };

  const addItem = (categoryName) => {
    if (!newItemText[categoryName].trim()) return;
    
    const newItem = {
      id: Date.now().toString(),
      text: newItemText[categoryName],
      packed: false
    };

    setCategories(prev => ({
      ...prev,
      [categoryName]: [...prev[categoryName], newItem]
    }));

    setNewItemText(prev => ({ ...prev, [categoryName]: '' }));
  };

  const removeItem = (categoryName, itemId) => {
    setCategories(prev => ({
      ...prev,
      [categoryName]: prev[categoryName].filter(item => item.id !== itemId)
    }));
  };

  const resetChecklist = () => {
    setCategories(prev => {
      const reset = {};
      Object.keys(prev).forEach(cat => {
        reset[cat] = prev[cat].map(item => ({ ...item, packed: false }));
      });
      return reset;
    });
  };

  return (
    <div className="packing-container">
      <div className="packing-card">
        {/* Header */}
        <header className="packing-header">
          <h1 className="brand-title">Traveloop</h1>
          <span className="screen-title">Packing Checklist</span>
        </header>

        {/* Action Bar */}
        <div className="action-bar">
          <button className="reset-btn" onClick={resetChecklist}>
            <RefreshCw size={16} /> Reset All
          </button>
        </div>

        {/* Checklist Categories */}
        <div className="categories-grid">
          {/* Essentials Column */}
          <div className="category-column">
            <div className="category-title">
              <span className="category-icon shape-circle"></span>
              <h2>Essentials</h2>
            </div>
            
            <ul className="item-list">
              {categories.Essentials.map(item => (
                <li key={item.id} className="checklist-item">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={item.packed} 
                      onChange={() => toggleItem('Essentials', item.id)} 
                    />
                    <span className="custom-checkbox"></span>
                    <span className="item-text">{item.text}</span>
                  </label>
                  <button className="delete-btn" onClick={() => removeItem('Essentials', item.id)}>
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Add Item Input */}
            <div className="add-item-row">
              <input 
                type="text" 
                placeholder="Add essential item..." 
                value={newItemText.Essentials}
                onChange={(e) => setNewItemText(prev => ({ ...prev, Essentials: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addItem('Essentials')}
              />
              <button className="add-btn" onClick={() => addItem('Essentials')}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Clothing Column */}
          <div className="category-column">
            <div className="category-title">
              <span className="category-icon shape-diamond"></span>
              <h2>Clothing</h2>
            </div>
            
            <ul className="item-list">
              {categories.Clothing.map(item => (
                <li key={item.id} className="checklist-item">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={item.packed} 
                      onChange={() => toggleItem('Clothing', item.id)} 
                    />
                    <span className="custom-checkbox"></span>
                    <span className="item-text">{item.text}</span>
                  </label>
                  <button className="delete-btn" onClick={() => removeItem('Clothing', item.id)}>
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Add Item Input */}
            <div className="add-item-row">
              <input 
                type="text" 
                placeholder="Add clothing item..." 
                value={newItemText.Clothing}
                onChange={(e) => setNewItemText(prev => ({ ...prev, Clothing: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addItem('Clothing')}
              />
              <button className="add-btn" onClick={() => addItem('Clothing')}>
                <Plus size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
