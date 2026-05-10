import React from 'react';

export default function Loader({ text = 'Načítám...' }) {
  return <p className="muted">{text}</p>;
}