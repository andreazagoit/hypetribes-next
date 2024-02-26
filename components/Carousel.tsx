"use client";

import { useRouter } from "next/navigation";
import React, { useLayoutEffect, useRef, useState } from "react";

interface IProps {
  title: string;
  children: React.ReactNode;
}

const Carousel = ({ title, children }: IProps) => {
  const router = useRouter();
  const containerRef = useRef<any>(null);
  const [childWidth, setChildWidth] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);

  const elementsNumber = 3;
  const gapSize = 20;
  /* const [currentIndex, setCurrentIndex] = useState(0);
  const { name, collections } = data;

  const totalCollections = collections.length;

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalCollections - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalCollections - 1 ? 0 : prevIndex + 1
    );
  };

  const renderCards = () => {
    const cards: React.ReactNode[] = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % totalCollections;
      cards.push(
        <div key={index} className="flex-none w-1/4 px-2">
          <CollectionCard collection={collections[index]} />
        </div>
      );
    }
    return cards;
  }; */

  useLayoutEffect(() => {
    const { x, y, width, height } =
      containerRef.current.getBoundingClientRect();
    setChildWidth((width - (elementsNumber - 1) * gapSize) / elementsNumber);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{title}</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => router.push("/collections/movie")}
        >
          Show all
        </button>
      </div>
      <div className="relative">
        <div className="absolute" style={{ left: -60 }}>
          prev
        </div>
        <div className="absolute" style={{ right: -60 }}>
          Next
        </div>
        <div
          className="overflow-x-scroll overflow-y-hidden flex"
          ref={containerRef}
          style={{ gap: gapSize }}
        >
          {childWidth &&
            React.Children.map(children, (child) => (
              <div style={{ minWidth: childWidth }}>{child}</div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
