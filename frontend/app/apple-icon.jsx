import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '36px',
          backgroundColor: '#111720',
          position: 'relative',
        }}
      >
        {/* Ensō open brush circle */}
        <div
          style={{
            position: 'absolute',
            width: '124px',
            height: '124px',
            borderRadius: '50%',
            border: '14px solid #FAF7F0',
            borderRightColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        {/* Morning Sun Golden Core */}
        <div
          style={{
            width: '48px',
            height: '48px',
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
