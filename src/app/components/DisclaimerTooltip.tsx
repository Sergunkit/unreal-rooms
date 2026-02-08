import { useEffect, useState } from 'react';
import './DisclaimerTooltip.css';

export const DisclaimerTooltip = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяем, был ли тултип уже показан
    const disclaimerShown = localStorage.getItem('disclaimerShown');

    if (!disclaimerShown) {
      // Задержка перед появлением тултипа
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Сохраняем в localStorage, чтобы не показывать снова
    localStorage.setItem('disclaimerShown', 'true');
  };

  return (
    <div className={`disclaimer-tooltip ${isVisible ? 'show' : 'hide'}`}>
      <div className="disclaimer-content">
        <p className="disclaimer-text">
          Данный сайт создан и функционирует исключительно в развлекательных целях. Все совпадения
          случайны. Оставаясь на сайте вы не даете согласие оставаться на сайте.
        </p>
        <button className="disclaimer-button" onClick={handleClose}>
          OK
        </button>
      </div>
    </div>
  );
};
