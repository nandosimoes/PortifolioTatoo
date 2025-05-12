import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a href="#portfolio" className={styles.navLink}>portifólio</a>
        <a href="#sobre" className={styles.navLink}>sobre mim</a>
        <a href="#certificacoes" className={styles.navLink}>certificações</a>
        <a href="#contato" className={styles.navLink}>contato</a>
      </nav>
    </header>
  );
}