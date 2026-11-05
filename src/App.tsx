import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Check, ChevronRight, CircleHelp, Flame, Gem, House, Mic2, Play, RotateCcw, Sparkles, Target, Trophy, X, Zap } from 'lucide-react'
import { lessons, phrases, quizQuestions, type Phrase } from './content'

type Page = 'home' | 'learn' | 'practice' | 'progress'
type Saved = { xp: number; completed: string[]; answered: number[]; lastDay: string; streak: number; missionDay: string }
const STORAGE_KEY = 'mandarin-quest-progress-v1'
const EMPTY: Saved = { xp: 0, completed: [], answered: [], lastDay: '', streak: 0, missionDay: '' }
function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` }
function dayDiff(a: string, b: string) { return Math.round((new Date(b).setHours(0,0,0,0) - new Date(a).setHours(0,0,0,0)) / 86400000) }
function readSaved(): Saved { try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } } catch { return EMPTY } }
function phraseFor(index: number): Phrase { return phrases[index] }

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [saved, setSaved] = useState<Saved>(readSaved)
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const [qIndex, setQIndex] = useState(0)
  const [choice, setChoice] = useState<string | null>(null)
  const [wordOrder, setWordOrder] = useState<string[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)) }, [saved])
  const xp = saved.xp
  const level = Math.floor(xp / 100) + 1
  const levelXp = xp % 100
  const completedCount = saved.completed.length
  const currentLesson = lessons.find(lesson => lesson.id === activeLesson)
  const missionDone = saved.missionDay === todayKey()
  const question = quizQuestions[qIndex % quizQuestions.length]
  const progressPercent = Math.min(100, Math.round((saved.answered.length / quizQuestions.length) * 100))
  const phraseMastery = useMemo(() => Math.min(phrases.length, new Set(saved.answered.flatMap(i => {
    const q = quizQuestions[i]
    return q?.prompt === '等一下' ? [3] : q?.prompt === '站在前面' ? [4] : q?.prompt.includes('拍照') ? [2] : []
  })).size), [saved.answered])

  function earn(points: number) {
    const now = todayKey()
    setSaved(prev => ({ ...prev, xp: prev.xp + points, streak: prev.lastDay === now ? prev.streak : prev.lastDay && dayDiff(prev.lastDay, now) === 1 ? prev.streak + 1 : 1, lastDay: now }))
  }
  function startLesson(id: string) { setActiveLesson(id); setPage('learn'); window.scrollTo(0, 0) }
  function completeLesson(id: string) {
    setSaved(prev => prev.completed.includes(id) ? prev : ({ ...prev, completed: [...prev.completed, id] }))
    if (!saved.completed.includes(id)) earn(20)
    setActiveLesson(null); setPage('learn')
  }
  function answer(option: string) {
    if (showAnswer) return
    setChoice(option); setShowAnswer(true)
    if (option === question.answer) {
      const id = qIndex % quizQuestions.length
      const firstMastery = !saved.answered.includes(id)
      const newDailyMission = saved.missionDay !== todayKey()
      const bonus = (firstMastery ? 10 : 0) + (newDailyMission ? 10 : 0)
      if (bonus) earn(bonus)
      setSaved(prev => ({ ...prev, answered: firstMastery ? [...prev.answered, id] : prev.answered, missionDay: todayKey() }))
    }
  }
  function nextQuestion() { setQIndex(qIndex + 1); setChoice(null); setWordOrder([]); setShowAnswer(false) }
  function addSentenceWord(word: string) {
    if (showAnswer) return
    const next = [...wordOrder, word]
    setWordOrder(next)
    if (next.length === question.options.length) answer(`${next.join('')}。`)
  }
  function go(next: Page) { setPage(next); setActiveLesson(null); setMenuOpen(false); window.scrollTo(0, 0) }

  return <div className="app-shell min-h-screen">
    <aside className="sidebar">
      <button className="brand" onClick={() => go('home')}><span className="brand-mark">✦</span><span className="brand-name">mandarin<span>quest</span></span></button>
      <div className="side-label">YOUR ADVENTURE</div>
      <NavButton icon={<House />} label="Home base" active={page === 'home'} onClick={() => go('home')} />
      <NavButton icon={<BookOpen />} label="Learning path" active={page === 'learn'} onClick={() => go('learn')} />
      <NavButton icon={<Target />} label="Quick practice" active={page === 'practice'} onClick={() => go('practice')} />
      <NavButton icon={<Trophy />} label="My progress" active={page === 'progress'} onClick={() => go('progress')} />
      <div className="sidebar-spacer" />
      <div className="tutor-card"><div className="tutor-face">👩🏻‍🏫</div><div><strong>Jia la, you got this!</strong><p>One small step today ✨</p></div><Sparkles size={17} /></div>
      <div className="sidebar-footer">Made for your Mandarin journey <span>🇲🇾</span></div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="mobile-brand" onClick={() => go('home')}><span className="brand-mark">✦</span><span className="brand-name">mandarin<span>quest</span></span></button>
        <div className="breadcrumb"><span>MY LEARNING SPACE</span><ChevronRight size={14} /><b>{page === 'home' ? 'Home base' : page === 'learn' ? 'Learning path' : page === 'practice' ? 'Quick practice' : 'My progress'}</b></div>
        <div className="top-stats"><div className="streak-pill"><Flame size={17} fill="#ff8e69" stroke="#ff8e69"/><b>{saved.streak}</b><span>day streak</span></div><div className="xp-pill"><Gem size={16} fill="#ffd766" stroke="#e7ad37"/><b>{xp}</b><span>XP</span></div><button className="avatar" aria-label="Profile menu" onClick={() => setMenuOpen(!menuOpen)}>A</button>
          {menuOpen && <div className="profile-menu"><b>Hey, adventurer!</b><span>Level {level} · Beginner</span><button onClick={() => { if (confirm('Reset your saved learning progress?')) { localStorage.removeItem(STORAGE_KEY); setSaved(EMPTY); setMenuOpen(false) } }}>Reset progress</button></div>}</div>
      </header>

      {page === 'home' && <HomePage saved={saved} level={level} levelXp={levelXp} completedCount={completedCount} missionDone={missionDone} startLesson={startLesson} go={go} />}
      {page === 'learn' && (activeLesson === 'pinyin' ? <PinyinPage onBack={() => setActiveLesson(null)} onPractice={() => go('practice')} /> : currentLesson ? <LessonPage lesson={currentLesson} onBack={() => setActiveLesson(null)} onComplete={() => completeLesson(currentLesson.id)} onPractice={() => { setActiveLesson(null); go('practice') }} /> : <LearnPage saved={saved} startLesson={startLesson} />)}
      {page === 'practice' && <PracticePage qIndex={qIndex} question={question} choice={choice} wordOrder={wordOrder} showAnswer={showAnswer} answered={saved.answered.length} onAnswer={answer} onAddWord={addSentenceWord} onNext={nextQuestion} />}
      {page === 'progress' && <ProgressPage saved={saved} progressPercent={progressPercent} phraseMastery={phraseMastery} level={level} />}
      <footer className="page-footer"><span>Small steps, steady progress. <b>慢慢来，比较快。</b></span><span>Màn man lái, bǐ jiào kuài. · Take it step by step 🌱</span></footer>
    </main>
    <nav className="mobile-nav">
      <MobileNavButton icon={<House />} label="Home" active={page === 'home'} onClick={() => go('home')} />
      <MobileNavButton icon={<BookOpen />} label="Learn" active={page === 'learn'} onClick={() => go('learn')} />
      <MobileNavButton icon={<Target />} label="Practice" active={page === 'practice'} onClick={() => go('practice')} />
      <MobileNavButton icon={<Trophy />} label="Progress" active={page === 'progress'} onClick={() => go('progress')} />
    </nav>
  </div>
}

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={`nav-item ${active ? 'active' : ''}`}>{icon}<span>{label}</span>{active && <span className="nav-dot"/>}</button> }
function MobileNavButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={active ? 'selected' : ''}>{icon}<span>{label}</span></button> }

function HomePage({ saved, level, levelXp, completedCount, missionDone, startLesson, go }: { saved: Saved; level: number; levelXp: number; completedCount: number; missionDone: boolean; startLesson: (id: string) => void; go: (page: Page) => void }) {
  const recommended = lessons.find(l => !saved.completed.includes(l.id)) || lessons[0]
  const weekday = new Intl.DateTimeFormat('en-MY', { weekday: 'long', timeZone: 'Asia/Kuala_Lumpur' }).format(new Date()).toUpperCase()
  return <div className="page-content home-content">
    <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot"/>{weekday}, YOUR ADVENTURE CONTINUES</div><h1>Selamat datang, adventurer! <span>👋</span></h1><p className="welcome-sub">Ready for a little Mandarin today? Jom, one small quest at a time.</p></div><div className="welcome-mascot">🐼<span className="mascot-spark s1">✦</span><span className="mascot-spark s2">✧</span></div></section>
    <section className="hero-card"><div className="hero-copy"><div className="hero-kicker"><Zap size={14} fill="currentColor"/> TODAY'S LITTLE QUEST</div><h2>{saved.completed.length ? 'Keep the good streak going!' : 'Your first quest is waiting!'}</h2><p>Practise useful phrases for everyday moments. Hari ini kita belajar <b>minta tolong</b> & <b>ambil gambar</b>.</p><button className="primary-button" onClick={() => startLesson(recommended.id)}><Play size={16} fill="currentColor"/> Start today’s quest <ArrowRight size={16}/></button><div className="hero-meta"><span><span className="tiny-clock">◷</span> 5 min</span><span>·</span><span>Beginner friendly</span><span>·</span><span>+20 XP</span></div></div><div className="hero-art"><div className="art-sun"/><div className="art-cloud">☁</div><div className="art-hill hill-back"/><div className="art-hill hill-front"/><div className="art-character">🐼</div><div className="art-bubble"><span>你好！</span><small>nǐ hǎo!</small></div><div className="art-flower">✿</div></div><div className="hero-dots">•••</div></section>
    <section className="stats-row"><div className="stat-card"><div className="stat-icon orange"><Flame size={20}/></div><div><span>DAILY STREAK</span><b>{saved.streak} <small>{saved.streak === 1 ? 'day' : 'days'}</small></b><p>Keep showing up 🔥</p></div><div className="mini-spark">✦</div></div><div className="stat-card"><div className="stat-icon yellow"><Gem size={20}/></div><div><span>TOTAL XP</span><b>{saved.xp} <small>XP</small></b><p>Level {level} · {100 - levelXp} XP to next</p></div><div className="mini-spark">✦</div></div><div className="stat-card"><div className="stat-icon mint"><BadgeCheck size={20}/></div><div><span>LESSONS DONE</span><b>{completedCount} <small>of {lessons.length}</small></b><p>Nice steady progress!</p></div><div className="mini-spark">✦</div></div></section>
    <section className="home-lower"><div className="journey-panel"><div className="section-heading"><div><div className="eyebrow">YOUR LEARNING PATH</div><h3>Choose your next step</h3></div><button className="text-button" onClick={() => go('learn')}>See all <ArrowRight size={14}/></button></div><div className="journey-list">{lessons.slice(0, 3).map(lesson => <button className="journey-row" onClick={() => startLesson(lesson.id)} key={lesson.id}><div className={`journey-number ${saved.completed.includes(lesson.id) ? 'done' : lesson.color}`}>{saved.completed.includes(lesson.id) ? <Check size={18}/> : lesson.icon}</div><div className="journey-info"><span>{lesson.world.toUpperCase()}</span><b>{lesson.title}</b><small>{lesson.subtitle}</small></div><div className="journey-time">{saved.completed.includes(lesson.id) ? 'Completed ✓' : lesson.duration}</div><ChevronRight size={17} className="journey-arrow"/></button>)}</div></div>
      <div className="side-column"><div className="daily-card"><div className="daily-title"><div><div className="eyebrow">LITTLE BY LITTLE</div><h3>Daily mission</h3></div><div className="mission-icon">🎯</div></div><p>Get one answer right in Quick Practice. A small win counts!</p><div className="mission-progress"><span style={{ width: missionDone ? '100%' : '0%' }}/></div><div className="mission-foot"><span>{missionDone ? 'Mission complete!' : '0 of 1 answer correct'}</span><b>+10 XP</b></div><button className="mission-button" onClick={() => go('practice')}>{missionDone ? 'Practise again' : 'Start mission'} <ArrowRight size={15}/></button></div><div className="tutor-tip"><div className="tip-icon">💡</div><div><b>Jia’s little tip</b><p>Pattern dulu, perkataan kemudian. Reuse one sentence and swap the action — easy way to start speaking!</p></div><span className="tip-star">✦</span></div></div></section>
  </div>
}

function LearnPage({ saved, startLesson }: { saved: Saved; startLesson: (id: string) => void }) {
  return <div className="page-content"><div className="page-title-row"><div><div className="eyebrow">LESSONS BUILT FOR REAL LIFE</div><h1>Learning path <span>🗺️</span></h1><p>Build from useful actions to everyday conversations. Sikit-sikit lama-lama jadi bukit!</p></div><div className="path-progress"><div className="path-progress-icon">🌱</div><span>YOUR JOURNEY</span><b>{saved.completed.length} / {lessons.length} lessons</b><div className="progress-track"><span style={{ width: `${saved.completed.length / lessons.length * 100}%` }}/></div></div></div>
    <button className="pinyin-starter" onClick={() => startLesson('pinyin')}><div className="pinyin-starter-mark">ā</div><div><span>WORLD 01 · FIRST STEPS</span><b>Pinyin & the four tones</b><small>Hear the difference on the same syllable · 3 min</small></div><ArrowRight size={18}/></button>
    <div className="world-banner"><div className="world-badge">🌤️</div><div><span>WORLD 02 · EVERYDAY COMMUNICATION</span><h2>Mandarin for your day-to-day</h2><p>Learn what you can say and do — not just a list of things.</p></div><div className="world-decoration">✦</div></div>
    <div className="lesson-grid">{lessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} done={saved.completed.includes(lesson.id)} onClick={() => startLesson(lesson.id)} />)}</div>
    <div className="layer-note"><div className="layer-icon">🇲🇾</div><div><b>Our Mandarin, your Malaysian context</b><p>We start with standard Mandarin and clear Pinyin. Local expressions are labelled when they appear; “lah”, “leh” and “lor” are local code-switching, not Mandarin vocabulary. Usage differs from person to person.</p></div><span className="layer-stamp">MALAYSIA<br/>FRIENDLY</span></div>
  </div>
}

function PinyinPage({ onBack, onPractice }: { onBack: () => void; onPractice: () => void }) {
  const tones = [
    { mark: 'mā', name: 'First tone', shape: '—', color: 'tone-one', word: '妈', meaning: 'mum', note: 'High and steady — macam hum a level note.' },
    { mark: 'má', name: 'Second tone', shape: '↗', color: 'tone-two', word: '麻', meaning: 'hemp', note: 'Rise your voice, as if asking “hah?”' },
    { mark: 'mǎ', name: 'Third tone', shape: '∨', color: 'tone-three', word: '马', meaning: 'horse', note: 'Low dip, then rise when said alone.' },
    { mark: 'mà', name: 'Fourth tone', shape: '↘', color: 'tone-four', word: '骂', meaning: 'scold', note: 'A short, firm fall — macam “stop!”' },
    { mark: 'ma', name: 'Neutral tone', shape: '·', color: 'tone-neutral', word: '吗', meaning: 'question particle', note: 'Light and quick. 吗 turns this into a yes/no question.' },
  ]
  return <div className="page-content pinyin-page"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Learning path</button><div className="pinyin-hero"><div className="pinyin-big">ā á ǎ à</div><div><div className="eyebrow">WORLD 01 · FIRST STEPS</div><h1>Meet the Mandarin tones</h1><p>Same sound, different tone = different meaning. Kita tengok satu-satu — no need to rush.</p></div></div><div className="tone-grid">{tones.map(tone => <article className={`tone-card ${tone.color}`} key={tone.name}><div className="tone-card-head"><b>{tone.name}</b><span>{tone.shape}</span></div><div className="tone-syllable">{tone.mark}</div><div className="tone-example"><b>{tone.word}</b><span>{tone.meaning}</span></div><p>{tone.note}</p></article>)}</div><div className="pinyin-context"><div className="pinyin-context-icon">🗣️</div><div><b>One useful reminder</b><p>Pinyin shows you how to pronounce a character; it isn’t English spelling. Tone marks sit over the vowel: mā, má, mǎ, mà. In a real phrase tones can change slightly — we’ll practise those in context too.</p><p className="ms-note">Tip: mula dengan sebutan standard. Accent sendiri okay; clarity is the goal.</p></div></div><div className="pinyin-actions"><button className="primary-button" onClick={onPractice}><Target size={16}/> Try a Pinyin challenge <ArrowRight size={16}/></button><button className="text-button" onClick={onBack}>Back to learning path</button></div></div>
}

function LessonCard({ lesson, done, onClick }: { lesson: typeof lessons[number]; done: boolean; onClick: () => void }) {
  return <article className={`lesson-card ${lesson.color}`}><div className="lesson-card-top"><span className="lesson-icon">{lesson.icon}</span><span className="lesson-world">{lesson.world.toUpperCase()}</span>{done && <span className="completed-badge"><Check size={12}/> DONE</span>}</div><h3>{lesson.title}</h3><p>{lesson.subtitle}</p><div className="lesson-card-bottom"><span>◷ {lesson.duration}</span><span>{lesson.phrases.length} useful phrases</span></div><button className="lesson-open" onClick={onClick}>{done ? 'Review lesson' : 'Start lesson'} <ArrowRight size={15}/></button><div className="card-deco">✦</div></article>
}

function LessonPage({ lesson, onBack, onComplete, onPractice }: { lesson: typeof lessons[number]; onBack: () => void; onComplete: () => void; onPractice: () => void }) {
  return <div className="page-content lesson-detail"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> All lessons</button><div className={`lesson-hero ${lesson.color}`}><div className="lesson-hero-icon">{lesson.icon}</div><div><div className="eyebrow">{lesson.world.toUpperCase()} · {lesson.duration.toUpperCase()}</div><h1>{lesson.title}</h1><p>{lesson.subtitle} — jom cuba dalam ayat yang boleh terus guna.</p></div><div className="lesson-hero-stamp">QUEST<br/>STARTED</div></div>
    <div className="lesson-columns"><div className="lesson-main"><div className="section-heading"><div><div className="eyebrow">SAY IT IN A REAL SITUATION</div><h3>Useful phrases</h3></div><span className="phrase-count">{lesson.phrases.length} phrases</span></div>{lesson.phrases.map((index, i) => <PhraseCard phrase={phraseFor(index)} index={i + 1} key={index}/>)}</div><aside className="lesson-aside"><div className="pattern-card"><div className="pattern-icon">🧩</div><div className="eyebrow">SENTENCE PATTERN</div><h3>{lesson.pattern.meaning}</h3><div className="pattern-form">{lesson.pattern.form}</div><div className="pattern-pinyin">{lesson.pattern.pinyin}</div><p>{lesson.pattern.tip}</p><div className="pattern-example"><span>TRY THIS</span><b>{phraseFor(lesson.phrases[0]).example}</b><small>{phraseFor(lesson.phrases[0]).exampleEn}</small></div></div><div className="tutor-note"><div>👩🏻‍🏫</div><p><b>Jia says:</b> “Tak perlu hafal semua sekali. Cuba sebut dalam kepala, then guna satu phrase hari ini. That’s already a win!”</p></div><button className="primary-button full" onClick={onPractice}><Target size={16}/> Practise these phrases <ArrowRight size={16}/></button><button className="complete-button" onClick={onComplete}><Check size={16}/> Mark lesson complete <span>+20 XP</span></button><p className="audio-note"><Mic2 size={15}/> No recording attached yet. Pinyin is shown to guide pronunciation.</p></aside></div>
  </div>
}

function PhraseCard({ phrase, index }: { phrase: Phrase; index: number }) {
  return <article className="phrase-card"><div className="phrase-icon">{phrase.icon}</div><div className="phrase-content"><div className="phrase-top"><span className="phrase-category">{phrase.kind}</span><span className="phrase-index">0{index}</span></div><div className="phrase-word"><b>{phrase.hanzi}</b><span>{phrase.pinyin}</span></div><div className="phrase-translations"><span>🇬🇧 {phrase.en}</span><span>🇲🇾 {phrase.ms}</span></div><div className="example-box"><span className="example-label">IN A SENTENCE</span><b>{phrase.example}</b><span className="example-pinyin">{phrase.examplePinyin}</span><div className="example-trans"><span>“{phrase.exampleEn}”</span><span>“{phrase.exampleMs}”</span></div></div>{phrase.note && <div className="usage-note"><CircleHelp size={13}/><span>{phrase.note}</span></div>}</div></article>
}

function PracticePage({ qIndex, question, choice, wordOrder, showAnswer, answered, onAnswer, onAddWord, onNext }: { qIndex: number; question: typeof quizQuestions[number]; choice: string | null; wordOrder: string[]; showAnswer: boolean; answered: number; onAnswer: (answer: string) => void; onAddWord: (word: string) => void; onNext: () => void }) {
  const isCorrect = choice === question.answer
  const isBuilder = question.type === 'Build the sentence'
  return <div className="page-content practice-content">
    <div className="practice-heading"><div><div className="eyebrow">QUICK PRACTICE · MIXED CHALLENGE</div><h1>Show what you can do <span>🧠</span></h1><p>Meaning, Hanzi, Pinyin and real-life replies. Try a few, no pressure lah.</p></div><div className="practice-score"><span><Gem size={17}/> PRACTICE XP</span><b>{answered * 10}</b></div></div>
    <div className="practice-layout"><div className="quiz-panel">
      <div className="quiz-top"><span className="quiz-type"><Sparkles size={14}/>{question.type}</span><span>ROUND {qIndex + 1}</span></div>
      <div className="quiz-progress"><span style={{ width: `${((qIndex % quizQuestions.length) + 1) / quizQuestions.length * 100}%` }}/></div>
      <div className="question-card"><div className="question-spark">✦</div><div className="question-label">{isBuilder ? 'TAP WORDS IN THE RIGHT ORDER' : question.type === 'Choose the meaning' || question.type === 'Choose the Hanzi' || question.type === 'Choose the Pinyin' ? 'PICK THE BEST ANSWER' : 'COMPLETE THE MOMENT'}</div><h2 className={question.prompt.match(/[㐀-鿿]/) ? 'hanzi-question' : ''}>{question.prompt}</h2>{question.pinyin && <span className="question-pinyin">{question.pinyin}</span>}</div>
      {isBuilder && <div className="sentence-slots">{wordOrder.length ? wordOrder.join('') : <span>Tap the words below to build your sentence</span>}</div>}
      <div className="answer-list">{question.options.map((option, i) => { const correct = showAnswer && option === question.answer; const wrong = showAnswer && option === choice && !isCorrect; const used = isBuilder && wordOrder.includes(option); return <button key={`${qIndex}-${option}`} className={`answer-option ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`} onClick={() => isBuilder ? onAddWord(option) : onAnswer(option)} disabled={showAnswer || used}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>{(correct || used) && <Check size={18}/ >}{wrong && <X size={18}/>}</button> })}</div>
      {showAnswer && <div className={`feedback ${isCorrect ? 'good' : 'try-again'}`}><span className="feedback-icon">{isCorrect ? '🎉' : '💛'}</span><div><b>{isCorrect ? 'Betul! Nice one!' : 'Not quite — kita belajar sama-sama.'}</b><p>{isCorrect ? question.hint : `The answer is “${question.answer}”. ${question.hint}`}</p></div><span className="feedback-xp">{isCorrect ? '+10 XP' : 'Keep going!'}</span></div>}
      <div className="quiz-actions"><button className="skip-button" onClick={onNext}><RotateCcw size={15}/> Skip this one</button>{showAnswer && <button className="primary-button" onClick={onNext}>Next question <ArrowRight size={16}/></button>}</div><div className="answer-counter"><span>{answered} questions answered correctly</span><span>Answers repeat to help you remember</span></div>
    </div><aside className="practice-aside"><div className="practice-aside-card"><div className="practice-aside-art">🐼<span>✦</span></div><div className="eyebrow">A FRIENDLY REMINDER</div><h3>It’s okay to get it wrong.</h3><p>Learning happens when you try. Setiap kali cuba, you’re building confidence to use Mandarin in real life.</p><div className="aside-phrase"><span>TODAY'S PHRASE</span><b>帮我一下</b><small>bāng wǒ yí xià · help me a moment</small></div></div><div className="practice-aside-card mini"><div className="aside-mini-icon">💬</div><div><b>Local chat, clear labels</b><p>We label standard Mandarin and local code-switching separately.</p></div></div></aside></div>
  </div>
}
function ProgressPage({ saved, progressPercent, phraseMastery, level }: { saved: Saved; progressPercent: number; phraseMastery: number; level: number }) {
  const achievement = [{ icon: '🌱', name: 'First steps', desc: 'Complete your first lesson', earned: saved.completed.length > 0 }, { icon: '✨', name: 'Curious mind', desc: 'Answer 3 practice questions', earned: saved.answered.length >= 3 }, { icon: '🔥', name: 'Show up', desc: 'Build a 3-day streak', earned: saved.streak >= 3 }, { icon: '🗺️', name: 'Pathfinder', desc: 'Complete 3 lessons', earned: saved.completed.length >= 3 }]
  return <div className="page-content progress-content"><div className="eyebrow">YOUR EFFORT, MADE VISIBLE</div><h1>Look how far you’ve come <span>🌟</span></h1><p className="progress-lede">XP rewards the effort. Mastery grows when you can use a phrase — we track those separately.</p><div className="level-card"><div className="level-emblem">{level < 2 ? '🌱' : '🌿'}</div><div className="level-info"><span>YOUR ADVENTURER LEVEL</span><h2>Level {level} · Curious beginner</h2><p>{100 - saved.xp % 100} XP to your next level</p><div className="level-track"><span style={{ width: `${saved.xp % 100}%` }}/></div></div><div className="level-total"><b>{saved.xp}</b><span>TOTAL XP</span></div></div><div className="progress-stat-grid"><div className="progress-stat"><div className="progress-stat-icon peach-icon"><Flame/></div><span>DAILY STREAK</span><b>{saved.streak} days</b><small>Come back tomorrow to keep it going</small></div><div className="progress-stat"><div className="progress-stat-icon yellow-icon"><BookOpen/></div><span>LESSONS COMPLETED</span><b>{saved.completed.length} <i>/ {lessons.length}</i></b><small>Learning path progress</small></div><div className="progress-stat"><div className="progress-stat-icon mint-icon"><Target/></div><span>PRACTICE MASTERY</span><b>{progressPercent}%</b><small>{saved.answered.length} of {quizQuestions.length} challenge types answered</small></div></div><div className="mastery-panel"><div className="section-heading"><div><div className="eyebrow">SKILLS IN THE MAKING</div><h3>What you’re learning</h3></div><span className="mastery-tag">MASTERY ≠ XP</span></div><div className="mastery-row"><div className="mastery-emoji">🀄</div><div className="mastery-text"><b>Hanzi & useful phrases</b><span>Recognise actions in context</span></div><div className="mastery-bar"><span style={{ width: `${Math.min(100, phraseMastery / 3 * 100)}%` }}/></div><b className="mastery-count">{phraseMastery} phrases</b></div><div className="mastery-row"><div className="mastery-emoji">🧩</div><div className="mastery-text"><b>Sentence patterns</b><span>Build your own request</span></div><div className="mastery-bar"><span style={{ width: `${saved.completed.length / lessons.length * 100}%` }}/></div><b className="mastery-count">{saved.completed.length} patterns</b></div><div className="mastery-row"><div className="mastery-emoji">💬</div><div className="mastery-text"><b>Everyday conversations</b><span>Choose a natural reply</span></div><div className="mastery-bar"><span style={{ width: `${saved.answered.includes(3) ? 100 : 0}%` }}/></div><b className="mastery-count">{saved.answered.includes(3) ? '1 reply' : 'Keep practising'}</b></div></div><div className="achievements-panel"><div className="section-heading"><div><div className="eyebrow">LITTLE WINS COUNT</div><h3>Your achievements</h3></div><span className="achievement-count">{achievement.filter(a => a.earned).length} / {achievement.length} unlocked</span></div><div className="achievement-grid">{achievement.map(item => <div key={item.name} className={`achievement-item ${item.earned ? '' : 'locked'}`}><div>{item.earned ? item.icon : '🔒'}</div><b>{item.name}</b><span>{item.desc}</span>{item.earned && <small><Check size={12}/> UNLOCKED</small>}</div>)}</div></div></div>
}
