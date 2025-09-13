/// <reference path="./deno.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.2.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Flashcard {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Quiz {
  question: string;
  options: string[];
  correct: number;
}

interface AnalysisResult {
  flashcards: Flashcard[];
  quizzes: Quiz[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables')
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const { pdfData, pdfName, userId } = await req.json() as { pdfData: string; pdfName: string; userId: string }

    if (!pdfData || !pdfName || !userId) {
      throw new Error('Missing required parameters: pdfData, pdfName, userId')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const prompt = `Analyze this PDF file and generate educational content.

    Generate exactly 5 flashcards as a JSON array with this structure:
    [{"question": "string", "answer": "string", "difficulty": "easy|medium|hard"}]

    Also generate exactly 3 multiple-choice quizzes as a JSON array with this structure:
    [{"question": "string", "options": ["option1", "option2", "option3", "option4"], "correct": 0-3}]

    Make sure the content is educational and relevant to the PDF content. 
    Vary the difficulty levels appropriately.
    Output ONLY valid JSON, no other text.`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: pdfData,
          mimeType: 'application/pdf'
        }
      }
    ])

    const response = await result.response
    const text = response.text()

    let analysisResult: AnalysisResult
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analysisResult = JSON.parse(cleanText)
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
      console.error('Raw response:', text)
      throw new Error('Failed to parse response as JSON')
    }

    if (!analysisResult.flashcards || !Array.isArray(analysisResult.flashcards) ||
        !analysisResult.quizzes || !Array.isArray(analysisResult.quizzes)) {
      throw new Error('Invalid response structure')
    }

    const flashcardInserts = analysisResult.flashcards.map((card: Flashcard) => ({
      user_id: userId,
      pdf_name: pdfName,
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty,
      created_at: new Date().toISOString()
    }))

    const { error: flashcardError } = await supabase
      .from('flashcards')
      .insert(flashcardInserts)

    if (flashcardError) {
      console.error('Error inserting flashcards:', flashcardError)
      throw new Error('Failed to save flashcards to database')
    }

    const quizInserts = analysisResult.quizzes.map((quiz: Quiz) => ({
      user_id: userId,
      pdf_name: pdfName,
      question: quiz.question,
      options: quiz.options,
      correct: quiz.correct,
      created_at: new Date().toISOString()
    }))

    const { error: quizError } = await supabase
      .from('quizzes')
      .insert(quizInserts)

    if (quizError) {
      console.error('Error inserting quizzes:', quizError)
      throw new Error('Failed to save quizzes to database')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'PDF analyzed successfully',
        flashcards: analysisResult.flashcards,
        quizzes: analysisResult.quizzes
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in analyze-pdf function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An error occurred while analyzing the PDF'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

