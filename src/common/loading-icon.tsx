import React from 'react';
import hotChipWebP from '../../assets/images/hot-chip.webp';
import hotChipJpeg from '../../assets/images/hot-chip.gif';

export default function LoadingIcon() {
  return (
    <picture style={{ display: 'block', width: '200px' }}>
      <source srcSet={hotChipWebP} type="image/webp" />
      <source srcSet={hotChipJpeg} type="image/gif" />
      <img src={hotChipJpeg} alt="Loading" />
    </picture>
  );
}
