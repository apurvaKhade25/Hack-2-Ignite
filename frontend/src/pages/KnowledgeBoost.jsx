import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, XCircle, Sparkles } from 'lucide-react'
import Sidebar from '../components/Sidebar'

const questions = {
  'World & Geography': [
    {
      q: 'Which is the largest ocean on Earth?',
      options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
      answer: 2,
      fact: 'The Pacific Ocean is the largest and deepest ocean on Earth.'
    },
    {
      q: 'Which country has the largest population?',
      options: ['India', 'USA', 'China', 'Brazil'],
      answer: 0,
      fact: 'India is currently the world’s most populous country.'
    },
    {
      q: 'Which is the longest river in South America?',
      options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
      answer: 0,
      fact: 'The Amazon River flows through several South American countries.'
    },
    {
      q: 'Which continent is the Sahara Desert located in?',
      options: ['Asia', 'Africa', 'Australia', 'Europe'],
      answer: 1,
      fact: 'The Sahara covers much of northern Africa.'
    },
    {
      q: 'Which country is known as the Land of the Rising Sun?',
      options: ['China', 'Thailand', 'Japan', 'South Korea'],
      answer: 2,
      fact: 'Japan is traditionally known as the Land of the Rising Sun.'
    }
  ],

  Science: [
    {
      q: 'Which planet has the shortest day in our solar system?',
      options: ['Earth', 'Jupiter', 'Mars', 'Venus'],
      answer: 1,
      fact: 'Jupiter completes one rotation in about 10 hours.'
    },
    {
      q: 'What gas do plants mainly absorb from the atmosphere?',
      options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
      answer: 2,
      fact: 'Plants use carbon dioxide during photosynthesis.'
    },
    {
      q: 'What is the center of an atom called?',
      options: ['Electron', 'Nucleus', 'Proton', 'Shell'],
      answer: 1,
      fact: 'The nucleus contains protons and neutrons.'
    },
    {
      q: 'How many bones does an adult human usually have?',
      options: ['106', '206', '306', '406'],
      answer: 1,
      fact: 'A typical adult human skeleton has 206 bones.'
    },
    {
      q: 'What force keeps us on the ground?',
      options: ['Magnetism', 'Friction', 'Gravity', 'Electricity'],
      answer: 2,
      fact: 'Gravity attracts objects toward the Earth.'
    }
  ],

  Psychology: [
    {
      q: 'Which part of the brain is strongly associated with memory formation?',
      options: ['Hippocampus', 'Cerebellum', 'Brain stem', 'Medulla'],
      answer: 0,
      fact: 'The hippocampus plays an important role in forming and organizing memories.'
    },
    {
      q: 'What is the ability to understand another person’s feelings called?',
      options: ['Empathy', 'Reflex', 'Attention', 'Perception'],
      answer: 0,
      fact: 'Empathy involves understanding or sharing another person’s emotional experience.'
    },
    {
      q: 'Which can help improve concentration?',
      options: ['Constant multitasking', 'Regular breaks', 'Skipping sleep', 'Ignoring distractions'],
      answer: 1,
      fact: 'Short, regular breaks can help maintain attention during demanding tasks.'
    },
    {
      q: 'What is a habit?',
      options: [
        'A repeated behavior',
        'A type of emotion',
        'A memory disorder',
        'A physical injury'
      ],
      answer: 0,
      fact: 'Habits are behaviors that become repeated and often automatic over time.'
    },
    {
      q: 'Which emotion is commonly associated with smiling?',
      options: ['Joy', 'Fear', 'Anger', 'Confusion'],
      answer: 0,
      fact: 'Smiling is commonly associated with positive emotions such as joy.'
    }
  ],

  Technology: [
    {
      q: 'What does CPU stand for?',
      options: [
        'Central Processing Unit',
        'Computer Personal Unit',
        'Central Program Utility',
        'Computer Processing Utility'
      ],
      answer: 0,
      fact: 'CPU stands for Central Processing Unit, which executes instructions in a computer.'
    },
    {
      q: 'Which language is primarily used to style web pages?',
      options: ['HTML', 'CSS', 'SQL', 'Java'],
      answer: 1,
      fact: 'CSS controls the visual presentation and layout of web pages.'
    },
    {
      q: 'What does URL stand for?',
      options: [
        'Universal Resource Link',
        'Uniform Resource Locator',
        'User Resource Location',
        'Uniform Reference Link'
      ],
      answer: 1,
      fact: 'URL stands for Uniform Resource Locator.'
    },
    {
      q: 'Which technology is commonly used to store data in tables?',
      options: ['SQL databases', 'HTML', 'CSS', 'Bluetooth'],
      answer: 0,
      fact: 'Relational databases commonly organize data into tables.'
    },
    {
      q: 'What does AI stand for?',
      options: [
        'Automated Internet',
        'Artificial Intelligence',
        'Advanced Information',
        'Application Interface'
      ],
      answer: 1,
      fact: 'AI stands for Artificial Intelligence.'
    }
  ],

  'Movies & Entertainment': [
    {
      q: 'Which fictional superhero is known as the Dark Knight?',
      options: ['Superman', 'Iron Man', 'Batman', 'Thor'],
      answer: 2,
      fact: 'Batman is famously known as the Dark Knight.'
    },
    {
      q: 'Which film series features the character Jack Sparrow?',
      options: ['Harry Potter', 'Pirates of the Caribbean', 'Star Wars', 'Jurassic Park'],
      answer: 1,
      fact: 'Jack Sparrow is the famous pirate character from Pirates of the Caribbean.'
    },
    {
      q: 'Which instrument has black and white keys?',
      options: ['Guitar', 'Piano', 'Violin', 'Flute'],
      answer: 1,
      fact: 'A standard piano has a set of black and white keys.'
    },
    {
      q: 'Which genre is primarily designed to make people laugh?',
      options: ['Comedy', 'Horror', 'Thriller', 'Documentary'],
      answer: 0,
      fact: 'Comedy focuses on humor and entertaining audiences through laughter.'
    },
    {
      q: 'What is the name of a movie’s written dialogue and action plan?',
      options: ['Poster', 'Script', 'Trailer', 'Review'],
      answer: 1,
      fact: 'A screenplay or script contains the dialogue and planned action of a film.'
    }
  ],

  History: [
    {
      q: 'Who was the first person to walk on the Moon?',
      options: ['Yuri Gagarin', 'Neil Armstrong', 'Buzz Aldrin', 'John Glenn'],
      answer: 1,
      fact: 'Neil Armstrong became the first person to walk on the Moon in 1969.'
    },
    {
      q: 'The pyramids of Giza are located in which country?',
      options: ['India', 'Egypt', 'Greece', 'Mexico'],
      answer: 1,
      fact: 'The Great Pyramid of Giza is located near Cairo, Egypt.'
    },
    {
      q: 'Which ancient civilization developed democracy in Athens?',
      options: ['Romans', 'Greeks', 'Persians', 'Vikings'],
      answer: 1,
      fact: 'Ancient Athens developed an early form of democracy.'
    },
    {
      q: 'Who wrote the Indian national anthem?',
      options: [
        'Mahatma Gandhi',
        'Rabindranath Tagore',
        'Subhas Chandra Bose',
        'Jawaharlal Nehru'
      ],
      answer: 1,
      fact: 'Rabindranath Tagore wrote Jana Gana Mana.'
    },
    {
      q: 'Which famous wall was built in ancient China?',
      options: [
        'Berlin Wall',
        'Great Wall of China',
        'Hadrian’s Wall',
        'Western Wall'
      ],
      answer: 1,
      fact: 'The Great Wall is a historic series of fortifications across northern China.'
    }
  ],

  Nature: [
    {
      q: 'Which is the largest land animal?',
      options: ['Giraffe', 'African elephant', 'Rhino', 'Hippo'],
      answer: 1,
      fact: 'The African elephant is the largest living land animal.'
    },
    {
      q: 'What process do plants use to make food using sunlight?',
      options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'],
      answer: 1,
      fact: 'Photosynthesis converts light energy into chemical energy stored in food.'
    },
    {
      q: 'Which animal is known for changing its color for camouflage?',
      options: ['Chameleon', 'Elephant', 'Penguin', 'Horse'],
      answer: 0,
      fact: 'Chameleons can change their coloration for communication and camouflage.'
    },
    {
      q: 'What is the fastest land animal?',
      options: ['Lion', 'Cheetah', 'Horse', 'Leopard'],
      answer: 1,
      fact: 'The cheetah is the fastest land animal.'
    },
    {
      q: 'Which part of a plant usually absorbs water from the soil?',
      options: ['Flower', 'Leaf', 'Root', 'Fruit'],
      answer: 2,
      fact: 'Roots absorb water and minerals from the soil.'
    }
  ]
}

const categories = Object.keys(questions)

const allQuestions = Object.values(questions).flat()

export default function KnowledgeBoost() {
  const [category, setCategory] = useState(null)
  const [quiz, setQuiz] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [finished, setFinished] = useState(false)

  function startQuiz(selectedCategory) {
    let selectedQuestions =
      selectedCategory === 'Random Mix'
        ? [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 5)
        : questions[selectedCategory]

    setCategory(selectedCategory)
    setQuiz(selectedQuestions)
    setCurrent(0)
    setScore(0)
    setSelected(null)
    setAnswered(false)
    setFinished(false)
  }

  function chooseAnswer(index) {
    if (answered) return

    setSelected(index)
    setAnswered(true)

    if (index === quiz[current].answer) {
      setScore(prev => prev + 1)
    }
  }

  function nextQuestion() {
    if (current === quiz.length - 1) {
      setFinished(true)
      return
    }

    setCurrent(prev => prev + 1)
    setSelected(null)
    setAnswered(false)
  }

  function restart() {
    setCategory(null)
    setQuiz([])
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setAnswered(false)
    setFinished(false)
  }

  return (
    <div
      className="flex min-h-screen"
      style={{
        background:
          'linear-gradient(135deg, #060d1f 0%, #0a1628 50%, #0d1f3a 100%)'
      }}
    >
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="max-w-4xl mx-auto">

          <Link
            to="/patient/dashboard"
            className="inline-flex items-center gap-2 text-sm mb-8"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          {!category && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-10">
                <div className="text-5xl mb-4">🌱</div>

                <h1
                  className="text-3xl font-black text-white mb-3"
                  style={{ fontFamily: 'Poppins,sans-serif' }}
                >
                  Nirvana Knowledge Boost
                </h1>

                <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Take a tiny break and discover something interesting.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...categories, 'Random Mix'].map((item, index) => (
                  <motion.button
                    key={item}
                    onClick={() => startQuiz(item)}
                    className="p-5 rounded-2xl text-left"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                    whileHover={{
                      scale: 1.03,
                      y: -3,
                      borderColor: 'rgba(58,175,169,0.5)'
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="text-2xl mb-3">
                      {['🌍', '🔬', '🧠', '💻', '🎬', '🏛️', '🌱', '🎯'][index]}
                    </div>

                    <div className="text-sm font-semibold text-white">
                      {item}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {category && !finished && quiz.length > 0 && (
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: '#3AAFA9' }}
                  >
                    {category}
                  </p>

                  <h2 className="text-2xl font-bold text-white">
                    Question {current + 1}/5
                  </h2>
                </div>

                <div
                  className="px-4 py-2 rounded-xl text-sm font-bold"
                  style={{
                    background: 'rgba(58,175,169,0.12)',
                    color: '#3AAFA9'
                  }}
                >
                  Score: {score}
                </div>
              </div>

              <div
                className="rounded-3xl p-8"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <h3 className="text-xl font-bold text-white mb-7">
                  {quiz[current].q}
                </h3>

                <div className="space-y-3">
                  {quiz[current].options.map((option, index) => {
                    const isCorrect = index === quiz[current].answer
                    const isSelected = index === selected

                    let border = 'rgba(255,255,255,0.08)'
                    let background = 'rgba(255,255,255,0.04)'

                    if (answered && isCorrect) {
                      border = 'rgba(74,222,128,0.6)'
                      background = 'rgba(74,222,128,0.12)'
                    } else if (answered && isSelected) {
                      border = 'rgba(248,113,113,0.6)'
                      background = 'rgba(248,113,113,0.12)'
                    }

                    return (
                      <motion.button
                        key={option}
                        onClick={() => chooseAnswer(index)}
                        className="w-full text-left p-4 rounded-2xl flex items-center gap-4"
                        style={{ background, border: `1px solid ${border}` }}
                        whileHover={!answered ? { scale: 1.01 } : {}}
                      >
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{
                            background: 'rgba(58,175,169,0.12)',
                            color: '#3AAFA9'
                          }}
                        >
                          {String.fromCharCode(65 + index)}
                        </span>

                        <span className="text-sm text-white">
                          {option}
                        </span>

                        {answered && isCorrect && (
                          <CheckCircle
                            size={18}
                            className="ml-auto text-green-400"
                          />
                        )}

                        {answered && isSelected && !isCorrect && (
                          <XCircle
                            size={18}
                            className="ml-auto text-red-400"
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-2xl p-5"
                    style={{
                      background:
                        selected === quiz[current].answer
                          ? 'rgba(74,222,128,0.08)'
                          : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <p className="font-bold text-white mb-1">
                      {selected === quiz[current].answer
                        ? '✨ Correct!'
                        : '💡 Good try!'}
                    </p>

                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                      {quiz[current].fact}
                    </p>

                    {selected === quiz[current].answer && (
                      <p
                        className="text-sm font-bold mt-3"
                        style={{ color: '#3AAFA9' }}
                      >
                        +10 Knowledge Points
                      </p>
                    )}
                  </motion.div>
                )}

                {answered && (
                  <motion.button
                    onClick={nextQuestion}
                    className="w-full mt-6 py-3 rounded-xl text-sm font-bold text-white"
                    style={{
                      background:
                        'linear-gradient(135deg, #2E8B57, #3AAFA9)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {current === quiz.length - 1
                      ? 'See My Results →'
                      : 'Next Question →'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {finished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center rounded-3xl p-10"
              style={{
                background:
                  'linear-gradient(135deg, rgba(46,139,87,0.15), rgba(58,175,169,0.1))',
                border: '1px solid rgba(58,175,169,0.2)'
              }}
            >
              <div className="text-5xl mb-5">🌟</div>

              <h1
                className="text-3xl font-black text-white mb-3"
                style={{ fontFamily: 'Poppins,sans-serif' }}
              >
                Knowledge Boost Complete!
              </h1>

              <div className="text-5xl font-black mb-3" style={{ color: '#3AAFA9' }}>
                {score}/5
              </div>

              <p
                className="text-sm mb-2"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                You learned {score} new facts today.
              </p>

              <p
                className="text-sm italic mb-8"
                style={{ color: '#a8d8c8' }}
              >
                “Curiosity is a small step too. 🌱”
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => startQuiz(category)}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white"
                  style={{
                    background:
                      'linear-gradient(135deg, #2E8B57, #3AAFA9)'
                  }}
                >
                  Try Again
                </button>

                <button
                  onClick={restart}
                  className="px-6 py-3 rounded-xl text-sm font-bold"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  Choose Category
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}