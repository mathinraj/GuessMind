import styled from 'styled-components'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  padding: 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  text-align: center;
`;

const Img = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 20px;
  object-fit: cover;
  background: #eee;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  margin-bottom: 24px;
`;

const Name = styled.h2`
  margin: 0 0 12px 0;
  font-size: 2rem;
  color: #1f2937;
  font-weight: 700;
`;

const Description = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0 0 8px 0;
  line-height: 1.5;
`;

const Confidence = styled.div`
  color: #10b981;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 32px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const CorrectButton = styled.button`
  padding: 16px 32px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  
  &:hover { 
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const WrongButton = styled.button`
  padding: 16px 32px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
  
  &:hover { 
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(239, 68, 68, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function ResultCard({ guess, progression, onCorrect, onWrong, loading }) {
  return (
    <Card>
      <Img src={guess?.image} alt={guess?.name} />
      <Name>Is it {guess?.name}?</Name>
      {guess?.description && <Description>{guess.description}</Description>}
      <Confidence>Confidence: {Math.round(progression)}%</Confidence>
      
      <ButtonRow>
        <CorrectButton onClick={onCorrect} disabled={loading}>
          {loading ? 'Processing...' : '✅ Yes, Correct!'}
        </CorrectButton>
        <WrongButton onClick={onWrong} disabled={loading}>
          {loading ? 'Processing...' : '❌ No, Wrong'}
        </WrongButton>
      </ButtonRow>
    </Card>
  )
}



