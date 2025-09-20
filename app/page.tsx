"use client"

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import { Send, User, Briefcase, Calendar, CheckCircle, ChevronLeft, ChevronRight, Home } from 'lucide-react';

const TemperamentTest = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Rating options with values
  const ratingOptions = [
    { label: 'Sure!', value: 5, color: 'text-green-700', bgColor: 'bg-green-100' },
    { label: 'Maybe', value: 4, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: '50-50', value: 3, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { label: 'Maybe Not', value: 2, color: 'text-red-600', bgColor: 'bg-red-50' },
    { label: 'Nope!', value: 1, color: 'text-red-700', bgColor: 'bg-red-100' }
  ];

  const temperaments = {
    choleric: {
      name: 'Choleric (The Leader)',
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      icon: '🔴',
      questions: [
        "I like to take charge in group settings.",
        "I make quick decisions and usually stick to them.",
        "I get frustrated when things move too slowly.",
        "I enjoy setting goals and achieving them.",
        "I naturally find myself leading even without trying.",
        "I prefer results over excuses.",
        "I can be competitive in both work and play.",
        "I'm confident in my ideas and express them easily.",
        "People sometimes say I'm bossy or too direct.",
        "I prefer action to long discussions.",
        "I like challenges and hate being idle.",
        "I get impatient with inefficiency."
      ]
    },
    sanguine: {
      name: 'Sanguine (The Socializer)',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      icon: '🟡',
      questions: [
        "I love meeting new people and making friends easily.",
        "I often tell stories or jokes to entertain others.",
        "I'm optimistic and usually see the bright side of life.",
        "I thrive in group activities and social gatherings.",
        "I sometimes talk more than I should.",
        "I love spontaneous plans and adventures.",
        "I get bored with routines or repetitive tasks.",
        "I find it easy to encourage and uplift people.",
        "I can be forgetful with details or responsibilities.",
        "I'm naturally expressive with gestures and emotions.",
        "People often describe me as fun or full of energy.",
        "I enjoy being the \"life of the party.\""
      ]
    },
    phlegmatic: {
      name: 'Phlegmatic (The Peacemaker)',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      icon: '🟢',
      questions: [
        "I avoid conflict and try to keep peace with others.",
        "I'm dependable; people know they can count on me.",
        "I prefer calm and stability over drama or change.",
        "I'm a good listener and people often confide in me.",
        "I don't rush decisions; I like to think things through.",
        "I'm patient even when others are difficult.",
        "I'd rather follow instructions than lead.",
        "I adapt easily to different situations.",
        "I value harmony in relationships and at work.",
        "I'm not easily angered; I usually stay calm.",
        "I can procrastinate or avoid taking initiative.",
        "People sometimes describe me as too laid-back."
      ]
    },
    melancholic: {
      name: 'Melancholic (The Thinker)',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      icon: '🔵',
      questions: [
        "I like things to be organized and in order.",
        "I often think deeply before making decisions.",
        "I pay attention to details others may overlook.",
        "I have high standards for myself and others.",
        "I prefer planning over taking risks.",
        "I can be critical of mistakes or imperfections.",
        "I value honesty, loyalty, and commitment.",
        "I sometimes overthink or worry too much.",
        "I prefer quality over quantity in friendships.",
        "I'm comfortable working alone and focusing deeply.",
        "I can be reserved in new or unfamiliar settings.",
        "I strive for excellence in whatever I do."
      ]
    }
  };

  // Create randomized questions with temperament mapping
  const randomizedQuestions = useMemo(() => {
    const allQuestions: Array<{
      question: string;
      temperament: string;
      originalIndex: number;
      id: string;
    }> = [];

    Object.entries(temperaments).forEach(([temperamentKey, temperament]) => {
      temperament.questions.forEach((question, index) => {
        allQuestions.push({
          question,
          temperament: temperamentKey,
          originalIndex: index,
          id: `${temperamentKey}_${index}`
        });
      });
    });

    // Shuffle the questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled;
  }, []);

  // Split questions into pages (6 questions per page)
  const questionsPerPage = 6;
  const questionPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < randomizedQuestions.length; i += questionsPerPage) {
      pages.push(randomizedQuestions.slice(i, i + questionsPerPage));
    }
    return pages;
  }, [randomizedQuestions]);

  const totalPages = questionPages.length + 1; // +1 for the form page

  const handleInputChange = (field: any, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScores = () => {
    const scores: { [key in keyof typeof temperaments]: number } = {
      choleric: 0,
      sanguine: 0,
      phlegmatic: 0,
      melancholic: 0
    };
    
    const percentages: { [key in keyof typeof temperaments]: number } = {
      choleric: 0,
      sanguine: 0,
      phlegmatic: 0,
      melancholic: 0
    };

    // Calculate scores based on answers
    randomizedQuestions.forEach((q) => {
      const answer = answers[q.id] || 0;
      scores[q.temperament as keyof typeof temperaments] += answer;
    });

    // Calculate percentages (max possible score is 12 questions × 5 points = 60)
    (Object.keys(temperaments) as Array<keyof typeof temperaments>).forEach((temperament) => {
      percentages[temperament] = Math.round((scores[temperament] / 60) * 100);
    });
    
    return { scores, percentages };
  };

  const getResults = () => {
    const { scores, percentages } = calculateScores();
    const sortedPercentages = Object.entries(percentages).sort(([,a], [,b]) => b - a);
    
    return {
      dominant: {
        type: sortedPercentages[0][0],
        score: scores[sortedPercentages[0][0] as keyof typeof temperaments],
        percentage: sortedPercentages[0][1],
        name: temperaments[sortedPercentages[0][0] as keyof typeof temperaments].name
      },
      secondary: {
        type: sortedPercentages[1][0],
        score: scores[sortedPercentages[1][0] as keyof typeof temperaments],
        percentage: sortedPercentages[1][1],
        name: temperaments[sortedPercentages[1][0] as keyof typeof temperaments].name
      },
      allScores: scores,
      allPercentages: percentages
    };
  };

  const sendToWhatsApp = () => {
    const results = getResults();
    const message = `🧠 TEMPERAMENT TEST RESULTS

👤 Name: ${formData.name}
💼 Job Title: ${formData.jobTitle}
📅 Date: ${formData.date}

📊 DETAILED SCORES:
${temperaments.choleric.icon} Choleric (Leader): ${results.allPercentages.choleric}% (${results.allScores.choleric}/60 points)
${temperaments.sanguine.icon} Sanguine (Socializer): ${results.allPercentages.sanguine}% (${results.allScores.sanguine}/60 points)
${temperaments.phlegmatic.icon} Phlegmatic (Peacemaker): ${results.allPercentages.phlegmatic}% (${results.allScores.phlegmatic}/60 points)
${temperaments.melancholic.icon} Melancholic (Thinker): ${results.allPercentages.melancholic}% (${results.allScores.melancholic}/60 points)

🎯 PRIMARY TEMPERAMENT: ${results.dominant.name} - ${results.dominant.percentage}%
🎯 SECONDARY TEMPERAMENT: ${results.secondary.name} - ${results.secondary.percentage}%

💡 Remember: No temperament is "better" or "worse." Each has strengths and weaknesses. The goal is self-awareness and learning how to balance your traits.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Check if all questions are answered
  const allQuestionsAnswered = randomizedQuestions.every(q => answers[q.id] > 0);
  
  const isFormValid = formData.name && formData.jobTitle && whatsappNumber;

  const canProceedFromForm = isFormValid;
  const canShowResults = allQuestionsAnswered && isFormValid;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (canShowResults) {
      setShowResults(true);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const getCurrentPageQuestions = () => {
    if (currentPage === 0) return [];
    return questionPages[currentPage - 1] || [];
  };

  const getPageProgress = () => {
    if (currentPage === 0) return canProceedFromForm ? 100 : 0;
    
    const pageQuestions = getCurrentPageQuestions();
    const answeredCount = pageQuestions.filter(q => answers[q.id] > 0).length;
    return (answeredCount / pageQuestions.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {!showResults ? (
          <>
            {/* Header with Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  TEMPERAMENT TEST
                </h1>
                <div className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                ></div>
              </div>

              {/* Page Progress */}
              <div className="w-full bg-gray-200 rounded-full h-1 mb-6">
                <div
                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${getPageProgress()}%` }}
                ></div>
              </div>

              {/* Page Indicators */}
              <div className="flex justify-center space-x-2 mb-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === currentPage
                        ? 'bg-purple-600'
                        : i < currentPage
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-lg p-8 min-h-[500px]">
              {currentPage === 0 ? (
                // Personal Information Page
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Personal Information</h2>
                    <p className="text-gray-600">Please fill in your details to get started.</p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
                      />
                    </div>
                    
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Job Title / Position"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
                      />
                    </div>
                    
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        placeholder="WhatsApp Number (with country code, e.g., +1234567890)"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                        focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 text-gray-700"
                      />
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">Test Instructions</h3>
                      <ul className="text-blue-700 space-y-2 text-sm">
                        <li>• You&apos;ll answer 48 questions about your natural personality</li>
                        <li>• Questions are randomly mixed - don&apos;t look for patterns</li>
                        <li>• Rate each statement honestly from &quot;Sure!&quot; to &quot;Nope!&quot;</li>
                        <li>• Think about your natural self, not who you want to be</li>
                        <li>• There are no right or wrong answers</li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                // Question Pages
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Questions {((currentPage - 1) * questionsPerPage) + 1} - {Math.min(currentPage * questionsPerPage, randomizedQuestions.length)}
                    </h2>
                    <p className="text-gray-600">Rate how much each statement describes your natural self</p>
                  </div>

                  {/* Rating Scale Legend */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {ratingOptions.map((option) => (
                        <div key={option.value} className={`${option.bgColor} px-3 py-1 rounded-full border`}>
                          <span className={`${option.color} font-medium text-sm`}>
                            {option.label} ({option.value})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-6">
                    {getCurrentPageQuestions().map((q, index) => (
                      <div key={q.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4 mb-3">
                          <span className="text-sm font-medium text-gray-500 mt-1 min-w-[24px]">
                            {((currentPage - 1) * questionsPerPage) + index + 1}.
                          </span>
                          <p className="text-gray-700 flex-1 font-medium">{q.question}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-8">
                          {ratingOptions.map((option) => (
                            <label key={option.value} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name={q.id}
                                value={option.value}
                                checked={answers[q.id] === option.value}
                                onChange={() => handleAnswerChange(q.id, option.value)}
                                className="mr-2 text-blue-600 focus:ring-blue-500"
                              />
                              <span className={`${option.color} font-medium text-sm px-2 py-1 rounded ${option.bgColor}`}>
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold
                hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>

              <button
                onClick={() => setCurrentPage(0)}
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
              >
                <Home className="w-4 h-4 mr-1" />
                Start
              </button>

              <button
                onClick={goToNextPage}
                disabled={
                  (currentPage === 0 && !canProceedFromForm) ||
                  (currentPage > 0 && getPageProgress() < 100)
                }
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold
                hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {currentPage === totalPages - 1 ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    See Results
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          // Results Page
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              ✅ Your Temperament Results
            </h2>
            
            {(() => {
              const results = getResults();
              return (
                <div className="space-y-6">
                  {/* Scores Summary */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(results.allPercentages).map(([type, percentage]) => {
                      const temperament = temperaments[type as keyof typeof temperaments];
                      const score = results.allScores[type as keyof typeof results.allScores];
                      return (
                        <div key={type} className={`${temperament.bgColor} ${temperament.borderColor} border rounded-lg p-4`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{temperament.icon}</span>
                              <span className={`font-semibold ${temperament.textColor}`}>
                                {temperament.name}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${temperament.textColor}`}>
                                {percentage}%
                              </div>
                              <div className="text-sm text-gray-600">
                                ({score}/60 points)
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`${temperament.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Primary Results */}
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Your Temperament Blend</h3>
                      <p className="text-lg mb-2">
                        <strong>Primary:</strong> {results.dominant.name} - {results.dominant.percentage}%
                      </p>
                      <p className="text-lg mb-4">
                        <strong>Secondary:</strong> {results.secondary.name} - {results.secondary.percentage}%
                      </p>
                      <p className="text-sm text-gray-600">
                        Remember: No temperament is &quot;better&quot; or &quot;worse.&quot; Each 
                        has strengths and weaknesses. The goal is self-awareness and learning 
                        how to balance your traits. Higher percentages indicate stronger tendencies 
                        in that temperament style.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={sendToWhatsApp}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      <Send className="inline-block w-5 h-5 mr-2" />
                      Send to WhatsApp
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowResults(false);
                        setCurrentPage(0);
                        setAnswers({});
                        setFormData({
                          name: '',
                          jobTitle: '',
                          date: new Date().toISOString().split('T')[0]
                        });
                        setWhatsappNumber('');
                      }}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      Take Again
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemperamentTest;
