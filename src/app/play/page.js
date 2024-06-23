"use client";

import { useRef, forwardRef, useState, useCallback, useEffect } from "react";
import usePrevious from "../../util/usePrevious";
import classes from "./game.module.scss";

const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

const Game = () => {
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [animateIndex, setAnimateIndex] = useState(-1);
    const [animationStartPosition, setAnimationStartPosition] = useState({});
    const [animationTargetPosition, setAnimationTargetPosition] = useState({});

    const gameAreaRef = useRef();
    const itemRefs = useRef({});
    const pos1 = useRef(0);
    const pos2 = useRef(0);
    const pos3 = useRef(0);
    const pos4 = useRef(0);
    const [isDragging, setDragging] = useState(false);
    const [items, setItems] = useState([]);

    const onItemMouseDown = useCallback((e) => {
        e.stopPropagation();

        // mouse initial position:
        pos3.current = e.touches ? e.touches[0].clientX : e.clientX;
        pos4.current = e.touches ? e.touches[0].clientY : e.clientY;

        setDragging(true);
        setAnimateIndex(-1);
    }, []);

    const onGameAreaMouseDown = (e) => {
        // Sprawn new item
        setAnimateIndex(items.length);
        setFocusedIndex(items.length);

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setAnimationTargetPosition({ x: clientX, y: clientY });
        setItems((prevItems) => [...prevItems, { x: clientX, y: clientY }]);
    };

    const onGameAreaMouseMove = (e) => {
        if (!isDragging) {
            return;
        }

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // new click position:
        pos1.current = pos3.current - clientX;
        pos2.current = pos4.current - clientY;
        pos3.current = clientX;
        pos4.current = clientY;

        const focusedItem = itemRefs.current[focusedIndex];
        const newTop = focusedItem.offsetTop - pos2.current;
        const newLeft = focusedItem.offsetLeft - pos1.current;

        setItems((prevItems) =>
            prevItems.map((item, index) => {
                if (focusedIndex == index) {
                    return { x: newLeft, y: newTop };
                } else {
                    return item;
                }
            })
        );
    };

    const onGameAreaMouseUp = useCallback((e) => {
        setDragging(false);
    }, []);

    const [windowSize, setWindowSize] = useState({
        width: window?.innerWidth,
        height: window?.innerHeight,
    });

    const handleWindowResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        setAnimateIndex(-1);
    };

    useEffect(() => {
        const gameRect = gameAreaRef.current.getBoundingClientRect();
        setAnimationStartPosition({ x: gameRect.left, y: gameRect.top });

        window.addEventListener("resize", handleWindowResize);
        handleWindowResize();

        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    const prevWindowSize = usePrevious(windowSize);
    useEffect(() => {
        // rescale all items
        setItems((prevItems) =>
            prevItems.map((item, index) => {
                const changeInWidth = prevWindowSize.width / windowSize.width;
                const changeInHeight =
                    prevWindowSize.height / windowSize.height;

                return {
                    x: item.x / changeInWidth,
                    y: item.y / changeInHeight,
                };
            })
        );
    }, [windowSize]);

    const eventHandlerProps = isTouchDevice
        ? {
              onTouchStart: onGameAreaMouseDown,
              onTouchMove: onGameAreaMouseMove,
              onTouchEnd: onGameAreaMouseUp,
          }
        : {
              onMouseDown: onGameAreaMouseDown,
              onMouseMove: onGameAreaMouseMove,
              onMouseUp: onGameAreaMouseUp,
          };

    return (
        <div
            ref={gameAreaRef}
            className={`${classes["game-area"]} ${classes["hidden-scroll"]} ${
                items.length ? "" : classes["text-background"]
            }`}
            {...eventHandlerProps}
        >
            {items.map((item, index) => {
                const setRef = (key, node) => {
                    itemRefs.current[key] = node;
                };

                const isAnimate = animateIndex == index;
                const isFocused = focusedIndex == index;

                const top = isAnimate
                    ? `${animationTargetPosition.y}px`
                    : `${item.y}px`;
                const left = isAnimate
                    ? `${animationTargetPosition.x}px`
                    : `${item.x}px`;

                const style = isAnimate
                    ? {
                          "--start-x": `${animationStartPosition.x}px`,
                          "--start-y": `${animationStartPosition.y}px`,
                          "--target-x": left,
                          "--target-y": top,
                          top,
                          left,
                      }
                    : { top, left };

                const handleMouseDown = (e) => {
                    setFocusedIndex(index);
                    onItemMouseDown(e);
                };

                const eventHandlerProps = isTouchDevice
                    ? {
                          onTouchStart: handleMouseDown,
                      }
                    : { onMouseDown: handleMouseDown };

                return (
                    <DraggableComponent
                        key={`Draggable_${index}`}
                        ref={(node) => setRef(index, node)}
                        isFocused={isFocused}
                        isAnimate={isAnimate}
                        style={style}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                        {...eventHandlerProps}
                    />
                );
            })}
        </div>
    );
};

const DraggableComponent = forwardRef((props, ref) => {
    const { isFocused, isAnimate, setAnimateIndex, ...otherProps } = props;

    const focusedClass = `${isFocused ? classes["focused"] : ""}`;
    const animateClass = `${isAnimate ? classes["animate"] : ""}`;

    return (
        <div
            {...otherProps}
            ref={ref}
            className={`${classes["draggable"]} ${focusedClass} ${animateClass}`}
        />
    );
});

export default Game;
