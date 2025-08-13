import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 600;
`;

const Bar = styled.div`
  width: 100%;
  background: rgba(255,255,255,0.6);
  border-radius: 20px;
  overflow: hidden;
  height: 16px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
`;

const Fill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #10b981 100%);
  width: ${props => Math.min(Math.max(props.value || 0, 0), 100)}%;
  transition: width 0.5s ease;
  border-radius: 20px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export default function ProgressBar({ value }) {
  const percentage = Math.round(value || 0)
  
  return (
    <Container>
      <Label>
        <span>🧠 Mind Reading Progress</span>
        <span>{percentage}%</span>
      </Label>
      <Bar>
        <Fill value={percentage} />
      </Bar>
    </Container>
  )
}



