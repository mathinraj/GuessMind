import styled from 'styled-components'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  width: 100%;
  padding: 48px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  text-align: center;
`;

const Question = styled.h2`
  margin: 0 0 40px 0;
  font-size: 2.25rem;
  color: #1f2937;
  font-weight: 700;
  line-height: 1.3;
  max-width: 600px;
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 500px;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }
`;

const Button = styled.button`
  padding: 16px 20px;
  border-radius: 16px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 2px solid transparent;
  
  &:hover { 
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    border-color: #667eea;
  }
  
  &:active { 
    transform: translateY(0px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 639px) {
    font-size: 0.9rem;
    padding: 14px 16px;
  }
`;

export default function QuestionCard({ question, onAnswer, disabled }) {
  return (
    <Card>
      <Question>{question}</Question>
      <Buttons>
        <Button onClick={() => onAnswer('yes')} disabled={disabled}>Yes</Button>
        <Button onClick={() => onAnswer('no')} disabled={disabled}>No</Button>
        <Button onClick={() => onAnswer('idk')} disabled={disabled}>Don't know</Button>
        <Button onClick={() => onAnswer('probably')} disabled={disabled}>Probably</Button>
        <Button onClick={() => onAnswer('probably not')} disabled={disabled}>Probably not</Button>
      </Buttons>
    </Card>
  )
}



