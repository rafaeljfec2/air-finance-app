interface CreditCardBrandIconProps {
  brand: 'nubank' | 'itau';
}

export function CreditCardBrandIcon({ brand }: Readonly<CreditCardBrandIconProps>) {
  if (brand === 'nubank') {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.5 23V9.5C6.5 7.01472 8.51472 5 11 5C13.4853 5 15.5 7.01472 15.5 9.5V22.5C15.5 24.9853 17.5147 27 20 27C22.4853 27 24.5 24.9853 24.5 22.5V9"
          stroke="#8A05BE"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" rx="6" fill="#FF6900" />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill="#002663"
        fontFamily="Arial"
      >
        Itau
      </text>
    </svg>
  );
}
