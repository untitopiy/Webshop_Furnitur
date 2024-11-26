import { FC } from 'react';
import styles from '../styles/Footer.module.css';
import { useNavigate } from 'react-router-dom';
import LOGO from "../images/Logos.svg";
import VK from "../images/VK.svg";
import FaceBook from "../images/FaceBook.svg";

const Footer: FC = () => {
  const history = useNavigate(); 
  const onHomeClick = () => {
    history('/');
  };
  return (
    <section className={styles.footer}>
      <div className={styles.logo}>
        <img src={LOGO} alt="Logo" onClick={onHomeClick} />
      </div>
      <div className={styles.rights}>
        Developed by  
        <a href="https://github.com/untitopiy/" target="_blank" rel="noreferrer">
          Melnikov
        </a>
      </div>
      <div className={styles.socials}>
        <a href="https://vk.com/id331310865" target="_blank" rel="noreferrer"> <img  src={VK} alt="Вконтакте"/> </a>;
        
        <a href="https://www.facebook.com/profile.php?id=100032993148631" target="_blank" rel="noreferrer"><img src={FaceBook} alt="Фейсбук" /> </a>;
        
      </div>
    </section>
  );
};

export default Footer;
