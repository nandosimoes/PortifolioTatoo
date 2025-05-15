import React, { useState, useEffect } from 'react';
import styles from './Certificados.module.css';

export default function Certificacoes({ isAdmin = false }) {
  const [certificados, setCertificados] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newCertificado, setNewCertificado] = useState({
    image: null,
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchCertificados();
  }, []);

  const fetchCertificados = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/certificados');
      const data = await response.json();
      setCertificados(data);
    } catch (error) {
      console.error('Error fetching certificados:', error);
    }
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? certificados.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === certificados.length - 1 ? 0 : prev + 1));
  };

  const handleFileChange = (e) => {
    setNewCertificado({ ...newCertificado, image: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCertificado({ ...newCertificado, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('image', newCertificado.image);
    formData.append('title', newCertificado.title);
    formData.append('description', newCertificado.description);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/certificados', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setCertificados([data, ...certificados]);
        setNewCertificado({ image: null, title: '', description: '' });
        setShowForm(false);
        document.getElementById('certificado-upload').value = '';
      }
    } catch (error) {
      console.error('Error adding certificado:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/certificados/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCertificados(certificados.filter(cert => cert.id !== id));
        if (certificados.length === 1) setCurrentIndex(0);
        else if (currentIndex >= certificados.length - 1) setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error deleting certificado:', error);
    }
  };

  return (
    <section id="certificacoes" className={styles.certificacoes}>
      <h2 className={styles.sectionTitle}>Certificados</h2>
      
      {isAdmin && !showForm ? (
        <div className={styles.addButtonContainer}>
          <button 
            className={styles.showFormButton}
            onClick={() => setShowForm(true)}
          >
            Adicionar Certificado
          </button>
        </div>
      ) : isAdmin && showForm ? (
        <div className={styles.adminPanel}>
          <h3>Adicionar Novo Certificado</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="certificado-upload">Imagem do Certificado:</label>
              <input
                id="certificado-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="title">Título:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newCertificado.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Descrição:</label>
              <textarea
                id="description"
                name="description"
                value={newCertificado.description}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formButtons}>
              <button type="submit" className={styles.submitButton}>Salvar</button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {certificados.length > 0 && (
        <div className={styles.carrosselContainer}>
          <button className={styles.navButton} onClick={handlePrev}>&lt;</button>
          
          <div className={styles.certificadoWrapper}>
            <img 
              src={certificados[currentIndex].image_url} 
              alt={certificados[currentIndex].title}
              className={styles.certificadoImage}
            />
            <div className={styles.certificadoInfo}>
              <h3>{certificados[currentIndex].title}</h3>
              <p>{certificados[currentIndex].description}</p>
              {isAdmin && (
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDelete(certificados[currentIndex].id)}
                >
                  Deletar
                </button>
              )}
            </div>
          </div>
          
          <button className={styles.navButton} onClick={handleNext}>&gt;</button>
        </div>
      )}
    </section>
  );
}