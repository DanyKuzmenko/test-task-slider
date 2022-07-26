import React, {useEffect} from 'react';
import '../../index.css';

export function CarouselItem({width, image, date, title, text}) {
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
    const [width, setWidth] = React.useState(260);
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

    useEffect(() => { // Эффект, который в зависимости от ширины экрана меняет ширину карточек и ширину отступов
        if (windowWidth < 769) {
            setWidth(280);
            setMarginWidth(20);
        } else if (windowWidth < 1160) {
            setWidth(240);
            setMarginWidth(20);
        } else {
            setWidth(260);
            setMarginWidth(30);
        }
    }, [windowWidth])

    useEffect(() => { // Эффект, который устанавливает изначальное значение стейта расширения экрана
        onSubscribe();
        return () => offSubscribe();
    }, [])

    const handleSubscribe = () => { // Функция, которая записывает в стейт расширение экрана
        setWindowWidth(window.innerWidth);
    }

    const onSubscribe = () => { // Функция подписки на изменение расширения экрана
        window.addEventListener('resize', function () {
            setTimeout(handleSubscribe, 1000);
        })
    }

    const offSubscribe = () => { // Функция отмены подписки на изменение расширения экрана
        window.removeEventListener('resize', function () {
            setTimeout(handleSubscribe, 1000);
        })
    }

    const leftButtonClick = () => { // Функция обработки клика левой кнопки
        updateIndex(activeIndex - 1);
    };

    const rightButtonClick = () => { // Функция обработки клика правой кнопки
        updateIndex(activeIndex + 1);
    };

    const updateIndex = (newIndex) => { // Функция, которая обновляет активный индекс
        // Здесь мы сравниваем индекс. Если индекс меньше 0, то есть в изначальном положении карточек
        // пользователь нажал кнопку влево, то переключаем на последние карточки (в конец). Если же
        // пользователь, находясь на последних карточках нажал вправо, то переключаем на первые карточки (в начало)
        // Если это не первые и не последние карточки, то просто устанавливаем тот индекс, который пришел.
        // Также нужно отметить, что количество отображаемых карточек зависит от ширины экрана, поэтому у нас отображается
        // разное количество карточек за раз.
        if (windowWidth > 1159) {
            if (newIndex < 0) {
                newIndex = (React.Children.count(children) / 4) - 1;
            } else if (newIndex >= React.Children.count(children) / 4) {
                newIndex = 0;
            }
        } else if (windowWidth > 768) {
            if (newIndex < 0) {
                newIndex = (React.Children.count(children) / 3) - 1;
            } else if (newIndex >= React.Children.count(children) / 3) {
                newIndex = 0;
            }
        } else if (windowWidth > 610) {
            if (newIndex < 0) {
                newIndex = (React.Children.count(children) / 2) - 1;
            } else if (newIndex >= React.Children.count(children) / 2) {
                newIndex = 0;
            }
        } else if (windowWidth > 320) {
            if (newIndex < 0) {
                newIndex = React.Children.count(children) - 1;
            } else if (newIndex >= React.Children.count(children)) {
                newIndex = 0;
            }
        }

        setActiveIndex(newIndex);
    };

    const handleMouseDown = (e) => { // Функция, которая срабатывает, когда пользователь зажимает мышку
        // Здесь мы записываем в стейт пиксель, на котором пользователь зажал мышку
        setStartX(e.pageX || e.changedTouches[0].pageX);
    };

    const handleMouseUp = (e) => { // Функция, которая срабатывает, когда пользователь отпускает мышку
        e.preventDefault();
        // Здесь мы записываем в переменную pageX пиксель, на котором пользователь отпустил мышь
        const pageX = e.pageX || e.changedTouches[0].pageX;
        // Здесь мы записываем в переменную x расстояние от пикселя, на котором пользователь зажал мышку
        // и на котором отпустил
        const x = startX - pageX;
        // Вводим условие, если расстояние больше 100 пикселей, то перемещаем карточки вперед,
        // если же расстояние меньше 100, то перемещаем карточки назад
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
                        {/* Вводим условие, которое проверяет ширину экрана и в зависимости от нее перебирает карточки.
                        Нам важен только index очередной карточки. С помощью него мы отображаем активные карточки.*/}
                        {windowWidth > 1159 ? children.map((item, index) => {
                            if (index < 6) {
                                return (
                                    <div
                                        className={`carousel__progress ${activeIndex === index ? 'carousel__progress_active' : ''}`}/>
                                )
                            }
                        }) : windowWidth > 768 ? children.map((item, index) => {
                                if (index < 8) {
                                    return (
                                        <div
                                            className={`carousel__progress ${activeIndex === index ? 'carousel__progress_active' : ''}`}/>
                                    )
                                }
                            })
                            : windowWidth > 610 ? children.map((item, index) => {
                                if (index < 12) {
                                    return (
                                        <div
                                            className={`carousel__progress ${activeIndex === index ? 'carousel__progress_active' : ''}`}/>
                                    )
                                }
                            }) : windowWidth > 320 ? children.map((item, index) => {
                                return (
                                    <div
                                        className={`carousel__progress ${activeIndex === index ? 'carousel__progress_active' : ''}`}/>
                                )
                            }) : ''}
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
