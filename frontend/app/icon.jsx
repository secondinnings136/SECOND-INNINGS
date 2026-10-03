import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: '#111720',
          position: 'relative',
        }}
      >
        {/* Ensō open brush circle */}
        <div
          style={{
            position: 'absolute',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '3px solid #FAF7F0',
            borderRightColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        {/* Morning Sun Golden Core */}
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#D97724',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
