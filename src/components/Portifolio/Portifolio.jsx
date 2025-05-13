import React, { useState, useEffect } from 'react'; 
import styles from './Portifolio.module.css';
import Modal from './modal';

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    image: null,
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/portfolio');
      const data = await response.json();
      setPortfolioItems(data);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    }
  };

  const handleImageClick = (item) => {
    setSelectedImage(item);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    setNewItem({ ...newItem, image: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('image', newItem.image);
    formData.append('title', newItem.title);
    formData.append('description', newItem.description);

    try {
      const response = await fetch('http://localhost:8080/api/portfolio', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolioItems([data, ...portfolioItems]);
        setNewItem({ image: null, title: '', description: '' });
        setShowForm(false);
        document.getElementById('image-upload').value = '';
      }
    } catch (error) {
      console.error('Error adding portfolio item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/portfolio/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPortfolioItems(portfolioItems.filter(item => item.id !== id));
        if (selectedImage && selectedImage.id === id) {
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
    }
  };

  return (
    <section id="portfolio" className={styles.portfolio}>
      <h2 className={styles.sectionTitle}>Minha Arte</h2>
      
      {!showForm ? (
        <div className={styles.addButtonContainer}>
          <button 
            className={styles.showFormButton}
            onClick={() => setShowForm(true)}
          >
            Adicionar Nova Tatuagem
          </button>
        </div>
      ) : (
        <div className={styles.adminPanel}>
          <h3>Adicionar Nova Tatuagem</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="image-upload">Imagem:</label>
              <input
                id="image-upload"
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
                value={newItem.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Descrição:</label>
              <textarea
                id="description"
                name="description"
                value={newItem.description}
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
      )}

      <div className={styles.grid}>
        {portfolioItems.map((item) => (
          <div key={item.id} className={styles.gridItem} onClick={() => handleImageClick(item)}>
            <div className={styles.imageContainer}>
              <img src={item.image_url} alt={item.title} className={styles.image} />
            </div>
            <div className={styles.overlay}>
              <h3 className={styles.itemTitle}>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedImage && (
        <Modal
          item={selectedImage}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}