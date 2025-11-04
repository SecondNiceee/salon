import Image from 'next/image';

interface SmartImageProps {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'eager' | 'lazy';
  onLoad?: () => void;
  onError?: () => void;
}

export default function SmartImage({
  src,
  alt = 'Изображение',
  width,
  height,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
  onLoad,
  onError,
}: SmartImageProps) {
  const finalSrc = src || '/placeholder.svg';

  if (process.env.NODE_ENV === 'production') {
    return (
      <Image
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
