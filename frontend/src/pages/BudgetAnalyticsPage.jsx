import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import api from '../api/axios';
import './BudgetAnalyticsPage.css';

const CATEGORY_COLORS = {
  Transport: '#4299E1',     // Blue
  Stay: '#48BB78',          // Green
  Meal: '#ED8936',          // Orange
  Activity: '#9F7AEA',      // Purple
  Miscellaneous: '#A0AEC0', // Gray
};

export default function BudgetAnalyticsPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [category, setCategory] = useState('Transport');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/trips/${tripId}/budget`);
      setBudgetData(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not load budget information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchBudget();
    }
  }, [tripId]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      await api.post(`/trips/${tripId}/budget`, {
        category,
        description,
        amount: parseFloat(amount),
        date: date || null,
      });

      // Reset form
      setDescription('');
      setAmount('');
      setDate('');
      
      // Refresh data
      fetchBudget();
    } catch (err) {
      console.error(err);
      alert('Error adding expense');
    }
  };

  const handleDeleteExpense = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await api.delete(`/trips/${tripId}/budget/${itemId}`);
      fetchBudget();
    } catch (err) {
      console.error(err);
      alert('Error deleting expense');
    }
  };

  // Helper to generate a conic gradient for the CSS Pie Chart
  const generatePieChartGradient = () => {
    if (!budgetData || budgetData.totalEstimated === 0) {
      return 'conic-gradient(#edf2f7 0deg, #edf2f7 360deg)';
    }

    const { breakdown, totalEstimated } = budgetData;
    let gradientStops = [];
    let currentAngle = 0;

    Object.entries(breakdown).forEach(([cat, val]) => {
      if (val > 0) {
        const percentage = val / totalEstimated;
        const startAngle = currentAngle;
        const endAngle = currentAngle + (percentage * 360);
        gradientStops.push(`${CATEGORY_COLORS[cat]} ${startAngle}deg ${endAngle}deg`);
        currentAngle = endAngle;
      }
    });

    return `conic-gradient(${gradientStops.join(', ')})`;
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main style={styles.mainContent}>
        <TopNav />
        <div style={styles.contentArea}>
          <div className="budget-header" style={styles.pageHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="btn-secondary" onClick={() => navigate(`/trips/${tripId}/builder`)}>
                &larr; Back to Itinerary
              </button>
              <div>
                <h1 style={styles.title}>Trip Budget & Costs</h1>
                <p style={styles.subtitle}>Track your expenses and stay on top of your spending</p>
              </div>
            </div>
          </div>

          {loading && !budgetData ? (
            <div className="budget-container">Loading...</div>
          ) : error ? (
            <div className="budget-container">Error: {error}</div>
          ) : !budgetData ? null : (
            <div className="budget-container">
              <div className="budget-summary-grid">
                <div className="summary-card">
                  <span className="summary-title">Total Estimated</span>
                  <span className="summary-value">${budgetData.totalEstimated.toFixed(2)}</span>
                </div>
                <div className="summary-card">
                  <span className="summary-title">Average Per Day</span>
                  <span className="summary-value">${budgetData.averagePerDay.toFixed(2)}</span>
                </div>
                <div className="summary-card">
                  <span className="summary-title">Duration</span>
                  <span className="summary-value" style={{ color: '#4a5568' }}>{budgetData.durationDays} Days</span>
                </div>
              </div>

              <div className="main-content">
                {/* Left Column: Chart & Add Form */}
                <div className="left-column">
                  <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="card-title">Cost Breakdown</h2>
                    <div className="chart-container">
                      <div 
                        className="pie-chart" 
                        style={{ background: generatePieChartGradient() }}
                      ></div>
                      
                      <div className="legend">
                        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                          <div key={cat} className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: color }}></div>
                            <span>{cat} (${budgetData.breakdown[cat]?.toFixed(2) || '0.00'})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h2 className="card-title">Add Expense</h2>
                    <form className="budget-form" onSubmit={handleAddExpense}>
                      <div className="form-group">
                        <label>Category</label>
                        <select 
                          className="form-control"
                          value={category} 
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="Transport">Transport</option>
                          <option value="Stay">Stay</option>
                          <option value="Meal">Meal</option>
                          <option value="Activity">Activity</option>
                          <option value="Miscellaneous">Miscellaneous</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <input 
                          type="text" 
                          className="form-control"
                          placeholder="e.g. Flight to Paris"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Amount ($)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          min="0"
                          className="form-control"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Date (Optional)</label>
                        <input 
                          type="date" 
                          className="form-control"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                        Add Expense
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Column: Expense List */}
                <div className="right-column">
                  <div className="card" style={{ height: '100%' }}>
                    <h2 className="card-title">Expense List</h2>
                    
                    {budgetData.items.length === 0 ? (
                      <div className="empty-state">
                        No expenses added yet. Add your first expense to see the breakdown.
                      </div>
                    ) : (
                      <div className="expense-list">
                        {budgetData.items.map(item => (
                          <div key={item.id} className="expense-item">
                            <div className="expense-info">
                              <span className="expense-category" style={{ color: CATEGORY_COLORS[item.category] }}>
                                {item.category}
                              </span>
                              <span className="expense-desc">{item.description || 'No description'}</span>
                              {item.date && <span className="expense-date">{new Date(item.date).toLocaleDateString()}</span>}
                            </div>
                            <div className="expense-amount-actions">
                              <span className="expense-amount">${item.amount.toFixed(2)}</span>
                              <button 
                                className="btn btn-delete"
                                onClick={() => handleDeleteExpense(item.id)}
                                title="Delete expense"
                                type="button"
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    backgroundColor: '#FAFAFA',
  },
  contentArea: {
    padding: '2rem 4rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  pageHeader: {
    marginBottom: '2rem',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.5rem',
    fontWeight: '600',
    color: 'var(--text-main)',
    margin: 0,
  },
  subtitle: {
    color: 'var(--text-secondary)',
    margin: '0.5rem 0 0 0',
  }
};
