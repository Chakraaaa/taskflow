import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import { createPeriod } from '../services/periodService';
import './CreatePeriod.css';

const CreatePeriod = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createPeriod({
        title,
        start_date: startDate,
        end_date: endDate
      });
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la période');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="page-content">
        <div className="create-period-container">
          <h1 className="page-title">Créer une période</h1>
          
          <form onSubmit={handleSubmit} className="create-period-form">
            {error && <div className="error-message">{error}</div>}
            
            <Input
              label="Titre"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Q1 2024, Janvier, etc."
              required
            />
            
            <Input
              label="Date de début"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            
            <Input
              label="Date de fin"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            
            <div className="form-actions">
              <Button type="secondary" onClick={() => navigate('/tasks')} disabled={loading}>
                Annuler
              </Button>
              <Button type="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Création...' : 'Créer la période'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePeriod;
