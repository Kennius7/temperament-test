
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from 'react';
import { Send, User, Briefcase, Calendar, CheckCircle } from 'lucide-react';

const TemperamentTest = () => {
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Changed to store numeric values (1-5) instead of boolean
  const [answers, setAnswers] = useState({
    choleric: Array(12).fill(0),
    sanguine: Array(12).fill(0),
    phlegmatic: Array(12).fill(0),
    melancholic: Array(12).fill(0)
  });

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

  const handleInputChange = (field: any, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnswerChange = (temperament: any, questionIndex: any, value: any) => {
    setAnswers((prev: any) => ({
      ...prev,
      [temperament]: prev[temperament].map((answer: any, index: any) => 
        index === questionIndex ? value : answer
      )
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

    (Object.keys(temperaments) as Array<keyof typeof temperaments>).forEach((temperament) => {
      // Sum all ratings for this temperament
      const totalScore = answers[temperament].reduce((sum: number, rating: number) => sum + rating, 0);
      scores[temperament] = totalScore;
      
      // Calculate percentage (max possible score is 12 questions × 5 points = 60)
      percentages[temperament] = Math.round((totalScore / 60) * 100);
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

  const handleSubmit = () => {
    setShowResults(true);
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
  const allQuestionsAnswered = Object.values(answers).every(temperamentAnswers => 
    temperamentAnswers.every(answer => answer > 0)
  );
  
  const isFormValid = formData.name && formData.jobTitle && whatsappNumber && allQuestionsAnswered;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            TEMPERAMENT TEST
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Instructions</h2>
            <ul className="text-blue-700 space-y-2">
              <li>• Read each statement carefully.</li>
              <li>• Rate how much each statement describes your natural self (not what you wish you were).</li>
              <li>• Use the 5-point scale: <strong>Sure</strong> (definitely me) to <strong>Nope</strong> (definitely not me).</li>
              <li>• Your highest percentage = your dominant temperament.</li>
              <li>• Your second-highest percentage = your secondary temperament.</li>
              <li>• Remember: most people are a blend of multiple temperaments!</li>
            </ul>
          </div>

          {/* Rating Scale Legend */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Rating Scale:</h3>
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

          {/* Personal Information Form */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Name"
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
                placeholder="Job Title"
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
                placeholder="Today's date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700
                focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* WhatsApp Number */}
          <div className="mb-6">
            <input
              type="tel"
              placeholder="WhatsApp Number (with country code, e.g., +1234567890)"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
              focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 text-gray-700"
            />
          </div>
        </div>

        {/* Questions */}
        {Object.entries(temperaments).map(([temperamentKey, temperament]) => (
          <div key={temperamentKey} className={`bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 ${temperament.borderColor}`}>
            <h2 className={`text-2xl font-bold mb-6 ${temperament.textColor} flex items-center`}>
              <span className="text-2xl mr-3">{temperament.icon}</span>
              {temperament.name}
            </h2>
            <div className="space-y-6">
              {temperament.questions.map((question, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4 mb-3">
                    <span className="text-sm font-medium text-gray-500 mt-1 min-w-[24px]">
                      {index + 1}.
                    </span>
                    <p className="text-gray-700 flex-1 font-medium">{question}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-8">
                    {ratingOptions.map((option) => (
                      <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`${temperamentKey}_${index}`}
                          value={option.value}
                          checked={answers[temperamentKey as keyof typeof answers][index] === option.value}
                          onChange={() => handleAnswerChange(temperamentKey, index, option.value)}
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
          </div>
        ))}

        {/* Submit Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            <CheckCircle className="inline-block w-5 h-5 mr-2" />
            Calculate Results
          </button>
          {!allQuestionsAnswered && (
            <p className="text-red-600 text-sm mt-2">Please answer all questions before calculating results.</p>
          )}
        </div>

        {/* Results */}
        {showResults && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              ✅ Your Results
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

                  {/* Send to WhatsApp */}
                  <div className="text-center">
                    <button
                      onClick={sendToWhatsApp}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      <Send className="inline-block w-5 h-5 mr-2" />
                      Send Results to WhatsApp
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
