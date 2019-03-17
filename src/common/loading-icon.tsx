import React from 'react';
import hotChipWebP from '../../assets/images/hot-chip.webp';
import hotChipGif from '../../assets/images/hot-chip.gif';

export default function LoadingIcon() {
  function imageSrc(src: string): string {
    return location.href + src.substr(src.lastIndexOf('/') + 1, src.length);
  }

  return (
    <picture style={{ display: 'block', width: '12.5rem' }}>
      <source srcSet={imageSrc(hotChipWebP)} type="image/webp" />
      <source srcSet={imageSrc(hotChipGif)} type="image/gif" />
      <img src={imageSrc(hotChipGif)} alt="Loading" />
    </picture>
  );
}
