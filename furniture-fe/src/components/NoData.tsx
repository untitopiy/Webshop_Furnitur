import { FC } from 'react';

interface NoDataProps {
  label?: string;
  fontSize?: string;
  color?: string;
  fontWeight?: number;
}

const NoData: FC<NoDataProps> = ({
  label = 'No Data',
  fontSize = '30px',
  color,
  fontWeight = 600,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        margin: '50px 0',
        color,
        fontSize,
        fontWeight,
      }}
    >
      {label}
    </div>
  );
};

export default NoData;
