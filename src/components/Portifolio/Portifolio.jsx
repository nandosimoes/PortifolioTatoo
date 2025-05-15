import React, { useState, useEffect } from 'react'; 
import styles from './Portifolio.module.css';
import Modal from './modal';

export default function Portfolio({ isAdmin = false }) {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    image: null,
    title: '',
    description: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerRow = 4;
  const rowsPerPage = 2;
  const itemsPerPage = itemsPerRow * rowsPerPage;

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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/portfolio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolioItems([data, ...portfolioItems]);
        setNewItem({ image: null, title: '', description: '' });
        setShowForm(false);
        document.getElementById('image-upload').value = '';
        setCurrentPage(0); // Reset to first page after adding new item
      }
    } catch (error) {
      console.error('Error adding portfolio item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPortfolioItems(portfolioItems.filter(item => item.id !== id));
        if (selectedImage && selectedImage.id === id) {
          setIsModalOpen(false);
        }
        // Adjust page if we deleted the last item on the current page
        if (portfolioItems.length % itemsPerPage === 1 && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
    }
  };

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => 
      (prev + 1) * itemsPerPage < portfolioItems.length ? prev + 1 : prev
    );
  };

  const visibleItems = portfolioItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Fill empty spaces to maintain grid layout
  const emptyItems = itemsPerPage - visibleItems.length;
  const displayItems = [...visibleItems];
  for (let i = 0; i < emptyItems; i++) {
    displayItems.push({ id: `empty-${i}`, empty: true });
  }

  return (
    <section id="portfolio" className={styles.portfolio}>
      <h2 className={styles.sectionTitle}>Minha Arte</h2>
      
      {isAdmin && !showForm ? (
        <div className={styles.addButtonContainer}>
          <button 
            className={styles.showFormButton}
            onClick={() => setShowForm(true)}
          >
            Adicionar Nova Tatuagem
          </button>
        </div>
      ) : isAdmin && showForm ? (
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
      ) : null}

      <div className={styles.carouselContainer}>
        <button 
          className={styles.navButton} 
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          &lt;
        </button>
        
        <div className={styles.grid}>
          {displayItems.map((item) => (
            item.empty ? (
              <div key={item.id} className={`${styles.gridItem} ${styles.emptyItem}`}></div>
            ) : (
              <div key={item.id} className={styles.gridItem} onClick={() => handleImageClick(item)}>
                <div className={styles.imageContainer}>
                  <img src={item.image_url} alt={item.title} className={styles.image} />
                </div>
                <div className={styles.overlay}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                </div>
              </div>
            )
          ))}
        </div>
        
        <button 
          className={styles.navButton} 
          onClick={handleNext}
          disabled={(currentPage + 1) * itemsPerPage >= portfolioItems.length}
        >
          &gt;
        </button>
      </div>

      {isModalOpen && selectedImage && (
        <Modal
          item={selectedImage}
          onClose={() => setIsModalOpen(false)}
          onDelete={isAdmin ? handleDelete : null}
        />
      )}
    </section>
  );
}