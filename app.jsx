const { useState, useEffect } = React;

function App() {
  const [problemText, setProblemText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // Gemini AI 가짜 시뮬레이션 및 수학 로직
  const handleAnalyze = () => {
    if (!problemText.trim()) {
      alert("문제 텍스트를 입력해주세요!");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    // AI 통신을 시뮬레이션하기 위한 지연 시간 (2.5초)
    setTimeout(() => {
      // 1. "나누어 떨어진다" -> "evenly" 번역 검증 프로세스
      let processedText = problemText;
      if (processedText.includes("나누어 떨어진다") || processedText.includes("나누어 떨어")) {
         processedText += "\n(Gemini번역 변환: '...divides evenly...')";
      }

      // 2. 숫자를 추출하거나 임의의 숫자를 정답으로 가정함
      const baseValue = Math.floor(Math.random() * 50) + 10;
      
      // 3. 오답(Distractors) 생성 
      // 알고리즘: 정답보다 작은 수와 큰 수의 개수를 무작위로 결정하여 정답 위치를 완벽히 분산시킴 (Uniform Distribution)
      const smallerCount = Math.floor(Math.random() * 5); // 0, 1, 2, 3, 4 개
      const largerCount = 4 - smallerCount; 
      
      const optionsArray = [baseValue]; // 원래 정답

      // 정답보다 작은 오답 생성
      for(let i = 0; i < smallerCount; i++){
          optionsArray.push(baseValue - (i + 1) * 3 - Math.floor(Math.random()*2));
      }
      
      // 정답보다 큰 오답 생성
      for(let i = 0; i < largerCount; i++){
          optionsArray.push(baseValue + (i + 1) * 3 + Math.floor(Math.random()*2));
      }

      // 4. 반드시 **오름차순(Ascending)**으로 정렬
      optionsArray.sort((a, b) => a - b);

      // 5. 알파벳(A~E)과 결합
      const letters = ['A', 'B', 'C', 'D', 'E'];
      const finalOptions = optionsArray.map((val, index) => {
        return {
           label: letters[index],
           value: val,
           isCorrect: val === baseValue // 원래 정답 찾아냄
        };
      });

      const analysisResult = {
        translatedText: processedText,
        tags: ["대수학(Algebra)", "인수분해", "연산부하: Medium"],
        initialDifficulty: 7.2,
        options: finalOptions
      };

      setResult(analysisResult);
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <>
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      <header>
        <div className="logo">
          PrepMaster AI <span>Admin Dashboard</span>
        </div>
      </header>

      <main>
        {/* 왼쪽 섹션: 문제 입력 */}
        <section className="card input-section">
          <h2>1. 수학 문제 업로드</h2>
          
          <div className="upload-area">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '10px'}}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <p>이미지를 드래그 앤 드롭 하세요</p>
            <p style={{fontSize: '0.8rem', marginTop: '5px'}}>(또는 클릭하여 선택)</p>
          </div>

          <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', margin: '5px 0'}}>OR</p>

          <textarea 
            className="textarea-input" 
            placeholder="수학 문제 텍스트를 직접 입력하세요.&#13;&#10;(예: x는 15로 나누어 떨어진다. x의 값을 구하시오.)"
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
          ></textarea>

          <button 
            className="btn-primary" 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <><span className="spinner"></span> Gemini 3.1 Pro 분석 중...</>
            ) : "✨ AI 문제 태깅 및 분산 로직 실행"}
          </button>
        </section>

        {/* 오른쪽 섹션: AI 분석 결과 */}
        <section className="card output-section">
          <h2>2. AI 분석 결과 (Firestore 저장 대기)</h2>
          
          {isAnalyzing && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px'}}>
               <div className="skeleton"></div>
               <div className="skeleton" style={{width: '70%'}}></div>
               <div className="skeleton" style={{width: '85%'}}></div>
               <div style={{marginTop: '20px'}}>정답 알파벳 완벽 분산 알고리즘 처리중...</div>
               <div className="skeleton" style={{height: '150px', borderRadius: '12px'}}></div>
            </div>
          )}

          {!isAnalyzing && !result && (
            <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569'}}>
              좌측에서 문제를 입력하고 실행해 주세요.
            </div>
          )}

          {!isAnalyzing && result && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '25px', animation: 'fadeIn 0.5s'}}>
              
              <div>
                 <h3 style={{fontSize: '0.9rem', color: '#94a3b8', marginBottom: '10px'}}>자동 추출 태그</h3>
                 <div className="tags-row">
                    {result.tags.map((tag, idx) => (
                      <span key={idx} className="tag-chip">✓ {tag}</span>
                    ))}
                    <span className="tag-chip" style={{color: '#f472b6', borderColor: 'rgba(244,114,182,0.3)', background: 'rgba(244,114,182,0.1)'}}>
                       AI 초기 난이도: {result.initialDifficulty}
                    </span>
                 </div>
              </div>

              <div>
                 <h3 style={{fontSize: '0.9rem', color: '#94a3b8', marginBottom: '10px'}}>수학 번역 처리 ("evenly" 강제 규정 적용)</h3>
                 <div style={{background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem'}}>
                    {result.translatedText}
                 </div>
              </div>

              <div>
                 <h3 style={{fontSize: '0.9rem', color: '#94a3b8', marginBottom: '10px'}}>생성된 보기 (반드시 오름차순 정렬)</h3>
                 <div className="options-list">
                    {result.options.map((opt, idx) => (
                      <div key={idx} className={`option-item ${opt.isCorrect ? 'correct' : ''}`}>
                         <div className="option-label">
                            <span className="option-letter">{opt.label}</span>
                            <span className="option-value">{opt.value}</span>
                         </div>
                         {opt.isCorrect && <span className="badge">정답 자동분산 됨</span>}
                      </div>
                    ))}
                 </div>
              </div>

              <button className="btn-primary" style={{marginTop: 'auto', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}>
                 ☁️ Firebase Firestore에 저장
              </button>
            </div>
          )}

        </section>
      </main>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
