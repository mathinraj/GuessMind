import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import QuestionCard from './components/QuestionCard'
import ProgressBar from './components/ProgressBar'
import ResultCard from './components/ResultCard'

const Page = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(1200px 600px at 10% 10%, #e9d5ff, transparent),
              radial-gradient(900px 500px at 90% 20%, #bae6fd, transparent),
              radial-gradient(1000px 500px at 50% 100%, #fef3c7, transparent),
              linear-gradient(180deg, #fafafa, #f3f4f6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-weight: 800;
  letter-spacing: -2px;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
  max-width: 600px;
`;

const Button = styled.button`
  padding: 16px 32px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  
  &:hover { 
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
  
  &:active { 
    transform: translateY(0px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const GameArea = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const WelcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
`;

const WinPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const WinCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 48px;
  text-align: center;
  max-width: 500px;
  margin: 20px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
  animation: slideUp 0.3s ease;
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(30px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const WinTitle = styled.h2`
  font-size: 2.5rem;
  margin: 0 0 16px 0;
  color: #10b981;
`;

const WinMessage = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0 0 32px 0;
  line-height: 1.6;
`;

const RetryBanner = styled.div`
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.3);
  animation: slideDown 0.3s ease;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

function App() {
  const [sessionId, setSessionId] = useState(null)
  const [question, setQuestion] = useState('')
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(0)
  const [guess, setGuess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showWinPopup, setShowWinPopup] = useState(false)
  const [winMessage, setWinMessage] = useState('')
  const [gameState, setGameState] = useState('welcome') // 'welcome', 'playing', 'guessing', 'finished'
  const [retryMessage, setRetryMessage] = useState('')

  const baseUrl = useMemo(() => (
    import.meta.env.VITE_API_BASE_URL || ''
  ), [])

  const startGame = useCallback(async () => {
    setLoading(true)
    setGuess(null)
    setShowWinPopup(false)
    setGameState('playing')
    try {
      const res = await fetch(`${baseUrl}/api/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_mode: false, language: 'en' }),
      })
      const data = await res.json()
      setSessionId(data.session_id)
      setQuestion(data.question)
      setProgress(Math.round(data.progression))
      setStep(data.step)
    } finally {
      setLoading(false)
    }
  }, [baseUrl])

  const sendAnswer = useCallback(async (answer) => {
    if (!sessionId) return
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, answer }),
      })
      
      if (res.status === 404) {
        // Session not found - server probably restarted, start a new game
        console.warn('Session lost, starting new game...')
        setRetryMessage("🔄 Session lost, restarting game...")
        setTimeout(() => setRetryMessage(''), 2000)
        await startGame()
        return
      }
      
      const data = await res.json()
      if (data?.guess) {
        setGuess(data.guess)
        setProgress(Math.round(data.progression || 0))
        setGameState('guessing')
      } else if (data?.question) {
        setQuestion(data.question)
        setProgress(Math.round(data.progression || 0))
        setStep(data.step)
      }
    } catch (error) {
      console.error('Error sending answer:', error)
      // On any error, try to start a new game
      await startGame()
    } finally {
      setLoading(false)
    }
  }, [baseUrl, sessionId, startGame])

  const submitFeedback = useCallback(async (correct) => {
    if (!sessionId) return
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, correct }),
      })
      
      if (res.status === 404) {
        // Session not found - server probably restarted, start a new game
        console.warn('Session lost during feedback, starting new game...')
        setRetryMessage("🔄 Session lost, restarting game...")
        setTimeout(() => setRetryMessage(''), 2000)
        await startGame()
        return
      }
      
      const data = await res.json()
      
      if (data.game_over) {
        setWinMessage(data.message)
        setShowWinPopup(true)
        setGameState('finished')
        setSessionId(null)
      } else {
        // Continue playing with new question after wrong guess
        const newQuestion = data.message.split('Next question: ')[1] || ''
        if (newQuestion) {
          setQuestion(newQuestion)
          setGuess(null)
          setProgress(0) // Reset progress for new attempt
          setGameState('playing')
          
          // Show retry message briefly
          setRetryMessage("🤔 Hmm, let me think of someone else...")
          setTimeout(() => setRetryMessage(''), 3000)
        } else {
          // Fallback - restart if we can't parse the question
          await startGame()
        }
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      // On any error, try to start a new game
      await startGame()
    } finally {
      setLoading(false)
    }
  }, [baseUrl, sessionId, startGame])

  const resetGame = useCallback(() => {
    setSessionId(null)
    setQuestion('')
    setProgress(0)
    setStep(0)
    setGuess(null)
    setShowWinPopup(false)
    setGameState('welcome')
    setRetryMessage('')
  }, [])

  useEffect(() => {
    // Initialize in welcome state
  }, [])

  return (
    <Page>
      <Container>
        <Header>
          <Title>🧞‍♂️ GuessMind</Title>
        </Header>

        {gameState === 'welcome' && (
          <WelcomeCard>
            <Subtitle>Think of any real or fictional character, and I'll try to guess who it is!</Subtitle>
            <div style={{ marginTop: '32px' }}>
              <Button onClick={startGame} disabled={loading}>
                {loading ? 'Starting...' : 'Start Game'}
              </Button>
            </div>
          </WelcomeCard>
        )}

        {(gameState === 'playing' || gameState === 'guessing') && (
          <GameArea>
            <ProgressBar value={progress} />
            
            {retryMessage && (
              <RetryBanner>
                {retryMessage}
              </RetryBanner>
            )}
            
            {gameState === 'playing' && question && (
              <QuestionCard question={question} onAnswer={sendAnswer} disabled={loading} />
            )}

            {gameState === 'guessing' && guess && (
              <ResultCard 
                guess={guess} 
                progression={progress} 
                onCorrect={() => submitFeedback(true)}
                onWrong={() => submitFeedback(false)}
                onRestart={startGame}
                loading={loading}
              />
            )}
          </GameArea>
        )}

        {showWinPopup && (
          <WinPopup onClick={resetGame}>
            <WinCard onClick={(e) => e.stopPropagation()}>
              <WinTitle>🎉</WinTitle>
              <WinMessage>{winMessage}</WinMessage>
              <Button onClick={resetGame}>
                Play Again
              </Button>
            </WinCard>
          </WinPopup>
        )}
      </Container>
    </Page>
  )
}

export default App
