import React, {useEffect} from 'react';
import '../../index.css';

export function CarouselItem({ width, image, date, title, text }) {
    return (
        <div className="carousel__item" style={{width}}>
            <img className="carousel__image" src={image} alt=""/>
            <p className="carousel__date">{date}</p>
            <h2 className="carousel__title">{title}</h2>
            <p className="carousel__text">{text}</p>
        </div>
    );
}

function Carousel({children}) {
    const [activeIndex, setActiveIndex] = React.useState(0);
    // Этот стейт отвечает за индекс отображаемых карточек
    const [startX, setStartX] = React.useState(0);
    // Этот стейт записывает начальное положение зажатой мыши
    const [windowWidth, setWindowWidth] = React.useState(1160);
    // Этот стейт отвечает за ширину экрана
    const [width, setWidth] = React.useState(0);
    // Этот стейт отвечает за ширину карточек в зависимости от разрешения
    const [marginWidth, setMarginWidth] = React.useState(30);
    // Этот стейт отвечает за ширину отступа по краям у слайдера
    const slider = React.useRef(null);
    // С помощью рефа связываем slider

    // useEffect(() => {
    //     // Устанавливаем автоматическую прокрутку каждые 4 секунды
    //     const interval = setInterval(() => {
    //         updateIndex(activeIndex + 1)
    //     }, 4000);
    //     // Очищаем интервал
    //     return () => {
    //         if (interval)
    //             clearInterval(interval);
    //     }
    // })

    useEffect(() => { // Эффект, который в зависимости от ширины экрана меняет ширину карточек
        if (windowWidth < 768) {
            setWidth(200);
        } else if (windowWidth < 1160) {
            setWidth(240);
            setMarginWidth(20);
        } else {
            setWidth(260);
            setMarginWidth(30);
        }
    }, [windowWidth])

    useEffect(() => {
        onSubscribe();
        return () => offSubscribe();
    }, [])

    const handleSubscribe = () => {
        setWindowWidth(window.innerWidth);
    }

    const onSubscribe = () => {
        window.addEventListener('resize', function () {
            setTimeout(handleSubscribe, 1000);
        })
    }

    const offSubscribe = () => {
        window.removeEventListener('resize', function () {
            setTimeout(handleSubscribe, 1000);
        })
    }

    const leftButtonClick = () => {
        updateIndex(activeIndex - 1);
    };

    const rightButtonClick = () => {
        updateIndex(activeIndex + 1);
    };

    const updateIndex = (newIndex) => {
        // Здесь мы сравниваем индекс. Если индекс меньше 0, то есть в изначальном положении карточек
        // пользователь нажал кнопку влево, то переключаем на последние карточки (в конец). Если же
        // пользователь, находясь на последних карточках нажал вправо, то переключаем на первые карточки (в начало)
        // Если это не первые и не последние карточки, то просто устанавливаем тот индекс, который пришел.
        // Также нужно отметить, что т.к. у нас отображается 4 карточки за раз, то нужно количество элементов делить на 4.
        if (newIndex < 0) {
            newIndex = (React.Children.count(children) / 4) - 1;
        } else if (newIndex >= React.Children.count(children) / 4) {
            newIndex = 0;
        }

        setActiveIndex(newIndex);
    };

    const handleMouseDown = (e) => {
        setStartX(e.pageX || e.changedTouches[0].pageX);
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        const pageX = e.pageX || e.changedTouches[0].pageX;
        const x = startX - pageX;
        if (x > 100) {
            updateIndex(activeIndex + 1)
        } else if (x < -100) {
            updateIndex(activeIndex - 1)
        }
    };

    return (
        <>
            <div className="carousel__header">
                <h1 className="carousel__header-title">Актуальное</h1>
                <div className="carousel__menu">
                    <div className="carousel__progress-bar">
                        {/* Вводим условие, которое проверяет активный индекс в данный момент и в зависимости от этого отображает его */}
                        <div className={`carousel__progress ${activeIndex === 0 ? 'carousel__progress_active' : ''}`}/>
                        <div className={`carousel__progress ${activeIndex === 1 ? 'carousel__progress_active' : ''}`}/>
                        <div className={`carousel__progress ${activeIndex === 2 ? 'carousel__progress_active' : ''}`}/>
                        <div className={`carousel__progress ${activeIndex === 3 ? 'carousel__progress_active' : ''}`}/>
                        <div className={`carousel__progress ${activeIndex === 4 ? 'carousel__progress_active' : ''}`}/>
                        <div className={`carousel__progress ${activeIndex === 5 ? 'carousel__progress_active' : ''}`}/>
                    </div>
                    <div className="carousel__buttons">
                        <button
                            className="carousel__button"
                            onClick={leftButtonClick}
                        />
                        <button
                            className="carousel__button"
                            onClick={rightButtonClick}
                        />
                    </div>
                </div>
            </div>
            <div className="carousel">
                <div
                    className="carousel__inner"
                    style={{transform: `translateX(-${activeIndex * (windowWidth - marginWidth)}px)`}}
                    onTouchStart={handleMouseDown}
                    onTouchEnd={handleMouseUp}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    ref={slider}
                >
                    {/* Здесь мы передвигаем наши карточки с помощью translateX, для этого умножаем activeIndex на 100 */}
                    {React.Children.map(children, (child) => React.cloneElement(child, {width: `${width}px`}))}
                </div>
            </div>
        </>

    );
}

export default Carousel;
